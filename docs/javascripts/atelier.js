/* Manuel HTML — atelier « Mon site » : l'étudiant construit son site en 7 étapes.
   Disposition : guide à gauche (frise, consigne, vérification), travail à droite (onglets, éditeur, rendu).
   Données : pages et images dans MH.Dossier ; méta du projet dans le stockage local (mh:projet). */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  const CLE = "projet", BROUILLON = "brouillon";
  const lireMeta = () => { try { return JSON.parse(MH.store.get(CLE) || "null"); } catch (e) { return null; } };
  const ecrireMeta = (m) => MH.store.set(CLE, JSON.stringify(m));

  // Disponible partout (accueil, chapitres) : état résumé du projet.
  MH.atelier = {
    etat() {
      const m = lireMeta();
      return m ? { nom: m.nom, reussies: (m.etapesReussies || []).length } : null;
    },
  };

  // Texte de consigne : `<BALISE>` entre accents graves devient du code, le reste est échappé.
  const enCode = (t) => MH.esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");

  function demarrer(racine) {
    if (racine.dataset.vu) return;
    racine.dataset.vu = "1";
    MH.Dossier.ready.then(() => {
      // Un brouillon resté en mémoire (page quittée avant la sauvegarde) est récupéré.
      const b = (() => { try { return JSON.parse(MH.store.get(BROUILLON) || "null"); } catch (e) { return null; } })();
      const suite = b && b.chemin ? MH.Dossier.ecrire(b.chemin, b.texte) : Promise.resolve();
      suite.then(() => {
        MH.store.del(BROUILLON);
        const meta = lireMeta();
        if (meta && meta.base) atelier(racine, meta); else depart(racine);
      });
    });
  }

  /* ---------- Écran de départ : nom du site et modèle ---------- */

  function depart(racine) {
    const { el, esc } = MH;
    racine.innerHTML = "";
    const f = el("form", "atelier-depart");
    f.innerHTML =
      "<h2>Construis ton site, étape par étape</h2>" +
      "<p>Tu vas créer un vrai site de plusieurs pages, avec tout ce que tu apprends dans le cours : texte, listes, liens, images, tableau et style. Chaque étape se vérifie toute seule pendant que tu tapes. À la fin, tu télécharges ton site pour l'ouvrir dans VS Code.</p>" +
      '<label class="atelier-champ"><span>Nom de ton site</span><input name="nom" required maxlength="60" placeholder="Par exemple : Club Info UAM"></label>' +
      '<fieldset class="atelier-modeles"><legend>Choisis un point de départ</legend>' +
      MH.projet.MODELES.map((m, i) =>
        '<label class="atelier-modele"><input type="radio" name="modele" value="' + m.id + '"' + (i === 0 ? " checked" : "") + ">" +
        "<span><b>" + esc(m.nom) + "</b><small>" + esc(m.description) + "</small><code>" + m.pages.map(esc).join(" · ") + "</code></span></label>").join("") +
      "</fieldset>" +
      '<button type="submit" class="md-button md-button--primary">Créer mon site</button>';
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nom = f.nom.value.trim() || "Mon site";
      const modele = MH.projet.MODELES.find((m) => m.id === f.modele.value) || MH.projet.MODELES[0];
      for (let i = 0; i < 3; i++) {
        if (MH.Dossier.lire(modele.pages[i]) == null) await MH.Dossier.ecrire(modele.pages[i], modele.squelette(nom, modele.roles[i]));
      }
      const meta = { version: 1, nom, modele: modele.id, base: modele.pages.slice(), etapesReussies: [], ouverts: modele.pages.slice(), actif: modele.pages[0] };
      ecrireMeta(meta);
      atelier(racine, meta);
    });
    racine.append(f);
  }

  /* ---------- L'atelier ---------- */

  function atelier(racine, meta) {
    const { el, esc, ICON } = MH;
    racine.innerHTML = "";
    const app = el("div", "atelier-app");

    // Barre du haut
    const barre = el("header", "atelier-barre");
    const nom = el("b", "atelier-nom", esc(meta.nom));
    const statut = el("span", "atelier-statut", "Enregistré");
    statut.setAttribute("role", "status");
    const outils = el("span", "atelier-outils");
    const menuBtn = el("button", "md-button atelier-menu-btn", "⋯");
    menuBtn.type = "button"; menuBtn.setAttribute("aria-label", "Plus d'actions"); menuBtn.setAttribute("aria-haspopup", "true");
    const menu = el("div", "atelier-menu"); menu.hidden = true;
    const recommencer = el("button", "", "Recommencer le projet");
    recommencer.type = "button";
    menu.append(recommencer);
    outils.append(menuBtn, menu);
    barre.append(nom, statut, outils);

    const bandeaux = el("div", "atelier-bandeaux");
    const bandeauOnglet = el("div", "atelier-bandeau atelier-bandeau-onglet", "<span>L'atelier a été modifié dans un autre onglet. Recharge la page pour ne pas écraser ton travail.</span>");
    const btnRecharger = el("button", "md-button", "Recharger"); btnRecharger.type = "button";
    bandeauOnglet.append(btnRecharger); bandeauOnglet.hidden = true;
    bandeaux.append(bandeauOnglet);
    if (!MH.Dossier.persistant) bandeaux.append(el("div", "atelier-bandeau", "Ton navigateur ne garde pas les fichiers (navigation privée ?) : ton travail sera perdu en fermant la page. Télécharge ton site régulièrement."));

    // Guide
    const guide = el("section", "atelier-guide");
    guide.setAttribute("aria-label", "Consigne de l'étape");
    const frise = el("ol", "atelier-frise");
    const titre = el("h2", "atelier-etape-titre");
    const consigne = el("p", "atelier-consigne");
    const revoir = el("a", "atelier-revoir");
    const checks = el("ul", "atelier-checks"); checks.setAttribute("aria-live", "polite");
    const exemple = el("details", "atelier-exemple");
    const suivante = el("button", "md-button md-button--primary atelier-suivante", "Étape suivante"); suivante.type = "button";
    guide.append(frise, titre, consigne, revoir, checks, suivante, exemple);

    // Travail
    const travail = el("section", "atelier-travail");
    travail.setAttribute("aria-label", "Ton site");
    const onglets = el("div", "atelier-onglets"); onglets.setAttribute("role", "tablist");
    const zoneEditeur = el("div", "atelier-editeur");
    travail.append(onglets, zoneEditeur);

    app.append(barre, bandeaux, el("div", "atelier-corps"));
    app.lastChild.append(guide, travail);
    racine.append(app);

    /* --- état --- */
    let actif = meta.base.includes(meta.actif) || MH.Dossier.lire(meta.actif) != null ? meta.actif : meta.base[0];
    let etapeVue = 1, chargement = false, enAttente = false, dernierRes = null;
    const sauverMeta = () => { meta.actif = actif; ecrireMeta(meta); };

    const apercu = MH.makePreview({
      site: true, page: actif, maxHeight: 2000,
      onNavigate: (c) => { if (MH.Dossier.lire(c) != null && c !== actif) ouvrirFichier(c, true); },
    });
    const editeur = MH.makeEditor(MH.Dossier.lire(actif) || "", (v) => {
      if (chargement) return;
      enAttente = true;
      statut.textContent = "Enregistrement…";
      if (apercu.page === actif) apercu.render(v);
      sauverPlusTard();
      evaluerPlusTard();
    }, "Code de la page");
    zoneEditeur.append(editeur.node);
    travail.append(apercu.node);

    const sauver = () => {
      if (!enAttente) return Promise.resolve();
      enAttente = false;
      const chemin = actif, texte = editeur.value;
      return MH.Dossier.ecrire(chemin, texte).then((ok) => {
        statut.textContent = ok || !MH.Dossier.persistant ? "Enregistré" : "Stockage plein : télécharge ton site";
      });
    };
    const sauverPlusTard = MH.debounce(sauver, 500);

    function dessinerOnglets() {
      onglets.innerHTML = "";
      meta.ouverts.filter((c) => MH.Dossier.lire(c) != null).forEach((c) => {
        const o = el("button", "atelier-onglet" + (c === actif ? " actif" : ""), esc(c));
        o.type = "button"; o.dataset.chemin = c;
        o.setAttribute("role", "tab"); o.setAttribute("aria-selected", String(c === actif));
        o.addEventListener("click", () => ouvrirFichier(c));
        onglets.append(o);
      });
    }

    function ouvrirFichier(chemin, depuisApercu) {
      if (enAttente) sauver();
      actif = chemin;
      if (!meta.ouverts.includes(chemin)) meta.ouverts.push(chemin);
      chargement = true;
      editeur.value = MH.Dossier.lire(chemin) || "";
      chargement = false;
      if (!depuisApercu && /\.html?$/i.test(chemin)) apercu.ouvrir(chemin, true);
      sauverMeta();
      dessinerOnglets();
    }

    /* --- vérification --- */
    function evaluer() {
      const textes = {};
      MH.Dossier.list({ type: "texte" }).forEach((f) => { textes[f.path] = f.texte; });
      if (enAttente) textes[actif] = editeur.value;
      const site = MH.projet.analyser(textes, MH.Dossier.chemins(), meta.base);
      dernierRes = MH.projet.evaluer(site);
      let change = false;
      dernierRes.forEach((r) => { if (r.reussie && !meta.etapesReussies.includes(r.n)) { meta.etapesReussies.push(r.n); change = true; } });
      if (change) { meta.etapesReussies.sort(); sauverMeta(); }
      dessinerGuide();
    }
    const evaluerPlusTard = MH.debounce(evaluer, 150);

    function conseillee() {
      const r = MH.projet.ETAPES.find((e) => !meta.etapesReussies.includes(e.n));
      return r ? r.n : 7;
    }

    function dessinerGuide() {
      const e = MH.projet.ETAPES[etapeVue - 1];
      const res = dernierRes ? dernierRes[etapeVue - 1].resultats : e.checks.map(() => false);
      frise.innerHTML = "";
      MH.projet.ETAPES.forEach((x) => {
        const li = el("li");
        const b = el("button", "atelier-etape", String(x.n));
        b.type = "button"; b.dataset.n = String(x.n);
        b.title = x.n + ". " + x.titre;
        b.setAttribute("aria-label", "Étape " + x.n + " : " + x.titre + (meta.etapesReussies.includes(x.n) ? " (réussie)" : ""));
        if (meta.etapesReussies.includes(x.n)) b.classList.add("reussie");
        if (x.n === etapeVue) b.classList.add("vue");
        if (x.n === conseillee()) b.setAttribute("aria-current", "step");
        b.addEventListener("click", () => voirEtape(x.n));
        li.append(b); frise.append(li);
      });
      titre.textContent = "Étape " + e.n + " · " + e.titre;
      consigne.innerHTML = enCode(e.consigne);
      revoir.href = e.chapitre;
      revoir.textContent = "Revoir le chapitre " + (e.n + 1);
      checks.innerHTML = "";
      e.checks.forEach((c, i) => {
        const li = el("li", res[i] ? "ok" : "", '<span class="exo-ico">' + (res[i] ? ICON.check : ICON.dot) + "</span><span>" + enCode(c.label) + "</span>");
        li.dataset.id = c.id;
        checks.append(li);
      });
      exemple.innerHTML = "<summary>Voir un exemple</summary>";
      const pre = el("pre", "exo-sol-code"); pre.innerHTML = MH.highlight(e.exemple);
      exemple.append(el("p", "atelier-exemple-note", "Un extrait pour le site « Club Info UAM » : inspire-toi en l'adaptant à ton sujet."), pre);
      const toutOk = res.every(Boolean);
      suivante.hidden = !toutOk || e.n === 7;
    }

    function voirEtape(n) {
      etapeVue = Math.min(7, Math.max(1, n));
      dessinerGuide();
    }

    /* --- événements --- */
    suivante.addEventListener("click", () => voirEtape(etapeVue + 1));
    menuBtn.addEventListener("click", () => { menu.hidden = !menu.hidden; });
    recommencer.addEventListener("click", async () => {
      menu.hidden = true;
      if (!window.confirm("Recommencer le projet ? Tes pages seront effacées (tes images restent). Pense à télécharger ton site avant.")) return;
      for (const f of MH.Dossier.list({ type: "texte" })) MH.Dossier.remove(f.path);
      MH.store.del(CLE);
      racine.dataset.vu = ""; demarrer(racine);
    });
    btnRecharger.addEventListener("click", () => location.reload());
    const surStockage = (e) => { if (e.key === "mh:" + CLE && racine.isConnected) bandeauOnglet.hidden = false; };
    window.addEventListener("storage", surStockage);
    // Quitter la page : on garde tout de suite le texte non sauvegardé (sauvegarde synchrone de secours).
    const auDepart = () => {
      if (!enAttente) return;
      MH.store.set(BROUILLON, JSON.stringify({ chemin: actif, texte: editeur.value }));
      sauver();
    };
    window.addEventListener("pagehide", auDepart);
    const surHash = () => { const m = /^#etape-(\d)$/.exec(location.hash); if (m) voirEtape(+m[1]); };
    window.addEventListener("hashchange", surHash);
    const surDossier = () => { if (!racine.isConnected) { MH.Dossier.off(surDossier); return; } dessinerOnglets(); evaluerPlusTard(); };
    MH.Dossier.on(surDossier);
    if (window.document$ && window.document$.subscribe) {
      // Navigation instantanée : en quittant l'atelier, on sauvegarde et on se désabonne.
      const abo = window.document$.subscribe(() => {
        if (racine.isConnected) return;
        auDepart();
        window.removeEventListener("storage", surStockage);
        window.removeEventListener("pagehide", auDepart);
        window.removeEventListener("hashchange", surHash);
        if (abo && abo.unsubscribe) abo.unsubscribe();
      });
    }

    /* --- premier affichage --- */
    dessinerOnglets();
    apercu.ouvrir(actif);
    etapeVue = conseillee();
    surHash();
    evaluer();
  }

  function init() {
    const racine = document.querySelector(".md-content .atelier");
    if (racine && MH.projet && MH.Dossier) demarrer(racine);
  }
  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

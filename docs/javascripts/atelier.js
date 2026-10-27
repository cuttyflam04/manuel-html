/* Manuel HTML — atelier « Mon site » : l'étudiant construit son site en 7 étapes.
   Disposition : guide à gauche (frise, consigne, vérification), travail à droite (onglets, éditeur, rendu).
   Données : pages et images dans MH.Dossier ; méta du projet dans le stockage local (mh:projet). */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  const CLE = "projet", BROUILLON = "brouillon";
  const LIMITE_ZIP = 20 * 1024 * 1024, MAX_FICHIERS = 200;
  const TEXTE = /\.(html?|css)$/i, IMAGE = /\.(gif|jpe?g|png|webp|svg)$/i, PAGE = /\.html?$/i;
  const lireMeta = () => { try { return JSON.parse(MH.store.get(CLE) || "null"); } catch (e) { return null; } };
  const ecrireMeta = (m) => MH.store.set(CLE, JSON.stringify(m));
  const nettoyerNom = (p) => (p || "").replace(/\\/g, "/").replace(/^\.?\/+/, "").replace(/\/{2,}/g, "/").trim();
  const nomRisque = (n) => /\s/.test(n) || /[^\x00-\x7F]/.test(n);

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
      // Seulement s'il est encore à jour : si un fichier a été écrit depuis (autre onglet, autre visite), il est périmé.
      const suite = b && b.chemin && b.rev === MH.Dossier.rev() ? MH.Dossier.ecrire(b.chemin, b.texte) : Promise.resolve();
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

  function atelier(racine, meta, messageInitial) {
    const { el, esc, ICON } = MH;
    racine.innerHTML = "";
    const nettoyages = [];
    const ecouter = (cible, type, fn) => { cible.addEventListener(type, fn); nettoyages.push(() => cible.removeEventListener(type, fn)); };
    const app = el("div", "atelier-app");

    // Barre du haut : nom, état, importer, télécharger, menu
    const barre = el("header", "atelier-barre");
    const nom = el("b", "atelier-nom", esc(meta.nom));
    const statut = el("span", "atelier-statut", "Enregistré");
    statut.setAttribute("role", "status");
    const outils = el("span", "atelier-outils");
    const lblImport = el("label", "md-button dossier-ajout atelier-importer", ICON.folder + "<span>Importer un .zip</span>");
    const inpImport = el("input", "dossier-input");
    inpImport.type = "file"; inpImport.accept = ".zip,application/zip";
    inpImport.setAttribute("aria-label", "Importer un site au format .zip");
    lblImport.append(inpImport);
    const btnExport = el("button", "md-button md-button--primary atelier-exporter", "<span>Télécharger mon site</span>");
    btnExport.type = "button";
    const menuBtn = el("button", "md-button atelier-menu-btn", "⋯");
    menuBtn.type = "button"; menuBtn.setAttribute("aria-label", "Plus d'actions"); menuBtn.setAttribute("aria-haspopup", "true");
    const menu = el("div", "atelier-menu"); menu.hidden = true;
    const recommencer = el("button", "", "Recommencer le projet");
    recommencer.type = "button";
    menu.append(recommencer);
    outils.append(lblImport, btnExport, menuBtn, menu);
    barre.append(nom, statut, outils);

    const bandeaux = el("div", "atelier-bandeaux");
    const bandeauOnglet = el("div", "atelier-bandeau atelier-bandeau-onglet", "<span>L'atelier a été modifié dans un autre onglet. Recharge la page pour ne pas écraser ton travail.</span>");
    const btnRecharger = el("button", "md-button", "Recharger"); btnRecharger.type = "button";
    bandeauOnglet.append(btnRecharger); bandeauOnglet.hidden = true;
    bandeaux.append(bandeauOnglet);
    if (!MH.Dossier.persistant) bandeaux.append(el("div", "atelier-bandeau", "Ton navigateur ne garde pas les fichiers (navigation privée ?) : ton travail sera perdu en fermant la page. Télécharge ton site régulièrement."));
    const message = el("p", "atelier-message");
    message.setAttribute("role", "status");
    const dire = (t) => { message.textContent = t || ""; message.hidden = !t; };
    dire(messageInitial);

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

    // Travail : onglets, panneau Fichiers, éditeur, rendu
    const travail = el("section", "atelier-travail");
    travail.setAttribute("aria-label", "Ton site");
    const barreOnglets = el("div", "atelier-barre-onglets");
    const onglets = el("div", "atelier-onglets"); onglets.setAttribute("role", "tablist"); onglets.setAttribute("aria-label", "Fichiers ouverts");
    const btnFichiers = el("button", "md-button atelier-fichiers-btn", ICON.folder + "<span>Fichiers</span>");
    btnFichiers.type = "button"; btnFichiers.setAttribute("aria-expanded", "false");
    barreOnglets.append(onglets, btnFichiers);
    const panneau = el("div", "atelier-fichiers"); panneau.hidden = true;
    const zoneEditeur = el("div", "atelier-editeur");
    travail.append(barreOnglets, panneau, zoneEditeur);

    app.append(barre, bandeaux, message, el("div", "atelier-corps"));
    app.lastChild.append(guide, travail);
    // Téléphone : une seule vue à la fois, choisie dans une barre d'onglets en bas de l'écran.
    const navMobile = el("div", "atelier-mobile");
    navMobile.setAttribute("role", "tablist"); navMobile.setAttribute("aria-label", "Vue de l'atelier");
    const choisirVue = (v) => {
      app.dataset.vue = v;
      [...navMobile.children].forEach((b) => b.setAttribute("aria-selected", String(b.dataset.vue === v)));
    };
    [["consigne", "Consigne"], ["code", "Code"], ["rendu", "Rendu"]].forEach(([v, t]) => {
      const b = el("button", "atelier-mobile-btn", t);
      b.type = "button"; b.dataset.vue = v; b.setAttribute("role", "tab");
      b.addEventListener("click", () => choisirVue(v));
      navMobile.append(b);
    });
    app.append(navMobile);
    choisirVue("consigne");
    racine.append(app);

    /* --- état --- */
    let actif = MH.Dossier.lire(meta.actif) != null ? meta.actif : meta.base.find((c) => MH.Dossier.lire(c) != null) || meta.base[0];
    let etapeVue = 1, chargement = false, enAttente = false, dernierRes = null;
    // mort : cet atelier a été remplacé (import, recommencer) ; gele : un autre onglet a écrit, on n'écrit plus rien.
    let mort = false, gele = false;
    const sauverMeta = () => { if (mort || gele) return; meta.actif = actif; ecrireMeta(meta); };

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
    }, "Code du fichier ouvert");
    zoneEditeur.append(editeur.node);
    travail.append(apercu.node);

    const sauver = () => {
      if (!enAttente || mort || gele) return Promise.resolve();
      enAttente = false;
      return MH.Dossier.ecrire(actif, editeur.value).then((ok) => {
        statut.textContent = ok || !MH.Dossier.persistant ? "Enregistré" : "Stockage plein : télécharge ton site";
      });
    };
    const sauverPlusTard = MH.debounce(sauver, 500);

    function dessinerOnglets() {
      onglets.innerHTML = "";
      meta.ouverts = meta.ouverts.filter((c) => MH.Dossier.lire(c) != null);
      meta.ouverts.forEach((c) => {
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
      if (!depuisApercu && PAGE.test(chemin)) apercu.ouvrir(chemin, true);
      sauverMeta();
      dessinerOnglets();
    }

    /* --- panneau Fichiers --- */
    const pagesQuiPointent = (cible) => {
      const chemins = MH.Dossier.chemins();
      return MH.Dossier.list({ type: "texte" }).filter((f) => PAGE.test(f.path) && f.path !== cible).filter((f) => {
        const doc = new DOMParser().parseFromString(f.texte, "text/html");
        return [...doc.querySelectorAll("a[href], img[src], link[href]")].some((n) =>
          MH.outils.resoudreChemin(n.getAttribute("href") || n.getAttribute("src"), f.path, chemins).fichier === cible);
      }).map((f) => f.path);
    };

    function renommer(ancien, saisi) {
      if (enAttente) sauver();
      const nouveau = nettoyerNom(saisi);
      if (!nouveau) { dire("Le nom ne peut pas être vide."); dessinerFichiers(); return; }
      if (ancien !== nouveau && MH.Dossier.estImage(ancien) !== MH.Dossier.estImage(nouveau)) { dire("Garde la même extension : une image reste une image, une page reste une page."); dessinerFichiers(); return; }
      // Le dossier prévient l'atelier pendant le renommage : on mémorise la place de l'onglet avant.
      const place = meta.ouverts.indexOf(ancien);
      const err = MH.Dossier.rename(ancien, nouveau);
      if (err) { dire(err); dessinerFichiers(); return; }
      meta.base = meta.base.map((c) => (c === ancien ? nouveau : c));
      meta.ouverts = meta.ouverts.filter((c) => c !== ancien && c !== nouveau);
      if (place >= 0) meta.ouverts.splice(Math.min(place, meta.ouverts.length), 0, nouveau);
      if (actif === ancien) { actif = nouveau; apercu.ouvrir(nouveau); }
      sauverMeta();
      dire("Renommé : " + ancien + " → " + nouveau + "." + (nomRisque(nouveau) ? " Conseil : évite les espaces et les accents dans les noms de fichiers." : ""));
      dessinerOnglets(); dessinerFichiers(); evaluer();
    }

    function supprimer(chemin) {
      const liens = pagesQuiPointent(chemin);
      const q = "Supprimer « " + chemin + " » ?" + (liens.length ? "\nCes pages ont un lien ou une image vers ce fichier, qui ne marchera plus : " + liens.join(", ") + "." : "");
      if (!window.confirm(q)) return;
      MH.Dossier.remove(chemin);
      if (actif === chemin) {
        const autre = meta.ouverts.find((c) => c !== chemin && MH.Dossier.lire(c) != null) || MH.Dossier.list({ type: "texte" }).map((f) => f.path).find((c) => c !== chemin);
        if (autre) ouvrirFichier(autre);
      }
      dire("Supprimé : " + chemin + ".");
      dessinerOnglets(); dessinerFichiers(); evaluer();
    }

    async function creer(saisi) {
      const n = nettoyerNom(saisi);
      if (!TEXTE.test(n)) return dire("Seuls les fichiers .html et .css se créent ici. Les images s'ajoutent avec « Ajouter des images ».");
      if (MH.Dossier.chemins().includes(n)) return dire("Un fichier « " + n + " » existe déjà.");
      await MH.Dossier.ecrire(n, PAGE.test(n) ? MH.projet.MODELES[0].squelette(meta.nom, "Nouvelle page") : "/* Feuille de style de « " + meta.nom + " » */\n");
      ouvrirFichier(n);
      dire("Fichier créé : " + n + "." + (nomRisque(n) ? " Conseil : évite les espaces et les accents dans les noms de fichiers." : ""));
      dessinerFichiers();
    }

    function dessinerFichiers() {
      if (panneau.hidden) return;
      panneau.innerHTML = "";
      const ROLES = ["Accueil", "2e page", "Contact"];
      const pages = MH.Dossier.list({ type: "texte" }).map((f) => f.path).filter((c) => PAGE.test(c));
      const bases = el("div", "atelier-bases", "<b>Pages vérifiées</b>");
      ROLES.forEach((r, i) => {
        const lab = el("label", "atelier-base", "<span>" + r + "</span>");
        const sel = el("select");
        pages.forEach((c) => { const o = el("option", "", esc(c)); o.value = c; if (c === meta.base[i]) o.selected = true; sel.append(o); });
        sel.addEventListener("change", () => { meta.base[i] = sel.value; sauverMeta(); evaluer(); });
        lab.append(sel); bases.append(lab);
      });
      const liste = el("ul", "atelier-liste");
      MH.Dossier.list().forEach((f) => {
        const li = el("li", "atelier-fichier");
        li.dataset.chemin = f.path;
        const role = meta.base.indexOf(f.path);
        const champ = el("input", "atelier-fichier-nom");
        champ.value = f.path; champ.spellcheck = false;
        champ.setAttribute("aria-label", "Nom de " + f.path);
        champ.addEventListener("change", () => renommer(f.path, champ.value));
        champ.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); champ.blur(); } });
        const info = el("span", "atelier-fichier-info", role >= 0 ? ROLES[role] : MH.Dossier.estImage(f.path) ? "image" : "");
        const ouvrir = el("button", "dossier-ico atelier-fichier-ouvrir", ICON.edit);
        ouvrir.type = "button"; ouvrir.setAttribute("aria-label", "Ouvrir " + f.path); ouvrir.hidden = MH.Dossier.estImage(f.path);
        ouvrir.addEventListener("click", () => ouvrirFichier(f.path));
        const suppr = el("button", "dossier-ico atelier-fichier-suppr", ICON.trash);
        suppr.type = "button"; suppr.setAttribute("aria-label", "Supprimer " + f.path);
        suppr.addEventListener("click", () => supprimer(f.path));
        li.append(champ, info, ouvrir, suppr);
        liste.append(li);
      });
      const actions = el("div", "atelier-fichiers-actions");
      const nouveau = el("input", "atelier-nouveau");
      nouveau.placeholder = "nouvelle-page.html"; nouveau.setAttribute("aria-label", "Nom du nouveau fichier");
      const btnNouveau = el("button", "md-button atelier-nouveau-btn", ICON.plus + "<span>Créer</span>"); btnNouveau.type = "button";
      btnNouveau.addEventListener("click", () => creer(nouveau.value));
      nouveau.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); creer(nouveau.value); } });
      const lblImg = el("label", "md-button dossier-ajout", ICON.plus + "<span>Ajouter des images</span>");
      const inpImg = el("input", "dossier-input"); inpImg.type = "file"; inpImg.accept = "image/*"; inpImg.multiple = true;
      inpImg.setAttribute("aria-label", "Ajouter des images dans le dossier images/");
      inpImg.addEventListener("change", async () => {
        const erreurs = [];
        for (const f of [...inpImg.files]) { const err = await MH.Dossier.add(f, "images/" + f.name); if (err) erreurs.push(err); }
        inpImg.value = "";
        dire(erreurs.length ? erreurs.join(" ") : "Images ajoutées dans images/.");
      });
      lblImg.append(inpImg);
      actions.append(nouveau, btnNouveau, lblImg);
      panneau.append(bases, liste, actions);
    }
    btnFichiers.addEventListener("click", () => {
      panneau.hidden = !panneau.hidden;
      btnFichiers.setAttribute("aria-expanded", String(!panneau.hidden));
      dessinerFichiers();
    });

    /* --- export et import --- */
    async function exporter() {
      if (enAttente) await sauver();
      const enc = new TextEncoder(), fichiers = [];
      for (const f of MH.Dossier.list()) {
        const octets = MH.Dossier.estImage(f.path) ? new Uint8Array(await f.blob.arrayBuffer()) : enc.encode(f.texte || "");
        fichiers.push({ chemin: f.path, octets });
      }
      return { nom: MH.outils.slugSite(meta.nom) + ".zip", blob: MH.zip.creer(fichiers) };
    }
    btnExport.addEventListener("click", async () => {
      const { nom: n, blob } = await exporter();
      const a = el("a"); a.href = URL.createObjectURL(blob); a.download = n;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      dire("Téléchargé : " + n + ". Décompresse-le, puis ouvre le dossier dans VS Code.");
    });

    async function importer(file) {
      if (file.size > LIMITE_ZIP) { dire("Ce .zip est trop lourd (plus de 20 Mo)."); return message.textContent; }
      let entrees;
      try { entrees = await MH.zip.lire(file); } catch (e) {
        dire(e.message === "zip-methode" ? "Ce .zip utilise une compression que le navigateur ne sait pas lire. Recompresse le dossier avec Windows." : "Ce fichier n'est pas un .zip valide.");
        return message.textContent;
      }
      if (entrees.length > MAX_FICHIERS) { dire("Ce .zip contient trop de fichiers (plus de " + MAX_FICHIERS + ")."); return message.textContent; }
      // Si tout le site est rangé dans un dossier (mon-site/index.html), ce dossier est retiré.
      const tetes = new Set(entrees.map((e) => (e.chemin.includes("/") ? e.chemin.split("/")[0] : "")));
      if (tetes.size === 1 && !tetes.has("")) { const t = [...tetes][0] + "/"; entrees.forEach((e) => { e.chemin = e.chemin.slice(t.length); }); }
      const ignores = entrees.filter((e) => !TEXTE.test(e.chemin) && !IMAGE.test(e.chemin)).map((e) => e.chemin);
      const garder = entrees.filter((e) => TEXTE.test(e.chemin) || IMAGE.test(e.chemin));
      if (!garder.some((e) => PAGE.test(e.chemin))) { dire("Ce .zip ne contient aucune page .html."); return message.textContent; }
      if (!window.confirm("Importer « " + file.name + " » va remplacer les pages de ton site actuel (tes images sont gardées).\nPour garder ton site actuel, annule et clique d'abord sur « Télécharger mon site ».")) return "";
      for (const f of MH.Dossier.list({ type: "texte" })) MH.Dossier.remove(f.path);
      const dec = new TextDecoder(), refusees = [];
      for (const e of garder) {
        if (TEXTE.test(e.chemin)) { await MH.Dossier.ecrire(e.chemin, dec.decode(e.octets)); continue; }
        const ext = e.chemin.split(".").pop().toLowerCase();
        const type = ext === "svg" ? "image/svg+xml" : ext === "jpg" ? "image/jpeg" : "image/" + ext;
        const err = await MH.Dossier.add(new File([e.octets], e.chemin.split("/").pop(), { type }), e.chemin);
        if (err) refusees.push(e.chemin);
      }
      const pages = garder.map((e) => e.chemin).filter((c) => PAGE.test(c)).sort();
      const accueil = pages.includes("index.html") ? "index.html" : pages[0];
      const contact = pages.find((c) => c !== accueil && /contact/i.test(c));
      const deux = pages.find((c) => c !== accueil && c !== contact);
      const base = [accueil, deux, contact];
      const DEFAUT = [null, "page2.html", "contact.html"], ROLES = [null, "Deuxième page", "Page de contact"];
      for (let i = 1; i < 3; i++) {
        if (base[i]) continue;
        let n = DEFAUT[i], k = 2;
        while (MH.Dossier.lire(n) != null || base.includes(n)) n = DEFAUT[i].replace(".html", "-" + k++ + ".html");
        await MH.Dossier.ecrire(n, MH.projet.MODELES[0].squelette(meta.nom, ROLES[i]));
        base[i] = n;
      }
      const suite = { version: 1, nom: meta.nom, modele: "libre", base, etapesReussies: [], ouverts: base.slice(), actif: base[0] };
      ecrireMeta(suite);
      const bilan = "Importé : " + garder.length + " fichier(s)." +
        (ignores.length ? " Ignorés (ni page, ni feuille de style, ni image) : " + ignores.join(", ") + "." : "") +
        (refusees.length ? " Images trop lourdes, non importées : " + refusees.join(", ") + "." : "");
      detruire();
      atelier(racine, suite, bilan);
      return bilan;
    }
    inpImport.addEventListener("change", () => { const f = inpImport.files[0]; inpImport.value = ""; if (f) importer(f); });
    MH.atelier.exporter = exporter;
    MH.atelier.importer = importer;

    /* --- vérification --- */
    function evaluer() {
      if (mort) return;
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
      suivante.hidden = !res.every(Boolean) || e.n === 7;
    }

    function voirEtape(n) {
      etapeVue = Math.min(7, Math.max(1, n));
      dessinerGuide();
    }

    /* --- événements --- */
    suivante.addEventListener("click", () => voirEtape(etapeVue + 1));
    menuBtn.addEventListener("click", () => { menu.hidden = !menu.hidden; });
    recommencer.addEventListener("click", () => {
      menu.hidden = true;
      if (!window.confirm("Recommencer le projet ? Tes pages seront effacées (tes images restent). Pense à télécharger ton site avant.")) return;
      for (const f of MH.Dossier.list({ type: "texte" })) MH.Dossier.remove(f.path);
      MH.store.del(CLE);
      detruire();
      racine.dataset.vu = ""; demarrer(racine);
    });
    btnRecharger.addEventListener("click", () => location.reload());
    ecouter(window, "storage", (e) => {
      if ((e.key === "mh:" + CLE || e.key === "mh:rev") && racine.isConnected && !mort) {
        gele = true; enAttente = false;
        statut.textContent = "Modifié ailleurs : recharge la page";
        bandeauOnglet.hidden = false;
      }
    });
    // Quitter la page : on garde tout de suite le texte non sauvegardé (sauvegarde synchrone de secours).
    const auDepart = () => {
      if (!enAttente || mort || gele) return;
      const chemin = actif, texte = editeur.value;
      sauver().then((ok) => { if (ok !== false) MH.store.del(BROUILLON); });
      MH.store.set(BROUILLON, JSON.stringify({ chemin, texte, rev: MH.Dossier.rev() }));
    };
    ecouter(window, "pagehide", auDepart);
    const surHash = () => { const m = /^#etape-(\d)$/.exec(location.hash); if (m) voirEtape(+m[1]); };
    ecouter(window, "hashchange", surHash);
    const surDossier = () => { if (mort) return; if (!racine.isConnected) { detruire(); return; } dessinerOnglets(); dessinerFichiers(); evaluerPlusTard(); };
    MH.Dossier.on(surDossier);
    nettoyages.push(() => MH.Dossier.off(surDossier));
    if (window.document$ && window.document$.subscribe) {
      // Navigation instantanée : en quittant l'atelier, on sauvegarde et on se désabonne.
      const abo = window.document$.subscribe(() => { if (!racine.isConnected) { auDepart(); detruire(); } });
      nettoyages.push(() => { if (abo && abo.unsubscribe) abo.unsubscribe(); });
    }
    function detruire() { mort = true; while (nettoyages.length) { try { nettoyages.pop()(); } catch (e) { /* déjà nettoyé */ } } }

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

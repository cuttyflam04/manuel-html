/* Manuel HTML — pages de cours : exemples, exercices corrigés, quiz, démo, progression, styles.
   S'appuie sur noyau.js (window.MH) et exercices.js (les données). */
(function () {
  "use strict";
  const { el, store, debounce, ICON, highlight, makeEditor, makePreview, parse, T } = globalThis.MH;

  /* ---------- Exemples : code + rendu, modifiables ---------- */

  function enhanceExamples(root) {
    root.querySelectorAll(".admonition.example div.highlight, .tabbed-block div.highlight, div.highlight.apercu-force").forEach((block) => {
      if (block.dataset.vu || block.classList.contains("no-preview")) return;
      block.dataset.vu = "1";
      const code = block.querySelector("pre > code");
      // seul le code HTML (balises colorées par Pygments) reçoit un aperçu
      if (!code || !code.querySelector(".nt, .cp")) return;
      const original = code.textContent.replace(/\n$/, "");
      const preview = makePreview();
      const label = el("div", "apercu-legende", ICON.eye + "<span>Résultat dans le navigateur</span>");

      const btnEdit = el("button", "md-button apercu-btn", ICON.edit + "<span>Modifier le code</span>");
      btnEdit.type = "button";
      btnEdit.setAttribute("aria-label", "Modifier le code");
      const btnReset = el("button", "md-button apercu-btn", ICON.reset + "<span>Rétablir</span>");
      btnReset.type = "button";
      btnReset.setAttribute("aria-label", "Rétablir le code d'origine");
      btnReset.hidden = true;
      preview.actions.append(btnEdit, btnReset);

      let editor = null;
      const live = debounce((v) => preview.render(v), 120);
      btnEdit.addEventListener("click", () => {
        if (!editor) {
          editor = makeEditor(original, live, "Code de l'exemple, modifiable", { completion: true, formulaires: /bonus-formulaires/.test(location.pathname) });
          editor.node.classList.add("editeur-exemple");
          block.after(editor.node);
        }
        block.hidden = true;
        editor.node.hidden = false;
        btnEdit.hidden = true;
        btnReset.hidden = false;
        editor.textarea.focus({ preventScroll: true });
      });
      btnReset.addEventListener("click", () => {
        editor.value = original;
        preview.render(original);
      });

      const after = block;
      after.after(label, preview.node);
      preview.render(original);
    });
  }

  /* ---------- Exercices corrigés instantanément ---------- */


  function exerciseKey(id) { return "exo:" + id; }
  function isDone(id) { return store.get(exerciseKey(id) + ":ok") === "1"; }

  function enhanceExercises(root) {
    const data = window.MH_EXERCICES || {};
    root.querySelectorAll(".exo[data-exo]").forEach((box) => {
      if (box.dataset.vu) return;
      const id = box.dataset.exo, ex = data[id];
      if (!ex) return;
      box.dataset.vu = "1";

      const saved = store.get(exerciseKey(id) + ":code");
      const head = el("div", "exo-tete");
      const badge = el("span", "exo-etat");
      head.append(el("span", "exo-titre", "Exercice interactif"), badge);

      const zone = el("div", "exo-zone");
      const preview = makePreview({ maxHeight: 420 });
      const list = el("ul", "exo-checks");
      list.setAttribute("aria-live", "polite");
      const rows = ex.checks.map((c) => {
        const li = el("li", "", '<span class="exo-ico"></span><span>' + c.label + "</span>");
        list.append(li);
        return li;
      });

      const tools = el("div", "exo-outils");
      const bReset = el("button", "md-button", ICON.reset + "<span>Recommencer</span>");
      bReset.type = "button";
      tools.append(bReset);
      let sol = null;
      if (ex.solution) {
        sol = el("details", "exo-solution", "<summary>Voir une solution possible</summary>");
        const pre = el("pre", "exo-sol-code");
        pre.innerHTML = highlight(ex.solution.trim());
        const bTry = el("button", "md-button", "Essayer cette solution");
        bTry.type = "button";
        bTry.addEventListener("click", () => { editor.value = ex.solution.trim(); });
        sol.append(pre, bTry);
      }

      const verdict = el("p", "exo-verdict");
      verdict.setAttribute("role", "status");

      function check(src) {
        const doc = parse(src);
        let okCount = 0;
        ex.checks.forEach((c, i) => {
          let ok = false;
          try { ok = !!c.ok(doc, src, T); } catch (e) { ok = false; }
          rows[i].classList.toggle("ok", ok);
          rows[i].querySelector(".exo-ico").innerHTML = ok ? ICON.check : ICON.dot;
          if (ok) okCount++;
        });
        const all = okCount === ex.checks.length;
        badge.textContent = okCount + " / " + ex.checks.length;
        box.classList.toggle("reussi", all);
        if (all) {
          verdict.textContent = ex.bravo || "Tout est bon. Exercice réussi !";
          if (!isDone(id)) {
            store.set(exerciseKey(id) + ":ok", "1");
            box.classList.add("celebre");
            setTimeout(() => box.classList.remove("celebre"), 1200);
            updateProgress(document);
          }
        } else {
          verdict.textContent = okCount ? "Encore " + (ex.checks.length - okCount) + " point(s) à valider." : "";
        }
      }

      const run = debounce((v) => {
        store.set(exerciseKey(id) + ":code", v);
        preview.render(v);
        check(v);
      }, 150);
      const editor = makeEditor(saved != null ? saved : ex.depart, run, "Votre code pour l'exercice");
      bReset.addEventListener("click", () => { editor.value = ex.depart; });

      zone.append(
        el("div", "exo-col", '<div class="exo-label">Votre code</div>'),
        el("div", "exo-col", '<div class="exo-label">Rendu</div>')
      );
      zone.children[0].append(editor.node);
      zone.children[1].append(preview.node);

      const checksBox = el("div", "exo-bilan", '<div class="exo-label">Correction automatique</div>');
      checksBox.append(list, verdict);

      box.append(head, zone, checksBox, tools);
      if (sol) box.append(sol);
      preview.render(editor.value);
      check(editor.value);
    });
  }

  /* ---------- Quiz ---------- */

  function enhanceQuiz(root) {
    const data = window.MH_QUIZ || {};
    root.querySelectorAll(".quiz[data-quiz]").forEach((box) => {
      if (box.dataset.vu) return;
      const qs = data[box.dataset.quiz];
      if (!qs) return;
      box.dataset.vu = "1";
      let answered = 0, good = 0;
      const score = el("p", "quiz-score");
      score.setAttribute("role", "status");
      qs.forEach((q, qi) => {
        const card = el("fieldset", "quiz-q");
        card.append(el("legend", "", "<span>" + (qi + 1) + ".</span> " + q.q));
        const opts = el("div", "quiz-choix");
        const expl = el("p", "quiz-expl");
        expl.hidden = true;
        q.choix.forEach((c, ci) => {
          const b = el("button", "quiz-opt", c);
          b.type = "button";
          b.addEventListener("click", () => {
            if (card.dataset.fini) return;
            card.dataset.fini = "1";
            answered++;
            const ok = ci === q.bonne;
            if (ok) good++;
            b.classList.add(ok ? "juste" : "faux");
            opts.children[q.bonne].classList.add("juste");
            [...opts.children].forEach((o) => o.setAttribute("aria-disabled", "true"));
            expl.innerHTML = (ok ? "<b>Bonne réponse.</b> " : "<b>Pas tout à fait.</b> ") + (q.explication || "");
            expl.hidden = false;
            if (answered === qs.length) {
              score.textContent = "Score : " + good + " / " + qs.length + (good === qs.length ? ". Parfait !" : ". Relis les parties concernées puis recommence.");
              score.hidden = false;
              bRetry.hidden = false;
            }
          });
          opts.append(b);
        });
        card.append(opts, expl);
        box.append(card);
      });
      score.hidden = true;
      const bRetry = el("button", "md-button", ICON.reset + "<span>Recommencer le quiz</span>");
      bRetry.type = "button";
      bRetry.hidden = true;
      bRetry.addEventListener("click", () => {
        box.innerHTML = "";
        delete box.dataset.vu;
        enhanceQuiz(box.parentNode);
      });
      box.append(score, bRetry);
    });
  }

  /* ---------- Démo de la page d'accueil ---------- */

  function enhanceDemo(root) {
    root.querySelectorAll(".demo-live").forEach((box) => {
      if (box.dataset.vu) return;
      box.dataset.vu = "1";
      const src = box.querySelector("textarea");
      const initial = src ? src.value.trim() : "";
      box.innerHTML = "";
      const preview = makePreview({ maxHeight: 360 });
      const live = debounce((v) => preview.render(v), 100);
      const editor = makeEditor(initial, live, "Code de démonstration, modifiable");
      const left = el("div", "demo-col");
      left.append(el("div", "exo-label", "Modifiez ce code…"), editor.node);
      const right = el("div", "demo-col");
      right.append(el("div", "exo-label", "…le rendu suit instantanément"), preview.node);
      box.append(left, right);
      preview.render(initial);
    });
  }

  /* ---------- Projet « Mon site » : encadrés de fin de chapitre ---------- */

  const lireProjet = () => { try { return JSON.parse(store.get("projet") || "null"); } catch (e) { return null; } };

  function enhanceEtapesProjet(root) {
    const etapes = (window.MH && window.MH.projet && window.MH.projet.ETAPES) || [];
    root.querySelectorAll(".etape-projet[data-etape]").forEach((box) => {
      const n = +box.dataset.etape, e = etapes[n - 1];
      if (!e) return;
      const projet = lireProjet();
      const reussie = !!projet && (projet.etapesReussies || []).includes(n);
      const etat = !projet ? "Pas encore commencé" : reussie ? "Réussie ✓" : "À faire";
      box.className = "etape-projet" + (reussie ? " reussie" : "");
      box.innerHTML =
        '<p class="etape-projet-tete"><b>Étape ' + n + " · " + e.titre + '</b><span class="etape-projet-etat">' + etat + "</span></p>" +
        "<p>Appliquez ce chapitre à votre propre site" + (projet && projet.nom ? " « " + window.MH.esc(projet.nom) + " »" : "") +
        ". La vérification se fait toute seule pendant que vous tapez.</p>" +
        '<a class="md-button md-button--primary" href="../projet/#etape-' + n + '">' + (projet ? "Ouvrir l'atelier" : "Créer mon site") + "</a>";
    });
  }

  /* ---------- Progression ---------- */

  function updateProgress(root) {
    const data = window.MH_EXERCICES || {};
    root.querySelectorAll("[data-progression]").forEach((n) => {
      if (n.dataset.progression === "projet") {
        const projet = lireProjet(), r = projet ? (projet.etapesReussies || []).length : 0;
        n.hidden = false;
        n.textContent = projet ? r + " / 7 étapes" : "à commencer";
        n.classList.toggle("complet", r === 7);
        n.style.setProperty("--p", (r / 7 * 100) + "%");
        return;
      }
      const prefix = n.dataset.progression + "-";
      const ids = Object.keys(data).filter((k) => k.startsWith(prefix));
      if (!ids.length) { n.hidden = true; return; }
      const done = ids.filter(isDone).length;
      n.textContent = done + " / " + ids.length + " exercice" + (ids.length > 1 ? "s" : "");
      n.classList.toggle("complet", done === ids.length);
      n.style.setProperty("--p", (done / ids.length * 100) + "%");
    });
    const resume = root.querySelector("[data-reprendre]");
    if (resume) {
      const last = store.get("derniere-page");
      const title = store.get("derniere-page-titre");
      if (last && title) {
        resume.hidden = false;
        const a = resume.querySelector("a");
        a.href = last;
        a.querySelector("span").textContent = title;
      }
    }
  }

  function rememberPage() {
    const path = location.pathname;
    if (/\/manuel\/(chapitre\d|bonus|annexes|projet)/.test(path)) {
      const h1 = document.querySelector(".md-content h1");
      store.set("derniere-page", path + location.hash);
      if (h1) store.set("derniere-page-titre", h1.textContent.replace("¶", "").trim());
    }
  }

  /* ---------- Sélecteur de style ---------- */

  const STYLES = [
    { id: "classique", nom: "Classique", desc: "Sobre et lisible", couleurs: ["#0b7a62", "#f5f8f6", "#17201d"] },
    { id: "sousverre", nom: "Sous-verre", desc: "Aplats vifs, cernes noirs", couleurs: ["#d7262e", "#e3a21a", "#2b3a8f"] },
    { id: "carrapide", nom: "Car rapide", desc: "Jaune et bleu de Dakar", couleurs: ["#ffc800", "#0b4ea2", "#d62828"] },
    { id: "notice", nom: "Notice de montage", desc: "Étapes et briques", couleurs: ["#cfe9f7", "#d01012", "#f2cd37"] },
  ];

  function applyStyle(id) {
    if (!STYLES.some((s) => s.id === id)) id = "classique";
    if (id === "classique") document.documentElement.removeAttribute("data-mh-style");
    else document.documentElement.setAttribute("data-mh-style", id);
    store.set("style", id);
    document.querySelectorAll(".mh-style-opt").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.style === id)));
  }

  function styleSelector() {
    if (document.querySelector(".mh-style")) return;
    const anchor = document.querySelector(".md-header__inner .md-header__option") || document.querySelector(".md-header__inner .md-search");
    if (!anchor) return;
    const current = store.get("style") || "classique";
    const wrap = el("div", "mh-style");
    const btn = el("button", "md-header__button mh-style-btn",
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-.5-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="7.5" cy="11" r="1.3" fill="currentColor"/><circle cx="10" cy="7" r="1.3" fill="currentColor"/><circle cx="14.5" cy="7" r="1.3" fill="currentColor"/><circle cx="17" cy="11" r="1.3" fill="currentColor"/></svg>');
    btn.type = "button";
    btn.title = "Changer de style";
    btn.setAttribute("aria-label", "Changer de style");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    const menu = el("div", "mh-style-menu");
    menu.setAttribute("role", "radiogroup");
    menu.setAttribute("aria-label", "Style du manuel");
    menu.hidden = true;
    menu.append(el("div", "mh-style-titre", "Style du manuel"));
    STYLES.forEach((s) => {
      const o = el("button", "mh-style-opt",
        '<span class="mh-style-pastilles">' + s.couleurs.map((c) => '<i style="background:' + c + '"></i>').join("") + "</span>" +
        '<span class="mh-style-txt"><b>' + s.nom + "</b><small>" + s.desc + "</small></span>");
      o.type = "button";
      o.dataset.style = s.id;
      o.setAttribute("role", "radio");
      o.setAttribute("aria-checked", String(s.id === current));
      o.addEventListener("click", () => { applyStyle(s.id); });
      menu.append(o);
    });
    menu.append(el("p", "mh-style-note", "Sous-verre, Car rapide et Notice de montage chargent leurs polices depuis Internet. Sans connexion, une police de secours s'affiche."));
    const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      btn.setAttribute("aria-expanded", String(!menu.hidden));
      if (!menu.hidden) (menu.querySelector('[aria-checked="true"]') || menu.querySelector(".mh-style-opt")).focus();
    });
    document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });
    wrap.append(btn, menu);
    anchor.before(wrap);
  }

  /* ---------- Démarrage (compatible navigation instantanée) ---------- */

  function init() {
    styleSelector();
    const root = document.querySelector(".md-content") || document;
    enhanceExamples(root);
    enhanceExercises(root);
    enhanceQuiz(root);
    enhanceDemo(root);
    enhanceEtapesProjet(root);
    updateProgress(root);
    rememberPage();
  }

  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

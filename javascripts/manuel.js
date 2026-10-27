/* Manuel HTML — aperçus en direct, éditeur, exercices corrigés et quiz.
   Aucune dépendance : tout tient dans ce fichier + exercices.js (les données). */
(function () {
  "use strict";

  /* ---------- Petits outils ---------- */

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const store = {
    get(k) { try { return localStorage.getItem("mh:" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("mh:" + k, v); } catch (e) { /* stockage indisponible */ } },
    del(k) { try { localStorage.removeItem("mh:" + k); } catch (e) { /* idem */ } },
  };
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const ICON = {
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dot: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  };

  /* ---------- Coloration syntaxique HTML ---------- */

  function highlight(src) {
    const re = /(<!--[\s\S]*?(?:-->|$))|(<!DOCTYPE[^>]*>?)|(<\/?)([A-Za-z][\w-]*)([^<>]*?)(\/?>)|(&#?\w+;?)/gi;
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      if (m[1]) out += '<span class="t-com">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="t-doc">' + esc(m[2]) + "</span>";
      else if (m[4]) {
        const attrs = m[5].replace(/([^\s=]+)(\s*=\s*)?("[^"]*"?|'[^']*'?|[^\s"']+)?|(\s+)|([^\s])/g,
          (all, name, eq, val, sp, other) => {
            if (sp) return sp;
            if (other) return esc(other);
            return '<span class="t-att">' + esc(name) + "</span>" + (eq ? esc(eq) : "") +
              (val ? '<span class="t-val">' + esc(val) + "</span>" : "");
          });
        out += '<span class="t-pun">' + esc(m[3]) + '</span><span class="t-tag">' + esc(m[4]) +
          "</span>" + attrs + '<span class="t-pun">' + esc(m[6]) + "</span>";
      } else if (m[7]) out += '<span class="t-ent">' + esc(m[7]) + "</span>";
      last = re.lastIndex;
    }
    return out + esc(src.slice(last)) + "\n";
  }

  /* ---------- Éditeur (zone de texte posée sur le code coloré) ---------- */

  function makeEditor(initial, onChange, label) {
    const wrap = el("div", "editeur");
    const hl = el("pre", "editeur-hl");
    hl.setAttribute("aria-hidden", "true");
    const ta = el("textarea", "editeur-ta");
    ta.spellcheck = false;
    ta.setAttribute("autocapitalize", "off");
    ta.setAttribute("autocomplete", "off");
    // les correcteurs (Grammarly, etc.) n'ont rien à faire dans du code
    ta.setAttribute("data-gramm", "false");
    ta.setAttribute("data-gramm_editor", "false");
    ta.setAttribute("data-enable-grammarly", "false");
    ta.setAttribute("aria-label", label || "Code HTML modifiable");
    ta.value = initial;
    wrap.append(hl, ta);

    const sync = () => {
      hl.innerHTML = highlight(ta.value);
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
      hl.style.height = ta.style.height;
    };
    ta.addEventListener("input", () => { sync(); onChange && onChange(ta.value); });
    ta.addEventListener("scroll", () => { hl.scrollLeft = ta.scrollLeft; });
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey && !ta.dataset.escaped) {
        e.preventDefault();
        document.execCommand ? document.execCommand("insertText", false, "    ")
          : ta.setRangeText("    ", ta.selectionStart, ta.selectionEnd, "end");
      } else if (e.key === "Escape") {
        ta.dataset.escaped = "1"; // la touche Tab sort de l'éditeur ensuite
      } else {
        delete ta.dataset.escaped;
      }
    });
    requestAnimationFrame(sync);
    return {
      node: wrap, textarea: ta,
      get value() { return ta.value; },
      set value(v) { ta.value = v; sync(); onChange && onChange(v); },
      refresh: sync,
    };
  }

  /* ---------- Aperçu : un faux navigateur qui affiche le code ---------- */

  function placeholderImage(img) {
    const name = (img.getAttribute("src") || "image").split(/[\\/]/).pop();
    const w = parseInt(img.getAttribute("width"), 10) || (parseInt(img.getAttribute("height"), 10) ? Math.round(parseInt(img.getAttribute("height"), 10) * 1.4) : 180);
    const h = parseInt(img.getAttribute("height"), 10) || Math.round(w / 1.4);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="100%" height="100%" fill="#dfe7e4"/>` +
      `<path d="M0 ${h} L${w * 0.35} ${h * 0.45} L${w * 0.55} ${h * 0.7} L${w * 0.72} ${h * 0.52} L${w} ${h}Z" fill="#b5c9c2"/>` +
      `<circle cx="${w * 0.75}" cy="${h * 0.28}" r="${Math.min(w, h) * 0.1}" fill="#f2c94c"/>` +
      `<text x="50%" y="${h - 10}" font-family="sans-serif" font-size="${Math.max(10, Math.min(13, w / 12))}" fill="#3d524b" text-anchor="middle">${esc(name)}</text></svg>`;
    img.dataset.placeholder = "1";
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function makePreview(opts) {
    opts = opts || {};
    const box = el("figure", "apercu");
    const bar = el("div", "apercu-barre");
    const dots = el("span", "apercu-points", "<i></i><i></i><i></i>");
    const tab = el("span", "apercu-onglet");
    const actions = el("span", "apercu-actions");
    bar.append(dots, tab, actions);
    const frame = el("iframe", "apercu-cadre");
    frame.setAttribute("title", "Rendu du code dans le navigateur");
    frame.setAttribute("loading", "lazy");
    const note = el("div", "apercu-note");
    note.setAttribute("role", "status");
    note.hidden = true;
    box.append(bar, frame, note);

    let redirect = null;
    const showNote = (html) => { note.innerHTML = html; note.hidden = false; };

    function fit() {
      const d = frame.contentDocument;
      if (!d || !d.documentElement) return;
      const h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
      frame.style.height = Math.min(Math.max(h, 56), opts.maxHeight || 560) + "px";
    }

    function wire() {
      const d = frame.contentDocument, w = frame.contentWindow;
      if (!d) return;
      tab.textContent = (d.title || "").trim() || "Sans titre";
      tab.classList.toggle("vide", !(d.title || "").trim());
      d.querySelectorAll("img").forEach((img) => {
        const fail = () => { if (!img.dataset.placeholder) placeholderImage(img); };
        if (img.complete && img.naturalWidth === 0) fail();
        img.addEventListener("error", fail);
        img.addEventListener("load", fit);
      });
      d.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest("a[href]");
        if (!a) return;
        e.preventDefault();
        const href = a.getAttribute("href");
        if (href.startsWith("#")) {
          const id = decodeURIComponent(href.slice(1));
          const t = d.getElementById(id) || d.getElementsByName(id)[0];
          if (t) {
            t.scrollIntoView({ behavior: "smooth", block: "start" });
            showNote("Ancre trouvée : le navigateur descend jusqu'à <code>" + esc(href) + "</code>.");
          } else showNote("Aucune ancre <code>" + esc(id) + "</code> dans cette page.");
          return;
        }
        if (/^mailto:/i.test(href)) return showNote("Ce lien ouvrirait votre messagerie pour écrire à <code>" + esc(href.slice(7)) + "</code>.");
        if (/^tel:/i.test(href)) return showNote("Ce lien proposerait d'appeler le <code>" + esc(href.slice(4)) + "</code>.");
        const blank = (a.getAttribute("target") || "").toLowerCase() === "_blank";
        showNote("Ce lien ouvrirait <code>" + esc(href) + "</code>" + (blank ? " dans un <b>nouvel onglet</b>" : "") + ".");
      });
      d.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target;
        const method = (f.getAttribute("method") || "GET").toUpperCase();
        const action = f.getAttribute("action") || "(page actuelle)";
        const data = new w.FormData(f);
        if (e.submitter && e.submitter.name) data.append(e.submitter.name, e.submitter.value);
        const pairs = [];
        data.forEach((v, k) => pairs.push([k, typeof v === "string" ? v : (v.name || "(aucun fichier)")]));
        if (method === "GET") {
          const q = pairs.map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v)).join("&");
          showNote("Envoi en <b>GET</b> : le navigateur irait à l'adresse<br><code>" + esc(action + (q ? "?" + q : "")) + "</code>");
        } else {
          const rows = pairs.length ? pairs.map(([k, v]) => "<code>" + esc(k) + "</code> = <code>" + esc(v) + "</code>").join("<br>")
            : "aucune donnée (avez-vous mis un <code>NAME</code> à vos champs ?)";
          showNote("Envoi en <b>POST</b> vers <code>" + esc(action) + "</code>, données invisibles dans l'adresse :<br>" + rows);
        }
      });
      d.addEventListener("reset", () => showNote("Le bouton <b>RESET</b> a remis les champs à leur état initial."));
      if (redirect) showNote("Redirection : après <b>" + esc(redirect.delay) + " s</b>, le navigateur irait vers <code>" + esc(redirect.url) + "</code> (désactivée dans l'aperçu).");
      fit();
      if (w.ResizeObserver && d.body) new w.ResizeObserver(fit).observe(d.body);
    }

    frame.addEventListener("load", wire);

    return {
      node: box, actions,
      render(src) {
        note.hidden = true;
        redirect = null;
        const clean = src.replace(/<meta[^>]*http-equiv\s*=\s*["'‘’"]*refresh[^>]*>/gi, (tag) => {
          const c = /content\s*=\s*["'‘’"]*\s*(\d+)\s*;\s*url\s*=\s*([^"'‘’">]+)/i.exec(tag);
          redirect = c ? { delay: c[1], url: c[2].trim() } : { delay: "?", url: "?" };
          return "";
        });
        frame.srcdoc = clean;
      },
    };
  }

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
          editor = makeEditor(original, live, "Code de l'exemple, modifiable");
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

  const parse = (src) => new DOMParser().parseFromString(src, "text/html");
  const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

  // Outils mis à disposition des vérifications écrites dans exercices.js
  const T = {
    n: (doc, sel) => doc.querySelectorAll(sel).length,
    txt: (doc, sel, mot) => [...doc.querySelectorAll(sel)].some((e) => norm(e.textContent).includes(norm(mot))),
    attr: (doc, sel, name, val) => [...doc.querySelectorAll(sel)].some((e) => e.hasAttribute(name) && (val == null || norm(e.getAttribute(name)) === norm(String(val)))),
    ferme: (src, tag) => {
      const o = (src.match(new RegExp("<" + tag + "(\\s|>)", "gi")) || []).length;
      const f = (src.match(new RegExp("</" + tag + "\\s*>", "gi")) || []).length;
      return o > 0 && o === f;
    },
    has: (src, re) => re.test(src),
  };

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

  /* ---------- Progression ---------- */

  function updateProgress(root) {
    const data = window.MH_EXERCICES || {};
    root.querySelectorAll("[data-progression]").forEach((n) => {
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
    if (/\/manuel\/(chapitre\d|bonus|annexes)/.test(path)) {
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
    updateProgress(root);
    rememberPage();
  }

  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

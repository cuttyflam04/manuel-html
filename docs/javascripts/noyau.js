/* Manuel HTML — noyau partagé (window.MH) : outils, coloration, éditeur,
   aperçu (faux navigateur), dossier virtuel et outils de vérification.
   Utilisé par manuel.js (pages de cours) et atelier.js (projet). */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

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
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
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

  function makeEditor(initial, onChange, label, opts) {
    opts = opts || {};
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
    /* Suggestions pendant la frappe (opts.completion) : balises, attributs, fermetures, caractères spéciaux,
       chacune avec une astuce du cours. Clavier : ↑ ↓, Entrée ou Tab, Échap. */
    let sug = null, choix = 0, insertion = false, largeurCar = 0;
    const pop = el("div", "completion");
    pop.id = "cpl-" + Math.random().toString(36).slice(2, 8);
    pop.hidden = true;
    const liste = el("ul", "completion-liste");
    liste.setAttribute("role", "listbox");
    liste.setAttribute("aria-label", "Suggestions");
    const astuce = el("p", "completion-astuce");
    pop.append(liste, astuce);
    if (opts.completion && MH.completion) {
      wrap.classList.add("avec-completion");
      wrap.append(pop);
      ta.setAttribute("aria-autocomplete", "list");
      ta.setAttribute("aria-controls", pop.id);
    }
    const fermer = () => { sug = null; pop.hidden = true; ta.removeAttribute("aria-activedescendant"); };
    const placer = () => {
      if (!largeurCar) {
        const s = el("span"); s.textContent = "M".repeat(20);
        s.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
        hl.append(s); largeurCar = s.getBoundingClientRect().width / 20; s.remove();
      }
      const lignes = ta.value.slice(0, ta.selectionStart).split("\n");
      const cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight) || 22;
      const haut = parseFloat(cs.paddingTop) + lignes.length * lh;
      let gauche = parseFloat(cs.paddingLeft) + lignes[lignes.length - 1].length * largeurCar - ta.scrollLeft;
      gauche = Math.max(4, Math.min(gauche, wrap.clientWidth - pop.offsetWidth - 4));
      // Pas la place sous la ligne : la liste passe au-dessus.
      const dessus = haut + pop.offsetHeight > wrap.clientHeight + 120 && haut - lh - pop.offsetHeight > 0;
      pop.style.left = gauche + "px";
      pop.style.top = (dessus ? haut - lh - pop.offsetHeight - 4 : haut + 2) + "px";
    };
    const dessiner = () => {
      liste.innerHTML = "";
      sug.items.forEach((it, i) => {
        const li = el("li", "completion-item" + (i === choix ? " actif" : ""));
        li.textContent = it.libelle;
        li.id = pop.id + "-" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === choix));
        li.addEventListener("pointerdown", (e) => { e.preventDefault(); choix = i; inserer(); });
        liste.append(li);
      });
      astuce.innerHTML = "<b>Astuce</b> " + esc(sug.items[choix].astuce);
      ta.setAttribute("aria-activedescendant", pop.id + "-" + choix);
      const a = liste.children[choix];
      if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest" });
    };
    const proposer = () => {
      if (!opts.completion || !MH.completion || ta.selectionStart !== ta.selectionEnd) return fermer();
      const r = MH.completion.suggerer(ta.value, ta.selectionStart, opts);
      if (!r) return fermer();
      sug = r; choix = 0; pop.hidden = false;
      dessiner(); placer();
    };
    const inserer = () => {
      const it = sug.items[choix], de = sug.de, a = sug.a;
      fermer();
      ta.focus();
      ta.setSelectionRange(de, a);
      insertion = true;
      // insertText garde l'annulation (Ctrl+Z) ; sinon, on remplace et on prévient.
      const ok = document.execCommand && document.execCommand("insertText", false, it.texte);
      if (!ok || ta.value.slice(de, de + it.texte.length) !== it.texte) {
        ta.setRangeText(it.texte, de, a, "end");
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      }
      insertion = false;
      ta.setSelectionRange(de + it.curseur, de + it.curseur);
    };
    ta.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== ta) fermer(); }, 120));
    ta.addEventListener("click", fermer);

    ta.addEventListener("input", () => { sync(); onChange && onChange(ta.value); if (!insertion) proposer(); });
    ta.addEventListener("scroll", () => { hl.scrollLeft = ta.scrollLeft; if (sug) placer(); });
    ta.addEventListener("keydown", (e) => {
      if (sug && !pop.hidden) {
        const n = sug.items.length;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          choix = (choix + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
          dessiner();
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); inserer(); return; }
        if (e.key === "Escape") { e.preventDefault(); fermer(); return; }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") fermer();
      }
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

  /* ---------- Dossier virtuel : images et pages de l'étudiant ----------
     Un seul dossier pour tout le manuel, comme le dossier de travail en TP :
     les images de « Mes images » et les pages du projet « Mon site ».
     Les fichiers restent dans le navigateur (IndexedDB) : rien n'est envoyé. */

  const Dossier = (() => {
    const files = new Map(); // chemin -> { blob, url, w, h } pour une image, { blob, texte } pour une page
    const IMAGE = /\.(gif|jpe?g|png|webp|svg|bmp)$/i;
    const typeTexte = (chemin) => /\.css$/i.test(chemin) ? "text/css" : /\.html?$/i.test(chemin) ? "text/html" : "text/plain";
    const estImage = (chemin, blob) => (blob && /^image\//.test(blob.type)) || IMAGE.test(chemin);
    const subs = new Set();
    const LIMITE = 5 * 1024 * 1024;
    let db = null, persistant = true, persistantErreur = false;
    // Révision partagée : chaque écriture la change, les autres onglets le voient (événement storage).
    const toucher = () => { try { localStorage.setItem("mh:rev", Date.now() + "-" + Math.random().toString(36).slice(2, 7)); } catch (e) { /* stockage local indisponible */ } };
    const notify = () => subs.forEach((f) => { try { f(); } catch (e) { /* un abonné cassé n'arrête pas les autres */ } });
    const measure = (rec) => new Promise((ok) => {
      const i = new Image();
      i.onload = () => { rec.w = i.naturalWidth; rec.h = i.naturalHeight; ok(); };
      i.onerror = () => ok();
      i.src = rec.url;
    });
    const put = (path, blob, texte) => {
      const old = files.get(path);
      if (old && old.url) URL.revokeObjectURL(old.url);
      if (!estImage(path, blob)) {
        const rec = { blob, texte: texte != null ? texte : "" };
        files.set(path, rec);
        return texte != null ? Promise.resolve() : blob.text().then((t) => { rec.texte = t; }, () => {});
      }
      const rec = { blob, url: URL.createObjectURL(blob), w: 0, h: 0 };
      files.set(path, rec);
      return measure(rec);
    };
    // Écrit dans IndexedDB et attend que l'écriture soit vraiment terminée.
    const tx = (fn) => new Promise((ok) => {
      if (!db) return ok(false);
      try {
        const t = db.transaction("fichiers", "readwrite");
        t.oncomplete = () => ok(true);
        t.onerror = t.onabort = () => ok(false);
        fn(t.objectStore("fichiers"));
      } catch (e) { ok(false); /* stockage plein ou bloqué */ }
    });
    const ready = new Promise((ok) => {
      try {
        const rq = indexedDB.open("manuel-html", 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore("fichiers", { keyPath: "path" });
        rq.onerror = () => { persistant = false; ok(); };
        rq.onblocked = () => { persistant = false; ok(); };
        rq.onsuccess = () => {
          db = rq.result;
          try {
            const all = db.transaction("fichiers").objectStore("fichiers").getAll();
            all.onsuccess = () => Promise.all((all.result || []).map((r) => put(r.path, r.blob))).then(ok, ok);
            all.onerror = () => ok();
          } catch (e) { ok(); }
        };
      } catch (e) { persistant = false; ok(); }
    }).then(() => notify());
    const clean = (p) => (p || "").replace(/\\/g, "/").replace(/^\.?\/+/, "").replace(/\/{2,}/g, "/").trim();

    return {
      ready, LIMITE,
      get persistant() { return persistant; },
      get size() { return files.size; },
      list(opts) {
        const type = (opts && opts.type) || "tout";
        return [...files.entries()]
          .filter(([path, r]) => type === "tout" || (type === "image") === estImage(path, r.blob))
          .sort((a, b) => a[0].localeCompare(b[0])).map(([path, r]) => Object.assign({ path }, r));
      },
      chemins() { return [...files.keys()].sort(); },
      rev() { try { return localStorage.getItem("mh:rev") || ""; } catch (e) { return ""; } },
      estImage(chemin) { const r = files.get(chemin); return estImage(chemin, r && r.blob); },
      lire(chemin) { const r = files.get(chemin); return r && !estImage(chemin, r.blob) ? r.texte : null; },
      async ecrire(chemin, texte) {
        chemin = clean(chemin);
        const blob = new Blob([texte], { type: typeTexte(chemin) + ";charset=utf-8" });
        toucher();
        await put(chemin, blob, texte);
        const ok = await tx((s) => s.put({ path: chemin, blob }));
        if (db && !ok) persistantErreur = true;
        notify();
        return ok;
      },
      async vider() {
        files.forEach((r) => { if (r.url) URL.revokeObjectURL(r.url); });
        files.clear();
        await tx((s) => s.clear());
        notify();
      },
      get erreurEcriture() { return persistantErreur; },
      on(f) { subs.add(f); },
      off(f) { subs.delete(f); },
      async add(file, path) {
        if (!/^image\//.test(file.type)) return "« " + file.name + " » n'est pas une image.";
        if (file.size > LIMITE) return "« " + file.name + " » est trop lourde (plus de 5 Mo). Réduisez-la d'abord.";
        path = clean(path || file.name);
        toucher();
        await put(path, file);
        await tx((s) => s.put({ path, blob: file }));
        notify();
        return null;
      },
      remove(path) {
        const r = files.get(path);
        if (!r) return;
        if (r.url) URL.revokeObjectURL(r.url);
        toucher();
        files.delete(path);
        tx((s) => s.delete(path));
        notify();
      },
      rename(oldP, newP) {
        newP = clean(newP);
        if (!newP || newP.endsWith("/")) return "Le nom ne peut pas être vide.";
        if (newP === oldP) return null;
        if (files.has(newP)) return "Un fichier « " + newP + " » existe déjà.";
        const r = files.get(oldP);
        if (!r) return null;
        toucher();
        files.delete(oldP);
        files.set(newP, r);
        tx((s) => { s.delete(oldP); s.put({ path: newP, blob: r.blob }); });
        notify();
        return null;
      },
      // Trouve le fichier visé par SRC, comme le ferait un navigateur depuis une page à la racine.
      resolve(src, depuis) {
        const r = MH.outils.resoudreChemin(src, depuis || "", [...files.keys()]);
        if (r.fichier) return { fichier: files.get(r.fichier), path: r.fichier };
        if (r.chemin != null) r.path = r.chemin;
        return r;
      },
    };
  })();

  const poids = (n) => n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + " Ko" : (n / 1024 / 1024).toFixed(1).replace(".", ",") + " Mo";

  /* ---------- Aperçu : un faux navigateur qui affiche le code ---------- */

  const PREVIEWS = new Set();
  // Ce dont dépend une page en mode site : la liste des images et le contenu des feuilles .css.
  const imagesSig = () => Dossier.list({ type: "image" }).map((f) => f.path).join(",") + "|" +
    Dossier.list({ type: "texte" }).filter((f) => /\.css$/i.test(f.path)).map((f) => f.path + ":" + f.texte).join("¦");
  Dossier.on(() => PREVIEWS.forEach((p) => {
    if (!p.node.isConnected) { PREVIEWS.delete(p); return; }
    p.refresh();
  }));

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
    // Mode site (atelier) : plusieurs pages du dossier, barre d'adresse et bouton Retour.
    const site = !!opts.site;
    let page = opts.page || "index.html", lastSig = null, feuillesManquantes = [];
    const historique = [];
    const adresse = el("span", "apercu-adresse");
    const btnRetour = el("button", "md-button apercu-btn apercu-retour",
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Retour</span>');
    btnRetour.type = "button";
    btnRetour.setAttribute("aria-label", "Revenir à la page précédente");
    btnRetour.hidden = true;
    if (site) { box.classList.add("apercu-site"); tab.after(adresse); actions.prepend(btnRetour); }
    const frame = el("iframe", "apercu-cadre");
    frame.setAttribute("title", "Rendu du code dans le navigateur");
    frame.setAttribute("loading", "lazy");
    const note = el("div", "apercu-note");
    note.setAttribute("role", "status");
    note.hidden = true;

    // Bouton et panneau « Mes images » (visibles quand le code contient une image)
    const btnImg = el("button", "md-button apercu-btn apercu-btn-img", ICON.folder + "<span>Mes images</span><b class=\"apercu-compte\"></b>");
    btnImg.type = "button";
    btnImg.setAttribute("aria-expanded", "false");
    btnImg.hidden = true;
    actions.append(btnImg);
    const panel = el("div", "dossier");
    panel.hidden = true;
    panel.id = "dossier-" + Math.random().toString(36).slice(2, 8);
    btnImg.setAttribute("aria-controls", panel.id);
    box.append(bar, panel, frame, note);

    let redirect = null, last = null;
    const showNote = (html) => { note.innerHTML = html; note.hidden = false; };

    const openPanel = (open) => {
      panel.hidden = !open;
      btnImg.setAttribute("aria-expanded", String(open));
      btnImg.classList.toggle("actif", open);
    };
    btnImg.addEventListener("click", () => openPanel(panel.hidden));

    async function addFiles(list) {
      const msgs = [];
      for (const f of [...list]) { const err = await Dossier.add(f); if (err) msgs.push(err); }
      openPanel(true);
      const m = panel.querySelector(".dossier-msg");
      if (m) m.textContent = msgs.join(" ");
    }

    function drawPanel() {
      const files = Dossier.list({ type: "image" });
      const compte = btnImg.querySelector(".apercu-compte");
      compte.textContent = files.length ? String(files.length) : "";
      const keepMsg = panel.querySelector(".dossier-msg") ? panel.querySelector(".dossier-msg").textContent : "";
      panel.innerHTML =
        '<div class="dossier-tete"><b>Dossier de votre page</b><span>' +
        (Dossier.persistant ? "Vos images restent sur cet appareil, rien n'est envoyé." : "Navigation privée : vos images seront oubliées en fermant la page.") +
        "</span></div>";
      const ul = el("ul", "dossier-liste");
      if (!files.length) {
        panel.append(el("p", "dossier-vide", "Aucune image pour l'instant. Ajoutez une photo, puis écrivez son nom dans <code>SRC</code>, par exemple <code>&lt;IMG SRC=\"moi.jpg\"&gt;</code>."));
      }
      files.forEach((f) => {
        const li = el("li", "dossier-fichier");
        const th = el("img", "dossier-vignette");
        th.src = f.url; th.alt = "";
        const champ = el("input", "dossier-nom");
        champ.type = "text"; champ.value = f.path; champ.spellcheck = false;
        champ.setAttribute("aria-label", "Nom du fichier " + f.path + " (ajoutez images/ devant pour le ranger dans un dossier)");
        const lourd = f.blob.size > 500 * 1024;
        const meta = el("span", "dossier-meta" + (lourd ? " lourd" : ""),
          (f.w ? f.w + " × " + f.h + " px · " : "") + poids(f.blob.size) + (lourd ? " · lourde pour le Web" : ""));
        const renommer = () => {
          const err = Dossier.rename(f.path, champ.value);
          if (err) { champ.value = f.path; const m = panel.querySelector(".dossier-msg"); if (m) m.textContent = err; }
        };
        champ.addEventListener("change", renommer);
        champ.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); champ.blur(); } });
        const copier = el("button", "dossier-ico", ICON.copy);
        copier.type = "button";
        copier.title = "Copier la balise IMG";
        copier.setAttribute("aria-label", "Copier la balise IMG de " + f.path);
        copier.addEventListener("click", () => {
          const tag = '<IMG SRC="' + f.path + '" ALT="">';
          const m = panel.querySelector(".dossier-msg");
          const done = () => { if (m) m.textContent = "Copié : " + tag; };
          if (navigator.clipboard) navigator.clipboard.writeText(tag).then(done, () => { if (m) m.textContent = tag; });
          else if (m) m.textContent = tag;
        });
        const suppr = el("button", "dossier-ico", ICON.trash);
        suppr.type = "button";
        suppr.title = "Retirer cette image";
        suppr.setAttribute("aria-label", "Retirer " + f.path + " du dossier");
        suppr.addEventListener("click", () => Dossier.remove(f.path));
        const txt = el("div", "dossier-txt");
        txt.append(champ, meta);
        li.append(th, txt, copier, suppr);
        ul.append(li);
      });
      if (files.length) panel.append(ul);
      const act = el("div", "dossier-actions");
      const lab = el("label", "md-button dossier-ajout", ICON.plus + "<span>Ajouter des images</span>");
      const input = el("input", "dossier-input");
      input.type = "file"; input.accept = "image/*"; input.multiple = true;
      input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
      lab.append(input);
      act.append(lab, el("span", "dossier-astuce", "ou glissez-les sur le rendu. Pour un sous-dossier, renommez : <code>images/moi.jpg</code>"));
      panel.append(act);
      const msg = el("p", "dossier-msg");
      msg.setAttribute("role", "status");
      msg.textContent = keepMsg;
      panel.append(msg);
    }

    // Glisser-déposer sur l'aperçu
    const isFileDrag = (e) => e.dataTransfer && [...(e.dataTransfer.types || [])].includes("Files");
    box.addEventListener("dragover", (e) => { if (isFileDrag(e)) { e.preventDefault(); box.classList.add("depot"); } });
    box.addEventListener("dragleave", (e) => { if (!box.contains(e.relatedTarget)) box.classList.remove("depot"); });
    box.addEventListener("drop", (e) => { if (!isFileDrag(e)) return; e.preventDefault(); box.classList.remove("depot"); addFiles(e.dataTransfer.files); });

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
      // Images : on cherche d'abord dans le dossier de l'étudiant
      const soucis = [];
      d.querySelectorAll("img").forEach((img) => {
        const fail = () => { if (!img.dataset.placeholder) placeholderImage(img); };
        img.addEventListener("error", fail);
        img.addEventListener("load", fit);
        const src = img.getAttribute("src");
        const r = Dossier.resolve(src, site ? page : "");
        if (r.fichier) { img.src = r.fichier.url; return; }
        if (r.casse) soucis.push("<code>" + esc(src) + "</code> introuvable, mais <code>" + esc(r.casse) + "</code> existe : attention aux majuscules et minuscules.");
        else if (r.dehors) soucis.push("<code>" + esc(src) + "</code> remonte au-dessus du dossier de la page : il y a un <code>../</code> de trop.");
        else if (r.disque) soucis.push("<code>" + esc(src) + "</code> pointe vers un disque dur : ce chemin ne marcherait que sur un seul ordinateur. Utilisez un chemin relatif.");
        else if (r.absent && r.proche) soucis.push("<code>" + esc(src) + "</code> n'est pas dans votre dossier. Vouliez-vous dire <code>" + esc(r.proche) + "</code> ?");
        else if (r.absent && Dossier.list({ type: "image" }).length) soucis.push("<code>" + esc(src) + "</code> n'est pas dans votre dossier.");
        else if (r.vide) soucis.push("Une balise <code>&lt;IMG&gt;</code> n'a pas d'attribut <code>SRC</code>.");
        if (!r.externe) fail();
        else if (img.complete && img.naturalWidth === 0) fail();
      });
      d.querySelectorAll("[background]").forEach((n) => {
        const src = n.getAttribute("background");
        const r = Dossier.resolve(src, site ? page : "");
        if (r.fichier) n.setAttribute("background", r.fichier.url);
        else if (r.casse) soucis.push("Fond <code>" + esc(src) + "</code> introuvable, mais <code>" + esc(r.casse) + "</code> existe : attention aux majuscules.");
        else if (!r.externe && Dossier.list({ type: "image" }).length) soucis.push("Image de fond <code>" + esc(src) + "</code> absente de votre dossier.");
      });
      feuillesManquantes.forEach((h) => soucis.push("Feuille de style <code>" + esc(h) + "</code> introuvable dans ton dossier."));
      if (soucis.length) showNote(soucis.join("<br>"));
      // Déposer une image directement dans le rendu
      d.addEventListener("dragover", (e) => { if (isFileDrag(e)) { e.preventDefault(); box.classList.add("depot"); } });
      d.addEventListener("dragleave", () => box.classList.remove("depot"));
      d.addEventListener("drop", (e) => { if (!isFileDrag(e)) return; e.preventDefault(); box.classList.remove("depot"); addFiles(e.dataTransfer.files); });
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
        if (site && !/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) {
          const r = Dossier.resolve(href, page);
          if (r.fichier && /\.html?$/i.test(r.path)) { api.ouvrir(r.path, true); return; }
          if (r.fichier) return showNote("Ce lien ouvrirait le fichier <code>" + esc(r.path) + "</code>.");
          if (r.casse) return showNote("<code>" + esc(href) + "</code> n'existe pas, mais <code>" + esc(r.casse) + "</code> oui : attention aux majuscules et minuscules.");
          if (r.dehors) return showNote("<code>" + esc(href) + "</code> remonte au-dessus du dossier du site : il y a un <code>../</code> de trop.");
          return showNote("Cette page n'existe pas dans ton dossier : <code>" + esc(href) + "</code>." + (r.proche ? " Voulais-tu dire <code>" + esc(r.proche) + "</code> ?" : ""));
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

    const api = {
      node: box, actions,
      refresh() {
        if (site) {
          // Ne recharge que si la page ou les images ont changé (évite un clignotement à chaque sauvegarde).
          const t = Dossier.lire(page);
          if (t != null && t + "|" + imagesSig() !== lastSig) api.render(t);
          return;
        }
        drawPanel();
        if (last != null) api.render(last);
      },
      ouvrir(chemin, empiler) {
        if (empiler && chemin !== page) historique.push(page);
        page = chemin;
        adresse.textContent = chemin;
        btnRetour.hidden = !historique.length;
        const t = Dossier.lire(chemin);
        api.render(t == null ? "" : t);
        if (t == null) showNote("Cette page n'existe pas dans ton dossier : <code>" + esc(chemin) + "</code>.");
        if (opts.onNavigate) opts.onNavigate(chemin);
      },
      get page() { return page; },
      render(src) {
        last = src;
        lastSig = src + "|" + imagesSig();
        const aDesImages = /<img\b|\bbackground\s*=/i.test(src);
        btnImg.hidden = !aDesImages || site;
        if (!aDesImages) openPanel(false);
        if (!panel.dataset.dessine) { panel.dataset.dessine = "1"; drawPanel(); }
        note.hidden = true;
        redirect = null;
        const clean = src.replace(/<meta[^>]*http-equiv\s*=\s*["'‘’"]*refresh[^>]*>/gi, (tag) => {
          const c = /content\s*=\s*["'‘’"]*\s*(\d+)\s*;\s*url\s*=\s*([^"'‘’">]+)/i.exec(tag);
          redirect = c ? { delay: c[1], url: c[2].trim() } : { delay: "?", url: "?" };
          return "";
        });
        feuillesManquantes = [];
        frame.srcdoc = !site ? clean : clean.replace(/<link\b[^>]*>/gi, (tag) => {
          if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
          const m = /href\s*=\s*["']?([^"'\s>]+)/i.exec(tag);
          if (!m) return tag;
          const r = MH.outils.resoudreChemin(m[1], page, Dossier.chemins());
          if (r.fichier) return "<style>" + (Dossier.lire(r.fichier) || "") + "</style>";
          feuillesManquantes.push(m[1]);
          return "";
        });
      },
    };
    btnRetour.addEventListener("click", () => { const prev = historique.pop(); if (prev) api.ouvrir(prev, false); });
    if (site) adresse.textContent = page;
    PREVIEWS.add(api);
    return api;
  }


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

  Object.assign(MH, { el, esc, store, debounce, ICON, highlight, makeEditor, makePreview, placeholderImage, Dossier, poids, parse, norm, T });
})();

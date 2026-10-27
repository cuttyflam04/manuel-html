/* Lanceur de tests navigateur. Ouvrir /manuel-html/_tests/ avec `mkdocs serve`.
   ?fichiers=a.js,b.js limite les fichiers ; ?filtre=mot limite les tests par nom. */
(function () {
  "use strict";
  const FICHIERS = ["regression.js", "dossier.js", "apercu-site.js", "sites.js", "etapes.js", "atelier.js", "atelier-fichiers.js", "atelier-mobile.js"];
  const tests = [];
  const sortie = document.getElementById("resultats");
  const etat = document.getElementById("etat");
  const params = new URLSearchParams(location.search);
  const fichiers = (params.get("fichiers") || FICHIERS.join(",")).split(",").filter(Boolean);
  const filtre = params.get("filtre");

  window.test = (nom, fn) => tests.push({ nom, fn });
  window.attendre = (condition, message) => { if (!condition) throw new Error(message || "condition fausse"); };
  window.pause = (ms) => new Promise((r) => setTimeout(r, ms));

  // Charge une page du manuel dans un cadre invisible de même origine.
  window.charger = async (chemin, opts) => {
    opts = opts || {};
    // Une seule page à la fois : chaque page du manuel contient elle-même des dizaines d'aperçus.
    document.querySelectorAll(".cadre-test").forEach((x) => x.remove());
    const f = document.createElement("iframe");
    f.className = "cadre-test";
    f.style.cssText = `position:fixed;left:-6000px;top:0;width:${opts.largeur || 1280}px;height:${opts.hauteur || 900}px;border:0`;
    document.body.append(f);
    const [sansAncre, ancre] = chemin.split("#");
    const url = "../" + sansAncre + (sansAncre.includes("?") ? "&" : "?") + "t=" + Date.now() + (ancre ? "#" + ancre : "");
    await new Promise((ok) => { f.onload = ok; f.src = url; });
    const win = f.contentWindow, doc = f.contentDocument;
    for (let i = 0; i < 60 && !(doc.querySelector(".md-content") && win.MH_EXERCICES); i++) await pause(50);
    await pause(opts.attente || 700);
    return { win, doc, frame: f };
  };

  // Outils communs : contraste et états forcés (survol / focus) pour les tests visuels.
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  window.rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return cv.getImageData(0, 0, 1, 1).data; };
  const L = (d) => { const [r, g, b] = [d[0], d[1], d[2]].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  window.contraste = (a, b) => { const A = L(a), B = L(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
  window.fondDe = (el, win) => { let e = el, bg = rgba(win.getComputedStyle(e).backgroundColor); while (bg[3] < 128 && e.parentElement) { e = e.parentElement; bg = rgba(win.getComputedStyle(e).backgroundColor); } return bg[3] < 128 ? rgba("#fff") : bg; };
  window.figerEtats = (doc) => {
    const st = doc.createElement("style"); st.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"; doc.head.append(st);
    const extra = doc.createElement("style"); let txt = "";
    for (const sh of doc.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      const walk = (rs, wrap) => { for (const r of rs) {
        if (r.cssRules && r.media) { walk(r.cssRules, "@media " + r.media.mediaText); continue; }
        if (r.selectorText && /:hover|:focus(?![-\w])/.test(r.selectorText)) {
          const t = r.selectorText.replace(/:hover/g, ".fh").replace(/:focus(?![-\w])/g, ".ff") + "{" + r.style.cssText + "}";
          txt += wrap ? wrap + "{" + t + "}" : t;
        } } };
      walk(rules);
    }
    extra.textContent = txt; doc.head.append(extra);
  };
  window.appliquerStyle = (doc, style, schema) => {
    if (style === "classique") doc.documentElement.removeAttribute("data-mh-style"); else doc.documentElement.setAttribute("data-mh-style", style);
    doc.body.setAttribute("data-md-color-scheme", schema);
    void doc.body.offsetHeight;
  };
  window.STYLES = ["classique", "sousverre", "carrapide", "notice"];
  window.SCHEMAS = ["default", "slate"];

  const charge = (src) => new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src + "?t=" + Date.now(); s.onload = ok; s.onerror = () => ko(new Error("introuvable : " + src)); document.body.append(s); });

  (async () => {
    const lignes = [], echecs = [];
    let ok = 0;
    try { for (const f of fichiers) await charge(f); } catch (e) { echecs.push(e.message); }
    for (const t of tests) {
      if (filtre && !t.nom.includes(filtre)) continue;
      try { await t.fn(); ok++; lignes.push('<span class="ok">OK</span> ' + t.nom); }
      catch (e) { echecs.push(t.nom + " : " + e.message); lignes.push('<span class="ko">ÉCHEC</span> ' + t.nom + " : " + e.message); }
      document.querySelectorAll(".cadre-test").forEach((f) => f.remove());
      sortie.innerHTML = lignes.join("\n");
    }
    window.__resultats = { ok, echecs };
    etat.textContent = echecs.length ? echecs.length + " échec(s), " + ok + " réussi(s)" : "Tout est vert : " + ok + " test(s)";
    etat.className = echecs.length ? "ko" : "ok";
  })();
})();

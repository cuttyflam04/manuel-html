/* Filet de non-régression : ce qui marche aujourd'hui doit continuer de marcher. */

const PAGES = ["", "manuel/", "manuel/chapitre1/", "manuel/chapitre2/", "manuel/chapitre3/", "manuel/chapitre4/",
  "manuel/chapitre5/", "manuel/chapitre6/", "manuel/chapitre7/", "manuel/chapitre8/", "manuel/bonus-formulaires/",
  "manuel/annexes/annexe-a/", "manuel/annexes/annexe-b/", "manuel/annexes/annexe-c/", "about/"];

test("exercices : chaque solution valide ses vérifications", async () => {
  const { win } = await charger("manuel/chapitre1/");
  // Copie de T : MH.T n'existe qu'après le découpage (tâche 2).
  const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const T = {
    n: (d, s) => d.querySelectorAll(s).length,
    txt: (d, s, m) => [...d.querySelectorAll(s)].some((e) => norm(e.textContent).includes(norm(m))),
    attr: (d, s, n, v) => [...d.querySelectorAll(s)].some((e) => e.hasAttribute(n) && (v == null || norm(e.getAttribute(n)) === norm(String(v)))),
    ferme: (src, t) => { const o = (src.match(new RegExp("<" + t + "(\\s|>)", "gi")) || []).length; const f = (src.match(new RegExp("</" + t + "\\s*>", "gi")) || []).length; return o > 0 && o === f; },
  };
  const ex = win.MH_EXERCICES;
  attendre(Object.keys(ex).length === 19, "19 exercices attendus, trouvé " + Object.keys(ex).length);
  const fautes = [];
  for (const [id, e] of Object.entries(ex)) {
    const s = e.solution.trim(), d = new DOMParser().parseFromString(s, "text/html");
    e.checks.forEach((c) => { let ok = false; try { ok = c.ok(d, s, T); } catch (err) { ok = false; } if (!ok) fautes.push(id + " / " + c.label.replace(/<[^>]+>/g, "").slice(0, 40)); });
  }
  attendre(!fautes.length, fautes.join(" ; "));
});

test("encadrés : icônes et textes alignés", async () => {
  const { doc, win } = await charger("manuel/chapitre5/");
  const fautes = [];
  for (const st of STYLES) {
    appliquerStyle(doc, st, "default");
    const icones = new Set(), textes = new Set();
    doc.querySelectorAll(".md-content .admonition").forEach((ad) => {
      const A = ad.getBoundingClientRect(), bw = parseFloat(win.getComputedStyle(ad).borderLeftWidth);
      const x = (v) => Math.round(v - A.left - bw);
      const t = ad.querySelector(":scope > .admonition-title"); if (!t) return;
      const ib = win.getComputedStyle(t, "::before"), T = t.getBoundingClientRect();
      icones.add(x(T.left + parseFloat(ib.left)));
      const r = doc.createRange(); r.selectNodeContents(t); textes.add(x([...r.getClientRects()][0].left));
      const leg = ad.querySelector(".apercu-legende");
      if (leg) { icones.add(x(leg.querySelector("svg").getBoundingClientRect().left)); textes.add(x(leg.querySelector("span").getBoundingClientRect().left)); }
      const code = ad.querySelector(".highlight pre > code");
      if (code) { const rc = doc.createRange(); rc.selectNodeContents(code.querySelector("span:not(:empty)") || code); textes.add(x([...rc.getClientRects()][0].left)); icones.add(x(code.getBoundingClientRect().left)); }
      const pts = ad.querySelector(".apercu-points"); if (pts) textes.add(x(pts.getBoundingClientRect().left));
    });
    const ecart = (s) => Math.max(...s) - Math.min(...s);
    if (ecart(icones) > 1) fautes.push(st + " icônes " + [...icones].join(","));
    if (ecart(textes) > 1) fautes.push(st + " textes " + [...textes].join(","));
  }
  attendre(!fautes.length, fautes.join(" ; "));
});

test("boutons : contraste ≥ 4.5 dans tous les états", async () => {
  const fautes = [];
  for (const p of ["", "manuel/chapitre3/", "manuel/chapitre6/", "manuel/chapitre7/"]) {
    const { doc, win } = await charger(p);
    figerEtats(doc);
    doc.querySelectorAll(".admonition.example .apercu-actions .md-button:not([hidden]):not(.apercu-btn-img)").forEach((b, i) => { if (i < 2) b.click(); });
    const sol = doc.querySelector(".exo-solution"); if (sol) sol.open = true;
    const mb = doc.querySelector(".mh-style-btn"); if (mb) mb.click();
    await pause(200);
    for (const st of STYLES) for (const sch of SCHEMAS) {
      appliquerStyle(doc, st, sch);
      const vus = new Set();
      for (const b of [...doc.querySelectorAll(".md-content .md-button, .md-content .quiz-opt, .mh-style-opt")].filter((b) => b.offsetParent)) {
        const sorte = b.className + "|" + b.textContent.trim().slice(0, 20); if (vus.has(sorte)) continue; vus.add(sorte);
        for (const etat of ["normal", "focus", "survol", "focus+survol"]) {
          b.classList.toggle("ff", etat.includes("focus")); b.classList.toggle("fh", etat.includes("survol"));
          const r = contraste(rgba(win.getComputedStyle(b).color), fondDe(b, win));
          if (r < 4.5) fautes.push(`${st}/${sch} ${p || "accueil"} « ${b.textContent.trim().slice(0, 18)} » ${etat} ${r.toFixed(1)}`);
          b.classList.remove("ff", "fh");
        }
      }
    }
  }
  attendre(!fautes.length, fautes.slice(0, 8).join(" ; "));
});

test("mobile : aucun débordement à 375 px", async () => {
  const fautes = [];
  for (const p of PAGES) {
    const { doc } = await charger(p, { largeur: 375, hauteur: 812, attente: 500 });
    for (const st of STYLES) for (const sch of SCHEMAS) {
      appliquerStyle(doc, st, sch);
      if (doc.documentElement.scrollWidth > 376) fautes.push(`${p || "accueil"} ${st}/${sch} ${doc.documentElement.scrollWidth}px`);
    }
  }
  attendre(!fautes.length, fautes.slice(0, 8).join(" ; "));
});

test("mes images : la photo s'affiche et les chemins faux sont expliqués", async () => {
  const { doc, win } = await charger("manuel/chapitre6/");
  const D = win.MH.Dossier;
  await D.ready;
  D.list().forEach((f) => D.remove(f.path));
  const c = doc.createElement("canvas"); c.width = 64; c.height = 48;
  const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg"));
  attendre(!(await D.add(new win.File([blob], "moi.jpg", { type: "image/jpeg" }))), "ajout refusé");
  await pause(600);
  const ad = [...doc.querySelectorAll(".admonition.example")].find((a) => a.textContent.includes("6.1"));
  const etat = () => ({ img: ad.querySelector("iframe").contentDocument.querySelector("img"), note: ad.querySelector(".apercu-note") });
  attendre(etat().img.src.startsWith("blob:"), "moi.jpg ne s'affiche pas");
  D.rename("moi.jpg", "images/moi.jpg"); await pause(600);
  attendre(/Vouliez-vous dire/.test(etat().note.textContent), "pas de suggestion : " + etat().note.textContent);
  const resultats = {
    majuscule: D.resolve("images/Moi.jpg").casse === "images/moi.jpg",
    remonte: !!D.resolve("../images/moi.jpg").dehors,
    disque: !!D.resolve("D:/cours/moi.jpg").disque,
    bon: !!D.resolve("images/moi.jpg").fichier,
  };
  D.remove("images/moi.jpg");
  attendre(Object.values(resultats).every(Boolean), JSON.stringify(resultats));
});

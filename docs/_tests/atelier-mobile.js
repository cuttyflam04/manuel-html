/* Atelier sur téléphone et accessibilité (tâche 10). */

async function clubMobile() {
  await creerClub();
  return charger("manuel/projet/", { largeur: 375, hauteur: 812 });
}
const visible = (n) => !!n && n.offsetParent !== null && n.getBoundingClientRect().height > 0;

test("mobile : onglets Consigne · Code · Rendu, un seul panneau visible", async () => {
  const { doc, win } = await clubMobile();
  const nav = doc.querySelector('.atelier-mobile[role="tablist"]');
  attendre(nav, "barre d'onglets absente");
  const tabs = [...nav.querySelectorAll('[role="tab"]')].map((b) => b.textContent.trim()).join(",");
  attendre(tabs === "Consigne,Code,Rendu", "onglets : " + tabs);
  const panneaux = () => ({ consigne: visible(doc.querySelector(".atelier-guide")), code: visible(doc.querySelector(".atelier-editeur")), rendu: visible(doc.querySelector(".atelier-travail figure.apercu")) });
  let p = panneaux();
  attendre(p.consigne && !p.code && !p.rendu, "au départ : " + JSON.stringify(p));
  [...nav.querySelectorAll('[role="tab"]')].find((b) => /Rendu/.test(b.textContent)).click();
  await pause(150);
  p = panneaux();
  attendre(!p.consigne && !p.code && p.rendu, "après Rendu : " + JSON.stringify(p));
  attendre(nav.querySelector('[aria-selected="true"]').textContent.trim() === "Rendu", "aria-selected");
});

test("mobile : pas de débordement dans les 4 styles", async () => {
  const { doc } = await clubMobile();
  const fautes = [];
  for (const vue of ["Consigne", "Code", "Rendu"]) {
    [...doc.querySelectorAll('.atelier-mobile [role="tab"]')].find((b) => b.textContent.trim() === vue).click();
    await pause(100);
    for (const st of STYLES) for (const sch of SCHEMAS) {
      appliquerStyle(doc, st, sch);
      if (doc.documentElement.scrollWidth > 376) fautes.push(`${vue} ${st}/${sch} ${doc.documentElement.scrollWidth}px`);
    }
  }
  attendre(!fautes.length, fautes.slice(0, 6).join(" ; "));
});

test("clavier : la frise est faite de boutons, l'étape conseillée est signalée", async () => {
  const { doc } = await creerClub();
  const etapes = [...doc.querySelectorAll(".atelier-frise .atelier-etape")];
  attendre(etapes.length === 7 && etapes.every((b) => b.tagName === "BUTTON" && b.getAttribute("aria-label")), "7 boutons étiquetés");
  attendre(doc.querySelectorAll('.atelier-frise [aria-current="step"]').length === 1, "une seule étape conseillée");
});

test("contraste : l'atelier reste lisible dans tous les états et styles", async () => {
  const { doc, win } = await creerClub();
  figerEtats(doc);
  doc.querySelector(".atelier-fichiers-btn").click();
  await pause(150);
  const fautes = [];
  for (const st of STYLES) for (const sch of SCHEMAS) {
    appliquerStyle(doc, st, sch);
    const vus = new Set();
    for (const b of [...doc.querySelectorAll(".atelier-app button, .atelier-app label.md-button, .atelier-checks li, .atelier-onglet")].filter((b) => b.offsetParent)) {
      const sorte = b.className + "|" + b.textContent.trim().slice(0, 16); if (vus.has(sorte)) continue; vus.add(sorte);
      for (const etat of ["normal", "focus", "survol"]) {
        b.classList.toggle("ff", etat === "focus"); b.classList.toggle("fh", etat === "survol");
        const r = contraste(rgba(win.getComputedStyle(b).color), fondDe(b, win));
        if (r < 4.5) fautes.push(`${st}/${sch} « ${b.textContent.trim().slice(0, 16)} » ${etat} ${r.toFixed(1)}`);
        b.classList.remove("ff", "fh");
      }
    }
  }
  attendre(!fautes.length, fautes.slice(0, 8).join(" ; "));
});

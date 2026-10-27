/* Interface de l'atelier sur PC (tâche 8). */

async function atelierNeuf() {
  let { win } = await charger("manuel/chapitre1/");
  await win.MH.Dossier.ready; await win.MH.Dossier.vider();
  win.localStorage.removeItem("mh:projet"); win.localStorage.removeItem("mh:brouillon");
  return charger("manuel/projet/");
}
async function creerClub() {
  const r = await atelierNeuf();
  const f = r.doc.querySelector(".atelier-depart");
  attendre(f, "écran de départ absent");
  f.querySelector('input[name="nom"]').value = "Club Info UAM";
  f.querySelector('input[name="modele"][value="club"]').checked = true;
  f.querySelector('button[type="submit"]').click();
  for (let i = 0; i < 30 && !r.doc.querySelector(".atelier-travail"); i++) await pause(100);
  await pause(400);
  return r;
}
async function taper(doc, win, chemin, texte) {
  const onglet = [...doc.querySelectorAll(".atelier-onglet")].find((o) => o.dataset.chemin === chemin);
  onglet.click(); await pause(150);
  const ta = doc.querySelector(".atelier-travail .editeur-ta");
  ta.value = texte; ta.dispatchEvent(new win.Event("input", { bubbles: true }));
}

test("atelier : premier passage, choix du modèle « club »", async () => {
  const { doc, win } = await creerClub();
  const chemins = win.MH.Dossier.chemins();
  attendre(["index.html", "activites.html", "contact.html"].every((c) => chemins.includes(c)), "pages créées : " + chemins);
  const onglets = [...doc.querySelectorAll(".atelier-onglet")].map((o) => o.dataset.chemin).join(",");
  attendre(onglets === "index.html,activites.html,contact.html", "onglets : " + onglets);
  attendre(/Club Info UAM/.test(doc.querySelector(".atelier-nom").textContent), "nom du site");
  const conseil = doc.querySelector('.atelier-etape[aria-current="step"]');
  attendre(conseil && conseil.dataset.n === "1", "l'étape 1 devrait être conseillée");
});

test("atelier : la vérification se coche pendant qu'on tape", async () => {
  const { doc, win } = await creerClub();
  const titres = { "index.html": "Accueil", "activites.html": "Activités", "contact.html": "Contact" };
  for (const [c, t] of Object.entries(titres)) {
    await taper(doc, win, c, `<!DOCTYPE html>\n<HTML>\n<HEAD><META CHARSET="utf-8"><TITLE>${t}</TITLE></HEAD>\n<BODY></BODY>\n</HTML>`);
  }
  let ok = false;
  for (let i = 0; i < 10 && !ok; i++) { await pause(100); const li = doc.querySelector('.atelier-checks li[data-id="titres"]'); ok = !!li && li.classList.contains("ok"); }
  attendre(ok, "la case « titres » ne s'est pas cochée en moins d'une seconde");
});

test("atelier : rien n'est perdu en quittant juste après avoir tapé", async () => {
  const { doc, win } = await creerClub();
  await taper(doc, win, "index.html", "<P>tapé à la dernière seconde</P>");
  win.dispatchEvent(new win.Event("pagehide"));
  const r = await charger("manuel/projet/");
  await r.win.MH.Dossier.ready; await pause(300);
  attendre(/dernière seconde/.test(r.win.MH.Dossier.lire("index.html") || ""), "texte perdu : " + r.win.MH.Dossier.lire("index.html"));
});

test("atelier : modifié dans un autre onglet → bandeau et Recharger", async () => {
  const { doc, win } = await creerClub();
  win.dispatchEvent(new win.StorageEvent("storage", { key: "mh:projet", newValue: "{}", storageArea: win.localStorage }));
  await pause(200);
  const b = doc.querySelector(".atelier-bandeau-onglet");
  attendre(b && !b.hidden && /autre onglet/.test(b.textContent), "bandeau absent");
  attendre([...b.querySelectorAll("button")].some((x) => /Recharger/.test(x.textContent)), "bouton Recharger absent");
});

test("atelier : #etape-5 ouvre l'étape 5", async () => {
  await creerClub();
  const { doc } = await charger("manuel/projet/#etape-5");
  await pause(300);
  const titre = doc.querySelector(".atelier-guide .atelier-etape-titre");
  attendre(titre && /Les images/.test(titre.textContent), "titre affiché : " + (titre && titre.textContent));
});

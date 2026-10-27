/* L'atelier relié au reste du manuel (tâche 11). */

async function avecProjet(reussies) {
  const { win } = await charger("manuel/chapitre1/");
  win.localStorage.setItem("mh:projet", JSON.stringify({ version: 1, nom: "Club Info UAM", modele: "club", base: ["index.html", "activites.html", "contact.html"], etapesReussies: reussies, ouverts: ["index.html"], actif: "index.html" }));
}

test("intégration : l'encadré du chapitre 5 montre l'étape 4 et mène à l'atelier", async () => {
  await avecProjet([1, 2, 4]);
  const { doc } = await charger("manuel/chapitre5/");
  const box = doc.querySelector('.etape-projet[data-etape="4"]');
  attendre(box, "encadré absent");
  attendre(/Réussie/.test(box.textContent), "état : " + box.textContent.trim().slice(0, 80));
  const a = box.querySelector("a");
  attendre(a && /projet\/#etape-4$/.test(a.getAttribute("href")), "lien : " + (a && a.getAttribute("href")));
  const { doc: d6 } = await charger("manuel/chapitre6/");
  attendre(/À faire/.test(d6.querySelector('.etape-projet[data-etape="5"]').textContent), "chapitre 6 : étape 5 à faire");
});

test("intégration : chaque chapitre 2 à 8 a son étape", async () => {
  const manquants = [];
  for (let c = 2; c <= 8; c++) {
    const { doc } = await charger("manuel/chapitre" + c + "/", { attente: 300 });
    if (!doc.querySelector('.etape-projet[data-etape="' + (c - 1) + '"]')) manquants.push(c);
  }
  attendre(!manquants.length, "chapitres sans encadré : " + manquants.join(", "));
});

test("intégration : l'accueil affiche « 3 / 7 étapes »", async () => {
  await avecProjet([1, 2, 3]);
  const { doc } = await charger("");
  const p = doc.querySelector('[data-progression="projet"]');
  attendre(p && /3 \/ 7 étapes/.test(p.textContent), "accueil : " + (p && p.textContent));
  const a = p.closest("a");
  attendre(a && /manuel\/projet\/$/.test(a.getAttribute("href")), "lien vers l'atelier");
});

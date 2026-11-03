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

test("atelier : un autre onglet a modifié les fichiers → bandeau, et plus aucune écriture ici", async () => {
  const { doc, win } = await creerClub();
  const avant = win.MH.Dossier.lire("index.html");
  win.dispatchEvent(new win.StorageEvent("storage", { key: "mh:rev", newValue: "x", storageArea: win.localStorage }));
  await pause(150);
  attendre(!doc.querySelector(".atelier-bandeau-onglet").hidden, "bandeau absent");
  await taper(doc, win, "index.html", "<P>écrit dans l'onglet périmé</P>");
  await pause(800);
  attendre(win.MH.Dossier.lire("index.html") === avant, "l'onglet périmé a écrasé le fichier");
});

test("atelier : une sauvegarde de secours périmée est ignorée", async () => {
  const { win } = await creerClub();
  await win.MH.Dossier.ecrire("index.html", "<P>version récente</P>");
  win.localStorage.setItem("mh:brouillon", JSON.stringify({ chemin: "index.html", texte: "<P>vieux brouillon</P>", rev: "ancienne" }));
  const r = await charger("manuel/projet/");
  await r.win.MH.Dossier.ready; await pause(400);
  attendre(r.win.MH.Dossier.lire("index.html") === "<P>version récente</P>", "le brouillon périmé a écrasé : " + r.win.MH.Dossier.lire("index.html"));
  attendre(!r.win.localStorage.getItem("mh:brouillon"), "brouillon non effacé");
});

test("suggestions : « <U » dans l'atelier propose <UL> avec son astuce, Entrée l'écrit", async () => {
  const { doc, win } = await creerClub();
  const ta = doc.querySelector(".atelier-travail .editeur-ta");
  ta.focus(); ta.value = "<BODY>\n<U"; ta.setSelectionRange(ta.value.length, ta.value.length);
  ta.dispatchEvent(new win.Event("input", { bubbles: true }));
  await pause(100);
  const pop = doc.querySelector(".atelier-travail .completion");
  attendre(pop && !pop.hidden, "liste de suggestions absente");
  const items = [...pop.querySelectorAll('[role="option"]')].map((li) => li.textContent);
  attendre(items.includes("<UL>"), "suggestions : " + items.join(" "));
  attendre(/Astuce/.test(pop.textContent), "astuce absente");
  // Choisir <UL> (flèches), puis Entrée
  for (let i = 0; i < items.indexOf("<UL>"); i++) ta.dispatchEvent(new win.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
  ta.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  await pause(100);
  attendre(ta.value === "<BODY>\n<UL></UL>", "texte : " + JSON.stringify(ta.value));
  attendre(ta.selectionStart === "<BODY>\n<UL>".length, "curseur mal placé : " + ta.selectionStart);
  attendre(pop.hidden, "la liste devrait se fermer");
});

test("suggestions : rien dans les exercices corrigés", async () => {
  const { doc, win } = await charger("manuel/chapitre4/");
  const ta = doc.querySelector(".exo .editeur-ta");
  ta.focus(); ta.value = "<U"; ta.setSelectionRange(2, 2);
  ta.dispatchEvent(new win.Event("input", { bubbles: true }));
  await pause(100);
  const pop = doc.querySelector(".exo .completion");
  attendre(!pop || pop.hidden, "l'exercice ne doit rien proposer");
});

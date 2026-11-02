/* Les 7 étapes du projet et leurs vérifications (tâche 7). */

async function evaluerSite(s) {
  const { win } = await charger("manuel/chapitre1/");
  attendre(win.MH.projet, "MH.projet absent");
  const chemins = [...Object.keys(s.textes), ...s.images];
  const site = win.MH.projet.analyser(s.textes, chemins, s.base);
  return { win, res: win.MH.projet.evaluer(site) };
}

test("étapes : 7 étapes, 4 modèles", async () => {
  const { win } = await charger("manuel/chapitre1/");
  attendre(win.MH.projet, "MH.projet absent");
  attendre(win.MH.projet.ETAPES.length === 7, "7 étapes attendues");
  const ids = win.MH.projet.MODELES.map((m) => m.id).join(",");
  attendre(ids === "perso,club,evenement,libre", "modèles : " + ids);
  const club = win.MH.projet.MODELES.find((m) => m.id === "club");
  attendre(club.pages.join(",") === "index.html,activites.html,contact.html", "pages du club : " + club.pages);
  const sq = club.squelette("Club Info UAM", "Accueil");
  attendre(/<!DOCTYPE html>/i.test(sq) && /<META CHARSET="utf-8">/i.test(sq) && /<TITLE><\/TITLE>/i.test(sq), "squelette de départ");
});

test("étapes : le site complet réussit les 7 étapes", async () => {
  const { res } = await evaluerSite(SITE_COMPLET);
  const ratees = [];
  res.forEach((e, i) => e.resultats.forEach((ok, j) => { if (!ok) ratees.push(`étape ${e.n} case ${j + 1}`); }));
  attendre(!ratees.length, ratees.join(", "));
  attendre(res.every((e) => e.reussie), "toutes les étapes devraient être réussies");
});

test("étapes : le site fautif échoue exactement sur ses 5 défauts", async () => {
  const { win, res } = await evaluerSite(SITE_FAUTIF);
  const E = win.MH.projet.ETAPES;
  const ratees = [];
  res.forEach((e, i) => e.resultats.forEach((ok, j) => { if (!ok) ratees.push(e.n + ":" + E[i].checks[j].id); }));
  const attendues = ["1:titres", "4:liens-casses", "5:alt", "6:grille", "7:classe"];
  attendre(ratees.join(" ") === attendues.join(" "), "échecs obtenus : " + ratees.join(" "));
});

test("étapes : aucune balise hors cours dans les consignes et exemples", async () => {
  const { win } = await charger("manuel/chapitre1/");
  const permises = new Set(("!DOCTYPE HTML HEAD TITLE META BODY P BR H1 H2 H3 H4 H5 H6 HR CENTER B I U EM STRONG BIG SMALL " +
    "SUP SUB FONT UL OL LI A IMG TABLE CAPTION TR TH TD STYLE LINK").split(" "));
  const hors = new Set();
  for (const e of win.MH.projet.ETAPES) {
    for (const m of (e.consigne + " " + e.exemple).matchAll(/<\/?(!?[A-Za-z][A-Za-z0-9]*)/g)) {
      if (!permises.has(m[1].toUpperCase())) hors.add(m[1]);
    }
  }
  attendre(!hors.size, "balises hors cours : " + [...hors].join(", "));
});

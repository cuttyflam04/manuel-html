/* Atelier : gestion des fichiers, export et import .zip (tâche 9). */

async function clubPret() {
  const r = await creerClub();
  r.doc.querySelector(".atelier-fichiers-btn").click();
  await pause(150);
  return r;
}
const ligne = (doc, chemin) => [...doc.querySelectorAll(".atelier-fichier")].find((l) => l.dataset.chemin === chemin);
const meta = (win) => JSON.parse(win.localStorage.getItem("mh:projet"));
const message = (doc) => (doc.querySelector(".atelier-message") || {}).textContent || "";

test("fichiers : renommer une page de base, les vérifications la suivent", async () => {
  const { doc, win } = await clubPret();
  const champ = ligne(doc, "index.html").querySelector(".atelier-fichier-nom");
  champ.value = "accueil.html"; champ.dispatchEvent(new win.Event("change"));
  await pause(300);
  attendre(meta(win).base[0] === "accueil.html", "base[0] = " + meta(win).base[0]);
  attendre(win.MH.Dossier.lire("accueil.html") != null && win.MH.Dossier.lire("index.html") == null, "fichier renommé");
  attendre([...doc.querySelectorAll(".atelier-onglet")].some((o) => o.dataset.chemin === "accueil.html"), "onglet renommé");
});

test("fichiers : supprimer une page liée, la confirmation liste les pages qui pointent vers elle", async () => {
  const { doc, win } = await clubPret();
  await win.MH.Dossier.ecrire("index.html", '<A HREF="contact.html">Contact</A>');
  await pause(200);
  let question = "";
  win.confirm = (q) => { question = q; return false; };
  ligne(doc, "contact.html").querySelector(".atelier-fichier-suppr").click();
  attendre(/index\.html/.test(question), "question posée : " + question);
  attendre(win.MH.Dossier.lire("contact.html") != null, "refusé : le fichier doit rester");
});

test("fichiers : nom déjà pris ou vide refusé", async () => {
  const { doc, win } = await clubPret();
  const champ = ligne(doc, "activites.html").querySelector(".atelier-fichier-nom");
  champ.value = "index.html"; champ.dispatchEvent(new win.Event("change"));
  await pause(200);
  attendre(/existe déjà/.test(message(doc)), "message : " + message(doc));
  attendre(win.MH.Dossier.lire("activites.html") != null, "l'ancien nom doit rester");
  const champ2 = ligne(doc, "activites.html").querySelector(".atelier-fichier-nom");
  champ2.value = "  "; champ2.dispatchEvent(new win.Event("change"));
  await pause(200);
  attendre(/vide/.test(message(doc)), "message vide : " + message(doc));
});

test("fichiers : nouveau fichier, espaces signalés, .txt refusé", async () => {
  const { doc, win } = await clubPret();
  const champ = doc.querySelector(".atelier-nouveau"), creer = doc.querySelector(".atelier-nouveau-btn");
  champ.value = "ma page.html"; creer.click(); await pause(300);
  attendre(win.MH.Dossier.lire("ma page.html") != null, "ma page.html non créée");
  attendre(/espaces/.test(message(doc)), "avertissement : " + message(doc));
  champ.value = "notes.txt"; creer.click(); await pause(200);
  attendre(win.MH.Dossier.lire("notes.txt") == null, "notes.txt ne doit pas être créé");
  attendre(/\.html/.test(message(doc)) && /\.css/.test(message(doc)), "refus expliqué : " + message(doc));
});

test("export : nom tiré du site et contenu identique", async () => {
  const { win } = await clubPret();
  const { nom, blob } = await win.MH.atelier.exporter();
  attendre(nom === "club-info-uam.zip", "nom : " + nom);
  const fichiers = await win.MH.zip.lire(blob);
  const dec = new TextDecoder();
  const chemins = fichiers.map((f) => f.chemin).sort().join(",");
  attendre(chemins === "activites.html,contact.html,index.html", "chemins : " + chemins);
  const idx = fichiers.find((f) => f.chemin === "index.html");
  attendre(dec.decode(idx.octets) === win.MH.Dossier.lire("index.html"), "contenu différent");
});

test("import : un zip de Windows, dossier racine retiré", async () => {
  const { win } = await clubPret();
  win.confirm = () => true;
  const octets = await fetch("fixtures/windows.zip").then((r) => r.arrayBuffer());
  const msg = await win.MH.atelier.importer(new win.File([octets], "mon-site.zip", { type: "application/zip" }));
  await pause(300);
  attendre(win.MH.Dossier.lire("index.html") && /été/.test(win.MH.Dossier.lire("index.html")), "index.html importé : " + msg);
  attendre(win.MH.Dossier.chemins().includes("images/logo.gif"), "image importée");
  attendre(win.MH.Dossier.lire("activites.html") == null, "les anciennes pages sont remplacées");
  attendre(meta(win).base[0] === "index.html", "base[0] = " + meta(win).base[0]);
});

test("import : un faux zip est refusé, le projet reste intact", async () => {
  const { doc, win } = await clubPret();
  win.confirm = () => true;
  const avant = win.MH.Dossier.lire("index.html");
  await win.MH.atelier.importer(new win.File(["bonjour"], "faux.zip"));
  await pause(200);
  attendre(/n'est pas un \.zip valide/.test(message(doc)), "message : " + message(doc));
  attendre(win.MH.Dossier.lire("index.html") === avant, "projet modifié");
});

test("import : les fichiers inconnus sont ignorés et listés", async () => {
  const { doc, win } = await clubPret();
  win.confirm = () => true;
  const e = new TextEncoder();
  const zip = win.MH.zip.creer([{ chemin: "index.html", octets: e.encode("<P>ok</P>") }, { chemin: "rapport.docx", octets: Uint8Array.of(1, 2) }]);
  await win.MH.atelier.importer(new win.File([zip], "site.zip"));
  await pause(300);
  attendre(/rapport\.docx/.test(message(doc)), "message : " + message(doc));
  attendre(win.MH.Dossier.lire("index.html") === "<P>ok</P>", "index importé");
});

test("import : l'ancien atelier n'écrase pas le projet importé", async () => {
  const r = await atelierNeuf();
  const f = r.doc.querySelector(".atelier-depart");
  f.querySelector('input[name="nom"]').value = "Fatou";
  f.querySelector('input[name="modele"][value="perso"]').checked = true;
  f.querySelector('button[type="submit"]').click();
  for (let i = 0; i < 30 && !r.doc.querySelector(".atelier-travail"); i++) await pause(100);
  r.win.confirm = () => true;
  const e = new TextEncoder();
  const zip = r.win.MH.zip.creer(Object.entries(SITE_COMPLET.textes).map(([c, t]) => ({ chemin: c, octets: e.encode(t) })));
  await r.win.MH.atelier.importer(new r.win.File([zip], "club.zip"));
  await pause(900);
  const base = JSON.parse(r.win.localStorage.getItem("mh:projet")).base.join(",");
  attendre(base === "index.html,activites.html,contact.html", "méta réécrite par l'ancien atelier : " + base);
});

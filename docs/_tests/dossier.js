/* Dossier virtuel étendu aux pages (tâche 5). */

test("dossier : écrire puis relire une page, même après rechargement", async () => {
  let { win } = await charger("manuel/chapitre1/");
  await win.MH.Dossier.ready;
  await win.MH.Dossier.vider();
  await win.MH.Dossier.ecrire("index.html", "<P>Club Info UAM, été</P>");
  attendre(win.MH.Dossier.lire("index.html") === "<P>Club Info UAM, été</P>", "relecture immédiate");
  ({ win } = await charger("manuel/chapitre1/"));
  await win.MH.Dossier.ready;
  attendre(win.MH.Dossier.lire("index.html") === "<P>Club Info UAM, été</P>", "relecture après rechargement : " + win.MH.Dossier.lire("index.html"));
  attendre(win.MH.Dossier.chemins().includes("index.html"), "chemins()");
  attendre(win.MH.Dossier.lire("absent.html") === null, "fichier absent → null");
  await win.MH.Dossier.vider();
});

test("dossier : « Mes images » n'affiche pas les pages", async () => {
  const { doc, win } = await charger("manuel/chapitre6/");
  const D = win.MH.Dossier;
  await D.ready; await D.vider();
  await D.ecrire("index.html", "<P>page</P>");
  const c = doc.createElement("canvas"); c.width = 8; c.height = 8;
  const blob = await new Promise((ok) => c.toBlob(ok, "image/png"));
  await D.add(new win.File([blob], "logo.png", { type: "image/png" }));
  await pause(500);
  const ad = [...doc.querySelectorAll(".admonition.example")].find((a) => a.textContent.includes("6.1"));
  const n = ad.querySelectorAll(".dossier-fichier").length;
  attendre(D.list({ type: "texte" }).length === 1 && D.list({ type: "image" }).length === 1, "list par type");
  attendre(D.estImage("logo.png") && !D.estImage("index.html"), "estImage");
  await D.vider();
  attendre(n === 1, "le panneau liste " + n + " fichier(s) au lieu de 1");
});

test("dossier : photo de 6 Mo refusée", async () => {
  const { win } = await charger("manuel/chapitre6/");
  const D = win.MH.Dossier;
  await D.ready; await D.vider();
  const gros = new win.File([new Uint8Array(6 * 1024 * 1024)], "vacances.jpg", { type: "image/jpeg" });
  const msg = await D.add(gros);
  attendre(/trop lourde/.test(msg || ""), "message attendu, reçu : " + msg);
  attendre(D.list().length === 0, "le dossier devrait rester vide");
});

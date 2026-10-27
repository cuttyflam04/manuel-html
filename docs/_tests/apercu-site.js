/* Aperçu en mode site : un mini-site de plusieurs pages (tâche 6). */

async function monterSite(fichiers) {
  const { doc, win } = await charger("manuel/chapitre1/");
  const D = win.MH.Dossier;
  await D.ready; await D.vider();
  for (const [chemin, texte] of Object.entries(fichiers)) await D.ecrire(chemin, texte);
  const p = win.MH.makePreview({ site: true, page: "index.html" });
  doc.querySelector(".md-content").prepend(p.node);
  return { doc, win, D, p };
}
const cadre = (p) => p.node.querySelector("iframe");
const attendreRendu = async (p, test, ms) => { for (let i = 0; i < (ms || 40); i++) { const d = cadre(p).contentDocument; if (d && test(d)) return d; await pause(100); } return cadre(p).contentDocument; };
const note = (p) => { const n = p.node.querySelector(".apercu-note"); return n.hidden ? "" : n.textContent; };
async function cliquer(p, selecteur) {
  const d = cadre(p).contentDocument;
  d.querySelector(selecteur).dispatchEvent(new d.defaultView.MouseEvent("click", { bubbles: true, cancelable: true }));
  await pause(400);
}

test("aperçu site : un clic sur un lien ouvre l'autre page, Retour revient", async () => {
  const { D, p } = await monterSite({
    "index.html": '<TITLE>Accueil</TITLE><H1>Accueil</H1><A HREF="contact.html">Contact</A>',
    "contact.html": '<TITLE>Contact</TITLE><H1>Me contacter</H1>',
  });
  p.ouvrir("index.html");
  await attendreRendu(p, (d) => /Accueil/.test(d.body && d.body.textContent));
  await cliquer(p, "a");
  const d = await attendreRendu(p, (d) => /Me contacter/.test(d.body && d.body.textContent));
  attendre(/Me contacter/.test(d.body.textContent), "contact.html ne s'est pas ouvert");
  attendre(/contact\.html/.test(p.node.querySelector(".apercu-adresse").textContent), "barre d'adresse");
  p.node.querySelector(".apercu-retour").click();
  const d2 = await attendreRendu(p, (d) => /Accueil/.test(d.body && d.body.textContent));
  attendre(/Accueil/.test(d2.body.textContent), "Retour n'est pas revenu à l'accueil");
  await D.vider();
});

test("aperçu site : page absente expliquée, casse suggérée", async () => {
  const { D, p } = await monterSite({
    "index.html": '<A ID="g" HREF="galerie.html">Galerie</A> <A ID="c" HREF="Contact.html">Contact</A>',
    "contact.html": "<P>contact</P>",
  });
  p.ouvrir("index.html");
  await attendreRendu(p, (d) => d.querySelector("#g"));
  await cliquer(p, "#g");
  attendre(/Cette page n'existe pas dans ton dossier/.test(note(p)), "message absent : " + note(p));
  await cliquer(p, "#c");
  attendre(/majuscules/.test(note(p)) && /contact\.html/.test(note(p)), "suggestion de casse : " + note(p));
  await D.vider();
});

test("aperçu site : image relative depuis un sous-dossier", async () => {
  const { doc, win, D, p } = await monterSite({ "cours/html.html": '<IMG SRC="../images/moi.jpg" ALT="moi">' });
  const c = doc.createElement("canvas"); c.width = 8; c.height = 8;
  const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg"));
  await D.add(new win.File([blob], "moi.jpg", { type: "image/jpeg" }), "images/moi.jpg");
  p.ouvrir("cours/html.html");
  const d = await attendreRendu(p, (d) => d.querySelector("img") && d.querySelector("img").src.startsWith("blob:"));
  attendre(d.querySelector("img").src.startsWith("blob:"), "l'image ne s'affiche pas : " + note(p));
  await D.vider();
});

test("aperçu site : une feuille style.css reliée s'applique", async () => {
  const { D, p } = await monterSite({
    "style.css": "p { color: rgb(255, 0, 0) }",
    "index.html": '<HEAD><LINK REL="stylesheet" HREF="style.css"></HEAD><BODY><P>rouge</P></BODY>',
  });
  p.ouvrir("index.html");
  const d = await attendreRendu(p, (d) => d.querySelector("p") && d.defaultView.getComputedStyle(d.querySelector("p")).color === "rgb(255, 0, 0)");
  attendre(d.defaultView.getComputedStyle(d.querySelector("p")).color === "rgb(255, 0, 0)", "style.css non appliqué");
  await D.vider();
});

test("aperçu cours : inchangé, un lien affiche « Ce lien ouvrirait »", async () => {
  const { doc } = await charger("manuel/chapitre5/");
  const ad = [...doc.querySelectorAll(".admonition.example")].find((a) => a.textContent.includes("5.3"));
  const f = ad.querySelector("iframe"), d = f.contentDocument;
  d.querySelector("a").dispatchEvent(new d.defaultView.MouseEvent("click", { bubbles: true, cancelable: true }));
  await pause(300);
  attendre(/Ce lien ouvrirait/.test(ad.querySelector(".apercu-note").textContent), "message des chapitres modifié");
});

/* Deux sites d'exemple pour tester les vérifications des 7 étapes. */

const MENU = '<P><A HREF="index.html">Accueil</A> | <A HREF="activites.html">Activités</A> | <A HREF="contact.html">Contact</A></P>';
const STYLE = "<STYLE>\n  body { background-color: #FFFFE0; }\n  p { color: #202020; font-size: 12pt }\n  .important { color: red }\n</STYLE>";
const page = (titre, corps, style) => `<!DOCTYPE html>
<HTML>
<HEAD>
  <META CHARSET="utf-8">
  <META NAME="Author" CONTENT="Fatou Diop">
  <TITLE>${titre}</TITLE>
  ${style === undefined ? STYLE : style}
</HEAD>
<BODY BGCOLOR="#FFFFE0" TEXT="#202020">
${corps}
</BODY>
</HTML>`;

window.SITE_COMPLET = {
  base: ["index.html", "activites.html", "contact.html"],
  images: ["images/logo.gif"],
  textes: {
    "index.html": page("Club Info UAM — Accueil", `<H1 ID="haut">Club Info UAM</H1>
${MENU}
<HR>
<P>Bienvenue au <B>Club Info</B> de l'UAM.</P>
<P CLASS="important">Réunion chaque mardi.</P>
<P><A HREF="index.html"><IMG SRC="images/logo.gif" WIDTH="80" ALT="Logo du club"></A></P>
<P><A HREF="http://www.google.fr" TARGET="_blank">Google</A> | <A HREF="#haut">Haut de page</A></P>
<P><SMALL>&copy; 2026 Club Info UAM</SMALL></P>`),
    "activites.html": page("Club Info UAM — Activités", `<H1>Nos activités</H1>
${MENU}
<UL>
  <LI>Ateliers</LI>
  <LI>Programmation
    <OL><LI>HTML</LI><LI>CSS</LI></OL>
  </LI>
  <LI>Conférences</LI>
</UL>
<OL>
  <LI>S'inscrire</LI>
  <LI>Payer</LI>
  <LI>Participer</LI>
</OL>
<TABLE BORDER="1">
  <CAPTION>Programme</CAPTION>
  <TR><TH>Jour</TH><TH>Activité</TH></TR>
  <TR><TD ROWSPAN="2">Mardi</TD><TD>HTML</TD></TR>
  <TR><TD>CSS</TD></TR>
</TABLE>`),
    "contact.html": page("Club Info UAM — Contact", `<H1>Contact</H1>
${MENU}
<P><A HREF="mailto:club@uam.sn">Écrire au club</A></P>`),
  },
};

// Exactement 5 défauts : titres identiques (étape 1), lien cassé (4), IMG sans ALT (5),
// ligne de tableau trop longue (6), classe définie mais jamais utilisée (7).
const F = JSON.parse(JSON.stringify(window.SITE_COMPLET.textes));
F["index.html"] = F["index.html"].replace("Club Info UAM — Accueil", "Club Info UAM")
  .replace('<A HREF="contact.html">Contact</A></P>', '<A HREF="contact.html">Contact</A> | <A HREF="galerie.html">Galerie</A></P>')
  .replace('<P CLASS="important">', "<P>");
F["activites.html"] = F["activites.html"].replace("Club Info UAM — Activités", "Club Info UAM")
  .replace("<TR><TD>CSS</TD></TR>", "<TR><TD>CSS</TD><TD>en trop</TD></TR>")
  .replace("<H1>Nos activités</H1>", '<H1>Nos activités</H1>\n<IMG SRC="images/logo.gif" WIDTH="40">');
window.SITE_FAUTIF = { base: window.SITE_COMPLET.base, images: window.SITE_COMPLET.images, textes: F };

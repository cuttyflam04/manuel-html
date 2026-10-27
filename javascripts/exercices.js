/* Données des exercices interactifs et des quiz.
   Chaque vérification reçoit (doc, src, T) :
   - doc : la page de l'étudiant, analysée par le navigateur
   - src : le code tapé, en texte brut
   - T   : petits outils (T.n compte, T.txt cherche un texte, T.attr teste un attribut, T.ferme vérifie les fermetures) */

(function () {
  const idx = (src, re) => { const m = re.exec(src); return m ? m.index : -1; };
  const styleOf = (doc, sel) => [...doc.querySelectorAll(sel)].map((e) => e.getAttribute("style") || "").join(";");
  const css = (doc) => [...doc.querySelectorAll("style")].map((s) => s.textContent).join("\n");
  const rule = (text, selector) => {
    const m = new RegExp("(^|[}\\s])" + selector + "\\s*\\{([^}]*)\\}", "i").exec(text);
    return m ? m[2] : "";
  };
  const prop = (decl, name, values) => new RegExp("(^|[;\\s{])" + name + "\\s*:\\s*(" + values + ")\\s*(;|$)", "i").test(decl);

  window.MH_EXERCICES = {
    /* ---------- Chapitre 1 ---------- */
    "ch1-1": {
      depart: "<!DOCTYPE html>\n<HTML>\n<HEAD>\n    <TITLE></TITLE>\n</HEAD>\n<BODY>\n\n</BODY>\n</HTML>",
      checks: [
        { label: "L'onglet affiche « Ma page UAM »", ok: (d) => (d.title || "").trim().toLowerCase() === "ma page uam" },
        { label: "Le <code>&lt;TITLE&gt;</code> est bien dans le <code>&lt;HEAD&gt;</code>", ok: (d, s) => /<head[^>]*>[\s\S]*<title[\s\S]*<\/title>[\s\S]*<\/head>/i.test(s) },
        { label: "Le corps contient « Bonjour le Web »", ok: (d, s, T) => T.txt(d, "body", "bonjour le web") },
      ],
      solution: "<!DOCTYPE html>\n<HTML>\n<HEAD>\n    <TITLE>Ma page UAM</TITLE>\n</HEAD>\n<BODY>\n    Bonjour le Web\n</BODY>\n</HTML>",
    },

    /* ---------- Chapitre 2 ---------- */
    "ch2-1": {
      depart: "<HTML>\n<HEAD>\n\n</HEAD>\n<BODY>\n    <P>Bienvenue en Licence 1.</P>\n</BODY>\n</HTML>",
      checks: [
        { label: "La première ligne est <code>&lt;!DOCTYPE html&gt;</code>", ok: (d, s) => /^\s*<!DOCTYPE\s+html\s*>/i.test(s) },
        { label: "Le titre de l'onglet est « Licence 1 — UAM »", ok: (d) => /licence 1\s*[—–-]\s*uam/i.test(d.title || "") },
        { label: "Une balise <code>&lt;META NAME=\"Author\" CONTENT=\"…\"&gt;</code> indique l'auteur", ok: (d) => [...d.querySelectorAll('meta[name="author" i]')].some((m) => (m.getAttribute("content") || "").trim().length > 1) },
        { label: "Le titre et la balise META sont dans le <code>&lt;HEAD&gt;</code>", ok: (d, s) => /<head[^>]*>[\s\S]*<title[\s\S]*<\/head>/i.test(s) && /<head[^>]*>[\s\S]*<meta[\s\S]*<\/head>/i.test(s) },
      ],
      solution: "<!DOCTYPE html>\n<HTML>\n<HEAD>\n    <TITLE>Licence 1 — UAM</TITLE>\n    <META NAME=\"Author\" CONTENT=\"Fatou Diop\">\n</HEAD>\n<BODY>\n    <P>Bienvenue en Licence 1.</P>\n</BODY>\n</HTML>",
    },
    "ch2-2": {
      depart: "<HTML>\n<HEAD>\n    <TITLE>Mode nuit</TITLE>\n</HEAD>\n<BODY>\n    <P>Ce texte doit être blanc sur fond noir.</P>\n</BODY>\n</HTML>",
      checks: [
        { label: "Fond noir en hexadécimal : <code>BGCOLOR=\"#000000\"</code>", ok: (d, s, T) => T.attr(d, "body", "bgcolor", "#000000") },
        { label: "Texte blanc en hexadécimal : <code>TEXT=\"#FFFFFF\"</code>", ok: (d, s, T) => T.attr(d, "body", "text", "#ffffff") },
        { label: "Un commentaire <code>&lt;!-- … --&gt;</code> dans le corps", ok: (d, s) => /<body[^>]*>[\s\S]*<!--[\s\S]*?-->/i.test(s) },
      ],
      solution: "<HTML>\n<HEAD>\n    <TITLE>Mode nuit</TITLE>\n</HEAD>\n<BODY BGCOLOR=\"#000000\" TEXT=\"#FFFFFF\">\n    <!-- Début du contenu -->\n    <P>Ce texte doit être blanc sur fond noir.</P>\n</BODY>\n</HTML>",
    },

    /* ---------- Chapitre 3 ---------- */
    "ch3-1": {
      depart: "<BODY>\n\n</BODY>",
      checks: [
        { label: "Un titre principal <code>&lt;H1&gt;</code> centré (avec <code>ALIGN=\"CENTER\"</code> ou <code>&lt;CENTER&gt;</code>)", ok: (d) => !!d.querySelector('h1[align="center" i], center h1, center > h1') },
        { label: "Un sous-titre <code>&lt;H2&gt;</code>", ok: (d, s, T) => T.n(d, "h2") >= 1 },
        { label: "Au moins deux paragraphes <code>&lt;P&gt;</code>, bien fermés", ok: (d, s, T) => T.n(d, "p") >= 2 && T.ferme(s, "p") },
        { label: "Une ligne <code>&lt;HR&gt;</code> entre le titre et les paragraphes", ok: (d, s) => { const h = idx(s, /<h1/i), r = idx(s, /<hr/i), p = idx(s, /<p[\s>]/i); return h >= 0 && r > h && p > r; } },
      ],
      solution: "<BODY>\n    <H1 ALIGN=\"CENTER\">Ma page de révision</H1>\n    <HR>\n    <H2>Introduction</H2>\n    <P>Premier paragraphe.</P>\n    <P>Deuxième paragraphe.</P>\n</BODY>",
    },
    "ch3-2": {
      depart: "<P>\n    Le 1er TP porte sur la formule H2O.\n</P>",
      checks: [
        { label: "« er » est en exposant avec <code>&lt;SUP&gt;</code>", ok: (d, s, T) => T.txt(d, "sup", "er") },
        { label: "« 2 » est en indice avec <code>&lt;SUB&gt;</code>", ok: (d, s, T) => T.txt(d, "sub", "2") },
        { label: "« TP » est en gras (<code>&lt;B&gt;</code> ou <code>&lt;STRONG&gt;</code>)", ok: (d, s, T) => T.txt(d, "b, strong", "tp") },
        { label: "Une phrase en rouge avec <code>&lt;FONT COLOR=…&gt;</code>", ok: (d) => [...d.querySelectorAll("font[color]")].some((f) => /^(red|#ff0000|#f00)$/i.test(f.getAttribute("color").trim()) && f.textContent.trim()) },
      ],
      solution: "<P>\n    Le 1<SUP>er</SUP> <B>TP</B> porte sur la formule H<SUB>2</SUB>O.<BR>\n    <FONT COLOR=\"red\">Ne soyez pas en retard !</FONT>\n</P>",
    },
    "ch3-3": {
      depart: "<P>\n    \n</P>",
      checks: [
        { label: "La page affiche « La balise &lt;BR&gt; va à la ligne & c'est tout. »", ok: (d) => /la balise <br> va a la ligne & c.est tout/.test((d.body ? d.body.textContent : "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").toLowerCase()) },
        { label: "Les chevrons sont écrits <code>&amp;lt;</code> et <code>&amp;gt;</code>", ok: (d, s) => /&lt;/i.test(s) && /&gt;/i.test(s) },
        { label: "L'esperluette est écrite <code>&amp;amp;</code>", ok: (d, s) => /&amp;/i.test(s) },
      ],
      solution: "<P>\n    La balise &lt;BR&gt; va à la ligne &amp; c'est tout.\n</P>",
    },

    /* ---------- Chapitre 4 ---------- */
    "ch4-1": {
      depart: "<H2>Activités du Club Informatique UAM</H2>\n",
      checks: [
        { label: "Une liste à puces <code>&lt;UL&gt;</code>", ok: (d, s, T) => T.n(d, "ul") >= 1 },
        { label: "Au moins trois éléments <code>&lt;LI&gt;</code> dans la liste", ok: (d, s, T) => T.n(d, "ul > li") >= 3 },
        { label: "Pas de texte directement dans <code>&lt;UL&gt;</code>, hors des <code>&lt;LI&gt;</code>", ok: (d, s, T) => T.n(d, "ul") >= 1 && [...d.querySelectorAll("ul")].every((u) => [...u.childNodes].every((n) => n.nodeType !== 3 || !n.textContent.trim())) },
        { label: "Les balises <code>&lt;LI&gt;</code> et <code>&lt;UL&gt;</code> sont fermées", ok: (d, s, T) => T.ferme(s, "li") && T.ferme(s, "ul") },
      ],
      solution: "<H2>Activités du Club Informatique UAM</H2>\n<UL>\n    <LI>Ateliers de programmation</LI>\n    <LI>Hackathons</LI>\n    <LI>Conférences</LI>\n</UL>",
    },
    "ch4-2": {
      depart: "",
      checks: [
        { label: "Un titre <code>&lt;H2&gt;</code> « Comment adhérer »", ok: (d, s, T) => T.txt(d, "h2", "comment adherer") },
        { label: "Une liste numérotée <code>&lt;OL&gt;</code> d'au moins trois étapes", ok: (d, s, T) => T.n(d, "ol > li") >= 3 },
        { label: "La liste vient après le titre", ok: (d, s) => { const h = idx(s, /<h2/i), o = idx(s, /<ol/i); return h >= 0 && o > h; } },
      ],
      solution: "<H2>Comment adhérer</H2>\n<OL>\n    <LI>Remplir la fiche d'inscription</LI>\n    <LI>Payer la cotisation</LI>\n    <LI>Participer à la première réunion</LI>\n</OL>",
    },
    "ch4-3": {
      depart: "<UL>\n    <LI>Programmation</LI>\n    \n</UL>",
      checks: [
        { label: "La liste à puces contient Programmation, Réseaux et Infographie", ok: (d, s, T) => ["programmation", "reseaux", "infographie"].every((m) => T.txt(d, "ul > li", m)) },
        { label: "Une liste numérotée est imbriquée <b>dans</b> le <code>&lt;LI&gt;</code> Programmation", ok: (d) => [...d.querySelectorAll("ul > li")].some((li) => li.querySelector(":scope > ol") && /programmation/i.test([...li.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" "))) },
        { label: "Cette liste numérotée contient au moins deux langages", ok: (d, s, T) => T.n(d, "ul > li > ol > li") >= 2 },
        { label: "Toutes les listes sont bien fermées", ok: (d, s, T) => T.ferme(s, "li") && T.ferme(s, "ul") && T.ferme(s, "ol") },
      ],
      solution: "<UL>\n    <LI>Programmation\n        <OL>\n            <LI>Python</LI>\n            <LI>C</LI>\n        </OL>\n    </LI>\n    <LI>Réseaux</LI>\n    <LI>Infographie</LI>\n</UL>",
    },

    /* ---------- Chapitre 5 ---------- */
    "ch5-1": {
      depart: "<H1>Mon site</H1>\n",
      checks: [
        { label: "Un lien vers <code>presentation.html</code>", ok: (d) => !!d.querySelector('a[href="presentation.html" i]') },
        { label: "Un lien vers <code>galerie.html</code>", ok: (d) => !!d.querySelector('a[href="galerie.html" i]') },
        { label: "Un lien vers <code>contact.html</code>", ok: (d) => !!d.querySelector('a[href="contact.html" i]') },
        { label: "Un lien absolu vers <code>http://www.google.fr</code>…", ok: (d) => !!d.querySelector('a[href^="http://www.google.fr" i], a[href^="https://www.google.fr" i]') },
        { label: "… qui s'ouvre dans un nouvel onglet (<code>TARGET=\"_blank\"</code>)", ok: (d) => !!d.querySelector('a[href*="google.fr" i][target="_blank" i]') },
        { label: "Chaque lien a un texte cliquable", ok: (d, s, T) => T.n(d, "a") >= 1 && [...d.querySelectorAll("a")].every((a) => a.textContent.trim() || a.querySelector("img")) },
      ],
      solution: "<H1>Mon site</H1>\n<A HREF=\"presentation.html\">Présentation</A> |\n<A HREF=\"galerie.html\">Galerie</A> |\n<A HREF=\"contact.html\">Contact</A>\n<P><A HREF=\"http://www.google.fr\" TARGET=\"_blank\">Google</A></P>",
    },
    "ch5-2": {
      depart: "<H1>Guide de l'étudiant</H1>\n",
      checks: [
        { label: "Au moins deux liens internes <code>HREF=\"#…\"</code>", ok: (d, s, T) => T.n(d, 'a[href^="#"]') >= 2 },
        { label: "Chaque lien <code>#…</code> pointe vers une ancre qui existe (<code>NAME</code> ou <code>ID</code>)", ok: (d) => { const l = [...d.querySelectorAll('a[href^="#"]')]; return l.length >= 2 && l.every((a) => { const id = a.getAttribute("href").slice(1); return id && (d.getElementById(id) || d.getElementsByName(id).length); }); } },
        { label: "Les sections « Formations » et « Horaires » existent", ok: (d) => { const t = (d.body ? d.body.textContent : "").toLowerCase(); return t.split("formations").length > 2 && t.split("horaires").length > 2; } },
        { label: "Un lien <code>mailto:scolarite@uam.sn</code>", ok: (d) => !!d.querySelector('a[href="mailto:scolarite@uam.sn" i]') },
      ],
      solution: "<H1>Guide de l'étudiant</H1>\n<A HREF=\"#formations\">Formations</A> |\n<A HREF=\"#horaires\">Horaires</A>\n<H2 ID=\"formations\">Formations</H2>\n<P>Licence, Master…</P>\n<H2><A NAME=\"horaires\">Horaires</A></H2>\n<P>Du lundi au vendredi, 8h-18h.</P>\n<P><A HREF=\"mailto:scolarite@uam.sn\">Écrire à la scolarité</A></P>",
    },
    "ch5-3": {
      depart: "<!-- Cette page est : racine/cours/html.html -->\n",
      checks: [
        { label: "Un lien vers <code>index.html</code>, un dossier au-dessus", ok: (d) => !!d.querySelector('a[href="../index.html" i]') },
        { label: "Un lien vers <code>tp1.html</code> dans le dossier <code>tp/</code> voisin", ok: (d) => !!d.querySelector('a[href="../tp/tp1.html" i]') },
      ],
      solution: "<!-- Cette page est : racine/cours/html.html -->\n<A HREF=\"../index.html\">Accueil</A><BR>\n<A HREF=\"../tp/tp1.html\">TP 1</A>",
    },

    /* ---------- Chapitre 6 ---------- */
    "ch6-1": {
      depart: "<P>\n    \n</P>",
      checks: [
        { label: "Une image <code>SRC=\"campus.jpg\"</code>", ok: (d) => !!d.querySelector('img[src="campus.jpg" i]') },
        { label: "Une largeur de 250 pixels : <code>WIDTH=\"250\"</code>", ok: (d) => !!d.querySelector('img[src="campus.jpg" i][width="250"]') },
        { label: "Un texte alternatif <code>ALT</code> qui décrit l'image", ok: (d) => [...d.querySelectorAll('img[src="campus.jpg" i]')].some((i) => (i.getAttribute("alt") || "").trim().length >= 3) },
      ],
      solution: "<P>\n    <IMG SRC=\"campus.jpg\" WIDTH=\"250\" ALT=\"Vue du campus de l'UAM\">\n</P>",
    },
    "ch6-2": {
      depart: "<P>\n    Notre laboratoire accueille les étudiants pour leurs travaux pratiques\n    de programmation et de développement Web, du lundi au samedi.\n</P>\n",
      checks: [
        { label: "L'image <code>labo.jpg</code> est dans un paragraphe", ok: (d) => !!d.querySelector('p img[src="labo.jpg" i]') },
        { label: "Elle est alignée à gauche : <code>ALIGN=\"LEFT\"</code>", ok: (d) => !!d.querySelector('img[src="labo.jpg" i][align="left" i]') },
        { label: "L'image <code>retour.gif</code> est un lien vers <code>index.html</code>", ok: (d) => !!d.querySelector('a[href="index.html" i] img[src="retour.gif" i]') },
        { label: "L'image cliquable n'a pas de bordure : <code>BORDER=\"0\"</code>", ok: (d) => !!d.querySelector('a img[src="retour.gif" i][border="0"]') },
        { label: "Les deux images ont un <code>ALT</code>", ok: (d) => ["labo.jpg", "retour.gif"].every((f) => { const i = d.querySelector('img[src="' + f + '" i]'); return i && i.hasAttribute("alt"); }) },
      ],
      solution: "<P>\n    <IMG SRC=\"labo.jpg\" WIDTH=\"140\" ALIGN=\"LEFT\" ALT=\"Le laboratoire\">\n    Notre laboratoire accueille les étudiants pour leurs travaux pratiques\n    de programmation et de développement Web, du lundi au samedi.\n</P>\n<P><A HREF=\"index.html\"><IMG SRC=\"retour.gif\" WIDTH=\"60\" BORDER=\"0\" ALT=\"Retour à l'accueil\"></A></P>",
    },

    /* ---------- Chapitre 7 ---------- */
    "ch7-1": {
      depart: "<TABLE BORDER=\"1\">\n    \n</TABLE>",
      checks: [
        { label: "Un tableau avec bordure (<code>BORDER</code> supérieur à 0)", ok: (d) => [...d.querySelectorAll("table[border]")].some((t) => parseInt(t.getAttribute("border"), 10) > 0) },
        { label: "Une ligne d'en-tête <code>&lt;TH&gt;</code> : Nom, Prénom, Âge", ok: (d, s, T) => T.n(d, "th") >= 3 && ["nom", "prenom", "age"].every((m) => T.txt(d, "th", m)) },
        { label: "Les trois étudiants sont présents", ok: (d, s, T) => ["ndiaye", "faye", "diallo"].every((m) => T.txt(d, "td", m)) },
        { label: "Chaque ligne <code>&lt;TR&gt;</code> a exactement 3 cellules", ok: (d) => { const r = [...d.querySelectorAll("tr")]; return r.length >= 4 && r.every((tr) => tr.querySelectorAll(":scope > td, :scope > th").length === 3); } },
        { label: "Les <code>&lt;TR&gt;</code> et <code>&lt;TD&gt;</code> sont fermés", ok: (d, s, T) => T.ferme(s, "tr") && T.ferme(s, "td") },
      ],
      solution: "<TABLE BORDER=\"1\">\n    <TR><TH>Nom</TH><TH>Prénom</TH><TH>Âge</TH></TR>\n    <TR><TD>Ndiaye</TD><TD>Ousmane</TD><TD>22</TD></TR>\n    <TR><TD>Faye</TD><TD>Khady</TD><TD>20</TD></TR>\n    <TR><TD>Diallo</TD><TD>Ibrahima</TD><TD>21</TD></TR>\n</TABLE>",
    },
    "ch7-2": {
      depart: "<TABLE BORDER=\"1\">\n    <TR>\n        <TH>Jour</TH>\n        <TH>08h-10h</TH>\n        <TH>10h-12h</TH>\n    </TR>\n    \n</TABLE>",
      checks: [
        { label: "Un titre « Emploi du temps » avec <code>&lt;CAPTION&gt;</code>", ok: (d, s, T) => T.txt(d, "caption", "emploi du temps") },
        { label: "Les lignes Lundi, Mardi et Mercredi", ok: (d, s, T) => ["lundi", "mardi", "mercredi"].every((m) => T.txt(d, "td, th", m)) },
        { label: "« Base de données » occupe deux créneaux : <code>COLSPAN=\"2\"</code>", ok: (d) => [...d.querySelectorAll('td[colspan="2"], th[colspan="2"]')].some((c) => /base de donn/i.test(c.textContent)) },
        { label: "La ligne Mercredi n'a que 2 cellules (la fusion compte double)", ok: (d) => [...d.querySelectorAll("tr")].some((tr) => /mercredi/i.test(tr.textContent) && tr.querySelectorAll(":scope > td, :scope > th").length === 2) },
        { label: "Les lignes Lundi et Mardi ont 3 cellules", ok: (d) => ["lundi", "mardi"].every((j) => [...d.querySelectorAll("tr")].some((tr) => new RegExp(j, "i").test(tr.textContent) && tr.querySelectorAll(":scope > td, :scope > th").length === 3)) },
      ],
      solution: "<TABLE BORDER=\"1\">\n    <CAPTION>Emploi du temps</CAPTION>\n    <TR>\n        <TH>Jour</TH>\n        <TH>08h-10h</TH>\n        <TH>10h-12h</TH>\n    </TR>\n    <TR><TD>Lundi</TD><TD>HTML</TD><TD>CSS</TD></TR>\n    <TR><TD>Mardi</TD><TD>JavaScript</TD><TD>PHP</TD></TR>\n    <TR><TD>Mercredi</TD><TD COLSPAN=\"2\" ALIGN=\"CENTER\">Base de données</TD></TR>\n</TABLE>",
    },

    /* ---------- Chapitre 8 ---------- */
    "ch8-1": {
      depart: "<P>Ce paragraphe doit devenir bleu.</P>",
      checks: [
        { label: "Le paragraphe a un attribut <code>STYLE</code>", ok: (d, s, T) => T.n(d, "p[style]") >= 1 },
        { label: "Texte bleu : <code>color: blue</code> (ou <code>#0000FF</code>)", ok: (d) => prop(styleOf(d, "p[style]"), "color", "blue|#0000ff|#00f") },
        { label: "Taille : <code>font-size: 16pt</code>", ok: (d) => prop(styleOf(d, "p[style]"), "font-size", "16pt") },
      ],
      solution: "<P STYLE=\"color: blue; font-size: 16pt\">Ce paragraphe doit devenir bleu.</P>",
    },
    "ch8-2": {
      depart: "<HTML>\n<HEAD>\n    <TITLE>Style global</TITLE>\n\n</HEAD>\n<BODY>\n    <H1>Mon titre</H1>\n    <P>Premier paragraphe.</P>\n    <P>Second paragraphe.</P>\n</BODY>\n</HTML>",
      checks: [
        { label: "Une balise <code>&lt;STYLE&gt;</code> dans le <code>&lt;HEAD&gt;</code>", ok: (d, s) => /<head[^>]*>[\s\S]*<style[^>]*>[\s\S]*<\/style>[\s\S]*<\/head>/i.test(s) },
        { label: "Une règle <code>p { … }</code> avec <code>color: green</code>", ok: (d) => prop(rule(css(d), "p"), "color", "green|#008000|#00ff00|#0f0") },
        { label: "… et <code>text-align: center</code>", ok: (d) => prop(rule(css(d), "p"), "text-align", "center") },
        { label: "Une classe <code>h1.titre</code> en rouge", ok: (d) => prop(rule(css(d), "h1\\.titre"), "color", "red|#ff0000|#f00") },
        { label: "Le <code>&lt;H1&gt;</code> utilise <code>CLASS=\"titre\"</code>", ok: (d) => !!d.querySelector("h1.titre") },
      ],
      solution: "<HTML>\n<HEAD>\n    <TITLE>Style global</TITLE>\n    <STYLE>\n        p { color: green; text-align: center }\n        h1.titre { color: red }\n    </STYLE>\n</HEAD>\n<BODY>\n    <H1 CLASS=\"titre\">Mon titre</H1>\n    <P>Premier paragraphe.</P>\n    <P>Second paragraphe.</P>\n</BODY>\n</HTML>",
    },

    /* ---------- Bonus ---------- */
    "bonus-1": {
      depart: "<H2>Inscription</H2>\n",
      checks: [
        { label: "Un <code>&lt;FORM&gt;</code> envoyé en POST vers <code>inscription.php</code>", ok: (d) => !!d.querySelector('form[method="post" i][action="inscription.php" i]') },
        { label: "Un champ texte nommé (<code>NAME</code>) pour le nom", ok: (d) => !!d.querySelector('form input[type="text" i][name], form input:not([type])[name]') },
        { label: "Deux boutons radio <code>NAME=\"niveau\"</code>", ok: (d, s, T) => T.n(d, 'form input[type="radio" i][name="niveau" i]') >= 2 },
        { label: "Une liste <code>&lt;SELECT NAME=\"faculte\"&gt;</code> d'au moins deux choix", ok: (d, s, T) => T.n(d, 'form select[name="faculte" i] option') >= 2 },
        { label: "Un bouton d'envoi", ok: (d) => !!d.querySelector('form input[type="submit" i], form button:not([type]), form button[type="submit" i]') },
      ],
      solution: "<H2>Inscription</H2>\n<FORM ACTION=\"inscription.php\" METHOD=\"POST\">\n    Nom : <INPUT TYPE=\"text\" NAME=\"nom\"><BR><BR>\n    Niveau :\n    <INPUT TYPE=\"radio\" NAME=\"niveau\" VALUE=\"L1\" CHECKED> L1\n    <INPUT TYPE=\"radio\" NAME=\"niveau\" VALUE=\"L2\"> L2<BR><BR>\n    Faculté :\n    <SELECT NAME=\"faculte\">\n        <OPTION>Sciences</OPTION>\n        <OPTION>Lettres</OPTION>\n    </SELECT><BR><BR>\n    <INPUT TYPE=\"submit\" VALUE=\"Envoyer\">\n</FORM>",
    },
  };

  /* =================== Quiz =================== */
  const c = (s) => "<code>" + s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>";

  window.MH_QUIZ = {
    ch1: [
      { q: "Le Web et Internet, c'est…", choix: ["La même chose", "Le Web est une des applications d'Internet", "Internet est une partie du Web"], bonne: 1, explication: "Le courrier électronique et la messagerie instantanée sont d'autres applications d'Internet." },
      { q: "Qui affiche le code HTML sous forme de page ?", choix: ["Le serveur", "Le navigateur", "Le protocole HTTP"], bonne: 1, explication: "Le navigateur lit (interprète) le code HTML et affiche le résultat." },
      { q: "Laquelle est une balise orpheline ?", choix: [c("<P>"), c("<H1>"), c("<BR>")], bonne: 2, explication: c("<BR>") + " insère un retour à la ligne : elle n'encadre rien, elle n'a pas de fermante." },
      { q: "Dans " + c('<IMG SRC="photo.jpg">') + ", " + c("SRC") + " est…", choix: ["une balise", "un attribut", "une valeur"], bonne: 1, explication: c("SRC") + " est un attribut ; " + c('"photo.jpg"') + " est sa valeur." },
      { q: "Le HTML est un langage…", choix: ["compilé", "interprété", "de base de données"], bonne: 1, explication: "Il est lu au fur et à mesure par le navigateur, sans compilation." },
    ],
    ch2: [
      { q: "Où s'affiche le contenu de " + c("<TITLE>") + " ?", choix: ["En haut de la page, en gros", "Dans l'onglet du navigateur", "Nulle part"], bonne: 1, explication: "Le titre ne s'affiche pas dans la page mais dans l'onglet (ou la barre de titre)." },
      { q: "Quelle est la toute première ligne d'une page HTML ?", choix: [c("<HTML>"), c("<!DOCTYPE html>"), c("<HEAD>")], bonne: 1, explication: "Le doctype indique qu'il s'agit d'une page HTML." },
      { q: "Quel attribut de " + c("<BODY>") + " donne la couleur des liens déjà visités ?", choix: [c("LINK"), c("ALINK"), c("VLINK")], bonne: 2, explication: c("VLINK") + " = visited link. " + c("ALINK") + " est le lien actif, " + c("LINK") + " le lien normal." },
      { q: "Que fait " + c('<META HTTP-EQUIV="Refresh" CONTENT="5; URL=page2.html">') + " ?", choix: ["Recharge la page toutes les 5 secondes", "Redirige vers page2.html après 5 secondes", "Affiche page2.html dans 5 onglets"], bonne: 1, explication: "Le nombre est le délai en secondes avant d'afficher l'adresse indiquée." },
      { q: "Le code " + c("#FF0000") + " correspond à…", choix: ["Rouge", "Vert", "Bleu"], bonne: 0, explication: "#RRVVBB : FF de rouge, 00 de vert, 00 de bleu." },
    ],
    ch3: [
      { q: "Combien de niveaux de titres existe-t-il ?", choix: ["3", "6", "7"], bonne: 1, explication: "De " + c("<H1>") + " (le plus important) à " + c("<H6>") + "." },
      { q: "Pour écrire " + c("<") + " dans le texte d'une page, on tape…", choix: [c("&lt;"), c("&gt;"), c("&amp;")], bonne: 0, explication: "lt = less than (plus petit que). " + c("&gt;") + " donne >, " + c("&amp;") + " donne &." },
      { q: "Quelle balise met le texte en exposant ?", choix: [c("<SUB>"), c("<SUP>"), c("<BIG>")], bonne: 1, explication: c("<SUP>") + " = exposant (1er), " + c("<SUB>") + " = indice (H2O)." },
      { q: "Les valeurs absolues de " + c("<FONT SIZE>") + " vont de…", choix: ["1 à 6", "1 à 7", "0 à 10"], bonne: 1, explication: "De 1 (le plus petit) à 7 (le plus grand). On peut aussi écrire +1, +2… (relatif)." },
      { q: "Quelle imbrication est correcte ?", choix: [c("<U><I>texte</U></I>"), c("<U><I>texte</I></U>"), c("<U>texte<I></U></I>")], bonne: 1, explication: "La dernière balise ouverte est la première fermée." },
      { q: c("<STRONG>") + " et " + c("<B>") + " : quelle différence ?", choix: ["Aucune", c("<STRONG>") + " est sémantique : il indique un texte important", c("<B>") + " est plus gras"], bonne: 1, explication: "Les deux s'affichent en gras par défaut, mais " + c("<STRONG>") + " porte un sens : l'importance." },
    ],
    ch4: [
      { q: "Quelle balise crée une liste numérotée ?", choix: [c("<UL>"), c("<OL>"), c("<LI>")], bonne: 1, explication: "OL = Ordered List (liste ordonnée)." },
      { q: "Que peut contenir directement un " + c("<UL>") + " ?", choix: ["Du texte et des " + c("<LI>"), "Uniquement des " + c("<LI>"), "N'importe quelle balise"], bonne: 1, explication: c("<UL>") + " et " + c("<OL>") + " ne contiennent que des " + c("<LI>") + "." },
      { q: "Où place-t-on une sous-liste ?", choix: ["Après " + c("</LI>"), "À l'intérieur d'un " + c("<LI>") + ", avant " + c("</LI>"), "Après " + c("</UL>")], bonne: 1, explication: "La sous-liste appartient à l'élément qui la contient." },
      { q: "Peut-on mettre un " + c("<OL>") + " dans un " + c("<UL>") + " ?", choix: ["Non, jamais", "Oui, si les balises sont bien fermées", "Seulement en HTML5"], bonne: 1, explication: "On peut mélanger les listes, à condition de bien les fermer." },
    ],
    ch5: [
      { q: "Quel attribut indique la destination d'un lien ?", choix: [c("SRC"), c("HREF"), c("NAME")], bonne: 1, explication: c("HREF") + " (hypertext reference). " + c("NAME") + " sert à poser une ancre." },
      { q: c('HREF="../index.html"') + " signifie…", choix: ["index.html dans un sous-dossier", "index.html dans le dossier parent", "index.html sur un autre site"], bonne: 1, explication: c("../") + " remonte d'un dossier." },
      { q: "Lequel est un lien absolu ?", choix: [c('HREF="page1.html"'), c('HREF="cours/html.html"'), c('HREF="http://www.google.fr"')], bonne: 2, explication: "Un lien absolu contient tout le chemin, en commençant par le protocole." },
      { q: "Pour aller à " + c('<H2 ID="contact">') + " dans la même page, on écrit…", choix: [c('<A HREF="contact">'), c('<A HREF="#contact">'), c('<A NAME="#contact">')], bonne: 1, explication: "On appelle une ancre avec # suivi de son nom." },
      { q: "Quel attribut ouvre le lien dans un nouvel onglet ?", choix: [c('TARGET="_blank"'), c('TITLE="_blank"'), c('HREF="_blank"')], bonne: 0, explication: c("TITLE") + " sert à l'info-bulle." },
    ],
    ch6: [
      { q: "Quels formats le cours associe-t-il aux photos et aux illustrations ?", choix: ["JPEG pour les photos, GIF pour les illustrations", "GIF pour les photos, JPEG pour les illustrations", "Les deux sont identiques"], bonne: 0, explication: "GIF pour les illustrations, JPEG pour les photos." },
      { q: "À quoi sert " + c("ALT") + " ?", choix: ["À donner la taille de l'image", "À décrire l'image et la remplacer si elle ne charge pas", "À ajouter un cadre"], bonne: 1, explication: "Il est aussi lu par les lecteurs d'écran. Il est obligatoire (vide pour une image décorative)." },
      { q: "On écrit seulement " + c('WIDTH="200"') + ". Que devient la hauteur ?", choix: ["Elle reste la hauteur réelle", "Elle est calculée en proportion", "L'image disparaît"], bonne: 1, explication: "Quand une seule dimension est donnée, l'autre est calculée automatiquement." },
      { q: "Quelle valeur de " + c("ALIGN") + " fait s'enrouler le texte autour de l'image ?", choix: [c("MIDDLE"), c("LEFT"), c("BOTTOM")], bonne: 1, explication: c("LEFT") + " et " + c("RIGHT") + " placent l'image sur le côté ; " + c("TOP") + ", " + c("MIDDLE") + ", " + c("BOTTOM") + " règlent la position verticale." },
      { q: "Faut-il fermer " + c("<IMG>") + " ?", choix: ["Oui, avec " + c("</IMG>"), "Non, c'est une balise orpheline", "Seulement si l'image est un lien"], bonne: 1, explication: "C'est une balise auto-fermante." },
    ],
    ch7: [
      { q: "Quelle balise crée une ligne de tableau ?", choix: [c("<TD>"), c("<TR>"), c("<TH>")], bonne: 1, explication: "TR = Table Row. TD = cellule de données, TH = cellule d'en-tête." },
      { q: "Une cellule " + c('COLSPAN="3"') + " compte pour…", choix: ["1 cellule", "3 cellules", "3 lignes"], bonne: 1, explication: "Elle s'étend sur 3 colonnes : la ligne a donc 2 " + c("<TD>") + " de moins." },
      { q: "Pour aligner verticalement le contenu d'une cellule en bas, on écrit…", choix: [c('ALIGN="BOTTOM"'), c('VALIGN="BOTTOM"'), c('ROWSPAN="BOTTOM"')], bonne: 1, explication: c("VALIGN") + " = alignement vertical (TOP, MIDDLE, BOTTOM)." },
      { q: "Quelle balise donne un titre au tableau ?", choix: [c("<TITLE>"), c("<CAPTION>"), c("<TH>")], bonne: 1, explication: c("<CAPTION>") + " se place juste après " + c("<TABLE>") + " ; " + c('ALIGN="BOTTOM"') + " le met en dessous." },
      { q: "Comment garder une cellule vide visible avec sa bordure ?", choix: [c("<TD></TD>"), c("<TD>&nbsp;</TD>"), c("<TD/>")], bonne: 1, explication: "L'espace " + c("&nbsp;") + " donne un contenu à la cellule." },
    ],
    ch8: [
      { q: "Où se place la balise " + c("<STYLE>") + " ?", choix: ["Dans " + c("<BODY>"), "Dans " + c("<HEAD>"), "Avant " + c("<HTML>")], bonne: 1, explication: "La définition globale des styles se fait dans l'en-tête." },
      { q: "Comment s'appelle un style écrit avec l'attribut " + c("STYLE") + " sur une balise ?", choix: ["Un style local", "Un style global", "Une classe"], bonne: 0, explication: "Il ne s'applique qu'à cette balise." },
      { q: "Avec " + c("h1.red { color: #FF0000 }") + ", comment rendre un titre rouge ?", choix: [c('<H1 STYLE="red">'), c('<H1 CLASS="red">'), c('<H1 COLOR="red">')], bonne: 1, explication: "L'attribut " + c("CLASS") + " choisit la classe définie dans " + c("<STYLE>") + "." },
      { q: "Quel séparateur met-on entre deux règles de style ?", choix: ["Une virgule", "Un point-virgule", "Un tiret"], bonne: 1, explication: "Par exemple : " + c("color: red; font-size: 14pt") + "." },
    ],
  };
})();

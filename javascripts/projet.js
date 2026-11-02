/* Manuel HTML — données du projet « Mon site » : modèles de départ, 7 étapes et leurs vérifications.
   Les consignes sont du texte simple : `<BALISE>` entre accents graves est affiché comme du code.
   Chaque vérification reçoit (site, T) et ne regarde que la structure, jamais le texte de l'étudiant. */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  /* ---------- Modèles de départ ---------- */

  const squelette = (nomSite, titrePage) => `<!DOCTYPE html>
<HTML>
<HEAD>
    <META CHARSET="utf-8">
    <TITLE></TITLE>
</HEAD>
<BODY>
    <!-- ${titrePage} de « ${nomSite} » -->

</BODY>
</HTML>
`;
  const MODELES = [
    { id: "perso", nom: "Mon site perso", description: "Te présenter, ton parcours, comment te joindre.", pages: ["index.html", "parcours.html", "contact.html"], roles: ["Page d'accueil", "Mon parcours", "Page de contact"] },
    { id: "club", nom: "Mon club / association", description: "Présenter un club, ses activités et le contacter.", pages: ["index.html", "activites.html", "contact.html"], roles: ["Page d'accueil", "Nos activités", "Page de contact"] },
    { id: "evenement", nom: "Un événement", description: "Une journée, une fête, un tournoi : le présenter, son programme, les inscriptions.", pages: ["index.html", "programme.html", "contact.html"], roles: ["Page d'accueil", "Le programme", "Page de contact"] },
    { id: "libre", nom: "Sujet libre", description: "Ton propre sujet. Renomme la 2e page comme tu veux.", pages: ["index.html", "page2.html", "contact.html"], roles: ["Page d'accueil", "Deuxième page", "Page de contact"] },
  ].map((m) => Object.assign(m, { squelette }));

  /* ---------- Analyse du site ---------- */

  const est = (c) => /\.html?$/i.test(c);
  function analyser(textes, chemins, base) {
    const pages = {}, css = {};
    for (const [chemin, src] of Object.entries(textes)) {
      if (est(chemin)) pages[chemin] = { src, doc: new DOMParser().parseFromString(src, "text/html") };
      else if (/\.css$/i.test(chemin)) css[chemin] = src;
    }
    return { pages, css, fichiers: [...chemins], base: [...base], contact: base[2] };
  }

  /* ---------- Petits outils de vérification ---------- */

  const R = (src, depuis, site) => MH.outils.resoudreChemin(src, depuis, site.fichiers);
  const pagesBase = (site) => site.base.map((c) => site.pages[c]).filter(Boolean);
  const toutesPages = (site) => Object.entries(site.pages);
  const unePage = (site, f) => toutesPages(site).some(([c, p]) => f(p, c));
  const relatif = (href) => href != null && !/^#|^[a-z][a-z0-9+.-]*:|^\/\//i.test(href.trim());
  // Les feuilles d'une page : ses <STYLE> et les fichiers .css reliés par <LINK>.
  function feuilles(site, chemin) {
    const p = site.pages[chemin]; if (!p) return [];
    const out = [...p.doc.querySelectorAll("style")].map((s) => s.textContent);
    p.doc.querySelectorAll('link[rel~="stylesheet" i][href]').forEach((l) => {
      const r = R(l.getAttribute("href"), chemin, site);
      if (r.fichier && site.css[r.fichier] != null) out.push(site.css[r.fichier]);
    });
    return out;
  }
  const lignes = (table) => [...table.rows].map((tr) => [...tr.cells].map((c) => ({ colspan: c.colSpan, rowspan: c.rowSpan })));

  /* ---------- Les 7 étapes ---------- */

  const ETAPES = [
    {
      n: 1, titre: "Le squelette", chapitre: "../chapitre2/",
      consigne: "Donne à chacune de tes 3 pages une structure complète : `<!DOCTYPE html>`, `<HTML>`, `<HEAD>` et `<BODY>`. Écris un `<TITLE>` différent pour chaque page. Sur l'accueil, ajoute la balise `<META>` de l'auteur (ton nom) et choisis les couleurs de la page avec `BGCOLOR` et `TEXT`.",
      exemple: '<HEAD>\n    <META CHARSET="utf-8">\n    <META NAME="Author" CONTENT="Fatou Diop">\n    <TITLE>Club Info UAM — Accueil</TITLE>\n</HEAD>\n<BODY BGCOLOR="#FFFFE0" TEXT="#202020">',
      checks: [
        { id: "doctype", label: "Chaque page commence par `<!DOCTYPE html>`", ok: (s) => pagesBase(s).length === 3 && pagesBase(s).every((p) => /^\s*<!DOCTYPE\s+html\s*>/i.test(p.src)) },
        { id: "structure", label: "`<HTML>`, `<HEAD>` et `<BODY>` sur chaque page", ok: (s) => pagesBase(s).length === 3 && pagesBase(s).every((p) => /<html[\s>]/i.test(p.src) && /<head[\s>]/i.test(p.src) && /<body[\s>]/i.test(p.src)) },
        { id: "titres", label: "Un `<TITLE>` sur chaque page, tous différents", ok: (s) => { const t = pagesBase(s).map((p) => (p.doc.title || "").trim().toLowerCase()); return t.length === 3 && t.every(Boolean) && new Set(t).size === 3; } },
        { id: "meta", label: "Sur l'accueil : `<META CHARSET>` et `<META NAME=\"Author\">`", ok: (s) => { const p = s.pages[s.base[0]]; return !!p && !!p.doc.querySelector("meta[charset]") && [...p.doc.querySelectorAll('meta[name="author" i]')].some((m) => (m.getAttribute("content") || "").trim()); } },
        { id: "couleurs", label: "Sur l'accueil : `BGCOLOR` et `TEXT` sur le `<BODY>`", ok: (s) => { const p = s.pages[s.base[0]]; return !!p && !!p.doc.querySelector("body[bgcolor][text]"); } },
      ],
    },
    {
      n: 2, titre: "Le texte", chapitre: "../chapitre3/",
      consigne: "Donne un titre `<H1>` à chaque page. Sur l'accueil, présente ton sujet en au moins deux paragraphes `<P>`, sépare des parties avec `<HR>` et mets des mots en valeur (`<B>`, `<STRONG>`, `<EM>`…). En bas de page, ajoute une mention avec `&copy;`.",
      exemple: "<H1>Club Info UAM</H1>\n<HR>\n<P>Bienvenue au <B>Club Info</B> de l'UAM.</P>\n<P>Nous nous réunissons <EM>chaque mardi</EM>.</P>\n<P><SMALL>&copy; 2026 Club Info UAM</SMALL></P>",
      checks: [
        { id: "h1", label: "Un `<H1>` sur chaque page", ok: (s) => pagesBase(s).length === 3 && pagesBase(s).every((p) => p.doc.querySelector("h1")) },
        { id: "paragraphes", label: "Sur l'accueil : au moins 2 paragraphes `<P>` bien fermés", ok: (s, T) => { const p = s.pages[s.base[0]]; return !!p && T.n(p.doc, "p") >= 2 && T.ferme(p.src, "p"); } },
        { id: "hr", label: "Une ligne `<HR>`", ok: (s) => unePage(s, (p) => p.doc.querySelector("hr")) },
        { id: "valeur", label: "Des mots mis en valeur (`<B>`, `<I>`, `<U>`, `<EM>` ou `<STRONG>`)", ok: (s) => unePage(s, (p) => p.doc.querySelector("b, i, u, em, strong")) },
        { id: "copy", label: "Une mention `&copy;`", ok: (s) => unePage(s, (p) => /&copy;/i.test(p.src)) },
      ],
    },
    {
      n: 3, titre: "Les listes", chapitre: "../chapitre4/",
      consigne: "Sur ta deuxième page, présente ton contenu avec des listes : une liste à puces `<UL>` d'au moins 3 éléments, une liste numérotée `<OL>` d'au moins 3 éléments, et une liste rangée à l'intérieur d'un `<LI>`.",
      exemple: "<UL>\n    <LI>Ateliers</LI>\n    <LI>Programmation\n        <OL>\n            <LI>HTML</LI>\n            <LI>CSS</LI>\n        </OL>\n    </LI>\n    <LI>Conférences</LI>\n</UL>",
      checks: [
        { id: "ul", label: "Une liste `<UL>` d'au moins 3 éléments", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll("ul")].some((u) => u.querySelectorAll(":scope > li").length >= 3)) },
        { id: "ol", label: "Une liste `<OL>` d'au moins 3 éléments", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll("ol")].some((o) => o.querySelectorAll(":scope > li").length >= 3)) },
        { id: "imbriquee", label: "Une liste imbriquée dans un `<LI>`", ok: (s) => unePage(s, (p) => p.doc.querySelector("li ul, li ol")) },
      ],
    },
    {
      n: 4, titre: "Les liens", chapitre: "../chapitre5/",
      consigne: "Relie tes pages : sur chaque page, un menu de liens `<A HREF>` vers les deux autres. Sur la page de contact, ajoute un lien `mailto:`. Ajoute un lien vers un autre site (`http://…`) qui s'ouvre dans un nouvel onglet avec `TARGET`, et un lien vers une ancre de la page (`#…`).",
      exemple: '<P>\n    <A HREF="index.html">Accueil</A> |\n    <A HREF="activites.html">Activités</A> |\n    <A HREF="contact.html">Contact</A>\n</P>\n<A HREF="mailto:club@uam.sn">Écrire au club</A>\n<A HREF="http://www.google.fr" TARGET="_blank">Google</A>\n<A HREF="#haut">Retour en haut</A>',
      checks: [
        { id: "menu", label: "Sur chaque page, des liens vers les deux autres pages", ok: (s) => s.base.every((c) => { const p = s.pages[c]; if (!p) return false; const cibles = new Set([...p.doc.querySelectorAll("a[href]")].map((a) => R(a.getAttribute("href"), c, s).fichier).filter(Boolean)); return s.base.filter((x) => x !== c).every((x) => cibles.has(x)); }) },
        { id: "liens-casses", label: "Aucun lien cassé vers un fichier absent du dossier", ok: (s) => toutesPages(s).every(([c, p]) => [...p.doc.querySelectorAll("a[href]")].every((a) => { const h = a.getAttribute("href"); return !relatif(h) || !!R(h, c, s).fichier; })) },
        { id: "mailto", label: "Un lien `mailto:` sur la page de contact", ok: (s) => { const p = s.pages[s.contact]; return !!p && !!p.doc.querySelector('a[href^="mailto:" i]'); } },
        { id: "externe", label: "Un lien `http://` vers un autre site, avec `TARGET=\"_blank\"`", ok: (s) => unePage(s, (p) => p.doc.querySelector('a[href^="http" i][target="_blank" i]')) },
        { id: "ancre", label: "Un lien vers une ancre `#…` qui existe", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll('a[href^="#"]')].some((a) => { const id = decodeURIComponent(a.getAttribute("href").slice(1)); return id && (p.doc.getElementById(id) || p.doc.getElementsByName(id).length); })) },
      ],
    },
    {
      n: 5, titre: "Les images", chapitre: "../chapitre6/",
      consigne: "Ajoute une photo ou un logo dans le dossier `images/` (menu Fichiers), puis affiche-la avec `<IMG>`. Chaque image a un texte `ALT`. Indique `WIDTH` ou `HEIGHT`, et rends une image cliquable en la plaçant dans un `<A HREF>`.",
      exemple: '<A HREF="index.html">\n    <IMG SRC="images/logo.gif" WIDTH="80" ALT="Logo du club" BORDER="0">\n</A>',
      checks: [
        { id: "image", label: "Une image du dossier, rangée dans `images/`", ok: (s) => unePage(s, (p, c) => [...p.doc.querySelectorAll("img[src]")].some((i) => { const r = R(i.getAttribute("src"), c, s); return r.fichier && r.fichier.startsWith("images/"); })) },
        { id: "alt", label: "Un texte `ALT` sur toutes les images", ok: (s) => { let n = 0; const ok = toutesPages(s).every(([, p]) => [...p.doc.querySelectorAll("img")].every((i) => { n++; return i.hasAttribute("alt"); })); return ok && n > 0; } },
        { id: "taille", label: "`WIDTH` ou `HEIGHT` sur une image", ok: (s) => unePage(s, (p) => p.doc.querySelector("img[width], img[height]")) },
        { id: "cliquable", label: "Une image cliquable : `<IMG>` dans un `<A HREF>`", ok: (s) => unePage(s, (p) => p.doc.querySelector("a[href] img")) },
      ],
    },
    {
      n: 6, titre: "Le tableau", chapitre: "../chapitre7/",
      consigne: "Ajoute un tableau `<TABLE>` avec une bordure (`BORDER`) : par exemple un emploi du temps ou un programme. Donne-lui un titre `<CAPTION>`, une ligne d'en-têtes `<TH>`, et fusionne au moins deux cellules avec `COLSPAN` ou `ROWSPAN`. Chaque ligne doit avoir le même nombre de colonnes.",
      exemple: '<TABLE BORDER="1">\n    <CAPTION>Programme</CAPTION>\n    <TR><TH>Jour</TH><TH>Activité</TH></TR>\n    <TR><TD ROWSPAN="2">Mardi</TD><TD>HTML</TD></TR>\n    <TR><TD>CSS</TD></TR>\n</TABLE>',
      checks: [
        { id: "table", label: "Un `<TABLE>` avec `BORDER`", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll("table[border]")].some((t) => parseInt(t.getAttribute("border"), 10) > 0)) },
        { id: "caption", label: "Un titre `<CAPTION>`", ok: (s) => unePage(s, (p) => p.doc.querySelector("table caption")) },
        { id: "th", label: "Une ligne d'en-têtes `<TH>`", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll("tr")].some((tr) => tr.cells.length && [...tr.cells].every((c) => c.tagName === "TH"))) },
        { id: "fusion", label: "Une fusion `COLSPAN` ou `ROWSPAN`", ok: (s) => unePage(s, (p) => [...p.doc.querySelectorAll("td, th")].some((c) => c.colSpan > 1 || c.rowSpan > 1)) },
        { id: "grille", label: "Le même nombre de colonnes sur chaque ligne, fusions comprises", ok: (s) => { const tables = toutesPages(s).flatMap(([, p]) => [...p.doc.querySelectorAll("table")]); return tables.length > 0 && tables.every((t) => { const l = MH.outils.largeursGrille(lignes(t)); return l.every((x) => x === l[0]); }); } },
      ],
    },
    {
      n: 7, titre: "Le style", chapitre: "../chapitre8/",
      consigne: "Harmonise l'apparence de ton site avec une feuille de style : une balise `<STYLE>` dans le `<HEAD>` de chaque page (ou un fichier `style.css` relié par `<LINK>`). Écris une règle pour une balise, par exemple `p { color: … }`, et crée une classe que tu utilises avec `CLASS`.",
      exemple: '<HEAD>\n    <STYLE>\n        body { background-color: #FFFFE0; }\n        p { color: #202020; font-size: 12pt }\n        .important { color: red }\n    </STYLE>\n</HEAD>\n<P CLASS="important">Réunion chaque mardi.</P>',
      checks: [
        { id: "feuille", label: "Une balise `<STYLE>` dans le `<HEAD>`, ou un `style.css` relié", ok: (s) => toutesPages(s).some(([c]) => feuilles(s, c).length > 0) },
        { id: "regle", label: "Une règle pour une balise, comme `p { … }`", ok: (s) => toutesPages(s).some(([c]) => feuilles(s, c).some((t) => /(^|[}\s,])[a-z][a-z0-9]*\s*\{/i.test(t))) },
        { id: "classe", label: "Une classe définie dans la feuille et utilisée avec `CLASS`", ok: (s) => { const def = new Set(); toutesPages(s).forEach(([c]) => feuilles(s, c).forEach((t) => { for (const m of t.matchAll(/\.([a-z_][\w-]*)\s*[{,.:\s]/gi)) def.add(m[1].toLowerCase()); })); return toutesPages(s).some(([, p]) => [...p.doc.querySelectorAll("[class]")].some((e) => [...e.classList].some((k) => def.has(k.toLowerCase())))); } },
        { id: "partout", label: "Chaque page reçoit des styles", ok: (s) => s.base.length === 3 && s.base.every((c) => feuilles(s, c).length > 0) },
      ],
    },
  ];

  function evaluer(site) {
    return ETAPES.map((e) => {
      const resultats = e.checks.map((c) => { try { return !!c.ok(site, MH.T); } catch (err) { return false; } });
      return { n: e.n, resultats, reussie: resultats.every(Boolean) };
    });
  }

  MH.projet = { MODELES, ETAPES, analyser, evaluer };
})();

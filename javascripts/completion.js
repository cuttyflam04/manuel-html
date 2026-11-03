/* Manuel HTML — suggestions pendant la frappe (logique pure, testée sous Node).
   suggerer(texte, position, opts) → null, ou { de, a, items: [{ libelle, texte, curseur, astuce }] } :
   remplacer texte[de..a] par item.texte, puis placer le curseur à de + item.curseur.
   Uniquement les notions du cours (annexe B) ; les formulaires seulement avec opts.formulaires. */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  // [nom, orpheline ?, astuce]
  const BALISES = [
    ["HTML", false, "Englobe tout le document : un <HEAD> puis un <BODY>."],
    ["HEAD", false, "En-tête : informations sur la page (TITLE, META), rien de ce qui s'y trouve ne s'affiche."],
    ["TITLE", false, "Titre de la page, affiché dans l'onglet du navigateur. Se place dans <HEAD>."],
    ["META", true, "Information sur la page (encodage, auteur, mots-clés). Orpheline, dans <HEAD>."],
    ["BODY", false, "Corps de la page : tout ce qui s'affiche à l'écran."],
    ["P", false, "Paragraphe. Le navigateur laisse un espace avant et après."],
    ["BR", true, "Retour à la ligne, à l'intérieur d'un paragraphe. Orpheline : pas de </BR>."],
    ["H1", false, "Titre de niveau 1, le plus important. En général un seul par page."],
    ["H2", false, "Titre de niveau 2 : une grande partie de la page."],
    ["H3", false, "Titre de niveau 3 : une sous-partie."],
    ["H4", false, "Titre de niveau 4."],
    ["H5", false, "Titre de niveau 5."],
    ["H6", false, "Titre de niveau 6, le moins important."],
    ["HR", true, "Ligne horizontale de séparation. Orpheline. Options : SIZE, WIDTH, ALIGN."],
    ["CENTER", false, "Centre tout ce qu'elle contient."],
    ["B", false, "Gras (bold)."],
    ["I", false, "Italique (italic)."],
    ["U", false, "Souligné (underline)."],
    ["EM", false, "Insistance : italique par défaut, mais porte un sens."],
    ["STRONG", false, "Texte important : gras par défaut, mais porte un sens."],
    ["BIG", false, "Texte plus gros."],
    ["SMALL", false, "Texte plus petit : mentions légales, copyright."],
    ["SUP", false, "Exposant : 1<SUP>er</SUP>."],
    ["SUB", false, "Indice : H<SUB>2</SUB>O."],
    ["FONT", false, "Change la couleur (COLOR) ou la taille (SIZE, de 1 à 7) d'un passage."],
    ["UL", false, "Liste à puces. Ne contient que des <LI>."],
    ["OL", false, "Liste numérotée. Ne contient que des <LI>."],
    ["LI", false, "Un élément de liste, dans un <UL> ou un <OL>. Peut contenir une sous-liste."],
    ["A", false, "Lien : HREF indique la destination, le texte entre les balises est cliquable."],
    ["IMG", true, "Image. Orpheline : pas de </IMG>. SRC et ALT sont indispensables."],
    ["TABLE", false, "Tableau : des lignes <TR>, qui contiennent des cellules <TD> ou <TH>."],
    ["CAPTION", false, "Titre du tableau, juste après <TABLE>."],
    ["TR", false, "Une ligne du tableau (table row). Chaque ligne a le même nombre de cellules."],
    ["TH", false, "Cellule d'en-tête : en gras et centrée."],
    ["TD", false, "Cellule de données (table data), dans une ligne <TR>."],
    ["STYLE", false, "Feuille de style de la page, dans <HEAD> : p { color: red }."],
    ["LINK", true, "Relie un fichier .css : REL=\"stylesheet\" HREF=\"style.css\". Orpheline, dans <HEAD>."],
  ];
  const FORMULAIRES = [
    ["FORM", false, "Formulaire : ACTION (destination) et METHOD (GET ou POST)."],
    ["INPUT", true, "Champ de saisie ; TYPE choisit le genre. Sans NAME, rien n'est envoyé."],
    ["SELECT", false, "Liste déroulante, qui contient des <OPTION>."],
    ["OPTION", false, "Un choix d'une liste <SELECT>."],
    ["OPTGROUP", false, "Groupe de choix avec un intitulé (LABEL)."],
    ["TEXTAREA", false, "Zone de texte sur plusieurs lignes ; le texte de départ va entre les balises."],
    ["FIELDSET", false, "Encadre un groupe de champs."],
    ["LEGEND", false, "Titre d'un <FIELDSET>."],
  ];

  // Attributs du cours, avec leur astuce.
  const A = {
    ALIGN: "Alignement : LEFT, CENTER, RIGHT (ou JUSTIFY).",
    BGCOLOR: "Couleur de fond : nom anglais ou code #RRVVBB.",
    TEXT: "Couleur du texte de la page.",
    LINK: "Couleur des liens.", ALINK: "Couleur du lien au moment du clic.", VLINK: "Couleur des liens déjà visités.",
    BACKGROUND: "Image de fond de la page.",
    CHARSET: "Encodage des caractères : utf-8, pour que les accents s'affichent.",
    NAME: "Nom (META : author, description, keywords ; A : étiquette d'ancre).",
    CONTENT: "Valeur de la balise META (auteur, description…).",
    "HTTP-EQUIV": "Refresh : redirection automatique après quelques secondes.",
    SIZE: "Taille (HR : épaisseur ; FONT : 1 à 7 ou +1, +2…).",
    WIDTH: "Largeur, en pixels ou en %.",
    HEIGHT: "Hauteur, en pixels ou en %. Une seule des deux suffit à garder les proportions.",
    COLOR: "Couleur : nom anglais ou code #RRVVBB.",
    HREF: "Destination du lien : page.html, dossier/page.html, ../page.html, http://…, #ancre, mailto:…",
    TITLE: "Info-bulle affichée au survol.",
    TARGET: "_blank ouvre le lien dans un nouvel onglet.",
    SRC: "Chemin du fichier image, par exemple images/photo.jpg.",
    ALT: "Texte qui décrit l'image et la remplace si elle ne charge pas. Obligatoire (vide pour une image décorative).",
    BORDER: "Épaisseur du cadre en pixels ; 0 enlève le cadre d'une image cliquable.",
    VALIGN: "Alignement vertical : TOP, MIDDLE, BOTTOM.",
    COLSPAN: "Fusionne des cellules à l'horizontale : la cellule compte pour plusieurs colonnes.",
    ROWSPAN: "Fusionne des cellules à la verticale : à retirer dans les lignes du dessous.",
    REL: "stylesheet : le fichier relié est une feuille de style.",
    STYLE: "Style local : propriété: valeur; (color: red; font-size: 14pt).",
    CLASS: "Classe définie dans <STYLE>, par exemple h1.rouge { … }.",
    ID: "Étiquette pour une ancre : un lien HREF=\"#…\" y mène.",
    ACTION: "Page qui recevra les données du formulaire.", METHOD: "GET (dans l'adresse) ou POST (invisible).",
    ENCTYPE: "multipart/form-data, obligatoire pour envoyer un fichier.",
    TYPE: "text, password, radio, checkbox, submit, reset, file, hidden…",
    VALUE: "Valeur envoyée, ou texte d'un bouton.", CHECKED: "Coché par défaut.", SELECTED: "Choisi par défaut.",
    MULTIPLE: "Autorise plusieurs choix.", ROWS: "Nombre de lignes visibles.", COLS: "Largeur en caractères.",
    MAXLENGTH: "Nombre maximal de caractères.", LABEL: "Intitulé du groupe.",
  };
  const GLOBAUX = ["STYLE", "CLASS", "ID"];
  const PAR_BALISE = {
    BODY: ["BGCOLOR", "TEXT", "LINK", "ALINK", "VLINK", "BACKGROUND"],
    META: ["CHARSET", "NAME", "CONTENT", "HTTP-EQUIV"],
    P: ["ALIGN"], H1: ["ALIGN"], H2: ["ALIGN"], H3: ["ALIGN"], H4: ["ALIGN"], H5: ["ALIGN"], H6: ["ALIGN"],
    HR: ["SIZE", "WIDTH", "ALIGN"], FONT: ["COLOR", "SIZE"],
    A: ["HREF", "TITLE", "TARGET", "NAME"],
    IMG: ["SRC", "ALT", "WIDTH", "HEIGHT", "BORDER", "ALIGN"],
    TABLE: ["BORDER", "WIDTH", "BGCOLOR"], CAPTION: ["ALIGN"], TR: ["ALIGN", "VALIGN"],
    TD: ["ALIGN", "VALIGN", "COLSPAN", "ROWSPAN", "WIDTH"], TH: ["ALIGN", "VALIGN", "COLSPAN", "ROWSPAN", "WIDTH"],
    LINK: ["REL", "HREF"],
    FORM: ["ACTION", "METHOD", "ENCTYPE"], INPUT: ["TYPE", "NAME", "VALUE", "SIZE", "MAXLENGTH", "CHECKED"],
    SELECT: ["NAME", "SIZE", "MULTIPLE"], OPTION: ["VALUE", "SELECTED"], OPTGROUP: ["LABEL"],
    TEXTAREA: ["NAME", "ROWS", "COLS"],
  };
  const ENTITES = [
    ["eacute", "é"], ["egrave", "è"], ["ecirc", "ê"], ["euml", "ë"], ["agrave", "à"], ["aacute", "á"], ["acirc", "â"],
    ["auml", "ä"], ["iuml", "ï"], ["ccedil", "ç"], ["ntilde", "ñ"], ["lt", "<"], ["gt", ">"], ["amp", "&"],
    ["nbsp", "espace insécable"], ["copy", "©"], ["#171", "«"], ["#187", "»"],
  ];

  const balises = (opts) => (opts && opts.formulaires ? BALISES.concat(FORMULAIRES) : BALISES);
  const orphelines = (opts) => new Set(balises(opts).filter((b) => b[1]).map((b) => b[0]));
  const casse = (modele, mot) => (/^[a-z]/.test(modele) ? mot.toLowerCase() : mot);

  function suggerer(texte, pos, opts) {
    const avant = texte.slice(0, pos);

    // 1. Caractère spécial : &ea…
    let m = /&([a-z#0-9]*)$/i.exec(avant);
    if (m) {
      const p = m[1].toLowerCase();
      const items = ENTITES.filter(([n]) => n.startsWith(p)).map(([n, c]) => ({
        libelle: "&" + n + ";  " + c, texte: n + ";", curseur: n.length + 1,
        astuce: "Affiche « " + c + " ». Le code commence par & et finit par ;.",
      }));
      return items.length ? { de: pos - m[1].length, a: pos, items } : null;
    }

    // 2. Fermeture : </… → la dernière balise restée ouverte d'abord
    m = /<\/([A-Za-z0-9]*)$/.exec(avant);
    if (m) {
      const orph = orphelines(opts), pile = [];
      const re = /<(\/?)([A-Za-z][A-Za-z0-9]*)[^<>]*>/g;
      let t;
      while ((t = re.exec(avant.slice(0, m.index)))) {
        const nom = t[2].toUpperCase();
        if (orph.has(nom)) continue;
        if (!t[1]) pile.push({ nom, brut: t[2] });
        else { const i = pile.map((x) => x.nom).lastIndexOf(nom); if (i >= 0) pile.splice(i); }
      }
      const vus = new Set(), items = [];
      for (let i = pile.length - 1; i >= 0; i--) {
        const { nom, brut } = pile[i];
        if (vus.has(nom) || !nom.startsWith(m[1].toUpperCase())) continue;
        vus.add(nom);
        const mot = casse(m[1] || brut, nom);
        items.push({ libelle: "</" + nom + ">", texte: mot + ">", curseur: mot.length + 1,
          astuce: i === pile.length - 1 ? "Ferme la dernière balise ouverte : <" + nom + ">." : "Balise encore ouverte : <" + nom + ">." });
      }
      return items.length ? { de: pos - m[1].length, a: pos, items } : null;
    }

    // 3. Nom de balise : <U…  (et <! pour le doctype ou un commentaire)
    m = /<(!?[A-Za-z0-9-]*)$/.exec(avant);
    if (m) {
      const p = m[1].toUpperCase();
      const items = [];
      if ("!DOCTYPE".startsWith(p) && p !== "") items.push({ libelle: "<!DOCTYPE html>", texte: casse(m[1].slice(1) || "D", "!DOCTYPE") + " html>", curseur: 15, astuce: "Toute première ligne de la page : elle indique qu'il s'agit de HTML." });
      if ("!--".startsWith(p) && p.startsWith("!")) items.push({ libelle: "<!-- commentaire -->", texte: "!--  -->", curseur: 4, astuce: "Commentaire : le navigateur ne l'affiche pas." });
      if (!p.startsWith("!")) {
        const orph = orphelines(opts);
        balises(opts).forEach(([nom, , astuce]) => {
          if (!nom.startsWith(p)) return;
          const mot = casse(m[1] || "A", nom);
          const paire = !orph.has(nom);
          items.push({ libelle: "<" + nom + ">", texte: mot + ">" + (paire ? "</" + mot + ">" : ""), curseur: mot.length + 1, astuce });
        });
        // L'exact d'abord (« <P » propose <P> avant <PRE>…), puis l'ordre du cours.
        items.sort((x, y) => (y.libelle === "<" + p + ">") - (x.libelle === "<" + p + ">"));
      }
      return items.length ? { de: pos - m[1].length, a: pos, items } : null;
    }

    // 4. Attribut : à l'intérieur d'une balise ouvrante, hors guillemets
    const ouv = avant.lastIndexOf("<"), ferm = avant.lastIndexOf(">");
    if (ouv > ferm) {
      const dedans = avant.slice(ouv + 1);
      m = /^([A-Za-z][A-Za-z0-9]*)\s(.*?)([A-Za-z-]*)$/s.exec(dedans);
      if (!m) return null;
      if (((m[2] + m[3]).match(/"/g) || []).length % 2 || ((m[2] + m[3]).match(/'/g) || []).length % 2) return null;
      if (m[2] && !/\s$/.test(m[2]) && m[2].length) return null;
      const nom = m[1].toUpperCase();
      const presents = new Set((m[2].match(/([A-Za-z-]+)\s*=/g) || []).map((x) => x.replace(/\s*=$/, "").toUpperCase()));
      const liste = (PAR_BALISE[nom] || []).concat(GLOBAUX.filter((g) => !(PAR_BALISE[nom] || []).includes(g)));
      const p = m[3].toUpperCase();
      const items = liste.filter((a) => a.startsWith(p) && !presents.has(a)).map((a) => {
        const mot = casse(m[3] || m[1], a);
        return { libelle: a, texte: mot + '=""', curseur: mot.length + 2, astuce: A[a] || "" };
      });
      return items.length ? { de: pos - m[3].length, a: pos, items } : null;
    }
    return null;
  }

  MH.completion = { suggerer, BALISES, FORMULAIRES };
})();

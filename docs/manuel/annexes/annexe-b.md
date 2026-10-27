# Annexe B — Récapitulatif des balises

Toutes les balises du cours, avec leur origine anglaise : retenir le mot anglais aide à retrouver la balise.

!!! tip "Astuce de mémorisation"

    `<IMG>` = *image*, `<TR>` = *table row*, `<OL>` = *ordered list*… Comprendre l'abréviation évite d'apprendre par cœur.

## Structure du document

| Balise | Origine | Rôle | Attributs du cours |
|--------|---------|------|--------------------|
| `<!DOCTYPE html>` | *Document type* | Déclare une page HTML | — |
| `<HTML>` | *HyperText Markup Language* | Délimite le document | — |
| `<HEAD>` | *Head* | En-tête (informations non affichées) | — |
| `<TITLE>` | *Title* | Titre, affiché dans l'onglet | — |
| `<META>` | *Metadata* | Informations sur la page | `NAME`, `CONTENT`, `HTTP-EQUIV`, `CHARSET` |
| `<BODY>` | *Body* | Corps (contenu affiché) | `BGCOLOR`, `BACKGROUND`, `TEXT`, `LINK`, `ALINK`, `VLINK` |
| `<!-- … -->` | *Comment* | Commentaire, non affiché | — |

## Texte

| Balise | Origine | Rôle | Attributs du cours |
|--------|---------|------|--------------------|
| `<P>` | *Paragraph* | Paragraphe | `ALIGN` |
| `<BR>` | *Break* | Retour à la ligne (orpheline) | — |
| `<H1>` … `<H6>` | *Header* | Titres de niveau 1 à 6 | `ALIGN` |
| `<HR>` | *Horizontal Rule* | Ligne horizontale (orpheline) | `SIZE`, `WIDTH`, `ALIGN` |
| `<CENTER>` | *Center* | Centre le contenu | — |
| `<B>` | *Bold* | Gras | — |
| `<I>` | *Italic* | Italique | — |
| `<U>` | *Underline* | Souligné | — |
| `<EM>` | *Emphasis* | Insistance (italique par défaut) | — |
| `<STRONG>` | *Strong* | Importance (gras par défaut) | — |
| `<BIG>` | *Big* | Texte plus gros | — |
| `<SMALL>` | *Small* | Texte plus petit, mentions légales | — |
| `<SUP>` | *Superscript* | Exposant | — |
| `<SUB>` | *Subscript* | Indice | — |
| `<FONT>` | *Font* | Couleur et taille du texte | `COLOR`, `SIZE` (1 à 7 ou +n) |

## Listes

| Balise | Origine | Rôle |
|--------|---------|------|
| `<UL>` | *Unordered List* | Liste à puces |
| `<OL>` | *Ordered List* | Liste numérotée |
| `<LI>` | *List Item* | Élément de liste |

## Liens et images

| Balise | Origine | Rôle | Attributs du cours |
|--------|---------|------|--------------------|
| `<A>` | *Anchor* | Lien, ou étiquette d'ancre | `HREF`, `TITLE`, `TARGET`, `NAME` |
| `<IMG>` | *Image* | Image (orpheline) | `SRC`, `ALT`, `WIDTH`, `HEIGHT`, `BORDER`, `ALIGN` |

## Tableaux

| Balise | Origine | Rôle | Attributs du cours |
|--------|---------|------|--------------------|
| `<TABLE>` | *Table* | Tableau | `BORDER`, `WIDTH`, `BGCOLOR` |
| `<CAPTION>` | *Caption* | Titre du tableau | `ALIGN` (`TOP`, `BOTTOM`) |
| `<TR>` | *Table Row* | Ligne | `ALIGN`, `VALIGN` |
| `<TH>` | *Table Header* | Cellule d'en-tête | `COLSPAN`, `ROWSPAN`, `ALIGN`, `VALIGN` |
| `<TD>` | *Table Data* | Cellule | `ALIGN`, `VALIGN`, `COLSPAN`, `ROWSPAN`, `WIDTH` |

## Feuilles de style

| Code | Rôle |
|------|------|
| `STYLE="…"` | Attribut : style local d'une balise |
| `<STYLE> … </STYLE>` | Styles globaux, dans `<HEAD>` |
| `CLASS="nom"` | Attribut : applique une classe définie dans `<STYLE>` |

## Caractères spéciaux

| Code | Donne | Code | Donne |
|------|-------|------|-------|
| `&lt;` | < | `&eacute;` | é |
| `&gt;` | > | `&egrave;` | è |
| `&amp;` | & | `&ecirc;` | ê |
| `&nbsp;` | espace | `&agrave;` | à |
| `&copy;` | © | `&ccedil;` | ç |
| `&#171;` | « | `&#187;` | » |

## Bonus (hors programme) : formulaires

| Balise | Origine | Rôle |
|--------|---------|------|
| `<FORM>` | *Form* | Formulaire (`ACTION`, `METHOD`, `ENCTYPE`) |
| `<INPUT>` | *Input* | Champ (`TYPE`, `NAME`, `VALUE`…) |
| `<SELECT>` / `<OPTION>` | *Select* / *Option* | Liste déroulante et ses choix |
| `<OPTGROUP>` | *Option Group* | Groupe d'options |
| `<TEXTAREA>` | *Text Area* | Zone de texte sur plusieurs lignes |
| `<FIELDSET>` / `<LEGEND>` | *Field Set* / *Legend* | Groupe de champs et son titre |

# Annexe B — Tableau récapitulatif des balises HTML

## Comment mémoriser les balises HTML ?

La plupart des balises HTML sont des **abréviations de mots anglais**.

Connaître leur signification permet de retenir plus facilement leur rôle.

!!! tip "Astuce de mémorisation"

    Au lieu d'apprendre les balises par cœur, essayez de retenir **le mot anglais dont elles sont issues**.

    Par exemple :

    - `<IMG>` signifie **Image** ;
    - `<TABLE>` signifie **Table** (tableau) ;
    - `<FORM>` signifie **Form** (formulaire).

    Une fois l'origine comprise, il devient beaucoup plus facile de retrouver la bonne balise sans avoir besoin de la mémoriser mot à mot.

---

| Balise | Origine (anglais) | Signification | Principaux attributs | Exemple |
|---------|-------------------|---------------|----------------------|----------|
| `<HTML>` | HyperText Markup Language | Délimite le document HTML | — | `<HTML>...</HTML>` |
| `<HEAD>` | Head | En-tête du document | — | `<HEAD>...</HEAD>` |
| `<TITLE>` | Title | Titre de la page | — | `<TITLE>Mon site</TITLE>` |
| `<BODY>` | Body | Corps visible de la page | `BGCOLOR`, `TEXT` | `<BODY>` |
| `<H1>` à `<H6>` | Heading | Titre | `ALIGN` | `<H1>Titre</H1>` |
| `<P>` | Paragraph | Paragraphe | `ALIGN` | `<P>Bonjour</P>` |
| `<BR>` | Break | Retour à la ligne | — | `<BR>` |
| `<HR>` | Horizontal Rule | Ligne horizontale | `WIDTH`, `SIZE`, `ALIGN` | `<HR>` |
| `<B>` | Bold | Texte en gras | — | `<B>Important</B>` |
| `<I>` | Italic | Texte en italique | — | `<I>HTML</I>` |
| `<U>` | Underline | Texte souligné | — | `<U>Attention</U>` |
| `<IMG>` | Image | Insère une image | `SRC`, `ALT`, `HEIGHT`, `WIDTH` | `<IMG SRC="...">` |
| `<A>` | Anchor | Crée un lien | `HREF`, `TARGET` | `<A HREF="">` |
| `<UL>` | Unordered List | Liste à puces | — | `<UL>` |
| `<OL>` | Ordered List | Liste numérotée | — | `<OL>` |
| `<LI>` | List Item | Élément d'une liste | — | `<LI>` |
| `<TABLE>` | Table | Tableau | `BORDER`, `WIDTH`, `ALIGN` | `<TABLE>` |
| `<TR>` | Table Row | Ligne du tableau | — | `<TR>` |
| `<TH>` | Table Header | Cellule d'en-tête | `COLSPAN`, `ROWSPAN` | `<TH>` |
| `<TD>` | Table Data | Cellule de données | `COLSPAN`, `ROWSPAN` | `<TD>` |
| `<FORM>` | Form | Formulaire | `ACTION`, `METHOD` | `<FORM>` |
| `<INPUT>` | Input | Champ de saisie | `TYPE`, `NAME`, `VALUE` | `<INPUT>` |
| `<SELECT>` | Select | Liste déroulante | `NAME`, `SIZE`, `MULTIPLE` | `<SELECT>` |
| `<OPTION>` | Option | Choix d'une liste | `VALUE`, `SELECTED` | `<OPTION>` |
| `<OPTGROUP>` | Option Group | Groupe d'options | `LABEL` | `<OPTGROUP>` |
| `<FIELDSET>` | Field Set | Groupe de champs | — | `<FIELDSET>` |
| `<LEGEND>` | Legend | Titre d'un groupe | — | `<LEGEND>` |
| `<TEXTAREA>` | Text Area | Zone de texte | `ROWS`, `COLS`, `NAME` | `<TEXTAREA>` |

---

## Les principaux types de `<INPUT>`

| Type | Origine | Utilisation |
|------|---------|-------------|
| `text` | Text | Zone de texte simple |
| `password` | Password | Mot de passe masqué |
| `radio` | Radio Button | Choix unique |
| `checkbox` | Check Box | Plusieurs choix |
| `submit` | Submit | Envoi du formulaire |
| `reset` | Reset | Réinitialisation |
| `button` | Button | Bouton classique |
| `image` | Image | Bouton sous forme d'image |
| `file` | File | Sélection d'un fichier |
| `hidden` | Hidden | Champ invisible |

---

## À retenir

!!! success "Les balises les plus faciles à retenir"

    La plupart des balises HTML correspondent simplement à un mot anglais :

    - **Head** → `<HEAD>`
    - **Body** → `<BODY>`
    - **Paragraph** → `<P>`
    - **Image** → `<IMG>`
    - **Anchor** → `<A>`
    - **Table** → `<TABLE>`
    - **Table Row** → `<TR>`
    - **Table Header** → `<TH>`
    - **Table Data** → `<TD>`
    - **Form** → `<FORM>`
    - **Input** → `<INPUT>`
    - **Select** → `<SELECT>`
    - **Option** → `<OPTION>`
    - **Field Set** → `<FIELDSET>`
    - **Legend** → `<LEGEND>`
    - **Text Area** → `<TEXTAREA>`

    Une fois ces correspondances mémorisées, il devient beaucoup plus simple de retrouver naturellement les balises HTML.
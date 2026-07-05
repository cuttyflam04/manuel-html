# La mise en forme d'une page HTML

## Introduction

Une page Web ne se limite pas à l'affichage de texte. Pour améliorer sa présentation et faciliter la lecture, HTML propose plusieurs attributs permettant de modifier l'apparence d'une page.

Dans les premiers apprentissages du HTML, ces attributs sont directement intégrés aux balises. Bien qu'ils soient aujourd'hui remplacés par le **CSS** dans les sites Web modernes, ils restent très utiles pour comprendre le fonctionnement de la mise en page et sont encore utilisés dans de nombreux travaux pratiques.

Dans ce chapitre, nous étudierons les principaux attributs de présentation utilisés dans le HTML classique.

---

## Les couleurs de la page

La balise `<BODY>` possède plusieurs attributs permettant de modifier l'apparence générale de la page.

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `BGCOLOR` | Définit la couleur de fond de la page. |
| `TEXT` | Définit la couleur du texte. |

!!! example "Exemple 7.1 — Couleurs de base"

    ```html
    <BODY BGCOLOR="WHITE" TEXT="BLACK">
    ```

!!! info "Résultat"

    Le fond de la page sera blanc et le texte sera noir.

### Autres exemples

!!! example "Exemple 7.2"

    ```html
    <BODY BGCOLOR="LIGHTBLUE" TEXT="NAVY">
    ```

!!! example "Exemple 7.3"

    ```html
    <BODY BGCOLOR="YELLOW" TEXT="RED">
    ```

!!! tip "Remarque"

    Les couleurs peuvent être indiquées :

    - par leur nom en anglais (`WHITE`, `RED`, `BLUE`, etc.) ;
    - par leur code hexadécimal.

---

## Les couleurs en notation hexadécimale

Les couleurs peuvent également être représentées sous la forme :

```text
#RRGGBB
```

Chaque paire représente l'intensité des composantes :

- **RR** : Rouge ;
- **GG** : Vert ;
- **BB** : Bleu.

Quelques couleurs courantes :

| Couleur | Code |
|---------|------|
| Blanc | `#FFFFFF` |
| Noir | `#000000` |
| Rouge | `#FF0000` |
| Vert | `#00FF00` |
| Bleu | `#0000FF` |
| Jaune | `#FFFF00` |

!!! example "Exemple 7.4 — Couleur hexadécimale"

    ```html
    <BODY BGCOLOR="#F5F5F5" TEXT="#000000">
    ```

---

## L'alignement des éléments

L'attribut `ALIGN` permet de modifier la position de certains éléments.

Il peut être utilisé avec :

- les titres ;
- les paragraphes ;
- les tableaux ;
- les images.

### Les principales valeurs

| Valeur | Fonction |
|---------|----------|
| `LEFT` | Alignement à gauche |
| `CENTER` | Centrage |
| `RIGHT` | Alignement à droite |

!!! example "Exemple 7.5 — Titre centré"

    ```html
    <H1 ALIGN="CENTER">

        Université Amadou Mahtar Mbow

    </H1>
    ```

!!! example "Exemple 7.6 — Paragraphe aligné"

    ```html
    <P ALIGN="RIGHT">

        Ce texte est aligné à droite.

    </P>
    ```

!!! example "Exemple 7.7 — Tableau centré"

    ```html
    <TABLE
        BORDER="1"
        ALIGN="CENTER">
    ```

!!! warning "HTML5"

    L'attribut `ALIGN` est aujourd'hui **obsolète** en HTML5.

    Les sites Web modernes utilisent **CSS** pour gérer l'alignement des éléments.

---

## Les lignes horizontales

La balise `<HR>` permet de séparer plusieurs parties d'une page.

Elle améliore la lisibilité du document.

!!! example "Exemple 7.8 — Ligne horizontale"

    ```html
    Présentation

    <HR>

    Bienvenue sur notre site.
    ```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `WIDTH` | Largeur de la ligne |
| `SIZE` | Épaisseur |
| `ALIGN` | Alignement |

!!! example "Exemple 7.9 — Ligne personnalisée"

    ```html
    <HR
        WIDTH="70%"
        SIZE="4"
        ALIGN="CENTER">
    ```

---

## Les retours à la ligne

La balise `<BR>` permet de passer à la ligne sans créer un nouveau paragraphe.

!!! example "Exemple 7.10 — Retour à la ligne"

    ```html
    Nom : Ndiaye

    <BR>

    Prénom : Fatou

    <BR>

    Classe : Licence 2
    ```

!!! tip "Bonne pratique"

    Utilisez `<BR>` pour effectuer un simple retour à la ligne.

    Pour séparer plusieurs idées ou blocs de texte, préférez la balise `<P>`.

---

## Les styles de texte

HTML permet de mettre en valeur certaines parties du texte.

Les principales balises sont :

| Balise | Fonction |
|---------|----------|
| `<B>` | Gras |
| `<I>` | Italique |
| `<U>` | Souligné |

!!! example "Exemple 7.11 — Mise en valeur"

    ```html
    <P>

        Le langage

        <B>HTML</B>

        est

        <I>simple</I>

        à apprendre.

    </P>
    ```

!!! warning "HTML5"

    Dans les pages Web modernes, on privilégie généralement :

    - `<strong>` à la place de `<B>` ;
    - `<em>` à la place de `<I>`.

    Cependant, les balises `<B>` et `<I>` restent très utilisées dans les exercices d'initiation.

---

## Combiner plusieurs balises

Plusieurs balises peuvent être utilisées simultanément afin d'améliorer la présentation d'une page.

!!! example "Exemple 7.12 — Combinaison de balises"

    ```html
    <H1 ALIGN="CENTER">
        Bibliothèque Universitaire
    </H1>

    <P>

        Bienvenue dans la
        <B>bibliothèque</B>
        de l'université.

        Vous trouverez des ouvrages de
        <I>mathématiques</I>
        et d'
        <U>informatique</U>.

    </P>
    ```

---

## Exemple complet

!!! example "Présentation de l'UAM"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Présentation de l'UAM
        </TITLE>

    </HEAD>

    <BODY
        BGCOLOR="#F5F5F5"
        TEXT="BLACK">

        <H1 ALIGN="CENTER">
            Université Amadou Mahtar Mbow
        </H1>

        <HR WIDTH="80%" SIZE="3">

        <P ALIGN="JUSTIFY">

            L'

            <B>Université Amadou Mahtar Mbow</B>

            forme chaque année plusieurs milliers d'étudiants dans différents domaines scientifiques et technologiques.

            <BR><BR>

            Elle dispose de nombreuses salles de cours, laboratoires et bibliothèques.

        </P>

        <H2>
            Nos formations
        </H2>

        <P>

            <I>Génie Informatique</I>

            <BR>

            Sciences de l'Information et de la Communication

            <BR>

            Électronique

        </P>

        <HR>

        <P ALIGN="CENTER">

            <U>Fin de la présentation</U>

        </P>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier de fermer une balise de mise en forme (`<B>`, `<I>`, `<U>`) ;

    - utiliser des couleurs rendant le texte difficile à lire ;

    - abuser des retours à la ligne (`<BR>`) au lieu d'utiliser des paragraphes ;

    - centrer tous les éléments de la page, ce qui nuit à la lisibilité ;

    - utiliser simultanément plusieurs attributs de présentation sans cohérence.

---

## À retenir

!!! success "Points essentiels"

    - `BGCOLOR` définit la couleur de fond de la page.

    - `TEXT` définit la couleur du texte.

    - `ALIGN` permet d'aligner différents éléments.

    - `<HR>` crée une ligne horizontale.

    - `<BR>` effectue un retour à la ligne.

    - `<B>`, `<I>` et `<U>` permettent de mettre du texte en valeur.

    - Ces attributs appartiennent au HTML classique. Les sites Web modernes utilisent principalement le CSS pour gérer la présentation.

---

## Exercice de synthèse

!!! question "Exercice"

    Créer une page HTML intitulée **Présentation de mon université** contenant :

    - un fond de page de couleur claire ;

    - un titre principal centré ;

    - une ligne horizontale sous le titre ;

    - deux paragraphes présentant l'université ;

    - plusieurs retours à la ligne pour organiser les informations ;

    - au moins trois mots mis en **gras**, en *italique* et <u>soulignés</u> ;

    - un sous-titre aligné à gauche ;

    - une seconde ligne horizontale pour séparer la conclusion.

### Objectif

Maîtriser les principaux attributs de mise en forme du HTML classique et réaliser une page lisible et correctement présentée.

---

⬅️ **Précédent :** Les images en HTML

➡️ **Suivant :** Les feuilles de style CSS
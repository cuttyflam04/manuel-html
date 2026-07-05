# Les images en HTML

## Introduction

Les images occupent une place importante dans la conception d'une page Web.

Elles permettent :

- d'illustrer un texte ;
- d'améliorer la présentation d'un site ;
- de faciliter la compréhension des informations.

En HTML, les images sont insérées grâce à la balise `<IMG>`.

!!! tip "Remarque"

    La balise `<IMG>` est une **balise orpheline** (*void element*). Elle ne possède donc **pas de balise fermante**.

---

## La balise `<IMG>`

La balise `<IMG>` permet d'insérer une image dans une page HTML.

### Syntaxe générale

```html
<IMG SRC="image.jpg">
```

Le navigateur affiche alors l'image indiquée par l'attribut `SRC`.

---

## L'attribut `SRC`

L'attribut `SRC` (*Source*) indique l'emplacement de l'image.

L'image peut se trouver :

- dans le même dossier que la page HTML ;
- dans un sous-dossier ;
- dans un autre dossier de l'ordinateur ;
- sur Internet.

### Même dossier

!!! example "Exemple 6.1"

    ```html
    <IMG SRC="logo.jpg">
    ```

### Sous-dossier

!!! example "Exemple 6.2"

    ```html
    <IMG SRC="Images/logo.jpg">
    ```

### Autre dossier

!!! example "Exemple 6.3"

    ```html
    <IMG SRC="C:\MesImages\logo.jpg">
    ```

!!! tip "Bonne pratique"

    Lors des travaux pratiques réalisés en local, il est fréquent d'utiliser un chemin provenant directement de l'ordinateur.

    En revanche, pour un site Web destiné à être publié, il est recommandé de placer les images dans le même projet que les pages HTML et d'utiliser des **chemins relatifs**.

---

## L'attribut `ALT`

L'attribut `ALT` (*Alternative Text*) fournit une description de l'image.

Ce texte est affiché lorsque l'image ne peut pas être chargée.

Il améliore également l'accessibilité des pages Web, notamment pour les lecteurs d'écran.

!!! example "Exemple 6.4 — Texte alternatif"

    ```html
    <IMG
        SRC="photo.jpg"
        ALT="Photo d'un ordinateur portable">
    ```

---

## Les attributs `HEIGHT` et `WIDTH`

Les attributs `HEIGHT` et `WIDTH` permettent de modifier les dimensions de l'image.

### `HEIGHT`

Définit la hauteur.

!!! example "Exemple 6.5"

    ```html
    <IMG
        SRC="photo.jpg"
        HEIGHT="150">
    ```

### `WIDTH`

Définit la largeur.

!!! example "Exemple 6.6"

    ```html
    <IMG
        SRC="photo.jpg"
        WIDTH="300">
    ```

### `HEIGHT` et `WIDTH` ensemble

!!! example "Exemple 6.7"

    ```html
    <IMG
        SRC="photo.jpg"
        HEIGHT="180"
        WIDTH="300">
    ```

!!! tip "Bonne pratique"

    Pour éviter de déformer une image, il est préférable de modifier uniquement la largeur **ou** la hauteur, ou de conserver les proportions d'origine.

---

## L'attribut `ALIGN`

Dans le HTML classique utilisé lors des travaux pratiques, l'attribut `ALIGN` permet d'indiquer la position de l'image par rapport au texte.

Les principales valeurs sont :

| Valeur | Fonction |
|--------|----------|
| `LEFT` | Image placée à gauche. |
| `RIGHT` | Image placée à droite. |
| `TOP` | Alignement vers le haut. |
| `MIDDLE` | Alignement au milieu. |
| `BOTTOM` | Alignement vers le bas. |

!!! example "Exemple 6.8 — Image alignée à gauche"

    ```html
    <IMG
        SRC="photo.jpg"
        ALIGN="LEFT">

    Cette image est placée à gauche du paragraphe.
    ```

!!! warning "HTML5"

    L'attribut `ALIGN` est aujourd'hui **obsolète** en HTML5.

    Dans les sites modernes, le positionnement des images est réalisé avec **CSS**.

    Cet attribut reste néanmoins utile pour comprendre les anciens documents HTML et les exercices de ce cours.

---

## Les images comme liens

Une image peut également servir de lien hypertexte.

Il suffit de placer la balise `<IMG>` entre les balises `<A>`.

!!! example "Exemple 6.9 — Image cliquable"

    ```html
    <A HREF="accueil.html">

        <IMG
            SRC="maison.jpg"
            HEIGHT="100"
            ALT="Accueil">

    </A>
    ```

!!! info "Résultat"

    Lorsque l'utilisateur clique sur l'image, le navigateur ouvre la page indiquée.

---

## Plusieurs images dans une même page

Une page HTML peut contenir autant d'images que nécessaire.

!!! example "Exemple 6.10"

    ```html
    <IMG SRC="photo1.jpg">
    <IMG SRC="photo2.jpg">
    <IMG SRC="photo3.jpg">
    ```

---

## Exemple complet

!!! example "Galerie Informatique"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Galerie Informatique
        </TITLE>

    </HEAD>

    <BODY BGCOLOR="WHITE" TEXT="BLACK">

        <H1 ALIGN="CENTER">
            Salle Informatique
        </H1>

        <HR>

        <P>
            Bienvenue dans notre laboratoire informatique.
        </P>

        <IMG
            SRC="ordinateur.jpg"
            HEIGHT="180"
            ALT="Ordinateur"
            ALIGN="LEFT">

        <P>
            Les étudiants disposent d'ordinateurs modernes leur permettant de réaliser leurs travaux pratiques en programmation, infographie et développement Web.
        </P>

        <BR><BR><BR><BR><BR><BR>

        <HR>

        <H2>
            Quelques équipements
        </H2>

        <IMG
            SRC="imprimante.jpg"
            HEIGHT="120"
            ALT="Imprimante">

        <IMG
            SRC="serveur.jpg"
            HEIGHT="120"
            ALT="Serveur">

        <IMG
            SRC="projecteur.jpg"
            HEIGHT="120"
            ALT="Projecteur">

        <HR>

        <A HREF="accueil.html">

            <IMG
                SRC="retour.jpg"
                HEIGHT="70"
                ALT="Retour à l'accueil">

        </A>

    </BODY>

    </HTML>
    ```

---

## Les formats d'image

Les formats les plus utilisés sont :

| Format | Utilisation |
|---------|-------------|
| `JPG / JPEG` | Photographies |
| `PNG` | Images avec fond transparent |
| `GIF` | Images simples ou animées |
| `BMP` | Images non compressées |
| `WEBP` | Format moderne offrant une bonne qualité avec une taille réduite |

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier l'attribut `SRC` ;

    - utiliser un chemin incorrect ;

    - oublier l'attribut `ALT` ;

    - modifier excessivement la largeur ou la hauteur, ce qui déforme l'image ;

    - utiliser une image qui n'existe pas dans le dossier indiqué ;

    - confondre les majuscules et minuscules dans le nom du fichier.

---

## À retenir

!!! success "Points essentiels"

    - `<IMG>` permet d'insérer une image.

    - `SRC` indique l'emplacement de l'image.

    - `ALT` fournit un texte alternatif.

    - `HEIGHT` définit la hauteur.

    - `WIDTH` définit la largeur.

    - `ALIGN` permet de positionner l'image dans le HTML classique.

    - Une image peut également servir de lien hypertexte.

---

## Exercices

!!! question "Exercice 1"

    Créer une page intitulée **Galerie de l'UAM** contenant :

    - un titre principal ;
    - trois images représentant différents bâtiments de l'université ;
    - une ligne horizontale séparant chaque partie.

---

!!! question "Exercice 2"

    Créer une page présentant un laboratoire informatique avec :

    - une image alignée à gauche ;
    - un paragraphe décrivant le laboratoire ;
    - deux autres images affichées sous le texte.

---

!!! question "Exercice 3"

    Créer une page intitulée **Mon Album Photo** contenant :

    - cinq images de tailles différentes ;
    - une image servant de bouton **Retour à l'accueil** ;
    - une image accompagnée d'un texte descriptif utilisant l'attribut `ALT`.

### Objectif

Apprendre à insérer, dimensionner et organiser plusieurs images dans une page HTML tout en utilisant les principaux attributs de la balise `<IMG>`.

---

⬅️ **Précédent :** Les liens hypertextes en HTML

➡️ **Suivant :** Les feuilles de style CSS
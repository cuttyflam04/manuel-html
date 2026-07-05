# Les bases du HTML

## Introduction au langage HTML

### Qu'est-ce que le HTML ?

Le **HTML** (*HyperText Markup Language*) est le langage de balisage utilisé pour créer les pages Web.

Il permet de structurer le contenu d'un document afin que le navigateur puisse l'afficher correctement.

Le HTML **n'est pas un langage de programmation**. Il ne permet pas d'effectuer des calculs ou de prendre des décisions comme le ferait un programme. Son rôle est uniquement de décrire la structure d'une page.

Une page HTML est composée d'un ensemble de **balises** indiquant au navigateur comment organiser :

- le texte ;

- les images ;

- les tableaux ;

- les formulaires ;

- les autres éléments de la page.

---

## Structure générale d'une page HTML

Toute page HTML possède une structure de base.


| Balise | Fonction |
|--------|----------|
| `<HTML>` | Délimite le document HTML |
| `<HEAD>` | Contient les informations destinées au navigateur |
| `<TITLE>` | Définit le titre affiché dans l'onglet |
| `<BODY>` | Contient le contenu visible |

!!! example "Exemple 1.1 — Structure de base"

    ```html

    <HTML>

    <HEAD>

        <TITLE>Ma première page</TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H1>Bienvenue</H1>

        <P>Voici ma première page HTML.</P>

    </BODY>

    </HTML>

    ```

!!! info "Explication"

    - `<HTML>` ouvre le document.

    - `<HEAD>` contient les informations générales.

    - `<TITLE>` définit le nom de la page.

    - `<BODY>` contient tout ce qui sera affiché.

    - `BGCOLOR` définit la couleur du fond.

    - `TEXT` définit la couleur du texte.

---

## Les titres

Les titres permettent d'organiser le contenu d'une page selon différents niveaux.

| Balise | Importance |
|--------|------------|
| `<H1>` | Titre principal |
| `<H2>` | Sous-titre |
| `<H3>` | Section |
| `<H4>` | Sous-section |
| `<H5>` | Niveau inférieur |
| `<H6>` | Plus petit titre |

!!! example "Exemple 1.2 — Hiérarchie des titres"

    ```html

    <H1>Bibliothèque Universitaire</H1>

    <H2>Présentation</H2>

    <H3>Historique</H3>

    <H4>Création</H4>

    ```

!!! tip "Remarque"

    Le navigateur affiche automatiquement ces titres avec une taille décroissante.

---

## Les paragraphes

Les paragraphes servent à séparer les différentes idées d'un texte.

Ils utilisent la balise :

```html

<P> ... </P>

```

!!! example "Exemple 1.3 - Les paragraphes"

    ```html

    <P>

        Ceci est le premier paragraphe.

    </P>

    <P>

        Ceci est le second paragraphe.

    </P>

    ```

---

## Les sauts de ligne

Lorsque l'on souhaite simplement passer à la ligne sans créer un nouveau paragraphe, on utilise la balise :

```html

<BR>

```

!!! example "Exemple 1.4 - Retourner à la ligne"

    ```html

    Première ligne.<BR>

    Deuxième ligne.<BR>

    Troisième ligne.

    ```

---

## Les lignes horizontales

Une ligne horizontale permet de séparer visuellement deux parties d'une page.

Elle s'obtient avec :

```html

<HR>

```

!!! example "Exemple 1.5 - Séparer horizontalement deux lignes"

    ```html

    <H2>Chapitre 1</H2>

    <HR>

    <P>Début du chapitre.</P>

    ```

---

## La mise en forme du texte

HTML classique permet plusieurs mises en forme.

| Balise | Fonction |
|--------|----------|
| `<B>` | Gras |
| `<I>` | Italique |
| `<U>` | Souligné |

!!! example "Exemple 1.6 - Mise en forme basique"

    ```html

    <B>Texte en gras</B>

    <I>Texte en italique</I>

    <U>Texte souligné</U>

    ```

Ces balises peuvent être combinées.

```html

<B><I><U>Texte important</U></I></B>

```

---

## Les images

Une image s'insère avec la balise :

```html

<IMG>

```

Les principaux attributs sont :

| Attribut | Rôle |
|----------|------|
| `SRC` | Chemin vers l'image |
| `ALT` | Texte alternatif |
| `WIDTH` | Largeur |
| `HEIGHT` | Hauteur |

!!! example "Exemple 1.7 - Insérer un image"

    ```html

    <IMG SRC="campus.jpg"

         ALT="Campus universitaire"

         WIDTH="400">

    ```

---

## Exemple complet

!!! example "Exemple 1.8 - Page HTML complète"

    ```html

    <HTML>

    <HEAD>

        <TITLE>Ma première page</TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H1>Bienvenue</H1>

        <HR>

        <P>

            Ceci est ma première page HTML.

        </P>

        <IMG SRC="image.jpg"

             ALT="Illustration">

    </BODY>

    </HTML>

    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier de fermer une balise ;

    - mal imbriquer les balises ;

    - oublier l'attribut `SRC` d'une image ;

    - oublier l'attribut `ALT` ;

    - confondre les balises de titre.

---

## À retenir

!!! success "Points essentiels"

    - Le HTML structure une page Web.

    - Toute page commence par `<HTML>`.

    - `<HEAD>` contient les informations générales.

    - `<BODY>` contient le contenu affiché.

    - Les titres vont de `<H1>` à `<H6>`.

    - `<P>` crée un paragraphe.

    - `<BR>` effectue un retour à la ligne.

    - `<HR>` crée une séparation.

    - `<B>`, `<I>` et `<U>` mettent le texte en valeur.

    - `<IMG>` permet d'insérer une image.

---

## Exercices

!!! question "Exercice 1"

    Créer une page contenant :

    - un titre principal ;

    - deux sous-titres ;

    - trois paragraphes ;

    - une ligne horizontale ;

    - une image.

---

!!! question "Exercice 2"

    Réaliser une page intitulée **Présentation de mon université** contenant :

    - un titre ;

    - plusieurs paragraphes ;

    - une image ;

    - des mots en gras, italique et soulignés.

---

⬅️ **Précédent :** Introduction

➡️ **Suivant :** Les listes HTML
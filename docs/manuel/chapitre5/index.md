# Les liens hypertextes en HTML

## Introduction

L'une des principales caractéristiques du Web est la possibilité de naviguer facilement d'une page à une autre.

Cette navigation est rendue possible grâce aux **liens hypertextes**.

Un lien hypertexte est un élément cliquable permettant à l'utilisateur d'accéder :

- à une autre page Web ;
- à une page du même site ;
- à une section précise d'une page ;
- à une adresse électronique ;
- à un document (PDF, image, etc.).

Les liens sont créés à l'aide de la balise `<A>`, également appelée **balise d'ancre** (*Anchor*).

---

## La balise `<A>`

La balise `<A>` est utilisée pour créer un lien hypertexte.

### Syntaxe générale

```html
<A HREF="destination">

    Texte du lien

</A>
```

Le texte situé entre les deux balises est celui qui sera affiché et sur lequel l'utilisateur pourra cliquer.

---

## L'attribut `HREF`

L'attribut `HREF` (*Hypertext Reference*) indique la destination du lien.

Cette destination peut être :

- une page HTML ;
- une image ;
- un document ;
- une adresse Internet ;
- une adresse électronique.

!!! example "Exemple 5.1 — Lien vers une page"

    ```html
    <A HREF="page2.html">

        Accéder à la deuxième page

    </A>
    ```

!!! info "Fonctionnement"

    Lorsque l'utilisateur clique sur ce lien, le navigateur ouvre la page :

    `page2.html`

---

## Les liens internes

Un **lien interne** relie plusieurs pages appartenant au même site.

!!! example "Exemple 5.2 — Navigation interne"

    ```html
    <A HREF="accueil.html">
        Accueil
    </A>

    <BR>

    <A HREF="contact.html">
        Contact
    </A>

    <BR>

    <A HREF="galerie.html">
        Galerie
    </A>
    ```

!!! tip "Remarque"

    Ces pages doivent être présentes dans le même dossier que la page courante, ou bien le chemin indiqué dans `HREF` doit être correct.

---

## Les liens externes

Un **lien externe** permet d'accéder à un autre site Web.

!!! example "Exemple 5.3 — Lien externe"

    ```html
    <A HREF="https://www.uam.sn">

        Université Amadou Mahtar Mbow

    </A>
    ```

!!! info "Fonctionnement"

    Le navigateur ouvre alors le site indiqué.

---

## L'attribut `TARGET`

L'attribut `TARGET` indique où la page doit être ouverte.

Les principales valeurs sont :

| Valeur | Fonction |
|--------|----------|
| `_self` | Ouvre le lien dans la même fenêtre. |
| `_blank` | Ouvre le lien dans une nouvelle fenêtre ou un nouvel onglet. |
| `_parent` | Ouvre le lien dans la fenêtre parente. |
| `_top` | Ouvre le lien dans la fenêtre principale. |

!!! example "Exemple 5.4 — Ouverture dans un nouvel onglet"

    ```html
    <A
        HREF="https://www.uam.sn"
        TARGET="_blank">

        Site officiel de l'UAM

    </A>
    ```

---

## Les liens vers une adresse électronique

HTML permet également de créer un lien ouvrant automatiquement le logiciel de messagerie.

La syntaxe utilise le mot-clé :

```text
mailto:
```

!!! example "Exemple 5.5 — Lien e-mail"

    ```html
    <A HREF="mailto:secretariat@universite.sn">

        Contacter le secrétariat

    </A>
    ```

!!! info "Fonctionnement"

    Lorsque l'utilisateur clique sur ce lien, son logiciel de messagerie prépare automatiquement un nouveau courrier destiné à cette adresse.

---

## Les ancres

Une **ancre** permet d'accéder directement à une partie précise d'une même page.

Cette technique est particulièrement utile dans les longues pages contenant un sommaire.

### Étape 1 — Créer l'ancre

```html
<A NAME="bibliographie">
</A>

<H2>
    Bibliographie
</H2>
```

### Étape 2 — Créer le lien

```html
<A HREF="#bibliographie">

    Aller à la bibliographie

</A>
```

!!! info "Fonctionnement"

    Lorsque l'utilisateur clique sur ce lien, le navigateur se positionne directement sur la section correspondante.

!!! tip "Bonne pratique"

    En HTML5, il est préférable d'utiliser l'attribut `id` plutôt que `NAME` pour créer une ancre.

    Exemple :

    ```html
    <H2 id="bibliographie">
        Bibliographie
    </H2>
    ```

    Puis :

    ```html
    <A HREF="#bibliographie">
        Aller à la bibliographie
    </A>
    ```

---

## Les images comme liens

Une image peut également être utilisée comme lien hypertexte.

Il suffit de placer la balise `<IMG>` entre les balises `<A>`.

!!! example "Exemple 5.6 — Image cliquable"

    ```html
    <A HREF="accueil.html">

        <IMG
            SRC="logo.jpg"
            HEIGHT="120"
            ALT="Retour à l'accueil">

    </A>
    ```

!!! info "Résultat"

    L'utilisateur pourra cliquer directement sur l'image pour accéder à la page indiquée.

---

## Exemple complet

!!! example "Bibliothèque Universitaire"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Bibliothèque Universitaire
        </TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H1 ALIGN="CENTER">
            Bibliothèque Universitaire
        </H1>

        <HR>

        <H2>
            Navigation
        </H2>

        <A HREF="accueil.html">
            Accueil
        </A>

        <BR><BR>

        <A HREF="catalogue.html">
            Catalogue
        </A>

        <BR><BR>

        <A HREF="contact.html">
            Contact
        </A>

        <BR><BR>

        <A
            HREF="https://www.uam.sn"
            TARGET="_blank">

            Site officiel de l'UAM

        </A>

        <BR><BR>

        <A
            HREF="mailto:bibliotheque@uam.sn">

            Écrire au bibliothécaire

        </A>

        <BR><BR>

        <A HREF="#horaire">

            Voir les horaires

        </A>

        <HR>

        <P>Lorem ipsum dolor sit amet...</P>
        <P>Lorem ipsum dolor sit amet...</P>
        <P>Lorem ipsum dolor sit amet...</P>

        <A NAME="horaire"></A>

        <H2>
            Horaires d'ouverture
        </H2>

        <P>
            Du lundi au vendredi : 08h00 - 18h00
        </P>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier l'attribut `HREF` ;

    - utiliser un chemin de fichier incorrect ;

    - oublier de fermer la balise `<A>` ;

    - utiliser un nom d'ancre différent entre `NAME` et `HREF="#..."` ;

    - écrire une adresse Internet incomplète (par exemple `www.site.com` au lieu de `https://www.site.com`).

---

## À retenir

!!! success "Points essentiels"

    - La balise `<A>` permet de créer un lien hypertexte.

    - L'attribut `HREF` indique la destination du lien.

    - Les liens peuvent être internes ou externes.

    - L'attribut `TARGET` permet de choisir la manière dont le lien sera ouvert.

    - Le mot-clé `mailto:` permet de créer un lien vers une adresse électronique.

    - Une ancre permet de naviguer rapidement à l'intérieur d'une même page.

    - Une image peut servir de lien en étant placée entre les balises `<A>`.

---

## Exercices

!!! question "Exercice 1"

    Créer une page **Accueil.html** contenant :

    - un titre principal ;
    - trois liens internes :
        - Présentation ;
        - Galerie ;
        - Contact.

---

!!! question "Exercice 2"

    Créer une page **Liens.html** contenant :

    - un lien vers le site de l'Université ;
    - un lien ouvrant une nouvelle fenêtre ;
    - un lien permettant d'envoyer un courrier électronique au secrétariat.

---

!!! question "Exercice 3"

    Créer une page intitulée **Guide de l'étudiant** comprenant :

    - un sommaire placé en haut de la page ;

    - trois sections :
        - Présentation ;
        - Formations ;
        - Horaires.

    - des ancres permettant d'accéder directement à chaque section ;

    - une image servant de bouton **Retour à l'accueil**.

### Objectif

Maîtriser la création et l'utilisation des liens hypertextes, des ancres et des images cliquables.

---

⬅️ **Précédent :** Les formulaires HTML

➡️ **Suivant :** Les images HTML
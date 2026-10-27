# Le Web et le langage HTML

Avant d'écrire la moindre balise, il faut savoir où vit une page Web, qui la lit et comment elle arrive jusqu'à votre écran. Ce chapitre reprend l'introduction du cours de Dr Niang.

## Le World Wide Web

Le **World Wide Web**, littéralement la « toile (d'araignée) mondiale », aussi appelé **le Web**, **la Toile** ou **WWW**, est un **système hypertexte public** fonctionnant sur Internet. Il permet de consulter, avec un **navigateur**, des pages accessibles sur des sites.

!!! info "Le Web n'est pas Internet"

    Le Web n'est qu'**une des applications** d'Internet. Le courrier électronique et la messagerie instantanée en sont d'autres.

Une **ressource du Web** est une entité informatique (texte, image, forum, boîte aux lettres électronique…) accessible indépendamment des autres ressources.

### Quelques dates

| Année | Événement |
|-------|-----------|
| 1989 | Tim Berners-Lee imagine un système pour relier des documents par des liens hypertexte. |
| 1991 | HTML 1 : première version, créée par Tim Berners-Lee seul. |
| 1994 | Naissance du **W3C** (*World Wide Web Consortium*), qui émet des recommandations pour assurer la compatibilité des technologies du Web. |

Le W3C publie des **recommandations**, pas des normes absolues. Il est géré conjointement par des universités et centres de recherche américains, européens et japonais.

## L'architecture client/serveur

Le Web fonctionne entre deux acteurs :

- le **client** : votre ordinateur ou téléphone, avec son navigateur, qui **demande** une page ;
- le **serveur** : l'ordinateur qui **héberge** le site et **répond** en envoyant la page.

### Le protocole HTTP

Le **HTTP** est un protocole simple : le client émet une **requête** vers un serveur HTTP pour obtenir une **ressource**. Cette ressource est identifiée par une **URL**, sa position « logique » dans le réseau.

Au départ, HTTP servait à demander des pages hypertexte (HTML). Une page se construit ensuite en combinant d'autres ressources : des images, des feuilles de style, des scripts.

Le déroulement d'une requête :

1. Demande d'une connexion
2. Établissement de la connexion
3. Envoi d'une requête (l'URL)
4. Réponse du serveur
5. Affichage de la réponse
6. Fermeture de la connexion

## Site, page et publication

- Une **page Web** est un document HTML, accompagné des documents qu'il utilise (images, sons, vidéos…).
- Un **site Web** est un ensemble de pages Web.
- **Concevoir un site**, c'est réaliser un ensemble de pages reliées entre elles par des liens hypertexte.

Un site est **réalisé** par un concepteur, **hébergé** sur un serveur, et **consulté** par des utilisateurs. Le concepteur dépose son site chez l'hébergeur.

## Qu'est-ce que le HTML ?

Le **HTML**, *HyperText Markup Language*, est le langage qui sert à écrire les pages Web. C'est un **langage de balises** qui permet de structurer des pages et de les relier entre elles par des **liens hypertexte**.

C'est un langage **interprété** (non compilé) : il est lu au fur et à mesure par un autre programme, le navigateur.

!!! note "Langage de programmation ?"

    Le HTML n'est pas vraiment un langage de programmation : c'est plutôt la définition d'un **format de document**. Il ne fait ni calcul ni décision, il décrit le contenu d'une page.

Le HTML permet de :

- publier des documents en ligne contenant des en-têtes, du texte, des tableaux, des listes… ;
- retrouver des informations d'un clic grâce aux **liens hypertexte** ;
- concevoir des **formulaires** pour faire des recherches, des réservations, commander des produits…

Deux concepts se cachent derrière HTML :

- **Hypertexte** : une façon de relier entre eux des documents multimédias ;
- **Balises** : une façon d'indiquer le formatage des éléments.

### D'où vient le HTML ?

Le HTML tire son origine du langage **SGML** (*Standard Generalized Markup Language*). Il en est une forme particulière, destinée au Web.

### Les versions du HTML

| Version | Année | Ce qu'elle apporte |
|---------|-------|--------------------|
| HTML 1 | 1991 | Première version, par Tim Berners-Lee. On ne pouvait même pas afficher d'images. |
| HTML 2 | 1994 | Pose les bases des versions suivantes. Ses règles sont données par le W3C. |
| HTML 3 | 1996 | Tableaux, applets, scripts, texte autour des images… |
| HTML 4 | 1998 | Frames, tableaux plus complexes, meilleurs formulaires, et surtout les **feuilles de style (CSS)**. |
| HTML 5 | — | La dernière version : vidéos faciles à inclure, meilleur agencement du contenu, nouveautés pour les formulaires. |

## Avec quoi écrire du HTML ?

Un document HTML est un **simple fichier texte**, écrit selon une syntaxe précise, structuré par des balises, puis **interprété** (affiché) par un navigateur.

On peut l'écrire avec :

- **un logiciel WYSIWYG** (*What You See Is What You Get*, « ce que vous voyez est ce que vous obtenez ») : Dreamweaver, Mozilla Composer, Microsoft Expression Web… et même Word. Faciles, mais le code HTML qu'ils génèrent est souvent de mauvaise qualité ;
- **un éditeur de texte** : Bloc-notes, WordPad, Emacs… (aujourd'hui, Visual Studio Code). Ils servent à écrire du code, dans plusieurs langages. C'est ce que nous utilisons ;
- **un logiciel « assistant »** au code HTML : HTML-Kit sur PC, Amaya sur Unix, PageSpinner sur Mac.

### Le rôle du navigateur

Le **navigateur** (*browser*) est le programme qui permet de voir les sites Web : Firefox, Safari, Chrome… Son travail est de **lire le code HTML** et d'**afficher un résultat visuel** à l'écran.

Quand il rencontre un type de fichier qu'il ne connaît pas, il cherche un **plugin** (une extension qui lui apprend à ouvrir ce fichier), ou lance l'application correspondante.

!!! tip "Les navigateurs sont tolérants"

    Un navigateur affiche quelque chose **même quand le code contient des erreurs**. Une page qui « s'affiche » n'est donc pas forcément une page correcte : prenez l'habitude de relire votre code.

### Code HTML et visualisation

Pour créer une page :

1. Ouvrez votre éditeur et écrivez votre code.
2. Enregistrez le fichier avec l'extension **`.html`**.
3. Ouvrez le dossier dans l'Explorateur de fichiers et double-cliquez sur le fichier : il s'ouvre dans le navigateur.

Pour voir le code HTML de n'importe quelle page Web : **clic droit → Afficher le code source** (ou <kbd>Ctrl</kbd> + <kbd>U</kbd>).

Dans ce manuel, chaque exemple montre **son code et son rendu**, comme si vous l'ouvriez dans un navigateur. Essayez :

!!! example "Exemple 1.1 — Une toute première page"

    ```html
    <!DOCTYPE html>
    <HTML>
    <HEAD>
        <TITLE>Mon premier fichier</TITLE>
    </HEAD>
    <BODY>
        Hello world
        Ceci est la première ligne
        Ceci est la deuxième ligne
    </BODY>
    </HTML>
    ```

Remarquez deux choses dans le rendu :

- le **titre** « Mon premier fichier » n'apparaît pas dans la page, mais dans **l'onglet** ;
- les trois lignes s'affichent **sur une seule ligne** : le navigateur ignore les retours à la ligne du code. Nous verrons au chapitre 3 comment aller à la ligne.

Cliquez sur **Modifier le code**, changez le texte, et regardez le rendu suivre.

## Les balises

Une page HTML est remplie de **balises**. Elles sont invisibles pour le visiteur, mais elles disent à l'ordinateur ce qu'il doit afficher.

Une balise est un **mot-clé encadré par deux chevrons** `<` et `>`.

### Les balises en paires

La plupart des balises vont par deux : une **balise ouvrante** et une **balise fermante**. La fermante est identique, avec un `/` après le `<`.

```html
<H1>Ceci est un titre</H1>
```

`<H1>` ouvre le titre, `</H1>` le ferme. Tout ce qui n'est pas entre les deux n'est pas un titre. On appelle **zone d'action** de la balise ce qui se trouve entre l'ouvrante et la fermante.

### Les balises orphelines

Certaines balises sont seules : elles servent à insérer un élément à un endroit précis, sans rien encadrer. Par exemple, une image ou un retour à la ligne :

```html
<IMG SRC="photo.jpg">
<BR>
```

!!! note "Le `/` final"

    On peut écrire une balise orpheline `<BR>` ou `<BR />`. Le `/` de fin n'est **pas obligatoire**, mais certains webmasters le recommandent pour ne pas confondre les deux types de balises.

## Les attributs

Les **attributs** sont les **options** des balises. Ils se placent dans la balise ouvrante, après son nom, et ont le plus souvent une **valeur** :

```html
<BALISE ATTRIBUT="valeur">
```

Par exemple, `SRC` indique quel fichier image afficher :

```html
<IMG SRC="gava.jpg">
```

Retenez trois règles :

- les attributs sont **prédéfinis** par le HTML : on ne peut pas en inventer ;
- une balise peut avoir **plusieurs attributs**, séparés par des espaces ;
- la valeur peut être entre guillemets doubles, simples, ou sans guillemets. **Par convention, nous utilisons les guillemets doubles `" "`.**

!!! tip "Majuscules ou minuscules ?"

    Le HTML ne fait pas la différence : `<BODY>` et `<body>` sont identiques. Ce manuel écrit les balises **en majuscules**, comme en TP, pour bien les distinguer du texte.

## À retenir

!!! success "Points essentiels"

    - Le **Web** est un système hypertexte public, une des applications d'Internet.
    - Le **client** demande une page, le **serveur** la renvoie, grâce au protocole **HTTP**.
    - Le **HTML** est un langage de balises **interprété** par le navigateur.
    - Une balise est un mot-clé entre `<` et `>` ; elle est **en paire** ou **orpheline**.
    - Les **attributs** complètent une balise : `<BALISE ATTRIBUT="valeur">`.

## Exercice

<div class="exo" data-exo="ch1-1" markdown>
Écrivez une page dont **l'onglet** affiche « Ma page UAM » et dont le corps contient la phrase « Bonjour le Web ». Partez de la structure ci-dessous.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch1"></div>

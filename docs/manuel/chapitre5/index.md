# Les liens hypertextes

Les liens sont ce qui fait du Web une « toile » : ils relient les pages entre elles. Un lien est un mot, une suite de mots ou une image, repéré par une balise spéciale.

Cliquer sur un lien permet d'aller :

- vers un nouveau document HTML, du même serveur ou d'ailleurs sur le Web (par son **URL**) ;
- vers un **autre endroit du même document** ;
- vers un document quelconque.

Dans un navigateur, les liens sont en général **soulignés**, le pointeur de la souris change d'apparence au survol, et l'adresse de destination s'affiche en bas de la fenêtre.

## La balise `<A>`

Un lien se crée avec la balise `<A> … </A>` (*anchor*, « ancre »).

```html
<A HREF="cible_du_lien">Texte du lien</A>
```

- L'attribut **`HREF`** indique vers quelle page on envoie l'utilisateur.
- Le texte placé entre `<A>` et `</A>` s'appelle **l'ancre du lien** : c'est lui qui est cliquable.
- L'attribut **`TITLE`** (facultatif) ajoute une **info-bulle** qui s'affiche au survol.

!!! example "Exemple 5.1 — Un lien avec info-bulle"

    ```html
    <A HREF="index.html" TITLE="Retour à l'accueil du site">Ancre du lien</A>
    ```

Dans l'aperçu, cliquer sur un lien affiche où il mènerait.

## Les adresses (URL)

Les adresses du Web sont des **URL** (*Uniform Resource Locator*). Elles se décomposent ainsi :

```text
http://www.univ-chlef.dz/seqanal/LicenceInf/intro-fr.html#Partie1
```

| Partie | Exemple |
|--------|---------|
| Le **protocole** | `http` |
| Le **serveur** | `www.univ-chlef.dz` |
| Le **fichier** | `/seqanal/LicenceInf/intro-fr.html` |
| Un **ancrage** | `#Partie1` |

Dans un lien, l'adresse peut être :

- **absolue** : elle contient tout le chemin, **en commençant par le protocole** : `http://www.univ-chlef.dz/pub_social.htm` ;
- **relative** : elle ne contient qu'une partie du chemin : `Mon_repertoire/monfichier.html`.

## Lien externe, vers un autre site

La cible est l'**adresse complète** du site, `http://` compris. C'est un **lien absolu**.

!!! example "Exemple 5.2 — Lien externe"

    ```html
    <A HREF="http://www.google.fr" TITLE="Moteur de recherche Google">Lien externe vers Google</A><BR>
    <A HREF="http://www.univ-chlef.dz/">L'université de Chlef</A>
    ```

!!! danger "Attention"

    `HREF="www.google.fr"` ne fonctionne **pas** comme lien externe : sans `http://`, le navigateur cherche un fichier nommé `www.google.fr` dans votre dossier.

## Liens internes, vers une page du même site

Un site est un ensemble de pages rangées dans un dossier, appelé **racine du site**. Ces pages peuvent être organisées en **sous-dossiers**.

### Fichier du même dossier

Il suffit d'écrire le **nom du fichier**. Ce sont des **liens relatifs** : relatifs au dossier dans lequel se trouve la page.

!!! example "Exemple 5.3 — Liens relatifs"

    ```html
    <A HREF="page1.html" TITLE="Ma 1re page">Ma page</A><BR>
    <A HREF="index.html" TITLE="Accueil du site">L'accueil</A>
    ```

### Fichier d'un autre dossier

- Pour **descendre** dans un sous-dossier, on ajoute son nom suivi de `/` : `monrepertoire/mapage.html`.
- Pour **remonter** d'un dossier, on écrit `../` : `../index.html`.

Imaginons ce site :

```text
racine/
├── index.html
├── cours/
│   └── html.html
└── tp/
    └── tp1.html
```

| Depuis… | Vers… | On écrit |
|---------|-------|----------|
| `index.html` | `cours/html.html` | `HREF="cours/html.html"` |
| `cours/html.html` | `index.html` | `HREF="../index.html"` |
| `cours/html.html` | `tp/tp1.html` | `HREF="../tp/tp1.html"` |

Le dernier cas **remonte** d'abord à la racine avec `../`, puis **redescend** dans `tp/`.

## Ouvrir dans un nouvel onglet : `TARGET`

L'attribut `TARGET="_blank"` ouvre le lien dans une **nouvelle fenêtre** ou un **nouvel onglet**, selon le navigateur.

!!! example "Exemple 5.4 — Nouvel onglet"

    ```html
    <A HREF="http://www.google.fr" TARGET="_blank">Ouvrir Google dans un nouvel onglet</A>
    ```

!!! tip "À utiliser avec modération"

    Le cours pose la question : faut-il **laisser l'utilisateur garder le contrôle** de son navigateur ? Ouvrir des onglets sans prévenir peut le gêner.

## Les ancres : aller à un endroit de la page

Un **lien interne** (ou ancre) amène à un **endroit précis** de la page, comme les liens « retour en haut de page » ou le sommaire de Wikipédia. L'ancre apparaît dans l'URL (`…page.html#nom`).

Cela se fait en **deux étapes** :

1. **Marquer l'endroit** à atteindre avec une étiquette :
    - soit avec `<A NAME="nom">` ;
    - soit avec l'attribut `ID="nom"` sur n'importe quelle balise.
2. **Créer le lien** vers cet endroit, avec `#` suivi du nom : `<A HREF="#nom">`.

!!! example "Exemple 5.5 — Un sommaire avec ancres"

    ```html
    <H1 ID="haut">Guide de l'étudiant</H1>
    <A HREF="#p1">Paragraphe 1</A> |
    <A HREF="#p2">Paragraphe 2</A>
    <P>Lorem ipsum dolor sit amet…</P>
    <P>Lorem ipsum dolor sit amet…</P>
    <P>Lorem ipsum dolor sit amet…</P>
    <H2><A NAME="p1">Paragraphe 1</A></H2>
    <P>Le sujet abord&eacute; ici est…</P>
    <P>Lorem ipsum dolor sit amet…</P>
    <P>Lorem ipsum dolor sit amet…</P>
    <H2 ID="p2">Paragraphe 2</H2>
    <P>Contrairement à ce qui était mentionné au <A HREF="#p1">paragraphe 1</A>…</P>
    <P><A HREF="#haut">Retour en haut de page</A></P>
    ```

### Ancre dans une autre page

On peut aussi viser un endroit d'**une autre page** : on écrit l'adresse de la page, puis `#` et le nom de l'étiquette.

```html
<A HREF="monfichier.html#ref">Vers la référence</A>
<A HREF="http://www.toto.com/ExempleLienInterne.html#p1">Paragraphe 1 d'un autre document</A>
```

!!! support "Dans le support de cours"

    L'exemple de la page 77 écrit `<A NAME="http://www.toto.com/ExempleLienInterne.html#p1">` pour **accéder** au paragraphe d'un autre document. Pour créer un lien, il faut **`HREF`**, pas `NAME` : `NAME` sert seulement à **poser** l'étiquette. La bonne écriture est donc `<A HREF="http://www.toto.com/ExempleLienInterne.html#p1">`.

## Lien vers une adresse e-mail ou un téléphone

| Code | Effet |
|------|-------|
| `<A HREF="mailto:monmail@gmail.com">` | Ouvre automatiquement le logiciel de messagerie, avec l'adresse déjà remplie. |
| `<A HREF="tel:13371337">` | Propose d'**appeler** ce numéro (utile sur téléphone). |

!!! example "Exemple 5.6 — E-mail et téléphone"

    ```html
    <A HREF="mailto:secretariat@uam.sn">Écrire au secrétariat</A><BR>
    <A HREF="tel:338000000">Appeler la scolarité</A>
    ```

!!! warning "Le cours le signale"

    Un e-mail écrit en clair dans une page peut être **récupéré par des robots** et recevoir du spam. Pour une vraie page de contact, on préfère un **formulaire**.

## Une image comme lien

Une image peut servir de lien : il suffit de placer la balise `<IMG>` **entre** `<A>` et `</A>`. Nous verrons la balise `<IMG>` en détail au chapitre suivant.

!!! example "Exemple 5.7 — Image cliquable"

    ```html
    <A HREF="index.html">
        <IMG SRC="maison.gif" WIDTH="80" ALT="Retour à l'accueil" BORDER="0">
    </A>
    ```

`BORDER="0"` évite le cadre de couleur que certains navigateurs dessinent autour d'une image cliquable.

## À retenir

!!! success "Points essentiels"

    - Un lien s'écrit `<A HREF="cible">ancre du lien</A>` ; `TITLE` ajoute une info-bulle.
    - Une URL contient un protocole, un serveur, un fichier et parfois une ancre.
    - Un lien **absolu** commence par `http://` ; un lien **relatif** part du dossier courant.
    - `dossier/page.html` descend dans un dossier, `../page.html` remonte d'un dossier.
    - `TARGET="_blank"` ouvre un nouvel onglet.
    - Une ancre se pose avec `NAME` ou `ID` et s'appelle avec `HREF="#nom"`.
    - `mailto:` ouvre la messagerie, `tel:` propose un appel.

## Exercices

<div class="exo" data-exo="ch5-1" markdown>
Créez un menu avec trois **liens relatifs** vers `presentation.html`, `galerie.html` et `contact.html`, puis un **lien externe** vers `http://www.google.fr` qui s'ouvre dans un **nouvel onglet**.
</div>

<div class="exo" data-exo="ch5-2" markdown>
Créez une page avec un **sommaire** de deux liens vers deux sections, **« Formations »** et **« Horaires »**, marquées par des ancres. Ajoutez un lien **mailto** vers `scolarite@uam.sn`. Cliquez sur vos liens dans le rendu pour vérifier qu'ils fonctionnent.
</div>

<div class="exo" data-exo="ch5-3" markdown>
Votre page est dans le dossier `cours/`. Créez un lien vers `index.html`, qui se trouve **un dossier au-dessus**, et un lien vers `tp1.html`, qui se trouve dans le dossier `tp/` **à côté** de `cours/`.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch5"></div>

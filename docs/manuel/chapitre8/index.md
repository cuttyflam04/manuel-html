# Les feuilles de style

Jusqu'ici, la présentation passait par des balises et des attributs : `<FONT>`, `BGCOLOR`, `ALIGN`… Depuis HTML 4, on peut décrire l'apparence de la page avec des **feuilles de style**, le fameux **CSS**. Ce chapitre présente les bases vues en cours.

## Trois façons de définir un style

Le cours en distingue trois :

1. **Dans la page elle-même, localement** : sur un seul élément, avec l'attribut `STYLE` ;
2. **Dans la page elle-même, globalement** : pour toute la page, avec la balise `<STYLE>` dans l'en-tête ;
3. **Dans un fichier séparé.**

## Une règle de style

Un style s'écrit sous la forme **`propriété: valeur`**. Plusieurs règles se séparent par un **point-virgule**.

```css
color: red; font-size: 14pt; text-align: center
```

Les propriétés utilisées dans le cours :

| Propriété | Rôle | Exemple |
|-----------|------|---------|
| `background-color` | Couleur de fond | `background-color: black` |
| `color` | Couleur du texte | `color: #0000FF` |
| `font-size` | Taille du texte | `font-size: 14pt` |
| `text-align` | Alignement du texte | `text-align: center` |
| `margin-left` | Marge à gauche | `margin-left: 1in` |
| `margin-right` | Marge à droite | `margin-right: 1in` |

`pt` signifie *point* (unité de taille de texte), `in` signifie *inch*, le pouce (environ 2,54 cm).

## Méthode 1 : le style local, attribut `STYLE`

On applique un style **directement à une balise** avec l'attribut `STYLE`. On parle de **style local** : il ne concerne que cette balise.

!!! example "Exemple 8.1 — Style local"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Style local</TITLE>
    </HEAD>
    <BODY STYLE="background-color: black">
        <P STYLE="margin-left: 1in; margin-right: 1in; color: #0000FF">
            Ceci est un paragraphe sur la ville de Chlef :<BR>
            il est bleu, avec une marge d'un pouce de chaque côté.
        </P>
    </BODY>
    </HTML>
    ```

!!! support "Dans le support de cours"

    L'exemple de la page 96 ouvre la valeur avec un guillemet droit et la ferme avec deux apostrophes : `style="background-color:black’’`. Les guillemets doivent être **identiques** et **droits** : `STYLE="background-color: black"`.

## Méthode 2 : le style global, balise `<STYLE>`

On écrit les styles **une seule fois**, dans l'en-tête, entre `<STYLE>` et `</STYLE>`. Chaque règle commence par le **nom de la balise** visée, suivi des propriétés entre **accolades** `{ }`.

```css
p { font-size: 14pt; color: red; text-align: center }
```

Cette règle s'applique à **tous** les paragraphes de la page.

!!! example "Exemple 8.2 — Style global"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Style global</TITLE>
        <STYLE>
            body { background-color: black; }
            p { font-size: 14pt; color: red; text-align: center }
        </STYLE>
    </HEAD>
    <BODY>
        <P>Premier paragraphe : rouge, centré.</P>
        <P>Deuxième paragraphe : pareil, sans rien répéter.</P>
    </BODY>
    </HTML>
    ```

Notez que la balise `<STYLE>` est déclarée **dans l'en-tête**, entre `<HEAD>` et `</HEAD>`.

!!! tip "L'intérêt du style global"

    Avec `<FONT COLOR="red">`, il faudrait répéter la couleur dans **chaque** paragraphe. Avec `<STYLE>`, une seule ligne change **tous** les paragraphes. Modifiez `red` en `yellow` dans l'exemple : les deux paragraphes changent d'un coup.

## Les classes : `CLASS`

Pour donner des styles **différents** à des balises du même type, on crée des **classes**. Dans `<STYLE>`, on écrit le nom de la balise, un **point**, puis le nom de la classe :

```css
h1.red  { color: #FF0000; font-size: 20pt }
h1.blue { color: #0000FF; font-size: 20pt }
```

Dans le corps, on choisit la classe avec l'attribut `CLASS` :

```html
<H1 CLASS="red">Ce titre sera rouge</H1>
```

!!! example "Exemple 8.3 — Classes"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Classes</TITLE>
        <STYLE>
            body { background-color: black; }
            p { font-size: 14pt; color: red; text-align: center }
            h1.red { color: #FF0000; font-size: 20pt }
            h1.blue { color: #0000FF; font-size: 20pt }
        </STYLE>
    </HEAD>
    <BODY>
        <FONT COLOR="white">Le fond de cette page est toujours noir !</FONT>
        <H1 CLASS="red">This will be red</H1>
        <P>Ceci est un paragraphe sur la ville de Chlef.</P>
        <H1 CLASS="blue">This will be blue</H1>
    </BODY>
    </HTML>
    ```

!!! support "Dans le support de cours (page 98)"

    - `< /h1>` contient une espace en trop : la balise fermante s'écrit **`</h1>`**, sans espace après `<`.
    - `<font color=‘’white’’>` utilise deux apostrophes typographiques : écrivez **`<FONT COLOR="white">`**.
    - « Le font de cette page » : il faut lire « Le **fond** de cette page ».

## Méthode 3 : le fichier séparé

Le cours mentionne une troisième possibilité : écrire les styles **dans un fichier à part**, avec l'extension `.css`. Le même fichier peut alors servir à **toutes les pages** du site.

```css
/* fichier style.css */
body { background-color: black; }
p { color: red; }
```

La page le relie depuis son en-tête :

```html
<HEAD>
    <LINK REL="stylesheet" HREF="style.css">
</HEAD>
```

!!! note "À savoir"

    Le support cite cette méthode sans la détailler ; la balise `<LINK>` ci-dessus est la façon standard de la mettre en œuvre. Elle ne peut pas être montrée en aperçu ici, car le fichier `style.css` n'existe pas sur ce site.

## À retenir

!!! success "Points essentiels"

    - Un style s'écrit `propriété: valeur`, les règles séparées par `;`.
    - **Style local** : attribut `STYLE="…"` sur une balise.
    - **Style global** : `<STYLE> balise { … } </STYLE>` dans `<HEAD>`, pour toute la page.
    - **Classe** : `balise.nom { … }` dans `<STYLE>`, puis `CLASS="nom"` sur la balise.
    - **Fichier séparé** : un fichier `.css` partagé par toutes les pages.

## Exercices

<div class="exo" data-exo="ch8-1" markdown>
Avec l'attribut `STYLE`, donnez au paragraphe un **texte bleu** et une **taille de 16pt**.
</div>

<div class="exo" data-exo="ch8-2" markdown>
Dans l'en-tête, ajoutez une balise `<STYLE>` qui rend **tous les paragraphes verts et centrés**, et crée une classe `h1.titre` en **rouge**. Utilisez cette classe sur le `<H1>`.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch8"></div>

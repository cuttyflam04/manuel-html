# La structure d'une page HTML

Toute page HTML suit le même squelette. Ce chapitre présente chaque pièce de ce squelette : le doctype, l'en-tête, le corps, les balises `<TITLE>` et `<META>`, puis les couleurs de la page.

## Le squelette d'une page

!!! example "Exemple 2.1 — Structure de base"

    ```html
    <!DOCTYPE html>
    <HTML>
    <HEAD>
        <TITLE>Ma première page</TITLE>
    </HEAD>
    <BODY>
        Bienvenue sur ma page.
    </BODY>
    </HTML>
    ```

| Balise | Rôle |
|--------|------|
| `<!DOCTYPE html>` | Indique qu'il s'agit d'une page Web HTML. |
| `<HTML> … </HTML>` | Délimite le début et la fin du document. |
| `<HEAD> … </HEAD>` | En-tête du document. |
| `<TITLE> … </TITLE>` | Titre du document. |
| `<BODY> … </BODY>` | Corps du document. |

### Le doctype

La toute première ligne s'appelle le **doctype**. Elle est **indispensable** : c'est elle qui indique qu'il s'agit bien d'une page Web HTML.

```html
<!DOCTYPE html>
```

Ce n'est pas vraiment une balise comme les autres : elle commence par un point d'exclamation. Considérez-la comme l'exception qui confirme la règle.

### La balise `<HTML>`

Tout document HTML commence par `<HTML>` et se termine par `</HTML>`. C'est la **balise principale** : elle englobe tout le contenu de la page.

Elle contient obligatoirement deux parties : l'**en-tête** `<HEAD>` et le **corps** `<BODY>`.

### L'en-tête `<HEAD>`

L'en-tête donne des **informations générales** sur la page : son titre, l'encodage des caractères, l'auteur… Ces informations **ne s'affichent pas** dans la page : elles sont destinées à l'ordinateur. Elles restent très importantes.

L'en-tête est généralement court.

### Le corps `<BODY>`

Le corps contient **tout ce qui s'affiche à l'écran**. C'est là que vous écrirez la majeure partie de votre code. `<BODY>` vient juste après l'en-tête.

## L'indentation

L'**indentation** consiste à décaler le texte vers la droite pour montrer ce qui est **à l'intérieur** de quoi. Elle ne change rien à l'affichage, mais rend le code lisible et les erreurs faciles à repérer.

```html
<HTML>
<HEAD>
    <TITLE>Bien indenté</TITLE>
</HEAD>
<BODY>
    <P>Le contenu est décalé d'un cran.</P>
</BODY>
</HTML>
```

## La balise `<TITLE>`

C'est le **titre de votre page**, probablement l'élément le plus important de l'en-tête. Toute page doit en avoir un qui décrit ce qu'elle contient.

- Elle est **obligatoire** et se place **toujours dans l'en-tête**, entre `<HEAD>` et `</HEAD>`.
- Gardez-la courte : moins de **100 caractères**.
- Le titre **ne s'affiche pas dans la page**, mais en haut de la fenêtre, dans **l'onglet** du navigateur.

!!! example "Exemple 2.2 — Le titre apparaît dans l'onglet"

    ```html
    <HTML>
    <HEAD>
        <TITLE>La page Web des étudiants en Licence TSW</TITLE>
    </HEAD>
    <BODY>
        Regardez l'onglet au-dessus de ce texte.
    </BODY>
    </HTML>
    ```

## La balise `<META>`

La balise `<META>` donne des **informations précises sur le document**. Elle est particulièrement utile pour que les **moteurs de recherche** reconnaissent votre page.

```html
<META NAME="nom" CONTENT="contenu">
```

- Elle se place dans l'en-tête.
- Elle **n'a pas besoin d'être fermée** (balise orpheline).
- Elle fonctionne avec des attributs : `NAME`, `CONTENT`, `HTTP-EQUIV`…
- Son contenu **n'est pas affiché** par le navigateur.

### Les principales utilisations

| Code | Rôle |
|------|------|
| `<META CHARSET="utf-8">` | Indique l'**encodage** des caractères, pour que les accents s'affichent correctement. |
| `<META NAME="Author" CONTENT="Votre nom">` | Le ou les **auteurs** de la page (séparés par des virgules). |
| `<META NAME="Description" CONTENT="…">` | Une **description** de la page pour les moteurs de recherche. |
| `<META NAME="Keywords" CONTENT="mot1, mot2">` | Des **mots-clés** décrivant la page. |
| `<META HTTP-EQUIV="Refresh" CONTENT="n; URL=adresse">` | **Redirige** automatiquement vers une autre page après `n` secondes. |

Pour la redirection, `n` est le délai en secondes, et `adresse` l'adresse (absolue ou relative) de la page à afficher ensuite.

!!! example "Exemple 2.3 — Un en-tête complet avec redirection"

    ```html
    <HTML>
    <HEAD>
        <TITLE>TP LPW</TITLE>
        <META CHARSET="utf-8">
        <META NAME="Description" CONTENT="Toutes les informations sur la Licence Informatique">
        <META NAME="Keywords" CONTENT="Licence, TSW, HTML">
        <META NAME="Author" CONTENT="Hadj Henni">
        <META HTTP-EQUIV="Refresh" CONTENT="5; URL=http://www.univ-chlef.dz">
    </HEAD>
    <BODY>
        Bienvenue sur notre site ;
        vous allez être réorienté vers notre nouvelle adresse dans 5 secondes.
    </BODY>
    </HTML>
    ```

Dans l'aperçu, la redirection est désactivée et un message indique où le navigateur serait allé.

!!! support "Dans le support de cours"

    Certains exemples du support utilisent des guillemets typographiques, comme `CONTENT=‘’Votre nom’’` ou `content="5; URL=…“`. **Le HTML ne les reconnaît pas** : dans votre éditeur, utilisez toujours les guillemets droits du clavier `"…"`.

## Les couleurs de la page

La balise `<BODY>` peut recevoir des **attributs** qui définissent les couleurs de toute la page.

| Attribut | Signification |
|----------|---------------|
| `BGCOLOR` | Couleur de fond de la page |
| `BACKGROUND` | Image de fond de la page |
| `TEXT` | Couleur du texte |
| `LINK` | Couleur des liens |
| `ALINK` | Couleur du lien actif (au moment du clic) |
| `VLINK` | Couleur des liens déjà visités |

!!! example "Exemple 2.4 — Fond jaune, texte bleu"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Mon super site</TITLE>
    </HEAD>
    <BODY BGCOLOR="yellow" TEXT="blue">
        <!-- À partir de là, ma page commence -->
        Bla bla bla et que je te raconte ma vie
    </BODY>
    </HTML>
    ```

### Nommer une couleur

Une couleur se donne de deux façons.

**Par son nom en anglais** : `black`, `white`, `yellow`, `red`, `blue`, `green`…

**Par son code hexadécimal** (RVB), précédé de `#`. Le code `#RRVVBB` donne la quantité de **rouge**, de **vert** et de **bleu**, de `00` (rien) à `FF` (le maximum).

| Couleur | Code |
|---------|------|
| Bleu | `#0000FF` |
| Vert | `#00FF00` |
| Rouge | `#FF0000` |
| Blanc | `#FFFFFF` |
| Noir | `#000000` |
| Jaune | `#FFFF00` |
| Violet | `#8000FF` |
| Gris clair | `#C0C0C0` |

!!! example "Exemple 2.5 — Toutes les couleurs du BODY"

    ```html
    <HTML>
    <HEAD>
        <TITLE>La page Web des étudiants en Licence Bio</TITLE>
        <META NAME="Author" CONTENT="Votre nom">
    </HEAD>
    <BODY BGCOLOR="#FFFFFF" TEXT="#000000" LINK="blue" ALINK="red" VLINK="magenta">
        Le texte est noir sur fond blanc.
        <A HREF="#">Ce lien est bleu</A>, rouge au moment du clic,
        et magenta une fois visité.
    </BODY>
    </HTML>
    ```

!!! support "Dans le support de cours"

    Le support écrit « code **RBV** » : il s'agit du code **RVB** (Rouge, Vert, Bleu).

## Les commentaires

Un **commentaire** est un texte que le navigateur **n'affiche pas**. Il sert à laisser des notes dans le code.

```html
<!-- Ceci est un commentaire : il ne s'affiche pas -->
```

Il commence par `<!--` et se termine par `-->`.

!!! support "Dans le support de cours"

    Un exemple du support écrit `<! A partir de là ma page commence>`. La bonne écriture est `<!-- A partir de là ma page commence -->`, avec les deux tirets au début **et** à la fin.

## À retenir

!!! success "Points essentiels"

    - La première ligne est `<!DOCTYPE html>`.
    - `<HTML>` contient `<HEAD>` (informations, non affichées) puis `<BODY>` (contenu affiché).
    - `<TITLE>` est obligatoire, dans `<HEAD>`, et s'affiche dans l'onglet.
    - `<META>` donne des informations sur la page : encodage, auteur, mots-clés, redirection.
    - `<BODY>` accepte `BGCOLOR`, `BACKGROUND`, `TEXT`, `LINK`, `ALINK` et `VLINK`.
    - Une couleur s'écrit par son nom anglais ou en hexadécimal `#RRVVBB`.
    - Un commentaire s'écrit `<!-- … -->`.

## Exercices

<div class="exo" data-exo="ch2-1" markdown>
Complétez cette page : ajoutez le **doctype**, un **titre** « Licence 1 — UAM » et une balise `<META>` indiquant **l'auteur** (votre nom).
</div>

<div class="exo" data-exo="ch2-2" markdown>
Donnez à la page un **fond noir** et un **texte blanc** en utilisant les **codes hexadécimaux**, puis ajoutez un **commentaire** au début du corps.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch2"></div>

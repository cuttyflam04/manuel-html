# Les images

Une image illustre un texte, améliore la présentation d'une page et aide à comprendre l'information. En HTML, on l'insère avec une seule balise : `<IMG>`.

## Les formats d'image

Le cours présente **deux formats** lus par tous les navigateurs :

| Format | Nom complet | Usage |
|--------|-------------|-------|
| **GIF** | *Graphics Interchange Format* | Les **illustrations** (logos, dessins, icônes) |
| **JPEG** | *Joint Photographic Expert Group* (format JFIF) | Les **photos** |

## La balise `<IMG>`

```html
<IMG SRC="nom_du_fichier.jpg">
```

- `<IMG>` est une **balise orpheline** (auto-fermante) : pas de `</IMG>`.
- C'est une balise **en ligne** (*inline*) : elle ne provoque **pas de retour à la ligne** et peut s'insérer au milieu du texte.
- On la place généralement dans un `<P>`, mais elle peut aller n'importe où dans le `<BODY>`.

!!! info "Les images dans ce manuel"

    Les fichiers des exemples (`photo.jpg`, `logo.gif`…) n'existent pas sur ce site. L'aperçu les remplace par une **image de démonstration** qui porte le nom du fichier et respecte la taille demandée. Sur votre ordinateur, mettez une vraie image avec ce nom dans le dossier de votre page.

## L'attribut `SRC` : la source

`SRC="…"` donne le **chemin vers l'image** : sur le serveur, ou une URL. C'est le **même principe que pour les liens** (chapitre 5).

| Où est l'image ? | On écrit |
|------------------|----------|
| Dans le même dossier que la page | `SRC="photo.jpg"` |
| Dans un sous-dossier `images/` | `SRC="images/photo.jpg"` |
| Un dossier au-dessus | `SRC="../photo.jpg"` |
| Sur un autre site | `SRC="http://www.site.com/photo.jpg"` |

!!! danger "Attention aux noms de fichiers"

    `Photo.JPG` et `photo.jpg` peuvent être considérés comme **deux fichiers différents** sur un serveur. Écrivez le nom **exactement** comme il est, et préférez des noms simples, en minuscules, sans espaces ni accents.

## L'attribut `ALT` : le texte alternatif

`ALT="description de l'image"` donne un **texte qui décrit** l'image. Il la **remplace** si elle ne peut pas être chargée.

- Il est **lu à voix haute** par les lecteurs d'écran, et aide les personnes malvoyantes à comprendre l'image.
- Il est **obligatoire**, mais peut rester **vide** (`ALT=""`) pour une image purement décorative.

!!! example "Exemple 6.1 — Texte alternatif"

    ```html
    <P>
        <IMG SRC="photo.jpg" ALT="Photo d'un ordinateur portable">
        Une image accompagnée de son texte alternatif.
    </P>
    ```

!!! support "Dans le support de cours"

    Le support indique que `ALT` « apparaît si la souris s'arrête sur l'image » (info-bulle). C'était le cas dans d'**anciens navigateurs** comme Internet Explorer. Aujourd'hui, `ALT` sert à **remplacer** l'image ; pour une info-bulle, on utilise l'attribut **`TITLE`**, comme pour les liens.

## `WIDTH` et `HEIGHT` : la taille

| Attribut | Rôle |
|----------|------|
| `WIDTH="w"` ou `"w%"` | **Largeur** affichée, en pixels ou en pourcentage |
| `HEIGHT="h"` ou `"h%"` | **Hauteur** affichée, en pixels ou en pourcentage |

- Sans ces attributs, l'image s'affiche à sa **taille réelle**.
- Si on n'en donne **qu'un seul**, l'autre est **calculé automatiquement** en proportion.
- Sans taille, le navigateur « devine », ce qui fait **sauter** la page pendant le chargement. **Indiquez toujours au moins un des deux** pour accélérer l'affichage.

!!! example "Exemple 6.2 — Différentes tailles"

    ```html
    <IMG SRC="campus.jpg" WIDTH="300" ALT="Le campus">
    <IMG SRC="campus.jpg" WIDTH="150" ALT="Le campus, plus petit">
    <IMG SRC="campus.jpg" WIDTH="300" HEIGHT="80" ALT="Le campus déformé">
    ```

La troisième image est **déformée** : sa largeur et sa hauteur ne respectent plus ses proportions.

!!! tip "Conseils du cours"

    - Attention au **poids** des images : pas d'images trop lourdes.
    - Mieux vaut **redimensionner l'image** dans un logiciel avant, plutôt que de charger une grande image et la rétrécir avec `WIDTH`.
    - Pour une galerie : de **petites images cliquables** qui mènent vers les grandes.

!!! support "Dans le support de cours"

    Page 79, `WIDTH` et `HEIGHT` sont décrits comme « largeur / hauteur **du tableau** ». Il s'agit bien sûr de la largeur et de la hauteur **de l'image**.

## `BORDER` : le cadre

`BORDER="n"` dessine un **cadre noir** de `n` pixels autour de l'image. Si l'image est un **lien**, mettez `BORDER="0"` pour ne pas voir le cadre de la couleur des liens (`LINK` du `<BODY>`).

!!! example "Exemple 6.3 — Bordure"

    ```html
    <IMG SRC="mafoto.jpg" WIDTH="160" BORDER="4" ALT="Ma photo">
    ```

## `ALIGN` : la position par rapport au texte

| Valeur | Effet |
|--------|-------|
| `TOP`, `MIDDLE`, `BOTTOM` | Position **verticale** de l'image par rapport à la ligne de texte |
| `LEFT`, `RIGHT` | L'image se place à gauche ou à droite, et **le texte s'enroule autour** |

!!! example "Exemple 6.4 — Image alignée au milieu de la ligne"

    ```html
    <P>
        Texte avant
        <IMG SRC="mafoto.jpg" WIDTH="100" ALIGN="MIDDLE" BORDER="2" ALT="Ma photo">
        texte après, centré verticalement sur l'image.
    </P>
    ```

!!! example "Exemple 6.5 — Le texte s'enroule autour"

    ```html
    <P>
        <IMG SRC="salle-info.jpg" WIDTH="150" ALIGN="LEFT" ALT="Salle informatique">
        Les étudiants disposent d'ordinateurs pour réaliser leurs travaux pratiques
        en programmation et en développement Web. Grâce à ALIGN="LEFT", ce texte
        s'enroule autour de l'image, à sa droite, au lieu de commencer en dessous.
        Essayez de remplacer LEFT par RIGHT pour voir l'image passer de l'autre côté.
    </P>
    ```

## Une image cliquable

Comme vu au chapitre 5, une image placée entre `<A>` et `</A>` devient un lien.

!!! example "Exemple 6.6 — Galerie de vignettes"

    ```html
    <A HREF="grande1.jpg"><IMG SRC="vignette1.jpg" WIDTH="100" BORDER="0" ALT="Amphithéâtre"></A>
    <A HREF="grande2.jpg"><IMG SRC="vignette2.jpg" WIDTH="100" BORDER="0" ALT="Bibliothèque"></A>
    <A HREF="grande3.jpg"><IMG SRC="vignette3.jpg" WIDTH="100" BORDER="0" ALT="Restaurant"></A>
    ```

## Récapitulatif

| Attribut | Rôle |
|----------|------|
| `SRC="url"` | Adresse du fichier image (obligatoire) |
| `ALT="texte"` | Texte alternatif (obligatoire, vide si décoratif) |
| `WIDTH="w"` | Largeur, en pixels ou en % |
| `HEIGHT="h"` | Hauteur, en pixels ou en % |
| `BORDER="n"` | Cadre de `n` pixels |
| `ALIGN="…"` | `TOP`, `MIDDLE`, `BOTTOM`, ou `LEFT` / `RIGHT` pour l'enroulement |

## Exercices

<div class="exo" data-exo="ch6-1" markdown>
Insérez l'image `campus.jpg` avec une **largeur de 250 pixels** et un **texte alternatif** qui la décrit.
</div>

<div class="exo" data-exo="ch6-2" markdown>
Créez un paragraphe avec l'image `labo.jpg` **alignée à gauche** (le texte doit s'enrouler autour), puis, en dessous, une image `retour.gif` **cliquable** qui mène vers `index.html`, **sans bordure**.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch6"></div>

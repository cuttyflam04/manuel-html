# Le texte et sa mise en forme

Une page HTML contient surtout du texte. Ce chapitre montre comment le découper en paragraphes et en titres, le mettre en valeur, changer sa couleur ou sa taille, et écrire les accents et les caractères spéciaux.

## Les paragraphes : `<P>`

Quand on écrit du texte dans une page Web, on le place la plupart du temps dans des **paragraphes**.

- `<P>` signifie « début du paragraphe » ;
- `</P>` signifie « fin du paragraphe ».

!!! example "Exemple 3.1 — Deux paragraphes"

    ```html
    <!DOCTYPE html>
    <HTML>
    <HEAD>
        <META CHARSET="utf-8">
        <TITLE>Paragraphes</TITLE>
    </HEAD>
    <BODY>
        <P>Bonjour et bienvenue sur mon site !
        Ceci est mon premier test alors soyez indulgents s'il vous plaît,
        j'apprends petit à petit comment cela marche.</P>
        <P>Pour l'instant c'est un peu vide, mais revenez dans 2-3 jours quand
        j'aurai appris un peu plus de choses, je vous assure que vous allez être surpris !</P>
    </BODY>
    </HTML>
    ```

Le navigateur laisse automatiquement un espace entre deux paragraphes. En revanche, les retours à la ligne **à l'intérieur** du code sont ignorés.

## Le retour à la ligne : `<BR>`

`<BR>` est une **balise orpheline** qui sert à aller à la ligne, sans créer de nouveau paragraphe. On peut l'écrire `<BR>` ou `<BR />`.

Elle se place **à l'intérieur d'un paragraphe**.

!!! example "Exemple 3.2 — Aller à la ligne"

    ```html
    <P>Bonjour et bienvenue sur mon site !<BR>
    Ceci est mon premier test alors soyez indulgents s'il vous plaît.</P>
    <P>Première ligne<BR>
    Deuxième ligne<BR><BR>
    Après une ligne vide</P>
    ```

Deux `<BR>` à la suite donnent **une ligne d'espacement**.

!!! tip "`<P>` ou `<BR>` ?"

    `<BR>` passe simplement à la ligne suivante. Pour séparer deux idées, préférez deux paragraphes `<P>`.

## Les titres : `<H1>` à `<H6>`

Quand une page s'allonge, les **titres** aident le visiteur à se repérer. Le HTML propose **six niveaux** de titres, de `<H1>` (le plus important) à `<H6>` (le moins important). Le *H* vient de *header*.

| Balise | Signification |
|--------|---------------|
| `<H1>` | Titre très important ; en général, le titre de la page |
| `<H2>` | Titre important |
| `<H3>` | Titre un peu moins important (sous-titre) |
| `<H4>` | Titre encore moins important |
| `<H5>` | Titre pas important |
| `<H6>` | Titre vraiment pas important du tout |

!!! example "Exemple 3.3 — Le titrage"

    ```html
    <H1>Le titre</H1>
    <H2>La section</H2>
    <H3>La sous-section</H3>
    <H4>Niveau 4</H4>
    <H5>Niveau 5</H5>
    <H6>Niveau 6</H6>
    ```

Le navigateur affiche les titres en gras, avec une taille qui diminue d'un niveau à l'autre.

## Centrer : `<CENTER>`

La balise `<CENTER> … </CENTER>` **centre** tout ce qu'elle contient.

!!! example "Exemple 3.4 — Centrer un texte"

    ```html
    <CENTER>Un paragraphe centré</CENTER>
    <P>Première ligne<BR>
    Deuxième ligne</P>
    ```

!!! support "Dans le support de cours"

    Le support cite une balise `<justify>` pour justifier le texte. **Cette balise n'existe pas** en HTML : le navigateur l'ignore. Pour justifier un paragraphe, on utilise l'attribut `ALIGN` : `<P ALIGN="JUSTIFY">`.

L'attribut `ALIGN` s'utilise aussi sur les paragraphes et les titres, avec les valeurs `LEFT` (gauche), `CENTER` (centre), `RIGHT` (droite) et `JUSTIFY` (justifié) :

!!! example "Exemple 3.5 — L'attribut ALIGN"

    ```html
    <H1 ALIGN="CENTER">Université Amadou Mahtar Mbow</H1>
    <P ALIGN="RIGHT">Ce texte est aligné à droite.</P>
    <P ALIGN="JUSTIFY">Ce paragraphe est justifié : ses lignes s'étirent pour toucher
    les deux bords, comme dans un journal. À utiliser avec prudence, car de grands
    espaces peuvent apparaître entre les mots.</P>
    ```

## La ligne horizontale : `<HR>`

`<HR>` insère une **ligne de séparation**. C'est une balise orpheline. Ses options :

| Attribut | Rôle |
|----------|------|
| `SIZE="n"` | Épaisseur du trait |
| `WIDTH="n%"` | Largeur de la ligne (en pourcentage ou en pixels) |
| `ALIGN="LEFT"` ou `"RIGHT"` | Position de la ligne (centrée par défaut) |

!!! example "Exemple 3.6 — Des lignes de séparation"

    ```html
    <CENTER>Un paragraphe</CENTER>
    <P>Première ligne<BR>
    Deuxième ligne</P>
    <HR SIZE="3" WIDTH="50%" ALIGN="LEFT">
    <HR>
    <HR SIZE="6" WIDTH="80%">
    ```

Remarquez l'aspect des lignes : par défaut, le navigateur dessine une ligne `<HR>` **en relief**, comme une rainure grise. Plus `SIZE` est grand, plus on voit qu'elle est « creuse ». C'est normal : c'est le rendu de base du HTML, sans feuille de style.

!!! support "Dans le support de cours"

    Le support écrit `align="left | rigth"`. L'orthographe correcte est **`right`** : avec `rigth`, l'attribut est ignoré.

## Mettre le texte en valeur

Certains mots sont plus importants que d'autres. Le HTML propose plusieurs balises pour les faire ressortir.

| Balise | Effet | Remarque |
|--------|-------|----------|
| `<B> … </B>` | **Gras** | *Bold* |
| `<I> … </I>` | *Italique* | *Italic* |
| `<U> … </U>` | Souligné | *Underline* |
| `<EM> … </EM>` | *Italique* par défaut | Balise **sémantique** : sert à **insister** sur un passage |
| `<STRONG> … </STRONG>` | **Gras** par défaut | Balise **sémantique** : marque un texte **fortement** mis en valeur |
| `<BIG> … </BIG>` | Texte plus gros | |
| `<SMALL> … </SMALL>` | Texte plus petit | Pour les annotations, mentions légales, copyright |
| `<SUP> … </SUP>` | Texte en exposant | 1<sup>er</sup> |
| `<SUB> … </SUB>` | Texte en indice | H<sub>2</sub>O |

!!! info "Que veut dire « sémantique » ?"

    `<B>` dit seulement « affiche en gras ». `<STRONG>` dit « ce texte est **important** ». Le navigateur l'affiche en gras par défaut, mais l'information transmise est le **sens**, pas l'apparence.

!!! example "Exemple 3.7 — Mettre en valeur"

    ```html
    <H1>C'est un titre de niveau 1</H1>
    <H2>C'est un titre de niveau 2</H2>
    <B>C'est gras</B><BR>
    <U><I>En italique souligné</I></U><BR>
    1<SUP>er</SUP> de la classe<BR>
    La formule de l'eau est H<SUB>2</SUB>O<BR>
    <P>Ceci est mon premier test alors <EM>soyez indulgents</EM> s'il vous plaît,
    et <STRONG>n'oubliez pas le TP</STRONG>.</P>
    <BIG>Texte gros</BIG> et <SMALL>texte petit</SMALL>
    ```

Les balises peuvent se **combiner**, à condition d'être **bien imbriquées** : la dernière ouverte est la première fermée.

```html
<U><I>correct</I></U>
<U><I>incorrect</U></I>
```

## Couleur et taille : `<FONT>`

La balise `<FONT> … </FONT>` change **ponctuellement** la couleur ou la taille du texte.

| Attribut | Rôle |
|----------|------|
| `COLOR="red"` | Couleur du texte (nom ou code `#RRVVBB`) |
| `SIZE="5"` | Taille absolue, de `1` (la plus petite) à `7` (la plus grande) |
| `SIZE="+1"` | Taille relative, par rapport à la taille par défaut (`3`) |

!!! example "Exemple 3.8 — La balise FONT"

    ```html
    <FONT SIZE="5">Texte en taille 5</FONT><BR>
    <FONT COLOR="red">En rouge</FONT><BR>
    <FONT SIZE="+2" COLOR="#0000FF">Deux crans plus gros, en bleu</FONT><BR>
    <FONT SIZE="1">Taille 1</FONT> <FONT SIZE="4">Taille 4</FONT> <FONT SIZE="7">Taille 7</FONT>
    ```

Les balises `<FONT>` peuvent être **imbriquées** :

!!! example "Exemple 3.9 — FONT imbriquées"

    ```html
    <FONT COLOR="green">
        Texte vert,
        <FONT SIZE="6">puis vert et grand,</FONT>
        puis de nouveau vert normal.
    </FONT>
    ```

## Récapitulatif des balises de texte

| Code | Effet |
|------|-------|
| `<B> … </B>` | Zone en gras |
| `<I> … </I>` | Zone en italique |
| `<U> … </U>` | Zone soulignée |
| `<FONT SIZE=?> … </FONT>` | Zone avec cette taille |
| `<FONT COLOR="blue"> … </FONT>` | Zone en couleur |
| `<CENTER> … </CENTER>` | Centrer |
| `<BR>` | Aller à la ligne |
| `<!-- … -->` | Ne pas afficher (commentaire) |

## Les accents et les caractères spéciaux

Certains caractères posent problème dans le code :

- les **accents**, qui peuvent mal s'afficher si l'encodage de la page n'est pas indiqué ;
- les caractères **réservés** au HTML, comme `<` et `>`, que le navigateur prend pour le début d'une balise.

On les écrit alors avec un **code** (une *entité*), qui commence par `&` et se termine par `;`.

### Les lettres accentuées

| Code HTML | Lettre |
|-----------|--------|
| `&eacute;` | é (e accent aigu) |
| `&egrave;` | è (e accent grave) |
| `&ecirc;` | ê (e accent circonflexe) |
| `&euml;` | ë (e tréma) |
| `&agrave;` | à (a accent grave) |
| `&aacute;` | á (a accent aigu) |
| `&acirc;` | â (a accent circonflexe) |
| `&auml;` | ä (a tréma) |
| `&iuml;` | ï (i tréma) |
| `&ccedil;` | ç (c cédille) |
| `&ntilde;` | ñ (n tilde) |

### Les caractères spéciaux

| Code HTML | Caractère |
|-----------|-----------|
| `&lt;` | `<` |
| `&gt;` | `>` |
| `&amp;` | `&` |
| `&nbsp;` | une espace (insécable) |
| `&#171;` | « |
| `&#187;` | » |
| `&copy;` | © |

!!! example "Exemple 3.10 — Écrire avec des codes"

    ```html
    <B>Voici la page Web des &eacute;tudiants en Biologie</B><BR>
    Pour faire un titre, on &eacute;crit la balise &lt;H1&gt;.<BR>
    &#171; Le HTML, c'est facile &#187;<BR>
    &copy; UAM 2026
    ```

!!! tip "Accents directs ou codes ?"

    Le support conseille de ne pas écrire les accents directement. Aujourd'hui, si l'en-tête contient `<META CHARSET="utf-8">` et que le fichier est enregistré en UTF-8 (le réglage par défaut de Visual Studio Code), les accents s'écrivent normalement. En revanche, `&lt;`, `&gt;` et `&amp;` restent **indispensables** pour afficher `<`, `>` et `&`.

!!! support "Dans le support de cours"

    Le tableau des caractères spéciaux contient deux coquilles :

    - `&nspb;` doit s'écrire **`&nbsp;`** (*non-breaking space*) ;
    - `&copy` doit se terminer par un point-virgule : **`&copy;`**.

## À retenir

!!! success "Points essentiels"

    - `<P>` crée un paragraphe ; `<BR>` va à la ligne **dans** un paragraphe.
    - `<H1>` à `<H6>` créent six niveaux de titres.
    - `<CENTER>` centre ; `ALIGN` aligne un paragraphe ou un titre.
    - `<HR>` trace une ligne, réglable avec `SIZE`, `WIDTH` et `ALIGN`.
    - `<B>`, `<I>`, `<U>`, `<EM>`, `<STRONG>`, `<BIG>`, `<SMALL>`, `<SUP>`, `<SUB>` mettent le texte en valeur.
    - `<FONT>` change la couleur (`COLOR`) et la taille (`SIZE` de 1 à 7, ou `+n`).
    - Les codes `&…;` écrivent les accents et les caractères réservés.

## Exercices

<div class="exo" data-exo="ch3-1" markdown>
Créez une page avec un **titre principal** `<H1>` centré, un **sous-titre** `<H2>`, **deux paragraphes**, et une **ligne horizontale** entre le titre et les paragraphes.
</div>

<div class="exo" data-exo="ch3-2" markdown>
Dans un paragraphe, écrivez : « Le 1er TP porte sur la formule H2O » avec **er** en exposant et **2** en indice. Mettez « TP » en **gras** et ajoutez une phrase en **rouge** avec `<FONT>`.
</div>

<div class="exo" data-exo="ch3-3" markdown>
Affichez exactement ce texte dans la page : **La balise &lt;BR&gt; va à la ligne & c'est tout.** Il faudra utiliser des codes de caractères spéciaux.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch3"></div>

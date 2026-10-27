# Annexe A — Les erreurs fréquentes

Les mêmes erreurs reviennent dans presque tous les premiers TP. Elles sont faciles à corriger, à condition de savoir les reconnaître. Rappel : le navigateur est **tolérant**, il affiche souvent quelque chose même quand le code est faux. Une page qui « s'affiche » n'est donc pas forcément correcte.

## 1. Oublier de fermer une balise

=== "Incorrect"

    ```html
    <P>Bienvenue sur mon site.
    <P><B>Attention : tout le reste est en gras.
    <P>Même ce paragraphe.
    ```

=== "Correct"

    ```html
    <P>Bienvenue sur mon site.</P>
    <P><B>Attention :</B> seul ce mot est en gras.</P>
    <P>Ce paragraphe est normal.</P>
    ```

## 2. Mal imbriquer les balises

La dernière balise ouverte est la **première fermée**.

=== "Incorrect"

    ```html
    <B><I>Texte</B></I>
    ```

=== "Correct"

    ```html
    <B><I>Texte</I></B>
    ```

## 3. Mettre du contenu visible dans `<HEAD>`

Tout ce qui doit s'afficher va dans `<BODY>`.

=== "Incorrect"

    ```html
    <HEAD>
        <H1>Bienvenue</H1>
    </HEAD>
    ```

=== "Correct"

    ```html
    <HEAD>
        <TITLE>Ma page</TITLE>
    </HEAD>
    <BODY>
        <H1>Bienvenue</H1>
    </BODY>
    ```

## 4. Oublier le doctype ou le titre

Chaque page commence par `<!DOCTYPE html>` et possède un `<TITLE>` dans son en-tête.

## 5. Utiliser des guillemets typographiques

Les traitements de texte (et certaines diapositives) remplacent `"` par `“ ”` ou `‘’`. Le HTML ne reconnaît que les **guillemets droits** du clavier.

=== "Incorrect"

    ```text
    <BODY BGCOLOR=‘’yellow’’>
    ```

=== "Correct"

    ```html
    <BODY BGCOLOR="yellow">
    ```

!!! tip "Astuce"

    N'écrivez jamais votre code dans Word. Utilisez un éditeur de texte comme Visual Studio Code ou le Bloc-notes.

## 6. Écrire un `<BR>` ou du texte hors d'un paragraphe

Le cours précise que `<BR>` se met **à l'intérieur d'un paragraphe**.

=== "Moins bien"

    ```html
    Première ligne<BR>
    Deuxième ligne
    ```

=== "Correct"

    ```html
    <P>Première ligne<BR>
    Deuxième ligne</P>
    ```

## 7. Les accents qui s'affichent mal

Si vous voyez `Ã©` à la place de `é`, l'encodage n'est pas indiqué. Deux solutions :

- ajouter `<META CHARSET="utf-8">` dans l'en-tête (et enregistrer le fichier en UTF-8) ;
- ou écrire les accents avec leur code : `&eacute;`, `&egrave;`, `&agrave;`…

Et pour afficher `<`, `>` ou `&`, toujours `&lt;`, `&gt;`, `&amp;`.

## 8. Les images ne s'affichent pas

Causes possibles :

- le nom du fichier est mal écrit, ou n'a pas la même casse (`Photo.JPG` ≠ `photo.jpg`) ;
- l'image n'est pas dans le dossier indiqué ;
- le chemin pointe vers un dossier précis de **votre** disque dur : il ne fonctionnera plus sur un autre ordinateur ni sur un serveur. Utilisez des **chemins relatifs** (`images/photo.jpg`).

!!! tip "Bonne pratique"

    Des noms de fichiers simples : sans espaces, sans accents, en minuscules.

## 9. Oublier `ALT`

Chaque image a un texte alternatif, vide si elle est purement décorative.

```html
<IMG SRC="logo.gif" ALT="Logo de l'université">
```

## 10. Un lien externe sans `http://`

=== "Incorrect"

    ```html
    <A HREF="www.google.fr">Google</A>
    ```

=== "Correct"

    ```html
    <A HREF="http://www.google.fr">Google</A>
    ```

Sans le protocole, le navigateur cherche un fichier nommé `www.google.fr` dans votre dossier.

## 11. Une ancre qui ne mène nulle part

Le nom après `#` doit être **exactement** celui de l'étiquette (`NAME` ou `ID`), majuscules comprises.

```html
<A HREF="#horaires">Horaires</A>
…
<H2 ID="horaires">Horaires</H2>
```

## 12. Des listes mal construites

`<UL>` et `<OL>` ne contiennent que des `<LI>`. Une sous-liste se place **dans** un `<LI>`.

=== "Incorrect"

    ```html
    <UL>
        Mes cours :
        <LI>HTML</LI>
    </UL>
    ```

=== "Correct"

    ```html
    <P>Mes cours :</P>
    <UL>
        <LI>HTML</LI>
    </UL>
    ```

## 13. Des tableaux mal construits

Une cellule est toujours dans une ligne, et chaque ligne a le même nombre de cellules, en comptant les fusions.

=== "Incorrect"

    ```html
    <TABLE BORDER="1">
        <TD>Nom</TD>
    </TABLE>
    ```

=== "Correct"

    ```html
    <TABLE BORDER="1">
        <TR>
            <TD>Nom</TD>
        </TR>
    </TABLE>
    ```

## 14. Confondre `ALIGN` et `VALIGN`

`ALIGN` est horizontal (`LEFT`, `CENTER`, `RIGHT`), `VALIGN` est vertical (`TOP`, `MIDDLE`, `BOTTOM`). `ALIGN="MIDDLE"` sur une cellule ne centre rien.

## Pour éviter les erreurs

!!! success "Les bons réflexes"

    - Fermer chaque balise dès qu'on l'ouvre, puis écrire le contenu entre les deux.
    - Indenter son code.
    - Tester **souvent** dans le navigateur, pas seulement à la fin.
    - Corriger une erreur à la fois, en commençant par le haut.
    - Utiliser des noms de fichiers simples et des chemins relatifs.

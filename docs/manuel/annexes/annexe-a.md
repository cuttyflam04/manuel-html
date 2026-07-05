# Annexe A — Erreurs fréquentes des débutants en HTML

## Introduction

Lors des premiers exercices en HTML, certaines erreurs reviennent très souvent.

Bien qu'elles soient généralement faciles à corriger, elles peuvent empêcher le navigateur d'afficher correctement la page Web.

Cette annexe présente les erreurs les plus courantes ainsi que les solutions permettant de les éviter. :contentReference[oaicite:0]{index=0}

---

## 1. Oublier de fermer une balise

Certaines balises possèdent obligatoirement une balise de fermeture.

### ❌ Incorrect

```html
<P>

Bienvenue sur mon site.
```

### ✅ Correct

```html
<P>

Bienvenue sur mon site.

</P>
```

---

## 2. Mal placer les balises `<HEAD>` et `<BODY>`

Le contenu visible de la page doit toujours être placé dans la balise `<BODY>`.

### ❌ Incorrect

```html
<HEAD>

    <H1>Bienvenue</H1>

</HEAD>
```

### ✅ Correct

```html
<HEAD>

    <TITLE>Ma page</TITLE>

</HEAD>

<BODY>

    <H1>Bienvenue</H1>

</BODY>
```

---

## 3. Oublier le titre de la page

Une page HTML devrait toujours contenir une balise `<TITLE>`.

### ✅ Correct

```html
<TITLE>

    Bibliothèque Universitaire

</TITLE>
```

---

## 4. Les images ne s'affichent pas

Cette erreur est très fréquente.

Les causes possibles sont :

- le nom du fichier est incorrect ;
- l'image se trouve dans un autre dossier ;
- l'extension est incorrecte (`.jpg`, `.png`, `.gif`, etc.) ;
- le chemin est mal écrit.

### Exemple

```html
<IMG SRC="photo.jpg">
```

!!! tip "À vérifier"

    Le fichier **photo.jpg** doit exister à l'emplacement indiqué dans l'attribut `SRC`.

---

## 5. Oublier l'attribut `ALT`

Chaque image devrait posséder un texte alternatif.

### ❌ Incorrect

```html
<IMG SRC="logo.jpg">
```

### ✅ Correct

```html
<IMG
    SRC="logo.jpg"
    ALT="Logo de l'université">
```

---

## 6. Les tableaux mal construits

Une cellule (`<TD>` ou `<TH>`) doit toujours être placée à l'intérieur d'une ligne (`<TR>`).

### ❌ Incorrect

```html
<TABLE>

    <TD>Nom</TD>

</TABLE>
```

### ✅ Correct

```html
<TABLE>

    <TR>

        <TD>Nom</TD>

    </TR>

</TABLE>
```

---

## 7. Mauvaise utilisation de `ROWSPAN` ou `COLSPAN`

La fusion des cellules doit respecter le nombre réel de lignes ou de colonnes du tableau.

!!! warning "Attention"

    Une valeur incorrecte peut désorganiser complètement l'affichage du tableau.

---

## 8. Les formulaires sans balise `<FORM>`

Tous les champs doivent être placés dans une balise `<FORM>`.

### ❌ Incorrect

```html
<INPUT TYPE="text">
```

### ✅ Correct

```html
<FORM>

    <INPUT TYPE="text">

</FORM>
```

---

## 9. Oublier l'attribut `NAME`

Sans l'attribut `NAME`, les informations saisies ne pourront pas être correctement identifiées lors de l'envoi du formulaire.

### ✅ Correct

```html
<INPUT
    TYPE="text"
    NAME="nom">
```

---

## 10. Deux attributs `TYPE` dans le même `<INPUT>`

Une balise `<INPUT>` ne doit contenir **qu'un seul** attribut `TYPE`.

### ❌ Incorrect

```html
<INPUT
    TYPE="Nom"
    TYPE="text">
```

### ✅ Correct

```html
<INPUT TYPE="text">
```

---

## 11. Les boutons radio ne possèdent pas le même `NAME`

Pour former un groupe, tous les boutons radio doivent partager le même attribut `NAME`.

### ✅ Correct

```html
<INPUT
    TYPE="radio"
    NAME="niveau">

<INPUT
    TYPE="radio"
    NAME="niveau">
```

---

## 12. Utiliser `VALUE` avec `<TEXTAREA>`

La balise `<TEXTAREA>` ne possède **pas** d'attribut `VALUE`.

Le texte par défaut est placé entre les deux balises.

### ✅ Correct

```html
<TEXTAREA>

Votre commentaire...

</TEXTAREA>
```

---

## 13. Oublier `ENCTYPE` lors d'un envoi de fichier

Lorsqu'un formulaire contient un champ `TYPE="file"`, il est recommandé d'utiliser :

```html
ENCTYPE="multipart/form-data"
```

---

## 14. Oublier de fermer les listes

Les balises :

- `<UL>` ;
- `<OL>` ;
- `<LI>`

doivent être correctement fermées.

!!! warning "Attention"

    Une mauvaise imbrication rend la structure difficile à comprendre et peut provoquer un affichage incorrect.

---

## 15. Utiliser des noms de fichiers contenant des erreurs

Exemples :

```text
Photo.JPG
photo.jpg
PHOTO.jpg
```

Selon le système utilisé, ces noms peuvent être considérés comme différents.

!!! tip "Bonne pratique"

    Utilisez des noms de fichiers :

    - simples ;
    - sans espaces ;
    - sans caractères spéciaux ;
    - de préférence en minuscules.

---

## Conseils pour éviter les erreurs

!!! success "Bonnes pratiques"

    - Fermer toutes les balises.

    - Indenter correctement le code.

    - Utiliser des noms de fichiers simples.

    - Vérifier le chemin des images.

    - Tester régulièrement la page dans le navigateur.

    - Corriger les erreurs une par une.

    - Relire le code avant de l'enregistrer.

---

## Conclusion

La majorité des erreurs rencontrées par les débutants proviennent d'oublis ou de fautes de syntaxe.

Avec une bonne organisation du code, une indentation claire et des tests réguliers, ces erreurs deviennent beaucoup plus faciles à identifier et à corriger.

---

⬅️ **Précédent :** La mise en forme d'une page HTML

🏁 **Fin du manuel HTML**
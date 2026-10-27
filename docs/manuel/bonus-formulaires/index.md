# Bonus : les formulaires

!!! horsprog "Hors programme"

    Ce chapitre **n'est pas dans le support de cours** de Dr Niang : le cours cite seulement les formulaires parmi les possibilités du HTML (« concevoir des formulaires permettant de mener à bien des recherches, effectuer des réservations, commander des produits »). Il est proposé ici **pour aller plus loin**, et parce que les formulaires reviennent dans la suite du module avec PHP. **Ne le révisez pas en priorité pour l'examen de HTML.**

Jusqu'ici, nos pages ne faisaient qu'**afficher** des informations. Un **formulaire** permet au visiteur d'en **saisir** : créer un compte, se connecter, faire une recherche, réserver, envoyer un commentaire… Ces informations sont ensuite **envoyées à un serveur**.

Dans les aperçus de ce chapitre, cliquer sur **Envoyer** affiche exactement ce que le navigateur transmettrait.

## La balise `<FORM>`

`<FORM> … </FORM>` délimite le formulaire. Tous les champs placés à l'intérieur sont envoyés ensemble.

```html
<FORM ACTION="inscription.php" METHOD="POST">
    … les champs …
</FORM>
```

| Attribut | Rôle |
|----------|------|
| `ACTION` | L'adresse de la page qui **recevra** les données. |
| `METHOD` | La méthode d'envoi : `GET` ou `POST`. |
| `ENCTYPE` | Le format d'envoi ; `multipart/form-data` est obligatoire pour envoyer un fichier. |

### `GET` ou `POST` ?

- **`GET`** ajoute les données **à la fin de l'adresse** : `resultat.php?nom=Ali&age=20`. On l'utilise pour les recherches.
- **`POST`** envoie les données **dans le corps de la requête** : elles n'apparaissent pas dans l'adresse. On l'utilise pour les inscriptions, les connexions et l'envoi de fichiers.

!!! example "Exemple B.1 — Comparez GET et POST"

    ```html
    <FORM ACTION="recherche.php" METHOD="GET">
        Recherche : <INPUT TYPE="text" NAME="q" VALUE="html">
        <INPUT TYPE="submit" VALUE="Chercher (GET)">
    </FORM>
    <HR>
    <FORM ACTION="connexion.php" METHOD="POST">
        Identifiant : <INPUT TYPE="text" NAME="login" VALUE="fatou">
        <INPUT TYPE="submit" VALUE="Se connecter (POST)">
    </FORM>
    ```

## La balise `<INPUT>`

La plupart des champs sont créés par la balise orpheline `<INPUT>`. Son attribut **`TYPE`** décide du genre de champ, et son attribut **`NAME`** donne le nom sous lequel la valeur sera envoyée.

!!! danger "Sans `NAME`, rien n'est envoyé"

    Un champ sans `NAME` s'affiche, mais sa valeur **n'est pas transmise** au serveur.

### Texte et mot de passe

| Attribut | Rôle |
|----------|------|
| `TYPE="text"` | Zone de saisie sur une ligne |
| `TYPE="password"` | Pareil, mais les caractères sont **masqués** |
| `SIZE` | Largeur visible de la zone |
| `MAXLENGTH` | Nombre maximal de caractères |
| `VALUE` | Texte présent au départ |
| `READONLY` | Champ non modifiable |

!!! example "Exemple B.2 — Connexion étudiant"

    ```html
    <FORM ACTION="connexion.php" METHOD="POST">
        <P>Nom : <INPUT TYPE="text" NAME="nom" SIZE="30"></P>
        <P>Mot de passe : <INPUT TYPE="password" NAME="mdp" SIZE="15" MAXLENGTH="20"></P>
        <P><INPUT TYPE="submit" VALUE="Se connecter"></P>
    </FORM>
    ```

### Boutons radio et cases à cocher

- **`TYPE="radio"`** : **un seul choix** possible dans un groupe. Tous les boutons d'un même groupe ont **le même `NAME`**.
- **`TYPE="checkbox"`** : **plusieurs choix** possibles.
- `VALUE` donne la valeur envoyée ; `CHECKED` coche par défaut.

!!! example "Exemple B.3 — Radio et cases à cocher"

    ```html
    <FORM ACTION="inscription.php" METHOD="GET">
        Niveau :
        <INPUT TYPE="radio" NAME="niveau" VALUE="L1" CHECKED> Licence 1
        <INPUT TYPE="radio" NAME="niveau" VALUE="L2"> Licence 2
        <INPUT TYPE="radio" NAME="niveau" VALUE="L3"> Licence 3
        <BR><BR>
        Langages étudiés :
        <INPUT TYPE="checkbox" NAME="langage" VALUE="HTML" CHECKED> HTML
        <INPUT TYPE="checkbox" NAME="langage" VALUE="PHP"> PHP
        <INPUT TYPE="checkbox" NAME="langage" VALUE="JavaScript"> JavaScript
        <BR><BR>
        <INPUT TYPE="submit" VALUE="Envoyer">
    </FORM>
    ```

Essayez de cocher deux niveaux à la fois : impossible, car ils partagent le même `NAME`.

## Les listes déroulantes : `<SELECT>`

`<SELECT>` crée une liste de choix ; chaque choix est une balise `<OPTION>`.

| Attribut | Sur | Rôle |
|----------|-----|------|
| `NAME` | `<SELECT>` | Nom de la liste |
| `SIZE` | `<SELECT>` | Nombre de lignes visibles |
| `MULTIPLE` | `<SELECT>` | Autorise plusieurs choix (avec <kbd>Ctrl</kbd>) |
| `VALUE` | `<OPTION>` | Valeur envoyée |
| `SELECTED` | `<OPTION>` | Choix sélectionné par défaut |

`<OPTGROUP LABEL="…">` regroupe des options sous un intitulé.

!!! example "Exemple B.4 — Listes de choix"

    ```html
    <FORM ACTION="choix.php" METHOD="GET">
        Département :
        <SELECT NAME="departement">
            <OPTGROUP LABEL="Sciences et technologies">
                <OPTION VALUE="GI">Génie Informatique</OPTION>
                <OPTION VALUE="ELEC">Électronique</OPTION>
            </OPTGROUP>
            <OPTION VALUE="SIC" SELECTED>Sciences de l'Information et de la Communication</OPTION>
        </SELECT>
        <BR><BR>
        Modules suivis :<BR>
        <SELECT NAME="modules" SIZE="4" MULTIPLE>
            <OPTION>HTML</OPTION>
            <OPTION>PHP</OPTION>
            <OPTION>JavaScript</OPTION>
            <OPTION>SQL</OPTION>
        </SELECT>
        <BR><BR>
        <INPUT TYPE="submit" VALUE="Envoyer">
    </FORM>
    ```

## Les zones de texte : `<TEXTAREA>`

`<TEXTAREA>` permet de saisir **plusieurs lignes**. `ROWS` règle le nombre de lignes visibles, `COLS` la largeur.

Le texte de départ se place **entre les deux balises**, et non dans un attribut `VALUE`. Attention : tout ce qui est entre les balises, **espaces et retours à la ligne compris**, apparaît dans la zone. Écrivez donc le texte collé aux balises.

!!! example "Exemple B.5 — Zone de commentaire"

    ```html
    <FORM ACTION="avis.php" METHOD="POST">
        Votre avis :<BR>
        <TEXTAREA NAME="commentaire" ROWS="4" COLS="40">Aucun commentaire.</TEXTAREA>
        <BR>
        <INPUT TYPE="submit" VALUE="Envoyer">
    </FORM>
    ```

## Regrouper les champs : `<FIELDSET>` et `<LEGEND>`

`<FIELDSET>` entoure un groupe de champs d'un **cadre**. `<LEGEND>`, placé juste à l'intérieur, donne un **titre** à ce cadre.

!!! example "Exemple B.6 — Groupes de champs"

    ```html
    <FORM ACTION="inscription.php" METHOD="POST">
        <FIELDSET>
            <LEGEND>Informations personnelles</LEGEND>
            Nom : <INPUT TYPE="text" NAME="nom"><BR><BR>
            Prénom : <INPUT TYPE="text" NAME="prenom">
        </FIELDSET>
        <BR>
        <FIELDSET>
            <LEGEND>Coordonnées</LEGEND>
            Téléphone : <INPUT TYPE="text" NAME="tel">
        </FIELDSET>
        <BR>
        <INPUT TYPE="submit" VALUE="Envoyer">
    </FORM>
    ```

## Les boutons et les champs spéciaux

| Code | Rôle |
|------|------|
| `<INPUT TYPE="submit" VALUE="Envoyer">` | Envoie le formulaire vers l'adresse de `ACTION` |
| `<INPUT TYPE="reset" VALUE="Effacer">` | Remet tous les champs dans leur **état initial** |
| `<INPUT TYPE="button" VALUE="Calculer">` | Bouton sans action automatique, utilisé avec JavaScript |
| `<INPUT TYPE="image" SRC="valider.gif">` | Une image qui envoie le formulaire, comme un bouton `submit` |
| `<INPUT TYPE="file" NAME="photo">` | Choisir un fichier sur l'ordinateur (exige `ENCTYPE="multipart/form-data"` et `METHOD="POST"`) |
| `<INPUT TYPE="hidden" NAME="code" VALUE="UAM2026">` | Champ **invisible**, envoyé avec le reste |

!!! example "Exemple B.7 — Fiche d'inscription complète"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Inscription à la bibliothèque</TITLE>
    </HEAD>
    <BODY>
        <H2 ALIGN="CENTER">Nouvel étudiant</H2>
        <FORM ACTION="inscription.php" METHOD="POST" ENCTYPE="multipart/form-data">
            <FIELDSET>
                <LEGEND>Informations personnelles</LEGEND>
                Nom : <INPUT TYPE="text" NAME="nom" SIZE="25"><BR><BR>
                Mot de passe : <INPUT TYPE="password" NAME="motdepasse">
            </FIELDSET>
            <BR>
            <FIELDSET>
                <LEGEND>Informations complémentaires</LEGEND>
                Commentaire :<BR>
                <TEXTAREA NAME="commentaire" ROWS="3" COLS="40"></TEXTAREA><BR><BR>
                Photo : <INPUT TYPE="file" NAME="photo">
            </FIELDSET>
            <BR>
            <INPUT TYPE="hidden" NAME="code" VALUE="UAM2026">
            <INPUT TYPE="submit" VALUE="Envoyer">
            <INPUT TYPE="reset" VALUE="Effacer">
        </FORM>
    </BODY>
    </HTML>
    ```

Remplissez les champs puis cliquez sur **Envoyer** : l'aperçu liste toutes les données, y compris le champ caché `code`.

## Erreurs fréquentes

!!! danger "À éviter"

    - placer les champs en dehors de `<FORM>` ;
    - oublier `NAME` : la valeur n'est pas envoyée ;
    - donner des `NAME` différents à des boutons radio d'un même groupe ;
    - mettre un attribut `VALUE` sur `<TEXTAREA>` ;
    - oublier `ENCTYPE="multipart/form-data"` pour envoyer un fichier ;
    - croire que `TYPE="button"` envoie le formulaire.

## Exercice

<div class="exo" data-exo="bonus-1" markdown>
Créez un formulaire envoyé en **POST** vers `inscription.php`, avec un champ **nom**, un groupe de **boutons radio** `niveau` (L1, L2), une **liste déroulante** `faculte` d'au moins deux choix, et un bouton **Envoyer**. Testez l'envoi dans le rendu.
</div>

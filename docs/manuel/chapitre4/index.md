# Chapitre 4 — Les formulaires HTML

Les formulaires permettent aux utilisateurs d'interagir avec une page Web en saisissant des informations.

Ce chapitre est organisé en trois sections :

1. **Les bases des formulaires** — structure et champs textuels
2. **Les contrôles de sélection** — boutons radio, cases à cocher, listes déroulantes
3. **Les champs avancés et les boutons** — organisation, zones de texte, envoi et fichiers

---

## Sommaire

- [Section 1 – Les bases des formulaires](#section-1--les-bases-des-formulaires)
- [Section 2 – Les contrôles de sélection](#section-2--les-contrôles-de-sélection)
- [Section 3 – Les champs avancés et les boutons](#section-3--les-champs-avancés-et-les-boutons)

---

⬅️ Précédent : Les tableaux HTML

➡️ Suivant : Les images HTML

---

## Section 1 — Les bases des formulaires


Jusqu'à présent, les pages HTML réalisées permettaient uniquement d'afficher des informations.

Les **formulaires HTML** permettent désormais aux utilisateurs **d'interagir avec une page Web** en saisissant des informations qui seront ensuite envoyées à un serveur.

Par exemple, ils permettent de :

- créer un compte ;
- se connecter ;
- effectuer une recherche ;
- réserver un billet ;
- envoyer un commentaire ;
- remplir un questionnaire.

---

## La balise `<FORM>`

La balise `<FORM>` est la balise principale de tout formulaire.

Elle délimite l'ensemble des champs qui seront envoyés lors de la validation.

### Syntaxe générale

```html
<FORM ACTION="destination.htm" METHOD="POST">

    ...

</FORM>
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `ACTION` | Indique la destination des données du formulaire. |
| `METHOD` | Définit la méthode de transmission des données (`GET` ou `POST`). |
| `ENCTYPE` | Définit le type d'encodage utilisé lors de l'envoi des données. |
| `NAME` | Donne un nom au formulaire. |
| `TARGET` | Détermine où afficher la réponse du serveur. |

---

## L'attribut `ACTION`

L'attribut `ACTION` indique **l'adresse vers laquelle les informations seront envoyées** après la validation du formulaire.

!!! example "Exemple 4.1 — Utilisation de ACTION"

    ```html
    <FORM ACTION="inscription.htm">
    ```

!!! info "Fonctionnement"

    Lorsque l'utilisateur valide le formulaire, les données sont envoyées vers :

    `inscription.htm`

---

## L'attribut `METHOD`

Deux méthodes sont principalement utilisées pour envoyer les données d'un formulaire.

### `GET`

La méthode **GET** ajoute les données directement à l'adresse de la page.

!!! example "Exemple 4.2 — Méthode GET"

    ```text
    resultat.htm?nom=Ali&age=20
    ```

!!! tip "Utilisation"

    Cette méthode est principalement utilisée pour :

    - les recherches ;
    - les filtres ;
    - les pages dont les paramètres peuvent apparaître dans l'URL.

---

### `POST`

La méthode **POST** transmet les données dans le corps de la requête.

Les informations **n'apparaissent pas dans l'adresse** du navigateur.

!!! tip "Utilisation"

    Cette méthode est recommandée pour :

    - les formulaires d'inscription ;
    - les formulaires de connexion ;
    - l'envoi de fichiers.

---

## L'attribut `ENCTYPE`

L'attribut `ENCTYPE` précise **le format utilisé pour envoyer les données**.

Les valeurs les plus courantes sont :

| Valeur | Utilisation |
|--------|-------------|
| `application/x-www-form-urlencoded` | Formulaire classique |
| `multipart/form-data` | Envoi de fichiers |
| `text/plain` | Débogage ou cas particuliers |

---

## La balise `<INPUT>`

La majorité des champs d'un formulaire sont créés grâce à la balise :

```html
<INPUT>
```

Son comportement dépend principalement de son attribut :

```html
TYPE
```

Selon la valeur choisie (`text`, `password`, `radio`, etc.), le navigateur affichera un champ différent.

---

## Les champs texte

Le type `TEXT` permet à l'utilisateur de saisir une information sur **une seule ligne**.

### Syntaxe

```html
<INPUT TYPE="text">
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `NAME` | Nom du champ. |
| `SIZE` | Largeur de la zone de saisie. |
| `MAXLENGTH` | Nombre maximal de caractères. |
| `VALUE` | Texte affiché par défaut. |
| `READONLY` | Rend le champ non modifiable. |

!!! example "Exemple 4.3 — Champs texte"

    ```html
    Nom :

    <INPUT TYPE="text"
           NAME="nom"
           SIZE="25">

    Prénom :

    <INPUT TYPE="text"
           NAME="prenom"
           SIZE="25">
    ```

---

## Les mots de passe

Le type `PASSWORD` fonctionne comme un champ texte.

La différence est que **les caractères saisis sont masqués** pendant la saisie.

### Syntaxe

```html
<INPUT TYPE="password">
```

!!! example "Exemple 4.4 — Champ mot de passe"

    ```html
    Mot de passe :

    <INPUT TYPE="password"
           NAME="motdepasse"
           SIZE="15"
           MAXLENGTH="20">
    ```

---

## Exemple complet

!!! example "Connexion étudiant"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Connexion
        </TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H2 ALIGN="CENTER">
            Connexion étudiant
        </H2>

        <FORM ACTION="connexion.htm"
              METHOD="POST">

            <P>

                Nom :

                <INPUT TYPE="text"
                       NAME="nom"
                       SIZE="30">

            </P>

            <P>

                Mot de passe :

                <INPUT TYPE="password"
                       NAME="mdp"
                       SIZE="15">

            </P>

        </FORM>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier la balise `<FORM>` ;

    - oublier de fermer le formulaire ;

    - oublier l'attribut `NAME` ;

    - utiliser deux attributs `TYPE` dans le même `<INPUT>` ;

    - oublier l'attribut `METHOD`.

---

## À retenir

!!! success "Points essentiels"

    - Tous les formulaires commencent par `<FORM>`.

    - `<INPUT>` permet de créer différents types de champs.

    - `TYPE="text"` crée une zone de texte.

    - `TYPE="password"` masque les caractères saisis.

    - `ACTION` indique la destination des données.

    - `METHOD` définit la méthode d'envoi.

---

!!! question "Exercice"

    Créer une page HTML intitulée **Connexion à la Bibliothèque Universitaire** contenant :

    - un titre centré ;
    - un formulaire utilisant la méthode `POST` ;
    - un champ **Nom** ;
    - un champ **Prénom** ;
    - un champ **Mot de passe** ;
    - une ligne horizontale séparant le titre du formulaire.

### Objectif

Maîtriser la création d'un formulaire simple utilisant les balises :

- `<FORM>`
- `<INPUT>`

---

⬅️ **Retour :** Introduction du chapitre

---

## Section 2 — Les contrôles de sélection



Les principaux contrôles sont :

- les boutons radio ;
- les cases à cocher ;
- les listes déroulantes ;
- les listes à sélection multiple.

---

## Les boutons radio

Les boutons radio (`TYPE="radio"`) permettent à l'utilisateur de sélectionner **une seule réponse** parmi plusieurs propositions.

Tous les boutons appartenant au même groupe doivent posséder **le même attribut `NAME`**.

### Syntaxe

```html
<INPUT TYPE="radio"
       NAME="groupe"
       VALUE="valeur">
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `TYPE="radio"` | Crée un bouton radio. |
| `NAME` | Identifie le groupe auquel appartient le bouton. |
| `VALUE` | Valeur envoyée lorsque le bouton est sélectionné. |
| `CHECKED` | Définit le choix sélectionné par défaut. |
| `DISABLED` | Désactive le bouton. |

!!! example "Exemple 4.5 — Boutons radio"

    ```html
    <H3>Choisissez votre niveau :</H3>

    <INPUT TYPE="radio"
           NAME="niveau"
           VALUE="L1">

    Licence 1

    <BR>

    <INPUT TYPE="radio"
           NAME="niveau"
           VALUE="L2"
           CHECKED>

    Licence 2

    <BR>

    <INPUT TYPE="radio"
           NAME="niveau"
           VALUE="L3">

    Licence 3
    ```

!!! tip "Remarque"

    Le navigateur interdit automatiquement la sélection simultanée de plusieurs boutons radio appartenant au même groupe.

---

## Les cases à cocher

Les cases à cocher (`TYPE="checkbox"`) permettent à l'utilisateur de sélectionner **plusieurs réponses**.

Contrairement aux boutons radio, plusieurs cases peuvent être cochées simultanément.

### Syntaxe

```html
<INPUT TYPE="checkbox">
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `TYPE="checkbox"` | Crée une case à cocher. |
| `NAME` | Nom du groupe. |
| `VALUE` | Valeur envoyée au serveur. |
| `CHECKED` | Case cochée par défaut. |
| `DISABLED` | Désactive la case. |

!!! example "Exemple 4.6 — Cases à cocher"

    ```html
    <H3>Langages étudiés</H3>

    <INPUT TYPE="checkbox"
           NAME="langage"
           VALUE="HTML"
           CHECKED>

    HTML

    <BR>

    <INPUT TYPE="checkbox"
           NAME="langage"
           VALUE="CSS">

    CSS

    <BR>

    <INPUT TYPE="checkbox"
           NAME="langage"
           VALUE="JavaScript">

    JavaScript

    <BR>

    <INPUT TYPE="checkbox"
           NAME="langage"
           VALUE="PHP">

    PHP
    ```

---

## Différence entre `RADIO` et `CHECKBOX`

| Bouton radio | Case à cocher |
|--------------|---------------|
| Un seul choix possible | Plusieurs choix possibles |
| Même attribut `NAME` | Généralement le même `NAME` |
| Utilisé pour une réponse unique | Utilisé pour une sélection multiple |

---

## Les listes déroulantes

La balise `<SELECT>` permet d'afficher une liste de choix.

Chaque élément de cette liste est représenté par une balise `<OPTION>`.

### Syntaxe

```html
<SELECT>

    <OPTION>Choix 1</OPTION>
    <OPTION>Choix 2</OPTION>

</SELECT>
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `NAME` | Nom de la liste. |
| `SIZE` | Nombre d'éléments visibles. |
| `MULTIPLE` | Autorise plusieurs sélections. |
| `DISABLED` | Désactive la liste. |

---

## La balise `<OPTION>`

Chaque élément d'une liste est défini grâce à la balise `<OPTION>`.

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `VALUE` | Valeur envoyée au serveur. |
| `SELECTED` | Élément sélectionné par défaut. |

!!! example "Exemple 4.7 — Liste déroulante"

    ```html
    <P>
        Choisissez votre département :
    </P>

    <SELECT NAME="departement">

        <OPTION VALUE="GI">
            Génie Informatique
        </OPTION>

        <OPTION VALUE="SIC" SELECTED>
            Sciences de l'Information et de la Communication
        </OPTION>

        <OPTION VALUE="ELEC">
            Électronique
        </OPTION>

    </SELECT>
    ```

---

## La balise `<OPTGROUP>`

La balise `<OPTGROUP>` permet de regrouper plusieurs options appartenant à une même catégorie.

!!! example "Exemple 4.8 — Groupes d'options"

    ```html
    <SELECT NAME="bibliotheque">

        <OPTGROUP LABEL="Sciences">

            <OPTION>Mathématiques</OPTION>
            <OPTION>Physique</OPTION>
            <OPTION>Informatique</OPTION>

        </OPTGROUP>

        <OPTGROUP LABEL="Lettres">

            <OPTION>Français</OPTION>
            <OPTION>Anglais</OPTION>

        </OPTGROUP>

    </SELECT>
    ```

---

## Les listes à sélection multiple

L'attribut `MULTIPLE` autorise l'utilisateur à sélectionner plusieurs éléments.

La sélection s'effectue généralement à l'aide des touches **Ctrl** ou **Maj**.

!!! example "Exemple 4.9 — Sélection multiple"

    ```html
    <P>
        Modules suivis :
    </P>

    <SELECT
        NAME="modules"
        SIZE="5"
        MULTIPLE>

        <OPTION>HTML</OPTION>
        <OPTION>CSS</OPTION>
        <OPTION>JavaScript</OPTION>
        <OPTION>PHP</OPTION>
        <OPTION>SQL</OPTION>

    </SELECT>
    ```

---

## Exemple complet

!!! example "Inscription universitaire"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Inscription Universitaire
        </TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H2 ALIGN="CENTER">
            Inscription
        </H2>

        <FORM ACTION="inscription.htm"
              METHOD="POST">

            <P>
                Sexe :
            </P>

            <INPUT TYPE="radio"
                   NAME="sexe"
                   VALUE="M">

            Masculin

            <BR>

            <INPUT TYPE="radio"
                   NAME="sexe"
                   VALUE="F"
                   CHECKED>

            Féminin

            <HR>

            <P>
                Compétences :
            </P>

            <INPUT TYPE="checkbox"
                   NAME="competence"
                   VALUE="HTML">

            HTML

            <BR>

            <INPUT TYPE="checkbox"
                   NAME="competence"
                   VALUE="CSS">

            CSS

            <BR>

            <INPUT TYPE="checkbox"
                   NAME="competence"
                   VALUE="JavaScript">

            JavaScript

            <HR>

            <P>
                Département :
            </P>

            <SELECT NAME="departement">

                <OPTGROUP LABEL="TECNA">

                    <OPTION VALUE="GI">
                        Génie Informatique
                    </OPTION>

                    <OPTION VALUE="SIC" SELECTED>
                        SIC
                    </OPTION>

                </OPTGROUP>

            </SELECT>

        </FORM>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - utiliser des boutons radio ayant des noms différents alors qu'ils appartiennent au même groupe ;

    - oublier l'attribut `VALUE` ;

    - oublier de fermer une balise `<SELECT>` ;

    - placer une balise `<OPTION>` en dehors d'une balise `<SELECT>` ;

    - oublier `CHECKED` lorsqu'un choix par défaut est souhaité ;

    - utiliser `MULTIPLE` sans augmenter la valeur de `SIZE`, ce qui rend la sélection multiple moins évidente.

---

## À retenir

!!! success "Points essentiels"

    - `TYPE="radio"` permet un choix unique.

    - `TYPE="checkbox"` permet plusieurs choix.

    - `<SELECT>` crée une liste déroulante.

    - `<OPTION>` représente une valeur de la liste.

    - `<OPTGROUP>` regroupe plusieurs options.

    - `MULTIPLE` autorise plusieurs sélections.

    - `CHECKED` et `SELECTED` permettent de définir une valeur par défaut.

---

!!! question "Exercice"

    Créer une page HTML intitulée **Inscription à un club universitaire** contenant :

    - une section **Informations générales** ;

    - un groupe de boutons radio permettant de choisir le niveau d'étude ;

    - des cases à cocher représentant les activités souhaitées :
        - Sport ;
        - Musique ;
        - Informatique ;
        - Lecture.

    - une liste déroulante permettant de choisir la faculté ;

    - une liste à sélection multiple contenant les langues parlées ;

    - une ligne horizontale séparant chaque partie du formulaire.

### Objectif

Maîtriser les contrôles de sélection proposés par HTML.

---

---

## Section 3 — Les champs avancés et les boutons




- les groupes de champs (`FIELDSET`) ;
- les titres de groupes (`LEGEND`) ;
- les zones de texte (`TEXTAREA`) ;
- les différents types de boutons ;
- les champs de type `FILE` et `HIDDEN`.

---

## La balise `<FIELDSET>`

Lorsqu'un formulaire devient volumineux, il est conseillé de regrouper les champs ayant le même objectif.

Pour cela, HTML met à disposition la balise `<FIELDSET>`.

Cette balise permet d'entourer un ensemble de champs par un cadre afin de mieux organiser le formulaire.

L'utilisation de plusieurs `FIELDSET` rend un formulaire plus lisible et facilite sa compréhension.

### Syntaxe

```html
<FIELDSET>

    ...

</FIELDSET>
```

!!! example "Exemple 4.10 — Utilisation de FIELDSET"

    ```html
    <FIELDSET>

        Nom :

        <INPUT TYPE="text" NAME="nom">

        <BR><BR>

        Prénom :

        <INPUT TYPE="text" NAME="prenom">

    </FIELDSET>
    ```

!!! tip "Remarque"

    Un formulaire peut contenir plusieurs balises `<FIELDSET>`.

    Par exemple :

    - Informations personnelles ;
    - Coordonnées ;
    - Diplômes ;
    - Informations complémentaires.

---

## La balise `<LEGEND>`

La balise `<LEGEND>` est utilisée à l'intérieur d'un `<FIELDSET>`.

Elle permet d'afficher un titre décrivant le groupe de champs.

### Syntaxe

```html
<FIELDSET>

    <LEGEND>
        Informations personnelles
    </LEGEND>

    ...

</FIELDSET>
```

!!! example "Exemple 4.11 — Titre d'un groupe"

    ```html
    <FIELDSET>

        <LEGEND>
            Étudiant
        </LEGEND>

        Nom :

        <INPUT TYPE="text">

        <BR>

        Prénom :

        <INPUT TYPE="text">

    </FIELDSET>
    ```

!!! info "Résultat"

    Le navigateur affiche automatiquement le texte de la balise `<LEGEND>` sur le bord supérieur du cadre.

---
!!! tip "Bonne pratique"

    Une balise `<FIELDSET>` devrait toujours être accompagnée d'une balise `<LEGEND>`.

    Même si la balise `<LEGEND>` est facultative en HTML, elle est fortement recommandée, car elle :

    - donne un titre au groupe de champs ;
    - améliore la lisibilité du formulaire ;
    - facilite la compréhension pour les utilisateurs ;
    - améliore l'accessibilité, notamment pour les lecteurs d'écran.

    Un formulaire peut contenir plusieurs balises `<FIELDSET>`, chacune possédant son propre `<LEGEND>`.

    Exemples de groupes :

    - Informations personnelles ;
    - Coordonnées ;
    - Diplômes ;
    - Informations complémentaires.

---

## La balise `<TEXTAREA>`

Contrairement au champ `TEXT`, qui permet une saisie sur une seule ligne, la balise `<TEXTAREA>` permet de saisir **plusieurs lignes de texte**.

Elle est principalement utilisée pour :

- les commentaires ;
- les observations ;
- les messages ;
- les descriptions.

### Syntaxe

```html
<TEXTAREA>

</TEXTAREA>
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `NAME` | Nom de la zone de texte. |
| `ROWS` | Nombre de lignes visibles. |
| `COLS` | Largeur de la zone de texte. |
| `READONLY` | Rend la zone non modifiable. |

!!! example "Exemple 4.12 — Zone de texte"

    ```html
    <TEXTAREA
        NAME="commentaire"
        ROWS="5"
        COLS="50">
    </TEXTAREA>
    ```

### Texte par défaut

Le texte initial est placé **entre les deux balises**.

!!! example "Exemple 4.13 — Texte par défaut"

    ```html
    <TEXTAREA
        NAME="observation"
        ROWS="4"
        COLS="40">

    Aucun commentaire.

    </TEXTAREA>
    ```

---

## Le bouton `SUBMIT`

Le bouton `SUBMIT` permet d'envoyer les informations du formulaire.

Lorsqu'il est cliqué, le navigateur transmet toutes les données à l'adresse indiquée dans l'attribut `ACTION`.

### Syntaxe

```html
<INPUT TYPE="submit">
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `TYPE="submit"` | Crée un bouton d'envoi. |
| `VALUE` | Texte affiché sur le bouton. |

!!! example "Exemple 4.14 — Bouton d'envoi"

    ```html
    <INPUT TYPE="submit"
           VALUE="Valider">
    ```

---

## Le bouton `RESET`

Le bouton `RESET` remet tous les champs du formulaire dans leur état initial.

Toutes les informations saisies par l'utilisateur sont effacées.

### Syntaxe

```html
<INPUT TYPE="reset">
```

!!! example "Exemple 4.15 — Réinitialisation"

    ```html
    <INPUT TYPE="reset"
           VALUE="Effacer">
    ```

---

## Le bouton `BUTTON`

Le type `BUTTON` crée un bouton classique.

Contrairement au bouton `SUBMIT`, il n'effectue **aucune action automatiquement**.

Il est généralement utilisé avec un programme JavaScript.

!!! example "Exemple 4.16 — Bouton classique"

    ```html
    <INPUT TYPE="button"
           VALUE="Calculer">
    ```

---

## Le bouton `IMAGE`

Le type `IMAGE` remplace un bouton `SUBMIT` par une image.

Lorsque l'utilisateur clique sur cette image, le formulaire est envoyé.

### Syntaxe

```html
<INPUT
    TYPE="image"
    SRC="valider.gif">
```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `SRC` | Image utilisée comme bouton. |
| `WIDTH` | Largeur de l'image. |
| `HEIGHT` | Hauteur de l'image. |

---

## Le type `FILE`

Le type `FILE` permet à l'utilisateur de sélectionner un fichier sur son ordinateur.

Ce fichier pourra être transmis au serveur lors de l'envoi du formulaire.

### Syntaxe

```html
<INPUT TYPE="file">
```

!!! example "Exemple"

    ```html
    Photo :

    <INPUT
        TYPE="file"
        NAME="photo">
    ```

!!! tip "Remarque"

    Pour envoyer un fichier, le formulaire doit utiliser :

    ```html
    ENCTYPE="multipart/form-data"
    ```

---

## Le type `HIDDEN`

Le type `HIDDEN` crée un champ invisible.

L'utilisateur ne peut ni le voir ni le modifier.

Ce champ permet d'envoyer discrètement certaines informations.

!!! example "Exemple 4.17 — Champ caché"

    ```html
    <INPUT
        TYPE="hidden"
        NAME="identifiant"
        VALUE="20260015">
    ```

---

## Exemple complet

!!! example "Inscription à la bibliothèque"

    ```html
    <HTML>

    <HEAD>

        <TITLE>
            Inscription à la bibliothèque
        </TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H2 ALIGN="CENTER">
            Nouvel étudiant
        </H2>

        <FORM
            ACTION="inscription.htm"
            METHOD="POST"
            ENCTYPE="multipart/form-data">

            <FIELDSET>

                <LEGEND>
                    Informations personnelles
                </LEGEND>

                Nom :

                <INPUT TYPE="text"
                       NAME="nom"
                       SIZE="25">

                <BR><BR>

                Prénom :

                <INPUT TYPE="text"
                       NAME="prenom"
                       SIZE="25">

                <BR><BR>

                Mot de passe :

                <INPUT TYPE="password"
                       NAME="motdepasse">

            </FIELDSET>

            <BR>

            <FIELDSET>

                <LEGEND>
                    Informations complémentaires
                </LEGEND>

                Commentaire :

                <BR>

                <TEXTAREA
                    NAME="commentaire"
                    ROWS="5"
                    COLS="45">
                </TEXTAREA>

                <BR><BR>

                Photo :

                <INPUT
                    TYPE="file"
                    NAME="photo">

            </FIELDSET>

            <BR>

            <INPUT
                TYPE="hidden"
                NAME="code"
                VALUE="UAM2026">

            <INPUT
                TYPE="submit"
                VALUE="Envoyer">

            <INPUT
                TYPE="reset"
                VALUE="Effacer">

        </FORM>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier de fermer une balise `<FIELDSET>` ;

    - placer `<LEGEND>` en dehors d'un `<FIELDSET>` ;

    - utiliser un `TEXTAREA` avec un attribut `VALUE` (le texte par défaut doit être placé entre les balises) ;

    - oublier `ENCTYPE="multipart/form-data"` lors de l'envoi d'un fichier ;

    - croire que `RESET` annule un formulaire déjà envoyé ;

    - utiliser `BUTTON` en pensant qu'il envoie automatiquement le formulaire.

---

## À retenir

!!! success "Points essentiels"

    - `<FIELDSET>` regroupe plusieurs champs d'un formulaire.

    - `<LEGEND>` donne un titre à un groupe de champs.

    - `<TEXTAREA>` permet la saisie de plusieurs lignes de texte.

    - `SUBMIT` envoie le formulaire.

    - `RESET` réinitialise les champs.

    - `BUTTON` crée un bouton sans action automatique.

    - `IMAGE` transforme une image en bouton d'envoi.

    - `FILE` permet de sélectionner un fichier.

    - `HIDDEN` permet de transmettre des informations invisibles.

---

## Exercice final de synthèse

!!! question "Exercice"

    Créer une page HTML intitulée **Fiche d'inscription d'un étudiant** comportant :

    - un titre principal centré ;

    - un formulaire utilisant la méthode `POST` ;

    - deux groupes de champs (`FIELDSET`) :

        **Informations personnelles**

        - Nom ;
        - Prénom ;
        - Mot de passe.

        **Informations complémentaires**

        - Département ;
        - Commentaires ;
        - Photo d'identité.

    - un champ caché contenant un numéro d'inscription ;

    - un bouton **Envoyer** et un bouton **Effacer**.

### Objectif

Réaliser un formulaire complet mettant en œuvre l'ensemble des balises étudiées dans ce chapitre.

---


---

## Conclusion du chapitre

Ce chapitre a présenté l'ensemble des éléments essentiels pour créer des formulaires HTML complets et fonctionnels :

- La balise `<FORM>` et ses attributs (`ACTION`, `METHOD`, `ENCTYPE`)
- Les champs de saisie texte (`TEXT`, `PASSWORD`)
- Les contrôles de sélection (`RADIO`, `CHECKBOX`, `<SELECT>`, `<OPTION>`, `<OPTGROUP>`)
- L'organisation des formulaires (`<FIELDSET>`, `<LEGEND>`)
- Les zones de texte multilignes (`<TEXTAREA>`)
- Les boutons d'action (`SUBMIT`, `RESET`, `BUTTON`, `IMAGE`)
- Les champs spéciaux (`FILE`, `HIDDEN`)

La maîtrise de ces éléments permet de construire des formulaires adaptés à tous les besoins : inscription, connexion, recherche, envoi de fichiers, etc.

---

⬅️ **Précédent :** Les tableaux HTML

➡️ **Suivant :** Chapitre 5 — Les liens HTML

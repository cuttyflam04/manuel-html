# Les tableaux HTML

## Introduction

Les **tableaux HTML** permettent de présenter des informations organisées sous forme de **lignes** et de **colonnes**.

Ils sont particulièrement utiles pour afficher :

- des listes d'étudiants ;

- des notes d'examen ;

- des catalogues de produits ;

- des emplois du temps ;

- des statistiques.

Un tableau est composé de plusieurs **lignes** `<TR>`), elles-mêmes composées de **cellules** `<TD>` ou `<TH>`).

---

## La balise `<TABLE>`

La balise `<TABLE>` délimite un tableau HTML.

### Syntaxe

```html

<TABLE BORDER="1">

</TABLE>

```

Les principaux attributs sont :

| Attribut | Fonction |
|----------|----------|
| `BORDER` | Épaisseur de la bordure du tableau |
| `WIDTH` | Largeur du tableau |
| `ALIGN` | Position du tableau |
| `CELLPADDING` | Marge intérieure des cellules |
| `CELLSPACING` | Espacement entre les cellules |

!!! example "Exemple 3.1 — Premier tableau"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TD>HTML</TD>

            <TD>CSS</TD>

        </TR>

    </TABLE>

    ```

---

## Les lignes : `<TR>`

La balise `<TR>` (*Table Row*) représente une **ligne** du tableau.

Chaque tableau est constitué d'une ou plusieurs lignes.

!!! example "Exemple 3.2 — Création de lignes"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TD>Nom</TD>

            <TD>Prénom</TD>

        </TR>

        <TR>

            <TD>Fall</TD>

            <TD>Amadou</TD>

        </TR>

    </TABLE>

    ```

---

## Les cellules : `<TD>`

La balise `<TD>` (*Table Data*) représente une cellule contenant une donnée.

!!! example "Exemple"

    ```html

    <TD>Licence 2</TD>

    ```

!!! tip "Remarque"

    Une ligne peut contenir autant de cellules que nécessaire.

---

## Les cellules d'en-tête : `<TH>`

Les cellules d'en-tête utilisent la balise `<TH>`.

Le navigateur affiche automatiquement leur contenu **en gras** et **centré**.

!!! example "Exemple 3.3 — Cellules d'en-tête"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TH>Nom</TH>

            <TH>Âge</TH>

        </TR>

        <TR>

            <TD>Fatou</TD>

            <TD>20</TD>

        </TR>

    </TABLE>

    ```

---

## Fusion de colonnes : `COLSPAN`

L'attribut `COLSPAN` permet de fusionner plusieurs colonnes.

### Syntaxe

```html

<TH COLSPAN="2">

```

!!! example "Exemple 3.4 — Fusion de colonnes"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TH COLSPAN="2">

                Étudiant

            </TH>

        </TR>

        <TR>

            <TH>Nom</TH>

            <TH>Prénom</TH>

        </TR>

        <TR>

            <TD>Diop</TD>

            <TD>Awa</TD>

        </TR>

    </TABLE>

    ```

!!! info "Résultat"

    La cellule **Étudiant** occupe deux colonnes.

---

## Fusion de lignes : `ROWSPAN`

L'attribut `ROWSPAN` permet de fusionner plusieurs lignes.

!!! example "Exemple 3.5 — Fusion de lignes"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TH ROWSPAN="2">

                Classe

            </TH>

            <TH>Matière</TH>

        </TR>

        <TR>

            <TD>HTML</TD>

        </TR>

    </TABLE>

    ```

!!! info "Résultat"

    La cellule **Classe** occupe deux lignes.

---

## Alignement du contenu

L'attribut `ALIGN` permet d'aligner le contenu d'une cellule.

Les principales valeurs sont :

- `LEFT`

- `CENTER`

- `RIGHT`

!!! example "Exemple 3.6 — Alignement"

    ```html

    <TD ALIGN="CENTER">

        Informatique

    </TD>

    ```

---

## Exemple complet

!!! example "Résultats des étudiants"

    ```html

    <HTML>

    <HEAD>

        <TITLE>Résultats des étudiants</TITLE>

    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H2 ALIGN="CENTER">

            Liste des étudiants

        </H2>

        <TABLE BORDER="1" ALIGN="CENTER">

            <TR>

                <TH COLSPAN="3">

                    Licence 2 SIC

                </TH>

            </TR>

            <TR>

                <TH>Nom</TH>

                <TH>Prénom</TH>

                <TH>Moyenne</TH>

            </TR>

            <TR>

                <TD>Diouf</TD>

                <TD>Aminata</TD>

                <TD ALIGN="CENTER">15.50</TD>

            </TR>

            <TR>

                <TD>Ba</TD>

                <TD>Moussa</TD>

                <TD ALIGN="CENTER">13.75</TD>

            </TR>

            <TR>

                <TD>Fall</TD>

                <TD>Mariama</TD>

                <TD ALIGN="CENTER">17.20</TD>

            </TR>

        </TABLE>

    </BODY>

    </HTML>

    ```

---

## Exemple utilisant `ROWSPAN` et `COLSPAN`

!!! example "Exemple 3.7 — Fusion de lignes et de colonnes"

    ```html

    <TABLE BORDER="1">

        <TR>

            <TH COLSPAN="2">

                Produit

            </TH>

            <TH ROWSPAN="2">

                Prix

            </TH>

        </TR>

        <TR>

            <TH>Nom</TH>

            <TH>Catégorie</TH>

        </TR>

        <TR>

            <TD>Ordinateur</TD>

            <TD>Informatique</TD>

            <TD>450 000 FCFA</TD>

        </TR>

        <TR>

            <TD>Imprimante</TD>

            <TD>Bureautique</TD>

            <TD>95 000 FCFA</TD>

        </TR>

    </TABLE>

    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier de fermer une balise `<TR>` ;

    - placer une cellule `<TD>` en dehors d'une ligne ;

    - utiliser un nombre incorrect de colonnes ;

    - oublier de fermer `<TABLE>` ;

    - confondre `<TH>` et `<TD>` ;

    - utiliser un `ROWSPAN` ou un `COLSPAN` incompatible avec la structure du tableau.

---

## À retenir

!!! success "Points essentiels"

    - `<TABLE>` crée un tableau.

    - `<TR>` crée une ligne.

    - `<TD>` crée une cellule contenant des données.

    - `<TH>` crée une cellule d'en-tête.

    - `COLSPAN` fusionne plusieurs colonnes.

    - `ROWSPAN` fusionne plusieurs lignes.

    - `ALIGN` permet d'aligner le contenu.

---

## Exercices

!!! question "Exercice 1"

    Créer un tableau présentant les informations suivantes :

    | Nom | Prénom | Âge |
    |-----|---------|----:|
    | Ndiaye | Ousmane | 22 |
    | Faye | Khady | 20 |
    | Diallo | Ibrahima | 21 |

    Le tableau devra posséder une bordure de taille **1**.

---

!!! question "Exercice 2"

    Créer un tableau intitulé **Catalogue de la bibliothèque** comprenant :

    - un en-tête fusionné avec `COLSPAN` ;

    - trois colonnes :

        - Titre ;

        - Auteur ;

        - Disponibilité.

    - cinq livres ;

    - une cellule utilisant `ROWSPAN`.

---

!!! question "Exercice 3"

    Reproduire le tableau suivant en utilisant correctement `ROWSPAN` et `COLSPAN` :

    | Jour | 08h-10h | 10h-12h |
    |------|----------|----------|
    | Lundi | HTML | CSS |
    | Mardi | JavaScript | PHP |
    | Mercredi | Base de données | |

### Objectif

Maîtriser la création de **tableaux HTML**, la fusion de cellules et l'utilisation des attributs `ROWSPAN` et `COLSPAN`.

---

⬅️ **Précédent :** Les listes HTML

➡️ **Suivant :** Les formulaires HTML
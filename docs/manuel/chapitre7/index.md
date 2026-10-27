# Les tableaux

Un tableau organise des informations **structurées** sous forme de lignes et de colonnes : une liste d'étudiants, des notes, un emploi du temps… Il se compose de **lignes**, elles-mêmes découpées en **cellules**.

## Trois balises imbriquées

| Balise | Rôle |
|--------|------|
| `<TABLE> … </TABLE>` | Ouverture et fermeture du **tableau** |
| `<TR> … </TR>` | Ouverture et fermeture d'une **ligne** (*Table Row*) |
| `<TD> … </TD>` | Ouverture et fermeture d'une **cellule** (*Table Data*) |

Un tableau se lit **ligne par ligne** : on ouvre une ligne `<TR>`, on y met ses cellules `<TD>`, on la ferme, puis on passe à la ligne suivante.

!!! example "Exemple 7.1 — Un premier tableau"

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

!!! danger "La règle d'or"

    **Chaque ligne doit avoir le même nombre de cellules**, qui correspond au nombre de colonnes du tableau. Sinon, le tableau se désorganise.

## Les attributs de `<TABLE>`

| Attribut | Rôle |
|----------|------|
| `BORDER="b"` | Épaisseur de l'encadrement du tableau et des cellules, en pixels. `0` : pas de bordure. |
| `WIDTH="w"` ou `"w%"` | Largeur du tableau, en pixels ou en pourcentage de la fenêtre (à utiliser avec prudence). |
| `BGCOLOR="couleur"` | Couleur de fond du tableau. |

!!! example "Exemple 7.2 — Bordure, largeur et fond"

    ```html
    <TABLE BORDER="3" WIDTH="60%" BGCOLOR="#C0C0C0">
        <TR>
            <TD>HTML</TD>
            <TD>Licence 1</TD>
        </TR>
        <TR>
            <TD>PHP</TD>
            <TD>Licence 2</TD>
        </TR>
    </TABLE>
    ```

Changez `BORDER="3"` en `BORDER="0"` puis en `BORDER="10"` pour voir la différence.

## Les cellules d'en-tête : `<TH>`

`<TH>` (*Table Header*) remplace `<TD>` pour les **titres de colonnes**. Le navigateur affiche leur contenu **en gras** et **centré**.

!!! example "Exemple 7.3 — Titres de colonnes"

    ```html
    <TABLE BORDER="1">
        <TR>
            <TH>Titre 1</TH>
            <TH>Titre 2</TH>
            <TH>Titre 3</TH>
        </TR>
        <TR>
            <TD>a</TD>
            <TD>b</TD>
            <TD>c</TD>
        </TR>
    </TABLE>
    ```

## Le titre du tableau : `<CAPTION>`

`<CAPTION>` donne un **titre au tableau**. Il se place juste après `<TABLE>`. L'attribut `ALIGN` choisit sa position : `"TOP"` (au-dessus, par défaut) ou `"BOTTOM"` (en dessous).

!!! example "Exemple 7.4 — Titre en dessous"

    ```html
    <TABLE BORDER="1">
        <CAPTION ALIGN="BOTTOM">Le titre du tableau</CAPTION>
        <TR>
            <TH>Jour</TH>
            <TH>Cours</TH>
        </TR>
        <TR>
            <TD>Lundi</TD>
            <TD>HTML</TD>
        </TR>
    </TABLE>
    ```

## Aligner le contenu : `ALIGN` et `VALIGN`

Ces attributs se placent sur une **ligne** `<TR>` (pour toutes ses cellules) ou sur une **cellule** `<TD>` (cellule par cellule).

| Attribut | Valeurs |
|----------|---------|
| `ALIGN` (horizontal) | `LEFT` (par défaut), `CENTER`, `RIGHT`, `JUSTIFY` (avec prudence) |
| `VALIGN` (vertical) | `TOP`, `MIDDLE` (par défaut), `BOTTOM` |

!!! example "Exemple 7.5 — Alignements"

    ```html
    <TABLE BORDER="1" WIDTH="100%">
        <TR ALIGN="CENTER">
            <TD>Toute la ligne</TD>
            <TD>est</TD>
            <TD>centrée</TD>
        </TR>
        <TR>
            <TD VALIGN="TOP">En haut</TD>
            <TD>Une cellule<BR>haute de<BR>quatre<BR>lignes</TD>
            <TD VALIGN="BOTTOM" ALIGN="RIGHT">En bas à droite</TD>
        </TR>
    </TABLE>
    ```

!!! support "Dans le support de cours"

    L'exemple de la page 91 écrit `<td align=middle>`. **`MIDDLE` n'existe pas pour `ALIGN`** : c'est une valeur de `VALIGN`. Pour centrer horizontalement, écrivez `ALIGN="CENTER"`.

### La largeur d'une cellule

`WIDTH="w"` ou `"w%"` sur un `<TD>` donne la largeur de la cellule, en pixels ou en pourcentage de la largeur du tableau. Indiquez-la **une seule fois** par colonne (sur une seule ligne) : elle fixe la largeur de toute la colonne.

## Fusionner des cellules : `COLSPAN` et `ROWSPAN`

| Attribut | Effet |
|----------|-------|
| `COLSPAN="c"` | Fusionne `c` cellules **à l'horizontale** : le texte s'étend sur plusieurs colonnes. |
| `ROWSPAN="r"` | Fusionne `r` cellules **à la verticale** : le texte s'étend sur plusieurs lignes. |

!!! warning "Compter les cellules"

    Une cellule fusionnée **compte pour autant de cellules** que la valeur de son `COLSPAN`. Avec `ROWSPAN`, la cellule « occupe » aussi une place dans les lignes du dessous : il faut **retirer** une cellule dans chacune de ces lignes.

!!! example "Exemple 7.6 — COLSPAN"

    ```html
    <TABLE BORDER="1">
        <TR>
            <TH COLSPAN="2">Étudiant</TH>
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

!!! example "Exemple 7.7 — ROWSPAN"

    ```html
    <TABLE BORDER="1">
        <TR>
            <TD ROWSPAN="3">Lundi</TD>
            <TD>08h - HTML</TD>
        </TR>
        <TR>
            <TD>10h - Algorithmique</TD>
        </TR>
        <TR>
            <TD>14h - Anglais</TD>
        </TR>
    </TABLE>
    ```

Les deuxième et troisième lignes n'ont **qu'une** cellule : la première colonne est déjà occupée par « Lundi ».

## Les cellules vides

| Code | Résultat |
|------|----------|
| `<TD></TD>` | Une cellule vide, **sans bordure** dans les anciens navigateurs |
| `<TD>&nbsp;</TD>` | Une cellule vide **avec bordure** (elle contient une espace) |

## L'exemple complet du cours

Cet exemple réunit `CAPTION`, `TH`, `COLSPAN`, `ROWSPAN` et `BGCOLOR`. Il est **corrigé** : la version du support contient quelques coquilles, détaillées juste après.

!!! example "Exemple 7.8 — Comparatif de modèles économiques"

    ```html
    <TABLE BORDER="1" BGCOLOR="yellow">
        <CAPTION ALIGN="TOP">Comparatif mod&egrave;le &eacute;conomique</CAPTION>
        <TR>
            <TH COLSPAN="3">Mod&egrave;le</TH>
            <TH ROWSPAN="2">Vitesse<BR>en km/heure</TH>
            <TH ROWSPAN="2">Consommation<BR>en litre/100 km</TH>
        </TR>
        <TR>
            <TH>Marque</TH>
            <TH>Type</TH>
            <TH>Num&eacute;ro de s&eacute;rie</TH>
        </TR>
        <TR>
            <TD>Peugeot 106</TD>
            <TD>b2</TD>
            <TD ALIGN="CENTER">234.34</TD>
            <TD>132</TD>
            <TD>5,7</TD>
        </TR>
        <TR>
            <TD>Citro&euml;n AX</TD>
            <TD>AT67B8</TD>
            <TD ALIGN="CENTER">6789</TD>
            <TD>126</TD>
            <TD>5,5</TD>
        </TR>
    </TABLE>
    ```

!!! support "Dans le support de cours (page 91)"

    Trois corrections par rapport au support :

    - `<rt>` doit s'écrire **`<tr>`** (ouverture de ligne) ;
    - `</dt>` doit s'écrire **`</td>`** (fermeture de cellule) ;
    - `align=middle` doit s'écrire **`ALIGN="CENTER"`**.

    L'exemple utilisait aussi `BORDER="0"` : ici on met `BORDER="1"` pour bien voir les fusions.

## Les tableaux imbriqués

Une cellule peut contenir **n'importe quoi**, y compris **un autre tableau**. C'était une technique courante pour faire la mise en page en colonnes.

!!! example "Exemple 7.9 — Deux colonnes, dont un tableau imbriqué"

    ```html
    <TABLE BORDER="1" WIDTH="100%">
        <TR>
            <TD WIDTH="30%" VALIGN="TOP">
                <B>Menu</B><BR>
                Accueil<BR>
                Cours<BR>
                Contact
            </TD>
            <TD>
                Notes du semestre :
                <TABLE BORDER="1" BGCOLOR="#FFFF00">
                    <TR><TH>Matière</TH><TH>Note</TH></TR>
                    <TR><TD>HTML</TD><TD>16</TD></TR>
                    <TR><TD>Maths</TD><TD>13</TD></TR>
                </TABLE>
            </TD>
        </TR>
    </TABLE>
    ```

## Erreurs fréquentes

!!! danger "À éviter"

    - placer un `<TD>` directement dans `<TABLE>`, sans `<TR>` ;
    - avoir des lignes avec un nombre de cellules différent ;
    - oublier de retirer des cellules après un `COLSPAN` ou un `ROWSPAN` ;
    - confondre `ALIGN` (horizontal) et `VALIGN` (vertical) ;
    - oublier de fermer `</TABLE>` : tout le reste de la page peut disparaître.

## À retenir

!!! success "Points essentiels"

    - `<TABLE>` contient des lignes `<TR>`, qui contiennent des cellules `<TD>` ou `<TH>`.
    - Chaque ligne a le **même nombre de cellules**.
    - `BORDER`, `WIDTH` et `BGCOLOR` règlent le tableau.
    - `<TH>` : cellule d'en-tête, en gras et centrée. `<CAPTION>` : titre du tableau.
    - `ALIGN` aligne horizontalement, `VALIGN` verticalement, sur `<TR>` ou `<TD>`.
    - `COLSPAN` fusionne des colonnes, `ROWSPAN` fusionne des lignes.
    - `&nbsp;` dans un `<TD>` garde une cellule vide visible.

## Exercices

<div class="exo" data-exo="ch7-1" markdown>
Créez un tableau **avec bordure** de 3 colonnes : une ligne d'en-tête **Nom**, **Prénom**, **Âge** avec `<TH>`, puis trois étudiants (Ndiaye Ousmane 22, Faye Khady 20, Diallo Ibrahima 21).
</div>

<div class="exo" data-exo="ch7-2" markdown>
Reproduisez cet emploi du temps : une ligne d'en-tête **Jour**, **08h-10h**, **10h-12h** ; puis **Lundi** : HTML, CSS ; **Mardi** : JavaScript, PHP ; **Mercredi** : « Base de données » qui occupe **les deux créneaux** (fusion). Ajoutez un titre « Emploi du temps » avec `<CAPTION>`.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch7"></div>

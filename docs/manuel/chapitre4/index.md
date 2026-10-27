# Les listes

Les listes structurent le texte et ordonnent les informations. Le cours présente deux types de listes : **non ordonnées** (à puces) et **ordonnées** (numérotées).

| Balise | Signification |
|--------|---------------|
| `<UL> … </UL>` | Liste non ordonnée, à puces (*Unordered List*) |
| `<OL> … </OL>` | Liste ordonnée, à numéros (*Ordered List*) |
| `<LI> … </LI>` | Un élément de la liste (*List Item*) |

## La liste non ordonnée : `<UL>`

`<UL>` crée une liste **à puces**. On l'ouvre au début de la liste et on la ferme après le dernier élément. Chaque élément est créé par une balise `<LI>`.

!!! example "Exemple 4.1 — Liste non ordonnée"

    ```html
    <UL>
        <LI>Premier élément</LI>
        <LI>Deuxième élément</LI>
        <LI>Troisième élément</LI>
    </UL>
    ```

## La liste ordonnée : `<OL>`

`<OL>` crée une liste **numérotée** : le navigateur ajoute les numéros tout seul. Elle s'ouvre et se ferme comme `<UL>`, et contient elle aussi des `<LI>`.

!!! example "Exemple 4.2 — Liste ordonnée"

    ```html
    <OL>
        <LI>Remplir le formulaire d'inscription</LI>
        <LI>Déposer les pièces justificatives</LI>
        <LI>Payer les frais</LI>
        <LI>Recevoir la carte d'étudiant</LI>
    </OL>
    ```

Modifiez l'exemple : ajoutez un `<LI>` au milieu, et regardez la numérotation se mettre à jour toute seule.

## Le contenu d'une liste

Quatre règles du cours :

1. `<UL>` et `<OL>` ne peuvent contenir **que des éléments `<LI>`**.
2. Chaque `<LI>` peut contenir d'autres éléments : paragraphes, titres, texte en gras…
3. Les listes peuvent **s'imbriquer** : une liste à l'intérieur d'un `<LI>`.
4. On peut **mélanger** `<UL>` et `<OL>`, à condition de **bien les fermer**.

## Les listes imbriquées

Pour créer une sous-liste, on place une nouvelle liste **à l'intérieur d'un `<LI>`**, avant sa balise fermante `</LI>`.

!!! example "Exemple 4.3 — Listes imbriquées et mélangées"

    ```html
    <UL>
        <LI>Liste 1</LI>
        <LI>Liste 2</LI>
        <LI>Liste 3</LI>
    </UL>
    <P><B>Les listes num&eacute;rot&eacute;es</B></P>
    <OL>
        <LI>Numéro 1
            <OL>
                <LI>Numéro 10</LI>
                <LI>Numéro 11</LI>
                <LI>Numéro 12</LI>
            </OL>
        </LI>
        <LI>Numéro 2</LI>
        <LI>Numéro 3</LI>
    </OL>
    ```

La sous-liste est décalée vers la droite et repart à 1 : c'est une liste à part entière, rangée **dans** l'élément « Numéro 1 ».

!!! example "Exemple 4.4 — Une liste ordonnée dans une liste à puces"

    ```html
    <H2>Programme de la journée</H2>
    <UL>
        <LI>Cours
            <OL>
                <LI>Introduction au Web</LI>
                <LI>Les balises HTML</LI>
            </OL>
        </LI>
        <LI>Travaux pratiques</LI>
    </UL>
    ```

## Exemple complet

Cet exemple du cours réunit tout ce que nous avons vu : couleurs du `<BODY>`, titres et deux types de listes.

!!! example "Exemple 4.5 — Les mois de l'année"

    ```html
    <HTML>
    <HEAD>
        <TITLE>Exemple de liste</TITLE>
    </HEAD>
    <BODY BGCOLOR="yellow" TEXT="green">
        <H1>Les mois du printemps</H1>
        <UL>
            <LI>Avril</LI>
            <LI>Mai</LI>
            <LI>Juin</LI>
        </UL>
        <H1>Les mois d'automne</H1>
        <OL>
            <LI>Octobre</LI>
            <LI>Novembre</LI>
            <LI>D&eacute;cembre</LI>
        </OL>
    </BODY>
    </HTML>
    ```

!!! support "Dans le support de cours"

    Dans l'exemple de la page 63, des puces « • » apparaissent devant certaines lignes de code (`•<ul>`, `• </ol>`). Ce sont des restes de la mise en page des diapositives : **ne les recopiez pas**, elles s'afficheraient comme du texte.

## Erreurs fréquentes

!!! danger "À éviter"

    - écrire du texte directement dans `<UL>` ou `<OL>`, sans `<LI>` ;
    - oublier de fermer `</UL>`, `</OL>` ou `</LI>` ;
    - placer une sous-liste **après** `</LI>` au lieu de la mettre **dedans** ;
    - fermer `</UL>` alors que c'est un `<OL>` qui est ouvert.

## À retenir

!!! success "Points essentiels"

    - `<UL>` crée une liste à puces, `<OL>` une liste numérotée.
    - `<LI>` crée **un** élément de la liste.
    - `<UL>` et `<OL>` ne contiennent que des `<LI>`.
    - Une sous-liste se place **dans** un `<LI>`.

## Exercices

<div class="exo" data-exo="ch4-1" markdown>
Créez une **liste à puces** des activités du Club Informatique UAM, avec au moins **trois** activités.
</div>

<div class="exo" data-exo="ch4-2" markdown>
Créez une **liste numérotée** des étapes d'adhésion au club (au moins trois étapes), sous un titre `<H2>` « Comment adhérer ».
</div>

<div class="exo" data-exo="ch4-3" markdown>
Créez une liste à puces des sections du club : **Programmation**, **Réseaux**, **Infographie**. Dans l'élément « Programmation », imbriquez une **liste numérotée** avec deux langages.
</div>

## Vérifiez vos acquis

<div class="quiz" data-quiz="ch4"></div>

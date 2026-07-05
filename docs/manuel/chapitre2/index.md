# Les listes en HTML

## Introduction

Les **listes HTML** permettent d'organiser des informations sous une forme claire et structurée.

Elles sont très utilisées pour présenter :

- des menus de navigation ;
- des catégories ;
- des étapes d'une procédure ;
- des énumérations ;
- des menus de sites Web.

HTML propose principalement deux types de listes :

- les **listes non ordonnées** ;
- les **listes ordonnées**.

Il est également possible **d'imbriquer plusieurs listes** afin de créer une hiérarchie d'informations.

---

## Les listes non ordonnées

Une **liste non ordonnée** affiche les éléments précédés d'une **puce**.

Elle utilise les balises suivantes :

| Balise | Fonction |
|--------|----------|
| `<UL>` | Débute une liste non ordonnée |
| `<LI>` | Définit un élément de la liste |

!!! example "Exemple 2.1 — Liste non ordonnée"

    ```html
    <UL>
        <LI>Premier élément</LI>
        <LI>Deuxième élément</LI>
        <LI>Troisième élément</LI>
    </UL>
    ```

### Résultat

- Premier élément
- Deuxième élément
- Troisième élément

---

!!! example "Exemple 2.2 — Départements de l'université"

    ```html
    <H2>Départements de l'université</H2>

    <UL>
        <LI>Génie Informatique</LI>
        <LI>Sciences de l'Information et de la Communication</LI>
        <LI>Mathématiques</LI>
        <LI>Électronique</LI>
    </UL>
    ```

---

## Les listes ordonnées

Une **liste ordonnée** affiche automatiquement une **numérotation**.

Elle utilise les balises suivantes :

| Balise | Fonction |
|--------|----------|
| `<OL>` | Débute une liste numérotée |
| `<LI>` | Élément de la liste |

!!! example "Exemple 2.3 — Liste ordonnée"

    ```html
    <OL>
        <LI>Inscription</LI>
        <LI>Paiement</LI>
        <LI>Validation</LI>
    </OL>
    ```

### Résultat

1. Inscription
2. Paiement
3. Validation

---

!!! example "Exemple 2.4 — Étapes d'inscription"

    ```html
    <H2>Étapes d'inscription</H2>

    <OL>
        <LI>Remplir le formulaire</LI>
        <LI>Déposer les pièces justificatives</LI>
        <LI>Payer les frais</LI>
        <LI>Recevoir la carte d'étudiant</LI>
    </OL>
    ```

---

## La balise `<LI>`

Chaque élément d'une liste est **obligatoirement** défini par la balise :

```html
<LI>
```

Sans cette balise, le navigateur ne peut pas distinguer les différents éléments de la liste.

!!! example "Exemple"

    ```html
    <UL>
        <LI>HTML</LI>
        <LI>CSS</LI>
        <LI>JavaScript</LI>
    </UL>
    ```

---

## Les listes imbriquées

Une liste peut contenir **une autre liste**.

Cette technique permet de représenter une hiérarchie d'informations.

!!! example "Exemple 2.5 — Bibliothèque"

    ```html
    <H2>Bibliothèque</H2>

    <UL>

        <LI>Romans

            <UL>
                <LI>Français</LI>
                <LI>Étrangers</LI>
            </UL>

        </LI>

        <LI>Sciences

            <UL>
                <LI>Mathématiques</LI>
                <LI>Informatique</LI>
                <LI>Physique</LI>
            </UL>

        </LI>

    </UL>
    ```

!!! tip "Remarque"

    Le navigateur affiche automatiquement les sous-listes avec un léger décalage vers la droite.

---

## Mélanger plusieurs types de listes

Il est possible de placer une **liste ordonnée** à l'intérieur d'une **liste non ordonnée**.

!!! example "Exemple 2.6 — Programme de la journée"

    ```html
    <H2>Programme de la journée</H2>

    <UL>

        <LI>Cours

            <OL>
                <LI>HTML</LI>
                <LI>CSS</LI>
                <LI>JavaScript</LI>
            </OL>

        </LI>

        <LI>Travaux pratiques</LI>

    </UL>
    ```

---

## Exemple complet

!!! example "Catalogue de livres"

    ```html
    <HTML>

    <HEAD>
        <TITLE>Catalogue de livres</TITLE>
    </HEAD>

    <BODY BGCOLOR="white" TEXT="black">

        <H1 ALIGN="center">
            Bibliothèque Universitaire
        </H1>

        <H2>Catégories disponibles</H2>

        <UL>
            <LI>Littérature</LI>
            <LI>Informatique</LI>
            <LI>Mathématiques</LI>
            <LI>Sciences</LI>
        </UL>

        <H2>Les trois livres les plus empruntés</H2>

        <OL>
            <LI>Le Petit Prince</LI>
            <LI>Algorithmique</LI>
            <LI>Programmation Web</LI>
        </OL>

        <H2>Organisation</H2>

        <UL>

            <LI>Sciences

                <UL>
                    <LI>Mathématiques</LI>
                    <LI>Physique</LI>
                    <LI>Chimie</LI>
                </UL>

            </LI>

            <LI>Lettres

                <UL>
                    <LI>Français</LI>
                    <LI>Anglais</LI>
                </UL>

            </LI>

        </UL>

    </BODY>

    </HTML>
    ```

---

## Erreurs fréquentes

!!! danger "À éviter"

    - oublier de fermer une balise `<LI>` ;

    - placer directement du texte dans `<UL>` sans utiliser `<LI>` ;

    - oublier de fermer `<UL>` ou `<OL>` ;

    - mal imbriquer les listes ;

    - mélanger les balises `<UL>` et `<OL>` sans respecter leur ouverture et leur fermeture.

---

## À retenir

!!! success "Points essentiels"

    - `<UL>` crée une liste à puces.

    - `<OL>` crée une liste numérotée.

    - `<LI>` représente un élément de liste.

    - Une liste peut contenir une autre liste.

    - Les listes facilitent l'organisation et la lecture des informations.

---

## Exercices

!!! question "Exercice"

    Créer une page HTML intitulée **Club Informatique UAM** contenant :

    - un titre principal ;

    - une liste non ordonnée présentant les activités du club ;

    - une liste ordonnée décrivant les étapes d'adhésion ;

    - une liste imbriquée présentant les différentes sections du club :
        - Programmation ;
        - Réseaux ;
        - Intelligence Artificielle ;
        - Infographie.

    - une ligne horizontale séparant les différentes parties de la page.

---

### Objectif

Maîtriser l'utilisation des balises :

- `<UL>`
- `<OL>`
- `<LI>`

ainsi que **l'imbrication des listes**.

---

⬅️ **Précédent :** Les bases du HTML

➡️ **Suivant :** Les liens HTML
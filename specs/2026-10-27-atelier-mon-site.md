# Atelier « Mon site » — spécification

Date : 2026-10-27 · Statut : en relecture · Version visée du manuel : 2.2

## 1. Intention

Permettre à chaque étudiant de L1 de construire **son propre site Web complet**, guidé pas à pas, en n'utilisant **que ce qui a été vu en cours** (support de Dr Niang). À la fin, il possède un vrai dossier de site, téléchargeable, qui s'ouvre dans VS Code et dans un navigateur, et qui mobilise chaque notion du programme.

### Décisions prises avec l'auteur

| Sujet | Décision |
|---|---|
| Sujet du site | Libre, avec des modèles de départ |
| Emplacement | Un atelier unique (page dédiée) + un encadré de rappel à la fin de chaque chapitre |
| Progression | Toutes les étapes ouvertes ; l'ordre est conseillé, pas imposé |
| Pages | 3 pages de base imposées au départ, pages supplémentaires libres |
| Sauvegarde | Automatique dans le navigateur + export `.zip` + import `.zip` |
| Technique | Modules maison, aucune dépendance externe (approche A) |
| Disposition PC | Guide à gauche, travail à droite (disposition A) |

### Critères de réussite

1. Un étudiant qui suit les 7 étapes obtient un site de 3 pages ou plus, reliées, avec liste, image, tableau et feuille de style, qui passe toutes les vérifications.
2. Aucune consigne ni vérification n'exige une notion absente du support.
3. Le `.zip` téléchargé s'ouvre tel quel dans un navigateur (accents corrects, images affichées, liens fonctionnels).
4. Un `.zip` recompressé par l'Explorateur Windows se réimporte sans perte.
5. Le comportement existant des chapitres (exemples, exercices, quiz, « Mes images ») est inchangé.

### Hors périmètre

- Mise en ligne du site de l'étudiant (hébergement).
- Comptes, synchronisation entre appareils autrement que par le `.zip`.
- Correction du contenu rédactionnel (orthographe, qualité du texte).
- Étape sur les formulaires (chapitre bonus hors programme).

## 2. Architecture

### Découpage des fichiers (`docs/javascripts/`, `docs/stylesheets/`)

| Fichier | Rôle | Dépend de |
|---|---|---|
| `noyau.js` (nouveau, extrait de `manuel.js`) | Outils, icônes, stockage local, coloration, éditeur, aperçu (faux navigateur), dossier virtuel. Expose `window.MH`. | — |
| `manuel.js` (allégé) | Spécifique aux pages de cours : exemples, exercices, quiz, démo d'accueil, progression, sélecteur de style | `noyau.js`, `exercices.js` |
| `zip.js` (nouveau) | `MH.zip.creer(fichiers) → Blob`, `MH.zip.lire(blob) → [{chemin, octets}]` | — |
| `projet.js` (nouveau) | Données : modèles de sujet, 7 étapes (consigne, chapitre, extrait d'exemple, vérifications) | — |
| `atelier.js` (nouveau) | Interface de l'atelier, gestion du projet, import/export | `noyau.js`, `zip.js`, `projet.js` |
| `atelier.css` (nouveau) | Style de l'atelier, uniquement via les jetons existants (`--mh-*`, `--md-*`) | `manuel.css` |

Ordre de chargement dans `mkdocs.yml` : `noyau.js`, `exercices.js`, `zip.js`, `projet.js`, `manuel.js`, `atelier.js`. Chaque fichier garde le suffixe de version `?v=…`.

### Interface publique `window.MH` (noyau)

- `MH.el`, `MH.esc`, `MH.store`, `MH.debounce`, `MH.ICON`, `MH.highlight(src)`
- `MH.makeEditor(initial, onChange, label) → { node, textarea, value, refresh }`
- `MH.makePreview(opts) → { node, actions, render(src), refresh() }`, avec option `opts.site` : en mode site, un clic sur un lien relatif vers une page du dossier charge cette page dans l'aperçu (historique interne, bouton retour, barre d'adresse). Sans cette option, comportement actuel (message « Ce lien ouvrirait… »).
- `MH.Dossier` : `ready`, `list({type})`, `lire(chemin) → texte`, `ecrire(chemin, texte)`, `add(file, chemin)`, `remove`, `rename`, `resolve(src, depuis)`, `on/off`, `vider()`, `persistant`.
- `MH.T` : outils de vérification existants (`n`, `txt`, `attr`, `ferme`).

### Dossier virtuel étendu

- Même base IndexedDB `manuel-html`, magasin `fichiers`, clé `path`. Les pages sont stockées comme `Blob` de type `text/html` (ou `text/css`). Ajout d'un cache texte en mémoire pour l'éditeur.
- `resolve(src, depuis)` : résolution relative au fichier courant (`depuis`, par défaut la racine). Gère `./`, `../`, sous-dossiers, casse (suggestion), chemin disque, sortie du dossier.
- « Mes images » (chapitres) filtre sur `image/*` : les pages du projet n'y apparaissent pas.
- Méta du projet dans le stockage local, clé `mh:projet` : `{ nom, modele, pages: [3 chemins de base], etapes: {1: true…}, etapeConseillee, ouverts: [onglets] }`.

## 3. Interface de l'atelier

Page `docs/manuel/projet/index.md`, entrée de menu « Projet : mon site » entre le chapitre 8 et le bonus. Front matter `hide: [navigation, toc]`. Contenu : `<div class="atelier"></div>` + texte de secours si JavaScript est désactivé.

### Premier passage

Écran de choix : nom du site + modèle.

| Modèle | Pages de base |
|---|---|
| Mon site perso | `index.html`, `parcours.html`, `contact.html` |
| Mon club / association | `index.html`, `activites.html`, `contact.html` |
| Un événement | `index.html`, `programme.html`, `contact.html` |
| Sujet libre | `index.html`, `page2.html`, `contact.html` |

Chaque page de départ contient le squelette minimal avec `<META CHARSET="utf-8">` et un `<TITLE>` vide à compléter (l'étape 1 reste donc à faire).

### Disposition PC (≥ 60em)

- **Barre du haut** : nom du site · « Enregistré » · Importer un .zip · Télécharger mon site · menu ⋯ (Recommencer le projet).
- **Colonne gauche (≈ 34 %) — le guide** : frise des 7 étapes (réussie / conseillée / à faire, cliquable) · titre et consigne · lien « Revoir le chapitre N » · liste de vérification en direct · « Voir un exemple » (extrait en lecture seule) · « Étape suivante » quand tout est coché.
- **Colonne droite — le travail** : onglets des fichiers ouverts + bouton « ⋯ Fichiers » (arborescence complète : créer, renommer, supprimer une page ; ajouter des images dans `images/`) · éditeur (`MH.makeEditor`) · aperçu en mode site (`MH.makePreview({site:true})`), barre d'adresse et retour.

### Téléphone (< 60em)

Barre d'onglets fixe en bas : **Consigne · Code · Rendu**. Liste des fichiers dans le menu ⋯.

### Accessibilité

Navigation complète au clavier ; frise = liste de boutons avec `aria-current="step"` ; onglets avec `role="tablist"` ; liste de vérification `aria-live="polite"` ; toutes les icônes ont un libellé.

## 4. Les 7 étapes

Les vérifications reçoivent `(site, T)` où `site.pages` = `{ chemin: { doc, src } }` pour chaque `.html`, `site.fichiers` = liste de chemins, et `site.base` = les 3 pages de base. Elles portent sur la structure, jamais sur le texte.

| # | Chapitre | Vérifications |
|---|---|---|
| 1 | 2 — Structure | Chaque page de base : `<!DOCTYPE html>` en tête, `<HTML>`, `<HEAD>`, `<BODY>` · un `<TITLE>` non vide par page, tous différents · accueil : `<META CHARSET>` et `<META NAME="Author" CONTENT="…">` · accueil : `BGCOLOR` et `TEXT` sur `<BODY>` |
| 2 | 3 — Texte | Un `<H1>` sur chaque page de base · accueil : ≥ 2 `<P>` fermés · un `<HR>` · une mise en valeur (`B`, `I`, `U`, `EM`, `STRONG`) · `&copy;` présent dans le code d'au moins une page |
| 3 | 4 — Listes | Sur une page de base : `<UL>` ≥ 3 `<LI>` · `<OL>` ≥ 3 `<LI>` · une liste imbriquée dans un `<LI>` |
| 4 | 5 — Liens | Chaque page de base contient des liens vers les deux autres · aucun lien relatif vers un fichier absent · `mailto:` sur la page contact · un lien `http(s)://` avec `TARGET="_blank"` · au moins un lien `#ancre` dont la cible existe |
| 5 | 6 — Images | ≥ 1 `<IMG>` dont la source existe dans le dossier, sous `images/` · `ALT` présent sur toutes les `<IMG>` · `WIDTH` ou `HEIGHT` sur au moins une · une `<IMG>` dans un `<A HREF>` |
| 6 | 7 — Tableaux | Un `<TABLE BORDER>` (> 0) · un `<CAPTION>` · une ligne de `<TH>` · un `COLSPAN` ou `ROWSPAN` > 1 · grille cohérente : même largeur sur toutes les lignes, fusions comprises |
| 7 | 8 — Styles | Styles dans `<HEAD>` (`<STYLE>`) ou `style.css` présent et relié par `<LINK REL="stylesheet">` · une règle de type `balise { … }` · une classe `x.nom` ou `.nom` définie et `CLASS="nom"` utilisé · chaque page de base reçoit des styles |

Chaque étape fournit : titre, chapitre lié, consigne (2-4 phrases, tutoiement, renvoie au sujet de l'étudiant), extrait d'exemple écrit pour « Club Info UAM ». Une étape est « réussie » quand toutes ses vérifications passent ; elle reste réussie si l'étudiant modifie ensuite son site (l'état affiché suit cependant la vérification en direct).

Calcul de la grille (étape 6) : parcours ligne par ligne avec une table d'occupation qui reporte les `ROWSPAN` sur les lignes suivantes ; largeur d'une ligne = colonnes occupées + `COLSPAN` des cellules. Toutes les largeurs doivent être égales.

## 5. Sauvegarde, export, import

- **Auto-sauvegarde** : 500 ms après la dernière frappe ; indicateur « Enregistré » / « Enregistrement… ».
- **Export** : `<nom-du-site-en-minuscules-sans-accents>.zip`, méthode « stockée » (sans compression), CRC-32 calculé, noms en UTF-8 (drapeau bit 11). Arborescence conservée.
- **Import** : lecture du répertoire central ; méthodes 0 (stockée) et 8 (deflate, via `DecompressionStream("deflate-raw")`). Retrait d'un dossier racine commun. Extensions acceptées : `.html`, `.htm`, `.css`, `.gif`, `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`. Le reste est ignoré et listé. Limites : 20 Mo, 200 fichiers. Confirmation avant remplacement, avec proposition de télécharger le projet actuel. Si le zip ne contient pas de méta, les 3 pages de base sont déduites ainsi : `index.html` (ou la première page), puis une page dont le nom contient « contact » comme 3e page, puis la première autre page par ordre alphabétique comme 2e. L'étudiant peut les changer dans le menu ⋯. Partout dans la spécification, « la page contact » désigne la 3e page de base.

## 6. Erreurs et cas limites

| Situation | Comportement |
|---|---|
| IndexedDB indisponible (navigation privée) | Bandeau permanent : le travail sera perdu à la fermeture, télécharger régulièrement |
| Stockage plein | Message, proposition de télécharger le `.zip` ; rien n'est effacé |
| Zip invalide / méthode inconnue | « Ce fichier n'est pas un .zip valide » ; projet intact |
| Suppression d'une page | Confirmation listant les liens qui deviendront cassés |
| Renommage vers un nom existant ou vide | Refus avec message, ancien nom conservé |
| Nouveau fichier | Nom validé (`.html` ou `.css`, sans espace ni accent conseillé, avertissement sinon) |
| Lien vers page absente dans le rendu | Message « Cette page n'existe pas dans ton dossier » + suggestion si casse proche |
| JavaScript désactivé | Texte de la page expliquant que l'atelier en a besoin |

## 7. Intégration au manuel

- **Fin des chapitres 2 à 8** : encadré « Étape N de ton site » avant le quiz (phrase, état À faire / Réussie, bouton « Ouvrir l'atelier » vers `../projet/#etape-N`). Chapitre 1 : une phrase de présentation du projet.
- **Accueil** : ligne « Projet : mon site » dans la liste des chapitres avec « n / 7 étapes » ; « Reprendre » peut pointer vers l'atelier.
- **Présentation** : ligne dans le tableau d'organisation. **À propos** : « Vos données » et version 2.2.
- **Styles** : l'atelier n'utilise que les jetons ; ajustements propres à chaque style limités à la frise et à la barre du haut dans `styles.css`.

## 8. Tests

Dossier `tests/` à la racine (non publié).

- `tests/unitaires.mjs` (Node) : aller-retour zip (contenu et CRC identiques) ; lecture d'un zip deflate fourni en fixture (`tests/fixtures/windows.zip`) ; `resolve` (racine, sous-dossier, `../`, sortie, casse, disque) ; grille de tableau (simple, `COLSPAN`, `ROWSPAN`, incohérente).
- `tests/navigateur/` (exécutés dans le navigateur intégré sur le serveur local) : site complet → 7 étapes réussies ; site fautif → échecs attendus listés ; non-régression : 19 exercices validés par leur solution, alignement des encadrés, lisibilité des boutons (4 états × 4 styles × 2 modes), absence de débordement à 375 px.
- Vérification visuelle finale : atelier sur PC (1280) et téléphone (375), 4 styles, clair et sombre.

## 9. Livraison

1. **Découpage** : extraction de `noyau.js`, aucun changement visible ; non-régression verte. Commit.
2. **Fondations** : dossier étendu, aperçu en mode site, `zip.js`, tests unitaires. Commit.
3. **Atelier** : page, interface, modèles, étapes, import/export, tests navigateur. Commit.
4. **Intégration** : encadrés de chapitre, accueil, présentation, à-propos, styles ; vérification visuelle ; version 2.2 ; publication ; checklist de test pour l'auteur.

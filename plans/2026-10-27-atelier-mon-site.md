# Atelier « Mon site » — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter au Manuel HTML un atelier où chaque étudiant construit son site multi-pages en 7 étapes vérifiées automatiquement, avec export et import `.zip`.

**Architecture:** Le JavaScript actuel (`manuel.js`, un seul bloc) est découpé : un noyau partagé (`window.MH`), des fonctions pures testables sous Node (`outils.js`, `zip.js`), les données du projet (`projet.js`) et l'interface (`atelier.js`). Le dossier virtuel IndexedDB qui sert à « Mes images » devient le dossier du site. Les tests navigateur vivent dans `docs/_tests/` (servis par `mkdocs serve`, exclus de la publication via `draft_docs`).

**Tech Stack:** MkDocs 1.6 + Material, JavaScript sans dépendance (navigateur et Node 24 : `Blob`, `DecompressionStream`, `TextEncoder`), IndexedDB, `node:test`.

**Spec:** `specs/2026-10-27-atelier-mon-site.md`

## Global Constraints

- Aucune dépendance externe (pas de CDN, pas de npm) : approche A de la spécification.
- Aucune consigne ni vérification n'exige une notion absente du support de cours.
- Les exemples de code écrivent les balises en MAJUSCULES, comme le reste du manuel.
- Texte de l'interface en français ; consignes de l'atelier au tutoiement (choix de la spécification) ; le reste du manuel garde le vouvoiement.
- Styles : uniquement les jetons `--mh-*` / `--md-*` ; ajouts par style limités à la frise et à la barre du haut dans `styles.css`.
- Tous les scripts et feuilles portent le suffixe `?v=…` dans `mkdocs.yml` ; le passer à `2.2.0` à la publication.
- Le comportement actuel des chapitres (exemples, exercices, quiz, « Mes images ») ne change pas.
- Limites : image 5 Mo (existant) ; import 20 Mo et 200 fichiers.
- Chaque commit se termine par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Publication une seule fois, à la fin (tâche 12), après la vérification complète.

## Review Focus

1. **Photo de téléphone trop lourde (6 Mo et plus)** : refus net avec message, rien d'autre ne casse → test dans la tâche 5.
2. **Noms avec accents ou espaces** (`images/été 1.jpg`, écrit brut ou en `%20`) : l'image s'affiche, et le `.zip` garde le nom exact → tests dans les tâches 3 et 4.
3. **Frappe non sauvegardée au moment de quitter** (navigation instantanée ou fermeture de l'onglet moins de 500 ms après la dernière touche) : rien n'est perdu → test dans la tâche 8.
4. **Atelier ouvert dans deux onglets** : pas de corruption ; l'onglet en retard prévient et propose de recharger → test dans la tâche 8.
5. **Renommage d'une page de base** (`index.html` → `accueil.html`) : les vérifications suivent la page renommée au lieu de l'oublier → test dans la tâche 9.

## Fichiers

| Fichier | Statut | Responsabilité |
|---|---|---|
| `docs/javascripts/outils.js` | créer | Fonctions pures : `resoudreChemin`, `largeursGrille`, `slugSite` |
| `docs/javascripts/zip.js` | créer | `MH.zip.creer`, `MH.zip.lire` |
| `docs/javascripts/noyau.js` | créer (extrait) | `window.MH` : outils DOM, icônes, `store`, coloration, éditeur, aperçu, `Dossier` |
| `docs/javascripts/manuel.js` | modifier | Ne garde que les fonctions propres aux pages de cours |
| `docs/javascripts/projet.js` | créer | Modèles, 7 étapes, `MH.projet.analyser` |
| `docs/javascripts/atelier.js` | créer | Interface de l'atelier |
| `docs/stylesheets/atelier.css` | créer | Style de l'atelier |
| `docs/stylesheets/styles.css` | modifier | Touches par style (frise, barre) |
| `docs/manuel/projet/index.md` | créer | Page de l'atelier |
| `docs/_tests/index.html`, `docs/_tests/*.js` | créer | Lanceur et tests navigateur |
| `tests/unitaires.test.mjs`, `tests/fixtures/` | créer | Tests Node |
| `mkdocs.yml` | modifier | Ordre des scripts, `draft_docs`, menu |
| Chapitres 1 à 8, `index.md`, `manuel/index.md`, `about.md` | modifier | Intégration |

Ordre de chargement final (`extra_javascript`) : `outils.js`, `zip.js`, `noyau.js`, `exercices.js`, `projet.js`, `manuel.js`, `atelier.js`. Chaque fichier ouvre `const MH = (globalThis.MH = globalThis.MH || {});` et n'ajoute que ses propres clés.

---

## Phase 1 — Découpage sans changement visible

### Task 1: Lanceur de tests et filet de non-régression

**Files:**
- Modify: `mkdocs.yml` (ajouter `draft_docs: |\n  _tests/`)
- Create: `docs/_tests/index.html`, `docs/_tests/lanceur.js`, `docs/_tests/regression.js`
- Create: `tests/unitaires.test.mjs` (un seul test « le lanceur Node tourne » pour l'instant)

**Interfaces:**
- Produces: `docs/_tests/index.html` charge les fichiers listés dans `?fichiers=a.js,b.js` (par défaut tous), exécute les tests déclarés par `test(nom, async fn)` et `attendre(condition, message)`, écrit dans `<pre id="resultats">` une ligne `OK nom` ou `ÉCHEC nom : message`, et pose `window.__resultats = { ok: n, echecs: [...] }`. Les tests chargent les pages du manuel dans un `<iframe>` de même origine via `charger(chemin, { largeur }) → { win, doc }`.

- [ ] **Step 1: Écrire `regression.js`**, avec 4 tests qui reprennent les contrôles faits à la main pendant la session :
  - `exercices : chaque solution valide ses vérifications` : pour chaque entrée de `MH_EXERCICES`, toutes les `checks` passent sur `solution`.
  - `encadrés : icônes et textes alignés` : sur `manuel/chapitre5/`, pour chaque style (`classique`, `sousverre`, `carrapide`, `notice`), les icônes de titre sont à la même abscisse ; titre, légende, code et points du navigateur aussi (écart ≤ 1 px).
  - `boutons : contraste ≥ 4.5 dans tous les états` : accueil, chapitres 3, 6 et 7 ; états normal, focus, survol, focus + survol (règles `:hover` / `:focus` dupliquées en classes `.fh` / `.ff`) ; 4 styles × 2 modes.
  - `mobile : aucun débordement à 375 px` : les 15 pages actuelles, 4 styles × 2 modes, `scrollWidth ≤ 375`.
- [ ] **Step 2: Lancer sur le code actuel.** Ouvrir `http://127.0.0.1:8137/manuel-html/_tests/` dans le navigateur intégré. Attendu : `window.__resultats.echecs` vide. C'est la référence avant découpage.
- [ ] **Step 3: Vérifier l'exclusion de la publication.** Run : `python -m mkdocs build --strict -d <dossier temporaire>`, puis vérifier que `<dossier>/_tests/` n'existe pas.
- [ ] **Step 4: Lancer Node.** Run : `node --test tests/` → `pass 1`.
- [ ] **Step 5: Commit** — `Tests : lanceur navigateur et filet de non-régression`.

### Task 2: Extraire `noyau.js` de `manuel.js`

**Files:**
- Create: `docs/javascripts/noyau.js`
- Modify: `docs/javascripts/manuel.js`, `mkdocs.yml`

**Interfaces:**
- Produces: `MH.el`, `MH.esc`, `MH.store`, `MH.debounce`, `MH.ICON`, `MH.highlight(src)`, `MH.makeEditor(initial, onChange, label)`, `MH.makePreview(opts)`, `MH.Dossier`, `MH.placeholderImage(img)`, `MH.T` (outils de vérification `n`, `txt`, `attr`, `ferme`). Signatures et comportement exactement ceux du code actuel.

- [ ] **Step 1: Déplacer** les blocs « Petits outils », « Coloration », « Éditeur », « Dossier virtuel », « Aperçu » et l'objet `T` dans `noyau.js`, sans les modifier. `manuel.js` les lit depuis `MH`.
- [ ] **Step 2: Mettre à jour** `extra_javascript` : `noyau.js` avant `exercices.js` et `manuel.js`.
- [ ] **Step 3: Relancer** `_tests/`. Attendu : 0 échec.
- [ ] **Step 4: Commit** — `Découpe manuel.js : noyau partagé dans noyau.js`.

## Phase 2 — Fondations

### Task 3: Fonctions pures `outils.js`

**Files:**
- Create: `docs/javascripts/outils.js`
- Modify: `docs/javascripts/noyau.js` (`Dossier.resolve` délègue à `MH.outils.resoudreChemin`)
- Test: `tests/unitaires.test.mjs` (`import "../docs/javascripts/outils.js"`, puis `globalThis.MH.outils`)

**Interfaces:**
- Produces:
  - `MH.outils.resoudreChemin(src: string, depuis: string, chemins: string[]) → { fichier?: string, casse?: string, proche?: string, absent?: true, dehors?: true, disque?: true, externe?: true, vide?: true, chemin?: string }`. `depuis` est le chemin du fichier qui contient le lien (`""` = racine). Renvoie le chemin trouvé dans `fichier`.
  - `MH.outils.largeursGrille(lignes: Array<Array<{colspan: number, rowspan: number}>>) → number[]` : largeur occupée de chaque ligne, avec les `ROWSPAN` reportés sur les lignes suivantes.
  - `MH.outils.slugSite(nom: string) → string` : minuscules, sans accents, tirets, `[a-z0-9-]` ; `"mon-site"` si vide.

- [ ] **Step 1: Écrire les tests**
  ```js
  const { resoudreChemin: r, largeursGrille: g, slugSite: s } = MH.outils;
  const F = ["index.html", "images/moi.jpg", "images/été 1.jpg", "cours/html.html"];
  assert.equal(r("images/moi.jpg", "", F).fichier, "images/moi.jpg");
  assert.equal(r("../index.html", "cours/html.html", F).fichier, "index.html");
  assert.equal(r("moi.jpg", "", F).proche, "images/moi.jpg");
  assert.equal(r("images/Moi.jpg", "", F).casse, "images/moi.jpg");
  assert.ok(r("../x.jpg", "", F).dehors);
  assert.ok(r("D:\\cours\\a.jpg", "", F).disque);
  assert.ok(r("file:///D:/cours/a.jpg", "", F).disque);
  assert.ok(r("http://a.fr/b.jpg", "", F).externe);
  assert.equal(r("images/%C3%A9t%C3%A9%201.jpg", "", F).fichier, "images/été 1.jpg");
  assert.equal(r("images/été 1.jpg", "", F).fichier, "images/été 1.jpg");
  assert.deepEqual(g([[{colspan:1,rowspan:1},{colspan:2,rowspan:1}],[{colspan:1,rowspan:1},{colspan:1,rowspan:1},{colspan:1,rowspan:1}]]), [3, 3]);
  assert.deepEqual(g([[{colspan:1,rowspan:3},{colspan:1,rowspan:1}],[{colspan:1,rowspan:1}],[{colspan:1,rowspan:1}]]), [2, 2, 2]);
  assert.deepEqual(g([[{colspan:1,rowspan:1}],[{colspan:1,rowspan:1},{colspan:1,rowspan:1}]]), [1, 2]);
  assert.equal(s("Club Info UAM"), "club-info-uam");
  assert.equal(s("Événement d'été !"), "evenement-d-ete");
  assert.equal(s("  "), "mon-site");
  ```
- [ ] **Step 2: Lancer** `node --test tests/` → échec (`MH.outils` indéfini).
- [ ] **Step 3: Implémenter** `outils.js` (script classique, pas de module, attaché à `globalThis.MH`). Pour `largeursGrille` : un tableau `reste[col]` compte les lignes encore occupées par un `ROWSPAN`. Avant chaque ligne, les colonnes où `reste > 0` comptent dans la largeur et sont sautées au placement.
- [ ] **Step 4: Faire déléguer** `Dossier.resolve(src, depuis = "")` à `resoudreChemin`, en renvoyant toujours `{ fichier: enregistrement, path }` pour ne pas casser les appelants actuels.
- [ ] **Step 5: Lancer** `node --test tests/` → tout passe ; `_tests/` → 0 échec.
- [ ] **Step 6: Commit** — `outils.js : résolution de chemins, grille de tableau, slug (testés)`.

### Task 4: `zip.js`

**Files:**
- Create: `docs/javascripts/zip.js`, `tests/fixtures/windows.zip`
- Test: `tests/unitaires.test.mjs`

**Interfaces:**
- Produces:
  - `MH.zip.creer(fichiers: Array<{chemin: string, octets: Uint8Array}>) → Blob` (type `application/zip`, méthode 0, CRC-32, drapeau UTF-8 bit 11).
  - `MH.zip.lire(blob: Blob) → Promise<Array<{chemin: string, octets: Uint8Array}>>` : méthodes 0 et 8 (`DecompressionStream("deflate-raw")`) ; ignore les entrées dossier (`/` final) ; lève `Error("zip-invalide")` si la signature de fin de répertoire central manque, `Error("zip-methode")` pour une autre méthode.

- [ ] **Step 1: Créer la fixture.** Avec PowerShell : un dossier `mon-site/` contenant `index.html` (avec un `é`) et `images/logo.gif` (quelques octets), compressé par `Compress-Archive` en `tests/fixtures/windows.zip` (méthode deflate).
- [ ] **Step 2: Écrire les tests**
  - `zip : aller-retour` : `creer` puis `lire` de `[{chemin:"index.html", octets: TextEncoder("<P>été</P>")}, {chemin:"images/été 1.jpg", octets: Uint8Array.of(1,2,3)}]` → mêmes chemins, mêmes octets.
  - `zip : CRC connu` : le CRC-32 de `"123456789"` écrit dans l'en-tête vaut `0xCBF43926`.
  - `zip : lit un zip Windows` : `lire(windows.zip)` contient `mon-site/index.html`, dont le texte inclut `é`, et `mon-site/images/logo.gif`.
  - `zip : refuse un faux zip` : `lire(new Blob(["bonjour"]))` est rejeté avec `zip-invalide`.
- [ ] **Step 3: Lancer** → échecs attendus.
- [ ] **Step 4: Implémenter** `zip.js`.
- [ ] **Step 5: Lancer** `node --test tests/` → tout passe.
- [ ] **Step 6: Commit** — `zip.js : création et lecture de .zip sans dépendance`.

### Task 5: Dossier étendu aux pages

**Files:**
- Modify: `docs/javascripts/noyau.js` (`Dossier`, et le panneau « Mes images », qui filtre sur les images)
- Test: `docs/_tests/dossier.js`

**Interfaces:**
- Produces (ajouts à `MH.Dossier`) :
  - `ecrire(chemin: string, texte: string) → Promise<void>` (Blob `text/html` ou `text/css` selon l'extension ; notifie les abonnés).
  - `lire(chemin) → string | null` (cache texte en mémoire, rempli au chargement).
  - `list({ type: "image" | "texte" | "tout" } = { type: "tout" }) → Array<{ path, blob, url?, w?, h? }>`.
  - `chemins() → string[]`, `vider() → Promise<void>`, `estImage(chemin) → boolean`.
  - `add(file, chemin)` inchangé (images seulement, 5 Mo).

- [ ] **Step 1: Écrire les tests** (chacun commence par `await MH.Dossier.vider()`)
  - `dossier : écrire puis relire une page` (le texte survit au rechargement de l'iframe).
  - `dossier : Mes images n'affiche pas les pages` : après `ecrire("index.html", …)` et l'ajout d'une image, le panneau d'un aperçu du chapitre 6 liste 1 fichier.
  - `dossier : photo de 6 Mo refusée` : `add(File de 6 Mo, type image/jpeg)` renvoie le message « trop lourde » et `list()` reste vide.
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter.**
- [ ] **Step 4: Lancer** `_tests/` → 0 échec (dossier et régression).
- [ ] **Step 5: Commit** — `Dossier virtuel : pages HTML et CSS en plus des images`.

### Task 6: Aperçu en mode site

**Files:**
- Modify: `docs/javascripts/noyau.js` (`makePreview`)
- Test: `docs/_tests/apercu-site.js`

**Interfaces:**
- Consumes: `MH.Dossier.lire`, `MH.outils.resoudreChemin`.
- Produces: `MH.makePreview({ site: true, page: "index.html", onNavigate(chemin) })`, et la méthode `ouvrir(chemin)`, qui charge la page depuis le dossier. La barre affiche le chemin courant et un bouton « Retour » (historique interne). En mode site, les `SRC` et `HREF` se résolvent depuis la page courante, et un `<LINK REL="stylesheet" HREF="style.css">` vers un fichier du dossier est remplacé par son contenu dans un `<STYLE>`. Sans `site`, le comportement ne change pas.

- [ ] **Step 1: Écrire les tests**
  - `aperçu site : clic sur un lien ouvre l'autre page` (`index.html` → `contact.html` ; la barre affiche `contact.html` ; « Retour » revient).
  - `aperçu site : page absente` : un lien vers `galerie.html` absent → message « Cette page n'existe pas dans ton dossier » ; vers `Contact.html` → suggestion de casse.
  - `aperçu site : image relative depuis un sous-dossier` : `cours/html.html` avec `SRC="../images/moi.jpg"` affiche l'image.
  - `aperçu site : style.css relié` : la couleur définie dans `style.css` s'applique au rendu.
  - `aperçu cours : inchangé` : un lien dans un exemple du chapitre 5 affiche toujours « Ce lien ouvrirait… ».
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter.**
- [ ] **Step 4: Lancer** `_tests/` → 0 échec.
- [ ] **Step 5: Commit** — `Aperçu : mode site multi-pages`.

## Phase 3 — L'atelier

### Task 7: Données du projet et vérifications des étapes

**Files:**
- Create: `docs/javascripts/projet.js`
- Create: `docs/_tests/sites.js` (deux sites d'exemple sous forme d'objets JS)
- Test: `docs/_tests/etapes.js`

**Interfaces:**
- Consumes: `MH.T`, `MH.outils.largeursGrille`, `MH.outils.resoudreChemin`.
- Produces:
  - `MH.projet.MODELES` : `[{ id: "perso"|"club"|"evenement"|"libre", nom, pages: [3 chemins], squelette(nomSite, titrePage) → string }]`, avec les pages de la section 3 de la spécification.
  - `MH.projet.ETAPES` : 7 objets `{ n, titre, chapitre: "../chapitreN/", consigne, exemple, checks: [{ label, ok(site, T) → boolean }] }`, contenu exact de la section 4 de la spécification.
  - `MH.projet.analyser(textes: Record<string,string>, chemins: string[], base: [string,string,string]) → site`, avec `site.pages[chemin] = { doc, src }`, `site.fichiers`, `site.base`, `site.contact = base[2]`.
  - `MH.projet.evaluer(site) → Array<{ n, resultats: boolean[], reussie: boolean }>`.

- [ ] **Step 1: Écrire `sites.js`.**
  - `SITE_COMPLET` : 3 pages, `images/logo.gif` et un tableau avec `ROWSPAN`. Il coche toutes les vérifications.
  - `SITE_FAUTIF`, avec exactement ces défauts : `<TITLE>` identiques sur 2 pages, lien vers `galerie.html` absent, une `<IMG>` sans `ALT`, une ligne de tableau avec une cellule de trop, une classe définie mais jamais utilisée.
- [ ] **Step 2: Écrire les tests**
  - `étapes : site complet → 7 / 7`.
  - `étapes : site fautif → échecs attendus` : échouent exactement « titres différents » (1), « aucun lien cassé » (4), « ALT partout » (5), « grille cohérente » (6), « classe définie et utilisée » (7). Toutes les autres vérifications passent.
  - `étapes : aucune notion hors cours` : les balises citées dans `consigne` et `exemple` font toutes partie des balises de l'annexe B.
- [ ] **Step 3: Lancer** → échecs.
- [ ] **Step 4: Implémenter** `projet.js` : consignes de 2 à 4 phrases, au tutoiement ; extraits d'exemple écrits pour « Club Info UAM ».
- [ ] **Step 5: Lancer** `_tests/` → 0 échec.
- [ ] **Step 6: Commit** — `projet.js : modèles, 7 étapes et vérifications`.

### Task 8: Interface de l'atelier (PC)

**Files:**
- Create: `docs/manuel/projet/index.md` (front matter `hide: [navigation, toc]`, `<div class="atelier"></div>`, texte de secours sans JavaScript)
- Create: `docs/javascripts/atelier.js`, `docs/stylesheets/atelier.css`
- Modify: `mkdocs.yml` (menu « Projet : mon site » entre le chapitre 8 et le bonus ; scripts et feuille)
- Test: `docs/_tests/atelier.js`

**Interfaces:**
- Consumes: `MH.makeEditor`, `MH.makePreview({site:true})`, `MH.Dossier`, `MH.projet.*`, `MH.store`.
- Produces: la méta `mh:projet` = `{ nom, modele, base: [3], etapesReussies: number[], ouverts: string[], actif: string, version: 1 }` ; l'ancre `#etape-N`, qui sélectionne l'étape N ; `MH.atelier.etat() → { nom, reussies: number }` pour l'accueil et les chapitres.

- [ ] **Step 1: Écrire les tests**
  - `atelier : premier passage` : choisir « Mon club » et le nom « Club Info UAM » → `index.html`, `activites.html` et `contact.html` existent, les onglets sont ouverts, l'étape 1 est conseillée.
  - `atelier : vérification en direct` : écrire un `<TITLE>` dans chaque page → la case correspondante de l'étape 1 se coche en moins d'une seconde.
  - `atelier : sauvegarde au départ` : taper puis, avant 500 ms, déclencher `pagehide` → après rechargement, le texte est présent.
  - `atelier : deux onglets` : un événement `storage` sur `mh:projet` venant d'un autre onglet affiche le bandeau « L'atelier a été modifié dans un autre onglet », avec un bouton « Recharger ».
  - `atelier : #etape-5` ouvre l'étape 5.
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter** la disposition A (section 3 de la spécification) : auto-sauvegarde à 500 ms, sauvegarde immédiate sur `pagehide` et à chaque navigation instantanée (`document$`), indicateur « Enregistré ».
- [ ] **Step 4: Lancer** `_tests/` → 0 échec.
- [ ] **Step 5: Commit** — `Atelier : page, modèles, guide et espace de travail`.

### Task 9: Fichiers, import et export

**Files:**
- Modify: `docs/javascripts/atelier.js`, `docs/stylesheets/atelier.css`
- Create: `docs/_tests/fixtures/windows.zip` (copie de `tests/fixtures/windows.zip`, servie au test navigateur)
- Test: `docs/_tests/atelier-fichiers.js`

**Interfaces:**
- Consumes: `MH.zip.creer`, `MH.zip.lire`, `MH.outils.slugSite`, `MH.Dossier`.
- Produces: le menu « ⋯ Fichiers » (créer, renommer, supprimer, ajouter des images dans `images/`, choisir les pages de base) ; les boutons « Télécharger mon site » et « Importer un .zip ».

- [ ] **Step 1: Écrire les tests**
  - `fichiers : renommer une page de base` : `index.html` → `accueil.html` met à jour `base[0]`, et les vérifications portent sur `accueil.html`.
  - `fichiers : supprimer une page liée` : la confirmation liste les pages qui pointent vers elle.
  - `fichiers : nom refusé` : renommer en un nom existant ou vide → message, l'ancien nom est gardé.
  - `fichiers : nouveau fichier` : `ma page.html` est créé avec l'avertissement « évite les espaces et les accents » ; `notes.txt` est refusé (seuls `.html` et `.css` sont acceptés).
  - `export : nom et contenu` : le site « Club Info UAM » donne `club-info-uam.zip`, qui, relu par `MH.zip.lire`, contient les mêmes chemins et textes.
  - `import : zip Windows` : `windows.zip` → le dossier racine `mon-site/` est retiré, `index.html` devient `base[0]`.
  - `import : faux zip` → message « Ce fichier n'est pas un .zip valide », le projet est intact.
  - `import : fichiers ignorés` : un `.docx` présent dans le zip est listé comme ignoré.
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter** : déduction des pages de base à l'import (section 5 de la spécification), confirmation proposant de télécharger le projet actuel, limites 20 Mo / 200 fichiers, bandeau de navigation privée si `!MH.Dossier.persistant`.
- [ ] **Step 4: Lancer** `_tests/` → 0 échec.
- [ ] **Step 5: Commit** — `Atelier : gestion des fichiers, export et import .zip`.

### Task 10: Téléphone et accessibilité

**Files:**
- Modify: `docs/javascripts/atelier.js`, `docs/stylesheets/atelier.css`
- Test: `docs/_tests/atelier-mobile.js`

- [ ] **Step 1: Écrire les tests** (iframe de 375 px)
  - `mobile : onglets Consigne · Code · Rendu` : `role="tablist"`, un seul panneau visible, bascule au clic.
  - `mobile : pas de débordement` : `scrollWidth ≤ 375` dans les 4 styles × 2 modes.
  - `clavier : frise` : les étapes sont des boutons, l'étape courante a `aria-current="step"`.
  - `contraste : atelier` : boutons et cases de l'atelier ≥ 4.5 dans les 4 états, 4 styles × 2 modes (réutiliser l'outil du test de régression).
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter** : sous 60em, barre fixe en bas ; liste de vérification `aria-live="polite"`.
- [ ] **Step 4: Lancer** `_tests/` → 0 échec.
- [ ] **Step 5: Commit** — `Atelier : version téléphone et accessibilité`.

## Phase 4 — Intégration et livraison

### Task 11: Liens avec le manuel

**Files:**
- Modify: `docs/manuel/chapitre1/index.md` à `chapitre8/index.md`, `docs/index.md`, `docs/manuel/index.md`, `docs/about.md`, `docs/javascripts/manuel.js`, `docs/stylesheets/styles.css`
- Test: `docs/_tests/integration.js`

**Interfaces:**
- Consumes: `MH.atelier.etat()` ou, hors de la page atelier, la lecture directe de `mh:projet`.
- Produces: `<div class="etape-projet" data-etape="N"></div>` avant « Vérifiez vos acquis » dans les chapitres 2 à 8, rendu par `manuel.js` (une phrase, l'état, un bouton vers `../projet/#etape-N`) ; sur l'accueil, une ligne « Projet : mon site » avec `data-progression="projet"`, qui affiche `n / 7 étapes`.

- [ ] **Step 1: Écrire les tests**
  - `intégration : encadré du chapitre 5` : indique « Réussie » quand l'étape 4 est réussie dans `mh:projet`, et son bouton mène à `projet/#etape-4`.
  - `intégration : accueil` : affiche « 3 / 7 étapes » quand 3 étapes sont réussies.
- [ ] **Step 2: Lancer** → échecs.
- [ ] **Step 3: Implémenter**, avec en plus : une phrase de présentation dans le chapitre 1, une ligne dans la présentation du manuel, « Vos données » et la version 2.2 dans À propos, les touches de frise et de barre par style dans `styles.css`.
- [ ] **Step 4: Lancer** `_tests/` (tous les fichiers) → 0 échec ; `node --test tests/` → tout passe.
- [ ] **Step 5: Commit** — `Intègre l'atelier aux chapitres, à l'accueil et à l'à-propos`.

### Task 12: Vérification finale et publication

**Files:**
- Modify: `mkdocs.yml` (`?v=2.2.0`)

- [ ] **Step 1: Suite complète.** `node --test tests/` → tout passe ; `_tests/` → 0 échec ; `python -m mkdocs build --strict` → aucun avertissement, et pas de dossier `_tests/` dans la sortie.
- [ ] **Step 2: Vérification visuelle.** L'atelier à 1280 et 375 px, dans les 4 styles, en clair et en sombre : une capture par combinaison, les défauts corrigés en un seul lot, une seule repasse.
- [ ] **Step 3: Détecteur de design.** `impeccable detect --json docs/stylesheets/atelier.css docs/stylesheets/styles.css` → aucune remarque non justifiée.
- [ ] **Step 4: Commit, push, publication.** `git push origin master`, puis `mkdocs gh-deploy --strict -d <dossier hors dépôt>` ; vérifier sur le site en ligne que `atelier.js?v=2.2.0` est bien servi.
- [ ] **Step 5: Checklist de test pour l'auteur**, sur le modèle de celle de « Mes images » : création, 7 étapes, liens entre pages, image, aller-retour du zip dans VS Code, import d'un zip Windows, téléphone, deux onglets.

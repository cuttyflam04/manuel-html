// Tests des fonctions pures (Node 24) : node --test "tests/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import "../docs/javascripts/outils.js";

const { resoudreChemin: r, largeursGrille: g, slugSite: s } = globalThis.MH.outils;
const F = ["index.html", "images/moi.jpg", "images/été 1.jpg", "cours/html.html"];

test("chemins : fichier trouvé, depuis la racine ou un sous-dossier", () => {
  assert.equal(r("images/moi.jpg", "", F).fichier, "images/moi.jpg");
  assert.equal(r("../index.html", "cours/html.html", F).fichier, "index.html");
  assert.equal(r("./images/moi.jpg", "", F).fichier, "images/moi.jpg");
});

test("chemins : suggestions et erreurs expliquées", () => {
  assert.equal(r("moi.jpg", "", F).proche, "images/moi.jpg");
  assert.equal(r("images/Moi.jpg", "", F).casse, "images/moi.jpg");
  assert.ok(r("../x.jpg", "", F).dehors);
  assert.ok(r("D:\\cours\\a.jpg", "", F).disque);
  assert.ok(r("file:///D:/cours/a.jpg", "", F).disque);
  assert.ok(r("http://a.fr/b.jpg", "", F).externe);
  assert.ok(r("  ", "", F).vide);
  assert.ok(r("galerie.html", "", F).absent);
});

test("chemins : accents et espaces, bruts ou encodés", () => {
  assert.equal(r("images/%C3%A9t%C3%A9%201.jpg", "", F).fichier, "images/été 1.jpg");
  assert.equal(r("images/été 1.jpg", "", F).fichier, "images/été 1.jpg");
});

test("grille : colspan, rowspan, incohérence", () => {
  assert.deepEqual(g([[{ colspan: 1, rowspan: 1 }, { colspan: 2, rowspan: 1 }], [{ colspan: 1, rowspan: 1 }, { colspan: 1, rowspan: 1 }, { colspan: 1, rowspan: 1 }]]), [3, 3]);
  assert.deepEqual(g([[{ colspan: 1, rowspan: 3 }, { colspan: 1, rowspan: 1 }], [{ colspan: 1, rowspan: 1 }], [{ colspan: 1, rowspan: 1 }]]), [2, 2, 2]);
  assert.deepEqual(g([[{ colspan: 1, rowspan: 1 }], [{ colspan: 1, rowspan: 1 }, { colspan: 1, rowspan: 1 }]]), [1, 2]);
});

test("slug du nom de site", () => {
  assert.equal(s("Club Info UAM"), "club-info-uam");
  assert.equal(s("Événement d'été !"), "evenement-d-ete");
  assert.equal(s("  "), "mon-site");
});

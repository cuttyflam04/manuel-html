// Tests de la logique des suggestions (Node 24) : node --test "tests/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import "../docs/javascripts/completion.js";

const { suggerer } = globalThis.MH.completion;
const en = (texte, opts) => suggerer(texte, texte.length, opts);
const noms = (r) => r.items.map((i) => i.libelle);

test("balises : « <U » propose U et UL, avec une astuce", () => {
  const r = en("<P>Texte</P>\n<U");
  assert.ok(noms(r).includes("<U>") && noms(r).includes("<UL>"), noms(r).join(" "));
  assert.equal(r.de, "<P>Texte</P>\n<".length);
  assert.ok(r.items.every((i) => i.astuce && i.astuce.length > 10));
});

test("balises : une balise en paire écrit sa fermante, curseur au milieu", () => {
  const ul = en("<UL").items.find((i) => i.libelle === "<UL>");
  assert.equal(ul.texte, "UL></UL>");
  assert.equal(ul.curseur, 3);
});

test("balises : la casse suit ce qui a été tapé", () => {
  const ul = en("<u").items.find((i) => i.libelle === "<UL>");
  assert.equal(ul.texte, "ul></ul>");
});

test("balises : une balise orpheline n'a pas de fermante", () => {
  const br = en("<BR").items.find((i) => i.libelle === "<BR>");
  assert.equal(br.texte, "BR>");
  assert.equal(br.curseur, 3);
});

test("attributs : ceux du cours pour la balise, sans ceux déjà écrits", () => {
  const r = en('<IMG SRC="a.jpg" ');
  const l = noms(r);
  assert.ok(l.includes("ALT") && l.includes("WIDTH") && !l.includes("SRC"), l.join(" "));
  const alt = r.items.find((i) => i.libelle === "ALT");
  assert.equal(alt.texte, 'ALT=""');
  assert.equal(alt.curseur, 5);
  assert.ok(/obligatoire/i.test(alt.astuce));
});

test("attributs : rien entre des guillemets", () => {
  assert.equal(en('<IMG ALT="une '), null);
});

test("fermeture : « </ » propose la dernière balise restée ouverte", () => {
  const r = en("<UL>\n  <LI>Un</");
  assert.equal(r.items[0].texte, "LI>");
});

test("caractères spéciaux : « &ea » propose &eacute; et montre é", () => {
  const r = en("Caf&ea");
  const e = r.items.find((i) => i.texte === "eacute;");
  assert.ok(e && /é/.test(e.libelle + e.astuce));
  assert.equal(r.de, "Caf&".length);
});

test("rien à proposer dans du texte simple", () => {
  assert.equal(en("Bonjour le Web"), null);
});

test("formulaires : seulement si on le demande (chapitre bonus)", () => {
  assert.ok(!noms(en("<INP") || { items: [] }).includes("<INPUT>"));
  assert.ok(noms(en("<INP", { formulaires: true })).includes("<INPUT>"));
});

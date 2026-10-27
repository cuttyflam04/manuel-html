// Tests de zip.js (Node 24) : node --test "tests/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "../docs/javascripts/zip.js";

const { creer, lire } = globalThis.MH.zip;
const enc = new TextEncoder(), dec = new TextDecoder();

test("zip : aller-retour sans perte, accents et espaces compris", async () => {
  const entree = [
    { chemin: "index.html", octets: enc.encode("<P>été</P>") },
    { chemin: "images/été 1.jpg", octets: Uint8Array.of(1, 2, 3) },
  ];
  const sortie = await lire(creer(entree));
  assert.deepEqual(sortie.map((f) => f.chemin), ["index.html", "images/été 1.jpg"]);
  assert.equal(dec.decode(sortie[0].octets), "<P>été</P>");
  assert.deepEqual([...sortie[1].octets], [1, 2, 3]);
});

test("zip : CRC-32 connu dans l'en-tête", async () => {
  const blob = creer([{ chemin: "a.txt", octets: enc.encode("123456789") }]);
  const v = new DataView(await blob.arrayBuffer());
  assert.equal(v.getUint32(0, true), 0x04034b50);
  assert.equal(v.getUint32(14, true), 0xcbf43926);
});

test("zip : lit un zip compressé par Windows", async () => {
  const octets = readFileSync(new URL("./fixtures/windows.zip", import.meta.url));
  const fichiers = await lire(new Blob([octets]));
  const noms = fichiers.map((f) => f.chemin).sort();
  assert.deepEqual(noms, ["mon-site/images/logo.gif", "mon-site/index.html"]);
  const index = fichiers.find((f) => f.chemin.endsWith("index.html"));
  assert.match(dec.decode(index.octets), /été/);
});

test("zip : refuse un fichier qui n'est pas un zip", async () => {
  await assert.rejects(lire(new Blob(["bonjour"])), /zip-invalide/);
});

test("zip : noms accentués d'un zip de l'Explorateur Windows (CP850, sans drapeau UTF-8)", async () => {
  const blob = creer([{ chemin: "images/#t# 1.jpg", octets: Uint8Array.of(9) }]);
  const b = new Uint8Array(await blob.arrayBuffer());
  const v = new DataView(b.buffer);
  v.setUint16(6, 0, true); // drapeau UTF-8 retiré (en-tête local)
  const central = b.length - 22 - (46 + 16);
  v.setUint16(central + 8, 0, true); // et dans le répertoire central
  for (let i = 0; i < b.length; i++) if (b[i] === 0x23) b[i] = 0x82; // « é » en CP850
  const [f] = await lire(new Blob([b]));
  assert.equal(f.chemin, "images/été 1.jpg");
});

/* Manuel HTML — fabriquer et relire un .zip, sans bibliothèque.
   creer(fichiers) → Blob : méthode « stockée » (sans compression), CRC-32, noms en UTF-8.
   lire(blob) → [{ chemin, octets }] : méthodes stockée et deflate (zips de Windows). */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  const TABLE = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (octets) => {
    let c = 0xffffffff;
    for (let i = 0; i < octets.length; i++) c = TABLE[(c ^ octets[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };

  function creer(fichiers) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    // Date DOS fixe (1er janvier 2026, midi) : le zip reste identique d'un export à l'autre.
    const heure = 12 << 11, date = ((2026 - 1980) << 9) | (1 << 5) | 1;
    for (const f of fichiers) {
      const nom = enc.encode(f.chemin), data = f.octets, crc = crc32(data);
      const loc = new DataView(new ArrayBuffer(30));
      loc.setUint32(0, 0x04034b50, true); loc.setUint16(4, 20, true); loc.setUint16(6, 0x0800, true);
      loc.setUint16(8, 0, true); loc.setUint16(10, heure, true); loc.setUint16(12, date, true);
      loc.setUint32(14, crc, true); loc.setUint32(18, data.length, true); loc.setUint32(22, data.length, true);
      loc.setUint16(26, nom.length, true); loc.setUint16(28, 0, true);
      parts.push(loc, nom, data);
      const cen = new DataView(new ArrayBuffer(46));
      cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true);
      cen.setUint16(8, 0x0800, true); cen.setUint16(10, 0, true); cen.setUint16(12, heure, true); cen.setUint16(14, date, true);
      cen.setUint32(16, crc, true); cen.setUint32(20, data.length, true); cen.setUint32(24, data.length, true);
      cen.setUint16(28, nom.length, true); cen.setUint32(42, offset, true);
      central.push(cen, nom);
      offset += 30 + nom.length + data.length;
    }
    const tailleCentral = central.reduce((s, p) => s + p.byteLength, 0);
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true);
    fin.setUint16(8, fichiers.length, true); fin.setUint16(10, fichiers.length, true);
    fin.setUint32(12, tailleCentral, true); fin.setUint32(16, offset, true);
    return new Blob([...parts, ...central, fin], { type: "application/zip" });
  }

  // Noms sans drapeau UTF-8 (Explorateur Windows) : UTF-8 s'il est valide, sinon page de code 850.
  const CP850 = "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´\u00ad±‗¾¶§÷¸°¨·¹³²■\u00a0";
  const lireNom = (octets, utf8Declare) => {
    if (utf8Declare) return new TextDecoder("utf-8").decode(octets);
    try { return new TextDecoder("utf-8", { fatal: true }).decode(octets); }
    catch (e) { return Array.from(octets, (o) => (o < 128 ? String.fromCharCode(o) : CP850[o - 128])).join(""); }
  };

  async function decompresser(octets) {
    const flux = new Blob([octets]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(flux).arrayBuffer());
  }

  async function lire(blob) {
    const buf = new Uint8Array(await blob.arrayBuffer());
    const v = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    let fin = -1;
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
      if (v.getUint32(i, true) === 0x06054b50) { fin = i; break; }
    }
    if (fin < 0) throw new Error("zip-invalide");
    const total = v.getUint16(fin + 10, true);
    let p = v.getUint32(fin + 16, true);
    const sortie = [];
    for (let n = 0; n < total; n++) {
      if (p + 46 > buf.length || v.getUint32(p, true) !== 0x02014b50) throw new Error("zip-invalide");
      const drapeaux = v.getUint16(p + 8, true);
      const methode = v.getUint16(p + 10, true), taille = v.getUint32(p + 20, true);
      const lnom = v.getUint16(p + 28, true), lext = v.getUint16(p + 30, true), lcom = v.getUint16(p + 32, true);
      const local = v.getUint32(p + 42, true);
      const chemin = lireNom(buf.subarray(p + 46, p + 46 + lnom), drapeaux & 0x0800).replace(/\\/g, "/");
      p += 46 + lnom + lext + lcom;
      if (chemin.endsWith("/")) continue;
      const debut = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
      const brut = buf.subarray(debut, debut + taille);
      let octets;
      if (methode === 0) octets = brut.slice();
      else if (methode === 8) octets = await decompresser(brut);
      else throw new Error("zip-methode");
      sortie.push({ chemin, octets });
    }
    return sortie;
  }

  MH.zip = { creer, lire, crc32 };
})();

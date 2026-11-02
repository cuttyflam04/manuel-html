/* Manuel HTML — fonctions pures (sans DOM), partagées et testées sous Node.
   resoudreChemin : trouve le fichier visé par un SRC ou un HREF, comme un navigateur.
   largeursGrille : largeur réelle de chaque ligne d'un tableau, fusions comprises.
   slugSite : nom de fichier propre à partir du nom du site. */
(function () {
  "use strict";
  const MH = (globalThis.MH = globalThis.MH || {});

  function resoudreChemin(src, depuis, chemins) {
    if (src == null || !String(src).trim()) return { vide: true };
    src = String(src).trim();
    if (/^(https?:|data:|blob:|mailto:|tel:|\/\/)/i.test(src)) return { externe: true };
    if (/^[a-z]:[\\/]/i.test(src) || /^file:/i.test(src)) return { disque: true };
    let p = src.split(/[?#]/)[0].replace(/\\/g, "/");
    try { p = decodeURI(p); } catch (e) { /* encodage invalide : on garde tel quel */ }
    // Le dossier de départ est celui du fichier qui contient le lien ; un chemin en / part de la racine.
    const out = p.startsWith("/") ? [] : (depuis || "").split("/").slice(0, -1).filter(Boolean);
    for (const seg of p.split("/")) {
      if (!seg || seg === ".") continue;
      if (seg === "..") { if (!out.length) return { dehors: true }; out.pop(); } else out.push(seg);
    }
    const chemin = out.join("/");
    if (chemins.includes(chemin)) return { fichier: chemin, chemin };
    const bas = chemin.toLowerCase();
    const casse = chemins.find((k) => k.toLowerCase() === bas);
    if (casse) return { casse, chemin };
    const nom = bas.split("/").pop();
    const proche = chemins.find((k) => k.split("/").pop().toLowerCase() === nom);
    return { absent: true, chemin, proche };
  }

  function largeursGrille(lignes) {
    const reste = []; // reste[col] = lignes encore occupées par un ROWSPAN venu d'au-dessus
    return lignes.map((cellules) => {
      let col = 0, largeur = 0;
      const occupe = (c) => (reste[c] || 0) > 0;
      for (const cel of cellules) {
        while (occupe(col)) { col++; largeur++; }
        const cs = Math.max(1, cel.colspan | 0 || 1), rs = Math.max(1, cel.rowspan | 0 || 1);
        for (let k = 0; k < cs; k++) reste[col + k] = Math.max(reste[col + k] || 0, rs);
        col += cs; largeur += cs;
      }
      for (let c = col; c < reste.length; c++) if (occupe(c)) largeur++;
      for (let c = 0; c < reste.length; c++) if (reste[c] > 0) reste[c]--;
      return largeur;
    });
  }

  function slugSite(nom) {
    const s = String(nom || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return s || "mon-site";
  }

  MH.outils = { resoudreChemin, largeursGrille, slugSite };
})();

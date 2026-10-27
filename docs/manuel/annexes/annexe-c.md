# Annexe C — Corrections du support de cours

Le support de cours est très complet, mais, comme tout document, il contient quelques coquilles. Elles sont regroupées ici, avec la bonne écriture, pour **ne pas être piégé à l'examen** ni en TP.

!!! note "Pourquoi cette annexe ?"

    Une coquille dans une diapositive est vite recopiée dans un TP, puis on se demande pourquoi le code ne marche pas. Ces corrections ne remettent pas en cause le cours : elles évitent juste de perdre du temps.

| Page | Dans le support | La bonne écriture | Chapitre |
|------|-----------------|-------------------|----------|
| 41, 51, 58 | `bgcolor=‘’white’’`, `content=‘’…’’` (guillemets typographiques) | `BGCOLOR="white"`, avec les guillemets droits du clavier | [2](../chapitre2/index.md) |
| 42 | « code **RBV** en hexadécimal » | Code **RVB** (Rouge, Vert, Bleu) | [2](../chapitre2/index.md) |
| 43 | `<! A partir de là ma page commence>` | `<!-- A partir de là ma page commence -->` | [2](../chapitre2/index.md) |
| 44 | `<justify> … </justify>` | Cette balise n'existe pas : `<P ALIGN="JUSTIFY">` | [3](../chapitre3/index.md) |
| 48 | `align="left \| rigth"` | `ALIGN="RIGHT"` | [3](../chapitre3/index.md) |
| 60 | `&nspb;` | `&nbsp;` | [3](../chapitre3/index.md) |
| 60 | `&copy` | `&copy;` (avec le point-virgule) | [3](../chapitre3/index.md) |
| 63 | Des puces « • » devant les lignes de code | Ne pas les recopier : ce sont des restes de la mise en page | [4](../chapitre4/index.md) |
| 77 | `<A NAME="http://www.toto.com/ExempleLienInterne.html#p1">` pour accéder au paragraphe | `<A HREF="http://www.toto.com/ExempleLienInterne.html#p1">` : `HREF` crée le lien, `NAME` pose l'étiquette | [5](../chapitre5/index.md) |
| 79 | `width` / `height` : « largeur / hauteur **du tableau** » | Largeur / hauteur **de l'image** | [6](../chapitre6/index.md) |
| 79, 82 | `ALT` « apparaît si la souris s'arrête sur l'image » | C'était le cas d'anciens navigateurs. `ALT` **remplace** l'image ; l'info-bulle vient de `TITLE` | [6](../chapitre6/index.md) |
| 91 | `<rt>` | `<tr>` | [7](../chapitre7/index.md) |
| 91 | `<td> Peugeot 106 </dt>` | `<td> Peugeot 106 </td>` | [7](../chapitre7/index.md) |
| 91 | `<td align=middle>` | `<TD ALIGN="CENTER">` (`MIDDLE` est une valeur de `VALIGN`) | [7](../chapitre7/index.md) |
| 96 | `style="background-color:black’’` | `STYLE="background-color: black"` | [8](../chapitre8/index.md) |
| 98 | `< /h1>` | `</h1>` (sans espace) | [8](../chapitre8/index.md) |
| 98 | « Le **font** de cette page » | « Le **fond** de cette page » | [8](../chapitre8/index.md) |

!!! tip "Si vous trouvez une autre coquille"

    Signalez-la sur le [dépôt GitHub du manuel](https://github.com/cuttyflam04/manuel-html/issues) : elle sera ajoutée ici.

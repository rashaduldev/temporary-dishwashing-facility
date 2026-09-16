// Source: us-atlas 3, U.S. Census Bureau boundaries. See docs/us-atlas-LICENSE.txt.
import fs from "node:fs";
const source = process.argv[2];
const t = source
  ? JSON.parse(fs.readFileSync(source, "utf8"))
  : await (
      await fetch(
        "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json",
      )
    ).json();
const arcs = t.arcs.map((a) => {
  let x = 0,
    y = 0;
  return a.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [
      x * t.transform.scale[0] + t.transform.translate[0],
      y * t.transform.scale[1] + t.transform.translate[1],
    ];
  });
});
function ring(ids) {
  return ids.flatMap((id, i) => {
    let a = id < 0 ? [...arcs[~id]].reverse() : arcs[id];
    return i ? a.slice(1) : a;
  });
}
const output = t.objects.states.geometries
  .filter((g) => !["11", "72"].includes(g.id))
  .map((g) => {
    const polys = g.type === "Polygon" ? [g.arcs] : g.arcs;
    const rings = polys.map((p) => ring(p[0]));
    const largest = rings.sort((a, b) => area(b) - area(a))[0];
    let a = 0,
      x = 0,
      y = 0;
    for (let i = 0; i < largest.length - 1; i++) {
      const p = largest[i],
        q = largest[i + 1],
        f = p[0] * q[1] - q[0] * p[1];
      a += f;
      x += (p[0] + q[0]) * f;
      y += (p[1] + q[1]) * f;
    }
    return {
      name: g.properties.name,
      id: g.id,
      d: polys
        .flatMap((p) =>
          p.map(
            (r) =>
              ring(r)
                .map(
                  (p, i) =>
                    (i ? "L" : "M") + p.map((v) => v.toFixed(1)).join(","),
                )
                .join("") + "Z",
          ),
        )
        .join(""),
      x: Math.round(x / (3 * a)),
      y: Math.round(y / (3 * a)),
    };
  });
function area(r) {
  let a = 0;
  for (let i = 0; i < r.length - 1; i++)
    a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1];
  return Math.abs(a);
}
fs.writeFileSync("src/usStates.json", JSON.stringify(output));
console.log(
  "Generated geographic boundaries for " + output.length + " states.",
);

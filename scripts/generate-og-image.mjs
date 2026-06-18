import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public/assets/img/og/dueno-og.svg");
const pngPath = join(root, "public/assets/img/og/dueno-og.png");

const svg = readFileSync(svgPath, "utf8");
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  background: "#000000",
});
const pngData = resvg.render();
writeFileSync(pngPath, pngData.asPng());

console.log(`Generated ${pngPath}`);

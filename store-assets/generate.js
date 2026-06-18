const fs = require("fs");
const path = require("path");

const root = __dirname;
const shotsDir = path.join(root, "..", "screenshots");
const outDir = path.join(root, "frames");
const htmlDir = path.join(root, "html");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(htmlDir, { recursive: true });

const fontDir = path.join(root, "fonts");
const mont600 = fs.readFileSync(path.join(fontDir, "mont-600.ttf")).toString("base64");
const mont800 = fs.readFileSync(path.join(fontDir, "mont-800.ttf")).toString("base64");

const copy = {
  "01-setup": { h: "Tu IPTV en un solo lugar", s: "Conecta tu cuenta en segundos" },
  "02-tv": { h: "Canales en vivo", s: "Todo al instante, sin complicaciones" },
  "03-peliculas": { h: "Miles de películas", s: "Tu catálogo siempre contigo" },
  "04-series": { h: "Tus series favoritas", s: "Continúa donde lo dejaste" },
  "05-series-details": { h: "Explora cada título", s: "Temporadas, episodios y más" },
  "06-settings": { h: "Hecho a tu medida", s: "Control total y privacidad" },
};

const devices = {
  iphone: { w: 1284, h: 2778 },
  ipad: { w: 2048, h: 2732 },
};

function frameHtml(device, shotPath, h, s) {
  const dim = devices[device];
  const isPad = device === "ipad";
  const padTop = isPad ? 150 : 200;
  const hSize = isPad ? 116 : 104;
  const sSize = isPad ? 52 : 46;
  const markSize = isPad ? 40 : 38;
  const shotW = isPad ? Math.round(dim.w * 0.84) : Math.round(dim.w * 0.82);
  const radius = isPad ? 44 : 76;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Mont';font-weight:600;src:url(data:font/ttf;base64,${mont600}) format('truetype');}
@font-face{font-family:'Mont';font-weight:800;src:url(data:font/ttf;base64,${mont800}) format('truetype');}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${dim.w}px;height:${dim.h}px;overflow:hidden;}
body{
  position:relative;
  background:
    radial-gradient(90% 55% at 50% -8%, rgba(212,170,125,0.34) 0%, rgba(212,170,125,0) 60%),
    radial-gradient(70% 50% at 110% 18%, rgba(212,170,125,0.16) 0%, rgba(212,170,125,0) 55%),
    radial-gradient(85% 60% at -15% 92%, rgba(212,170,125,0.12) 0%, rgba(212,170,125,0) 55%),
    linear-gradient(150deg,#332e29 0%,#262320 34%,#1c1b1a 70%,#161514 100%);
  font-family:'Mont',-apple-system,sans-serif;
  color:#fff;
}
body::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(rgba(255,255,255,0.05) 1.4px, transparent 1.6px);
  background-size:38px 38px;
  -webkit-mask-image:radial-gradient(130% 90% at 50% 0%, #000 0%, transparent 70%);
  mask-image:radial-gradient(130% 90% at 50% 0%, #000 0%, transparent 70%);
  opacity:0.6;
}
body::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 80% at 50% 42%, transparent 55%, rgba(0,0,0,0.45) 100%);
}
.wrap{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;padding-top:${padTop}px;}
.mark{font-weight:800;font-size:${markSize}px;letter-spacing:2px;text-transform:uppercase;color:#fff;opacity:0.92;}
.mark b{color:#D4AA7D;}
.headline{font-weight:800;font-size:${hSize}px;line-height:1.04;text-align:center;max-width:${Math.round(dim.w*0.86)}px;margin-top:${isPad?54:64}px;letter-spacing:-1px;}
.sub{font-weight:600;font-size:${sSize}px;color:#D4AA7D;text-align:center;margin-top:${isPad?26:30}px;letter-spacing:0.2px;opacity:0.95;}
.shot-zone{position:absolute;z-index:3;left:50%;transform:translateX(-50%);bottom:${isPad?-70:-130}px;}
.shot{
  width:${shotW}px;
  border-radius:${radius}px;
  display:block;
  box-shadow:0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,170,125,0.18);
  border:1px solid rgba(255,255,255,0.06);
}
.accent{width:84px;height:6px;border-radius:3px;background:#D4AA7D;margin-top:${isPad?40:46}px;}
</style></head><body>
<div class="wrap">
  <div class="mark">Mira<b> TV</b></div>
  <div class="headline">${h}</div>
  <div class="sub">${s}</div>
  <div class="accent"></div>
</div>
<div class="shot-zone"><img class="shot" src="file://${shotPath}"></div>
</body></html>`;
}

const jobs = [];
for (const device of Object.keys(devices)) {
  for (const key of Object.keys(copy)) {
    const shot = path.join(shotsDir, `${device}-${key}.png`);
    if (!fs.existsSync(shot)) continue;
    const { h, s } = copy[key];
    const html = frameHtml(device, shot, h, s);
    const htmlPath = path.join(htmlDir, `${device}-${key}.html`);
    fs.writeFileSync(htmlPath, html);
    jobs.push({ device, htmlPath, out: path.join(outDir, `${device}-${key}.png`), w: devices[device].w, hpx: devices[device].h });
  }
}
fs.writeFileSync(path.join(root, "jobs.json"), JSON.stringify(jobs, null, 2));
console.log(`generated ${jobs.length} html frames`);

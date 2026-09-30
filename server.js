const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 10000;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  let rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!rel || rel.endsWith("/")) rel += "index.html";
  const file = path.resolve(root, rel);
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });
      res.end("not found");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const image = [".jpg", ".jpeg", ".png", ".webp", ".ico"].includes(ext);
    const text = [".html", ".css", ".js", ".svg", ".txt"].includes(ext);
    const cache = image || ext === ".css" || ext === ".js" || ext === ".svg"
      ? "public, max-age=2592000"
      : "no-cache";
    const etag = `W/"${stat.size}-${Math.round(stat.mtimeMs)}"`;
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, { ETag: etag, "Cache-Control": cache });
      res.end();
      return;
    }
    const headers = {
      "Content-Type": types[ext] || "application/octet-stream",
      ETag: etag,
      "Last-Modified": stat.mtime.toUTCString(),
      "Cache-Control": cache,
      Vary: "Accept-Encoding",
    };
    const gzip = text && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
    if (gzip) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      fs.createReadStream(file).pipe(zlib.createGzip({ level: 6 })).pipe(res);
      return;
    }
    headers["Content-Length"] = stat.size;
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(port, () => {
  console.log("Loja no ar na porta " + port);
});

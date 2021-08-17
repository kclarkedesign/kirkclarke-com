const pkg = require("./package.json");
const pkgPaths = pkg.config.paths;

const https = require("https");
const fs = require("fs");
const path = require("path");
const certPath = path.resolve("C:\\Users\\Kirk\\AppData\\Local\\mkcert\\");
const hostname = "localhost";
const port = 5000;

const httpsConfig = {
  key: fs.readFileSync(path.resolve(certPath, "localhost+1-key.pem")),
  cert: fs.readFileSync(path.resolve(certPath, "localhost+1.pem")),
};

const server = https.createServer(httpsConfig, (req, res) => {
  // parse URL & modify GET requests for files to include public path
  let pathname = `${pkgPaths.public}${req.url}`;

  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext =
    path.parse(pathname).ext == "" ? ".html" : path.parse(pathname).ext;

  console.log(`${req.method} ${pathname}`);

  // maps file extension to MIME types
  const map = {
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
  };

  if (fs.statSync(pathname).isDirectory()) {
    pathname = pkgPaths.public + "/index.html";
  } else if (
    !pathname.match("^/images") &&
    ext == ".html" &&
    !pathname.match(".html$")
  ) {
    pathname = pathname + ext;
  }

  fs.stat(pathname, function (err, stats) {
    if (err) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    fs.readFile(pathname, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(err);
        return;
      }
      res.setHeader("Content-Type", map[ext] || "text/plain");
      res.writeHead(200);
      res.end(data);
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server is listening at https://${hostname}:${port}/`);
});

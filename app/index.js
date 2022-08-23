// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");
const config = require("./lib/config");
const path = require("path");
const _data = require("./lib/data");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

console.log(
  "hi",
  __dirname,
  "\n",
  path.join("\n", "/../lib", "\n", path.join(__dirname, "/../.data"))
);
//======================== Call send message function =====================//
helpers.sendTwilioSms("01789877577", "Hi", (err) => {
  console.log(err);
});

//=================================== Http server =========================================//
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    `server running Http on at ${config.envName} https://localhost:${config.httpPort}`
  );
});

//=================================== Https server =========================================//
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  function (req, res) {
    unifiedServer(req, res);
  }
);

httpsServer.listen(config.httpsPort, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `server running Http on at ${config.envName} https://localhost:${config.httpsPort}`
  );
});

// All the logic server for both the http/https and https server
const unifiedServer = function (req, res) {
  const method = req.method.toLowerCase();
  const headers = req.headers;

  const parsedUrl = url.parse(req.url, true);
  const queryStringObject = parsedUrl.query;

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get The payload
  const decoder = new StringDecoder("utf-8");
  let bodyData = "";
  req.on("data", (data) => {
    bodyData += decoder.write(data);
  });
  req.on("end", () => {
    bodyData += decoder.end();

    // choose the handler this request should go to. If one is not found use the not found handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(bodyData),
    };

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

// define a request router
const router = {
  pink: handlers.pink,
  users: handlers.users,
  tokens: handlers.tokens,
};

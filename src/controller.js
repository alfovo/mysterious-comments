import http from "http";
import url from "url";

module.exports = http.createServer((req, res) => {
  const service = require("./service.js");
  const reqUrl = url.parse(req.url, true);

  // GET Endpoint
  if (reqUrl.pathname == "/sample" && req.method === "GET") {
    console.log("Request Type:" + req.method + " Endpoint: " + reqUrl.pathname);

    service.sampleRequest(req, res);
  }
});

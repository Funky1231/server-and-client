const http = require("http");
const hostname = "127.0.0.1";

const requestPromise = async (request) => {
  return new Promise((resolve, reject) => {
    let body = [];
    request
      .on("error", (e) => {
        reject(e);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
  });
};

const server = http.createServer(async (request, response) => {
  response.setHeader("Content-Type", "text/html");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");

  if (request.method === "POST" && request.url === "/data") {
    const body = await requestPromise(request);
    console.log(body);
    const ran = Math.random();
    if (ran <= 0.6) {
      response.statusCode = 200;
      response.write("ok");
      response.end();
    } else if (ran > 0.6 && ran <= 0.8) {
      response.statusCode = 500;
      response.write("Server error");
      response.end();
    } else {
      console.log("Oops");
    }
  }
});

server.listen(8080, hostname, () => {
  console.log("Server start");
});

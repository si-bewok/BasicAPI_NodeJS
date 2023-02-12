// Config
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Data
let mahasiswa = [{ nim: 1, nama: "Muhammad Zhafari", umur: 23 }];

// Middleware - Basic Auth
function isAuthorized(req, res, next) {
  const auth = req.headers.authorization;

  if (auth !== "secret") {
    res.status(401);
    res.send("You are not permitted.");
  }

  next();
}

// HOME
app.get("/", (req, res) => res.send("Welcome to Mahasiswa API!"));

// GET
app.get("/mahasiswa/:nim", isAuthorized, (req, res) => {
  const mhs = mahasiswa.find((mhs) => mhs.nim === +req.params.nim);

  if (!mhs) {
    res.status(404);
    res.send(`There is no mahasiswa with NIM : ${+req.params.nim}`);
  }

  res.json(mhs);
});

// GET ALL
app.get("/mahasiswa", isAuthorized, (req, res) => res.json(mahasiswa));

// POST
app.post("/mahasiswa", [isAuthorized, bodyParser.json()], (req, res) => {
  const added = { nim: mahasiswa.length + 1, ...req.body };
  mahasiswa.push(added);
  res.json(mahasiswa);
});

// PUT
app.put("/mahasiswa/:nim", [isAuthorized, bodyParser.json()], (req, res) => {
  const index = mahasiswa.findIndex((mhs) => mhs.nim === +req.params.nim);

  if (!index) {
    res.status(404);
    res.send(`There is no mahasiswa with NIM : ${+req.params.nim}`);
  }

  mahasiswa[index] = { nim: +req.params.nim, ...req.body };
  res.json(mahasiswa);
});

// DELETE
app.delete("/mahasiswa/:nim", isAuthorized, (req, res) => {
  const deleted = mahasiswa.find((mhs) => mhs.nim === +req.params.nim);

  if (!deleted) {
    res.status(404);
    res.send(`There is no mahasiswa with NIM : ${+req.params.nim}`);
  }

  mahasiswa = mahasiswa.filter((mhs) => mhs.nim !== deleted.nim);
  res.send(`Mahasiswa with NIM : ${deleted.nim} is deleted.`);
});

// Launch
app.listen(port, () => console.log(`Mahasiswa API is running at http://localhost:${port} . . .`));

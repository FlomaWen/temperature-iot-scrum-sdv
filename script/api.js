const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3001;

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: "hz1.vps.ykpf.net",
  user: "groupe3meteo",
  password: "adminEUH69",
  database: "groupe3meteo",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connecté à la base de données");
});

// Autoriser les requêtes en provenance de toutes les origines
app.use(cors({ origin: "*" }));

// Créer une route pour récupérer les données
app.get("/donnees", (req, res) => {
  const query = "SELECT * FROM JOURNAL_API";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Démarrer le serveur
app.listen(port, "127.0.0.1", () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

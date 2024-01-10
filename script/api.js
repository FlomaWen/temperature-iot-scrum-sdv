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

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Créer une route pour récupérer les données
app.get("/donnees", (req, res) => {
  const query = "SELECT * FROM JOURNAL_API";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put("/updateSensorName/:NUM_CAP", (req, res) => {
  const { NUM_CAP } = req.params;
  const { newSensorName } = req.body;

  const query = "UPDATE JOURNAL_API SET NOM = ? WHERE NUM_CAP = ?";
  db.query(query, [newSensorName, NUM_CAP], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du nom du capteur" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// Démarrer le serveur
app.listen(port, "127.0.0.1", () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

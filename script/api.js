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

// Autoriser les requêtes en provenance de toutes les origines (à adapter en fonction de vos besoins de sécurité)
app.use(cors({ origin: "*" }));

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Créer une route pour récupérer les données (exemple)
app.get("/donnees", (req, res) => {
  const query = "SELECT * FROM JOURNAL_API";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.put("/updateSensorName/:numCap", (req, res) => {
  const { numCap } = req.params;
  const { newSensorName } = req.body;

  // Mettez à jour le nom du capteur dans la base de données ici
  const query = "UPDATE JOURNAL_API SET NOM = ? WHERE NUM_CAP = ?";
  db.query(query, [newSensorName, numCap], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du nom du capteur" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});
// Route pour créer une alerte
app.post("/createAlert", (req, res) => {
  const { numCap, temp, email } = req.body;

  // Insérer les données dans la table "ALERTES" (à adapter selon votre structure)
  const query = "INSERT INTO ALERTES (NUM_CAP, TEMP, EMAIL) VALUES (?, ?, ?)";
  db.query(query, [numCap, temp, email], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la création de l'alerte" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.get("/alertes-actives", (req, res) => {
  const query = "SELECT * FROM ALERTES"; // Supposons que vous avez une colonne "ACTIVE" pour indiquer si l'alerte est active
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Démarrer le serveur
app.listen(port, "127.0.0.1", () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

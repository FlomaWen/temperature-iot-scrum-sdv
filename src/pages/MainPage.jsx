import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import LineChartHum from "../components/ChartHum";
import Footer from "../components/Footer";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const MainPage = () => {
  const [allDonnees, setAllDonnees] = useState([]);
  const [recentDonnees, setRecentDonnees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historiqueData, setHistoriqueData] = useState({});
  const [selectedCapteurs, setSelectedCapteurs] = useState([]);
  const [mapCenter] = useState([45.1909365, 0.7184407]);
  const [editingSensorName, setEditingSensorName] = useState(null);
  const [newSensorName, setNewSensorName] = useState("");
  const [editedSensorId, setEditedSensorId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [alertTemp, setAlertTemp] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [currentCapteurForAlert, setCurrentCapteurForAlert] = useState(null);
  const [alertesActives, setAlertesActives] = useState([]);

  const fetchData = async (url) => {
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  };

  const updateSensorName = async (newName, numCap) => {
    try {
      const response = await fetch(
        `https://api.playdj.fr/updateSensorName/${numCap}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newSensorName: newName }),
        }
      );
      if (!response.ok) throw new Error("Échec de la mise à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  useEffect(() => {
    const fetchDonnees = async () => {
      const urlData = "https://api.playdj.fr/donnees";
      const dataCapteurs = await fetchData(urlData);

      const latestData = {};
      dataCapteurs.forEach((data) => {
        if (
          !latestData[data.NOM] ||
          new Date(data.DATE_HEURE) > new Date(latestData[data.NOM].DATE_HEURE)
        ) {
          latestData[data.NOM] = data;
        }
      });

      setRecentDonnees(Object.values(latestData));
      setAllDonnees(dataCapteurs);
      setLoading(false);
    };

    fetchDonnees();
  }, []);

  const customMarker = new L.Icon({
    iconUrl:
      "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
    iconSize: [38, 38],
  });

  const toggleHistorique = (capteur) => {
    if (selectedCapteurs.includes(capteur)) {
      setSelectedCapteurs(selectedCapteurs.filter((c) => c !== capteur));
    } else {
      setSelectedCapteurs([...selectedCapteurs, capteur]);
      const filteredData = allDonnees
        .filter((data) => data.NOM === capteur)
        .sort((a, b) => new Date(b.DATE_HEURE) - new Date(a.DATE_HEURE));
      setHistoriqueData({ ...historiqueData, [capteur]: filteredData });
    }
  };

  const refreshData = () => {
    setLoading(true);
    setHistoriqueData({});
    setSelectedCapteurs([]);

    fetchData("https://api.playdj.fr/donnees")
      .then((dataCapteurs) => {
        const latestData = {};
        dataCapteurs.forEach((data) => {
          if (
            !latestData[data.NOM] ||
            new Date(data.DATE_HEURE) >
              new Date(latestData[data.NOM].DATE_HEURE)
          ) {
            latestData[data.NOM] = data;
          }
        });

        setRecentDonnees(Object.values(latestData));
        setAllDonnees(dataCapteurs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      });
  };

  const handleEditSensorName = (capteur, id) => {
    setEditingSensorName(capteur);
    setNewSensorName(capteur);
    setEditedSensorId(id);
  };
  const openAlertForm = (capteur) => {
    setCurrentCapteurForAlert(capteur);
    setShowPopup(true);
  };
  const handleCreateAlert = async () => {
    try {
      const response = await fetch("https://api.playdj.fr/createAlert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numCap: currentCapteurForAlert.NUM_CAP,
          temp: alertTemp,
          email: alertEmail,
        }),
      });
      if (response.ok) {
        setShowPopup(false);
        // Réinitialiser les champs du formulaire
        setAlertTemp("");
        setAlertEmail("");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'alerte:", error);
    }
  };

  const fetchAlertesActives = async () => {
    try {
      const response = await fetch("https://api.playdj.fr/alertes-actives");
      const data = await response.json();
      setAlertesActives(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des alertes actives:",
        error
      );
    }
  };

  useEffect(() => {
    fetchAlertesActives();
  }, []);

  return (
    <div className=" mx-auto p-4 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-8 text-black">
        Tableau de Bord Météo
      </h2>
      <div className="flex justify-center">
        <button className="hover:bg-gray-200 p-2" onClick={refreshData}>
          <svg
            class="w-5 h-5 mx-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-3 text-center">Chargement en cours...</p>
        ) : (
          recentDonnees.map((data) => (
            <div
              key={data.NOM}
              className="bg-white shadow-lg rounded p-4 max-w-md mx-auto text-black"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">
                  {editingSensorName === data.NOM ? (
                    <input
                      type="text"
                      value={newSensorName}
                      onChange={(e) => setNewSensorName(e.target.value)}
                    />
                  ) : (
                    data.NOM
                  )}
                </h2>
                {editingSensorName === data.NOM ? (
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={async () => {
                      await updateSensorName(newSensorName, editedSensorId); // Appelle la fonction avec le nouveau nom et l'ID
                      setEditingSensorName(null); // Termine l'édition
                      setEditedSensorId(null); // Remet l'ID à null
                      refreshData();
                    }}
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-600 ml-5"
                    onClick={() => handleEditSensorName(data.NOM, data.NUM_CAP)} // Passe l'ID du capteur
                  >
                    Modifier le nom
                  </button>
                )}
                <button
                  className="text-blue-500 hover:text-blue-600 ml-5"
                  onClick={() => openAlertForm(data)}
                >
                  Créer alerte
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p
                    className="text-2xl font-bold mb-2"
                    style={{
                      color:
                        data.TEMP < 10
                          ? "blue"
                          : data.TEMP < 20
                          ? "orange"
                          : "red",
                    }}
                  >
                    {data.TEMP}°C
                  </p>
                  <p className="text-sm text-gray-500">Température</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2">
                    {data.NVL_HUM === 255 ? "-" : `${data.NVL_HUM}%`}
                  </p>
                  <p className="text-sm text-gray-500">Humidité</p>
                </div>
              </div>
              <p className="text-center mt-4">
                Date :{" "}
                {format(new Date(data.DATE_HEURE), "dd/MM/yyyy HH:mm:ss")}
              </p>
              <button
                className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => toggleHistorique(data.NOM)}
              >
                {selectedCapteurs.includes(data.NOM) ? "FERMER" : "HISTORIQUE"}
              </button>
              {selectedCapteurs.includes(data.NOM) && (
                <div>
                  <h3 className="text-xl mt-4 mb-2 font-semibold">
                    Historique - {data.NOM}
                  </h3>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Température (°C)</th>
                        <th className="px-4 py-2">Humidité (%)</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historiqueData[data.NOM]?.map((item, index) => (
                        <tr key={index}>
                          <td
                            className="border px-4 py-2"
                            style={{
                              color:
                                item.TEMP < 10
                                  ? "blue"
                                  : item.TEMP < 20
                                  ? "orange"
                                  : "red",
                            }}
                          >
                            {item.TEMP}
                          </td>
                          <td className="border px-4 py-2">
                            {item.NVL_HUM === 255
                              ? "Pas de données"
                              : `${item.NVL_HUM}%`}
                          </td>
                          <td className="border px-4 py-2">
                            {format(
                              new Date(item.DATE_HEURE),
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 max-w-xs">
                  <input
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                    type="text"
                    placeholder="Température"
                    value={alertTemp}
                    onChange={(e) => setAlertTemp(e.target.value)}
                  />
                  <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    type="email"
                    placeholder="Email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                  />
                  <h3 className="text-lg font-semibold mb-4">
                    Créer une alerte pour {currentCapteurForAlert?.NOM}
                  </h3>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    onClick={handleCreateAlert}
                  >
                    Créer l'alerte
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowPopup(false)}
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-semibold text-center mb-4 text-black">
          Alertes Actives
        </h3>
        <ul>
          {alertesActives.map((alerte) => (
            <li key={alerte.ID}>
              <p>
                <strong className="text-black">Capteur:</strong>{" "}
                {alerte.NUM_CAP}
              </p>
              <p>
                <strong className="text-black">Température:</strong>{" "}
                {alerte.TEMP}°C
              </p>
              <p>
                <strong className="text-black">Email:</strong> {alerte.EMAIL}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <p className="text-2xl font-semibold text-center text-black">
          Graphique :
        </p>
        <LineChartHum donnees={allDonnees} />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-center mb-4 text-black">
          Carte des Capteurs
        </h3>
        <MapContainer center={mapCenter} zoom={8} style={{ height: "400px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {allDonnees.map((data, index) => (
            <Marker
              key={index}
              position={data.LOC.split(",").map(Number)}
              icon={customMarker}
            >
              <Popup>
                <p>
                  <strong>{data.NOM}</strong>
                  <br />
                  Température: {data.TEMP}°C
                  <br />
                  Humidité:{" "}
                  {data.NVL_HUM === 255 ? "Pas de données" : `${data.NVL_HUM}%`}
                  <br />
                  Date:{" "}
                  {format(new Date(data.DATE_HEURE), "dd/MM/yyyy HH:mm:ss")}
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;

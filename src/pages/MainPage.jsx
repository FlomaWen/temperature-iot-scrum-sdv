import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import LineChartHum from "../components/ChartHum";
import Footer from "../components/Footer";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import ShareModal from "../components/ShareModal";



const fetchData = async (url) => {
  const response = await fetch(url);
  const responseData = await response.json();
  return responseData;
};
const updateSensorName = async (newName, numCap) => {
  try {
    const response = await fetch(`https://api.playdj.fr/updateSensorName`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newName,
        numCap,
      }),
    });

    if (response.ok) {
      console.log("Mise à jour réussie");
    } else {
      console.error("Échec de la mise à jour");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};

const MainPage = () => {
  const [allDonnees, setAllDonnees] = useState([]);
  const [recentDonnees, setRecentDonnees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const link = 'localhost:3000'

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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

      const latestDataArray = Object.values(latestData);

      setRecentDonnees(latestDataArray);
      setAllDonnees(dataCapteurs);
      setLoading(false);
    };

    fetchDonnees();
  }, []);

  const [historiqueData, setHistoriqueData] = useState({});
  const [selectedCapteurs, setSelectedCapteurs] = useState([]);
  const [mapCenter] = useState([45.1909365, 0.7184407]);
  const [editingSensorName, setEditingSensorName] = useState(null);
  const [newSensorName, setNewSensorName] = useState("");
  const [editedSensorId, setEditedSensorId] = useState(null); // État pour stocker l'ID du capteur en cours d'édition

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

        const latestDataArray = Object.values(latestData);

        setRecentDonnees(latestDataArray);
        setAllDonnees(dataCapteurs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      });
  };

  const handleEditSensorName = (capteur, id) => {
    // Prend l'ID du capteur en plus du nom
    setEditingSensorName(capteur);
    setNewSensorName(capteur);
    setEditedSensorId(id); // Stocke l'ID du capteur en cours d'édition
  };

    

  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Tableau de Bord Météo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-3 text-center">Chargement en cours...</p>
        ) : (
          recentDonnees.map((data) => (
            <div
              key={data.NOM}
              className="bg-white shadow-lg rounded p-4 max-w-md mx-auto"
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
                    onClick={() => {
                      updateSensorName(newSensorName, editedSensorId); // Appelle la fonction avec le nouveau nom et l'ID
                      setEditingSensorName(null); // Termine l'édition
                      setEditedSensorId(null); // Remet l'ID à null
                    }}
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => handleEditSensorName(data.NOM, data.NUM_CAP)} // Passe l'ID du capteur
                  >
                    Modifier le nom
                  </button>
                )}
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
                    {data.NVL_HUM === 255
                      ? "Pas de données"
                      : `${data.NVL_HUM}%`}
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
            </div>
          ))
        )}
      </div>
      <div className="mt-8">
        <p className="text-2xl font-semibold text-center">Graphique :</p>
        <LineChartHum donnees={allDonnees} />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 mx-auto block"
        onClick={refreshData}
      >
        Actualiser
      </button>
      
      
      <ShareModal/>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-center mb-4">
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
;


export default MainPage;



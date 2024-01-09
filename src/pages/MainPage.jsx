import LineChartHum from "../components/ChartHum";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const fetchData = async (url) => {
  const response = await fetch(url);
  const responseData = await response.json();

  return responseData;
};

const MainPage = () => {
  const [allDonnees, setAllDonnees] = useState([]); // Pour stocker toutes les données
  const [recentDonnees, setRecentDonnees] = useState([]); // Pour stocker les données les plus récentes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const urlData = "https://api.playdj.fr/donnees";
      const dataCapteurs = await fetchData(urlData);

      // Créer un objet pour stocker les données les plus récentes par capteur
      const latestData = {};

      dataCapteurs.forEach((data) => {
        if (
          !latestData[data.NOM] ||
          new Date(data.DATE_HEURE) > new Date(latestData[data.NOM].DATE_HEURE)
        ) {
          latestData[data.NOM] = data;
        }
      });

      // Convertir l'objet en tableau
      const latestDataArray = Object.values(latestData);

      setRecentDonnees(latestDataArray); // Stocker les données les plus récentes
      setAllDonnees(dataCapteurs); // Stocker toutes les données
      setLoading(false);
    })();
  }, []);

  const [historiqueData, setHistoriqueData] = useState({});
  const [selectedCapteur, setSelectedCapteur] = useState(null);

  const toggleHistorique = (capteur) => {
    if (selectedCapteur === capteur) {
      setSelectedCapteur(null);
    } else {
      setSelectedCapteur(capteur);
      const filteredData = allDonnees
        .filter((data) => data.NOM === capteur)
        .sort((a, b) => new Date(b.DATE_HEURE) - new Date(a.DATE_HEURE));
      setHistoriqueData({ [capteur]: filteredData });
    }
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
              <h2 className="text-xl font-semibold mb-4">{data.NOM}</h2>
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
              <p className="text-center mt-4">Date : {data.DATE_HEURE}</p>
              <button
                className="block mx-auto mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => toggleHistorique(data.NOM)}
              >
                {selectedCapteur === data.NOM ? "FERMER" : "HISTORIQUE"}
              </button>
              {selectedCapteur === data.NOM && (
                <div>
                  <h3 className="text-xl mt-4 mb-2 font-semibold">
                    Historique - {data.NOM}
                  </h3>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Température (°C)</th>
                        <th className="px-4 py-2">Humidité</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historiqueData[data.NOM].map((item, index) => (
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
                            {item.DATE_HEURE}
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
      <Footer />
    </div>
  );
};

export default MainPage;

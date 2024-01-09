import LineChartTemp from "../components/ChartTemp";
import LineChartHum from "../components/ChartHum";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const fetchData = async (url) => {
  const response = await fetch(url);
  const responseData = await response.json();

  return responseData;
};

const MainPage = () => {
  const [donnees, setDonnees] = useState(null);

  useEffect(() => {
    (async () => {
      const urlData = "https://api.playdj.fr/donnees";
      const dataCapteurs = await fetchData(urlData);
      setDonnees(dataCapteurs);
    })();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center">
          Tableau de Bord Météo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {donnees &&
            donnees.map((data) => (
              <article key={data.ID}>
                <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Lieu: {data.NOM}</h3>
                    <p className="text-sm">Température: {data.TEMP}°C</p>
                    <p className="text-sm">Humidité: {data.NVL_HUM}%</p>
                    <p className="text-sm">Vent: {data.SIGNAL} dB</p>
                  </div>
                  <div className="text-sm self-start">
                    Capteur: {data.NUM_CAP}
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;

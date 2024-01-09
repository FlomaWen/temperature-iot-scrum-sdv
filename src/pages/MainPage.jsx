import LineChartTemp from "../components/ChartTemp";
import LineChartHum from "../components/ChartHum";
import Header from "../components/Header";

const MainPage = () => {
  const fakeData = [
    {
      lieu: "Paris",
      lat: 48.8566,
      lon: 2.3522,
      temperature: "70°C",
      humidite: "60%",
      vent: "10 km/h",
      heure: "03:00",
    },
    {
      lieu: "Paris",
      lat: 45.764,
      lon: 4.8357,
      temperature: "18°C",
      humidite: "55%",
      vent: "12 km/h",
      heure: "06:00",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center">
          Tableau de Bord Météo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {fakeData.map((data) => (
            <article>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold">Lieu: {data.lieu}</h3>
                <p className="text-sm">Température: {data.temperature}</p>
                <p className="text-sm">Humidité: {data.humidite}</p>
                <p className="text-sm">Vent: {data.vent}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <LineChartTemp dataPoints={fakeData} />
      <LineChartHum dataPoints={fakeData} />
    </>
  );
};

export default MainPage;

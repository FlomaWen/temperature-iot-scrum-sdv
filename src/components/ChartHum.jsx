import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const CombinedChart = ({ donnees }) => {
  const filteredDonnees = donnees.filter(
    (point) => point.NVL_HUM !== 255 && point.TEMP !== 255
  );

  const hours = filteredDonnees.map((point) =>
    new Date(point.DATE_HEURE).toLocaleTimeString()
  );
  const temperatures = filteredDonnees.map((point) => point.TEMP);
  const humidites = filteredDonnees.map((point) => point.NVL_HUM);

  const chartContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Largeur du graphique
  };

  const data = {
    labels: hours,
    datasets: [
      {
        label: "Température (°C)",
        data: temperatures,
        fill: true,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        yAxisID: "temperature", // Identifiant de l'axe Y pour la température
      },
      {
        label: "Humidité (%)",
        data: humidites,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "rgba(255, 255, 255, 1)",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        yAxisID: "humidity", // Identifiant de l'axe Y pour l'humidité
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      temperature: {
        beginAtZero: false,
        max: 40,
        position: "left", // Position de l'axe Y pour la température
        ticks: {
          stepSize: 5,
        },
      },
      humidity: {
        beginAtZero: true,
        max: 100,
        position: "right", // Position de l'axe Y pour l'humidité
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div style={chartContainerStyle}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CombinedChart;

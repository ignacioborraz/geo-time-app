const getLocationFromBrowser = () => {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocalización no es soportada por el navegador'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });

        resolve({ latitude, longitude });
      },
      (error) => reject(new Error(`Error obteniendo ubicación: ${error.message}`)),
      options
    );
  });
};

const ctx = document.getElementById('geolocationChart').getContext('2d');
const geolocationChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Tiempo de Geolocalización (ms)',
      data: [],
      borderColor: 'rgba(255, 0, 0, 1)', // Color rojo para el gráfico
      borderWidth: 2,
      fill: false,
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Iteración',
          color: 'darkblue' // Azul oscuro para el texto del eje X
        },
        ticks: {
          color: 'darkblue' // Azul oscuro para los números del eje X
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tiempo (ms)',
          color: 'darkblue' // Azul oscuro para el texto del eje Y
        },
        ticks: {
          color: 'darkblue' // Azul oscuro para los números del eje Y
        }
      }
    }
  }
});

const updateChart = (time, iteration) => {
  geolocationChart.data.labels.push(iteration);
  geolocationChart.data.datasets[0].data.push(time);
  geolocationChart.update();
};

const analyzeGeolocationPerformance = async (iterations, interval) => {
  for (let i = 1; i <= iterations; i++) {
    try {
      const start = performance.now();
      await getLocationFromBrowser();
      const end = performance.now();
      const time = (end - start).toFixed();
      updateChart(time, i);
    } catch (error) {
      console.error(error.message);
    }

    await new Promise(res => setTimeout(res, interval));
  }
};

// Ejecutar el análisis, 200 veces con un intervalo de 4 segundos
analyzeGeolocationPerformance(500, 4000);

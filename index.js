const getLocationFromBrowser = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocalización no es soportada por el navegador'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => reject(new Error(`Error obteniendo ubicación: ${error.message}`)),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
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
      borderColor: 'rgba(255, 0, 0, 1)',
      borderWidth: 1,
      fill: false,
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Iteración',
          color: 'rgba(0, 0, 139, 1)',
        },
        ticks: {
          color: 'rgba(0, 0, 139, 1)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tiempo (ms)',
          color: 'rgba(0, 0, 139, 1)',
        },
        ticks: {
          color: 'rgba(0, 0, 139, 1)',
        },
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
  const times = [];
  for (let i = 1; i <= iterations; i++) {
    try {
      const start = performance.now();
      const { latitude, longitude } = await getLocationFromBrowser();
      const end = performance.now();
      const time = (end - start).toFixed();
      document.getElementById('latitude').innerText = latitude;
      document.getElementById('longitude').innerText = longitude;
      times.push(time);
      updateChart(time, i);
      const mostFrequentTime = getMostFrequent(times);
      document.getElementById('frequent-time').innerText = mostFrequentTime;
    } catch (error) {
      console.error(error.message);
    }
    console.log(times);    
    await new Promise(res => setTimeout(res, interval));
  }
};

const getMostFrequent = (arr) => {
  const frequencyMap = {};
  let maxFrequency = 0;
  let mostFrequentValue = null;
  arr.forEach(value => {
    frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    if (frequencyMap[value] > maxFrequency) {
      maxFrequency = frequencyMap[value];
      mostFrequentValue = value;
    }
  });
  return mostFrequentValue;
};

analyzeGeolocationPerformance(1000, 10000);
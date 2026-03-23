const map = L.map('map').setView([55.75, 37.61], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let chart = null;
map.attributionControl.setPrefix(false);

async function loadSettlements() {
    const res = await fetch('http://127.0.0.1:8000/settlements');
    const data = await res.json();

    data.forEach(s => {
        const marker = L.marker([s.lat, s.lon]).addTo(map);

        marker.on('click', async () => {
            document.getElementById('city-title').innerText = s.name;

            const weather = await fetch(
                `http://127.0.0.1:8000/weather?lat=${s.lat}&lon=${s.lon}`
            ).then(r => r.json());

            drawChart(weather);
        });
    });
}

function drawChart(data) {
    const ctx = document.getElementById('weatherChart');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Температура (°C)',
                    data: data.temperature
                },
                {
                    label: 'Осадки',
                    data: data.precipitation
                },
                {
                    label: 'Ветер',
                    data: data.wind
                }
            ]
        }
    });
}

loadSettlements();
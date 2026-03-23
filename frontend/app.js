const map = L.map('map').setView([53.13, 50.11], 10);

map.attributionControl.setPrefix(false);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

const markers = L.markerClusterGroup();

let chart = null;
async function loadSettlements() {
    try {
        const res = await fetch('http://127.0.0.1:8000/settlements');
        const data = await res.json();

        data.forEach(s => {
            const marker = L.marker([s.lat, s.lon]);

            marker.on('click', async () => {
                document.getElementById('city-title').innerText = s.name;

                try {
                    const weather = await fetch(
                        `http://127.0.0.1:8000/weather?lat=${s.lat}&lon=${s.lon}`
                    ).then(r => r.json());

                    drawChart(weather);
                } catch (err) {
                    console.error(err);
                }
            });

            markers.addLayer(marker);
        });

        map.addLayer(markers);

    } catch (err) {
        console.error(err);
    }
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
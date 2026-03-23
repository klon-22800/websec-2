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

                    renderCards(weather);
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
                    data: data.temperature,
                    yAxisID: 'y'
                },
                {
                    label: 'Осадки (мм)',
                    data: data.precipitation,
                    yAxisID: 'y1'
                },
                {
                    label: 'Ветер (м/с)',
                    data: data.wind,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left'
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    type: 'linear',
                    display: false
                }
            }
        }
    });
}

function getIcon(code) {
    if (code === 0) return "sun.png";

    if (code === 1 || code === 2 || code === 3) return "cloud.png";

    if (code >= 45 && code <= 48) return "cloud.png";

    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain.png";

    // if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow.png";

    // if (code >= 95) return "storm.png";

    return "cloud.png";
}

function renderCards(data) {
    const container = document.getElementById('daily-cards');
    container.innerHTML = '';

    for (let i = 0; i < data.dates.length; i++) {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div>${data.dates[i]}</div>
            <img src="icons/${getIcon(data.weathercode[i])}" width="40"/>
            <div>${data.temperature[i]}°C</div>
        `;

        container.appendChild(card);
    }
}

loadSettlements();
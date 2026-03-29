const map = L.map('map').setView([53.13, 50.11], 10);
map.attributionControl.setPrefix(false);


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

const markers = L.markerClusterGroup();
let chart = null;
let selectedCard = null;


async function loadSettlements() {
    try {
        const res = await fetch('http://127.0.0.1:8000/settlements');
        const data = await res.json();

        data.forEach(s => {
            const marker = L.marker([s.lat, s.lon]);
            marker.bindTooltip(s.name);

            marker.on('click', async () => selectCity(s));

            markers.addLayer(marker);
        });

        map.addLayer(markers);

    } catch (err) {
        console.error(err);
    }
}


async function selectCity(city) {
    document.getElementById('city-title').innerText = city.name;
    focusCity(city.lat, city.lon);


    document.getElementById('search').value = '';
    document.getElementById('suggestions').innerHTML = '';

    try {
        const hourlyData = await fetch(
            `http://127.0.0.1:8000/weather_hourly?lat=${city.lat}&lon=${city.lon}`
        ).then(r => r.json());

        renderCards(hourlyData);

        const firstDate = hourlyData.time[0].split('T')[0];
        drawHourlyChart(hourlyData, firstDate);

    } catch (err) {
        console.error(err);
    }
}


function focusCity(lat, lon) {
    map.setView([lat, lon], 10);
}


function drawHourlyChart(hourlyData, selectedDate) {
    const ctx = document.getElementById('weatherChart');

    if (chart) chart.destroy();

    const hours = [];
    const temp = [];
    const precip = [];

    hourlyData.time.forEach((t, i) => {
        if (t.startsWith(selectedDate)) {
            hours.push(t.split('T')[1]);
            temp.push(hourlyData.temperature[i]);
            precip.push(hourlyData.precipitation[i]);
        }
    });

    const containerWidth = document.getElementById('daily-cards-container').offsetWidth;
    ctx.parentNode.style.width = containerWidth + 'px';

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [
                {
                    type: 'line',
                    label: 'Температура (°C)',
                    data: temp,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    yAxisID: 'y'
                },
                {
                    type: 'bar',
                    label: 'Осадки (мм)',
                    data: precip,
                    backgroundColor: 'blue',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { type: 'linear', position: 'left' },
                y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } }
            }
        }
    });
}


function getIcon(code) {
    if (code === 0) return "sun.png";
    if ([1,2,3].includes(code)) return "cloud.png";
    if (code >= 45 && code <= 48) return "cloud.png";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain.png";
    return "cloud.png";
}


function renderCards(hourlyData) {
    const container = document.getElementById('daily-cards');
    container.innerHTML = '';
    selectedCard = null;

    const dates = [...new Set(hourlyData.time.map(t => t.split('T')[0]))];

    dates.forEach(date => {
        const indices = hourlyData.time.map((t,i) => t.startsWith(date)?i:-1).filter(i=>i!==-1);
        const maxTemp = Math.max(...indices.map(i => hourlyData.temperature[i]));
        const iconCode = hourlyData.weathercode[indices[0]];

        const card = document.createElement('div');
        card.className = 'card';

        const day = new Date(date);
        const weekday = day.toLocaleDateString('ru-RU', { weekday: 'short' });

        card.innerHTML = `
            <div>${weekday}</div>
            <div>${date}</div>
            <img src="icons/${getIcon(iconCode)}" width="40"/>
            <div>${maxTemp}°C</div>
        `;

        card.addEventListener('click', e => {
            e.preventDefault();
            if (selectedCard) selectedCard.classList.remove('selected-card');
            selectedCard = card;
            card.classList.add('selected-card');

            drawHourlyChart(hourlyData, date);
        });

        container.appendChild(card);
    });
}

const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');

searchInput.addEventListener('input', async () => {
    const q = searchInput.value.trim();
    suggestions.innerHTML = '';
    if (!q) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/search?q=${q}`);
        const results = await res.json();

        results.forEach(city => {
            const div = document.createElement('div');
            div.className = 'suggestion';
            div.textContent = city.name;
            div.addEventListener('click', () => selectCity(city));
            suggestions.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
});


loadSettlements();
# Weather-Map App
Реализация веб-приложения для интерактивного просмотра прогноза погоды по карте. 
## Быстрый запуск
```bash
git clone https://github.com/klon-22800/websec-2.git
cd websec-2
docker build -t weather-app:latest .
docker run -d -p 8000:8000 weather-app:latest
```
## Стэк 
- Карта - **Leaflet js**
- Погода - **OpenMeteo API**
- Фронт - **HTML/CSS/JS**
- Бэк - **FastAPI**

## Пример для разных устройств 

<p><strong>Ноутбук Планшет и Смартфон</strong></p>
<table>
  <tr>
    <td style="text-align:center;">
      <img src="https://github.com/klon-22800/websec-2/blob/main/readme_images/notebook.png" width="400">
    </td>
    <td style="text-align:center;">
      <img src="https://github.com/klon-22800/websec-2/blob/main/readme_images/notepad.png"  width="400">
    </td>
    <td style="text-align:center;">
      <img src="https://github.com/klon-22800/websec-2/blob/main/readme_images/smartphone.png" width="300">
    </td>
  </tr>
</table>

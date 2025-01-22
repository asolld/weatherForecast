document.addEventListener("DOMContentLoaded", startWeather());

document.getElementById("getWeatherData").addEventListener("click", getWeather);

document.getElementById("cityInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather();
  }
});




async function startWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        await getWeatherByCoords(latitude, longitude);
      },
      async () => {
        await getWeatherByCity("Санкт-Петербург");
      }
    );
  } else {
    await getWeatherByCity("Санкт-Петербург");
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    let weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
    );
    let weatherData = await weatherResponse.json();

    let temperatureNow = weatherData.current_weather.temperature;
    let windSpeedNow = weatherData.current_weather.windspeed;
    let weatherTodayElement = document.getElementById("weatherToday");
    weatherTodayElement.textContent = `Погода на текущей геолокации:`;

    document.getElementById("temperaturePar").querySelector(".label").textContent = `Температура: ${temperatureNow}°C`;
    document.getElementById("humidityPar").querySelector(".label").textContent = `Влажность: 90%`;
    document.getElementById("windSpeedPar").querySelector(".label").textContent = `Скорость ветра: ${Math.round(windSpeedNow)} м/с`;
  } catch (error) {
    console.error("Ошибка при получении данных о погоде по координатам:", error);
    alert("Не удалось получить данные о погоде. Попробуйте позже.");
  }
}

async function getWeatherByCity(city) {
  try {
    let weatherResponse = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=&geocode=${city}&format=json`
    );
    let geoData = await weatherResponse.json();

    let position = geoData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    let [lon, lat] = position.split(" ").map(Number); // Долгота, широта

    await getWeatherByCoords(lat, lon);
  } catch (error) {
    console.error("Ошибка при получении данных о погоде по городу:", error);
    alert("Не удалось получить данные о погоде. Попробуйте позже.");
  }
}


async function getWeather() {
  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("cityInput").placeholder = "Пожалуйста, введите название города";
    return;
  }
  
  function cityName(city) {
    const vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];

    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    let lastChar = city[city.length - 1];

    if (vowels.includes(lastChar)) {
      return city.slice(0, -1) + 'е';
    } 
    else {
      return city + 'е';
    }
  }
  
  let weatherTodayElement = document.getElementById('weatherToday');
  weatherTodayElement.textContent = `Погода в ${cityName(city)} сегодня:`

  let temperatureElement = document.getElementById("temperaturePar");
  temperatureElement.querySelector('.label').textContent = "Температура: Загрузка...";

  let humidityElement = document.getElementById("humidityPar");
  humidityElement.querySelector('.label').textContent = "Влажность: Загрузка...";

  let windSpeedElement = document.getElementById("windSpeedPar");
  windSpeedElement.querySelector('.label').textContent = "Скорость ветра: Загрузка...";

  try {
    let geoResponse = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=&geocode=${city}&format=json`
    );
    let geoData = await geoResponse.json();

    let position =
      geoData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    let [lon, lat] = position.split(" ").map(Number); //lon - долгота, lat - широта

    let weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_sum&timezone=auto`
    );
    let weatherData = await weatherResponse.json();

    let temperatureNow = weatherData.current.temperature_2m;
    temperatureElement.querySelector('.label').textContent = `Температура: ${temperatureNow}°C`;

    let humidityNow = weatherData.current.relative_humidity_2m;
    humidityElement.querySelector('.label').textContent = `Влажность: ${humidityNow}%`;

    let windSpeedNow = weatherData.current.wind_speed_10m;
    windSpeedElement.querySelector('.label').textContent = `Скорость ветра: ${
      Math.round(((windSpeedNow * 1000) / 3600) * 10) / 10
    } м/c`;

  } catch (error) {
    console.error(error);
    alert("Не удалось получить данные. Попробуйте позже.");
  }
}

async function getTodayWeather() {
  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    document.getElementById("cityInput").placeholder = "Пожалуйста, введите название города";
    return;
  }
  
  function cityName(city) {
    const vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    let lastChar = city[city.length - 1];
    return vowels.includes(lastChar) ? city.slice(0, -1) + 'е' : city + 'е';
  }
  
  let weatherTodayElement = document.getElementById('weatherToday');
  weatherTodayElement.textContent = `Максимальная погода в ${cityName(city)} сегодня:`;

  let temperatureElement = document.getElementById("temperaturePar");
  temperatureElement.querySelector('.label').textContent = "Температура: Загрузка...";

  let humidityElement = document.getElementById("humidityPar");
  humidityElement.querySelector('.label').textContent = "Влажность: Загрузка...";

  let windSpeedElement = document.getElementById("windSpeedPar");
  windSpeedElement.querySelector('.label').textContent = "Скорость ветра: Загрузка...";

  try {
    let geoResponse = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=&geocode=${city}&format=json`
    );
    let geoData = await geoResponse.json();

    let position =
      geoData.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
    let [lon, lat] = position.split(" ").map(Number); // lon - долгота, lat - широта

    let weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&timezone=auto`
    );
    let weatherData = await weatherResponse.json();

    let maxTemperature = weatherData.daily.temperature_2m_max[0]; 
    temperatureElement.querySelector('.label').textContent = `Максимальная температура: ${maxTemperature}°C`;

    humidityElement.querySelector('.label').textContent = "Влажность: -"; // Для прогноза на день влажность недоступна
    windSpeedElement.querySelector('.label').textContent = "Скорость ветра: -"; // Тоже часто недоступна

  } catch (error) {
    console.error(error);
    alert("Не удалось получить данные. Попробуйте позже.");
  }
}


let buttons = document.querySelectorAll('.toggleButton');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');

    if (button.textContent === "Сейчас") {
      getWeather(); // Показать текущую погоду
    } else if (button.textContent === "Сегодня") {
      getTodayWeather(); // Показать максимальную погоду на сегодня
    }
  });
});

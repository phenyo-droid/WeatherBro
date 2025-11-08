const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const unitToggle = document.querySelector("#unitToggle");

const cityName = document.querySelector("#cityName");
const date = document.querySelector("#date");
const temperature = document.querySelector("#temperature");
const weatherIcon = document.querySelector("#weatherIcon");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const precipitation = document.querySelector("#precipitation");
const hourlyList = document.querySelector("#hourlyList");
const dailyList = document.querySelector("#dailyList");

let isCelsius = true;
let weatherData = null;

function formatDate(timestamp) {
  const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  return new Date(timestamp * 1000).toLocaleDateString(undefined, options);
}

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    weatherData = data;
    displayCurrentWeather();
    displayHourlyForecast();
    displayDailyForecast();
  } catch (error) {
    alert(error.message);
  }
}

function displayCurrentWeather() {
  const current = weatherData.list[0];
  const city = `${weatherData.city.name}, ${weatherData.city.country}`;

  cityName.textContent = city;
  date.textContent = formatDate(current.dt);
  const temp = isCelsius ? current.main.temp : current.main.temp * 1.8 + 32;
  temperature.textContent = `${Math.round(temp)}°`;

  feelsLike.textContent = `${Math.round(current.main.feels_like)}°`;
  humidity.textContent = `${current.main.humidity}%`;
  wind.textContent = `${Math.round(current.wind.speed)} mph`;
  precipitation.textContent = `${current.pop ?? 0} in`;

  const iconCode = current.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function displayHourlyForecast() {
  hourlyList.innerHTML = "";
  const hours = weatherData.list.slice(0, 6);
  hours.forEach(item => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const temp = isCelsius ? item.main.temp : item.main.temp * 1.8 + 32;
    const icon = item.weather[0].icon;
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${time}</span>
      <img src="https://openweathermap.org/img/wn/${icon}.png" width="32" height="32" />
      <span>${Math.round(temp)}°</span>
    `;
    hourlyList.appendChild(div);
  });
}

function displayDailyForecast() {
  dailyList.innerHTML = "";
  const days = {};
  weatherData.list.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short" });
    if (!days[day]) days[day] = item;
  });

  Object.entries(days).slice(0, 5).forEach(([day, item]) => {
    const temp = isCelsius ? item.main.temp : item.main.temp * 1.8 + 32;
    const icon = item.weather[0].icon;
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${day}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" width="32" height="32" />
      <h4>${Math.round(temp)}°</h4>
    `;
    dailyList.appendChild(div);
  });
}

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) getWeatherData(city);
});

unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggle.textContent = isCelsius ? "°C / °F" : "°F / °C";
  if (weatherData) {
    displayCurrentWeather();
    displayHourlyForecast();
    displayDailyForecast();
  }
});

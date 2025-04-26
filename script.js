const formSearch = document.querySelector("#formulario");
const searchBar = document.querySelector(".submit input[type='text']");
const city = document.querySelector("#city");
const week_day = document.querySelector("#day");
const country = document.querySelector("#country");
const temp = document.querySelector("#temperature");
const high_temp = document.querySelector("#high-temp");
const low_temp = document.querySelector("#low-temp");
const wind = document.querySelector("#wind");
const cards = document.querySelector(".card");
const searchList = document.querySelector(".search-list");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const today = new Date();
const weekDay = days[today.getDay()];

async function getLocation(location) {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`
    );
    const data = await res.json();
    const result = data.results[0];
    return {
      name: result.admin2,
      country: result.country,
      lat: result.latitude,
      long: result.longitude,
    };
  } catch (err) {
    alert("Error: Type a valid city" + "\n" + "You typed: " + searchBar.value);
  }
}

async function getWeather(location) {
  const { lat, long } = await getLocation(location);
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,wind_speed_10m&timezone=auto&forecast_days=1`
  );
  const data = await res.json();
  return {
    max_temp: Math.round(data.daily.temperature_2m_max),
    min_temp: Math.round(data.daily.temperature_2m_min),
    wind_speed: Math.round(data.current.wind_speed_10m),
    current_temp: Math.round(data.current.temperature_2m),
  };
}

searchBar.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const location = searchBar.value.trim();
    const locationData = await getLocation(location);
    const weatherData = await getWeather(location);
    city.textContent = `${locationData.name},`;
    country.textContent = locationData.country;
    week_day.textContent = weekDay;
    temp.textContent = weatherData.current_temp + "º";
    high_temp.textContent = "High: " + weatherData.max_temp + "º";
    low_temp.textContent = "Low: " + weatherData.min_temp + "º";
    wind.textContent = "Wind: " + weatherData.wind_speed + " Km/h";

    if ((cards.style.display = "none")) {
      cards.style.display = "flex";
    }
  }
});
const formSearch = document.querySelector('#formulario')
const searchBar = document.querySelector(".submit input[type='text']")
const submitBox = document.querySelector(".submit input[type='button']")
const city = document.querySelector("#city")
const week_day = document.querySelector("#day")
const state = document.querySelector("#state")


async function getLocation(location) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`
  );
  const data = await res.json();
  const result = data.results[0];
  return {
    name: result.admin2,
    state: result.admin1,
    lat: result.latitude,
    long: result.longitude,
  };
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

formSearch.addEventListener('submit', async e =>{
   e.preventDefault()
   const location = searchBar.value.trim()
   const locationData = await getLocation(location)
   const weatherData = await getWeather(location)
   city.textContent = locationData.name
   state.textContent = weatherData.state
})
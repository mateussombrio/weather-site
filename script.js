const formSearch = document.querySelector("#formulario");
const searchBar = document.querySelector(".submit input[type='text']");
const city = document.querySelector("#city");
const week_day = document.querySelector("#day");
const country = document.querySelector("#country");
const temp = document.querySelector("#temperature");
const high_temp = document.querySelector("#high-temp");
const low_temp = document.querySelector("#low-temp");
const wind = document.querySelector("#wind");
const cards = document.querySelector(".cards-div");
const searchList = document.querySelector(".search-list");
const hr = document.querySelector(".hr");
const weatherIcon = document.querySelector(".weather-icon");
const humidity = document.querySelector("#humidity");
const body = document.querySelector(".body");
const gradientDay = `linear-gradient(180deg, rgba(25, 116, 210, 1) 57%, rgba(242, 243, 244, 1) 100%)`;
const gradientNight = `linear-gradient(180deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 69%, rgba(0, 212, 255, 1) 100%)`;
const forecast = document.querySelector(".forecast");

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
      name: result.name,
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
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,cloud_cover_mean,precipitation_probability_mean&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,cloud_cover,rain&timezone=auto`
  );
  const data = await res.json();
  return {
    max_temp: Math.round(data.daily.temperature_2m_max[0]),
    min_temp: Math.round(data.daily.temperature_2m_min[0]),
    dailyMaxTemp: data.daily.temperature_2m_max,
    dailyMinTemp: data.daily.temperature_2m_min,
    wind_speed: Math.round(data.current.wind_speed_10m),
    current_temp: Math.round(data.current.temperature_2m),
    currentIsDay: data.current.is_day,
    currentHumidity: data.current.relative_humidity_2m,
    currentRain: data.current.rain,
    currentCloudCover: data.current.cloud_cover,
    dailyCloudCover: data.daily.cloud_cover_mean,
    dailyPrecipitation: data.daily.precipitation_probability_mean,
  };
}
//  Event from the search bar
searchBar.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const location = searchBar.value.trim();
    const locationData = await getLocation(location);
    const weatherData = await getWeather(location);
    city.textContent = `${locationData.name},`;
    country.textContent = locationData.country;
    week_day.textContent = weekDay;
    temp.textContent = weatherData.current_temp + "ºC";
    high_temp.textContent = "High: " + weatherData.max_temp + "ºC";
    low_temp.textContent = "Low: " + weatherData.min_temp + "ºC";
    wind.textContent = "Wind: " + weatherData.wind_speed + " Km/h";
    humidity.textContent = "Humidity: " + weatherData.currentHumidity + "%";

    // Verify if is day or night and change the background color
    const toggleBackgroundDayNight = () => {
      if (weatherData.currentIsDay === 1) {
        body.style.background = gradientDay;
      } else {
        body.style.background = gradientNight;
      }
    };

    // Verify the climate state and change the icon
    const toggleIcon = (iconClass, weatherData) => {
      if (weatherData.currentRain > 0) {
        iconClass.src = "./assets/heavy-rain.png"; // Rain
      } else if (weatherData.currentCloudCover > 50) {
        iconClass.src = "./assets/cloudy.png"; // Cloudy
      } else {
        if (weatherData.currentIsDay === 1) {
          iconClass.src = "./assets/sun.png"; // Clean day
        } else {
          iconClass.src = "./assets/crescent-moon.png";
        }
      }
    };

    toggleBackgroundDayNight();
    toggleIcon(weatherIcon, weatherData);

    for (let i = 0; i < 6; i++) {
      const forecastDay = document.querySelectorAll(`.week-day`);
      const forecastImg = document.querySelectorAll(".forecast-card img");
      const forecastMaxTemp = document.querySelectorAll(".max-temp")
      const forecastMinTemp = document.querySelectorAll(".min-temp")
      const weekDayForecast = days[(today.getDay() + i + 1) % 7];
      forecastDay[i].textContent = weekDayForecast;
      forecastMaxTemp[i].textContent = Math.round(weatherData.dailyMaxTemp[i+1]) + "ºC"
      forecastMinTemp[i].textContent = Math.round(weatherData.dailyMinTemp[i+1]) + "ºC"

      if (weatherData.dailyPrecipitation[i] > 40) {
        forecastImg[i].src = "./assets/heavy-rain.png"; // Rain
      } else if (weatherData.dailyCloudCover[i] > 50) {
        forecastImg[i].src = "./assets/cloudy.png"; // Cloudy
      } else {
        forecastImg[i].src = "./assets/sun.png";
      }
    }

    if (
      getComputedStyle(cards).display === "none" &&
      getComputedStyle(hr).display === "none"
    ) {
      cards.style.display = "flex";
      hr.style.display = "flex";
      forecast.style.display = "flex"
    }
  }
});

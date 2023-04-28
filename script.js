document.addEventListener("DOMContentLoaded", function () {
  //Last updated date
  function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let month = months[date.getMonth()];
    let dayNumber = date.getDate();
    return `${month} ${dayNumber}, ${hours}:${minutes}`;
  }

  //Format day names for forecast
  function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000 + 86400000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }

  //Display forecast
  function displayForecast(response) {
    let forecast = response.data.daily;

    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
      if (index < 5) {
        forecastHTML =
          forecastHTML +
          `
            <div class="col-2" id="weatherday">
              <div class="forecastDay">${formatForecastDay(
                forecastDay.time
              )}</div>
              <img
                src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png"
                alt=""
                id="forecast-icon"
                width="60px"
              />
              <div class="forecastTemps">
                <span class="forecastTempMax">
                ${Math.round(forecastDay.temperature.maximum)}°
                </span>
                <span class="forecastTempMin">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>
              </div>
            </div>`;
      }
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }

  //Determine coordinates for displaying forecast
  function getForecast(coordinates) {
    let apiKey = "34adfbd4b0b0dcff9dt7821acd5a2co6";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  }

  //Search for a city
  function search(city) {
    let apiKey = "34adfbd4b0b0dcff9dt7821acd5a2co6";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
    axios.get(apiUrl).then(function (response) {
      showTemperature(response);
      getForecast(response.data.coordinates);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#searchInput");
    search(cityInputElement.value);
  }

  let form = document.querySelector("#searchForm");
  form.addEventListener("submit", handleSubmit);

  //Show current weather information
  function showTemperature(response) {
    let tempElement = document.querySelector("#currentTemperature");
    tempElement.innerHTML = Math.round(response.data.temperature.current);

    let cityElement = document.querySelector("#cityName");
    cityElement.innerHTML = response.data.city;

    let descriptionElement = document.querySelector(
      "#currentWeatherDescription"
    );
    descriptionElement.innerHTML = response.data.condition.description;

    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.temperature.humidity;

    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed);

    let dateElement = document.querySelector("#locationTime");
    dateElement.innerHTML = formatDate(response.data.time * 1000);

    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  }

  //Fahrenheit and celsius display and conversion
  function displayFahrenheitTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#currentTemperature");

    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");

    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  }

  function displayCelsiusTemperature(event) {
    event.preventDefault();
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");

    let temperatureElement = document.querySelector("#currentTemperature");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  }

  let celsiusTemperature = null;

  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.addEventListener("click", displayCelsiusTemperature);

  //Find current location by geolocation
  function findLocation() {
    navigator.geolocation.getCurrentPosition(retrievePosition);

    function retrievePosition(position) {
      let apiKey = "34adfbd4b0b0dcff9dt7821acd5a2co6";
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
      axios.get(apiUrl).then(showTemperature);
    }
  }

  button = document.querySelector("#useMyLocation");
  button.addEventListener("click", findLocation);

  //Default search Amsterdam
  search("Amsterdam");
  displayForecast();
});

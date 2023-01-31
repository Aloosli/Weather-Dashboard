// Description: This file contains the main JavaScript code for the Weather Dashboard app.
let cityButtonHistory = [];

// Get the city history from local storage and check if city is already in the array
window.onload = function () {
  cityButtonHistory =
    JSON.parse(localStorage.getItem("cityButtonHistory")) || [];
  cityButtonHistory = Array.from(new Set(cityButtonHistory));
  cityButtonHistory.forEach(function (city) {
    createCityButtons(city);
  });
};

// Select form element
const cityForm = document.querySelector("form");
// Select today weather element
const todayWeather = document.querySelector(".todayWeather");
// Select forecast container element
const forecastContainer = document.querySelector(".forecast-container");
// // Get current day in desired format
const currentDay = moment().format("Do MMM YYYY");

// Function to create a button in the search area for city history
function createCityButtons(city) {
  cityButtonHistory.push(city);
  // create a button for the new city
  let cityButton = $("<button>");
  // add a class to the button
  cityButton.addClass("city-button ");
  // add the city name to the button
  cityButton.text(city);
  // append the button to the city-history div
  $(".city-buttons").append(cityButton);
  // save the cityHistory array to local storage
  localStorage.setItem("cityButtonHistory", JSON.stringify(cityButtonHistory));
}

// Function to update UI with weather data
const updateUI = (data) => {
  // Destructure data
  const { cityDets, weather, forecast } = data;
  // Convert Kelvin temperature to Celsius
  const tempCelsius = weather.main.temp - 273.15;
  // Update forecast
  updateForecast(data.forecast);
  // Populate today weather element with updated data
  todayWeather.innerHTML = `
    <h5 class="my-1 todayCity">${weather.name} ${currentDay}</h5>
    <img class="todayIcon" src="https://openweathermap.org/img/wn/${
      weather.weather[0].icon
    }@4x.png" alt="weather icon" />
    <div class="">${weather.weather[0].description}</div>
    <div class="display-4 my-1">
        <span>${tempCelsius.toFixed(2)} &#8451;</span>
    </div>
    <p>Humidity: ${weather.main.humidity}%</p>
    
    <p>Wind: ${weather.wind.speed} m/s</p>
    `;
};
// Function to update forecast cards
const updateForecast = (forecast) => {
  // Clear forecast container
  forecastContainer.innerHTML = "";
  // Loop over 5 days
  for (let i = 0; i < 5; i++) {
    // Create forecast card
    const forecastCard = document.createElement("div");
    forecastCard.classList.add(
      "card",
      "mx-auto",
      "text-white",
      "m-2",
      "text-center"
    );
    // Populate forecast card with data
    forecastCard.innerHTML = `
        <img class="card-img-top mx-auto" src="https://openweathermap.org/img/wn/${
          forecast.list[i].weather[0].icon
        }@2x.png" alt="weather icon" />
        
        <div class="card-body">
          <h5 class="card-title">${moment()
            .add(i + 1, "days")
            .format("Do MMM YYYY")}</h5>
          <p>Temperature: ${Math.round(
            forecast.list[i].main.temp - 273.15
          )} °C</p>
          <p class="card-text">Humidity: ${forecast.list[i].main.humidity}%</p>
          <p class="card-text">Wind: ${forecast.list[i].wind.speed} m/s</p>
        </div>
      `;
    // Append forecast card to forecast container
    forecastContainer.appendChild(forecastCard);
  }
};

// Function to update city weather and check if city exists
const updateCity = async (city) => {
  try {
    // Get city data
    const cityDets = await getCity(city);

    // Get weather data
    const weather = await getWeather(cityDets.lat, cityDets.lon);

    // Get forecast data
    const forecast = await getForecast(cityDets.lat, cityDets.lon);

    // Return data
    return {
      cityDets,
      weather,
      forecast,
    };
  } catch (error) {
    alert("City not found. Please try again.");
  }
};

// Event listener for form submit
cityForm.addEventListener("submit", (e) => {
  // Prevent default action
  e.preventDefault();
  //Get city value from form input
  const city = cityForm.city.value.trim();
  // Reset form
  cityForm.reset();
  // Check if input is empty
  if (city === "") {
    alert("Please enter a city name");
  } else {
    // Update UI with new city
    updateCity(city)
      // Check if city exists
      .then((data) => {
        if (data.cityDets) {
          updateUI(data);
          // check if the city is already in the cityButtonHistory array
          if (cityButtonHistory.indexOf(city) === -1) {
            // create a button for the new city
            createCityButtons(city);
          }
        }
      })

      // Catch error
      .catch((err) => console.log(err));
  }
});

// event listener for city buttons
$(".city-buttons").on("click", ".city-button", function () {
  // get the text from the button
  let city = $(this).text();
  // update the UI with the city
  updateCity(city)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
});

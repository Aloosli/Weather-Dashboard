// Global variables
const apiKey = "9ae8216bea4ff853455ec69cc8c92110";
const cityHistory = [];
const currentDay = moment().format("Do MMM YYYY");
let cityName = "";

// Function to create a button in the search area for city history
//------------------------------------------------------------

function createCityButtons(city) {
  // check if new city is already in the cityHistory array
  if (cityHistory.indexOf(city) === -1) {
    // if not, add it to the array
    cityHistory.push(city);
    // create a button for the new city
    let cityButton = $("<button>");
    // add a class to the button
    cityButton.addClass("city-button ");
    // add the city name to the button
    cityButton.text(city);
    // append the button to the city-history div
    $(".city-buttons").append(cityButton);
  }
}
// Get coordinates and check if city is valid
//------------------------------------------------------------

function getCoordinates(city) {
  let geolocationURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&type=like&appid=" +
    apiKey;
  $.ajax({
    url: geolocationURL,
    method: "GET",
  }).then(function (response) {
    if (response.length !== 0) {
      cityName = response[0].name;
      let lat = response[0].lat;
      let lon = response[0].lon;
      getWeather(lat, lon);
    } else {
      alert("Please enter a valid city name");
    }
    if (response.length !== 0) {
      createCityButtons(cityName);
    }
  });

  // Function to retrieve current and future weather conditions for the entered city using an API
  function getWeather(lat, lon) {
    // Constructing a queryURL using the city name
    let queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;
    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET",
      // error callback function
      error: function (jqXHR, textStatus, errorThrown) {
        // show error message to user
        alert("Error: " + textStatus + " " + errorThrown);
      },
    })
      // After data comes back from the request
      .then(function (response) {
        // Transfer content to HTML
        // clear the #today div
        $("#today").empty();
        
        

        // append the city name and date to the #today div
        $("#today").append("<h2 class=todayCity>" + cityName + " (" + currentDay + ")</h2>");
        // append the icon to the #today div
        $("#today").append(
          "<img src='https://openweathermap.org/img/wn/" +
            response.list[0].weather[0].icon +
            "@4x.png'>"
        );
        // append the temperature to the #today div in celcius
        $("#today").append(
          "<p>Temperature: " +
            Math.round(response.list[0].main.temp - 273.15) +
            " °C</p>"
        );

        // append the humidity to the #today div
        $("#today").append(
          "<p>Humidity: " + response.list[0].main.humidity + "%</p>"
        );
        // append the wind speed to the #today div
        $("#today").append(
          "<p>Wind Speed: " + response.list[0].wind.speed + " MPH</p>"
        );
        // add a class to the #today div for styling
        $("#today").addClass("content-exists");


        // Create 5 forecast cards and append them to <section id="forecast-container"
        //------------------------------------------------------------

        // clear the #forecast-container div
        $("#forecast-container").empty();
        for (let i = 0; i < 5; i++) {
          let forecastCard = $("<div>");
          forecastCard.addClass("card mx-auto text-white m-2 text-center");
          forecastCard.html(`
                <img class="card-img-top mx-auto" src="https://openweathermap.org/img/wn/${
                  response.list[i].weather[0].icon
                }@2x.png">
                <div class="card-body ">
                    <h5 class="card-title">${moment()
                      .add(i + 1, "days")
                      .format("Do MMM YYYY")}</h5>
                    <p class="card-text">Temperature: ${Math.round(
                      response.list[i].main.temp - 273.15
                    )} °C</p>
                    <p class="card-text">Humidity: ${
                      response.list[i].main.humidity
                    }%</p>
                </div>
            `);
          $("#forecast-container").append(forecastCard);
        }
      });
  }
}

// Function to capitalize the first letter of city names
//------------------------------------------------------------

function capitalizeWords(inputString) {
  // Convert the input string to lowercase and split it into an array of words
  let words = inputString.toLowerCase().split(" ");
  // Loop through the array of words
  for (let i = 0; i < words.length; i++) {
    // Capitalize the first letter of each word
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  // Join the array of capitalized words back into a single string and return it
  return words.join(" ");
}
// Store the user's input in a variable
//------------------------------------------------------------
$("#search-button").on("click", function (event) {
  event.preventDefault();
  city = capitalizeWords($("#search-input").val());
  // check if there is any input
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  // Retrieve current and future weather conditions for the entered city using an API
  getCoordinates(city);
  // Save the city name in the browser's local storage
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
});

// event listener for city buttons
//------------------------------------------------------------
$(document).on("click", ".city-button", function () {
  // Get the city name from the button text
  city = $(this).text();
  if (city) {
    // Retrieve current and future weather conditions for the entered city using an API
    getCoordinates(city);
  }
});
// Clear the search input field and add a placeholder
function clearSearch(){
  const storedValue = localStorage.getItem('cityHistory');
  if(storedValue) {
    // If a value is found, clear it
    localStorage.removeItem('cityHistory');
    $('#search-input').val('');
    $('#search-input').attr("placeholder", "search a city");
  }
}

$(document).ready(clearSearch);


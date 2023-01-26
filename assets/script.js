// Pseudocode:
// When the user submits a search (by clicking the search button):
// Store the user's input in a variable
// Retrieve current and future weather conditions for the entered city using an API
// Save the city name in the browser's local storage

// Use the data from the API to fill in the current weather section:
// Show the city name and today's date
// Show the current temperature
// Show the wind speed and direction
// Show the humidity


// Use the data from the API to fill in the five-day forecast:
// Show the date for each day
// Show an icon representing the weather conditions for each day
// Show the temperature for each day
// Show the wind speed and direction for each day
// Show the humidity for each day

// Using data stored in local storage, create a button in the search area for city history
// When clicked, this button should display the current and future weather conditions for the previously searched city.
// end pseudocode

// Global variables
apiKey = "9ae8216bea4ff853455ec69cc8c92110";
var city = "";
var cityHistory = [];


// // When the user submits a search (by clicking the search button):
// Store the user's input in a variable
$("#search-button").on("click", function(event) {
    event.preventDefault();
    city = $("#search-input").val();
    console.log(city);
    // Retrieve current and future weather conditions for the entered city using an API
    getWeather(city);
    // Save the city name in the browser's local storage
    cityHistory.push(city);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    // Create a button in the search area for city history
    createCityButtons();
});


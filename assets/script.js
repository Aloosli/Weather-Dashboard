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
var currentDay = moment().format('M/DD/YYYY');

// // Create 5 forecast divs and append them to the forecast-container div
// for (var i = 0; i < 5; i++) {
//     var forecastDiv = $("<div>").addClass("forecast");
//     $("#forecast-container").append(forecastDiv);
//   }
// get coordinates
  function getCoordinates(city) {
    var geolocationURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    $.ajax({
        url: geolocationURL,
        method: "GET"
        
    }).then(function(response){
        
        var lat = response[0].lat;
        var lon = response[0].lon;
        getWeather(lat, lon);
        console.log(response);
        
    });

    // Function to retrieve current and future weather conditions for the entered city using an API
function getWeather(lat, lon) {
    // Constructing a queryURL using the city name
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=" + apiKey;
    // Performing an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // After data comes back from the request
    .then(function(response) {
        // Log the queryURL
        console.log(queryURL);
        // Log the resulting object
        console.log(response);
        // Transfer content to HTML
      // append the city name and date to the #today div
        $("#today").append("<h2>" + response.city.name + " (" + currentDay + ")</h2>");
        // append the icon to the #today div
        $("#today").append("<img src='https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png'>");
        // append the temperature to the #today div
        $("#today").append("<p>Temperature: " + response.list[0].main.temp + " °F</p>");
        // append the humidity to the #today div
        $("#today").append("<p>Humidity: " + response.list[0].main.humidity + "%</p>");
        // append the wind speed to the #today div
        $("#today").append("<p>Wind Speed: " + response.list[0].wind.speed + " MPH</p>");

    
    });
      
    };

    

}

  

// Function to create a button in the search area for city history
function createCityButtons(city) {
  // check if new city is already in the cityHistory array
    if (cityHistory.indexOf(city) === -1) {
        // if not, add it to the array
        cityHistory.push(city);
        // create a button for the new city
        var cityButton = $("<button>");
        // add a class to the button
        cityButton.addClass("city-button  btn btn-secondary mb-2");
        // add the city name to the button
        cityButton.text(city);
        // append the button to the city-history div
        $(".city-buttons").append(cityButton);
    }
};









// // When the user submits a search (by clicking the search button):
// Store the user's input in a variable
$("#search-button").on("click", function(event) {
    event.preventDefault();
    city = $("#search-input").val();
    console.log(city);
    // Retrieve current and future weather conditions for the entered city using an API
    getCoordinates(city);
    
     // call
     createCityButtons(city);
     // Save the city name in the browser's local storage
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
   
});

// event listener for city buttons
$(document).on("click", ".city-button", function() {
    // Get the city name from the button text
    city = $(this).text();
    if (city){
    // Retrieve current and future weather conditions for the entered city using an API
    getCoordinates(city);
    }
});





  
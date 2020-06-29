$( document ).ready(function() {

// Set global variables
var city = "";


var cityStorage = JSON.parse(localStorage.getItem("cityStorage")); 
if(cityStorage === null){
    cityStorage = [];
} else{
    searchHistory();
    callAPI(cityStorage[cityStorage.length - 1]);
}
console.log(cityStorage);


$('#search-button').on("click", function(){
    city = $('#search-box').val();
    cityStorage.push(city);
    setStorage();
    searchHistory();
    callAPI(city);
})

$('#clear-search').on("click", function(e){
    e.preventDefault();
    localStorage.clear();
})

function outputDate(x){
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + x);
    console.log(targetDate);
    var month = targetDate.getMonth() + 1;
    var day = targetDate.getDate();
    var year = targetDate.getFullYear();
    return month + "/" + day + "/" + year;
}

function callAPI(x){
    // Open weather API call
    city = x;
    var apiKey = "2823fd191624e0d367262190ea3c1cd4";
    
    var query = "http://api.openweathermap.org/data/2.5/forecast/?units=imperial&cnt=6&q=" + city + "&appid=" + apiKey;
    
    console.log(query);
    $.ajax({
        url:query,
        method:"GET"
    }).then(function(response){
        console.log(response);
        $('#city').text(city);
        for(var i = 0; i < response.list.length; i++){
            if (i === 0){
                // Set current date using outputDate function
                $('#date').text(outputDate(i));

                // Output current weather
                $('#temperature').text(response.list[i].main.temp);
                $('#humidity').text(response.list[i].main.humidity);
                $('#wind-speed').text(response.list[i].wind.speed);
                
                // Get weather icon
                var weatherimg = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"
                $('#weather-icon').attr("src", weatherimg);

                // Get UV value using separate API
                var uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.city.coord.lat +"&lon=" + response.city.coord.lon
                getUV(uvQuery);
            } else {
                // Ouput date, temperature and humidity to future weather
                var newDiv = $('<div>').addClass('forecast');

                // Date
                var dateObj = $('<div>').text(outputDate(i));
                newDiv.append(dateObj);

                // Image

                var weatherIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
                newDiv.append(weatherIcon);

                // Temperature
                var temp = $('<div>').text("Temp: " + response.list[i].main.temp);
                newDiv.append(temp);

                // Humidity
                var humidity = $('<div>').text("Humidity: " + response.list[i].main.humidity);
                newDiv.append(humidity);

                $('#forecast-output').append(newDiv);
            }
        }
        
    })
}

function getUV(x){
    $.ajax({
        url:x,
        method:"GET"
    }).then(function(response){
        $('#uv-index').text(response.value)
    })
}
function setStorage(){
    localStorage.setItem("cityStorage", JSON.stringify(cityStorage));
}

function searchHistory(){
    $('#city-output').empty();
    for(var i = 0; i < cityStorage.length; i++){
        var cityDiv = $('<div>');
        cityDiv.text(cityStorage[i]);
        $('#city-output').prepend(cityDiv);
    }
}

});
$( document ).ready(function() {

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
        $('#temperature').text(JSON.stringify(response.list[0].main.temp));
        $('#humidity').text(JSON.stringify(response.list[0].main.humidity));
        $('#wind-speed').text(JSON.stringify(response.list[0].wind.speed));

        var uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.city.coord.lat +"&lon=" + response.city.coord.lon
        getUV(uvQuery);
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
    localStorage.setItem("cityStorage", cityStorage);
}

function searchHistory(){
    $('#city-output').empty();
    for(var i = 0; i < cityStorage.length; i++){
        var cityDiv = $('<div>');
        cityDiv.text(cityStorage[i]);
        $('#city-output').prepend(cityDiv);
    }
}

function getWeatherData(element, data){
    
}

});
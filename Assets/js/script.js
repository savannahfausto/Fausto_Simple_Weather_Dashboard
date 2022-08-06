var cityNameEl = document.querySelector('#city-name');
var submitCityBtn = document.querySelector('#city-search');



//type in search city 

//when click/submit 
    //create box that contains
        //name of city (date) weathericon
        //temp:
        //wind:
        //humidity:
        //UV index: with colors for weather favorable, moderate, severe
    //create a 5-day-forecast:
        //5 cards
            //each card has 
                //date M/DD/YYYY
                //weather icon
                //temp
                //wind
                //humidity
//create button of each city search that can toggle between, add to history
//save 
function getWeather(lat, lon) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl) 
        .then (function (response) {
            return response.json();

        })
        .then (function (data) {
            console.log("data", data)
            //inital current day
            //5 day for loop
        })
}

submitCityBtn.addEventListener('click', function(event){
    event.preventDefault();
    var cityName = cityNameEl.value.trim();
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl)
        .then (function (response) {
            return response.json();

        })
        .then(function(data){
            console.log("data", data[0])
            getWeather(data[0].lat, data[0].lon);
        })

})
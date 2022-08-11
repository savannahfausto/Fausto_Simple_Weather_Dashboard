var cityNameEl = document.querySelector('#city-name');
var submitCityBtn = document.querySelector('#city-search');
var currentDayContainer = document.querySelector('#current-day-container');
var forecastContainer = document.querySelector('#forecast-container');





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
function getWeather(lat, lon, cityName) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl) 
        .then (function (response) {
            return response.json();

        })
        .then (function (data) {
            console.log("data", data);
            var currentDay = {
                city: cityName, 
                date: moment.unix(data.current.dt).format('dddd, MMMM Do YYYY'),
                icon: data.current.weather[0].icon,
                temp: ((((data.current.temp)-273.15)*1.8)+32).toFixed(2),
                wind: data.current.wind_speed,
                humidity: data.current.humidity,
                uvi: data.current.uvi,
            }

            createCurrentDayForecast(currentDay);
            //createFiveDayForecast(data);
    
        })
}

function createCurrentDayForecast(currentDay) {
    //console.log('currentDay', currentDay);
    currentDayContainer.setAttribute('class', 'card');
    var cardBodyEl = document.createElement('div');
    cardBodyEl.setAttribute('class', 'card-body');
    var cardHeadingEl = document.createElement('h2');
    var cardHeadingIcon = document.createElement('img');
    cardHeadingIcon.setAttribute('src', "http://openweathermap.org/img/w/" + currentDay.icon + ".png");
    cardHeadingEl.textContent = currentDay.city + ' (' + currentDay.date + ') ';

    var cardTemp = document.createElement('p');
    cardTemp.textContent = 'Temp: ' + currentDay.temp + ' ˚F';
    var cardWind = document.createElement('p');
    cardWind.textContent = 'Wind: ' + currentDay.wind + ' MPH';
    var cardHumidity = document.createElement('p');
    cardHumidity.textContent = 'Humidity: ' + currentDay.humidity + ' %';
    var cardUvi = document.createElement('p');
    cardUvi.textContent = 'UV Index: '
    var cardUviValue = document.createElement('p');
    cardUviValue.setAttribute('class', 'd-inline p-1 rounded text-white');
    cardUviValue.textContent = currentDay.uvi;

     if (cardUviValue.textContent > 7) {
            cardUviValue.setAttribute('style', 'background: red');
                
        } else if (cardUviValue.textContent <= 2) {
                cardUviValue.setAttribute('style', 'background: green');

        } else {
                cardUviValue.setAttribute('style', 'background: yellow');
        }

    cardHeadingEl.appendChild(cardHeadingIcon);
    cardUvi.appendChild(cardUviValue);
    cardBodyEl.appendChild(cardHeadingEl);
    cardBodyEl.appendChild(cardTemp);
    cardBodyEl.appendChild(cardWind);
    cardBodyEl.appendChild(cardHumidity);
    cardBodyEl.appendChild(cardUvi);
    currentDayContainer.appendChild(cardBodyEl);
}

// function createFiveDayForecast(data){
//     for (let i = 1; i < 6; i++) {
//         var forecastData = data.daily[i];
//         var forecast = {
//             date: moment.unix(forecastData.dt).format('L'),
//             icon: forecastData.weather[0].icon,
//             highTemp: ((((forecastData.temp.max)-273.15)*1.8)+32).toFixed(2),
//             lowTemp: ((((forecastData.temp.min)-273.15)*1.8)+32).toFixed(2),
//             wind: forecastData.wind_speed,
//             humidity: forecastData.humidity,
//         }
//         var forecastCard = document.createElement('div');
//         forecastCard.setAttribute('class', 'card column');
//         var cardBodyEl = document.createElement('div');
//         cardBodyEl.setAttribute('class', 'card-body');
//         var cardHeadingEl = document.createElement('h2');
//         cardHeadingEl.textContent = currentDay.city + ' (' + currentDay.date + ') ';
//         var cardHeadingIcon = document.createElement('img');
//         cardHeadingIcon.setAttribute('src', "http://openweathermap.org/img/w/" + currentDay.icon + ".png");
    
//         var cardTemp = document.createElement('p');
//         cardTemp.textContent = 'Temp: ' + currentDay.temp + ' ˚F';
//         var cardWind = document.createElement('p');
//         cardWind.textContent = 'Wind: ' + currentDay.wind + ' MPH';
//         var cardHumidity = document.createElement('p');
//         cardHumidity.textContent = 'Humidity: ' + currentDay.humidity + ' %';
//         var cardUvi = document.createElement('p');
//         cardUvi.textContent = 'UV Index: '
//         var cardUviValue = document.createElement('p');
//         cardUviValue.setAttribute('class', 'd-inline p-1 rounded text-white');
//         cardUviValue.textContent = currentDay.uvi;


//     }
// }        

submitCityBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = cityNameEl.value.trim();
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=ffe237b23dcad850efe02352dc9815ee';
    fetch (requestUrl)
        .then (function (response) {
            return response.json();

        })
        .then(function(data){
            console.log("data", data[0])
            getWeather(data[0].lat, data[0].lon, cityName);
        })
    cityNameEl.value = '';
})
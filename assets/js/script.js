var APIKey = "77d9b213504a58408f3d89d57b484a0d";
var city;
var cityNameSearch = document.querySelector("#cityName");
var searchButton = document.querySelector("#citySearch");
var currentDate = moment().format('YYYY-MM-DD');
console.log(currentDate);

function getWeather() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + APIKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = document.createElement('h3');
            var temp = document.createElement('p');
            var wind = document.createElement('p');
            var humidity = document.createElement('p');
            var uvIndex = document.createElement('p');
            cityName.innerHTML = data.name;
            temp.innerHTML = 'Temp: ' + (data.main.temp) + '&#176F';
            wind.innerHTML = 'Wind: ' + (data.wind.speed) + ' MPH';
            humidity.innerHTML = 'Humidity: ' + (data.main.humidity) + '%';
            weatherBlock.append(cityName);
            weatherBlock.append(temp);
            weatherBlock.append(wind);
            weatherBlock.append(humidity);
            var lat = (data.coord.lat);
            var lon = (data.coord.lon);
            var requestUvi = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&units=imperial&appid=' + APIKey;
            fetch(requestUvi)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var uviValue = data.current.uvi;
                    uvIndex.innerHTML = 'UV Index: ' + uviValue;
                    weatherBlock.append(uvIndex);
                })
        })

}

searchButton.addEventListener('click', function() {
    city = cityNameSearch.value;
    getWeather();
    cityNameSearch.value = "";
});

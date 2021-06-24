var APIKey = "77d9b213504a58408f3d89d57b484a0d";
var city;
var cityNameSearch = document.querySelector("#cityName");
var searchButton = document.querySelector("#citySearch");
var currentDate = moment().format('M/D/YYYY');
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
            var uvNumber = document.createElement('span');
            var todayIcon = (data.weather[0].icon);
            var todayIconImage = '<img src="http://openweathermap.org/img/wn/' + todayIcon + '.png" alt="" />';
            console.log(todayIconImage);
            cityName.innerHTML = data.name + ' (' + currentDate + ')' + todayIconImage;
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
                    if (uviValue <= 2.99) {
                        $(uvNumber).addClass('uvIndex green');
                    } else if (uviValue >= 3 && uviValue <= 5.99) {
                        $(uvNumber).addClass('uvIndex yellow');
                    } else if (uviValue >= 6 && uviValue <= 7.99) {
                        $(uvNumber).addClass('uvIndex orange');
                    } else if (uviValue >= 8 && uviValue <= 10.99) {
                        $(uvNumber).addClass('uvIndex red');
                    } else {
                        $(uvNumber).addClass('uvIndex violet');
                    }
                    uvNumber.innerHTML = uviValue;
                    uvIndex.textContent = 'UV Index: ';
                    uvIndex.append(uvNumber);
                    weatherBlock.append(uvIndex);
                })
        })

}

searchButton.addEventListener('click', function() {
    city = cityNameSearch.value;
    getWeather();
    cityNameSearch.value = "";
});

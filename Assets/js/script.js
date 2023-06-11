var forecastListEl = document.getElementById("forecast-list");
var cityEl = document.getElementById("city");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var searchButtonEl = $("#search-btn");
var searchBoxEl = $("#search-box");
var historyEl = $("#history");
var searchHistory = [];

function getWeatherData(cName){
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?appid=7745e5e71601cd29f319766e10670b02&q=${cName}&cnt=6&units=imperial`).
        then(function(response){
            if(response.status === 200){
                var formattedCName = cName;
                formattedCName = formattedCName.charAt(0).toUpperCase() + formattedCName.slice(1).toLowerCase();
                console.log(formattedCName)
                if(!searchHistory.includes(formattedCName)){
                    searchHistory.push(formattedCName);
                    localStorage.setItem("history", JSON.stringify(searchHistory));
                    updateSearchHistory();
                }
                else{
                    var targetIndex = searchHistory.findIndex(search => search === formattedCName);
                    var oldSearch = searchHistory.splice(targetIndex, 1);
                    searchHistory.push(oldSearch[0]);
                    localStorage.setItem("history", JSON.stringify(searchHistory));
                    updateSearchHistory();
                }
                
                return response.json();
            }
            else{
                console.log("Error: " + response.status);
                return;
            }
        }).then(function (data){
            var currentDay = data.list[0];
            cityEl.innerText = `${cName} (${dayjs.unix(currentDay.dt).format('M/DD/YYYY')})`;
            tempEl.innerText = 'Temp: ' + currentDay.temp.day + ' °F';
            windEl.innerText = 'Wind: ' + currentDay.speed + ' MPH';
            humidityEl.innerText = 'Humidity: ' + currentDay.humidity + '%';
            forecastListEl.innerHTML = '';
            for(var i = 1; i < data.list.length; i++){
                console.log(data.list[i]);


                var forecastDay = data.list[i]; 

               
                var forecastDayLi = document.createElement('li');
                var date = document.createElement('p');
                var weatherImg = document.createElement('img');
                var temp = document.createElement('p');
                var wind = document.createElement('p');
                var humidity = document.createElement('p');

                
                date.innerText = dayjs.unix(forecastDay.dt).format('M/DD/YYYY');
                weatherImg.src = `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`
                temp.innerText = 'Temp: ' + forecastDay.temp.day + ' °F';
                wind.innerText = 'Wind: ' + forecastDay.speed + ' MPH';
                humidity = 'Humidity: ' + forecastDay.humidity + '%';

                
                forecastDayLi.classList.add('day','d-inline', 'border' ,'border-black' ,'bg-dark' ,'text-light', 'p-3');
                date.classList.add('fw-bold');
                weatherImg.classList.add('float-left', "img-fluid", "w-50");
                
                forecastDayLi.append(date);
                forecastDayLi.append(weatherImg);
                forecastDayLi.append(temp);
                forecastDayLi.append(wind);
                forecastDayLi.append(humidity);
                forecastListEl.append(forecastDayLi);

            }
        });
}

function updateSearchHistory(){
    historyEl.children().remove();
    if(localStorage.getItem("history")){
        searchHistory = JSON.parse(localStorage.getItem("history"));
        searchHistory.forEach(search => {
            var newBtn = $("<li>").text(search).addClass("btn btn-secondary my-1");
            newBtn.on("click", function(){
                getWeatherData(search);
            })
            historyEl.prepend(newBtn);
        });
    }
    else{
        console.log("No search history found!")
    }
}


searchButtonEl.on("click", function(){
    getWeatherData(searchBoxEl.val());
    console.log(searchHistory)
})

updateSearchHistory();
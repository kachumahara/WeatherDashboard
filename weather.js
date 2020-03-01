$(document).ready(function(){
    var apikey = 'd902a298fbf27783a3efb9503fa1c23a';
    // calling event to grab and display weather status
    $('searchbtn').om('click', function(event) {
        var searchValue = $('#search-input').val();

        $('#search-input').val('');

        searchWeather(searchValue);
    });

    //grab and display search history
    $('.history').on('click', 'li', function() {
        searchWeather($(this).text());
    });

    function historyRow() {
        var li = $('<li>').addClass('list-group-item').text(text);
        $('history').append(li);
    }

    function searchWeather(SearchValue) {
        //function to create Ajax call from search input for weather status
        $.ajax({
            type: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' +
            searchValue +
            '&appid=' +
            apikey +
            '&units=imperial',
            dataType: 'JSON',
            success: function(data) {
                //create history link for the search
                if (history.indexOf(searchValue) === -1) {
                    history.pushState(searchValue);
                    history.push(searchValue);
                    window.localStorage.setItem('history', JSON.stringify(history));

                    makeRow(searchValue);

                }
                
                //clear old content
                $('#weathernow').empty();

                //current weather display on weathernow div.
                var title = $('<h3>').addClass('card-title').text(data.name + ' (' + new Date().toLocaleDateString() + ')');
                var card = $('<div>').addClass('card');
                var wind = $('<p>').addClass('card-text').text('Wind Speed: ' + data.wind.speed + 'MPH');
                var humid = $('<p>').addClass('card-text').text('Humidity: ' + data.main.humidity + '%');
                var temp = $('<p>').addClass('card-text').text('Temperature: ' + data.main.temp + '°F');
                var img = $('<img>').att('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + 'png');

                // merge annf append to page
                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $('#weathernow').append(card);

                getForecast(searchValue);
                getUVIndex(data.coord.lat, data.coord.lon);
            
            },

        });
    }
    // AJAX call to get forecast information
    function getForecast(searchValue) {
        $.ajax({
            type: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=' + apikey,
            dataType: 'json',
            success: function(data){
                $('#forecast')
            }
        })
    }
})
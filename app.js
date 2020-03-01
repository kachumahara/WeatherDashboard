// html document is ready to function
$(document).ready(function() {
    var apikey = 'd902a298fbf27783a3efb9503fa1c23a';
    // calling event to grab and display weather status
    $('searchbtn').on('click', function(event) {
        var searchValue = $('#search-input').val();

        $('#search-input').val('');

        searchWeather(searchValue);
    });

    //grab and display search history
    $('.history').on('click', 'li', function() {
        searchWeather($(this).text());
    });

    function makeRow(text) {
        var li = $('<li>').addClass('list-group-item list-group-item-action').text(text);
        $('.history').append(li);
    }

    function searchWeather(searchValue) {
        //function to create Ajax call from search input for weather status
        $.ajax({
            type: 'GET',
			url:
				'https://api.openweathermap.org/data/2.5/weather?q=' +
				searchValue +
				'&appid=' +
				apikey +
				'&units=imperial',
			dataType: 'json',
            success: function(data) {
                //create history link for the search
                if (history.indexOf(searchValue) === -1) {
                   
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
                var cardBody = $('<div>').addClass('card-body');
                var img = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');

                // merge and append to page
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
			url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=' + apikey,
            dataType: 'json',
            success: function(data){
                $('#forecast').html('<h4 class="> 5-Day Forecast:</h4>').append('<div class="row">');

                //loop over all forecasts
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
                        var col = $('<div>').addClass('col-md-2');
                        var card = $('<div>').addClass('card bg-secondary text-white');
                        var body = $('<div>').addClass('card-body p-2');
                        var title = $('<h4>').addClass('card-text').text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var img = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.list[1]. weather[0].icon + '.png'
                        );
                        var p1 = $('<p>').addClass('card-text').text('Temp: ' + data.list[i].main.temp_max + ' °F');
                        var p2 = $('<p>').addClass('card-text').text('humidity: ' + data.list[i].main.humidity + '%');

                        col.append(card.append(body.append(title, img, p1, p2)));
                        $('#forecast .row').append(col);


                    }
                }
            },
        });
    }
//Ajax call to get UV Index information
function getUVIndex(lat, lon) {
    $.ajax({
        type: 'GET',
        url:
            'https://api.openweathermap.org/data/2.5/uvi?appid=d902a298fbf27783a3efb9503fa1c23a&lat=' +
            lat +
            '&lon=' +
            lon,
        dataType: 'json',
        success: function(data) {
            var uv = $('<p>').text('UV Index: ');
            var btn = $('<span>').addClass('btn btn-sm').text(data.value);

            if(data.value < 3) {
                btn.addClass('btn-success');
                } else if(data.value < 7) {
                    btn.addClass('btn-warning');
                }
                else {
                    btn.addClass('btn-danger')
                }
                $('#weathernow .card-body').append(uv.append(btn));
        },
    });
}
var history = JSON.parse(window.localStorage.getItem('history')) || [];
if (history.length > 0) {
    searchWeather(history[history.length - 1]);
}
for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
}
});

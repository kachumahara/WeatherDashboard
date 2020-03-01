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
            }

        })
    }
})
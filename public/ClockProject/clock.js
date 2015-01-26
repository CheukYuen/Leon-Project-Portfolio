"use strict";

$(window).on('hashchange', function () {

    var hash = window.location.hash;

    hidePageWithId('#worldclock');
    hidePageWithId('#timer');
    hidePageWithId('#stopwatch');


    $('.page').removeClass('show');


    if (hash === '#stopwatch') {
        $('#stopwatch').addClass('show');
        //make it red
        $('#sw').addClass('selected');
    }
    if (hash === '#worldclock') {
        $('#worldclock').addClass('show');
        $('#wc').addClass('selected');
    }
    if (hash === '#timer') {
        $('#timer').addClass('show');
        $('#tm').addClass('selected');
    }


});

function hidePageWithId(id) {

    //$(id).hide();
    $(id + '-link').removeClass('selected');
}


function addPrefix(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}

//----------------------------------Timer----------------------------------


var _sec = 59;


function countDownTimer() {
    var _hour = parseInt($('#hour').text());
    var _min = parseInt($('#minutes').text());

    $('#second').text(addPrefix(_sec));
    if (_hour > 0 || _min > 0 || _sec > 0) {
        _sec--;
        if (_sec < 0) {
            _sec = 59;
            _min--;
            if (_min < 0) {
                _min = 59;
                _hour--;
                $('#hour').text(addPrefix(_hour));
            }
            $('#minutes').text(addPrefix(_min));

        }
    } else {
        clearInterval(timer);
    }
}

function resume() {
    timer = setInterval('countDownTimer()', 1000);
}


$('#timer .button-start.left-button').click(function () {
    var state = $(this).text();
    //console.error('second');
    if (state === 'Start') {
        //change time display mode from set to count
        var hour = $('.hours').val();
        var min = $('.minutes').val();
        _sec = 59;

        if (hour !== '0' || min !== '0') {
            $('.inputs').css('display', 'none');
            $('#timer  .counter').css('display', 'block');
            //running state
            //change the two buttons
            $(this).css({'color': 'red', 'border-color': 'red'});
            $(this).text('Cancel');
            //enable the button
            $('#colon').show();
            $('.button-pause.right-button').removeClass('disabled');
            if (hour !== '0') {
                $('#hour').text(addPrefix(hour));
            } else {
                $('#hour').empty();
                $('#colon').hide();
            }
            $('#minutes').text(addPrefix(min - 1));

            $('#second').text(addPrefix(_sec));
            timer = setInterval('countDownTimer()', 1000);
        }
    } else {
        //cancel the clock
        clearInterval(timer);//?
        $('.inputs').css('display', 'block');
        $('#timer .counter').css('display', 'none');
        $(this).css({'color': 'green', 'border-color': 'green'});
        $(this).text("Start");
        $('#timer .button-pause.right-button').text('Pause');
        $('#timer .button-pause.right-button').addClass('disabled');
    }
});


$('#timer .button-pause.right-button').click(function () {
    //resume state
    var state = $(this).text();
    var disabled = $(this).hasClass('disabled');
    if (!disabled) {
        if (state === 'Pause') {
            clearInterval(timer);
            $(this).text('Resume');
        } else {
            $(this).text('Pause');
            resume();
        }
    }
});

var timer = setInterval(function () {
    //console.log('1s');
}, 10000);


//-------------------------------World Clock------------------------------------

var WorldClock ={


    worldClockdata:  [
        {
            cityName: 'Cupertino',
            timezoneOffset: -480
        },
        {
            cityName: 'Stockholm',
            timezoneOffset: 60
        },
        {
            cityName: 'São Paulo',
            timezoneOffset: -180
        },
        {
            cityName: 'Tokyo',
            timezoneOffset: 540
        },
        {
            cityName: 'New York',
            timezoneOffset: -300
        },
        {
            cityName: 'Bucharest',
            timezoneOffset: 120
        }
    ],

    setWorldClock: function(){

    },

    init: function(){

    }

};

var worldClockData = [
    {
        cityName: 'Cupertino',
        timezoneOffset: -480
    },
    {
        cityName: 'Stockholm',
        timezoneOffset: 60
    },
    {
        cityName: 'São Paulo',
        timezoneOffset: -180
    },
    {
        cityName: 'Tokyo',
        timezoneOffset: 540
    },
    {
        cityName: 'New York',
        timezoneOffset: -300
    },
    {
        cityName: 'Bucharest',
        timezoneOffset: 120
    }
];




function setWorldClock() {
    $('.worldclock-list').empty();
    $.each(worldClockData, function (index, value) {
        var currTime = new Date();
        var n = currTime.getTimezoneOffset();
        var ahead = (value.timezoneOffset + n) / 60;
        var gap = currTime.getHours() + ahead;
        currTime.setHours(gap);


        var today_tmr = '';
        var time_str = '';
        var ahead_time = '';

        if (gap > 24) {
            today_tmr = 'Tomorrow';
        } else {
            today_tmr = 'Today';
        }

        if (ahead !== 0) {
            ahead_time = ', ';
            if (ahead > 0) {
                ahead_time += ahead + ' hours ahead';
            } else {
                ahead_time += ahead + ' hours late';
            }

        }

        //change to 12 hour-format
        var hour = currTime.getHours();
        var min = currTime.getMinutes();
        var second = currTime.getSeconds();
        if (hour >= 12) {
            time_str = 'PM';
        } else {
            time_str = 'AM';
        }

        hour = hour % 12;
        if (hour === 0) {
            hour += 12;
        }

        time_str = hour + ':' + addPrefix(min)+ ':'+ addPrefix(second) + ' ' + time_str;

        $('.worldclock-list').append('<li><p class="city">'
        + value.cityName
        + '</p><p class="time-details"><strong>'
        + today_tmr + '</strong>'
        + ahead_time + '</p><p class="time">'
        + time_str + '</p></li>');

    });

}

setInterval(function(){

    setWorldClock();
},1000);

//run every 1 secs




//--------------------Stopwatch----------------------------

var Stopwatch = {

    isRunning: false,
    startTime: null,
    lapTime: null,
    ellapsedTime: 0,
    ellapsedlapTime: 0,
    timeInterval: 10,

    handleLeftButton: function () {
        if (this.isRunning) {// this is global or in function
            this.stop();
        } else {
            this.start();
        }
    },

    handleRightButton: function () {
        if (this.isRunning) {
            this.lap();
        } else {
            this.reset();
        }
    },

    start: function () {
        var self = this;
        $('#stopwatch .left-button').removeClass('button-start').addClass('button-stop').html('Stop');
        $('#stopwatch .right-button').removeClass('disabled').addClass('button-lap').html('Lap');

        self.startTime = new Date().getTime();
        self.lapTime = new Date().getTime();

        self.startTime -= self.ellapsedTime;
        self.lapTime -= self.ellapsedlapTime;

        this.isRunning = true;

        setTimeout(function () {
            self.handleTimer();
        }, this.timeInterval);

    },

    stop: function () {
        this.isRunning = false;
        $('#stopwatch .left-button').removeClass('button-stop').addClass('button-start').html('Start');
        $('#stopwatch .right-button').removeClass('button-lap-enabled').addClass('button-reset').html('Reset');
    },

    lap: function () {
        var lapTime = this.lapTime;

        $('#stopwatch ul').prepend([
            '<li>',
            '<p class="lap-label">Lap', $('#stopwatch ul').children().length + 1, '</p>',
            '<p class="lap-time">', this.formatTimeFormMilliseconds(new Date().getTime() - lapTime), '</p>',
            '</li>'
        ].join(''));

        this.lapTime = new Date().getTime();
    },

    reset: function () {
        this.ellapsedTime = 0;
        this.ellapsedlapTime = 0;
        $('#stopwatch .counter .total-time').html(this.formatTimeFormMilliseconds(0));
        $('#stopwatch .counter .lap-time').html(this.formatTimeFormMilliseconds(0));
        $('#stopwatch ul').html('');
        $('#stopwatch .right-button').removeClass('button-lap-enabled').removeClass('button-reset').addClass('disabled').html('Lap');
    },

    handleTimer: function () {
        var now = new Date().getTime(),
            startTime = this.startTime,
            lapTime = this.lapTime,
            self = this;

        $('#stopwatch .counter .total-time').html(this.formatTimeFormMilliseconds(now - startTime));
        $('#stopwatch .counter .lap-time').html(this.formatTimeFormMilliseconds(now - lapTime));

        self.ellapsedTime = now - startTime;
        self.ellapsedlapTime = now - lapTime;

        if (self.isRunning) {
            setTimeout(function () {
                self.handleTimer();
            }, this.timeInterval);
        }
    },

    formatTimeFormMilliseconds: function (milliseconds) {

        var minutes = parseInt((milliseconds / 60 / 1000), 10),
            seconds = parseInt(milliseconds / 1000, 10) - minutes * 60,
            tenths = parseInt((milliseconds - seconds * 1000 - minutes * 60000) / 10, 10);

        return addPrefix(minutes) + ':' + addPrefix(seconds) + '.' + addPrefix(tenths);
    },

    init: function () {

        var self = this;
        $('#stopwatch .left-button').click(function () {
            self.handleLeftButton();
        });

        $('#stopwatch .right-button').click(function () {
            self.handleRightButton();
        });

    }
};


$(window).ready(function () {
    Stopwatch.init();

});
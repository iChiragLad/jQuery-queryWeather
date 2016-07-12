//Utility
if (typeof Object.create !== 'function') {
    Object.create = function (proto) {
        function F() { };
        F.prototype = proto;
        return new F();
    }
}

(function ($, window, document, undefined) {

    var OpenWeather = {
        init: function (input, elem) {

            var self = this;

            self.elem = elem;
            self.$givenElement = $(elem);
            self.url = "http://api.openweathermap.org/data/2.5/weather";
            self.accessKey = "476677f2220b4c3e870ca69f177c5ba3";
            self.weatherDs = {
            };

            if (typeof input === 'string' ) {
                self.searchCity = input;
            } else {
                self.searchCity = input.searchCity;
            }

            self.options = $.extend({}, $.fn.queryWeather.options, input);
            self.refresh(1);
        },

        refresh: function (initial) {
            var self = this;
            setTimeout(function () {
                self.fetch().done(function (result) {
                    self.populate(result);
                    self.display();

                    if (typeof self.options.onComplete === 'function') {
                        self.options.onComplete.apply(self.elem, arguments)
                    }

                    if(self.options.refreshRate !== null)
                    {
                        self.refresh();
                    }
                })
            }, initial || self.options.refreshRate )
        },

        fetch: function () {
            var self = this;
            return $.ajax({
                url: this.url,
                data: {q:this.searchCity, APPID:this.accessKey},
                method: 'get',
                dataType: 'json',
            });
        },

        populate: function (result) {
            var self = this;
            self.weatherDs.city = result.name;
            self.weatherDs.country = result.sys.country;
            self.weatherDs.windSpeed = result.wind.speed;
            self.weatherDs.temperature = result.main.temp;
            self.weatherDs.pressure = result.main.pressure;
            self.weatherDs.humidity = result.main.humidity;
            self.weatherDs.description = result.weather[0].description;
        },

        display: function () {
            var self = this;
            self.$givenElement.slideUp();
            self.$givenElement.contents().remove();
            $.each(self.weatherDs, function (key, value) {
               self.$givenElement.append("<b> " + key + " : </b>" + value + "<br>");
            });
            self.$givenElement.slideDown();
        }
    }

    $.fn.queryWeather = function (input) {
        return this.each(function () {
            var weather = Object.create( OpenWeather );
            weather.init(input, this);

        });
    };

    $.fn.queryWeather.options = {
        searchCity: "Pune",
        refreshRate: null,
        onComplete: null,
    }
})(jQuery, window, document);
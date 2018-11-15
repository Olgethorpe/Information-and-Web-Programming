$(document).ready(
    init
);
/**
 * Initalize webpage functionality
 * */
function init() {
    var deg = String.fromCharCode(176);
    var city, country; 
    var cbsVal = ['F', 'C', 'K'];
    var cbs = ['imperial', 'metric', 'kelvin'];
    $(".formInput").submit(
        function (e) {
            e.preventDefault();
        }
    );
    
    $(".country").val("US");
    $(".city").val("Manhattan");
    $(".subBtn").val("Submit");
    $(".cb").attr("type", "checkbox");
    $(".cb").each(
        function (index) {
            $(this).attr("id", "cb" + index);
        }
    );
    $("#cb0").prop("checked", true);
    $(".lbl").each(
        function (index) {
            $(this).attr("for", "cb" + index);
            $(this).html(cbsVal[index] + deg);
        }
    );
    $(".subBtn").click(
        function () {
            country = $(".country").val();
            city = $(".city").val();
            $(".cb").each(
                function (index) {
                    if ($(this).is(":checked"))
                       metric = cbs[index];
                }
            );
            requestData(country, city, metric);
        }
    );
    $(".cb").click(
        function () {
            var currCb = $(this).attr("id");
            $(".cb").each(
                function (index) {
                    if ($(this).attr("id") === currCb)
                        $(this).prop("checked", true);
                    else
                        $(this).prop("checked", false);
                }
            );
        }
    );
    city = $(".city").val();
    country = $(".country").val();
    requestData(country, city, "imperial");
}

/**
 * Request data from openweathermap api and set results where needed
 * 
 * @param {string} country The country to lookup
 * @param {string} city The city to lookup
 * @param {string} metric The temperature unit
 * */
function requestData(country, city, metric) {
    var deg = String.fromCharCode(176);
    $.ajax(
        {
            url: "https://api.openweathermap.org/data/2.5/find?",
            type: "GET",
            dataType: "JSON",
            data: {
                q: city,
                units: metric,
                appid: "187de0232f5a47fed6fa6d762a497a69"
            },
            success: function (data) {
                temp = getAvg(data, country, "temp") 
                $(".temp").text(
                   temp + deg
                );
                if (metric === "imperial") 
                    if (temp > 75)
                        $(".temp").css("color", "#E77060");
                    else if (temp < 50)
                        $(".temp").css("color", "#43A6D4");
                    else
                        $(".temp").css("color", "#2A4B2E");
                else if (metric === "metric")
                    if (temp > 24)
                        $(".temp").css("color", "#E77060");
                    else if (temp < 10)
                        $(".temp").css("color", "#43A6D4");
                    else
                        $(".temp").css("color", "#2A4B2E");
                else if (metric === "kelivin")
                    if (temp > 297)
                        $(".temp").css("color", "#E77060");
                    else if (temp < 283)
                        $(".temp").css("color", "#43A6D4");
                    else
                        $(".temp").css("color", "#2A4B2E");
                $(".humidity").html(
                    getAvg(data, country, "humidity") + "%"
                );
                $(".pressure").html(
                    getAvg(data, country, "pressure") + "kPa"
                );
                $(".rangeT").html(
                    getAvg(data, country, "temp_min") + deg + "-" + getAvg(data, country, "temp_max") + deg
                );
                $(".weather").html(
                    data.list[0].weather[0].main
                );
            },
            error: function (data, txtStat, err) {
                alert("Your query did not return a result, try again");
            }
        }
    );
}

/**
 * Get the average value for some key
 * 
 * @param {json} data The data structure containing the data
 * @param {string} country The country to cross reference
 * @param {string} key The value being averaged
 * 
 * @returns {float} The average key value
 * */
function getAvg(data, country, key) {
    var values = [];
    var value = 0;
    for (var i = 0; i < data.list.length; ++i)
        if (data.list[i].sys.country === country) {
            values.push(data.list[i].main[key]);
            value += data.list[i].main[key];
        }
    return Math.round(value / values.length);
}
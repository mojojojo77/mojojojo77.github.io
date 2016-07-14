// Javascript and JQuery here
$(document).ready(function(){
//Variables here
	var forecastIconClass = "wi-forecast-io-";
	var tempForecastIconClass = forecastIconClass;
	var tempCelsius;
	var currentTimeUnix;
	var currentTime;
	var lat;
	var lon;

// Check if local or global
	$("#city").keyup(function(){
		if($("#city").val() !== ""){
			$("#enterButton").html("Search");
			}
		else{
			$("#enterButton").html("For Your City");
			}
		});
				
// If Button is pressed
	$("#enterButton").click(function(){
		$(document).ajaxStart(function(){
			$(".contents").hide();
			$(".contents-loading").show();
			$("#forecastIcon").removeClass(forecastIconClass);
			forecastIconClass = tempForecastIconClass;
			});
		if($("#city").val() !== ""){
			globalWeatherFunction();
			}
		else{
			localWeatherFunction();
			}
		});
// Local Weather Function
	function localWeatherFunction(){
		var time = moment();
		dateString = time.format("MMM Do h:mm a");
		$.ajax({
			url:"https://freegeoip.net/json/",
			dataType:"json",
			success: function(data){
				lat = data.latitude;
				lon = data.longitude;
				$.ajax({
					url: " https://crossorigin.me/https://api.forecast.io/forecast/938ea9c32b67be8a23ed0c908a4368a8/"+lat+","+lon,
					dataType:"json",
					success: function(data_1){
						forecastIconClass += data_1.currently.icon;
						tempCelsius = data_1.currently.temperature;
						windBearing = data_1.currently.windBearing;
						windSpeed = data_1.currently.windSpeed;
						},
					complete: function(){
						$(".contents-loading").hide();
						$(".contents").show();
						$("#forecastIcon").addClass(forecastIconClass);
						$(".temp").html(Math.floor(tempCelsius) + "<i class=\"wi wi-celsius\">");
						$(".date").html(dateString);
						$(".wi-wind").addClass("towards-"+Math.floor(windBearing)+"-deg");
						$(".speed").html(Math.floor(windSpeed)+"m/s");					
						},
					});
				},
			});
		}
// Global Weather Function
	});

// urlF = "https://api.forecast.io/forecast/938ea9c32b67be8a23ed0c908a4368a8/"+lat+","+lon+"?exclude=[currently, minutely, hourly, daily, alerts, flags]&units=si";

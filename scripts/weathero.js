// Javascript and JQuery here
$(document).ready(function(){
//Variables here
	var urlOWM;
	var urlGMA
	var userCity;
	var weatherIconClass = "wi-owm-";
	var tempWeatherIconClass = weatherIconClass;
	var celsius;
	var currentTimeUnix;
	var currentTime;
	var timestamp;
	var timezone;

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
			});
		$(document).ajaxComplete(function(){
			$(".contents-loading").hide();
			$(".contents").show();
			});
		$.ajaxSetup({async:false});
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
		var hour = time.format("HH");
		dateString = time.format("MMM Do h:mm a");
		$("#weatherIcon").removeClass(weatherIconClass);
		weatherIconClass = tempWeatherIconClass;
		if(hour > 6 && hour < 21){
			weatherIconClass += "day-";
			}
		else{
			weatherIconClass += "night-";	
			}
		$.getJSON("http://freegeoip.net/json/",status,function(data){
			lat = data.latitude;
			lon = data.longitude;
			});
		urlOWM = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=f0deccd8666bd85749986f9353b61001";
		$.getJSON(urlOWM,status,function(data){
			weatherIconClass += data.weather[0].id;
			celsius = Math.floor(data.main.temp - 273.15);
			$("#weatherIcon").addClass(weatherIconClass);
			$(".temp").html(celsius + "<i class=\"wi wi-celsius\">");
			$(".date").html(dateString);
			$(".wi-wind").addClass("towards-"+Math.floor(data.wind.deg)+"-deg");
			$(".speed").html(Math.floor(data.wind.speed)+"m/s");
			});
		}
// Global Weather Function
	function globalWeatherFunction(){
		timestamp = 0;
		$("#weatherIcon").removeClass(weatherIconClass);
		weatherIconClass = tempWeatherIconClass;
		userCity = $("#city").val();
		urlOWM = "http://api.openweathermap.org/data/2.5/weather?q="+userCity+"&APPID=f0deccd8666bd85749986f9353b61001";
		$.getJSON(urlOWM,status,function(data){
			urlGMA = "https://maps.googleapis.com/maps/api/timezone/json?location="+data.coord.lat+","+data.coord.lon+"&timestamp="+timestamp+"&key=AIzaSyDhay8OvZIBWL-uoedWMapcfH3J7DLvxkM";
			$.getJSON(urlGMA,status,function(result){
				timezone = result.timeZoneId;
				});
			currentTime = moment().tz(timezone);
			if(currentTime.format("HH") > 6 && currentTime.format("HH") < 21){
				weatherIconClass += "day-";
				}
			else{
				weatherIconClass += "night-";	
				}
			weatherIconClass += data.weather[0].id;
			celsius = Math.floor(data.main.temp - 273.15);
			$("#weatherIcon").addClass(weatherIconClass);
			$(".temp").html(celsius + "<i class=\"wi wi-celsius\">");
			$(".date").html(currentTime.format("MMM Do YYYY hh:mm a"));
			$(".wi-wind").addClass("towards-"+Math.floor(data.wind.deg)+"-deg");
			$(".speed").html(Math.floor(data.wind.speed)+"m/s");
			});
		}
	});


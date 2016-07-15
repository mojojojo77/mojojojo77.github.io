// Javascript and jQuery here
$(document).ready(function(){
// Variables here
	var lat;
	var lon;
	var urlOWM;
	var temperature; 
	var windSpeed;
	var windDeg;
	var convertedTemp;
	var weatherIconClass = "wi-owm-";
	var tempWeatherIconClass = weatherIconClass;
// Field blank or not
	$("#city").keyup(function(){
		if($("#city").val() === ""){
			$("#enterButton").html("For Your City");
		}
		else{
			$("#enterButton").html("Search");			
		}
	});

// Go to function  
	$("#enterButton").click(function(){
		$.ajaxSetup({async:false});
		$(document).ajaxStart(function(){
			$("#weatherIcon").removeClass(weatherIconClass);
			$(".wi-wind").removeClass("wi-wind.towards-"+windDeg+"-deg");
			$(".contents").hide();
			$(".contents-loading").show();
		});
		$(document).ajaxComplete(function(){
			$(".contents-loading").hide();
			$(".contents").show();
		});
		if($("#city").val() === ""){
			localWeatherFunction();
		}
		else{
			globalWeatherFunction();
		}
	});
	// Local weather function 
	function localWeatherFunction(){
		weatherIconClass = tempWeatherIconClass;
		var time = moment();
		if(time.format("HH") < 20 && time.format("HH") > 6){
			weatherIconClass += "day-";
		}else{
			weatherIconClass += "night-";
		}
		$.getJSON("https://freegeoip.net/json/",function(data){
			lat = data.latitude;
			lon = data.longitude;
		});
		urlOWM = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=f0deccd8666bd85749986f9353b61001"; 
		$.getJSON(urlOWM, function(data){
			weatherIconClass += data.weather[0].id;
			temperature = Math.floor(convert(data.main.temp,"kelvin","celsius"));
			windSpeed = Math.floor(data.wind.speed);
			windDeg = Math.floor(data.wind.deg);
			alert(weatherIconClass);
			$("#weatherIcon").addClass(weatherIconClass);
			$(".temp").html(temperature + "<i class = \"wi wi-celsius\"></i>");
			$(".date").html(time.format("MMM Do hh:mm a"));
			$(".speed").html(windSpeed + "m/s");
			$(".wi-wind").addClass("towards-"+Math.floor(data.wind.deg)+"-deg");
		});
	}
// Global weather function
	function globalWeatherFunction(){
		
	}
// Convert between celsius, kelvin and fahrenheit
	function convert(temp, tempUnit, conversionUnit){
		switch(tempUnit){
			case "kelvin":
				if(conversionUnit === "celsius"){
					convertedTemp = temp - 273.15;
				}
				else if(conversionUnit === "fahrenheit"){
					convertedTemp = (temp*9/5) - 459.67;
				}
				break;
			case "celsius":
				if(conversionUnit === "kelvin"){
					convertedTemp = temp + 273.15
				}
				else if(conversionUnit === "fahrenheit"){
					convertedTemp = (temp*9/5) + 32;
				}
				break;
			case "fahrenheit":
				if(conversionUnit === "kelvin"){
					convertedTemp = (temp + 459.67)*5/9;
				}
				else if(conversionUnit === "celsius"){
					convertedTemp = (temp -32)*5/9;
				}
				break;
		}
		return convertedTemp;
	}
});


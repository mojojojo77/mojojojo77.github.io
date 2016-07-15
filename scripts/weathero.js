// Javascript and jQuery here
$(document).ready(function(){
// Variables here
	var lat;
	var lon;
	var urlOWM;
	var urlGMA;
	var userCity;
	var temperature; 
	var windSpeed;
	var windDeg;
	var convertedTemp;
	var timezone;
	var dateString;
	var time;
	var weatherIconClass = "wi-owm-";
	var windDegClass = "towards-";
	var tempWeatherIconClass = weatherIconClass;
	var tempWindDegClass = windDegClass;
// Field blank or not
	$("#city").keyup(function(){
		if($("#city").val() === ""){
			$("#enterButton").html("For Your City");
		}
		else{
			$("#enterButton").html("Search");			
		}
	});

// Temperature cursor
	$(".temp").on({
		mouseenter: function(){
			$(".temp").css({"cursor":"pointer", "text-shadow":"2px 2px 5px #375877"});
		},
		mouseleave: function(){
			$(".temp").css({"text-shadow":"none"});
		}
	});

// Go to function  
	$("#enterButton").click(function(){
		if($("#city").val() === ""){
			localWeatherFunction();
		}
		else{
			userCity = $("#city").val();
			globalWeatherFunction();
		}
	});
	// Local weather function 
	function localWeatherFunction(){
		$.ajax({
			async : true,
			dataType: "json",
			method: "get",
			url : "https://freegeoip.net/json/",
			beforeSend : function(){
				$(".contents").hide();
				$(".contents-loading").show();
			},
			success : function(data){		
				lat = data.latitude;
				lon = data.longitude;
				urlOWM = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=f0deccd8666bd85749986f9353b61001"; 
				$.ajax({
					async : true,
					dataType: "json",
					method: "get",
					url : urlOWM,
					beforeSend : function(){
						$(".weatherIcon").removeClass(weatherIconClass);
						$(".wi-wind").removeClass(windDegClass);	
						weatherIconClass = tempWeatherIconClass;
						windDegClass = tempWindDegClass;
					},
					success : function(data_1){
						timeFunction();
						temperature = Math.floor(convert(data_1.main.temp,"kelvin","celsius"));
						windSpeed = Math.floor(data_1.wind.speed);
						weatherIconClass += data_1.weather[0].id;
						windDegClass += Math.floor(data_1.wind.deg) + "-deg";
					},
					complete : function(){
						$(".temp").html(temperature + "<i class = \"wi wi-celsius\"></i>");
						$(".date").html(time.format("MMM Do hh:mm a"));
						$(".speed").html(windSpeed + "m/s");
						$(".weatherIcon").addClass(weatherIconClass);
						$(".wi-wind").addClass(windDegClass);												
					},		
				});
			},
			complete : function(){
				$(".contents-loading").hide();				
				$(".contents").show();
			}
		});
	}
// Global weather function
	function globalWeatherFunction(){
		$.ajax({
			async : true,
			dataType: "json",
			method: "get",
			url : "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q="+userCity+"&APPID=f0deccd8666bd85749986f9353b61001",
			beforeSend : function(){
				$(".contents").hide();
				$(".contents-loading").show();
			},
			success : function(data){	
				temperature = Math.floor(convert(data.main.temp,"kelvin","celsius"));
				windSpeed = Math.floor(data.wind.speed);
				windDegClass += Math.floor(data.wind.deg) + "-deg";	
				dataWeatherId = data.weather[0].id;
				lat = data.coord.lat;
				lon = data.coord.lon;
				$.ajax({
					async : true,
					dataType: "json",
					method: "get",
					url : "https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lon+"&timestamp=0&key=AIzaSyDhay8OvZIBWL-uoedWMapcfH3J7DLvxkM",					
					beforeSend : function(){
						$(".weatherIcon").removeClass(weatherIconClass);
						$(".wi-wind").removeClass(windDegClass);	
						weatherIconClass = tempWeatherIconClass;
						windDegClass = tempWindDegClass;
					},
					success : function(data_1){
						timezone = moment().tz(data_1.timeZoneId);
						if(timezone.format("HH") < 20 && timezone.format("HH") > 6){
							weatherIconClass += "day-";
						}else{
							weatherIconClass += "night-";			
						}
					},
					complete : function(){
						weatherIconClass += dataWeatherId;
						$(".temp").html(temperature + "<i class = \"wi wi-celsius\"></i>");
						$(".date").html(timezone.format("MMM Do hh:mm a"));
						$(".speed").html(windSpeed + "m/s");
						$(".weatherIcon").addClass(weatherIconClass);
						$(".wi-wind").addClass(windDegClass);		
					}
				});
			},
			complete : function(){	
				$(".contents-loading").hide();				
				$(".contents").show();										
			},		
		});
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
// Time Function 
	function timeFunction(){
		time = moment();
		if(time.format("HH") < 20 && time.format("HH") > 6){
			weatherIconClass += "day-";
		}else{
			weatherIconClass += "night-";
		}		
	}
});


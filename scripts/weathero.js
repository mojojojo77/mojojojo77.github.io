// Javascript and jQuery here
$(document).ready(function(){
// Variables here
	var lat;
	var lon;
	var urlOWM;
	var urlGMA;
	var temperature; 
	var windSpeed;
	var windDeg;
	var convertedTemp;
	var timezone;
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

// Go to function  
	$("#enterButton").click(function(){
		if($("#city").val() === ""){
			localWeatherFunction();
		}
		else{
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
						$("#weatherIcon").removeClass(weatherIconClass);
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
						alert(weatherIconClass);
						$("#weatherIcon").addClass(weatherIconClass);
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
	function globalWeatherFunction(){}
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


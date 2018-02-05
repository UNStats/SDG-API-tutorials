//================================================
// Problem: Put together a set of tab-delimited files 
// that indicate the series available for each
// geographic Area in the Global SDG Indicators database.
//================================================

var _ = require('underscore');
var fs = require('fs')
 https = require('https');

//------------------------------------------------
// Limit the maximum number of concurrent sockets in node:
//   https://gregjs.com/javascript/2015/how-to-scrape-the-web-gently-with-node-js/
//   This is necessary to avoid getting ECONNRESET and socket hang up errors
//------------------------------------------------

   https.globalAgent.maxSockets = 10;


//----------------------------------------
// Read the list of geographic areas, 
// and loop through it in order to write a
// table listing the series that are available
// for each geographic area.
//----------------------------------------

	
https.get(`https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List`, (response) => {
	
	let body = "";
	
	// Assemble the response from the API call:
	
	response.on('data', d => body += d.toString() );
	
	// Create variables to store Area Code and Area Name:
	
	var geoAreaID = "";
	var geoAreaName = "";
	
	response.on('end', () => {
		
		// When finished receiving the response from the API call, parse it into a JSON object:
		
		geoAreas = JSON.parse(body);
		
		// Loop through each geographic area included in the JSON object:
		for (var a in geoAreas) {
				
			console.log(a, ". " , geoAreas[a].geoAreaCode, "-", geoAreas[a].geoAreaName);
			
			// Assign Area Code and Area Name to previously created variables:
			geoAreaID = geoAreas[a].geoAreaCode;
			geoAreaName = geoAreas[a].geoAreaName;
			
			// Create a tab-delimited file with data availability for the current geo Area:
			printGeoAreaAvailability(geoAreaID, geoAreaName);
		}
		
	});
	
});


//---------------------------------------------
// This function creates a tab-delimited file
// listing the series that are available for a
// given geographic area
//---------------------------------------------

function printGeoAreaAvailability(geoAreaID, geoAreaName){
	
	https.get(`https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/${geoAreaID}/List`, (res) => {
		// console.log('statusCode:', res.statusCode);
		
		let body = "";
		
	    // Assemble the response from the API call (concatenating its packets):
		res.on('data', (d) => body += d.toString());
		
		res.on('end', () => {
			
			// When finished receiving the response from the API call, parse it into a JSON object:
			
			const geoAreaAvailableSeries = JSON.parse(body);
			
			// Print on the console the name of the geographic area being currently processed:
			console.log(`\nFetching list of available series for geographic area ${geoAreaName}.`);
			
			let goalText = "";
			let targetText = "";
			let indicatorText = "";
			let seriesText = "";
			
            // Create file with the header row
			
			fs.writeFile(`dataAvailability-(${geoAreaID}) ${geoAreaName}.txt`, 
						  "geoAreaCode"+"\t"+"geoAreaName" + "\t" +
						  "Goal"+"\t"+"Goal Description"+ "\t" + 
						  "Target" + "\t" + "Target Description" + "\t"+ 
						  "Indicator" + "\t" + "Indicator Description" + "\t" + 
						  "Tier" + "\t" +
						  "Release" + "\t" +
						  "Series" + "\t" + "Series Description" + "\r\n", 
						  function (err) {
				  if (err) {
					// write failed
				  } else {
					// done
				  }
			})
			// Iterate through the list of available goals, targets, indicators and series for the current geographic area:
			
			for (var g in geoAreaAvailableSeries){
				goalText = (" Goal " + geoAreaAvailableSeries[g].code + 
							"\t" + geoAreaAvailableSeries[g].title + "]"
				);
				for (var t in geoAreaAvailableSeries[g].targets){
					targetText = (" Target " + geoAreaAvailableSeries[g].targets[t].code +
								  "\t" + geoAreaAvailableSeries[g].targets[t].title
					);
					for (var i in geoAreaAvailableSeries[g].targets[t].indicators){
						indicatorText = (" Indicator " + geoAreaAvailableSeries[g].targets[t].indicators[i].code + 
										"\t" + geoAreaAvailableSeries[g].targets[t].indicators[i].description +
										"\t" +"Tier " + geoAreaAvailableSeries[g].targets[t].indicators[i].tier);
						
						for (var s in geoAreaAvailableSeries[g].targets[t].indicators[i].series){
							
							seriesText = (geoAreaAvailableSeries[g].targets[t].indicators[i].series[s].release + 
											"\t" + geoAreaAvailableSeries[g].targets[t].indicators[i].series[s].code + 
											"\t" + geoAreaAvailableSeries[g].targets[t].indicators[i].series[s].description 
											);
						
							fs.appendFile(`dataAvailability-(${geoAreaID}) ${geoAreaName}.txt`, 
										  geoAreaID+"\t"+geoAreaName + "\t" +
										  goalText+"\t"+ targetText + "\t"+ indicatorText + "\t"+ seriesText + "\r\n", function (err) {
								  if (err) {
									// write failed
								  } else {
									// done
								  }
							})
							
						}
							
					}
					
				}

			}
				
		})
			
	});
}






//========================================================
// Use Node.js to connect to Global SDG Indicators API and
// get the list of all geographic areas in the database
//========================================================



// Connect to the API URL (https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List)
const https = require('https');

https.get('https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List', response => {
	
	// Print info on API call:
	console.log('API call: https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List');
	// Print status code
	console.log('statusCode:', response.statusCode);
	
	let body = "";
	
	// Assemble the response from the API call:
	response.on('data', (d) => {
		body += d.toString();
	});
	
	response.on('end', () => {
		// Parse the data
		
		const geoAreas = JSON.parse(body);
		
		// Print the data
		console.log(`There are ${geoAreas.length} geographic areas in total`);
		
		for (var i in geoAreas){
			console.log(" - " + geoAreas[i].geoAreaName + 
						" (" + geoAreas[i].geoAreaCode + ")"
			);
		}
		
	});
});

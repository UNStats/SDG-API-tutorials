//==========================================
// Print the geographic areas Tree
//==========================================

// Load required libraries:
var _ = require('underscore');
const https = require('https');

// Connect to the API URL (https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/Tree)

https.get('https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/Tree', (response) => {
	
	
	// Print info on API call:
	console.log('API call: https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/Tree');
	// Print status code
	console.log('statusCode:', response.statusCode);
	
	let body = "";
	
	// Assemble the response from the API call:
	response.on('data', d => { body += d.toString() } ); 
	
	response.on('end', () => {
		
		// When finished receiving the response from the API call, parse it into a JSON object:
		const geoAreasTree = JSON.parse(body);
		
		// Print the list of "root" regions:
		
		console.log(`\nThere are ${geoAreasTree.length} major regions in total:`);
		
		for (var i in geoAreasTree){
			console.log(" - " + geoAreasTree[i].geoAreaName + 
						" [" + geoAreasTree[i].geoAreaCode + "]"
			);
			
			if (geoAreasTree[i].children.length >0) {
				greeting = "Good day";
			}
		}
		
        console.log("\n");
		
		// Print the geographic area tree:
		
		buildTree(geoAreasTree,1);

		
	});
});


//==========================================
//  Build the tree using recursive function:
// https://blog.wax-o.com/2014/01/how-to-find-deep-and-get-parent-in-javascript-nested-objects-with-recursive-functions-and-the-reference-concept-level-beginner/
//==========================================

const buildTree = function(tree, indent) {
	_.each(tree, function(item) {
		var newIndent = indent + 1;
		console.log(Array(indent).join("\t")
		            + "- "+item.geoAreaName
					+ " [" + item.geoAreaCode + "]");
		if(item.children) buildTree(item.children, newIndent);
	});
}
	

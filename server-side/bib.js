const michelin = require('./michelin');
const maitre = require('./maitre');


module.exports.get = async function() {
	//puppeteer is a async api. I am using setTimeout because
	//I have trouble understanding how async/await work
	
	//JSON is called + update of the JSON
    setTimeout(function() {
        const restaurantsMichelin = michelin.get();
    }, 1000);
    
	//JSON is called + update of the JSON
    setTimeout(function() {
        const restaurantsMaitre = maitre.get();
    }, 20000);
    
	//Display of Bib restaurants
    setTimeout(function() {
        console.log('Waiting done')
    
        const michelin_json = require('./michelin.json')
    
        var count = 0;
        for(var i = 0; i < michelin_json.length; i++) {
            var objMichelin = michelin_json[i];
            count += 1;
            
            console.log(count + ' ' + objMichelin.name + ' - ' + objMichelin.address);
        }
    
    }, 45000);
    
    //Display of Maitres Restaurateur restaurants
    setTimeout(function() {
        console.log('Waiting done')
    
        const maitre_json = require('./maitre.json')
    
        var count = 0;
        for(var i = 0; i < maitre_json.length; i++) {
            var objMaitre = maitre_json[i];
            count += 1;
    
            console.log(count + ' ' + objMaitre.name + ' - ' + objMaitre.address);
        }
    
    }, 50000);
}


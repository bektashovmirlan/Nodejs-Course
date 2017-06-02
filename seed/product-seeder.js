/*var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose.connect('localhost:27017/my_db');

 var products = [ 
	 new Product({
	 	imagePath: 'https://71.img.avito.st/640x480/2930086171.jpg',
	 	title: 'Samsung Galaxy A5',
	 	price: 101
	 })
	 
];

var done = 0;
for(var i = 0; i < products.length; i++ )
{
	products[i].save(function(err, result){
		done++;
		if(done === products.length){
			exit();
		}
	});	
}

function exit() {
	mongoose.disconnect();
} 
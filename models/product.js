var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
	image: {type: String, requried: true},
	title: {type: String, requried: true},
	description: {type: String, requried: true},
	price: {type: Number, requried: true},
	category: {type: String, requried: true}
});


module.exports = mongoose.model('Product', schema);
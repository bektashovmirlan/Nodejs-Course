var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//loadByCat

router.get('/loadByCat/:title', function(req, res){
   Product.find({title: req.params.title}, function(err, products)
   {
      if(err){
         res.end('there are no product');
      }

      var p = [];
      for(var i in products)
      {
         p.push(products[i]);
      }
      res.render('category/loadByCat', {products: p});
   });
});

module.exports = router;
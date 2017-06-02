var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);


var Product = require('../models/product');



//loadAllProds
router.get('/', function(req, res, next){
   var successMsg = req.flash('success')[0];
	Product.find(function(err, docs){
		var productChunks = [];
		var chunksSize = 3;
		for(var i = 0; i < Product.length; i += chunksSize) {
			productChunks.push(docs);
		}
		res.render('index.hbs', { title: 'Express', products: productChunks, successMsg: successMsg, noMessage: !successMsg});
	});

});

//addProduct
router.get('/product', function(req, res){
	res.render('partials/product')
});
router.post('/product', function(req, res){
   var productInfo = req.body; //Get the parsed information
   if(!productInfo.image || !productInfo.title || !productInfo.description || !productInfo.price || !productInfo.category){
      res.end('errorinfo');
   } else {
      var newProduct = new Product({
         image: productInfo.image,
         title: productInfo.title,
         description: productInfo.description,
         price: productInfo.price,
         category: productInfo.category
      });
		
      newProduct.save(function(err, Product){
         if(err)
         res.end('errorProduct');
         else
         res.end('success');
      });
   }
});

//addtocart
router.get('/add-to-cart/:id', function(req, res, next){
   var productId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {});

   Product.findById(productId, function(err, product){
      if(err){
         return res.redirect('/');
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
   });

});

//shopCart

router.get('/shopCart', function(req, res, next){
   if(!req.session.cart){
      return res.render('partials/shopCart', {products: null});
   }
   var cart = new Cart(req.session.cart);
   res.render('partials/shopCart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//checkout

router.get('/checkout', function(req, res, next){
   if(!req.session.cart){
      return res.redirect('/shopCart');
   }
   var cart = new Cart(req.session.cart);
   var errMsg = req.flash('error')[0];
   res.render('partials/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res){
    if(!req.session.cart){
      return res.render('partials/shopCart', {products: null});
   }
   var cart = new Cart(req.session.cart);
   var stripe = require("stripe")(
  "sk_test_wO2iK8CY14XB7zpQNdXkaelX"
);

   stripe.charges.create({
     amount: cart.totalPrice * 100,
     currency: "usd",
     source: req.body.stripeToken, // obtained with Stripe.js
     description: "Charge for mia.johnson@example.com"
   }, function(err, charge) {
      if(err){
         req.flash('error', 'something goes wrong');
         return res.redirect('/checkout');
      }
      req.flash('success', 'successfully bought product');
      req.cart = null;
      res.redirect('/');
     // asynchronously called
   });
})

//delete Product

router.get('/delete/:title', function(req, res){
   Product.remove({title: req.params.title}, function(err){
      if(err){
         res.end('errordata');
      }
      else{res.end('success');
      }

   });
});

module.exports = router;
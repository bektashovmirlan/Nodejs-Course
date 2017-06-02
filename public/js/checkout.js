Stripe('pk_test_bxZIvCwJqHnjQGA4NwKXvUa1');

var $form = $('#checkout-form');

$form.submit(function(event){
	$('#charge-error').removeClass('hidden');
	$form.find('button').prop('disabled', true);
	Stripe.card.createToken({
		name: $('#name').val(),
		address: $('#address').val(),
		holder: $('#card-name').val(),
		number: $('#card-number').val(),
		exp_month: $('#card-expiry-month').val(),
		exp_year: $('#card-expiry-year').val(),
		cvc: $('#card-cvc').val()
	}, stripeResponseHandler);
	return false;
});

function stripeResponseHandler(status, response){
	if(response.error){
		$('#charge-error').text(response.error.message);
		$('#charge-error').removeClass('hidden');
		$form.find('button').prop('disabled', false);
	}
	else {
		var token = response.id;

		$form.append($('<input type="hidden" name="stripeToken" />').val(token));
		
		$form.get(0).submit();		
	}
}
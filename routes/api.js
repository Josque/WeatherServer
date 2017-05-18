var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send({
		hello: "World"
	});
});

router.post('/weatherResult', function(req, res, next){
	console.log(req.get('foo'));

	res.send().status(200);
});
module.exports = router;

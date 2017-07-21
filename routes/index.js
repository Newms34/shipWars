var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	res.sendFile('index.html',{"root":'./views'});
});
router.get('/m',function(req,res,next){
	res.sendFile('mobile.html',{"root":'./views'});
});
router.get('/p',function(req,res,next){
	res.sendFile('plane.html',{"root":'./views'});
})
module.exports=router;
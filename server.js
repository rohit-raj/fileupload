var express = require('express');
const fileUpload = require('express-fileupload');
var app = express();
app.use(fileUpload());

require('./router/main')(app);
	app.set('views',__dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('html', require('ejs').renderFile);
var server=app.listen(3000,function(){
	console.log("We have started our server on port 3000");
});

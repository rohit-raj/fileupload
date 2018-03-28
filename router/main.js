// var migrate             = require('./routes/migrate');
var cloudinary  = require('cloudinary');
var fs          = require('fs');
var async       = require('async');
cloudinary.config({
	cloud_name: 'xxxx',
	api_key: 'xxxx',
	api_secret: 'xxxx'
});

module.exports=function(app){
	app.get('/',function(req,res){
		 res.render('index.html')
	});
	app.get('/about',function(req,res){
		 res.send('Hey');
	});
	app.post('/upload', function(req, res) {
		if (!req.files)
			return res.status(400).send('No files were uploaded.');

        var tasks = [];

        if(!req.files.sampleFile.length) {
            var sampleFile = req.files.sampleFile;
            tasks.push(uploader.bind(null, sampleFile, []));
        } else {
            var file = req.files.sampleFile;
            tasks.push(uploader.bind(null, file[0], []));
            for(var i = 1; i < file.length; i++) {
                tasks.push(uploader.bind(null, file[i]));
            }
        }

        async.waterfall(tasks, function(err, data) {
            if(err) {
                console.log("error ==> ", err);
                return res.send("error uploading the file");
            } else {
                res.send("files uploaded ==> " + data);
            }
        })
	});
};

function uploader(sampleFile, urls, callback) {
    console.log("uploading ==> ", sampleFile.name);
    sampleFile.mv('images/' + sampleFile.name, function(err) {
        if (err){
            return res.status(500).send(err);
        }
        cloudinary.v2.uploader.upload('images/' + sampleFile.name, {folder: "rohit"}, function(error, result) {
            console.log("error ==> ", error);
            var imgUrl = result.secure_url;
            urls.push(imgUrl);
            // res.send("done
            fs.unlink('images/' + sampleFile.name, function(error) {
                if (error) {
                    throw error;
                }
                console.log('Deleted ' + sampleFile.name);
                // res.send('Deleted lol.jpg!!');
                callback(null, urls);
            });
        });
    });
}

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
        var folderName = 'Rohit';

        if(!req.files.sampleFile.length) {
            var sampleFile = req.files.sampleFile;
            //tasks.push(uploader.bind(null, sampleFile, []));
            tasks.push(saveLocalImage.bind(null, sampleFile, []));
            tasks.push(uploadImage.bind(null, sampleFile, folderName));
            tasks.push(deleteLocalImage.bind(null, sampleFile));
        } else {
            var sampleFile = req.files.sampleFile;
            //tasks.push(uploader.bind(null, file[0], []));
            tasks.push(saveLocalImage.bind(null, sampleFile[0], []));
            tasks.push(uploadImage.bind(null, sampleFile[0], folderName));
            tasks.push(deleteLocalImage.bind(null, sampleFile[0]));
            for(var i = 1; i < sampleFile.length; i++) {
                //tasks.push(uploader.bind(null, file[i]));
                tasks.push(saveLocalImage.bind(null, sampleFile[i]));
                tasks.push(uploadImage.bind(null, sampleFile[i], folderName));
                tasks.push(deleteLocalImage.bind(null, sampleFile[i]));
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

function saveLocalImage(sampleFile, urlList, callback){
    sampleFile.mv('images/' + sampleFile.name, function(err) {
        if (err){
            return callback(new Error("Error Saving the image locally"));
        }
        callback(null, urlList);
    });
}

function uploadImage(sampleFile, folderName, urlList, callback){
    cloudinary.v2.uploader.upload('images/' + sampleFile.name, {folder: folderName}, function(error, result) {
        if (error){
            return callback(new Error("Error Saving the image locally"));
        }
        urlList.push(result.secure_url);
        callback(null, urlList);
    });
}

function deleteLocalImage(sampleFile, urlList, callback){
    fs.unlink('images/' + sampleFile.name, function(error) {
        if (error) {
            return callback(new Error("Error Deleting the image locally"));
        }
        callback(null, urlList);
    });
}
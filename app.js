var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var done=false;

app.configure(function(){
    app.set('port', process.env.PORT || 3333);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({ 
        keepExtensions: true, 
        uploadDir: __dirname + '/tmp',
        limit: '200mb'
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', function(req, res) {
    var files = req.files.upload_files;
    console.log("file uploaded");
    console.log(files);
    if (files)
        renameAfterUpload(files);
    res.end();
});

// Start the app
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

// Private functions
var fs = require('fs');

function rename_path(path, index) {
    return path.substring(0, path.lastIndexOf("/")) + "/" //directory
         + Date().toLocaleString() + "-" + index //file name
         + "." + path.split('.').pop();//file extensions
}

var renameAfterUpload = function(files) {
    //This is just a sample of using async function
    setTimeout( function() {
        if (Array.isArray(files)) {
            // Multiple file upload
            for (var i = 0; i < files.length; i++) {
                var path = files[i].path;
                var newPath = rename_path(path, i);
                fs.rename(path, newPath, function(err) {
                    if (err) console.log(err);
                    else console.log('file successfully renamed');
                });
            }

        } else {
            // Single file upload
            var path = files.path;
            var newPath = rename_path(path, 0);
            fs.rename(path, newPath, function(err) {
                if (err) console.log(err);
                else console.log('file successfully renamed');
            });
        }
    }, 0);
};

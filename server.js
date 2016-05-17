/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
var express = require("express"),
    path = require('path'),
    multer = require('multer'),
    fs = require('fs'),
    csv = require("fast-csv");
var app = express();
app.use(express.static(path.join(__dirname, 'client')));

function fileId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

/*--- START : Upload File ------*/
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, fileId() + '-' + file.originalname);
    }
});

var upload = multer({storage: storage}).single('file');

app.post('/api/files/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
/*--- END : Upload File -----*/

/*--- START : Get Files ------*/
app.get('/api/files/list', function (req, res) {
    fs.readdir('./uploads', function (err, files) {
        if (err) {
            return res.send(err);
        } else {
            return res.send(files);
        }
    });
});
/*--- END : Get Files ------*/

/*--- START : Remove File ------*/
app.delete('/api/files/remove/:fileName', function (req, res) {
    var file_name = req.params.fileName;
    fs.unlink("./uploads/"+file_name, function (err) {
        if (err) {
            return res.send(err);
        } else {
            return res.send('successfully deleted.');
        }
    });
});
/*--- END : Remove File ------*/

/*--- START : Get CSV File Data ------*/
app.get('/api/files/csv/:fileName', function (req, res) {
    var arr = [], csvJsonArr = [];
    var file_name = req.params.fileName;
    csv.fromPath("./uploads/"+file_name)
        .on("data", function (data) {
            arr.push(data);
        })
        .on("end", function () {
            arr.forEach(function(value, index){
                if(index !== 0){
                    var obj = {};
                    arr[0].forEach(function(col, intIndex){
                        obj[col] = value[intIndex];
                    });
                    csvJsonArr.push(obj);
                }
            });
            return res.send(csvJsonArr);
        });

});
/*--- END : Get CSV File Data ------*/

app.listen(3030, function () {
    console.log("Working on port 3030");
});

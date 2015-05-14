var http=require('http');

function loadJSON(file, callback) {
  http.get({path: file+'.json'}, function(res) {
    var file = "";
    res.on('data', function(buf) {
      file += buf;
    });
    res.ond('end', function() {
      callback(file);
    });
  });
}

var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
// require more modules/folders here!

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
};

exports.handleRequest = function (req, res) {
  
  var ep = {
    //''
  };

  if (req.method === 'GET') {  
    // console.log(req.url)
    if (req.url === '/') {  
      var file = archive.paths.siteAssets + '/index.html'; 
      res.writeHead(200, headers);
      fs.readFile(file, 'utf8', function(err, html) {
        if (err) { throw err; }
        res.end(html);
      });    
    } else {
      if (true) { //----TODO ISURLINLIST
        // if () { //----TODO ISURLARCHIVED
        // }
        res.writeHead(200,  'Done');
        res.end();       
      } else {
        res.writeHead(404, 'Not Found!');
        res.end();
      } 
    }

  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      data = body.split('=')[1] + '\n';
      //-----TODO ADDURLSTOLIST
      res.writeHead(302, 'Done');
      res.end(); 
    });
  }
  
};

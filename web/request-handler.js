var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
// require more modules/folders here!

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
};

exports.handleRequest = function (req, res) { 
  if (req.method === 'GET') {
    var file = archive.paths.siteAssets + '/index.html'; 
    res.writeHead(200, headers);
    fs.readFile(file, 'utf8', function(err, html) {
      if (err) { throw err; }
      res.end(html);
    });     
  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      data = body.split('=')[1] + '\n';
      archive.addUrlToList(data, function () {
        res.writeHead(302, 'Done');
        var url = data.split('\n')[0];
        archive.isUrlArchived(url, function (isArchived) {
          if (isArchived) {
            console.log('Archived', url);
            res.writeHead(200, 'Done');
            fs.readFile(`${archive.paths.archivedSites}/${url}`, 'utf8', function(err, html) {
              if (err) { throw err; }
              res.end(html);
            });  
          } else {
            console.log('404', url);
            res.writeHead(404, 'Not Found!');
            fs.readFile(`${archive.paths.siteAssets}/loading.html`, 'utf8', function(err, html) {
              if (err) { throw err; }
              res.end(html);
            });
          }
        }); 
      });
      //-----TODO ADDURLSTOLIST
    });
  }
  
};

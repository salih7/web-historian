var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
var Promise = require('bluebird');
// require more modules/folders here!

var addUrlToListAsync = Promise.promisify(archive.addUrlToList);
var isUrlArchivedAsync = Promise.promisify(archive.isUrlArchived);

Promise.promisifyAll(fs);

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
    fs.readFileAsync(file, 'utf8')
      .then(function(html) {
        res.end(html);
      })
      .catch(function(err) {
        console.log('Error occured reading file');
      });     
  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      data = body.split('=')[1] + '\n';
      addUrlToListAsync(data)
        .then(function() {
          res.writeHead(302, 'Done');
          var url = data.split('\n')[0];
          return url;
        })
        .then(function(url) {
          return isUrlArchivedAsync(url);
        })
        .then(function(archivedUrl) {
          if (archivedUrl) {
            console.log('Archived', archivedUrl);
            res.writeHead(200, 'Done');
            fs.readFileAsync(`${archive.paths.archivedSites}/${archivedUrl}`, 'utf8')
              .then(function(html) {
                res.end(html);
              })
              .catch(function(err) {
                console.log('Error occured reading file');
              });
          } else {
            console.log('404', archivedUrl);
            res.writeHead(404, 'Not Found!');
            fs.readFileAsync(`${archive.paths.siteAssets}/loading.html`, 'utf8')
              .then(function(html) {
                res.end(html);
              })
              .catch(function(err) {
                console.log('Error occured reading file');
              });
          }
        })
        .catch(function(err) {
          console.log('Some error occured along the promise chain', err);
        });
    });    
  }
};
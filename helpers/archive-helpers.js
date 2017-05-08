var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { return callback(err, null); }
    var urls = data.split('\n');
    callback(null, urls);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(err, urls) {
    if (err) { return callback(err, null); }
    var isUrlThere = _.contains(urls, url.split('\n')[0]);
    callback(null, isUrlThere);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(err, inList) {
    if (err) { return callback(err, null); }    
    if (!inList) {
      fs.appendFile(exports.paths.list, url);
    }
    callback(null); 
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    if (err) { return callback(err, null); }
    var isFileArchived = _.contains(files, url);
    if (isFileArchived) {
      callback(null, url);  
    } else {
      callback(null, null);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(url => { 
    request('http://' + url, function(error, response, body) {
      if (url) {
        var fixturePath = exports.paths.archivedSites + '/' + url;
        fs.writeFile(fixturePath, body, function(err) {
          if (err) { throw err; }
        }); 
      }
    });
  });
};

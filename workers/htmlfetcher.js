// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');

var readListOfUrlsAsync = Promise.promisify(archive.readListOfUrls);

exports.htmlFetcher = function() {
  readListOfUrlsAsync()
    .then(function(urls) {
      archive.downloadUrls(urls);	
    })
    .catch(function(err) {
      console.log('Could not read list of URLs');
    });
};

exports.htmlFetcher();
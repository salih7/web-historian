// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var CronJob = require('cron').CronJob;

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

var job = new CronJob({         //--With NPM 'cron' it runs every minute at 00 seconds
  cronTime: '00 * * * * *', 
  onTick: function() {
    exports.htmlFetcher();  
  },
  start: true
});

job.start();
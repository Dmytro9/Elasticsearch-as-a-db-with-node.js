var express = require('express');
var elasticsearch = require('elasticsearch');


var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.ping({
     requestTimeout: 1000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

 client.indices.create({
     index: 'blog'
 }, function(err, resp, status) {
     if (err) {
         console.log(err);
     } else {
         console.log("create", resp);
     }
 });

  client.index({
     index: 'blog',
     id: '1',
     type: 'posts',
     body: {
         "PostName": "Integrating Elasticsearch Into Your Node.js Application",
         "PostType": "Tutorial",
         "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
     }
 }, function(err, resp, status) {
     console.log(resp);
 });

  client.search({
    index: 'blog',
    type: 'posts',
    q: 'PostName:Node.js'
}).then(function(resp) {
	var data = resp.hits.hits;
    console.log(data);
}, function(err) {
    console.trace(err.message);
});

var app = express();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.get('/some', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  // res.send('This is working cors request - so this is "repchik" bro :) ...');
	  client.search({
    index: 'blog',
    type: 'posts',
    q: 'PostName:Node.js'
}).then(function(resp) {
	var data = resp.hits.hits;
    console.log(data);
    res.send(data);
}, function(err) {
    console.trace(err.message);
});
  // res.send('Hello World!');
});







app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//https://qbox.io/blog/integrating-elasticsearch-into-node-js-application
//https://www.npmjs.com/package/elasticsearch
//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/browser-builds.html
//https://github.com/elastic/elasticsearch-js
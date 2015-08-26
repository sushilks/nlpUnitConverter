'use strict';
var NLP = require('stanford-corenlp');
//var path = require('path');

var config = {

    'nlpPath': './corenlp', //the path of corenlp
    'version': '3.5.2', //what version of corenlp are you using
    'annotators': ['tokenize', 'ssplit', 'pos', 'lemma', 'ner', 'parse', 'dcoref'] //optional!

};

var coreNLP = new NLP.StanfordNLP(config);

var http = require('http');
var url = require('url');

var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {'Content-Type': 'text/plain'});

  if (queryData.q) {

    coreNLP.process(queryData.q, function(err, result) {
        if(err) {
            throw err;
          } else {
            response.end(JSON.stringify(result));
          }
    });


  } else {
    response.end('Hello standford-coreNLP!\n');
  }
});
console.log('Server is listening at 8990');
server.listen(8990);

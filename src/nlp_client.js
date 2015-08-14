'use strict';

var http = require('http');

class NLPClient {
    constructor() {
    }
    req(query) {
        return new Promise(
            function(resolve, reject) {
                let options = {};
                options.host = 'localhost';
                options.port = 8990;
                options.method = 'GET';
                options.path = '/?q=' + encodeURI(query);
                var request = http.request(options, function(response){
                    let result = {
                        'body': '',
                        'httpVesion': response.httpVersion,
                        'httpStatusCode': response.statusCode,
                        'headers': response.headers,
                        'trailers': response.trailers
                    };
                    response.on('data', function(chunk){
                        result.body += chunk;
                    });
                    response.on('end', function() {
                        resolve(result);
                    });
                });
                request.on('error', function(error){
                    console.log('Error when making the https request: ' + error.message);
                    reject(error);
                });
                request.end();
            });
   }
}

export default NLPClient;
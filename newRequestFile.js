var request = require("request");

var options = { method: 'GET',
  url: 'http://192.168.1.59:4444/shims/wp-json/wp/v2/users/me',
  qs: { access_token: 'jfzknynk8bi0rr45kzcs5quik0acugemrcfqkaub' },
  headers: 
   { 'postman-token': '49169bf8-713f-abde-bc40-053149da001e',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: {},
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

const licenseFile = require('nodejs-license-file');
const http = require('http');
const fs = require('fs');
const SimpleCrypto = require("simple-crypto-js").default;

const _secretKey = SimpleCrypto.generateRandom(256);
const simpleCrypto1 = new SimpleCrypto(_secretKey);
const simpleCrypto2 = new SimpleCrypto(_secretKey);

http.createServer(function(req, res){
    const template = [
    '====BEGIN LICENSE====',
    '{{&client}}',
    '{{&hash1}}',
    '{{&hash2}}',
    '{{&serial}}',
    '=====END LICENSE====='
].join('\n');

try {

    const licenseFileContent = licenseFile.generate({
        privateKeyPath: '/var/www/html/apmais/keys/private_key.pem',
        template,
        data: {
            client: 'AP',
	    hash1:_secretKey, 
            hash2: simpleCrypto1.encrypt('2019-07-30')
        }
    });
    try {
      fs.writeFile('/var/www/html/apmais/license/file.lic', licenseFileContent, function(err){
        if(err){
          throw err;
        }else{
          console.log("Successfully write to the file!!!");
        }
      });
    } catch (err) {
      console.log("Writing to a file Error catch");
    }
    console.log(licenseFileContent);
    res.writeHead(200, {'content-type':'text/plain'});
    res.end(licenseFileContent);
} catch (err) {

    console.log(err);
    res.writeHead(200, {'content-type':'text/plain'});
    res.end('Error creating the file');

}
    
}).listen(9001);

console.log('Server is running on port 9001');
 


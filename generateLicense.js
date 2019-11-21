const express = require('express');
const bodyParser = require('body-parser');
const licenseFile = require('nodejs-license-file');
const http = require('http');
const fs = require('fs');
const AES = require('crypto-js/aes');
const ENC_HEX = require('crypto-js/enc-hex');
const ZERO_PADDING = require('crypto-js/pad-zeropadding');
const SimpleCrypto = require("simple-crypto-js").default;

const _secretKey = SimpleCrypto.generateRandom(256);
const simpleCrypto1 = new SimpleCrypto(_secretKey);
const simpleCrypto2 = new SimpleCrypto(_secretKey);
const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('views', '/var/www/html/apmais/license/views');

app.set('view engine', 'ejs');

app.get('/', function(req, res){

  res.render('index');
});

app.post('/', urlencodedParser, function(req, res){
  const date = req.body.date;
  const name = req.body.clientName;
  const type = req.body.optradio;

  
  const template = [
    '====BEGIN LICENSE====',
    '{{&client}}',
    '{{&hash1}}',
    '{{&hash2}}',
    '{{&serial}}',
    '=====END LICENSE====='
  ].join('\n');

  try {

    if(type === 'JS'){
      const licenseFileContent = licenseFile.generate({
        privateKeyPath: '/var/www/html/apmais/keys/private_key.pem',
        template,
        data: {
            client: name,
            hash1:_secretKey,
            hash2: simpleCrypto1.encrypt(date)
        }
      });
      try {
        fs.writeFile(`/var/www/html/ap.lic`, licenseFileContent, function(err){
          if(err){
            throw err;
          }else{
            console.log("Successfully write to the file!!!");
            res.render('fileGenerated.ejs', {data: licenseFileContent});
          }
        });
      } catch (err) {
        console.log("Writing to a file Error catch");
        res.render('fileGenerated.ejs', {data: "Writing to a file Error catch"});
      }
    }else {
      let key = ENC_HEX.parse("0123456789abcdef0123456789abcdef");
      let iv =  ENC_HEX.parse("abcdef9876543210abcdef9876543210");

      const encryptedPhpKey = AES.encrypt(date, key, {iv:iv, padding:ZERO_PADDING}).toString();

      const licenseFileContent = licenseFile.generate({
        privateKeyPath: '/var/www/html/apmais/keys/private_key.pem',
        template,
        data: {
            client: name,
            hash1:_secretKey,
            hash2: encryptedPhpKey
        }
      });
      try {
        fs.writeFile(`/var/www/html/${name}_file_${type}.lic`, licenseFileContent, function(err){
          if(err){
            throw err;
          }else{
            console.log("Successfully write to the file!!!");
            res.render('fileGenerated.ejs', {data: licenseFileContent});
          }
        });
      } catch (err) {
        console.log("Writing to a file Error catch");
        res.render('fileGenerated.ejs', {data: "Writing to a file Error catch"});
      }
    }
  } catch (err) {

    console.log(err);
    res.render('fileGenerated.ejs', {data: "Error creating the file"});
  } 
});
app.listen(9001);
console.log('Server is running on port 9001');

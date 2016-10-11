#!/usr/bin/env node

// see: https://www.iandevlin.com/blog/2012/11/phonegap/building-an-ios-signing-key-for-phonegap-in-windows
var config = require('../build-config.json');
var path = require('path');
var iosFolder = path.join(config.certificateFolder, 'ios');
var keyFile = path.join(iosFolder, config.appName + '.key');
var csrFile = path.join(iosFolder, config.appName + '.csr');
var cerFile = path.join(iosFolder, 'ios_development.cer');
require('shelljs/global');

if (test('-f', cerFile)) {
    console.log('ERROR: ' + cerFile + ' already exists');
    console.log('delete it first or continue with ' + __filename.replace(/1/, '2'));
    exit(1);
}

mkdir('-p', path.join(config.certificateFolder, 'ios'));

// delete old
rm('-rf', keyFile);
rm('-rf', csrFile);

// create subj
var subj = [];
subj.push('emailAddress=' + config.publisher.emailAdress);
subj.push('CN=' + config.publisher.organizationName);
subj.push('C=' + config.publisher.country);

var command1Parameters = [];
command1Parameters.push('genrsa');
command1Parameters.push('-des3');
command1Parameters.push('-passout pass:' + config.password);
command1Parameters.push('-out ' + keyFile);
command1Parameters.push('2048');

var command1 = 'openssl ' + command1Parameters.join(' ');
exec(command1);

var command2Parameters = [];
command2Parameters.push('req');
command2Parameters.push('-new');
command2Parameters.push('-key ' + keyFile);
command2Parameters.push('-passin pass:' + config.password);
command2Parameters.push('-out ' + csrFile);
command2Parameters.push('-subj "/' + subj.join(', ') + '"');

var command2 = 'openssl ' + command2Parameters.join(' ');
exec(command2);

console.log("###########################################################################################");
console.log('# now open: https://developer.apple.com > Certificates > Development > click +');
console.log('# select iOS App Development and upload "' + csrFile + '"');
console.log('# put the "ios_development.cer" file in the folder "' + iosFolder + '"');
console.log('# than continue with ' + __filename.replace(/1/, '2'));
console.log("###########################################################################################");

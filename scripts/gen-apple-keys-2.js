#!/usr/bin/env node

// see: https://www.iandevlin.com/blog/2012/11/phonegap/building-an-ios-signing-key-for-phonegap-in-windows
var config = require('../build-config.json');
var package = require('../package.json');
var path = require('path');
var fs = require('fs');
var iosFolder = path.join(config.certificateFolder, 'ios');
var pemFile = path.join(iosFolder, package.name + '.pem');
var cerFile = path.join(iosFolder, 'ios_development.cer');
var keyFile = path.join(iosFolder, package.name + '.key');
var p12File = path.join(iosFolder, package.name + '.p12');

require('shelljs/global');


if (!test('-f', cerFile)) {
    console.log('ERROR: ' + cerFile + ' not exists');
    console.log('run ' +  __filename.replace(/2/, '1') + ' first')
    exit(1);
}

// delete old
rm('-rf', pemFile);
rm('-rf', p12File);

var command1Parameters = [];
command1Parameters.push('x509');
command1Parameters.push('-in ' + cerFile);
command1Parameters.push('-inform DER');
command1Parameters.push('-out ' + pemFile);
command1Parameters.push('-outform PEM');

var command1 = 'openssl ' + command1Parameters.join(' ');
exec(command1);

var command2Parameters = [];
command2Parameters.push('pkcs12');
command2Parameters.push('-export');
command2Parameters.push('-inkey ' + keyFile);
command2Parameters.push('-in ' + pemFile);
command2Parameters.push('-passin pass:' + config.password);
command2Parameters.push('-passout pass:' + config.password);
command2Parameters.push('-out ' + p12File);
var command2 = 'openssl ' + command2Parameters.join(' ');
exec(command2);



console.log("###########################################################################################");
console.log('# now open: https://developer.apple.com > Provisioning Profiles > Development/Distribution > manually generate profiles');
console.log('# select iOS App Development and create an App ID for your App');
console.log('# more instructions: http://docs.telerik.com/platform/appbuilder/cordova/code-signing-your-app/configuring-code-signing-for-ios-apps/create-development-provisioning-profile')
console.log("###########################################################################################");



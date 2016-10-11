#!/usr/bin/env node

var config = require('../build-config.json');
var cordovaBuildFile = '../build.json';
var path = require('path');
var fs = require('fs');
var keystore = path.join(path.resolve(), config.certificateFolder, 'android', config.appName + '.keystore');
// var currentBuildFile = require('../build.json');
var keystoreExecutable = path.join(process.env.JAVA_HOME, 'bin', 'keytool');

require('shelljs/global');

var currentBuildFile;
if (test('-f', cordovaBuildFile)) {
    currentBuildFile = require(cordovaBuildFile);
} else {
  currentBuildFile = { android: { release: {}}}
}



if (typeof process.env.JAVA_HOME === 'undefined') {
  console.log('ERROR: java not installed or JAVA_HOME not set');
  exit(1);
}

mkdir('-p', path.join(config.certificateFolder, 'android'));

// delete orld
rm('-rf', keystore);

// create user
var dname = [];
dname.push('CN=' + config.publisher.name);
dname.push('OU=' + config.publisher.organizationUnit);
dname.push('O=' + config.publisher.organizationName);
dname.push('L=' + config.publisher.localityName);
dname.push('S=' + config.publisher.stateName);
dname.push('C=' + config.publisher.country);

// add properties
var keyGenProperties = [];
keyGenProperties.push('-genkeypair');
keyGenProperties.push('-v');
keyGenProperties.push('-alias "' + config.appName + '"');
keyGenProperties.push('-keyalg RSA');
keyGenProperties.push('-keysize 2048');
keyGenProperties.push('-validity 10000');
keyGenProperties.push('-storepass ' + config.password);
keyGenProperties.push('-keypass ' + config.password);
keyGenProperties.push('-dname "'+ dname.join(', ') + '"');
keyGenProperties.push('-keystore ' + keystore);

currentBuildFile.android.release.keystore = keystore;
currentBuildFile.android.release.storePassword = config.password;
currentBuildFile.android.release.alias = config.appName;
currentBuildFile.android.release.password = config.password;
currentBuildFile.android.release.keystoreType = '';
fs.writeFile('build.json', JSON.stringify(currentBuildFile, null, 2));

// build command
var command = [path.normalize(keystoreExecutable), keyGenProperties.join(' ')].join(' ');
console.log(command);
if (exec(command).code !== 0) {
  console.log('an error occure during creating the keyfile with the command:');
  console.log(command);
};



#!/usr/bin/env node

var buildConfig= 'build-config.json';
var inquirer = require('inquirer');
var fs = require('fs');
var buildConfiguration = {
  certificateFolder: '',
  publisher: {}
};

require('shelljs/global');

if (test('-f', buildConfig)) {
    console.log('ERROR: ' + buildConfig + ' already exists, delete it first');
    exit(1);
}

inquirer.prompt([
  {
    type: 'input',
    name: 'certificateFolder',
    message: 'Where do you want to save the certificates',
    default: 'certs'
  },
  {
    type: 'input',
    name: 'password',
    message: 'Enter a Passwort for encryption',
    validate: function(input) {
      return !input.trim().length ? 'Please enter a passwort' : true;
    }
  },
  {
    type: 'input',
    name: 'mail',
    message: 'Enter your E-Mail Adress (Account)'
  },
  {
    type: 'input',
    name: 'organizationName',
    message: 'Name or Organization Name'
  },
  {
    type: 'input',
    name: 'country',
    message: 'Enter your Countrycode',
    validate: function(input) {
      return input.trim().length !== 2 ? 'The countrycode have to be 2 lettes long, e.g. DE or AT' : true;
    }
  },
]).then(function (answers) {
  buildConfiguration.certificateFolder = answers.certificateFolder;
  buildConfiguration.password = answers.password;
  buildConfiguration.publisher.emailAdress = answers.mail;
  buildConfiguration.publisher.organizationUnit = '.';
  buildConfiguration.publisher.organizationName = answers.organizationName;
  buildConfiguration.publisher.country = answers.country.toUpperCase();
  buildConfiguration.publisher.name = '.';
  buildConfiguration.publisher.localityName  = '.';
  buildConfiguration.publisher.stateName  = '.';
  fs.writeFileSync(buildConfig, JSON.stringify(buildConfiguration, null, 2));
});



# appstore-helper
helper for create appstore keys for the Google Play Store (Android) and the App Store (Apple)

## Requiements
node, npm, java (we need the [keytool](http://docs.oracle.com/javase/6/docs/technotes/tools/solaris/keytool.html)) and openssl (for Apple certs only)

## Usage
1) init
```sh
$ npm install
```
2) create config file
```sh
$ node scripts/start
```
3) run platform scripts
```sh
$ node scripts/gen-apple-keys-1.js
```
or
```sh
$ node scripts/gen-android-keystore.js
```

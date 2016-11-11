### Setup

First of all, you must have [cordova installed](https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html)

Cordova plugins are not tracked in the version control. There must be initialized:

Initialize Android platform:

  cordova platform add android

-Whitelist plugin:
    cordova plugin add https://github.com/apache/cordova-plugin-whitelist.git

-Phonegap push plugin:
    cordova plugin add phonegap-plugin-push

- Camera plugin
    cordova plugin add cordova-plugin-camera

### Create the emulator
  - Use Android SDK Manager to download Android SDKs, e.g. files under Android 5.0.1 (API 21) and from the Extras folder ```Android Support Library```, ```Android Support Repository```, ```Google Play Services``` and ```Google Repository```

  - Create an AVD from the Android Virtual Device Manager:
    - The Android emulator target should be of the form ```Google APIs (Google inc.) API Level 21```

### Run the application in the Android emulator

  cordova emulate android

  # Or run it in your device

  cordova run android --device

### Debugging the app in Android

Cordova app is configured to use `teem.works` server by default. If you want to
use your own local server, copy config.js.sample to your config.js in the root
folder.

  cp config.js.sample config.js

Change hosts and ports at `config.js` and also at `cordova/config.xml`to point
to your LAN/Internet device's IP (eth0, wlan0, etc).

The app can be accessed and debugged using
[Weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/Home.html)

At `config.js`, uncomment the `config.weinre` lines, and restart the server:

  gulp

Now, you should be able to access weinre's console at:

  http://[lan-or-internet-ip]:8080/client/#anonymous

### When adding a new plugin to the app

Cordova's js files are distributed with the web application. We need to copy them
to other folder, which is checked-in in git.

After adding a new plugin:

-  copy the new or updated files from platform/android/assets/www/plugins/ to ../src/vendor/cordova/
-  add them and commit them with git.

### Releasing and signing the apk

You need to get the keystore from your organization private repo or generate your own.

Then copy build.json.example to build.json

  cp build.json.example build.json

And customize it with the path to the keystore

To build the package:

  cordova build --release

The package will be stored at `cordova/platforms/android/build/outputs/apk/android-release.apk`

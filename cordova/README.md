### Setup

First of all, you must have:
* [Android SDK](https://developer.android.com/studio/index.html)
* Cordova: `npm install -g cordova`

Use Android SDK Manager to download files under `Android 5.0.1 (API 21)` and
from the Extras folder ```Android Support Repository```,
```Google Play Services``` and ```Google Repository```.

Cordova plugins are not tracked in the version control. They must be
initialized:

```sh
cd cordova
./cordova-setup.sh <SENDER_ID>
```

Where the `<SENDER_ID>` parameter is the project number in the [Google Developer
Console](https://console.developers.google.com). To find the project number,
login to the Google Developer Console, select your project, and click the menu
item in the screen shot below to display your project number.

![Screenshot](https://cloud.githubusercontent.com/assets/353180/15588897/2fc14db2-235e-11e6-9326-f97fe0ec15ab.png)

### Run the application in the Android emulator

Create an AVD from the Android Virtual Device Manager. The Android emulator
target should be of the form ```Google APIs (Google inc.) API Level 21```.

```sh
cordova emulate android

# Or run it in your device
cordova run android --device
```

### Debugging the app in Android

Cordova app is configured to use `teem.works` server by default. If you want to
use your own local server, copy config.js.sample to your config.js in the root
folder.

```sh
cp config.js.sample config.js
```

Change hosts and ports at `config.js` and also at `cordova/config.xml`to point
to your LAN/Internet device's IP (eth0, wlan0, etc).

The app can be accessed and debugged using
[Weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/Home.html).

At `config.js`, uncomment the `config.weinre` lines, and restart the server:

```sh
gulp
```

Now, you should be able to access weinre's console at:

>  http://[lan-or-internet-ip]:8080/client/#anonymous

### When adding a new plugin to the app

Cordova's js files are distributed with the web application. We need to copy
them to other folder, which is checked-in in git.

After adding a new plugin:

-  copy the new or updated files from platform/android/assets/www/plugins/ to
../src/vendor/cordova/
-  add them and commit them with git.

### Releasing and signing the apk

You need to get the keystore from your organization private repo or generate
your own.

Then copy `build.json.example` to `build.json`.

```sh
cp build.json.example build.json
```

And customize it with the path to the keystore.

To build the package:

```sh
cordova build --release
```

The package will be stored at
`cordova/platforms/android/build/outputs/apk/android-release.apk`.

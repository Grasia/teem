if [ $# != 1 ]
then
  echo "Usage: ./cordova-setup <SENDER_ID>"
  exit 1
fi

cordova platform add android

# Whitelist plugin:
cordova plugin add https://github.com/apache/cordova-plugin-whitelist.git

# Android intent
cordova plugin add https://github.com/napolitano/cordova-plugin-intent.git

# Phonegap push plugin:
cordova plugin add phonegap-plugin-push --variable SENDER_ID=$1

# Camera plugin
cordova plugin add cordova-plugin-camera

# Crosswalk webview
cordova plugin add cordova-plugin-crosswalk-webview

cordova prepare

cp platforms/android/assets/www/cordova_plugins.js ../src/vendor/cordova/cordova_plugins.js
cp -r platforms/android/assets/www/plugins/ ../src/vendor/cordova/

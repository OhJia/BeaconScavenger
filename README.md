# Beacon Scavenger Game

A beacon scavenger game client made with one of [Tom Igoe's BluetoothLE-Examples](https://github.com/tigoe/BluetoothLE-Examples). 

From Tom: 

This is a stub for the Bluetooth LE beacon game for my Understanding Networks class. It gontains enough information to login and logout of the game. You'll get a token back from the server when you login. You'll also get the service uuid and characteristic uuid that you need for the game. When you logout, the token will be erased from the server, and a new one will be generated on login.

NOTE: this app makes cross-domain HTTP requests. CORS should be enabled by default, according to the [cordova documentation whitelist guide](http://cordova.apache.org/docs/en/4.0.0/guide_appdev_whitelist_index.md.html#Whitelist%20Guide).

I updated the www folder to match the UUID of discovered beacons and display these beacon information as JSON strings. There's also a simple UI to list out these beacons. The user can tap on the list to claim that beacon and be alerted to whether it was successfully claimed or show an error message. The update also match the localname to "Golden Egg", display this in the UI, and alert the user if the Golden Egg is claimed. The user wins the game if she claims the beacon with the localname "Golden Egg". 

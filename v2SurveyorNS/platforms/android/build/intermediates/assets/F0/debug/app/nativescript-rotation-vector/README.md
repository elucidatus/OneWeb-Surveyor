# NativeScript Rotation Vector Plugin
# Most of the code from NativeScript Accelerometer Plugin
Rotation Vector plugin for NativeScript

This plugin is compatible with both NativeScript `2.x` and `3.x` versions.

Adapted from https://www.npmjs.com/package/nativescript-accelerometer
Specifically, all the code are the same, with minor differences in Android:
* name changes from accelerometer to rotation Vector
* matrix calculations in onSensorChanged
* type of sensor queried (from TYPE_ACCELERROMETER to TYPE_ROTATION_VECTOR)

for iOS (have not been tested):
* name changes from Accelerometer to Rot
* type of sensor queried (from Accelerometer to Device Motion)

## Usage
```
var rot = require("nativescript-rotation-vector");

rot.startRotUpdates(function(data) {
    console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
}, { sensorDelay: "ui" });
```

## Expected Values

 * x- roll
    * Spin Left/Right from -180 to 180 degrees
 * y- pitch
    * Tilt Up/Down from -90 to 90 degrees
 * z- yaw
    * Tilt Left/Right from -180 to 180 degrees

## Options

You can control how often the callback will be called by setting the `sensorDelay` option. The values are:
* `"normal"` - Suitable for screen orientation changes. Around 0.2 seconds.
* `"ui"` - Suitable for the user interface. Around 0.06 seconds.
* `"game"` - Suitable for games. Around 0.02 seconds.
* `"fastest"` - Sensor data as fast as possible.
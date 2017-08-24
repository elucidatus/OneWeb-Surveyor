"use strict";
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
var rotVector = require("./nativescript-rotation-vector/index");
var app = require("application");
var platform = require("platform");
var orientation = require("nativescript-screen-orientation");
var params = require("./nativescript-fov/nativescript-fov");
var permissions = require("nativescript-permissions");
var charts = require("./nativescript-chart/chart");
var instructions = require("./nativescript-instructions/instructions");
var enums_1 = require("ui/enums");
var crosshair;
var doubleline;
var upperText;
var lowerText;
var capturebtn;
var clearbtn;
var recordstop;
var x, y, z;
var page;
var isOn = false;
var isFirst = true;
var timer = 100;
// let filters;
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var yTranslate = app.ios ? -20 : 0;
var resize = function () {
    var scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.scaleX = scaleCrosshair;
    crosshair.scaleY = scaleCrosshair;
    crosshair.translateY = yTranslate;
    var scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    doubleline.scaleX = scaleDoubleLine;
    doubleline.scaleY = scaleDoubleLine;
    if (app.ios) {
        var cameraView = page.getViewById("placeholder-view");
        cameraView.animate({
            scale: {
                x: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight(),
                y: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight()
            },
            translate: {
                x: 0,
                y: app.ios ? -10 : 0
            },
            duration: 200
        });
    }
};
var updateCallback = function () {
    charts.updateGraph(x, y, isOn);
    instructions.trigger2(y);
    instructions.trigger4(x);
    // timer--;
    // if(timer < 0) {
    //   timer = 100;
    //   rotVector.stopRotUpdates();
    //   rotVector.startRotUpdates(rotationCallback,  { sensorDelay: "game" });
    // }
    if (isFirst) {
        resize();
        isFirst = false;
    }
    crosshair.rotate = -z;
    var distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
        - ANGLE_BETWEEN_LINES / 2 * (y > 0 ? -1 : 1))));
    doubleline.translateX = Math.sin(z * Math.PI / 180) * distanceFromCenter;
    doubleline.translateY = Math.cos(z * Math.PI / 180) * distanceFromCenter + yTranslate;
    doubleline.rotate = -z;
    var dist = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight()) * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2);
    lowerText.text = 10 * Math.floor(-y / 10);
    lowerText.translateX = Math.sin(z * Math.PI / 180) * ((app.ios ? 20 : 0) + distanceFromCenter + dist);
    lowerText.translateY = Math.cos(z * Math.PI / 180) * ((app.ios ? 20 : 0) + distanceFromCenter + dist) + yTranslate;
    lowerText.rotate = -z;
    upperText.text = 10 * Math.floor((-y + 10) / 10);
    upperText.translateX = Math.sin(z * Math.PI / 180) * ((app.ios ? -20 : 0) + distanceFromCenter - dist);
    upperText.translateY = Math.cos(z * Math.PI / 180) * ((app.ios ? -20 : 0) + distanceFromCenter - dist) + yTranslate;
    upperText.rotate = -z;
};
var rotationCallback = function (data) {
    //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
    x = data.x;
    y = data.y;
    z = data.z;
    if (app.ios)
        updateCallback(); // ios doesn't seem to expose a callback for every frame update in the camera preview; therefore, we'll hop on the rotation callback
};
// export function showSideDrawer(args: EventData) {
//     console.log("Show SideDrawer tapped.");
// }
//TODO: split up the code
function onLoaded(args) {
    orientation.setCurrentOrientation("portrait", function () { });
    if (app.android && platform.device.sdkVersion >= '21') {
        var View = android.view.View;
        var window_1 = app.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        // window.setStatusBarColor(0x000000);
        var decorView = window_1.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    cameraPreview.onLoaded(args, "placeholder-view");
}
exports.onLoaded = onLoaded;
function onCreatingView(args) {
    charts.initGraph(page);
    instructions.trigger1(page);
    if (app.android) {
        permissions.requestPermission(android["Manifest"].permission.CAMERA, "I need these permissions for the viewfinder")
            .then(function () {
            console.log("Woo Hoo, I have the power!");
        })
            .catch(function () {
            console.log("Uh oh, no permissions - plan B time!");
        });
    }
    if (app.android)
        params.initialize();
    cameraPreview.onCreatingView(updateCallback, args);
    if (app.ios !== undefined)
        params.initialize();
    rotVector.startRotUpdates(rotationCallback, { sensorDelay: "game" });
    var maxSize = cameraPreview.getMaxSize();
    params.setVars(maxSize[0], maxSize[1]);
    // console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    instructions.trigger3(x);
    isOn = !isOn;
    capturebtn.animate({
        scale: { x: 1.2, y: 1.2 },
        duration: 100
    }).then(function () {
        capturebtn.animate({
            scale: { x: 1, y: 1 },
            duration: 300,
            curve: enums_1.AnimationCurve.spring
        });
        recordstop.src = isOn ? "res://stop" : "res://record";
    });
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
function onClear(args) {
    charts.clear();
    clearbtn.animate({
        scale: { x: 1.2, y: 1.2 },
        duration: 100
    }).then(function () {
        clearbtn.animate({
            scale: { x: 1, y: 1 },
            duration: 300,
            curve: enums_1.AnimationCurve.spring
        });
    });
}
exports.onClear = onClear;
function navigatingTo(args) {
    page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    capturebtn = page.getViewById("capturebtn");
    clearbtn = page.getViewById("clearbtn");
    recordstop = page.getViewById("recordstop");
}
exports.navigatingTo = navigatingTo;
app.on(app.resumeEvent, function (args) {
    rotVector.startRotUpdates(rotationCallback, { sensorDelay: "game" });
    cameraPreview.onResume();
});
app.on(app.suspendEvent, function (args) {
    cameraPreview.onPause();
    rotVector.stopRotUpdates();
    charts.onExit();
});
app.on(app.exitEvent, function (args) {
    console.log("On Exitting");
    rotVector.stopRotUpdates();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFOztBQUlGLHlGQUEyRjtBQUMzRixnRUFBa0U7QUFDbEUsaUNBQW1DO0FBR25DLG1DQUFxQztBQUNyQyw2REFBK0Q7QUFDL0QsNERBQThEO0FBQzlELHNEQUF3RDtBQUN4RCxtREFBcUQ7QUFDckQsdUVBQXlFO0FBQ3pFLGtDQUF3QztBQUV4QyxJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFNBQWMsQ0FBQztBQUNuQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLFFBQWEsQ0FBQztBQUNsQixJQUFJLFVBQWUsQ0FBQztBQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1osSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7QUFDMUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLElBQUksS0FBSyxHQUFXLEdBQUcsQ0FBQztBQUN4QixlQUFlO0FBRWYsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFDL0IsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFcEMsSUFBTSxNQUFNLEdBQUc7SUFDYixJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDbEcsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7SUFDbEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7SUFDbEMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7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SUFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDNUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQVRELG9DQVNDO0FBRUQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVMsSUFBSTtJQUNuQyxTQUFTLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdEUsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVMsSUFBSTtJQUNwQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEIsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUk7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMzQixTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuSW4gTmF0aXZlU2NyaXB0LCBhIGZpbGUgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIGFuIFhNTCBmaWxlIGlzIGtub3duIGFzXG5hIGNvZGUtYmVoaW5kIGZpbGUuIFRoZSBjb2RlLWJlaGluZCBpcyBhIGdyZWF0IHBsYWNlIHRvIHBsYWNlIHlvdXIgdmlld1xubG9naWMsIGFuZCB0byBzZXQgdXAgeW91ciBwYWdl4oCZcyBkYXRhIGJpbmRpbmcuXG4qL1xuXG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3VpL3BhZ2UnO1xuaW1wb3J0ICogYXMgY2FtZXJhUHJldmlldyBmcm9tICcuL25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldy9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcnO1xuaW1wb3J0ICogYXMgcm90VmVjdG9yIGZyb20gXCIuL25hdGl2ZXNjcmlwdC1yb3RhdGlvbi12ZWN0b3IvaW5kZXhcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwiYXBwbGljYXRpb25cIjtcbmltcG9ydCAqIGFzIGZyYW1lTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lXCI7XG5pbXBvcnQgKiBhcyBhbmltYXRpb24gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvYW5pbWF0aW9uXCI7XG5pbXBvcnQgKiBhcyBwbGF0Zm9ybSBmcm9tIFwicGxhdGZvcm1cIjtcbmltcG9ydCAqIGFzIG9yaWVudGF0aW9uIGZyb20gXCJuYXRpdmVzY3JpcHQtc2NyZWVuLW9yaWVudGF0aW9uXCI7XG5pbXBvcnQgKiBhcyBwYXJhbXMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWZvdi9uYXRpdmVzY3JpcHQtZm92XCI7XG5pbXBvcnQgKiBhcyBwZXJtaXNzaW9ucyBmcm9tIFwibmF0aXZlc2NyaXB0LXBlcm1pc3Npb25zXCI7XG5pbXBvcnQgKiBhcyBjaGFydHMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWNoYXJ0L2NoYXJ0XCI7XG5pbXBvcnQgKiBhcyBpbnN0cnVjdGlvbnMgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LWluc3RydWN0aW9ucy9pbnN0cnVjdGlvbnNcIjtcbmltcG9ydCB7QW5pbWF0aW9uQ3VydmV9IGZyb20gXCJ1aS9lbnVtc1wiO1xuXG5sZXQgY3Jvc3NoYWlyOiBhbnk7XG5sZXQgZG91YmxlbGluZTogYW55O1xubGV0IHVwcGVyVGV4dDogYW55O1xubGV0IGxvd2VyVGV4dDogYW55O1xubGV0IGNhcHR1cmVidG46IGFueTtcbmxldCBjbGVhcmJ0bjogYW55O1xubGV0IHJlY29yZHN0b3A6IGFueTtcbmxldCB4LCB5LCB6O1xubGV0IHBhZ2U7XG5sZXQgaXNPbjogYm9vbGVhbiA9IGZhbHNlO1xubGV0IGlzRmlyc3QgPSB0cnVlO1xubGV0IHRpbWVyOiBudW1iZXIgPSAxMDA7XG4vLyBsZXQgZmlsdGVycztcblxuY29uc3QgT1VURVJfQ0lSQ0xFX0RJQU1FVEVSID0gMjtcbmNvbnN0IEFOR0xFX0JFVFdFRU5fTElORVMgPSAxMDtcbmNvbnN0IHlUcmFuc2xhdGUgPSBhcHAuaW9zPyAtMjAgOiAwO1xuXG5jb25zdCByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgY29uc3Qgc2NhbGVDcm9zc2hhaXIgPSBwYXJhbXMuZGVncmVlczJTY2FsZShPVVRFUl9DSVJDTEVfRElBTUVURVIsIGNyb3NzaGFpci5nZXRNZWFzdXJlZEhlaWdodCgpKTtcbiAgY3Jvc3NoYWlyLnNjYWxlWCA9IHNjYWxlQ3Jvc3NoYWlyO1xuICBjcm9zc2hhaXIuc2NhbGVZID0gc2NhbGVDcm9zc2hhaXI7XG4gIGNyb3NzaGFpci50cmFuc2xhdGVZID0geVRyYW5zbGF0ZTtcblxuICBjb25zdCBzY2FsZURvdWJsZUxpbmUgPSBwYXJhbXMuZGVncmVlczJTY2FsZShBTkdMRV9CRVRXRUVOX0xJTkVTLCBkb3VibGVsaW5lLmdldE1lYXN1cmVkSGVpZ2h0KCkpO1xuICBkb3VibGVsaW5lLnNjYWxlWCA9IHNjYWxlRG91YmxlTGluZTtcbiAgZG91YmxlbGluZS5zY2FsZVkgPSBzY2FsZURvdWJsZUxpbmU7XG5cbiAgaWYgKGFwcC5pb3MpIHtcbiAgICBsZXQgY2FtZXJhVmlldyA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJwbGFjZWhvbGRlci12aWV3XCIpO1xuICAgIGNhbWVyYVZpZXcuYW5pbWF0ZSh7XG4gICAgICBzY2FsZToge1xuICAgICAgICB4OiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMvY2FtZXJhVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLFxuICAgICAgICB5OiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMvY2FtZXJhVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpXG4gICAgICB9LFxuICAgICAgdHJhbnNsYXRlOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IGFwcC5pb3M/IC0xMCA6IDBcbiAgICAgIH0sXG4gICAgICBkdXJhdGlvbjogMjAwXG4gICAgfSk7XG4gIH1cbn07XG5jb25zdCB1cGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICBjaGFydHMudXBkYXRlR3JhcGgoeCx5LCBpc09uKTtcbiAgaW5zdHJ1Y3Rpb25zLnRyaWdnZXIyKHkpO1xuICBpbnN0cnVjdGlvbnMudHJpZ2dlcjQoeCk7XG4gIC8vIHRpbWVyLS07XG4gIC8vIGlmKHRpbWVyIDwgMCkge1xuICAvLyAgIHRpbWVyID0gMTAwO1xuICAvLyAgIHJvdFZlY3Rvci5zdG9wUm90VXBkYXRlcygpO1xuICAvLyAgIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMocm90YXRpb25DYWxsYmFjaywgIHsgc2Vuc29yRGVsYXk6IFwiZ2FtZVwiIH0pO1xuICAvLyB9XG4gIGlmKGlzRmlyc3QpIHtcbiAgICByZXNpemUoKTtcbiAgICBpc0ZpcnN0ID0gZmFsc2U7XG4gIH1cbiAgY3Jvc3NoYWlyLnJvdGF0ZSA9IC16O1xuICBjb25zdCBkaXN0YW5jZUZyb21DZW50ZXIgPSBwYXJhbXMucGl4ZWxzMkRwKChwYXJhbXMuZGVncmVlczJQaXhlbHMoKC15ICUgQU5HTEVfQkVUV0VFTl9MSU5FUylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEFOR0xFX0JFVFdFRU5fTElORVMvMiAqICh5PjA/IC0xOiAxKSkpKTtcbiAgZG91YmxlbGluZS50cmFuc2xhdGVYID0gTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqZGlzdGFuY2VGcm9tQ2VudGVyO1xuICBkb3VibGVsaW5lLnRyYW5zbGF0ZVkgPSAgTWF0aC5jb3MoeipNYXRoLlBJLzE4MCkqZGlzdGFuY2VGcm9tQ2VudGVyICsgeVRyYW5zbGF0ZTtcbiAgZG91YmxlbGluZS5yb3RhdGUgPSAtejtcblxuICBjb25zdCBkaXN0ID0gcGFyYW1zLmRlZ3JlZXMyU2NhbGUoQU5HTEVfQkVUV0VFTl9MSU5FUywgZG91YmxlbGluZS5nZXRNZWFzdXJlZEhlaWdodCgpKSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKTtcblxuICBsb3dlclRleHQudGV4dCA9IDEwKiBNYXRoLmZsb29yKC15LzEwKTtcbiAgbG93ZXJUZXh0LnRyYW5zbGF0ZVggPSBNYXRoLnNpbih6ICogTWF0aC5QSS8xODApKiAoKGFwcC5pb3M/IDIwOiAwKSArIGRpc3RhbmNlRnJvbUNlbnRlciArIGRpc3QpO1xuICBsb3dlclRleHQudHJhbnNsYXRlWSA9IE1hdGguY29zKHogKiBNYXRoLlBJLzE4MCkqICgoYXBwLmlvcz8gMjA6IDApICsgZGlzdGFuY2VGcm9tQ2VudGVyICsgZGlzdCkgKyB5VHJhbnNsYXRlO1xuICBsb3dlclRleHQucm90YXRlID0gLXo7XG5cbiAgdXBwZXJUZXh0LnRleHQgPSAxMCogTWF0aC5mbG9vcigoLXkgKyAxMCkvMTApO1xuICB1cHBlclRleHQudHJhbnNsYXRlWCA9IE1hdGguc2luKHogKiBNYXRoLlBJLzE4MCkqICgoYXBwLmlvcz8gLTIwOiAwKSArIGRpc3RhbmNlRnJvbUNlbnRlciAtIGRpc3QpO1xuICB1cHBlclRleHQudHJhbnNsYXRlWSA9IE1hdGguY29zKHogKiBNYXRoLlBJLzE4MCkqICgoYXBwLmlvcz8gLTIwOiAwKSArIGRpc3RhbmNlRnJvbUNlbnRlciAtIGRpc3QpICsgeVRyYW5zbGF0ZTtcbiAgdXBwZXJUZXh0LnJvdGF0ZSA9IC16O1xufTtcblxuY29uc3Qgcm90YXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcbiAgICB4ID0gZGF0YS54O1xuICAgIHkgPSBkYXRhLnk7XG4gICAgeiA9IGRhdGEuejtcbiAgICBpZihhcHAuaW9zKSB1cGRhdGVDYWxsYmFjaygpOyAvLyBpb3MgZG9lc24ndCBzZWVtIHRvIGV4cG9zZSBhIGNhbGxiYWNrIGZvciBldmVyeSBmcmFtZSB1cGRhdGUgaW4gdGhlIGNhbWVyYSBwcmV2aWV3OyB0aGVyZWZvcmUsIHdlJ2xsIGhvcCBvbiB0aGUgcm90YXRpb24gY2FsbGJhY2tcbn07XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBzaG93U2lkZURyYXdlcihhcmdzOiBFdmVudERhdGEpIHtcbi8vICAgICBjb25zb2xlLmxvZyhcIlNob3cgU2lkZURyYXdlciB0YXBwZWQuXCIpO1xuLy8gfVxuXG4vL1RPRE86IHNwbGl0IHVwIHRoZSBjb2RlXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XG4gIG9yaWVudGF0aW9uLnNldEN1cnJlbnRPcmllbnRhdGlvbihcInBvcnRyYWl0XCIsICgpID0+IHt9KTtcbiAgaWYgKGFwcC5hbmRyb2lkICYmIHBsYXRmb3JtLmRldmljZS5zZGtWZXJzaW9uID49ICcyMScpIHtcbiAgICAgIGNvbnN0IFZpZXcgOmFueSA9IGFuZHJvaWQudmlldy5WaWV3O1xuICAgICAgY29uc3Qgd2luZG93ID0gYXBwLmFuZHJvaWQuc3RhcnRBY3Rpdml0eS5nZXRXaW5kb3coKTtcbiAgICAgIC8vIHNldCB0aGUgc3RhdHVzIGJhciB0byBDb2xvci5UcmFuc3BhcmVudFxuICAgICAgLy8gd2luZG93LnNldFN0YXR1c0JhckNvbG9yKDB4MDAwMDAwKTtcbiAgICAgIGNvbnN0IGRlY29yVmlldyA9IHdpbmRvdy5nZXREZWNvclZpZXcoKTtcbiAgICAgIGRlY29yVmlldy5zZXRTeXN0ZW1VaVZpc2liaWxpdHkoXG4gICAgICAgICAgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfU1RBQkxFXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9ISURFX05BVklHQVRJT05cbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0ZVTExTQ1JFRU5cbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSElERV9OQVZJR0FUSU9OIC8vIGhpZGUgbmF2IGJhclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19GVUxMU0NSRUVOIC8vIGhpZGUgc3RhdHVzIGJhclxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19JTU1FUlNJVkVfU1RJQ0tZKTtcbiAgfVxuICBjYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKGFyZ3MsIFwicGxhY2Vob2xkZXItdmlld1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uQ3JlYXRpbmdWaWV3KGFyZ3M6IEV2ZW50RGF0YSkge1xuICBjaGFydHMuaW5pdEdyYXBoKHBhZ2UpO1xuICBpbnN0cnVjdGlvbnMudHJpZ2dlcjEocGFnZSk7XG4gIGlmKGFwcC5hbmRyb2lkKSB7XG4gICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZFtcIk1hbmlmZXN0XCJdLnBlcm1pc3Npb24uQ0FNRVJBLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHZpZXdmaW5kZXJcIilcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIldvbyBIb28sIEkgaGF2ZSB0aGUgcG93ZXIhXCIpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgIGNvbnNvbGUubG9nKFwiVWggb2gsIG5vIHBlcm1pc3Npb25zIC0gcGxhbiBCIHRpbWUhXCIpO1xuICAgIH0pO1xuICB9XG4gIGlmKGFwcC5hbmRyb2lkKSBwYXJhbXMuaW5pdGlhbGl6ZSgpO1xuICBjYW1lcmFQcmV2aWV3Lm9uQ3JlYXRpbmdWaWV3KHVwZGF0ZUNhbGxiYWNrLCBhcmdzKTtcbiAgaWYgKGFwcC5pb3MgIT09IHVuZGVmaW5lZCkgcGFyYW1zLmluaXRpYWxpemUoKTtcbiAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhyb3RhdGlvbkNhbGxiYWNrLCAgeyBzZW5zb3JEZWxheTogXCJnYW1lXCIgfSk7XG4gIGNvbnN0IG1heFNpemUgPSBjYW1lcmFQcmV2aWV3LmdldE1heFNpemUoKTtcbiAgcGFyYW1zLnNldFZhcnMobWF4U2l6ZVswXSwgbWF4U2l6ZVsxXSk7XG4gIC8vIGNvbnNvbGUubG9nKHBhcmFtcy5nZXRWZXJ0aWNhbEZPVigpICsgXCIgXCIgKyBwYXJhbXMuZ2V0SG9yaXpvbnRhbEZPVigpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uVGFrZVNob3QoYXJnczogRXZlbnREYXRhKSB7XG4gIGNhbWVyYVByZXZpZXcub25UYWtlU2hvdChhcmdzKTtcbiAgaW5zdHJ1Y3Rpb25zLnRyaWdnZXIzKHgpO1xuICBpc09uID0gIWlzT247XG5cbiAgY2FwdHVyZWJ0bi5hbmltYXRlKHtcbiAgICBzY2FsZTogeyB4OiAxLjIsIHk6IDEuMiB9LFxuICAgIGR1cmF0aW9uOiAxMDBcbiAgfSkudGhlbigoKT0+IHtcbiAgICBjYXB0dXJlYnRuLmFuaW1hdGUoXG4gICAgICB7XG4gICAgICAgIHNjYWxlOiB7IHg6IDEsIHk6IDF9LFxuICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICBjdXJ2ZTogQW5pbWF0aW9uQ3VydmUuc3ByaW5nXG4gICAgICB9XG4gICAgKTtcbiAgICByZWNvcmRzdG9wLnNyYyA9IGlzT24/IFwicmVzOi8vc3RvcFwiIDogXCJyZXM6Ly9yZWNvcmRcIjtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiZWw6IFwiICsgeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkNsZWFyKGFyZ3M6IEV2ZW50RGF0YSkge1xuICBjaGFydHMuY2xlYXIoKTtcbiAgY2xlYXJidG4uYW5pbWF0ZSh7XG4gICAgc2NhbGU6IHsgeDogMS4yLCB5OiAxLjIgfSxcbiAgICBkdXJhdGlvbjogMTAwXG4gIH0pLnRoZW4oKCk9PiB7XG4gICAgY2xlYXJidG4uYW5pbWF0ZSh7XG4gICAgICAgIHNjYWxlOiB7IHg6IDEsIHk6IDF9LFxuICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICBjdXJ2ZTogQW5pbWF0aW9uQ3VydmUuc3ByaW5nXG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGluZ1RvKGFyZ3M6IEV2ZW50RGF0YSkge1xuICAgIHBhZ2UgPSA8UGFnZT5hcmdzLm9iamVjdDtcbiAgICBjcm9zc2hhaXIgPSBwYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xuICAgIGRvdWJsZWxpbmUgPSBwYWdlLmdldFZpZXdCeUlkKFwiZG91YmxlbGluZVwiKTtcbiAgICB1cHBlclRleHQgPSBwYWdlLmdldFZpZXdCeUlkKFwidXBwZXJUZXh0XCIpO1xuICAgIGxvd2VyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJsb3dlclRleHRcIik7XG4gICAgY2FwdHVyZWJ0biA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJjYXB0dXJlYnRuXCIpO1xuICAgIGNsZWFyYnRuID0gcGFnZS5nZXRWaWV3QnlJZChcImNsZWFyYnRuXCIpO1xuICAgIHJlY29yZHN0b3AgPSBwYWdlLmdldFZpZXdCeUlkKFwicmVjb3Jkc3RvcFwiKTtcbn1cblxuYXBwLm9uKGFwcC5yZXN1bWVFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RhcnRSb3RVcGRhdGVzKHJvdGF0aW9uQ2FsbGJhY2ssICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcbiAgY2FtZXJhUHJldmlldy5vblJlc3VtZSgpO1xufSk7XG5hcHAub24oYXBwLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICBjYW1lcmFQcmV2aWV3Lm9uUGF1c2UoKTtcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XG4gIGNoYXJ0cy5vbkV4aXQoKTtcbn0pO1xuYXBwLm9uKGFwcC5leGl0RXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcbiAgY29uc29sZS5sb2coXCJPbiBFeGl0dGluZ1wiKTtcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XG59KTtcbiJdfQ==
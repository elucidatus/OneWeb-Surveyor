/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_view_model_1 = require("./main-view-model");
var cameraPreview = require("./nativescript-camera-preview/nativescript-camera-preview");
var rotVector = require("./nativescript-rotation-vector/index");
var app = require("application");
var platform = require("platform");
var orientation = require("nativescript-screen-orientation");
var params = require("./nativescript-fov/nativescript-fov");
var permissions = require("nativescript-permissions");
var crosshair;
var doubleline;
var upperText;
var lowerText;
var x, y, z;
var measuredWidth;
var page;
var OUTER_CIRCLE_DIAMETER = 2;
var ANGLE_BETWEEN_LINES = 10;
var updateCallback = function () {
    // console.log("Entered updateCallback");
    var scaleCrosshair = params.degrees2Scale(OUTER_CIRCLE_DIAMETER, crosshair.getMeasuredHeight());
    crosshair.animate({
        scale: {
            x: scaleCrosshair,
            y: scaleCrosshair
        },
        translate: {
            x: 0,
            y: app.ios ? -10 : 0
        },
        rotate: -z,
        duration: 0
    });
    var scaleDoubleLine = params.degrees2Scale(ANGLE_BETWEEN_LINES, doubleline.getMeasuredHeight());
    var distanceFromCenter = params.pixels2Dp((params.degrees2Pixels((-y % ANGLE_BETWEEN_LINES)
        - ANGLE_BETWEEN_LINES / 2 * (y > 0 ? -1 : 1))));
    lowerText.text = 10 * Math.floor(-y / 10);
    upperText.text = 10 * Math.floor((-y + 10) / 10);
    doubleline.animate({
        scale: {
            x: scaleDoubleLine,
            y: scaleDoubleLine
        },
        translate: {
            x: Math.sin(z * Math.PI / 180) * distanceFromCenter,
            y: Math.cos(z * Math.PI / 180) * distanceFromCenter + (app.ios ? -10 : 0)
        },
        rotate: -z,
        duration: 0
    });
    lowerText.animate({
        translate: {
            x: Math.sin(z * Math.PI / 180) * (distanceFromCenter + scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)),
            y: Math.cos(z * Math.PI / 180) * (distanceFromCenter + scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)) + (app.ios ? -10 : 0)
        },
        rotate: -z,
        duration: 0
    });
    upperText.animate({
        translate: {
            x: Math.sin(z * Math.PI / 180) * (distanceFromCenter - scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)),
            y: Math.cos(z * Math.PI / 180) * (distanceFromCenter - scaleDoubleLine * params.degrees2Pixels(ANGLE_BETWEEN_LINES / 2)) + (app.ios ? -10 : 0)
        },
        rotate: -z,
        duration: 0
    });
    if (app.ios) {
        var cameraView = page.getViewById("placeholder-view");
        ;
        cameraView.animate({
            scale: {
                x: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight(),
                y: platform.screen.mainScreen.heightPixels / cameraView.getMeasuredHeight()
            },
            translate: {
                x: 0,
                y: app.ios ? -10 : 0
            },
            duration: 2000
        });
    }
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
        window_1.setStatusBarColor(0x000000);
        var decorView = window_1.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    cameraPreview.onLoaded(args, "placeholder-view");
    rotVector.startRotUpdates(function (data) {
        console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
        if (app.ios)
            updateCallback();
    }, { sensorDelay: "game" });
}
exports.onLoaded = onLoaded;
function onCreatingView(args) {
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
    if (app.ios)
        params.initialize();
    var maxSize = cameraPreview.getMaxSize();
    params.setVars(maxSize[0], maxSize[1]);
    measuredWidth = params.degrees2Pixels(OUTER_CIRCLE_DIAMETER);
    console.log(params.getVerticalFOV() + " " + params.getHorizontalFOV());
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
    console.log("el: " + y);
}
exports.onTakeShot = onTakeShot;
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    page = args.object;
    crosshair = page.getViewById("crosshair");
    doubleline = page.getViewById("doubleline");
    upperText = page.getViewById("upperText");
    lowerText = page.getViewById("lowerText");
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().


    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = new main_view_model_1.HelloWorldModel();
}
exports.navigatingTo = navigatingTo;
//TODO: Camera onResume, when it's lost. FYI: https://docs.nativescript.org/core-concepts/application-lifecycle
app.on(app.resumeEvent, function (args) {
    //onCreatingView(args);
    cameraPreview.onResume();
});
app.on(app.suspendEvent, function (args) {
    cameraPreview.onPause();
    rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function (args) {
    rotVector.stopRotUpdates();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQUduQyxtQ0FBcUM7QUFDckMsNkRBQStEO0FBQy9ELDREQUE4RDtBQUM5RCxzREFBd0Q7QUFFeEQsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxVQUFlLENBQUM7QUFDcEIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxTQUFjLENBQUM7QUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLElBQUksYUFBYSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDO0FBRVQsSUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFL0IsSUFBTSxjQUFjLEdBQUc7SUFDckIseUNBQXlDO0lBQ3pDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNsRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hCLEtBQUssRUFBRTtZQUNMLENBQUMsRUFBRSxjQUFjO1lBQ2pCLENBQUMsRUFBRSxjQUFjO1NBQ2xCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO1NBQ3BCO1FBQ0QsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNWLFFBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDO0lBRUgsSUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lB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V0FBVyxDQUFDLENBQUM7SUFDMUM7Ozs7Ozs7Ozs7TUFVRTtJQUNGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQXZCRCxvQ0F1QkM7QUFFRCwrR0FBK0c7QUFDL0csR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVMsSUFBSTtJQUNuQyx1QkFBdUI7SUFDdkIsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVMsSUFBSTtJQUNwQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDeEIsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSTtJQUNqQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5JbiBOYXRpdmVTY3JpcHQsIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYW4gWE1MIGZpbGUgaXMga25vd24gYXNcclxuYSBjb2RlLWJlaGluZCBmaWxlLiBUaGUgY29kZS1iZWhpbmQgaXMgYSBncmVhdCBwbGFjZSB0byBwbGFjZSB5b3VyIHZpZXdcclxubG9naWMsIGFuZCB0byBzZXQgdXAgeW91ciBwYWdl4oCZcyBkYXRhIGJpbmRpbmcuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XHJcbmltcG9ydCB7IEhlbGxvV29ybGRNb2RlbCB9IGZyb20gJy4vbWFpbi12aWV3LW1vZGVsJztcclxuaW1wb3J0ICogYXMgY2FtZXJhUHJldmlldyBmcm9tICcuL25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldy9uYXRpdmVzY3JpcHQtY2FtZXJhLXByZXZpZXcnO1xyXG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3Rvci9pbmRleFwiO1xyXG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcbmltcG9ydCAqIGFzIGZyYW1lTW9kdWxlIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lXCI7XHJcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hbmltYXRpb25cIjtcclxuaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCAqIGFzIG9yaWVudGF0aW9uIGZyb20gXCJuYXRpdmVzY3JpcHQtc2NyZWVuLW9yaWVudGF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIHBhcmFtcyBmcm9tIFwiLi9uYXRpdmVzY3JpcHQtZm92L25hdGl2ZXNjcmlwdC1mb3ZcIjtcclxuaW1wb3J0ICogYXMgcGVybWlzc2lvbnMgZnJvbSBcIm5hdGl2ZXNjcmlwdC1wZXJtaXNzaW9uc1wiO1xyXG5cclxubGV0IGNyb3NzaGFpciA6YW55O1xyXG5sZXQgZG91YmxlbGluZSA6YW55O1xyXG5sZXQgdXBwZXJUZXh0IDphbnk7XHJcbmxldCBsb3dlclRleHQgOmFueTtcclxubGV0IHgsIHksIHo7XHJcbmxldCBtZWFzdXJlZFdpZHRoO1xyXG5sZXQgcGFnZTtcclxuXHJcbmNvbnN0IE9VVEVSX0NJUkNMRV9ESUFNRVRFUiA9IDI7XHJcbmNvbnN0IEFOR0xFX0JFVFdFRU5fTElORVMgPSAxMDtcclxuXHJcbmNvbnN0IHVwZGF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJFbnRlcmVkIHVwZGF0ZUNhbGxiYWNrXCIpO1xyXG4gIGNvbnN0IHNjYWxlQ3Jvc3NoYWlyID0gcGFyYW1zLmRlZ3JlZXMyU2NhbGUoT1VURVJfQ0lSQ0xFX0RJQU1FVEVSLCBjcm9zc2hhaXIuZ2V0TWVhc3VyZWRIZWlnaHQoKSk7XHJcbiAgY3Jvc3NoYWlyLmFuaW1hdGUoe1xyXG4gICAgc2NhbGU6IHtcclxuICAgICAgeDogc2NhbGVDcm9zc2hhaXIsXHJcbiAgICAgIHk6IHNjYWxlQ3Jvc3NoYWlyXHJcbiAgICB9LFxyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IGFwcC5pb3M/IC0xMCA6IDBcclxuICAgIH0sXHJcbiAgICByb3RhdGU6IC16LFxyXG4gICAgZHVyYXRpb246IDBcclxuICB9KTtcclxuXHJcbiAgY29uc3Qgc2NhbGVEb3VibGVMaW5lID0gcGFyYW1zLmRlZ3JlZXMyU2NhbGUoQU5HTEVfQkVUV0VFTl9MSU5FUywgZG91YmxlbGluZS5nZXRNZWFzdXJlZEhlaWdodCgpKTtcclxuICBjb25zdCBkaXN0YW5jZUZyb21DZW50ZXIgPSBwYXJhbXMucGl4ZWxzMkRwKChwYXJhbXMuZGVncmVlczJQaXhlbHMoKC15ICUgQU5HTEVfQkVUV0VFTl9MSU5FUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gQU5HTEVfQkVUV0VFTl9MSU5FUy8yICogKHk+MD8gLTE6IDEpKSkpO1xyXG4gIGxvd2VyVGV4dC50ZXh0ID0gMTAqIE1hdGguZmxvb3IoLXkvMTApO1xyXG4gIHVwcGVyVGV4dC50ZXh0ID0gMTAqIE1hdGguZmxvb3IoKC15KzEwKS8xMCk7XHJcbiAgZG91YmxlbGluZS5hbmltYXRlKHtcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIHg6IHNjYWxlRG91YmxlTGluZSxcclxuICAgICAgeTogc2NhbGVEb3VibGVMaW5lXHJcbiAgICB9LFxyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIHggOiBNYXRoLnNpbih6Kk1hdGguUEkvMTgwKSpkaXN0YW5jZUZyb21DZW50ZXIsXHJcbiAgICAgIHk6IE1hdGguY29zKHoqTWF0aC5QSS8xODApKmRpc3RhbmNlRnJvbUNlbnRlciArIChhcHAuaW9zPyAtMTAgOiAwKVxyXG4gICAgfSxcclxuXHJcbiAgICByb3RhdGU6IC16LFxyXG4gICAgZHVyYXRpb246IDBcclxuICB9KTtcclxuICBsb3dlclRleHQuYW5pbWF0ZSh7XHJcbiAgICB0cmFuc2xhdGU6IHtcclxuICAgICAgeCA6IE1hdGguc2luKHoqTWF0aC5QSS8xODApKiAoZGlzdGFuY2VGcm9tQ2VudGVyK3NjYWxlRG91YmxlTGluZSpwYXJhbXMuZGVncmVlczJQaXhlbHMoQU5HTEVfQkVUV0VFTl9MSU5FUy8yKSksXHJcbiAgICAgIHkgOiBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSogKGRpc3RhbmNlRnJvbUNlbnRlcitzY2FsZURvdWJsZUxpbmUqcGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKEFOR0xFX0JFVFdFRU5fTElORVMvMikpICsgKGFwcC5pb3M/IC0xMCA6IDApXHJcbiAgICB9LFxyXG4gICAgcm90YXRlOiAteixcclxuICAgIGR1cmF0aW9uOiAwXHJcbiAgfSk7XHJcbiAgdXBwZXJUZXh0LmFuaW1hdGUoe1xyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIHggOiAgTWF0aC5zaW4oeipNYXRoLlBJLzE4MCkqIChkaXN0YW5jZUZyb21DZW50ZXItc2NhbGVEb3VibGVMaW5lKnBhcmFtcy5kZWdyZWVzMlBpeGVscyhBTkdMRV9CRVRXRUVOX0xJTkVTLzIpKSxcclxuICAgICAgeSA6ICBNYXRoLmNvcyh6Kk1hdGguUEkvMTgwKSogKGRpc3RhbmNlRnJvbUNlbnRlci1zY2FsZURvdWJsZUxpbmUqcGFyYW1zLmRlZ3JlZXMyUGl4ZWxzKEFOR0xFX0JFVFdFRU5fTElORVMvMikpICsgKGFwcC5pb3M/IC0xMCA6IDApXHJcbiAgICB9LFxyXG4gICAgcm90YXRlOiAteixcclxuICAgIGR1cmF0aW9uOiAwXHJcbiAgfSk7XHJcbiAgaWYgKGFwcC5pb3MpIHtcclxuICAgIGxldCBjYW1lcmFWaWV3ID0gcGFnZS5nZXRWaWV3QnlJZChcInBsYWNlaG9sZGVyLXZpZXdcIik7O1xyXG4gICAgY2FtZXJhVmlldy5hbmltYXRlKHtcclxuICAgICAgc2NhbGU6IHtcclxuICAgICAgICB4OiBwbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5oZWlnaHRQaXhlbHMvY2FtZXJhVmlldy5nZXRNZWFzdXJlZEhlaWdodCgpLFxyXG4gICAgICAgIHk6IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLmhlaWdodFBpeGVscy9jYW1lcmFWaWV3LmdldE1lYXN1cmVkSGVpZ2h0KClcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiBhcHAuaW9zPyAtMTAgOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIGR1cmF0aW9uOiAyMDAwXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59O1xyXG5cclxuLy8gZXhwb3J0IGZ1bmN0aW9uIHNob3dTaWRlRHJhd2VyKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4vLyAgICAgY29uc29sZS5sb2coXCJTaG93IFNpZGVEcmF3ZXIgdGFwcGVkLlwiKTtcclxuLy8gfVxyXG5cclxuLy9UT0RPOiBzcGxpdCB1cCB0aGUgY29kZVxyXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgb3JpZW50YXRpb24uc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG9ydHJhaXRcIiwgKCkgPT4ge30pO1xyXG4gIGlmIChhcHAuYW5kcm9pZCAmJiBwbGF0Zm9ybS5kZXZpY2Uuc2RrVmVyc2lvbiA+PSAnMjEnKSB7XHJcbiAgICAgIGNvbnN0IFZpZXcgOmFueSA9IGFuZHJvaWQudmlldy5WaWV3O1xyXG4gICAgICBjb25zdCB3aW5kb3cgPSBhcHAuYW5kcm9pZC5zdGFydEFjdGl2aXR5LmdldFdpbmRvdygpO1xyXG4gICAgICAvLyBzZXQgdGhlIHN0YXR1cyBiYXIgdG8gQ29sb3IuVHJhbnNwYXJlbnRcclxuICAgICAgd2luZG93LnNldFN0YXR1c0JhckNvbG9yKDB4MDAwMDAwKTtcclxuICAgICAgY29uc3QgZGVjb3JWaWV3ID0gd2luZG93LmdldERlY29yVmlldygpO1xyXG4gICAgICBkZWNvclZpZXcuc2V0U3lzdGVtVWlWaXNpYmlsaXR5KFxyXG4gICAgICAgICAgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfU1RBQkxFXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX0hJREVfTkFWSUdBVElPTlxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9GVUxMU0NSRUVOXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSElERV9OQVZJR0FUSU9OIC8vIGhpZGUgbmF2IGJhclxyXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0ZVTExTQ1JFRU4gLy8gaGlkZSBzdGF0dXMgYmFyXHJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSU1NRVJTSVZFX1NUSUNLWSk7XHJcbiAgfVxyXG4gIGNhbWVyYVByZXZpZXcub25Mb2FkZWQoYXJncywgXCJwbGFjZWhvbGRlci12aWV3XCIpO1xyXG5cclxuXHJcbiAgcm90VmVjdG9yLnN0YXJ0Um90VXBkYXRlcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwieDogXCIgKyBkYXRhLnggKyBcIiB5OiBcIiArIGRhdGEueSArIFwiIHo6IFwiICsgZGF0YS56KTtcclxuICAgICAgeCA9IGRhdGEueDtcclxuICAgICAgeSA9IGRhdGEueTtcclxuICAgICAgeiA9IGRhdGEuejtcclxuICAgICAgaWYoYXBwLmlvcykgdXBkYXRlQ2FsbGJhY2soKTtcclxuICB9LCAgeyBzZW5zb3JEZWxheTogXCJnYW1lXCIgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkNyZWF0aW5nVmlldyhhcmdzOiBFdmVudERhdGEpIHtcclxuICBpZihhcHAuYW5kcm9pZCkge1xyXG4gICAgcGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oYW5kcm9pZFtcIk1hbmlmZXN0XCJdLnBlcm1pc3Npb24uQ0FNRVJBLCBcIkkgbmVlZCB0aGVzZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHZpZXdmaW5kZXJcIilcclxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJXb28gSG9vLCBJIGhhdmUgdGhlIHBvd2VyIVwiKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIlVoIG9oLCBubyBwZXJtaXNzaW9ucyAtIHBsYW4gQiB0aW1lIVwiKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYoYXBwLmFuZHJvaWQpIHBhcmFtcy5pbml0aWFsaXplKCk7XHJcbiAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyh1cGRhdGVDYWxsYmFjaywgYXJncyk7XHJcbiAgaWYgKGFwcC5pb3MpIHBhcmFtcy5pbml0aWFsaXplKCk7XHJcbiAgY29uc3QgbWF4U2l6ZSA9IGNhbWVyYVByZXZpZXcuZ2V0TWF4U2l6ZSgpO1xyXG4gIHBhcmFtcy5zZXRWYXJzKG1heFNpemVbMF0sIG1heFNpemVbMV0pO1xyXG4gIG1lYXN1cmVkV2lkdGggPSBwYXJhbXMuZGVncmVlczJQaXhlbHMoT1VURVJfQ0lSQ0xFX0RJQU1FVEVSKTtcclxuICBjb25zb2xlLmxvZyhwYXJhbXMuZ2V0VmVydGljYWxGT1YoKSArIFwiIFwiICsgcGFyYW1zLmdldEhvcml6b250YWxGT1YoKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvblRha2VTaG90KGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gIGNhbWVyYVByZXZpZXcub25UYWtlU2hvdChhcmdzKTtcclxuICBjb25zb2xlLmxvZyhcImVsOiBcIiArIHkpO1xyXG59XHJcblxyXG4vLyBFdmVudCBoYW5kbGVyIGZvciBQYWdlIFwibmF2aWdhdGluZ1RvXCIgZXZlbnQgYXR0YWNoZWQgaW4gbWFpbi1wYWdlLnhtbFxyXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGluZ1RvKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgLypcclxuICAgIFRoaXMgZ2V0cyBhIHJlZmVyZW5jZSB0aGlzIHBhZ2XigJlzIDxQYWdlPiBVSSBjb21wb25lbnQuIFlvdSBjYW5cclxuICAgIHZpZXcgdGhlIEFQSSByZWZlcmVuY2Ugb2YgdGhlIFBhZ2UgdG8gc2VlIHdoYXTigJlzIGF2YWlsYWJsZSBhdFxyXG4gICAgaHR0cHM6Ly9kb2NzLm5hdGl2ZXNjcmlwdC5vcmcvYXBpLXJlZmVyZW5jZS9jbGFzc2VzL191aV9wYWdlXy5wYWdlLmh0bWxcclxuICAgICovXHJcbiAgICBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XHJcbiAgICBjcm9zc2hhaXIgPSBwYWdlLmdldFZpZXdCeUlkKFwiY3Jvc3NoYWlyXCIpO1xyXG4gICAgZG91YmxlbGluZSA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJkb3VibGVsaW5lXCIpO1xyXG4gICAgdXBwZXJUZXh0ID0gcGFnZS5nZXRWaWV3QnlJZChcInVwcGVyVGV4dFwiKTtcclxuICAgIGxvd2VyVGV4dCA9IHBhZ2UuZ2V0Vmlld0J5SWQoXCJsb3dlclRleHRcIik7XHJcbiAgICAvKlxyXG4gICAgQSBwYWdl4oCZcyBiaW5kaW5nQ29udGV4dCBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBwZXJmb3JtXHJcbiAgICBkYXRhIGJpbmRpbmcgYmV0d2VlbiBYTUwgbWFya3VwIGFuZCBUeXBlU2NyaXB0IGNvZGUuIFByb3BlcnRpZXNcclxuICAgIG9uIHRoZSBiaW5kaW5nQ29udGV4dCBjYW4gYmUgYWNjZXNzZWQgdXNpbmcgdGhlIHt7IH19IHN5bnRheCBpbiBYTUwuXHJcbiAgICBJbiB0aGlzIGV4YW1wbGUsIHRoZSB7eyBtZXNzYWdlIH19IGFuZCB7eyBvblRhcCB9fSBiaW5kaW5ncyBhcmUgcmVzb2x2ZWRcclxuICAgIGFnYWluc3QgdGhlIG9iamVjdCByZXR1cm5lZCBieSBjcmVhdGVWaWV3TW9kZWwoKS5cclxuXHJcblxyXG4gICAgWW91IGNhbiBsZWFybiBtb3JlIGFib3V0IGRhdGEgYmluZGluZyBpbiBOYXRpdmVTY3JpcHQgYXRcclxuICAgIGh0dHBzOi8vZG9jcy5uYXRpdmVzY3JpcHQub3JnL2NvcmUtY29uY2VwdHMvZGF0YS1iaW5kaW5nLlxyXG4gICAgKi9cclxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSGVsbG9Xb3JsZE1vZGVsKCk7XHJcbn1cclxuXHJcbi8vVE9ETzogQ2FtZXJhIG9uUmVzdW1lLCB3aGVuIGl0J3MgbG9zdC4gRllJOiBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2FwcGxpY2F0aW9uLWxpZmVjeWNsZVxyXG5hcHAub24oYXBwLnJlc3VtZUV2ZW50LCBmdW5jdGlvbihhcmdzKSB7XHJcbiAgLy9vbkNyZWF0aW5nVmlldyhhcmdzKTtcclxuICBjYW1lcmFQcmV2aWV3Lm9uUmVzdW1lKCk7XHJcbn0pO1xyXG5hcHAub24oYXBwLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24oYXJncykge1xyXG4gIGNhbWVyYVByZXZpZXcub25QYXVzZSgpO1xyXG4gIHJvdFZlY3Rvci5zdG9wUm90VXBkYXRlcygpO1xyXG59KTtcclxuYXBwLm9uKGFwcC5leGl0RXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcclxuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcclxufSk7XHJcbiJdfQ==
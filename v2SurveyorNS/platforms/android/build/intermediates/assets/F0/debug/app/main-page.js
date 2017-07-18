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
var crosshair;
var x, y, z;
function showSideDrawer(args) {
    console.log("Show SideDrawer tapped.");
}
exports.showSideDrawer = showSideDrawer;
function onLoaded(args) {
    var View = android.view.View;
    orientation.setCurrentOrientation("potrait", function () { });
    if (app.android && platform.device.sdkVersion >= '21') {
        var window = app.android.startActivity.getWindow();
        // set the status bar to Color.Transparent
        window.setStatusBarColor(0x000000);
        var decorView = window.getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
    cameraPreview.requestPermissions();
    cameraPreview.onLoaded(args);
    var myPage = args.object;
    crosshair = myPage.getViewById("crosshair");
    crosshair.animate({
        scale: { x: 2.25, y: 2.25 },
        duration: 0
    });
    rotVector.startRotUpdates(function (data) {
        //console.log("x: " + data.x + " y: " + data.y + " z: " + data.z);
        x = data.x;
        y = data.y;
        z = data.z;
    }, { sensorDelay: "game" });
}
exports.onLoaded = onLoaded;
function onCreatingView(args) {
    cameraPreview.onCreatingView(function () {
        crosshair.animate({
            rotate: -z,
            duration: 0.01
        });
    }, args);
}
exports.onCreatingView = onCreatingView;
function onTakeShot(args) {
    cameraPreview.onTakeShot(args);
}
exports.onTakeShot = onTakeShot;
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;
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
});
app.on(app.suspendEvent, function (args) {
    rotVector.stopRotUpdates();
});
app.on(app.exitEvent, function (args) {
    rotVector.stopRotUpdates();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7OztBQUlGLHFEQUFvRDtBQUNwRCx5RkFBMkY7QUFDM0YsZ0VBQWtFO0FBQ2xFLGlDQUFtQztBQUduQyxtQ0FBcUM7QUFDckMsNkRBQStEO0FBRy9ELElBQUksU0FBYyxDQUFDO0FBQ25CLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7QUFFVix3QkFBK0IsSUFBZTtJQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUZELHdDQUVDO0FBRUQsa0JBQXlCLElBQWU7SUFDdEMsSUFBSSxJQUFJLEdBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxjQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNuRCwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QyxTQUFTLENBQUMscUJBQXFCLENBQzNCLElBQUksQ0FBQyw0QkFBNEI7Y0FDL0IsSUFBSSxDQUFDLHFDQUFxQztjQUMxQyxJQUFJLENBQUMsZ0NBQWdDO2NBQ3JDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlO2NBQ25ELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxrQkFBa0I7Y0FDakQsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ25DLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsSUFBSSxNQUFNLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUMvQixTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2hCLEtBQUssRUFBRSxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBQztRQUN6QixRQUFRLEVBQUUsQ0FBQztLQUNaLENBQUMsQ0FBQztJQUNILFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBUyxJQUFJO1FBQ25DLGtFQUFrRTtRQUNsRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZixDQUFDLEVBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBL0JELDRCQStCQztBQUNELHdCQUErQixJQUFlO0lBQzVDLGFBQWEsQ0FBQyxjQUFjLENBQUM7UUFDM0IsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUNoQixNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDWCxDQUFDO0FBUEQsd0NBT0M7QUFDRCxvQkFBMkIsSUFBZTtJQUN4QyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFGRCxnQ0FFQztBQUNELHdFQUF3RTtBQUN4RSxzQkFBNkIsSUFBZTtJQUN4Qzs7OztNQUlFO0lBQ0YsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUU3Qjs7Ozs7Ozs7O01BU0U7SUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFuQkQsb0NBbUJDO0FBRUQsK0dBQStHO0FBQy9HLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFTLElBQUk7SUFDbkMsdUJBQXVCO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVMsSUFBSTtJQUNwQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJO0lBQ2pDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5JbiBOYXRpdmVTY3JpcHQsIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYW4gWE1MIGZpbGUgaXMga25vd24gYXNcbmEgY29kZS1iZWhpbmQgZmlsZS4gVGhlIGNvZGUtYmVoaW5kIGlzIGEgZ3JlYXQgcGxhY2UgdG8gcGxhY2UgeW91ciB2aWV3XG5sb2dpYywgYW5kIHRvIHNldCB1cCB5b3VyIHBhZ2XigJlzIGRhdGEgYmluZGluZy5cbiovXG5cbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XG5pbXBvcnQgeyBIZWxsb1dvcmxkTW9kZWwgfSBmcm9tICcuL21haW4tdmlldy1tb2RlbCc7XG5pbXBvcnQgKiBhcyBjYW1lcmFQcmV2aWV3IGZyb20gJy4vbmF0aXZlc2NyaXB0LWNhbWVyYS1wcmV2aWV3L25hdGl2ZXNjcmlwdC1jYW1lcmEtcHJldmlldyc7XG5pbXBvcnQgKiBhcyByb3RWZWN0b3IgZnJvbSBcIi4vbmF0aXZlc2NyaXB0LXJvdGF0aW9uLXZlY3Rvci9pbmRleFwiO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJhcHBsaWNhdGlvblwiO1xuaW1wb3J0ICogYXMgZnJhbWVNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWVcIjtcbmltcG9ydCAqIGFzIGFuaW1hdGlvbiBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9hbmltYXRpb25cIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xuaW1wb3J0ICogYXMgb3JpZW50YXRpb24gZnJvbSBcIm5hdGl2ZXNjcmlwdC1zY3JlZW4tb3JpZW50YXRpb25cIjtcblxuXG5sZXQgY3Jvc3NoYWlyIDphbnk7XG5sZXQgeCx5LHo7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93U2lkZURyYXdlcihhcmdzOiBFdmVudERhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhcIlNob3cgU2lkZURyYXdlciB0YXBwZWQuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25Mb2FkZWQoYXJnczogRXZlbnREYXRhKSB7XG4gIHZhciBWaWV3IDphbnkgPSBhbmRyb2lkLnZpZXcuVmlldztcbiAgb3JpZW50YXRpb24uc2V0Q3VycmVudE9yaWVudGF0aW9uKFwicG90cmFpdFwiLCAoKSA9PiB7fSk7XG4gIGlmIChhcHAuYW5kcm9pZCAmJiBwbGF0Zm9ybS5kZXZpY2Uuc2RrVmVyc2lvbiA+PSAnMjEnKSB7XG4gICAgICB2YXIgd2luZG93ID0gYXBwLmFuZHJvaWQuc3RhcnRBY3Rpdml0eS5nZXRXaW5kb3coKTtcbiAgICAgIC8vIHNldCB0aGUgc3RhdHVzIGJhciB0byBDb2xvci5UcmFuc3BhcmVudFxuICAgICAgd2luZG93LnNldFN0YXR1c0JhckNvbG9yKDB4MDAwMDAwKTtcbiAgICAgIHZhciBkZWNvclZpZXcgPSB3aW5kb3cuZ2V0RGVjb3JWaWV3KCk7XG4gICAgICBkZWNvclZpZXcuc2V0U3lzdGVtVWlWaXNpYmlsaXR5KFxuICAgICAgICAgIFZpZXcuU1lTVEVNX1VJX0ZMQUdfTEFZT1VUX1NUQUJMRVxuICAgICAgICAgIHwgVmlldy5TWVNURU1fVUlfRkxBR19MQVlPVVRfSElERV9OQVZJR0FUSU9OXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0xBWU9VVF9GVUxMU0NSRUVOXG4gICAgICAgICAgfCBWaWV3LlNZU1RFTV9VSV9GTEFHX0hJREVfTkFWSUdBVElPTiAvLyBoaWRlIG5hdiBiYXJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfRlVMTFNDUkVFTiAvLyBoaWRlIHN0YXR1cyBiYXJcbiAgICAgICAgICB8IFZpZXcuU1lTVEVNX1VJX0ZMQUdfSU1NRVJTSVZFX1NUSUNLWSk7XG4gIH1cblxuICBjYW1lcmFQcmV2aWV3LnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICBjYW1lcmFQcmV2aWV3Lm9uTG9hZGVkKGFyZ3MpO1xuICBsZXQgbXlQYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XG4gIGNyb3NzaGFpciA9IG15UGFnZS5nZXRWaWV3QnlJZChcImNyb3NzaGFpclwiKTtcbiAgY3Jvc3NoYWlyLmFuaW1hdGUoe1xuICAgIHNjYWxlOiB7eDogMi4yNSwgeTogMi4yNX0sXG4gICAgZHVyYXRpb246IDBcbiAgfSk7XG4gIHJvdFZlY3Rvci5zdGFydFJvdFVwZGF0ZXMoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcIng6IFwiICsgZGF0YS54ICsgXCIgeTogXCIgKyBkYXRhLnkgKyBcIiB6OiBcIiArIGRhdGEueik7XG4gICAgICB4ID0gZGF0YS54O1xuICAgICAgeSA9IGRhdGEueTtcbiAgICAgIHogPSBkYXRhLno7XG4gIH0sICB7IHNlbnNvckRlbGF5OiBcImdhbWVcIiB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbkNyZWF0aW5nVmlldyhhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vbkNyZWF0aW5nVmlldyhmdW5jdGlvbigpIHtcbiAgICBjcm9zc2hhaXIuYW5pbWF0ZSh7XG4gICAgICByb3RhdGU6IC16LFxuICAgICAgZHVyYXRpb246IDAuMDFcbiAgICB9KTtcbiAgfSwgYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gb25UYWtlU2hvdChhcmdzOiBFdmVudERhdGEpIHtcbiAgY2FtZXJhUHJldmlldy5vblRha2VTaG90KGFyZ3MpO1xufVxuLy8gRXZlbnQgaGFuZGxlciBmb3IgUGFnZSBcIm5hdmlnYXRpbmdUb1wiIGV2ZW50IGF0dGFjaGVkIGluIG1haW4tcGFnZS54bWxcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW5nVG8oYXJnczogRXZlbnREYXRhKSB7XG4gICAgLypcbiAgICBUaGlzIGdldHMgYSByZWZlcmVuY2UgdGhpcyBwYWdl4oCZcyA8UGFnZT4gVUkgY29tcG9uZW50LiBZb3UgY2FuXG4gICAgdmlldyB0aGUgQVBJIHJlZmVyZW5jZSBvZiB0aGUgUGFnZSB0byBzZWUgd2hhdOKAmXMgYXZhaWxhYmxlIGF0XG4gICAgaHR0cHM6Ly9kb2NzLm5hdGl2ZXNjcmlwdC5vcmcvYXBpLXJlZmVyZW5jZS9jbGFzc2VzL191aV9wYWdlXy5wYWdlLmh0bWxcbiAgICAqL1xuICAgIGxldCBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XG5cbiAgICAvKlxuICAgIEEgcGFnZeKAmXMgYmluZGluZ0NvbnRleHQgaXMgYW4gb2JqZWN0IHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gcGVyZm9ybVxuICAgIGRhdGEgYmluZGluZyBiZXR3ZWVuIFhNTCBtYXJrdXAgYW5kIFR5cGVTY3JpcHQgY29kZS4gUHJvcGVydGllc1xuICAgIG9uIHRoZSBiaW5kaW5nQ29udGV4dCBjYW4gYmUgYWNjZXNzZWQgdXNpbmcgdGhlIHt7IH19IHN5bnRheCBpbiBYTUwuXG4gICAgSW4gdGhpcyBleGFtcGxlLCB0aGUge3sgbWVzc2FnZSB9fSBhbmQge3sgb25UYXAgfX0gYmluZGluZ3MgYXJlIHJlc29sdmVkXG4gICAgYWdhaW5zdCB0aGUgb2JqZWN0IHJldHVybmVkIGJ5IGNyZWF0ZVZpZXdNb2RlbCgpLlxuXG4gICAgWW91IGNhbiBsZWFybiBtb3JlIGFib3V0IGRhdGEgYmluZGluZyBpbiBOYXRpdmVTY3JpcHQgYXRcbiAgICBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2RhdGEtYmluZGluZy5cbiAgICAqL1xuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSGVsbG9Xb3JsZE1vZGVsKCk7XG59XG5cbi8vVE9ETzogQ2FtZXJhIG9uUmVzdW1lLCB3aGVuIGl0J3MgbG9zdC4gRllJOiBodHRwczovL2RvY3MubmF0aXZlc2NyaXB0Lm9yZy9jb3JlLWNvbmNlcHRzL2FwcGxpY2F0aW9uLWxpZmVjeWNsZVxuYXBwLm9uKGFwcC5yZXN1bWVFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICAvL29uQ3JlYXRpbmdWaWV3KGFyZ3MpO1xufSk7XG5hcHAub24oYXBwLnN1c3BlbmRFdmVudCwgZnVuY3Rpb24oYXJncykge1xuICByb3RWZWN0b3Iuc3RvcFJvdFVwZGF0ZXMoKTtcbn0pO1xuYXBwLm9uKGFwcC5leGl0RXZlbnQsIGZ1bmN0aW9uKGFyZ3MpIHtcbiAgcm90VmVjdG9yLnN0b3BSb3RVcGRhdGVzKCk7XG59KTtcbiJdfQ==
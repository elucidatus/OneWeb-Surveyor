"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform = require("platform");
var page;
var ele = [];
var maxEle;
var minEle;
var targetEle;
var prevIndex;
var smoothingRange; // when there is a data skip in the azimuth, we want to smooth it out linearly. This is the max range of the smoothing. Any jumps more than 20 will not be smoothed
var width = platform.screen.mainScreen.widthPixels / 360 / platform.screen.mainScreen.scale; // in dp
var maxHeight = platform.screen.mainScreen.heightPixels / 8 / platform.screen.mainScreen.scale; // in dp
function initGraph(myPage) {
    console.log("Entering initGraph");
    page = myPage;
    maxEle = 60;
    minEle = 0;
    smoothingRange = 20;
    page.getViewById("graph").height = maxHeight;
    var ltarget = page.getViewById("ltarget");
    ltarget.height = width;
    console.log("ltarget: " + ltarget);
    //console.dir(ltarget);
    ltarget.translateY = ele2Percent(targetEle);
    for (var i = 0; i < 360; i++) {
        ele.push((maxEle + minEle) / 2);
        page.getViewById("l" + i).height = maxHeight * ele2Percent(ele[i]);
    }
}
exports.initGraph = initGraph;
function updateGraph(azimuth, elevation) {
    var az = Math.floor(azimuth) + 180;
    ele[az] = -elevation < minEle ? minEle : -elevation > maxEle ? maxEle : -elevation;
    var currentView = page.getViewById("l" + az);
    currentView.height = maxHeight * ele2Percent(ele[az]);
    var dif = az - prevIndex;
    if (Math.abs(dif) > 1 && Math.abs(dif) < smoothingRange) {
        var start = void 0, end = void 0;
        if (dif > 0) {
            start = prevIndex + 1;
            end = az;
        }
        else {
            start = az + 1;
            end = prevIndex;
        }
        for (var i = start; i < end; i++) {
            ele[i] = ele[start - 1] + (i - start + 1) / (dif - 1) * (ele[az] - ele[prevIndex]);
            page.getViewById("l" + (i)).height = maxHeight * ele2Percent(ele[i]);
        }
    }
    prevIndex = az;
}
exports.updateGraph = updateGraph;
function ele2Percent(elevation) {
    return (elevation - minEle) / (maxEle - minEle);
}
function onExit() {
}
exports.onExit = onExit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFxQztBQUlyQyxJQUFJLElBQUksQ0FBQztBQUNULElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztBQUV6QixJQUFJLE1BQWMsQ0FBQztBQUNuQixJQUFJLE1BQWMsQ0FBQztBQUNuQixJQUFJLFNBQWlCLENBQUM7QUFDdEIsSUFBSSxTQUFpQixDQUFDO0FBQ3RCLElBQUksY0FBc0IsQ0FBQyxDQUFDLG1LQUFtSztBQUUvTCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVE7QUFDdEcsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRO0FBRXpHLG1CQUEwQixNQUFNO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUNsQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2QsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNaLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDWCxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUM3QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLHVCQUF1QjtJQUN2QixPQUFPLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU1QyxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUUsTUFBTSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztBQUNILENBQUM7QUFqQkQsOEJBaUJDO0FBRUQscUJBQTRCLE9BQU8sRUFBRSxTQUFTO0lBQzVDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBQyxNQUFNLEdBQUUsTUFBTSxHQUFFLENBQUMsU0FBUyxHQUFDLE1BQU0sR0FBRSxNQUFNLEdBQUUsQ0FBQyxTQUFTLENBQUM7SUFFM0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0MsV0FBVyxDQUFDLE1BQU0sR0FBRyxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXRELElBQU0sR0FBRyxHQUFHLEVBQUUsR0FBQyxTQUFTLENBQUM7SUFDekIsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksS0FBSyxTQUFBLEVBQUUsR0FBRyxTQUFBLENBQUM7UUFDZixFQUFFLENBQUEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLEtBQUssR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDWCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFLLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNmLEdBQUcsR0FBRyxTQUFTLENBQUM7UUFDbEIsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDakMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO0lBQ0gsQ0FBQztJQUNELFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDakIsQ0FBQztBQXZCRCxrQ0F1QkM7QUFFRCxxQkFBcUIsU0FBUztJQUM1QixNQUFNLENBQUMsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUMsQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVEO0FBQ0EsQ0FBQztBQURELHdCQUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGxhdGZvcm0gZnJvbSBcInBsYXRmb3JtXCI7XHJcbmltcG9ydCAqIGFzIGtub3duQ29sb3JzIGZyb20gXCJjb2xvci9rbm93bi1jb2xvcnNcIjtcclxuaW1wb3J0ICogYXMgSW1hZ2VNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvaW1hZ2VcIjtcclxuXHJcbmxldCBwYWdlO1xyXG5jb25zdCBlbGU6IG51bWJlcltdID0gW107XHJcblxyXG5sZXQgbWF4RWxlOiBudW1iZXI7XHJcbmxldCBtaW5FbGU6IG51bWJlcjtcclxubGV0IHRhcmdldEVsZTogbnVtYmVyO1xyXG5sZXQgcHJldkluZGV4OiBudW1iZXI7XHJcbmxldCBzbW9vdGhpbmdSYW5nZTogbnVtYmVyOyAvLyB3aGVuIHRoZXJlIGlzIGEgZGF0YSBza2lwIGluIHRoZSBhemltdXRoLCB3ZSB3YW50IHRvIHNtb290aCBpdCBvdXQgbGluZWFybHkuIFRoaXMgaXMgdGhlIG1heCByYW5nZSBvZiB0aGUgc21vb3RoaW5nLiBBbnkganVtcHMgbW9yZSB0aGFuIDIwIHdpbGwgbm90IGJlIHNtb290aGVkXHJcblxyXG5jb25zdCB3aWR0aCA9IHBsYXRmb3JtLnNjcmVlbi5tYWluU2NyZWVuLndpZHRoUGl4ZWxzIC8gMzYwIC9wbGF0Zm9ybS5zY3JlZW4ubWFpblNjcmVlbi5zY2FsZTsgLy8gaW4gZHBcclxuY29uc3QgbWF4SGVpZ2h0ID0gcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uaGVpZ2h0UGl4ZWxzIC8gOCAvcGxhdGZvcm0uc2NyZWVuLm1haW5TY3JlZW4uc2NhbGU7IC8vIGluIGRwXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEdyYXBoKG15UGFnZSkge1xyXG4gIGNvbnNvbGUubG9nKFwiRW50ZXJpbmcgaW5pdEdyYXBoXCIpO1xyXG4gIHBhZ2UgPSBteVBhZ2U7XHJcbiAgbWF4RWxlID0gNjA7XHJcbiAgbWluRWxlID0gMDtcclxuICBzbW9vdGhpbmdSYW5nZSA9IDIwO1xyXG4gIHBhZ2UuZ2V0Vmlld0J5SWQoXCJncmFwaFwiKS5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gIGNvbnN0IGx0YXJnZXQgPSBwYWdlLmdldFZpZXdCeUlkKFwibHRhcmdldFwiKTtcclxuICBsdGFyZ2V0LmhlaWdodCA9IHdpZHRoO1xyXG4gIGNvbnNvbGUubG9nKFwibHRhcmdldDogXCIgKyBsdGFyZ2V0KTtcclxuICAvL2NvbnNvbGUuZGlyKGx0YXJnZXQpO1xyXG4gIGx0YXJnZXQudHJhbnNsYXRlWSA9IGVsZTJQZXJjZW50KHRhcmdldEVsZSk7XHJcblxyXG4gIGZvcihsZXQgaSA9IDA7IGkgPCAzNjA7IGkrKykge1xyXG4gICAgZWxlLnB1c2goKG1heEVsZSsgbWluRWxlKS8yKTtcclxuICAgIHBhZ2UuZ2V0Vmlld0J5SWQoXCJsXCIraSkuaGVpZ2h0ID0gbWF4SGVpZ2h0ICogZWxlMlBlcmNlbnQoZWxlW2ldKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVHcmFwaChhemltdXRoLCBlbGV2YXRpb24pIHtcclxuICBjb25zdCBheiA9IE1hdGguZmxvb3IoYXppbXV0aCkgKyAxODA7XHJcbiAgZWxlW2F6XSA9IC1lbGV2YXRpb248bWluRWxlPyBtaW5FbGU6IC1lbGV2YXRpb24+bWF4RWxlPyBtYXhFbGU6IC1lbGV2YXRpb247XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRWaWV3ID0gcGFnZS5nZXRWaWV3QnlJZChcImxcIitheik7XHJcbiAgY3VycmVudFZpZXcuaGVpZ2h0ID0gbWF4SGVpZ2h0ICogZWxlMlBlcmNlbnQoZWxlW2F6XSk7XHJcblxyXG4gIGNvbnN0IGRpZiA9IGF6LXByZXZJbmRleDtcclxuICBpZihNYXRoLmFicyhkaWYpID4gMSAmJiBNYXRoLmFicyhkaWYpIDwgc21vb3RoaW5nUmFuZ2UpIHtcclxuICAgIGxldCBzdGFydCwgZW5kO1xyXG4gICAgaWYoZGlmID4gMCkge1xyXG4gICAgICBzdGFydCA9IHByZXZJbmRleCArIDE7XHJcbiAgICAgIGVuZCA9IGF6O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3RhcnQgPSBheiArIDE7XHJcbiAgICAgIGVuZCA9IHByZXZJbmRleDtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XHJcbiAgICAgIGVsZVtpXSA9IGVsZVtzdGFydC0xXSArIChpIC0gc3RhcnQrMSkgLyAoZGlmLTEpICogKGVsZVthel0tZWxlW3ByZXZJbmRleF0pO1xyXG4gICAgICBwYWdlLmdldFZpZXdCeUlkKFwibFwiKyhpKSkuaGVpZ2h0ID0gbWF4SGVpZ2h0ICogZWxlMlBlcmNlbnQoZWxlW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJldkluZGV4ID0gYXo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVsZTJQZXJjZW50KGVsZXZhdGlvbikge1xyXG4gIHJldHVybiAoZWxldmF0aW9uIC0gbWluRWxlKS8obWF4RWxlLW1pbkVsZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkV4aXQoKSB7XHJcbn1cclxuIl19
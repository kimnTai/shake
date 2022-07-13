"use strict";
function setDeviceMotion(cb, errCb) {
    if (!window.DeviceMotionEvent) {
        errCb("设备不支持DeviceMotion");
        return;
    }
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent
            .requestPermission()
            .then(function (permissionState) {
            if (permissionState === "granted") {
                window.addEventListener("devicemotion", cb);
            }
        })
            .catch(function () {
            errCb("用户未允许权限");
        });
    }
    else {
        var timer_1 = setTimeout(function () {
            errCb("用户未开启权限");
        }, 1000);
        window.addEventListener("devicemotion", function (e) {
            clearTimeout(timer_1);
        }, { once: true });
        window.addEventListener("devicemotion", cb);
    }
}
function throttle(fn, interval, start) {
    var _this = this;
    if (interval === void 0) { interval = 200; }
    if (start === void 0) { start = true; }
    if (typeof fn !== "function") {
        return console.error("请传入一个函数");
    }
    var timer = 0;
    return function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (timer) {
            return;
        }
        start && fn.apply(_this, arg);
        timer = setTimeout(function () {
            !start && fn.apply(_this, arg);
            timer = 0;
        }, interval);
    };
}
function addShake(cbShake) {
    var maxRange = 30;
    var minRange = 10;
    var isShake = false;
    var lastX = 0;
    var lastY = 0;
    var lastZ = 0;
    var toShake = function (e) {
        var _a = e.acceleration, x = _a.x, y = _a.y, z = _a.z;
        var range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
        if (range > maxRange) {
            isShake = true;
        }
        if (range < minRange && isShake) {
            cbShake(e);
            isShake = false;
        }
        lastX = x;
        lastY = y;
        lastZ = z;
    };
    var window = Window;
    if (!window.shakeEvent) {
        window.shakeEvent = [];
    }
    toShake = throttle(toShake);
    window.shakeEvent.push(toShake);
    setDeviceMotion(toShake, function (errMessage) {
        alert(errMessage);
    });
    return window.shakeEvent.length - 1;
}
function removeShake(shakeIndex) {
    window.removeEventListener("devicemotion", window.shakeEvent[shakeIndex]);
}
var startBtn = document.querySelector("#startBtn");
var closeBtn = document.querySelector("#closeBtn");
var isStartShake = false;
var shakeIndex;
startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener("touchend", function () {
    if (isStartShake)
        return;
    isStartShake = true;
    shakeIndex = addShake(function () {
        alert("您进行了摇一摇");
    });
});
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("touchend", function () {
    if (!isStartShake)
        return;
    isStartShake = false;
    removeShake(shakeIndex);
});

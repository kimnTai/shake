"use strict";
var Shaker = (function () {
    function Shaker() {
        var _this = this;
        this.shakeEvent = [];
        var startBtn = document.querySelector("#startBtn");
        var closeBtn = document.querySelector("#closeBtn");
        var isStartShake = false;
        var shakeIndex = 0;
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener("pointerup", function () {
            if (isStartShake)
                return;
            isStartShake = true;
            alert("開啟");
            shakeIndex = _this.addShake();
        });
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("pointerup", function () {
            if (!isStartShake)
                return;
            isStartShake = false;
            alert("關閉");
            window.removeEventListener("devicemotion", _this.shakeEvent[shakeIndex]);
        });
    }
    Shaker.prototype.addShake = function () {
        var maxRange = 30;
        var minRange = 10;
        var isShake = false;
        var lastX = 0;
        var lastY = 0;
        var lastZ = 0;
        var toShake = this.throttle(function (e) {
            var _a = e.acceleration, x = _a.x, y = _a.y, z = _a.z;
            var range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
            if (range > maxRange) {
                isShake = true;
            }
            if (range < minRange && isShake) {
                alert("您進行了搖一搖");
                isShake = false;
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        });
        this.shakeEvent.push(toShake);
        this.setDeviceMotion(toShake, function (errMessage) { return alert(errMessage); });
        return this.shakeEvent.length - 1;
    };
    Shaker.prototype.throttle = function (fn, interval, start) {
        var _this = this;
        if (interval === void 0) { interval = 200; }
        if (start === void 0) { start = true; }
        if (typeof fn !== "function") {
            return console.error("請傳入一個函數");
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
    };
    Shaker.prototype.setDeviceMotion = function (cb, errCb) {
        if (!window.DeviceMotionEvent) {
            errCb("設備不支持DeviceMotion");
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
                .catch(function () { return errCb("用戶未允許權限"); });
        }
        else {
            var timer_1 = setTimeout(function () { return errCb("用戶未開啟權限"); }, 1000);
            window.addEventListener("devicemotion", function (e) { return clearTimeout(timer_1); }, { once: true });
            window.addEventListener("devicemotion", cb);
        }
    };
    return Shaker;
}());
new Shaker();

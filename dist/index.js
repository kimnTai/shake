"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShakeController = (function () {
    function ShakeController() {
        this.maxRange = 30;
        this.minRange = 10;
    }
    ShakeController.prototype.addShake = function (callBack) {
        var _this = this;
        if (typeof callBack !== "function") {
            return;
        }
        var isShake = false;
        var lastX = 0;
        var lastY = 0;
        var lastZ = 0;
        var toShake = this._throttle(function (e) {
            var _a = e.acceleration, x = _a.x, y = _a.y, z = _a.z;
            var range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
            if (range > _this.maxRange) {
                isShake = true;
                callBack();
            }
            if (range < _this.minRange && isShake) {
                isShake = false;
                _this._removeShake(toShake);
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        });
        this._setDeviceMotion(toShake, function (errMessage) { return alert(errMessage); });
    };
    ShakeController.prototype._removeShake = function (toShake) {
        window.removeEventListener("devicemotion", toShake);
    };
    ShakeController.prototype._throttle = function (fn) {
        var _this = this;
        if (typeof fn !== "function") {
            return console.error("請傳入一個函數");
        }
        var timer = 0;
        var interval = 200;
        return function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            if (timer)
                return;
            fn.apply(_this, arg);
            timer = setTimeout(function () { return (timer = 0); }, interval);
        };
    };
    ShakeController.prototype._setDeviceMotion = function (cb, errCb) {
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
    return ShakeController;
}());
exports.default = ShakeController;
function init() {
    var _this = this;
    var startBtn = document.querySelector("#startBtn");
    var closeBtn = document.querySelector("#closeBtn");
    var shakeIndex = 0;
    startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener("pointerup", function () {
        alert("開啟");
        _this.addShake(function () {
            alert("您進行了搖一搖");
        });
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("pointerup", function () {
        alert("關閉");
        window.removeEventListener("devicemotion", _this.shakeEvent[shakeIndex]);
    });
}
init();

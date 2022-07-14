/**
 * @description 搖一搖控制器
 * @export
 * @class ShakeController
 */
class ShakeController {
    // 當用戶的兩次加速度差值大於這個幅度，判定用戶進行了搖一搖功能
    maxRange = 30;
    //當用戶的兩次加速度差值小於這個幅度，判定用戶停止搖動手機
    minRange = 10;

    constructor() {
        // 調用搖一搖
        const startBtn = document.querySelector("#startBtn");

        // 再次強調 IOS 13.3 需要用戶觸發，再能開啟搖一搖
        startBtn?.addEventListener("pointerup", () => {
            alert("開啟");
            this.addShake(() => {
                alert("您進行了搖一搖");
            });
        });
    }

    /**
     * @description 添加搖一搖功能
     * @param {*} callBack
     */
    public addShake(callBack: any): void {
        if (typeof callBack !== "function") {
            return;
        }
        // 記錄用戶是否搖動手機
        let isShake = false;
        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;
        const toShake = this._throttle((e: DeviceMotionEvent) => {
            const { x, y, z } = e.acceleration as any;
            const range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
            if (range > this.maxRange) {
                //用戶進行了搖一搖
                isShake = true;
                callBack();
            }
            if (range < this.minRange && isShake) {
                // 停止摇一摇
                isShake = false;
                // 移除事件
                this._removeShake(toShake);
            }
            lastX = x;
            lastY = y;
            lastZ = z;
        });
        this._setDeviceMotion(toShake, (errMessage: any) => alert(errMessage));
    }

    /**
     * @description 移除 window 監聽
     * @param {*} toShake
     */
    _removeShake(toShake: any): void {
        window.removeEventListener("devicemotion", toShake);
    }

    /**
     * @description throttle 節流函數
     * @param {*} fn 要節流的函數
     * @return {*} 經過節流處理的函數
     */
    _throttle(fn: any): any {
        if (typeof fn !== "function") {
            return console.error("請傳入一個函數");
        }
        let timer = 0;
        const interval = 200;
        return (...arg: any) => {
            if (timer) return;
            fn.apply(this, arg);
            //@ts-ignore
            timer = setTimeout(() => (timer = 0), interval);
        };
    }

    /**
     * @description setDeviceMotion 添加陀螺儀監控
     * @param {*} cb devicemotion 的事件處理函數
     * @param {*} errCb 不支持 devicemotion 時的處理回調
     * @return {*}
     */
    _setDeviceMotion(cb: any, errCb: any): any {
        if (!window.DeviceMotionEvent) {
            errCb("設備不支持DeviceMotion");
            return;
        }
        if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
            // IOS 13
            (DeviceMotionEvent as any)
                .requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === "granted") {
                        window.addEventListener("devicemotion", cb);
                    }
                })
                .catch(() => errCb("用戶未允許權限"));
        } else {
            // 其他支持加速度檢測的系統
            const timer = setTimeout(() => errCb("用戶未開啟權限"), 1000);
            window.addEventListener("devicemotion", (e) => clearTimeout(timer), { once: true });
            window.addEventListener("devicemotion", cb);
        }
    }
}

new ShakeController();

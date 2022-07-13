class Shaker {
    shakeEvent: any[] = [];

    constructor() {
        // 調用搖一搖
        const startBtn = document.querySelector("#startBtn");
        const closeBtn = document.querySelector("#closeBtn");
        let isStartShake = false;
        let shakeIndex = 0;
        // 再次強調 IOS 13.3 需要用戶觸發，再能開啟搖一搖
        startBtn?.addEventListener("touchend", () => {
            if (isStartShake) return;
            isStartShake = true;
            alert("開啟");
            shakeIndex = this.addShake();
        });
        closeBtn?.addEventListener("touchend", () => {
            if (!isStartShake) return;
            isStartShake = false;
            alert("關閉");
            window.removeEventListener("devicemotion", this.shakeEvent[shakeIndex]);
        });
    }

    /**
     * @description 添加搖一搖功能
     * @return {*} shakeIndex 開啟的第幾個搖一搖功能的索引，用來刪除監聽
     */
    addShake(): number {
        const toShake = this.throttle(this.shake);
        this.shakeEvent.push(toShake);
        this.setDeviceMotion(toShake, (errMessage: any) => alert(errMessage));
        return this.shakeEvent.length - 1; //返回該次搖一搖處理的索引
    }

    /**
     * @description throttle 節流函數
     * @param {*} fn 要節流的函數
     * @param {number} [interval=200] 節流間隔時間
     * @param {boolean} [start=true] 是否在節流開始時執行 (true在開始時執行，false在結束時執行)
     * @return {*} 經過節流處理的函數
     */
    throttle(fn: any, interval: number = 200, start: boolean = true): any {
        if (typeof fn !== "function") {
            return console.error("請傳入一個函數");
        }
        let timer = 0;
        return (...arg: any) => {
            if (timer) {
                return;
            }
            start && fn.apply(this, arg);
            timer = setTimeout(() => {
                !start && fn.apply(this, arg);
                timer = 0;
            }, interval);
        };
    }

    /**
     * @description 搖一搖核心
     * @param {DeviceMotionEvent} e
     * @memberof Shaker
     */
    shake(e: DeviceMotionEvent): void {
        const maxRange = 30; //當用戶的兩次加速度差值大於這個幅度，判定用戶進行了搖一搖功能
        const minRange = 10; //當用戶的兩次加速度差值小於這個幅度，判定用戶停止搖動手機
        let isShake = false; //記錄用戶是否搖動手機
        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;
        const { x, y, z } = e.acceleration as any;
        const range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
        if (range > maxRange) {
            //用户进行了摇一摇
            isShake = true;
        }
        if (range < minRange && isShake) {
            // 停止摇一摇
            alert("您进行了摇一摇");
            isShake = false;
        }
        lastX = x;
        lastY = y;
        lastZ = z;
    }

    /**
     * @description setDeviceMotion 添加陀螺仪监控
     * @param {*} cb devicemotion 的事件處理函數
     * @param {*} errCb 不支持 devicemotion 時的處理回調
     * @return {*}
     */
    setDeviceMotion(cb: any, errCb: any): any {
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

new Shaker();

/**
 * @description setDeviceMotion 添加陀螺仪监控
 * @param {*} cb devicemotion的事件处理函数
 * @param {*} errCb 不支持 devicemotion 时的处理回调
 * @return {*}
 */
function setDeviceMotion(cb: any, errCb: any): any {
    if (!window.DeviceMotionEvent) {
        errCb("设备不支持DeviceMotion");
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
            .catch(() => {
                errCb("用户未允许权限");
            });
    } else {
        // 其他支持加速度检测的系统
        let timer = setTimeout(function () {
            errCb("用户未开启权限");
        }, 1000);
        window.addEventListener(
            "devicemotion",
            (e) => {
                clearTimeout(timer);
            },
            { once: true }
        );
        window.addEventListener("devicemotion", cb);
    }
}

/**
 * @description throttle 节流函数
 * @param {*} fn 要节流的函数
 * @param {number} [interval=200] 节流间隔时间
 * @param {boolean} [start=true] 是否在节流开始时执行 (true在开始时执行，false在结束时执行)
 * @return {*} 经过节流处理的函数
 */
function throttle(fn: any, interval: number = 200, start: boolean = true): any {
    if (typeof fn !== "function") {
        return console.error("请传入一个函数");
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
 * @description 添加摇一摇功能
 * @param {*} cbShake 类型 fn 当用户进行了摇一摇之后要做的事情
 * @return {*} shakeIndex 开启的第几个摇一摇功能的索引，用来删除监听
 */
function addShake(cbShake: any): any {
    const maxRange = 30; //当用户的两次加速度差值大于这个幅度，判定用户进行了摇一摇功能
    const minRange = 10; //当用户的两次加速度差值小于这个幅度，判定用户停止摇动手机
    let isShake = false; //记录用户是否摇动手机
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let toShake: any = (e: any) => {
        const { x, y, z } = e.acceleration;
        const range = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
        if (range > maxRange) {
            //用户进行了摇一摇
            isShake = true;
        }
        if (range < minRange && isShake) {
            // 停止摇一摇
            cbShake(e);
            isShake = false;
        }
        lastX = x;
        lastY = y;
        lastZ = z;
    };
    const window = Window as any;
    if (!window.shakeEvent) {
        //建立 shakeEvent 存储所有的摇一摇的处理函数，方便一会取消
        window.shakeEvent = [];
    }
    toShake = throttle(toShake);
    window.shakeEvent.push(toShake);
    setDeviceMotion(toShake, (errMessage: any) => {
        alert(errMessage);
    });
    return window.shakeEvent.length - 1; //返回该次摇一摇处理的索引
}

/**
 * @description 删除摇一摇监听
 * @param {number} shakeIndex 类型 fn 当用户进行了摇一摇之后要做的事情
 */
function removeShake(shakeIndex: number): void {
    window.removeEventListener("devicemotion", (<any>window).shakeEvent[shakeIndex]);
}

// 调用摇一摇
const startBtn = document.querySelector("#startBtn");
const closeBtn = document.querySelector("#closeBtn");
let isStartShake = false;
let shakeIndex: number;
// 再次强调 IOS 13.3 需要用户触发，再能开启摇一摇
startBtn?.addEventListener("touchend", () => {
    if (isStartShake) return;
    isStartShake = true;
    alert("開啟搖一搖");
    shakeIndex = addShake(() => {
        alert("您进行了摇一摇");
    });
});
closeBtn?.addEventListener("touchend", () => {
    if (!isStartShake) return;
    isStartShake = false;
    alert("關閉");
    removeShake(shakeIndex);
});

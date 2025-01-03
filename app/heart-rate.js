import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { BodyPresenceSensor } from "body-presence";

export function hrInitialize(callback) {
    if (!HeartRateSensor || !appbit.permissions.granted("access_heart_rate")) {
        throw new Error("No access to heart rate");
    }

    const body = new BodyPresenceSensor();
    const hrm = new HeartRateSensor();
    body.addEventListener("reading", () => {
        if (body.present) { callback(hrm.heartRate); } else {
            callback('--');
        }
    });
    hrm.addEventListener("reading", () => {
        if (body.present) {
            callback(hrm.heartRate);
        }
    });
    display.addEventListener("change", () => {
        display.on ? hrm.start() : hrm.stop();
    });
    hrm.start();
    body.start();
}
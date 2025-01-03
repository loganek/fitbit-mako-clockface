import { me as appbit } from "appbit";
import { today, goals } from "user-activity";

export function taRead() {
    if (!appbit.permissions.granted("access_activity")) {
        throw new Error("No access to user's activity");
    }

    return {
        steps: { value: today.local.steps, goal: goals.steps },
        distance: { value: today.local.distance, goal: goals.distance },
        calories: { value: today.local.calories, goal: goals.calories },
        elevationGain: { value: today.local.elevationGain, goal: goals.elevationGain },
        activeZoneMinutes: { value: today.local.activeZoneMinutes.total, goal: goals.activeZoneMinutes.total }
    };
}
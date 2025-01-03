import { preferences } from "user-settings";

function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function formatTime(today) {
    let hours = today.getHours();
    if (preferences.clockDisplay === "12h") {
        hours = hours % 12 || 12;
        console.log(hours);
    } else {
        hours = zeroPad(hours);
    }
    let mins = zeroPad(today.getMinutes());
    return `${hours}:${mins}`;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(today) {
    return `${daysOfWeek[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
}
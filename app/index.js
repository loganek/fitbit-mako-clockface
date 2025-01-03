import clock from "clock";
import * as document from "document";

import { hrInitialize } from "./heart-rate";
import { taRead } from "./today-activity";
import { formatDate, formatTime } from "./date-time";
import { efInitialize } from "./extra-functions";

function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  } else {
    return `${meters} m`;
  }
}

function formatProgress(data) {
  return `${Math.round(data.value / data.goal * 100)}%`;
}

// Update the clock every minute
clock.granularity = "seconds";

const stepsPB = document.getElementById("stepsPB");
const distancePB = document.getElementById("distancePB");
const caloriesPB = document.getElementById("caloriesPB");
const minsInActiveZonePB = document.getElementById("minsInActiveZonePB");
const elevationPB = document.getElementById("elevationPB");
const heartLabel = document.getElementById("heartLabel");
const sleepLabel = document.getElementById("sleepLabel");

const clockLabel = document.getElementById("clockLabel");
const dateLabel = document.getElementById("dateLabel");

const PBMode = {
  PERCENTAGE: "percentage",
  VALUE: "value"
};
Object.freeze(PBMode);

let pbMode = PBMode.PERCENTAGE;

document.getElementById("pbSection").addEventListener("click", (evt) => {
  pbMode = pbMode === PBMode.PERCENTAGE ? PBMode.VALUE : PBMode.PERCENTAGE;
});

function setPBValue(element, data, label) {
  element.getElementById("progressBarDone").width = Math.min(data.value / data.goal, 1) * element.getElementById("parent").getBBox().width;
  element.getElementById("progressBarLabel").text = label;
  element.getElementById("progressBarText").text = `${pbMode === PBMode.PERCENTAGE ? formatProgress(data) : data.value}`;
}

efInitialize();
hrInitialize((hr) => heartLabel.text = `HR ${hr}`);

clock.ontick = (evt) => {
  const today = evt.date;
  clockLabel.text = formatTime(today);
  dateLabel.text = formatDate(today);

  const data = taRead();
  setPBValue(stepsPB, data.steps, "ST");
  setPBValue(distancePB, data.distance, "DS");
  setPBValue(caloriesPB, data.calories, "CL");
  setPBValue(elevationPB, data.elevationGain, "EV");
  setPBValue(minsInActiveZonePB, data.activeZoneMinutes, "AZ");
  sleepLabel.text = 'SP';
}
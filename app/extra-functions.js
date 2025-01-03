import * as document from "document";
import { display } from "display";

const functionsButton = document.getElementById("functionsButton");
const functionsPanel = document.getElementById("functionsPanel");
const torchLabel = document.getElementById("torchLabel")
const torchRect = document.getElementById("torchRect");

function hidePanel() {
    functionsPanel.style.display = "none";
}

function showPanel() {
    functionsPanel.style.display = "inline";
}

export function efInitialize() {
    functionsButton.addEventListener("click", (evt) => {
        console.log('click');
        showPanel();
    });

    functionsPanel.addEventListener("click", (evt) => {
        hidePanel();
    });

    torchLabel.addEventListener("click", (evt) => {
        torchRect.style.display = "inline";
        display.brightnessOverride = "max";
        hidePanel();
    });
    torchRect.addEventListener("click", (evt) => {
        torchRect.style.display = "none";
        display.brightnessOverride = undefined;
    })
}


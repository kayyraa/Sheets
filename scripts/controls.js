import * as Grid from "./grid.js";

let ScaleFactor = 1;

document.addEventListener("wheel", (Event) => {
    if (Event.ctrlKey) {
        Event.preventDefault();

        ScaleFactor += Event.deltaY < 0 ? 0.25 : -0.25;
        ScaleFactor = Math.max(0.25, ScaleFactor);
        Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
        Grid.ZoomLabel.innerHTML = `Zoom: ${ScaleFactor.toFixed(2)}x`;
    }
}, { passive: false });

Grid.ZoomInButton.onclick = () => {
    ScaleFactor += 0.25;
    ScaleFactor = Math.max(0.25, ScaleFactor);
    Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
    Grid.ZoomLabel.innerHTML = `Zoom: ${ScaleFactor.toFixed(2)}x`;
};

Grid.ZoomOutButton.onclick = () => {
    ScaleFactor -= 0.25;
    ScaleFactor = Math.max(0.25, ScaleFactor);
    Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
    Grid.ZoomLabel.innerHTML = `Zoom: ${ScaleFactor.toFixed(2)}x`;
};
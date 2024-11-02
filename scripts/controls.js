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

const ItemDependent = Grid.ContextMenu.querySelectorAll(".ItemDependent");

document.oncontextmenu = (Event) => {
    Event.preventDefault();

    if (window.ItemSelection === "None") {
        ItemDependent.forEach(Item => {
            Item.setAttribute("disabled", "disabled");
        });
    } else {
        ItemDependent.forEach(Item => {
            Item.removeAttribute("disabled", "disabled");
        });
    }

    Grid.ContextMenu.style.display = "block";
    Grid.ContextMenu.style.opacity = "1";

    Grid.ContextMenu.style.left = `${Event.clientX}px`;
    Grid.ContextMenu.style.top = `${Event.clientY}px`;
};

document.onclick = (Event) => {
    if (Event.target !== Grid.ContextMenu) {
        Grid.ContextMenu.style.opacity = "0";
        window.ItemSelection = "None";
        
        for (const OtherItem of Grid.Grid.children) {
            OtherItem.classList.remove("Selected");
            OtherItem.style.backgroundColor = "";
        }

        setTimeout(() => {
            Grid.ContextMenu.style.display = "none";
        }, 250);
    }
};

Array.from(Grid.ContextMenu.querySelectorAll("samp")).forEach(KeyName => {
    const KeyCode = KeyName.getAttribute("href");
    document.onkeydown = (Event) => {
        if (Event.keyCode === Number(KeyCode)) {
            KeyName.parentElement.click();
        }
    };
});
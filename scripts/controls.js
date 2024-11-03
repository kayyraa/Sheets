import * as Grid from "./grid.js";
import * as Api from "./api.js";

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

    Grid.ContextMenu.style.height = "";
    Grid.ContextMenu.style.display = "inline";
    Grid.ContextMenu.style.opacity = "1";

    Grid.ContextMenu.style.left = `${Event.clientX}px`;
    Grid.ContextMenu.style.top = `${Event.clientY}px`;

    const TargetHeight = parseInt(getComputedStyle(Grid.ContextMenu).height.replace("px", ""));
    Grid.ContextMenu.style.height = "0px";

    const Duration = 125;
    const Steps = TargetHeight;
    for (let Index = 0; Index <= Steps; Index++) {
        const EasedIndex = Math.pow(Index / Steps, 2);
        setTimeout(() => {
            Grid.ContextMenu.style.height = `${EasedIndex * TargetHeight}px`;
        }, EasedIndex * Duration);
    }
};

document.onmousedown = (Event) => {
    if (Event.button === 0) {
        const StartHeight = parseInt(getComputedStyle(Grid.ContextMenu).height.replace("px", ""));
        const Duration = 125;
        const Steps = StartHeight;

        for (let Index = Steps; Index >= 0; Index--) {
            const EasedIndex = Math.pow(Index / Steps, 2);
            setTimeout(() => {
                Grid.ContextMenu.style.height = `${EasedIndex * StartHeight}px`;
            }, (1 - EasedIndex) * Duration);
        }

        Grid.ContextMenu.style.opacity = "0";
        window.ItemSelection = "None";
        
        for (const OtherItem of Grid.Grid.children) {
            OtherItem.classList.remove("Selected");
            OtherItem.style.backgroundColor = "";
        }
        setTimeout(() => {
            Grid.ContextMenu.style.display = "none";
        }, 500);
    }
};

new Api.ClickAndHold(document, (Event) => {
    Grid.ContextMenu.style.height = "";
    Grid.ContextMenu.style.display = "inline";
    Grid.ContextMenu.style.opacity = "1";

    Grid.ContextMenu.style.left = `${Event.clientX}px`;
    Grid.ContextMenu.style.top = `${Event.clientY}px`;

    const TargetHeight = parseInt(getComputedStyle(Grid.ContextMenu).height.replace("px", ""));
    Grid.ContextMenu.style.height = "0px";

    const Duration = 125;
    const Steps = TargetHeight;
    for (let Index = 0; Index <= Steps; Index++) {
        const EasedIndex = Math.pow(Index / Steps, 2);
        setTimeout(() => {
            Grid.ContextMenu.style.height = `${EasedIndex * TargetHeight}px`;
        }, EasedIndex * Duration);
    }
});

function RunKey(Key) {
    if (!Key) return;

    const HasOnClick = Key.hasAttribute("onclick");
    const OnClickFunction = Key.getAttribute("onclick");

    const HasFunction = Key.hasAttribute("function");
    const FunctionName = Key.getAttribute("function");

    if (HasOnClick && OnClickFunction) {
        eval(OnClickFunction);
    } else if (HasFunction) {
        if (Functions[FunctionName]) {
            Functions[FunctionName]();
        }
    }
}

Array.from(Grid.ContextMenu.children).forEach(Item => {
    if (String(Item.tagName).toLowerCase() === "div") {
        if (Item.hasAttribute("href")) {
            const KeyCode = Item.getAttribute("href").replace(/[^0-9]/g, '');

            document.addEventListener("keydown", Event => {
                if (KeyCode.startsWith("Ctrl+")) {
                    if (Event.ctrlKey && Event.keyCode === Number(KeyCode)) {
                        Event.stopImmediatePropagation();
                        RunKey(Item);
                    }
                } else if (KeyCode.startsWith("Shift+")) {
                    if (Event.shiftKey && Event.keyCode === Number(KeyCode)) {
                        Event.stopImmediatePropagation();
                        RunKey(Item);
                    }
                } else {
                    if (Event.keyCode === Number(KeyCode)) {
                        Event.stopImmediatePropagation();
                        RunKey(Item);
                    }
                }
            });
        }

        Item.addEventListener("click", (Event) => {
            Event.stopImmediatePropagation();
            RunKey(Item);
        });
    }
});

function Style() {
    console.log("Styled");
}

const Functions = {
    "Style": Style
};
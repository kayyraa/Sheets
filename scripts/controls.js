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

    Grid.Sections.style.left = `${Event.clientX}px`;
    Grid.Sections.style.top = `${Event.clientY}px`;
};

document.onmousedown = (Event) => {
    if (Event.button === 0 && Event.target !== Grid.ContextMenu && Event.target.offsetParent !== Grid.ContextMenu && Event.target.parentElement !== Grid.ContextMenu && Event.target.parentNode !== Grid.ContextMenu) {
        Grid.ContextMenu.style.opacity = "0";
        
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
    
    Grid.Sections.style.left = `${Event.clientX}px`;
    Grid.Sections.style.top = `${Event.clientY}px`;
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

        if (Item.hasAttribute("link")) {
            Item.addEventListener("click", () => {
                const Link = Item.getAttribute("link");
                const LinkedItem = document.querySelector(`*[href="${Link}"]`);
                if (LinkedItem) {
                    LinkedItem.style.display = "block";
                    LinkedItem.style.opacity = "1";

                    LinkedItem.querySelectorAll(".ItemName")[0].innerHTML = window.ItemSelection.querySelector("input").classList[0];
                    LinkedItem.querySelectorAll(".CloseButton")[0].onclick = () => {
                        LinkedItem.style.opacity = "0";
                        setTimeout(() => {
                            LinkedItem.style.display = "block";
                        }, 250);
                    };
                    
                    var Style = {
                        Color: {
                            Foreground: "#fff",
                            Text: "#000"
                        },

                        Font: {
                            Size: 16,
                            Weight: 400,
                            Unit: "px"
                        }
                    };

                    LinkedItem.querySelectorAll(".ForegroundInput")[0].oninput = () => {
                        Style.Color.Foreground = LinkedItem.querySelectorAll(".ForegroundInput")[0].value;
                        ApplyStyle();
                    };
                    LinkedItem.querySelectorAll(".TextColorInput")[0].oninput = () => {
                        Style.Color.Text = LinkedItem.querySelectorAll(".TextColorInput")[0].value;
                        ApplyStyle();
                    };

                    LinkedItem.querySelectorAll(".FontSizeInput")[0].oninput = () => {
                        Style.Font.Size = parseInt(LinkedItem.querySelectorAll(".FontSizeInput")[0].value);
                        ApplyStyle();
                    };
                    LinkedItem.querySelectorAll(".FontSizeUnitInput")[0].oninput = () => {
                        Style.Font.Unit = LinkedItem.querySelectorAll(".FontSizeUnitInput")[0].value
                        ApplyStyle();
                    };
                    LinkedItem.querySelectorAll(".FontWeightInput")[0].oninput = () => {
                        Style.Font.Weight = LinkedItem.querySelectorAll(".FontWeightInput")[0].value
                        ApplyStyle();
                    };

                    function ApplyStyle() {
                        window.ItemSelection.querySelector("input").style.fontSize = `${Style.Font.Size}${Style.Font.Unit}`;
                        window.ItemSelection.querySelector("input").style.fontWeight = Style.Font.Weight;
                        window.ItemSelection.querySelector("input").style.color = Style.Color.Text;
                        window.ItemSelection.querySelector("input").style.backgroundColor = Style.Color.Foreground;
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
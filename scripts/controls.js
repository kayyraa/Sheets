import * as Grid from "./grid.js";
import * as Api from "./api.js";

let ScaleFactor = 1;
let Theme = true;

document.addEventListener("wheel", (Event) => {
    if (Event.ctrlKey) {
        Event.preventDefault();

        ScaleFactor += Event.deltaY < 0 ? 0.25 : -0.25;
        ScaleFactor = Math.max(0.25, ScaleFactor);
        Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
        Grid.ZoomLabel.innerHTML = `${ScaleFactor.toFixed(2)}x`;
    }
}, { passive: false });

Grid.ZoomInButton.onclick = () => {
    ScaleFactor += 0.25;
    ScaleFactor = Math.max(0.25, ScaleFactor);
    Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
    Grid.ZoomLabel.innerHTML = `${ScaleFactor.toFixed(2)}x`;
};

Grid.ZoomOutButton.onclick = () => {
    ScaleFactor -= 0.25;
    ScaleFactor = Math.max(0.25, ScaleFactor);
    Grid.Grid.style.setProperty("--scale-factor", ScaleFactor);
    Grid.ZoomLabel.innerHTML = `${ScaleFactor.toFixed(2)}x`;
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
    Grid.Sections.style.top = `${Event.clientY - 8}px`;
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

Grid.ThemeButton.addEventListener("click", () => {
    Theme = !Theme;

    if (!Theme) {
        Grid.ThemeButton.src = "../images/LightMode.svg";

        Grid.Topbar.style.backgroundColor = "rgb(60, 60, 60)";
        Grid.Bottombar.style.backgroundColor = "rgb(60, 60, 60)";
        Grid.HorizontalRuler.style.backgroundColor = "rgb(90, 90, 90)";
        
        Array.from(Grid.HorizontalRuler.children).forEach(Item => {
            Item.style.color = "white";
            
            if (String(Item.tagName).toLowerCase() === "vr") {
                Item.style.backgroundColor = "white";
            }
        });

        Array.from(Grid.Grid.children).forEach(Item => {
            Item.querySelector("input").style.backgroundColor = "rgb(60, 60, 60)";
            Item.querySelector("input").style.color = "white";
            Item.style.borderColor = "rgb(70, 70, 70)";
            Item.style.borderWidth = "2px";
        });
    } else {
        Grid.ThemeButton.src = "../images/DarkMode.svg";

        Grid.Topbar.style.backgroundColor = "";
        Grid.Bottombar.style.backgroundColor = "";
        Grid.HorizontalRuler.style.backgroundColor = "";
        
        Array.from(Grid.HorizontalRuler.children).forEach(Item => {
            Item.style.color = "";
            
            if (String(Item.tagName).toLowerCase() === "vr") {
                Item.style.backgroundColor = "";
            }
        });

        Array.from(Grid.Grid.children).forEach(Item => {
            Item.querySelector("input").style.backgroundColor = "";
            Item.querySelector("input").style.color = "";
            Item.style.borderColor = "";
            Item.style.borderWidth = "";
        });
    }
});

new Api.ClickAndHold(document, (Event) => {
    Grid.ContextMenu.style.height = "";
    Grid.ContextMenu.style.display = "inline";
    Grid.ContextMenu.style.opacity = "1";

    Grid.ContextMenu.style.left = `${Event.clientX}px`;
    Grid.ContextMenu.style.top = `${Event.clientY}px`;
    
    Grid.Sections.style.left = `${Event.clientX}px`;
    Grid.Sections.style.top = `${Event.clientY - 8}px`;
});

function RunKey(Key) {
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
        const Link = Item.getAttribute("link");
        const LinkedItem = document.querySelector(`*[href="${Link}"]`);

        function OpenLinkedItem() {
            if (LinkedItem && window.ItemSelection !== "None") {
                LinkedItem.style.display = "block";
                LinkedItem.style.opacity = "1";

                LinkedItem.querySelectorAll(".ItemName")[0].innerHTML = window.ItemSelection.querySelector("input").classList[0];
                LinkedItem.querySelectorAll(".CloseButton")[0].onclick = () => {
                    LinkedItem.style.opacity = "0";
                    setTimeout(() => {
                        LinkedItem.style.display = "none";
                    }, 250);
                };

                let Style = {
                    Color: {
                        Foreground: "#fff",
                        Text: "#000"
                    },
                    Font: {
                        Family: "SegoeUi",
                        Size: 12,
                        Weight: 400,
                        Unit: "px"
                    }
                };

                const ApplyStyle = () => {
                    const Input = window.ItemSelection.querySelector("input");
                    Input.style.fontFamily = Style.Font.Family;
                    Input.style.fontSize = `${Style.Font.Size}${Style.Font.Unit}`;
                    Input.style.fontWeight = Style.Font.Weight;
                    Input.style.color = Style.Color.Text;
                    Input.style.backgroundColor = Style.Color.Foreground;
                };

                document.querySelectorAll(".ForegroundInput")[0].oninput = () => {
                    Style.Color.Foreground = document.querySelectorAll(".ForegroundInput")[0].value;
                    ApplyStyle();
                };
                document.querySelectorAll(".TextColorInput")[0].oninput = () => {
                    Style.Color.Text = document.querySelectorAll(".TextColorInput")[0].value;
                    ApplyStyle();
                };
                document.querySelectorAll(".FontSizeInput")[0].oninput = () => {
                    Style.Font.Size = parseInt(document.querySelectorAll(".FontSizeInput")[0].value);
                    ApplyStyle();
                };
                document.querySelectorAll(".FontSizeUnitInput")[0].oninput = () => {
                    Style.Font.Unit = document.querySelectorAll(".FontSizeUnitInput")[0].value;
                    ApplyStyle();
                };
                document.querySelectorAll(".FontWeightInput")[0].oninput = () => {
                    Style.Font.Weight = document.querySelectorAll(".FontWeightInput")[0].value;
                    ApplyStyle();
                };
                document.querySelectorAll(".FontFamilyInput")[0].oninput = () => {
                    Style.Font.Family = document.querySelectorAll(".FontFamilyInput")[0].value;
                    ApplyStyle();
                };

                document.querySelectorAll(".InsertMediaButton")[0].onclick = async () => {
                    const MediaUrlInput = document.querySelectorAll(".MediaInputUrl")[0];
                    const MediaFileInput = document.querySelectorAll(".MediaFileInput")[0];

                    if (MediaUrlInput.value) {
                        const FileExtension = MediaUrlInput.value.split(".").pop().toLowerCase();

                        if (["jpg", "jpeg", "png", "gif"].includes(FileExtension)) {
                            window.ItemSelection.querySelector("input").value += `=IMAGE("${MediaUrlInput.value}")`;
                        } else if (["mp4", "avi", "mov"].includes(FileExtension)) {
                            window.ItemSelection.querySelector("input").value += `=VIDEO("${MediaUrlInput.value}")`;
                        }
                    } else if (MediaFileInput.files.length > 0) {
                        const FileURL = await Api.Storage.UploadFile(MediaFileInput.files[0]);
                        if (FileURL) {
                            window.ItemSelection.querySelector("input").value += `=IMAGE("${FileURL}")`;
                        } else {
                            window.ItemSelection.querySelector("input").value += "UPLOAD ERROR";
                        }
                    }
                };

                document.querySelectorAll(".InsertFunctionButton")[0].onclick = () => {
                    window.ItemSelection.querySelector("input").value = `${document.querySelectorAll(".FunctionInput")[0].value}()`;
                };
            }
        }

        const HasCode = Item.hasAttribute("href");
        if (HasCode) {
            const KeyCode = Item.getAttribute("href");
            document.addEventListener("keydown", Event => {
                if (!KeyCode.includes("+") && Event.keyCode === Number(KeyCode)) {
                    Event.stopImmediatePropagation();
                    RunKey(Item);
                } else {
                    const Keys = KeyCode.split("+");
                    const KeyCodes = Keys.map(Key => Number(Key));
                    const AllKeysPressed = KeyCodes.every(KeyCode => Event.keyCode === KeyCode || (KeyCode === 16 && Event.shiftKey) || (KeyCode === 17 && Event.ctrlKey));
            
                    if (AllKeysPressed) {
                        RunKey(Item);
                        Event.stopImmediatePropagation();
                        Event.preventDefault();
                        OpenLinkedItem();
                    }
                }
            });
        }

        Item.addEventListener("click", OpenLinkedItem);

        Item.addEventListener("click", (Event) => {
            Event.stopImmediatePropagation();
            RunKey(Item);
            OpenLinkedItem();
        });
    }
});

function Reload() {
    while (Grid.Grid.firstChild) {
        Grid.Grid.removeChild(Grid.Grid.firstChild);
    }
    Grid.GenerateGrid();
}

function Save() {
    const SaveData = [];

    Array.from(Grid.Grid.children).forEach(Item => {
        if (String(Item.tagName).toLowerCase() === "div" && Item.querySelector("input") && Item.querySelector("input").value) {
            const TextContent = Item.querySelector("input").value;
            const Row = Item.dataset.row;
            const Column = Item.dataset.column;
            const Key = Item.querySelector("input").classList.toString()[0];

            SaveData.push({
                TextContent: TextContent,
                Row: Row,
                Column: Column,
                Key: Key
            });
        }
    });

    const DataBlob = new Blob([JSON.stringify(SaveData)], { type: "application/json" });
    const FileLink = document.createElement("a");
    FileLink.href = URL.createObjectURL(DataBlob);
    FileLink.download = "data.json";
    document.body.appendChild(FileLink);

    FileLink.click();
    document.body.removeChild(FileLink);
}

function Load() {
    const FileInput = document.createElement("input");
    FileInput.type = "file";
    FileInput.accept = ".json";
    FileInput.click();
    FileInput.onchange = async () => {
        const File = FileInput.files[0];
        const DataReader = new FileReader();

        DataReader.onload = async () => {
            const SaveData = JSON.parse(DataReader.result);
            if (SaveData.length > 0) {
                Reload();

                SaveData.forEach(Item => {
                    const Column = Item.Column;
                    const Row = Item.Row;
                    const Key = Item.Key;

                    const TargetItem = Grid.Grid.querySelector(`div[data-column="${Column}"][data-row="${Row}"]`);
                    if (TargetItem && TargetItem.querySelector("input").classList.toString()[0] === Key) {
                        TargetItem.querySelector("input").value = Item.TextContent;
                    }
                });
            }
        };
        DataReader.readAsText(File);
    };
}

const Functions = {
    "New": Reload,
    "Save": Save,
    "Load": Load,
};
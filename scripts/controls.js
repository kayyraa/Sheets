import * as Grid from "./grid.js";
import * as Api from "./api.js";

let ScaleFactor = 1;
window.Api = Api;

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

let Mobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) Mobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
if (Mobile) {
    new Api.ClickAndHold(document, (Event) => {
        Grid.ContextMenu.style.height = "";
        Grid.ContextMenu.style.display = "inline";
        Grid.ContextMenu.style.opacity = "1";
    
        Grid.ContextMenu.style.left = `${Event.clientX}px`;
        Grid.ContextMenu.style.top = `${Event.clientY}px`;
        
        Grid.Sections.style.left = `${Event.clientX}px`;
        Grid.Sections.style.top = `${Event.clientY - 8}px`;
    });
}

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

                const Input = window.ItemSelection.querySelector("input");

                const ApplyStyle = () => {
                    Input.style.fontFamily = Style.Font.Family;
                    Input.style.fontSize = `${Style.Font.Size}${Style.Font.Unit}`;
                    Input.style.fontWeight = Style.Font.Weight;
                    Input.style.color = Style.Color.Text;
                    Input.style.backgroundColor = Style.Color.Foreground;
                };

                function RgbToHex(rgb) {
                    const Components = rgb.match(/\d+/g).map(Number);
                    return `#${Components.map(c => c.toString(16).padStart(2, "0")).join("")}`;
                }
                
                document.querySelectorAll(".ForegroundInput")[0].value = RgbToHex(getComputedStyle(Input).backgroundColor);
                document.querySelectorAll(".TextColorInput")[0].value = RgbToHex(getComputedStyle(Input).color);
                document.querySelectorAll(".FontFamilyInput")[0].value = getComputedStyle(Input).fontFamily;
                document.querySelectorAll(".FontSizeInput")[0].value = parseInt(getComputedStyle(Input).fontSize);
                document.querySelectorAll(".FontSizeUnitInput")[0].value = getComputedStyle(Input).fontSize.match(/[a-z%]+/i);
                document.querySelectorAll(".FontWeightInput")[0].value = getComputedStyle(Input).fontWeight;                

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

                document.querySelectorAll(".InsertCodeButton")[0].onclick = () => {
                    eval(document.querySelectorAll(".CodeInput")[0].value);
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
                Key: Key,
                Style: {
                    FontFamily: getComputedStyle(Item.querySelector("input")).fontFamily,
                    FontSize: parseInt(getComputedStyle(Item.querySelector("input")).fontSize),
                    FontWeight: parseInt(getComputedStyle(Item.querySelector("input")).fontWeight),
                    TextColor: getComputedStyle(Item.querySelector("input")).color,
                    ForegroundColor: getComputedStyle(Item.querySelector("input")).backgroundColor
                }
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
                Api.Sheet.Reload();

                setTimeout(() => {
                    SaveData.forEach(Item => {
                        const Column = Item.Column;
                        const Row = Item.Row;
                        const Key = Item.Key;
                        const Style = Item.Style;
    
                        const TargetItem = Grid.Grid.querySelector(`div[data-column="${Column}"][data-row="${Row}"]`);
                        if (TargetItem && TargetItem.querySelector("input").classList.toString()[0] === Key) {
                            TargetItem.querySelector("input").value = Item.TextContent;
    
                            TargetItem.querySelector("input").style.fontFamily = Style.FontFamily;
                            TargetItem.querySelector("input").style.fontSize = `${Style.FontSize}px`;
                            TargetItem.querySelector("input").style.fontWeight = Style.FontWeight;
                            TargetItem.querySelector("input").style.color = Style.TextColor;
                            TargetItem.querySelector("input").style.backgroundColor = Style.ForegroundColor;
                        }
                    });
                }, 50);
            }
        };
        DataReader.readAsText(File);
    };
}

const Functions = {
    "New": Api.Sheet.Reload,
    "Save": Save,
    "Load": Load,
};

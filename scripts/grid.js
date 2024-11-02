import * as Api from "./api.js";

export const Grid = document.querySelector(".Grid");
const HorizontalRuler = document.querySelector(".HorizontalRuler");
const NewFileButton = document.querySelector(".NewFileButton");

const SelectionNameLabel = HorizontalRuler.querySelector(".SelectionNameLabel");
const SelectionValueLabel = HorizontalRuler.querySelector(".SelectionValueLabel");

const ColumnLabel = document.querySelector(".ColumnLabel");
const RowLabel = document.querySelector(".RowLabel");
const KeyLabel = document.querySelector(".KeyLabel");

const ItemWidth = 66;
const ItemHeight = ItemWidth / 2;

export const Items = [];

let Columns, Rows, ItemCount;

function SetGridDimensions() {
    Columns = Math.floor(Grid.clientWidth / ItemWidth);
    Rows = Math.floor(Grid.clientHeight / ItemHeight);
    ItemCount = Columns * Rows;
}

function UpdateLabels(Column, Row, Key) {
    ColumnLabel.innerHTML = `Col: ${String(Column).padStart(2, "0")}`;
    RowLabel.innerHTML = `Row: ${String(Row).padStart(2, "0")}`;
    KeyLabel.innerHTML = `Key: ${Key}`;
}

const Directions = ["top: 0", "left: 0", "right: 0", "bottom: 0"];

function SnapToGrid(Value, GridSize) {
    return Math.round(Value / GridSize) * GridSize;
}

function GenerateGrid() {
    SetGridDimensions();

    for (let Index = 0; Index < (ItemCount + (4 * 14)) * 2; Index++) {
        const ColumnIndex = Math.floor(Index / Rows);
        const RowIndex = (Index % Rows) + 1;

        const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const Character = Characters[ColumnIndex];

        const Item = document.createElement("div");
        Item.dataset.column = ColumnIndex;
        Item.dataset.row = RowIndex;
        Grid.appendChild(Item);
        Items.push(Item);

        const Input = document.createElement("input");
        Input.classList.add(`${String(Character).toUpperCase()}${String(RowIndex).padStart(2, "0")}`);
        Item.appendChild(Input);

        Directions.forEach(Direction => {
            const Area = document.createElement("div");
            Area.classList.add("Area");
            Area.style = Direction;
            Item.appendChild(Area);
            let Dragging = false;

            Area.onmousedown = () => {
                Dragging = true;
                window.onmousemove = (Event) => {
                    if (Dragging) {
                        const ClientX = Event.clientX;
                        const ClientY = Event.clientY;
                        const GridX = ClientX - Grid.getBoundingClientRect().left;
                        const GridY = ClientY - Grid.getBoundingClientRect().top;

                        if (Direction.includes("top") || Direction.includes("bottom")) {
                            const NewHeight = Math.max(SnapToGrid(GridY - Item.getBoundingClientRect().top, ItemHeight), parseFloat(getComputedStyle(Item).height.replace("px", "")));
                            if (NewHeight !== parseInt(getComputedStyle(Item).height)) {
                                Item.style.height = `${NewHeight}px`;
                            }
                        } else if (Direction.includes("left") || Direction.includes("right")) {
                            const NewWidth = Math.max(SnapToGrid(GridX - Item.getBoundingClientRect().left, ItemWidth), parseFloat(getComputedStyle(Item).width.replace("px", "")));
                            if (NewWidth !== parseInt(getComputedStyle(Item).width)) {
                                Item.style.width = `${NewWidth}px`;
                            }
                        }
                    }
                };

                window.onmouseup = () => {
                    Dragging = false;
                    window.onmousemove = null;
                    window.onmouseup = null;
                };
            };
        });

        Item.onmouseenter = () => {
            UpdateLabels(ColumnIndex + 1, RowIndex, Character);
        };

        Item.onclick = (Event) => {
            Event.stopPropagation();
            UpdateLabels(ColumnIndex + 1, RowIndex, Character);
            SelectionNameLabel.innerHTML = `${Character}${String(RowIndex).padStart(2, "0")}`;
            SelectionValueLabel.innerHTML = Input.value || "None";

            Item.style.backgroundColor = "rgb(225, 225, 225)";
            Item.classList.add("Selected");
            
            for (const OtherItem of Grid.children) {
                if (OtherItem !== Item) {
                    OtherItem.classList.remove("Selected");
                    OtherItem.style.backgroundColor = "";
                }
            }
        };

        let OldValue = Input.value;
        Input.onkeypress = (Event) => {
            if (Event.key === "Enter") {
                Api.FormatInput(Input, Item);
            }
        };

        Input.oninput = () => {
            if (OldValue !== Input.value) {
                Api.RecordHistory(Input, OldValue, Input.value, "Value");
            }

            SelectionValueLabel.innerHTML = Input.value || "None";
            OldValue = Input.value;
        };
    }
}

NewFileButton.onclick = () => {
    while (Grid.firstChild) {
        Grid.removeChild(Grid.firstChild);
    }
    GenerateGrid();
};

document.onclick = (Event) => {
    if (!Grid.contains(Event.target)) {
        SelectionNameLabel.innerHTML = "No Selection";
        for (const Item of Grid.children) {
            Item.classList.remove("Selected");
            Item.style.backgroundColor = "";
        }
    }
};

function Loop() {
    Api.UndoButton.disabled = Api.UndoHistory.length === 0;
    Api.RedoButton.disabled = Api.RedoHistory.length === 0;
    requestAnimationFrame(Loop);
}

window.onload = Loop;
document.onload = GenerateGrid();
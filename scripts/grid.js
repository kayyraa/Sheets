import * as Api from "./api.js";

export const Grid = document.querySelector(".Grid");
const HorizontalRuler = document.querySelector(".HorizontalRuler");
const NewFileButton = document.querySelector(".NewFileButton");

const SelectionNameLabel = HorizontalRuler.querySelector(".SelectionNameLabel");
const SelectionValueLabel = HorizontalRuler.querySelector(".SelectionValueLabel");

export const ZoomInButton = document.querySelector(".ZoomInButton");
export const ZoomOutButton = document.querySelector(".ZoomOutButton");

const ColumnLabel = document.querySelector(".ColumnLabel");
const RowLabel = document.querySelector(".RowLabel");
export const ZoomLabel = document.querySelector(".ZoomLabel");

const Logo = document.querySelector(".Logo");

const ItemWidth = 66;
const ItemHeight = ItemWidth / 2;

export const Items = [];

let Columns, Rows, ItemCount;

function UpdateLabels(Column, Row) {
    ColumnLabel.innerHTML = `C: ${String(Column).padStart(2, "0")}`;
    RowLabel.innerHTML = `R: ${String(Row).padStart(2, "0")}`;
}

function GenerateGrid() {
    Logo.style.opacity = "0";

    Columns = Math.floor(Grid.clientWidth / ItemWidth);
    Rows = Math.floor(Grid.clientHeight / ItemHeight);
    ItemCount = Columns * Rows;

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

        Item.onmouseenter = () => {
            UpdateLabels(ColumnIndex + 1, RowIndex);
        };

        Item.onclick = (Event) => {
            Event.stopPropagation();
            UpdateLabels(ColumnIndex + 1, RowIndex);
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

    setTimeout(() => {
        Logo.style.opacity = "1";
    }, 125);
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

window.onload = () => {
    GenerateGrid();
    Loop();
};
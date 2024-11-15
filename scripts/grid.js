import * as Api from "./api.js";

export const Topbar = document.querySelector(".Topbar");
export const Bottombar = document.querySelector(".Bottombar");

export const Grid = document.querySelector(".Grid");
export const Sections = document.querySelector(".Sections");

export const HorizontalRuler = document.querySelector(".HorizontalRuler");

const SelectionNameLabel = HorizontalRuler.querySelector(".SelectionNameLabel");
const SelectionValueLabel = HorizontalRuler.querySelector(".SelectionValueLabel");

export const ZoomInButton = document.querySelector(".ZoomInButton");
export const ZoomOutButton = document.querySelector(".ZoomOutButton");
export const ThemeButton = document.querySelector(".ThemeButton");

const ColumnRowLabel = document.querySelector(".ColumnRowLabel");
export const ZoomLabel = document.querySelector(".ZoomLabel");
export const ContextMenu = document.querySelector(".ContextMenu");

const Logo = document.querySelector(".Logo");

const ItemWidth = 66;
const ItemHeight = ItemWidth / 2;

export const Items = [];
export const Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz><~/\\=!?é'^+%&*-,:;|[]{}#@_$";

let Columns, Rows, ItemCount;

window.ItemSelection = "None";

function UpdateLabels(Column, Row, Key) {
    ColumnRowLabel.innerHTML = `${Key}, ${String(Column).padStart(2, "0")}, ${String(Row).padStart(2, "0")}`;
}

export function GenerateGrid() {
    Logo.style.opacity = "0";

    Columns = Math.floor(Grid.clientWidth / ItemWidth);
    Rows = Math.floor(Grid.clientHeight / ItemHeight);
    ItemCount = Columns * Rows;

    for (let Index = 0; Index < (ItemCount + (14 * 21)) * 2; Index++) {
        const ColumnIndex = Math.floor(Index / Rows);
        const RowIndex = (Index % Rows) + 1;

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
            UpdateLabels(ColumnIndex + 1, RowIndex, Character);
        };

        Item.onclick = (Event) => {
            Event.stopPropagation();
            UpdateLabels(ColumnIndex + 1, RowIndex, Character);

            SelectionNameLabel.innerHTML = `${Character}${String(RowIndex).padStart(2, "0")}`;
            SelectionValueLabel.innerHTML = Input.value || "None";

            Item.style.backgroundColor = "rgb(225, 225, 225)";
            Item.classList.add("Selected");

            window.ItemSelection = Item;
            
            for (const OtherItem of Grid.children) {
                if (OtherItem !== Item) {
                    OtherItem.classList.remove("Selected");
                    OtherItem.style.backgroundColor = "";
                }
            }
        };

        Input.onfocus = () => {
            window.ItemSelection = Item;
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

document.onclick = (Event) => {
    if (!Grid.contains(Event.target)) {
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

    if (localStorage.getItem("User")) {
        document.querySelectorAll(".UserDependent").forEach(UserDependent => UserDependent.removeAttribute("disabled"));
        document.querySelectorAll(".UserRequired").forEach(UserRequired => UserRequired.remove());
    }

    // const Notice = new Api.Sheet.Notice("Public Notice: The Sheets api support will be public in 14th of November 2024", "Info");
    // Api.Sheet.Notice.Send(Notice);
};
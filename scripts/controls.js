import * as Grid from "./grid.js";

const Loop = () => {
    Array.from(Grid.Grid.getElementsByTagName("div")).forEach(Item => {
        if (Item.classList.contains("Selected")) {
            const Column = parseInt(Item.dataset.column);
            const Row = parseInt(Item.dataset.row);

            document.onkeydown = (Event) => {
                if (Event.key === "ArrowRight") {
                    const NextItem = Grid.Grid.querySelector(`div[data-column="${Column}"][data-row="${Row + 1}"]`);
                    if (NextItem) {
                        NextItem.classList.add("Selected");
                        NextItem.querySelector("input").focus();
                        Item.classList.remove("Selected");
                    }
                } else if (Event.key === "ArrowLeft") {
                    const PreviousItem = Grid.Grid.querySelector(`div[data-column="${Column}"][data-row="${Row - 1}"]`);
                    if (PreviousItem) {
                        PreviousItem.classList.add("Selected");
                        PreviousItem.querySelector("input").focus();
                        Item.classList.remove("Selected");
                    }
                } else if (Event.key === "ArrowUp") {
                    const PreviousRowItem = Grid.Grid.querySelector(`div[data-column="${Column - 2}"][data-row="${Row + 1}"]`);
                    if (PreviousRowItem) {
                        PreviousRowItem.classList.add("Selected");
                        PreviousRowItem.querySelector("input").focus();
                        Item.classList.remove("Selected");
                    }
                } else if (Event.key === "ArrowDown") {
                    const NextRowItem = Grid.Grid.querySelector(`div[data-column="${Column + 1}"][data-row="${Row - 1}"]`);
                    if (NextRowItem) {
                        NextRowItem.classList.add("Selected");
                        NextRowItem.querySelector("input").focus();
                        Item.classList.remove("Selected");
                    }
                }
            };
        }
    });

    requestAnimationFrame(Loop);
};

//Loop();
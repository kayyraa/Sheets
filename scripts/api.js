import * as Grid from "./grid.js";

const SupabaseUrl = "https://ccsybdfqjxrwilhfssbo.supabase.co";
const SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc3liZGZxanhyd2lsaGZzc2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MzUxMTksImV4cCI6MjA0NjMxMTExOX0.qwxsYxOju2trsYKw5-16s2nLhe0oKStnAPNd0m4J48w";

export const Supabase = supabase.createClient(SupabaseUrl, SupabaseKey);

const FormatTable = {
    "=STYLE": Style,
    "=FILL": Fill,
    "=UPPER": Upper,
    "=LOWER": Lower,
    "=TRIM": Trim,
    "=HASH": Hash,
    "=LEN": Length,
    "=SUBS": Substring,
    "=REPL": Replace,
    "=SUM": Sum,
    "=AVR": Average,
    "=ROUND": Round,
    "=MAX": Max,
    "=MIN": Min,
    "=CEILING": Ceiling,
    "=FLOOR": Floor,
    "=IMAGE": Image,
    "=VIDEO": Video,
}

function Style(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const [Property, ...ColorParts] = CleanedValue.split(/\s*,\s*/);
    const PropertyValue = ColorParts.join(",").trim();
    const PreviousValue = getComputedStyle(Input)[Property.toLowerCase()];

    if (Property && PropertyValue) {
        if (Property.toLowerCase() === "foreground") {
            Input.style.backgroundColor = PropertyValue;
        } else if (Property.toLowerCase() === "textcolor" || Property.toLowerCase() === "color") {
            Input.style.color = PropertyValue;
        } else if (Property.toLowerCase() === "fontsize") {
            Input.style.fontSize = PropertyValue;
        } else if (Property.toLowerCase() === "fontweight") {
            Input.style.fontWeight = PropertyValue;
        }
    }
    return "";
}

function Fill(Input, Item, Value) {
    const PreviousValue = Input.value;
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    Input.value = CleanedValue;
    RecordHistory(Input, PreviousValue, CleanedValue, "Value");
    return CleanedValue;
}

function Upper(Input, Item, Value) {
    const PreviousValue = Input.value;
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim().toUpperCase();
    Input.value = CleanedValue;
    RecordHistory(Input, PreviousValue, CleanedValue, "Value");
    return CleanedValue;
}

function Lower(Input, Item, Value) {
    const PreviousValue = Input.value;
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim().toLowerCase();
    Input.value = CleanedValue;
    RecordHistory(Input, PreviousValue, CleanedValue, "Value");
    return CleanedValue;
}

function Trim(Input, Item, Value) {
    const PreviousValue = Input.value;
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    Input.value = CleanedValue;
    RecordHistory(Input, PreviousValue, CleanedValue, "Value");
    return CleanedValue;
}

function Hash(Input, Item, Value) {
    return Value.replace(/[\(\)'""]/g, "").trim().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function Length(Input, Item, Value) {
    return Value.replace(/[\(\)'""]/g, "").trim().length;
}

function Substring(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Match = CleanedValue.match(/(\d+)\s*,\s*(\d+)\s*,\s*(.+)/);
    if (Match) {
        const Start = Number(Match[1]);
        const End = Number(Match[2]);
        const StringValue = Match[3];
        if (typeof StringValue === 'string') {
            return StringValue.slice(Start, End);
        }
    }
    return "";
}

function Replace(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Match = CleanedValue.match(/^(.+?),\s*(.+?),\s*(.+)$/);
    if (Match) {
        const BaseValue = Match[1];
        const Search = Match[2];
        const ReplaceWith = Match[3];
        return BaseValue.replace(new RegExp(Search, "g"), ReplaceWith);
    }
    return "";
}

function Sum(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Args = CleanedValue.split(/\s*,\s*/);

    var Total = 0;

    const CalculateTotal = () => {
        Total = 0;

        Args.forEach(Arg => {
            const NumericValue = parseFloat(Arg);
            if (!isNaN(NumericValue)) {
                Total += NumericValue;
            } else {
                if (Arg.length > 0) {
                    for (const InputElement of Array.from(document.getElementsByTagName("input"))) {
                        for (const Class of InputElement.classList) {
                            if (Class.includes(Arg)) {
                                if (InputElement.value && !isNaN(parseFloat(InputElement.value))) {
                                    Total += parseFloat(InputElement.value);
                                }

                                InputElement.addEventListener("input", CalculateTotal);
                            }
                        }
                    }
                }
            }
        });

        Input.value = Total;
    };

    CalculateTotal();

    return Total;
}

function Average(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Args = CleanedValue.split(/\s*,\s*/);

    let Total = 0, Count = 0;

    const CalculateAverage = () => {
        Total = Count = 0;

        Args.forEach(Arg => {
            const NumericValue = parseFloat(Arg);
            if (!isNaN(NumericValue)) {
                Total += NumericValue;
                Count++;
            } else if (Arg.length > 0) {
                Array.from(document.getElementsByTagName("input")).forEach(InputElement => {
                    if (InputElement.classList.contains(Arg)) {
                        const NumericValue = parseFloat(InputElement.value);
                        if (!isNaN(NumericValue)) {
                            Total += NumericValue;
                            Count++;
                        }
                    }
                });
            }
        });

        Input.value = Count > 0 ? (Total / Count) : 0;
    };

    CalculateAverage();

    Array.from(document.getElementsByTagName("input")).forEach(InputElement => {
        InputElement.addEventListener("input", CalculateAverage);
    });

    return Total / Count;
}


function Round(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const [NumberValue, Rounding] = CleanedValue.split(/\s*,\s*/).map(Number);
    return !isNaN(NumberValue) && !isNaN(Rounding) ? Number(NumberValue.toFixed(Rounding)) : "";
}

function Max(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Args = CleanedValue.split(/\s*,\s*/);
    
    let MaxValue = Number.NEGATIVE_INFINITY;

    const CalculateMax = () => {
        MaxValue = Number.NEGATIVE_INFINITY;

        Args.forEach(Arg => {
            const NumericValue = parseFloat(Arg);
            if (!isNaN(NumericValue)) {
                MaxValue = Math.max(MaxValue, NumericValue);
            } else if (Arg.length > 0) {
                document.querySelectorAll(`input.${Arg}`).forEach(InputElement => {
                    const Value = parseFloat(InputElement.value) || Number.NEGATIVE_INFINITY;
                    MaxValue = Math.max(MaxValue, Value);
                    InputElement.addEventListener("input", CalculateMax);
                });
            }
        });

        Input.value = MaxValue;
    };

    CalculateMax();

    return MaxValue;
}

function Min(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Args = CleanedValue.split(/\s*,\s*/);

    let MinValue = Number.POSITIVE_INFINITY;

    const CalculateMin = () => {
        MinValue = Number.POSITIVE_INFINITY;

        Args.forEach(Arg => {
            const NumericValue = parseFloat(Arg);
            if (!isNaN(NumericValue)) {
                MinValue = Math.min(MinValue, NumericValue);
            } else if (Arg.length > 0) {
                document.querySelectorAll(`input.${Arg}`).forEach(InputElement => {
                    const Value = parseFloat(InputElement.value) || Number.POSITIVE_INFINITY;
                    MinValue = Math.min(MinValue, Value);
                    InputElement.addEventListener("input", CalculateMin);
                });
            }
        });

        Input.value = MinValue;
    };

    CalculateMin();

    return MinValue;
}


function Ceiling(Input, Item, Value) {
    const CleanedValue = parseFloat(Value.replace(/[\(\)'""]/g, "").trim());
    return !isNaN(CleanedValue) ? Math.ceil(CleanedValue) : "";
}

function Floor(Input, Item, Value) {
    const CleanedValue = parseFloat(Value.replace(/[\(\)'""]/g, "").trim());
    return !isNaN(CleanedValue) ? Math.floor(CleanedValue) : "";
}

function Image(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Source = CleanedValue;

    if (Source) {
        const ImageElement = document.createElement("img");
        ImageElement.src = Source;

        if (Item && Item.appendChild) {
            Input.remove();
            Item.appendChild(ImageElement);
        }
    }
    return "";
}

function Video(Input, Item, Value) {
    const CleanedValue = Value.replace(/[\(\)'""]/g, "").trim();
    const Source = CleanedValue;

    if (Source) {
        const VideoElement = document.createElement("video");
        VideoElement.src = Source;

        if (Item && Item.appendChild) {
            Item.appendChild(VideoElement);
        }
    }
    return "";
}

export function FormatInput(Input, Item) {
    const Value = Input.value;

    for (const Format in FormatTable) {
        if (Value.startsWith(Format)) {
            const FilteredValue = FormatTable[Format](Input, Item, Value.replace(Format, ""));
            Input.value = FilteredValue;
            break;
        }
    }
}

document.querySelectorAll("input").forEach(Input => {
    Input.addEventListener("focus", () => {
        window.Focused = true;
    });

    Input.addEventListener("focusout", () => {
        window.Focused = false;
    });
});

export const UndoHistory = [];
export const RedoHistory = [];

export const RecordHistory = (Item, From, To) => {
    UndoHistory.push({ Item, From, To });
};

export const UndoButton = document.querySelector(".UndoButton");
export const RedoButton = document.querySelector(".RedoButton");

UndoButton.addEventListener("click", () => {
    if (UndoHistory.length > 0) {
        const LatestItem = UndoHistory.pop();
        const Item = LatestItem.Item;
        const From = LatestItem.From;
        const To = LatestItem.To;

        Item.value = From;
        RedoHistory.push({ Item, From: To, To });
    }
});

RedoButton.addEventListener("click", () => {
    if (RedoHistory.length > 0) {
        const LatestItem = RedoHistory.pop();
        const Item = LatestItem.Item;
        const From = LatestItem.From;
        const To = LatestItem.To;

        Item.value = To;
        UndoHistory.push({ Item, From, To });
    }
});

export class ClickAndHold {
    /**
     * @param {EventTarget} Target The HTML element target to apply the ClickAndHold event to
     * @param {Function} Callback The callback runs once the target is clicked and held
     */
    constructor(Target, Callback) {
        this.Target = Target;
        this.Callback = Callback;
        this.IsHeld = false;
        this.ActiveHoldTimeout = null;

        ["mousedown", "touchstart"].forEach(Type => {
            this.Target.addEventListener(Type, this.OnHoldStart.bind(this), { passive: false });
        });

        ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(Type => {
            this.Target.addEventListener(Type, this.OnHoldEnd.bind(this), { passive: false });
        });
    }

    OnHoldStart(Event) {
        this.IsHeld = true;

        this.ActiveHoldTimeout = setTimeout(() => {
            if (this.IsHeld) {
                this.Callback(Event);
                this.IsHeld = false;
            }
        }, 500);
    }

    OnHoldEnd() {
        this.IsHeld = false;
        clearTimeout(this.ActiveHoldTimeout);
    }

    static Assign(Target, Callback) {
        return new ClickAndHold(Target, Callback);
    }
}

/**
 * Waits for a specified HTML element to become available in the DOM.
 *
 * @param {string} Selector - The CSS selector string used to query the desired HTML element.
 * @param {number} Interval - The time (in milliseconds) between each check for the element's existence. Defaults to 100 ms.
 * @returns {Promise<HTMLElement>} A promise that resolves with the found HTML element.
 */
export function WaitForElement(Selector, Interval = 100) {
    return new Promise((resolve) => {
        const checkElement = setInterval(() => {
            const element = document.querySelector(Selector);
            if (element) {
                clearInterval(checkElement);
                resolve(element);
            }
        }, Interval);
    });
}

/**
 * Waits for a specified number of milliseconds before resolving.
 *
 * @param {string} Selector - The CSS selector string used to query the desired HTML element.
 * @param {number} Interval - The time (in milliseconds) to wait before resolving.
 * @returns {Promise<void>} A promise that resolves after the specified time.
**/
export function WaitForChildren(Selector, Interval = 100) {
    return new Promise((resolve) => {
        const CheckChildren = setInterval(() => {
            const Children = document.querySelectorAll(Selector);
            if (Children.length > 0) {
                clearInterval(CheckChildren);
                resolve(Children);
            }
        }, Interval);
    });
}

export function Uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, Char => {
        const Random = (Math.random() * 16) | 0;
        const Value = Char === "x" ? Random : (Random & 0x3) | 0x8;
        return Value.toString(16);
    });
}

export class Storage {
    static async UploadFile(File) {
        const UUID = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => 
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );

        await Supabase.storage.from("Media").upload(UUID, File);

        const { data: PublicData } = Supabase.storage.from("Media").getPublicUrl(UUID);
        return PublicData.publicUrl;
    }
}

export class Sheet {
    static async Reload() {
        while (Grid.Grid.firstChild) {
            Grid.Grid.removeChild(Grid.Grid.firstChild);
        }
        Grid.GenerateGrid();
    }

    static GetItems() {
        return Array.from(Grid.Grid.children);
    }

    static async GetItem(Key = "", Row = "", Column = "") {
        const Item = Grid.Grid.querySelector(`div[data-row="${Row}"][data-column="${Column}"]`);
        if (Item && Item.querySelector("input").classList.toString()[0] === Key) {
            return Item;
        }
    }

    static SetItemStyle(Item, Style) {
        Item.style = Style;
    }

    static GetItemStyle(Item, Pure = true) {
        if (Pure) {
            return Item.style;
        } else {
            return getComputedStyle(Item);
        }
    }

    static Notice = class {
        constructor(Message = "", Type = "Info", Id = Date.now()) {
            this.Message = Message;
            this.Type = Type;
            this.Id = Id;
        }

        static Send(Notice) {
            const NoticeElement = document.createElement("div");
            NoticeElement.classList.add(`ID${Notice.Id}`);
            document.querySelector(".Notifications").appendChild(NoticeElement);

            const NoticeContent = document.createElement("span");
            NoticeContent.innerHTML = Notice.Message;
            NoticeElement.appendChild(NoticeContent);

            const CloseButton = document.createElement("img");
            CloseButton.draggable = false;
            CloseButton.src = "../images/Close.svg";
            CloseButton.addEventListener("click", () => {
                this.Remove(Notice);
            });
            NoticeElement.appendChild(CloseButton);

            const NoticeTypeIcon = document.createElement("img");
            NoticeTypeIcon.draggable = false;
            NoticeTypeIcon.src = `../images/${Notice.Type}.svg`;
            NoticeElement.appendChild(NoticeTypeIcon);
        }

        static Remove(Notice) {
            const NoticeElement = document.querySelector(`.ID${Notice.Id}`);
            if (NoticeElement) {
                NoticeElement.style.opacity = "0";
                setTimeout(() => {
                    NoticeElement.remove();
                }, 250);
            }
        }
    };
}

export class MsgBox {
    Position = {
        LeftCenter: [0, 0.5],
        LeftTop: [0, 0],
        LeftBottom: [0, 1],
        RightCenter: [1, 0.5],
        RightTop: [1, 0],
        RightBottom: [1, 1],
        Center: [0.5, 0.5],
    };

    static Button = class {
        constructor(Text = "", Callback = () => {}) {
            this.Text = Text;
            this.Callback = Callback;
        }

        static Create(Button) {
            const ButtonElement = document.createElement("button");
            ButtonElement.innerText = Button.Text;
            ButtonElement.onclick = Button.Callback;
            return ButtonElement;
        }
    };

    static Label = class {
        constructor(Text = "", Callback = () => {}) {
            this.Text = Text;
            this.Callback = Callback;
        }

        static Create(Label) {
            const LabelElement = document.createElement("label");
            LabelElement.innerText = Label.Text;
            LabelElement.onclick = Label.Callback;
            return LabelElement;
        }
    };

    constructor(
        Content = {
            Title: "",
            Labels: [],
            Buttons: [],
        },
        Pos = this.Position.Center,
        Id = crypto.randomUUID(),
        Size = [200, 400, "px"],
        Color = ["rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(120, 120, 120)"]
    ) {
        this.Content = Content;
        this.Pos = Pos;
        this.Size = Size;
        this.Color = Color;
        this.Id = Id;
    }

    static Create(MsgBox) {
        if (MsgBox.Color.some(c => c.startsWith("#"))) return;
        if (Object.values(MsgBox.Content).some(c => !c)) return;

        const Container = document.createElement("div");
        Container.id = MsgBox.Id;
        Container.style.position = "fixed";
        Container.style.left = `${MsgBox.Pos[0] * 100}%`;
        Container.style.top = `${MsgBox.Pos[1] * 100}%`;
        Container.style.transform = "translate(-50%, -50%)";
        Container.style.width = `${MsgBox.Size[0]}${MsgBox.Size[2]}`;
        Container.style.height = `${MsgBox.Size[1]}${MsgBox.Size[2]}`;
        Container.style.backgroundColor = MsgBox.Color[0];
        Container.style.color = MsgBox.Color[1];
        document.body.appendChild(Container);

        const Topbar = document.createElement("div");
        Topbar.style.position = "absolute";
        Topbar.style.top = "0";
        Topbar.style.left = "0";
        Topbar.style.width = "100%";
        Topbar.style.height = "16px";
        Topbar.style.backgroundColor = MsgBox.Color[2];
        Container.appendChild(Topbar);

        const Title = document.createElement("span");
        Title.innerText = MsgBox.Content.Title;
        Topbar.appendChild(Title);

        MsgBox.Content.Labels.forEach(Label => {
            const LabelElement = Label.Create(Label);
            Topbar.appendChild(LabelElement);
        });

        MsgBox.Content.Buttons.forEach(Button => {
            const ButtonElement = Button.Create(Button);
            Container.appendChild(ButtonElement);
        });
    }

    static Close(Id) {
        const Container = document.getElementById(Id);
        if (Container) {
            Container.style.opacity = "0";
            setTimeout(() => {
                Container.remove();
            }, 250);
        }
    }
}
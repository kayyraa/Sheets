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

    var Total = 0;
    var Count = 0;

    const CalculateAverage = () => {
        Total = 0;
        Count = 0;

        Args.forEach(Arg => {
            const NumericValue = parseFloat(Arg);
            if (!isNaN(NumericValue)) {
                Total += NumericValue;
                Count++;
            } else {
                if (Arg.length > 0) {
                    for (const TargetInput of Array.from(document.getElementsByTagName("input"))) {
                        for (const Class of TargetInput.classList) {
                            if (!Input.classList.includes("NoFunction") && Class.includes(Arg)) {
                                if (TargetInput.value && !isNaN(parseFloat(TargetInput.value))) {
                                    Total += parseFloat(TargetInput.value);
                                    Count++;
                                }

                                TargetInput.addEventListener("input", CalculateAverage);
                            }
                        }
                    }
                }
            }
        });

        Input.addEventListener("input", () => {
            if (!Input.value) {
                Input.classList.add("NoFunction")
            } else {
                Input.classList.remove("NoFunction")
            }
        });

        Input.value = (Total / Count).toFixed(2);
    };

    CalculateAverage();

    return (Total / Count).toFixed(2);
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

export class Storage {
    static async UploadFile(File) {
        const { data: publicData } = Supabase.storage.from("Media").getPublicUrl(`/${File.name}`);
        return publicData.publicUrl;
    }
}

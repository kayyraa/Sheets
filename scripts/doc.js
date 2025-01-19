const Content = document.querySelector("content");
const Navigation = document.querySelector("nav");

Array.from(Content.querySelectorAll("code")).forEach(Code => {
    let CodeString = "";
    let PreviousElement = null;

    Array.from(Code.children).forEach(CodeContent => {
        if (CodeContent.tagName.toLowerCase() === "button") {
            CodeContent.addEventListener("click", () => {
                navigator.clipboard.writeText(CodeString);
            });
        } else {
            if (PreviousElement && PreviousElement !== CodeContent) {
                CodeString += "\n";
            }
            CodeString += CodeContent.textContent;
            PreviousElement = CodeContent;
        }
    });
});

Navigation.querySelectorAll("li").forEach(Item => {
    const Connection = document.querySelector(`div[href="${Item.getAttribute("href")}"]`);
    if (Connection) {
        Item.addEventListener("click", () => {
            Connection.style.backgroundColor = "rgba(255, 255, 255, 0.125)";

            Content.scrollTo({
                top: Connection.offsetTop,
                behavior: "smooth"
            });

            setTimeout(() => {
                Connection.style.backgroundColor = "";
            }, 750);
        });
    }
});
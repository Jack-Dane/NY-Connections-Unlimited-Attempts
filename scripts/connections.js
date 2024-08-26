
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    })
}

waitForElement("button[data-testid='submit-btn']").then((element) => {
    element.addEventListener("click", (event) => {
        console.log("Submit clicked!");
        event.preventDefault();
        event.stopPropagation();
    });
});

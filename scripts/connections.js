
function getConnectionsResult() {
    chrome.runtime.sendMessage({message: "store-result"});
}

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

function collectResult() {
    let selectedBoxes = document.querySelectorAll(
        "input[data-testid='card-input'][type='checkbox']:checked"
    );

    let selectedWords = [];
    selectedBoxes.forEach(selectedBox => {
        selectedWords.push(selectedBox.value);
    })
    return selectedWords;
}

waitForElement("button[data-testid='submit-btn']").then((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        let selectedWords = collectResult();
        chrome.runtime.sendMessage(
            {
                message: "check-result",
                guess: selectedWords
            }, (response) => {
                console.log(response);
            }
        );
    });
});

getConnectionsResult();

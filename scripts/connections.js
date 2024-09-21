
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

module.exports = {getConnectionsResult, waitForElement, collectResult};

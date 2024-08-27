
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        console.log(message);
        if (message === "store-result") {
            fetch("https://www.nytimes.com/svc/connections/v2/2024-08-27.json")
                .then(response => response.json())
                .then(jsonResponse => console.log(jsonResponse));
        }
    }
);

const connections = require('./connections');

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (message.message === "store-result") {
            connections.storeResult();
        } else if (message.message === "check-result") {
            connections.checkResult(message).then(success => {
                sendResponse({
                    succeeded: success
                });
            });

            // keep the message channel open so the promise chain can send the response
            return true;
        }
    }
);

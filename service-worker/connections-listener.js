import { storeResult, checkResult } from "./connections.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "store-result") {
    storeResult();
  } else if (message.message === "check-result") {
    checkResult(message).then((success) => {
      sendResponse({
        succeeded: success,
      });
    });

    // keep the message channel open so the promise chain can send the response
    return true;
  }
});

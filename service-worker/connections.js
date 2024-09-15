
function zeroLeadingDate(dateValue) {
    return ("0" + dateValue).slice(-2);
}

function storeResult() {
    const currentDate = new Date();
    const dateString = `\
${currentDate.getFullYear()}-\
${zeroLeadingDate(currentDate.getMonth() + 1)}-\
${zeroLeadingDate(currentDate.getDate())}
`;
    console.log(`Current date string ${dateString}`);

    fetch(`https://www.nytimes.com/svc/connections/v2/${dateString}.json`)
        .then(response => response.json())
        .then(connectionAnswers => chrome.storage.local.set({connections_result: connectionAnswers}))
        .catch(error => { console.error(error) });
}

function checkResult(message) {
    console.log("Checking result");
}

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (message.message === "store-result") {
            storeResult();
        } else if (message.message === "check-result") {
            checkResult(message);
        }
    }
);

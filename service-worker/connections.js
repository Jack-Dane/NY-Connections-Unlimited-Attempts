
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
    console.log(message.guess);

    return chrome.storage.local.get("connections_result").then(results => {
        let categories = results["connections_result"]["categories"];
        let foundResult = false;

        let resultsCount = [0, 0, 0, 0];
        for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            categories[categoryIndex]["cards"].forEach(card => {
                if (message.guess.includes(card["content"])) {
                    resultsCount[categoryIndex]++;
                }
            });

            if (resultsCount[categoryIndex] < 4 && resultsCount[categoryIndex] > 0) {
                // incomplete means failure
                // 0 could still mean success
                foundResult = false;
                break;
            }

            if (resultsCount[categoryIndex] === 4) {
                foundResult = true;
                break;
            }
        }

        return foundResult;
    });
}

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (message.message === "store-result") {
            storeResult();
        } else if (message.message === "check-result") {
            checkResult(message).then(success => {
                sendResponse({
                    succeeded: success
                });
            });

            // keep the message channel open so the promise chain can send the response
            return true;
        }
    }
);


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

function checkResultCategory(categories, categoryIndex, guess) {
    let totalCorrectForCategory = 0;
    categories[categoryIndex]["cards"].forEach(card => {
        if (guess.includes(card["content"])) {
            totalCorrectForCategory++;
        }
    });

    if (totalCorrectForCategory === 4) {
        return true;
    } else if (totalCorrectForCategory < 4 && totalCorrectForCategory > 0) {
        // incomplete means failure
        // 0 could still mean success
        return false;
    }

    // could not determine if this category resulted in a win or a loss
    return null;
}

function checkResult(message) {
    console.log("Checking result");
    console.log(message.guess);

    return chrome.storage.local.get("connections_result").then(results => {
        let categories = results["connections_result"]["categories"];

        for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            let result = checkResultCategory(categories, categoryIndex, message.guess);

            if (result == null) {
                continue;
            }

            return result;
        }

        return false;
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

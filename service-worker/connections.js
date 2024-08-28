
function zeroLeadingDate(dateValue) {
    return ("0" + dateValue).slice(-2);
}

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        if (message === "store-result") {
            const currentDate = new Date();
            const dateString = `\
${currentDate.getFullYear()}-\
${zeroLeadingDate(currentDate.getMonth() + 1)}-\
${zeroLeadingDate(currentDate.getDate())}
`;
            console.log(dateString);

            fetch(`https://www.nytimes.com/svc/connections/v2/${dateString}.json`)
                .then(response => response.json())
                .then(jsonResponse => console.log(jsonResponse));
        }
    }
);

waitForElement("button[data-testid='submit-btn']").then((element) => {
  element.addEventListener("click", (event) => {
    if (element.dataset.correctAnswer) {
      // we have already checked that the currently selected items are correct so just carry on as normal
      delete element.dataset.correctAnswer;
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let selectedWords = collectResult();
    chrome.runtime.sendMessage(
      {
        message: "check-result",
        guess: selectedWords,
      },
      (response) => {
        console.log(response);

        if (response.succeeded) {
          element.dataset.correctAnswer = "1";
          element.click();
        }
      },
    );
  });
});

getConnectionsResult();

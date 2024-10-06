waitForElement("button[data-testid='submit-btn']").then((element) => {
  element.addEventListener("click", (event) => {
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
      },
    );
  });
});

getConnectionsResult();

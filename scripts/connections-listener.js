const connections = require("./connections");

connections
  .waitForElement("button[data-testid='submit-btn']")
  .then((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      let selectedWords = connections.collectResult();
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

connections.getConnectionsResult();

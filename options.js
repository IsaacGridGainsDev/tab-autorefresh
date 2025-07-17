function saveOptions(e) {
  e.preventDefault();
  let interval = document.querySelector("#interval").value;
  browser.storage.local.set({
    interval: interval
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#interval").value = result.interval || 5;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.local.get("interval");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

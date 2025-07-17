let refreshAlarmName = 'tabRefresherAlarm';

function onAlarm(alarm) {
  if (alarm.name === refreshAlarmName) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0) {
        browser.tabs.reload(tabs[0].id).then(() => {
            browser.notifications.create({
                "type": "basic",
                "iconUrl": browser.runtime.getURL("icons/icon-48.png"),
                "title": "Tab Refreshed",
                "message": `The tab has been successfully refreshed.`
            });
        }).catch(() => {
            browser.notifications.create({
                "type": "basic",
                "iconUrl": browser.runtime.getURL("icons/icon-48.png"),
                "title": "Refresh Failed",
                "message": `There was an error refreshing the tab.`
            });
        });
      }
    });
    // Recreate the alarm
    browser.storage.local.get("interval").then((result) => {
        if (result.interval) {
            createAlarm(result.interval);
        }
    });
  }
}

function createAlarm(interval) {
    let intervalSeconds = parseInt(interval);
    if (intervalSeconds > 0) {
        let intervalInMinutes = Math.max(1, intervalSeconds / 60);
        browser.alarms.create(refreshAlarmName, {
            delayInMinutes: intervalInMinutes
        });
    }
}

function handleStorageChange(changes, area) {
  if (area === 'local' && changes.interval) {
    browser.alarms.clear(refreshAlarmName).then(() => {
      createAlarm(changes.interval.newValue);
    });
  }
}

browser.alarms.onAlarm.addListener(onAlarm);
browser.storage.onChanged.addListener(handleStorageChange);

browser.storage.local.get("interval").then((result) => {
  if (result.interval) {
    createAlarm(result.interval);
  } else {
    // Create a default alarm
    createAlarm(30);
  }
});

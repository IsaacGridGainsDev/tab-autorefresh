let refreshAlarmName = 'tabRefresherAlarm';

function onAlarm(alarm) {
  if (alarm.name === refreshAlarmName) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0) {
        browser.tabs.reload(tabs[0].id);
      }
    });
  }
}

function createAlarm(interval) {
  browser.alarms.create(refreshAlarmName, {
    periodInMinutes: parseInt(interval)
  });
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
  }
});

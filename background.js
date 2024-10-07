let currentTime = 25 * 60;
let isRunning = false;
let isFocus = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    isRunning = true;
    chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 }); // 1-second interval
  } else if (message.action === "stopTimer") {
    isRunning = false;
    chrome.alarms.clear("pomodoroTimer");
  } else if (message.action === "getTimer") {
    sendResponse({ currentTime, isFocus, isRunning });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer" && isRunning) {
    currentTime--;
    if (currentTime <= 0) {
      isFocus = !isFocus;
      currentTime = isFocus ? 25 * 60 : 5 * 60;
      chrome.runtime.sendMessage({ action: "updateCircleColor", isFocus });
    }
    chrome.storage.local.set({ currentTime, isFocus });
  }
});

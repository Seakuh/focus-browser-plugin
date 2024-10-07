const notes = JSON.parse(localStorage.getItem("notes")) || [];
const noteInput = document.getElementById("notes");
const noteList = document.getElementById("note-list");
const saveNoteButton = document.getElementById("save-note");
const increaseTimeButton = document.getElementById("increase-time");
const decreaseTimeButton = document.getElementById("decrease-time");
const timerDisplay = document.getElementById("timer");
const circle = document.getElementById("circle");
const archiveButton = document.getElementById("archive-notes-btn");
const archiveList = document.getElementById("archive-list");

let archivedNotes = JSON.parse(localStorage.getItem("archivedNotes")) || [];
let focusTime = 25 * 60; // default 25 minutes in seconds
let breakTime = 5 * 60; // default 5 minutes in seconds
let isFocus = true;
let timer;
let isRunning = false;

// --- NOTES ------------------------------------------------------------------------------------------------------------

// Load saved notes
function displayNotes() {
  notes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.textContent = note;
    noteList.appendChild(noteItem);
  });
}

saveNoteButton.addEventListener("click", () => {
  const noteText = noteInput.value;
  if (noteText) {
    notes.push(noteText);
    localStorage.setItem("notes", JSON.stringify(notes));
    const noteItem = document.createElement("li");
    noteItem.textContent = noteText;
    noteList.appendChild(noteItem);
    noteInput.value = ""; // Clear input after saving
  }
});

archiveButton.addEventListener("click", () => {
  if (archiveList.style.display === "none") {
    displayArchivedNotes();
    archiveList.style.display = "block";
  } else {
    archiveList.style.display = "none";
  }
});

displayNotes();

// --- TIMER ------------------------------------------------------------------------------------------------------------

// Timer adjustment buttons
increaseTimeButton.addEventListener("click", () => {
  focusTime += 60; // increase by 1 minute
  updateDisplay(focusTime);
});

decreaseTimeButton.addEventListener("click", () => {
  if (focusTime > 60) {
    focusTime -= 60; // decrease by 1 minute
    updateDisplay(focusTime);
  }
});

// Update the timer display
function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Start button logic
const startButton = document.getElementById("start-btn");
startButton.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timer);
    startButton.textContent = "Start";
  } else {
    startTimer();
    startButton.textContent = "Stop";
  }
  isRunning = !isRunning;
});

function startTimer() {
  let time = isFocus ? focusTime : breakTime;
  if (isFocus) focusSessions++;
  updateDisplay(time);

  timer = setInterval(() => {
    time--;
    if (isFocus) totalFocusTime++;

    updateDisplay(time);

    if (time <= 0) {
      clearInterval(timer);
      isFocus = !isFocus;
      circle.classList.toggle("red", !isFocus);
      showFitnessSuggestion();
      if (!isFocus) showConfetti();
      startTimer();
    }
  }, 1000);
}

// --- BREAKE ------------------------------------------------------------------------------------------------------------

// Fitness Suggestions
const fitnessSuggestions = [
  "5-minute Yoga: Stretch your arms and legs.",
  "Take a quick walk around the house.",
  "Do 10 pushups.",
  "Try deep breathing exercises.",
];

function showFitnessSuggestion() {
  const suggestion =
    fitnessSuggestions[Math.floor(Math.random() * fitnessSuggestions.length)];
  alert(suggestion);
}

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

let focusSessions = 0;
let totalFocusTime = 0; // in seconds

// --- STATISTIC ------------------------------------------------------------------------------------------------------------

// Display daily stats
function showDailyStats() {
  const hours = Math.floor(totalFocusTime / 3600);
  const minutes = Math.floor((totalFocusTime % 3600) / 60);
  alert(
    `Today's Focus Stats:\nFocus Sessions: ${focusSessions}\nTotal Focus Time: ${hours}h ${minutes}m`
  );
}

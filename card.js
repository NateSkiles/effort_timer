let attributes,
  convoId,
  running,
  startDate,
  durationTotal,
  durationCurrent = 0,
  startTimer;

const timerText = document.getElementById("timerText");
const modal = document.getElementById("editModal");
const btn = document.getElementById("editButton");
const span = document.getElementsByClassName("close")[0];
const form = document.querySelector("form");

async function loadContext() {
  await Kustomer.initialize(function (contextJSON) {
    attributes = contextJSON.conversation.attributes;
    convoId = contextJSON.conversation.id;

    if (attributes.custom["@effotim2TimerStartAt"]) {
      startDate = new Date(
        attributes.custom["@effotim2TimerStartAt"]
      ).toISOString();
    }

    attributes.custom["@effotim2TimerBool"]
      ? (running = attributes.custom["@effotim2TimerBool"])
      : (running = false);
    attributes.custom["@effotim2DurationNum"]
      ? (durationTotal = attributes.custom["@effotim2DurationNum"])
      : (durationTotal = 0);

    // If timerBool is true, find current duration, set timer, then start set interval
    // Else, set timer with current duration on conversation
    if (running) {
      let currentTime = new Date().toISOString();
      durationCurrent =
        new Date(currentTime) - new Date(startDate) + durationTotal;

      setTime(durationCurrent);
      startTimerText();

      startTimer = setInterval(() => {
        durationCurrent += 1000;
        setTime(durationCurrent);
      }, 1000);
    } else {
      setTime(durationTotal);
      stopTimerText();
    }
  });
}

async function timer() {
  let currentTime = new Date().toISOString();

  // If called while timer is running, find current time, then calculate difference between current time and recorded start
  // Sum the duration timer was running with recorded duration on the conversation
  if (running) {
    let dateDiff = new Date(currentTime) - new Date(startDate);
    durationTotal += dateDiff;

    await Kustomer.request(
      {
        url: "/v1/conversations/" + convoId,
        method: "PUT",
        body: {
          custom: {
            "@effotim2TimerBool": false,
            "@effotim2TimerEndAt": currentTime,
            "@effotim2DurationNum": durationTotal,
          },
        },
      },
      (err, conversations) => {
        if (err || !conversations) {
          console.log(err);
          return;
        } else {
          // Set timer with duration returned in response, stop timer (interval) and set running to false, update timer button
          setTime(conversations.attributes.custom["@effotim2DurationNum"]);
          clearInterval(startTimer);
          running = false;
          stopTimerText();

          return console.log("Stopping Timer");
        }
      }
    );
  } else {
    // If timer wasn't running - set running to true and record timer start time
    await Kustomer.request(
      {
        url: "/v1/conversations/" + convoId,
        method: "PUT",
        body: {
          custom: {
            "@effotim2TimerBool": true,
            "@effotim2TimerStartAt": currentTime,
          },
        },
      },
      (err, conversations) => {
        if (err || !conversations) {
          console.log(err);
          return;
        } else {
          startDate = conversations.attributes.custom["@effotim2TimerStartAt"];
          conversations.attributes.custom["@effotim2DurationNum"]
            ? (durationCurrent =
                conversations.attributes.custom["@effotim2DurationNum"])
            : (durationCurrent = 0);

          running = true;
          startTimerText();

          startTimer = setInterval(() => {
            durationCurrent += 1000;
            setTime(durationCurrent);
          }, 1000);

          return console.log("Starting Timer");
        }
      }
    );
  }
}

// Utility Functions
// Convert ms to time object
function convertMiliseconds(miliseconds) {
  let hours, minutes, seconds, total_minutes, total_seconds;

  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(Math.floor(total_minutes / 60));

  return { h: hours, m: minutes, s: seconds };
}

// Set clock from time object
function setTime(durationTotal) {
  let durationCurrent = convertMiliseconds(durationTotal);
  if (durationTotal || durationTotal === 0) {
    document.getElementById("hh").innerText = `${durationCurrent.h.pad()}`;
    document.getElementById("mm").innerText = `${durationCurrent.m.pad()}`;
    document.getElementById("ss").innerText = `${durationCurrent.s.pad()}`;
  }
}

function startTimerText() {
  timerText.style.backgroundColor = "#ff4c55";
  timerText.innerText = "STOP";
}

function stopTimerText() {
  timerText.style.backgroundColor = "#2ea44f";
  timerText.innerText = "START";
}

// Display leading zero
Number.prototype.pad = function () {
  let s = String(this);
  if (s.length < 2) {
    s = "0" + s;
  }
  return s;
};

// Modal functions
// From submit
form.addEventListener("submit", event => {
  // submit event detected
  event.preventDefault();

  const hours = document.getElementById("hours").value;
  const minutes = document.getElementById("minutes").value;
  const seconds = document.getElementById("seconds").value;
  let milliseconds = 0

  milliseconds = hours * 60 * 60 * 1000;
  milliseconds += minutes * 60 * 1000;
  milliseconds += seconds * 1000;
  
  if (milliseconds < 1) {
    return window.alert('Please enter a duration greater than 0 (or use reset button).')
  }

  Kustomer.request(
    {
      url: "/v1/conversations/" + convoId,
      method: "PUT",
      body: {
        custom: {
          "@effotim2TimerBool": false,
          "@effotim2DurationNum": milliseconds,
        },
      },
    },
    (err, conversations) => {
      if (err || !conversations) {
        console.log(err);
        return;
      } else {
        // Set timer with duration returned in response, stop timer (interval) and set running to false, update timer button
        setTime(conversations.attributes.custom["@effotim2DurationNum"]);
        clearInterval(startTimer);
        running = false;
        stopTimerText();
        milliseconds = 0;

        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
          input.value = milliseconds.pad();
        });

        modal.style.display = "none";

        return console.log("Stopping Timer");
      }
    }
  );
});

// When the user clicks on button, open modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on span, close modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks outside of the modal, close modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// When the user presses escape, close modal
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});

// Reset form
async function resetTimer() {
  const answer = window.confirm("Are you sure you want to reset your timer?");
  if (answer) {
    await Kustomer.request(
      {
        url: "/v1/conversations/" + convoId,
        method: "PUT",
        body: {
          custom: {
            "@effotim2TimerBool": false,
            "@effotim2DurationNum": 0,
          },
        },
      },
      (err, conversations) => {
        if (err || !conversations) {
          console.log(err);
          return;
        } else {
          // Set timer with duration returned in response, stop timer (interval) and set running to false, update timer button
          setTime(0);
          clearInterval(startTimer);
          running = false;
          stopTimerText();

          return console.log("Stopping Timer");
        }
      }
    );
  }
}
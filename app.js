let attributes,
    convoId,
    running,
    durationTotal = 0,
    durationCurrent = 0,
    startDate,
    startTimer;

const timerText = document.getElementById("timerText");

async function loadContext() {
    await Kustomer.initialize(function (contextJSON) {
        attributes = contextJSON.conversation.attributes;
        convoId = contextJSON.conversation.id;

        if (attributes.custom['@effotim2TimerBool']) {
            running = attributes.custom['@effotim2TimerBool'];
        }

        if (attributes.custom['@effotim2TimerStartAt']) {
            startDate = new Date(attributes.custom['@effotim2TimerStartAt']).toISOString();
        }

        if (attributes.custom['@effotim2DurationNum']) {
            durationTotal = attributes.custom['@effotim2DurationNum'];
        }

        // If timerBool is true, find current duration, set timer, then start set interval
        // Else, set timer with current duration on conversation
        if (running) {
            let currentTime = new Date().toISOString();
            durationCurrent = new Date(currentTime) - new Date(startDate) + durationTotal;

            setTime(durationCurrent);
            startTimerText();

            startTimer = setInterval(() => {
                durationCurrent += 1000;
                setTime(durationCurrent);
            }, 1000)

        } else {
            console.log(durationTotal);
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
        console.log(durationTotal);

        await Kustomer.request({
            url: "/v1/conversations/" + convoId,
            method: "PUT",
            body: {
                custom: {
                    "@effotim2TimerBool": false,
                    "@effotim2TimerEndAt": currentTime,
                    "@effotim2DurationNum": durationTotal,
                },
            },
        }, (err, conversations) => {
            if (err || !conversations) {
                console.log(err);
                return;
            }
            else {
                // Set timer with duration returned in response, stop timer (interval) and set running to false, update timer button
                setTime(conversations.attributes.custom['@effotim2DurationNum']);
                clearInterval(startTimer);
                running = false;
                stopTimerText();

                return console.log("Stopping Timer");
            }
        });
    } else {
        // If timer wasn't running - set running to true and record timer start time
        await Kustomer.request({
            url: "/v1/conversations/" + convoId,
            method: "PUT",
            body: {
                custom: {
                    "@effotim2TimerBool": true,
                    "@effotim2TimerStartAt": currentTime,
                },
            },
        }, (err, conversations) => {
            if (err || !conversations) {
                console.log(err);
                return;
            }
            else {
                // startDate = conversations.attributes.custom.effotim2TimerStartAt; not needed?
                if (conversations.attributes.custom['@effotim2DurationNum']) {
                    durationCurrent = conversations.attributes.custom['@effotim2DurationNum'];
                };
                console.log(conversations.attributes.custom);

                running = true;
                startTimerText();

                console.log(durationCurrent)

                startTimer = setInterval(() => {
                    durationCurrent += 1000;
                    setTime(durationCurrent);
                }, 1000);

                return console.log("Starting Timer");
            }
        });
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
    if (durationTotal) {
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

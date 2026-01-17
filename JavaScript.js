var timer = null;
var x = 0;
var y = 0;
var finishX = 900;

function GetRandomNum() {
    return Math.floor(Math.random() * 10) + 1;
}
function setStatus(msg) {
    var s = document.getElementById("status");
    if (!s) return;

    s.innerHTML = msg ? `<span>${msg}</span>` : "";

    if (msg && msg.trim().length > 0) s.classList.add("show");
    else s.classList.remove("show");
}

function clearEffects() {
    var c1 = document.getElementById("car1");
    var c2 = document.getElementById("car2");
    if (!c1 || !c2) return;

    c1.classList.remove("winner");
    c2.classList.remove("winner");
    c1.style.opacity = "1";
    c2.style.opacity = "1";
    setStatus("");
}

function applyWinner(winnerId, loserId, msg) {
    var w = document.getElementById(winnerId);
    var l = document.getElementById(loserId);
    if (!w || !l) return;

    w.classList.add("winner");
    l.style.opacity = "0.55";
    setStatus(msg);

    confettiBurst();
}


function computeFinishX() {
    var track = document.getElementById("track");
    var finishLine = document.getElementById("finishLine");
    var car = document.getElementById("car1");

    if (!track || !finishLine || !car) {
        finishX = 900;
        return;
    }

    var trackRect = track.getBoundingClientRect();
    var finishRect = finishLine.getBoundingClientRect();
    var carRect = car.getBoundingClientRect();

    finishX = Math.floor(
        (finishRect.left - trackRect.left) +
        (finishRect.width / 2) -
        carRect.width
    );

    if (!Number.isFinite(finishX) || finishX < 0) finishX = 900;
}

function confettiBurst() {
    var track = document.getElementById("track");
    if (!track) return;

    var colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#5352ed"];

    for (var i = 0; i < 55; i++) {
        var c = document.createElement("div");
        c.className = "confetti";
        c.style.left = (Math.random() * 96) + "%";
        c.style.top = "110px";
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
        track.appendChild(c);

        (function (el) {
            setTimeout(function () { el.remove(); }, 1600);
        })(c);
    }
}


function StartTheRace() {
    if (timer) return;
    clearEffects();
    computeFinishX();
    timer = setInterval(MoveCars, 50);
}

function PauseTheRace() {
    clearInterval(timer);
    timer = null;
}

function ResetTheRace() {
    PauseTheRace();
    x = 0;
    y = 0;
    clearEffects();

    var c1 = document.getElementById("car1");
    var c2 = document.getElementById("car2");
    if (c1) c1.style.left = x + "px";
    if (c2) c2.style.left = y + "px";
}

function MoveCars() {
    x += GetRandomNum();
    y += GetRandomNum();

    var c1 = document.getElementById("car1");
    var c2 = document.getElementById("car2");
    if (!c1 || !c2) return;

    c1.style.left = x + "px";
    c2.style.left = y + "px";

    if (x >= finishX || y >= finishX) {
        PauseTheRace();

        if (x >= finishX) {
            x = finishX;
            c1.style.left = x + "px";
            applyWinner("car1", "car2", "The Integra is the winner!");
        } else {
            y = finishX;
            c2.style.left = y + "px";
            applyWinner("car2", "car1", "The Mustang is the winner!");
        }
    }
}

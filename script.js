let currentScreen = 1;

let hits = 0;


/* ========================= */
/* CAMBIAR PANTALLA */
/* ========================= */

function goToScreen(number) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });

    const nextScreen = document.getElementById(
        "screen" + number
    );

    nextScreen.classList.add("active");

    currentScreen = number;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ========================= */
/* JUEGO DEL BALÓN */
/* ========================= */

function hitBall() {

    hits++;

    const ball = document.getElementById("ballButton");

    const score = document.getElementById("score");

    score.innerText = hits + " / 3";

    ball.style.transform =
        "scale(1.4) rotate(" +
        (Math.random() * 40 - 20) +
        "deg)";

    setTimeout(() => {

        ball.style.transform =
            "scale(1)";

    }, 150);


    if (hits >= 3) {

        score.innerText =
            "🔥 ¡RETO SUPERADO!";

        setTimeout(() => {

            goToScreen(3);

        }, 1000);
    }
}


/* ========================= */
/* ABRIR REGALO */
/* ========================= */

function openGift() {

    const gift = document.getElementById("gift");

    gift.style.transform =
        "scale(1.5) rotate(10deg)";

    gift.style.transition =
        "all .5s ease";

    setTimeout(() => {

        createConfetti();

        goToScreen(6);

    }, 700);
}


/* ========================= */
/* CONFETI */
/* ========================= */

function createConfetti() {

    const emojis = [
        "🎉",
        "🎊",
        "🏀",
        "💚",
        "⭐",
        "🔥",
        "🎁"
    ];

    for (let i = 0; i < 35; i++) {

        const confetti =
            document.createElement("div");

        confetti.innerText =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];

        confetti.style.position =
            "fixed";

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.top =
            "-50px";

        confetti.style.fontSize =
            (20 + Math.random() * 25) + "px";

        confetti.style.zIndex =
            "100";

        confetti.style.pointerEvents =
            "none";

        document.body.appendChild(confetti);

        const duration =
            2000 + Math.random() * 3000;

        confetti.animate(

            [
                {
                    transform:
                        "translateY(0) rotate(0deg)"
                },

                {
                    transform:
                        "translateY(110vh) rotate(720deg)"
                }
            ],

            {
                duration: duration,
                easing: "ease-in"
            }

        );

        setTimeout(() => {

            confetti.remove();

        }, duration);
    }
}

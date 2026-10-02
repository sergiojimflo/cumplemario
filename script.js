/* =========================================
   ESTADO DEL JUEGO
========================================= */

let currentScreen = 1;

let basketScore = 0;
let footballScore = 0;

let basketLocked = false;
let footballLocked = false;


/* =========================================
   CAMBIAR DE PANTALLA
========================================= */

function goToScreen(number) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });

    const nextScreen =
        document.getElementById("screen" + number);

    nextScreen.classList.add("active");

    currentScreen = number;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   PRUEBA 1
   BALONCESTO
========================================= */

function shootBasketball() {

    if (basketLocked) {
        return;
    }

    basketLocked = true;

    const ball =
        document.getElementById("basketBall");

    const message =
        document.getElementById("basketMessage");

    /*
       Animación del balón hacia la canasta
    */

    ball.style.left = "50%";
    ball.style.bottom = "230px";

    ball.style.transform =
        "translateX(-50%) scale(.65) rotate(360deg)";


    setTimeout(() => {

        basketScore++;

        document.getElementById(
            "basketScore"
        ).innerText =
            basketScore + " / 3";

        message.innerText =
            "🔥 ¡CANASTA!";

        /*
           Volvemos a colocar el balón
        */

        setTimeout(() => {

            ball.style.left = "50%";
            ball.style.bottom = "20px";

            ball.style.transform =
                "translateX(-50%) scale(1) rotate(0)";

            basketLocked = false;

            if (basketScore >= 3) {

                message.innerText =
                    "🏆 ¡3 CANASTAS! ¡PRUEBA SUPERADA!";

                setTimeout(() => {

                    goToScreen(3);

                }, 1200);
            }
            else {

                message.innerText =
                    "👆 ¡Otra vez! ¡A por la siguiente!";

            }

        }, 650);

    }, 600);
}


/* =========================================
   PRUEBA 2
   FÚTBOL
========================================= */

function shootFootball() {

    if (footballLocked) {
        return;
    }

    footballLocked = true;

    const ball =
        document.getElementById("footballBall");

    const message =
        document.getElementById("footballMessage");

    /*
       Animación del balón hacia la portería
    */

    ball.style.left = "50%";
    ball.style.bottom = "220px";

    ball.style.transform =
        "translateX(-50%) scale(.55) rotate(360deg)";


    setTimeout(() => {

        footballScore++;

        document.getElementById(
            "footballScore"
        ).innerText =
            footballScore + " / 3";

        message.innerText =
            "⚽ ¡GOOOOOOOL!";

        setTimeout(() => {

            ball.style.left = "50%";
            ball.style.bottom = "20px";

            ball.style.transform =
                "translateX(-50%) scale(1) rotate(0)";

            footballLocked = false;

            if (footballScore >= 3) {

                message.innerText =
                    "🏆 ¡3 GOLES! ¡PRUEBA SUPERADA!";

                setTimeout(() => {

                    goToScreen(4);

                }, 1200);
            }
            else {

                message.innerText =
                    "👆 ¡Vamos! ¡Marca el siguiente!";

            }

        }, 650);

    }, 600);
}


/* =========================================
   ABRIR REGALO
========================================= */

function openGift() {

    const gift =
        document.getElementById("gift");

    gift.style.transform =
        "scale(1.4) rotate(8deg)";

    gift.style.transition =
        "all .5s ease";


    setTimeout(() => {

        createConfetti();

        goToScreen(6);

    }, 700);
}


/* =========================================
   CONFETI
========================================= */

function createConfetti() {

    const container =
        document.getElementById("confetti");

    const emojis = [
        "🎉",
        "🎊",
        "🏀",
        "⚽",
        "💚",
        "⭐",
        "🔥",
        "🎁"
    ];


    for (let i = 0; i < 55; i++) {

        const piece =
            document.createElement("div");

        piece.className =
            "confetti-piece";

        piece.innerText =
            emojis[
                Math.floor(
                    Math.random() * emojis.length
                )
            ];

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.fontSize =
            (18 + Math.random() * 25) + "px";

        piece.style.animationDuration =
            (2 + Math.random() * 3) + "s";

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";


        container.appendChild(piece);


        setTimeout(() => {

            piece.remove();

        }, 6000);
    }
}

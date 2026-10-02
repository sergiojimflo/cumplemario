/* =========================================
   ESTADO DEL JUEGO
========================================= */

let basketScore = 0;
let footballScore = 0;

let activeDrag = null;


/* =========================================
   CAMBIAR PANTALLA
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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   CREAR CONTROL DE LANZAMIENTO
========================================= */

function setupBallDrag(ballId, gameId, type) {

    const ball =
        document.getElementById(ballId);

    const game =
        document.querySelector(gameId);

    if (!ball || !game) {
        return;
    }

    let startX = 0;
    let startY = 0;

    let currentX = 0;
    let currentY = 0;

    let dragging = false;

    /*
     * Cuando tocamos el balón
     */

    ball.addEventListener(
        "pointerdown",
        function(event) {

            if (activeDrag !== null) {
                return;
            }

            activeDrag = type;

            dragging = true;

            ball.setPointerCapture(event.pointerId);

            const rect =
                game.getBoundingClientRect();

            const ballRect =
                ball.getBoundingClientRect();

            startX =
                ballRect.left +
                ballRect.width / 2 -
                rect.left;

            startY =
                ballRect.top +
                ballRect.height / 2 -
                rect.top;

            currentX = startX;
            currentY = startY;

            ball.style.transition = "none";

            ball.classList.add("dragging");

            /*
             * Añadimos una pequeña escala
             */

            ball.style.transform =
                "translate(-50%, -50%) scale(1.15)";
        }
    );


    /*
     * Mientras arrastramos
     */

    ball.addEventListener(
        "pointermove",
        function(event) {

            if (!dragging) {
                return;
            }

            const rect =
                game.getBoundingClientRect();

            currentX =
                event.clientX -
                rect.left;

            currentY =
                event.clientY -
                rect.top;

            /*
             * Limitamos el balón al campo
             */

            currentX =
                Math.max(
                    25,
                    Math.min(
                        rect.width - 25,
                        currentX
                    )
                );

            currentY =
                Math.max(
                    25,
                    Math.min(
                        rect.height - 25,
                        currentY
                    )
                );

            const deltaX =
                currentX - startX;

            const deltaY =
                currentY - startY;

            /*
             * El balón sigue el dedo
             */

            ball.style.left =
                currentX + "px";

            ball.style.top =
                currentY + "px";

            ball.style.bottom = "auto";

            /*
             * Calculamos ángulo del gesto
             */

            const angle =
                Math.atan2(
                    deltaY,
                    deltaX
                ) * 180 / Math.PI;

            const distance =
                Math.sqrt(
                    deltaX * deltaX +
                    deltaY * deltaY
                );

            ball.style.transform =
                `translate(-50%, -50%)
                 rotate(${angle}deg)
                 scale(${1 + Math.min(distance / 300, .25)})`;
        }
    );


    /*
     * Al soltar
     */

    ball.addEventListener(
        "pointerup",
        function(event) {

            if (!dragging) {
                return;
            }

            dragging = false;

            ball.releasePointerCapture(
                event.pointerId
            );

            ball.classList.remove("dragging");

            ball.style.transition =
                "left .45s ease, top .45s ease, transform .45s ease";

            const deltaX =
                currentX - startX;

            const deltaY =
                currentY - startY;

            const distance =
                Math.sqrt(
                    deltaX * deltaX +
                    deltaY * deltaY
                );

            /*
             * Solo consideramos lanzamientos
             * suficientemente fuertes.
             */

            if (distance < 55) {

                resetBall(
                    ball,
                    type
                );

                return;
            }


            /*
             * BALONCESTO
             */

            if (type === "basketball") {

                processBasketballShot(
                    ball,
                    game,
                    deltaX,
                    deltaY,
                    distance
                );
            }


            /*
             * FÚTBOL
             */

            if (type === "football") {

                processFootballShot(
                    ball,
                    game,
                    deltaX,
                    deltaY,
                    distance
                );
            }
        }
    );


    /*
     * Si el dedo sale de forma inesperada
     */

    ball.addEventListener(
        "pointercancel",
        function() {

            dragging = false;

            activeDrag = null;

            resetBall(
                ball,
                type
            );
        }
    );
}


/* =========================================
   TIRO DE BALONCESTO
========================================= */

function processBasketballShot(
    ball,
    game,
    dx,
    dy,
    distance
) {

    const message =
        document.getElementById(
            "basketMessage"
        );

    /*
     * Para tirar a canasta necesitamos
     * principalmente un movimiento hacia arriba.
     *
     * En pantalla:
     * Y menor = arriba.
     */

    const upward =
        -dy;

    const rect =
        game.getBoundingClientRect();

    const ballRect =
        ball.getBoundingClientRect();

    /*
     * Centro de la canasta
     */

    const targetX =
        rect.width / 2;

    const targetY = 100;

    const ballX =
        ballRect.left +
        ballRect.width / 2 -
        rect.left;

    const ballY =
        ballRect.top +
        ballRect.height / 2 -
        rect.top;

    const targetDistance =
        Math.sqrt(
            Math.pow(ballX - targetX, 2) +
            Math.pow(ballY - targetY, 2)
        );

    /*
     * Para acertar:
     *
     * - Hay que lanzar hacia arriba.
     * - Hay que tener cierta fuerza.
     * - El lanzamiento debe dirigirse
     *   aproximadamente hacia la canasta.
     */

    const goodDirection =
        upward > Math.abs(dx) * 0.65;

    const goodPower =
        distance > 80;

    const goodAim =
        targetDistance < 180;


    /*
     * Animamos el tiro
     */

    ball.style.left =
        targetX + "px";

    ball.style.top =
        targetY + "px";

    ball.style.transform =
        "translate(-50%, -50%) scale(.45) rotate(720deg)";


    setTimeout(() => {

        if (
            goodDirection &&
            goodPower &&
            goodAim
        ) {

            basketScore++;

            document.getElementById(
                "basketScore"
            ).innerText =
                basketScore + " / 3";

            message.innerText =
                "🏀 ¡CANASTA! 🔥";

            if (basketScore >= 3) {

                setTimeout(() => {

                    message.innerText =
                        "🏆 ¡3 CANASTAS!";

                    setTimeout(() => {

                        activeDrag = null;

                        goToScreen(3);

                    }, 900);

                }, 300);

            }
            else {

                setTimeout(() => {

                    resetBall(
                        ball,
                        "basketball"
                    );

                    message.innerText =
                        "👆 ¡Perfecto! ¡A por la siguiente!";

                }, 650);
            }

        }
        else {

            message.innerText =
                "😅 ¡Has fallado! Apunta mejor y vuelve a lanzar.";

            setTimeout(() => {

                resetBall(
                    ball,
                    "basketball"
                );

                message.innerText =
                    "👆 Arrastra el balón hacia la canasta y suéltalo.";

            }, 850);
        }

    }, 500);
}


/* =========================================
   TIRO DE FÚTBOL
========================================= */

function processFootballShot(
    ball,
    game,
    dx,
    dy,
    distance
) {

    const message =
        document.getElementById(
            "footballMessage"
        );

    const rect =
        game.getBoundingClientRect();

    const ballRect =
        ball.getBoundingClientRect();

    /*
     * Centro de la portería
     */

    const targetX =
        rect.width / 2;

    const targetY =
        100;

    const ballX =
        ballRect.left +
        ballRect.width / 2 -
        rect.left;

    const ballY =
        ballRect.top +
        ballRect.height / 2 -
        rect.top;

    const targetDistance =
        Math.sqrt(
            Math.pow(ballX - targetX, 2) +
            Math.pow(ballY - targetY, 2)
        );

    const upward =
        -dy;

    /*
     * El tiro debe ir hacia arriba
     */

    const goodDirection =
        upward > Math.abs(dx) * 0.45;

    const goodPower =
        distance > 70;

    const goodAim =
        targetDistance < 200;


    /*
     * Animación del balón
     */

    ball.style.left =
        targetX + "px";

    ball.style.top =
        targetY + "px";

    ball.style.transform =
        "translate(-50%, -50%) scale(.45) rotate(720deg)";


    setTimeout(() => {

        if (
            goodDirection &&
            goodPower &&
            goodAim
        ) {

            footballScore++;

            document.getElementById(
                "footballScore"
            ).innerText =
                footballScore + " / 3";

            message.innerText =
                "⚽ ¡GOOOOOOOL! 🔥";


            if (footballScore >= 3) {

                setTimeout(() => {

                    message.innerText =
                        "🏆 ¡3 GOLES!";

                    setTimeout(() => {

                        activeDrag = null;

                        goToScreen(4);

                    }, 900);

                }, 300);

            }
            else {

                setTimeout(() => {

                    resetBall(
                        ball,
                        "football"
                    );

                    message.innerText =
                        "👆 ¡Genial! ¡A por el siguiente!";

                }, 650);
            }

        }
        else {

            message.innerText =
                "😅 ¡FUERA! Apunta mejor y vuelve a chutar.";

            setTimeout(() => {

                resetBall(
                    ball,
                    "football"
                );

                message.innerText =
                    "👆 Arrastra el balón hacia la portería y suéltalo.";

            }, 850);
        }

    }, 500);
}


/* =========================================
   DEVOLVER BALÓN A SU POSICIÓN
========================================= */

function resetBall(ball, type) {

    activeDrag = null;

    ball.style.transition =
        "left .45s ease, top .45s ease, transform .45s ease";

    ball.style.left = "50%";

    ball.style.top = "auto";

    ball.style.bottom = "20px";

    ball.style.transform =
        "translateX(-50%) scale(1) rotate(0)";
}


/* =========================================
   REGALO
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
        document.getElementById(
            "confetti"
        );

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
                    Math.random() *
                    emojis.length
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


/* =========================================
   ACTIVAR LOS DOS JUEGOS
========================================= */

setupBallDrag(
    "basketBall",
    ".basket-game",
    "basketball"
);

setupBallDrag(
    "footballBall",
    ".football-game",
    "football"
);

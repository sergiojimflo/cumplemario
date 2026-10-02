/* =====================================================
   ESTADO DEL JUEGO
===================================================== */

let basketScore = 0;
let footballScore = 0;

let activeDrag = null;


/* =====================================================
   CAMBIAR DE PANTALLA
===================================================== */

function goToScreen(number) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    const nextScreen =
        document.getElementById(
            "screen" + number
        );


    nextScreen.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   CONFIGURACIÓN DEL ARRASTRE
===================================================== */

function setupBallDrag(
    ballId,
    gameId,
    type
) {

    const ball =
        document.getElementById(ballId);

    const game =
        document.getElementById(gameId);


    if (!ball || !game) {
        return;
    }


    let startX = 0;
    let startY = 0;

    let currentX = 0;
    let currentY = 0;

    let dragging = false;


    /* =================================================
       TOCAR EL BALÓN
    ================================================= */

    ball.addEventListener(
        "pointerdown",
        function(event) {

            if (activeDrag !== null) {
                return;
            }


            /*
             * Solo botón principal del ratón
             * o dedo
             */

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }


            activeDrag = type;

            dragging = true;


            ball.setPointerCapture(
                event.pointerId
            );


            const gameRect =
                game.getBoundingClientRect();


            const ballRect =
                ball.getBoundingClientRect();


            startX =
                ballRect.left +
                ballRect.width / 2 -
                gameRect.left;


            startY =
                ballRect.top +
                ballRect.height / 2 -
                gameRect.top;


            currentX = startX;
            currentY = startY;


            ball.style.transition =
                "none";


            ball.style.transform =
                "translate(-50%, -50%) scale(1.15)";


            updateAimLine(
                type,
                game,
                startX,
                startY,
                startX,
                startY
            );
        }
    );


    /* =================================================
       ARRASTRAR
    ================================================= */

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
             * Limitar el balón al campo
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


            /*
             * Mover balón con el dedo
             */

            ball.style.left =
                currentX + "px";


            ball.style.top =
                currentY + "px";


            ball.style.bottom =
                "auto";


            /*
             * Calcular fuerza
             */

            const dx =
                currentX - startX;


            const dy =
                currentY - startY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
             * Rotación del balón
             */

            const angle =
                Math.atan2(
                    dy,
                    dx
                ) *
                180 /
                Math.PI;


            const scale =
                1 +
                Math.min(
                    distance / 500,
                    .22
                );


            ball.style.transform =
                `translate(-50%, -50%)
                 rotate(${angle}deg)
                 scale(${scale})`;


            /*
             * Mostrar dirección
             */

            updateAimLine(
                type,
                game,
                startX,
                startY,
                currentX,
                currentY
            );
        }
    );


    /* =================================================
       SOLTAR BALÓN
    ================================================= */

    ball.addEventListener(
        "pointerup",
        function(event) {

            if (!dragging) {
                return;
            }


            dragging = false;


            try {

                ball.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {
                /* No pasa nada */
            }


            hideAimLine(type);


            ball.style.transition =
                "none";


            const dx =
                currentX - startX;


            const dy =
                currentY - startY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
             * Si apenas ha movido el balón,
             * lo devolvemos.
             */

            if (distance < 50) {

                resetBall(
                    ball,
                    type
                );

                return;
            }


            /*
             * LANZAMIENTO
             */

            if (type === "basketball") {

                processBasketballShot(
                    ball,
                    game,
                    startX,
                    startY,
                    dx,
                    dy,
                    distance
                );

            }
            else {

                processFootballShot(
                    ball,
                    game,
                    startX,
                    startY,
                    dx,
                    dy,
                    distance
                );

            }

        }
    );


    /* =================================================
       CANCELACIÓN
    ================================================= */

    ball.addEventListener(
        "pointercancel",
        function() {

            dragging = false;

            activeDrag = null;

            hideAimLine(type);

            resetBall(
                ball,
                type
            );
        }
    );
}


/* =====================================================
   LÍNEA DE APUNTADO
===================================================== */

function updateAimLine(
    type,
    game,
    startX,
    startY,
    currentX,
    currentY
) {

    const id =
        type === "basketball"
            ? "basketAimLine"
            : "footballAimLine";


    const line =
        document.getElementById(id);


    if (!line) {
        return;
    }


    const dx =
        currentX - startX;


    const dy =
        currentY - startY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance < 5) {
        return;
    }


    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;


    line.style.display =
        "block";


    line.style.left =
        startX + "px";


    line.style.top =
        startY + "px";


    line.style.width =
        Math.min(
            distance * 1.4,
            250
        ) + "px";


    line.style.transform =
        `rotate(${angle}deg)`;
}


/* =====================================================
   OCULTAR LÍNEA
===================================================== */

function hideAimLine(type) {

    const id =
        type === "basketball"
            ? "basketAimLine"
            : "footballAimLine";


    const line =
        document.getElementById(id);


    if (line) {

        line.style.display =
            "none";
    }
}


/* =====================================================
   TIRO DE BALONCESTO
===================================================== */

function processBasketballShot(
    ball,
    game,
    startX,
    startY,
    dx,
    dy,
    distance
) {

    const message =
        document.getElementById(
            "basketMessage"
        );


    const rect =
        game.getBoundingClientRect();


    /*
     * IMPORTANTE:
     *
     * El jugador está abajo.
     * La canasta está arriba.
     *
     * Por tanto el gesto correcto
     * tiene que ir hacia arriba.
     */

    const upward =
        -dy;


    /*
     * Comprobamos dirección.
     */

    const goodDirection =
        upward >
        Math.abs(dx) * 0.55;


    /*
     * Fuerza mínima.
     */

    const goodPower =
        distance > 75;


    /*
     * El destino es el centro del aro.
     *
     * Aproximadamente:
     *
     * X = centro
     * Y = 105
     */

    const targetX =
        rect.width / 2;


    const targetY = 105;


    /*
     * Cuánto se ha desplazado
     * horizontalmente respecto
     * al centro.
     */

    const horizontalAim =
        Math.abs(
            (startX + dx * .75)
            -
            targetX
        );


    /*
     * Zona de acierto.
     */

    const goodAim =
        horizontalAim < 90;


    /*
     * Resultado.
     *
     * El jugador tiene que:
     *
     * - tirar hacia arriba
     * - darle suficiente fuerza
     * - apuntar aproximadamente
     *   al centro de la canasta
     */

    const scored =
        goodDirection &&
        goodPower &&
        goodAim;


    /*
     * Lanzamiento parabólico.
     */

    animateBasketballShot(
        ball,
        startX,
        startY,
        targetX,
        targetY,
        scored,
        function() {

            if (scored) {

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

                            activeDrag =
                                null;


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
                    "😅 ¡Has fallado! Apunta mejor al aro.";


                setTimeout(() => {

                    resetBall(
                        ball,
                        "basketball"
                    );


                    message.innerText =
                        "👆 Arrastra el balón hacia la canasta y suéltalo.";

                }, 850);
            }

        }
    );
}


/* =====================================================
   ANIMACIÓN PARABÓLICA DEL BALÓN
===================================================== */

function animateBasketballShot(
    ball,
    startX,
    startY,
    targetX,
    targetY,
    scored,
    callback
) {

    const duration =
        scored
            ? 850
            : 700;


    const startTime =
        performance.now();


    /*
     * Para los fallos desplazamos
     * un poco el balón.
     */

    const finalX =
        scored
            ? targetX
            : targetX +
              (Math.random() > .5 ? 120 : -120);


    const finalY =
        scored
            ? targetY + 8
            : targetY + 50;


    /*
     * Altura máxima del arco.
     */

    const arcHeight =
        scored
            ? 115
            : 90;


    function animate(time) {

        const elapsed =
            time - startTime;


        let progress =
            elapsed / duration;


        progress =
            Math.min(
                progress,
                1
            );


        /*
         * Movimiento horizontal
         */

        const x =
            startX +
            (finalX - startX) *
            progress;


        /*
         * Movimiento vertical base
         */

        const linearY =
            startY +
            (finalY - startY) *
            progress;


        /*
         * Parábola:
         *
         * 4p(1-p)
         *
         * da un arco perfecto.
         */

        const arc =
            Math.sin(
                Math.PI *
                progress
            ) *
            arcHeight;


        const y =
            linearY -
            arc;


        ball.style.left =
            x + "px";


        ball.style.top =
            y + "px";


        ball.style.bottom =
            "auto";


        /*
         * Rotación del balón
         */

        const rotation =
            progress *
            720;


        ball.style.transform =
            `translate(-50%, -50%)
             rotate(${rotation}deg)
             scale(${1 - progress * .35})`;


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        }
        else {

            callback();

        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =====================================================
   TIRO DE FÚTBOL
===================================================== */

function processFootballShot(
    ball,
    game,
    startX,
    startY,
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


    const upward =
        -dy;


    const goodDirection =
        upward >
        Math.abs(dx) * 0.45;


    const goodPower =
        distance > 70;


    /*
     * Centro de la portería.
     */

    const targetX =
        rect.width / 2;


    const targetY =
        100;


    /*
     * Comprobamos que apunta
     * razonablemente hacia la portería.
     */

    const horizontalAim =
        Math.abs(
            (startX + dx * .75)
            -
            targetX
        );


    const goodAim =
        horizontalAim < 115;


    const scored =
        goodDirection &&
        goodPower &&
        goodAim;


    /*
     * Animación del chut.
     */

    animateFootballShot(
        ball,
        startX,
        startY,
        targetX,
        targetY,
        scored,
        function() {

            if (scored) {

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

                            activeDrag =
                                null;


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
                    "😅 ¡FUERA! ¡Apunta mejor!";


                setTimeout(() => {

                    resetBall(
                        ball,
                        "football"
                    );


                    message.innerText =
                        "👆 Arrastra el balón hacia la portería y suéltalo.";

                }, 850);
            }

        }
    );
}


/* =====================================================
   ANIMACIÓN FÚTBOL
===================================================== */

function animateFootballShot(
    ball,
    startX,
    startY,
    targetX,
    targetY,
    scored,
    callback
) {

    const duration =
        scored
            ? 600
            : 500;


    const startTime =
        performance.now();


    const finalX =
        scored
            ? targetX
            : targetX +
              (Math.random() > .5 ? 150 : -150);


    const finalY =
        scored
            ? targetY + 35
            : targetY + 40;


    function animate(time) {

        const elapsed =
            time - startTime;


        let progress =
            elapsed / duration;


        progress =
            Math.min(
                progress,
                1
            );


        const x =
            startX +
            (finalX - startX) *
            progress;


        const linearY =
            startY +
            (finalY - startY) *
            progress;


        const arc =
            Math.sin(
                Math.PI *
                progress
            ) *
            55;


        const y =
            linearY -
            arc;


        ball.style.left =
            x + "px";


        ball.style.top =
            y + "px";


        ball.style.bottom =
            "auto";


        const rotation =
            progress *
            720;


        ball.style.transform =
            `translate(-50%, -50%)
             rotate(${rotation}deg)
             scale(${1 - progress * .3})`;


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        }
        else {

            callback();

        }
    }


    requestAnimationFrame(
        animate
    );
}


/* =====================================================
   DEVOLVER BALÓN
===================================================== */

function resetBall(
    ball,
    type
) {

    activeDrag = null;


    ball.style.transition =
        "left .45s ease, top .45s ease, transform .45s ease";


    ball.style.left =
        "50%";


    ball.style.top =
        "auto";


    ball.style.bottom =
        "18px";


    ball.style.transform =
        "translateX(-50%) scale(1) rotate(0)";
}


/* =====================================================
   ABRIR REGALO
===================================================== */

function openGift() {

    const gift =
        document.getElementById(
            "gift"
        );


    gift.style.transform =
        "scale(1.4) rotate(8deg)";


    gift.style.transition =
        "all .5s ease";


    setTimeout(() => {

        createConfetti();

        goToScreen(6);

    }, 700);
}


/* =====================================================
   CONFETI
===================================================== */

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


    for (
        let i = 0;
        i < 55;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


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
            Math.random() *
            100 +
            "%";


        piece.style.fontSize =
            (
                18 +
                Math.random() *
                25
            ) +
            "px";


        piece.style.animationDuration =
            (
                2 +
                Math.random() *
                3
            ) +
            "s";


        piece.style.animationDelay =
            Math.random() *
            1.5 +
            "s";


        container.appendChild(
            piece
        );


        setTimeout(() => {

            piece.remove();

        }, 6000);
    }
}


/* =====================================================
   ACTIVAR LOS DOS JUEGOS
===================================================== */

setupBallDrag(
    "basketBall",
    "basketGame",
    "basketball"
);


setupBallDrag(
    "footballBall",
    "footballGame",
    "football"
);

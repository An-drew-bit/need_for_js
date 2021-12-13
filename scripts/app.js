'use strict';

window.addEventListener('DOMContentLoaded', () => {

    const score = document.querySelector('.score'),
        start = document.querySelector('.start'),
        gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div');

    car.classList.add('car');

    let topScore = localStorage.getItem('topScore');

    start.addEventListener('click', startGame);
    document.addEventListener('keydown', startRun);
    document.addEventListener('keyup', stopRun);

    const audio = new Audio('../audio/audio.mp3');
    const crash = new Audio('../audio/crash.mp3');

    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false
    };

    const settings = {
        start: false,
        score: 0,
        speed: 5,
        traffic: 3,
        levelUp: 0
    };

    const getQuantityElements = heightElement => {
        return Math.ceil(gameArea.offsetHeight / heightElement);
    }

    function startGame(event) {

        if (event.target.classList.contains('start')) {
            return;
        }
        if (event.target.classList.contains('easy')) {
            settings.speed = 3;
            settings.traffic = 3;
        }
        if (event.target.classList.contains('medium')) {
            settings.speed = 6;
            settings.traffic = 2;
        }
        if (event.target.classList.contains('hard')) {
            settings.speed = 9;
            settings.traffic = 2;
        }

        start.classList.add('hide');
        gameArea.innerHTML = '';
    
        car.style.top = 'auto';
        car.style.left = '375px';
        car.style.bottom = '10px';

        for (let i = 0; i < getQuantityElements(100); i++) {
            const line = document.createElement('div');
            line.classList.add('line');
            line.style.top = (i * 100) + 'px';
            line.y = i * 100;

            gameArea.append(line);
        }

        for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
            const enemy = document.createElement('div');
            let enemyImg = Math.floor(Math.random() * 4) + 1;

            enemy.classList.add('enemy');
            enemy.style.top = enemy.y + 'px';
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            enemy.y = -100 * settings.traffic * (i + 1);
            enemy.style.background = `transparent url(../image/enemy${enemyImg}.png) center / cover no-repeat`;

            gameArea.append(enemy);
        }

        audio.play();
        crash.pause();

        settings.score = 0;
        settings.start = true;
        gameArea.append(car);
        settings.x = car.offsetLeft;
        settings.y = car.offsetTop;

        requestAnimationFrame(playGame);
    }

    const playGame = () => {

        if (settings.score > 5000 && settings.levelUp === 0) {
            settings.speed++;
            settings.levelUp++;
        } else if (settings.score > 15000 && settings.levelUp === 1) {
            settings.speed++;
            settings.levelUp++;
        } else if (settings.score > 35000 && settings.levelUp === 2) {
            settings.speed++;
            settings.levelUp++;
        }

        settings.score += settings.speed;
        score.innerHTML = 'SCORE<br>' + settings.score;

        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            settings.x += settings.speed;
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';

        if (settings.start) {
            requestAnimationFrame(playGame);
        } 
    }

    function startRun(event) {
        event.preventDefault();

        if (event.key in keys) {
            keys[event.key] = true;
        } 
    }   

    function stopRun(event) {
        event.preventDefault();

        if (event.key in keys) {
            keys[event.key] = false;
        }
    }

    function moveRoad() {
        let lines = document.querySelectorAll('.line');

        lines.forEach((line) => {
            line.y += settings.speed;
            line.style.top = line.y + 'px';

            if (line.y >= document.documentElement.clientHeight) {
                line.y = -36;
            }
        });
    }

    function moveEnemy() {
        let enemy = document.querySelectorAll('.enemy');

        enemy.forEach((item) => {
            let carRect = car.getBoundingClientRect();
            let enemyRect = item.getBoundingClientRect();

            if (carRect.top <= enemyRect.bottom &&
                carRect.right >= enemyRect.left && 
                carRect.left <= enemyRect.right &&
                carRect.bottom >= enemyRect.top) {

                    settings.start = false;
                    start.classList.remove('hide');
                    audio.pause();
                    crash.play();

                    if (topScore < settings.score) {
                        localStorage.setItem('topScore', settings.score);
                    }
            }

            item.y += settings.speed / 2;
            item.style.top = item.y + 'px';

            if (item.y >= document.documentElement.clientHeight) {
                item.y = -140 * settings.traffic;
                item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            }
        });
    }
});
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

let bullets = [];
let enemies = [];
let score = 0;
const enemySpawnRate = 2000; // milliseconds
let lastEnemySpawn = Date.now();

// Handle player movement
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'cyan';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Handle shooting
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 7
    });
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;

        // Remove bullets off-screen
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        } else {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });
}

// Create enemies
function createEnemy() {
    const size = Math.random() * 40 + 20;
    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: 0 - size,
        width: size,
        height: size,
        speed: Math.random() * 3 + 1
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;

        // Remove enemies off-screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        } else {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

// Check for bullet-enemy collisions
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Remove bullet and enemy
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score++;
                document.getElementById('scoreboard').textContent = 'Score: ' + score;
            }
        });
    });
}

// Update game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();

    // Spawn enemies
    if (Date.now() - lastEnemySpawn > enemySpawnRate) {
        createEnemy();
        lastEnemySpawn = Date.now();
    }

    requestAnimationFrame(update);
}

// Event listeners for movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    } else if (e.key === ' ') {
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (
        e.key === 'ArrowRight' || e.key === 'd' ||
        e.key === 'ArrowLeft' || e.key === 'a'
    ) {
        player.dx = 0;
    } else if (
        e.key === 'ArrowUp' || e.key === 'w' ||
        e.key === 'ArrowDown' || e.key === 's'
    ) {
        player.dy = 0;
    }
});

// Start the game
update();

const knightA = document.getElementById('knight-a');
const knightB = document.getElementById('knight-b');
const healthBarA = document.getElementById('health-bar-a');
const healthBarB = document.getElementById('health-bar-b');
const ground = document.getElementById('ground');

let healthA = 100;
let healthB = 100;

const moveSpeed = 10;
const jumpHeight = 200;
const jumpSpeed = 3;
const fallSpeed = 3;
const attackRange = 75;
const attackDamage = 10;

function moveKnight(knight, dx, dy) {
  const rect = knight.getBoundingClientRect();
  knight.style.left = `${rect.left + dx}px`;
  knight.style.top = `${rect.top + dy}px`;
}

function isOnGround(knight) {
  const groundPosition = knight.parentElement.offsetHeight - ground.offsetHeight - knight.offsetHeight;
  return knight.offsetTop === groundPosition;
}

function jumpKnight(knight) {
  if (!isOnGround(knight)) {
    return;
  }

  const startPosition = knight.offsetTop;
  const jumpEndPosition = startPosition - jumpHeight;

  function jump() {
    if (knight.offsetTop > jumpEndPosition) {
      knight.style.top = `${knight.offsetTop - jumpSpeed}px`;
      requestAnimationFrame(jump);
    } else {
      fall();
    }
  }

  function fall() {
    if (knight.offsetTop < startPosition) {
      knight.style.top = `${knight.offsetTop + fallSpeed}px`;
      requestAnimationFrame(fall);
    }
  }

  jump();
}

function isInRange(knight1, knight2) {
  const rect1 = knight1.getBoundingClientRect();
  const rect2 = knight2.getBoundingClientRect();

  const distance = Math.sqrt(
    Math.pow(rect1.left - rect2.left, 2) + Math.pow(rect1.top - rect2.top, 2)
  );

  return distance <= attackRange;
}

function attack(knight, target, healthBar, health) {
  if (isInRange(knight, target)) {
    health -= attackDamage;
    if (health < 0) health = 0;
    healthBar.style.width = `${health}%`;
  }
  return health;
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'w':
      jumpKnight(knightA);
      break;
    case 'a':
      moveKnight(knightA, -moveSpeed, 0);
      break;
    case 'd':
      moveKnight(knightA, moveSpeed, 0);
      break;
    case 'f':
      healthB = attack(knightA, knightB, healthBarB, healthB);
      checkWin();
      break;
    case 'ArrowUp':
      jumpKnight(knightB);
      break;
    case 'ArrowLeft':
      moveKnight(knightB, -moveSpeed, 0);
      break;
    case 'ArrowRight':
      moveKnight(knightB, moveSpeed, 0);
      break;
    case '/':
      healthA = attack(knightB, knightA, healthBarA, healthA);
      checkWin();
      break;
  }
});

function checkWin() {
  if (healthA <= 0) {
    alert('Knight B wins!');
    location.reload();
  } else if (healthB <= 0) {
    alert('Knight A wins!');
    location.reload();
  }
}
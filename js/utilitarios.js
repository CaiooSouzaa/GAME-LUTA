//let lastKey

function colisaoRetangulo({ retangulo1, retangulo2 }) {
    return (
        retangulo1.attackBox.position.x + retangulo1.attackBox.with >=
        retangulo2.position.x &&
        retangulo1.attackBox.position.x <=
        retangulo2.position.x + retangulo2.width &&
        retangulo1.attackBox.position.y + retangulo1.attackBox.height >=
        retangulo2.position.y &&
        retangulo1.attackBox.position.y <= retangulo2.position.y + retangulo2.height
    )
}

function determinarGanhador({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId

function tempoDecrescente() {
    if (timer > 0) {
        timerId = setTimeout(tempoDecrescente, 1000)
        timer--
        document.querySelector('#tempo').innerHTML = timer
    }

    if (timer === 0) {
        determinarGanhador({ player, enemy, timerId })
    }
}
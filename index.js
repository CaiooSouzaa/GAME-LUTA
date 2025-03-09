const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

contexto.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imagemSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 130
    },
    imagemSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6

})

const player = new Luta({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imagemSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imagemSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imagemSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imagemSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imagemSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imagemSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imagemSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imagemSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 140,
        height: 50
    }
})



const enemy = new Luta({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imagemSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imagemSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imagemSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imagemSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imagemSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imagemSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imagemSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imagemSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


tempoDecrescente()

function animate() {
    window.requestAnimationFrame(animate)
    contexto.fillStyle = 'black'
    contexto.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    contexto.fillStyle = 'rgba(255,255,255, 0.15)'
    contexto.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //movimentação do jogador1

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprites('run')
    } else {
        player.switchSprites('idle')
    }

    //pular do jogador1
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall')
    }

    //movimentação do jogador2
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

    //pular do jogador2
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall')
    }

    //detector de colisões player1 atacando player 2 (inimigo)
    if (
        colisaoRetangulo({
            retangulo1: player,
            retangulo2: enemy
        }) &&
        player.isAttacking && player.frameCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        document.querySelector('#nivelInimigo').style.width = enemy.health + '%'
        console.log('player atacando')
    }

    //se o player misses
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    //detector de colisões player2 (inimigo) atacando player 1
    if (
        colisaoRetangulo({
            retangulo1: enemy,
            retangulo2: player
        }) &&
        enemy.isAttacking && enemy.frameCurrent === 2
    ) {
        enemy.isAttacking = false
        player.takeHit()
        document.querySelector('#nivelPlayer').style.width = player.health + '%'
        console.log('Inimigo atacando')
    }

    //se o player misses
    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }

    //Fim de jogo baseado no nivel do adversario
    if (enemy.health <= 0 || player.health <= 0) {
        determinarGanhador({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

        //movimentação player1
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -10
                break
            case ' ':
                player.attack()
                break


        }
    }

    if (!enemy.dead) {

        //movimentação player2
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -10
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    console.log(event.key)
})
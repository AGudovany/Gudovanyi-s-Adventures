import kaboom from "kaboom"

// initialize context
kaboom({
	fullscreen: true,
	global: true,
	scale: 1,
	debug: true,
	background: [128, 128, 128]
})

const moveSpeed = 120;
const jumpForce = 500;

// load assets
loadRoot("sprites/")
loadSprite("coin", "coin.png")
loadSprite("evil-shroom", "evil-shroom.png")
loadSprite("brick", "brick.png")
loadSprite("block", "block.png")
loadSprite("mario", "mario.png")
loadSprite("mushroom", "mushroom.png")
loadSprite("surprise", "surprised.png")
loadSprite("unboxed", "unboxed.png")
loadSprite("pipe-top-left", "pipe-top-left.png")
loadSprite("pipe-top-right", "pipe-top-right.png")
loadSprite("pipe-bottom-left", "pipe-bottom-left.png")
loadSprite("pipe-bottom-right", "pipe-bottom-right.png")
loadSprite("airplane", "airplane.png")
loadSprite("ukrFlag", "ukraine-flag.png")
loadSprite("Danya", "Danya.jpeg")
loadSprite("bg", "bg.png")

scene("game", () => {
	layers(['bg', 'game', 'ui'], 'game');

  add([
    sprite("bg", {width: width(), height: height()})
  ]);

	const map = [
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=                                                          =',
		'=           ==                                             =',
		'=               ~                                          =',
		'=      |                                 $$                =',
		'============================================================'
	];

	const levelConfig = {
		width: 20,
		height: 20,
		'=': () => [sprite('block'), area(), solid()],
		'~': () => [sprite('airplane'), area(), solid(), scale(0.3), pos(0, -80)],
		'$': () => [sprite('coin')],
		'%': () => [sprite('surprise'), area(), solid(), 'coin-surprise'],
		'*': () => [sprite('surprise'), area(), solid(), 'mushroom-surprise'],
		'-': () => [sprite('unboxed')],
		'(': () => [sprite('pipe-top-left'), scale(0.5), area(), solid()],
		')': () => [sprite('pipe-top-right'), scale(0.5), area(), solid()],
		'{': () => [sprite('pipe-bottom-left'), scale(0.5), area(), solid()],
		'}': () => [sprite('pipe-bottom-right'), scale(0.5), area(), solid()],
		'^': () => [sprite('evil-shroom')],
		'#': () => [sprite('mashroom')],
		'|': () => [sprite('ukrFlag'), scale(0.2), pos(0, -70)],
	};
	const level = addLevel(map, levelConfig);

	const player = add([
		sprite('Danya'), solid(), area(), scale(0.2),
		pos(60, 0),
		body(),
		origin('bot')
	]);

	keyDown('left', () => {
		player.move(-moveSpeed, 0)
	})

	keyDown('right', () => {
		player.move(moveSpeed, 0)
	})

	keyDown('space', () => {
		if (player.isGrounded()) {
			player.jump(jumpForce);
		}
	})
})

go("game");

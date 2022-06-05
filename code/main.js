import kaboom from "kaboom"

// initialize context
kaboom({
	fullscreen: true,
	global: true,
	scale: 1,
	debug: true,
	background: [0, 0, 0, 1]
})

// load assets
loadRoot("sprites/")
loadSprite("coin", "coin.png")
loadSprite("evil-shroom", "evil-shroom.png")
loadSprite("brick", "brick.png")
loadSprite("block", "block.png")
loadSprite("mario", "mario.png")
loadSprite("mushroom", "mushroom.png")
loadSprite("surprised", "surprised.png")
loadSprite("unboxed", "unboxed.png")
loadSprite("pipe-top-left", "pipe-top-left.png")
loadSprite("pipe-top-right", "pipe-top-right.png")
loadSprite("pipe-bottom-left", "pipe-bottom-left.png")
loadSprite("pipe-bottom-right", "pipe-bottom-right.png")

//layers(['bg', 'game', 'ui'], 'game');

const map = [
	'                                                                    ',
	'                                                                    ',
	'                                                                    ',
	'                                                                    ',
	'                                                                    ',
	'                                                                    ',
	'                                                                    ',
	'=====================================================   ============'
];

const levelConfig = {
	width: 20,
	height: 20,
	'=': () => {[sprite('block'), area(),  solid()]},
};
const level = addLevel(map, levelConfig);

import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("score", "sounds/score.mp3");

loadRoot("sprites/");
loadSprite("birdy", "birdy.png");
loadSprite("bg", "bg.png");
loadSprite("pipe", "pipe.png");
loadSprite("brick", "brick.png");
loadSprite("coin", "coin.png");
loadSprite("Danya", "Danya.jpeg");
loadSprite("Vanya", "Vanya.JPG");
loadSprite("skeleton", "skeleton.png");
loadSprite("train", "train.png");
loadSprite("boom", "boom.png");
loadSprite("airplane", "airplane.png");

let highScore = 0;

scene("game", (choosenPlayer) => {
  let trainExists = false;
  let score = 0;

  add([
    sprite("bg", {width: width(), height: height()})
  ]);

  const scoreText = add([
    text(score, {size: 50})
  ]);

  // add a game object to screen
  let player = choosenPlayer == 1 ?
      add([
    // list of components
    sprite("Danya"),
    "player",
    scale(0.2),
    pos(80, 40),
    area(),
    body(),
  ]) : add([
    // list of components
    sprite("Vanya", {flipX: true}),
    "player",
    scale(0.4),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes(){
    const offset = rand(40, 150);

    add([
      sprite("pipe"),
      pos(width()-20, height() - offset),
      "pipe",
      "move",
      area(),
      {passed: false},
      cleanup()
    ]);
  }

  function produceCoins(){
    const offset = rand(40, 600);

    add([
      sprite("coin"),
      pos(width()-20, height() - offset),
      "coin",
      "move",
      "score",
      area(),
      {passed: false},
      cleanup()
    ]);
  }

  function produceSkeleton(){
    add([
      sprite("skeleton", {flipX: true}),
      pos(width()-20, height()-90),
      "skeleton",
      "move",
      area(),
        scale(0.28),
      {passed: false},
    ]);
  }

  function produceTrain(){
    if (!trainExists) {
      trainExists = true;
      if (choosenPlayer == 1) {
        add([
          sprite("train"),
          pos(width() - 20, height() - 430),
          "train",
          "move",
          area(),
          scale(1),
        ]);
      } else {
        add([
          sprite("airplane", {flipX: true}),
          pos(width() - 20, height() - 430),
          "train",
          "move",
          area(),
        ]);
      }
    }
  }

  loop(1.5, () => {
    let funcNumber = randi(1, 4);
    if (score >= 10) {
      funcNumber = 4;
    }
    switch (funcNumber) {
      case 1:
        produceCoins();
        break;
      case 2:
        producePipes();
        break;
      case 3:
        produceSkeleton();
        break;
      case 4:
        produceTrain();
        break;
    }
  });

for (let i = 0; i <= width(); i= i+20) {
  add([
      sprite("brick"),
      pos(i, height()-20),
      "brick",
      area(),
    solid()
    ]);
  add([
    sprite("brick"),
    pos(i, 0),
    "brick",
    area(),
    solid()
  ]);
}

onCollide("player", "score", (player, coin) => {
  score += 10;
  scoreText.text = score
  play("score");
  coin.destroy();
});

onCollide("player", "skeleton", (player, skeleton) => {
  let boom = add([
    sprite("boom"),
    pos(150, height()-120),
    area(),
      scale(0.08),
  ]);
  skeleton.destroy();
  wait(0.5, () => {boom.destroy()})
});

onCollide("player", "train", (player, train) => {
  player.destroy()
  train.destroy()
  if (choosenPlayer == 1){
  add([
    sprite("train", {flipX: true}),
    "endGame",
    pos(-800, height() - 430),
    area(),
    scale(1),
  ]);}
  else {
    add([
      sprite("airplane"),
      pos(-800, height() - 430),
      "endGame",
      area(),
    ]);
  }
  wait(1, () => {
    action("endGame", (item) => {
      if (item.pos.x >= width()) {
        go("gameover", score);
      }
      if (choosenPlayer == 1) {
        item.move(160, 0);
      } else {
        item.move(800, -400)
      }
      //player.move(160, 0);
    });
  })
});

  action("move", (item) => {
    item.move(-160, 0);
    if (item.pos.x >= width()) {
        go("gameover", score);
    }
  });

  /*player.collides("pipe", () => {
    go("gameover", score);
  });*/

  player.action(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  keyPress("space", () => {
    play("wooosh");
    player.jump(600);
  });
});

scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    text(
      "gameover!\n"
      + "score: " + score
      + "\nhigh score: " + highScore,
      {size: 45}
    )
  ]);

  keyPress("space", () => {
    go("intro");
  });
});

scene("intro", (score) => {
  add([
    text(
        "Choose Hero!\n"
        + "Press '1' for Danya"
        + "\nPress '2' for Vanya"
    )
  ]);

  keyPress("1", () => {
    go("game", 1);
  });
  keyPress("2", () => {
    go("game", 2);
  });
});

go("intro");

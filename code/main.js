import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("score", "sounds/score.mp3");
loadSound("train-depart", "sounds/train-depart.mp3");
loadSound("airplane-fly-over", "sounds/airplane-fly-over.mp3");
loadSound("explosion", "sounds/explosion.mp3");
loadSound("laugh", "sounds/laugh.mp3");
loadSound("hit", "sounds/hit.mp3");

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
loadSprite("booba-runs", "booba-runs.png")
loadSprite("booba-play", "booba-play.png")
loadSprite("fuse", "fuse.png")
loadSprite("fuse-smashing", "fuse-smashing.png")

let highScore = 0;

scene("game", (choosenPlayer) => {
  let trainExists = false;
  let score = 0;

  add([
    sprite("bg", {width: width(), height: height()})
  ]);

  const scoreText = add([
    text(score, {size: 50}),
      pos(0, 20)
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
    const offset = rand(100, 600);

    add([
      sprite("coin"),
      pos(width()-20, height() - offset),
      "coin",
      "move",
      "score",
      area(),
      scale(0.05),
      {passed: false},
      cleanup()
    ]);
  }

  function produceSkeleton(){
    const offset = rand(130, 600);
    add([
      sprite("skeleton", {flipX: true}),
      pos(width()-20, height()-  offset),
      "skeleton",
      "move",
      area(),
        scale(0.4),
      {passed: false},
    ]);
  }

  function produceBooba(){
    const offset = rand(150, 600);
    if (choosenPlayer == 1) {
      add([
        sprite("booba-play"),
        pos(width() - 20, height() - offset),
        "booba",
        "move",
        area(),
        scale(0.3),
        {passed: false},
      ]);
    } else {
      add([
        sprite("fuse", {flipX: true}),
        pos(width() - 20, height() - offset),
        "booba",
        "move",
        area(),
        scale(0.15),
        {passed: false},
      ]);
    }
  }

  function produceTrain(){
    if (!trainExists) {
      trainExists = true;
      if (choosenPlayer == 1) {
        play("train-depart");
        add([
          sprite("train"),
          pos(width() - 20, height() - 430),
          "train",
          "move",
          area(),
          scale(1),
        ]);
      } else {
        play("airplane-fly-over");
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
    let funcNumber = randi(1, 5);
    if (score >= 200) {
      funcNumber = 5;
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
        produceBooba();
        break;
      case 5:
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
    pos(skeleton.pos.x, skeleton.pos.y),
    area(),
      scale(0.08),
  ]);
  play("explosion");
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

onCollide("player", "booba", (player, booba) => {
  booba.destroy()
  if (choosenPlayer == 1) {
    play("laugh");
    add([
      sprite("booba-runs"),
      "booba-runs",
      pos(booba.pos.x, booba.pos.y),
      area(),
      scale(0.4),
    ]);
    action("booba-runs", (item) => {
      item.move(200, 0);
    });
  } else {
    let x = rand(200, width()-200);
    let y = rand(height()-150, height()-600);
    play("hit");
    const smash = add([
      sprite("fuse-smashing"),
      area(),
      pos(x, y),
      scale(0.5),
    ]);
    const boom = add([
      sprite("boom"),
      area(),
      pos(x, y),
      scale(0.08),
    ]);
    wait(0.8, () => {
      x = rand(200, width()-50);
      play("hit");
      smash.pos.x = x;
      boom.pos.x = x+150;
      smash.flipX(true);
      boom.flipX(true);
      wait(0.8, () => {
        smash.destroy();
        boom.destroy();
      })
    });
  }
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

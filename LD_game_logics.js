var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('bug', 'assets/sprites/bugs2.png',48,48);
    game.load.image('food', 'assets/sprites/food.png');
}

var bug;
var bugs;
var player;
var platforms;
var cursors;

var foods;
var score = 0;
var scoreText;
var nfoods = 20
var nbugs = 5

var Afood = []
var bug_speed = 100


function create() {


    foods = game.add.group();
    bugs = game.add.group();

    foods.enableBody = true;
    bugs.enableBody = true;
    //bugs.onInputOver.add(over, this);



    game.physics.enable(bugs, Phaser.Physics.ARCADE);

    const r = 5;
    const w = game.world.width / r;
    const h = game.world.height / r ;

    rectangle = new Phaser.Rectangle(1, 1, w-1, h-1);
    p = new Phaser.Point()


    create_food(nfoods) 
    create_bugs(nbugs)
    bugs.forEach(function(bug) { Bug_cible(bug) } );
    //var f = foods.iterate('i',2 , Phaser.Group.RETURN_CHILD)
    //console.log(f.i)
    //for (var i = 0; i < nfood; i++) { Bug_cible(bugs.getAt(i)) }
    game.input.onDown.add(bug_kill, this)
    //var s =  Phaser.ArrayUtils.getRandomItem(foods)
}



function create_food (nfood) {   
    for (var i = 0; i < nfood; i++) {
        rectangle.random(p);
        p.floor();
        var food = foods.create(p.x * 5, p.y * 5,'food');
        food.n = i 
    }
    //console.log(Afood)
}

function bug_kill (){
    for (var i = 0; i < nbugs; i++) {
        bug = bugs.getAt(i)
        if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y))
        {
            nbugs--
            bug.destroy();
            if (nfoods >0){

            }
        }
    }
}


function create_bugs(nbugs) {
    for (var i = 0; i < nbugs; i++) {
        rectangle.random(p);
        p.floor();
        var bug = bugs.create(p.x * 5, p.y * 5,'bug');
        var run = bug.animations.add('run');
        bug.anchor.setTo(0.5, 0.5);
        bug.animations.play('run', 5, true)
        var text = game.add.text(0, 0, "0", {font: "16px Arial", fill: "#f2e90a"});
        bug.addChild(text);
        //bug.bulletAngleOffset = -90
    }
}





function Bug_cible(bug) { 
    if (nfoods>0) { 
    var n = Math.floor( Math.random() * nfoods);
    bug.cible =  foods.getAt(n).n;
    //console.log(n)
    }   
}

function collectFood (bug0, food) {

    var cible = food.n
    food.destroy();
    nfoods--
    bug0.health++
    //Afood.splice(i, 1);
    //for (var i = 0;  i < nbugs; i++){        bug = bugs.getAt(i);        if (bug.cible = cible ){Bug_cible(bug)}    }
    bugs.forEach(function(bug) {          if (bug.cible == cible) {            
        Bug_cible(bug)   
              } } );
    Log()
    //  Add and update the score
    //score += 10;
    //scoreText.text = 'Score: ' + score;
}

function Log (){
    a = []
    b = []
    for (var i = 0; i < nbugs; i++){ a.push(bugs.getAt(i).cible)}
    for (var i = 0; i < nfoods; i++){ b.push(foods.getAt(i).n)}
    //console.log(Afood, Afood.length)
    console.log(a, nfoods, nbugs)
    console.log(b)
}


function update() {
    for (var i = 0;  i < nbugs; i++) {
        //console.log(bugs.getAt(i).cible)
        //game.physics.arcade.moveToObject(bugs.getAt(i), foods.iterate('i',bugs.getAt(i).cible , Phaser.Group.RETURN_CHILD),400);
        if (nfoods > 0){
            bug  = bugs.getAt(i);
            speed = bug_speed *( 1 +bug.health * 40)
            
            food = foods.iterate('n',bug.cible , Phaser.Group.RETURN_CHILD)
            if (food != Math.null) {
                bug.rotation = game.physics.arcade.angleBetween(bug, food)+ Math.PI/2 ;
                game.physics.arcade.moveToObject(bug, food ,bug_speed);
                game.physics.arcade.overlap(bug, food , collectFood, null, this);
            }
            else {
                //Bug_cible(bug);
            }
            bug.scale.setTo(0.5+bug.health/10, 0.5+ bug.health/10)
            //bug.text.rotation = 0
        }
        else {
            game.paused = true;
        }



        //game.physics.arcade.overlap(bugs.getAt(i), foods.getAt(bugs.getAt(i).cible), collectFood, null, this);
    }
    //game.physics.arcade.overlap(bugs, foods, collectFood, null, this);
        
        //if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y))
}
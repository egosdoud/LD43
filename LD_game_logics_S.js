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
var nfoods = 10
var nbugs = 2

var Afood = []





function create() {


    foods = game.add.group();
    bugs = game.add.group();

    foods.enableBody = true;
    bugs.enableBody = true;

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
    //game.input.onDown.add(Bug_cible, this)
    //var s =  Phaser.ArrayUtils.getRandomItem(foods)
}


function Bug_cible(bug) { 
    var n = Math.floor( Math.random() * nfoods);
    bug.cible =  foods.getAt(n).n
}


function create_food (nfood) {   
    for (var i = 0; i < nfood; i++) {
        rectangle.random(p);
        p.floor();
        var food = foods.create(p.x * 5, p.y * 5,'food');
        food.n = i 
    }
    console.log(Afood)
}

function create_bugs(nbugs) {
    for (var i = 0; i < nbugs; i++) {
        rectangle.random(p);
        p.floor();
        var bug = bugs.create(p.x * 5, p.y * 5,'bug');
        var run = bug.animations.add('run');
        bug.anchor.setTo(0.5, 0.5);
        bug.animations.play('run', 5, true);
    }


}

function collectFood (bug0, food) {

    i = foods.getChildIndex(food)
    //console.log(nfoods)
    food.destroy();
    nfoods--
    //Afood.splice(i, 1);
    bugs.forEach(function(bug) {  if (bug.cible = i) {Bug_cible(bug) } } );
    Log()
    //  Add and update the score
    //score += 10;
    //scoreText.text = 'Score: ' + score;
}

function Log (){
    a = []
    for (var i = 0; i < nbugs; i++){ a.push(bugs.getAt(i).cible)}
    //console.log(Afood, Afood.length)
    console.log(a)
}


function update() {
    for (var i = 0;  i < nbugs; i++) {
        //console.log(bugs.getAt(i).cible)
        //game.physics.arcade.moveToObject(bugs.getAt(i), foods.iterate('i',bugs.getAt(i).cible , Phaser.Group.RETURN_CHILD),400);
        bug = bugs.getAt(i)
        food = foods.iterate('n',bug.cible , Phaser.Group.RETURN_CHILD)
        bug.rotation = game.physics.arcade.angleBetween(bug, foods.getAt(bug.cible)) + Math.PI/2 ;
        //console.log(game.physics.arcade.angleBetween(bug, foods.getAt(bug.cible)))
        game.physics.arcade.moveToObject(bugs.getAt(i), foods.getAt(bug.cible),100);
        game.physics.arcade.overlap(bugs.getAt(i), foods.getAt(bug.cible), collectFood, null, this);
        //game.physics.arcade.overlap(bugs.getAt(i), foods.getAt(bugs.getAt(i).cible), collectFood, null, this);
    }
    //game.physics.arcade.overlap(bugs, foods, collectFood, null, this);
        
        //if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y))
}
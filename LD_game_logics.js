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
var nfoods = 200
var nbugs = 20

var Afood = []
var bug_speed = 50
var Timer = 60
var End = false
var bmd ;
var lsprite;


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

    rectangle = new Phaser.Rectangle(5, 5, w-5, h-10);
    p = new Phaser.Point()


    create_food(nfoods) 
    create_bugs(nbugs)
    bugs.forEach(function(bug) { Bug_cible(bug) } );

    
    game.time.events.add(Phaser.Timer.SECOND * Timer, function (){});
    


    //console.log(f.i)
    //for (var i = 0; i < nfood; i++) { Bug_cible(bugs.getAt(i)) }
    game.input.onDown.add(bug_kill, this)
    text2 = "- Sacrifice the bugs, the score is the size of the biggest bug = ";
    style = { font: "20px Arial", fill: "#ff0044", align: "left" };
    t = game.add.text(0, game.world.height - 30, text2 + score, style);

    
    //var s =  Phaser.ArrayUtils.getRandomItem(foods)
}



function create_food (nfood) {   
    for (var i = 0; i < nfood; i++) {
        rectangle.random(p);
        p.floor();
        var food = foods.create(p.x * 5, p.y * 5,'food');
        food.n = i 
        var s = 0.5
        food.scale.setTo(s, s)
        food.anchor.setTo(0.5, 0.5);


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
        //var text = game.add.text(0, 0, "0", {font: "16px Arial", fill: "#f2e90a"});
        //bug.addChild(text);
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
    //game.time.events.stop()

    food.destroy();
    nfoods--
    bug0.health++
    //bug0.tint = "0xff00ff"
    //Afood.splice(i, 1);
    //for (var i = 0;  i < nbugs; i++){        bug = bugs.getAt(i);        if (bug.cible = cible ){Bug_cible(bug)}    }
    bugs.forEach(function(bug) {          if (bug.cible == cible) {            
        Bug_cible(bug)   
              } } );
    //Log()
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

function Line(bug, food) {

    if (lsprite) {
                    lsprite.destroy()
                }
    bmd = game.add.bitmapData(game.world.width,game.world.height);
    //lsprite = game.add.sprite(0, 0, bmd); 
    
    //bmd.ctx.clear();
    bmd.ctx.beginPath(); 
    bmd.ctx.lineWidth = "4"; 
    bmd.ctx.strokeStyle = 'white'; 
    bmd.ctx.setLineDash([2,3]);  
    bmd.ctx.moveTo(bug.x, bug.y);   
    bmd.ctx.lineTo(food.x , food.y);    
    bmd.ctx.stroke();  
    bmd.ctx.closePath();
    lsprite = game.add.sprite(0, 0, bmd);
}


function update() {
    var hasLine = false
    var Time = game.time.events.duration
    a = []
    if(lsprite) {
                lsprite.destroy()
            }          
        
    if (nfoods > 0 && Time > 0){
        for (var i = 0;  i < nbugs; i++) {
                
            bug  = bugs.getAt(i);
            a.push(bug.health)
            speed = bug_speed * ( 1 + bug.health * 0.1)
            
            food = foods.iterate('n',bug.cible , Phaser.Group.RETURN_CHILD)
            //food = foods.filter(food => food.n === bug.cible)

            if (food != Math.null) {
                //food.scale.setTo(0.5, 0.5)
                //lsprite.destroy()
                //bmd.clear()

                if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y))
                {
                    //food.scale.setTo(2, 2)
                    hasLine = true
                    Line(bug,food)
                }
                
                bug.rotation = game.physics.arcade.angleBetween(bug, food)+ Math.PI/2 ;
                game.physics.arcade.moveToObject(bug, food ,speed);
                game.physics.arcade.overlap(bug, food , collectFood, null, this);
            }
            else {
                Bug_cible(bug);
            }
            bug.scale.setTo(0.5+bug.health/12, 0.5+ bug.health/12)
            if (score < bug.health){ score = bug.health} 
            if(!hasLine && lsprite) {
                //lsprite.destroy()
            }          
        }
        
    }
    

    else {
        End = true
    } 

    if (End){
        t.setText(" GAME OVER     SCORE =  " + score +  "                Refresh for restart ");    
        game.paused = true;
    }
    else {
        t.setText(text2 + score +  "        TIMER  = " + (Math.floor (Time/100)) / 10);
    }
    //console.log(nfoods)
    //console.log(a)

}
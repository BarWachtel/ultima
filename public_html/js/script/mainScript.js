//Hide scrollbars
$("body").css("overflow", "hidden");

//FastClick library attached to document body now (Prevents 300ms delay on clicks)
$(function() {
    FastClick.attach(document.body);
});


var GameConstants = {
    PlayerHealth: 100,
    PlayerMana: 100,
    WalkSpeed: 3,
    UpperScreenPixelMargin: 20,
    DeltaTime_60Fps: 16.6
};

var player;

//Divides time to 60 fps, use inside main game loop
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var UA = {
    canvas: null,
    stage: null,
    WIDTH: 480,
    HEIGHT: 320,
    RATIO: null,
    currentWidth: null,
    currentHeight: null,
    scale: 1,
    offset: {top: 0, left: 0},
    entities: [],
    deltaTime: 0.0,
    resources: {
        head: null,
        body: null
    },
    init: function() {
        UA.RATIO = UA.WIDTH / UA.HEIGHT;

        UA.currentWidth = UA.WIDTH * UA.scale;
        UA.currentHeight = UA.HEIGHT * UA.scale;

        UA.canvas = document.getElementById('gameCanvas');

        UA.canvas.width = UA.WIDTH;
        UA.canvas.height = UA.HEIGHT;

        UA.stage = new createjs.Stage(UA.canvas);

        UA.userAgent = navigator.userAgent.toLowerCase();
        UA.android = UA.userAgent.indexOf('android') > -1 ? true : false;
        UA.ios = (UA.userAgent.indexOf('iphone') > -1 || UA.userAgent.indexOf('ipad') > -1) ?
                true : false;

        UA.offset.top = UA.canvas.offsetTop;
        UA.offset.left = UA.canvas.offsetLeft;

        // listen for clicks
        window.addEventListener('click', function(e) {
            e.preventDefault();
            UA.Input.set(e);
        }, false);

        // listen for touches
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // named touches; we just want
            // the first touch
            UA.Input.set(e.touches[0]);
        }, false);
        window.addEventListener('touchmove', function(e) {
            // we're not interested in this,
            // but prevent default behaviour
            // so the screen doesn't scroll
            // or zoom
            e.preventDefault();
        }, false);
        window.addEventListener('touchend', function(e) {
            // as above
            e.preventDefault();
        }, false);

        $('.control').click(controlClicked);
        //Once resources loaded startGame() is called
        UA.loadResources();
    },
    actions: [],
    confirmedActions: [],
    resize: function() {
        UA.currentHeight = window.innerHeight;
        // resize the width in proportion
        // to the new height
        UA.currentWidth = UA.currentHeight * UA.RATIO;

        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (UA.android || UA.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        UA.canvas.style.width = UA.currentWidth + 'px';
        UA.canvas.style.height = UA.currentHeight + 'px';

        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
            window.scrollTo(0, 1);
        }, 1);

        UA.scale = UA.currentWidth / UA.WIDTH;
        UA.offset.top = UA.canvas.offsetTop;
        UA.offset.left = UA.canvas.offsetLeft;

        UA.backgroundRect = new createjs.Shape();

    },
    state: {
        update: null
    }
};

UA.loop = function(timeStamp) {
    /*
     - Check if any any new actions occured
     - Calculate delta time then perform any pending actions
     - Render frame
     - Send Legal Actions 
     */


    //UA.deltaTime is used to calculate actual progress so FPS fluctuation 
    //wont affect animation flow

    if (UA.deltaTime === null) {
        UA.deltaTime = GameConstants.DeltaTime_60Fps;
        UA.prevTime = timeStamp;
    } else {
        UA.deltaTime = timeStamp - UA.prevTime;
        UA.prevTime = timeStamp;
    }
    //Testing Purposes
//        console.log('TimeStamp is ' + timeStamp);
//        console.log('UA.deltaTime is ' + UA.deltaTime);

    UA.state.update();
    UA.stage.update();

    window.requestAnimFrame(UA.loop);
};

UA.state.update = function() {
    var i;
    checkForAuthorizedActions();

    if (UA.Input.tapped) {
        //Check if requested action is legal
        //If cast spell -> check if already casting & if enough mana
        //If click to move -> check if aimed spell is loaded && not casting spell
        //If aimed spell is ready then fire in direction

        //For now I will simply relay actions to "sendToOpponent"
        //And they will immediately go into authorized actions
        moveCommand(player, UA.Input.x, UA.Input.y);

        UA.Input.tapped = false;
    }
    for (i = 0; i < UA.entities.length; i++) {
        UA.entities[i].update();
    }
};

UA.Input = {
    x: 0,
    y: 0,
    tapped: false,
    set: function(data) {
        this.x = (data.pageX - UA.offset.left) / UA.scale;
        this.y = (data.pageY - UA.offset.top) / UA.scale;
        
        console.log("X value clicked " + this.x);
        console.log("Y value clicked " + this.y);
        this.tapped = true;
    }
};

function startGame() {
    player = new Player();
    player.createPlayer(60, 180);
    UA.entities.push(player);
    UA.loop(new Date().getTime());
}

function checkForAuthorizedActions() {
    //For now just pass up all actions as authorized
}


//Only performs moves that are onscreen
function moveCommand(player, x, y) {
    if (x >= 0 && x <= UA.WIDTH &&
            y >= 0 && y <= UA.HEIGHT) {
        var charBounds = player.char.getBounds();
        player.movingToX = x - charBounds.width / 3;
        if (y <= GameConstants.UpperScreenPixelMargin) {
            player.movingToY = GameConstants.UpperScreenPixelMargin - charBounds.height / 2;
        } else {
            player.movingToY = y - charBounds.height / 2;
        }
        player.isMoving = true;
    }
}

//Click on screen when attack is loaded
function releaseAimedAttack(player) {

}

//Any other kind of click goes here
function controlClicked(clickEvent) {
    console.log("control Clicked!");
    
    player.isMoving = false;
    clickEvent.preventDefault();
    return false;
}


function performActions(playersActions) {

}
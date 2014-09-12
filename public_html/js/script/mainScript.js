//Game init should first init network, then logic and finally graphics

var gm = {
};
gm.mod = {
    network: {},
    logic: {},
    graphics: {}

};

gm.init = function() {
    gm.mod.network.init();
    gm.mod.logic.init();
    gm.mod.graphics.init();
};


//After network, logic and graphic modules are initialized
//and resources are loaded, this function is called
gm.startGame = function() {
    gm.mod.logic.player = new Player();
    gm.mod.logic.player.createPlayer(60, 180);
    gm.mod.logic.entities.push(gm.mod.logic.player);
    gm.mod.graphics.loop(new Date().getTime());
};


gm.mod.consts = {
    PlayerHealth: 100,
    PlayerMana: 100,
    WalkSpeed: 3,
    UpperScreenPixelMargin: 20,
    DeltaTime_60Fps: 16.6
};

/***********************GRAPHICS MODULE*********************************/

gm.mod.graphics = {
    canvas: null,
    stage: null,
    WIDTH: 480,
    HEIGHT: 320,
    RATIO: null,
    currentWidth: null,
    currentHeight: null,
    scale: 1,
    offset: {top: 0, left: 0},
    deltaTime: 0.0,
    resources: {
        head: null,
        body: null
    },
    init: function() {
        gm.mod.graphics.RATIO = gm.mod.graphics.WIDTH / gm.mod.graphics.HEIGHT;

        gm.mod.graphics.currentWidth = gm.mod.graphics.WIDTH * gm.mod.graphics.scale;
        gm.mod.graphics.currentHeight = gm.mod.graphics.HEIGHT * gm.mod.graphics.scale;

        gm.mod.graphics.canvas = document.getElementById('gameCanvas');

        gm.mod.graphics.canvas.width = gm.mod.graphics.WIDTH;
        gm.mod.graphics.canvas.height = gm.mod.graphics.HEIGHT;

        gm.mod.graphics.stage = new createjs.Stage(gm.mod.graphics.canvas);

        gm.mod.graphics.userAgent = navigator.userAgent.toLowerCase();
        gm.mod.graphics.android = gm.mod.graphics.userAgent.indexOf('android') > -1 ? true : false;
        gm.mod.graphics.ios = (gm.mod.graphics.userAgent.indexOf('iphone') > -1 || gm.mod.graphics.userAgent.indexOf('ipad') > -1) ?
                true : false;

        gm.mod.graphics.offset.top = gm.mod.graphics.canvas.offsetTop;
        gm.mod.graphics.offset.left = gm.mod.graphics.canvas.offsetLeft;

        //Once resources loaded startGame() is called
        gm.mod.graphics.loadResources();
    },
    resize: function() {
        gm.mod.graphics.currentHeight = window.innerHeight;
        // resize the width in proportion
        // to the new height
        gm.mod.graphics.currentWidth = gm.mod.graphics.currentHeight * gm.mod.graphics.RATIO;

        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (gm.mod.graphics.android || gm.mod.graphics.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        gm.mod.graphics.canvas.style.width = gm.mod.graphics.currentWidth + 'px';
        gm.mod.graphics.canvas.style.height = gm.mod.graphics.currentHeight + 'px';

        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
            window.scrollTo(0, 1);
        }, 1);

        gm.mod.graphics.scale = gm.mod.graphics.currentWidth / gm.mod.graphics.WIDTH;
        gm.mod.graphics.offset.top = gm.mod.graphics.canvas.offsetTop;
        gm.mod.graphics.offset.left = gm.mod.graphics.canvas.offsetLeft;
    }
};

gm.mod.graphics.loop = function(timeStamp) {
    /*
     - Check if any any new actions occured
     - Calculate delta time then perform any pending actions
     - Render frame
     - Send Legal Actions 
     */


    //UA.deltaTime is used to calculate actual progress so FPS fluctuation 
    //wont affect animation flow

    if (gm.mod.graphics.deltaTime === null) {
        gm.mod.graphics.deltaTime = gm.mod.consts.DeltaTime_60Fps;
        gm.mod.graphics.prevTime = timeStamp;
    } else {
        gm.mod.graphics.deltaTime = timeStamp - gm.mod.graphics.prevTime;
        gm.mod.graphics.prevTime = timeStamp;
    }
    //Testing Purposes
//        console.log('TimeStamp is ' + timeStamp);
//        console.log('UA.deltaTime is ' + UA.deltaTime);

    gm.mod.logic.state.update();
    gm.mod.graphics.stage.update();

    window.requestAnimFrame(gm.mod.graphics.loop);
};


/***********************LOGIC MODULE(engine)*********************************/
gm.mod.logic = {
    Input: null,
    actions: [],
    confirmedActions: [],
    entities: [],
    player: null,
    state: {},
    init: function() {
        // listen for clicks
        window.addEventListener('click', function(e) {
            e.preventDefault();
            gm.mod.logic.Input.set(e);
        }, false);

        // listen for touches
        window.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // named touches; we just want
            // the first touch
            gm.mod.logic.Input.set(e.touches[0]);
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
    }
};


gm.mod.logic.state.update = function() {
    var i;
    checkForAuthorizedActions();

    if (gm.mod.logic.Input.tapped) {
        //Check if requested action is legal
        //If cast spell -> check if already casting & if enough mana
        //If click to move -> check if aimed spell is loaded && not casting spell
        //If aimed spell is ready then fire in direction

        //For now I will simply relay actions to "sendToOpponent"
        //And they will immediately go into authorized actions
        moveCommand(gm.mod.logic.player, gm.mod.logic.Input.x, gm.mod.logic.Input.y);

        gm.mod.logic.Input.tapped = false;
    }
    for (i = 0; i < gm.mod.logic.entities.length; i++) {
        gm.mod.logic.entities[i].update();
    }
};

gm.mod.logic.Input = {
    x: 0,
    y: 0,
    tapped: false,
    set: function(data) {
        this.x = (data.pageX - gm.mod.graphics.offset.left) / gm.mod.graphics.scale;
        this.y = (data.pageY - gm.mod.graphics.offset.top) / gm.mod.graphics.scale;

        console.log("X value clicked " + this.x);
        console.log("Y value clicked " + this.y);
        this.tapped = true;
    }
};

//Any other kind of click goes here
function controlClicked(clickEvent) {
    console.log("control Clicked!");

    gm.mod.logic.player.isMoving = false;
    clickEvent.preventDefault();
    return false;
}

function checkForAuthorizedActions() {
    //For now just pass up all actions as authorized
}


//Only performs moves that are onscreen
function moveCommand(player, x, y) {
    if (x >= 0 && x <= gm.mod.graphics.WIDTH &&
            y >= 0 && y <= gm.mod.graphics.HEIGHT) {
        var charBounds = player.char.getBounds();
        player.movingToX = x - charBounds.width / 3;
        if (y <= gm.mod.consts.UpperScreenPixelMargin) {
            player.movingToY = gm.mod.consts.UpperScreenPixelMargin - charBounds.height / 2;
        } else {
            player.movingToY = y - charBounds.height / 2;
        }
        player.isMoving = true;
    }
}

//Click on screen when attack is loaded
function releaseAimedAttack(player) {

}


function performActions(playersActions) {

}

/***********************NETWORK MODULE(placeholder)*********************************/
gm.mod.network = {
    init: function() {
        console.log('network.init() called');
    },
    dummyPeer: {
        commands: [],
        //mock sending out cmds
        send: function(cmds) {
            this.commands = this.commands.concat(cmds);
        },
        rcv: function() {
            var authCmds = this.commands.slice(0);
            this.commands = [];
            return authCmds;
        }   
    },
    submitCommands: function(cmds) {
        console.log('inside gm.mod.network.submitCommands');
        this.dummyPeer.send(cmds);
    },
    recieveCommands: function() {
        console.log('inside gm.mod.network.recieveCommands');
        return this.dummyPeer.rcv();
    }
};


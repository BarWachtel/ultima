gm.mod.graphics.loadResources = function() {
    gm.mod.graphics.loadQueue = new createjs.LoadQueue(false);
    gm.mod.graphics.loadQueue.addEventListener('complete', gm.mod.graphics.resourceLoadComplete);

    gm.mod.graphics.loadQueue.loadManifest([
        {id: 'playerHead', src: 'playerHead.png'},
        {id: 'playerBody', src: 'playerBody.png'}
    ]);

};

gm.mod.graphics.resourceLoadComplete = function() {
    gm.mod.graphics.resources.head = gm.mod.graphics.loadQueue.getResult('playerHead');
    gm.mod.graphics.resources.body = gm.mod.graphics.loadQueue.getResult('playerBody');
    console.log(gm.mod.graphics.resources.head);

    startGame();
};
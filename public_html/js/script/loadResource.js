UA.loadResources = function() {
    UA.loadQueue = new createjs.LoadQueue(false);
    UA.loadQueue.addEventListener('complete', UA.resourceLoadComplete);

    UA.loadQueue.loadManifest([
        {id: 'playerHead', src: 'playerHead.png'},
        {id: 'playerBody', src: 'playerBody.png'}
    ]);

};

UA.resourceLoadComplete = function() {
    UA.resources.head = UA.loadQueue.getResult('playerHead');
    UA.resources.body = UA.loadQueue.getResult('playerBody');
    console.log(UA.resources.head);

    startGame();
};
//Class Prototype
function Player() {
    this.health = gm.mod.consts.PlayerHealth;
    this.mana = gm.mod.consts.PlayerMana;

    this.movingToX = null;
    this.movingToY = null;
    this.isMoving = false;
}
;
Player.prototype.createPlayer = function(x, y) {
    this.x = x;
    this.y = y;

    this.char = new createjs.Container();

    this.head = new createjs.Bitmap(gm.mod.graphics.resources.head);
    this.body = new createjs.Bitmap(gm.mod.graphics.resources.body);

    var headRectDimensions = this.head.getBounds();

    this.body.y = headRectDimensions.height;

    var bodyWidth = this.body.getBounds().width;
    console.log(bodyWidth);
    this.head.x = bodyWidth / 2 - headRectDimensions.width / 2;

    this.char.addChild(this.head, this.body);

    this.char.x = this.x;
    this.char.y = this.y;

    this.char.scaleX = 0.5;
    this.char.scaleY = 0.5;

    gm.mod.graphics.stage.addChild(this.char);
};

Player.prototype.update = function() {
    if (this.isMoving) {
        var charPos = this.char;

        if (charPos.x < this.movingToX) {
            charPos.x += gm.mod.consts.WalkSpeed;
        } else if (charPos.x > this.movingToX) {
            charPos.x -= gm.mod.consts.WalkSpeed;
        }

        if (charPos.y < this.movingToY) {
            charPos.y += gm.mod.consts.WalkSpeed;
        } else if (charPos.y > this.movingToY) {
            charPos.y -= gm.mod.consts.WalkSpeed;
        }

        if (Math.max(Math.abs(charPos.x - this.movingToX), Math.abs(charPos.y - this.movingToY)) <= 3) {
            this.isMoving = false;
        }
    }
};
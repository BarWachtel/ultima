//Hide scrollbars
$("body").css("overflow", "hidden");

//FastClick library attached to document body now (Prevents 300ms delay on clicks)
$(function() {
    FastClick.attach(document.body);
});

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
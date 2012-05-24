$(document).ready(function() {

    var isHuman = false;
    $("#body").on("keyup", function(event) {
        if (!isHuman) {
            isHuman = true;
            setTimeout(function() {
                $("#hm").val("yes");
            }, 1000);
        }
    });
});
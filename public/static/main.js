$(document).ready(function() {
    // Syntax highlighting
    sh_highlightDocument();

    // If human, autofill the check textfield
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
$(document).ready(function() {
    for (let i = 0; i <= 12; ++i) {
        $("#navBtn" + i).children("a").click(function() {
            toStation(i);
        });
    }
    $("#linkMain0").click(function() {
        toStation(0);
    });

});

function toStation(idx) {
    for (let i = 0; i <= 12; ++i) {
        $("#navBtn" + i).children("a").removeClass("active");
    }
    for (let i = 0; i <= 12; ++i) {
        $("#main" + i).addClass("d-none");
    }

    $("#navBtn" + idx).children("a").addClass("active");

    $("#main" + idx).removeClass("d-none");
    $("#sidebarMenu").removeClass("show");
}
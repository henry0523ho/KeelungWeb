$(function() {
    $("#hepingBtn").click(function() {
        window.localStorage.setItem("region", "heping");
        window.location.href = "station.html";
    });

    $("#zhengbinBtn").click(function() {
        window.localStorage.setItem("region", "zhengbin");
        window.location.href = "station.html";
    });
});
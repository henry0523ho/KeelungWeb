$(document).ready(function() {
    console.log("ready");
    $("#hepingBtn").click(function() {
        window.localStorage.setItem("region", "heping");
        window.location.href = "region.html";
    });

    $("#zhengbinBtn").click(function() {
        window.localStorage.setItem("region", "zhengbin");
        window.location.href = "region.html";
    });
});
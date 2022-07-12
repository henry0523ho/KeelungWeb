var jsonData = {};
var station = 0;
$.getJSON('../data.json', function(data) {
    jsonData = data[window.localStorage.getItem("region")];
});

$(document).ready(function() {
    station = 0;
    generateStationBtn();
    $(document).attr("title", jsonData.title);

    $('#websiteTitle').text(jsonData.title);
    $("#lastStation").click(function() {
        console.log("last");
        updateStation(station - 1);
    });
    $("#nextStation").click(function() {
        console.log("next");
        updateStation(station + 1);
    });
    $("#backHomePage").click(function() {
        window.location.href = "index.html";
    })
});

function generateStationBtn() {
    console.log("Generating station");
    for (let i = 0; i < jsonData.station.length; ++i) {
        let newBtn = $('<button type="button" class="btn btn-primary stationBtn"></button>').text(jsonData.station[i].name);
        newBtn.attr("id", ("stationBtn" + i));
        newBtn.click(function() {
            console.log(("click" + i));
            updateStation(i);
        });
        $('#stationDiv').append(newBtn);
    }
    updateStation(station);
}

function updateStation(idx) {
    if (idx < 0 || jsonData.station.length <= idx) return;
    clearStation();
    station = idx;
    $(("#stationBtn" + station)).addClass("btn-danger");

    updateStationName();
}

function clearStation() {
    for (let i = 0; i < jsonData.station.length; ++i) {
        $(("#stationBtn" + i)).removeClass("btn-danger");
    }
}

function updateStationName() {
    let newH2 = $('<h2></h2>').text(jsonData.station[station].name);
    $('#stationName').empty();
    $('#stationName').append(newH2);
}
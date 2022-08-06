var jsonData = {};
var station = 0;
$.getJSON('../data.json', function(data) {
    jsonData = data[window.localStorage.getItem("region")];
});

$(function() {
    init();
});

function init() {
    console.log(window.innerWidth, window.innerHeight);
    initTitle();
    initMain();
    initNav();
    $('#prevStation').click(function() {
        // updateStation(station, station - 1);
        prevStation();
    });
    $('#nextStation').click(function() {
        // updateStation(station, station + 1);
        nextStation();
    });
    $('#backHomePage').click(function() {
        window.location.href = "index.html";
    });
    $(window).resize(function() {
        updateWindow();
    });
    updateWindow();

}

function updateWindow() {
    if ($(window).width() <= 600) {
        console.log("cellphone")
        $('.stSection').css('display', 'block').css('transform', '');
    } else {}
}

function initTitle() {
    $('#websiteTitle').text(jsonData.title);
}

function initMain() {
    $('main').empty();
    for (let i = 0; i < jsonData.station.length; ++i) {
        let newSection = generateSection(i);
        newSection.hide();
        if (i == 0) newSection.show();
        $('main').append(newSection);
    }
}

function initNav() {
    $('nav').empty();
    $.each(jsonData.station, function(i, data) {
        let newStMapName = $("<div></div>")
            .addClass("clickable stMapName")
            .attr("id", ("stMapName" + i))
            .html(data.name + "<br><span style='font-size:0.5em;'>english name</span>")
            .click(function() { $.fn.toStation(i); });
        let newStMapNum = $("<div></div>")
            .addClass(i == 0 ? "clickable stMapNum stMapNumOn" : "clickable stMapNum")
            .attr("id", ("stMapNum" + i))
            .html("KL<br>" + $.fn.fixDigits(i + 1, 2))
            .click(function() { $.fn.toStation(i); });
        let newStMapPath = $("<div></div>")
            .addClass("stMapPath")
            .css("width", (i == jsonData.station.length - 1) ? "0px" : "calc(100% + 0px)");
        let newStMap = $("<div></div>")
            .addClass("stMap")
            .attr("id", ("stMap" + i))
            .css("width", "calc((100% - 55px)/" + (jsonData.station.length) + ")")
            .append(newStMapName)
            .append(newStMapNum)
            .append(newStMapPath);
        $('nav').append(newStMap);
    });
    $("<div></div>")
        .addClass("stMap")
        .attr("id", ("stMapStart"))
        .append(
            $("<div></div>")
            .addClass("stMapName")
            .html("_" + "<br><span style='font-size:0.5em;'>_</span>")
            .css("color", "transparent"))
        .append(
            $("<div></div>")
            .addClass("stMapNum stMapNumOn")
            .attr("id", "stMapNumStart")
            .html("KL")
            .css("font-size", "13px")
            .css("padding-top", "6px"))
        .append($("<div></div>")
            .addClass("stMapPath")
            .css("width", "0px")
            .css("left", "7px"))
        .insertBefore("#stMap0");
    $("<div></div>")
        .addClass("stMapNum stMapNumOn")
        .attr("id", "stMapNumEnd")
        .html("KL")
        .css("margin-left", "1vw")
        .css("font-size", "13px")
        .css("padding-top", "6px")
        .insertAfter("#stMapNum" + (jsonData.station.length - 1));

}

function generateSection(idx) {
    let newSection = $('<section></section>');
    newSection.attr("id", ("stSection" + idx));
    newSection.attr("class", "stSection");
    newSection.append(generateName(idx));
    newSection.append(generateImage(idx));
    newSection.append(generateInfo(idx));
    return newSection;
}

function generateName(idx) {
    let newName = $('<h1></h1>');
    newName.attr("id", ("stName" + idx));
    newName.attr("class", "stName");
    newName.text(jsonData.station[idx].name);
    return newName;
}

function generateImage(idx) {
    let newImg = $('<img>');
    newImg.attr("src", ("src/" + jsonData.station[idx].image));
    newImg.attr("id", ("stImage" + idx));
    newImg.attr("class", "stImage");
    return newImg;
}

function generateInfo(idx) {
    let newInfo = $('<p></p>');
    newInfo.attr("id", ("stInfo" + idx));
    newInfo.attr("class", "stInfo");
    newInfo.text(jsonData.station[idx].info);
    return newInfo;
}

$.fn.toStation = function(n) {
    $.each(jsonData.station, function(i) {
        $("#stMapNum" + i).removeClass("stMapNumOn");
        $("#stMap" + i).css("opacity", i < n ? "0.3" : "1");
    });
    $("#stMapNum" + n).addClass("stMapNumOn");
    $("#stSection" + n).show();
    $("#stSection" + station).hide();
    station = n;

};

function nextStation() {
    if (station == jsonData.station.length - 1) return;
    ++station;
    $('#stationUl').animate({ left: '+=-20vw' });
    $('.stSection').each(function() {
            $(this).removeClass("in inR out outR");
            $(this).hide();
            if ($(this).attr("id").replace("stSection", "") == station) {
                $(this).show();
                // $(this).addClass("in");
            } else if ($(this).attr("id").replace("stSection", "") == station - 1) {
                // $(this).addClass("out");
            }
        })
        // $(('#stSection' + station)).removeClass('in inR out outR').toggleClass("in");
        // $(('#stSection' + (station - 1))).removeClass('in inR out outR').toggleClass("out");

}

function prevStation() {
    if (station == 0) return;
    --station;
    $('#stationUl').animate({ left: '+=20vw' });
    $('.stSection').each(function() {
            $(this).hide();
            $(this).removeClass("in inR out outR");
            if ($(this).attr("id").replace("stSection", "") == station) {
                // $(this).addClass("outR");
                $(this).show();
            } else if ($(this).attr("id").replace("stSection", "") == station + 1) {
                // $(this).addClass("inR");
            }
        })
        // $(('#stSection' + station)).removeClass('in inR out outR').toggleClass("outR");
        // $(('#stSection' + (station + 1))).removeClass('in inR out outR').toggleClass("inR");

}
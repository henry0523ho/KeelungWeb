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
    $('#stationUl').empty().css('width', (((jsonData.station.length + 1) * 20) + 'vw'));
    for (let i = 0; i <= jsonData.station.length; ++i) {
        let newLi = $('<li></li>');
        let newH1 = $('<h1></h1>');
        newLi.attr('id', ("stBtn" + i));
        if (i == jsonData.station.length) {
            newH1.text("終點");
            newLi.attr('class', "stBtn");
        } else {
            newH1.html((i + 1) + "<br>" + jsonData.station[i].name);
            newLi.attr('class', "stBtn clickable");
        }
        newLi.append(newH1);
        newLi.click(function() {
            if (i == station + 1) {
                nextStation();
            }
        });
        $('#stationUl').append(newLi);
    }
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
var jsonData = {};
var station = 0;
$.getJSON('../data.json', function(data) {
    jsonData = data[window.localStorage.getItem("region")];
});

$(function() {
    init();

});

function init() {
    initTitle();
    initMain();
    initNav();
    updateStation(0, 0);
    $('#prevStation').click(function() {
        updateStation(station, station - 1);
    });
    $('#nextStation').click(function() {
        updateStation(station, station + 1);
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
    } else {
        updateStation(station, station);
    }
}

function initTitle() {
    $('#websiteTitle').text(jsonData.title);
}

function initMain() {
    $('main').empty();
    // $('main').css("width", ("calc(" + jsonData.station.length + "*100vw)"));
    for (let i = 0; i < jsonData.station.length; ++i) {
        $('main').append(generateSection(i));
    }
}

function initNav() {
    $('#stationUl').empty();
    for (let i = 0; i < jsonData.station.length; ++i) {
        let newLi = $('<li></li>');
        let newH1 = $('<h1></h1>').text(jsonData.station[i].name);
        newLi.attr('id', ("stBtn" + i));
        newLi.attr('class', "stBtn clickable");
        newLi.append(newH1);
        newLi.click(function() {
            updateStation(station, i);
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

function updateStation(prev, cur) {
    console.log(prev + ' ' + cur);
    if (cur < 0 || cur > jsonData.station.length - 1) return;
    station = cur;
    $('main').find('.stSection').each(function(i) {
        if (i == prev && prev < cur) {
            $(this).css("animation", "1s ease 0s 1 normal forwards running hidePrev");
        } else if (i == prev && prev > cur) {
            $(this).css("animation", "1s ease 0s 1 normal forwards running hideNext");
        } else if (i == cur && prev < cur) {
            $(this).css("animation", "1s ease 0s 1 normal forwards running showNext");
        } else if (i == cur && prev > cur) {
            $(this).css("animation", "1s ease 0s 1 normal forwards running showPrev");
        } else if (i == cur || i == prev) {
            $(this).css("animation", "").css("transform", "rotateY(0deg)");
        } else {
            $(this).css("animation", "").css("transform", "rotateY(90deg)");
        }

    });
    $('.stBtn').find('h1').each(function(i) {
        if (i == cur) {
            $(this).css("background-color", "red");
        } else {
            $(this).css("background-color", "aqua");
        }
    });
}
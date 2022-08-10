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
    $('title').text(jsonData.title);
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
    } else {}
}

function initTitle() {
    $('#websiteTitle').text(jsonData.title);
}

function initMain() {
    $('main').empty();
    for (let i = 0; i < jsonData.station.length; ++i) {
        initSection(i);
    }
}

function initNav() {
    $('nav').empty();
    $.each(jsonData.station, function(i, data) {
        let newStMapName = $("<div></div>")
            .addClass("clickable stMapName")
            .attr("id", ("stMapName" + i))
            .html(data.name)
            .click(function() { $.fn.toStation(i); });
        let newStMapNum = $("<div></div>")
            .addClass(i == 0 ? "clickable stMapNum stMapNumOn" : "clickable stMapNum")
            .attr("id", ("stMapNum" + i))
            .html($.fn.fixDigits(i + 1, 2))
            .click(function() { $.fn.toStation(i); });
        let newStMapPath = $("<div></div>")
            .addClass("stMapPath");
        let newStMap = $("<div></div>")
            .addClass("stMap")
            .attr("id", ("stMap" + i))
            .css("width", "calc((100% - 55px)/" + (jsonData.station.length) + ")")
            .append(newStMapName)
            .append(newStMapNum);
        if (i != jsonData.station.length - 1)
            newStMap.append(newStMapPath);
        $('nav').append(newStMap);
    });
    $("<div></div>")
        .addClass("stMap")
        .attr("id", "stMapStart")
        .append(
            $("<div></div>")
            .addClass("stMapNum stMapNumOn")
            .attr("id", "stMapNumSt")
            .html("起"))
        .insertBefore("#stMap0");
    $("<div></div>")
        .addClass("stMapNum stMapNumOn")
        .attr("id", "stMapNumEnd")
        .html("終")
        .insertAfter("#stMapNum" + (jsonData.station.length - 1));

}

function initSection(idx) {
    $('main').append(
        $('<section></section>')
        .attr("id", "stSection" + idx)
        .attr("class", "stSection")
        .hide()
    )
    initName(idx);
    initSlide(idx);
    if (idx == 0) {
        $("#stSection" + idx).show();
    }
}

function initSlide(idx) {
    $("#stSection" + idx).append(
        $('<div></div>')
        .attr("class", "slideWin")
        .attr("id", "slideWin" + idx)
        .append(
            $('<div></div>')
            .attr("class", "slideCon")
            .attr("id", "slideCon" + idx)
        )
        .append(
            $('<div></div>')
            .attr("class", "slideNav")
            .attr("id", "slideNav" + idx)
        ).scroll(function(e) {
            $.fn.changeSlide(idx);
        })
    );
    for (let i = 0; i < jsonData.station[idx].info.length; ++i) {
        initSlideInfo(idx, i);
        initSlideNav(idx, i);
    }
}


function initSlideInfo(stIdx, idx) {
    $("#slideCon" + stIdx).append(
        $("<div></div>")
        .attr("id", "slIf" + stIdx + "_" + idx)
        .attr("class", "slideInfo")
        .append(
            $('<div></div>')
            .attr("class", "stContent")
            .append(
                $('<div></div>')
                .attr("class", "stPhoto")
                .append(
                    $('<img>')
                    .attr("src", "src/" + jsonData.station[stIdx].info[idx].image)
                    .attr("class", "stImg")
                )
            )
            .append(
                $('<div></div>')
                .attr("class", "stText")
                .html(jsonData.station[stIdx].info[idx].text)
            )
        )
    )
}


function initSlideNav(stIdx, idx) {
    $("#slideNav" + stIdx).append(
        $('<div></div>')
        .attr("class", "slNvNum")
        .attr("id", "slNvNum" + stIdx + "_" + idx)
        .text(idx + 1)
        .css("opacity", "0.3")
    );
    if (idx == 0) {
        $("#slNvNum" + stIdx + "_" + idx).css("opacity", "1");
    }
    $("#slNvNum" + stIdx + "_" + idx).click(function() {
        $.fn.toSlide(stIdx, idx);
    });
}


function initName(idx) {
    $("#stSection" + idx).append(
        $('<h1></h1>')
        .attr("id", ("stName" + idx))
        .attr("class", "stName")
        .text(jsonData.station[idx].name)
    );
}

$.fn.changeSlide = function(stIdx) {
    let w = $("#slIf" + stIdx + "_0")[0].getBoundingClientRect().width;
    let idx = Math.round($("#slideWin" + stIdx).scrollLeft() / w);
    $(".slNvNum").each(function() {
        if ($(this).attr("id") == ("slNvNum" + stIdx + "_" + idx)) {
            $(this).css("opacity", "1");
        } else {
            $(this).css("opacity", "0.3");
        }
    });
}

$.fn.toSlide = function(stIdx, idx) {
    $("#slideWin" + stIdx)
        .scrollLeft(
            $("#slIf" + stIdx + "_" + idx)[0].getBoundingClientRect().width * idx
        );
    // $(".slNvNum").each(function() {
    //     if ($(this).attr("id") == ("slNvNum" + stIdx + "_" + idx)) {
    //         $(this).css("opacity", "1");
    //     } else {
    //         $(this).css("opacity", "0.3");
    //     }
    // });
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
    // $(window).scrollTop(0);
    $(window)[0].scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    // $.fn.toSlide(n,0);
    $.fn.changeSlide(n);
};
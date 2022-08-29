var jsonData = {};
var station = 0;

function getJsonData(callback) {
    $.getJSON('data.json', function(data) {
        jsonData = data[window.localStorage.getItem("region")];
        callback();
    });
}

$(function() {
    getJsonData(init);
});

function init() {
    console.log(window.innerWidth, window.innerHeight);
    $('title').text(jsonData.title);
    initTitle();
    initMain();
    initNav();
    initMainSection();
    $('#showNav').click(function() {
        $.fn.showNav();
    });
    $('#hideNav').click(function() {
        $.fn.hideNav();
    })
    $('#backHomePage').click(function() {
        window.location.href = "index.html";
    });
    $('#closeMS').click(function() {
        $('#mainSection').hide();
    });
    $("#websiteTitle").click(function() {
        $("#mainSection").show();
    });
    $(window).resize(function() {
        updateWindow();
    });
    updateWindow();

}

function initMainSection() {
    $('#MStitle').text(jsonData.title);
    $('#MScontent').text(jsonData.mainContent);
}

function updateWindow() {
    if ($(window).width() <= 600) {
        console.log("cellphone")
        $('nav').attr("style", "");
        $('.stMapPath').each(function(i) {
            $(this).css('width', "8px");
        });
    } else {
        $('.stMapPath').each(function(i) {
            $(this).css('width', "calc((100% - 55px)/" + (jsonData.station.length) + ")");
        });
    }
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
            .addClass("stMapPath")
            .css("width", "calc(100% /" + jsonData.station.length + ")");
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

    $('nav').append(
        $("<div></div>")
        .addClass("clickable")
        .attr("id", "hideNav")
        .text("<")
    );

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
        // initSlideInfo(idx, i);
        // initSlideNav(idx, i);
        appendInfo(idx, i);
    }
}

function appendInfo(stIdx, idx) {
    let page = $("#slideCon" + stIdx).children().length - 1;
    // console.log(page);
    if (page == -1 || jsonData.station[stIdx].info[idx].width == "full" || $("#slPg" + stIdx + "R" + page).html() != "") {
        // console.log(stIdx, idx, "new");
        newSlidePage(stIdx);
        newSlideNav(stIdx);
        page = $("#slideCon" + stIdx).children().length - 1;
    }
    if (jsonData.station[stIdx].info[idx].width == "full") {
        // console.log("cant find", $("#slPg" + stIdx + "L" + page));
        $("#slPg" + stIdx + "L" + page).append(
            $('<img>')
            .attr("src", "src/" + jsonData.station[stIdx].info[idx].image)
            .attr("class", "stImg")
        );
        $("#slPg" + stIdx + "R" + page).append(
            $('<div></div>')
            .attr("class", "stText")
            .html(jsonData.station[stIdx].info[idx].text)
        );
    } else {
        if ($("#slPg" + stIdx + "L" + page).html() == "") {
            $("#slPg" + stIdx + "L" + page)
                .append(
                    $('<img>')
                    .attr("src", "src/" + jsonData.station[stIdx].info[idx].image)
                    .attr("class", "stImg")
                )
                .append(
                    $('<div></div>')
                    .attr("class", "stText")
                    .html(jsonData.station[stIdx].info[idx].text)
                );
        } else {
            $("#slPg" + stIdx + "R" + page)
                .append(
                    $('<img>')
                    .attr("src", "src/" + jsonData.station[stIdx].info[idx].image)
                    .attr("class", "stImg")
                )
                .append(
                    $('<div></div>')
                    .attr("class", "stText")
                    .html(jsonData.station[stIdx].info[idx].text)
                );
        }
    }
}

function newSlidePage(stIdx) {
    let idx = $("#slideCon" + stIdx).children().length;
    // console.log(stIdx, "new", idx);
    $("#slideCon" + stIdx).append(
        $("<div></div>")
        .attr("id", "slIf" + stIdx + "_" + idx)
        .attr("class", "slideInfo")
        .append(
            $('<div></div>')
            .attr("class", "pageCont")
            .attr("id", "slPg" + stIdx + "L" + idx)
        )
        .append(
            $('<div></div>')
            .attr("class", "pageCont")
            .attr("id", "slPg" + stIdx + "R" + idx)
        )
    );
}


function newSlideNav(stIdx) {
    let idx = $("#slideNav" + stIdx).children().length;
    $("#slideNav" + stIdx).append(
        $('<div></div>')
        .attr("class", "slNvNum")
        .attr("id", "slNvNum" + stIdx + "_" + idx)
        .text(idx + 1)
        .css("opacity", "0.3")
    );
    if (idx == 0) {
        $("#slNvNum" + stIdx + "_" + 0).css("opacity", "1");
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
    if (n == station) return;
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
    $.fn.hideNav();
};

$.fn.showNav = function() {
    if (window.innerWidth <= 600) {
        $('nav').animate({ "left": "0vw" });
    } else {
        $('nav').attr("style", "");
    }
}

$.fn.hideNav = function() {
    if (window.innerWidth <= 600) {
        $('nav').animate({ "left": "-100vw" });
    }
}
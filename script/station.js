var jsonData = {};
var station = 0;
var navState = true;

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
    initNav();
    updateSlide(0);
    $('.slideWin').scroll(function(e) {
        $.fn.changeSlide();
    })
    initTitle();
    initMainSection();
    $('#closeMS').click(function() {
        $('#mainSection').hide();
    });
    $("#websiteTitle").click(function() {
        $("#mainSection").show();
    });
    $('#mainTitle').click(function() {
        window.location.href = "index.html";
    });
    $('#toggleNav').click(function() {
        if (navState) {
            $.fn.hideNav();
        } else {
            $.fn.showNav();
        }
        navState = !navState;
    });
    $(window).resize(function() {
        updateWindow();
    });
    updateWindow();
}

function updateWindow() {
    $('nav').attr("style", "");
    $('main').attr("style", "");
    $('.slideInfo').attr("style", "");

    if ($(window).width() <= 600) {
        console.log("cellphone");
        navState = false;
    } else {
        navState = true;
    }
    updateSD();
}

function initMainSection() {
    $('#MStitle').text(jsonData.title);
    $('#MScontent').text(jsonData.mainContent);
}

function updateSlide(idx) {
    $(".slideCon").empty();
    $(".slideNav").empty();
    $("#SDFst").text(jsonData.station[idx].name);
    $("#SDSnd").text(jsonData.station[idx].name);
    for (let i = 0; i < jsonData.station[idx].info.length; ++i) {
        addInfo(idx, i);
    }
    updateSD();
}

function addInfo(stIdx, idx) {
    let page = $(".slideCon").children().length - 1;
    if (page == -1 || jsonData.station[stIdx].info[idx].width == "full" || $("#slPg" + "R" + page).html() != "") {
        newSlidePage();
        newSlideNav();
        page = $(".slideCon").children().length - 1;
    }
    if (jsonData.station[stIdx].info[idx].width == "full") {
        $("#slPg" + "L" + page).append(
            $('<img>')
            .attr("src", "src/" + jsonData.station[stIdx].info[idx].image)
            .attr("class", "stImg")
        );
        $("#slPg" + "R" + page).append(
            $('<div></div>')
            .attr("class", "stText")
            .html(jsonData.station[stIdx].info[idx].text)
        );
    } else {
        if ($("#slPg" + "L" + page).html() == "") {
            $("#slPg" + "L" + page)
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
            $("#slPg" + "R" + page)
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

function newSlidePage() {
    let idx = $(".slideCon").children().length;
    $(".slideCon").append(
        $("<div></div>")
        .attr("id", "slIf" + idx)
        .attr("class", "slideInfo")
        .append(
            $('<div></div>')
            .attr("class", "pageCont")
            .attr("id", "slPg" + "L" + idx)
        )
        .append(
            $('<div></div>')
            .attr("class", "pageCont")
            .attr("id", "slPg" + "R" + idx)
        )
    );
}

function newSlideNav() {
    let idx = $(".slideNav").children().length;
    $(".slideNav").append(
        $('<div></div>')
        .attr("class", "slNvNum")
        .attr("id", "slNvNum" + idx)
        .text(idx + 1)
        .css("opacity", "0.3")
    );
    if (idx == 0) {
        $("#slNvNum" + 0).css("opacity", "1");
    }
    $("#slNvNum" + idx).click(function() {
        $.fn.toSlide(idx);
    });
}
$.fn.toSlide = function(idx) {
    $(".slideWin")
        .scrollLeft(
            $("#slIf" + idx)[0].getBoundingClientRect().width * idx
        );
}

$.fn.changeSlide = function() {
        let w = $("#slIf0")[0].getBoundingClientRect().width;
        let idx = Math.round($(".slideWin").scrollLeft() / w);
        $(".slNvNum").each(function() {
            if ($(this).attr("id") == ("slNvNum" + idx)) {
                $(this).css("opacity", "1");
            } else {
                $(this).css("opacity", "0.3");
            }
        });
    }
    //============================================================================
function initNav() {
    $.each(jsonData.station, function(idx, val) {
        $('#navTable').append(
            $('<tr></tr>')
            .attr("id", "stMap" + idx)
            .addClass("clickable")
            .append(
                $('<td></td>').append(
                    $('<div></div>').text(idx + 1)
                    .addClass('mapNum')
                    .attr("id", "stMapNum" + idx)
                ).append(
                    $('<div></div>')
                    .addClass((idx == jsonData.station.length - 1) ? '' : 'mapPath')
                )
            ).append(
                $('<td></td>').append(
                    $('<div></div>').text(val.name).addClass("mapText")
                )
            ).click(function() { $.fn.toStation(idx); })
        )
    });
    $("#stMapNum" + 0).addClass("mapNumOn");
}


function initTitle() {
    $('#websiteTitle').text(jsonData.title);
}

$.fn.toStation = function(n) {
    if (n == station) return;
    $.each(jsonData.station, function(i) {
        $("#stMapNum" + i).removeClass("mapNumOn");
        // $("#stMap" + i).css("opacity", i < n ? "0.3" : "1");
    });
    $("#stMapNum" + n).addClass("mapNumOn");
    updateSlide(n);
    station = n;
    // $(window).scrollTop(0);
    $(window)[0].scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    $.fn.changeSlide();
    if ($(window).width() <= 600) {
        $.fn.hideNav();
        navState = false;
    }
};



function updateSD() {
    $('.SDWrap').each(function() {
        console.log($(this).width(), $(this).children(".SD").width());
        if ($(this).width() < $(this).children(".SD").width()) {
            $(this).children("#SDSnd").removeClass("SDWait")
            $(this).children("#SDSnd").addClass("SDSnd");
            $(this).children("#SDFst").addClass("SDFst");
            $(this).css("justify-content", "flex-start")
        } else {
            $(this).children("#SDSnd").addClass("SDWait")
            $(this).children("#SDSnd").removeClass("SDSnd");
            $(this).children("#SDFst").removeClass("SDFst");
            $(this).css("justify-content", "center")
        }
    });
}

$.fn.showNav = function() {
    if ($(window).width() <= 600) {
        $('nav').animate({ "left": "0vw" });
    } else {
        $('nav').animate({ "left": "0vw" });
        $('main').animate({ "left": "20vw", 'width': '80vw' });
        $('.slideInfo').animate({ "width": "80vw" });
    }

}

$.fn.hideNav = function() {
    if ($(window).width() <= 600) {
        $('nav').animate({ "left": "-100vw" });
    } else {
        $('nav').animate({ "left": "-20vw" });
        $('main').animate({ "left": "0vw", 'width': '100vw' });
        $('.slideInfo').animate({ "width": "100vw" });
    }
}
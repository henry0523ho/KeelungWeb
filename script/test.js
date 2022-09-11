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
    initNav();
    initMain();
    initTitle();
}

function initNav() {
    $.each(jsonData.station, function(idx, val) {
        $('#navTable').append(
            $('<tr></tr>').append(
                $('<td></td>').append(
                    $('<div></div>').text(idx + 1)
                    .addClass('mapNum')
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
}

function initMain() {
    $('main').empty();
    for (let i = 0; i < jsonData.station.length; ++i) {
        initSection(i);
    }
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

function initName(idx) {
    $("#stSection" + idx).append(
        $('<div></div>')
        .attr("id", ("stName" + idx))
        .attr("class", "stName")
    );
    $.fn.genScrollDisplay($("#stName" + idx), jsonData.station[idx].name);
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

$.fn.genScrollDisplay = function(node, content) {
    let wrap = $('<div></div>')
        .attr("class", "SDWrap")
    let first = $('<div></div>')
        .attr("id", "SDFst")
        .attr("class", "SD")
        .html(content);
    let second = $('<div></div>')
        .attr("id", "SDSnd")
        .attr("class", "SD SDWait")
        .text(content);
    wrap.append(first).append(second);
    node.append(wrap);
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

function initTitle() {
    $('#websiteTitle').text(jsonData.title);
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
    updateSD();
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
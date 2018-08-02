var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songlist; 
var controlmanager;
var audiomanager = new root.audioManager();
var processor = root.process; 
var playList = root.playList;


function bindTouch () {
    var $sliderPoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left,
        width = offset.width;
    $sliderPoint.on("touchstart", function () {
        processor.stop();
    }).on("touchmove", function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if( percent > 1 || percent < 0) {
            percent = 0;
        }
        processor.upDate(percent);
    }).on("touchend", function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if( percent > 1 || percent < 0) {
            percent = 0;
        }
        processor.upDate(percent);  
        var index = controlmanager.index;
        var curDuration = songlist[index].duration;
        var curTime = curDuration * percent; 
        audiomanager.jumpToPlay(curTime);     
        $scope.find(".play-btn").addClass("playing");
    })
}



// click 移动端click延迟300ms，可以引入fastclick取消掉
function bindClick () {
    $scope.on("click",".play-btn",function () {
        if(audiomanager.status == "play") {
            audiomanager.pause();
            processor.stop()
            // $(this).removeClass("playing");            
        }else{
            audiomanager.play();
            // $(this).addClass("playing"); 
            processor.start();
        }
        $(this).toggleClass("playing")
    })
    $scope.find(".next-btn").on("click", function () {
        // if (index == songlist.length - 1) {
        //     index = 0
        // } else {
        //     index++
        // }
        // root.render(songlist[index]);
        var index = controlmanager.next();
        // root.render(songlist[index]);
        $scope.trigger("player:change", index);        
    })

    $scope.find(".prev-btn").on("click", function () {
        // if (index == 0) {
        //     index = songlist.length - 1;
        // } else {
        //     index--
        // }
        // root.render(songlist[index]);
        var index = controlmanager.prev();
        // root.render(songlist[index]);
        $scope.trigger("player:change", index);
    })
}
    $scope.find(".list-btn").on("click",function () {
        playList.show(controlmanager);
    })




//封装
$scope.on("player:change",function (event,index,flag) {
    root.render(songlist[index]);
    audiomanager.changeSource(songlist[index].audio);
    if(audiomanager.status == 'play'|| flag) {
        processor.start();
        audiomanager.play(); 
    }
    processor.renderAllTime(songlist[index].duration);
    processor.upDate(0);
})

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: successfn
    })
}
function successfn(data) {
    songlist = data;
    // root.render(data[0]);
    $scope.trigger("player:change", 0);
    
    bindClick();
    bindTouch();
    playList.renderPlayList(data);
    controlmanager = new root.controlManager(data.length);
}
getData("/mock/data.json")
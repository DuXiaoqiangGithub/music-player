(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var startTime;
    var lastPercent = 0;
    function formateDate(duration) {
        duration = Math.round(duration);
        var minute = Math.floor(duration / 60);
        var second = duration - minute * 60;
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    };

    function renderPro(percent) {
        var percentage = (percent - 1) * 100 + '%';
        $scope.find(".pro-top").css({
            transform : "translateX(" + percentage + ")"
        })
    }

    function upDate(percent) {
        var currentTime = percent * curDuration;
        var time = formateDate(currentTime);
        $scope.find('.cur-time').html(time);
        renderPro(percent);
    }


    // 获取播放时间百分比
    function start() {
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent < 1) {
                frameId = requestAnimationFrame(frame);
                upDate(percent);
            } else {
                cancelAnimationFrame(frameId);
            }
            // console.log(percent);
        }
        frame()
    };

    function stop () {
        var stopTime = new Date().getTime();
        lastPercent =lastPercent +  (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }


    // 歌曲总时长
    function renderAllTime(duration) {
        curDuration = duration;
        lastPercent = 0;
        var allTime = formateDate(duration);
        $scope.find(".all-time").html(allTime);
    };
    root.process = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        upDate : upDate

    };

}(window.Zepto, window.player))
/* Error in positioning in bubbleFade and bubbleZoom animations. Rest is ok as observed */

;(function ($) {

    "use strict";

    var loaders = new Array();
    /* A global array to hold a reference to all the animations currently running */
    var index = -1;
    /* An index to the loaders array. Highest value indicate the number of animations currently running */

    $.fn.Loading = function (options) {

        var opts = $.extend({}, $.fn.Loading.defaults, options);
        /* merging the user defined options*/

        /* This array contains all animation types supported by this plugin. Hence any random user supplied loader_type wont populate. */
        var features = new Array('fade', 'zoom', 'shrink', 'wave', 'shake', 'hammer', 'bubbleFade', 'bubbleZoom');

        if ($.inArray(opts.loader_type, features) < 0)  /*check if the loader_type supplied by the user is supported */
            return false;

        opts.randomise = 500 + parseInt(Math.random() * 1000);
        /* Generate a random number to be used as a unique identifier to each loader */
        $(this).addClass('' + opts.randomise + '');
        /* Add unique identifier as a class to the parent element */

        prepareLoader($(this), opts);
        /* set up the loader features on parent element */
        loaders[++index] = opts;
        /* Add the current loader to the loaders array */


        switch (opts.loader_type) { /* Select the loader type */
            case "bubbleFade" :
            case "fade" :  /* add the Interval reference startLoader to the current loader identifier */
                fade(opts);
                opts.startLoader = setInterval(function () {
                    fade(opts);
                }, opts.timer);
                break;
            case "bubbleZoom" :
            case "zoom" :
                zoom(opts);
                opts.startLoader = setInterval(function () {
                    zoom(opts);
                }, opts.timer);
                break;
            case "shrink" :
                shrink(opts);
                opts.startLoader = setInterval(function () {
                    shrink(opts);
                }, opts.timer);
                break;
            case "wave" :
                wave(opts);
                opts.startLoader = setInterval(function () {
                    wave(opts);
                }, opts.timer);
                break;
            case "shake" :
                shake(opts);
                opts.startLoader = setInterval(function () {
                    shake(opts);
                }, opts.timer);
                break;
            case "hammer" :
                hammer(opts);
                opts.startLoader = setInterval(function () {
                    hammer(opts);
                }, opts.timer);
                break;

        }

    };

    /* private animation handlers are declared for a type of animation */

    function fade(opts) {
        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            /* stop element animation if its not complete to prevent uncertain behaviour */
            $element.delay(index * opts.delay);
            /* introduce delay between each element so that animation is applied sequetially and not simultaneously */
            $element.animate({opacity: opts.fadeHigh}, opts.duration, function () {
                $(this).animate({opacity: opts.fadeLow}, opts.duration);
                /* fading animation */
            });
        });
    };

    function zoom(opts) {
        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            $element.delay(index * opts.delay);
            $element.animate({
                borderRadius: opts.newRadius,
                height: opts.newHeight,
                width: opts.newWidth,
                marginTop: opts.topHeight - opts.heightAdjust,
                opacity: opts.fadeHigh
            }, opts.duration, function () {
                $(this).animate({
                    borderRadius: opts.radius,
                    height: opts.height,
                    width: opts.width,
                    marginTop: opts.topHeight,
                    opacity: opts.fadeLow
                }, opts.duration);
            });
            /* borderRadius for bubbleZoom, MarginTop to adjust the height increase factor */
        });
    };

    function shrink(opts) {
        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            $element.delay(index * opts.delay);
            $element.animate({
                height: opts.newHeight,
                width: 0,
                marginTop: opts.topHeight - opts.heightAdjust,
                opacity: opts.fadeHigh
            }, opts.duration, function () {
                $(this).animate({
                    height: opts.height,
                    width: opts.width,
                    marginTop: opts.topHeight,
                    opacity: opts.fadeLow
                }, opts.duration);
            });
            /* width:0 for shrinking and marginTop for adjusting the increased height */
        });
    };

    function wave(opts) {
        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            $element.delay(index * opts.delay);
            $element.animate({
                height: opts.newHeight,
                marginTop: opts.topHeight - opts.heightAdjust,
                opacity: opts.fadeHigh
            }, opts.duration, function () {
                $(this).animate({height: opts.height, marginTop: opts.topHeight, opacity: opts.fadeLow}, opts.duration);
            });
            /* heightAdjust takes the increased height all the way up to give a increase in height behaviour*/
        });
    };

    function shake(opts) {

        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            if (index % 2 == 0) {
                $element.delay(index * opts.delay);
                $element.animate({
                    marginTop: opts.topHeight - opts.heightAdjust,
                    opacity: opts.fadeHigh
                }, opts.duration, function () {
                    $(this).animate({marginTop: opts.heightAdjust}, opts.duration, function () {
                        $(this).animate({marginTop: opts.topHeight, opacity: opts.fadeLow}, opts.duration);
                    });
                });
            }
            else {
                $element.delay(index * opts.delay);
                $element.animate({marginTop: opts.heightAdjust, opacity: opts.fadeHigh}, opts.duration, function () {
                    $(this).animate({marginTop: opts.topHeight - opts.heightAdjust}, opts.duration, function () {
                        $(this).animate({marginTop: opts.topHeight, opacity: opts.fadeLow}, opts.duration);
                    });
                });
                /* ups and downs animation pattern is applied on each alternate element to give a shaking look */
            }
        });
    };

    function hammer(opts) {
        opts.loader.each(function (index, element) {
            var $element = $(element);
            $element.stop(true, true);
            $element.delay(index * opts.delay);
            $element.animate({
                marginTop: opts.topHeight - opts.heightAdjust,
                opacity: opts.fadeHigh
            }, opts.duration, function () {
                $(this).animate({marginTop: opts.heightAdjust}, opts.duration, function () {
                    $(this).animate({marginTop: opts.topHeight, opacity: opts.fadeLow}, opts.duration);
                });
            });
            /*ups and downs on individual element */
        });
    }


    $.Loading = {};

    function prepareLoader($parent, opts) {

        opts.parent = $parent;
        /* store the parent element in loader identifier */
        $parent.append('<div id=loader_background' + opts.randomise + '> </div>');
        /* append the background to the parent */
        $parent.append('<div id=animation_holder' + opts.randomise + '> </div>');
        /* append the loader holder to the parent */
        opts.background = $('div#loader_background' + opts.randomise);
        /* store the background element */
        opts.holder = $('div#animation_holder' + opts.randomise);
        /* store the loader holder element */
        var height = $parent.outerHeight();
        /* parent height */
        var width = $parent.outerWidth();
        /* parent width */
        var position = $parent.offset();
        /* parent's current position on the screen */
        var offParent = $parent.offsetParent().attr('id');

        if (offParent != undefined) {
            offParent = $('#' + offParent).offset();
            position.left = position.left - offParent.left;
            position.top = position.top - offParent.top;
        }
        else {
            position.left = 0;
            position.top = 0;
        }
        (opts.background).css('position', 'absolute').css('height', height).css('width', width).css('background-color', opts.backgroundColor).css('opacity', opts.backgroundOpacity).css('left', position.left).css('top', position.top);
        /* setup  the background */
        if (opts.loader_type == "bubbleZoom" || opts.loader_type == "bubbleFade")
            var offsetWidth = ((opts.population * parseInt(opts.height)) + (opts.population * parseInt(opts.spacing))); /* total space required by the bars */
        else    var offsetWidth = ((opts.population * parseInt(opts.width)) + (opts.population * parseInt(opts.spacing)));
        /* total space required by the bars */
        var offsetHeight = parseInt(opts.height);
        width = (width - offsetWidth) / 2;
        /* actual offset from the left of the parent for the bars */
        height = (height - offsetHeight) / 2;
        /* actual offset from the top of the parent for the bars */
        (opts.holder).css('position', 'absolute').css('height', opts.height).css('top', position.top + height).css('left', position.left + width);
        /*setup bars holder*/
        for (var i = 0; i < opts.population; i++)
            (opts.holder).append('<li class=' + opts.randomise + '> </li>');
        /* laying out the bars inside the holder */

        opts.loader = $("li." + opts.randomise);
        /* store the bars collection in a variable */

        opts.loader.css('height', opts.height).css('width', opts.width);
        /* set height and width of bars */
        opts.loader.css('background-color', opts.barColor);
        /* set color of bars */
        opts.loader.css('display', 'inline').css('float', 'left');
        /* adjust oreintation */
        opts.loader.css('margin-left', opts.spacing);
        /* adjust spacing between the bars */
        opts.loader.css('box-shadow', opts.barShadow);
        /* adjust spacing between the bars */

        switch (opts.loader_type) {

            case 'bubbleZoom' :
                opts.radius = parseInt(opts.height) / 2;
                opts.newRadius = parseInt(opts.newHeight) / 2;
                opts.width = opts.height; //equalise the original height and width for making a circle
                opts.newWidth = opts.newHeight; //equalise the final height and width for making a circle
            case 'bubbleFade' :
                opts.radius = parseInt(opts.height) / 2;
                opts.width = opts.height; //equalise the original height and width for making a circle
                opts.loader.css('border-radius', opts.radius);
                /* adjust radius of edges of the bars */
                opts.loader.css('width', opts.width);
                break;
            default :
                opts.loader.css('border-radius', opts.radius); /* adjust radius of edges of the bars */

        }
        switch (opts.loader_type) {

            case 'hammer' :
            case 'shake' :
                opts.heightAdjust = (parseInt(opts.height)) * .95;
                /* almost full length of bars is swing */
                break;
            case 'wave' :
                opts.heightAdjust = (parseInt(opts.newHeight) - parseInt(opts.height));
                break;
            case 'bubbleZoom' :
                opts.radius = parseInt(opts.height) / 2;
                /* radius should be half of height in any case */
                opts.newRadius = parseInt(opts.newHeight) / 2;
                opts.width = opts.height;
                /* the width should be equall to the height for making bubbles */
                opts.newWidth = opts.newHeight;
            case 'zoom' :
            case 'shrink' :
                opts.heightAdjust = (parseInt(opts.newHeight) - parseInt(opts.height)) / 2;
                break;

        }
        opts.topHeight = parseInt(opts.loader.css('margin-top'));
        /* top position of the bars */
        opts.timer = opts.population * opts.delay + 2 * opts.duration;
        /* calculate delay for the animation */

    };

    $.Loading.stopLoader = function ($element) { /* receives the parent tag as parameter */
        for (var i = 0; i <= index; ++i) {
            if ($element.hasClass(loaders[i].randomise)) { /* check to see if the parent tag contains a unique identifier to a loader as a class */
                clearInterval(loaders[i].startLoader);
                /* clear the interval */
                loaders[i].holder.remove();
                /* remove the bars */
                loaders[i].background.remove();
                /* remove the background*/
                $element.removeClass('' + loaders[i].randomise + '');
                /* remove the unique identifier from the class */
                loaders.splice(i, 1);
                --index;
            }

        }
    }


    $.fn.Loading.defaults = {
        height: 16, // bar height
        width: 4, // bar width
        barColor: '#039', // bar color
        barShadow: '0px 0px 0px #000', // bars shadow x, y, spread, color
        radius: 0, // radius of the bars
        spacing: 2, // spacing between the bars
        backgroundColor: '#000', // background color for the bars
        backgroundOpacity: .8, // opacity of the background
        population: 22, // number of bars
        fadeLow: 0.05,
        fadeHigh: 1,
        newHeight: 20, // required height when using zoom, bubbleZoom, wave
        newWidth: 20,   // required width when using zoom
        loader_type: 'fade', // type of animation being used
        duration: 400, // duration for animation a single bar
        delay: 72

    };

})(jQuery);

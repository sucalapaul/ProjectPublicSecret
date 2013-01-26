/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
(function($) {

	$.fn.charCount = function(options){
	  
		// default configuration properties
		var defaults = {	
			allowed: 140,		
			warning: 25,
			css: 'counter',
			counterElement: 'span',
			cssWarning: 'warning',
			cssExceeded: 'exceeded',
			counterText: '',
			disableId: '',
			cssDisable: 'disabled'
		}; 
			
		var options = $.extend(defaults, options); 
		
		function calculate(obj){
			var count = $(obj).val().length;
			var objCounter = $('#' + $(obj).attr('id') + '_counter' );
			var available = options.allowed - count;
			var objDisable = $('#' + options.disableId);

			if(available <= options.warning && available >= 0){
				objCounter.addClass(options.cssWarning);
			} else {
				objCounter.removeClass(options.cssWarning);
			}
			if(available < 0){
				objCounter.addClass(options.cssExceeded);
			} else {
				objCounter.removeClass(options.cssExceeded);
			}
			if (count == 0 || available < 0){
				objDisable.addClass(options.cssDisable);
			} else {
				objDisable.removeClass(options.cssDisable);
			}
			objCounter.html(options.counterText + available);
		};
				
		this.each(function() {
			calculate(this);
			$(this).keyup(function(){calculate(this)});
			$(this).change(function(){calculate(this)});
		});
	  
	};

})(jQuery);



/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.4
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));



/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-multiplebgs-opacity-rgba-textshadow-cssanimations-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-canvas-hashchange-audio-video-input-localstorage-inlinesvg-svg-touch-shiv-mq-cssclasses-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-css_backgroundsizecover-requestanimationframe
 */;
window.Modernizr = function (a, b, c) {
    function C(a) {
        j.cssText = a
    }
    function D(a, b) {
        return C(m.join(a + ";") + (b || ""))
    }
    function E(a, b) {
        return typeof a === b
    }
    function F(a, b) {
        return !!~ ("" + a).indexOf(b)
    }
    function G(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!F(e, "-") && j[e] !== c) return b == "pfx" ? e : !0
        }
        return !1
    }
    function H(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c) return d === !1 ? a[e] : E(f, "function") ? f.bind(d || b) : f
        }
        return !1
    }
    function I(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1),
            e = (a + " " + o.join(d + " ") + d).split(" ");
        return E(b, "string") || E(b, "undefined") ? G(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), H(e, b, c))
    }
    function J() {
        e.input = function (c) {
            for (var d = 0, e = c.length; d < e; d++) t[c[d]] = c[d] in k;
            return t.list && (t.list = !! b.createElement("datalist") && !! a.HTMLDataListElement), t
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "))
    }
    var d = "2.6.2",
        e = {}, f = !0,
        g = b.documentElement,
        h = "modernizr",
        i = b.createElement(h),
        j = i.style,
        k = b.createElement("input"),
        l = {}.toString,
        m = " -webkit- -moz- -o- -ms- ".split(" "),
        n = "Webkit Moz O ms",
        o = n.split(" "),
        p = n.toLowerCase().split(" "),
        q = {
            svg: "http://www.w3.org/2000/svg"
        }, r = {}, s = {}, t = {}, u = [],
        v = u.slice,
        w, x = function (a, c, d, e) {
            var f, i, j, k, l = b.createElement("div"),
                m = b.body,
                n = m || b.createElement("body");
            if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
            return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !! i
        }, y = function (b) {
            var c = a.matchMedia || a.msMatchMedia;
            if (c) return c(b).matches;
            var d;
            return x("@media " + b + " { #" + h + " { position: absolute; } }", function (b) {
                d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
            }), d
        }, z = function () {
            function d(d, e) {
                e = e || b.createElement(a[d] || "div"), d = "on" + d;
                var f = d in e;
                return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = E(e[d], "function"), E(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
            }
            var a = {
                select: "input",
                change: "input",
                submit: "form",
                reset: "form",
                error: "img",
                load: "img",
                abort: "img"
            };
            return d
        }(),
        A = {}.hasOwnProperty,
        B;
    !E(A, "undefined") && !E(A.call, "undefined") ? B = function (a, b) {
        return A.call(a, b)
    } : B = function (a, b) {
        return b in a && E(a.constructor.prototype[b], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function (b) {
        var c = this;
        if (typeof c != "function") throw new TypeError;
        var d = v.call(arguments, 1),
            e = function () {
                if (this instanceof e) {
                    var a = function () {};
                    a.prototype = c.prototype;
                    var f = new a,
                        g = c.apply(f, d.concat(v.call(arguments)));
                    return Object(g) === g ? g : f
                }
                return c.apply(b, d.concat(v.call(arguments)))
            };
        return e
    }), r.canvas = function () {
        var a = b.createElement("canvas");
        return !!a.getContext && !! a.getContext("2d")
    }, r.touch = function () {
        var c;
        return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : x(["@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) {
            c = a.offsetTop === 9
        }), c
    }, r.hashchange = function () {
        return z("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
    }, r.rgba = function () {
        return C("background-color:rgba(150,255,150,.5)"), F(j.backgroundColor, "rgba")
    }, r.multiplebgs = function () {
        return C("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background)
    }, r.backgroundsize = function () {
        return I("backgroundSize")
    }, r.borderimage = function () {
        return I("borderImage")
    }, r.borderradius = function () {
        return I("borderRadius")
    }, r.boxshadow = function () {
        return I("boxShadow")
    }, r.textshadow = function () {
        return b.createElement("div").style.textShadow === ""
    }, r.opacity = function () {
        return D("opacity:.55"), /^0.55$/.test(j.opacity)
    }, r.cssanimations = function () {
        return I("animationName")
    }, r.cssgradients = function () {
        var a = "background-image:",
            b = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
            c = "linear-gradient(left top,#9f9, white);";
        return C((a + "-webkit- ".split(" ").join(b + a) + m.join(c + a)).slice(0, -a.length)), F(j.backgroundImage, "gradient")
    }, r.cssreflections = function () {
        return I("boxReflect")
    }, r.csstransforms = function () {
        return !!I("transform")
    }, r.csstransforms3d = function () {
        var a = !! I("perspective");
        return a && "webkitPerspective" in g.style && x("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function (b, c) {
            a = b.offsetLeft === 9 && b.offsetHeight === 3
        }), a
    }, r.csstransitions = function () {
        return I("transition")
    }, r.fontface = function () {
        var a;
        return x('@font-face {font-family:"font";src:url("https://")}', function (c, d) {
            var e = b.getElementById("smodernizr"),
                f = e.sheet || e.styleSheet,
                g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0
        }), a
    }, r.video = function () {
        var a = b.createElement("video"),
            c = !1;
        try {
            if (c = !! a.canPlayType) c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
        } catch (d) {}
        return c
    }, r.audio = function () {
        var a = b.createElement("audio"),
            c = !1;
        try {
            if (c = !! a.canPlayType) c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
        } catch (d) {}
        return c
    }, r.localstorage = function () {
        try {
            return localStorage.setItem(h, h), localStorage.removeItem(h), !0
        } catch (a) {
            return !1
        }
    }, r.svg = function () {
        return !!b.createElementNS && !! b.createElementNS(q.svg, "svg").createSVGRect
    }, r.inlinesvg = function () {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == q.svg
    };
    for (var K in r) B(r, K) && (w = K.toLowerCase(), e[w] = r[K](), u.push((e[w] ? "" : "no-") + w));
    return e.input || J(), e.addTest = function (a, b) {
        if (typeof a == "object") for (var d in a) B(a, d) && e.addTest(d, a[d]);
        else {
            a = a.toLowerCase();
            if (e[a] !== c) return e;
            b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
        }
        return e
    }, C(""), i = k = null,
    function (a, b) {
        function k(a, b) {
            var c = a.createElement("p"),
                d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
        }
        function l() {
            var a = r.elements;
            return typeof a == "string" ? a.split(" ") : a
        }
        function m(a) {
            var b = i[a[g]];
            return b || (b = {}, h++, a[g] = h, i[h] = b), b
        }
        function n(a, c, f) {
            c || (c = b);
            if (j) return c.createElement(a);
            f || (f = m(c));
            var g;
            return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g
        }
        function o(a, c) {
            a || (a = b);
            if (j) return a.createDocumentFragment();
            c = c || m(a);
            var d = c.frag.cloneNode(),
                e = 0,
                f = l(),
                g = f.length;
            for (; e < g; e++) d.createElement(f[e]);
            return d
        }
        function p(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) {
                return r.shivMethods ? n(c, a, b) : b.createElem(c)
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function (a) {
                return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
            }) + ");return n}")(r, b.frag)
        }
        function q(a) {
            a || (a = b);
            var c = m(a);
            return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !! k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a
        }
        var c = a.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
            e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
            f, g = "_html5shiv",
            h = 0,
            i = {}, j;
        (function () {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function () {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                }()
            } catch (c) {
                f = !0, j = !0
            }
        })();
        var r = {
            elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
            shivCSS: c.shivCSS !== !1,
            supportsUnknownElements: j,
            shivMethods: c.shivMethods !== !1,
            type: "default",
            shivDocument: q,
            createElement: n,
            createDocumentFragment: o
        };
        a.html5 = r, q(b)
    }(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, e.mq = y, e.hasEvent = z, e.testProp = function (a) {
        return G([a])
    }, e.testAllProps = I, e.testStyles = x, e.prefixed = function (a, b, c) {
        return b ? I(a, b, c) : I(a, "pfx")
    }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + u.join(" ") : ""), e
}(this, this.document), Modernizr.testStyles("#modernizr{background-size:cover}", function (a) {
    var b = window.getComputedStyle ? window.getComputedStyle(a, null) : a.currentStyle;
    Modernizr.addTest("bgsizecover", b.backgroundSize == "cover")
}), Modernizr.addTest("raf", !! Modernizr.prefixed("requestAnimationFrame", window));



/**
 * @fileOverview Browser detection written by ppk. See
 *  http://www.quirksmode.org/js/detect.html for more info.
 *  This is not to be used for sniffing or feature detection.
 *  Added support to detect Android and Windows Phone.
 */

var browserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Unknown Browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown Version";
        this.OS = this.searchString(this.dataOS) || "Unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
            } else if (dataProp) return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    }, {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    }, { // for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }, { // for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    }, {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    }, {
        string: navigator.userAgent,
        subString: "iPad",
        identity: "iPad"
    }, {
        string: navigator.userAgent,
        subString: "Android",
        identity: "Android"
    }, {
        string: navigator.userAgent,
        subString: "Windows Phone",
        identity: "Windows Phone"
    }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }]

};

browserDetect.init();


/* PARALLAX SCROLLER */

(function () {
    for (var d = 0, a = ["ms", "moz", "webkit", "o"], b = 0; b < a.length && !window.requestAnimationFrame; ++b) window.requestAnimationFrame = window[a[b] + "RequestAnimationFrame"], window.cancelRequestAnimationFrame = window[a[b] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function (b) {
        var a = (new Date).getTime(),
            c = Math.max(0, 16 - (a - d)),
            e = window.setTimeout(function () {
                b(a + c)
            }, c);
        d = a + c;
        return e
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) {
        clearTimeout(a)
    })
})();

(function( $ ) {
  g = $;
  $.parallaxScroller = function () {
    return {
        scroller: {

            initialize: function () {
              var c = gsp.parallaxScroller.ui.isMobilePage();
              if (!c) {
                  var a = function () {
                     $(".section-auto-size").each(function () {
                          var a = $(this),
                              c = $(window).height() * parseFloat(a.data("auto-size"));
                          a.css("height", c);
                          var e = a.find(".box").outerHeight();
                          e > c && a.css("height", e)
                      })
                  };
                  $(window).on("resize", function () {
                      a()
                  });
                  a();
                  $(window).load(function () {
                      a()
                  })
              }
              if (c) $("div.scroller-main").each(function () {
                  var a = $(this);
                  a.addClass("parallax-disabled");
                  a.css("background-image", "url(" + a.data("image-mobile") + ")");
                  var c = 0.5 * $(window).height() + (a.data("extra-height-mobile") || 0);
                  a.css("height", 250 > c ? 250 : c)
              });
              else if ($.browser.msie || Modernizr.touch) {
                  var e = $(window).height(),
                      d = function (a, c) {
                          var $ = Math.max(0.75 * c, 200) + (a.data("extra-height") || 0);
                          a.css("height", $ + "px")
                      };
                  $("div.scroller-main").each(function () {
                      var a = $(this);
                      a.addClass("parallax-disabled");
                      a.css("background-image", "url(" + a.data("image") + ")");
                      d(a, e)
                  });
                  $(window).resize(function () {
                      var a = $(window).height();
                      $("div.scroller-main").each(function () {
                          var c = $(this);
                          d(c, a)
                      })
                  })
              } else gsp.parallaxScroller.scroller.init({
                  speed: 0.2,
                  items: $("div.scroller-main")
              });
            },

            init: function (a) {
                var a = a || {}, b = this;
                this.items = a.items || [];
                this.speed = a.speed;
                this.supportedFeatures = gsp.parallaxScroller.ui.applyCssGetSupportedFeatures();
                this.world = window;
                this.scrollDistance = 0;
                this.busy = !1;
                this.bounds = this._getBounds();
                this.tiles = [];
                this.items.each(function () {
                    var a = g(this),
                        b = g('<div class="scroller-holder"><img src="' + a.data("image") + '" class="scroller-tile" /></div>');
                    g("body").prepend(b);
                    a.data("holder", b)
                });
                g(window).load(function () {
                    b._initTiles();
                    b._updateTiles()
                });
                g(window).resize(function () {
                    b._initTiles();
                    b._requestTick()
                });
                g(window).scroll(function (a) {
                    b.scrollDistance = b._getScrollDistance(a);
                    b._requestTick()
                })
            },
            _initTiles: function () {
                var a = this;
                a.bounds = this._getBounds();
                var b = a.bounds.width,
                    c = a.bounds.height;
                a.tiles = [];
                a.items.each(function () {
                    var d = g(this),
                        e = d.data("holder");
                    e.width(b);
                    var f = 0.75 * c,
                        j = d.data("extra-height") || 0,
                        f = (200 < f ? f : 200) + j;
                    d.height(f);
                    var h = d.data("width"),
                        k = d.data("height"),
                        i, j = c - (c - f) * a.speed;
                    i = h * (j / k);
                    i >= b ? h = j : (i = b, h = k * (i / h));
                    d = new gsp.parallaxScroller.tile({
                        main: d[0],
                        holder: e[0],
                        holderWidth: b,
                        holderHeight: f,
                        backgroundWidth: i,
                        backgroundHeight: h,
                        initBackgroundOffsetX: -(i - b) / 2,
                        initBackgroundOffsetY: -(h - j) / 2
                    });
                    a.tiles.push(d)
                })
            },
            _requestTick: function () {
                var a = this;
                this.busy || (this.busy = !0, window.requestAnimationFrame(function () {
                    a._updateTiles()
                }))
            },
            _updateTiles: function () {
                for (var a = this.scrollDistance, b = this.scrollDistance + this.bounds.height, c = 0, d = this.tiles.length; c < d; c++) {
                    var e = this.tiles[c],
                        f = e.initHolderLocation.y;
                    a < e.initHolderLocation.y + e.holderHeight && b > f ? (e.holderLocation.y = e.initHolderLocation.y - this.scrollDistance, e.backgroundOffset.y = e.initBackgroundOffset.y - e.holderLocation.y + e.holderLocation.y * this.speed, this.tiles[c].visibility = "visible") : this.tiles[c].visibility = "hidden"
                }
                c = 0;
                for (d = this.tiles.length; c < d; c++) this.tiles[c].draw(this.supportedFeatures);
                this.busy = !1
            },
            _getBounds: function () {
                var a = this.world;
                return !a ? null : a === window ? (a = gsp.parallaxScroller.utils.getWindowSize(), {
                    width: a.width,
                    height: a.height
                }) : {
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            },
            _getScrollDistance: function (a) {
                return a.target ? a.target.body.scrollTop || document.documentElement.scrollTop : a.srcElement ? a.srcElement.body.scrollTop || document.documentElement.scrollTop : document.documentElement.scrollTop
            }
        },
        tile: function (a) {
            var b = {
                init: function (a) {
                    this.main = a.main;
                    this.holder = a.holder;
                    this.img = this.holder.firstChild;
                    this.initBackgroundOffset = {
                        x: a.initBackgroundOffsetX || 0,
                        y: a.initBackgroundOffsetY || 0
                    };
                    this.backgroundOffset = {
                        x: this.initBackgroundOffset.x,
                        y: this.initBackgroundOffset.y
                    };
                    this.backgroundWidth = a.backgroundWidth || 0;
                    this.backgroundHeight = a.backgroundHeight || 0;
                    this.initHolderLocation = {
                        x: this.main.offsetLeft,
                        y: this.main.offsetTop
                    };
                    this.holderLocation = {
                        x: this.initHolderLocation.x,
                        y: this.initHolderLocation.y
                    };
                    this.holderWidth = a.holderWidth || 0;
                    this.holderHeight = a.holderHeight || 0;
                    this.visibility = a.visibility || "visible"
                },
                draw: function (a) {
                    gsp.parallaxScroller.ui.applyCss(this.holder, a, {
                        x: this.holderLocation.x,
                        y: this.holderLocation.y,
                        width: this.holderWidth,
                        height: this.holderHeight,
                        visibility: this.visibility
                    });
                    gsp.parallaxScroller.ui.applyCss(this.img, a, {
                        x: this.backgroundOffset.x,
                        y: this.backgroundOffset.y,
                        width: this.backgroundWidth,
                        height: this.backgroundHeight,
                        visibility: this.visibility
                    })
                }
            };
            b.init(a);
            return b
        },
        utils: {
            getWindowSize: function () {
                var a = {
                    width: !1,
                    height: !1
                };
                "undefined" !== typeof window.innerWidth ? a.width = window.innerWidth : "undefined" !== typeof document.documentElement && "undefined" !== typeof document.documentElement.clientWidth ? a.width = document.documentElement.clientWidth : "undefined" !== typeof document.body && (a.width = document.body.clientWidth);
                "undefined" !== typeof window.innerHeight ? a.height = window.innerHeight : "undefined" !== typeof document.documentElement && "undefined" !== typeof document.documentElement.clientHeight ? a.height = document.documentElement.clientHeight : "undefined" !== typeof document.body && (a.height = document.body.clientHeight);
                return a
            }
        }, 
        ui: {
          isMobilePage: function () {
              return 715 > window.screen.width
          },
          applyCss: function (b, a, c) {
              var f = [],
                  d = (c.x || 0) | 0,
                  g = (c.y || 0) | 0;
              if (0 != d || 0 != g) f = a.csstransforms3d ? f.concat(["-webkit-transform: translate3d(" + d + "px, " + g + "px, 0)", "-moz-transform: translate3d(" + d + "px, " + g + "px, 0)", "-o-transform: translate3d(" + d + "px, " + g + "px, 0)", "-ms-transform: translate3d(" + d + "px, " + g + "px, 0)"]) : a.csstransforms ? f.concat(["-webkit-transform: translateX(" + d + "px) translateY(" + g + "px)", "-moz-transform: translateX(" + d + "px) translateY(" + g + "px)", "-o-transform: translateX(" + d + "px) translateY(" + g + "px)", "-ms-transform: translateX(" + d + "px) translateY(" + g + "px)"]) : f.concat(["position: absolute", "left: " + d + "px", "top: " + g + "px"]);
              c.backgroundImageUrl && f.push('background-image: url("' + c.backgroundImageUrl + '")');
              c.width && f.push("width: " + (c.width | 0) + "px");
              c.height && f.push("height: " + (c.height | 0) + "px");
              c.visibility && f.push("visibility: " + c.visibility);
              b.style.cssText = f.join(";")
          }, 
          applyCssGetSupportedFeatures: function () {
              return window.Modernizr ? {
                  csstransforms3d: Modernizr.csstransforms3d,
                  csstransforms: Modernizr.csstransforms
              } : {
                  csstransforms3d: !1,
                  csstransforms: !1
              }
          }                

        }
    }
  };
})( jQuery );
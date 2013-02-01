/* PARALLAX SCROLLER */


var gspit = gspit || {};

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



gspit.parallaxScroller = function (g) {
    return {
        scroller: {
            init: function (a) {
                var a = a || {}, b = this;
                this.items = a.items || [];
                this.speed = a.speed;
                this.supportedFeatures = gspit.ui.applyCssGetSupportedFeatures();
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
                    d = new gspit.parallaxScroller.tile({
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
                return !a ? null : a === window ? (a = gspit.parallaxScroller.utils.getWindowSize(), {
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
                    gspit.ui.applyCss(this.holder, a, {
                        x: this.holderLocation.x,
                        y: this.holderLocation.y,
                        width: this.holderWidth,
                        height: this.holderHeight,
                        visibility: this.visibility
                    });
                    gspit.ui.applyCss(this.img, a, {
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
        }
    }
}(jQuery);

gspit.ui = function (a, h) {
    return {
        downloadLinks: "",
        osPlaceholders: "",
        headerMain: null,
        init: function () {
            var b = gspit.ui.isMobilePage();
            this.downloadLinks = a(".js-button-download");
            this.osPlaceholders = a(".js-os");
            this.headerMain = a("#js-header-main");
            gspit.user.isClickOnce() && this.downloadLinks.bind("click", function () {
                setTimeout(function () {
                    window.location.href = "/" + gspit.user.getMarket() + "/download/windows/"
                }, 3E3)
            });
            1024 >= window.innerWidth && (gspit.user.isMobile() && a("body").hasClass("reboot")) && this.headerMain.css("position",
                "absolute");
            b || (this.setElementHeight(a(".js-fullheight"), a(window).height()), a(window).bind("resize", function () {
                gspit.ui.setElementHeight(a(".js-fullheight"), a(window).height())
            }), this.setElementHeight(a(".js-two-thirds-window"), a(window).height() * (2 / 3)), a(window).bind("resize", function () {
                gspit.ui.setElementHeight(a(".js-two-thirds-window"), a(window).height() * (2 / 3))
            }));
            0 < this.downloadLinks.length && this.updateDownloadLinks();
            0 < this.osPlaceholders.length && this.updateOsPlaceholders();
            this.updateLazyloadBackgrounds(a(".bg-lazyload"));
            this.message.init();
            this.nav.init();
            Modernizr.input.placeholder || a("[placeholder]").each(function () {
                a(this).focus(function () {
                    var b = a(this);
                    b.val() === b.attr("placeholder") && (b.val(""), b.removeClass("has-placeholder"))
                }).blur(function () {
                    var b = a(this);
                    "" === b.val() && (b.val(b.attr("placeholder")), b.addClass("has-placeholder"))
                }).parents("form").submit(function () {
                    a(this).find("[placeholder]").each(function () {
                        var b = a(this);
                        b.val() === b.attr("placeholder") && b.val("")
                    })
                })
            }).blur()
        },
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
        },
        updateDownloadLinks: function () {
            // this.downloadLinks.each(function () {
            //     var b = a(this).attr("href");
            //     a(this).attr("href", gspit.download.getDownloadPageURI(b))
            // })
        },
        updateOsPlaceholders: function () {
            this.osPlaceholders.text(gspit.user.getOs())
        },
        setElementHeight: function (b, e) {
            b.each(function () {
                a(this).css("height", e)
            })
        },
        handleNoBackgroundSize: function (b, a) {
            b.backstretch(gspit.environment.getStaticUrl() + a, {
                fade: 250
            })
        },
        updateLazyloadBackgrounds: function (b) {
            b.each(function () {
                var b = a(this),
                    c = "url(" + gspit.environment.getStaticUrl() + a(this).attr("data-bg-image") + ")";
                b.css("backgroundImage", c)
            })
        },
        message: {
            element: null,
            close: null,
            name: null,
            init: function () {
                var b = this,
                    e = function () {
                        b.remove()
                    };
                this.element = a("#js-message-notice");
                0 !== this.element.length && (this.close = a(".close", this.element), this.name = this.element.data("name"), h.get(this.name) ? this.element.remove() : (this.element.addClass("is-visible"), this.intSignup.init(), this.close.bind("click", e)))
            },
            remove: function () {
                h.set({
                    name: this.name,
                    value: "1"
                });
                this.element.remove()
            },
            intSignup: {
                form: null,
                init: function () {
                    var b = this,
                        e = function (a) {
                            b.addToWaitingListFromBar(a)
                        };
                    this.form = a("#js-email-form");
                    0 !== this.form.length && (this.form.submit(e), a("#js-email-form-submit").click(function (a) {
                        a.preventDefault();
                        b.form.submit()
                    }))
                },
                addToWaitingListFromBar: function (b) {
                    function e(b) {
                        b.status && ("ok" === b.status && (h.set({
                            name: "int-email",
                            value: "1"
                        }), setTimeout(function () {
                            a("#js-message-notice").slideUp()
                        }, 5E3)), a("#js-email-error").text(b.message).css("display",
                            "block"))
                    }
                    b.preventDefault();
                    b = a("#js-int-signup-email").attr("value");
                    "" === b ? a("#js-int-signup-email").focus() : a.get("/" + gspit.user.getMarket() + "/xhr/json/add-to-waiting-list.php", {
                        email: b
                    }, e, "json")
                }
            }
        },
        nav: {
            navWrap: null,
            headerNav: null,
            navList: null,
            toggleNav: null,
            toggleIcon: null,
            accountWidget: null,
            accountList: null,
            avatarLink: null,
            displayName: null,
            init: function () {
                this.navWrap = a("#js-nav-wrap");
                this.headerNav = a("#js-nav-header");
                this.navList = a("#js-nav-list");
                this.toggleNav = a("#js-toggle-nav");
                this.toggleIcon = a("#js-icon-toggle-nav");
                this.accountWidget = a("#js-account");
                this.accountList = a("#js-account-list");
                this.avatarLink = a("#js-avatar-link");
                this.displayName = a("#js-display-name");
                gspit.ui.adapt("screen and (max-width: 44.6875em)", a.proxy(this.handleMql, this), a.proxy(this.handleResize, this))
            },
            handleMql: function (b) {
                b.matches && a("body").hasClass("reboot") ? this.mobify() : this.desktopify()
            },
            handleResize: function () {
                715 > (window.innerWidth || document.documentElement.clientWidth) && a("body").hasClass("reboot") ? this.mobify() : this.desktopify()
            },
            mobify: function () {
                var b = this,
                    e, c, f, d;
                b.accountList.hide();
                b.accountWidget.unbind();
                b.avatarLink.unbind().bind("click", function () {
                    gspit.utils.redirect(a(this).data("href"))
                }).append(b.displayName).prependTo(b.navWrap);
                b.navWrap.removeClass("is-expanded").addClass("is-collapsed");
                e = this.headerNav.height();
                c = this.toggleNav.height();
                f = e + c - 3;
                d = function (a, e) {
                    Modernizr.csstransforms && Modernizr.csstransitions ? (b.headerNav.css({
                        "-webkit-transition": "-webkit-transform " + a,
                        "-moz-transition": "-moz-transform " + a,
                        "-ms-transition": "-ms-transform " + a,
                        "-o-transition": "-o-transform " + a,
                        transition: "transform " + a,
                        "-webkit-transform": e,
                        "-moz-transform": e,
                        "-ms-transform": e,
                        "-o-transform": e,
                        transform: e
                    }), b.setState()) : b.headerNav.slideToggle()
                };
                b.toggleIcon.unbind().bind("click", function () {
                    d(".5s ease-in 0s, background-color .5s ease-in 0s", "translateY(" + f + "px)");
                    f = -f
                })
            },
            desktopify: function () {
                var b = this;
                b.avatarLink.unbind();
                b.accountWidget.prepend(b.avatarLink, b.displayName).unbind();
                b.accountWidget.hasClass("is-loggedin") && b.accountWidget.bind("click", function (a) {
                    if ("js-avatar-link" === a.target.id || "js-avatar" === a.target.id || "js-display-name" === a.target.id) a.preventDefault(), b.accountList.css({
                        top: "120%",
                        right: "-10px"
                    }).fadeToggle(100)
                });
                b.navWrap.removeClass("is-collapsed is-expanded");
                this.headerNav.attr("style", "");
                this.toggleNav.unbind("click", b.setState)
            },
            setState: function () {
                this.navWrap.toggleClass("is-collapsed is-expanded")
            }
        },
        adapt: function (b, a, c) {
            window.matchMedia ? this._handleMatchMedia(b, a) : this._handleResize(c)
        },
        _handleMatchMedia: function (a, e) {
            var c = window.matchMedia(a),
                f = "@media " + a + "{.mql {} }";
            if (null !== document.getElementById("mql-style")) {
                var d = document.getElementById("mql-style"); - 1 === d.textContent.indexOf(a) && d.appendChild(document.createTextNode(f))
            } else d = document.createElement("style"), d.setAttribute("id", "mql-style"), d.appendChild(document.createTextNode(f)), document.head.appendChild(d);
            c.addListener(e);
            e(c)
        },
        _handleResize: function (b) {
            a(window).bind("resize", function () {
                b()
            }).trigger("resize")
        }
    }
}(jQuery);

gspit.home = function (b) {
    return {
        init: function () {
            var c = gspit.ui.isMobilePage();
            b("#js-header-main .nav-link.features").click(function (a) {
                gspit.home.arrows.goToSection("section-listen-everywhere");
                a.preventDefault();
                a.stopPropagation()
            });
            b("#js-header-main .nav-link.premium").click(function (a) {
                gspit.home.arrows.goToSection("section-premium");
                a.preventDefault();
                a.stopPropagation()
            });
            b("#js-header-main .logo").click(function (a) {
                gspit.home.arrows.goToSection();
                a.preventDefault();
                a.stopPropagation()
            });
            b("#intro-premium-button").click(function (a) {
                gspit.home.arrows.goToSection("section-premium");
                a.preventDefault();
                a.stopPropagation()
            });
            if (!c) {
                var a = function () {
                    b(".section-auto-size").each(function () {
                        var a = b(this),
                            c = b(window).height() * parseFloat(a.data("auto-size"));
                        a.css("height", c);
                        var e = a.find(".box").outerHeight();
                        e > c && a.css("height", e)
                    })
                };
                b(window).on("resize", function () {
                    a()
                });
                a();
                b(window).load(function () {
                    a()
                })
            }
            //gspit.home.artworkStrip.init(".artwork-strip", gspit.imageStripArtwork.artwork, c ? 32 : 64);
            if (c) b("div.scroller-main").each(function () {
                var a = b(this);
                a.addClass("parallax-disabled");
                a.css("background-image", "url(" + a.data("image-mobile") + ")");
                var c = 0.5 * b(window).height() + (a.data("extra-height-mobile") || 0);
                a.css("height", 250 > c ? 250 : c)
            });
            else if (b.browser.msie || Modernizr.touch) {
                var e = b(window).height(),
                    d = function (a, c) {
                        var b = Math.max(0.75 * c, 200) + (a.data("extra-height") || 0);
                        a.css("height", b + "px")
                    };
                b("div.scroller-main").each(function () {
                    var a = b(this);
                    a.addClass("parallax-disabled");
                    a.css("background-image", "url(" + a.data("image") + ")");
                    d(a, e)
                });
                b(window).resize(function () {
                    var a = b(window).height();
                    b("div.scroller-main").each(function () {
                        var c = b(this);
                        d(c, a)
                    })
                })
            } else gspit.parallaxScroller.scroller.init({
                speed: 0.2,
                items: b("div.scroller-main")
            });
            gspit.home.arrows.init();
            b(".dummy-firstload").hide();
            b(".content-main").css("visibility", "visible")
        },
        arrows: {
            init: function () {
                b(".section-arrow").each(function () {
                    var c = b(this);
                    c.click(function (a) {
                        a.preventDefault();
                        gspit.home.arrows.goToSection(c.data("target"))
                    })
                })
            },
            goToSection: function (c) {
                if (null == c) b("html, body").animate({
                    scrollTop: "0"
                }, 1E3, "easeInOutCubic");
                else {
                    var a = 0;
                    "fixed" == b("#js-header-main").css("position") && (a = b("#js-header-main").outerHeight());
                    var e = b(window).height() - a,
                        c = b("#" + c),
                        d = c.outerHeight() + (c.hasClass("has-arrow-button-below") ? 33 : 0),
                        a = d > e ? c.offset().top - a : c.offset().top - (e - d) / 2 - a;
                    b("html, body").animate({
                        scrollTop: a
                    }, 1E3, "easeInOutCubic")
                }
            }
        },
        artworkStrip: {
            init: function (c, a, e) {
                this.SMALL_TILE_SIZE = e;
                this.STRIP_OFFSET_TOP = 3 * e;
                this.inner = b(c);
                this.artwork = a;
                this.artworkCount = Math.floor(Math.random() * this.artwork.length);
                this.supportedFeatures = gspit.ui.applyCssGetSupportedFeatures();
                this.tiles = [];
                this.grid = [];
                this.yPosTop = -2;
                this.yPosBot = 1;
                this.xPos = 0;
                this.xPosOfNextLargeTile = this.random(0, 2);
                this.lastTopChange = this.lastBotChange = 0;
                this.redrawTiles();
                var d = this;
                b(window).resize(function () {
                    d.redrawTiles()
                });
                return this
            },
            redrawTiles: function () {
                gspit.ui.applyCss(this.inner[0], this.supportedFeatures, {
                    y: b("#section-soundtrack").offset().top + b("#section-soundtrack").outerHeight() - this.inner.height() / 2,
                    width: b(window).width()
                });
                var c = Math.floor(b(window).width() / this.SMALL_TILE_SIZE) + 1;
                c > this.xPos && this.drawTiles(c)
            },
            drawTiles: function (c) {
                for (; this.xPos < c; this.xPos++) {
                    if (this.xPosOfNextLargeTile == this.xPos) {
                        for (var a = this.xPosOfNextLargeTile, b = this.random(-2, 0), a = gspit.home.artworkStrip.tile.init(this, a, b, 3); !a.unique();) a.x++, this.xPosOfNextLargeTile++;
                        a.add();
                        this.xPosOfNextLargeTile += this.random(5, 8)
                    }
                    for (a = this.yPosTop; a < this.yPosBot; a++) if (this.isEmpty(this.xPos, a)) {
                        var b = 1,
                            d = a < this.yPosBot - 1;
                        0.8 > Math.random() && d && (b = 2);
                        b = gspit.home.artworkStrip.tile.init(this,
                        this.xPos, a, b);
                        b.unique() || (b = gspit.home.artworkStrip.tile.init(this, this.xPos, a, 1));
                        b.add()
                    }
                    if (-1 == this.lastTopChange) this.lastTopChange = 0;
                    else {
                        do a = this.random(-1, 1), d = this.yPosTop + a, b = this.yPosBot - d;
                        while (-4 > d || -1 < d || 3 > b || 4 < b);
                        this.yPosTop = d;
                        this.lastTopChange = a
                    }
                    if (1 == this.lastBotChange) this.lastBotChange = 0;
                    else {
                        do a = this.random(-1, 1), d = this.yPosBot + a, b = d - this.yPosTop;
                        while (4 < d || 1 > d || 3 > b || 4 < b);
                        this.yPosBot = d;
                        this.lastBotChange = a
                    }
                }
            },
            random: function (b, a) {
                if (b > a) var e = b,
                    b = a,
                    a = e;
                return Math.floor(Math.random() * (a - b + 1)) + b
            },
            isEmpty: function (b, a) {
                return null == this.grid[b] || null == this.grid[b][a]
            },
            isColumnFull: function (b, a, e) {
                if (null == this.grid[b]) return !1;
                for (; a < e; a++) if (null == this.grid[b][a]) return !1;
                return !0
            },
            tile: {
                init: function (b, a, e, d) {
                    this.strip = b;
                    this.x = a;
                    this.y = e;
                    this.size = d;
                    return this
                },
                unique: function () {
                    for (var b = 0; b < this.size; b++) for (var a = 0; a < this.size; a++) if (!this.strip.isEmpty(this.x + b, this.y + a)) return !1;
                    return !0
                },
                add: function () {
                    this.strip.tiles.push(this);
                    for (var b = 0; b < this.size; b++) for (var a = 0; a < this.size; a++) {
                        var e = this.x + b,
                            d = this.y + a;
                        null == this.strip.grid[e] && (this.strip.grid[e] = {});
                        this.strip.grid[e][d] = this
                    }
                    this.draw()
                },
                draw: function () {
                    this.div = b("<div />");
                    this.div.addClass("artwork-strip-tile");
                    this.strip.artworkCount += 5;
                    this.strip.artworkCount >= this.strip.artwork.length && (this.strip.artworkCount = 0);
                    gspit.ui.applyCss(this.div[0], this.strip.supportedFeatures, {
                        x: this.strip.SMALL_TILE_SIZE * this.x,
                        y: this.strip.SMALL_TILE_SIZE * this.y + this.strip.STRIP_OFFSET_TOP,
                        width: this.strip.SMALL_TILE_SIZE * this.size,
                        height: this.strip.SMALL_TILE_SIZE * this.size,
                        backgroundImageUrl: "//d2us6zencw9qvn.cloudfront.net/website_reboot_assets/image_strip_" + (64 == this.strip.SMALL_TILE_SIZE || 32 == this.strip.SMALL_TILE_SIZE ? "2" : "3") + "/" + this.strip.SMALL_TILE_SIZE * this.size + "/" + this.strip.artwork[this.strip.artworkCount] + ".jpg"
                    });
                    this.strip.inner.append(this.div)
                }
            }
        }
    }
}(jQuery);

gspit.user = function (b, a, m) {
    var c = null,
        d = null,
        e = null,
        f = null,
        g = null,
        h = null,
        i = null,
        j = null,
        k = null,
        l = null,
        n = {
            getBrowser: function () {
                null === d && (d = b.browser);
                return d
            },
            getBrowserVersion: function () {
                null === e && (e = b.version);
                return e
            },
            getLang: function () {
                null === i && (i = m("body").attr("class").match(/l-([\w]+)/)[1]);
                return i
            },
            getMarket: function () {
                null === j && (j = m("body").attr("class").match(/m-([\w-]+)/)[1]);
                return j
            },
            getOs: function () {
                null === k && (k = b.OS.toLowerCase() || "other");
                return k
            },
            isAndroid: function () {
                null === f && (f = "android" === this.getOs());
                return f
            },
            isClickOnce: function () {
                if (null === c) if ("windows" == this.getOs() && "Explorer" == this.getBrowser() && 6 < this.getBrowserVersion()) if (9 > this.getBrowserVersion()) for (var b = /.NET CLR ([0-9])./g, a; a = b.exec(navigator.userAgent);) 2 <= parseInt(a[1]) && (c = !0);
                else c = navigator.userAgent.match(/Windows NT 6\.2/) ? !1 : !0;
                else c = !1;
                return c
            },
            isiOS: function () {
                null === g && (g = "iphone/ipod" === this.getOs() || "ipad" === this.getOs());
                return g
            },
            isMobile: function () {
                null === h && (h = "iphone/ipod" === this.getOs() || "ipad" === this.getOs() || "android" === this.getOs() || "windows phone" === this.getOs());
                return h
            },
            supportsVideo: function () {
                null === l && (l = a.video && ("" != a.video.h264 || "" != a.video.webm) && !n.isMobile() ? !0 : !1);
                return l
            }
        };
    return n
}(browserDetect, Modernizr, jQuery);

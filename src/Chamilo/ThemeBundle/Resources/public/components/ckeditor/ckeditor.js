﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    if (!window.CKEDITOR || !window.CKEDITOR.dom)window.CKEDITOR || (window.CKEDITOR = function () {
        var a = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i, e = {
            timestamp: "F61C",
            version: "4.4.8 (Standard)",
            revision: "ccd0038",
            rnd: Math.floor(900 * Math.random()) + 100,
            _: {pending: [], basePathSrcPattern: a},
            status: "unloaded",
            basePath: function () {
                var c = window.CKEDITOR_BASEPATH || "";
                if (!c)for (var d = document.getElementsByTagName("script"), b = 0; b < d.length; b++) {
                    var f = d[b].src.match(a);
                    if (f) {
                        c = f[1];
                        break
                    }
                }
                -1 == c.indexOf(":/") &&
                "//" != c.slice(0, 2) && (c = 0 === c.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + c : location.href.match(/^[^\?]*\/(?:)/)[0] + c);
                if (!c)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
                return c
            }(),
            getUrl: function (a) {
                -1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
                this.timestamp && ("/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a)) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
                return a
            },
            domReady: function () {
                function a() {
                    try {
                        document.addEventListener ? (document.removeEventListener("DOMContentLoaded", a, !1), d()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), d())
                    } catch (b) {
                    }
                }

                function d() {
                    for (var a; a = b.shift();)a()
                }

                var b = [];
                return function (d) {
                    function g() {
                        try {
                            document.documentElement.doScroll("left")
                        } catch (d) {
                            setTimeout(g, 1);
                            return
                        }
                        a()
                    }

                    b.push(d);
                    "complete" === document.readyState && setTimeout(a, 1);
                    if (1 == b.length)if (document.addEventListener)document.addEventListener("DOMContentLoaded",
                        a, !1), window.addEventListener("load", a, !1); else if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", a);
                        window.attachEvent("onload", a);
                        d = !1;
                        try {
                            d = !window.frameElement
                        } catch (e) {
                        }
                        document.documentElement.doScroll && d && g()
                    }
                }
            }()
        }, b = window.CKEDITOR_GETURL;
        if (b) {
            var g = e.getUrl;
            e.getUrl = function (a) {
                return b.call(e, a) || g.call(e, a)
            }
        }
        return e
    }()), CKEDITOR.event || (CKEDITOR.event = function () {
    }, CKEDITOR.event.implementOn = function (a) {
        var e = CKEDITOR.event.prototype, b;
        for (b in e)a[b] == null && (a[b] = e[b])
    },
        CKEDITOR.event.prototype = function () {
            function a(a) {
                var c = e(this);
                return c[a] || (c[a] = new b(a))
            }

            var e = function (a) {
                a = a.getPrivate && a.getPrivate() || a._ || (a._ = {});
                return a.events || (a.events = {})
            }, b = function (a) {
                this.name = a;
                this.listeners = []
            };
            b.prototype = {
                getListenerIndex: function (a) {
                    for (var c = 0, d = this.listeners; c < d.length; c++)if (d[c].fn == a)return c;
                    return -1
                }
            };
            return {
                define: function (b, c) {
                    var d = a.call(this, b);
                    CKEDITOR.tools.extend(d, c, true)
                }, on: function (b, c, d, i, f) {
                    function h(a, k, f, h) {
                        a = {
                            name: b,
                            sender: this,
                            editor: a,
                            data: k,
                            listenerData: i,
                            stop: f,
                            cancel: h,
                            removeListener: e
                        };
                        return c.call(d, a) === false ? false : a.data
                    }

                    function e() {
                        n.removeListener(b, c)
                    }

                    var k = a.call(this, b);
                    if (k.getListenerIndex(c) < 0) {
                        k = k.listeners;
                        d || (d = this);
                        isNaN(f) && (f = 10);
                        var n = this;
                        h.fn = c;
                        h.priority = f;
                        for (var o = k.length - 1; o >= 0; o--)if (k[o].priority <= f) {
                            k.splice(o + 1, 0, h);
                            return {removeListener: e}
                        }
                        k.unshift(h)
                    }
                    return {removeListener: e}
                }, once: function () {
                    var a = Array.prototype.slice.call(arguments), c = a[1];
                    a[1] = function (a) {
                        a.removeListener();
                        return c.apply(this,
                            arguments)
                    };
                    return this.on.apply(this, a)
                }, capture: function () {
                    CKEDITOR.event.useCapture = 1;
                    var a = this.on.apply(this, arguments);
                    CKEDITOR.event.useCapture = 0;
                    return a
                }, fire: function () {
                    var a = 0, c = function () {
                        a = 1
                    }, d = 0, b = function () {
                        d = 1
                    };
                    return function (f, h, j) {
                        var k = e(this)[f], f = a, n = d;
                        a = d = 0;
                        if (k) {
                            var o = k.listeners;
                            if (o.length)for (var o = o.slice(0), p, m = 0; m < o.length; m++) {
                                if (k.errorProof)try {
                                    p = o[m].call(this, j, h, c, b)
                                } catch (l) {
                                } else p = o[m].call(this, j, h, c, b);
                                p === false ? d = 1 : typeof p != "undefined" && (h = p);
                                if (a || d)break
                            }
                        }
                        h =
                            d ? false : typeof h == "undefined" ? true : h;
                        a = f;
                        d = n;
                        return h
                    }
                }(), fireOnce: function (a, c, d) {
                    c = this.fire(a, c, d);
                    delete e(this)[a];
                    return c
                }, removeListener: function (a, c) {
                    var d = e(this)[a];
                    if (d) {
                        var b = d.getListenerIndex(c);
                        b >= 0 && d.listeners.splice(b, 1)
                    }
                }, removeAllListeners: function () {
                    var a = e(this), c;
                    for (c in a)delete a[c]
                }, hasListeners: function (a) {
                    return (a = e(this)[a]) && a.listeners.length > 0
                }
            }
        }()), CKEDITOR.editor || (CKEDITOR.editor = function () {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire =
        function (a, e) {
            a in {instanceReady: 1, loaded: 1} && (this[a] = true);
            return CKEDITOR.event.prototype.fire.call(this, a, e, this)
        }, CKEDITOR.editor.prototype.fireOnce = function (a, e) {
        a in {instanceReady: 1, loaded: 1} && (this[a] = true);
        return CKEDITOR.event.prototype.fireOnce.call(this, a, e, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function () {
        var a = navigator.userAgent.toLowerCase(), e = {
            ie: a.indexOf("trident/") > -1,
            webkit: a.indexOf(" applewebkit/") > -1,
            air: a.indexOf(" adobeair/") > -1,
            mac: a.indexOf("macintosh") > -1,
            quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
            mobile: a.indexOf("mobile") > -1,
            iOS: /(ipad|iphone|ipod)/.test(a),
            isCustomDomain: function () {
                if (!this.ie)return false;
                var a = document.domain, d = window.location.hostname;
                return a != d && a != "[" + d + "]"
            },
            secure: location.protocol == "https:"
        };
        e.gecko = navigator.product == "Gecko" && !e.webkit && !e.ie;
        if (e.webkit)a.indexOf("chrome") > -1 ? e.chrome = true : e.safari = true;
        var b = 0;
        if (e.ie) {
            b = e.quirks || !document.documentMode ?
                parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode;
            e.ie9Compat = b == 9;
            e.ie8Compat = b == 8;
            e.ie7Compat = b == 7;
            e.ie6Compat = b < 7 || e.quirks
        }
        if (e.gecko) {
            var g = a.match(/rv:([\d\.]+)/);
            if (g) {
                g = g[1].split(".");
                b = g[0] * 1E4 + (g[1] || 0) * 100 + (g[2] || 0) * 1
            }
        }
        e.air && (b = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
        e.webkit && (b = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
        e.version = b;
        e.isCompatible = e.iOS && b >= 534 || !e.mobile && (e.ie && b > 6 || e.gecko && b >= 2E4 || e.air && b >= 1 || e.webkit && b >= 522 || false);
        e.hidpi = window.devicePixelRatio >=
            2;
        e.needsBrFiller = e.gecko || e.webkit || e.ie && b > 10;
        e.needsNbspFiller = e.ie && b < 11;
        e.cssClass = "cke_browser_" + (e.ie ? "ie" : e.gecko ? "gecko" : e.webkit ? "webkit" : "unknown");
        if (e.quirks)e.cssClass = e.cssClass + " cke_browser_quirks";
        if (e.ie)e.cssClass = e.cssClass + (" cke_browser_ie" + (e.quirks ? "6 cke_browser_iequirks" : e.version));
        if (e.air)e.cssClass = e.cssClass + " cke_browser_air";
        if (e.iOS)e.cssClass = e.cssClass + " cke_browser_ios";
        if (e.hidpi)e.cssClass = e.cssClass + " cke_hidpi";
        return e
    }()), "unloaded" == CKEDITOR.status && function () {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function () {
            if (CKEDITOR.status != "basic_ready")CKEDITOR.loadFullCore._load = 1; else {
                delete CKEDITOR.loadFullCore;
                var a = document.createElement("script");
                a.type = "text/javascript";
                a.src = CKEDITOR.basePath + "ckeditor.js";
                document.getElementsByTagName("head")[0].appendChild(a)
            }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function (a) {
            (this._.pending || (this._.pending = [])).push(a)
        };
        (function () {
            CKEDITOR.domReady(function () {
                var a = CKEDITOR.loadFullCore, e = CKEDITOR.loadFullCoreTimeout;
                if (a) {
                    CKEDITOR.status =
                        "basic_ready";
                    a && a._load ? a() : e && setTimeout(function () {
                        CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                    }, e * 1E3)
                }
            })
        })();
        CKEDITOR.status = "basic_loaded"
    }(), CKEDITOR.dom = {}, function () {
        var a = [], e = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "", b = /&/g, g = />/g, c = /</g, d = /"/g, i = /&amp;/g, f = /&gt;/g, h = /&lt;/g, j = /&quot;/g;
        CKEDITOR.on("reset", function () {
            a = []
        });
        CKEDITOR.tools = {
            arrayCompare: function (a, c) {
                if (!a && !c)return true;
                if (!a || !c || a.length != c.length)return false;
                for (var d = 0; d <
                a.length; d++)if (a[d] != c[d])return false;
                return true
            },
            clone: function (a) {
                var c;
                if (a && a instanceof Array) {
                    c = [];
                    for (var d = 0; d < a.length; d++)c[d] = CKEDITOR.tools.clone(a[d]);
                    return c
                }
                if (a === null || typeof a != "object" || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp || a.nodeType || a.window === a)return a;
                c = new a.constructor;
                for (d in a)c[d] = CKEDITOR.tools.clone(a[d]);
                return c
            },
            capitalize: function (a, c) {
                return a.charAt(0).toUpperCase() + (c ? a.slice(1) : a.slice(1).toLowerCase())
            },
            extend: function (a) {
                var c = arguments.length, d, b;
                if (typeof(d = arguments[c - 1]) == "boolean")c--; else if (typeof(d = arguments[c - 2]) == "boolean") {
                    b = arguments[c - 1];
                    c = c - 2
                }
                for (var f = 1; f < c; f++) {
                    var g = arguments[f], i;
                    for (i in g)if (d === true || a[i] == null)if (!b || i in b)a[i] = g[i]
                }
                return a
            },
            prototypedCopy: function (a) {
                var c = function () {
                };
                c.prototype = a;
                return new c
            },
            copy: function (a) {
                var c = {}, d;
                for (d in a)c[d] = a[d];
                return c
            },
            isArray: function (a) {
                return Object.prototype.toString.call(a) == "[object Array]"
            },
            isEmpty: function (a) {
                for (var c in a)if (a.hasOwnProperty(c))return false;
                return true
            },
            cssVendorPrefix: function (a, c, d) {
                if (d)return e + a + ":" + c + ";" + a + ":" + c;
                d = {};
                d[a] = c;
                d[e + a] = c;
                return d
            },
            cssStyleToDomStyle: function () {
                var a = document.createElement("div").style, c = typeof a.cssFloat != "undefined" ? "cssFloat" : typeof a.styleFloat != "undefined" ? "styleFloat" : "float";
                return function (a) {
                    return a == "float" ? c : a.replace(/-./g, function (a) {
                        return a.substr(1).toUpperCase()
                    })
                }
            }(),
            buildStyleHtml: function (a) {
                for (var a = [].concat(a), c, d = [], b = 0; b < a.length; b++)if (c = a[b])/@import|[{}]/.test(c) ? d.push("<style>" +
                    c + "</style>") : d.push('<link type="text/css" rel=stylesheet href="' + c + '">');
                return d.join("")
            },
            htmlEncode: function (a) {
                return ("" + a).replace(b, "&amp;").replace(g, "&gt;").replace(c, "&lt;")
            },
            htmlDecode: function (a) {
                return a.replace(i, "&").replace(f, ">").replace(h, "<")
            },
            htmlEncodeAttr: function (a) {
                return a.replace(d, "&quot;").replace(c, "&lt;").replace(g, "&gt;")
            },
            htmlDecodeAttr: function (a) {
                return a.replace(j, '"').replace(h, "<").replace(f, ">")
            },
            getNextNumber: function () {
                var a = 0;
                return function () {
                    return ++a
                }
            }(),
            getNextId: function () {
                return "cke_" + this.getNextNumber()
            },
            override: function (a, c) {
                var d = c(a);
                d.prototype = a.prototype;
                return d
            },
            setTimeout: function (a, c, d, b, f) {
                f || (f = window);
                d || (d = f);
                return f.setTimeout(function () {
                    b ? a.apply(d, [].concat(b)) : a.apply(d)
                }, c || 0)
            },
            trim: function () {
                var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function (c) {
                    return c.replace(a, "")
                }
            }(),
            ltrim: function () {
                var a = /^[ \t\n\r]+/g;
                return function (c) {
                    return c.replace(a, "")
                }
            }(),
            rtrim: function () {
                var a = /[ \t\n\r]+$/g;
                return function (c) {
                    return c.replace(a,
                        "")
                }
            }(),
            indexOf: function (a, c) {
                if (typeof c == "function")for (var d = 0, b = a.length; d < b; d++) {
                    if (c(a[d]))return d
                } else {
                    if (a.indexOf)return a.indexOf(c);
                    d = 0;
                    for (b = a.length; d < b; d++)if (a[d] === c)return d
                }
                return -1
            },
            search: function (a, c) {
                var d = CKEDITOR.tools.indexOf(a, c);
                return d >= 0 ? a[d] : null
            },
            bind: function (a, c) {
                return function () {
                    return a.apply(c, arguments)
                }
            },
            createClass: function (a) {
                var c = a.$, d = a.base, b = a.privates || a._, f = a.proto, a = a.statics;
                !c && (c = function () {
                    d && this.base.apply(this, arguments)
                });
                if (b)var g = c, c = function () {
                    var a =
                        this._ || (this._ = {}), c;
                    for (c in b) {
                        var d = b[c];
                        a[c] = typeof d == "function" ? CKEDITOR.tools.bind(d, this) : d
                    }
                    g.apply(this, arguments)
                };
                if (d) {
                    c.prototype = this.prototypedCopy(d.prototype);
                    c.prototype.constructor = c;
                    c.base = d;
                    c.baseProto = d.prototype;
                    c.prototype.base = function () {
                        this.base = d.prototype.base;
                        d.apply(this, arguments);
                        this.base = arguments.callee
                    }
                }
                f && this.extend(c.prototype, f, true);
                a && this.extend(c, a, true);
                return c
            },
            addFunction: function (c, d) {
                return a.push(function () {
                        return c.apply(d || this, arguments)
                    }) - 1
            },
            removeFunction: function (c) {
                a[c] = null
            },
            callFunction: function (c) {
                var d = a[c];
                return d && d.apply(window, Array.prototype.slice.call(arguments, 1))
            },
            cssLength: function () {
                var a = /^-?\d+\.?\d*px$/, c;
                return function (d) {
                    c = CKEDITOR.tools.trim(d + "") + "px";
                    return a.test(c) ? c : d || ""
                }
            }(),
            convertToPx: function () {
                var a;
                return function (c) {
                    if (!a) {
                        a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
                        CKEDITOR.document.getBody().append(a)
                    }
                    if (!/%$/.test(c)) {
                        a.setStyle("width",
                            c);
                        return a.$.clientWidth
                    }
                    return c
                }
            }(),
            repeat: function (a, c) {
                return Array(c + 1).join(a)
            },
            tryThese: function () {
                for (var a, c = 0, d = arguments.length; c < d; c++) {
                    var b = arguments[c];
                    try {
                        a = b();
                        break
                    } catch (f) {
                    }
                }
                return a
            },
            genKey: function () {
                return Array.prototype.slice.call(arguments).join("-")
            },
            defer: function (a) {
                return function () {
                    var c = arguments, d = this;
                    window.setTimeout(function () {
                        a.apply(d, c)
                    }, 0)
                }
            },
            normalizeCssText: function (a, c) {
                var d = [], b, f = CKEDITOR.tools.parseCssText(a, true, c);
                for (b in f)d.push(b + ":" + f[b]);
                d.sort();
                return d.length ? d.join(";") + ";" : ""
            },
            convertRgbToHex: function (a) {
                return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function (a, c, d, b) {
                    a = [c, d, b];
                    for (c = 0; c < 3; c++)a[c] = ("0" + parseInt(a[c], 10).toString(16)).slice(-2);
                    return "#" + a.join("")
                })
            },
            parseCssText: function (a, c, d) {
                var b = {};
                if (d) {
                    d = new CKEDITOR.dom.element("span");
                    d.setAttribute("style", a);
                    a = CKEDITOR.tools.convertRgbToHex(d.getAttribute("style") || "")
                }
                if (!a || a == ";")return b;
                a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,
                    function (a, d, f) {
                        if (c) {
                            d = d.toLowerCase();
                            d == "font-family" && (f = f.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
                            f = CKEDITOR.tools.trim(f)
                        }
                        b[d] = f
                    });
                return b
            },
            writeCssText: function (a, c) {
                var d, b = [];
                for (d in a)b.push(d + ":" + a[d]);
                c && b.sort();
                return b.join("; ")
            },
            objectCompare: function (a, c, d) {
                var b;
                if (!a && !c)return true;
                if (!a || !c)return false;
                for (b in a)if (a[b] != c[b])return false;
                if (!d)for (b in c)if (a[b] != c[b])return false;
                return true
            },
            objectKeys: function (a) {
                var c = [], d;
                for (d in a)c.push(d);
                return c
            },
            convertArrayToObject: function (a, c) {
                var d = {};
                arguments.length == 1 && (c = true);
                for (var b = 0, f = a.length; b < f; ++b)d[a[b]] = c;
                return d
            },
            fixDomain: function () {
                for (var a; ;)try {
                    a = window.parent.document.domain;
                    break
                } catch (c) {
                    a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
                    if (!a)break;
                    document.domain = a
                }
                return !!a
            },
            eventsBuffer: function (a, c) {
                function d() {
                    f = (new Date).getTime();
                    b = false;
                    c()
                }

                var b, f = 0;
                return {
                    input: function () {
                        if (!b) {
                            var c = (new Date).getTime() - f;
                            c < a ? b = setTimeout(d, a - c) : d()
                        }
                    }, reset: function () {
                        b && clearTimeout(b);
                        b = f = 0
                    }
                }
            },
            enableHtml5Elements: function (a, c) {
                for (var d = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"], b = d.length, f; b--;) {
                    f = a.createElement(d[b]);
                    c && a.appendChild(f)
                }
            },
            checkIfAnyArrayItemMatches: function (a, c) {
                for (var d = 0, b = a.length; d < b; ++d)if (a[d].match(c))return true;
                return false
            },
            checkIfAnyObjectPropertyMatches: function (a, c) {
                for (var d in a)if (d.match(c))return true;
                return false
            },
            transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
        }
    }(), CKEDITOR.dtd = function () {
        var a = CKEDITOR.tools.extend, e = function (a, c) {
            for (var d = CKEDITOR.tools.clone(a), b = 1; b < arguments.length; b++) {
                var c = arguments[b], f;
                for (f in c)delete d[f]
            }
            return d
        }, b = {}, g = {}, c = {
            address: 1,
            article: 1,
            aside: 1,
            blockquote: 1,
            details: 1,
            div: 1,
            dl: 1,
            fieldset: 1,
            figure: 1,
            footer: 1,
            form: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 1,
            h6: 1,
            header: 1,
            hgroup: 1,
            hr: 1,
            main: 1,
            menu: 1,
            nav: 1,
            ol: 1,
            p: 1,
            pre: 1,
            section: 1,
            table: 1,
            ul: 1
        }, d = {
            command: 1,
            link: 1,
            meta: 1,
            noscript: 1,
            script: 1,
            style: 1
        }, i = {}, f = {"#": 1}, h = {center: 1, dir: 1, noframes: 1};
        a(b, {
                a: 1,
                abbr: 1,
                area: 1,
                audio: 1,
                b: 1,
                bdi: 1,
                bdo: 1,
                br: 1,
                button: 1,
                canvas: 1,
                cite: 1,
                code: 1,
                command: 1,
                datalist: 1,
                del: 1,
                dfn: 1,
                em: 1,
                embed: 1,
                i: 1,
                iframe: 1,
                img: 1,
                input: 1,
                ins: 1,
                kbd: 1,
                keygen: 1,
                label: 1,
                map: 1,
                mark: 1,
                meter: 1,
                noscript: 1,
                object: 1,
                output: 1,
                progress: 1,
                q: 1,
                ruby: 1,
                s: 1,
                samp: 1,
                script: 1,
                select: 1,
                small: 1,
                span: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                textarea: 1,
                time: 1,
                u: 1,
                "var": 1,
                video: 1,
                wbr: 1
            }, f,
            {
                acronym: 1,
                applet: 1,
                basefont: 1,
                big: 1,
                font: 1,
                isindex: 1,
                strike: 1,
                style: 1,
                tt: 1
            });
        a(g, c, b, h);
        e = {
            a: e(b, {a: 1, button: 1}),
            abbr: b,
            address: g,
            area: i,
            article: g,
            aside: g,
            audio: a({source: 1, track: 1}, g),
            b: b,
            base: i,
            bdi: b,
            bdo: b,
            blockquote: g,
            body: g,
            br: i,
            button: e(b, {a: 1, button: 1}),
            canvas: b,
            caption: g,
            cite: b,
            code: b,
            col: i,
            colgroup: {col: 1},
            command: i,
            datalist: a({option: 1}, b),
            dd: g,
            del: b,
            details: a({summary: 1}, g),
            dfn: b,
            div: g,
            dl: {dt: 1, dd: 1},
            dt: g,
            em: b,
            embed: i,
            fieldset: a({legend: 1}, g),
            figcaption: g,
            figure: a({figcaption: 1}, g),
            footer: g,
            form: g,
            h1: b,
            h2: b,
            h3: b,
            h4: b,
            h5: b,
            h6: b,
            head: a({title: 1, base: 1}, d),
            header: g,
            hgroup: {h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1},
            hr: i,
            html: a({head: 1, body: 1}, g, d),
            i: b,
            iframe: f,
            img: i,
            input: i,
            ins: b,
            kbd: b,
            keygen: i,
            label: b,
            legend: b,
            li: g,
            link: i,
            main: g,
            map: g,
            mark: b,
            menu: a({li: 1}, g),
            meta: i,
            meter: e(b, {meter: 1}),
            nav: g,
            noscript: a({link: 1, meta: 1, style: 1}, b),
            object: a({param: 1}, b),
            ol: {li: 1},
            optgroup: {option: 1},
            option: f,
            output: b,
            p: b,
            param: i,
            pre: b,
            progress: e(b, {progress: 1}),
            q: b,
            rp: b,
            rt: b,
            ruby: a({rp: 1, rt: 1}, b),
            s: b,
            samp: b,
            script: f,
            section: g,
            select: {optgroup: 1, option: 1},
            small: b,
            source: i,
            span: b,
            strong: b,
            style: f,
            sub: b,
            summary: b,
            sup: b,
            table: {
                caption: 1,
                colgroup: 1,
                thead: 1,
                tfoot: 1,
                tbody: 1,
                tr: 1
            },
            tbody: {tr: 1},
            td: g,
            textarea: f,
            tfoot: {tr: 1},
            th: g,
            thead: {tr: 1},
            time: e(b, {time: 1}),
            title: f,
            tr: {th: 1, td: 1},
            track: i,
            u: b,
            ul: {li: 1},
            "var": b,
            video: a({source: 1, track: 1}, g),
            wbr: i,
            acronym: b,
            applet: a({param: 1}, g),
            basefont: i,
            big: b,
            center: g,
            dialog: i,
            dir: {li: 1},
            font: b,
            isindex: i,
            noframes: g,
            strike: b,
            tt: b
        };
        a(e, {
            $block: a({audio: 1, dd: 1, dt: 1, figcaption: 1, li: 1, video: 1},
                c, h),
            $blockLimit: {
                article: 1,
                aside: 1,
                audio: 1,
                body: 1,
                caption: 1,
                details: 1,
                dir: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                figcaption: 1,
                figure: 1,
                footer: 1,
                form: 1,
                header: 1,
                hgroup: 1,
                main: 1,
                menu: 1,
                nav: 1,
                ol: 1,
                section: 1,
                table: 1,
                td: 1,
                th: 1,
                tr: 1,
                ul: 1,
                video: 1
            },
            $cdata: {script: 1, style: 1},
            $editable: {
                address: 1,
                article: 1,
                aside: 1,
                blockquote: 1,
                body: 1,
                details: 1,
                div: 1,
                fieldset: 1,
                figcaption: 1,
                footer: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                header: 1,
                hgroup: 1,
                main: 1,
                nav: 1,
                p: 1,
                pre: 1,
                section: 1
            },
            $empty: {
                area: 1,
                base: 1,
                basefont: 1,
                br: 1,
                col: 1,
                command: 1,
                dialog: 1,
                embed: 1,
                hr: 1,
                img: 1,
                input: 1,
                isindex: 1,
                keygen: 1,
                link: 1,
                meta: 1,
                param: 1,
                source: 1,
                track: 1,
                wbr: 1
            },
            $inline: b,
            $list: {dl: 1, ol: 1, ul: 1},
            $listItem: {dd: 1, dt: 1, li: 1},
            $nonBodyContent: a({body: 1, head: 1, html: 1}, e.head),
            $nonEditable: {
                applet: 1,
                audio: 1,
                button: 1,
                embed: 1,
                iframe: 1,
                map: 1,
                object: 1,
                option: 1,
                param: 1,
                script: 1,
                textarea: 1,
                video: 1
            },
            $object: {
                applet: 1,
                audio: 1,
                button: 1,
                hr: 1,
                iframe: 1,
                img: 1,
                input: 1,
                object: 1,
                select: 1,
                table: 1,
                textarea: 1,
                video: 1
            },
            $removeEmpty: {
                abbr: 1,
                acronym: 1,
                b: 1,
                bdi: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                mark: 1,
                meter: 1,
                output: 1,
                q: 1,
                ruby: 1,
                s: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                time: 1,
                tt: 1,
                u: 1,
                "var": 1
            },
            $tabIndex: {
                a: 1,
                area: 1,
                button: 1,
                input: 1,
                object: 1,
                select: 1,
                textarea: 1
            },
            $tableContent: {
                caption: 1,
                col: 1,
                colgroup: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1
            },
            $transparent: {
                a: 1,
                audio: 1,
                canvas: 1,
                del: 1,
                ins: 1,
                map: 1,
                noscript: 1,
                object: 1,
                video: 1
            },
            $intermediate: {
                caption: 1,
                colgroup: 1,
                dd: 1,
                dt: 1,
                figcaption: 1,
                legend: 1,
                li: 1,
                optgroup: 1,
                option: 1,
                rp: 1,
                rt: 1,
                summary: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1
            }
        });
        return e
    }(), CKEDITOR.dom.event = function (a) {
        this.$ = a
    }, CKEDITOR.dom.event.prototype = {
        getKey: function () {
            return this.$.keyCode || this.$.which
        }, getKeystroke: function () {
            var a = this.getKey();
            if (this.$.ctrlKey || this.$.metaKey)a = a + CKEDITOR.CTRL;
            this.$.shiftKey && (a = a + CKEDITOR.SHIFT);
            this.$.altKey && (a = a + CKEDITOR.ALT);
            return a
        }, preventDefault: function (a) {
            var e = this.$;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            a && this.stopPropagation()
        }, stopPropagation: function () {
            var a =
                this.$;
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
        }, getTarget: function () {
            var a = this.$.target || this.$.srcElement;
            return a ? new CKEDITOR.dom.node(a) : null
        }, getPhase: function () {
            return this.$.eventPhase || 2
        }, getPageOffset: function () {
            var a = this.getTarget().getDocument().$;
            return {
                x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
                y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
            }
        }
    }, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT =
        4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function (a) {
        if (a)this.$ = a
    }, CKEDITOR.dom.domObject.prototype = function () {
        var a = function (a, b) {
            return function (g) {
                typeof CKEDITOR != "undefined" && a.fire(b, new CKEDITOR.dom.event(g))
            }
        };
        return {
            getPrivate: function () {
                var a;
                if (!(a = this.getCustomData("_")))this.setCustomData("_", a = {});
                return a
            }, on: function (e) {
                var b = this.getCustomData("_cke_nativeListeners");
                if (!b) {
                    b = {};
                    this.setCustomData("_cke_nativeListeners",
                        b)
                }
                if (!b[e]) {
                    b = b[e] = a(this, e);
                    this.$.addEventListener ? this.$.addEventListener(e, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + e, b)
                }
                return CKEDITOR.event.prototype.on.apply(this, arguments)
            }, removeListener: function (a) {
                CKEDITOR.event.prototype.removeListener.apply(this, arguments);
                if (!this.hasListeners(a)) {
                    var b = this.getCustomData("_cke_nativeListeners"), g = b && b[a];
                    if (g) {
                        this.$.removeEventListener ? this.$.removeEventListener(a, g, false) : this.$.detachEvent && this.$.detachEvent("on" +
                            a, g);
                        delete b[a]
                    }
                }
            }, removeAllListeners: function () {
                var a = this.getCustomData("_cke_nativeListeners"), b;
                for (b in a) {
                    var g = a[b];
                    this.$.detachEvent ? this.$.detachEvent("on" + b, g) : this.$.removeEventListener && this.$.removeEventListener(b, g, false);
                    delete a[b]
                }
                CKEDITOR.event.prototype.removeAllListeners.call(this)
            }
        }
    }(), function (a) {
        var e = {};
        CKEDITOR.on("reset", function () {
            e = {}
        });
        a.equals = function (a) {
            try {
                return a && a.$ === this.$
            } catch (g) {
                return false
            }
        };
        a.setCustomData = function (a, g) {
            var c = this.getUniqueId();
            (e[c] ||
            (e[c] = {}))[a] = g;
            return this
        };
        a.getCustomData = function (a) {
            var g = this.$["data-cke-expando"];
            return (g = g && e[g]) && a in g ? g[a] : null
        };
        a.removeCustomData = function (a) {
            var g = this.$["data-cke-expando"], g = g && e[g], c, d;
            if (g) {
                c = g[a];
                d = a in g;
                delete g[a]
            }
            return d ? c : null
        };
        a.clearCustomData = function () {
            this.removeAllListeners();
            var a = this.$["data-cke-expando"];
            a && delete e[a]
        };
        a.getUniqueId = function () {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        };
        CKEDITOR.event.implementOn(a)
    }(CKEDITOR.dom.domObject.prototype),
        CKEDITOR.dom.node = function (a) {
            return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
        }, CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL =
        0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
        appendTo: function (a, e) {
            a.append(this, e);
            return a
        }, clone: function (a, e) {
            var b = this.$.cloneNode(a), g = function (c) {
                c["data-cke-expando"] && (c["data-cke-expando"] = false);
                if (c.nodeType == CKEDITOR.NODE_ELEMENT) {
                    e || c.removeAttribute("id", false);
                    if (a)for (var c = c.childNodes, d = 0; d < c.length; d++)g(c[d])
                }
            };
            g(b);
            return new CKEDITOR.dom.node(b)
        }, hasPrevious: function () {
            return !!this.$.previousSibling
        }, hasNext: function () {
            return !!this.$.nextSibling
        }, insertAfter: function (a) {
            a.$.parentNode.insertBefore(this.$, a.$.nextSibling);
            return a
        }, insertBefore: function (a) {
            a.$.parentNode.insertBefore(this.$, a.$);
            return a
        }, insertBeforeMe: function (a) {
            this.$.parentNode.insertBefore(a.$, this.$);
            return a
        }, getAddress: function (a) {
            for (var e = [], b = this.getDocument().$.documentElement, g = this.$; g && g != b;) {
                var c = g.parentNode;
                c && e.unshift(this.getIndex.call({$: g},
                    a));
                g = c
            }
            return e
        }, getDocument: function () {
            return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
        }, getIndex: function (a) {
            function e(a, c) {
                var b = c ? a.nextSibling : a.previousSibling;
                return !b || b.nodeType != CKEDITOR.NODE_TEXT ? null : b.nodeValue ? b : e(b, c)
            }

            var b = this.$, g = -1, c;
            if (!this.$.parentNode || a && b.nodeType == CKEDITOR.NODE_TEXT && !b.nodeValue && !e(b) && !e(b, true))return -1;
            do if (!a || !(b != this.$ && b.nodeType == CKEDITOR.NODE_TEXT && (c || !b.nodeValue))) {
                g++;
                c = b.nodeType == CKEDITOR.NODE_TEXT
            } while (b =
                b.previousSibling);
            return g
        }, getNextSourceNode: function (a, e, b) {
            if (b && !b.call)var g = b, b = function (a) {
                return !a.equals(g)
            };
            var a = !a && this.getFirst && this.getFirst(), c;
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
                a = this.getNext()
            }
            for (; !a && (c = (c || this).getParent());) {
                if (b && b(c, true) === false)return null;
                a = c.getNext()
            }
            return !a || b && b(a) === false ? null : e && e != a.type ? a.getNextSourceNode(false, e, b) : a
        }, getPreviousSourceNode: function (a, e, b) {
            if (b && !b.call)var g = b, b = function (a) {
                return !a.equals(g)
            };
            var a = !a && this.getLast && this.getLast(), c;
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
                a = this.getPrevious()
            }
            for (; !a && (c = (c || this).getParent());) {
                if (b && b(c, true) === false)return null;
                a = c.getPrevious()
            }
            return !a || b && b(a) === false ? null : e && a.type != e ? a.getPreviousSourceNode(false, e, b) : a
        }, getPrevious: function (a) {
            var e = this.$, b;
            do b = (e = e.previousSibling) && e.nodeType != 10 && new CKEDITOR.dom.node(e); while (b && a && !a(b));
            return b
        }, getNext: function (a) {
            var e = this.$, b;
            do b = (e = e.nextSibling) &&
                new CKEDITOR.dom.node(e); while (b && a && !a(b));
            return b
        }, getParent: function (a) {
            var e = this.$.parentNode;
            return e && (e.nodeType == CKEDITOR.NODE_ELEMENT || a && e.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(e) : null
        }, getParents: function (a) {
            var e = this, b = [];
            do b[a ? "push" : "unshift"](e); while (e = e.getParent());
            return b
        }, getCommonAncestor: function (a) {
            if (a.equals(this))return this;
            if (a.contains && a.contains(this))return a;
            var e = this.contains ? this : this.getParent();
            do if (e.contains(a))return e; while (e =
                e.getParent());
            return null
        }, getPosition: function (a) {
            var e = this.$, b = a.$;
            if (e.compareDocumentPosition)return e.compareDocumentPosition(b);
            if (e == b)return CKEDITOR.POSITION_IDENTICAL;
            if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
                if (e.contains) {
                    if (e.contains(b))return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                    if (b.contains(e))return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
                }
                if ("sourceIndex" in e)return e.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED :
                    e.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
            }
            for (var e = this.getAddress(), a = a.getAddress(), b = Math.min(e.length, a.length), g = 0; g <= b - 1; g++)if (e[g] != a[g]) {
                if (g < b)return e[g] < a[g] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
                break
            }
            return e.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
        }, getAscendant: function (a, e) {
            var b = this.$, g, c;
            if (!e)b = b.parentNode;
            if (typeof a == "function") {
                c =
                    true;
                g = a
            } else {
                c = false;
                g = function (c) {
                    c = typeof c.nodeName == "string" ? c.nodeName.toLowerCase() : "";
                    return typeof a == "string" ? c == a : c in a
                }
            }
            for (; b;) {
                if (g(c ? new CKEDITOR.dom.node(b) : b))return new CKEDITOR.dom.node(b);
                try {
                    b = b.parentNode
                } catch (d) {
                    b = null
                }
            }
            return null
        }, hasAscendant: function (a, e) {
            var b = this.$;
            if (!e)b = b.parentNode;
            for (; b;) {
                if (b.nodeName && b.nodeName.toLowerCase() == a)return true;
                b = b.parentNode
            }
            return false
        }, move: function (a, e) {
            a.append(this.remove(), e)
        }, remove: function (a) {
            var e = this.$, b = e.parentNode;
            if (b) {
                if (a)for (; a = e.firstChild;)b.insertBefore(e.removeChild(a), e);
                b.removeChild(e)
            }
            return this
        }, replace: function (a) {
            this.insertBefore(a);
            a.remove()
        }, trim: function () {
            this.ltrim();
            this.rtrim()
        }, ltrim: function () {
            for (var a; this.getFirst && (a = this.getFirst());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var e = CKEDITOR.tools.ltrim(a.getText()), b = a.getLength();
                    if (e) {
                        if (e.length < b) {
                            a.split(b - e.length);
                            this.$.removeChild(this.$.firstChild)
                        }
                    } else {
                        a.remove();
                        continue
                    }
                }
                break
            }
        }, rtrim: function () {
            for (var a; this.getLast && (a =
                this.getLast());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var e = CKEDITOR.tools.rtrim(a.getText()), b = a.getLength();
                    if (e) {
                        if (e.length < b) {
                            a.split(e.length);
                            this.$.lastChild.parentNode.removeChild(this.$.lastChild)
                        }
                    } else {
                        a.remove();
                        continue
                    }
                }
                break
            }
            if (CKEDITOR.env.needsBrFiller)(a = this.$.lastChild) && (a.type == 1 && a.nodeName.toLowerCase() == "br") && a.parentNode.removeChild(a)
        }, isReadOnly: function () {
            var a = this;
            this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent());
            if (a && typeof a.$.isContentEditable != "undefined")return !(a.$.isContentEditable ||
            a.data("cke-editable"));
            for (; a;) {
                if (a.data("cke-editable"))break;
                if (a.getAttribute("contentEditable") == "false")return true;
                if (a.getAttribute("contentEditable") == "true")break;
                a = a.getParent()
            }
            return !a
        }
    }), CKEDITOR.dom.window = function (a) {
        CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
        focus: function () {
            this.$.focus()
        }, getViewPaneSize: function () {
            var a = this.$.document, e = a.compatMode == "CSS1Compat";
            return {
                width: (e ?
                    a.documentElement.clientWidth : a.body.clientWidth) || 0,
                height: (e ? a.documentElement.clientHeight : a.body.clientHeight) || 0
            }
        }, getScrollPosition: function () {
            var a = this.$;
            if ("pageXOffset" in a)return {
                x: a.pageXOffset || 0,
                y: a.pageYOffset || 0
            };
            a = a.document;
            return {
                x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
                y: a.documentElement.scrollTop || a.body.scrollTop || 0
            }
        }, getFrame: function () {
            var a = this.$.frameElement;
            return a ? new CKEDITOR.dom.element.get(a) : null
        }
    }), CKEDITOR.dom.document = function (a) {
        CKEDITOR.dom.domObject.call(this,
            a)
    }, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
        type: CKEDITOR.NODE_DOCUMENT, appendStyleSheet: function (a) {
            if (this.$.createStyleSheet)this.$.createStyleSheet(a); else {
                var e = new CKEDITOR.dom.element("link");
                e.setAttributes({rel: "stylesheet", type: "text/css", href: a});
                this.getHead().append(e)
            }
        }, appendStyleText: function (a) {
            if (this.$.createStyleSheet) {
                var e = this.$.createStyleSheet("");
                e.cssText = a
            } else {
                var b = new CKEDITOR.dom.element("style",
                    this);
                b.append(new CKEDITOR.dom.text(a, this));
                this.getHead().append(b)
            }
            return e || b.$.sheet
        }, createElement: function (a, e) {
            var b = new CKEDITOR.dom.element(a, this);
            if (e) {
                e.attributes && b.setAttributes(e.attributes);
                e.styles && b.setStyles(e.styles)
            }
            return b
        }, createText: function (a) {
            return new CKEDITOR.dom.text(a, this)
        }, focus: function () {
            this.getWindow().focus()
        }, getActive: function () {
            var a;
            try {
                a = this.$.activeElement
            } catch (e) {
                return null
            }
            return new CKEDITOR.dom.element(a)
        }, getById: function (a) {
            return (a = this.$.getElementById(a)) ?
                new CKEDITOR.dom.element(a) : null
        }, getByAddress: function (a, e) {
            for (var b = this.$.documentElement, g = 0; b && g < a.length; g++) {
                var c = a[g];
                if (e)for (var d = -1, i = 0; i < b.childNodes.length; i++) {
                    var f = b.childNodes[i];
                    if (!(e === true && f.nodeType == 3 && f.previousSibling && f.previousSibling.nodeType == 3)) {
                        d++;
                        if (d == c) {
                            b = f;
                            break
                        }
                    }
                } else b = b.childNodes[c]
            }
            return b ? new CKEDITOR.dom.node(b) : null
        }, getElementsByTag: function (a, e) {
            !(CKEDITOR.env.ie && document.documentMode <= 8) && e && (a = e + ":" + a);
            return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
        },
        getHead: function () {
            var a = this.$.getElementsByTagName("head")[0];
            return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
        }, getBody: function () {
            return new CKEDITOR.dom.element(this.$.body)
        }, getDocumentElement: function () {
            return new CKEDITOR.dom.element(this.$.documentElement)
        }, getWindow: function () {
            return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView)
        }, write: function (a) {
            this.$.open("text/html", "replace");
            CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i,
                '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();<\/script>"));
            this.$.write(a);
            this.$.close()
        }, find: function (a) {
            return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
        }, findOne: function (a) {
            return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
        }, _getHtml5ShivFrag: function () {
            var a = this.getCustomData("html5ShivFrag");
            if (!a) {
                a = this.$.createDocumentFragment();
                CKEDITOR.tools.enableHtml5Elements(a, true);
                this.setCustomData("html5ShivFrag", a)
            }
            return a
        }
    }), CKEDITOR.dom.nodeList =
        function (a) {
            this.$ = a
        }, CKEDITOR.dom.nodeList.prototype = {
        count: function () {
            return this.$.length
        }, getItem: function (a) {
            if (a < 0 || a >= this.$.length)return null;
            return (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
        }
    }, CKEDITOR.dom.element = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createElement(a));
        CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.element.get = function (a) {
        return (a = typeof a == "string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
    }, CKEDITOR.dom.element.prototype =
        new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml = function (a, e) {
        var b = new CKEDITOR.dom.element("div", e);
        b.setHtml(a);
        return b.getFirst().remove()
    }, CKEDITOR.dom.element.setMarker = function (a, e, b, g) {
        var c = e.getCustomData("list_marker_id") || e.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"), d = e.getCustomData("list_marker_names") || e.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        a[c] = e;
        d[b] = 1;
        return e.setCustomData(b, g)
    }, CKEDITOR.dom.element.clearAllMarkers =
        function (a) {
            for (var e in a)CKEDITOR.dom.element.clearMarkers(a, a[e], 1)
        }, CKEDITOR.dom.element.clearMarkers = function (a, e, b) {
        var g = e.getCustomData("list_marker_names"), c = e.getCustomData("list_marker_id"), d;
        for (d in g)e.removeCustomData(d);
        e.removeCustomData("list_marker_names");
        if (b) {
            e.removeCustomData("list_marker_id");
            delete a[c]
        }
    }, function () {
        function a(a) {
            var d = true;
            if (!a.$.id) {
                a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
                d = false
            }
            return function () {
                d || a.removeAttribute("id")
            }
        }

        function e(a, d) {
            return "#" +
                a.$.id + " " + d.split(/,\s*/).join(", #" + a.$.id + " ")
        }

        function b(a) {
            for (var d = 0, b = 0, f = g[a].length; b < f; b++)d = d + (parseInt(this.getComputedStyle(g[a][b]) || 0, 10) || 0);
            return d
        }

        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
            type: CKEDITOR.NODE_ELEMENT,
            addClass: function (a) {
                var d = this.$.className;
                d && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(d) || (d = d + (" " + a)));
                this.$.className = d || a;
                return this
            },
            removeClass: function (a) {
                var d = this.getAttribute("class");
                if (d) {
                    a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
                    if (a.test(d))(d =
                        d.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", d) : this.removeAttribute("class")
                }
                return this
            },
            hasClass: function (a) {
                return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
            },
            append: function (a, d) {
                typeof a == "string" && (a = this.getDocument().createElement(a));
                d ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$);
                return a
            },
            appendHtml: function (a) {
                if (this.$.childNodes.length) {
                    var d = new CKEDITOR.dom.element("div", this.getDocument());
                    d.setHtml(a);
                    d.moveChildren(this)
                } else this.setHtml(a)
            },
            appendText: function (a) {
                this.$.text != null && CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
            },
            appendBogus: function (a) {
                if (a || CKEDITOR.env.needsBrFiller) {
                    for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());)a = a.getPrevious();
                    if (!a || !a.is || !a.is("br")) {
                        a = this.getDocument().createElement("br");
                        CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
                        this.append(a)
                    }
                }
            },
            breakParent: function (a) {
                var d = new CKEDITOR.dom.range(this.getDocument());
                d.setStartAfter(this);
                d.setEndAfter(a);
                a = d.extractContents();
                d.insertNode(this.remove());
                a.insertAfterNode(this)
            },
            contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function (a) {
                var d = this.$;
                return a.type != CKEDITOR.NODE_ELEMENT ? d.contains(a.getParent().$) : d != a.$ && d.contains(a.$)
            } : function (a) {
                return !!(this.$.compareDocumentPosition(a.$) & 16)
            },
            focus: function () {
                function a() {
                    try {
                        this.$.focus()
                    } catch (c) {
                    }
                }

                return function (d) {
                    d ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
                }
            }(),
            getHtml: function () {
                var a = this.$.innerHTML;
                return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
            },
            getOuterHtml: function () {
                if (this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/, "");
                var a = this.$.ownerDocument.createElement("div");
                a.appendChild(this.$.cloneNode(true));
                return a.innerHTML
            },
            getClientRect: function () {
                var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
                !a.width && (a.width = a.right - a.left);
                !a.height && (a.height = a.bottom - a.top);
                return a
            },
            setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function (a) {
                try {
                    var d = this.$;
                    if (this.getParent())return d.innerHTML =
                        a;
                    var b = this.getDocument()._getHtml5ShivFrag();
                    b.appendChild(d);
                    d.innerHTML = a;
                    b.removeChild(d);
                    return a
                } catch (f) {
                    this.$.innerHTML = "";
                    d = new CKEDITOR.dom.element("body", this.getDocument());
                    d.$.innerHTML = a;
                    for (d = d.getChildren(); d.count();)this.append(d.getItem(0));
                    return a
                }
            } : function (a) {
                return this.$.innerHTML = a
            },
            setText: function () {
                var a = document.createElement("p");
                a.innerHTML = "x";
                a = a.textContent;
                return function (d) {
                    this.$[a ? "textContent" : "innerText"] = d
                }
            }(),
            getAttribute: function () {
                var a = function (a) {
                    return this.$.getAttribute(a,
                        2)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function (a) {
                    switch (a) {
                        case "class":
                            a = "className";
                            break;
                        case "http-equiv":
                            a = "httpEquiv";
                            break;
                        case "name":
                            return this.$.name;
                        case "tabindex":
                            a = this.$.getAttribute(a, 2);
                            a !== 0 && this.$.tabIndex === 0 && (a = null);
                            return a;
                        case "checked":
                            a = this.$.attributes.getNamedItem(a);
                            return (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
                        case "hspace":
                        case "value":
                            return this.$[a];
                        case "style":
                            return this.$.style.cssText;
                        case "contenteditable":
                        case "contentEditable":
                            return this.$.attributes.getNamedItem("contentEditable").specified ?
                                this.$.getAttribute("contentEditable") : null
                    }
                    return this.$.getAttribute(a, 2)
                } : a
            }(),
            getChildren: function () {
                return new CKEDITOR.dom.nodeList(this.$.childNodes)
            },
            getComputedStyle: CKEDITOR.env.ie ? function (a) {
                return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
            } : function (a) {
                var d = this.getWindow().$.getComputedStyle(this.$, null);
                return d ? d.getPropertyValue(a) : ""
            },
            getDtd: function () {
                var a = CKEDITOR.dtd[this.getName()];
                this.getDtd = function () {
                    return a
                };
                return a
            },
            getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
            getTabIndex: CKEDITOR.env.ie ? function () {
                var a = this.$.tabIndex;
                a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (a = -1);
                return a
            } : CKEDITOR.env.webkit ? function () {
                var a = this.$.tabIndex;
                if (a === void 0) {
                    a = parseInt(this.getAttribute("tabindex"), 10);
                    isNaN(a) && (a = -1)
                }
                return a
            } : function () {
                return this.$.tabIndex
            },
            getText: function () {
                return this.$.textContent || this.$.innerText || ""
            },
            getWindow: function () {
                return this.getDocument().getWindow()
            },
            getId: function () {
                return this.$.id ||
                    null
            },
            getNameAtt: function () {
                return this.$.name || null
            },
            getName: function () {
                var a = this.$.nodeName.toLowerCase();
                if (CKEDITOR.env.ie && document.documentMode <= 8) {
                    var d = this.$.scopeName;
                    d != "HTML" && (a = d.toLowerCase() + ":" + a)
                }
                this.getName = function () {
                    return a
                };
                return this.getName()
            },
            getValue: function () {
                return this.$.value
            },
            getFirst: function (a) {
                var d = this.$.firstChild;
                (d = d && new CKEDITOR.dom.node(d)) && (a && !a(d)) && (d = d.getNext(a));
                return d
            },
            getLast: function (a) {
                var d = this.$.lastChild;
                (d = d && new CKEDITOR.dom.node(d)) &&
                (a && !a(d)) && (d = d.getPrevious(a));
                return d
            },
            getStyle: function (a) {
                return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
            },
            is: function () {
                var a = this.getName();
                if (typeof arguments[0] == "object")return !!arguments[0][a];
                for (var d = 0; d < arguments.length; d++)if (arguments[d] == a)return true;
                return false
            },
            isEditable: function (a) {
                var d = this.getName();
                if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[d] || CKEDITOR.dtd.$empty[d] ||
                    this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())return false;
                if (a !== false) {
                    a = CKEDITOR.dtd[d] || CKEDITOR.dtd.span;
                    return !(!a || !a["#"])
                }
                return true
            },
            isIdentical: function (a) {
                var d = this.clone(0, 1), a = a.clone(0, 1);
                d.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                if (d.$.isEqualNode) {
                    d.$.style.cssText = CKEDITOR.tools.normalizeCssText(d.$.style.cssText);
                    a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
                    return d.$.isEqualNode(a.$)
                }
                d = d.getOuterHtml();
                a = a.getOuterHtml();
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                    var b = this.getParent();
                    if (b.type == CKEDITOR.NODE_ELEMENT) {
                        b = b.clone();
                        b.setHtml(d);
                        d = b.getHtml();
                        b.setHtml(a);
                        a = b.getHtml()
                    }
                }
                return d == a
            },
            isVisible: function () {
                var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden", d, b;
                if (a && CKEDITOR.env.webkit) {
                    d = this.getWindow();
                    if (!d.equals(CKEDITOR.document.getWindow()) &&
                        (b = d.$.frameElement))a = (new CKEDITOR.dom.element(b)).isVisible()
                }
                return !!a
            },
            isEmptyInlineRemoveable: function () {
                if (!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;
                for (var a = this.getChildren(), d = 0, b = a.count(); d < b; d++) {
                    var f = a.getItem(d);
                    if (!(f.type == CKEDITOR.NODE_ELEMENT && f.data("cke-bookmark")) && (f.type == CKEDITOR.NODE_ELEMENT && !f.isEmptyInlineRemoveable() || f.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(f.getText())))return false
                }
                return true
            },
            hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat ||
            CKEDITOR.env.quirks) ? function () {
                for (var a = this.$.attributes, d = 0; d < a.length; d++) {
                    var b = a[d];
                    switch (b.nodeName) {
                        case "class":
                            if (this.getAttribute("class"))return true;
                        case "data-cke-expando":
                            continue;
                        default:
                            if (b.specified)return true
                    }
                }
                return false
            } : function () {
                var a = this.$.attributes, d = a.length, b = {
                    "data-cke-expando": 1,
                    _moz_dirty: 1
                };
                return d > 0 && (d > 2 || !b[a[0].nodeName] || d == 2 && !b[a[1].nodeName])
            },
            hasAttribute: function () {
                function a(c) {
                    var b = this.$.attributes.getNamedItem(c);
                    if (this.getName() == "input")switch (c) {
                        case "class":
                            return this.$.className.length >
                                0;
                        case "checked":
                            return !!this.$.checked;
                        case "value":
                            c = this.getAttribute("type");
                            return c == "checkbox" || c == "radio" ? this.$.value != "on" : !!this.$.value
                    }
                    return !b ? false : b.specified
                }

                return CKEDITOR.env.ie ? CKEDITOR.env.version < 8 ? function (d) {
                    return d == "name" ? !!this.$.name : a.call(this, d)
                } : a : function (a) {
                    return !!this.$.attributes.getNamedItem(a)
                }
            }(),
            hide: function () {
                this.setStyle("display", "none")
            },
            moveChildren: function (a, d) {
                var b = this.$, a = a.$;
                if (b != a) {
                    var f;
                    if (d)for (; f = b.lastChild;)a.insertBefore(b.removeChild(f),
                        a.firstChild); else for (; f = b.firstChild;)a.appendChild(b.removeChild(f))
                }
            },
            mergeSiblings: function () {
                function a(c, b, f) {
                    if (b && b.type == CKEDITOR.NODE_ELEMENT) {
                        for (var g = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
                            g.push(b);
                            b = f ? b.getNext() : b.getPrevious();
                            if (!b || b.type != CKEDITOR.NODE_ELEMENT)return
                        }
                        if (c.isIdentical(b)) {
                            for (var e = f ? c.getLast() : c.getFirst(); g.length;)g.shift().move(c, !f);
                            b.moveChildren(c, !f);
                            b.remove();
                            e && e.type == CKEDITOR.NODE_ELEMENT && e.mergeSiblings()
                        }
                    }
                }

                return function (d) {
                    if (d ===
                        false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
                        a(this, this.getNext(), true);
                        a(this, this.getPrevious())
                    }
                }
            }(),
            show: function () {
                this.setStyles({display: "", visibility: ""})
            },
            setAttribute: function () {
                var a = function (a, c) {
                    this.$.setAttribute(a, c);
                    return this
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function (d, b) {
                    d == "class" ? this.$.className = b : d == "style" ? this.$.style.cssText = b : d == "tabindex" ? this.$.tabIndex = b : d == "checked" ? this.$.checked = b : d == "contenteditable" ? a.call(this,
                        "contentEditable", b) : a.apply(this, arguments);
                    return this
                } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function (d, b) {
                    if (d == "src" && b.match(/^http:\/\//))try {
                        a.apply(this, arguments)
                    } catch (f) {
                    } else a.apply(this, arguments);
                    return this
                } : a
            }(),
            setAttributes: function (a) {
                for (var d in a)this.setAttribute(d, a[d]);
                return this
            },
            setValue: function (a) {
                this.$.value = a;
                return this
            },
            removeAttribute: function () {
                var a = function (a) {
                    this.$.removeAttribute(a)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ?
                    function (a) {
                        a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
                        this.$.removeAttribute(a)
                    } : a
            }(),
            removeAttributes: function (a) {
                if (CKEDITOR.tools.isArray(a))for (var d = 0; d < a.length; d++)this.removeAttribute(a[d]); else for (d in a)a.hasOwnProperty(d) && this.removeAttribute(d)
            },
            removeStyle: function (a) {
                var d = this.$.style;
                if (!d.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
                    var b = ["top", "left", "right", "bottom"], f;
                    a == "border" && (f = ["color", "style", "width"]);
                    for (var d = [], g = 0; g < b.length; g++)if (f)for (var e = 0; e < f.length; e++)d.push([a, b[g], f[e]].join("-")); else d.push([a, b[g]].join("-"));
                    for (a = 0; a < d.length; a++)this.removeStyle(d[a])
                } else {
                    d.removeProperty ? d.removeProperty(a) : d.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
                    this.$.style.cssText || this.removeAttribute("style")
                }
            },
            setStyle: function (a, d) {
                this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = d;
                return this
            },
            setStyles: function (a) {
                for (var d in a)this.setStyle(d, a[d]);
                return this
            },
            setOpacity: function (a) {
                if (CKEDITOR.env.ie &&
                    CKEDITOR.env.version < 9) {
                    a = Math.round(a * 100);
                    this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
                } else this.setStyle("opacity", a)
            },
            unselectable: function () {
                this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
                if (CKEDITOR.env.ie) {
                    this.setAttribute("unselectable", "on");
                    for (var a, d = this.getElementsByTag("*"), b = 0, f = d.count(); b < f; b++) {
                        a = d.getItem(b);
                        a.setAttribute("unselectable", "on")
                    }
                }
            },
            getPositionedAncestor: function () {
                for (var a = this; a.getName() != "html";) {
                    if (a.getComputedStyle("position") !=
                        "static")return a;
                    a = a.getParent()
                }
                return null
            },
            getDocumentPosition: function (a) {
                var b = 0, g = 0, f = this.getDocument(), h = f.getBody(), e = f.$.compatMode == "BackCompat";
                if (document.documentElement.getBoundingClientRect) {
                    var k = this.$.getBoundingClientRect(), n = f.$.documentElement, o = n.clientTop || h.$.clientTop || 0, p = n.clientLeft || h.$.clientLeft || 0, m = true;
                    if (CKEDITOR.env.ie) {
                        m = f.getDocumentElement().contains(this);
                        f = f.getBody().contains(this);
                        m = e && f || !e && m
                    }
                    if (m) {
                        if (CKEDITOR.env.webkit) {
                            b = h.$.scrollLeft || n.scrollLeft;
                            g = h.$.scrollTop || n.scrollTop
                        } else {
                            g = e ? h.$ : n;
                            b = g.scrollLeft;
                            g = g.scrollTop
                        }
                        b = k.left + b - p;
                        g = k.top + g - o
                    }
                } else {
                    o = this;
                    for (p = null; o && !(o.getName() == "body" || o.getName() == "html");) {
                        b = b + (o.$.offsetLeft - o.$.scrollLeft);
                        g = g + (o.$.offsetTop - o.$.scrollTop);
                        if (!o.equals(this)) {
                            b = b + (o.$.clientLeft || 0);
                            g = g + (o.$.clientTop || 0)
                        }
                        for (; p && !p.equals(o);) {
                            b = b - p.$.scrollLeft;
                            g = g - p.$.scrollTop;
                            p = p.getParent()
                        }
                        p = o;
                        o = (k = o.$.offsetParent) ? new CKEDITOR.dom.element(k) : null
                    }
                }
                if (a) {
                    k = this.getWindow();
                    o = a.getWindow();
                    if (!k.equals(o) &&
                        k.$.frameElement) {
                        a = (new CKEDITOR.dom.element(k.$.frameElement)).getDocumentPosition(a);
                        b = b + a.x;
                        g = g + a.y
                    }
                }
                if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !e) {
                    b = b + (this.$.clientLeft ? 1 : 0);
                    g = g + (this.$.clientTop ? 1 : 0)
                }
                return {x: b, y: g}
            },
            scrollIntoView: function (a) {
                var b = this.getParent();
                if (b) {
                    do {
                        (b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1);
                        if (b.is("html")) {
                            var g = b.getWindow();
                            try {
                                var f =
                                    g.$.frameElement;
                                f && (b = new CKEDITOR.dom.element(f))
                            } catch (h) {
                            }
                        }
                    } while (b = b.getParent())
                }
            },
            scrollIntoParent: function (a, b, g) {
                var f, h, e, k;

                function n(b, d) {
                    if (/body|html/.test(a.getName()))a.getWindow().$.scrollBy(b, d); else {
                        a.$.scrollLeft = a.$.scrollLeft + b;
                        a.$.scrollTop = a.$.scrollTop + d
                    }
                }

                function o(a, b) {
                    var c = {x: 0, y: 0};
                    if (!a.is(m ? "body" : "html")) {
                        var d = a.$.getBoundingClientRect();
                        c.x = d.left;
                        c.y = d.top
                    }
                    d = a.getWindow();
                    if (!d.equals(b)) {
                        d = o(CKEDITOR.dom.element.get(d.$.frameElement), b);
                        c.x = c.x + d.x;
                        c.y = c.y + d.y
                    }
                    return c
                }

                function p(a, b) {
                    return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
                }

                !a && (a = this.getWindow());
                e = a.getDocument();
                var m = e.$.compatMode == "BackCompat";
                a instanceof CKEDITOR.dom.window && (a = m ? e.getBody() : e.getDocumentElement());
                e = a.getWindow();
                h = o(this, e);
                var l = o(a, e), q = this.$.offsetHeight;
                f = this.$.offsetWidth;
                var s = a.$.clientHeight, t = a.$.clientWidth;
                e = h.x - p(this, "left") - l.x || 0;
                k = h.y - p(this, "top") - l.y || 0;
                f = h.x + f + p(this, "right") - (l.x + t) || 0;
                h = h.y + q + p(this, "bottom") - (l.y + s) || 0;
                if (k < 0 || h > 0)n(0, b === true ?
                    k : b === false ? h : k < 0 ? k : h);
                if (g && (e < 0 || f > 0))n(e < 0 ? e : f, 0)
            },
            setState: function (a, b, g) {
                b = b || "cke";
                switch (a) {
                    case CKEDITOR.TRISTATE_ON:
                        this.addClass(b + "_on");
                        this.removeClass(b + "_off");
                        this.removeClass(b + "_disabled");
                        g && this.setAttribute("aria-pressed", true);
                        g && this.removeAttribute("aria-disabled");
                        break;
                    case CKEDITOR.TRISTATE_DISABLED:
                        this.addClass(b + "_disabled");
                        this.removeClass(b + "_off");
                        this.removeClass(b + "_on");
                        g && this.setAttribute("aria-disabled", true);
                        g && this.removeAttribute("aria-pressed");
                        break;
                    default:
                        this.addClass(b +
                            "_off");
                        this.removeClass(b + "_on");
                        this.removeClass(b + "_disabled");
                        g && this.removeAttribute("aria-pressed");
                        g && this.removeAttribute("aria-disabled")
                }
            },
            getFrameDocument: function () {
                var a = this.$;
                try {
                    a.contentWindow.document
                } catch (b) {
                    a.src = a.src
                }
                return a && new CKEDITOR.dom.document(a.contentWindow.document)
            },
            copyAttributes: function (a, b) {
                for (var g = this.$.attributes, b = b || {}, f = 0; f < g.length; f++) {
                    var h = g[f], e = h.nodeName.toLowerCase(), k;
                    if (!(e in b))if (e == "checked" && (k = this.getAttribute(e)))a.setAttribute(e, k);
                    else if (!CKEDITOR.env.ie || this.hasAttribute(e)) {
                        k = this.getAttribute(e);
                        if (k === null)k = h.nodeValue;
                        a.setAttribute(e, k)
                    }
                }
                if (this.$.style.cssText !== "")a.$.style.cssText = this.$.style.cssText
            },
            renameNode: function (a) {
                if (this.getName() != a) {
                    var b = this.getDocument(), a = new CKEDITOR.dom.element(a, b);
                    this.copyAttributes(a);
                    this.moveChildren(a);
                    this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
                    a.$["data-cke-expando"] = this.$["data-cke-expando"];
                    this.$ = a.$;
                    delete this.getName
                }
            },
            getChild: function () {
                function a(b,
                           c) {
                    var f = b.childNodes;
                    if (c >= 0 && c < f.length)return f[c]
                }

                return function (b) {
                    var g = this.$;
                    if (b.slice)for (; b.length > 0 && g;)g = a(g, b.shift()); else g = a(g, b);
                    return g ? new CKEDITOR.dom.node(g) : null
                }
            }(),
            getChildCount: function () {
                return this.$.childNodes.length
            },
            disableContextMenu: function () {
                this.on("contextmenu", function (a) {
                    a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
                })
            },
            getDirection: function (a) {
                return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() &&
                this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
            },
            data: function (a, b) {
                a = "data-" + a;
                if (b === void 0)return this.getAttribute(a);
                b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
                return null
            },
            getEditor: function () {
                var a = CKEDITOR.instances, b, g;
                for (b in a) {
                    g = a[b];
                    if (g.element.equals(this) && g.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO)return g
                }
                return null
            },
            find: function (b) {
                var d = a(this), b = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(e(this,
                    b)));
                d();
                return b
            },
            findOne: function (b) {
                var d = a(this), b = this.$.querySelector(e(this, b));
                d();
                return b ? new CKEDITOR.dom.element(b) : null
            },
            forEach: function (a, b, g) {
                if (!g && (!b || this.type == b))var f = a(this);
                if (f !== false)for (var g = this.getChildren(), h = 0; h < g.count(); h++) {
                    f = g.getItem(h);
                    f.type == CKEDITOR.NODE_ELEMENT ? f.forEach(a, b) : (!b || f.type == b) && a(f)
                }
            }
        });
        var g = {
            width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
            height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
        };
        CKEDITOR.dom.element.prototype.setSize = function (a, d, g) {
            if (typeof d == "number") {
                if (g && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks))d = d - b.call(this, a);
                this.setStyle(a, d + "px")
            }
        };
        CKEDITOR.dom.element.prototype.getSize = function (a, d) {
            var g = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
            d && (g = g - b.call(this, a));
            return g
        }
    }(), CKEDITOR.dom.documentFragment = function (a) {
        a = a || CKEDITOR.document;
        this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() :
            a
    }, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
        type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
        insertAfterNode: function (a) {
            a = a.$;
            a.parentNode.insertBefore(this.$, a.nextSibling)
        }
    }, !0, {
        append: 1,
        appendBogus: 1,
        getFirst: 1,
        getLast: 1,
        getParent: 1,
        getNext: 1,
        getPrevious: 1,
        appendTo: 1,
        moveChildren: 1,
        insertBefore: 1,
        insertAfterNode: 1,
        replace: 1,
        trim: 1,
        type: 1,
        ltrim: 1,
        rtrim: 1,
        getDocument: 1,
        getChildCount: 1,
        getChild: 1,
        getChildren: 1
    }), function () {
        function a(a, b) {
            var d = this.range;
            if (this._.end)return null;
            if (!this._.start) {
                this._.start = 1;
                if (d.collapsed) {
                    this.end();
                    return null
                }
                d.optimize()
            }
            var c, f = d.startContainer;
            c = d.endContainer;
            var g = d.startOffset, k = d.endOffset, h, e = this.guard, i = this.type, j = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var v = c.type == CKEDITOR.NODE_ELEMENT ? c : c.getParent(), r = c.type == CKEDITOR.NODE_ELEMENT ? c.getChild(k) : c.getNext();
                this._.guardLTR = function (a, b) {
                    return (!b || !v.equals(a)) && (!r || !a.equals(r)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(d.root))
                }
            }
            if (a && !this._.guardRTL) {
                var y = f.type == CKEDITOR.NODE_ELEMENT ? f : f.getParent(), z = f.type == CKEDITOR.NODE_ELEMENT ? g ? f.getChild(g - 1) : null : f.getPrevious();
                this._.guardRTL = function (a, b) {
                    return (!b || !y.equals(a)) && (!z || !a.equals(z)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(d.root))
                }
            }
            var B = a ? this._.guardRTL : this._.guardLTR;
            h = e ? function (a, b) {
                return B(a, b) === false ? false : e(a, b)
            } : B;
            if (this.current)c = this.current[j](false, i, h); else {
                if (a)c.type == CKEDITOR.NODE_ELEMENT && (c = k > 0 ? c.getChild(k -
                    1) : h(c, true) === false ? null : c.getPreviousSourceNode(true, i, h)); else {
                    c = f;
                    if (c.type == CKEDITOR.NODE_ELEMENT && !(c = c.getChild(g)))c = h(f, true) === false ? null : f.getNextSourceNode(true, i, h)
                }
                c && h(c) === false && (c = null)
            }
            for (; c && !this._.end;) {
                this.current = c;
                if (!this.evaluator || this.evaluator(c) !== false) {
                    if (!b)return c
                } else if (b && this.evaluator)return false;
                c = c[j](false, i, h)
            }
            this.end();
            return this.current = null
        }

        function e(b) {
            for (var c, d = null; c = a.call(this, b);)d = c;
            return d
        }

        function b(a) {
            if (j(a))return false;
            if (a.type ==
                CKEDITOR.NODE_TEXT)return true;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                if (a.is(CKEDITOR.dtd.$inline) || a.is("hr") || a.getAttribute("contenteditable") == "false")return true;
                var b;
                if (b = !CKEDITOR.env.needsBrFiller)if (b = a.is(k))a:{
                    b = 0;
                    for (var c = a.getChildCount(); b < c; ++b)if (!j(a.getChild(b))) {
                        b = false;
                        break a
                    }
                    b = true
                }
                if (b)return true
            }
            return false
        }

        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
            $: function (a) {
                this.range = a;
                this._ = {}
            }, proto: {
                end: function () {
                    this._.end = 1
                }, next: function () {
                    return a.call(this)
                }, previous: function () {
                    return a.call(this,
                        1)
                }, checkForward: function () {
                    return a.call(this, 0, 1) !== false
                }, checkBackward: function () {
                    return a.call(this, 1, 1) !== false
                }, lastForward: function () {
                    return e.call(this)
                }, lastBackward: function () {
                    return e.call(this, 1)
                }, reset: function () {
                    delete this.current;
                    this._ = {}
                }
            }
        });
        var g = {
            block: 1,
            "list-item": 1,
            table: 1,
            "table-row-group": 1,
            "table-header-group": 1,
            "table-footer-group": 1,
            "table-row": 1,
            "table-column-group": 1,
            "table-column": 1,
            "table-cell": 1,
            "table-caption": 1
        }, c = {absolute: 1, fixed: 1};
        CKEDITOR.dom.element.prototype.isBlockBoundary =
            function (a) {
                return this.getComputedStyle("float") == "none" && !(this.getComputedStyle("position") in c) && g[this.getComputedStyle("display")] ? true : !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a))
            };
        CKEDITOR.dom.walker.blockBoundary = function (a) {
            return function (b) {
                return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        };
        CKEDITOR.dom.walker.listItemBoundary = function () {
            return this.blockBoundary({br: 1})
        };
        CKEDITOR.dom.walker.bookmark = function (a, b) {
            function c(a) {
                return a && a.getName && a.getName() == "span" &&
                    a.data("cke-bookmark")
            }

            return function (d) {
                var f, g;
                f = d && d.type != CKEDITOR.NODE_ELEMENT && (g = d.getParent()) && c(g);
                f = a ? f : f || c(d);
                return !!(b ^ f)
            }
        };
        CKEDITOR.dom.walker.whitespaces = function (a) {
            return function (b) {
                var c;
                b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
                return !!(a ^ c)
            }
        };
        CKEDITOR.dom.walker.invisible = function (a) {
            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.env.webkit ? 1 : 0;
            return function (d) {
                if (b(d))d = 1; else {
                    d.type == CKEDITOR.NODE_TEXT &&
                    (d = d.getParent());
                    d = d.$.offsetWidth <= c
                }
                return !!(a ^ d)
            }
        };
        CKEDITOR.dom.walker.nodeType = function (a, b) {
            return function (c) {
                return !!(b ^ c.type == a)
            }
        };
        CKEDITOR.dom.walker.bogus = function (a) {
            function b(a) {
                return !i(a) && !f(a)
            }

            return function (c) {
                var f = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && d.test(c.getText());
                if (f) {
                    f = c.getParent();
                    c = c.getNext(b);
                    f = f.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary())
                }
                return !!(a ^ f)
            }
        };
        CKEDITOR.dom.walker.temp = function (a) {
            return function (b) {
                b.type !=
                CKEDITOR.NODE_ELEMENT && (b = b.getParent());
                b = b && b.hasAttribute("data-cke-temp");
                return !!(a ^ b)
            }
        };
        var d = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, i = CKEDITOR.dom.walker.whitespaces(), f = CKEDITOR.dom.walker.bookmark(), h = CKEDITOR.dom.walker.temp();
        CKEDITOR.dom.walker.ignored = function (a) {
            return function (b) {
                b = i(b) || f(b) || h(b);
                return !!(a ^ b)
            }
        };
        var j = CKEDITOR.dom.walker.ignored(), k = function (a) {
            var b = {}, c;
            for (c in a)CKEDITOR.dtd[c]["#"] && (b[c] = 1);
            return b
        }(CKEDITOR.dtd.$block);
        CKEDITOR.dom.walker.editable = function (a) {
            return function (c) {
                return !!(a ^
                b(c))
            }
        };
        CKEDITOR.dom.element.prototype.getBogus = function () {
            var a = this;
            do a = a.getPreviousSourceNode(); while (f(a) || i(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
            return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && d.test(a.getText())) ? a : false
        }
    }(), CKEDITOR.dom.range = function (a) {
        this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
        this.collapsed = true;
        var e = a instanceof CKEDITOR.dom.document;
        this.document = e ? a : a.getDocument();
        this.root = e ? a.getBody() : a
    }, function () {
        function a() {
            var a = false, b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(true), f = CKEDITOR.dom.walker.bogus();
            return function (g) {
                if (c(g) || b(g))return true;
                if (f(g) && !a)return a = true;
                return g.type == CKEDITOR.NODE_TEXT && (g.hasAscendant("pre") || CKEDITOR.tools.trim(g.getText()).length) || g.type == CKEDITOR.NODE_ELEMENT && !g.is(d) ? false : true
            }
        }

        function e(a) {
            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(1);
            return function (d) {
                return c(d) ||
                b(d) ? true : !a && i(d) || d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function b(a) {
            return function () {
                var b;
                return this[a ? "getPreviousNode" : "getNextNode"](function (a) {
                    !b && j(a) && (b = a);
                    return h(a) && !(i(a) && a.equals(b))
                })
            }
        }

        var g = function (a) {
            a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
        }, c = function (a, b, c, d) {
            a.optimizeBookmark();
            var f = a.startContainer, g = a.endContainer, h = a.startOffset, e = a.endOffset, i, j;
            if (g.type == CKEDITOR.NODE_TEXT)g =
                g.split(e); else if (g.getChildCount() > 0)if (e >= g.getChildCount()) {
                g = g.append(a.document.createText(""));
                j = true
            } else g = g.getChild(e);
            if (f.type == CKEDITOR.NODE_TEXT) {
                f.split(h);
                f.equals(g) && (g = f.getNext())
            } else if (h)if (h >= f.getChildCount()) {
                f = f.append(a.document.createText(""));
                i = true
            } else f = f.getChild(h).getPrevious(); else {
                f = f.append(a.document.createText(""), 1);
                i = true
            }
            var h = f.getParents(), e = g.getParents(), w, x, v;
            for (w = 0; w < h.length; w++) {
                x = h[w];
                v = e[w];
                if (!x.equals(v))break
            }
            for (var r = c, y, z, B, A = w; A < h.length; A++) {
                y =
                    h[A];
                r && !y.equals(f) && (z = r.append(y.clone()));
                for (y = y.getNext(); y;) {
                    if (y.equals(e[A]) || y.equals(g))break;
                    B = y.getNext();
                    if (b == 2)r.append(y.clone(true)); else {
                        y.remove();
                        b == 1 && r.append(y)
                    }
                    y = B
                }
                r && (r = z)
            }
            r = c;
            for (c = w; c < e.length; c++) {
                y = e[c];
                b > 0 && !y.equals(g) && (z = r.append(y.clone()));
                if (!h[c] || y.$.parentNode != h[c].$.parentNode)for (y = y.getPrevious(); y;) {
                    if (y.equals(h[c]) || y.equals(f))break;
                    B = y.getPrevious();
                    if (b == 2)r.$.insertBefore(y.$.cloneNode(true), r.$.firstChild); else {
                        y.remove();
                        b == 1 && r.$.insertBefore(y.$,
                            r.$.firstChild)
                    }
                    y = B
                }
                r && (r = z)
            }
            if (b == 2) {
                x = a.startContainer;
                if (x.type == CKEDITOR.NODE_TEXT) {
                    x.$.data = x.$.data + x.$.nextSibling.data;
                    x.$.parentNode.removeChild(x.$.nextSibling)
                }
                a = a.endContainer;
                if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
                    a.$.data = a.$.data + a.$.nextSibling.data;
                    a.$.parentNode.removeChild(a.$.nextSibling)
                }
            } else {
                if (x && v && (f.$.parentNode != x.$.parentNode || g.$.parentNode != v.$.parentNode)) {
                    b = v.getIndex();
                    i && v.$.parentNode == f.$.parentNode && b--;
                    if (d && x.type == CKEDITOR.NODE_ELEMENT) {
                        d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',
                            a.document);
                        d.insertAfter(x);
                        x.mergeSiblings(false);
                        a.moveToBookmark({startNode: d})
                    } else a.setStart(v.getParent(), b)
                }
                a.collapse(true)
            }
            i && f.remove();
            j && g.$.parentNode && g.remove()
        }, d = {
            abbr: 1,
            acronym: 1,
            b: 1,
            bdo: 1,
            big: 1,
            cite: 1,
            code: 1,
            del: 1,
            dfn: 1,
            em: 1,
            font: 1,
            i: 1,
            ins: 1,
            label: 1,
            kbd: 1,
            q: 1,
            samp: 1,
            small: 1,
            span: 1,
            strike: 1,
            strong: 1,
            sub: 1,
            sup: 1,
            tt: 1,
            u: 1,
            "var": 1
        }, i = CKEDITOR.dom.walker.bogus(), f = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, h = CKEDITOR.dom.walker.editable(), j = CKEDITOR.dom.walker.ignored(true);
        CKEDITOR.dom.range.prototype =
        {
            clone: function () {
                var a = new CKEDITOR.dom.range(this.root);
                a._setStartContainer(this.startContainer);
                a.startOffset = this.startOffset;
                a._setEndContainer(this.endContainer);
                a.endOffset = this.endOffset;
                a.collapsed = this.collapsed;
                return a
            },
            collapse: function (a) {
                if (a) {
                    this._setEndContainer(this.startContainer);
                    this.endOffset = this.startOffset
                } else {
                    this._setStartContainer(this.endContainer);
                    this.startOffset = this.endOffset
                }
                this.collapsed = true
            },
            cloneContents: function () {
                var a = new CKEDITOR.dom.documentFragment(this.document);
                this.collapsed || c(this, 2, a);
                return a
            },
            deleteContents: function (a) {
                this.collapsed || c(this, 0, null, a)
            },
            extractContents: function (a) {
                var b = new CKEDITOR.dom.documentFragment(this.document);
                this.collapsed || c(this, 1, b, a);
                return b
            },
            createBookmark: function (a) {
                var b, c, d, f, g = this.collapsed;
                b = this.document.createElement("span");
                b.data("cke-bookmark", 1);
                b.setStyle("display", "none");
                b.setHtml("&nbsp;");
                if (a) {
                    d = "cke_bm_" + CKEDITOR.tools.getNextNumber();
                    b.setAttribute("id", d + (g ? "C" : "S"))
                }
                if (!g) {
                    c = b.clone();
                    c.setHtml("&nbsp;");
                    a && c.setAttribute("id", d + "E");
                    f = this.clone();
                    f.collapse();
                    f.insertNode(c)
                }
                f = this.clone();
                f.collapse(true);
                f.insertNode(b);
                if (c) {
                    this.setStartAfter(b);
                    this.setEndBefore(c)
                } else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
                return {
                    startNode: a ? d + (g ? "C" : "S") : b,
                    endNode: a ? d + "E" : c,
                    serializable: a,
                    collapsed: g
                }
            },
            createBookmark2: function () {
                function a(c) {
                    var d = c.container, f = c.offset, g;
                    g = d;
                    var h = f;
                    g = g.type != CKEDITOR.NODE_ELEMENT || h === 0 || h == g.getChildCount() ? 0 : g.getChild(h - 1).type == CKEDITOR.NODE_TEXT && g.getChild(h).type ==
                    CKEDITOR.NODE_TEXT;
                    if (g) {
                        d = d.getChild(f - 1);
                        f = d.getLength()
                    }
                    d.type == CKEDITOR.NODE_ELEMENT && f > 1 && (f = d.getChild(f - 1).getIndex(true) + 1);
                    if (d.type == CKEDITOR.NODE_TEXT) {
                        g = d;
                        for (h = 0; (g = g.getPrevious()) && g.type == CKEDITOR.NODE_TEXT;)h = h + g.getLength();
                        g = h;
                        if (d.getText())f = f + g; else {
                            h = d.getPrevious(b);
                            if (g) {
                                f = g;
                                d = h ? h.getNext() : d.getParent().getFirst()
                            } else {
                                d = d.getParent();
                                f = h ? h.getIndex(true) + 1 : 0
                            }
                        }
                    }
                    c.container = d;
                    c.offset = f
                }

                var b = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_TEXT, true);
                return function (b) {
                    var c = this.collapsed,
                        d = {
                            container: this.startContainer,
                            offset: this.startOffset
                        }, f = {
                            container: this.endContainer,
                            offset: this.endOffset
                        };
                    if (b) {
                        a(d);
                        c || a(f)
                    }
                    return {
                        start: d.container.getAddress(b),
                        end: c ? null : f.container.getAddress(b),
                        startOffset: d.offset,
                        endOffset: f.offset,
                        normalized: b,
                        collapsed: c,
                        is2: true
                    }
                }
            }(),
            moveToBookmark: function (a) {
                if (a.is2) {
                    var b = this.document.getByAddress(a.start, a.normalized), c = a.startOffset, d = a.end && this.document.getByAddress(a.end, a.normalized), a = a.endOffset;
                    this.setStart(b, c);
                    d ? this.setEnd(d, a) :
                        this.collapse(true)
                } else {
                    b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
                    a = c ? this.document.getById(a.endNode) : a.endNode;
                    this.setStartBefore(b);
                    b.remove();
                    if (a) {
                        this.setEndBefore(a);
                        a.remove()
                    } else this.collapse(true)
                }
            },
            getBoundaryNodes: function () {
                var a = this.startContainer, b = this.endContainer, c = this.startOffset, d = this.endOffset, f;
                if (a.type == CKEDITOR.NODE_ELEMENT) {
                    f = a.getChildCount();
                    if (f > c)a = a.getChild(c); else if (f < 1)a = a.getPreviousSourceNode(); else {
                        for (a = a.$; a.lastChild;)a = a.lastChild;
                        a = new CKEDITOR.dom.node(a);
                        a = a.getNextSourceNode() || a
                    }
                }
                if (b.type == CKEDITOR.NODE_ELEMENT) {
                    f = b.getChildCount();
                    if (f > d)b = b.getChild(d).getPreviousSourceNode(true); else if (f < 1)b = b.getPreviousSourceNode(); else {
                        for (b = b.$; b.lastChild;)b = b.lastChild;
                        b = new CKEDITOR.dom.node(b)
                    }
                }
                a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
                return {startNode: a, endNode: b}
            },
            getCommonAncestor: function (a, b) {
                var c = this.startContainer, d = this.endContainer, c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset -
                1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
                return b && !c.is ? c.getParent() : c
            },
            optimize: function () {
                var a = this.startContainer, b = this.startOffset;
                a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) : this.setStartBefore(a));
                a = this.endContainer;
                b = this.endOffset;
                a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
            },
            optimizeBookmark: function () {
                var a = this.startContainer, b = this.endContainer;
                a.is && (a.is("span") && a.data("cke-bookmark")) &&
                this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
                b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
            },
            trim: function (a, b) {
                var c = this.startContainer, d = this.startOffset, f = this.collapsed;
                if ((!a || f) && c && c.type == CKEDITOR.NODE_TEXT) {
                    if (d)if (d >= c.getLength()) {
                        d = c.getIndex() + 1;
                        c = c.getParent()
                    } else {
                        var g = c.split(d), d = c.getIndex() + 1, c = c.getParent();
                        if (this.startContainer.equals(this.endContainer))this.setEnd(g, this.endOffset - this.startOffset); else if (c.equals(this.endContainer))this.endOffset =
                            this.endOffset + 1
                    } else {
                        d = c.getIndex();
                        c = c.getParent()
                    }
                    this.setStart(c, d);
                    if (f) {
                        this.collapse(true);
                        return
                    }
                }
                c = this.endContainer;
                d = this.endOffset;
                if (!b && !f && c && c.type == CKEDITOR.NODE_TEXT) {
                    if (d) {
                        d >= c.getLength() || c.split(d);
                        d = c.getIndex() + 1
                    } else d = c.getIndex();
                    c = c.getParent();
                    this.setEnd(c, d)
                }
            },
            enlarge: function (a, b) {
                function c(a) {
                    return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
                }

                var d = RegExp(/[^\s\ufeff]/);
                switch (a) {
                    case CKEDITOR.ENLARGE_INLINE:
                        var f = 1;
                    case CKEDITOR.ENLARGE_ELEMENT:
                        if (this.collapsed)break;
                        var g = this.getCommonAncestor(), h = this.root, e, i, j, w, x, v = false, r, y;
                        r = this.startContainer;
                        var z = this.startOffset;
                        if (r.type == CKEDITOR.NODE_TEXT) {
                            if (z) {
                                r = !CKEDITOR.tools.trim(r.substring(0, z)).length && r;
                                v = !!r
                            }
                            if (r && !(w = r.getPrevious()))j = r.getParent()
                        } else {
                            z && (w = r.getChild(z - 1) || r.getLast());
                            w || (j = r)
                        }
                        for (j = c(j); j || w;) {
                            if (j && !w) {
                                !x && j.equals(g) && (x = true);
                                if (f ? j.isBlockBoundary() : !h.contains(j))break;
                                if (!v || j.getComputedStyle("display") != "inline") {
                                    v = false;
                                    x ? e = j : this.setStartBefore(j)
                                }
                                w = j.getPrevious()
                            }
                            for (; w;) {
                                r =
                                    false;
                                if (w.type == CKEDITOR.NODE_COMMENT)w = w.getPrevious(); else {
                                    if (w.type == CKEDITOR.NODE_TEXT) {
                                        y = w.getText();
                                        d.test(y) && (w = null);
                                        r = /[\s\ufeff]$/.test(y)
                                    } else if ((w.$.offsetWidth > (CKEDITOR.env.webkit ? 1 : 0) || b && w.is("br")) && !w.data("cke-bookmark"))if (v && CKEDITOR.dtd.$removeEmpty[w.getName()]) {
                                        y = w.getText();
                                        if (d.test(y))w = null; else for (var z = w.$.getElementsByTagName("*"), B = 0, A; A = z[B++];)if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
                                            w = null;
                                            break
                                        }
                                        w && (r = !!y.length)
                                    } else w = null;
                                    r && (v ? x ? e = j : j && this.setStartBefore(j) :
                                        v = true);
                                    if (w) {
                                        r = w.getPrevious();
                                        if (!j && !r) {
                                            j = w;
                                            w = null;
                                            break
                                        }
                                        w = r
                                    } else j = null
                                }
                            }
                            j && (j = c(j.getParent()))
                        }
                        r = this.endContainer;
                        z = this.endOffset;
                        j = w = null;
                        x = v = false;
                        var G = function (a, b) {
                            var c = new CKEDITOR.dom.range(h);
                            c.setStart(a, b);
                            c.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                            var c = new CKEDITOR.dom.walker(c), f;
                            for (c.guard = function (a) {
                                return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
                            }; f = c.next();) {
                                if (f.type != CKEDITOR.NODE_TEXT)return false;
                                y = f != a ? f.getText() : f.substring(b);
                                if (d.test(y))return false
                            }
                            return true
                        };
                        if (r.type == CKEDITOR.NODE_TEXT)if (CKEDITOR.tools.trim(r.substring(z)).length)v = true; else {
                            v = !r.getLength();
                            if (z == r.getLength()) {
                                if (!(w = r.getNext()))j = r.getParent()
                            } else G(r, z) && (j = r.getParent())
                        } else(w = r.getChild(z)) || (j = r);
                        for (; j || w;) {
                            if (j && !w) {
                                !x && j.equals(g) && (x = true);
                                if (f ? j.isBlockBoundary() : !h.contains(j))break;
                                if (!v || j.getComputedStyle("display") != "inline") {
                                    v = false;
                                    x ? i = j : j && this.setEndAfter(j)
                                }
                                w = j.getNext()
                            }
                            for (; w;) {
                                r = false;
                                if (w.type == CKEDITOR.NODE_TEXT) {
                                    y = w.getText();
                                    G(w, 0) || (w = null);
                                    r = /^[\s\ufeff]/.test(y)
                                } else if (w.type ==
                                    CKEDITOR.NODE_ELEMENT) {
                                    if ((w.$.offsetWidth > 0 || b && w.is("br")) && !w.data("cke-bookmark"))if (v && CKEDITOR.dtd.$removeEmpty[w.getName()]) {
                                        y = w.getText();
                                        if (d.test(y))w = null; else {
                                            z = w.$.getElementsByTagName("*");
                                            for (B = 0; A = z[B++];)if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
                                                w = null;
                                                break
                                            }
                                        }
                                        w && (r = !!y.length)
                                    } else w = null
                                } else r = 1;
                                r && v && (x ? i = j : this.setEndAfter(j));
                                if (w) {
                                    r = w.getNext();
                                    if (!j && !r) {
                                        j = w;
                                        w = null;
                                        break
                                    }
                                    w = r
                                } else j = null
                            }
                            j && (j = c(j.getParent()))
                        }
                        if (e && i) {
                            g = e.contains(i) ? i : e;
                            this.setStartBefore(g);
                            this.setEndAfter(g)
                        }
                        break;
                    case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                    case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                        j = new CKEDITOR.dom.range(this.root);
                        h = this.root;
                        j.setStartAt(h, CKEDITOR.POSITION_AFTER_START);
                        j.setEnd(this.startContainer, this.startOffset);
                        j = new CKEDITOR.dom.walker(j);
                        var D, J, C = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {br: 1} : null), F = null, E = function (a) {
                            if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false")if (F) {
                                if (F.equals(a)) {
                                    F = null;
                                    return
                                }
                            } else F =
                                a; else if (F)return;
                            var b = C(a);
                            b || (D = a);
                            return b
                        }, f = function (a) {
                            var b = E(a);
                            !b && (a.is && a.is("br")) && (J = a);
                            return b
                        };
                        j.guard = E;
                        j = j.lastBackward();
                        D = D || h;
                        this.setStartAt(D, !D.is("br") && (!j && this.checkStartOfBlock() || j && D.contains(j)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
                        if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                            j = this.clone();
                            j = new CKEDITOR.dom.walker(j);
                            var I = CKEDITOR.dom.walker.whitespaces(), L = CKEDITOR.dom.walker.bookmark();
                            j.evaluator = function (a) {
                                return !I(a) && !L(a)
                            };
                            if ((j = j.previous()) &&
                                j.type == CKEDITOR.NODE_ELEMENT && j.is("br"))break
                        }
                        j = this.clone();
                        j.collapse();
                        j.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                        j = new CKEDITOR.dom.walker(j);
                        j.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? f : E;
                        D = F = J = null;
                        j = j.lastForward();
                        D = D || h;
                        this.setEndAt(D, !j && this.checkEndOfBlock() || j && D.contains(j) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
                        J && this.setEndAfter(J)
                }
            },
            shrink: function (a, b, c) {
                if (!this.collapsed) {
                    var a = a || CKEDITOR.SHRINK_TEXT, d = this.clone(), f = this.startContainer, g = this.endContainer,
                        h = this.startOffset, e = this.endOffset, j = 1, i = 1;
                    if (f && f.type == CKEDITOR.NODE_TEXT)if (h)if (h >= f.getLength())d.setStartAfter(f); else {
                        d.setStartBefore(f);
                        j = 0
                    } else d.setStartBefore(f);
                    if (g && g.type == CKEDITOR.NODE_TEXT)if (e)if (e >= g.getLength())d.setEndAfter(g); else {
                        d.setEndAfter(g);
                        i = 0
                    } else d.setEndBefore(g);
                    var d = new CKEDITOR.dom.walker(d), w = CKEDITOR.dom.walker.bookmark();
                    d.evaluator = function (b) {
                        return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                    };
                    var x;
                    d.guard = function (b, d) {
                        if (w(b))return true;
                        if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || d && b.equals(x) || c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable"))return false;
                        !d && b.type == CKEDITOR.NODE_ELEMENT && (x = b);
                        return true
                    };
                    if (j)(f = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(f, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
                    if (i) {
                        d.reset();
                        (d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d,
                            b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
                    }
                    return !(!j && !i)
                }
            },
            insertNode: function (a) {
                this.optimizeBookmark();
                this.trim(false, true);
                var b = this.startContainer, c = b.getChild(this.startOffset);
                c ? a.insertBefore(c) : b.append(a);
                a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
                this.setStartBefore(a)
            },
            moveToPosition: function (a, b) {
                this.setStartAt(a, b);
                this.collapse(true)
            },
            moveToRange: function (a) {
                this.setStart(a.startContainer, a.startOffset);
                this.setEnd(a.endContainer,
                    a.endOffset)
            },
            selectNodeContents: function (a) {
                this.setStart(a, 0);
                this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
            },
            setStart: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex();
                    a = a.getParent()
                }
                this._setStartContainer(a);
                this.startOffset = b;
                if (!this.endContainer) {
                    this._setEndContainer(a);
                    this.endOffset = b
                }
                g(this)
            },
            setEnd: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex() + 1;
                    a = a.getParent()
                }
                this._setEndContainer(a);
                this.endOffset = b;
                if (!this.startContainer) {
                    this._setStartContainer(a);
                    this.startOffset = b
                }
                g(this)
            },
            setStartAfter: function (a) {
                this.setStart(a.getParent(), a.getIndex() + 1)
            },
            setStartBefore: function (a) {
                this.setStart(a.getParent(), a.getIndex())
            },
            setEndAfter: function (a) {
                this.setEnd(a.getParent(), a.getIndex() + 1)
            },
            setEndBefore: function (a) {
                this.setEnd(a.getParent(), a.getIndex())
            },
            setStartAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setStart(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type ==
                        CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setStartBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setStartAfter(a)
                }
                g(this)
            },
            setEndAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                g(this)
            },
            fixBlock: function (a, b) {
                var c = this.createBookmark(), d = this.document.createElement(b);
                this.collapse(a);
                this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                this.extractContents().appendTo(d);
                d.trim();
                d.appendBogus();
                this.insertNode(d);
                this.moveToBookmark(c);
                return d
            },
            splitBlock: function (a) {
                var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root), c = new CKEDITOR.dom.elementPath(this.endContainer, this.root), d = b.block, f = c.block, g = null;
                if (!b.blockLimit.equals(c.blockLimit))return null;
                if (a != "br") {
                    if (!d) {
                        d = this.fixBlock(true, a);
                        f = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
                    }
                    f || (f = this.fixBlock(false, a))
                }
                a = d && this.checkStartOfBlock();
                b = f && this.checkEndOfBlock();
                this.deleteContents();
                if (d && d.equals(f))if (b) {
                    g = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(f, CKEDITOR.POSITION_AFTER_END);
                    f = null
                } else if (a) {
                    g = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
                    d = null
                } else {
                    f =
                        this.splitElement(d);
                    d.is("ul", "ol") || d.appendBogus()
                }
                return {
                    previousBlock: d,
                    nextBlock: f,
                    wasStartOfBlock: a,
                    wasEndOfBlock: b,
                    elementPath: g
                }
            },
            splitElement: function (a) {
                if (!this.collapsed)return null;
                this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                var b = this.extractContents(), c = a.clone(false);
                b.appendTo(c);
                c.insertAfter(a);
                this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                return c
            },
            removeEmptyBlocksAtEnd: function () {
                function a(d) {
                    return function (a) {
                        return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) ||
                        d.is("table") && a.is("caption") ? false : true
                    }
                }

                var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(false);
                return function (b) {
                    for (var c = this.createBookmark(), d = this[b ? "endPath" : "startPath"](), f = d.block || d.blockLimit, g; f && !f.equals(d.root) && !f.getFirst(a(f));) {
                        g = f.getParent();
                        this[b ? "setEndAt" : "setStartAt"](f, CKEDITOR.POSITION_AFTER_END);
                        f.remove(1);
                        f = g
                    }
                    this.moveToBookmark(c)
                }
            }(),
            startPath: function () {
                return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
            },
            endPath: function () {
                return new CKEDITOR.dom.elementPath(this.endContainer,
                    this.root)
            },
            checkBoundaryOfElement: function (a, b) {
                var c = b == CKEDITOR.START, d = this.clone();
                d.collapse(c);
                d[c ? "setStartAt" : "setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
                d = new CKEDITOR.dom.walker(d);
                d.evaluator = e(c);
                return d[c ? "checkBackward" : "checkForward"]()
            },
            checkStartOfBlock: function () {
                var b = this.startContainer, c = this.startOffset;
                if (CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.ltrim(b.substring(0, c));
                    f.test(b) && this.trim(0, 1)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.startContainer,
                    this.root);
                c = this.clone();
                c.collapse(true);
                c.setStartAt(b.block || b.blockLimit, CKEDITOR.POSITION_AFTER_START);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkBackward()
            },
            checkEndOfBlock: function () {
                var b = this.endContainer, c = this.endOffset;
                if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.rtrim(b.substring(c));
                    f.test(b) && this.trim(1, 0)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
                c = this.clone();
                c.collapse(false);
                c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkForward()
            },
            getPreviousNode: function (a, b, c) {
                var d = this.clone();
                d.collapse(1);
                d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.previous()
            },
            getNextNode: function (a, b, c) {
                var d = this.clone();
                d.collapse();
                d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.next()
            },
            checkReadOnly: function () {
                function a(b, c) {
                    for (; b;) {
                        if (b.type ==
                            CKEDITOR.NODE_ELEMENT) {
                            if (b.getAttribute("contentEditable") == "false" && !b.data("cke-editable"))return 0;
                            if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c)))break
                        }
                        b = b.getParent()
                    }
                    return 1
                }

                return function () {
                    var b = this.startContainer, c = this.endContainer;
                    return !(a(b, c) && a(c, b))
                }
            }(),
            moveToElementEditablePosition: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
                    this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                    return true
                }
                for (var c =
                    0; a;) {
                    if (a.type == CKEDITOR.NODE_TEXT) {
                        b && this.endContainer && this.checkEndOfBlock() && f.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                        c = 1;
                        break
                    }
                    if (a.type == CKEDITOR.NODE_ELEMENT)if (a.isEditable()) {
                        this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                        c = 1
                    } else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock())this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
                    else if (a.getAttribute("contenteditable") == "false" && a.is(CKEDITOR.dtd.$block)) {
                        this.setStartBefore(a);
                        this.setEndAfter(a);
                        return true
                    }
                    var d = a, g = c, h = void 0;
                    d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(false) && (h = d[b ? "getLast" : "getFirst"](j));
                    !g && !h && (h = d[b ? "getPrevious" : "getNext"](j));
                    a = h
                }
                return !!c
            },
            moveToClosestEditablePosition: function (a, b) {
                var c = new CKEDITOR.dom.range(this.root), d = 0, f, g = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
                c.moveToPosition(a, g[b ? 0 : 1]);
                if (a.is(CKEDITOR.dtd.$block)) {
                    if (f =
                            c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
                        d = 1;
                        if (f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block) && f.getAttribute("contenteditable") == "false") {
                            c.setStartAt(f, CKEDITOR.POSITION_BEFORE_START);
                            c.setEndAt(f, CKEDITOR.POSITION_AFTER_END)
                        } else c.moveToPosition(f, g[b ? 1 : 0])
                    }
                } else d = 1;
                d && this.moveToRange(c);
                return !!d
            },
            moveToElementEditStart: function (a) {
                return this.moveToElementEditablePosition(a)
            },
            moveToElementEditEnd: function (a) {
                return this.moveToElementEditablePosition(a, true)
            },
            getEnclosedNode: function () {
                var a =
                    this.clone();
                a.optimize();
                if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT)return null;
                var a = new CKEDITOR.dom.walker(a), b = CKEDITOR.dom.walker.bookmark(false, true), c = CKEDITOR.dom.walker.whitespaces(true);
                a.evaluator = function (a) {
                    return c(a) && b(a)
                };
                var d = a.next();
                a.reset();
                return d && d.equals(a.previous()) ? d : null
            },
            getTouchedStartNode: function () {
                var a = this.startContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
            },
            getTouchedEndNode: function () {
                var a =
                    this.endContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
            },
            getNextEditableNode: b(),
            getPreviousEditableNode: b(1),
            scrollIntoView: function () {
                var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document), b, c, d, f = this.clone();
                f.optimize();
                if (d = f.startContainer.type == CKEDITOR.NODE_TEXT) {
                    c = f.startContainer.getText();
                    b = f.startContainer.split(f.startOffset);
                    a.insertAfter(f.startContainer)
                } else f.insertNode(a);
                a.scrollIntoView();
                if (d) {
                    f.startContainer.setText(c);
                    b.remove()
                }
                a.remove()
            },
            _setStartContainer: function (a) {
                this.startContainer = a
            },
            _setEndContainer: function (a) {
                this.endContainer = a
            }
        }
    }(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, "use strict", function () {
        function a(a) {
            if (!(arguments.length <
                1)) {
                this.range = a;
                this.forceBrBreak = 0;
                this.enlargeBr = 1;
                this.enforceRealBlocks = 0;
                this._ || (this._ = {})
            }
        }

        function e(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") == "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function b(a, c, d, f) {
            a:{
                f == null && (f = e(d));
                for (var g; g = f.shift();)if (g.getDtd().p) {
                    f = {element: g, remaining: f};
                    break a
                }
                f = null
            }
            if (!f)return 0;
            if ((g = CKEDITOR.filter.instances[f.element.data("cke-filter")]) && !g.check(c))return b(a, c, d, f.remaining);
            c = new CKEDITOR.dom.range(f.element);
            c.selectNodeContents(f.element);
            c = c.createIterator();
            c.enlargeBr = a.enlargeBr;
            c.enforceRealBlocks = a.enforceRealBlocks;
            c.activeFilter = c.filter = g;
            a._.nestedEditable = {
                element: f.element,
                container: d,
                remaining: f.remaining,
                iterator: c
            };
            return 1
        }

        function g(a, b, c) {
            if (!b)return false;
            a = a.clone();
            a.collapse(!c);
            return a.checkBoundaryOfElement(b, c ? CKEDITOR.START : CKEDITOR.END)
        }

        var c = /^[\r\n\t ]+$/, d = CKEDITOR.dom.walker.bookmark(false, true), i = CKEDITOR.dom.walker.whitespaces(true), f = function (a) {
                return d(a) && i(a)
            },
            h = {dd: 1, dt: 1, li: 1};
        a.prototype = {
            getNextParagraph: function (a) {
                var e, i, o, p, m, a = a || "p";
                if (this._.nestedEditable) {
                    if (e = this._.nestedEditable.iterator.getNextParagraph(a)) {
                        this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                        return e
                    }
                    this.activeFilter = this.filter;
                    if (b(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
                        this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                        return this._.nestedEditable.iterator.getNextParagraph(a)
                    }
                    this._.nestedEditable = null
                }
                if (!this.range.root.getDtd()[a])return null;
                if (!this._.started) {
                    var l = this.range.clone();
                    i = l.startPath();
                    var q = l.endPath(), s = !l.collapsed && g(l, i.block), t = !l.collapsed && g(l, q.block, 1);
                    l.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                    s && l.setStartAt(i.block, CKEDITOR.POSITION_BEFORE_END);
                    t && l.setEndAt(q.block, CKEDITOR.POSITION_AFTER_START);
                    i = l.endContainer.hasAscendant("pre", true) || l.startContainer.hasAscendant("pre", true);
                    l.enlarge(this.forceBrBreak && !i || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                    if (!l.collapsed) {
                        i =
                            new CKEDITOR.dom.walker(l.clone());
                        q = CKEDITOR.dom.walker.bookmark(true, true);
                        i.evaluator = q;
                        this._.nextNode = i.next();
                        i = new CKEDITOR.dom.walker(l.clone());
                        i.evaluator = q;
                        i = i.previous();
                        this._.lastNode = i.getNextSourceNode(true, null, l.root);
                        if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
                            q = this.range.clone();
                            q.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                            if (q.checkEndOfBlock()) {
                                q =
                                    new CKEDITOR.dom.elementPath(q.endContainer, q.root);
                                this._.lastNode = (q.block || q.blockLimit).getNextSourceNode(true)
                            }
                        }
                        if (!this._.lastNode || !l.root.contains(this._.lastNode)) {
                            this._.lastNode = this._.docEndMarker = l.document.createText("");
                            this._.lastNode.insertAfter(i)
                        }
                        l = null
                    }
                    this._.started = 1;
                    i = l
                }
                q = this._.nextNode;
                l = this._.lastNode;
                for (this._.nextNode = null; q;) {
                    var s = 0, t = q.hasAscendant("pre"), u = q.type != CKEDITOR.NODE_ELEMENT, w = 0;
                    if (u)q.type == CKEDITOR.NODE_TEXT && c.test(q.getText()) && (u = 0); else {
                        var x = q.getName();
                        if (CKEDITOR.dtd.$block[x] && q.getAttribute("contenteditable") == "false") {
                            e = q;
                            b(this, a, e);
                            break
                        } else if (q.isBlockBoundary(this.forceBrBreak && !t && {br: 1})) {
                            if (x == "br")u = 1; else if (!i && !q.getChildCount() && x != "hr") {
                                e = q;
                                o = q.equals(l);
                                break
                            }
                            if (i) {
                                i.setEndAt(q, CKEDITOR.POSITION_BEFORE_START);
                                if (x != "br")this._.nextNode = q
                            }
                            s = 1
                        } else {
                            if (q.getFirst()) {
                                if (!i) {
                                    i = this.range.clone();
                                    i.setStartAt(q, CKEDITOR.POSITION_BEFORE_START)
                                }
                                q = q.getFirst();
                                continue
                            }
                            u = 1
                        }
                    }
                    if (u && !i) {
                        i = this.range.clone();
                        i.setStartAt(q, CKEDITOR.POSITION_BEFORE_START)
                    }
                    o =
                        (!s || u) && q.equals(l);
                    if (i && !s)for (; !q.getNext(f) && !o;) {
                        x = q.getParent();
                        if (x.isBlockBoundary(this.forceBrBreak && !t && {br: 1})) {
                            s = 1;
                            u = 0;
                            o || x.equals(l);
                            i.setEndAt(x, CKEDITOR.POSITION_BEFORE_END);
                            break
                        }
                        q = x;
                        u = 1;
                        o = q.equals(l);
                        w = 1
                    }
                    u && i.setEndAt(q, CKEDITOR.POSITION_AFTER_END);
                    q = this._getNextSourceNode(q, w, l);
                    if ((o = !q) || s && i)break
                }
                if (!e) {
                    if (!i) {
                        this._.docEndMarker && this._.docEndMarker.remove();
                        return this._.nextNode = null
                    }
                    e = new CKEDITOR.dom.elementPath(i.startContainer, i.root);
                    q = e.blockLimit;
                    s = {div: 1, th: 1, td: 1};
                    e = e.block;
                    if (!e && q && !this.enforceRealBlocks && s[q.getName()] && i.checkStartOfBlock() && i.checkEndOfBlock() && !q.equals(i.root))e = q; else if (!e || this.enforceRealBlocks && e.is(h)) {
                        e = this.range.document.createElement(a);
                        i.extractContents().appendTo(e);
                        e.trim();
                        i.insertNode(e);
                        p = m = true
                    } else if (e.getName() != "li") {
                        if (!i.checkStartOfBlock() || !i.checkEndOfBlock()) {
                            e = e.clone(false);
                            i.extractContents().appendTo(e);
                            e.trim();
                            m = i.splitBlock();
                            p = !m.wasStartOfBlock;
                            m = !m.wasEndOfBlock;
                            i.insertNode(e)
                        }
                    } else if (!o)this._.nextNode =
                        e.equals(l) ? null : this._getNextSourceNode(i.getBoundaryNodes().endNode, 1, l)
                }
                if (p)(p = e.getPrevious()) && p.type == CKEDITOR.NODE_ELEMENT && (p.getName() == "br" ? p.remove() : p.getLast() && p.getLast().$.nodeName.toLowerCase() == "br" && p.getLast().remove());
                if (m)(p = e.getLast()) && p.type == CKEDITOR.NODE_ELEMENT && p.getName() == "br" && (!CKEDITOR.env.needsBrFiller || p.getPrevious(d) || p.getNext(d)) && p.remove();
                if (!this._.nextNode)this._.nextNode = o || e.equals(l) || !l ? null : this._getNextSourceNode(e, 1, l);
                return e
            }, _getNextSourceNode: function (a,
                                             b, c) {
                function f(a) {
                    return !(a.equals(c) || a.equals(g))
                }

                for (var g = this.range.root, a = a.getNextSourceNode(b, null, f); !d(a);)a = a.getNextSourceNode(b, null, f);
                return a
            }
        };
        CKEDITOR.dom.range.prototype.createIterator = function () {
            return new a(this)
        }
    }(), CKEDITOR.command = function (a, e) {
        this.uiItems = [];
        this.exec = function (b) {
            if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed())return false;
            this.editorFocus && a.focus();
            return this.fire("exec") === false ? true : e.exec.call(this, a, b) !== false
        };
        this.refresh = function (a,
                                 b) {
            if (!this.readOnly && a.readOnly)return true;
            if (this.context && !b.isContextFor(this.context)) {
                this.disable();
                return true
            }
            if (!this.checkAllowed(true)) {
                this.disable();
                return true
            }
            this.startDisabled || this.enable();
            this.modes && !this.modes[a.mode] && this.disable();
            return this.fire("refresh", {
                editor: a,
                path: b
            }) === false ? true : e.refresh && e.refresh.apply(this, arguments) !== false
        };
        var b;
        this.checkAllowed = function (g) {
            return !g && typeof b == "boolean" ? b : b = a.activeFilter.checkFeature(this)
        };
        CKEDITOR.tools.extend(this,
            e, {
                modes: {wysiwyg: 1},
                editorFocus: 1,
                contextSensitive: !!e.context,
                state: CKEDITOR.TRISTATE_DISABLED
            });
        CKEDITOR.event.call(this)
    }, CKEDITOR.command.prototype = {
        enable: function () {
            this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
        }, disable: function () {
            this.setState(CKEDITOR.TRISTATE_DISABLED)
        }, setState: function (a) {
            if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed())return false;
            this.previousState = this.state;
            this.state = a;
            this.fire("state");
            return true
        }, toggleState: function () {
            this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
        }
    }, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV = 3, CKEDITOR.config = {
        customConfig: "config.js",
        autoUpdateElement: !0,
        language: "",
        defaultLanguage: "en",
        contentsLangDirection: "",
        enterMode: CKEDITOR.ENTER_P,
        forceEnterMode: !1,
        shiftEnterMode: CKEDITOR.ENTER_BR,
        docType: "<!DOCTYPE html>",
        bodyId: "",
        bodyClass: "",
        fullPage: !1,
        height: 200,
        extraPlugins: "",
        removePlugins: "",
        protectedSource: [],
        tabIndex: 0,
        width: "",
        baseFloatZIndex: 1E4,
        blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
    }, function () {
        function a(a, b, c, d, f) {
            var g, h, a = [];
            for (g in b) {
                h = b[g];
                h = typeof h == "boolean" ? {} : typeof h == "function" ? {match: h} : G(h);
                if (g.charAt(0) != "$")h.elements = g;
                if (c)h.featureName = c.toLowerCase();
                var e = h;
                e.elements = i(e.elements,
                        /\s+/) || null;
                e.propertiesOnly = e.propertiesOnly || e.elements === true;
                var j = /\s*,\s*/, q = void 0;
                for (q in F) {
                    e[q] = i(e[q], j) || null;
                    var m = e, k = E[q], x = i(e[E[q]], j), t = e[q], w = [], l = true, C = void 0;
                    x ? l = false : x = {};
                    for (C in t)if (C.charAt(0) == "!") {
                        C = C.slice(1);
                        w.push(C);
                        x[C] = true;
                        l = false
                    }
                    for (; C = w.pop();) {
                        t[C] = t["!" + C];
                        delete t["!" + C]
                    }
                    m[k] = (l ? false : x) || null
                }
                e.match = e.match || null;
                d.push(h);
                a.push(h)
            }
            for (var b = f.elements, f = f.generic, n, c = 0, d = a.length; c < d; ++c) {
                g = G(a[c]);
                h = g.classes === true || g.styles === true || g.attributes ===
                    true;
                e = g;
                q = k = j = void 0;
                for (j in F)e[j] = s(e[j]);
                m = true;
                for (q in E) {
                    j = E[q];
                    k = e[j];
                    x = [];
                    t = void 0;
                    for (t in k)t.indexOf("*") > -1 ? x.push(RegExp("^" + t.replace(/\*/g, ".*") + "$")) : x.push(t);
                    k = x;
                    if (k.length) {
                        e[j] = k;
                        m = false
                    }
                }
                e.nothingRequired = m;
                e.noProperties = !(e.attributes || e.classes || e.styles);
                if (g.elements === true || g.elements === null)f[h ? "unshift" : "push"](g); else {
                    e = g.elements;
                    delete g.elements;
                    for (n in e)if (b[n])b[n][h ? "unshift" : "push"](g); else b[n] = [g]
                }
            }
        }

        function e(a, c, d, g) {
            if (!a.match || a.match(c))if (g || f(a,
                    c)) {
                if (!a.propertiesOnly)d.valid = true;
                if (!d.allAttributes)d.allAttributes = b(a.attributes, c.attributes, d.validAttributes);
                if (!d.allStyles)d.allStyles = b(a.styles, c.styles, d.validStyles);
                if (!d.allClasses) {
                    a = a.classes;
                    c = c.classes;
                    g = d.validClasses;
                    if (a)if (a === true)a = true; else {
                        for (var h = 0, e = c.length, i; h < e; ++h) {
                            i = c[h];
                            g[i] || (g[i] = a(i))
                        }
                        a = false
                    } else a = false;
                    d.allClasses = a
                }
            }
        }

        function b(a, b, c) {
            if (!a)return false;
            if (a === true)return true;
            for (var d in b)c[d] || (c[d] = a(d));
            return false
        }

        function g(a, b, d) {
            if (!a.match ||
                a.match(b)) {
                if (a.noProperties)return false;
                d.hadInvalidAttribute = c(a.attributes, b.attributes) || d.hadInvalidAttribute;
                d.hadInvalidStyle = c(a.styles, b.styles) || d.hadInvalidStyle;
                a = a.classes;
                b = b.classes;
                if (a) {
                    for (var f = false, g = a === true, h = b.length; h--;)if (g || a(b[h])) {
                        b.splice(h, 1);
                        f = true
                    }
                    a = f
                } else a = false;
                d.hadInvalidClass = a || d.hadInvalidClass
            }
        }

        function c(a, b) {
            if (!a)return false;
            var c = false, d = a === true, f;
            for (f in b)if (d || a(f)) {
                delete b[f];
                c = true
            }
            return c
        }

        function d(a, b, c) {
            if (a.disabled || a.customConfig && !c || !b)return false;
            a._.cachedChecks = {};
            return true
        }

        function i(a, b) {
            if (!a)return false;
            if (a === true)return a;
            if (typeof a == "string") {
                a = D(a);
                return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
            }
            if (CKEDITOR.tools.isArray(a))return a.length ? CKEDITOR.tools.convertArrayToObject(a) : false;
            var c = {}, d = 0, f;
            for (f in a) {
                c[f] = a[f];
                d++
            }
            return d ? c : false
        }

        function f(a, b) {
            if (a.nothingRequired)return true;
            var c, d, f, g;
            if (f = a.requiredClasses) {
                g = b.classes;
                for (c = 0; c < f.length; ++c) {
                    d = f[c];
                    if (typeof d == "string") {
                        if (CKEDITOR.tools.indexOf(g,
                                d) == -1)return false
                    } else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(g, d))return false
                }
            }
            return h(b.styles, a.requiredStyles) && h(b.attributes, a.requiredAttributes)
        }

        function h(a, b) {
            if (!b)return true;
            for (var c = 0, d; c < b.length; ++c) {
                d = b[c];
                if (typeof d == "string") {
                    if (!(d in a))return false
                } else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, d))return false
            }
            return true
        }

        function j(a) {
            if (!a)return {};
            for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;)b[a.shift()] = J;
            return b
        }

        function k(a) {
            for (var b, c, d,
                     f, g = {}, h = 1, a = D(a); b = a.match(I);) {
                if (c = b[2]) {
                    d = n(c, "styles");
                    f = n(c, "attrs");
                    c = n(c, "classes")
                } else d = f = c = null;
                g["$" + h++] = {
                    elements: b[1],
                    classes: c,
                    styles: d,
                    attributes: f
                };
                a = a.slice(b[0].length)
            }
            return g
        }

        function n(a, b) {
            var c = a.match(L[b]);
            return c ? D(c[1]) : null
        }

        function o(a) {
            var b = a.styleBackup = a.attributes.style, c = a.classBackup = a.attributes["class"];
            if (!a.styles)a.styles = CKEDITOR.tools.parseCssText(b || "", 1);
            if (!a.classes)a.classes = c ? c.split(/\s+/) : []
        }

        function p(a, b, c, d) {
            var f = 0, h;
            if (d.toHtml)b.name = b.name.replace(H,
                "$1");
            if (d.doCallbacks && a.elementCallbacks) {
                a:for (var i = a.elementCallbacks, j = 0, m = i.length, s; j < m; ++j)if (s = i[j](b)) {
                    h = s;
                    break a
                }
                if (h)return h
            }
            if (d.doTransform)if (h = a._.transformations[b.name]) {
                o(b);
                for (i = 0; i < h.length; ++i)x(a, b, h[i]);
                l(b)
            }
            if (d.doFilter) {
                a:{
                    i = b.name;
                    j = a._;
                    a = j.allowedRules.elements[i];
                    h = j.allowedRules.generic;
                    i = j.disallowedRules.elements[i];
                    j = j.disallowedRules.generic;
                    m = d.skipRequired;
                    s = {
                        valid: false,
                        validAttributes: {},
                        validClasses: {},
                        validStyles: {},
                        allAttributes: false,
                        allClasses: false,
                        allStyles: false,
                        hadInvalidAttribute: false,
                        hadInvalidClass: false,
                        hadInvalidStyle: false
                    };
                    var k, t;
                    if (!a && !h)a = null; else {
                        o(b);
                        if (i) {
                            k = 0;
                            for (t = i.length; k < t; ++k)if (g(i[k], b, s) === false) {
                                a = null;
                                break a
                            }
                        }
                        if (j) {
                            k = 0;
                            for (t = j.length; k < t; ++k)g(j[k], b, s)
                        }
                        if (a) {
                            k = 0;
                            for (t = a.length; k < t; ++k)e(a[k], b, s, m)
                        }
                        if (h) {
                            k = 0;
                            for (t = h.length; k < t; ++k)e(h[k], b, s, m)
                        }
                        a = s
                    }
                }
                if (!a) {
                    c.push(b);
                    return A
                }
                if (!a.valid) {
                    c.push(b);
                    return A
                }
                t = a.validAttributes;
                var w = a.validStyles;
                h = a.validClasses;
                var i = b.attributes, C = b.styles, j = b.classes, m = b.classBackup,
                    n = b.styleBackup, v, F, r = [];
                s = [];
                var u = /^data-cke-/;
                k = false;
                delete i.style;
                delete i["class"];
                delete b.classBackup;
                delete b.styleBackup;
                if (!a.allAttributes)for (v in i)if (!t[v])if (u.test(v)) {
                    if (v != (F = v.replace(/^data-cke-saved-/, "")) && !t[F]) {
                        delete i[v];
                        k = true
                    }
                } else {
                    delete i[v];
                    k = true
                }
                if (!a.allStyles || a.hadInvalidStyle) {
                    for (v in C)a.allStyles || w[v] ? r.push(v + ":" + C[v]) : k = true;
                    if (r.length)i.style = r.sort().join("; ")
                } else if (n)i.style = n;
                if (!a.allClasses || a.hadInvalidClass) {
                    for (v = 0; v < j.length; ++v)(a.allClasses ||
                    h[j[v]]) && s.push(j[v]);
                    s.length && (i["class"] = s.sort().join(" "));
                    m && s.length < m.split(/\s+/).length && (k = true)
                } else m && (i["class"] = m);
                k && (f = A);
                if (!d.skipFinalValidation && !q(b)) {
                    c.push(b);
                    return A
                }
            }
            if (d.toHtml)b.name = b.name.replace(Q, "cke:$1");
            return f
        }

        function m(a) {
            var b = [], c;
            for (c in a)c.indexOf("*") > -1 && b.push(c.replace(/\*/g, ".*"));
            return b.length ? RegExp("^(?:" + b.join("|") + ")$") : null
        }

        function l(a) {
            var b = a.attributes, c;
            delete b.style;
            delete b["class"];
            if (c = CKEDITOR.tools.writeCssText(a.styles, true))b.style =
                c;
            a.classes.length && (b["class"] = a.classes.sort().join(" "))
        }

        function q(a) {
            switch (a.name) {
                case "a":
                    if (!a.children.length && !a.attributes.name)return false;
                    break;
                case "img":
                    if (!a.attributes.src)return false
            }
            return true
        }

        function s(a) {
            if (!a)return false;
            if (a === true)return true;
            var b = m(a);
            return function (c) {
                return c in a || b && c.match(b)
            }
        }

        function t() {
            return new CKEDITOR.htmlParser.element("br")
        }

        function u(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || B.$block[a.name])
        }

        function w(a, b, c) {
            var d = a.name;
            if (B.$empty[d] || !a.children.length)if (d == "hr" && b == "br")a.replaceWith(t()); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.remove()
            } else if (B.$block[d] || d == "tr")if (b == "br") {
                if (a.previous && !u(a.previous)) {
                    b = t();
                    b.insertBefore(a)
                }
                if (a.next && !u(a.next)) {
                    b = t();
                    b.insertAfter(a)
                }
                a.replaceWithChildren()
            } else {
                var d = a.children, f;
                b:{
                    f = B[b];
                    for (var g = 0, h = d.length, e; g < h; ++g) {
                        e = d[g];
                        if (e.type == CKEDITOR.NODE_ELEMENT && !f[e.name]) {
                            f = false;
                            break b
                        }
                    }
                    f = true
                }
                if (f) {
                    a.name = b;
                    a.attributes = {};
                    c.push({
                        check: "parent-down",
                        el: a
                    })
                } else {
                    f = a.parent;
                    for (var g = f.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || f.name == "body", i, j, h = d.length; h > 0;) {
                        e = d[--h];
                        if (g && (e.type == CKEDITOR.NODE_TEXT || e.type == CKEDITOR.NODE_ELEMENT && B.$inline[e.name])) {
                            if (!i) {
                                i = new CKEDITOR.htmlParser.element(b);
                                i.insertAfter(a);
                                c.push({check: "parent-down", el: i})
                            }
                            i.add(e, 0)
                        } else {
                            i = null;
                            j = B[f.name] || B.span;
                            e.insertAfter(a);
                            f.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (e.type == CKEDITOR.NODE_ELEMENT && !j[e.name]) && c.push({
                                check: "el-up",
                                el: e
                            })
                        }
                    }
                    a.remove()
                }
            } else if (d in
                {style: 1, script: 1})a.remove(); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.replaceWithChildren()
            }
        }

        function x(a, b, c) {
            var d, f;
            for (d = 0; d < c.length; ++d) {
                f = c[d];
                if ((!f.check || a.check(f.check, false)) && (!f.left || f.left(b))) {
                    f.right(b, O);
                    break
                }
            }
        }

        function v(a, b) {
            var c = b.getDefinition(), d = c.attributes, f = c.styles, g, h, e, i;
            if (a.name != c.element)return false;
            for (g in d)if (g == "class") {
                c = d[g].split(/\s+/);
                for (e = a.classes.join("|"); i = c.pop();)if (e.indexOf(i) == -1)return false
            } else if (a.attributes[g] != d[g])return false;
            for (h in f)if (a.styles[h] != f[h])return false;
            return true
        }

        function r(a, b) {
            var c, d;
            if (typeof a == "string")c = a; else if (a instanceof CKEDITOR.style)d = a; else {
                c = a[0];
                d = a[1]
            }
            return [{
                element: c, left: d, right: function (a, c) {
                    c.transform(a, b)
                }
            }]
        }

        function y(a) {
            return function (b) {
                return v(b, a)
            }
        }

        function z(a) {
            return function (b, c) {
                c[a](b)
            }
        }

        var B = CKEDITOR.dtd, A = 1, G = CKEDITOR.tools.copy, D = CKEDITOR.tools.trim, J = "cke-test", C = ["", "p", "br", "div"];
        CKEDITOR.FILTER_SKIP_TREE = 2;
        CKEDITOR.filter = function (a) {
            this.allowedContent =
                [];
            this.disallowedContent = [];
            this.elementCallbacks = null;
            this.disabled = false;
            this.editor = null;
            this.id = CKEDITOR.tools.getNextNumber();
            this._ = {
                allowedRules: {elements: {}, generic: []},
                disallowedRules: {elements: {}, generic: []},
                transformations: {},
                cachedTests: {}
            };
            CKEDITOR.filter.instances[this.id] = this;
            if (a instanceof CKEDITOR.editor) {
                a = this.editor = a;
                this.customConfig = true;
                var b = a.config.allowedContent;
                if (b === true)this.disabled = true; else {
                    if (!b)this.customConfig = false;
                    this.allow(b, "config", 1);
                    this.allow(a.config.extraAllowedContent,
                        "extra", 1);
                    this.allow(C[a.enterMode] + " " + C[a.shiftEnterMode], "default", 1);
                    this.disallow(a.config.disallowedContent)
                }
            } else {
                this.customConfig = false;
                this.allow(a, "default", 1)
            }
        };
        CKEDITOR.filter.instances = {};
        CKEDITOR.filter.prototype = {
            allow: function (b, c, f) {
                if (!d(this, b, f))return false;
                var g, h;
                if (typeof b == "string")b = k(b); else if (b instanceof CKEDITOR.style) {
                    if (b.toAllowedContentRules)return this.allow(b.toAllowedContentRules(this.editor), c, f);
                    g = b.getDefinition();
                    b = {};
                    f = g.attributes;
                    b[g.element] = g = {
                        styles: g.styles,
                        requiredStyles: g.styles && CKEDITOR.tools.objectKeys(g.styles)
                    };
                    if (f) {
                        f = G(f);
                        g.classes = f["class"] ? f["class"].split(/\s+/) : null;
                        g.requiredClasses = g.classes;
                        delete f["class"];
                        g.attributes = f;
                        g.requiredAttributes = f && CKEDITOR.tools.objectKeys(f)
                    }
                } else if (CKEDITOR.tools.isArray(b)) {
                    for (g = 0; g < b.length; ++g)h = this.allow(b[g], c, f);
                    return h
                }
                a(this, b, c, this.allowedContent, this._.allowedRules);
                return true
            }, applyTo: function (a, b, c, d) {
                if (this.disabled)return false;
                var f = this, g = [], h = this.editor && this.editor.config.protectedSource,
                    e, i = false, j = {
                        doFilter: !c,
                        doTransform: true,
                        doCallbacks: true,
                        toHtml: b
                    };
                a.forEach(function (a) {
                    if (a.type == CKEDITOR.NODE_ELEMENT) {
                        if (a.attributes["data-cke-filter"] == "off")return false;
                        if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
                            e = p(f, a, g, j);
                            if (e & A)i = true; else if (e & 2)return false
                        }
                    } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                        var c;
                        a:{
                            var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
                            c = [];
                            var q,
                                m, s;
                            if (h)for (m = 0; m < h.length; ++m)if ((s = d.match(h[m])) && s[0].length == d.length) {
                                c = true;
                                break a
                            }
                            d = CKEDITOR.htmlParser.fragment.fromHtml(d);
                            d.children.length == 1 && (q = d.children[0]).type == CKEDITOR.NODE_ELEMENT && p(f, q, c, j);
                            c = !c.length
                        }
                        c || g.push(a)
                    }
                }, null, true);
                g.length && (i = true);
                for (var m, a = [], d = C[d || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)], s; c = g.pop();)c.type == CKEDITOR.NODE_ELEMENT ? w(c, d, a) : c.remove();
                for (; m = a.pop();) {
                    c = m.el;
                    if (c.parent) {
                        s = B[c.parent.name] || B.span;
                        switch (m.check) {
                            case "it":
                                B.$removeEmpty[c.name] && !c.children.length ? w(c, d, a) : q(c) || w(c, d, a);
                                break;
                            case "el-up":
                                c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !s[c.name] && w(c, d, a);
                                break;
                            case "parent-down":
                                c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !s[c.name] && w(c.parent, d, a)
                        }
                    }
                }
                return i
            }, checkFeature: function (a) {
                if (this.disabled || !a)return true;
                a.toFeature && (a = a.toFeature(this.editor));
                return !a.requiredContent || this.check(a.requiredContent)
            }, disable: function () {
                this.disabled = true
            }, disallow: function (b) {
                if (!d(this, b, true))return false;
                typeof b ==
                "string" && (b = k(b));
                a(this, b, null, this.disallowedContent, this._.disallowedRules);
                return true
            }, addContentForms: function (a) {
                if (!this.disabled && a) {
                    var b, c, d = [], f;
                    for (b = 0; b < a.length && !f; ++b) {
                        c = a[b];
                        if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c))f = c
                    }
                    if (f) {
                        for (b = 0; b < a.length; ++b)d.push(r(a[b], f));
                        this.addTransformations(d)
                    }
                }
            }, addElementCallback: function (a) {
                if (!this.elementCallbacks)this.elementCallbacks = [];
                this.elementCallbacks.push(a)
            }, addFeature: function (a) {
                if (this.disabled || !a)return true;
                a.toFeature && (a = a.toFeature(this.editor));
                this.allow(a.allowedContent, a.name);
                this.addTransformations(a.contentTransformations);
                this.addContentForms(a.contentForms);
                return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : true
            }, addTransformations: function (a) {
                var b, c;
                if (!this.disabled && a) {
                    var d = this._.transformations, f;
                    for (f = 0; f < a.length; ++f) {
                        b = a[f];
                        var g = void 0, h = void 0, e = void 0, i = void 0, j = void 0, q = void 0;
                        c = [];
                        for (h = 0; h < b.length; ++h) {
                            e = b[h];
                            if (typeof e ==
                                "string") {
                                e = e.split(/\s*:\s*/);
                                i = e[0];
                                j = null;
                                q = e[1]
                            } else {
                                i = e.check;
                                j = e.left;
                                q = e.right
                            }
                            if (!g) {
                                g = e;
                                g = g.element ? g.element : i ? i.match(/^([a-z0-9]+)/i)[0] : g.left.getDefinition().element
                            }
                            j instanceof CKEDITOR.style && (j = y(j));
                            c.push({
                                check: i == g ? null : i,
                                left: j,
                                right: typeof q == "string" ? z(q) : q
                            })
                        }
                        b = g;
                        d[b] || (d[b] = []);
                        d[b].push(c)
                    }
                }
            }, check: function (a, b, c) {
                if (this.disabled)return true;
                if (CKEDITOR.tools.isArray(a)) {
                    for (var d = a.length; d--;)if (this.check(a[d], b, c))return true;
                    return false
                }
                var f, g;
                if (typeof a == "string") {
                    g =
                        a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
                    if (g in this._.cachedChecks)return this._.cachedChecks[g];
                    d = k(a).$1;
                    f = d.styles;
                    var h = d.classes;
                    d.name = d.elements;
                    d.classes = h = h ? h.split(/\s*,\s*/) : [];
                    d.styles = j(f);
                    d.attributes = j(d.attributes);
                    d.children = [];
                    h.length && (d.attributes["class"] = h.join(" "));
                    if (f)d.attributes.style = CKEDITOR.tools.writeCssText(d.styles);
                    f = d
                } else {
                    d = a.getDefinition();
                    f = d.styles;
                    h = d.attributes || {};
                    if (f) {
                        f = G(f);
                        h.style = CKEDITOR.tools.writeCssText(f, true)
                    } else f = {};
                    f = {
                        name: d.element,
                        attributes: h,
                        classes: h["class"] ? h["class"].split(/\s+/) : [],
                        styles: f,
                        children: []
                    }
                }
                var h = CKEDITOR.tools.clone(f), e = [], i;
                if (b !== false && (i = this._.transformations[f.name])) {
                    for (d = 0; d < i.length; ++d)x(this, f, i[d]);
                    l(f)
                }
                p(this, h, e, {
                    doFilter: true,
                    doTransform: b !== false,
                    skipRequired: !c,
                    skipFinalValidation: !c
                });
                b = e.length > 0 ? false : CKEDITOR.tools.objectCompare(f.attributes, h.attributes, true) ? true : false;
                typeof a == "string" && (this._.cachedChecks[g] = b);
                return b
            }, getAllowedEnterMode: function () {
                var a = ["p", "div", "br"], b = {
                    p: CKEDITOR.ENTER_P,
                    div: CKEDITOR.ENTER_DIV, br: CKEDITOR.ENTER_BR
                };
                return function (c, d) {
                    var f = a.slice(), g;
                    if (this.check(C[c]))return c;
                    for (d || (f = f.reverse()); g = f.pop();)if (this.check(g))return b[g];
                    return CKEDITOR.ENTER_BR
                }
            }(), destroy: function () {
                delete CKEDITOR.filter.instances[this.id];
                delete this._;
                delete this.allowedContent;
                delete this.disallowedContent
            }
        };
        var F = {
                styles: 1,
                attributes: 1,
                classes: 1
            }, E = {
                styles: "requiredStyles",
                attributes: "requiredAttributes",
                classes: "requiredClasses"
            }, I = /^([a-z0-9\-*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
            L = {
                styles: /{([^}]+)}/,
                attrs: /\[([^\]]+)\]/,
                classes: /\(([^\)]+)\)/
            }, H = /^cke:(object|embed|param)$/, Q = /^(object|embed|param)$/, O = CKEDITOR.filter.transformationsTools = {
                sizeToStyle: function (a) {
                    this.lengthToStyle(a, "width");
                    this.lengthToStyle(a, "height")
                }, sizeToAttribute: function (a) {
                    this.lengthToAttribute(a, "width");
                    this.lengthToAttribute(a, "height")
                }, lengthToStyle: function (a, b, c) {
                    c = c || b;
                    if (!(c in a.styles)) {
                        var d = a.attributes[b];
                        if (d) {
                            /^\d+$/.test(d) && (d = d + "px");
                            a.styles[c] = d
                        }
                    }
                    delete a.attributes[b]
                },
                lengthToAttribute: function (a, b, c) {
                    c = c || b;
                    if (!(c in a.attributes)) {
                        var d = a.styles[b], f = d && d.match(/^(\d+)(?:\.\d*)?px$/);
                        f ? a.attributes[c] = f[1] : d == J && (a.attributes[c] = J)
                    }
                    delete a.styles[b]
                }, alignmentToStyle: function (a) {
                    if (!("float" in a.styles)) {
                        var b = a.attributes.align;
                        if (b == "left" || b == "right")a.styles["float"] = b
                    }
                    delete a.attributes.align
                }, alignmentToAttribute: function (a) {
                    if (!("align" in a.attributes)) {
                        var b = a.styles["float"];
                        if (b == "left" || b == "right")a.attributes.align = b
                    }
                    delete a.styles["float"]
                }, matchesStyle: v,
                transform: function (a, b) {
                    if (typeof b == "string")a.name = b; else {
                        var c = b.getDefinition(), d = c.styles, f = c.attributes, g, h, e, i;
                        a.name = c.element;
                        for (g in f)if (g == "class") {
                            c = a.classes.join("|");
                            for (e = f[g].split(/\s+/); i = e.pop();)c.indexOf(i) == -1 && a.classes.push(i)
                        } else a.attributes[g] = f[g];
                        for (h in d)a.styles[h] = d[h]
                    }
                }
            }
    }(), function () {
        CKEDITOR.focusManager = function (a) {
            if (a.focusManager)return a.focusManager;
            this.hasFocus = false;
            this.currentActive = null;
            this._ = {editor: a};
            return this
        };
        CKEDITOR.focusManager._ = {blurDelay: 200};
        CKEDITOR.focusManager.prototype = {
            focus: function (a) {
                this._.timer && clearTimeout(this._.timer);
                if (a)this.currentActive = a;
                if (!this.hasFocus && !this._.locked) {
                    (a = CKEDITOR.currentInstance) && a.focusManager.blur(1);
                    this.hasFocus = true;
                    (a = this._.editor.container) && a.addClass("cke_focus");
                    this._.editor.fire("focus")
                }
            }, lock: function () {
                this._.locked = 1
            }, unlock: function () {
                delete this._.locked
            }, blur: function (a) {
                function e() {
                    if (this.hasFocus) {
                        this.hasFocus = false;
                        var a = this._.editor.container;
                        a && a.removeClass("cke_focus");
                        this._.editor.fire("blur")
                    }
                }

                if (!this._.locked) {
                    this._.timer && clearTimeout(this._.timer);
                    var b = CKEDITOR.focusManager._.blurDelay;
                    a || !b ? e.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function () {
                        delete this._.timer;
                        e.call(this)
                    }, b, this)
                }
            }, add: function (a, e) {
                var b = a.getCustomData("focusmanager");
                if (!b || b != this) {
                    b && b.remove(a);
                    var b = "focus", g = "blur";
                    if (e)if (CKEDITOR.env.ie) {
                        b = "focusin";
                        g = "focusout"
                    } else CKEDITOR.event.useCapture = 1;
                    var c = {
                        blur: function () {
                            a.equals(this.currentActive) && this.blur()
                        }, focus: function () {
                            this.focus(a)
                        }
                    };
                    a.on(b, c.focus, this);
                    a.on(g, c.blur, this);
                    if (e)CKEDITOR.event.useCapture = 0;
                    a.setCustomData("focusmanager", this);
                    a.setCustomData("focusmanager_handlers", c)
                }
            }, remove: function (a) {
                a.removeCustomData("focusmanager");
                var e = a.removeCustomData("focusmanager_handlers");
                a.removeListener("blur", e.blur);
                a.removeListener("focus", e.focus)
            }
        }
    }(), CKEDITOR.keystrokeHandler = function (a) {
        if (a.keystrokeHandler)return a.keystrokeHandler;
        this.keystrokes = {};
        this.blockedKeystrokes = {};
        this._ = {editor: a};
        return this
    }, function () {
        var a,
            e = function (b) {
                var b = b.data, c = b.getKeystroke(), d = this.keystrokes[c], e = this._.editor;
                a = e.fire("key", {keyCode: c, domEvent: b}) === false;
                if (!a) {
                    d && (a = e.execCommand(d, {from: "keystrokeHandler"}) !== false);
                    a || (a = !!this.blockedKeystrokes[c])
                }
                a && b.preventDefault(true);
                return !a
            }, b = function (b) {
                if (a) {
                    a = false;
                    b.data.preventDefault(true)
                }
            };
        CKEDITOR.keystrokeHandler.prototype = {
            attach: function (a) {
                a.on("keydown", e, this);
                if (CKEDITOR.env.gecko && CKEDITOR.env.mac)a.on("keypress", b, this)
            }
        }
    }(), function () {
        CKEDITOR.lang = {
            languages: {
                af: 1,
                ar: 1,
                bg: 1,
                bn: 1,
                bs: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                "en-au": 1,
                "en-ca": 1,
                "en-gb": 1,
                en: 1,
                eo: 1,
                es: 1,
                et: 1,
                eu: 1,
                fa: 1,
                fi: 1,
                fo: 1,
                "fr-ca": 1,
                fr: 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                is: 1,
                it: 1,
                ja: 1,
                ka: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                ms: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                "pt-br": 1,
                pt: 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                "sr-latn": 1,
                sr: 1,
                sv: 1,
                th: 1,
                tr: 1,
                tt: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                "zh-cn": 1,
                zh: 1
            },
            rtl: {ar: 1, fa: 1, he: 1, ku: 1, ug: 1},
            load: function (a, e, b) {
                if (!a || !CKEDITOR.lang.languages[a])a = this.detect(e, a);
                var g = this, e = function () {
                    g[a].dir =
                        g.rtl[a] ? "rtl" : "ltr";
                    b(a, g[a])
                };
                this[a] ? e() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), e, this)
            },
            detect: function (a, e) {
                var b = this.languages, e = e || navigator.userLanguage || navigator.language || a, g = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), c = g[1], g = g[2];
                b[c + "-" + g] ? c = c + "-" + g : b[c] || (c = null);
                CKEDITOR.lang.detect = c ? function () {
                    return c
                } : function (a) {
                    return a
                };
                return c || a
            }
        }
    }(), CKEDITOR.scriptLoader = function () {
        var a = {}, e = {};
        return {
            load: function (b, g, c, d) {
                var i = typeof b == "string";
                i && (b = [b]);
                c || (c = CKEDITOR);
                var f = b.length, h = [], j = [], k = function (a) {
                    g && (i ? g.call(c, a) : g.call(c, h, j))
                };
                if (f === 0)k(true); else {
                    var n = function (a, b) {
                        (b ? h : j).push(a);
                        if (--f <= 0) {
                            d && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                            k(b)
                        }
                    }, o = function (b, c) {
                        a[b] = 1;
                        var d = e[b];
                        delete e[b];
                        for (var f = 0; f < d.length; f++)d[f](b, c)
                    }, p = function (b) {
                        if (a[b])n(b, true); else {
                            var c = e[b] || (e[b] = []);
                            c.push(n);
                            if (!(c.length > 1)) {
                                var d = new CKEDITOR.dom.element("script");
                                d.setAttributes({
                                    type: "text/javascript",
                                    src: b
                                });
                                if (g)if (CKEDITOR.env.ie &&
                                    CKEDITOR.env.version < 11)d.$.onreadystatechange = function () {
                                    if (d.$.readyState == "loaded" || d.$.readyState == "complete") {
                                        d.$.onreadystatechange = null;
                                        o(b, true)
                                    }
                                }; else {
                                    d.$.onload = function () {
                                        setTimeout(function () {
                                            o(b, true)
                                        }, 0)
                                    };
                                    d.$.onerror = function () {
                                        o(b, false)
                                    }
                                }
                                d.appendTo(CKEDITOR.document.getHead())
                            }
                        }
                    };
                    d && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                    for (var m = 0; m < f; m++)p(b[m])
                }
            }, queue: function () {
                function a() {
                    var b;
                    (b = g[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0)
                }

                var g = [];
                return function (c,
                                 d) {
                    var e = this;
                    g.push({
                        scriptUrl: c, callback: function () {
                            d && d.apply(this, arguments);
                            g.shift();
                            a.call(e)
                        }
                    });
                    g.length == 1 && a.call(this)
                }
            }()
        }
    }(), CKEDITOR.resourceManager = function (a, e) {
        this.basePath = a;
        this.fileName = e;
        this.registered = {};
        this.loaded = {};
        this.externals = {};
        this._ = {waitingList: {}}
    }, CKEDITOR.resourceManager.prototype = {
        add: function (a, e) {
            if (this.registered[a])throw'[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
            var b = this.registered[a] = e || {};
            b.name = a;
            b.path = this.getPath(a);
            CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
            return this.get(a)
        }, get: function (a) {
            return this.registered[a] || null
        }, getPath: function (a) {
            var e = this.externals[a];
            return CKEDITOR.getUrl(e && e.dir || this.basePath + a + "/")
        }, getFilePath: function (a) {
            var e = this.externals[a];
            return CKEDITOR.getUrl(this.getPath(a) + (e ? e.file : this.fileName + ".js"))
        }, addExternal: function (a, e, b) {
            for (var a = a.split(","), g = 0; g < a.length; g++) {
                var c = a[g];
                b || (e = e.replace(/[^\/]+$/, function (a) {
                    b = a;
                    return ""
                }));
                this.externals[c] =
                {dir: e, file: b || this.fileName + ".js"}
            }
        }, load: function (a, e, b) {
            CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
            for (var g = this.loaded, c = this.registered, d = [], i = {}, f = {}, h = 0; h < a.length; h++) {
                var j = a[h];
                if (j)if (!g[j] && !c[j]) {
                    var k = this.getFilePath(j);
                    d.push(k);
                    k in i || (i[k] = []);
                    i[k].push(j)
                } else f[j] = this.get(j)
            }
            CKEDITOR.scriptLoader.load(d, function (a, c) {
                if (c.length)throw'[CKEDITOR.resourceManager.load] Resource name "' + i[c[0]].join(",") + '" was not found at "' + c[0] + '".';
                for (var d = 0; d < a.length; d++)for (var h = i[a[d]],
                                                           j = 0; j < h.length; j++) {
                    var q = h[j];
                    f[q] = this.get(q);
                    g[q] = 1
                }
                e.call(b, f)
            }, this)
        }
    }, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function (a) {
        var e = {};
        return function (b, g, c) {
            var d = {}, i = function (b) {
                a.call(this, b, function (a) {
                    CKEDITOR.tools.extend(d, a);
                    var b = [], f;
                    for (f in a) {
                        var n = a[f], o = n && n.requires;
                        if (!e[f]) {
                            if (n.icons)for (var p = n.icons.split(","), m = p.length; m--;)CKEDITOR.skin.addIcon(p[m], n.path + "icons/" + (CKEDITOR.env.hidpi &&
                                n.hidpi ? "hidpi/" : "") + p[m] + ".png");
                            e[f] = 1
                        }
                        if (o) {
                            o.split && (o = o.split(","));
                            for (n = 0; n < o.length; n++)d[o[n]] || b.push(o[n])
                        }
                    }
                    if (b.length)i.call(this, b); else {
                        for (f in d) {
                            n = d[f];
                            if (n.onLoad && !n.onLoad._called) {
                                n.onLoad() === false && delete d[f];
                                n.onLoad._called = 1
                            }
                        }
                        g && g.call(c || window, d)
                    }
                }, this)
            };
            i.call(this, b)
        }
    }), CKEDITOR.plugins.setLang = function (a, e, b) {
        var g = this.get(a), a = g.langEntries || (g.langEntries = {}), g = g.lang || (g.lang = []);
        g.split && (g = g.split(","));
        CKEDITOR.tools.indexOf(g, e) == -1 && g.push(e);
        a[e] = b
    }, CKEDITOR.ui =
        function (a) {
            if (a.ui)return a.ui;
            this.items = {};
            this.instances = {};
            this.editor = a;
            this._ = {handlers: {}};
            return this
        }, CKEDITOR.ui.prototype = {
        add: function (a, e, b) {
            b.name = a.toLowerCase();
            var g = this.items[a] = {
                type: e,
                command: b.command || null,
                args: Array.prototype.slice.call(arguments, 2)
            };
            CKEDITOR.tools.extend(g, b)
        }, get: function (a) {
            return this.instances[a]
        }, create: function (a) {
            var e = this.items[a], b = e && this._.handlers[e.type], g = e && e.command && this.editor.getCommand(e.command), b = b && b.create.apply(this, e.args);
            this.instances[a] =
                b;
            g && g.uiItems.push(b);
            if (b && !b.type)b.type = e.type;
            return b
        }, addHandler: function (a, e) {
            this._.handlers[a] = e
        }, space: function (a) {
            return CKEDITOR.document.getById(this.spaceId(a))
        }, spaceId: function (a) {
            return this.editor.id + "_" + a
        }
    }, CKEDITOR.event.implementOn(CKEDITOR.ui), function () {
        function a(a, d, f) {
            CKEDITOR.event.call(this);
            a = a && CKEDITOR.tools.clone(a);
            if (d !== void 0) {
                if (d instanceof CKEDITOR.dom.element) {
                    if (!f)throw Error("One of the element modes must be specified.");
                } else throw Error("Expect element of type CKEDITOR.dom.element.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && f == CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");
                if (!(f == CKEDITOR.ELEMENT_MODE_INLINE ? d.is(CKEDITOR.dtd.$editable) || d.is("textarea") : f == CKEDITOR.ELEMENT_MODE_REPLACE ? !d.is(CKEDITOR.dtd.$nonBodyContent) : 1))throw Error('The specified element mode is not supported on element: "' + d.getName() + '".');
                this.element = d;
                this.elementMode = f;
                this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (d.getId() || d.getNameAtt())
            } else this.elementMode =
                CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {};
            this.commands = {};
            this.templates = {};
            this.name = this.name || e();
            this.id = CKEDITOR.tools.getNextId();
            this.status = "unloaded";
            this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
            this.ui = new CKEDITOR.ui(this);
            this.focusManager = new CKEDITOR.focusManager(this);
            this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
            this.on("readOnly", b);
            this.on("selectionChange", function (a) {
                c(this, a.data.path)
            });
            this.on("activeFilterChange", function () {
                c(this, this.elementPath(), true)
            });
            this.on("mode", b);
            this.on("instanceReady", function () {
                this.config.startupFocus && this.focus()
            });
            CKEDITOR.fire("instanceCreated", null, this);
            CKEDITOR.add(this);
            CKEDITOR.tools.setTimeout(function () {
                i(this, a)
            }, 0, this)
        }

        function e() {
            do var a = "editor" + ++o; while (CKEDITOR.instances[a]);
            return a
        }

        function b() {
            var a = this.commands, b;
            for (b in a)g(this, a[b])
        }

        function g(a, b) {
            b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
        }

        function c(a, b, c) {
            if (b) {
                var d, f, g = a.commands;
                for (f in g) {
                    d = g[f];
                    (c || d.contextSensitive) && d.refresh(a, b)
                }
            }
        }

        function d(a) {
            var b = a.config.customConfig;
            if (!b)return false;
            var b = CKEDITOR.getUrl(b), c = p[b] || (p[b] = {});
            if (c.fn) {
                c.fn.call(a, a.config);
                (CKEDITOR.getUrl(a.config.customConfig) == b || !d(a)) && a.fireOnce("customConfigLoaded")
            } else CKEDITOR.scriptLoader.queue(b, function () {
                c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function () {
                };
                d(a)
            });
            return true
        }

        function i(a, b) {
            a.on("customConfigLoaded", function () {
                if (b) {
                    if (b.on)for (var c in b.on)a.on(c, b.on[c]);
                    CKEDITOR.tools.extend(a.config, b, true);
                    delete a.config.on
                }
                c = a.config;
                a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
                a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
                a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") ||
                    0;
                a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
                a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
                if (c.skin)CKEDITOR.skinName = c.skin;
                a.fireOnce("configLoaded");
                a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
                a.filter = a.activeFilter = new CKEDITOR.filter(a);
                f(a)
            });
            if (b && b.customConfig != null)a.config.customConfig = b.customConfig;
            d(a) || a.fireOnce("customConfigLoaded")
        }

        function f(a) {
            CKEDITOR.skin.loadPart("editor", function () {
                h(a)
            })
        }

        function h(a) {
            CKEDITOR.lang.load(a.config.language,
                a.config.defaultLanguage, function (b, c) {
                    var d = a.config.title;
                    a.langCode = b;
                    a.lang = CKEDITOR.tools.prototypedCopy(c);
                    a.title = typeof d == "string" || d === false ? d : [a.lang.editor, a.name].join(", ");
                    if (!a.config.contentsLangDirection)a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
                    a.fire("langLoaded");
                    j(a)
                })
        }

        function j(a) {
            a.getStylesSet(function (b) {
                a.once("loaded", function () {
                    a.fire("stylesSet", {styles: b})
                }, null, null, 1);
                k(a)
            })
        }

        function k(a) {
            var b =
                a.config, c = b.plugins, d = b.extraPlugins, f = b.removePlugins;
            if (d)var g = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(g, ""), c = c + ("," + d);
            if (f)var h = RegExp("(?:^|,)(?:" + f.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(h, "");
            CKEDITOR.env.air && (c = c + ",adobeair");
            CKEDITOR.plugins.load(c.split(","), function (c) {
                var d = [], f = [], g = [];
                a.plugins = c;
                for (var e in c) {
                    var i = c[e], j = i.lang, q = null, s = i.requires, k;
                    CKEDITOR.tools.isArray(s) && (s = s.join(","));
                    if (s && (k = s.match(h)))for (; s = k.pop();)CKEDITOR.tools.setTimeout(function (a,
                                                                                                      b) {
                        throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
                    }, 0, null, [s, e]);
                    if (j && !a.lang[e]) {
                        j.split && (j = j.split(","));
                        if (CKEDITOR.tools.indexOf(j, a.langCode) >= 0)q = a.langCode; else {
                            q = a.langCode.replace(/-.*/, "");
                            q = q != a.langCode && CKEDITOR.tools.indexOf(j, q) >= 0 ? q : CKEDITOR.tools.indexOf(j, "en") >= 0 ? "en" : j[0]
                        }
                        if (!i.langEntries || !i.langEntries[q])g.push(CKEDITOR.getUrl(i.path + "lang/" + q + ".js")); else {
                            a.lang[e] = i.langEntries[q];
                            q = null
                        }
                    }
                    f.push(q);
                    d.push(i)
                }
                CKEDITOR.scriptLoader.load(g, function () {
                    for (var c = ["beforeInit", "init", "afterInit"], g = 0; g < c.length; g++)for (var h = 0; h < d.length; h++) {
                        var e = d[h];
                        g === 0 && (f[h] && e.lang && e.langEntries) && (a.lang[e.name] = e.langEntries[f[h]]);
                        if (e[c[g]])e[c[g]](a)
                    }
                    a.fireOnce("pluginsLoaded");
                    b.keystrokes && a.setKeystroke(a.config.keystrokes);
                    for (h = 0; h < a.config.blockedKeystrokes.length; h++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[h]] = 1;
                    a.status = "loaded";
                    a.fireOnce("loaded");
                    CKEDITOR.fire("instanceLoaded",
                        null, a)
                })
            })
        }

        function n() {
            var a = this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
                a.is("textarea") ? a.setValue(b) : a.setHtml(b);
                return true
            }
            return false
        }

        a.prototype = CKEDITOR.editor.prototype;
        CKEDITOR.editor = a;
        var o = 0, p = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            addCommand: function (a, b) {
                b.name = a.toLowerCase();
                var c = new CKEDITOR.command(this, b);
                this.mode && g(this, c);
                return this.commands[a] = c
            },
            _attachToForm: function () {
                function a(d) {
                    b.updateElement();
                    b._.required && (!c.getValue() && b.fire("required") === false) && d.data.preventDefault()
                }

                var b = this, c = b.element, d = new CKEDITOR.dom.element(c.$.form);
                if (c.is("textarea") && d) {
                    d.on("submit", a);
                    if (d.$.submit && d.$.submit.call && d.$.submit.apply)d.$.submit = CKEDITOR.tools.override(d.$.submit, function (b) {
                        return function () {
                            a();
                            b.apply ? b.apply(this) : b()
                        }
                    });
                    b.on("destroy", function () {
                        d.removeListener("submit", a)
                    })
                }
            }, destroy: function (a) {
                this.fire("beforeDestroy");
                !a && n.call(this);
                this.editable(null);
                this.filter.destroy();
                delete this.filter;
                delete this.activeFilter;
                this.status = "destroyed";
                this.fire("destroy");
                this.removeAllListeners();
                CKEDITOR.remove(this);
                CKEDITOR.fire("instanceDestroyed", null, this)
            }, elementPath: function (a) {
                if (!a) {
                    a = this.getSelection();
                    if (!a)return null;
                    a = a.getStartElement()
                }
                return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
            }, createRange: function () {
                var a = this.editable();
                return a ? new CKEDITOR.dom.range(a) : null
            }, execCommand: function (a,
                                      b) {
                var c = this.getCommand(a), d = {
                    name: a,
                    commandData: b,
                    command: c
                };
                if (c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== false) {
                    d.returnValue = c.exec(d.commandData);
                    if (!c.async && this.fire("afterCommandExec", d) !== false)return d.returnValue
                }
                return false
            }, getCommand: function (a) {
                return this.commands[a]
            }, getData: function (a) {
                !a && this.fire("beforeGetData");
                var b = this._.data;
                if (typeof b != "string")b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() :
                    b.getHtml() : "";
                b = {dataValue: b};
                !a && this.fire("getData", b);
                return b.dataValue
            }, getSnapshot: function () {
                var a = this.fire("getSnapshot");
                if (typeof a != "string") {
                    var b = this.element;
                    b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
                }
                return a
            }, loadSnapshot: function (a) {
                this.fire("loadSnapshot", a)
            }, setData: function (a, b, c) {
                var d = true, f = b;
                if (b && typeof b == "object") {
                    c = b.internal;
                    f = b.callback;
                    d = !b.noSnapshot
                }
                !c && d && this.fire("saveSnapshot");
                if (f || !c)this.once("dataReady",
                    function (a) {
                        !c && d && this.fire("saveSnapshot");
                        f && f.call(a.editor)
                    });
                a = {dataValue: a};
                !c && this.fire("setData", a);
                this._.data = a.dataValue;
                !c && this.fire("afterSetData", a)
            }, setReadOnly: function (a) {
                a = a == null || a;
                if (this.readOnly != a) {
                    this.readOnly = a;
                    this.keystrokeHandler.blockedKeystrokes[8] = +a;
                    this.editable().setReadOnly(a);
                    this.fire("readOnly")
                }
            }, insertHtml: function (a, b) {
                this.fire("insertHtml", {dataValue: a, mode: b})
            }, insertText: function (a) {
                this.fire("insertText", a)
            }, insertElement: function (a) {
                this.fire("insertElement",
                    a)
            }, focus: function () {
                this.fire("beforeFocus")
            }, checkDirty: function () {
                return this.status == "ready" && this._.previousValue !== this.getSnapshot()
            }, resetDirty: function () {
                this._.previousValue = this.getSnapshot()
            }, updateElement: function () {
                return n.call(this)
            }, setKeystroke: function () {
                for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)], c, d, f = b.length; f--;) {
                    c = b[f];
                    d = 0;
                    if (CKEDITOR.tools.isArray(c)) {
                        d = c[1];
                        c = c[0]
                    }
                    d ? a[c] = d : delete a[c]
                }
            }, addFeature: function (a) {
                return this.filter.addFeature(a)
            },
            setActiveFilter: function (a) {
                if (!a)a = this.filter;
                if (this.activeFilter !== a) {
                    this.activeFilter = a;
                    this.fire("activeFilterChange");
                    a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true))
                }
            }, setActiveEnterMode: function (a, b) {
                a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
                b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode;
                if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
                    this.activeEnterMode =
                        a;
                    this.activeShiftEnterMode = b;
                    this.fire("activeEnterModeChange")
                }
            }
        })
    }(), CKEDITOR.ELEMENT_MODE_NONE = 0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function () {
        this._ = {htmlPartsRegex: /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)--\>)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g}
    }, function () {
        var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g, e = {
            checked: 1,
            compact: 1,
            declare: 1,
            defer: 1,
            disabled: 1,
            ismap: 1,
            multiple: 1,
            nohref: 1,
            noresize: 1,
            noshade: 1,
            nowrap: 1,
            readonly: 1,
            selected: 1
        };
        CKEDITOR.htmlParser.prototype = {
            onTagOpen: function () {
            }, onTagClose: function () {
            }, onText: function () {
            }, onCDATA: function () {
            }, onComment: function () {
            }, parse: function (b) {
                for (var g, c, d = 0, i; g = this._.htmlPartsRegex.exec(b);) {
                    c = g.index;
                    if (c > d) {
                        d = b.substring(d, c);
                        if (i)i.push(d); else this.onText(d)
                    }
                    d = this._.htmlPartsRegex.lastIndex;
                    if (c = g[1]) {
                        c = c.toLowerCase();
                        if (i && CKEDITOR.dtd.$cdata[c]) {
                            this.onCDATA(i.join(""));
                            i = null
                        }
                        if (!i) {
                            this.onTagClose(c);
                            continue
                        }
                    }
                    if (i)i.push(g[0]); else if (c = g[3]) {
                        c = c.toLowerCase();
                        if (!/="/.test(c)) {
                            var f = {}, h, j = g[4];
                            g = !!g[5];
                            if (j)for (; h = a.exec(j);) {
                                var k = h[1].toLowerCase();
                                h = h[2] || h[3] || h[4] || "";
                                f[k] = !h && e[k] ? k : CKEDITOR.tools.htmlDecodeAttr(h)
                            }
                            this.onTagOpen(c, f, g);
                            !i && CKEDITOR.dtd.$cdata[c] && (i = [])
                        }
                    } else if (c = g[2])this.onComment(c)
                }
                if (b.length > d)this.onText(b.substring(d, b.length))
            }
        }
    }(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
        $: function () {
            this._ = {output: []}
        },
        proto: {
            openTag: function (a) {
                this._.output.push("<", a)
            }, openTagClose: function (a, e) {
                e ? this._.output.push(" />") : this._.output.push(">")
            }, attribute: function (a, e) {
                typeof e == "string" && (e = CKEDITOR.tools.htmlEncodeAttr(e));
                this._.output.push(" ", a, '="', e, '"')
            }, closeTag: function (a) {
                this._.output.push("</", a, ">")
            }, text: function (a) {
                this._.output.push(a)
            }, comment: function (a) {
                this._.output.push("<\!--", a, "--\>")
            }, write: function (a) {
                this._.output.push(a)
            }, reset: function () {
                this._.output = [];
                this._.indent = false
            }, getHtml: function (a) {
                var e =
                    this._.output.join("");
                a && this.reset();
                return e
            }
        }
    }), "use strict", function () {
        CKEDITOR.htmlParser.node = function () {
        };
        CKEDITOR.htmlParser.node.prototype = {
            remove: function () {
                var a = this.parent.children, e = CKEDITOR.tools.indexOf(a, this), b = this.previous, g = this.next;
                b && (b.next = g);
                g && (g.previous = b);
                a.splice(e, 1);
                this.parent = null
            }, replaceWith: function (a) {
                var e = this.parent.children, b = CKEDITOR.tools.indexOf(e, this), g = a.previous = this.previous, c = a.next = this.next;
                g && (g.next = a);
                c && (c.previous = a);
                e[b] = a;
                a.parent = this.parent;
                this.parent = null
            }, insertAfter: function (a) {
                var e = a.parent.children, b = CKEDITOR.tools.indexOf(e, a), g = a.next;
                e.splice(b + 1, 0, this);
                this.next = a.next;
                this.previous = a;
                a.next = this;
                g && (g.previous = this);
                this.parent = a.parent
            }, insertBefore: function (a) {
                var e = a.parent.children, b = CKEDITOR.tools.indexOf(e, a);
                e.splice(b, 0, this);
                this.next = a;
                (this.previous = a.previous) && (a.previous.next = this);
                a.previous = this;
                this.parent = a.parent
            }, getAscendant: function (a) {
                var e = typeof a == "function" ? a : typeof a == "string" ? function (b) {
                    return b.name ==
                        a
                } : function (b) {
                    return b.name in a
                }, b = this.parent;
                for (; b && b.type == CKEDITOR.NODE_ELEMENT;) {
                    if (e(b))return b;
                    b = b.parent
                }
                return null
            }, wrapWith: function (a) {
                this.replaceWith(a);
                a.add(this);
                return a
            }, getIndex: function () {
                return CKEDITOR.tools.indexOf(this.parent.children, this)
            }, getFilterContext: function (a) {
                return a || {}
            }
        }
    }(), "use strict", CKEDITOR.htmlParser.comment = function (a) {
        this.value = a;
        this._ = {isBlockLike: false}
    },CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node,
        {
            type: CKEDITOR.NODE_COMMENT, filter: function (a, e) {
            var b = this.value;
            if (!(b = a.onComment(e, b, this))) {
                this.remove();
                return false
            }
            if (typeof b != "string") {
                this.replaceWith(b);
                return false
            }
            this.value = b;
            return true
        }, writeHtml: function (a, e) {
            e && this.filter(e);
            a.comment(this.value)
        }
        }),"use strict",function () {
        CKEDITOR.htmlParser.text = function (a) {
            this.value = a;
            this._ = {isBlockLike: false}
        };
        CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT, filter: function (a,
                                                        e) {
                if (!(this.value = a.onText(e, this.value, this))) {
                    this.remove();
                    return false
                }
            }, writeHtml: function (a, e) {
                e && this.filter(e);
                a.text(this.value)
            }
        })
    }(),"use strict",function () {
        CKEDITOR.htmlParser.cdata = function (a) {
            this.value = a
        };
        CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT,
            filter: function () {
            },
            writeHtml: function (a) {
                a.write(this.value)
            }
        })
    }(),"use strict",CKEDITOR.htmlParser.fragment = function () {
        this.children = [];
        this.parent = null;
        this._ = {
            isBlockLike: true,
            hasInlineStarted: false
        }
    },function () {
        function a(a) {
            return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }

        var e = CKEDITOR.tools.extend({
            table: 1,
            ul: 1,
            ol: 1,
            dl: 1
        }, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl), b = {
            ol: 1,
            ul: 1
        }, g = CKEDITOR.tools.extend({}, {html: 1}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
            style: 1,
            script: 1
        }), c = {
            ul: "li",
            ol: "li",
            dl: "dd",
            table: "tbody",
            tbody: "tr",
            thead: "tr",
            tfoot: "tr",
            tr: "td"
        };
        CKEDITOR.htmlParser.fragment.fromHtml =
            function (d, i, f) {
                function h(a) {
                    var b;
                    if (q.length > 0)for (var c = 0; c < q.length; c++) {
                        var d = q[c], f = d.name, g = CKEDITOR.dtd[f], h = t.name && CKEDITOR.dtd[t.name];
                        if ((!h || h[f]) && (!a || !g || g[a] || !CKEDITOR.dtd[a])) {
                            if (!b) {
                                j();
                                b = 1
                            }
                            d = d.clone();
                            d.parent = t;
                            t = d;
                            q.splice(c, 1);
                            c--
                        } else if (f == t.name) {
                            n(t, t.parent, 1);
                            c--
                        }
                    }
                }

                function j() {
                    for (; s.length;)n(s.shift(), t)
                }

                function k(a) {
                    if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
                        var b = a.children.length, c = a.children[b - 1], d;
                        if (c && c.type == CKEDITOR.NODE_TEXT)(d = CKEDITOR.tools.rtrim(c.value)) ?
                            c.value = d : a.children.length = b - 1
                    }
                }

                function n(b, c, d) {
                    var c = c || t || l, g = t;
                    if (b.previous === void 0) {
                        if (o(c, b)) {
                            t = c;
                            m.onTagOpen(f, {});
                            b.returnPoint = c = t
                        }
                        k(b);
                        (!a(b) || b.children.length) && c.add(b);
                        b.name == "pre" && (w = false);
                        b.name == "textarea" && (u = false)
                    }
                    if (b.returnPoint) {
                        t = b.returnPoint;
                        delete b.returnPoint
                    } else t = d ? c : g
                }

                function o(a, b) {
                    if ((a == l || a.name == "body") && f && (!a.name || CKEDITOR.dtd[a.name][f])) {
                        var c, d;
                        return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                    }
                }

                function p(a, b) {
                    return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
                }

                var m = new CKEDITOR.htmlParser, l = i instanceof CKEDITOR.htmlParser.element ? i : typeof i == "string" ? new CKEDITOR.htmlParser.element(i) : new CKEDITOR.htmlParser.fragment, q = [], s = [], t = l, u = l.name == "textarea", w = l.name == "pre";
                m.onTagOpen = function (c, d, f, i) {
                    d = new CKEDITOR.htmlParser.element(c, d);
                    if (d.isUnknown && f)d.isEmpty =
                        true;
                    d.isOptionalClose = i;
                    if (a(d))q.push(d); else {
                        if (c == "pre")w = true; else {
                            if (c == "br" && w) {
                                t.add(new CKEDITOR.htmlParser.text("\n"));
                                return
                            }
                            c == "textarea" && (u = true)
                        }
                        if (c == "br")s.push(d); else {
                            for (; ;) {
                                i = (f = t.name) ? CKEDITOR.dtd[f] || (t._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : g;
                                if (!d.isUnknown && !t.isUnknown && !i[c])if (t.isOptionalClose)m.onTagClose(f); else if (c in b && f in b) {
                                    f = t.children;
                                    (f = f[f.length - 1]) && f.name == "li" || n(f = new CKEDITOR.htmlParser.element("li"), t);
                                    !d.returnPoint && (d.returnPoint = t);
                                    t = f
                                } else if (c in CKEDITOR.dtd.$listItem && !p(c, f))m.onTagOpen(c == "li" ? "ul" : "dl", {}, 0, 1); else if (f in e && !p(c, f)) {
                                    !d.returnPoint && (d.returnPoint = t);
                                    t = t.parent
                                } else {
                                    f in CKEDITOR.dtd.$inline && q.unshift(t);
                                    if (t.parent)n(t, t.parent, 1); else {
                                        d.isOrphan = 1;
                                        break
                                    }
                                } else break
                            }
                            h(c);
                            j();
                            d.parent = t;
                            d.isEmpty ? n(d) : t = d
                        }
                    }
                };
                m.onTagClose = function (a) {
                    for (var b = q.length - 1; b >= 0; b--)if (a == q[b].name) {
                        q.splice(b, 1);
                        return
                    }
                    for (var c = [], d = [], g = t; g != l && g.name != a;) {
                        g._.isBlockLike || d.unshift(g);
                        c.push(g);
                        g = g.returnPoint || g.parent
                    }
                    if (g !=
                        l) {
                        for (b = 0; b < c.length; b++) {
                            var h = c[b];
                            n(h, h.parent)
                        }
                        t = g;
                        g._.isBlockLike && j();
                        n(g, g.parent);
                        if (g == t)t = t.parent;
                        q = q.concat(d)
                    }
                    a == "body" && (f = false)
                };
                m.onText = function (a) {
                    if ((!t._.hasInlineStarted || s.length) && !w && !u) {
                        a = CKEDITOR.tools.ltrim(a);
                        if (a.length === 0)return
                    }
                    var b = t.name, d = b ? CKEDITOR.dtd[b] || (t._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : g;
                    if (!u && !d["#"] && b in e) {
                        m.onTagOpen(c[b] || "");
                        m.onText(a)
                    } else {
                        j();
                        h();
                        !w && !u && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
                        a = new CKEDITOR.htmlParser.text(a);
                        if (o(t, a))this.onTagOpen(f, {}, 0, 1);
                        t.add(a)
                    }
                };
                m.onCDATA = function (a) {
                    t.add(new CKEDITOR.htmlParser.cdata(a))
                };
                m.onComment = function (a) {
                    j();
                    h();
                    t.add(new CKEDITOR.htmlParser.comment(a))
                };
                m.parse(d);
                for (j(); t != l;)n(t, t.parent, 1);
                k(l);
                return l
            };
        CKEDITOR.htmlParser.fragment.prototype = {
            type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, add: function (a, b) {
                isNaN(b) && (b = this.children.length);
                var c = b > 0 ? this.children[b - 1] : null;
                if (c) {
                    if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
                        c.value = CKEDITOR.tools.rtrim(c.value);
                        if (c.value.length ===
                            0) {
                            this.children.pop();
                            this.add(a);
                            return
                        }
                    }
                    c.next = a
                }
                a.previous = c;
                a.parent = this;
                this.children.splice(b, 0, a);
                if (!this._.hasInlineStarted)this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
            }, filter: function (a, b) {
                b = this.getFilterContext(b);
                a.onRoot(b, this);
                this.filterChildren(a, false, b)
            }, filterChildren: function (a, b, c) {
                if (this.childrenFilteredBy != a.id) {
                    c = this.getFilterContext(c);
                    if (b && !this.parent)a.onRoot(c, this);
                    this.childrenFilteredBy = a.id;
                    for (b = 0; b < this.children.length; b++)this.children[b].filter(a,
                        c) === false && b--
                }
            }, writeHtml: function (a, b) {
                b && this.filter(b);
                this.writeChildrenHtml(a)
            }, writeChildrenHtml: function (a, b, c) {
                var g = this.getFilterContext();
                if (c && !this.parent && b)b.onRoot(g, this);
                b && this.filterChildren(b, false, g);
                b = 0;
                c = this.children;
                for (g = c.length; b < g; b++)c[b].writeHtml(a)
            }, forEach: function (a, b, c) {
                if (!c && (!b || this.type == b))var g = a(this);
                if (g !== false)for (var c = this.children, e = 0; e < c.length; e++) {
                    g = c[e];
                    g.type == CKEDITOR.NODE_ELEMENT ? g.forEach(a, b) : (!b || g.type == b) && a(g)
                }
            }, getFilterContext: function (a) {
                return a ||
                    {}
            }
        }
    }(),"use strict",function () {
        function a() {
            this.rules = []
        }

        function e(b, g, c, d) {
            var e, f;
            for (e in g) {
                (f = b[e]) || (f = b[e] = new a);
                f.add(g[e], c, d)
            }
        }

        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
            $: function (b) {
                this.id = CKEDITOR.tools.getNextNumber();
                this.elementNameRules = new a;
                this.attributeNameRules = new a;
                this.elementsRules = {};
                this.attributesRules = {};
                this.textRules = new a;
                this.commentRules = new a;
                this.rootRules = new a;
                b && this.addRules(b, 10)
            }, proto: {
                addRules: function (a, g) {
                    var c;
                    if (typeof g == "number")c =
                        g; else if (g && "priority" in g)c = g.priority;
                    typeof c != "number" && (c = 10);
                    typeof g != "object" && (g = {});
                    a.elementNames && this.elementNameRules.addMany(a.elementNames, c, g);
                    a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, c, g);
                    a.elements && e(this.elementsRules, a.elements, c, g);
                    a.attributes && e(this.attributesRules, a.attributes, c, g);
                    a.text && this.textRules.add(a.text, c, g);
                    a.comment && this.commentRules.add(a.comment, c, g);
                    a.root && this.rootRules.add(a.root, c, g)
                }, applyTo: function (a) {
                    a.filter(this)
                }, onElementName: function (a,
                                            g) {
                    return this.elementNameRules.execOnName(a, g)
                }, onAttributeName: function (a, g) {
                    return this.attributeNameRules.execOnName(a, g)
                }, onText: function (a, g, c) {
                    return this.textRules.exec(a, g, c)
                }, onComment: function (a, g, c) {
                    return this.commentRules.exec(a, g, c)
                }, onRoot: function (a, g) {
                    return this.rootRules.exec(a, g)
                }, onElement: function (a, g) {
                    for (var c = [this.elementsRules["^"], this.elementsRules[g.name], this.elementsRules.$], d, e = 0; e < 3; e++)if (d = c[e]) {
                        d = d.exec(a, g, this);
                        if (d === false)return null;
                        if (d && d != g)return this.onNode(a,
                            d);
                        if (g.parent && !g.name)break
                    }
                    return g
                }, onNode: function (a, g) {
                    var c = g.type;
                    return c == CKEDITOR.NODE_ELEMENT ? this.onElement(a, g) : c == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, g.value)) : c == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, g.value)) : null
                }, onAttribute: function (a, g, c, d) {
                    return (c = this.attributesRules[c]) ? c.exec(a, d, g, this) : d
                }
            }
        });
        CKEDITOR.htmlParser.filterRulesGroup = a;
        a.prototype = {
            add: function (a, g, c) {
                this.rules.splice(this.findIndex(g), 0, {
                    value: a, priority: g,
                    options: c
                })
            }, addMany: function (a, g, c) {
                for (var d = [this.findIndex(g), 0], e = 0, f = a.length; e < f; e++)d.push({
                    value: a[e],
                    priority: g,
                    options: c
                });
                this.rules.splice.apply(this.rules, d)
            }, findIndex: function (a) {
                for (var g = this.rules, c = g.length - 1; c >= 0 && a < g[c].priority;)c--;
                return c + 1
            }, exec: function (a, g) {
                var c = g instanceof CKEDITOR.htmlParser.node || g instanceof CKEDITOR.htmlParser.fragment, d = Array.prototype.slice.call(arguments, 1), e = this.rules, f = e.length, h, j, k, n;
                for (n = 0; n < f; n++) {
                    if (c) {
                        h = g.type;
                        j = g.name
                    }
                    k = e[n];
                    if (!(a.nonEditable && !k.options.applyToAll || a.nestedEditable && k.options.excludeNestedEditable)) {
                        k = k.value.apply(null, d);
                        if (k === false || c && k && (k.name != j || k.type != h))return k;
                        k != null && (d[0] = g = k)
                    }
                }
                return g
            }, execOnName: function (a, g) {
                for (var c = 0, d = this.rules, e = d.length, f; g && c < e; c++) {
                    f = d[c];
                    !(a.nonEditable && !f.options.applyToAll || a.nestedEditable && f.options.excludeNestedEditable) && (g = g.replace(f.value[0], f.value[1]))
                }
                return g
            }
        }
    }(),function () {
        function a(a, f) {
            function h(a) {
                return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") :
                    new CKEDITOR.htmlParser.element("br", {"data-cke-bogus": 1})
            }

            function e(a, c) {
                return function (f) {
                    if (f.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var e = [], i = b(f), q, k;
                        if (i)for (j(i, 1) && e.push(i); i;) {
                            if (d(i) && (q = g(i)) && j(q))if ((k = g(q)) && !d(k))e.push(q); else {
                                h(s).insertAfter(q);
                                q.remove()
                            }
                            i = i.previous
                        }
                        for (i = 0; i < e.length; i++)e[i].remove();
                        if (e = !a || (typeof c == "function" ? c(f) : c) !== false)if (!s && !CKEDITOR.env.needsBrFiller && f.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)e = false; else if (!s && !CKEDITOR.env.needsBrFiller && (document.documentMode >
                            7 || f.name in CKEDITOR.dtd.tr || f.name in CKEDITOR.dtd.$listItem))e = false; else {
                            e = b(f);
                            e = !e || f.name == "form" && e.name == "input"
                        }
                        e && f.add(h(a))
                    }
                }
            }

            function j(a, b) {
                if ((!s || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"])return true;
                var c;
                if (a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(q))) {
                    if (c.index) {
                        (new CKEDITOR.htmlParser.text(a.value.substring(0, c.index))).insertBefore(a);
                        a.value = c[0]
                    }
                    if (!CKEDITOR.env.needsBrFiller && s && (!b || a.parent.name in x))return true;
                    if (!s)if ((c = a.previous) && c.name == "br" || !c || d(c))return true
                }
                return false
            }

            var k = {elements: {}}, s = f == "html", x = CKEDITOR.tools.extend({}, w), C;
            for (C in x)"#" in t[C] || delete x[C];
            for (C in x)k.elements[C] = e(s, a.config.fillEmptyBlocks);
            k.root = e(s, false);
            k.elements.br = function (a) {
                return function (b) {
                    if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var f = b.attributes;
                        if ("data-cke-bogus" in f || "data-cke-eol" in f)delete f["data-cke-bogus"]; else {
                            for (f = b.next; f && c(f);)f = f.next;
                            var e = g(b);
                            !f && d(b.parent) ? i(b.parent,
                                h(a)) : d(f) && (e && !d(e)) && h(a).insertBefore(f)
                        }
                    }
                }
            }(s);
            return k
        }

        function e(a, b) {
            return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false
        }

        function b(a) {
            for (a = a.children[a.children.length - 1]; a && c(a);)a = a.previous;
            return a
        }

        function g(a) {
            for (a = a.previous; a && c(a);)a = a.previous;
            return a
        }

        function c(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
        }

        function d(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in
                w || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function i(a, b) {
            var c = a.children[a.children.length - 1];
            a.children.push(b);
            b.parent = a;
            if (c) {
                c.next = b;
                b.previous = c
            }
        }

        function f(a) {
            a = a.attributes;
            a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
            a.contenteditable = "false"
        }

        function h(a) {
            a = a.attributes;
            switch (a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function j(a) {
            return a.replace(z, function (a, b, c) {
                return "<" + b + c.replace(B,
                        function (a, b) {
                            return A.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
                        }) + ">"
            })
        }

        function k(a, b) {
            return a.replace(b, function (a, b, c) {
                a.indexOf("<textarea") === 0 && (a = b + p(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
                return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
            })
        }

        function n(a) {
            return a.replace(J, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function o(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function (a) {
                return "<\!--" +
                    s + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
            })
        }

        function p(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function m(a, b) {
            var c = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            }).replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
                return c && c[b] || ""
            })
        }

        function l(a, b) {
            for (var c = [], d = b.config.protectedSource, f = b._.dataStore || (b._.dataStore = {id: 1}), g = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g,
                     d = [/<script[\s\S]*?(<\/script>|$)/gi, /<noscript[\s\S]*?<\/noscript>/gi, /<meta[\s\S]*?\/?>/gi].concat(d), a = a.replace(/<\!--[\s\S]*?--\>/g, function (a) {
                    return "<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
                }), h = 0; h < d.length; h++)a = a.replace(d[h], function (a) {
                a = a.replace(g, function (a, b, d) {
                    return c[d]
                });
                return /cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
            });
            a = a.replace(g, function (a, b, d) {
                return "<\!--" + s + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") + "--\>"
            });
            a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=\/>]+))+\s*\/?>/g,
                function (a) {
                    return a.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function (a, b) {
                        f[f.id] = decodeURIComponent(b);
                        return "{cke_protected_" + f.id++ + "}"
                    })
                });
            return a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function (a, c, d, f) {
                return "<" + c + d + ">" + m(p(f), b) + "</" + c + ">"
            })
        }

        CKEDITOR.htmlDataProcessor = function (b) {
            var c, d, f = this;
            this.editor = b;
            this.dataFilter = c = new CKEDITOR.htmlParser.filter;
            this.htmlFilter = d = new CKEDITOR.htmlParser.filter;
            this.writer = new CKEDITOR.htmlParser.basicWriter;
            c.addRules(x);
            c.addRules(v, {applyToAll: true});
            c.addRules(a(b, "data"), {applyToAll: true});
            d.addRules(r);
            d.addRules(y, {applyToAll: true});
            d.addRules(a(b, "html"), {applyToAll: true});
            b.on("toHtml", function (a) {
                var a = a.data, c = a.dataValue, d, c = l(c, b), c = k(c, D), c = j(c), c = k(c, G), c = c.replace(C, "$1cke:$2"), c = c.replace(E, "<cke:$1$2></cke:$1>"), c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"), c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2");
                d = a.context || b.editable().getName();
                var f;
                if (CKEDITOR.env.ie &&
                    CKEDITOR.env.version < 9 && d == "pre") {
                    d = "div";
                    c = "<pre>" + c + "</pre>";
                    f = 1
                }
                d = b.document.createElement(d);
                d.setHtml("a" + c);
                c = d.getHtml().substr(1);
                c = c.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
                f && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
                c = c.replace(F, "$1$2");
                c = n(c);
                c = p(c);
                d = a.fixForBody === false ? false : e(a.enterMode, b.config.autoParagraph);
                c = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, d);
                if (d) {
                    f = c;
                    if (!f.children.length && CKEDITOR.dtd[f.name][d]) {
                        d = new CKEDITOR.htmlParser.element(d);
                        f.add(d)
                    }
                }
                a.dataValue =
                    c
            }, null, null, 5);
            b.on("toHtml", function (a) {
                a.data.filter.applyTo(a.data.dataValue, true, a.data.dontFilter, a.data.enterMode) && b.fire("dataFiltered")
            }, null, null, 6);
            b.on("toHtml", function (a) {
                a.data.dataValue.filterChildren(f.dataFilter, true)
            }, null, null, 10);
            b.on("toHtml", function (a) {
                var a = a.data, b = a.dataValue, c = new CKEDITOR.htmlParser.basicWriter;
                b.writeChildrenHtml(c);
                b = c.getHtml(true);
                a.dataValue = o(b)
            }, null, null, 15);
            b.on("toDataFormat", function (a) {
                var c = a.data.dataValue;
                a.data.enterMode != CKEDITOR.ENTER_BR &&
                (c = c.replace(/^<br *\/?>/i, ""));
                a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, e(a.data.enterMode, b.config.autoParagraph))
            }, null, null, 5);
            b.on("toDataFormat", function (a) {
                a.data.dataValue.filterChildren(f.htmlFilter, true)
            }, null, null, 10);
            b.on("toDataFormat", function (a) {
                a.data.filter.applyTo(a.data.dataValue, false, true)
            }, null, null, 11);
            b.on("toDataFormat", function (a) {
                var c = a.data.dataValue, d = f.writer;
                d.reset();
                c.writeChildrenHtml(d);
                c = d.getHtml(true);
                c = p(c);
                c = m(c, b);
                a.data.dataValue =
                    c
            }, null, null, 15)
        };
        CKEDITOR.htmlDataProcessor.prototype = {
            toHtml: function (a, b, c, d) {
                var f = this.editor, g, h, e;
                if (b && typeof b == "object") {
                    g = b.context;
                    c = b.fixForBody;
                    d = b.dontFilter;
                    h = b.filter;
                    e = b.enterMode
                } else g = b;
                !g && g !== null && (g = f.editable().getName());
                return f.fire("toHtml", {
                    dataValue: a,
                    context: g,
                    fixForBody: c,
                    dontFilter: d,
                    filter: h || f.filter,
                    enterMode: e || f.enterMode
                }).dataValue
            }, toDataFormat: function (a, b) {
                var c, d, f;
                if (b) {
                    c = b.context;
                    d = b.filter;
                    f = b.enterMode
                }
                !c && c !== null && (c = this.editor.editable().getName());
                return this.editor.fire("toDataFormat", {
                    dataValue: a,
                    filter: d || this.editor.filter,
                    context: c,
                    enterMode: f || this.editor.enterMode
                }).dataValue
            }
        };
        var q = /(?:&nbsp;|\xa0)$/, s = "{cke_protected}", t = CKEDITOR.dtd, u = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"], w = CKEDITOR.tools.extend({}, t.$blockLimit, t.$block), x = {
            elements: {
                input: f,
                textarea: f
            }
        }, v = {attributeNames: [[/^on/, "data-cke-pa-on"], [/^data-cke-expando$/, ""]]}, r = {
            elements: {
                embed: function (a) {
                    var b = a.parent;
                    if (b && b.name == "object") {
                        var c = b.attributes.width,
                            b = b.attributes.height;
                        if (c)a.attributes.width = c;
                        if (b)a.attributes.height = b
                    }
                }, a: function (a) {
                    if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"])return false
                }
            }
        }, y = {
            elementNames: [[/^cke:/, ""], [/^\?xml:namespace$/, ""]],
            attributeNames: [[/^data-cke-(saved|pa)-/, ""], [/^data-cke-.*/, ""], ["hidefocus", ""]],
            elements: {
                $: function (a) {
                    var b = a.attributes;
                    if (b) {
                        if (b["data-cke-temp"])return false;
                        for (var c = ["name", "href", "src"], d, f = 0; f < c.length; f++) {
                            d = "data-cke-saved-" + c[f];
                            d in b && delete b[c[f]]
                        }
                    }
                    return a
                },
                table: function (a) {
                    a.children.slice(0).sort(function (a, b) {
                        var c, d;
                        if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
                            c = CKEDITOR.tools.indexOf(u, a.name);
                            d = CKEDITOR.tools.indexOf(u, b.name)
                        }
                        if (!(c > -1 && d > -1 && c != d)) {
                            c = a.parent ? a.getIndex() : -1;
                            d = b.parent ? b.getIndex() : -1
                        }
                        return c > d ? 1 : -1
                    })
                }, param: function (a) {
                    a.children = [];
                    a.isEmpty = true;
                    return a
                }, span: function (a) {
                    a.attributes["class"] == "Apple-style-span" && delete a.name
                }, html: function (a) {
                    delete a.attributes.contenteditable;
                    delete a.attributes["class"]
                }, body: function (a) {
                    delete a.attributes.spellcheck;
                    delete a.attributes.contenteditable
                }, style: function (a) {
                    var b = a.children[0];
                    if (b && b.value)b.value = CKEDITOR.tools.trim(b.value);
                    if (!a.attributes.type)a.attributes.type = "text/css"
                }, title: function (a) {
                    var b = a.children[0];
                    !b && i(a, b = new CKEDITOR.htmlParser.text);
                    b.value = a.attributes["data-cke-title"] || ""
                }, input: h, textarea: h
            },
            attributes: {
                "class": function (a) {
                    return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
                }
            }
        };
        if (CKEDITOR.env.ie)y.attributes.style = function (a) {
            return a.replace(/(^|;)([^\:]+)/g,
                function (a) {
                    return a.toLowerCase()
                })
        };
        var z = /<(a|area|img|input|source)\b([^>]*)>/gi, B = /([\w-:]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi, A = /^(href|src|name)$/i, G = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi, D = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi, J = /<cke:encoded>([^<]*)<\/cke:encoded>/gi, C = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi, F = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi, E = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    }(),
    "use strict",CKEDITOR.htmlParser.element = function (a, e) {
        this.name = a;
        this.attributes = e || {};
        this.children = [];
        var b = a || "", g = b.match(/^cke:(.*)/);
        g && (b = g[1]);
        b = !(!CKEDITOR.dtd.$nonBodyContent[b] && !CKEDITOR.dtd.$block[b] && !CKEDITOR.dtd.$listItem[b] && !CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br"));
        this.isEmpty = !!CKEDITOR.dtd.$empty[a];
        this.isUnknown = !CKEDITOR.dtd[a];
        this._ = {isBlockLike: b, hasInlineStarted: this.isEmpty || !b}
    },CKEDITOR.htmlParser.cssStyle = function (a) {
        var e = {};
        ((a instanceof
        CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, g, c) {
            g == "font-family" && (c = c.replace(/["']/g, ""));
            e[g.toLowerCase()] = c
        });
        return {
            rules: e, populate: function (a) {
                var g = this.toString();
                if (g)a instanceof CKEDITOR.dom.element ? a.setAttribute("style", g) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = g : a.style = g
            }, toString: function () {
                var a = [], g;
                for (g in e)e[g] && a.push(g, ":", e[g], ";");
                return a.join("")
            }
        }
    },function () {
        function a(a) {
            return function (b) {
                return b.type ==
                    CKEDITOR.NODE_ELEMENT && (typeof a == "string" ? b.name == a : b.name in a)
            }
        }

        var e = function (a, b) {
            a = a[0];
            b = b[0];
            return a < b ? -1 : a > b ? 1 : 0
        }, b = CKEDITOR.htmlParser.fragment.prototype;
        CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_ELEMENT,
            add: b.add,
            clone: function () {
                return new CKEDITOR.htmlParser.element(this.name, this.attributes)
            },
            filter: function (a, b) {
                var d = this, e, f, b = d.getFilterContext(b);
                if (b.off)return true;
                if (!d.parent)a.onRoot(b, d);
                for (; ;) {
                    e = d.name;
                    if (!(f = a.onElementName(b, e))) {
                        this.remove();
                        return false
                    }
                    d.name = f;
                    if (!(d = a.onElement(b, d))) {
                        this.remove();
                        return false
                    }
                    if (d !== this) {
                        this.replaceWith(d);
                        return false
                    }
                    if (d.name == e)break;
                    if (d.type != CKEDITOR.NODE_ELEMENT) {
                        this.replaceWith(d);
                        return false
                    }
                    if (!d.name) {
                        this.replaceWithChildren();
                        return false
                    }
                }
                e = d.attributes;
                var h, j;
                for (h in e) {
                    j = h;
                    for (f = e[h]; ;)if (j = a.onAttributeName(b, h))if (j != h) {
                        delete e[h];
                        h = j
                    } else break; else {
                        delete e[h];
                        break
                    }
                    j && ((f = a.onAttribute(b, d, j, f)) === false ? delete e[j] : e[j] = f)
                }
                d.isEmpty ||
                this.filterChildren(a, false, b);
                return true
            },
            filterChildren: b.filterChildren,
            writeHtml: function (a, b) {
                b && this.filter(b);
                var d = this.name, i = [], f = this.attributes, h, j;
                a.openTag(d, f);
                for (h in f)i.push([h, f[h]]);
                a.sortAttributes && i.sort(e);
                h = 0;
                for (j = i.length; h < j; h++) {
                    f = i[h];
                    a.attribute(f[0], f[1])
                }
                a.openTagClose(d, this.isEmpty);
                this.writeChildrenHtml(a);
                this.isEmpty || a.closeTag(d)
            },
            writeChildrenHtml: b.writeChildrenHtml,
            replaceWithChildren: function () {
                for (var a = this.children, b = a.length; b;)a[--b].insertAfter(this);
                this.remove()
            },
            forEach: b.forEach,
            getFirst: function (b) {
                if (!b)return this.children.length ? this.children[0] : null;
                typeof b != "function" && (b = a(b));
                for (var c = 0, d = this.children.length; c < d; ++c)if (b(this.children[c]))return this.children[c];
                return null
            },
            getHtml: function () {
                var a = new CKEDITOR.htmlParser.basicWriter;
                this.writeChildrenHtml(a);
                return a.getHtml()
            },
            setHtml: function (a) {
                for (var a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children, b = 0, d = a.length; b < d; ++b)a[b].parent = this
            },
            getOuterHtml: function () {
                var a =
                    new CKEDITOR.htmlParser.basicWriter;
                this.writeHtml(a);
                return a.getHtml()
            },
            split: function (a) {
                for (var b = this.children.splice(a, this.children.length - a), d = this.clone(), e = 0; e < b.length; ++e)b[e].parent = d;
                d.children = b;
                if (b[0])b[0].previous = null;
                if (a > 0)this.children[a - 1].next = null;
                this.parent.add(d, this.getIndex() + 1);
                return d
            },
            addClass: function (a) {
                if (!this.hasClass(a)) {
                    var b = this.attributes["class"] || "";
                    this.attributes["class"] = b + (b ? " " : "") + a
                }
            },
            removeClass: function (a) {
                var b = this.attributes["class"];
                if (b)(b =
                    CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"]
            },
            hasClass: function (a) {
                var b = this.attributes["class"];
                return !b ? false : RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b)
            },
            getFilterContext: function (a) {
                var b = [];
                a || (a = {
                    off: false,
                    nonEditable: false,
                    nestedEditable: false
                });
                !a.off && this.attributes["data-cke-processor"] == "off" && b.push("off", true);
                !a.nonEditable && this.attributes.contenteditable == "false" ? b.push("nonEditable", true) : a.nonEditable &&
                (!a.nestedEditable && this.attributes.contenteditable == "true") && b.push("nestedEditable", true);
                if (b.length)for (var a = CKEDITOR.tools.copy(a), d = 0; d < b.length; d = d + 2)a[b[d]] = b[d + 1];
                return a
            }
        }, true)
    }(),function () {
        var a = {}, e = /{([^}]+)}/g, b = /([\\'])/g, g = /\n/g, c = /\r/g;
        CKEDITOR.template = function (d) {
            if (a[d])this.output = a[d]; else {
                var i = d.replace(b, "\\$1").replace(g, "\\n").replace(c, "\\r").replace(e, function (a, b) {
                    return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                });
                this.output = a[d] = Function("data", "buffer",
                    "return buffer?buffer.push('" + i + "'):['" + i + "'].join('');")
            }
        }
    }(),delete CKEDITOR.loadFullCore,CKEDITOR.instances = {},CKEDITOR.document = new CKEDITOR.dom.document(document),CKEDITOR.add = function (a) {
        CKEDITOR.instances[a.name] = a;
        a.on("focus", function () {
            if (CKEDITOR.currentInstance != a) {
                CKEDITOR.currentInstance = a;
                CKEDITOR.fire("currentInstance")
            }
        });
        a.on("blur", function () {
            if (CKEDITOR.currentInstance == a) {
                CKEDITOR.currentInstance = null;
                CKEDITOR.fire("currentInstance")
            }
        });
        CKEDITOR.fire("instance", null, a)
    },CKEDITOR.remove =
        function (a) {
            delete CKEDITOR.instances[a.name]
        },function () {
        var a = {};
        CKEDITOR.addTemplate = function (e, b) {
            var g = a[e];
            if (g)return g;
            g = {name: e, source: b};
            CKEDITOR.fire("template", g);
            return a[e] = new CKEDITOR.template(g.source)
        };
        CKEDITOR.getTemplate = function (e) {
            return a[e]
        }
    }(),function () {
        var a = [];
        CKEDITOR.addCss = function (e) {
            a.push(e)
        };
        CKEDITOR.getCss = function () {
            return a.join("\n")
        }
    }(),CKEDITOR.on("instanceDestroyed", function () {
        CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
    }),CKEDITOR.TRISTATE_ON =
        1,CKEDITOR.TRISTATE_OFF = 2,CKEDITOR.TRISTATE_DISABLED = 0,function () {
        CKEDITOR.inline = function (a, e) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var b = new CKEDITOR.editor(e, a, CKEDITOR.ELEMENT_MODE_INLINE), g = a.is("textarea") ? a : null;
            if (g) {
                b.setData(g.getValue(), null, true);
                a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!b.readOnly + '" class="cke_textarea_inline">' +
                    g.getValue() + "</div>", CKEDITOR.document);
                a.insertAfter(g);
                g.hide();
                g.$.form && b._attachToForm()
            } else b.setData(a.getHtml(), null, true);
            b.on("loaded", function () {
                b.fire("uiReady");
                b.editable(a);
                b.container = a;
                b.setData(b.getData(1));
                b.resetDirty();
                b.fire("contentDom");
                b.mode = "wysiwyg";
                b.fire("mode");
                b.status = "ready";
                b.fireOnce("instanceReady");
                CKEDITOR.fire("instanceReady", null, b)
            }, null, null, 1E4);
            b.on("destroy", function () {
                if (g) {
                    b.container.clearCustomData();
                    b.container.remove();
                    g.show()
                }
                b.element.clearCustomData();
                delete b.element
            });
            return b
        };
        CKEDITOR.inlineAll = function () {
            var a, e, b;
            for (b in CKEDITOR.dtd.$editable)for (var g = CKEDITOR.document.getElementsByTag(b), c = 0, d = g.count(); c < d; c++) {
                a = g.getItem(c);
                if (a.getAttribute("contenteditable") == "true") {
                    e = {element: a, config: {}};
                    CKEDITOR.fire("inline", e) !== false && CKEDITOR.inline(a, e.config)
                }
            }
        };
        CKEDITOR.domReady(function () {
            !CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
        })
    }(),CKEDITOR.replaceClass = "ckeditor",function () {
        function a(a, c, d, i) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var f = new CKEDITOR.editor(c, a, i);
            if (i == CKEDITOR.ELEMENT_MODE_REPLACE) {
                a.setStyle("visibility", "hidden");
                f._.required = a.hasAttribute("required");
                a.removeAttribute("required")
            }
            d && f.setData(d, null, true);
            f.on("loaded", function () {
                b(f);
                i == CKEDITOR.ELEMENT_MODE_REPLACE && (f.config.autoUpdateElement && a.$.form) && f._attachToForm();
                f.setMode(f.config.startupMode, function () {
                    f.resetDirty();
                    f.status = "ready";
                    f.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, f)
                })
            });
            f.on("destroy", e);
            return f
        }

        function e() {
            var a = this.container, b = this.element;
            if (a) {
                a.clearCustomData();
                a.remove()
            }
            if (b) {
                b.clearCustomData();
                if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
                    b.show();
                    this._.required && b.setAttribute("required", "required")
                }
                delete this.element
            }
        }

        function b(a) {
            var b = a.name, d = a.element, e = a.elementMode, f = a.fire("uiSpace", {
                    space: "top",
                    html: ""
                }).html, h = a.fire("uiSpace", {space: "bottom", html: ""}).html,
                j = new CKEDITOR.template('<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : "") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : "") + '<{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'),
                b = CKEDITOR.dom.element.createFromHtml(j.output({
                    id: a.id,
                    name: b,
                    langDir: a.lang.dir,
                    langCode: a.langCode,
                    voiceLabel: a.title,
                    topHtml: f ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + f + "</span>" : "",
                    contentId: a.ui.spaceId("contents"),
                    bottomHtml: h ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + h + "</span>" : "",
                    outerEl: CKEDITOR.env.ie ? "span" : "div"
                }));
            if (e == CKEDITOR.ELEMENT_MODE_REPLACE) {
                d.hide();
                b.insertAfter(d)
            } else d.append(b);
            a.container = b;
            f && a.ui.space("top").unselectable();
            h && a.ui.space("bottom").unselectable();
            d = a.config.width;
            e = a.config.height;
            d && b.setStyle("width", CKEDITOR.tools.cssLength(d));
            e && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(e));
            b.disableContextMenu();
            CKEDITOR.env.webkit && b.on("focus", function () {
                a.focus()
            });
            a.fireOnce("uiReady")
        }

        CKEDITOR.replace = function (b, c) {
            return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        };
        CKEDITOR.appendTo = function (b, c, d) {
            return a(b, c, d, CKEDITOR.ELEMENT_MODE_APPENDTO)
        };
        CKEDITOR.replaceAll = function () {
            for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
                var d = null, e = a[b];
                if (e.name || e.id) {
                    if (typeof arguments[0] == "string") {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className))continue
                    } else if (typeof arguments[0] == "function") {
                        d = {};
                        if (arguments[0](e, d) === false)continue
                    }
                    this.replace(e, d)
                }
            }
        };
        CKEDITOR.editor.prototype.addMode = function (a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        };
        CKEDITOR.editor.prototype.setMode = function (a, b) {
            var d = this, e =
                this._.modes;
            if (!(a == d.mode || !e || !e[a])) {
                d.fire("beforeSetMode", a);
                if (d.mode) {
                    var f = d.checkDirty(), e = d._.previousModeData, h, j = 0;
                    d.fire("beforeModeUnload");
                    d.editable(0);
                    d._.previousMode = d.mode;
                    d._.previousModeData = h = d.getData(1);
                    if (d.mode == "source" && e == h) {
                        d.fire("lockSnapshot", {forceUpdate: true});
                        j = 1
                    }
                    d.ui.space("contents").setHtml("");
                    d.mode = ""
                } else d._.previousModeData = d.getData(1);
                this._.modes[a](function () {
                    d.mode = a;
                    f !== void 0 && !f && d.resetDirty();
                    j ? d.fire("unlockSnapshot") : a == "wysiwyg" && d.fire("saveSnapshot");
                    setTimeout(function () {
                        d.fire("mode");
                        b && b.call(d)
                    }, 0)
                })
            }
        };
        CKEDITOR.editor.prototype.resize = function (a, b, d, e) {
            var f = this.container, h = this.ui.space("contents"), j = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement, e = e ? this.container.getFirst(function (a) {
                return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
            }) : f;
            e.setSize("width", a, true);
            j && (j.style.width = "1%");
            h.setStyle("height", Math.max(b - (d ? 0 : (e.$.offsetHeight || 0) - (h.$.clientHeight || 0)), 0) + "px");
            j && (j.style.width =
                "100%");
            this.fire("resize")
        };
        CKEDITOR.editor.prototype.getResizable = function (a) {
            return a ? this.ui.space("contents") : this.container
        };
        CKEDITOR.domReady(function () {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    }(),CKEDITOR.config.startupMode = "wysiwyg",function () {
        function a(a) {
            var b = a.editor, c = a.data.path, d = c.blockLimit, f = a.data.selection, h = f.getRanges()[0], j;
            if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)if (f = e(f, c)) {
                f.appendBogus();
                j = CKEDITOR.env.ie
            }
            if (i(b, c.block,
                    d) && h.collapsed && !h.getCommonAncestor().isReadOnly()) {
                c = h.clone();
                c.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                d = new CKEDITOR.dom.walker(c);
                d.guard = function (a) {
                    return !g(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
                };
                if (!d.checkForward() || c.checkStartOfBlock() && c.checkEndOfBlock()) {
                    b = h.fixBlock(true, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    if (!CKEDITOR.env.needsBrFiller)(b = b.getFirst(g)) && (b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/)) && b.remove();
                    j = 1;
                    a.cancel()
                }
            }
            j && h.select()
        }

        function e(a, b) {
            if (a.isFake)return 0;
            var c = b.block || b.blockLimit, d = c && c.getLast(g);
            if (c && c.isBlockBoundary() && (!d || !(d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary())) && !c.is("pre") && !c.getBogus())return c
        }

        function b(a) {
            var b = a.data.getTarget();
            if (b.is("input")) {
                b = b.getAttribute("type");
                (b == "submit" || b == "reset") && a.data.preventDefault()
            }
        }

        function g(a) {
            return o(a) && p(a)
        }

        function c(a, b) {
            return function (c) {
                var d = CKEDITOR.dom.element.get(c.data.$.toElement || c.data.$.fromElement ||
                    c.data.$.relatedTarget);
                (!d || !b.equals(d) && !b.contains(d)) && a.call(this, c)
            }
        }

        function d(a) {
            function b(a) {
                return function (b, d) {
                    d && (b.type == CKEDITOR.NODE_ELEMENT && b.is(f)) && (c = b);
                    if (!d && g(b) && (!a || !k(b)))return false
                }
            }

            var c, d = a.getRanges()[0], a = a.root, f = {
                table: 1,
                ul: 1,
                ol: 1,
                dl: 1
            };
            if (d.startPath().contains(f)) {
                var e = d.clone();
                e.collapse(1);
                e.setStartAt(a, CKEDITOR.POSITION_AFTER_START);
                a = new CKEDITOR.dom.walker(e);
                a.guard = b();
                a.checkBackward();
                if (c) {
                    e = d.clone();
                    e.collapse();
                    e.setEndAt(c, CKEDITOR.POSITION_AFTER_END);
                    a = new CKEDITOR.dom.walker(e);
                    a.guard = b(true);
                    c = false;
                    a.checkForward();
                    return c
                }
            }
            return null
        }

        function i(a, b, c) {
            return a.config.autoParagraph !== false && a.activeEnterMode != CKEDITOR.ENTER_BR && a.editable().equals(c) && !b || b && b.getAttribute("contenteditable") == "true"
        }

        function f(a) {
            a.editor.focus();
            a.editor.fire("saveSnapshot")
        }

        function h(a) {
            var b = a.editor;
            b.getSelection().scrollIntoView();
            setTimeout(function () {
                b.fire("saveSnapshot")
            }, 0)
        }

        function j(a, b, c) {
            for (var d = a.getCommonAncestor(b), b = a = c ? b : a; (a = a.getParent()) && !d.equals(a) && a.getChildCount() == 1;)b = a;
            b.remove()
        }

        CKEDITOR.editable = CKEDITOR.tools.createClass({
            base: CKEDITOR.dom.element, $: function (a, b) {
                this.base(b.$ || b);
                this.editor = a;
                this.status = "unloaded";
                this.hasFocus = false;
                this.setup()
            }, proto: {
                focus: function () {
                    var a;
                    if (CKEDITOR.env.webkit && !this.hasFocus) {
                        a = this.editor._.previousActive || this.getDocument().getActive();
                        if (this.contains(a)) {
                            a.focus();
                            return
                        }
                    }
                    try {
                        this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]()
                    } catch (b) {
                        if (!CKEDITOR.env.ie)throw b;
                    }
                    if (CKEDITOR.env.safari && !this.isInline()) {
                        a = CKEDITOR.document.getActive();
                        a.equals(this.getWindow().getFrame()) || this.getWindow().focus()
                    }
                }, on: function (a, b) {
                    var d = Array.prototype.slice.call(arguments, 0);
                    if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
                        a = a == "focus" ? "focusin" : "focusout";
                        b = c(b, this);
                        d[0] = a;
                        d[1] = b
                    }
                    return CKEDITOR.dom.element.prototype.on.apply(this, d)
                }, attachListener: function (a) {
                    !this._.listeners && (this._.listeners = []);
                    var b = Array.prototype.slice.call(arguments, 1), b = a.on.apply(a, b);
                    this._.listeners.push(b);
                    return b
                }, clearListeners: function () {
                    var a = this._.listeners;
                    try {
                        for (; a.length;)a.pop().removeListener()
                    } catch (b) {
                    }
                }, restoreAttrs: function () {
                    var a = this._.attrChanges, b, c;
                    for (c in a)if (a.hasOwnProperty(c)) {
                        b = a[c];
                        b !== null ? this.setAttribute(c, b) : this.removeAttribute(c)
                    }
                }, attachClass: function (a) {
                    var b = this.getCustomData("classes");
                    if (!this.hasClass(a)) {
                        !b && (b = []);
                        b.push(a);
                        this.setCustomData("classes", b);
                        this.addClass(a)
                    }
                }, changeAttr: function (a, b) {
                    var c = this.getAttribute(a);
                    if (b !== c) {
                        !this._.attrChanges &&
                        (this._.attrChanges = {});
                        a in this._.attrChanges || (this._.attrChanges[a] = c);
                        this.setAttribute(a, b)
                    }
                }, insertHtml: function (a, b) {
                    f(this);
                    m(this, b || "html", a)
                }, insertText: function (a) {
                    f(this);
                    var b = this.editor, c = b.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b.activeEnterMode, b = c == CKEDITOR.ENTER_BR, d = CKEDITOR.tools, a = d.htmlEncode(a.replace(/\r\n/g, "\n")), a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"), c = c == CKEDITOR.ENTER_P ? "p" : "div";
                    if (!b) {
                        var g = /\n{2}/g;
                        if (g.test(a))var e = "<" + c +
                            ">", h = "</" + c + ">", a = e + a.replace(g, function () {
                                return h + e
                            }) + h
                    }
                    a = a.replace(/\n/g, "<br>");
                    b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function (a) {
                        return d.repeat(a, 2)
                    }));
                    a = a.replace(/^ | $/g, "&nbsp;");
                    a = a.replace(/(>|\s) /g, function (a, b) {
                        return b + "&nbsp;"
                    }).replace(/ (?=<)/g, "&nbsp;");
                    m(this, "text", a)
                }, insertElement: function (a, b) {
                    b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
                }, insertElementIntoRange: function (a, b) {
                    var c = this.editor, d = c.config.enterMode, f = a.getName(), g = CKEDITOR.dtd.$block[f];
                    if (b.checkReadOnly())return false;
                    b.deleteContents(1);
                    b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
                        tr: 1,
                        table: 1,
                        tbody: 1,
                        thead: 1,
                        tfoot: 1
                    }) && l(b);
                    var e, h;
                    if (g)for (; (e = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[e.getName()]) && (!h || !h[f]);)if (e.getName() in CKEDITOR.dtd.span)b.splitElement(e); else if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
                        b.setStartBefore(e);
                        b.collapse(true);
                        e.remove()
                    } else b.splitBlock(d == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
                    b.insertNode(a);
                    return true
                },
                insertElementIntoSelection: function (a) {
                    f(this);
                    var b = this.editor, c = b.activeEnterMode, b = b.getSelection(), d = b.getRanges()[0], e = a.getName(), e = CKEDITOR.dtd.$block[e];
                    if (this.insertElementIntoRange(a, d)) {
                        d.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                        if (e)if ((e = a.getNext(function (a) {
                                return g(a) && !k(a)
                            })) && e.type == CKEDITOR.NODE_ELEMENT && e.is(CKEDITOR.dtd.$block))e.getDtd()["#"] ? d.moveToElementEditStart(e) : d.moveToElementEditEnd(a); else if (!e && c != CKEDITOR.ENTER_BR) {
                            e = d.fixBlock(true, c == CKEDITOR.ENTER_DIV ?
                                "div" : "p");
                            d.moveToElementEditStart(e)
                        }
                    }
                    b.selectRanges([d]);
                    h(this)
                }, setData: function (a, b) {
                    b || (a = this.editor.dataProcessor.toHtml(a));
                    this.setHtml(a);
                    this.fixInitialSelection();
                    if (this.status == "unloaded")this.status = "ready";
                    this.editor.fire("dataReady")
                }, getData: function (a) {
                    var b = this.getHtml();
                    a || (b = this.editor.dataProcessor.toDataFormat(b));
                    return b
                }, setReadOnly: function (a) {
                    this.setAttribute("contenteditable", !a)
                }, detach: function () {
                    this.removeClass("cke_editable");
                    this.status = "detached";
                    var a = this.editor;
                    this._.detach();
                    delete a.document;
                    delete a.window
                }, isInline: function () {
                    return this.getDocument().equals(CKEDITOR.document)
                }, fixInitialSelection: function () {
                    function a() {
                        var b = c.getDocument().$, d = b.getSelection(), f;
                        if (d.anchorNode && d.anchorNode == c.$)f = true; else if (CKEDITOR.env.webkit) {
                            var g = c.getDocument().getActive();
                            g && (g.equals(c) && !d.anchorNode) && (f = true)
                        }
                        if (f) {
                            f = new CKEDITOR.dom.range(c);
                            f.moveToElementEditStart(c);
                            b = b.createRange();
                            b.setStart(f.startContainer.$, f.startOffset);
                            b.collapse(true);
                            d.removeAllRanges();
                            d.addRange(b)
                        }
                    }

                    function b() {
                        var a = c.getDocument().$, d = a.selection, f = c.getDocument().getActive();
                        if (d.type == "None" && f.equals(c)) {
                            d = new CKEDITOR.dom.range(c);
                            a = a.body.createTextRange();
                            d.moveToElementEditStart(c);
                            d = d.startContainer;
                            d.type != CKEDITOR.NODE_ELEMENT && (d = d.getParent());
                            a.moveToElementText(d.$);
                            a.collapse(true);
                            a.select()
                        }
                    }

                    var c = this;
                    if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 || CKEDITOR.env.quirks)) {
                        if (this.hasFocus) {
                            this.focus();
                            b()
                        }
                    } else if (this.hasFocus) {
                        this.focus();
                        a()
                    } else this.once("focus", function () {
                        a()
                    }, null, null, -999)
                }, setup: function () {
                    var a = this.editor;
                    this.attachListener(a, "beforeGetData", function () {
                        var b = this.getData();
                        this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(n, function (a, b) {
                            return b
                        }));
                        a.setData(b, null, 1)
                    }, this);
                    this.attachListener(a, "getSnapshot", function (a) {
                        a.data = this.getData(1)
                    }, this);
                    this.attachListener(a, "afterSetData", function () {
                        this.setData(a.getData(1))
                    }, this);
                    this.attachListener(a, "loadSnapshot", function (a) {
                        this.setData(a.data,
                            1)
                    }, this);
                    this.attachListener(a, "beforeFocus", function () {
                        var b = a.getSelection();
                        (b = b && b.getNative()) && b.type == "Control" || this.focus()
                    }, this);
                    this.attachListener(a, "insertHtml", function (a) {
                        this.insertHtml(a.data.dataValue, a.data.mode)
                    }, this);
                    this.attachListener(a, "insertElement", function (a) {
                        this.insertElement(a.data)
                    }, this);
                    this.attachListener(a, "insertText", function (a) {
                        this.insertText(a.data)
                    }, this);
                    this.setReadOnly(a.readOnly);
                    this.attachClass("cke_editable");
                    this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ?
                        "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
                    this.attachClass("cke_contents_" + a.config.contentsLangDirection);
                    a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
                    a.keystrokeHandler.attach(this);
                    this.on("blur", function () {
                        this.hasFocus = false
                    }, null, null, -1);
                    this.on("focus", function () {
                        this.hasFocus = true
                    }, null, null, -1);
                    a.focusManager.add(this);
                    if (this.equals(CKEDITOR.document.getActive())) {
                        this.hasFocus = true;
                        a.once("contentDom", function () {
                            a.focusManager.focus(this)
                        }, this)
                    }
                    this.isInline() && this.changeAttr("tabindex", a.tabIndex);
                    if (!this.is("textarea")) {
                        a.document = this.getDocument();
                        a.window = this.getWindow();
                        var c = a.document;
                        this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                        var f = a.config.contentsLangDirection;
                        this.getDirection(1) != f && this.changeAttr("dir", f);
                        var e = CKEDITOR.getCss();
                        if (e) {
                            f = c.getHead();
                            if (!f.getCustomData("stylesheet")) {
                                e = c.appendStyleText(e);
                                e = new CKEDITOR.dom.element(e.ownerNode ||
                                    e.owningElement);
                                f.setCustomData("stylesheet", e);
                                e.data("cke-temp", 1)
                            }
                        }
                        f = c.getCustomData("stylesheet_ref") || 0;
                        c.setCustomData("stylesheet_ref", f + 1);
                        this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
                        this.attachListener(this, "click", function (a) {
                            var a = a.data, b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
                            b && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
                        });
                        var h = {8: 1, 46: 1};
                        this.attachListener(a, "key", function (b) {
                            if (a.readOnly)return true;
                            var c = b.data.domEvent.getKey(),
                                f;
                            if (c in h) {
                                var b = a.getSelection(), e, g = b.getRanges()[0], j = g.startPath(), i, k, s, c = c == 8;
                                if (CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (e = b.getSelectedElement()) || (e = d(b))) {
                                    a.fire("saveSnapshot");
                                    g.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
                                    e.remove();
                                    g.select();
                                    a.fire("saveSnapshot");
                                    f = 1
                                } else if (g.collapsed)if ((i = j.block) && (s = i[c ? "getPrevious" : "getNext"](o)) && s.type == CKEDITOR.NODE_ELEMENT && s.is("table") && g[c ? "checkStartOfBlock" : "checkEndOfBlock"]()) {
                                    a.fire("saveSnapshot");
                                    g[c ? "checkEndOfBlock" :
                                        "checkStartOfBlock"]() && i.remove();
                                    g["moveToElementEdit" + (c ? "End" : "Start")](s);
                                    g.select();
                                    a.fire("saveSnapshot");
                                    f = 1
                                } else if (j.blockLimit && j.blockLimit.is("td") && (k = j.blockLimit.getAscendant("table")) && g.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END) && (s = k[c ? "getPrevious" : "getNext"](o))) {
                                    a.fire("saveSnapshot");
                                    g["moveToElementEdit" + (c ? "End" : "Start")](s);
                                    g.checkStartOfBlock() && g.checkEndOfBlock() ? s.remove() : g.select();
                                    a.fire("saveSnapshot");
                                    f = 1
                                } else if ((k = j.contains(["td", "th", "caption"])) &&
                                    g.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END))f = 1
                            }
                            return !f
                        });
                        a.blockless && (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && this.attachListener(this, "keyup", function (b) {
                            if (b.data.getKeystroke() in h && !this.getFirst(g)) {
                                this.appendBogus();
                                b = a.createRange();
                                b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
                                b.select()
                            }
                        });
                        this.attachListener(this, "dblclick", function (b) {
                            if (a.readOnly)return false;
                            b = {element: b.data.getTarget()};
                            a.fire("doubleclick", b)
                        });
                        CKEDITOR.env.ie && this.attachListener(this,
                            "click", b);
                        CKEDITOR.env.ie || this.attachListener(this, "mousedown", function (b) {
                            var c = b.data.getTarget();
                            if (c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly()) {
                                a.getSelection().selectElement(c);
                                c.is("input", "textarea", "select") && b.data.preventDefault()
                            }
                        });
                        CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function (b) {
                            if (b.data.$.button == 2) {
                                b = b.data.getTarget();
                                if (!b.getOuterHtml().replace(n, "")) {
                                    var c = a.createRange();
                                    c.moveToElementEditStart(b);
                                    c.select(true)
                                }
                            }
                        });
                        if (CKEDITOR.env.webkit) {
                            this.attachListener(this,
                                "click", function (a) {
                                    a.data.getTarget().is("input", "select") && a.data.preventDefault()
                                });
                            this.attachListener(this, "mouseup", function (a) {
                                a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                            })
                        }
                        CKEDITOR.env.webkit && this.attachListener(a, "key", function (b) {
                            if (a.readOnly)return true;
                            b = b.data.domEvent.getKey();
                            if (b in h) {
                                var c = b == 8, d = a.getSelection().getRanges()[0], b = d.startPath();
                                if (d.collapsed) {
                                    var f;
                                    a:{
                                        var g = b.block;
                                        if (g)if (d[c ? "checkStartOfBlock" : "checkEndOfBlock"]())if (!d.moveToClosestEditablePosition(g,
                                                !c) || !d.collapsed)f = false; else {
                                            if (d.startContainer.type == CKEDITOR.NODE_ELEMENT) {
                                                var e = d.startContainer.getChild(d.startOffset - (c ? 1 : 0));
                                                if (e && e.type == CKEDITOR.NODE_ELEMENT && e.is("hr")) {
                                                    a.fire("saveSnapshot");
                                                    e.remove();
                                                    f = true;
                                                    break a
                                                }
                                            }
                                            if ((d = d.startPath().block) && (!d || !d.contains(g))) {
                                                a.fire("saveSnapshot");
                                                var i;
                                                (i = (c ? d : g).getBogus()) && i.remove();
                                                f = a.getSelection();
                                                i = f.createBookmarks();
                                                (c ? g : d).moveChildren(c ? d : g, false);
                                                b.lastElement.mergeSiblings();
                                                j(g, d, !c);
                                                f.selectBookmarks(i);
                                                f = true
                                            }
                                        } else f = false;
                                        else f = false
                                    }
                                    if (!f)return
                                } else {
                                    c = d;
                                    f = b.block;
                                    i = c.endPath().block;
                                    if (!f || !i || f.equals(i))b = false; else {
                                        a.fire("saveSnapshot");
                                        (g = f.getBogus()) && g.remove();
                                        c.deleteContents();
                                        if (i.getParent()) {
                                            i.moveChildren(f, false);
                                            b.lastElement.mergeSiblings();
                                            j(f, i, true)
                                        }
                                        c = a.getSelection().getRanges()[0];
                                        c.collapse(1);
                                        c.select();
                                        b = true
                                    }
                                    if (!b)return
                                }
                                a.getSelection().scrollIntoView();
                                a.fire("saveSnapshot");
                                return false
                            }
                        }, this, null, 100)
                    }
                }
            }, _: {
                detach: function () {
                    this.editor.setData(this.editor.getData(), 0, 1);
                    this.clearListeners();
                    this.restoreAttrs();
                    var a;
                    if (a = this.removeCustomData("classes"))for (; a.length;)this.removeClass(a.pop());
                    if (!this.is("textarea")) {
                        a = this.getDocument();
                        var b = a.getHead();
                        if (b.getCustomData("stylesheet")) {
                            var c = a.getCustomData("stylesheet_ref");
                            if (--c)a.setCustomData("stylesheet_ref", c); else {
                                a.removeCustomData("stylesheet_ref");
                                b.removeCustomData("stylesheet").remove()
                            }
                        }
                    }
                    this.editor.fire("contentDomUnload");
                    delete this.editor
                }
            }
        });
        CKEDITOR.editor.prototype.editable = function (a) {
            var b = this._.editable;
            if (b && a)return 0;
            if (arguments.length)b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
            return b
        };
        var k = CKEDITOR.dom.walker.bogus(), n = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi, o = CKEDITOR.dom.walker.whitespaces(true), p = CKEDITOR.dom.walker.bookmark(false, true);
        CKEDITOR.on("instanceLoaded", function (b) {
            var c = b.editor;
            c.on("insertElement", function (a) {
                a = a.data;
                if (a.type ==
                    CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
                    a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
                    a.setAttribute("contentEditable", false)
                }
            });
            c.on("selectionChange", function (b) {
                if (!c.readOnly) {
                    var d = c.getSelection();
                    if (d && !d.isLocked) {
                        d = c.checkDirty();
                        c.fire("lockSnapshot");
                        a(b);
                        c.fire("unlockSnapshot");
                        !d && c.resetDirty()
                    }
                }
            })
        });
        CKEDITOR.on("instanceCreated", function (a) {
            var b = a.editor;
            b.on("mode", function () {
                var a = b.editable();
                if (a &&
                    a.isInline()) {
                    var c = b.title;
                    a.changeAttr("role", "textbox");
                    a.changeAttr("aria-label", c);
                    c && a.changeAttr("title", c);
                    var d = b.fire("ariaEditorHelpLabel", {}).label;
                    if (d)if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
                        var f = CKEDITOR.tools.getNextId(), d = CKEDITOR.dom.element.createFromHtml('<span id="' + f + '" class="cke_voice_label">' + d + "</span>");
                        c.append(d);
                        a.changeAttr("aria-describedby", f)
                    }
                }
            })
        });
        CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var m = function () {
            function a(b) {
                return b.type == CKEDITOR.NODE_ELEMENT
            }

            function b(c, d) {
                var f, g, e, h, i = [], k = d.range.startContainer;
                f = d.range.startPath();
                for (var k = j[k.getName()], m = 0, n = c.getChildren(), w = n.count(), t = -1, x = -1, l = 0, r = f.contains(j.$list); m < w; ++m) {
                    f = n.getItem(m);
                    if (a(f)) {
                        e = f.getName();
                        if (r && e in CKEDITOR.dtd.$list)i = i.concat(b(f, d)); else {
                            h = !!k[e];
                            if (e == "br" && f.data("cke-eol") && (!m || m == w - 1)) {
                                l = (g = m ? i[m - 1].node : n.getItem(m + 1)) && (!a(g) || !g.is("br"));
                                g = g && a(g) && j.$block[g.getName()]
                            }
                            t == -1 && !h && (t =
                                m);
                            h || (x = m);
                            i.push({
                                isElement: 1,
                                isLineBreak: l,
                                isBlock: f.isBlockBoundary(),
                                hasBlockSibling: g,
                                node: f,
                                name: e,
                                allowed: h
                            });
                            g = l = 0
                        }
                    } else i.push({isElement: 0, node: f, allowed: 1})
                }
                if (t > -1)i[t].firstNotAllowed = 1;
                if (x > -1)i[x].lastNotAllowed = 1;
                return i
            }

            function c(b, d) {
                var f = [], g = b.getChildren(), e = g.count(), h, i = 0, k = j[d], m = !b.is(j.$inline) || b.is("br");
                for (m && f.push(" "); i < e; i++) {
                    h = g.getItem(i);
                    a(h) && !h.is(k) ? f = f.concat(c(h, d)) : f.push(h)
                }
                m && f.push(" ");
                return f
            }

            function d(b) {
                return b && a(b) && (b.is(j.$removeEmpty) ||
                    b.is("a") && !b.isBlockBoundary())
            }

            function f(b, c, d, g) {
                var e = b.clone(), h, i;
                e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
                if ((h = (new CKEDITOR.dom.walker(e)).next()) && a(h) && k[h.getName()] && (i = h.getPrevious()) && a(i) && !i.getParent().equals(b.startContainer) && d.contains(i) && g.contains(h) && h.isIdentical(i)) {
                    h.moveChildren(i);
                    h.remove();
                    f(b, c, d, g)
                }
            }

            function e(b, c) {
                function d(b, c) {
                    if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
                        b.remove();
                        return 1
                    }
                }

                var f = c.endContainer.getChild(c.endOffset), g = c.endContainer.getChild(c.endOffset -
                    1);
                f && d(f, b[b.length - 1]);
                if (g && d(g, b[0])) {
                    c.setEnd(c.endContainer, c.endOffset - 1);
                    c.collapse()
                }
            }

            var j = CKEDITOR.dtd, k = {
                p: 1,
                div: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                ul: 1,
                ol: 1,
                li: 1,
                pre: 1,
                dl: 1,
                blockquote: 1
            }, m = {
                p: 1,
                div: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1
            }, n = CKEDITOR.tools.extend({}, j.$inline);
            delete n.br;
            return function (k, l, r) {
                var p = k.editor, o = p.getSelection().getRanges()[0], C = false;
                if (l == "unfiltered_html") {
                    l = "html";
                    C = true
                }
                if (!o.checkReadOnly()) {
                    var F = (new CKEDITOR.dom.elementPath(o.startContainer, o.root)).blockLimit ||
                        o.root, l = {
                        type: l,
                        dontFilter: C,
                        editable: k,
                        editor: p,
                        range: o,
                        blockLimit: F,
                        mergeCandidates: [],
                        zombies: []
                    }, p = l.range, C = l.mergeCandidates, E, I, L, H;
                    if (l.type == "text" && p.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
                        E = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", p.document);
                        p.insertNode(E);
                        p.setStartAfter(E)
                    }
                    I = new CKEDITOR.dom.elementPath(p.startContainer);
                    l.endPath = L = new CKEDITOR.dom.elementPath(p.endContainer);
                    if (!p.collapsed) {
                        var F = L.block || L.blockLimit, Q = p.getCommonAncestor();
                        F && (!F.equals(Q) && !F.contains(Q) && p.checkEndOfBlock()) && l.zombies.push(F);
                        p.deleteContents()
                    }
                    for (; (H = a(p.startContainer) && p.startContainer.getChild(p.startOffset - 1)) && a(H) && H.isBlockBoundary() && I.contains(H);)p.moveToPosition(H, CKEDITOR.POSITION_BEFORE_END);
                    f(p, l.blockLimit, I, L);
                    if (E) {
                        p.setEndBefore(E);
                        p.collapse();
                        E.remove()
                    }
                    E = p.startPath();
                    if (F = E.contains(d, false, 1)) {
                        p.splitElement(F);
                        l.inlineStylesRoot = F;
                        l.inlineStylesPeak = E.lastElement
                    }
                    E = p.createBookmark();
                    (F = E.startNode.getPrevious(g)) && a(F) && d(F) && C.push(F);
                    (F = E.startNode.getNext(g)) && a(F) && d(F) && C.push(F);
                    for (F = E.startNode; (F = F.getParent()) && d(F);)C.push(F);
                    p.moveToBookmark(E);
                    if (E = r) {
                        E = l.range;
                        if (l.type == "text" && l.inlineStylesRoot) {
                            H = l.inlineStylesPeak;
                            p = H.getDocument().createText("{cke-peak}");
                            for (C = l.inlineStylesRoot.getParent(); !H.equals(C);) {
                                p = p.appendTo(H.clone());
                                H = H.getParent()
                            }
                            r = p.getOuterHtml().split("{cke-peak}").join(r)
                        }
                        H = l.blockLimit.getName();
                        if (/^\s+|\s+$/.test(r) && "span" in CKEDITOR.dtd[H])var O = '<span data-cke-marker="1">&nbsp;</span>',
                            r = O + r + O;
                        r = l.editor.dataProcessor.toHtml(r, {
                            context: null,
                            fixForBody: false,
                            dontFilter: l.dontFilter,
                            filter: l.editor.activeFilter,
                            enterMode: l.editor.activeEnterMode
                        });
                        H = E.document.createElement("body");
                        H.setHtml(r);
                        if (O) {
                            H.getFirst().remove();
                            H.getLast().remove()
                        }
                        if ((O = E.startPath().block) && !(O.getChildCount() == 1 && O.getBogus()))a:{
                            var M;
                            if (H.getChildCount() == 1 && a(M = H.getFirst()) && M.is(m)) {
                                O = M.getElementsByTag("*");
                                E = 0;
                                for (C = O.count(); E < C; E++) {
                                    p = O.getItem(E);
                                    if (!p.is(n))break a
                                }
                                M.moveChildren(M.getParent(1));
                                M.remove()
                            }
                        }
                        l.dataWrapper = H;
                        E = r
                    }
                    if (E) {
                        M = l.range;
                        var O = M.document, K, r = l.blockLimit;
                        E = 0;
                        var R;
                        H = [];
                        var N, T, C = p = 0, P, V;
                        I = M.startContainer;
                        var F = l.endPath.elements[0], W;
                        L = F.getPosition(I);
                        Q = !!F.getCommonAncestor(I) && L != CKEDITOR.POSITION_IDENTICAL && !(L & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
                        I = b(l.dataWrapper, l);
                        for (e(I, M); E < I.length; E++) {
                            L = I[E];
                            if (K = L.isLineBreak) {
                                K = M;
                                P = r;
                                var S = void 0, Y = void 0;
                                if (L.hasBlockSibling)K = 1; else {
                                    S = K.startContainer.getAscendant(j.$block, 1);
                                    if (!S || !S.is({
                                            div: 1,
                                            p: 1
                                        }))K = 0; else {
                                        Y = S.getPosition(P);
                                        if (Y == CKEDITOR.POSITION_IDENTICAL || Y == CKEDITOR.POSITION_CONTAINS)K = 0; else {
                                            P = K.splitElement(S);
                                            K.moveToPosition(P, CKEDITOR.POSITION_AFTER_START);
                                            K = 1
                                        }
                                    }
                                }
                            }
                            if (K)C = E > 0; else {
                                K = M.startPath();
                                if (!L.isBlock && i(l.editor, K.block, K.blockLimit) && (T = l.editor.activeEnterMode != CKEDITOR.ENTER_BR && l.editor.config.autoParagraph !== false ? l.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)) {
                                    T = O.createElement(T);
                                    T.appendBogus();
                                    M.insertNode(T);
                                    CKEDITOR.env.needsBrFiller && (R = T.getBogus()) &&
                                    R.remove();
                                    M.moveToPosition(T, CKEDITOR.POSITION_BEFORE_END)
                                }
                                if ((K = M.startPath().block) && !K.equals(N)) {
                                    if (R = K.getBogus()) {
                                        R.remove();
                                        H.push(K)
                                    }
                                    N = K
                                }
                                L.firstNotAllowed && (p = 1);
                                if (p && L.isElement) {
                                    K = M.startContainer;
                                    for (P = null; K && !j[K.getName()][L.name];) {
                                        if (K.equals(r)) {
                                            K = null;
                                            break
                                        }
                                        P = K;
                                        K = K.getParent()
                                    }
                                    if (K) {
                                        if (P) {
                                            V = M.splitElement(P);
                                            l.zombies.push(V);
                                            l.zombies.push(P)
                                        }
                                    } else {
                                        P = r.getName();
                                        W = !E;
                                        K = E == I.length - 1;
                                        P = c(L.node, P);
                                        for (var S = [], Y = P.length, Z = 0, ba = void 0, X = 0, aa = -1; Z < Y; Z++) {
                                            ba = P[Z];
                                            if (ba == " ") {
                                                if (!X &&
                                                    (!W || Z)) {
                                                    S.push(new CKEDITOR.dom.text(" "));
                                                    aa = S.length
                                                }
                                                X = 1
                                            } else {
                                                S.push(ba);
                                                X = 0
                                            }
                                        }
                                        K && aa == S.length && S.pop();
                                        W = S
                                    }
                                }
                                if (W) {
                                    for (; K = W.pop();)M.insertNode(K);
                                    W = 0
                                } else M.insertNode(L.node);
                                if (L.lastNotAllowed && E < I.length - 1) {
                                    (V = Q ? F : V) && M.setEndAt(V, CKEDITOR.POSITION_AFTER_START);
                                    p = 0
                                }
                                M.collapse()
                            }
                        }
                        l.dontMoveCaret = C;
                        l.bogusNeededBlocks = H
                    }
                    R = l.range;
                    var U;
                    V = l.bogusNeededBlocks;
                    for (W = R.createBookmark(); N = l.zombies.pop();)if (N.getParent()) {
                        T = R.clone();
                        T.moveToElementEditStart(N);
                        T.removeEmptyBlocksAtEnd()
                    }
                    if (V)for (; N =
                                     V.pop();)CKEDITOR.env.needsBrFiller ? N.appendBogus() : N.append(R.document.createText(" "));
                    for (; N = l.mergeCandidates.pop();)N.mergeSiblings();
                    R.moveToBookmark(W);
                    if (!l.dontMoveCaret) {
                        for (N = a(R.startContainer) && R.startContainer.getChild(R.startOffset - 1); N && a(N) && !N.is(j.$empty);) {
                            if (N.isBlockBoundary())R.moveToPosition(N, CKEDITOR.POSITION_BEFORE_END); else {
                                if (d(N) && N.getHtml().match(/(\s|&nbsp;)$/g)) {
                                    U = null;
                                    break
                                }
                                U = R.clone();
                                U.moveToPosition(N, CKEDITOR.POSITION_BEFORE_END)
                            }
                            N = N.getLast(g)
                        }
                        U && R.moveToRange(U)
                    }
                    o.select();
                    h(k)
                }
            }
        }(), l = function () {
            function a(b) {
                b = new CKEDITOR.dom.walker(b);
                b.guard = function (a, b) {
                    if (b)return false;
                    if (a.type == CKEDITOR.NODE_ELEMENT)return a.is(CKEDITOR.dtd.$tableContent)
                };
                b.evaluator = function (a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                };
                return b
            }

            function b(a, c, d) {
                c = a.getDocument().createElement(c);
                a.append(c, d);
                return c
            }

            function c(a) {
                var b = a.count(), d;
                for (b; b-- > 0;) {
                    d = a.getItem(b);
                    if (!CKEDITOR.tools.trim(d.getHtml())) {
                        d.appendBogus();
                        CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && d.getChildCount()) &&
                        d.getFirst().remove()
                    }
                }
            }

            return function (d) {
                var f = d.startContainer, g = f.getAscendant("table", 1), e = false;
                c(g.getElementsByTag("td"));
                c(g.getElementsByTag("th"));
                g = d.clone();
                g.setStart(f, 0);
                g = a(g).lastBackward();
                if (!g) {
                    g = d.clone();
                    g.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
                    g = a(g).lastForward();
                    e = true
                }
                g || (g = f);
                if (g.is("table")) {
                    d.setStartAt(g, CKEDITOR.POSITION_BEFORE_START);
                    d.collapse(true);
                    g.remove()
                } else {
                    g.is({tbody: 1, thead: 1, tfoot: 1}) && (g = b(g, "tr", e));
                    g.is("tr") && (g = b(g, g.getParent().is("thead") ? "th" :
                        "td", e));
                    (f = g.getBogus()) && f.remove();
                    d.moveToPosition(g, e ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END)
                }
            }
        }()
    }(),function () {
        function a() {
            var a = this._.fakeSelection, b;
            if (a) {
                b = this.getSelection(1);
                if (!b || !b.isHidden()) {
                    a.reset();
                    a = 0
                }
            }
            if (!a) {
                a = b || this.getSelection(1);
                if (!a || a.getType() == CKEDITOR.SELECTION_NONE)return
            }
            this.fire("selectionCheck", a);
            b = this.elementPath();
            if (!b.compare(this._.selectionPreviousPath)) {
                if (CKEDITOR.env.webkit)this._.previousActive = this.document.getActive();
                this._.selectionPreviousPath =
                    b;
                this.fire("selectionChange", {selection: a, path: b})
            }
        }

        function e() {
            m = true;
            if (!p) {
                b.call(this);
                p = CKEDITOR.tools.setTimeout(b, 200, this)
            }
        }

        function b() {
            p = null;
            if (m) {
                CKEDITOR.tools.setTimeout(a, 0, this);
                m = false
            }
        }

        function g(a) {
            return l(a) || a.type == CKEDITOR.NODE_ELEMENT && !a.is(CKEDITOR.dtd.$empty) ? true : false
        }

        function c(a) {
            function b(c, d) {
                return !c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c)
            }

            if (!(a.root instanceof CKEDITOR.editable))return false;
            var c = a.startContainer,
                d = a.getPreviousNode(g, null, c), f = a.getNextNode(g, null, c);
            return b(d) || b(f, 1) || !d && !f && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
        }

        function d(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function i(a, b) {
            var c = a && a.removeCustomData("cke-fillingChar");
            if (c) {
                if (b !== false) {
                    var d, g = a.getDocument().getSelection().getNative(), e = g && g.type != "None" && g.getRangeAt(0);
                    if (c.getLength() > 1 && e && e.intersectsNode(c.$)) {
                        d = h(g);
                        e = g.focusNode == c.$ && g.focusOffset > 0;
                        g.anchorNode == c.$ && g.anchorOffset >
                        0 && d[0].offset--;
                        e && d[1].offset--
                    }
                }
                c.setText(f(c.getText()));
                d && j(a.getDocument().$, d)
            }
        }

        function f(a) {
            return a.replace(/\u200B( )?/g, function (a) {
                return a[1] ? " " : ""
            })
        }

        function h(a) {
            return [{
                node: a.anchorNode,
                offset: a.anchorOffset
            }, {node: a.focusNode, offset: a.focusOffset}]
        }

        function j(a, b) {
            var c = a.getSelection(), d = a.createRange();
            d.setStart(b[0].node, b[0].offset);
            d.collapse(true);
            c.removeAllRanges();
            c.addRange(d);
            c.extend(b[1].node, b[1].offset)
        }

        function k(a) {
            var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' +
                (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a.document);
            a.fire("lockSnapshot");
            a.editable().append(b);
            var c = a.getSelection(1), d = a.createRange(), f = c.root.on("selectionchange", function (a) {
                a.cancel()
            }, null, null, 0);
            d.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
            d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
            c.selectRanges([d]);
            f.removeListener();
            a.fire("unlockSnapshot");
            a._.hiddenSelectionContainer = b
        }

        function n(a) {
            var b = {37: 1, 39: 1, 8: 1, 46: 1};
            return function (c) {
                var d =
                    c.data.getKeystroke();
                if (b[d]) {
                    var f = a.getSelection().getRanges(), g = f[0];
                    if (f.length == 1 && g.collapsed)if ((d = g[d < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && d.type == CKEDITOR.NODE_ELEMENT && d.getAttribute("contenteditable") == "false") {
                        a.getSelection().fake(d);
                        c.data.preventDefault();
                        c.cancel()
                    }
                }
            }
        }

        function o(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
                if (!c.collapsed) {
                    if (c.startContainer.isReadOnly())for (var d = c.startContainer, f; d;) {
                        if ((f = d.type ==
                                CKEDITOR.NODE_ELEMENT) && d.is("body") || !d.isReadOnly())break;
                        f && d.getAttribute("contentEditable") == "false" && c.setStartAfter(d);
                        d = d.getParent()
                    }
                    d = c.startContainer;
                    f = c.endContainer;
                    var g = c.startOffset, e = c.endOffset, h = c.clone();
                    d && d.type == CKEDITOR.NODE_TEXT && (g >= d.getLength() ? h.setStartAfter(d) : h.setStartBefore(d));
                    f && f.type == CKEDITOR.NODE_TEXT && (e ? h.setEndAfter(f) : h.setEndBefore(f));
                    d = new CKEDITOR.dom.walker(h);
                    d.evaluator = function (d) {
                        if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
                            var f = c.clone();
                            c.setEndBefore(d);
                            c.collapsed && a.splice(b--, 1);
                            if (!(d.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                                f.setStartAfter(d);
                                f.collapsed || a.splice(b + 1, 0, f)
                            }
                            return true
                        }
                        return false
                    };
                    d.next()
                }
            }
            return a
        }

        var p, m, l = CKEDITOR.dom.walker.invisible(1), q = function () {
            function a(b) {
                return function (a) {
                    var c = a.editor.createRange();
                    c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
                    return false
                }
            }

            function b(a) {
                return function (b) {
                    var c = b.editor, d = c.createRange(), f;
                    if (!(f =
                            d.moveToClosestEditablePosition(b.selected, a)))f = d.moveToClosestEditablePosition(b.selected, !a);
                    f && c.getSelection().selectRanges([d]);
                    c.fire("saveSnapshot");
                    b.selected.remove();
                    if (!f) {
                        d.moveToElementEditablePosition(c.editable());
                        c.getSelection().selectRanges([d])
                    }
                    c.fire("saveSnapshot");
                    return false
                }
            }

            var c = a(), d = a(1);
            return {37: c, 38: c, 39: d, 40: d, 8: b(), 46: b(1)}
        }();
        CKEDITOR.on("instanceCreated", function (b) {
            function c() {
                var a = d.getSelection();
                a && a.removeAllRanges()
            }

            var d = b.editor;
            d.on("contentDom", function () {
                function b() {
                    q =
                        new CKEDITOR.dom.selection(d.getSelection());
                    q.lock()
                }

                function c() {
                    g.removeListener("mouseup", c);
                    k.removeListener("mouseup", c);
                    var a = CKEDITOR.document.$.selection, b = a.createRange();
                    a.type != "None" && b.parentElement().ownerDocument == f.$ && b.select()
                }

                var f = d.document, g = CKEDITOR.document, h = d.editable(), j = f.getBody(), k = f.getDocumentElement(), m = h.isInline(), C, q;
                CKEDITOR.env.gecko && h.attachListener(h, "focus", function (a) {
                    a.removeListener();
                    if (C !== 0)if ((a = d.getSelection().getNative()) && a.isCollapsed && a.anchorNode ==
                        h.$) {
                        a = d.createRange();
                        a.moveToElementEditStart(h);
                        a.select()
                    }
                }, null, null, -2);
                h.attachListener(h, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    C && CKEDITOR.env.webkit && (C = d._.previousActive && d._.previousActive.equals(f.getActive()));
                    d.unlockSelection(C);
                    C = 0
                }, null, null, -1);
                h.attachListener(h, "mousedown", function () {
                    C = 0
                });
                if (CKEDITOR.env.ie || m) {
                    s ? h.attachListener(h, "beforedeactivate", b, null, null, -1) : h.attachListener(d, "selectionCheck", b, null, null, -1);
                    h.attachListener(h, CKEDITOR.env.webkit ? "DOMFocusOut" :
                        "blur", function () {
                        d.lockSelection(q);
                        C = 1
                    }, null, null, -1);
                    h.attachListener(h, "mousedown", function () {
                        C = 0
                    })
                }
                if (CKEDITOR.env.ie && !m) {
                    var t;
                    h.attachListener(h, "mousedown", function (a) {
                        if (a.data.$.button == 2) {
                            a = d.document.getSelection();
                            if (!a || a.getType() == CKEDITOR.SELECTION_NONE)t = d.window.getScrollPosition()
                        }
                    });
                    h.attachListener(h, "mouseup", function (a) {
                        if (a.data.$.button == 2 && t) {
                            d.document.$.documentElement.scrollLeft = t.x;
                            d.document.$.documentElement.scrollTop = t.y
                        }
                        t = null
                    });
                    if (f.$.compatMode != "BackCompat") {
                        if (CKEDITOR.env.ie7Compat ||
                            CKEDITOR.env.ie6Compat)k.on("mousedown", function (a) {
                            function b(a) {
                                a = a.data.$;
                                if (d) {
                                    var c = j.$.createTextRange();
                                    try {
                                        c.moveToPoint(a.clientX, a.clientY)
                                    } catch (f) {
                                    }
                                    d.setEndPoint(e.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
                                    d.select()
                                }
                            }

                            function c() {
                                k.removeListener("mousemove", b);
                                g.removeListener("mouseup", c);
                                k.removeListener("mouseup", c);
                                d.select()
                            }

                            a = a.data;
                            if (a.getTarget().is("html") && a.$.y < k.$.clientHeight && a.$.x < k.$.clientWidth) {
                                var d = j.$.createTextRange();
                                try {
                                    d.moveToPoint(a.$.clientX,
                                        a.$.clientY)
                                } catch (f) {
                                }
                                var e = d.duplicate();
                                k.on("mousemove", b);
                                g.on("mouseup", c);
                                k.on("mouseup", c)
                            }
                        });
                        if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11)k.on("mousedown", function (a) {
                            if (a.data.getTarget().is("html")) {
                                g.on("mouseup", c);
                                k.on("mouseup", c)
                            }
                        })
                    }
                }
                h.attachListener(h, "selectionchange", a, d);
                h.attachListener(h, "keyup", e, d);
                h.attachListener(h, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    d.forceNextSelectionCheck();
                    d.selectionChange(1)
                });
                if (m && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
                    var l;
                    h.attachListener(h, "mousedown", function () {
                        l = 1
                    });
                    h.attachListener(f.getDocumentElement(), "mouseup", function () {
                        l && e.call(d);
                        l = 0
                    })
                } else h.attachListener(CKEDITOR.env.ie ? h : f.getDocumentElement(), "mouseup", e, d);
                CKEDITOR.env.webkit && h.attachListener(f, "keydown", function (a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            i(h)
                    }
                }, null, null, -1);
                h.attachListener(h, "keydown", n(d), null, null, -1)
            });
            d.on("setData", function () {
                d.unlockSelection();
                CKEDITOR.env.webkit &&
                c()
            });
            d.on("contentDomUnload", function () {
                d.unlockSelection()
            });
            if (CKEDITOR.env.ie9Compat)d.on("beforeDestroy", c, null, null, 9);
            d.on("dataReady", function () {
                delete d._.fakeSelection;
                delete d._.hiddenSelectionContainer;
                d.selectionChange(1)
            });
            d.on("loadSnapshot", function () {
                var a = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT), b = d.editable().getLast(a);
                if (b && b.hasAttribute("data-cke-hidden-sel")) {
                    b.remove();
                    if (CKEDITOR.env.gecko)(a = d.editable().getFirst(a)) && (a.is("br") && a.getAttribute("_moz_editor_bogus_node")) &&
                    a.remove()
                }
            }, null, null, 100);
            d.on("key", function (a) {
                if (d.mode == "wysiwyg") {
                    var b = d.getSelection();
                    if (b.isFake) {
                        var c = q[a.data.keyCode];
                        if (c)return c({
                            editor: d,
                            selected: b.getSelectedElement(),
                            selection: b,
                            keyEvent: a
                        })
                    }
                }
            })
        });
        CKEDITOR.on("instanceReady", function (a) {
            function b() {
                var a = g.editable();
                if (a)if (a = d(a)) {
                    var c = g.document.$.getSelection();
                    if (c.type != "None" && (c.anchorNode == a.$ || c.focusNode == a.$))k = h(c);
                    e = a.getText();
                    a.setText(f(e))
                }
            }

            function c() {
                var a = g.editable();
                if (a)if (a = d(a)) {
                    a.setText(e);
                    if (k) {
                        j(g.document.$,
                            k);
                        k = null
                    }
                }
            }

            var g = a.editor, e, k;
            if (CKEDITOR.env.webkit) {
                g.on("selectionChange", function () {
                    var a = g.editable(), b = d(a);
                    b && (b.getCustomData("ready") ? i(a) : b.setCustomData("ready", 1))
                }, null, null, -1);
                g.on("beforeSetMode", function () {
                    i(g.editable())
                }, null, null, -1);
                g.on("beforeUndoImage", b);
                g.on("afterUndoImage", c);
                g.on("beforeGetData", b, null, null, 0);
                g.on("getData", c)
            }
        });
        CKEDITOR.editor.prototype.selectionChange = function (b) {
            (b ? a : e).call(this)
        };
        CKEDITOR.editor.prototype.getSelection = function (a) {
            if ((this._.savedSelection ||
                this._.fakeSelection) && !a)return this._.savedSelection || this._.fakeSelection;
            return (a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null
        };
        CKEDITOR.editor.prototype.lockSelection = function (a) {
            a = a || this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                !a.isLocked && a.lock();
                this._.savedSelection = a;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.unlockSelection = function (a) {
            var b = this._.savedSelection;
            if (b) {
                b.unlock(a);
                delete this._.savedSelection;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
            delete this._.selectionPreviousPath
        };
        CKEDITOR.dom.document.prototype.getSelection = function () {
            return new CKEDITOR.dom.selection(this)
        };
        CKEDITOR.dom.range.prototype.select = function () {
            var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            a.selectRanges([this]);
            return a
        };
        CKEDITOR.SELECTION_NONE = 1;
        CKEDITOR.SELECTION_TEXT = 2;
        CKEDITOR.SELECTION_ELEMENT = 3;
        var s = typeof window.getSelection !=
            "function", t = 1;
        CKEDITOR.dom.selection = function (a) {
            if (a instanceof CKEDITOR.dom.selection)var b = a, a = a.root;
            var c = a instanceof CKEDITOR.dom.element;
            this.rev = b ? b.rev : t++;
            this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
            this.root = c ? a : this.document.getBody();
            this.isLocked = 0;
            this._ = {cache: {}};
            if (b) {
                CKEDITOR.tools.extend(this._.cache, b._.cache);
                this.isFake = b.isFake;
                this.isLocked = b.isLocked;
                return this
            }
            var a = this.getNative(), d, f;
            if (a)if (a.getRangeAt)d = (f = a.rangeCount && a.getRangeAt(0)) &&
                new CKEDITOR.dom.node(f.commonAncestorContainer); else {
                try {
                    f = a.createRange()
                } catch (g) {
                }
                d = f && CKEDITOR.dom.element.get(f.item && f.item(0) || f.parentElement())
            }
            if (!d || !(d.type == CKEDITOR.NODE_ELEMENT || d.type == CKEDITOR.NODE_TEXT) || !this.root.equals(d) && !this.root.contains(d)) {
                this._.cache.type = CKEDITOR.SELECTION_NONE;
                this._.cache.startElement = null;
                this._.cache.selectedElement = null;
                this._.cache.selectedText = "";
                this._.cache.ranges = new CKEDITOR.dom.rangeList
            }
            return this
        };
        var u = {
            img: 1,
            hr: 1,
            li: 1,
            table: 1,
            tr: 1,
            td: 1,
            th: 1,
            embed: 1,
            object: 1,
            ol: 1,
            ul: 1,
            a: 1,
            input: 1,
            form: 1,
            select: 1,
            textarea: 1,
            button: 1,
            fieldset: 1,
            thead: 1,
            tfoot: 1
        };
        CKEDITOR.dom.selection.prototype = {
            getNative: function () {
                return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = s ? this.document.$.selection : this.document.getWindow().$.getSelection()
            }, getType: s ? function () {
                var a = this._.cache;
                if (a.type)return a.type;
                var b = CKEDITOR.SELECTION_NONE;
                try {
                    var c = this.getNative(), d = c.type;
                    if (d == "Text")b = CKEDITOR.SELECTION_TEXT;
                    if (d == "Control")b =
                        CKEDITOR.SELECTION_ELEMENT;
                    if (c.createRange().parentElement())b = CKEDITOR.SELECTION_TEXT
                } catch (f) {
                }
                return a.type = b
            } : function () {
                var a = this._.cache;
                if (a.type)return a.type;
                var b = CKEDITOR.SELECTION_TEXT, c = this.getNative();
                if (!c || !c.rangeCount)b = CKEDITOR.SELECTION_NONE; else if (c.rangeCount == 1) {
                    var c = c.getRangeAt(0), d = c.startContainer;
                    if (d == c.endContainer && d.nodeType == 1 && c.endOffset - c.startOffset == 1 && u[d.childNodes[c.startOffset].nodeName.toLowerCase()])b = CKEDITOR.SELECTION_ELEMENT
                }
                return a.type = b
            }, getRanges: function () {
                var a =
                    s ? function () {
                        function a(b) {
                            return (new CKEDITOR.dom.node(b)).getIndex()
                        }

                        var b = function (b, c) {
                            b = b.duplicate();
                            b.collapse(c);
                            var d = b.parentElement();
                            if (!d.hasChildNodes())return {
                                container: d,
                                offset: 0
                            };
                            for (var f = d.children, g, e, h = b.duplicate(), i = 0, j = f.length - 1, k = -1, m, q; i <= j;) {
                                k = Math.floor((i + j) / 2);
                                g = f[k];
                                h.moveToElementText(g);
                                m = h.compareEndPoints("StartToStart", b);
                                if (m > 0)j = k - 1; else if (m < 0)i = k + 1; else return {
                                    container: d,
                                    offset: a(g)
                                }
                            }
                            if (k == -1 || k == f.length - 1 && m < 0) {
                                h.moveToElementText(d);
                                h.setEndPoint("StartToStart",
                                    b);
                                h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                                f = d.childNodes;
                                if (!h) {
                                    g = f[f.length - 1];
                                    return g.nodeType != CKEDITOR.NODE_TEXT ? {
                                        container: d,
                                        offset: f.length
                                    } : {
                                        container: g,
                                        offset: g.nodeValue.length
                                    }
                                }
                                for (d = f.length; h > 0 && d > 0;) {
                                    e = f[--d];
                                    if (e.nodeType == CKEDITOR.NODE_TEXT) {
                                        q = e;
                                        h = h - e.nodeValue.length
                                    }
                                }
                                return {container: q, offset: -h}
                            }
                            h.collapse(m > 0 ? true : false);
                            h.setEndPoint(m > 0 ? "StartToStart" : "EndToStart", b);
                            h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                            if (!h)return {
                                container: d,
                                offset: a(g) + (m > 0 ? 0 : 1)
                            };
                            for (; h > 0;)try {
                                e =
                                    g[m > 0 ? "previousSibling" : "nextSibling"];
                                if (e.nodeType == CKEDITOR.NODE_TEXT) {
                                    h = h - e.nodeValue.length;
                                    q = e
                                }
                                g = e
                            } catch (s) {
                                return {container: d, offset: a(g)}
                            }
                            return {
                                container: q,
                                offset: m > 0 ? -h : q.nodeValue.length + h
                            }
                        };
                        return function () {
                            var a = this.getNative(), c = a && a.createRange(), d = this.getType();
                            if (!a)return [];
                            if (d == CKEDITOR.SELECTION_TEXT) {
                                a = new CKEDITOR.dom.range(this.root);
                                d = b(c, true);
                                a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
                                d = b(c);
                                a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
                                a.endContainer.getPosition(a.startContainer) &
                                CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse();
                                return [a]
                            }
                            if (d == CKEDITOR.SELECTION_ELEMENT) {
                                for (var d = [], f = 0; f < c.length; f++) {
                                    for (var g = c.item(f), e = g.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h < e.childNodes.length && e.childNodes[h] != g; h++);
                                    a.setStart(new CKEDITOR.dom.node(e), h);
                                    a.setEnd(new CKEDITOR.dom.node(e), h + 1);
                                    d.push(a)
                                }
                                return d
                            }
                            return []
                        }
                    }() : function () {
                        var a = [], b, c = this.getNative();
                        if (!c)return a;
                        for (var d = 0; d < c.rangeCount; d++) {
                            var f = c.getRangeAt(d);
                            b = new CKEDITOR.dom.range(this.root);
                            b.setStart(new CKEDITOR.dom.node(f.startContainer), f.startOffset);
                            b.setEnd(new CKEDITOR.dom.node(f.endContainer), f.endOffset);
                            a.push(b)
                        }
                        return a
                    };
                return function (b) {
                    var c = this._.cache, d = c.ranges;
                    if (!d)c.ranges = d = new CKEDITOR.dom.rangeList(a.call(this));
                    return !b ? d : o(new CKEDITOR.dom.rangeList(d.slice()))
                }
            }(), getStartElement: function () {
                var a = this._.cache;
                if (a.startElement !== void 0)return a.startElement;
                var b;
                switch (this.getType()) {
                    case CKEDITOR.SELECTION_ELEMENT:
                        return this.getSelectedElement();
                    case CKEDITOR.SELECTION_TEXT:
                        var c = this.getRanges()[0];
                        if (c) {
                            if (c.collapsed) {
                                b = c.startContainer;
                                b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
                            } else {
                                for (c.optimize(); ;) {
                                    b = c.startContainer;
                                    if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary())c.setStartAfter(b); else break
                                }
                                b = c.startContainer;
                                if (b.type != CKEDITOR.NODE_ELEMENT)return b.getParent();
                                b = b.getChild(c.startOffset);
                                if (!b || b.type != CKEDITOR.NODE_ELEMENT)b = c.startContainer; else for (c = b.getFirst(); c && c.type ==
                                CKEDITOR.NODE_ELEMENT;) {
                                    b = c;
                                    c = c.getFirst()
                                }
                            }
                            b = b.$
                        }
                }
                return a.startElement = b ? new CKEDITOR.dom.element(b) : null
            }, getSelectedElement: function () {
                var a = this._.cache;
                if (a.selectedElement !== void 0)return a.selectedElement;
                var b = this, c = CKEDITOR.tools.tryThese(function () {
                    return b.getNative().createRange().item(0)
                }, function () {
                    for (var a = b.getRanges()[0].clone(), c, d, f = 2; f && (!(c = a.getEnclosedNode()) || !(c.type == CKEDITOR.NODE_ELEMENT && u[c.getName()] && (d = c))); f--)a.shrink(CKEDITOR.SHRINK_ELEMENT);
                    return d && d.$
                });
                return a.selectedElement =
                    c ? new CKEDITOR.dom.element(c) : null
            }, getSelectedText: function () {
                var a = this._.cache;
                if (a.selectedText !== void 0)return a.selectedText;
                var b = this.getNative(), b = s ? b.type == "Control" ? "" : b.createRange().text : b.toString();
                return a.selectedText = b
            }, lock: function () {
                this.getRanges();
                this.getStartElement();
                this.getSelectedElement();
                this.getSelectedText();
                this._.cache.nativeSel = null;
                this.isLocked = 1
            }, unlock: function (a) {
                if (this.isLocked) {
                    if (a)var b = this.getSelectedElement(), c = !b && this.getRanges(), d = this.isFake;
                    this.isLocked =
                        0;
                    this.reset();
                    if (a)(a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
                }
            }, reset: function () {
                this._.cache = {};
                this.isFake = 0;
                var a = this.root.editor;
                if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
                    delete a._.fakeSelection;
                    var b = a._.hiddenSelectionContainer;
                    if (b) {
                        var c = a.checkDirty();
                        a.fire("lockSnapshot");
                        b.remove();
                        a.fire("unlockSnapshot");
                        !c && a.resetDirty()
                    }
                    delete a._.hiddenSelectionContainer
                }
                this.rev = t++
            }, selectElement: function (a) {
                var b =
                    new CKEDITOR.dom.range(this.root);
                b.setStartBefore(a);
                b.setEndAfter(a);
                this.selectRanges([b])
            }, selectRanges: function (a) {
                var b = this.root.editor, b = b && b._.hiddenSelectionContainer;
                this.reset();
                if (b)for (var b = this.root, d, f = 0; f < a.length; ++f) {
                    d = a[f];
                    if (d.endContainer.equals(b))d.endOffset = Math.min(d.endOffset, b.getChildCount())
                }
                if (a.length)if (this.isLocked) {
                    var g = CKEDITOR.document.getActive();
                    this.unlock();
                    this.selectRanges(a);
                    this.lock();
                    g && !g.equals(this.root) && g.focus()
                } else {
                    var e;
                    a:{
                        var h, j;
                        if (a.length ==
                            1 && !(j = a[0]).collapsed && (e = j.getEnclosedNode()) && e.type == CKEDITOR.NODE_ELEMENT) {
                            j = j.clone();
                            j.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                            if ((h = j.getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT)e = h;
                            if (e.getAttribute("contenteditable") == "false")break a
                        }
                        e = void 0
                    }
                    if (e)this.fake(e); else {
                        if (s) {
                            j = CKEDITOR.dom.walker.whitespaces(true);
                            h = /\ufeff|\u00a0/;
                            b = {table: 1, tbody: 1, tr: 1};
                            if (a.length > 1) {
                                e = a[a.length - 1];
                                a[0].setEnd(e.endContainer, e.endOffset)
                            }
                            e = a[0];
                            var a = e.collapsed, k, m, q;
                            if ((d = e.getEnclosedNode()) && d.type ==
                                CKEDITOR.NODE_ELEMENT && d.getName() in u && (!d.is("a") || !d.getText()))try {
                                q = d.$.createControlRange();
                                q.addElement(d.$);
                                q.select();
                                return
                            } catch (C) {
                            }
                            if (e.startContainer.type == CKEDITOR.NODE_ELEMENT && e.startContainer.getName() in b || e.endContainer.type == CKEDITOR.NODE_ELEMENT && e.endContainer.getName() in b) {
                                e.shrink(CKEDITOR.NODE_ELEMENT, true);
                                a = e.collapsed
                            }
                            q = e.createBookmark();
                            b = q.startNode;
                            if (!a)g = q.endNode;
                            q = e.document.$.body.createTextRange();
                            q.moveToElementText(b.$);
                            q.moveStart("character", 1);
                            if (g) {
                                h =
                                    e.document.$.body.createTextRange();
                                h.moveToElementText(g.$);
                                q.setEndPoint("EndToEnd", h);
                                q.moveEnd("character", -1)
                            } else {
                                k = b.getNext(j);
                                m = b.hasAscendant("pre");
                                k = !(k && k.getText && k.getText().match(h)) && (m || !b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br"));
                                m = e.document.createElement("span");
                                m.setHtml("&#65279;");
                                m.insertBefore(b);
                                k && e.document.createText("﻿").insertBefore(b)
                            }
                            e.setStartBefore(b);
                            b.remove();
                            if (a) {
                                if (k) {
                                    q.moveStart("character", -1);
                                    q.select();
                                    e.document.$.selection.clear()
                                } else q.select();
                                e.moveToPosition(m, CKEDITOR.POSITION_BEFORE_START);
                                m.remove()
                            } else {
                                e.setEndBefore(g);
                                g.remove();
                                q.select()
                            }
                        } else {
                            g = this.getNative();
                            if (!g)return;
                            this.removeAllRanges();
                            for (q = 0; q < a.length; q++) {
                                if (q < a.length - 1) {
                                    k = a[q];
                                    m = a[q + 1];
                                    h = k.clone();
                                    h.setStart(k.endContainer, k.endOffset);
                                    h.setEnd(m.startContainer, m.startOffset);
                                    if (!h.collapsed) {
                                        h.shrink(CKEDITOR.NODE_ELEMENT, true);
                                        e = h.getCommonAncestor();
                                        h = h.getEnclosedNode();
                                        if (e.isReadOnly() || h && h.isReadOnly()) {
                                            m.setStart(k.startContainer, k.startOffset);
                                            a.splice(q--,
                                                1);
                                            continue
                                        }
                                    }
                                }
                                e = a[q];
                                m = this.document.$.createRange();
                                if (e.collapsed && CKEDITOR.env.webkit && c(e)) {
                                    k = this.root;
                                    i(k, false);
                                    h = k.getDocument().createText("​");
                                    k.setCustomData("cke-fillingChar", h);
                                    e.insertNode(h);
                                    if ((k = h.getNext()) && !h.getPrevious() && k.type == CKEDITOR.NODE_ELEMENT && k.getName() == "br") {
                                        i(this.root);
                                        e.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START)
                                    } else e.moveToPosition(h, CKEDITOR.POSITION_AFTER_END)
                                }
                                m.setStart(e.startContainer.$, e.startOffset);
                                try {
                                    m.setEnd(e.endContainer.$, e.endOffset)
                                } catch (n) {
                                    if (n.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >=
                                        0) {
                                        e.collapse(1);
                                        m.setEnd(e.endContainer.$, e.endOffset)
                                    } else throw n;
                                }
                                g.addRange(m)
                            }
                        }
                        this.reset();
                        this.root.fire("selectionchange")
                    }
                }
            }, fake: function (a) {
                var b = this.root.editor;
                this.reset();
                k(b);
                var c = this._.cache, d = new CKEDITOR.dom.range(this.root);
                d.setStartBefore(a);
                d.setEndAfter(a);
                c.ranges = new CKEDITOR.dom.rangeList(d);
                c.selectedElement = c.startElement = a;
                c.type = CKEDITOR.SELECTION_ELEMENT;
                c.selectedText = c.nativeSel = null;
                this.isFake = 1;
                this.rev = t++;
                b._.fakeSelection = this;
                this.root.fire("selectionchange")
            },
            isHidden: function () {
                var a = this.getCommonAncestor();
                a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent());
                return !(!a || !a.data("cke-hidden-sel"))
            }, createBookmarks: function (a) {
                a = this.getRanges().createBookmarks(a);
                this.isFake && (a.isFake = 1);
                return a
            }, createBookmarks2: function (a) {
                a = this.getRanges().createBookmarks2(a);
                this.isFake && (a.isFake = 1);
                return a
            }, selectBookmarks: function (a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = new CKEDITOR.dom.range(this.root);
                    d.moveToBookmark(a[c]);
                    b.push(d)
                }
                a.isFake ? this.fake(b[0].getEnclosedNode()) :
                    this.selectRanges(b);
                return this
            }, getCommonAncestor: function () {
                var a = this.getRanges();
                return !a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
            }, scrollIntoView: function () {
                this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
            }, removeAllRanges: function () {
                if (this.getType() != CKEDITOR.SELECTION_NONE) {
                    var a = this.getNative();
                    try {
                        a && a[s ? "empty" : "removeAllRanges"]()
                    } catch (b) {
                    }
                    this.reset()
                }
            }
        }
    }(),"use strict",CKEDITOR.STYLE_BLOCK = 1,CKEDITOR.STYLE_INLINE = 2,CKEDITOR.STYLE_OBJECT =
        3,function () {
        function a(a, b) {
            for (var c, d; a = a.getParent();) {
                if (a.equals(b))break;
                if (a.getAttribute("data-nostyle"))c = a; else if (!d) {
                    var f = a.getAttribute("contentEditable");
                    f == "false" ? c = a : f == "true" && (d = 1)
                }
            }
            return c
        }

        function e(b) {
            var c = b.document;
            if (b.collapsed) {
                c = q(this, c);
                b.insertNode(c);
                b.moveToPosition(c, CKEDITOR.POSITION_BEFORE_END)
            } else {
                var d = this.element, f = this._.definition, h, i = f.ignoreReadonly, j = i || f.includeReadonly;
                j == null && (j = b.root.getCustomData("cke_includeReadonly"));
                var k = CKEDITOR.dtd[d];
                if (!k) {
                    h = true;
                    k = CKEDITOR.dtd.span
                }
                b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
                b.trim();
                var m = b.createBookmark(), s = m.startNode, n = m.endNode, t = s, l;
                if (!i) {
                    var o = b.getCommonAncestor(), i = a(s, o), o = a(n, o);
                    i && (t = i.getNextSourceNode(true));
                    o && (n = o)
                }
                for (t.getPosition(n) == CKEDITOR.POSITION_FOLLOWING && (t = 0); t;) {
                    i = false;
                    if (t.equals(n)) {
                        t = null;
                        i = true
                    } else {
                        var u = t.type == CKEDITOR.NODE_ELEMENT ? t.getName() : null, o = u && t.getAttribute("contentEditable") == "false", w = u && t.getAttribute("data-nostyle");
                        if (u && t.data("cke-bookmark")) {
                            t =
                                t.getNextSourceNode(true);
                            continue
                        }
                        if (o && j && CKEDITOR.dtd.$block[u])for (var x = t, r = g(x), v = void 0, z = r.length, y = 0, x = z && new CKEDITOR.dom.range(x.getDocument()); y < z; ++y) {
                            var v = r[y], A = CKEDITOR.filter.instances[v.data("cke-filter")];
                            if (A ? A.check(this) : 1) {
                                x.selectNodeContents(v);
                                e.call(this, x)
                            }
                        }
                        r = u ? !k[u] || w ? 0 : o && !j ? 0 : (t.getPosition(n) | G) == G && (!f.childRule || f.childRule(t)) : 1;
                        if (r)if ((r = t.getParent()) && ((r.getDtd() || CKEDITOR.dtd.span)[d] || h) && (!f.parentRule || f.parentRule(r))) {
                            if (!l && (!u || !CKEDITOR.dtd.$removeEmpty[u] ||
                                (t.getPosition(n) | G) == G)) {
                                l = b.clone();
                                l.setStartBefore(t)
                            }
                            u = t.type;
                            if (u == CKEDITOR.NODE_TEXT || o || u == CKEDITOR.NODE_ELEMENT && !t.getChildCount()) {
                                for (var u = t, aa; (i = !u.getNext(B)) && (aa = u.getParent(), k[aa.getName()]) && (aa.getPosition(s) | D) == D && (!f.childRule || f.childRule(aa));)u = aa;
                                l.setEndAfter(u)
                            }
                        } else i = true; else i = true;
                        t = t.getNextSourceNode(w || o)
                    }
                    if (i && l && !l.collapsed) {
                        for (var i = q(this, c), o = i.hasAttributes(), w = l.getCommonAncestor(), u = {}, r = {}, v = {}, z = {}, U, $, ca; i && w;) {
                            if (w.getName() == d) {
                                for (U in f.attributes)if (!z[U] &&
                                    (ca = w.getAttribute($)))i.getAttribute(U) == ca ? r[U] = 1 : z[U] = 1;
                                for ($ in f.styles)if (!v[$] && (ca = w.getStyle($)))i.getStyle($) == ca ? u[$] = 1 : v[$] = 1
                            }
                            w = w.getParent()
                        }
                        for (U in r)i.removeAttribute(U);
                        for ($ in u)i.removeStyle($);
                        o && !i.hasAttributes() && (i = null);
                        if (i) {
                            l.extractContents().appendTo(i);
                            l.insertNode(i);
                            p.call(this, i);
                            i.mergeSiblings();
                            CKEDITOR.env.ie || i.$.normalize()
                        } else {
                            i = new CKEDITOR.dom.element("span");
                            l.extractContents().appendTo(i);
                            l.insertNode(i);
                            p.call(this, i);
                            i.remove(true)
                        }
                        l = null
                    }
                }
                b.moveToBookmark(m);
                b.shrink(CKEDITOR.SHRINK_TEXT);
                b.shrink(CKEDITOR.NODE_ELEMENT, true)
            }
        }

        function b(a) {
            function b() {
                for (var a = new CKEDITOR.dom.elementPath(d.getParent()), c = new CKEDITOR.dom.elementPath(j.getParent()), f = null, g = null, e = 0; e < a.elements.length; e++) {
                    var h = a.elements[e];
                    if (h == a.block || h == a.blockLimit)break;
                    k.checkElementRemovable(h, true) && (f = h)
                }
                for (e = 0; e < c.elements.length; e++) {
                    h = c.elements[e];
                    if (h == c.block || h == c.blockLimit)break;
                    k.checkElementRemovable(h, true) && (g = h)
                }
                g && j.breakParent(g);
                f && d.breakParent(f)
            }

            a.enlarge(CKEDITOR.ENLARGE_INLINE,
                1);
            var c = a.createBookmark(), d = c.startNode;
            if (a.collapsed) {
                for (var f = new CKEDITOR.dom.elementPath(d.getParent(), a.root), g, e = 0, h; e < f.elements.length && (h = f.elements[e]); e++) {
                    if (h == f.block || h == f.blockLimit)break;
                    if (this.checkElementRemovable(h)) {
                        var i;
                        if (a.collapsed && (a.checkBoundaryOfElement(h, CKEDITOR.END) || (i = a.checkBoundaryOfElement(h, CKEDITOR.START)))) {
                            g = h;
                            g.match = i ? "start" : "end"
                        } else {
                            h.mergeSiblings();
                            h.is(this.element) ? o.call(this, h) : m(h, u(this)[h.getName()])
                        }
                    }
                }
                if (g) {
                    h = d;
                    for (e = 0; ; e++) {
                        i = f.elements[e];
                        if (i.equals(g))break; else if (i.match)continue; else i = i.clone();
                        i.append(h);
                        h = i
                    }
                    h[g.match == "start" ? "insertBefore" : "insertAfter"](g)
                }
            } else {
                var j = c.endNode, k = this;
                b();
                for (f = d; !f.equals(j);) {
                    g = f.getNextSourceNode();
                    if (f.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(f)) {
                        f.getName() == this.element ? o.call(this, f) : m(f, u(this)[f.getName()]);
                        if (g.type == CKEDITOR.NODE_ELEMENT && g.contains(d)) {
                            b();
                            g = d.getNext()
                        }
                    }
                    f = g
                }
            }
            a.moveToBookmark(c);
            a.shrink(CKEDITOR.NODE_ELEMENT, true)
        }

        function g(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") ==
                    "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function c(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
            (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && s(a, this)
        }

        function d(a) {
            var b = a.getCommonAncestor(true, true);
            if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
                var b = this._.definition, c = b.attributes;
                if (c)for (var d in c)a.removeAttribute(d, c[d]);
                if (b.styles)for (var f in b.styles)b.styles.hasOwnProperty(f) &&
                a.removeStyle(f)
            }
        }

        function i(a) {
            var b = a.createBookmark(true), c = a.createIterator();
            c.enforceRealBlocks = true;
            if (this._.enterMode)c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var d, f = a.document, g; d = c.getNextParagraph();)if (!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
                g = q(this, f, d);
                h(d, g)
            }
            a.moveToBookmark(b)
        }

        function f(a) {
            var b = a.createBookmark(1), c = a.createIterator();
            c.enforceRealBlocks = true;
            c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var d, f; d = c.getNextParagraph();)if (this.checkElementRemovable(d))if (d.is("pre")) {
                (f =
                    this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(f);
                h(d, f)
            } else o.call(this, d);
            a.moveToBookmark(b)
        }

        function h(a, b) {
            var c = !b;
            if (c) {
                b = a.getDocument().createElement("div");
                a.copyAttributes(b)
            }
            var d = b && b.is("pre"), f = a.is("pre"), g = !d && f;
            if (d && !f) {
                f = b;
                (g = a.getBogus()) && g.remove();
                g = a.getHtml();
                g = k(g, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
                g = g.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
                g = g.replace(/([ \t\n\r]+|&nbsp;)/g,
                    " ");
                g = g.replace(/<br\b[^>]*>/gi, "\n");
                if (CKEDITOR.env.ie) {
                    var e = a.getDocument().createElement("div");
                    e.append(f);
                    f.$.outerHTML = "<pre>" + g + "</pre>";
                    f.copyAttributes(e.getFirst());
                    f = e.getFirst().remove()
                } else f.setHtml(g);
                b = f
            } else g ? b = n(c ? [a.getHtml()] : j(a), b) : a.moveChildren(b);
            b.replace(a);
            if (d) {
                var c = b, h;
                if ((h = c.getPrevious(A)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre")) {
                    d = k(h.getHtml(), /\n$/, "") + "\n\n" + k(c.getHtml(), /^\n/, "");
                    CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d);
                    h.remove()
                }
            } else c &&
            l(b)
        }

        function j(a) {
            var b = [];
            k(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function (a, b, c) {
                return b + "</pre>" + c + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function (a, c) {
                b.push(c)
            });
            return b
        }

        function k(a, b, c) {
            var d = "", f = "", a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function (a, b, c) {
                b && (d = b);
                c && (f = c);
                return ""
            });
            return d + a.replace(b, c) + f
        }

        function n(a, b) {
            var c;
            a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var d = 0; d < a.length; d++) {
                var f = a[d], f = f.replace(/(\r\n|\r)/g, "\n"), f = k(f, /^[ \t]*\n/, ""), f = k(f, /\n$/, ""), f = k(f, /^[ \t]+|[ \t]+$/g, function (a, b) {
                    return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                }), f = f.replace(/\n/g, "<br>"), f = f.replace(/[ \t]{2,}/g, function (a) {
                    return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                });
                if (c) {
                    var g = b.clone();
                    g.setHtml(f);
                    c.append(g)
                } else b.setHtml(f)
            }
            return c || b
        }

        function o(a, b) {
            var c = this._.definition,
                d = c.attributes, c = c.styles, f = u(this)[a.getName()], g = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c), e;
            for (e in d)if (!((e == "class" || this._.definition.fullMatch) && a.getAttribute(e) != w(e, d[e])) && !(b && e.slice(0, 5) == "data-")) {
                g = a.hasAttribute(e);
                a.removeAttribute(e)
            }
            for (var h in c)if (!(this._.definition.fullMatch && a.getStyle(h) != w(h, c[h], true))) {
                g = g || !!a.getStyle(h);
                a.removeStyle(h)
            }
            m(a, f, v[a.getName()]);
            g && (this._.definition.alwaysRemoveElement ? l(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode ==
            CKEDITOR.ENTER_BR && !a.hasAttributes() ? l(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function p(a) {
            for (var b = u(this), c = a.getElementsByTag(this.element), d, f = c.count(); --f >= 0;) {
                d = c.getItem(f);
                d.isReadOnly() || o.call(this, d, true)
            }
            for (var g in b)if (g != this.element) {
                c = a.getElementsByTag(g);
                for (f = c.count() - 1; f >= 0; f--) {
                    d = c.getItem(f);
                    d.isReadOnly() || m(d, b[g])
                }
            }
        }

        function m(a, b, c) {
            if (b = b && b.attributes)for (var d = 0; d < b.length; d++) {
                var f = b[d][0], g;
                if (g = a.getAttribute(f)) {
                    var e = b[d][1];
                    (e === null ||
                    e.test && e.test(g) || typeof e == "string" && g == e) && a.removeAttribute(f)
                }
            }
            c || l(a)
        }

        function l(a, b) {
            if (!a.hasAttributes() || b)if (CKEDITOR.dtd.$block[a.getName()]) {
                var c = a.getPrevious(A), d = a.getNext(A);
                c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({br: 1})) && a.append("br", 1);
                d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({br: 1})) && a.append("br");
                a.remove(true)
            } else {
                c = a.getFirst();
                d = a.getLast();
                a.remove(true);
                if (c) {
                    c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings();
                    d && (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) &&
                    d.mergeSiblings()
                }
            }
        }

        function q(a, b, c) {
            var d;
            d = a.element;
            d == "*" && (d = "span");
            d = new CKEDITOR.dom.element(d, b);
            c && c.copyAttributes(d);
            d = s(d, a);
            b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
            return d
        }

        function s(a, b) {
            var c = b._.definition, d = c.attributes, c = CKEDITOR.style.getStyleText(c);
            if (d)for (var f in d)a.setAttribute(f, d[f]);
            c && a.setAttribute("style", c);
            return a
        }

        function t(a, b) {
            for (var c in a)a[c] = a[c].replace(z, function (a,
                                                             c) {
                return b[c]
            })
        }

        function u(a) {
            if (a._.overrides)return a._.overrides;
            var b = a._.overrides = {}, c = a._.definition.overrides;
            if (c) {
                CKEDITOR.tools.isArray(c) || (c = [c]);
                for (var d = 0; d < c.length; d++) {
                    var f = c[d], g, e;
                    if (typeof f == "string")g = f.toLowerCase(); else {
                        g = f.element ? f.element.toLowerCase() : a.element;
                        e = f.attributes
                    }
                    f = b[g] || (b[g] = {});
                    if (e) {
                        var f = f.attributes = f.attributes || [], h;
                        for (h in e)f.push([h.toLowerCase(), e[h]])
                    }
                }
            }
            return b
        }

        function w(a, b, c) {
            var d = new CKEDITOR.dom.element("span");
            d[c ? "setStyle" : "setAttribute"](a,
                b);
            return d[c ? "getStyle" : "getAttribute"](a)
        }

        function x(a, b, c) {
            for (var d = a.document, f = a.getRanges(), b = b ? this.removeFromRange : this.applyToRange, g, e = f.createIterator(); g = e.getNextRange();)b.call(this, g, c);
            a.selectRanges(f);
            d.removeCustomData("doc_processing_style")
        }

        var v = {
            address: 1,
            div: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 1,
            h6: 1,
            p: 1,
            pre: 1,
            section: 1,
            header: 1,
            footer: 1,
            nav: 1,
            article: 1,
            aside: 1,
            figure: 1,
            dialog: 1,
            hgroup: 1,
            time: 1,
            meter: 1,
            menu: 1,
            command: 1,
            keygen: 1,
            output: 1,
            progress: 1,
            details: 1,
            datagrid: 1,
            datalist: 1
        }, r =
        {
            a: 1,
            blockquote: 1,
            embed: 1,
            hr: 1,
            img: 1,
            li: 1,
            object: 1,
            ol: 1,
            table: 1,
            td: 1,
            tr: 1,
            th: 1,
            ul: 1,
            dl: 1,
            dt: 1,
            dd: 1,
            form: 1,
            audio: 1,
            video: 1
        }, y = /\s*(?:;\s*|$)/, z = /#\((.+?)\)/g, B = CKEDITOR.dom.walker.bookmark(0, 1), A = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function (a, b) {
            if (typeof a.type == "string")return new CKEDITOR.style.customHandlers[a.type](a);
            var c = a.attributes;
            if (c && c.style) {
                a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
                delete c.style
            }
            if (b) {
                a = CKEDITOR.tools.clone(a);
                t(a.attributes,
                    b);
                t(a.styles, b)
            }
            c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
            this.type = a.type || (v[c] ? CKEDITOR.STYLE_BLOCK : r[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
            if (typeof this.element == "object")this.type = CKEDITOR.STYLE_OBJECT;
            this._ = {definition: a}
        };
        CKEDITOR.style.prototype = {
            apply: function (a) {
                if (a instanceof CKEDITOR.dom.document)return x.call(this, a.getSelection());
                if (this.checkApplicable(a.elementPath(), a)) {
                    var b = this._.enterMode;
                    if (!b)this._.enterMode = a.activeEnterMode;
                    x.call(this, a.getSelection(), 0, a);
                    this._.enterMode = b
                }
            }, remove: function (a) {
                if (a instanceof CKEDITOR.dom.document)return x.call(this, a.getSelection(), 1);
                if (this.checkApplicable(a.elementPath(), a)) {
                    var b = this._.enterMode;
                    if (!b)this._.enterMode = a.activeEnterMode;
                    x.call(this, a.getSelection(), 1, a);
                    this._.enterMode = b
                }
            }, applyToRange: function (a) {
                this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? e : this.type == CKEDITOR.STYLE_BLOCK ? i : this.type == CKEDITOR.STYLE_OBJECT ? c : null;
                return this.applyToRange(a)
            }, removeFromRange: function (a) {
                this.removeFromRange =
                    this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? f : this.type == CKEDITOR.STYLE_OBJECT ? d : null;
                return this.removeFromRange(a)
            }, applyToObject: function (a) {
                s(a, this)
            }, checkActive: function (a, b) {
                switch (this.type) {
                    case CKEDITOR.STYLE_BLOCK:
                        return this.checkElementRemovable(a.block || a.blockLimit, true, b);
                    case CKEDITOR.STYLE_OBJECT:
                    case CKEDITOR.STYLE_INLINE:
                        for (var c = a.elements, d = 0, f; d < c.length; d++) {
                            f = c[d];
                            if (!(this.type == CKEDITOR.STYLE_INLINE && (f == a.block || f == a.blockLimit))) {
                                if (this.type ==
                                    CKEDITOR.STYLE_OBJECT) {
                                    var g = f.getName();
                                    if (!(typeof this.element == "string" ? g == this.element : g in this.element))continue
                                }
                                if (this.checkElementRemovable(f, true, b))return true
                            }
                        }
                }
                return false
            }, checkApplicable: function (a, b, c) {
                b && b instanceof CKEDITOR.filter && (c = b);
                if (c && !c.check(this))return false;
                switch (this.type) {
                    case CKEDITOR.STYLE_OBJECT:
                        return !!a.contains(this.element);
                    case CKEDITOR.STYLE_BLOCK:
                        return !!a.blockLimit.getDtd()[this.element]
                }
                return true
            }, checkElementMatch: function (a, b) {
                var c = this._.definition;
                if (!a || !c.ignoreReadonly && a.isReadOnly())return false;
                var d = a.getName();
                if (typeof this.element == "string" ? d == this.element : d in this.element) {
                    if (!b && !a.hasAttributes())return true;
                    if (d = c._AC)c = d; else {
                        var d = {}, f = 0, g = c.attributes;
                        if (g)for (var e in g) {
                            f++;
                            d[e] = g[e]
                        }
                        if (e = CKEDITOR.style.getStyleText(c)) {
                            d.style || f++;
                            d.style = e
                        }
                        d._length = f;
                        c = c._AC = d
                    }
                    if (c._length) {
                        for (var h in c)if (h != "_length") {
                            f = a.getAttribute(h) || "";
                            if (h == "style")a:{
                                d = c[h];
                                typeof d == "string" && (d = CKEDITOR.tools.parseCssText(d));
                                typeof f ==
                                "string" && (f = CKEDITOR.tools.parseCssText(f, true));
                                e = void 0;
                                for (e in d)if (!(e in f && (f[e] == d[e] || d[e] == "inherit" || f[e] == "inherit"))) {
                                    d = false;
                                    break a
                                }
                                d = true
                            } else d = c[h] == f;
                            if (d) {
                                if (!b)return true
                            } else if (b)return false
                        }
                        if (b)return true
                    } else return true
                }
                return false
            }, checkElementRemovable: function (a, b, c) {
                if (this.checkElementMatch(a, b, c))return true;
                if (b = u(this)[a.getName()]) {
                    var d;
                    if (!(b = b.attributes))return true;
                    for (c = 0; c < b.length; c++) {
                        d = b[c][0];
                        if (d = a.getAttribute(d)) {
                            var f = b[c][1];
                            if (f === null)return true;
                            if (typeof f == "string") {
                                if (d == f)return true
                            } else if (f.test(d))return true
                        }
                    }
                }
                return false
            }, buildPreview: function (a) {
                var b = this._.definition, c = [], d = b.element;
                d == "bdo" && (d = "span");
                var c = ["<", d], f = b.attributes;
                if (f)for (var g in f)c.push(" ", g, '="', f[g], '"');
                (f = CKEDITOR.style.getStyleText(b)) && c.push(' style="', f, '"');
                c.push(">", a || b.name, "</", d, ">");
                return c.join("")
            }, getDefinition: function () {
                return this._.definition
            }
        };
        CKEDITOR.style.getStyleText = function (a) {
            var b = a._ST;
            if (b)return b;
            var b = a.styles, c =
                a.attributes && a.attributes.style || "", d = "";
            c.length && (c = c.replace(y, ";"));
            for (var f in b) {
                var g = b[f], e = (f + ":" + g).replace(y, ";");
                g == "inherit" ? d = d + e : c = c + e
            }
            c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
            return a._ST = c + d
        };
        CKEDITOR.style.customHandlers = {};
        CKEDITOR.style.addCustomHandler = function (a) {
            var b = function (a) {
                this._ = {definition: a};
                this.setup && this.setup(a)
            };
            b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {assignedTo: CKEDITOR.STYLE_OBJECT}, a, true);
            return this.customHandlers[a.type] = b
        };
        var G = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED, D = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
    }(),CKEDITOR.styleCommand = function (a, e) {
        this.requiredContent = this.allowedContent = this.style = a;
        CKEDITOR.tools.extend(this, e, true)
    },CKEDITOR.styleCommand.prototype.exec = function (a) {
        a.focus();
        this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON &&
        a.removeStyle(this.style)
    },CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet"),CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet),CKEDITOR.loadStylesSet = function (a, e, b) {
        CKEDITOR.stylesSet.addExternal(a, e, "");
        CKEDITOR.stylesSet.load(a, b)
    },CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        attachStyleStateChange: function (a, e) {
            var b = this._.styleStateChangeCallbacks;
            if (!b) {
                b = this._.styleStateChangeCallbacks = [];
                this.on("selectionChange", function (a) {
                    for (var c =
                        0; c < b.length; c++) {
                        var d = b[c], e = d.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                        d.fn.call(this, e)
                    }
                })
            }
            b.push({style: a, fn: e})
        }, applyStyle: function (a) {
            a.apply(this)
        }, removeStyle: function (a) {
            a.remove(this)
        }, getStylesSet: function (a) {
            if (this._.stylesDefinitions)a(this._.stylesDefinitions); else {
                var e = this, b = e.config.stylesCombo_stylesSet || e.config.stylesSet;
                if (b === false)a(null); else if (b instanceof Array) {
                    e._.stylesDefinitions = b;
                    a(b)
                } else {
                    b || (b = "default");
                    var b = b.split(":"),
                        g = b[0];
                    CKEDITOR.stylesSet.addExternal(g, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
                    CKEDITOR.stylesSet.load(g, function (b) {
                        e._.stylesDefinitions = b[g];
                        a(e._.stylesDefinitions)
                    })
                }
            }
        }
    }),CKEDITOR.dom.comment = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createComment(a));
        CKEDITOR.dom.domObject.call(this, a)
    },CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node,CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
        type: CKEDITOR.NODE_COMMENT, getOuterHtml: function () {
            return "<\!--" + this.$.nodeValue +
                "--\>"
        }
    }),"use strict",function () {
        var a = {}, e = {}, b;
        for (b in CKEDITOR.dtd.$blockLimit)b in CKEDITOR.dtd.$list || (a[b] = 1);
        for (b in CKEDITOR.dtd.$block)b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (e[b] = 1);
        CKEDITOR.dom.elementPath = function (b, c) {
            var d = null, i = null, f = [], h = b, j, c = c || b.getDocument().getBody();
            do if (h.type == CKEDITOR.NODE_ELEMENT) {
                f.push(h);
                if (!this.lastElement) {
                    this.lastElement = h;
                    if (h.is(CKEDITOR.dtd.$object) || h.getAttribute("contenteditable") == "false")continue
                }
                if (h.equals(c))break;
                if (!i) {
                    j = h.getName();
                    h.getAttribute("contenteditable") == "true" ? i = h : !d && e[j] && (d = h);
                    if (a[j]) {
                        var k;
                        if (k = !d) {
                            if (j = j == "div") {
                                a:{
                                    j = h.getChildren();
                                    k = 0;
                                    for (var n = j.count(); k < n; k++) {
                                        var o = j.getItem(k);
                                        if (o.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[o.getName()]) {
                                            j = true;
                                            break a
                                        }
                                    }
                                    j = false
                                }
                                j = !j
                            }
                            k = j
                        }
                        k ? d = h : i = h
                    }
                }
            } while (h = h.getParent());
            i || (i = c);
            this.block = d;
            this.blockLimit = i;
            this.root = c;
            this.elements = f
        }
    }(),CKEDITOR.dom.elementPath.prototype = {
        compare: function (a) {
            var e = this.elements, a = a && a.elements;
            if (!a ||
                e.length != a.length)return false;
            for (var b = 0; b < e.length; b++)if (!e[b].equals(a[b]))return false;
            return true
        }, contains: function (a, e, b) {
            var g;
            typeof a == "string" && (g = function (b) {
                return b.getName() == a
            });
            a instanceof CKEDITOR.dom.element ? g = function (b) {
                return b.equals(a)
            } : CKEDITOR.tools.isArray(a) ? g = function (b) {
                return CKEDITOR.tools.indexOf(a, b.getName()) > -1
            } : typeof a == "function" ? g = a : typeof a == "object" && (g = function (b) {
                return b.getName() in a
            });
            var c = this.elements, d = c.length;
            e && d--;
            if (b) {
                c = Array.prototype.slice.call(c,
                    0);
                c.reverse()
            }
            for (e = 0; e < d; e++)if (g(c[e]))return c[e];
            return null
        }, isContextFor: function (a) {
            var e;
            if (a in CKEDITOR.dtd.$block) {
                e = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
                return !!e.getDtd()[a]
            }
            return true
        }, direction: function () {
            return (this.block || this.blockLimit || this.root).getDirection(1)
        }
    },CKEDITOR.dom.text = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createTextNode(a));
        this.$ = a
    },CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node,
    CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
        type: CKEDITOR.NODE_TEXT, getLength: function () {
            return this.$.nodeValue.length
        }, getText: function () {
            return this.$.nodeValue
        }, setText: function (a) {
            this.$.nodeValue = a
        }, split: function (a) {
            var e = this.$.parentNode, b = e.childNodes.length, g = this.getLength(), c = this.getDocument(), d = new CKEDITOR.dom.text(this.$.splitText(a), c);
            if (e.childNodes.length == b)if (a >= g) {
                d = c.createText("");
                d.insertAfter(this)
            } else {
                a = c.createText("");
                a.insertAfter(d);
                a.remove()
            }
            return d
        }, substring: function (a,
                                e) {
            return typeof e != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, e)
        }
    }),function () {
        function a(a, g, c) {
            var d = a.serializable, e = g[c ? "endContainer" : "startContainer"], f = c ? "endOffset" : "startOffset", h = d ? g.document.getById(a.startNode) : a.startNode, a = d ? g.document.getById(a.endNode) : a.endNode;
            if (e.equals(h.getPrevious())) {
                g.startOffset = g.startOffset - e.getLength() - a.getPrevious().getLength();
                e = a.getNext()
            } else if (e.equals(a.getPrevious())) {
                g.startOffset = g.startOffset - e.getLength();
                e = a.getNext()
            }
            e.equals(h.getParent()) &&
            g[f]++;
            e.equals(a.getParent()) && g[f]++;
            g[c ? "endContainer" : "startContainer"] = e;
            return g
        }

        CKEDITOR.dom.rangeList = function (a) {
            if (a instanceof CKEDITOR.dom.rangeList)return a;
            a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
            return CKEDITOR.tools.extend(a, e)
        };
        var e = {
            createIterator: function () {
                var a = this, g = CKEDITOR.dom.walker.bookmark(), c = [], d;
                return {
                    getNextRange: function (e) {
                        d = d === void 0 ? 0 : d + 1;
                        var f = a[d];
                        if (f && a.length > 1) {
                            if (!d)for (var h = a.length - 1; h >= 0; h--)c.unshift(a[h].createBookmark(true));
                            if (e)for (var j =
                                0; a[d + j + 1];) {
                                for (var k = f.document, e = 0, h = k.getById(c[j].endNode), k = k.getById(c[j + 1].startNode); ;) {
                                    h = h.getNextSourceNode(false);
                                    if (k.equals(h))e = 1; else if (g(h) || h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary())continue;
                                    break
                                }
                                if (!e)break;
                                j++
                            }
                            for (f.moveToBookmark(c.shift()); j--;) {
                                h = a[++d];
                                h.moveToBookmark(c.shift());
                                f.setEnd(h.endContainer, h.endOffset)
                            }
                        }
                        return f
                    }
                }
            }, createBookmarks: function (b) {
                for (var g = [], c, d = 0; d < this.length; d++) {
                    g.push(c = this[d].createBookmark(b, true));
                    for (var e = d + 1; e < this.length; e++) {
                        this[e] =
                            a(c, this[e]);
                        this[e] = a(c, this[e], true)
                    }
                }
                return g
            }, createBookmarks2: function (a) {
                for (var g = [], c = 0; c < this.length; c++)g.push(this[c].createBookmark2(a));
                return g
            }, moveToBookmarks: function (a) {
                for (var g = 0; g < this.length; g++)this[g].moveToBookmark(a[g])
            }
        }
    }(),function () {
        function a() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function e(b) {
            var c = CKEDITOR.skin["ua_" + b], d = CKEDITOR.env;
            if (c)for (var c = c.split(",").sort(function (a, b) {
                return a > b ? -1 : 1
            }), f =
                0, g; f < c.length; f++) {
                g = c[f];
                if (d.ie && (g.replace(/^ie/, "") == d.version || d.quirks && g == "iequirks"))g = "ie";
                if (d[g]) {
                    b = b + ("_" + c[f]);
                    break
                }
            }
            return CKEDITOR.getUrl(a() + b + ".css")
        }

        function b(a, b) {
            if (!d[a]) {
                CKEDITOR.document.appendStyleSheet(e(a));
                d[a] = 1
            }
            b && b()
        }

        function g(a) {
            var b = a.getById(i);
            if (!b) {
                b = a.getHead().append("style");
                b.setAttribute("id", i);
                b.setAttribute("type", "text/css")
            }
            return b
        }

        function c(a, b, c) {
            var d, f, g;
            if (CKEDITOR.env.webkit) {
                b = b.split("}").slice(0, -1);
                for (f = 0; f < b.length; f++)b[f] = b[f].split("{")
            }
            for (var e =
                0; e < a.length; e++)if (CKEDITOR.env.webkit)for (f = 0; f < b.length; f++) {
                g = b[f][1];
                for (d = 0; d < c.length; d++)g = g.replace(c[d][0], c[d][1]);
                a[e].$.sheet.addRule(b[f][0], g)
            } else {
                g = b;
                for (d = 0; d < c.length; d++)g = g.replace(c[d][0], c[d][1]);
                CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? a[e].$.styleSheet.cssText = a[e].$.styleSheet.cssText + g : a[e].$.innerHTML = a[e].$.innerHTML + g
            }
        }

        var d = {};
        CKEDITOR.skin = {
            path: a, loadPart: function (c, d) {
                CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() +
                    "skin.js"), function () {
                    b(c, d)
                }) : b(c, d)
            }, getPath: function (a) {
                return CKEDITOR.getUrl(e(a))
            }, icons: {}, addIcon: function (a, b, c, d) {
                a = a.toLowerCase();
                this.icons[a] || (this.icons[a] = {
                    path: b,
                    offset: c || 0,
                    bgsize: d || "16px"
                })
            }, getIconStyle: function (a, b, c, d, f) {
                var g;
                if (a) {
                    a = a.toLowerCase();
                    b && (g = this.icons[a + "-rtl"]);
                    g || (g = this.icons[a])
                }
                a = c || g && g.path || "";
                d = d || g && g.offset;
                f = f || g && g.bgsize || "16px";
                return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + f + ";"
            }
        };
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype,
            {
                getUiColor: function () {
                    return this.uiColor
                }, setUiColor: function (a) {
                var b = g(CKEDITOR.document);
                return (this.setUiColor = function (a) {
                    this.uiColor = a;
                    var d = CKEDITOR.skin.chameleon, g = "", e = "";
                    if (typeof d == "function") {
                        g = d(this, "editor");
                        e = d(this, "panel")
                    }
                    a = [[h, a]];
                    c([b], g, a);
                    c(f, e, a)
                }).call(this, a)
            }
            });
        var i = "cke_ui_color", f = [], h = /\$color/g;
        CKEDITOR.on("instanceLoaded", function (a) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var b = a.editor, a = function (a) {
                    a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
                    if (!a.getById("cke_ui_color")) {
                        a = g(a);
                        f.push(a);
                        var d = b.getUiColor();
                        d && c([a], CKEDITOR.skin.chameleon(b, "panel"), [[h, d]])
                    }
                };
                b.on("panelShow", a);
                b.on("menuShow", a);
                b.config.uiColor && b.setUiColor(b.config.uiColor)
            }
        })
    }(),function () {
        if (CKEDITOR.env.webkit)CKEDITOR.env.hc = false; else {
            var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
            a.appendTo(CKEDITOR.document.getHead());
            try {
                var e = a.getComputedStyle("border-top-color"),
                    b = a.getComputedStyle("border-right-color");
                CKEDITOR.env.hc = !!(e && e == b)
            } catch (g) {
                CKEDITOR.env.hc = false
            }
            a.remove()
        }
        if (CKEDITOR.env.hc)CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
        CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
        CKEDITOR.status = "loaded";
        CKEDITOR.fireOnce("loaded");
        if (a = CKEDITOR._.pending) {
            delete CKEDITOR._.pending;
            for (e = 0; e < a.length; e++) {
                CKEDITOR.editor.prototype.constructor.apply(a[e][0], a[e][1]);
                CKEDITOR.add(a[e][0])
            }
        }
    }(),CKEDITOR.skin.name = "moono",CKEDITOR.skin.ua_editor =
        "ie,iequirks,ie7,ie8,gecko",CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8",CKEDITOR.skin.chameleon = function () {
        var a = function () {
            return function (a, b) {
                for (var d = a.match(/[^#]./g), e = 0; e < 3; e++) {
                    var f = d, h = e, j;
                    j = parseInt(d[e], 16);
                    j = ("0" + (b < 0 ? 0 | j * (1 + b) : 0 | j + (255 - j) * b).toString(16)).slice(-2);
                    f[h] = j
                }
                return "#" + d.join("")
            }
        }(), e = function () {
            var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
            return function (b, d) {
                return a.output({from: b, to: d})
            }
        }(), b = {
            editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
panel:new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")};
        return function (g, c) {
            var d = g.uiColor, d = {
                id: "." + g.id,
                defaultBorder: a(d, -0.1),
                defaultGradient: e(a(d, 0.9), d),
                lightGradient: e(a(d, 1), a(d, 0.7)),
                mediumGradient: e(a(d, 0.8), a(d, 0.5)),
                ckeButtonOn: e(a(d, 0.6), a(d, 0.7)),
                ckeResizer: a(d, -0.4),
                ckeToolbarSeparator: a(d, 0.5),
                ckeColorauto: a(d, 0.8),
                dialogBody: a(d, 0.7),
                dialogTabSelected: e("#FFFFFF", "#FFFFFF"),
                dialogTabSelectedBorder: "#FFF",
                elementsPathColor: a(d, -0.6),
                elementsPathBg: d,
                menubuttonIcon: a(d, 0.5),
                menubuttonIconHover: a(d, 0.3)
            };
            return b[c].output(d).replace(/\[/g,
                "{").replace(/\]/g, "}")
        }
    }(),CKEDITOR.plugins.add("dialogui", {
        onLoad: function () {
            var a = function (a) {
                this._ || (this._ = {});
                this._["default"] = this._.initValue = a["default"] || "";
                this._.required = a.required || false;
                for (var b = [this._], c = 1; c < arguments.length; c++)b.push(arguments[c]);
                b.push(true);
                CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
                return this._
            }, e = {
                build: function (a, b, c) {
                    return new CKEDITOR.ui.dialog.textInput(a, b, c)
                }
            }, b = {
                build: function (a, b, c) {
                    return new CKEDITOR.ui.dialog[b.type](a, b, c)
                }
            }, g = {
                isChanged: function () {
                    return this.getValue() !=
                        this.getInitValue()
                }, reset: function (a) {
                    this.setValue(this.getInitValue(), a)
                }, setInitValue: function () {
                    this._.initValue = this.getValue()
                }, resetInitValue: function () {
                    this._.initValue = this._["default"]
                }, getInitValue: function () {
                    return this._.initValue
                }
            }, c = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                onChange: function (a, b) {
                    if (!this._.domOnChangeRegistered) {
                        a.on("load", function () {
                            this.getInputElement().on("change", function () {
                                a.parts.dialog.isVisible() && this.fire("change",
                                    {value: this.getValue()})
                            }, this)
                        }, this);
                        this._.domOnChangeRegistered = true
                    }
                    this.on("change", b)
                }
            }, true), d = /^on([A-Z]\w+)/, i = function (a) {
                for (var b in a)(d.test(b) || b == "title" || b == "type") && delete a[b];
                return a
            };
            CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
                labeledElement: function (b, c, d, g) {
                    if (!(arguments.length < 4)) {
                        var e = a.call(this, c);
                        e.labelId = CKEDITOR.tools.getNextId() + "_label";
                        this._.children = [];
                        var i = {role: c.role || "presentation"};
                        if (c.includeLabel)i["aria-labelledby"] = e.labelId;
                        CKEDITOR.ui.dialog.uiElement.call(this,
                            b, c, d, "div", null, i, function () {
                                var a = [], d = c.required ? " cke_required" : "";
                                if (c.labelLayout != "horizontal")a.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + e.labelId + '"', e.inputId ? ' for="' + e.inputId + '"' : "", (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", c.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', c.controlStyle ? ' style="' + c.controlStyle + '"' : "", ' role="presentation">', g.call(this, b, c), "</div>"); else {
                                    d = {
                                        type: "hbox",
                                        widths: c.widths,
                                        padding: 0,
                                        children: [{
                                            type: "html",
                                            html: '<label class="cke_dialog_ui_labeled_label' +
                                            d + '" id="' + e.labelId + '" for="' + e.inputId + '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(c.label) + "</label>"
                                        }, {
                                            type: "html",
                                            html: '<span class="cke_dialog_ui_labeled_content"' + (c.controlStyle ? ' style="' + c.controlStyle + '"' : "") + ">" + g.call(this, b, c) + "</span>"
                                        }]
                                    };
                                    CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, a)
                                }
                                return a.join("")
                            })
                    }
                }, textInput: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        a.call(this, c);
                        var g = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput", e = {
                            "class": "cke_dialog_ui_input_" +
                            c.type, id: g, type: c.type
                        };
                        if (c.validate)this.validate = c.validate;
                        if (c.maxLength)e.maxlength = c.maxLength;
                        if (c.size)e.size = c.size;
                        if (c.inputStyle)e.style = c.inputStyle;
                        var i = this, p = false;
                        b.on("load", function () {
                            i.getInputElement().on("keydown", function (a) {
                                a.data.getKeystroke() == 13 && (p = true)
                            });
                            i.getInputElement().on("keyup", function (a) {
                                if (a.data.getKeystroke() == 13 && p) {
                                    b.getButton("ok") && setTimeout(function () {
                                        b.getButton("ok").click()
                                    }, 0);
                                    p = false
                                }
                            }, null, null, 1E3)
                        });
                        CKEDITOR.ui.dialog.labeledElement.call(this,
                            b, c, d, function () {
                                var a = ['<div class="cke_dialog_ui_input_', c.type, '" role="presentation"'];
                                c.width && a.push('style="width:' + c.width + '" ');
                                a.push("><input ");
                                e["aria-labelledby"] = this._.labelId;
                                this._.required && (e["aria-required"] = this._.required);
                                for (var b in e)a.push(b + '="' + e[b] + '" ');
                                a.push(" /></div>");
                                return a.join("")
                            })
                    }
                }, textarea: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        a.call(this, c);
                        var g = this, e = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea", i = {};
                        if (c.validate)this.validate = c.validate;
                        i.rows = c.rows || 5;
                        i.cols = c.cols || 20;
                        i["class"] = "cke_dialog_ui_input_textarea " + (c["class"] || "");
                        if (typeof c.inputStyle != "undefined")i.style = c.inputStyle;
                        if (c.dir)i.dir = c.dir;
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function () {
                            i["aria-labelledby"] = this._.labelId;
                            this._.required && (i["aria-required"] = this._.required);
                            var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', e, '" '], b;
                            for (b in i)a.push(b + '="' + CKEDITOR.tools.htmlEncode(i[b]) + '" ');
                            a.push(">", CKEDITOR.tools.htmlEncode(g._["default"]),
                                "</textarea></div>");
                            return a.join("")
                        })
                    }
                }, checkbox: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        var g = a.call(this, c, {"default": !!c["default"]});
                        if (c.validate)this.validate = c.validate;
                        CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "span", null, null, function () {
                            var a = CKEDITOR.tools.extend({}, c, {id: c.id ? c.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"}, true), d = [], e = CKEDITOR.tools.getNextId() + "_label", j = {
                                "class": "cke_dialog_ui_checkbox_input",
                                type: "checkbox",
                                "aria-labelledby": e
                            };
                            i(a);
                            if (c["default"])j.checked =
                                "checked";
                            if (typeof a.inputStyle != "undefined")a.style = a.inputStyle;
                            g.checkbox = new CKEDITOR.ui.dialog.uiElement(b, a, d, "input", null, j);
                            d.push(' <label id="', e, '" for="', j.id, '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(c.label), "</label>");
                            return d.join("")
                        })
                    }
                }, radio: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        a.call(this, c);
                        if (!this._["default"])this._["default"] = this._.initValue = c.items[0][1];
                        if (c.validate)this.validate = c.validate;
                        var g = [], e = this;
                        c.role = "radiogroup";
                        c.includeLabel = true;
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function () {
                            for (var a = [], d = [], j = (c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio", l = 0; l < c.items.length; l++) {
                                var q = c.items[l], s = q[2] !== void 0 ? q[2] : q[0], t = q[1] !== void 0 ? q[1] : q[0], u = CKEDITOR.tools.getNextId() + "_radio_input", w = u + "_label", u = CKEDITOR.tools.extend({}, c, {
                                    id: u,
                                    title: null,
                                    type: null
                                }, true), s = CKEDITOR.tools.extend({}, u, {title: s}, true), x = {
                                    type: "radio",
                                    "class": "cke_dialog_ui_radio_input",
                                    name: j,
                                    value: t,
                                    "aria-labelledby": w
                                }, v = [];
                                if (e._["default"] == t)x.checked = "checked";
                                i(u);
                                i(s);
                                if (typeof u.inputStyle != "undefined")u.style = u.inputStyle;
                                u.keyboardFocusable = true;
                                g.push(new CKEDITOR.ui.dialog.uiElement(b, u, v, "input", null, x));
                                v.push(" ");
                                new CKEDITOR.ui.dialog.uiElement(b, s, v, "label", null, {
                                    id: w,
                                    "for": x.id
                                }, q[0]);
                                a.push(v.join(""))
                            }
                            new CKEDITOR.ui.dialog.hbox(b, g, a, d);
                            return d.join("")
                        });
                        this._.children = g
                    }
                }, button: function (b, c, d) {
                    if (arguments.length) {
                        typeof c == "function" && (c = c(b.getParentEditor()));
                        a.call(this, c, {
                            disabled: c.disabled ||
                            false
                        });
                        CKEDITOR.event.implementOn(this);
                        var g = this;
                        b.on("load", function () {
                            var a = this.getElement();
                            (function () {
                                a.on("click", function (a) {
                                    g.click();
                                    a.data.preventDefault()
                                });
                                a.on("keydown", function (a) {
                                    if (a.data.getKeystroke() in {32: 1}) {
                                        g.click();
                                        a.data.preventDefault()
                                    }
                                })
                            })();
                            a.unselectable()
                        }, this);
                        var e = CKEDITOR.tools.extend({}, c);
                        delete e.style;
                        var i = CKEDITOR.tools.getNextId() + "_label";
                        CKEDITOR.ui.dialog.uiElement.call(this, b, e, d, "a", null, {
                            style: c.style,
                            href: "javascript:void(0)",
                            title: c.label,
                            hidefocus: "true",
                            "class": c["class"],
                            role: "button",
                            "aria-labelledby": i
                        }, '<span id="' + i + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(c.label) + "</span>")
                    }
                }, select: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        var g = a.call(this, c);
                        if (c.validate)this.validate = c.validate;
                        g.inputId = CKEDITOR.tools.getNextId() + "_select";
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function () {
                            var a = CKEDITOR.tools.extend({}, c, {id: c.id ? c.id + "_select" : CKEDITOR.tools.getNextId() + "_select"}, true), d = [], e = [], j = {
                                id: g.inputId,
                                "class": "cke_dialog_ui_input_select",
                                "aria-labelledby": this._.labelId
                            };
                            d.push('<div class="cke_dialog_ui_input_', c.type, '" role="presentation"');
                            c.width && d.push('style="width:' + c.width + '" ');
                            d.push(">");
                            if (c.size !== void 0)j.size = c.size;
                            if (c.multiple !== void 0)j.multiple = c.multiple;
                            i(a);
                            for (var l = 0, q; l < c.items.length && (q = c.items[l]); l++)e.push('<option value="', CKEDITOR.tools.htmlEncode(q[1] !== void 0 ? q[1] : q[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(q[0]));
                            if (typeof a.inputStyle != "undefined")a.style = a.inputStyle;
                            g.select =
                                new CKEDITOR.ui.dialog.uiElement(b, a, d, "select", null, j, e.join(""));
                            d.push("</div>");
                            return d.join("")
                        })
                    }
                }, file: function (b, c, d) {
                    if (!(arguments.length < 3)) {
                        c["default"] === void 0 && (c["default"] = "");
                        var g = CKEDITOR.tools.extend(a.call(this, c), {
                            definition: c,
                            buttons: []
                        });
                        if (c.validate)this.validate = c.validate;
                        b.on("load", function () {
                            CKEDITOR.document.getById(g.frameId).getParent().addClass("cke_dialog_ui_input_file")
                        });
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function () {
                            g.frameId = CKEDITOR.tools.getNextId() +
                                "_fileInput";
                            var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', g.frameId, '" title="', c.label, '" src="javascript:void('];
                            a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
                            a.push(')"></iframe>');
                            return a.join("")
                        })
                    }
                }, fileButton: function (b, c, d) {
                    var g = this;
                    if (!(arguments.length < 3)) {
                        a.call(this, c);
                        if (c.validate)this.validate = c.validate;
                        var e = CKEDITOR.tools.extend({},
                            c), i = e.onClick;
                        e.className = (e.className ? e.className + " " : "") + "cke_dialog_ui_button";
                        e.onClick = function (a) {
                            var d = c["for"];
                            if (!i || i.call(this, a) !== false) {
                                b.getContentElement(d[0], d[1]).submit();
                                this.disable()
                            }
                        };
                        b.on("load", function () {
                            b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(g)
                        });
                        CKEDITOR.ui.dialog.button.call(this, b, e, d)
                    }
                }, html: function () {
                    var a = /^\s*<[\w:]+\s+([^>]*)?>/, b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/, c = /\/$/;
                    return function (d, g, e) {
                        if (!(arguments.length < 3)) {
                            var i = [],
                                m = g.html;
                            m.charAt(0) != "<" && (m = "<span>" + m + "</span>");
                            var l = g.focus;
                            if (l) {
                                var q = this.focus;
                                this.focus = function () {
                                    (typeof l == "function" ? l : q).call(this);
                                    this.fire("focus")
                                };
                                if (g.isFocusable)this.isFocusable = this.isFocusable;
                                this.keyboardFocusable = true
                            }
                            CKEDITOR.ui.dialog.uiElement.call(this, d, g, i, "span", null, null, "");
                            i = i.join("").match(a);
                            m = m.match(b) || ["", "", ""];
                            if (c.test(m[1])) {
                                m[1] = m[1].slice(0, -1);
                                m[2] = "/" + m[2]
                            }
                            e.push([m[1], " ", i[1] || "", m[2]].join(""))
                        }
                    }
                }(), fieldset: function (a, b, c, d, g) {
                    var e = g.label;
                    this._ = {children: b};
                    CKEDITOR.ui.dialog.uiElement.call(this, a, g, d, "fieldset", null, null, function () {
                        var a = [];
                        e && a.push("<legend" + (g.labelStyle ? ' style="' + g.labelStyle + '"' : "") + ">" + e + "</legend>");
                        for (var b = 0; b < c.length; b++)a.push(c[b]);
                        return a.join("")
                    })
                }
            }, true);
            CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
            CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                setLabel: function (a) {
                    var b = CKEDITOR.document.getById(this._.labelId);
                    b.getChildCount() <
                    1 ? (new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b) : b.getChild(0).$.nodeValue = a;
                    return this
                }, getLabel: function () {
                    var a = CKEDITOR.document.getById(this._.labelId);
                    return !a || a.getChildCount() < 1 ? "" : a.getChild(0).getText()
                }, eventProcessors: c
            }, true);
            CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                click: function () {
                    return !this._.disabled ? this.fire("click", {dialog: this._.dialog}) : false
                },
                enable: function () {
                    this._.disabled = false;
                    var a = this.getElement();
                    a && a.removeClass("cke_disabled")
                },
                disable: function () {
                    this._.disabled = true;
                    this.getElement().addClass("cke_disabled")
                },
                isVisible: function () {
                    return this.getElement().getFirst().isVisible()
                },
                isEnabled: function () {
                    return !this._.disabled
                },
                eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                    onClick: function (a, b) {
                        this.on("click", function () {
                            b.apply(this, arguments)
                        })
                    }
                }, true),
                accessKeyUp: function () {
                    this.click()
                },
                accessKeyDown: function () {
                    this.focus()
                },
                keyboardFocusable: true
            }, true);
            CKEDITOR.ui.dialog.textInput.prototype =
                CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                    getInputElement: function () {
                        return CKEDITOR.document.getById(this._.inputId)
                    }, focus: function () {
                        var a = this.selectParentTab();
                        setTimeout(function () {
                            var b = a.getInputElement();
                            b && b.$.focus()
                        }, 0)
                    }, select: function () {
                        var a = this.selectParentTab();
                        setTimeout(function () {
                            var b = a.getInputElement();
                            if (b) {
                                b.$.focus();
                                b.$.select()
                            }
                        }, 0)
                    }, accessKeyUp: function () {
                        this.select()
                    }, setValue: function (a) {
                        !a && (a = "");
                        return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this,
                            arguments)
                    }, keyboardFocusable: true
                }, g, true);
            CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
            CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                getInputElement: function () {
                    return this._.select.getElement()
                }, add: function (a, b, c) {
                    var d = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document), g = this.getInputElement().$;
                    d.$.text = a;
                    d.$.value = b === void 0 || b === null ? a : b;
                    c === void 0 || c === null ? CKEDITOR.env.ie ? g.add(d.$) : g.add(d.$,
                        null) : g.add(d.$, c);
                    return this
                }, remove: function (a) {
                    this.getInputElement().$.remove(a);
                    return this
                }, clear: function () {
                    for (var a = this.getInputElement().$; a.length > 0;)a.remove(0);
                    return this
                }, keyboardFocusable: true
            }, g, true);
            CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                getInputElement: function () {
                    return this._.checkbox.getElement()
                }, setValue: function (a, b) {
                    this.getInputElement().$.checked = a;
                    !b && this.fire("change", {value: a})
                }, getValue: function () {
                    return this.getInputElement().$.checked
                },
                accessKeyUp: function () {
                    this.setValue(!this.getValue())
                }, eventProcessors: {
                    onChange: function (a, b) {
                        if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8)return c.onChange.apply(this, arguments);
                        a.on("load", function () {
                            var a = this._.checkbox.getElement();
                            a.on("propertychange", function (b) {
                                b = b.data.$;
                                b.propertyName == "checked" && this.fire("change", {value: a.$.checked})
                            }, this)
                        }, this);
                        this.on("change", b);
                        return null
                    }
                }, keyboardFocusable: true
            }, g, true);
            CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement,
                {
                    setValue: function (a, b) {
                        for (var c = this._.children, d, g = 0; g < c.length && (d = c[g]); g++)d.getElement().$.checked = d.getValue() == a;
                        !b && this.fire("change", {value: a})
                    }, getValue: function () {
                    for (var a = this._.children, b = 0; b < a.length; b++)if (a[b].getElement().$.checked)return a[b].getValue();
                    return null
                }, accessKeyUp: function () {
                    var a = this._.children, b;
                    for (b = 0; b < a.length; b++)if (a[b].getElement().$.checked) {
                        a[b].getElement().focus();
                        return
                    }
                    a[0].getElement().focus()
                }, eventProcessors: {
                    onChange: function (a, b) {
                        if (CKEDITOR.env.ie) {
                            a.on("load",
                                function () {
                                    for (var a = this._.children, b = this, c = 0; c < a.length; c++)a[c].getElement().on("propertychange", function (a) {
                                        a = a.data.$;
                                        a.propertyName == "checked" && this.$.checked && b.fire("change", {value: this.getAttribute("value")})
                                    })
                                }, this);
                            this.on("change", b)
                        } else return c.onChange.apply(this, arguments);
                        return null
                    }
                }
                }, g, true);
            CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, g, {
                getInputElement: function () {
                    var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
                    return a.$.forms.length > 0 ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement()
                }, submit: function () {
                    this.getInputElement().getParent().$.submit();
                    return this
                }, getAction: function () {
                    return this.getInputElement().getParent().$.action
                }, registerEvents: function (a) {
                    var b = /^on([A-Z]\w+)/, c, d = function (a, b, c, d) {
                        a.on("formLoaded", function () {
                            a.getInputElement().on(c, d, a)
                        })
                    }, g;
                    for (g in a)if (c = g.match(b))this.eventProcessors[g] ? this.eventProcessors[g].call(this, this._.dialog, a[g]) : d(this, this._.dialog,
                        c[1].toLowerCase(), a[g]);
                    return this
                }, reset: function () {
                    function a() {
                        c.$.open();
                        var f = "";
                        d.size && (f = d.size - (CKEDITOR.env.ie ? 7 : 0));
                        var s = b.frameId + "_input";
                        c.$.write(['<html dir="' + m + '" lang="' + l + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + m + '" lang="' + l + '" action="', CKEDITOR.tools.htmlEncode(d.action), '"><label id="', b.labelId, '" for="', s, '" style="display:none">', CKEDITOR.tools.htmlEncode(d.label),
                            '</label><input style="width:100%" id="', s, '" aria-labelledby="', b.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(d.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(f > 0 ? f : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + e + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + i + ")}", "<\/script>"].join(""));
                        c.$.close();
                        for (f = 0; f < g.length; f++)g[f].enable()
                    }

                    var b =
                        this._, c = CKEDITOR.document.getById(b.frameId).getFrameDocument(), d = b.definition, g = b.buttons, e = this.formLoadedNumber, i = this.formUnloadNumber, m = b.dialog._.editor.lang.dir, l = b.dialog._.editor.langCode;
                    if (!e) {
                        e = this.formLoadedNumber = CKEDITOR.tools.addFunction(function () {
                            this.fire("formLoaded")
                        }, this);
                        i = this.formUnloadNumber = CKEDITOR.tools.addFunction(function () {
                            this.getInputElement().clearCustomData()
                        }, this);
                        this.getDialog()._.editor.on("destroy", function () {
                            CKEDITOR.tools.removeFunction(e);
                            CKEDITOR.tools.removeFunction(i)
                        })
                    }
                    CKEDITOR.env.gecko ?
                        setTimeout(a, 500) : a()
                }, getValue: function () {
                    return this.getInputElement().$.value || ""
                }, setInitValue: function () {
                    this._.initValue = ""
                }, eventProcessors: {
                    onChange: function (a, b) {
                        if (!this._.domOnChangeRegistered) {
                            this.on("formLoaded", function () {
                                this.getInputElement().on("change", function () {
                                    this.fire("change", {value: this.getValue()})
                                }, this)
                            }, this);
                            this._.domOnChangeRegistered = true
                        }
                        this.on("change", b)
                    }
                }, keyboardFocusable: true
            }, true);
            CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
            CKEDITOR.ui.dialog.fieldset.prototype =
                CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
            CKEDITOR.dialog.addUIElement("text", e);
            CKEDITOR.dialog.addUIElement("password", e);
            CKEDITOR.dialog.addUIElement("textarea", b);
            CKEDITOR.dialog.addUIElement("checkbox", b);
            CKEDITOR.dialog.addUIElement("radio", b);
            CKEDITOR.dialog.addUIElement("button", b);
            CKEDITOR.dialog.addUIElement("select", b);
            CKEDITOR.dialog.addUIElement("file", b);
            CKEDITOR.dialog.addUIElement("fileButton", b);
            CKEDITOR.dialog.addUIElement("html", b);
            CKEDITOR.dialog.addUIElement("fieldset",
                {
                    build: function (a, b, c) {
                        for (var d = b.children, g, e = [], i = [], m = 0; m < d.length && (g = d[m]); m++) {
                            var l = [];
                            e.push(l);
                            i.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a, g, l))
                        }
                        return new CKEDITOR.ui.dialog[b.type](a, i, e, c, b)
                    }
                })
        }
    }),CKEDITOR.DIALOG_RESIZE_NONE = 0,CKEDITOR.DIALOG_RESIZE_WIDTH = 1,CKEDITOR.DIALOG_RESIZE_HEIGHT = 2,CKEDITOR.DIALOG_RESIZE_BOTH = 3,function () {
        function a() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)if (this._.tabs[this._.tabIdList[c %
                a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function e() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function b(a, b) {
            for (var c = a.$.getElementsByTagName("input"), d = 0, f = c.length; d < f; d++) {
                var g = new CKEDITOR.dom.element(c[d]);
                if (g.getAttribute("type").toLowerCase() == "text")if (b) {
                    g.setAttribute("value", g.getCustomData("fake_value") ||
                        "");
                    g.removeCustomData("fake_value")
                } else {
                    g.setCustomData("fake_value", g.getAttribute("value"));
                    g.setAttribute("value", "")
                }
            }
        }

        function g(a, b) {
            var c = this.getInputElement();
            c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", true));
            a || (this.select ? this.select() : this.focus());
            b && alert(b);
            this.fire("validated", {valid: a, msg: b})
        }

        function c() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function d(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog",
                l).output({
                id: CKEDITOR.tools.getNextNumber(),
                editorId: a.id,
                langDir: a.lang.dir,
                langCode: a.langCode,
                editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
                closeTitle: a.lang.common.close,
                hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
            })), b = a.getChild([0, 0, 0, 0, 0]), c = b.getChild(0), d = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                var f = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' +
                    f + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            c.unselectable();
            d.unselectable();
            return {
                element: a,
                parts: {
                    dialog: a.getChild(0),
                    title: c,
                    close: d,
                    tabs: b.getChild(2),
                    contents: b.getChild([3, 0, 0, 0]),
                    footer: b.getChild([3, 0, 1, 0])
                }
            }
        }

        function i(a, b, c) {
            this.element = b;
            this.focusIndex = c;
            this.tabIndex = 0;
            this.isFocusable = function () {
                return !b.getAttribute("disabled") && b.isVisible()
            };
            this.focus = function () {
                a._.currentFocusIndex = this.focusIndex;
                this.element.focus()
            };
            b.on("keydown", function (a) {
                a.data.getKeystroke() in
                {32: 1, 13: 1} && this.fire("click")
            });
            b.on("focus", function () {
                this.fire("mouseover")
            });
            b.on("blur", function () {
                this.fire("mouseout")
            })
        }

        function f(a) {
            function b() {
                a.layout()
            }

            var c = CKEDITOR.document.getWindow();
            c.on("resize", b);
            a.on("hide", function () {
                c.removeListener("resize", b)
            })
        }

        function h(a, b) {
            this._ = {dialog: a};
            CKEDITOR.tools.extend(this, b)
        }

        function j(a) {
            function b(c) {
                var i = a.getSize(), j = CKEDITOR.document.getWindow().getViewPaneSize(), k = c.data.$.screenX, q = c.data.$.screenY, t = k - d.x, s = q - d.y;
                d = {x: k, y: q};
                f.x = f.x + t;
                f.y = f.y + s;
                a.move(f.x + h[3] < e ? -h[3] : f.x - h[1] > j.width - i.width - e ? j.width - i.width + (g.lang.dir == "rtl" ? 0 : h[1]) : f.x, f.y + h[0] < e ? -h[0] : f.y - h[2] > j.height - i.height - e ? j.height - i.height + h[2] : f.y, 1);
                c.data.preventDefault()
            }

            function c() {
                CKEDITOR.document.removeListener("mousemove", b);
                CKEDITOR.document.removeListener("mouseup", c);
                if (CKEDITOR.env.ie6Compat) {
                    var a = r.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b);
                    a.removeListener("mouseup", c)
                }
            }

            var d = null, f = null, g = a.getParentEditor(), e = g.config.dialog_magnetDistance,
                h = CKEDITOR.skin.margins || [0, 0, 0, 0];
            typeof e == "undefined" && (e = 20);
            a.parts.title.on("mousedown", function (g) {
                d = {x: g.data.$.screenX, y: g.data.$.screenY};
                CKEDITOR.document.on("mousemove", b);
                CKEDITOR.document.on("mouseup", c);
                f = a.getPosition();
                if (CKEDITOR.env.ie6Compat) {
                    var e = r.getChild(0).getFrameDocument();
                    e.on("mousemove", b);
                    e.on("mouseup", c)
                }
                g.data.preventDefault()
            }, a)
        }

        function k(a) {
            var b, c;

            function d(f) {
                var t = h.lang.dir == "rtl", s = q.width, m = q.height, l = s + (f.data.$.screenX - b) * (t ? -1 : 1) * (a._.moved ? 1 : 2), n =
                    m + (f.data.$.screenY - c) * (a._.moved ? 1 : 2), u = a._.element.getFirst(), u = t && u.getComputedStyle("right"), p = a.getPosition();
                p.y + n > k.height && (n = k.height - p.y);
                if ((t ? u : p.x) + l > k.width)l = k.width - (t ? u : p.x);
                if (e == CKEDITOR.DIALOG_RESIZE_WIDTH || e == CKEDITOR.DIALOG_RESIZE_BOTH)s = Math.max(g.minWidth || 0, l - i);
                if (e == CKEDITOR.DIALOG_RESIZE_HEIGHT || e == CKEDITOR.DIALOG_RESIZE_BOTH)m = Math.max(g.minHeight || 0, n - j);
                a.resize(s, m);
                a._.moved || a.layout();
                f.data.preventDefault()
            }

            function f() {
                CKEDITOR.document.removeListener("mouseup",
                    f);
                CKEDITOR.document.removeListener("mousemove", d);
                if (t) {
                    t.remove();
                    t = null
                }
                if (CKEDITOR.env.ie6Compat) {
                    var a = r.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", f);
                    a.removeListener("mousemove", d)
                }
            }

            var g = a.definition, e = g.resizable;
            if (e != CKEDITOR.DIALOG_RESIZE_NONE) {
                var h = a.getParentEditor(), i, j, k, q, t, s = CKEDITOR.tools.addFunction(function (g) {
                    q = a.getSize();
                    var e = a.parts.contents;
                    if (e.$.getElementsByTagName("iframe").length) {
                        t = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
                        e.append(t)
                    }
                    j = q.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
                    i = q.width - a.parts.contents.getSize("width", 1);
                    b = g.screenX;
                    c = g.screenY;
                    k = CKEDITOR.document.getWindow().getViewPaneSize();
                    CKEDITOR.document.on("mousemove", d);
                    CKEDITOR.document.on("mouseup", f);
                    if (CKEDITOR.env.ie6Compat) {
                        e = r.getChild(0).getFrameDocument();
                        e.on("mousemove", d);
                        e.on("mouseup", f)
                    }
                    g.preventDefault && g.preventDefault()
                });
                a.on("load", function () {
                    var b = "";
                    e == CKEDITOR.DIALOG_RESIZE_WIDTH ?
                        b = " cke_resizer_horizontal" : e == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
                    b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + h.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(h.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + s + ', event )">' + (h.lang.dir == "ltr" ? "◢" : "◣") + "</div>");
                    a.parts.footer.append(b, 1)
                });
                h.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(s)
                })
            }
        }

        function n(a) {
            a.data.preventDefault(1)
        }

        function o(a) {
            var b = CKEDITOR.document.getWindow(),
                c = a.config, d = c.dialog_backgroundCoverColor || "white", f = c.dialog_backgroundCoverOpacity, g = c.baseFloatZIndex, c = CKEDITOR.tools.genKey(d, f, g), e = v[c];
            if (e)e.show(); else {
                g = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + d : "", '" class="cke_dialog_background_cover">'];
                if (CKEDITOR.env.ie6Compat) {
                    d = "<html><body style=\\'background-color:" + d + ";\\'></body></html>";
                    g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
                    g.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + d + "' );document.close();") + "})())");
                    g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')
                }
                g.push("</div>");
                e = CKEDITOR.dom.element.createFromHtml(g.join(""));
                e.setOpacity(f !== void 0 ? f : 0.5);
                e.on("keydown", n);
                e.on("keypress", n);
                e.on("keyup", n);
                e.appendTo(CKEDITOR.document.getBody());
                v[c] = e
            }
            a.focusManager.add(e);
            r = e;
            var a = function () {
                var a = b.getViewPaneSize();
                e.setStyles({width: a.width + "px", height: a.height + "px"})
            }, h = function () {
                var a = b.getScrollPosition(), c = CKEDITOR.dialog._.currentTop;
                e.setStyles({left: a.x + "px", top: a.y + "px"});
                if (c) {
                    do {
                        a = c.getPosition();
                        c.move(a.x, a.y)
                    } while (c = c._.parentDialog)
                }
            };
            x = a;
            b.on("resize", a);
            a();
            (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && e.focus();
            if (CKEDITOR.env.ie6Compat) {
                var i = function () {
                    h();
                    arguments.callee.prevScrollHandler.apply(this, arguments)
                };
                b.$.setTimeout(function () {
                    i.prevScrollHandler =
                        window.onscroll || function () {
                        };
                    window.onscroll = i
                }, 0);
                h()
            }
        }

        function p(a) {
            if (r) {
                a.focusManager.remove(r);
                a = CKEDITOR.document.getWindow();
                r.hide();
                a.removeListener("resize", x);
                CKEDITOR.env.ie6Compat && a.$.setTimeout(function () {
                    window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
                }, 0);
                x = null
            }
        }

        var m = CKEDITOR.tools.cssLength, l = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' +
            CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function (b, f) {
            function h() {
                var a = v._.focusList;
                a.sort(function (a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, c = 0; c < b; c++)a[c].focusIndex = c
            }

            function i(a) {
                var b = v._.focusList, a = a || 0;
                if (!(b.length < 1)) {
                    var c = v._.currentFocusIndex;
                    v._.tabBarMode && a < 0 && (c = 0);
                    try {
                        b[c].getInputElement().$.blur()
                    } catch (d) {
                    }
                    var f = c, g = v._.pageCount > 1;
                    do {
                        f = f + a;
                        if (g && !v._.tabBarMode && (f == b.length || f == -1)) {
                            v._.tabBarMode = true;
                            v._.tabs[v._.currentTabId][0].focus();
                            v._.currentFocusIndex = -1;
                            return
                        }
                        f = (f + b.length) % b.length;
                        if (f == c)break
                    } while (a && !b[f].isFocusable());
                    b[f].focus();
                    b[f].type == "text" && b[f].select()
                }
            }

            function t(c) {
                if (v == CKEDITOR.dialog._.currentTop) {
                    var d = c.data.getKeystroke(), f = b.lang.dir == "rtl", g = [37, 38, 39, 40];
                    o = x = 0;
                    if (d == 9 || d == CKEDITOR.SHIFT + 9) {
                        i(d == CKEDITOR.SHIFT + 9 ? -1 : 1);
                        o = 1
                    } else if (d == CKEDITOR.ALT + 121 && !v._.tabBarMode && v.getPageCount() > 1) {
                        v._.tabBarMode = true;
                        v._.tabs[v._.currentTabId][0].focus();
                        v._.currentFocusIndex = -1;
                        o = 1
                    } else if (CKEDITOR.tools.indexOf(g,
                            d) != -1 && v._.tabBarMode) {
                        d = CKEDITOR.tools.indexOf([f ? 39 : 37, 38], d) != -1 ? a.call(v) : e.call(v);
                        v.selectPage(d);
                        v._.tabs[d][0].focus();
                        o = 1
                    } else if ((d == 13 || d == 32) && v._.tabBarMode) {
                        this.selectPage(this._.currentTabId);
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        i(1);
                        o = 1
                    } else if (d == 13) {
                        d = c.data.getTarget();
                        if (!d.is("a", "button", "select", "textarea") && (!d.is("input") || d.$.type != "button")) {
                            (d = this.getButton("ok")) && CKEDITOR.tools.setTimeout(d.click, 0, d);
                            o = 1
                        }
                        x = 1
                    } else if (d == 27) {
                        (d = this.getButton("cancel")) ?
                            CKEDITOR.tools.setTimeout(d.click, 0, d) : this.fire("cancel", {hide: true}).hide !== false && this.hide();
                        x = 1
                    } else return;
                    s(c)
                }
            }

            function s(a) {
                o ? a.data.preventDefault(1) : x && a.data.stopPropagation()
            }

            var m = CKEDITOR.dialog._.dialogDefinitions[f], l = CKEDITOR.tools.clone(q), n = b.config.dialog_buttonsOrder || "OS", u = b.lang.dir, p = {}, o, x;
            (n == "OS" && CKEDITOR.env.mac || n == "rtl" && u == "ltr" || n == "ltr" && u == "rtl") && l.buttons.reverse();
            m = CKEDITOR.tools.extend(m(b), l);
            m = CKEDITOR.tools.clone(m);
            m = new w(this, m);
            l = d(b);
            this._ = {
                editor: b,
                element: l.element,
                name: f,
                contentSize: {width: 0, height: 0},
                size: {width: 0, height: 0},
                contents: {},
                buttons: {},
                accessKeyMap: {},
                tabs: {},
                tabIdList: [],
                currentTabId: null,
                currentTabIndex: null,
                pageCount: 0,
                lastTab: null,
                tabBarMode: false,
                focusList: [],
                currentFocusIndex: 0,
                hasFocus: false
            };
            this.parts = l.parts;
            CKEDITOR.tools.setTimeout(function () {
                b.fire("ariaWidget", this.parts.contents)
            }, 0, this);
            l = {
                position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
                top: 0,
                visibility: "hidden"
            };
            l[u == "rtl" ? "right" : "left"] = 0;
            this.parts.dialog.setStyles(l);
            CKEDITOR.event.call(this);
            this.definition = m = CKEDITOR.fire("dialogDefinition", {
                name: f,
                definition: m
            }, b).definition;
            if (!("removeDialogTabs" in b._) && b.config.removeDialogTabs) {
                l = b.config.removeDialogTabs.split(";");
                for (u = 0; u < l.length; u++) {
                    n = l[u].split(":");
                    if (n.length == 2) {
                        var r = n[0];
                        p[r] || (p[r] = []);
                        p[r].push(n[1])
                    }
                }
                b._.removeDialogTabs = p
            }
            if (b._.removeDialogTabs && (p = b._.removeDialogTabs[f]))for (u = 0; u < p.length; u++)m.removeContents(p[u]);
            if (m.onLoad)this.on("load", m.onLoad);
            if (m.onShow)this.on("show", m.onShow);
            if (m.onHide)this.on("hide", m.onHide);
            if (m.onOk)this.on("ok", function (a) {
                b.fire("saveSnapshot");
                setTimeout(function () {
                    b.fire("saveSnapshot")
                }, 0);
                if (m.onOk.call(this, a) === false)a.data.hide = false
            });
            if (m.onCancel)this.on("cancel", function (a) {
                if (m.onCancel.call(this, a) === false)a.data.hide = false
            });
            var v = this, z = function (a) {
                var b = v._.contents, c = false, d;
                for (d in b)for (var f in b[d])if (c = a.call(this, b[d][f]))return
            };
            this.on("ok", function (a) {
                z(function (b) {
                    if (b.validate) {
                        var c = b.validate(this), d = typeof c == "string" ||
                            c === false;
                        if (d) {
                            a.data.hide = false;
                            a.stop()
                        }
                        g.call(b, !d, typeof c == "string" ? c : void 0);
                        return d
                    }
                })
            }, this, null, 0);
            this.on("cancel", function (a) {
                z(function (c) {
                    if (c.isChanged()) {
                        if (!b.config.dialog_noConfirmCancel && !confirm(b.lang.common.confirmCancel))a.data.hide = false;
                        return true
                    }
                })
            }, this, null, 0);
            this.parts.close.on("click", function (a) {
                this.fire("cancel", {hide: true}).hide !== false && this.hide();
                a.data.preventDefault()
            }, this);
            this.changeFocus = i;
            var y = this._.element;
            b.focusManager.add(y, 1);
            this.on("show",
                function () {
                    y.on("keydown", t, this);
                    if (CKEDITOR.env.gecko)y.on("keypress", s, this)
                });
            this.on("hide", function () {
                y.removeListener("keydown", t);
                CKEDITOR.env.gecko && y.removeListener("keypress", s);
                z(function (a) {
                    c.apply(a)
                })
            });
            this.on("iframeAdded", function (a) {
                (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", t, this, null, 0)
            });
            this.on("show", function () {
                h();
                var a = v._.pageCount > 1;
                if (b.config.dialog_startupFocusTab && a) {
                    v._.tabBarMode = true;
                    v._.tabs[v._.currentTabId][0].focus();
                    v._.currentFocusIndex = -1
                } else if (!this._.hasFocus) {
                    this._.currentFocusIndex = a ? -1 : this._.focusList.length - 1;
                    if (m.onFocus)(a = m.onFocus.call(this)) && a.focus(); else i(1)
                }
            }, this, null, 4294967295);
            if (CKEDITOR.env.ie6Compat)this.on("load", function () {
                var a = this.getElement(), b = a.getFirst();
                b.remove();
                b.appendTo(a)
            }, this);
            j(this);
            k(this);
            (new CKEDITOR.dom.text(m.title, CKEDITOR.document)).appendTo(this.parts.title);
            for (u = 0; u < m.contents.length; u++)(p = m.contents[u]) && this.addPage(p);
            this.parts.tabs.on("click", function (a) {
                var b = a.data.getTarget();
                if (b.hasClass("cke_dialog_tab")) {
                    b = b.$.id;
                    this.selectPage(b.substring(4, b.lastIndexOf("_")));
                    if (this._.tabBarMode) {
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        i(1)
                    }
                    a.data.preventDefault()
                }
            }, this);
            u = [];
            p = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
                type: "hbox",
                className: "cke_dialog_footer_buttons",
                widths: [],
                children: m.buttons
            }, u).getChild();
            this.parts.footer.setHtml(u.join(""));
            for (u = 0; u < p.length; u++)this._.buttons[p[u].id] = p[u]
        };
        CKEDITOR.dialog.prototype = {
            destroy: function () {
                this.hide();
                this._.element.remove()
            }, resize: function () {
                return function (a, b) {
                    if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) {
                        CKEDITOR.dialog.fire("resize", {
                            dialog: this,
                            width: a,
                            height: b
                        }, this._.editor);
                        this.fire("resize", {
                            width: a,
                            height: b
                        }, this._.editor);
                        this.parts.contents.setStyles({
                            width: a + "px",
                            height: b + "px"
                        });
                        if (this._.editor.lang.dir == "rtl" && this._.position)this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"),
                                10);
                        this._.contentSize = {width: a, height: b}
                    }
                }
            }(), getSize: function () {
                var a = this._.element.getFirst();
                return {
                    width: a.$.offsetWidth || 0,
                    height: a.$.offsetHeight || 0
                }
            }, move: function (a, b, c) {
                var d = this._.element.getFirst(), f = this._.editor.lang.dir == "rtl", g = d.getComputedStyle("position") == "fixed";
                CKEDITOR.env.ie && d.setStyle("zoom", "100%");
                if (!g || !this._.position || !(this._.position.x == a && this._.position.y == b)) {
                    this._.position = {x: a, y: b};
                    if (!g) {
                        g = CKEDITOR.document.getWindow().getScrollPosition();
                        a = a + g.x;
                        b = b + g.y
                    }
                    if (f) {
                        g =
                            this.getSize();
                        a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a
                    }
                    b = {top: (b > 0 ? b : 0) + "px"};
                    b[f ? "right" : "left"] = (a > 0 ? a : 0) + "px";
                    d.setStyles(b);
                    c && (this._.moved = 1)
                }
            }, getPosition: function () {
                return CKEDITOR.tools.extend({}, this._.position)
            }, show: function () {
                var a = this._.element, b = this.definition;
                !a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) : a.setStyle("display", "block");
                this.resize(this._.contentSize && this._.contentSize.width || b.width ||
                    b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
                this.reset();
                this.selectPage(this.definition.contents[0].id);
                if (CKEDITOR.dialog._.currentZIndex === null)CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
                this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
                if (CKEDITOR.dialog._.currentTop === null) {
                    CKEDITOR.dialog._.currentTop = this;
                    this._.parentDialog = null;
                    o(this._.editor)
                } else {
                    this._.parentDialog =
                        CKEDITOR.dialog._.currentTop;
                    this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
                    CKEDITOR.dialog._.currentTop = this
                }
                a.on("keydown", z);
                a.on("keyup", B);
                this._.hasFocus = false;
                for (var c in b.contents)if (b.contents[c]) {
                    var a = b.contents[c], d = this._.tabs[a.id], g = a.requiredContent, e = 0;
                    if (d) {
                        for (var h in this._.contents[a.id]) {
                            var i = this._.contents[a.id][h];
                            if (!(i.type == "hbox" || i.type == "vbox" || !i.getInputElement()))if (i.requiredContent && !this._.editor.activeFilter.check(i.requiredContent))i.disable();
                            else {
                                i.enable();
                                e++
                            }
                        }
                        !e || g && !this._.editor.activeFilter.check(g) ? d[0].addClass("cke_dialog_tab_disabled") : d[0].removeClass("cke_dialog_tab_disabled")
                    }
                }
                CKEDITOR.tools.setTimeout(function () {
                    this.layout();
                    f(this);
                    this.parts.dialog.setStyle("visibility", "");
                    this.fireOnce("load", {});
                    CKEDITOR.ui.fire("ready", this);
                    this.fire("show", {});
                    this._.editor.fire("dialogShow", this);
                    this._.parentDialog || this._.editor.focusManager.lock();
                    this.foreach(function (a) {
                        a.setInitValue && a.setInitValue()
                    })
                }, 100, this)
            }, layout: function () {
                var a =
                    this.parts.dialog, b = this.getSize(), c = CKEDITOR.document.getWindow().getViewPaneSize(), d = (c.width - b.width) / 2, f = (c.height - b.height) / 2;
                CKEDITOR.env.ie6Compat || (b.height + (f > 0 ? f : 0) > c.height || b.width + (d > 0 ? d : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
                this.move(this._.moved ? this._.position.x : d, this._.moved ? this._.position.y : f)
            }, foreach: function (a) {
                for (var b in this._.contents)for (var c in this._.contents[b])a.call(this, this._.contents[b][c]);
                return this
            }, reset: function () {
                var a =
                    function (a) {
                        a.reset && a.reset(1)
                    };
                return function () {
                    this.foreach(a);
                    return this
                }
            }(), setupContent: function () {
                var a = arguments;
                this.foreach(function (b) {
                    b.setup && b.setup.apply(b, a)
                })
            }, commitContent: function () {
                var a = arguments;
                this.foreach(function (b) {
                    CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
                    b.commit && b.commit.apply(b, a)
                })
            }, hide: function () {
                if (this.parts.dialog.isVisible()) {
                    this.fire("hide", {});
                    this._.editor.fire("dialogHide", this);
                    this.selectPage(this._.tabIdList[0]);
                    var a = this._.element;
                    a.setStyle("display", "none");
                    this.parts.dialog.setStyle("visibility", "hidden");
                    for (G(this); CKEDITOR.dialog._.currentTop != this;)CKEDITOR.dialog._.currentTop.hide();
                    if (this._.parentDialog) {
                        var b = this._.parentDialog.getElement().getFirst();
                        b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                    } else p(this._.editor);
                    if (CKEDITOR.dialog._.currentTop = this._.parentDialog)CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10;
                    else {
                        CKEDITOR.dialog._.currentZIndex = null;
                        a.removeListener("keydown", z);
                        a.removeListener("keyup", B);
                        var c = this._.editor;
                        c.focus();
                        setTimeout(function () {
                            c.focusManager.unlock();
                            CKEDITOR.env.iOS && c.window.focus()
                        }, 0)
                    }
                    delete this._.parentDialog;
                    this.foreach(function (a) {
                        a.resetInitValue && a.resetInitValue()
                    })
                }
            }, addPage: function (a) {
                if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
                    for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", d = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this,
                        {
                            type: "vbox",
                            className: "cke_dialog_page_contents",
                            children: a.elements,
                            expand: !!a.expand,
                            padding: a.padding,
                            style: a.style || "width: 100%;"
                        }, b), f = this._.contents[a.id] = {}, g = d.getChild(), e = 0; d = g.shift();) {
                        !d.notAllowed && (d.type != "hbox" && d.type != "vbox") && e++;
                        f[d.id] = d;
                        typeof d.getChild == "function" && g.push.apply(g, d.getChild())
                    }
                    if (!e)a.hidden = true;
                    b = CKEDITOR.dom.element.createFromHtml(b.join(""));
                    b.setAttribute("role", "tabpanel");
                    d = CKEDITOR.env;
                    f = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
                    c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"',
                        this._.pageCount > 0 ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', f, '"', d.gecko && !d.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
                    b.setAttribute("aria-labelledby", f);
                    this._.tabs[a.id] = [c, b];
                    this._.tabIdList.push(a.id);
                    !a.hidden && this._.pageCount++;
                    this._.lastTab = c;
                    this.updateStyle();
                    b.setAttribute("name", a.id);
                    b.appendTo(this.parts.contents);
                    c.unselectable();
                    this.parts.tabs.append(c);
                    if (a.accessKey) {
                        A(this, this, "CTRL+" +
                            a.accessKey, J, D);
                        this._.accessKeyMap["CTRL+" + a.accessKey] = a.id
                    }
                }
            }, selectPage: function (a) {
                if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {
                        page: a,
                        currentPage: this._.currentTabId
                    }) !== false) {
                    for (var c in this._.tabs) {
                        var d = this._.tabs[c][0], f = this._.tabs[c][1];
                        if (c != a) {
                            d.removeClass("cke_dialog_tab_selected");
                            f.hide()
                        }
                        f.setAttribute("aria-hidden", c != a)
                    }
                    var g = this._.tabs[a];
                    g[0].addClass("cke_dialog_tab_selected");
                    if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
                        b(g[1]);
                        g[1].show();
                        setTimeout(function () {
                            b(g[1], 1)
                        }, 0)
                    } else g[1].show();
                    this._.currentTabId = a;
                    this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
                }
            }, updateStyle: function () {
                this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page")
            }, hidePage: function (b) {
                var c = this._.tabs[b] && this._.tabs[b][0];
                if (c && this._.pageCount != 1 && c.isVisible()) {
                    b == this._.currentTabId && this.selectPage(a.call(this));
                    c.hide();
                    this._.pageCount--;
                    this.updateStyle()
                }
            }, showPage: function (a) {
                if (a = this._.tabs[a] &&
                        this._.tabs[a][0]) {
                    a.show();
                    this._.pageCount++;
                    this.updateStyle()
                }
            }, getElement: function () {
                return this._.element
            }, getName: function () {
                return this._.name
            }, getContentElement: function (a, b) {
                var c = this._.contents[a];
                return c && c[b]
            }, getValueOf: function (a, b) {
                return this.getContentElement(a, b).getValue()
            }, setValueOf: function (a, b, c) {
                return this.getContentElement(a, b).setValue(c)
            }, getButton: function (a) {
                return this._.buttons[a]
            }, click: function (a) {
                return this._.buttons[a].click()
            }, disableButton: function (a) {
                return this._.buttons[a].disable()
            },
            enableButton: function (a) {
                return this._.buttons[a].enable()
            }, getPageCount: function () {
                return this._.pageCount
            }, getParentEditor: function () {
                return this._.editor
            }, getSelectedElement: function () {
                return this.getParentEditor().getSelection().getSelectedElement()
            }, addFocusable: function (a, b) {
                if (typeof b == "undefined") {
                    b = this._.focusList.length;
                    this._.focusList.push(new i(this, a, b))
                } else {
                    this._.focusList.splice(b, 0, new i(this, a, b));
                    for (var c = b + 1; c < this._.focusList.length; c++)this._.focusList[c].focusIndex++
                }
            }
        };
        CKEDITOR.tools.extend(CKEDITOR.dialog, {
            add: function (a, b) {
                if (!this._.dialogDefinitions[a] || typeof b == "function")this._.dialogDefinitions[a] = b
            }, exists: function (a) {
                return !!this._.dialogDefinitions[a]
            }, getCurrent: function () {
                return CKEDITOR.dialog._.currentTop
            }, isTabEnabled: function (a, b, c) {
                a = a.config.removeDialogTabs;
                return !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
            }, okButton: function () {
                var a = function (a, b) {
                    b = b || {};
                    return CKEDITOR.tools.extend({
                        id: "ok",
                        type: "button",
                        label: a.lang.common.ok,
                        "class": "cke_dialog_ui_button_ok",
                        onClick: function (a) {
                            a = a.data.dialog;
                            a.fire("ok", {hide: true}).hide !== false && a.hide()
                        }
                    }, b, true)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, true)
                };
                return a
            }(), cancelButton: function () {
                var a = function (a, b) {
                    b = b || {};
                    return CKEDITOR.tools.extend({
                        id: "cancel",
                        type: "button",
                        label: a.lang.common.cancel,
                        "class": "cke_dialog_ui_button_cancel",
                        onClick: function (a) {
                            a = a.data.dialog;
                            a.fire("cancel", {hide: true}).hide !== false && a.hide()
                        }
                    }, b, true)
                };
                a.type =
                    "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, true)
                };
                return a
            }(), addUIElement: function (a, b) {
                this._.uiElementBuilders[a] = b
            }
        });
        CKEDITOR.dialog._ = {
            uiElementBuilders: {},
            dialogDefinitions: {},
            currentTop: null,
            currentZIndex: null
        };
        CKEDITOR.event.implementOn(CKEDITOR.dialog);
        CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var q = {
                resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
                minWidth: 600,
                minHeight: 400,
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
            },
            s = function (a, b, c) {
                for (var d = 0, f; f = a[d]; d++) {
                    if (f.id == b)return f;
                    if (c && f[c])if (f = s(f[c], b, c))return f
                }
                return null
            }, t = function (a, b, c, d, f) {
                if (c) {
                    for (var g = 0, e; e = a[g]; g++) {
                        if (e.id == c) {
                            a.splice(g, 0, b);
                            return b
                        }
                        if (d && e[d])if (e = t(e[d], b, c, d, true))return e
                    }
                    if (f)return null
                }
                a.push(b);
                return b
            }, u = function (a, b, c) {
                for (var d = 0, f; f = a[d]; d++) {
                    if (f.id == b)return a.splice(d, 1);
                    if (c && f[c])if (f = u(f[c], b, c))return f
                }
                return null
            }, w = function (a, b) {
                this.dialog = a;
                for (var c = b.contents, d = 0, f; f = c[d]; d++)c[d] = f && new h(a, f);
                CKEDITOR.tools.extend(this,
                    b)
            };
        w.prototype = {
            getContents: function (a) {
                return s(this.contents, a)
            }, getButton: function (a) {
                return s(this.buttons, a)
            }, addContents: function (a, b) {
                return t(this.contents, a, b)
            }, addButton: function (a, b) {
                return t(this.buttons, a, b)
            }, removeContents: function (a) {
                u(this.contents, a)
            }, removeButton: function (a) {
                u(this.buttons, a)
            }
        };
        h.prototype = {
            get: function (a) {
                return s(this.elements, a, "children")
            }, add: function (a, b) {
                return t(this.elements, a, b, "children")
            }, remove: function (a) {
                u(this.elements, a, "children")
            }
        };
        var x, v = {},
            r, y = {}, z = function (a) {
                var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, d = a.data.$.shiftKey, f = String.fromCharCode(a.data.$.keyCode);
                if ((b = y[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + f]) && b.length) {
                    b = b[b.length - 1];
                    b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key);
                    a.data.preventDefault()
                }
            }, B = function (a) {
                var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, d = a.data.$.shiftKey, f = String.fromCharCode(a.data.$.keyCode);
                if ((b = y[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + f]) && b.length) {
                    b =
                        b[b.length - 1];
                    if (b.keyup) {
                        b.keyup.call(b.uiElement, b.dialog, b.key);
                        a.data.preventDefault()
                    }
                }
            }, A = function (a, b, c, d, f) {
                (y[c] || (y[c] = [])).push({
                    uiElement: a,
                    dialog: b,
                    key: c,
                    keyup: f || a.accessKeyUp,
                    keydown: d || a.accessKeyDown
                })
            }, G = function (a) {
                for (var b in y) {
                    for (var c = y[b], d = c.length - 1; d >= 0; d--)(c[d].dialog == a || c[d].uiElement == a) && c.splice(d, 1);
                    c.length === 0 && delete y[b]
                }
            }, D = function (a, b) {
                a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
            }, J = function () {
            };
        (function () {
            CKEDITOR.ui.dialog = {
                uiElement: function (a,
                                     b, c, d, f, g, e) {
                    if (!(arguments.length < 4)) {
                        var h = (d.call ? d(b) : d) || "div", i = ["<", h, " "], j = (f && f.call ? f(b) : f) || {}, k = (g && g.call ? g(b) : g) || {}, q = (e && e.call ? e.call(this, a, b) : e) || "", t = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
                        if (b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent)) {
                            j.display = "none";
                            this.notAllowed = true
                        }
                        k.id = t;
                        var s = {};
                        b.type && (s["cke_dialog_ui_" + b.type] = 1);
                        b.className && (s[b.className] = 1);
                        if (b.disabled)s.cke_disabled = 1;
                        for (var m = k["class"] && k["class"].split ? k["class"].split(" ") :
                            [], t = 0; t < m.length; t++)m[t] && (s[m[t]] = 1);
                        m = [];
                        for (t in s)m.push(t);
                        k["class"] = m.join(" ");
                        if (b.title)k.title = b.title;
                        s = (b.style || "").split(";");
                        if (b.align) {
                            m = b.align;
                            j["margin-left"] = m == "left" ? 0 : "auto";
                            j["margin-right"] = m == "right" ? 0 : "auto"
                        }
                        for (t in j)s.push(t + ":" + j[t]);
                        b.hidden && s.push("display:none");
                        for (t = s.length - 1; t >= 0; t--)s[t] === "" && s.splice(t, 1);
                        if (s.length > 0)k.style = (k.style ? k.style + "; " : "") + s.join("; ");
                        for (t in k)i.push(t + '="' + CKEDITOR.tools.htmlEncode(k[t]) + '" ');
                        i.push(">", q, "</", h, ">");
                        c.push(i.join(""));
                        (this._ || (this._ = {})).dialog = a;
                        if (typeof b.isChanged == "boolean")this.isChanged = function () {
                            return b.isChanged
                        };
                        if (typeof b.isChanged == "function")this.isChanged = b.isChanged;
                        if (typeof b.setValue == "function")this.setValue = CKEDITOR.tools.override(this.setValue, function (a) {
                            return function (c) {
                                a.call(this, b.setValue.call(this, c))
                            }
                        });
                        if (typeof b.getValue == "function")this.getValue = CKEDITOR.tools.override(this.getValue, function (a) {
                            return function () {
                                return b.getValue.call(this, a.call(this))
                            }
                        });
                        CKEDITOR.event.implementOn(this);
                        this.registerEvents(b);
                        this.accessKeyUp && (this.accessKeyDown && b.accessKey) && A(this, a, "CTRL+" + b.accessKey);
                        var l = this;
                        a.on("load", function () {
                            var b = l.getInputElement();
                            if (b) {
                                var c = l.type in {
                                    checkbox: 1,
                                    ratio: 1
                                } && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                                b.on("focus", function () {
                                    a._.tabBarMode = false;
                                    a._.hasFocus = true;
                                    l.fire("focus");
                                    c && this.addClass(c)
                                });
                                b.on("blur", function () {
                                    l.fire("blur");
                                    c && this.removeClass(c)
                                })
                            }
                        });
                        CKEDITOR.tools.extend(this,
                            b);
                        if (this.keyboardFocusable) {
                            this.tabIndex = b.tabIndex || 0;
                            this.focusIndex = a._.focusList.push(this) - 1;
                            this.on("focus", function () {
                                a._.currentFocusIndex = l.focusIndex
                            })
                        }
                    }
                }, hbox: function (a, b, c, d, f) {
                    if (!(arguments.length < 4)) {
                        this._ || (this._ = {});
                        var g = this._.children = b, e = f && f.widths || null, h = f && f.height || null, i, j = {role: "presentation"};
                        f && f.align && (j.align = f.align);
                        CKEDITOR.ui.dialog.uiElement.call(this, a, f || {type: "hbox"}, d, "table", {}, j, function () {
                            var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                            for (i = 0; i <
                            c.length; i++) {
                                var b = "cke_dialog_ui_hbox_child", d = [];
                                i === 0 && (b = "cke_dialog_ui_hbox_first");
                                i == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
                                a.push('<td class="', b, '" role="presentation" ');
                                e ? e[i] && d.push("width:" + m(e[i])) : d.push("width:" + Math.floor(100 / c.length) + "%");
                                h && d.push("height:" + m(h));
                                f && f.padding !== void 0 && d.push("padding:" + m(f.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[i].align) && d.push("text-align:" + g[i].align);
                                d.length > 0 && a.push('style="' + d.join("; ") + '" ');
                                a.push(">", c[i], "</td>")
                            }
                            a.push("</tr></tbody>");
                            return a.join("")
                        })
                    }
                }, vbox: function (a, b, c, d, f) {
                    if (!(arguments.length < 3)) {
                        this._ || (this._ = {});
                        var g = this._.children = b, e = f && f.width || null, h = f && f.heights || null;
                        CKEDITOR.ui.dialog.uiElement.call(this, a, f || {type: "vbox"}, d, "div", null, {role: "presentation"}, function () {
                            var b = ['<table role="presentation" cellspacing="0" border="0" '];
                            b.push('style="');
                            f && f.expand && b.push("height:100%;");
                            b.push("width:" + m(e || "100%"), ";");
                            CKEDITOR.env.webkit && b.push("float:none;");
                            b.push('"');
                            b.push('align="', CKEDITOR.tools.htmlEncode(f &&
                                f.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
                            b.push("><tbody>");
                            for (var d = 0; d < c.length; d++) {
                                var i = [];
                                b.push('<tr><td role="presentation" ');
                                e && i.push("width:" + m(e || "100%"));
                                h ? i.push("height:" + m(h[d])) : f && f.expand && i.push("height:" + Math.floor(100 / c.length) + "%");
                                f && f.padding !== void 0 && i.push("padding:" + m(f.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[d].align) && i.push("text-align:" + g[d].align);
                                i.length > 0 && b.push('style="', i.join("; "), '" ');
                                b.push(' class="cke_dialog_ui_vbox_child">',
                                    c[d], "</td></tr>")
                            }
                            b.push("</tbody></table>");
                            return b.join("")
                        })
                    }
                }
            }
        })();
        CKEDITOR.ui.dialog.uiElement.prototype = {
            getElement: function () {
                return CKEDITOR.document.getById(this.domId)
            }, getInputElement: function () {
                return this.getElement()
            }, getDialog: function () {
                return this._.dialog
            }, setValue: function (a, b) {
                this.getInputElement().setValue(a);
                !b && this.fire("change", {value: a});
                return this
            }, getValue: function () {
                return this.getInputElement().getValue()
            }, isChanged: function () {
                return false
            }, selectParentTab: function () {
                for (var a =
                    this.getInputElement(); (a = a.getParent()) && a.$.className.search("cke_dialog_page_contents") == -1;);
                if (!a)return this;
                a = a.getAttribute("name");
                this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
                return this
            }, focus: function () {
                this.selectParentTab().getInputElement().focus();
                return this
            }, registerEvents: function (a) {
                var b = /^on([A-Z]\w+)/, c, d = function (a, b, c, d) {
                    b.on("load", function () {
                        a.getInputElement().on(c, d, a)
                    })
                }, f;
                for (f in a)if (c = f.match(b))this.eventProcessors[f] ? this.eventProcessors[f].call(this,
                    this._.dialog, a[f]) : d(this, this._.dialog, c[1].toLowerCase(), a[f]);
                return this
            }, eventProcessors: {
                onLoad: function (a, b) {
                    a.on("load", b, this)
                }, onShow: function (a, b) {
                    a.on("show", b, this)
                }, onHide: function (a, b) {
                    a.on("hide", b, this)
                }
            }, accessKeyDown: function () {
                this.focus()
            }, accessKeyUp: function () {
            }, disable: function () {
                var a = this.getElement();
                this.getInputElement().setAttribute("disabled", "true");
                a.addClass("cke_disabled")
            }, enable: function () {
                var a = this.getElement();
                this.getInputElement().removeAttribute("disabled");
                a.removeClass("cke_disabled")
            }, isEnabled: function () {
                return !this.getElement().hasClass("cke_disabled")
            }, isVisible: function () {
                return this.getInputElement().isVisible()
            }, isFocusable: function () {
                return !this.isEnabled() || !this.isVisible() ? false : true
            }
        };
        CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
            getChild: function (a) {
                if (arguments.length < 1)return this._.children.concat();
                a.splice || (a = [a]);
                return a.length < 2 ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ?
                    this._.children[a[0]].getChild(a.slice(1, a.length)) : null
            }
        }, true);
        CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
        (function () {
            var a = {
                build: function (a, b, c) {
                    for (var d = b.children, f, g = [], e = [], h = 0; h < d.length && (f = d[h]); h++) {
                        var i = [];
                        g.push(i);
                        e.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, i))
                    }
                    return new CKEDITOR.ui.dialog[b.type](a, e, g, c, b)
                }
            };
            CKEDITOR.dialog.addUIElement("hbox", a);
            CKEDITOR.dialog.addUIElement("vbox", a)
        })();
        CKEDITOR.dialogCommand = function (a, b) {
            this.dialogName =
                a;
            CKEDITOR.tools.extend(this, b, true)
        };
        CKEDITOR.dialogCommand.prototype = {
            exec: function (a) {
                a.openDialog(this.dialogName)
            }, canUndo: false, editorFocus: 1
        };
        (function () {
            var a = /^([a]|[^a])+$/, b = /^\d*$/, c = /^\d*(?:\.\d+)?$/, d = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/, f = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i, g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
            CKEDITOR.VALIDATE_OR = 1;
            CKEDITOR.VALIDATE_AND = 2;
            CKEDITOR.dialog.validate = {
                functions: function () {
                    var a = arguments;
                    return function () {
                        var b = this && this.getValue ?
                            this.getValue() : a[0], c, d = CKEDITOR.VALIDATE_AND, f = [], g;
                        for (g = 0; g < a.length; g++)if (typeof a[g] == "function")f.push(a[g]); else break;
                        if (g < a.length && typeof a[g] == "string") {
                            c = a[g];
                            g++
                        }
                        g < a.length && typeof a[g] == "number" && (d = a[g]);
                        var e = d == CKEDITOR.VALIDATE_AND ? true : false;
                        for (g = 0; g < f.length; g++)e = d == CKEDITOR.VALIDATE_AND ? e && f[g](b) : e || f[g](b);
                        return !e ? c : true
                    }
                }, regex: function (a, b) {
                    return function (c) {
                        c = this && this.getValue ? this.getValue() : c;
                        return !a.test(c) ? b : true
                    }
                }, notEmpty: function (b) {
                    return this.regex(a, b)
                },
                integer: function (a) {
                    return this.regex(b, a)
                }, number: function (a) {
                    return this.regex(c, a)
                }, cssLength: function (a) {
                    return this.functions(function (a) {
                        return f.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, htmlLength: function (a) {
                    return this.functions(function (a) {
                        return d.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, inlineStyle: function (a) {
                    return this.functions(function (a) {
                        return g.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, equals: function (a, b) {
                    return this.functions(function (b) {
                        return b == a
                    }, b)
                }, notEqual: function (a, b) {
                    return this.functions(function (b) {
                        return b !=
                            a
                    }, b)
                }
            };
            CKEDITOR.on("instanceDestroyed", function (a) {
                if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                    for (var b; b = CKEDITOR.dialog._.currentTop;)b.hide();
                    for (var c in v)v[c].remove();
                    v = {}
                }
                var a = a.editor._.storedDialogs, d;
                for (d in a)a[d].destroy()
            })
        })();
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            openDialog: function (a, b) {
                var c = null, d = CKEDITOR.dialog._.dialogDefinitions[a];
                CKEDITOR.dialog._.currentTop === null && o(this);
                if (typeof d == "function") {
                    c = this._.storedDialogs || (this._.storedDialogs = {});
                    c = c[a] ||
                        (c[a] = new CKEDITOR.dialog(this, a));
                    b && b.call(c, c);
                    c.show()
                } else {
                    if (d == "failed") {
                        p(this);
                        throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                    }
                    typeof d == "string" && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d), function () {
                        typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function" && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
                        this.openDialog(a, b)
                    }, this, 0, 1)
                }
                CKEDITOR.skin.loadPart("dialog");
                return c
            }
        })
    }(),CKEDITOR.plugins.add("dialog", {
        requires: "dialogui", init: function (a) {
            a.on("doubleclick",
                function (e) {
                    e.data.dialog && a.openDialog(e.data.dialog)
                }, null, null, 999)
        }
    }),function () {
        CKEDITOR.plugins.add("a11yhelp", {
            requires: "dialog",
            availableLangs: {
                af: 1,
                ar: 1,
                bg: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                en: 1,
                "en-gb": 1,
                eo: 1,
                es: 1,
                et: 1,
                fa: 1,
                fi: 1,
                fr: 1,
                "fr-ca": 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                it: 1,
                ja: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                pt: 1,
                "pt-br": 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                sr: 1,
                "sr-latn": 1,
                sv: 1,
                th: 1,
                tr: 1,
                tt: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                zh: 1,
                "zh-cn": 1
            },
            init: function (a) {
                var e = this;
                a.addCommand("a11yHelp",
                    {
                        exec: function () {
                            var b = a.langCode, b = e.availableLangs[b] ? b : e.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
                            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e.path + "dialogs/lang/" + b + ".js"), function () {
                                a.lang.a11yhelp = e.langEntries[b];
                                a.openDialog("a11yHelp")
                            })
                        },
                        modes: {wysiwyg: 1, source: 1},
                        readOnly: 1,
                        canUndo: false
                    });
                a.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
                CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js");
                a.on("ariaEditorHelpLabel", function (b) {
                    b.data.label = a.lang.common.editorHelp
                })
            }
        })
    }(),
    CKEDITOR.plugins.add("about", {
        requires: "dialog", init: function (a) {
            var e = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
            e.modes = {wysiwyg: 1, source: 1};
            e.canUndo = false;
            e.readOnly = 1;
            a.ui.addButton && a.ui.addButton("About", {
                label: a.lang.about.title,
                command: "about",
                toolbar: "about"
            });
            CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
        }
    }),CKEDITOR.plugins.add("basicstyles", {
        init: function (a) {
            var e = 0, b = function (b, c, d, j) {
                if (j) {
                    var j = new CKEDITOR.style(j), k = g[d];
                    k.unshift(j);
                    a.attachStyleStateChange(j,
                        function (b) {
                            !a.readOnly && a.getCommand(d).setState(b)
                        });
                    a.addCommand(d, new CKEDITOR.styleCommand(j, {contentForms: k}));
                    a.ui.addButton && a.ui.addButton(b, {
                        label: c,
                        command: d,
                        toolbar: "basicstyles," + (e = e + 10)
                    })
                }
            }, g = {
                bold: ["strong", "b", ["span", function (a) {
                    a = a.styles["font-weight"];
                    return a == "bold" || +a >= 700
                }]], italic: ["em", "i", ["span", function (a) {
                    return a.styles["font-style"] == "italic"
                }]], underline: ["u", ["span", function (a) {
                    return a.styles["text-decoration"] == "underline"
                }]], strike: ["s", "strike", ["span", function (a) {
                    return a.styles["text-decoration"] ==
                        "line-through"
                }]], subscript: ["sub"], superscript: ["sup"]
            }, c = a.config, d = a.lang.basicstyles;
            b("Bold", d.bold, "bold", c.coreStyles_bold);
            b("Italic", d.italic, "italic", c.coreStyles_italic);
            b("Underline", d.underline, "underline", c.coreStyles_underline);
            b("Strike", d.strike, "strike", c.coreStyles_strike);
            b("Subscript", d.subscript, "subscript", c.coreStyles_subscript);
            b("Superscript", d.superscript, "superscript", c.coreStyles_superscript);
            a.setKeystroke([[CKEDITOR.CTRL + 66, "bold"], [CKEDITOR.CTRL + 73, "italic"], [CKEDITOR.CTRL +
            85, "underline"]])
        }
    }),CKEDITOR.config.coreStyles_bold = {
        element: "strong",
        overrides: "b"
    },CKEDITOR.config.coreStyles_italic = {
        element: "em",
        overrides: "i"
    },CKEDITOR.config.coreStyles_underline = {element: "u"},CKEDITOR.config.coreStyles_strike = {
        element: "s",
        overrides: "strike"
    },CKEDITOR.config.coreStyles_subscript = {element: "sub"},CKEDITOR.config.coreStyles_superscript = {element: "sup"},function () {
        var a = {
            exec: function (a) {
                var b = a.getCommand("blockquote").state, g = a.getSelection(), c = g && g.getRanges()[0];
                if (c) {
                    var d =
                        g.createBookmarks();
                    if (CKEDITOR.env.ie) {
                        var i = d[0].startNode, f = d[0].endNode, h;
                        if (i && i.getParent().getName() == "blockquote")for (h = i; h = h.getNext();)if (h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) {
                            i.move(h, true);
                            break
                        }
                        if (f && f.getParent().getName() == "blockquote")for (h = f; h = h.getPrevious();)if (h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) {
                            f.move(h);
                            break
                        }
                    }
                    var j = c.createIterator();
                    j.enlargeBr = a.config.enterMode != CKEDITOR.ENTER_BR;
                    if (b == CKEDITOR.TRISTATE_OFF) {
                        for (i = []; b = j.getNextParagraph();)i.push(b);
                        if (i.length < 1) {
                            b = a.document.createElement(a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                            f = d.shift();
                            c.insertNode(b);
                            b.append(new CKEDITOR.dom.text("﻿", a.document));
                            c.moveToBookmark(f);
                            c.selectNodeContents(b);
                            c.collapse(true);
                            f = c.createBookmark();
                            i.push(b);
                            d.unshift(f)
                        }
                        h = i[0].getParent();
                        c = [];
                        for (f = 0; f < i.length; f++) {
                            b = i[f];
                            h = h.getCommonAncestor(b.getParent())
                        }
                        for (b = {
                            table: 1,
                            tbody: 1,
                            tr: 1,
                            ol: 1,
                            ul: 1
                        }; b[h.getName()];)h = h.getParent();
                        for (f = null; i.length > 0;) {
                            for (b = i.shift(); !b.getParent().equals(h);)b =
                                b.getParent();
                            b.equals(f) || c.push(b);
                            f = b
                        }
                        for (; c.length > 0;) {
                            b = c.shift();
                            if (b.getName() == "blockquote") {
                                for (f = new CKEDITOR.dom.documentFragment(a.document); b.getFirst();) {
                                    f.append(b.getFirst().remove());
                                    i.push(f.getLast())
                                }
                                f.replace(b)
                            } else i.push(b)
                        }
                        c = a.document.createElement("blockquote");
                        for (c.insertBefore(i[0]); i.length > 0;) {
                            b = i.shift();
                            c.append(b)
                        }
                    } else if (b == CKEDITOR.TRISTATE_ON) {
                        f = [];
                        for (h = {}; b = j.getNextParagraph();) {
                            for (i = c = null; b.getParent();) {
                                if (b.getParent().getName() == "blockquote") {
                                    c = b.getParent();
                                    i = b;
                                    break
                                }
                                b = b.getParent()
                            }
                            if (c && i && !i.getCustomData("blockquote_moveout")) {
                                f.push(i);
                                CKEDITOR.dom.element.setMarker(h, i, "blockquote_moveout", true)
                            }
                        }
                        CKEDITOR.dom.element.clearAllMarkers(h);
                        b = [];
                        i = [];
                        for (h = {}; f.length > 0;) {
                            j = f.shift();
                            c = j.getParent();
                            if (j.getPrevious())if (j.getNext()) {
                                j.breakParent(j.getParent());
                                i.push(j.getNext())
                            } else j.remove().insertAfter(c); else j.remove().insertBefore(c);
                            if (!c.getCustomData("blockquote_processed")) {
                                i.push(c);
                                CKEDITOR.dom.element.setMarker(h, c, "blockquote_processed",
                                    true)
                            }
                            b.push(j)
                        }
                        CKEDITOR.dom.element.clearAllMarkers(h);
                        for (f = i.length - 1; f >= 0; f--) {
                            c = i[f];
                            a:{
                                h = c;
                                for (var j = 0, k = h.getChildCount(), n = void 0; j < k && (n = h.getChild(j)); j++)if (n.type == CKEDITOR.NODE_ELEMENT && n.isBlockBoundary()) {
                                    h = false;
                                    break a
                                }
                                h = true
                            }
                            h && c.remove()
                        }
                        if (a.config.enterMode == CKEDITOR.ENTER_BR)for (c = true; b.length;) {
                            j = b.shift();
                            if (j.getName() == "div") {
                                f = new CKEDITOR.dom.documentFragment(a.document);
                                c && (j.getPrevious() && !(j.getPrevious().type == CKEDITOR.NODE_ELEMENT && j.getPrevious().isBlockBoundary())) &&
                                f.append(a.document.createElement("br"));
                                for (c = j.getNext() && !(j.getNext().type == CKEDITOR.NODE_ELEMENT && j.getNext().isBlockBoundary()); j.getFirst();)j.getFirst().remove().appendTo(f);
                                c && f.append(a.document.createElement("br"));
                                f.replace(j);
                                c = false
                            }
                        }
                    }
                    g.selectBookmarks(d);
                    a.focus()
                }
            },
            refresh: function (a, b) {
                this.setState(a.elementPath(b.block || b.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
            },
            context: "blockquote",
            allowedContent: "blockquote",
            requiredContent: "blockquote"
        };
        CKEDITOR.plugins.add("blockquote", {
            init: function (e) {
                if (!e.blockless) {
                    e.addCommand("blockquote", a);
                    e.ui.addButton && e.ui.addButton("Blockquote", {
                        label: e.lang.blockquote.toolbar,
                        command: "blockquote",
                        toolbar: "blocks,10"
                    })
                }
            }
        })
    }(),"use strict",function () {
        function a(a) {
            function b() {
                var c = a.editable();
                c.on(y, function (a) {
                    (!CKEDITOR.env.ie || !x) && t(a)
                });
                CKEDITOR.env.ie && c.on("paste", function (b) {
                    if (!v) {
                        g();
                        b.data.preventDefault();
                        t(b);
                        o("paste") || a.openDialog("paste")
                    }
                });
                if (CKEDITOR.env.ie) {
                    c.on("contextmenu",
                        e, null, null, 0);
                    c.on("beforepaste", function (a) {
                        a.data && (!a.data.$.ctrlKey && !a.data.$.shiftKey) && e()
                    }, null, null, 0)
                }
                c.on("beforecut", function () {
                    !x && m(a)
                });
                var d;
                c.attachListener(CKEDITOR.env.ie ? c : a.document.getDocumentElement(), "mouseup", function () {
                    d = setTimeout(function () {
                        u()
                    }, 0)
                });
                a.on("destroy", function () {
                    clearTimeout(d)
                });
                c.on("keyup", u)
            }

            function c(b) {
                return {
                    type: b,
                    canUndo: b == "cut",
                    startDisabled: true,
                    exec: function () {
                        this.type == "cut" && m();
                        var b;
                        var c = this.type;
                        if (CKEDITOR.env.ie)b = o(c); else try {
                            b =
                                a.document.$.execCommand(c, false, null)
                        } catch (d) {
                            b = false
                        }
                        b || alert(a.lang.clipboard[this.type + "Error"]);
                        return b
                    }
                }
            }

            function d() {
                return {
                    canUndo: false, async: true, exec: function (a, b) {
                        var c = function (b, c) {
                            b && p(b.type, b.dataValue, !!c);
                            a.fire("afterCommandExec", {
                                name: "paste",
                                command: d,
                                returnValue: !!b
                            })
                        }, d = this;
                        typeof b == "string" ? c({
                            type: "auto",
                            dataValue: b
                        }, 1) : a.getClipboardData(c)
                    }
                }
            }

            function g() {
                v = 1;
                setTimeout(function () {
                    v = 0
                }, 100)
            }

            function e() {
                x = 1;
                setTimeout(function () {
                    x = 0
                }, 10)
            }

            function o(b) {
                var c = a.document,
                    d = c.getBody(), f = false, g = function () {
                        f = true
                    };
                d.on(b, g);
                (CKEDITOR.env.version > 7 ? c.$ : c.$.selection.createRange()).execCommand(b);
                d.removeListener(b, g);
                return f
            }

            function p(b, c, d) {
                b = {type: b};
                if (d && a.fire("beforePaste", b) === false || !c)return false;
                b.dataValue = c;
                return a.fire("paste", b)
            }

            function m() {
                if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                    var b = a.getSelection(), c, d, f;
                    if (b.getType() == CKEDITOR.SELECTION_ELEMENT && (c = b.getSelectedElement())) {
                        d = b.getRanges()[0];
                        f = a.document.createText("");
                        f.insertBefore(c);
                        d.setStartBefore(f);
                        d.setEndAfter(c);
                        b.selectRanges([d]);
                        setTimeout(function () {
                            if (c.getParent()) {
                                f.remove();
                                b.selectElement(c)
                            }
                        }, 0)
                    }
                }
            }

            function l(b, c) {
                var d = a.document, f = a.editable(), g = function (a) {
                    a.cancel()
                }, e;
                if (!d.getById("cke_pastebin")) {
                    var h = a.getSelection(), j = h.createBookmarks();
                    CKEDITOR.env.ie && h.root.fire("selectionchange");
                    var k = new CKEDITOR.dom.element((CKEDITOR.env.webkit || f.is("body")) && !CKEDITOR.env.ie ? "body" : "div", d);
                    k.setAttributes({id: "cke_pastebin", "data-cke-temp": "1"});
                    var t = 0, d = d.getWindow();
                    if (CKEDITOR.env.webkit) {
                        f.append(k);
                        k.addClass("cke_editable");
                        if (!f.is("body")) {
                            t = f.getComputedStyle("position") != "static" ? f : CKEDITOR.dom.element.get(f.$.offsetParent);
                            t = t.getDocumentPosition().y
                        }
                    } else f.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(k);
                    k.setStyles({
                        position: "absolute",
                        top: d.getScrollPosition().y - t + 10 + "px",
                        width: "1px",
                        height: Math.max(1, d.getViewPaneSize().height - 20) + "px",
                        overflow: "hidden",
                        margin: 0,
                        padding: 0
                    });
                    CKEDITOR.env.safari && k.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "text"));
                    if (t = k.getParent().isReadOnly()) {
                        k.setOpacity(0);
                        k.setAttribute("contenteditable", true)
                    } else k.setStyle(a.config.contentsLangDirection == "ltr" ? "left" : "right", "-1000px");
                    a.on("selectionChange", g, null, null, 0);
                    if (CKEDITOR.env.webkit || CKEDITOR.env.gecko)e = f.once("blur", g, null, null, -100);
                    t && k.focus();
                    t = new CKEDITOR.dom.range(k);
                    t.selectNodeContents(k);
                    var q = t.select();
                    CKEDITOR.env.ie && (e = f.once("blur", function () {
                        a.lockSelection(q)
                    }));
                    var s = CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function () {
                        if (CKEDITOR.env.webkit)CKEDITOR.document.getBody().$.scrollTop =
                            s;
                        e && e.removeListener();
                        CKEDITOR.env.ie && f.focus();
                        h.selectBookmarks(j);
                        k.remove();
                        var b;
                        if (CKEDITOR.env.webkit && (b = k.getFirst()) && b.is && b.hasClass("Apple-style-span"))k = b;
                        a.removeListener("selectionChange", g);
                        c(k.getHtml())
                    }, 0)
                }
            }

            function q() {
                if (CKEDITOR.env.ie) {
                    a.focus();
                    g();
                    var b = a.focusManager;
                    b.lock();
                    if (a.editable().fire(y) && !o("paste")) {
                        b.unlock();
                        return false
                    }
                    b.unlock()
                } else try {
                    if (a.editable().fire(y) && !a.document.$.execCommand("Paste", false, null))throw 0;
                } catch (c) {
                    return false
                }
                return true
            }

            function s(b) {
                if (a.mode == "wysiwyg")switch (b.data.keyCode) {
                    case CKEDITOR.CTRL + 86:
                    case CKEDITOR.SHIFT + 45:
                        b = a.editable();
                        g();
                        !CKEDITOR.env.ie && b.fire("beforepaste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        a.fire("saveSnapshot");
                        setTimeout(function () {
                            a.fire("saveSnapshot")
                        }, 50)
                }
            }

            function t(b) {
                var c = {type: "auto"}, d = a.fire("beforePaste", c);
                l(b, function (a) {
                    a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
                    d && p(c.type, a, 0, 1)
                })
            }

            function u() {
                if (a.mode == "wysiwyg") {
                    var b = w("paste");
                    a.getCommand("cut").setState(w("cut"));
                    a.getCommand("copy").setState(w("copy"));
                    a.getCommand("paste").setState(b);
                    a.fire("pasteState", b)
                }
            }

            function w(b) {
                if (r && b in {
                        paste: 1,
                        cut: 1
                    })return CKEDITOR.TRISTATE_DISABLED;
                if (b == "paste")return CKEDITOR.TRISTATE_OFF;
                var b = a.getSelection(), c = b.getRanges();
                return b.getType() == CKEDITOR.SELECTION_NONE || c.length == 1 && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
            }

            var x = 0, v = 0, r = 0, y = CKEDITOR.env.ie ? "beforepaste" : "paste";
            (function () {
                a.on("key", s);
                a.on("contentDom", b);
                a.on("selectionChange",
                    function (a) {
                        r = a.data.selection.getRanges()[0].checkReadOnly();
                        u()
                    });
                a.contextMenu && a.contextMenu.addListener(function (a, b) {
                    r = b.getRanges()[0].checkReadOnly();
                    return {cut: w("cut"), copy: w("copy"), paste: w("paste")}
                })
            })();
            (function () {
                function b(c, d, f, g, e) {
                    var h = a.lang.clipboard[d];
                    a.addCommand(d, f);
                    a.ui.addButton && a.ui.addButton(c, {
                        label: h,
                        command: d,
                        toolbar: "clipboard," + g
                    });
                    a.addMenuItems && a.addMenuItem(d, {
                        label: h,
                        command: d,
                        group: "clipboard",
                        order: e
                    })
                }

                b("Cut", "cut", c("cut"), 10, 1);
                b("Copy", "copy", c("copy"),
                    20, 4);
                b("Paste", "paste", d(), 30, 8)
            })();
            a.getClipboardData = function (b, c) {
                function d(a) {
                    a.removeListener();
                    a.cancel();
                    c(a.data)
                }

                function f(a) {
                    a.removeListener();
                    a.cancel();
                    j = true;
                    c({type: h, dataValue: a.data})
                }

                function g() {
                    this.customTitle = b && b.title
                }

                var e = false, h = "auto", j = false;
                if (!c) {
                    c = b;
                    b = null
                }
                a.on("paste", d, null, null, 0);
                a.on("beforePaste", function (a) {
                    a.removeListener();
                    e = true;
                    h = a.data.type
                }, null, null, 1E3);
                if (q() === false) {
                    a.removeListener("paste", d);
                    if (e && a.fire("pasteDialog", g)) {
                        a.on("pasteDialogCommit",
                            f);
                        a.on("dialogHide", function (a) {
                            a.removeListener();
                            a.data.removeListener("pasteDialogCommit", f);
                            setTimeout(function () {
                                j || c(null)
                            }, 10)
                        })
                    } else c(null)
                }
            }
        }

        function e(a) {
            if (CKEDITOR.env.webkit) {
                if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return "html"
            } else if (CKEDITOR.env.ie) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return "html"
            } else if (CKEDITOR.env.gecko) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi))return "html"
            } else return "html";
            return "htmlifiedtext"
        }

        function b(a, b) {
            function c(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (a % 2 == 1 ? "<br>" : "")
            }

            b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
            b = b.replace(/<\/?[A-Z]+>/g, function (a) {
                return a.toLowerCase()
            });
            if (b.match(/^[^<]$/))return b;
            if (CKEDITOR.env.webkit && b.indexOf("<div>") > -1) {
                b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
                b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" +
                    b.replace(/(<div>(<br>|)<\/div>)+/g, function (a) {
                        return c(a.split("</div><div>").length + 1)
                    }) + "</p>");
                b = b.replace(/<\/div><div>/g, "<br>");
                b = b.replace(/<\/?div>/g, "")
            }
            if (CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR) {
                CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>"));
                b.indexOf("<br><br>") > -1 && (b = "<p>" + b.replace(/(<br>){2,}/g, function (a) {
                        return c(a.length / 4)
                    }) + "</p>")
            }
            return d(a, b)
        }

        function g() {
            var a = new CKEDITOR.htmlParser.filter, b = {
                blockquote: 1,
                dl: 1,
                fieldset: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                ol: 1,
                p: 1,
                table: 1,
                ul: 1
            }, c = CKEDITOR.tools.extend({br: 0}, CKEDITOR.dtd.$inline), d = {
                p: 1,
                br: 1,
                "cke:br": 1
            }, g = CKEDITOR.dtd, e = CKEDITOR.tools.extend({
                area: 1,
                basefont: 1,
                embed: 1,
                iframe: 1,
                map: 1,
                object: 1,
                param: 1
            }, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata), o = function (a) {
                delete a.name;
                a.add(new CKEDITOR.htmlParser.text(" "))
            }, p = function (a) {
                for (var b = a, c; (b = b.next) && b.name && b.name.match(/^h\d$/);) {
                    c = new CKEDITOR.htmlParser.element("cke:br");
                    c.isEmpty = true;
                    for (a.add(c); c = b.children.shift();)a.add(c)
                }
            };
            a.addRules({
                elements: {
                    h1: p,
                    h2: p, h3: p, h4: p, h5: p, h6: p, img: function (a) {
                        var a = CKEDITOR.tools.trim(a.attributes.alt || ""), b = " ";
                        a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
                        return new CKEDITOR.htmlParser.text(b)
                    }, td: o, th: o, $: function (a) {
                        var i = a.name, q;
                        if (e[i])return false;
                        a.attributes = {};
                        if (i == "br")return a;
                        if (b[i])a.name = "p"; else if (c[i])delete a.name; else if (g[i]) {
                            q = new CKEDITOR.htmlParser.element("cke:br");
                            q.isEmpty = true;
                            if (CKEDITOR.dtd.$empty[i])return q;
                            a.add(q, 0);
                            q = q.clone();
                            q.isEmpty = true;
                            a.add(q);
                            delete a.name
                        }
                        d[a.name] || delete a.name;
                        return a
                    }
                }
            }, {applyToAll: true});
            return a
        }

        function c(a, b, c) {
            var b = new CKEDITOR.htmlParser.fragment.fromHtml(b), g = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(g, c);
            var b = g.getHtml(), b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""), e = 0, b = b.replace(/<\/?p>/g, function (a) {
                if (a == "<p>") {
                    if (++e > 1)return "</p><p>"
                } else if (--e >
                    0)return "</p><p>";
                return a
            }).replace(/<p><\/p>/g, "");
            return d(a, b)
        }

        function d(a, b) {
            a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function (a) {
                return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2)
            }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>"));
            return b
        }

        CKEDITOR.plugins.add("clipboard", {
            requires: "dialog", init: function (d) {
                var f;
                a(d);
                CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
                d.on("paste", function (a) {
                    var b = a.data.dataValue,
                        c = CKEDITOR.dtd.$block;
                    if (b.indexOf("Apple-") > -1) {
                        b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
                        a.data.type != "html" && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function (a, b) {
                            return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                        }));
                        if (b.indexOf('<br class="Apple-interchange-newline">') > -1) {
                            a.data.startsWithEOL = 1;
                            a.data.preSniffing = "html";
                            b = b.replace(/<br class="Apple-interchange-newline">/, "")
                        }
                        b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")
                    }
                    if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
                        var d,
                            f, g = new CKEDITOR.dom.element("div");
                        for (g.setHtml(b); g.getChildCount() == 1 && (d = g.getFirst()) && d.type == CKEDITOR.NODE_ELEMENT && (d.hasClass("cke_editable") || d.hasClass("cke_contents"));)g = f = d;
                        f && (b = f.getHtml().replace(/<br>$/i, ""))
                    }
                    CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, d) {
                        if (d.toLowerCase() in c) {
                            a.data.preSniffing = "html";
                            return "<" + d
                        }
                        return b
                    }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, d) {
                        if (d in c) {
                            a.data.endsWithEOL = 1;
                            return "</" + d + ">"
                        }
                        return b
                    }) :
                    CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
                    a.data.dataValue = b
                }, null, null, 3);
                d.on("paste", function (a) {
                    var a = a.data, j = a.type, k = a.dataValue, n, o = d.config.clipboard_defaultContentType || "html";
                    n = j == "html" || a.preSniffing == "html" ? "html" : e(k);
                    n == "htmlifiedtext" ? k = b(d.config, k) : j == "text" && n == "html" && (k = c(d.config, k, f || (f = g(d))));
                    a.startsWithEOL && (k = '<br data-cke-eol="1">' + k);
                    a.endsWithEOL && (k = k + '<br data-cke-eol="1">');
                    j == "auto" && (j = n == "html" || o == "html" ? "html" : "text");
                    a.type = j;
                    a.dataValue = k;
                    delete a.preSniffing;
                    delete a.startsWithEOL;
                    delete a.endsWithEOL
                }, null, null, 6);
                d.on("paste", function (a) {
                    a = a.data;
                    d.insertHtml(a.dataValue, a.type);
                    setTimeout(function () {
                        d.fire("afterPaste")
                    }, 0)
                }, null, null, 1E3);
                d.on("pasteDialog", function (a) {
                    setTimeout(function () {
                        d.openDialog("paste", a.data)
                    }, 0)
                })
            }
        })
    }(),function () {
        CKEDITOR.plugins.add("panel", {
            beforeInit: function (a) {
                a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
            }
        });
        CKEDITOR.UI_PANEL = "panel";
        CKEDITOR.ui.panel = function (a, b) {
            b && CKEDITOR.tools.extend(this, b);
            CKEDITOR.tools.extend(this, {className: "", css: []});
            this.id = CKEDITOR.tools.getNextId();
            this.document = a;
            this.isFramed = this.forceIFrame || this.css.length;
            this._ = {blocks: {}}
        };
        CKEDITOR.ui.panel.handler = {
            create: function (a) {
                return new CKEDITOR.ui.panel(a)
            }
        };
        var a = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'), e = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
            b = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {
            render: function (g, c) {
                this.getHolderElement = function () {
                    var a = this._.holder;
                    if (!a) {
                        if (this.isFramed) {
                            var a = this.document.getById(this.id + "_frame"), c = a.getParent(), a = a.getFrameDocument();
                            CKEDITOR.env.iOS && c.setStyles({
                                overflow: "scroll",
                                "-webkit-overflow-scrolling": "touch"
                            });
                            c = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function () {
                                this.isLoaded = true;
                                if (this.onLoad)this.onLoad()
                            }, this));
                            a.write(b.output(CKEDITOR.tools.extend({
                                css: CKEDITOR.tools.buildStyleHtml(this.css),
                                onload: "window.parent.CKEDITOR.tools.callFunction(" + c + ");"
                            }, d)));
                            a.getWindow().$.CKEDITOR = CKEDITOR;
                            a.on("keydown", function (a) {
                                var b = a.data.getKeystroke(), c = this.document.getById(this.id).getAttribute("dir");
                                this._.onKeyDown && this._.onKeyDown(b) === false ? a.data.preventDefault() : (b == 27 || b == (c == "rtl" ? 39 :
                                    37)) && this.onEscape && this.onEscape(b) === false && a.data.preventDefault()
                            }, this);
                            a = a.getBody();
                            a.unselectable();
                            CKEDITOR.env.air && CKEDITOR.tools.callFunction(c)
                        } else a = this.document.getById(this.id);
                        this._.holder = a
                    }
                    return a
                };
                var d = {
                    editorId: g.id,
                    id: this.id,
                    langCode: g.langCode,
                    dir: g.lang.dir,
                    cls: this.className,
                    frame: "",
                    env: CKEDITOR.env.cssClass,
                    "z-index": g.config.baseFloatZIndex + 1
                };
                if (this.isFramed) {
                    var i = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" +
                        CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
                    d.frame = e.output({id: this.id + "_frame", src: i})
                }
                i = a.output(d);
                c && c.push(i);
                return i
            }, addBlock: function (a, b) {
                b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
                this._.currentBlock || this.showBlock(a);
                return b
            }, getBlock: function (a) {
                return this._.blocks[a]
            }, showBlock: function (a) {
                var a = this._.blocks[a], b = this._.currentBlock, d = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id +
                    "_frame");
                b && b.hide();
                this._.currentBlock = a;
                CKEDITOR.fire("ariaWidget", d);
                a._.focusIndex = -1;
                this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
                a.show();
                return a
            }, destroy: function () {
                this.element && this.element.remove()
            }
        };
        CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
            $: function (a, b) {
                this.element = a.append(a.getDocument().createElement("div", {
                    attributes: {
                        tabindex: -1,
                        "class": "cke_panel_block"
                    }, styles: {display: "none"}
                }));
                b && CKEDITOR.tools.extend(this, b);
                this.element.setAttributes({
                    role: this.attributes.role ||
                    "presentation",
                    "aria-label": this.attributes["aria-label"],
                    title: this.attributes.title || this.attributes["aria-label"]
                });
                this.keys = {};
                this._.focusIndex = -1;
                this.element.disableContextMenu()
            }, _: {
                markItem: function (a) {
                    if (a != -1) {
                        a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a);
                        CKEDITOR.env.webkit && a.getDocument().getWindow().focus();
                        a.focus();
                        this.onMark && this.onMark(a)
                    }
                }
            }, proto: {
                show: function () {
                    this.element.setStyle("display", "")
                }, hide: function () {
                    (!this.onHide || this.onHide.call(this) !==
                    true) && this.element.setStyle("display", "none")
                }, onKeyDown: function (a, b) {
                    var d = this.keys[a];
                    switch (d) {
                        case "next":
                            for (var e = this._.focusIndex, d = this.element.getElementsByTag("a"), f; f = d.getItem(++e);)if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
                                this._.focusIndex = e;
                                f.focus();
                                break
                            }
                            if (!f && !b) {
                                this._.focusIndex = -1;
                                return this.onKeyDown(a, 1)
                            }
                            return false;
                        case "prev":
                            e = this._.focusIndex;
                            for (d = this.element.getElementsByTag("a"); e > 0 && (f = d.getItem(--e));) {
                                if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
                                    this._.focusIndex =
                                        e;
                                    f.focus();
                                    break
                                }
                                f = null
                            }
                            if (!f && !b) {
                                this._.focusIndex = d.count();
                                return this.onKeyDown(a, 1)
                            }
                            return false;
                        case "click":
                        case "mouseup":
                            e = this._.focusIndex;
                            (f = e >= 0 && this.element.getElementsByTag("a").getItem(e)) && (f.$[d] ? f.$[d]() : f.$["on" + d]());
                            return false
                    }
                    return true
                }
            }
        })
    }(),CKEDITOR.plugins.add("floatpanel", {requires: "panel"}),function () {
        function a(a, g, c, d, i) {
            var i = CKEDITOR.tools.genKey(g.getUniqueId(), c.getUniqueId(), a.lang.dir, a.uiColor || "", d.css || "", i || ""), f = e[i];
            if (!f) {
                f = e[i] = new CKEDITOR.ui.panel(g,
                    d);
                f.element = c.append(CKEDITOR.dom.element.createFromHtml(f.render(a), g));
                f.element.setStyles({display: "none", position: "absolute"})
            }
            return f
        }

        var e = {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
            $: function (b, g, c, d) {
                function e() {
                    k.hide()
                }

                c.forceIFrame = 1;
                c.toolbarRelated && b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (g = CKEDITOR.document.getById("cke_" + b.name));
                var f = g.getDocument(), d = a(b, f, g, c, d || 0), h = d.element, j = h.getFirst(), k = this;
                h.disableContextMenu();
                this.element = h;
                this._ = {
                    editor: b,
                    panel: d,
                    parentElement: g,
                    definition: c,
                    document: f,
                    iframe: j,
                    children: [],
                    dir: b.lang.dir
                };
                b.on("mode", e);
                b.on("resize", e);
                if (!CKEDITOR.env.iOS)f.getWindow().on("resize", e)
            }, proto: {
                addBlock: function (a, g) {
                    return this._.panel.addBlock(a, g)
                }, addListBlock: function (a, g) {
                    return this._.panel.addListBlock(a, g)
                }, getBlock: function (a) {
                    return this._.panel.getBlock(a)
                }, showBlock: function (a, g, c, d, e, f) {
                    var h = this._.panel, j = h.showBlock(a);
                    this.allowBlur(false);
                    a = this._.editor.editable();
                    this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
                    this._.hideTimeout = 0;
                    var k = this.element, a = this._.iframe, a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow), n = k.getDocument(), o = this._.parentElement.getPositionedAncestor(), p = g.getDocumentPosition(n), n = o ? o.getDocumentPosition(n) : {
                        x: 0,
                        y: 0
                    }, m = this._.dir == "rtl", l = p.x + (d || 0) - n.x, q = p.y + (e || 0) - n.y;
                    if (m && (c == 1 || c == 4))l = l + g.$.offsetWidth; else if (!m && (c == 2 || c == 3))l = l + (g.$.offsetWidth - 1);
                    if (c == 3 || c == 4)q = q + (g.$.offsetHeight - 1);
                    this._.panel._.offsetParentId = g.getId();
                    k.setStyles({
                        top: q + "px", left: 0,
                        display: ""
                    });
                    k.setOpacity(0);
                    k.getFirst().removeStyle("width");
                    this._.editor.focusManager.add(a);
                    if (!this._.blurSet) {
                        CKEDITOR.event.useCapture = true;
                        a.on("blur", function (a) {
                            function b() {
                                delete this._.returnFocus;
                                this.hide()
                            }

                            if (this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild)if (CKEDITOR.env.iOS) {
                                if (!this._.hideTimeout)this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this)
                            } else b.call(this)
                        }, this);
                        a.on("focus", function () {
                            this._.focused = true;
                            this.hideChild();
                            this.allowBlur(true)
                        }, this);
                        if (CKEDITOR.env.iOS) {
                            a.on("touchstart", function () {
                                clearTimeout(this._.hideTimeout)
                            }, this);
                            a.on("touchend", function () {
                                this._.hideTimeout = 0;
                                this.focus()
                            }, this)
                        }
                        CKEDITOR.event.useCapture = false;
                        this._.blurSet = 1
                    }
                    h.onEscape = CKEDITOR.tools.bind(function (a) {
                        if (this.onEscape && this.onEscape(a) === false)return false
                    }, this);
                    CKEDITOR.tools.setTimeout(function () {
                        var a = CKEDITOR.tools.bind(function () {
                            k.removeStyle("width");
                            if (j.autoSize) {
                                var a = j.element.getDocument(), a = (CKEDITOR.env.webkit ?
                                    j.element : a.getBody()).$.scrollWidth;
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((k.$.offsetWidth || 0) - (k.$.clientWidth || 0) + 3));
                                k.setStyle("width", a + 10 + "px");
                                a = j.element.$.scrollHeight;
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((k.$.offsetHeight || 0) - (k.$.clientHeight || 0) + 3));
                                k.setStyle("height", a + "px");
                                h._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                            } else k.removeStyle("height");
                            m && (l = l - k.$.offsetWidth);
                            k.setStyle("left", l + "px");
                            var b = h.element.getWindow(),
                                a = k.$.getBoundingClientRect(), b = b.getViewPaneSize(), c = a.width || a.right - a.left, d = a.height || a.bottom - a.top, g = m ? a.right : b.width - a.left, e = m ? b.width - a.right : a.left;
                            m ? g < c && (l = e > c ? l + c : b.width > c ? l - a.left : l - a.right + b.width) : g < c && (l = e > c ? l - c : b.width > c ? l - a.right + b.width : l - a.left);
                            c = a.top;
                            b.height - a.top < d && (q = c > d ? q - d : b.height > d ? q - a.bottom + b.height : q - a.top);
                            if (CKEDITOR.env.ie) {
                                b = a = new CKEDITOR.dom.element(k.$.offsetParent);
                                b.getName() == "html" && (b = b.getDocument().getBody());
                                b.getComputedStyle("direction") == "rtl" &&
                                (l = CKEDITOR.env.ie8Compat ? l - k.getDocument().getDocumentElement().$.scrollLeft * 2 : l - (a.$.scrollWidth - a.$.clientWidth))
                            }
                            var a = k.getFirst(), i;
                            (i = a.getCustomData("activePanel")) && i.onHide && i.onHide.call(this, 1);
                            a.setCustomData("activePanel", this);
                            k.setStyles({top: q + "px", left: l + "px"});
                            k.setOpacity(1);
                            f && f()
                        }, this);
                        h.isLoaded ? a() : h.onLoad = a;
                        CKEDITOR.tools.setTimeout(function () {
                            var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                            this.focus();
                            j.element.focus();
                            if (CKEDITOR.env.webkit)CKEDITOR.document.getBody().$.scrollTop =
                                a;
                            this.allowBlur(true);
                            this._.editor.fire("panelShow", this)
                        }, 0, this)
                    }, CKEDITOR.env.air ? 200 : 0, this);
                    this.visible = 1;
                    this.onShow && this.onShow.call(this)
                }, focus: function () {
                    if (CKEDITOR.env.webkit) {
                        var a = CKEDITOR.document.getActive();
                        a && !a.equals(this._.iframe) && a.$.blur()
                    }
                    (this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
                }, blur: function () {
                    var a = this._.iframe.getFrameDocument().getActive();
                    a && a.is("a") && (this._.lastFocused = a)
                }, hide: function (a) {
                    if (this.visible && (!this.onHide || this.onHide.call(this) !==
                        true)) {
                        this.hideChild();
                        CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
                        this.element.setStyle("display", "none");
                        this.visible = 0;
                        this.element.getFirst().removeCustomData("activePanel");
                        if (a = a && this._.returnFocus) {
                            CKEDITOR.env.webkit && a.type && a.getWindow().$.focus();
                            a.focus()
                        }
                        delete this._.lastFocused;
                        this._.editor.fire("panelHide", this)
                    }
                }, allowBlur: function (a) {
                    var g = this._.panel;
                    if (a !== void 0)g.allowBlur = a;
                    return g.allowBlur
                }, showAsChild: function (a, g, c, d, e, f) {
                    if (!(this._.activeChild ==
                        a && a._.panel._.offsetParentId == c.getId())) {
                        this.hideChild();
                        a.onHide = CKEDITOR.tools.bind(function () {
                            CKEDITOR.tools.setTimeout(function () {
                                this._.focused || this.hide()
                            }, 0, this)
                        }, this);
                        this._.activeChild = a;
                        this._.focused = false;
                        a.showBlock(g, c, d, e, f);
                        this.blur();
                        (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function () {
                            a.element.getChild(0).$.style.cssText += ""
                        }, 100)
                    }
                }, hideChild: function (a) {
                    var g = this._.activeChild;
                    if (g) {
                        delete g.onHide;
                        delete this._.activeChild;
                        g.hide();
                        a && this.focus()
                    }
                }
            }
        });
        CKEDITOR.on("instanceDestroyed", function () {
            var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances), g;
            for (g in e) {
                var c = e[g];
                a ? c.destroy() : c.element.hide()
            }
            a && (e = {})
        })
    }(),CKEDITOR.plugins.add("menu", {
        requires: "floatpanel", beforeInit: function (a) {
            for (var e = a.config.menu_groups.split(","), b = a._.menuGroups = {}, g = a._.menuItems = {}, c = 0; c < e.length; c++)b[e[c]] = c + 1;
            a.addMenuGroup = function (a, c) {
                b[a] = c || 100
            };
            a.addMenuItem = function (a, c) {
                b[c.group] && (g[a] = new CKEDITOR.menuItem(this, a, c))
            };
            a.addMenuItems = function (a) {
                for (var b in a)this.addMenuItem(b,
                    a[b])
            };
            a.getMenuItem = function (a) {
                return g[a]
            };
            a.removeMenuItem = function (a) {
                delete g[a]
            }
        }
    }),function () {
        function a(a) {
            a.sort(function (a, b) {
                return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0
            })
        }

        var e = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
        CKEDITOR.env.gecko &&
        CKEDITOR.env.mac && (e = e + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (e = e + ' onblur="this.style.cssText = this.style.cssText;"');
        var e = e + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'), b = CKEDITOR.addTemplate("menuItem", e + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            g = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({
            $: function (a, b) {
                b = this._.definition = b || {};
                this.id = CKEDITOR.tools.getNextId();
                this.editor = a;
                this.items = [];
                this._.listeners = [];
                this._.level = b.level || 1;
                var g = CKEDITOR.tools.extend({}, b.panel, {
                    css: [CKEDITOR.skin.getPath("editor")],
                    level: this._.level - 1,
                    block: {}
                }), f = g.block.attributes = g.attributes || {};
                !f.role && (f.role = "menu");
                this._.panelDefinition = g
            }, _: {
                onShow: function () {
                    var a =
                        this.editor.getSelection(), b = a && a.getStartElement(), g = this.editor.elementPath(), f = this._.listeners;
                    this.removeAll();
                    for (var e = 0; e < f.length; e++) {
                        var j = f[e](b, a, g);
                        if (j)for (var k in j) {
                            var n = this.editor.getMenuItem(k);
                            if (n && (!n.command || this.editor.getCommand(n.command).state)) {
                                n.state = j[k];
                                this.add(n)
                            }
                        }
                    }
                }, onClick: function (a) {
                    this.hide();
                    if (a.onClick)a.onClick(); else a.command && this.editor.execCommand(a.command)
                }, onEscape: function (a) {
                    var b = this.parent;
                    b ? b._.panel.hideChild(1) : a == 27 && this.hide(1);
                    return false
                },
                onHide: function () {
                    this.onHide && this.onHide()
                }, showSubMenu: function (a) {
                    var b = this._.subMenu, g = this.items[a];
                    if (g = g.getItems && g.getItems()) {
                        if (b)b.removeAll(); else {
                            b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {level: this._.level + 1}, true));
                            b.parent = this;
                            b._.onClick = CKEDITOR.tools.bind(this._.onClick, this)
                        }
                        for (var f in g) {
                            var e = this.editor.getMenuItem(f);
                            if (e) {
                                e.state = g[f];
                                b.add(e)
                            }
                        }
                        var j = this._.panel.getBlock(this.id).element.getDocument().getById(this.id +
                            ("" + a));
                        setTimeout(function () {
                            b.show(j, 2)
                        }, 0)
                    } else this._.panel.hideChild(1)
                }
            }, proto: {
                add: function (a) {
                    if (!a.order)a.order = this.items.length;
                    this.items.push(a)
                }, removeAll: function () {
                    this.items = []
                }, show: function (b, d, g, f) {
                    if (!this.parent) {
                        this._.onShow();
                        if (!this.items.length)return
                    }
                    var d = d || (this.editor.lang.dir == "rtl" ? 2 : 1), e = this.items, j = this.editor, k = this._.panel, n = this._.element;
                    if (!k) {
                        k = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
                        k.onEscape = CKEDITOR.tools.bind(function (a) {
                            if (this._.onEscape(a) === false)return false
                        }, this);
                        k.onShow = function () {
                            k._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                        };
                        k.onHide = CKEDITOR.tools.bind(function () {
                            this._.onHide && this._.onHide()
                        }, this);
                        n = k.addBlock(this.id, this._.panelDefinition.block);
                        n.autoSize = true;
                        var o = n.keys;
                        o[40] = "next";
                        o[9] = "next";
                        o[38] = "prev";
                        o[CKEDITOR.SHIFT + 9] = "prev";
                        o[j.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
                        o[32] = CKEDITOR.env.ie ? "mouseup" :
                            "click";
                        CKEDITOR.env.ie && (o[13] = "mouseup");
                        n = this._.element = n.element;
                        o = n.getDocument();
                        o.getBody().setStyle("overflow", "hidden");
                        o.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
                        this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
                            clearTimeout(this._.showSubTimeout);
                            this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, j.config.menu_subMenuDelay || 400, this, [a])
                        }, this);
                        this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
                            clearTimeout(this._.showSubTimeout)
                        }, this);
                        this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
                            var b = this.items[a];
                            if (b.state == CKEDITOR.TRISTATE_DISABLED)this.hide(1); else if (b.getItems)this._.showSubMenu(a); else this._.onClick(b)
                        }, this)
                    }
                    a(e);
                    for (var o = j.elementPath(), o = ['<div class="cke_menu' + (o && o.direction() != j.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], p = e.length, m = p && e[0].group, l = 0; l < p; l++) {
                        var q = e[l];
                        if (m != q.group) {
                            o.push('<div class="cke_menuseparator" role="separator"></div>');
                            m = q.group
                        }
                        q.render(this, l, o)
                    }
                    o.push("</div>");
                    n.setHtml(o.join(""));
                    CKEDITOR.ui.fire("ready", this);
                    this.parent ? this.parent._.panel.showAsChild(k, this.id, b, d, g, f) : k.showBlock(this.id, b, d, g, f);
                    j.fire("menuShow", [k])
                }, addListener: function (a) {
                    this._.listeners.push(a)
                }, hide: function (a) {
                    this._.onHide && this._.onHide();
                    this._.panel && this._.panel.hide(a)
                }
            }
        });
        CKEDITOR.menuItem = CKEDITOR.tools.createClass({
            $: function (a, b, g) {
                CKEDITOR.tools.extend(this, g, {
                    order: 0,
                    className: "cke_menubutton__" + b
                });
                this.group = a._.menuGroups[this.group];
                this.editor = a;
                this.name =
                    b
            }, proto: {
                render: function (a, d, e) {
                    var f = a.id + ("" + d), h = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state, j = "", k = h == CKEDITOR.TRISTATE_ON ? "on" : h == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
                    this.role in {
                        menuitemcheckbox: 1,
                        menuitemradio: 1
                    } && (j = ' aria-checked="' + (h == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
                    var n = this.getItems, o = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";", p = this.name;
                    if (this.icon && !/\./.test(this.icon))p = this.icon;
                    a = {
                        id: f,
                        name: this.name,
                        iconName: p,
                        label: this.label,
                        cls: this.className || "",
                        state: k,
                        hasPopup: n ? "true" : "false",
                        disabled: h == CKEDITOR.TRISTATE_DISABLED,
                        title: this.label,
                        href: "javascript:void('" + (this.label || "").replace("'") + "')",
                        hoverFn: a._.itemOverFn,
                        moveOutFn: a._.itemOutFn,
                        clickFn: a._.itemClickFn,
                        index: d,
                        iconStyle: CKEDITOR.skin.getIconStyle(p, this.editor.lang.dir == "rtl", p == this.icon ? null : this.icon, this.iconOffset),
                        arrowHtml: n ? g.output({label: o}) : "",
                        role: this.role ? this.role : "menuitem",
                        ariaChecked: j
                    };
                    b.output(a, e)
                }
            }
        })
    }(),CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div",
    CKEDITOR.plugins.add("contextmenu", {
        requires: "menu", onLoad: function () {
            CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
                base: CKEDITOR.menu, $: function (a) {
                    this.base.call(this, a, {
                        panel: {
                            className: "cke_menu_panel",
                            attributes: {"aria-label": a.lang.contextmenu.options}
                        }
                    })
                }, proto: {
                    addTarget: function (a, e) {
                        a.on("contextmenu", function (a) {
                            var a = a.data, d = CKEDITOR.env.webkit ? b : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
                            if (!e || !d) {
                                a.preventDefault();
                                if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
                                    var d = this.editor,
                                        g = (new CKEDITOR.dom.elementPath(a.getTarget(), d.editable())).contains(function (a) {
                                            return a.hasAttribute("contenteditable")
                                        }, true);
                                    g && g.getAttribute("contenteditable") == "false" && d.getSelection().fake(g)
                                }
                                var g = a.getTarget().getDocument(), f = a.getTarget().getDocument().getDocumentElement(), d = !g.equals(CKEDITOR.document), g = g.getWindow().getScrollPosition(), h = d ? a.$.clientX : a.$.pageX || g.x + a.$.clientX, j = d ? a.$.clientY : a.$.pageY || g.y + a.$.clientY;
                                CKEDITOR.tools.setTimeout(function () {
                                    this.open(f, null, h, j)
                                }, CKEDITOR.env.ie ?
                                    200 : 0, this)
                            }
                        }, this);
                        if (CKEDITOR.env.webkit) {
                            var b, g = function () {
                                b = 0
                            };
                            a.on("keydown", function (a) {
                                b = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
                            });
                            a.on("keyup", g);
                            a.on("contextmenu", g)
                        }
                    }, open: function (a, e, b, g) {
                        this.editor.focus();
                        a = a || CKEDITOR.document.getDocumentElement();
                        this.editor.selectionChange(1);
                        this.show(a, e, b, g)
                    }
                }
            })
        }, beforeInit: function (a) {
            var e = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
            a.on("contentDom", function () {
                e.addTarget(a.editable(), a.config.browserContextMenuOnCtrl !==
                    false)
            });
            a.addCommand("contextMenu", {
                exec: function () {
                    a.contextMenu.open(a.document.getBody())
                }
            });
            a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
            a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
        }
    }),function () {
        var a;

        function e(d, g) {
            function f(a) {
                a = n.list[a];
                if (a.equals(d.editable()) || a.getAttribute("contenteditable") == "true") {
                    var b = d.createRange();
                    b.selectNodeContents(a);
                    b.select()
                } else d.getSelection().selectElement(a);
                d.focus()
            }

            function e() {
                k && k.setHtml(b);
                delete n.list
            }

            var j = d.ui.spaceId("path"),
                k, n = d._.elementsPath, o = n.idBase;
            g.html = g.html + ('<span id="' + j + '_label" class="cke_voice_label">' + d.lang.elementspath.eleLabel + '</span><span id="' + j + '" class="cke_path" role="group" aria-labelledby="' + j + '_label">' + b + "</span>");
            d.on("uiReady", function () {
                var a = d.ui.space("path");
                a && d.focusManager.add(a, 1)
            });
            n.onClick = f;
            var p = CKEDITOR.tools.addFunction(f), m = CKEDITOR.tools.addFunction(function (a, b) {
                var c = n.idBase, g, b = new CKEDITOR.dom.event(b);
                g = d.lang.dir == "rtl";
                switch (b.getKeystroke()) {
                    case g ? 39 : 37:
                    case 9:
                        (g =
                            CKEDITOR.document.getById(c + (a + 1))) || (g = CKEDITOR.document.getById(c + "0"));
                        g.focus();
                        return false;
                    case g ? 37 : 39:
                    case CKEDITOR.SHIFT + 9:
                        (g = CKEDITOR.document.getById(c + (a - 1))) || (g = CKEDITOR.document.getById(c + (n.list.length - 1)));
                        g.focus();
                        return false;
                    case 27:
                        d.focus();
                        return false;
                    case 13:
                    case 32:
                        f(a);
                        return false
                }
                return true
            });
            d.on("selectionChange", function () {
                for (var a = [], f = n.list = [], g = [], e = n.filters, h = true, i = d.elementPath().elements, x, v = i.length; v--;) {
                    var r = i[v], y = 0;
                    x = r.data("cke-display-name") ? r.data("cke-display-name") :
                        r.data("cke-real-element-type") ? r.data("cke-real-element-type") : r.getName();
                    h = r.hasAttribute("contenteditable") ? r.getAttribute("contenteditable") == "true" : h;
                    !h && !r.hasAttribute("contenteditable") && (y = 1);
                    for (var z = 0; z < e.length; z++) {
                        var B = e[z](r, x);
                        if (B === false) {
                            y = 1;
                            break
                        }
                        x = B || x
                    }
                    if (!y) {
                        f.unshift(r);
                        g.unshift(x)
                    }
                }
                f = f.length;
                for (e = 0; e < f; e++) {
                    x = g[e];
                    h = d.lang.elementspath.eleTitle.replace(/%1/, x);
                    x = c.output({
                        id: o + e,
                        label: h,
                        text: x,
                        jsTitle: "javascript:void('" + x + "')",
                        index: e,
                        keyDownFn: m,
                        clickFn: p
                    });
                    a.unshift(x)
                }
                k ||
                (k = CKEDITOR.document.getById(j));
                g = k;
                g.setHtml(a.join("") + b);
                d.fire("elementsPathUpdate", {space: g})
            });
            d.on("readOnly", e);
            d.on("contentDomUnload", e);
            d.addCommand("elementsPathFocus", a);
            d.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
        }

        a = {
            editorFocus: false, readOnly: 1, exec: function (a) {
                (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
            }
        };
        var b = '<span class="cke_path_empty">&nbsp;</span>', g = "";
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (g = g + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (g = g + ' onblur="this.style.cssText = this.style.cssText;"');
        var c = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + g + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {
            init: function (a) {
                a._.elementsPath = {
                    idBase: "cke_elementspath_" +
                    CKEDITOR.tools.getNextNumber() + "_", filters: []
                };
                a.on("uiSpace", function (b) {
                    b.data.space == "bottom" && e(a, b.data)
                })
            }
        })
    }(),function () {
        function a(a, c) {
            var d, i;
            c.on("refresh", function (a) {
                var c = [e], d;
                for (d in a.data.states)c.push(a.data.states[d]);
                this.setState(CKEDITOR.tools.search(c, b) ? b : e)
            }, c, null, 100);
            c.on("exec", function (b) {
                d = a.getSelection();
                i = d.createBookmarks(1);
                if (!b.data)b.data = {};
                b.data.done = false
            }, c, null, 0);
            c.on("exec", function () {
                a.forceNextSelectionCheck();
                d.selectBookmarks(i)
            }, c, null, 100)
        }

        var e =
            CKEDITOR.TRISTATE_DISABLED, b = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indent", {
            init: function (b) {
                var c = CKEDITOR.plugins.indent.genericDefinition;
                a(b, b.addCommand("indent", new c(true)));
                a(b, b.addCommand("outdent", new c));
                if (b.ui.addButton) {
                    b.ui.addButton("Indent", {
                        label: b.lang.indent.indent,
                        command: "indent",
                        directional: true,
                        toolbar: "indent,20"
                    });
                    b.ui.addButton("Outdent", {
                        label: b.lang.indent.outdent,
                        command: "outdent",
                        directional: true,
                        toolbar: "indent,10"
                    })
                }
                b.on("dirChanged", function (a) {
                    var c = b.createRange(),
                        f = a.data.node;
                    c.setStartBefore(f);
                    c.setEndAfter(f);
                    for (var e = new CKEDITOR.dom.walker(c), j; j = e.next();)if (j.type == CKEDITOR.NODE_ELEMENT)if (!j.equals(f) && j.getDirection()) {
                        c.setStartAfter(j);
                        e = new CKEDITOR.dom.walker(c)
                    } else {
                        var k = b.config.indentClasses;
                        if (k)for (var n = a.data.dir == "ltr" ? ["_rtl", ""] : ["", "_rtl"], o = 0; o < k.length; o++)if (j.hasClass(k[o] + n[0])) {
                            j.removeClass(k[o] + n[0]);
                            j.addClass(k[o] + n[1])
                        }
                        k = j.getStyle("margin-right");
                        n = j.getStyle("margin-left");
                        k ? j.setStyle("margin-left", k) : j.removeStyle("margin-left");
                        n ? j.setStyle("margin-right", n) : j.removeStyle("margin-right")
                    }
                })
            }
        });
        CKEDITOR.plugins.indent = {
            genericDefinition: function (a) {
                this.isIndent = !!a;
                this.startDisabled = !this.isIndent
            }, specificDefinition: function (a, b, d) {
                this.name = b;
                this.editor = a;
                this.jobs = {};
                this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
                this.isIndent = !!d;
                this.relatedGlobal = d ? "indent" : "outdent";
                this.indentKey = d ? 9 : CKEDITOR.SHIFT + 9;
                this.database = {}
            }, registerCommands: function (a, b) {
                a.on("pluginsLoaded", function () {
                    for (var a in b)(function (a,
                                               b) {
                        var c = a.getCommand(b.relatedGlobal), d;
                        for (d in b.jobs) {
                            c.on("exec", function (c) {
                                if (!c.data.done) {
                                    a.fire("lockSnapshot");
                                    if (b.execJob(a, d))c.data.done = true;
                                    a.fire("unlockSnapshot");
                                    CKEDITOR.dom.element.clearAllMarkers(b.database)
                                }
                            }, this, null, d);
                            c.on("refresh", function (c) {
                                if (!c.data.states)c.data.states = {};
                                c.data.states[b.name + "@" + d] = b.refreshJob(a, d, c.data.path)
                            }, this, null, d)
                        }
                        a.addFeature(b)
                    })(this, b[a])
                })
            }
        };
        CKEDITOR.plugins.indent.genericDefinition.prototype = {
            context: "p",
            exec: function () {
            }
        };
        CKEDITOR.plugins.indent.specificDefinition.prototype =
        {
            execJob: function (a, b) {
                var d = this.jobs[b];
                if (d.state != e)return d.exec.call(this, a)
            }, refreshJob: function (a, b, d) {
            b = this.jobs[b];
            b.state = a.activeFilter.checkFeature(this) ? b.refresh.call(this, a, d) : e;
            return b.state
        }, getContext: function (a) {
            return a.contains(this.context)
        }
        }
    }(),function () {
        function a(a) {
            function c(e) {
                for (var h = p.startContainer, m = p.endContainer; h && !h.getParent().equals(e);)h = h.getParent();
                for (; m && !m.getParent().equals(e);)m = m.getParent();
                if (!h || !m)return false;
                for (var l = h, h = [], o = false; !o;) {
                    l.equals(m) &&
                    (o = true);
                    h.push(l);
                    l = l.getNext()
                }
                if (h.length < 1)return false;
                l = e.getParents(true);
                for (m = 0; m < l.length; m++)if (l[m].getName && i[l[m].getName()]) {
                    e = l[m];
                    break
                }
                for (var l = d.isIndent ? 1 : -1, m = h[0], h = h[h.length - 1], o = CKEDITOR.plugins.list.listToArray(e, g), x = o[h.getCustomData("listarray_index")].indent, m = m.getCustomData("listarray_index"); m <= h.getCustomData("listarray_index"); m++) {
                    o[m].indent = o[m].indent + l;
                    if (l > 0) {
                        var v = o[m].parent;
                        o[m].parent = new CKEDITOR.dom.element(v.getName(), v.getDocument())
                    }
                }
                for (m = h.getCustomData("listarray_index") +
                    1; m < o.length && o[m].indent > x; m++)o[m].indent = o[m].indent + l;
                h = CKEDITOR.plugins.list.arrayToList(o, g, null, a.config.enterMode, e.getDirection());
                if (!d.isIndent) {
                    var r;
                    if ((r = e.getParent()) && r.is("li"))for (var l = h.listNode.getChildren(), y = [], z, m = l.count() - 1; m >= 0; m--)(z = l.getItem(m)) && (z.is && z.is("li")) && y.push(z)
                }
                h && h.listNode.replace(e);
                if (y && y.length)for (m = 0; m < y.length; m++) {
                    for (z = e = y[m]; (z = z.getNext()) && z.is && z.getName() in i;) {
                        CKEDITOR.env.needsNbspFiller && !e.getFirst(b) && e.append(p.document.createText(" "));
                        e.append(z)
                    }
                    e.insertAfter(r)
                }
                h && a.fire("contentDomInvalidated");
                return true
            }

            for (var d = this, g = this.database, i = this.context, o = a.getSelection(), o = (o && o.getRanges()).createIterator(), p; p = o.getNextRange();) {
                for (var m = p.getCommonAncestor(); m && !(m.type == CKEDITOR.NODE_ELEMENT && i[m.getName()]);) {
                    if (a.editable().equals(m)) {
                        m = false;
                        break
                    }
                    m = m.getParent()
                }
                m || (m = p.startPath().contains(i)) && p.setEndAt(m, CKEDITOR.POSITION_BEFORE_END);
                if (!m) {
                    var l = p.getEnclosedNode();
                    if (l && l.type == CKEDITOR.NODE_ELEMENT && l.getName() in
                        i) {
                        p.setStartAt(l, CKEDITOR.POSITION_AFTER_START);
                        p.setEndAt(l, CKEDITOR.POSITION_BEFORE_END);
                        m = l
                    }
                }
                if (m && p.startContainer.type == CKEDITOR.NODE_ELEMENT && p.startContainer.getName() in i) {
                    l = new CKEDITOR.dom.walker(p);
                    l.evaluator = e;
                    p.startContainer = l.next()
                }
                if (m && p.endContainer.type == CKEDITOR.NODE_ELEMENT && p.endContainer.getName() in i) {
                    l = new CKEDITOR.dom.walker(p);
                    l.evaluator = e;
                    p.endContainer = l.previous()
                }
                if (m)return c(m)
            }
            return 0
        }

        function e(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && a.is("li")
        }

        function b(a) {
            return g(a) &&
                c(a)
        }

        var g = CKEDITOR.dom.walker.whitespaces(true), c = CKEDITOR.dom.walker.bookmark(false, true), d = CKEDITOR.TRISTATE_DISABLED, i = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indentlist", {
            requires: "indent", init: function (b) {
                function c(b) {
                    e.specificDefinition.apply(this, arguments);
                    this.requiredContent = ["ul", "ol"];
                    b.on("key", function (a) {
                        if (b.mode == "wysiwyg" && a.data.keyCode == this.indentKey) {
                            var c = this.getContext(b.elementPath());
                            if (c && (!this.isIndent || !CKEDITOR.plugins.indentList.firstItemInPath(this.context,
                                    b.elementPath(), c))) {
                                b.execCommand(this.relatedGlobal);
                                a.cancel()
                            }
                        }
                    }, this);
                    this.jobs[this.isIndent ? 10 : 30] = {
                        refresh: this.isIndent ? function (a, b) {
                            var c = this.getContext(b), f = CKEDITOR.plugins.indentList.firstItemInPath(this.context, b, c);
                            return !c || !this.isIndent || f ? d : i
                        } : function (a, b) {
                            return !this.getContext(b) || this.isIndent ? d : i
                        }, exec: CKEDITOR.tools.bind(a, this)
                    }
                }

                var e = CKEDITOR.plugins.indent;
                e.registerCommands(b, {
                    indentlist: new c(b, "indentlist", true),
                    outdentlist: new c(b, "outdentlist")
                });
                CKEDITOR.tools.extend(c.prototype,
                    e.specificDefinition.prototype, {context: {ol: 1, ul: 1}})
            }
        });
        CKEDITOR.plugins.indentList = {};
        CKEDITOR.plugins.indentList.firstItemInPath = function (a, b, c) {
            var d = b.contains(e);
            c || (c = b.contains(a));
            return c && d && d.equals(c.getFirst(e))
        }
    }(),function () {
        function a(a, b, c) {
            function d(c) {
                if ((j = i[c ? "getFirst" : "getLast"]()) && (!j.is || !j.isBlockBoundary()) && (k = b.root[c ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(true))) && (!k.is || !k.isBlockBoundary({br: 1})))a.document.createElement("br")[c ? "insertBefore" : "insertAfter"](j)
            }

            for (var f = CKEDITOR.plugins.list.listToArray(b.root, c), e = [], g = 0; g < b.contents.length; g++) {
                var h = b.contents[g];
                if ((h = h.getAscendant("li", true)) && !h.getCustomData("list_item_processed")) {
                    e.push(h);
                    CKEDITOR.dom.element.setMarker(c, h, "list_item_processed", true)
                }
            }
            h = null;
            for (g = 0; g < e.length; g++) {
                h = e[g].getCustomData("listarray_index");
                f[h].indent = -1
            }
            for (g = h + 1; g < f.length; g++)if (f[g].indent > f[g - 1].indent + 1) {
                e = f[g - 1].indent + 1 - f[g].indent;
                for (h = f[g].indent; f[g] && f[g].indent >= h;) {
                    f[g].indent = f[g].indent + e;
                    g++
                }
                g--
            }
            var i =
                CKEDITOR.plugins.list.arrayToList(f, c, null, a.config.enterMode, b.root.getAttribute("dir")).listNode, j, k;
            d(true);
            d();
            i.replace(b.root);
            a.fire("contentDomInvalidated")
        }

        function e(a, b) {
            this.name = a;
            this.context = this.type = b;
            this.allowedContent = b + " li";
            this.requiredContent = b
        }

        function b(a, b, c, d) {
            for (var f, g; f = a[d ? "getLast" : "getFirst"](p);) {
                (g = f.getDirection(1)) !== b.getDirection(1) && f.setAttribute("dir", g);
                f.remove();
                c ? f[d ? "insertBefore" : "insertAfter"](c) : b.append(f, d)
            }
        }

        function g(a) {
            function c(d) {
                var f = a[d ?
                    "getPrevious" : "getNext"](k);
                if (f && f.type == CKEDITOR.NODE_ELEMENT && f.is(a.getName())) {
                    b(a, f, null, !d);
                    a.remove();
                    a = f
                }
            }

            c();
            c(1)
        }

        function c(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in CKEDITOR.dtd.$block || a.getName() in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[a.getName()]["#"]
        }

        function d(a, c, d) {
            a.fire("saveSnapshot");
            d.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
            var f = d.extractContents();
            c.trim(false, true);
            var e = c.createBookmark(), h = new CKEDITOR.dom.elementPath(c.startContainer), j = h.block, h =
                h.lastElement.getAscendant("li", 1) || j, p = new CKEDITOR.dom.elementPath(d.startContainer), o = p.contains(CKEDITOR.dtd.$listItem), p = p.contains(CKEDITOR.dtd.$list);
            if (j)(j = j.getBogus()) && j.remove(); else if (p)(j = p.getPrevious(k)) && n(j) && j.remove();
            (j = f.getLast()) && (j.type == CKEDITOR.NODE_ELEMENT && j.is("br")) && j.remove();
            (j = c.startContainer.getChild(c.startOffset)) ? f.insertBefore(j) : c.startContainer.append(f);
            if (o)if (f = i(o))if (h.contains(o)) {
                b(f, o.getParent(), o);
                f.remove()
            } else h.append(f);
            for (; d.checkStartOfBlock() &&
                   d.checkEndOfBlock();) {
                p = d.startPath();
                f = p.block;
                if (!f)break;
                if (f.is("li")) {
                    h = f.getParent();
                    f.equals(h.getLast(k)) && f.equals(h.getFirst(k)) && (f = h)
                }
                d.moveToPosition(f, CKEDITOR.POSITION_BEFORE_START);
                f.remove()
            }
            d = d.clone();
            f = a.editable();
            d.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
            d = new CKEDITOR.dom.walker(d);
            d.evaluator = function (a) {
                return k(a) && !n(a)
            };
            (d = d.next()) && (d.type == CKEDITOR.NODE_ELEMENT && d.getName() in CKEDITOR.dtd.$list) && g(d);
            c.moveToBookmark(e);
            c.select();
            a.fire("saveSnapshot")
        }

        function i(a) {
            return (a =
                a.getLast(k)) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in f ? a : null
        }

        var f = {
            ol: 1,
            ul: 1
        }, h = CKEDITOR.dom.walker.whitespaces(), j = CKEDITOR.dom.walker.bookmark(), k = function (a) {
            return !(h(a) || j(a))
        }, n = CKEDITOR.dom.walker.bogus();
        CKEDITOR.plugins.list = {
            listToArray: function (a, b, c, d, g) {
                if (!f[a.getName()])return [];
                d || (d = 0);
                c || (c = []);
                for (var e = 0, h = a.getChildCount(); e < h; e++) {
                    var i = a.getChild(e);
                    i.type == CKEDITOR.NODE_ELEMENT && i.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(i, b, c, d + 1);
                    if (i.$.nodeName.toLowerCase() ==
                        "li") {
                        var j = {
                            parent: a,
                            indent: d,
                            element: i,
                            contents: []
                        };
                        if (g)j.grandparent = g; else {
                            j.grandparent = a.getParent();
                            if (j.grandparent && j.grandparent.$.nodeName.toLowerCase() == "li")j.grandparent = j.grandparent.getParent()
                        }
                        b && CKEDITOR.dom.element.setMarker(b, i, "listarray_index", c.length);
                        c.push(j);
                        for (var k = 0, n = i.getChildCount(), p; k < n; k++) {
                            p = i.getChild(k);
                            p.type == CKEDITOR.NODE_ELEMENT && f[p.getName()] ? CKEDITOR.plugins.list.listToArray(p, b, c, d + 1, j.grandparent) : j.contents.push(p)
                        }
                    }
                }
                return c
            }, arrayToList: function (a,
                                      b, c, d, g) {
                c || (c = 0);
                if (!a || a.length < c + 1)return null;
                for (var e, h = a[c].parent.getDocument(), i = new CKEDITOR.dom.documentFragment(h), n = null, p = c, o = Math.max(a[c].indent, 0), z = null, B, A, G = d == CKEDITOR.ENTER_P ? "p" : "div"; ;) {
                    var D = a[p];
                    e = D.grandparent;
                    B = D.element.getDirection(1);
                    if (D.indent == o) {
                        if (!n || a[p].parent.getName() != n.getName()) {
                            n = a[p].parent.clone(false, 1);
                            g && n.setAttribute("dir", g);
                            i.append(n)
                        }
                        z = n.append(D.element.clone(0, 1));
                        B != n.getDirection(1) && z.setAttribute("dir", B);
                        for (e = 0; e < D.contents.length; e++)z.append(D.contents[e].clone(1,
                            1));
                        p++
                    } else if (D.indent == Math.max(o, 0) + 1) {
                        D = a[p - 1].element.getDirection(1);
                        p = CKEDITOR.plugins.list.arrayToList(a, null, p, d, D != B ? B : null);
                        !z.getChildCount() && (CKEDITOR.env.needsNbspFiller && h.$.documentMode <= 7) && z.append(h.createText(" "));
                        z.append(p.listNode);
                        p = p.nextIndex
                    } else if (D.indent == -1 && !c && e) {
                        if (f[e.getName()]) {
                            z = D.element.clone(false, true);
                            B != e.getDirection(1) && z.setAttribute("dir", B)
                        } else z = new CKEDITOR.dom.documentFragment(h);
                        var n = e.getDirection(1) != B, J = D.element, C = J.getAttribute("class"),
                            F = J.getAttribute("style"), E = z.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (d != CKEDITOR.ENTER_BR || n || F || C), I, L = D.contents.length, H;
                        for (e = 0; e < L; e++) {
                            I = D.contents[e];
                            if (j(I) && L > 1)E ? H = I.clone(1, 1) : z.append(I.clone(1, 1)); else if (I.type == CKEDITOR.NODE_ELEMENT && I.isBlockBoundary()) {
                                n && !I.getDirection() && I.setAttribute("dir", B);
                                A = I;
                                var Q = J.getAttribute("style");
                                Q && A.setAttribute("style", Q.replace(/([^;])$/, "$1;") + (A.getAttribute("style") || ""));
                                C && I.addClass(C);
                                A = null;
                                if (H) {
                                    z.append(H);
                                    H = null
                                }
                                z.append(I.clone(1,
                                    1))
                            } else if (E) {
                                if (!A) {
                                    A = h.createElement(G);
                                    z.append(A);
                                    n && A.setAttribute("dir", B)
                                }
                                F && A.setAttribute("style", F);
                                C && A.setAttribute("class", C);
                                if (H) {
                                    A.append(H);
                                    H = null
                                }
                                A.append(I.clone(1, 1))
                            } else z.append(I.clone(1, 1))
                        }
                        if (H) {
                            (A || z).append(H);
                            H = null
                        }
                        if (z.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && p != a.length - 1) {
                            if (CKEDITOR.env.needsBrFiller)(B = z.getLast()) && (B.type == CKEDITOR.NODE_ELEMENT && B.is("br")) && B.remove();
                            B = z.getLast(k);
                            (!B || !(B.type == CKEDITOR.NODE_ELEMENT && B.is(CKEDITOR.dtd.$block))) && z.append(h.createElement("br"))
                        }
                        B =
                            z.$.nodeName.toLowerCase();
                        (B == "div" || B == "p") && z.appendBogus();
                        i.append(z);
                        n = null;
                        p++
                    } else return null;
                    A = null;
                    if (a.length <= p || Math.max(a[p].indent, 0) < o)break
                }
                if (b)for (a = i.getFirst(); a;) {
                    if (a.type == CKEDITOR.NODE_ELEMENT) {
                        CKEDITOR.dom.element.clearMarkers(b, a);
                        if (a.getName() in CKEDITOR.dtd.$listItem) {
                            c = a;
                            h = g = d = void 0;
                            if (d = c.getDirection()) {
                                for (g = c.getParent(); g && !(h = g.getDirection());)g = g.getParent();
                                d == h && c.removeAttribute("dir")
                            }
                        }
                    }
                    a = a.getNextSourceNode()
                }
                return {listNode: i, nextIndex: p}
            }
        };
        var o = /^h[1-6]$/,
            p = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
        e.prototype = {
            exec: function (b) {
                this.refresh(b, b.elementPath());
                var c = b.config, d = b.getSelection(), e = d && d.getRanges();
                if (this.state == CKEDITOR.TRISTATE_OFF) {
                    var h = b.editable();
                    if (h.getFirst(k)) {
                        var i = e.length == 1 && e[0];
                        (c = i && i.getEnclosedNode()) && (c.is && this.type == c.getName()) && this.setState(CKEDITOR.TRISTATE_ON)
                    } else {
                        c.enterMode == CKEDITOR.ENTER_BR ? h.appendBogus() : e[0].fixBlock(1, c.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                        d.selectRanges(e)
                    }
                }
                for (var c =
                    d.createBookmarks(true), h = [], j = {}, e = e.createIterator(), n = 0; (i = e.getNextRange()) && ++n;) {
                    var p = i.getBoundaryNodes(), r = p.startNode, y = p.endNode;
                    r.type == CKEDITOR.NODE_ELEMENT && r.getName() == "td" && i.setStartAt(p.startNode, CKEDITOR.POSITION_AFTER_START);
                    y.type == CKEDITOR.NODE_ELEMENT && y.getName() == "td" && i.setEndAt(p.endNode, CKEDITOR.POSITION_BEFORE_END);
                    i = i.createIterator();
                    for (i.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; p = i.getNextParagraph();)if (!p.getCustomData("list_block")) {
                        CKEDITOR.dom.element.setMarker(j,
                            p, "list_block", 1);
                        for (var z = b.elementPath(p), r = z.elements, y = 0, z = z.blockLimit, B, A = r.length - 1; A >= 0 && (B = r[A]); A--)if (f[B.getName()] && z.contains(B)) {
                            z.removeCustomData("list_group_object_" + n);
                            if (r = B.getCustomData("list_group_object"))r.contents.push(p); else {
                                r = {root: B, contents: [p]};
                                h.push(r);
                                CKEDITOR.dom.element.setMarker(j, B, "list_group_object", r)
                            }
                            y = 1;
                            break
                        }
                        if (!y) {
                            y = z;
                            if (y.getCustomData("list_group_object_" + n))y.getCustomData("list_group_object_" + n).contents.push(p); else {
                                r = {root: y, contents: [p]};
                                CKEDITOR.dom.element.setMarker(j,
                                    y, "list_group_object_" + n, r);
                                h.push(r)
                            }
                        }
                    }
                }
                for (B = []; h.length > 0;) {
                    r = h.shift();
                    if (this.state == CKEDITOR.TRISTATE_OFF)if (f[r.root.getName()]) {
                        e = b;
                        n = r;
                        r = j;
                        i = B;
                        y = CKEDITOR.plugins.list.listToArray(n.root, r);
                        z = [];
                        for (p = 0; p < n.contents.length; p++) {
                            A = n.contents[p];
                            if ((A = A.getAscendant("li", true)) && !A.getCustomData("list_item_processed")) {
                                z.push(A);
                                CKEDITOR.dom.element.setMarker(r, A, "list_item_processed", true)
                            }
                        }
                        for (var A = n.root.getDocument(), G = void 0, D = void 0, p = 0; p < z.length; p++) {
                            var J = z[p].getCustomData("listarray_index"),
                                G = y[J].parent;
                            if (!G.is(this.type)) {
                                D = A.createElement(this.type);
                                G.copyAttributes(D, {start: 1, type: 1});
                                D.removeStyle("list-style-type");
                                y[J].parent = D
                            }
                        }
                        r = CKEDITOR.plugins.list.arrayToList(y, r, null, e.config.enterMode);
                        y = void 0;
                        z = r.listNode.getChildCount();
                        for (p = 0; p < z && (y = r.listNode.getChild(p)); p++)y.getName() == this.type && i.push(y);
                        r.listNode.replace(n.root);
                        e.fire("contentDomInvalidated")
                    } else {
                        y = b;
                        p = r;
                        i = B;
                        z = p.contents;
                        e = p.root.getDocument();
                        n = [];
                        if (z.length == 1 && z[0].equals(p.root)) {
                            r = e.createElement("div");
                            z[0].moveChildren && z[0].moveChildren(r);
                            z[0].append(r);
                            z[0] = r
                        }
                        p = p.contents[0].getParent();
                        for (A = 0; A < z.length; A++)p = p.getCommonAncestor(z[A].getParent());
                        G = y.config.useComputedState;
                        y = r = void 0;
                        G = G === void 0 || G;
                        for (A = 0; A < z.length; A++)for (D = z[A]; J = D.getParent();) {
                            if (J.equals(p)) {
                                n.push(D);
                                !y && D.getDirection() && (y = 1);
                                D = D.getDirection(G);
                                r !== null && (r = r && r != D ? null : D);
                                break
                            }
                            D = J
                        }
                        if (!(n.length < 1)) {
                            z = n[n.length - 1].getNext();
                            A = e.createElement(this.type);
                            i.push(A);
                            for (G = i = void 0; n.length;) {
                                i = n.shift();
                                G = e.createElement("li");
                                if (i.is("pre") || o.test(i.getName()) || i.getAttribute("contenteditable") == "false")i.appendTo(G); else {
                                    i.copyAttributes(G);
                                    if (r && i.getDirection()) {
                                        G.removeStyle("direction");
                                        G.removeAttribute("dir")
                                    }
                                    i.moveChildren(G);
                                    i.remove()
                                }
                                G.appendTo(A)
                            }
                            r && y && A.setAttribute("dir", r);
                            z ? A.insertBefore(z) : A.appendTo(p)
                        }
                    } else this.state == CKEDITOR.TRISTATE_ON && f[r.root.getName()] && a.call(this, b, r, j)
                }
                for (A = 0; A < B.length; A++)g(B[A]);
                CKEDITOR.dom.element.clearAllMarkers(j);
                d.selectBookmarks(c);
                b.focus()
            }, refresh: function (a,
                                  b) {
                var c = b.contains(f, 1), d = b.blockLimit || b.root;
                c && d.contains(c) ? this.setState(c.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
            }
        };
        CKEDITOR.plugins.add("list", {
            requires: "indentlist", init: function (a) {
                if (!a.blockless) {
                    a.addCommand("numberedlist", new e("numberedlist", "ol"));
                    a.addCommand("bulletedlist", new e("bulletedlist", "ul"));
                    if (a.ui.addButton) {
                        a.ui.addButton("NumberedList", {
                            label: a.lang.list.numberedlist,
                            command: "numberedlist",
                            directional: true,
                            toolbar: "list,10"
                        });
                        a.ui.addButton("BulletedList", {
                            label: a.lang.list.bulletedlist,
                            command: "bulletedlist",
                            directional: true,
                            toolbar: "list,20"
                        })
                    }
                    a.on("key", function (b) {
                        var e = b.data.domEvent.getKey(), g;
                        if (a.mode == "wysiwyg" && e in {8: 1, 46: 1}) {
                            var h = a.getSelection().getRanges()[0], j = h && h.startPath();
                            if (h && h.collapsed) {
                                var p = e == 8, o = a.editable(), v = new CKEDITOR.dom.walker(h.clone());
                                v.evaluator = function (a) {
                                    return k(a) && !n(a)
                                };
                                v.guard = function (a, b) {
                                    return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
                                };
                                e = h.clone();
                                if (p) {
                                    var r;
                                    if ((r = j.contains(f)) && h.checkBoundaryOfElement(r, CKEDITOR.START) && (r = r.getParent()) && r.is("li") && (r = i(r))) {
                                        g = r;
                                        r = r.getPrevious(k);
                                        e.moveToPosition(r && n(r) ? r : g, CKEDITOR.POSITION_BEFORE_START)
                                    } else {
                                        v.range.setStartAt(o, CKEDITOR.POSITION_AFTER_START);
                                        v.range.setEnd(h.startContainer, h.startOffset);
                                        if ((r = v.previous()) && r.type == CKEDITOR.NODE_ELEMENT && (r.getName() in f || r.is("li"))) {
                                            if (!r.is("li")) {
                                                v.range.selectNodeContents(r);
                                                v.reset();
                                                v.evaluator = c;
                                                r = v.previous()
                                            }
                                            g = r;
                                            e.moveToElementEditEnd(g);
                                            e.moveToPosition(e.endPath().block,
                                                CKEDITOR.POSITION_BEFORE_END)
                                        }
                                    }
                                    if (g) {
                                        d(a, e, h);
                                        b.cancel()
                                    } else if ((e = j.contains(f)) && h.checkBoundaryOfElement(e, CKEDITOR.START)) {
                                        g = e.getFirst(k);
                                        if (h.checkBoundaryOfElement(g, CKEDITOR.START)) {
                                            r = e.getPrevious(k);
                                            if (i(g)) {
                                                if (r) {
                                                    h.moveToElementEditEnd(r);
                                                    h.select()
                                                }
                                            } else a.execCommand("outdent");
                                            b.cancel()
                                        }
                                    }
                                } else if (g = j.contains("li")) {
                                    v.range.setEndAt(o, CKEDITOR.POSITION_BEFORE_END);
                                    o = (j = g.getLast(k)) && c(j) ? j : g;
                                    g = 0;
                                    if ((r = v.next()) && r.type == CKEDITOR.NODE_ELEMENT && r.getName() in f && r.equals(j)) {
                                        g = 1;
                                        r = v.next()
                                    } else h.checkBoundaryOfElement(o,
                                        CKEDITOR.END) && (g = 2);
                                    if (g && r) {
                                        h = h.clone();
                                        h.moveToElementEditStart(r);
                                        if (g == 2) {
                                            e.moveToPosition(e.endPath().block, CKEDITOR.POSITION_BEFORE_END);
                                            h.endPath().block && h.moveToPosition(h.endPath().block, CKEDITOR.POSITION_AFTER_START)
                                        }
                                        d(a, e, h);
                                        b.cancel()
                                    }
                                } else {
                                    v.range.setEndAt(o, CKEDITOR.POSITION_BEFORE_END);
                                    if ((r = v.next()) && r.type == CKEDITOR.NODE_ELEMENT && r.is(f)) {
                                        r = r.getFirst(k);
                                        if (j.block && h.checkStartOfBlock() && h.checkEndOfBlock()) {
                                            j.block.remove();
                                            h.moveToElementEditStart(r);
                                            h.select()
                                        } else if (i(r)) {
                                            h.moveToElementEditStart(r);
                                            h.select()
                                        } else {
                                            h = h.clone();
                                            h.moveToElementEditStart(r);
                                            d(a, e, h)
                                        }
                                        b.cancel()
                                    }
                                }
                                setTimeout(function () {
                                    a.selectionChange(1)
                                })
                            }
                        }
                    })
                }
            }
        })
    }(),function () {
        function a(a, b, c) {
            c = a.config.forceEnterMode || c;
            if (a.mode == "wysiwyg") {
                if (!b)b = a.activeEnterMode;
                if (!a.elementPath().isContextFor("p")) {
                    b = CKEDITOR.ENTER_BR;
                    c = 1
                }
                a.fire("saveSnapshot");
                b == CKEDITOR.ENTER_BR ? i(a, b, null, c) : f(a, b, null, c);
                a.fire("saveSnapshot")
            }
        }

        function e(a) {
            for (var a = a.getSelection().getRanges(true), b = a.length - 1; b > 0; b--)a[b].deleteContents();
            return a[0]
        }

        function b(a) {
            var b = a.startContainer.getAscendant(function (a) {
                return a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "true"
            }, true);
            if (a.root.equals(b))return a;
            b = new CKEDITOR.dom.range(b);
            b.moveToRange(a);
            return b
        }

        CKEDITOR.plugins.add("enterkey", {
            init: function (b) {
                b.addCommand("enter", {
                    modes: {wysiwyg: 1},
                    editorFocus: false,
                    exec: function (b) {
                        a(b)
                    }
                });
                b.addCommand("shiftEnter", {
                    modes: {wysiwyg: 1},
                    editorFocus: false,
                    exec: function (b) {
                        a(b, b.activeShiftEnterMode, 1)
                    }
                });
                b.setKeystroke([[13, "enter"],
                    [CKEDITOR.SHIFT + 13, "shiftEnter"]])
            }
        });
        var g = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {
            enterBlock: function (a, d, f, o) {
                if (f = f || e(a)) {
                    var f = b(f), p = f.document, m = f.checkStartOfBlock(), l = f.checkEndOfBlock(), q = a.elementPath(f.startContainer), s = q.block, t = d == CKEDITOR.ENTER_DIV ? "div" : "p", u;
                    if (m && l) {
                        if (s && (s.is("li") || s.getParent().is("li"))) {
                            s.is("li") || (s = s.getParent());
                            f = s.getParent();
                            u = f.getParent();
                            var o = !s.hasPrevious(), w = !s.hasNext(), t = a.getSelection(),
                                x = t.createBookmarks(), m = s.getDirection(1), l = s.getAttribute("class"), v = s.getAttribute("style"), r = u.getDirection(1) != m, a = a.enterMode != CKEDITOR.ENTER_BR || r || v || l;
                            if (u.is("li"))if (o || w) {
                                o && w && f.remove();
                                s[w ? "insertAfter" : "insertBefore"](u)
                            } else s.breakParent(u); else {
                                if (a) {
                                    if (q.block.is("li")) {
                                        u = p.createElement(d == CKEDITOR.ENTER_P ? "p" : "div");
                                        r && u.setAttribute("dir", m);
                                        v && u.setAttribute("style", v);
                                        l && u.setAttribute("class", l);
                                        s.moveChildren(u)
                                    } else u = q.block;
                                    if (o || w)u[o ? "insertBefore" : "insertAfter"](f);
                                    else {
                                        s.breakParent(f);
                                        u.insertAfter(f)
                                    }
                                } else {
                                    s.appendBogus(true);
                                    if (o || w)for (; p = s[o ? "getFirst" : "getLast"]();)p[o ? "insertBefore" : "insertAfter"](f); else for (s.breakParent(f); p = s.getLast();)p.insertAfter(f)
                                }
                                s.remove()
                            }
                            t.selectBookmarks(x);
                            return
                        }
                        if (s && s.getParent().is("blockquote")) {
                            s.breakParent(s.getParent());
                            s.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || s.getPrevious().remove();
                            s.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || s.getNext().remove();
                            f.moveToElementEditStart(s);
                            f.select();
                            return
                        }
                    } else if (s && s.is("pre") && !l) {
                        i(a, d, f, o);
                        return
                    }
                    if (m = f.splitBlock(t)) {
                        d = m.previousBlock;
                        s = m.nextBlock;
                        q = m.wasStartOfBlock;
                        a = m.wasEndOfBlock;
                        if (s) {
                            x = s.getParent();
                            if (x.is("li")) {
                                s.breakParent(x);
                                s.move(s.getNext(), 1)
                            }
                        } else if (d && (x = d.getParent()) && x.is("li")) {
                            d.breakParent(x);
                            x = d.getNext();
                            f.moveToElementEditStart(x);
                            d.move(d.getPrevious())
                        }
                        if (!q && !a) {
                            if (s.is("li")) {
                                u = f.clone();
                                u.selectNodeContents(s);
                                u = new CKEDITOR.dom.walker(u);
                                u.evaluator = function (a) {
                                    return !(c(a) || g(a) || a.type == CKEDITOR.NODE_ELEMENT &&
                                    a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
                                };
                                (x = u.next()) && (x.type == CKEDITOR.NODE_ELEMENT && x.is("ul", "ol")) && (CKEDITOR.env.needsBrFiller ? p.createElement("br") : p.createText(" ")).insertBefore(x)
                            }
                            s && f.moveToElementEditStart(s)
                        } else {
                            if (d) {
                                if (d.is("li") || !h.test(d.getName()) && !d.is("pre"))u = d.clone()
                            } else s && (u = s.clone());
                            if (u)o && !u.is("li") && u.renameNode(t); else if (x && x.is("li"))u = x; else {
                                u = p.createElement(t);
                                d && (w = d.getDirection()) && u.setAttribute("dir", w)
                            }
                            if (p = m.elementPath) {
                                o =
                                    0;
                                for (t = p.elements.length; o < t; o++) {
                                    x = p.elements[o];
                                    if (x.equals(p.block) || x.equals(p.blockLimit))break;
                                    if (CKEDITOR.dtd.$removeEmpty[x.getName()]) {
                                        x = x.clone();
                                        u.moveChildren(x);
                                        u.append(x)
                                    }
                                }
                            }
                            u.appendBogus();
                            u.getParent() || f.insertNode(u);
                            u.is("li") && u.removeAttribute("value");
                            if (CKEDITOR.env.ie && q && (!a || !d.getChildCount())) {
                                f.moveToElementEditStart(a ? d : u);
                                f.select()
                            }
                            f.moveToElementEditStart(q && !a ? s : u)
                        }
                        f.select();
                        f.scrollIntoView()
                    }
                }
            }, enterBr: function (a, b, c, d) {
                if (c = c || e(a)) {
                    var g = c.document, i = c.checkEndOfBlock(),
                        l = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()), q = l.block, s = q && l.block.getName();
                    if (!d && s == "li")f(a, b, c, d); else {
                        if (!d && i && h.test(s))if (i = q.getDirection()) {
                            g = g.createElement("div");
                            g.setAttribute("dir", i);
                            g.insertAfter(q);
                            c.setStart(g, 0)
                        } else {
                            g.createElement("br").insertAfter(q);
                            CKEDITOR.env.gecko && g.createText("").insertAfter(q);
                            c.setStartAt(q.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)
                        } else {
                            a = s == "pre" && CKEDITOR.env.ie && CKEDITOR.env.version <
                            8 ? g.createText("\r") : g.createElement("br");
                            c.deleteContents();
                            c.insertNode(a);
                            if (CKEDITOR.env.needsBrFiller) {
                                g.createText("﻿").insertAfter(a);
                                i && (q || l.blockLimit).appendBogus();
                                a.getNext().$.nodeValue = "";
                                c.setStartAt(a.getNext(), CKEDITOR.POSITION_AFTER_START)
                            } else c.setStartAt(a, CKEDITOR.POSITION_AFTER_END)
                        }
                        c.collapse(true);
                        c.select();
                        c.scrollIntoView()
                    }
                }
            }
        };
        var d = CKEDITOR.plugins.enterkey, i = d.enterBr, f = d.enterBlock, h = /^h[1-6]$/
    }(),function () {
        function a(a, b) {
            var g = {}, c = [], d = {
                nbsp: " ", shy: "­", gt: ">",
                lt: "<", amp: "&", apos: "'", quot: '"'
            }, a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function (a, f) {
                var e = b ? "&" + f + ";" : d[f];
                g[e] = b ? d[f] : "&" + f + ";";
                c.push(e);
                return ""
            });
            if (!b && a) {
                var a = a.split(","), i = document.createElement("div"), f;
                i.innerHTML = "&" + a.join(";&") + ";";
                f = i.innerHTML;
                i = null;
                for (i = 0; i < f.length; i++) {
                    var h = f.charAt(i);
                    g[h] = "&" + a[i] + ";";
                    c.push(h)
                }
            }
            g.regex = c.join(b ? "|" : "");
            return g
        }

        CKEDITOR.plugins.add("entities", {
            afterInit: function (e) {
                function b(a) {
                    return h[a]
                }

                function g(a) {
                    return c.entities_processNumerical ==
                    "force" || !i[a] ? "&#" + a.charCodeAt(0) + ";" : i[a]
                }

                var c = e.config;
                if (e = (e = e.dataProcessor) && e.htmlFilter) {
                    var d = [];
                    c.basicEntities !== false && d.push("nbsp,gt,lt,amp");
                    if (c.entities) {
                        d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
                        c.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
                        c.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
                        c.entities_additional && d.push(c.entities_additional)
                    }
                    var i = a(d.join(",")), f = i.regex ? "[" + i.regex + "]" : "a^";
                    delete i.regex;
                    c.entities && c.entities_processNumerical && (f = "[^ -~]|" + f);
                    var f = RegExp(f, "g"), h = a("nbsp,gt,lt,amp,shy", true), j = RegExp(h.regex, "g");
                    e.addRules({
                        text: function (a) {
                            return a.replace(j, b).replace(f, g)
                        }
                    }, {applyToAll: true, excludeNestedEditable: true})
                }
            }
        })
    }(),CKEDITOR.config.basicEntities = !0,CKEDITOR.config.entities = !0,CKEDITOR.config.entities_latin = !0,CKEDITOR.config.entities_greek = !0,CKEDITOR.config.entities_additional =
        "#39",CKEDITOR.plugins.add("popup"),CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        popup: function (a, e, b, g) {
            e = e || "80%";
            b = b || "70%";
            typeof e == "string" && (e.length > 1 && e.substr(e.length - 1, 1) == "%") && (e = parseInt(window.screen.width * parseInt(e, 10) / 100, 10));
            typeof b == "string" && (b.length > 1 && b.substr(b.length - 1, 1) == "%") && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
            e < 640 && (e = 640);
            b < 420 && (b = 420);
            var c = parseInt((window.screen.height - b) / 2, 10), d = parseInt((window.screen.width - e) / 2, 10), g = (g || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") +
                ",width=" + e + ",height=" + b + ",top=" + c + ",left=" + d, i = window.open("", null, g, true);
            if (!i)return false;
            try {
                if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
                    i.moveTo(d, c);
                    i.resizeTo(e, b)
                }
                i.focus();
                i.location.href = a
            } catch (f) {
                window.open(a, null, g, true)
            }
            return true
        }
    }),function () {
        function a(a, b) {
            var c = [];
            if (b)for (var d in b)c.push(d + "=" + encodeURIComponent(b[d])); else return a;
            return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&")
        }

        function e(a) {
            a = a + "";
            return a.charAt(0).toUpperCase() + a.substr(1)
        }

        function b() {
            var b =
                this.getDialog(), c = b.getParentEditor();
            c._.filebrowserSe = this;
            var d = c.config["filebrowser" + e(b.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%", b = c.config["filebrowser" + e(b.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%", f = this.filebrowser.params || {};
            f.CKEditor = c.name;
            f.CKEditorFuncNum = c._.filebrowserFn;
            if (!f.langCode)f.langCode = c.langCode;
            f = a(this.filebrowser.url, f);
            c.popup(f, d, b, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
        }

        function g() {
            var a =
                this.getDialog();
            a.getParentEditor()._.filebrowserSe = this;
            return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true
        }

        function c(b, c, d) {
            var f = d.params || {};
            f.CKEditor = b.name;
            f.CKEditorFuncNum = b._.filebrowserFn;
            if (!f.langCode)f.langCode = b.langCode;
            c.action = a(d.url, f);
            c.filebrowser = d
        }

        function d(a, f, i, n) {
            if (n && n.length)for (var o, p = n.length; p--;) {
                o = n[p];
                (o.type == "hbox" || o.type == "vbox" || o.type == "fieldset") &&
                d(a, f, i, o.children);
                if (o.filebrowser) {
                    if (typeof o.filebrowser == "string")o.filebrowser = {
                        action: o.type == "fileButton" ? "QuickUpload" : "Browse",
                        target: o.filebrowser
                    };
                    if (o.filebrowser.action == "Browse") {
                        var m = o.filebrowser.url;
                        if (m === void 0) {
                            m = a.config["filebrowser" + e(f) + "BrowseUrl"];
                            if (m === void 0)m = a.config.filebrowserBrowseUrl
                        }
                        if (m) {
                            o.onClick = b;
                            o.filebrowser.url = m;
                            o.hidden = false
                        }
                    } else if (o.filebrowser.action == "QuickUpload" && o["for"]) {
                        m = o.filebrowser.url;
                        if (m === void 0) {
                            m = a.config["filebrowser" + e(f) + "UploadUrl"];
                            if (m === void 0)m = a.config.filebrowserUploadUrl
                        }
                        if (m) {
                            var l = o.onClick;
                            o.onClick = function (a) {
                                var b = a.sender;
                                return l && l.call(b, a) === false ? false : g.call(b, a)
                            };
                            o.filebrowser.url = m;
                            o.hidden = false;
                            c(a, i.getContents(o["for"][0]).get(o["for"][1]), o.filebrowser)
                        }
                    }
                }
            }
        }

        function i(a, b, c) {
            if (c.indexOf(";") !== -1) {
                for (var c = c.split(";"), d = 0; d < c.length; d++)if (i(a, b, c[d]))return true;
                return false
            }
            return (a = a.getContents(b).get(c).filebrowser) && a.url
        }

        function f(a, b) {
            var c = this._.filebrowserSe.getDialog(), d = this._.filebrowserSe["for"],
                f = this._.filebrowserSe.filebrowser.onSelect;
            d && c.getContentElement(d[0], d[1]).reset();
            if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(f && f.call(this._.filebrowserSe, a, b) === false)) {
                typeof b == "string" && b && alert(b);
                if (a) {
                    d = this._.filebrowserSe;
                    c = d.getDialog();
                    if (d = d.filebrowser.target || null) {
                        d = d.split(":");
                        if (f = c.getContentElement(d[0], d[1])) {
                            f.setValue(a);
                            c.selectPage(d[0])
                        }
                    }
                }
            }
        }

        CKEDITOR.plugins.add("filebrowser", {
            requires: "popup", init: function (a) {
                a._.filebrowserFn = CKEDITOR.tools.addFunction(f,
                    a);
                a.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(this._.filebrowserFn)
                })
            }
        });
        CKEDITOR.on("dialogDefinition", function (a) {
            if (a.editor.plugins.filebrowser)for (var b = a.data.definition, c, f = 0; f < b.contents.length; ++f)if (c = b.contents[f]) {
                d(a.editor, a.data.name, b, c.elements);
                if (c.hidden && c.filebrowser)c.hidden = !i(b, c.id, c.filebrowser)
            }
        })
    }(),function () {
        function a(a) {
            var c = a.config, d = a.fire("uiSpace", {
                space: "top",
                html: ""
            }).html, i = function () {
                function d(a, c, f) {
                    h.setStyle(c, b(f));
                    h.setStyle("position",
                        a)
                }

                function f(a) {
                    var b = k.getDocumentPosition();
                    switch (a) {
                        case "top":
                            d("absolute", "top", b.y - t - x);
                            break;
                        case "pin":
                            d("fixed", "top", r);
                            break;
                        case "bottom":
                            d("absolute", "top", b.y + (q.height || q.bottom - q.top) + x)
                    }
                    j = a
                }

                var j, k, l, q, s, t, u, w = c.floatSpaceDockedOffsetX || 0, x = c.floatSpaceDockedOffsetY || 0, v = c.floatSpacePinnedOffsetX || 0, r = c.floatSpacePinnedOffsetY || 0;
                return function (c) {
                    if (k = a.editable()) {
                        c && c.name == "focus" && h.show();
                        h.removeStyle("left");
                        h.removeStyle("right");
                        l = h.getClientRect();
                        q = k.getClientRect();
                        s = e.getViewPaneSize();
                        t = l.height;
                        u = "pageXOffset" in e.$ ? e.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
                        if (j) {
                            t + x <= q.top ? f("top") : t + x > s.height - q.bottom ? f("pin") : f("bottom");
                            var c = s.width / 2, c = q.left > 0 && q.right < s.width && q.width > l.width ? a.config.contentsLangDirection == "rtl" ? "right" : "left" : c - q.left > q.right - c ? "left" : "right", d;
                            if (l.width > s.width) {
                                c = "left";
                                d = 0
                            } else {
                                d = c == "left" ? q.left > 0 ? q.left : 0 : q.right < s.width ? s.width - q.right : 0;
                                if (d + l.width > s.width) {
                                    c = c == "left" ? "right" : "left";
                                    d = 0
                                }
                            }
                            h.setStyle(c,
                                b((j == "pin" ? v : w) + d + (j == "pin" ? 0 : c == "left" ? u : -u)))
                        } else {
                            j = "pin";
                            f("pin");
                            i(c)
                        }
                    }
                }
            }();
            if (d) {
                var f = new CKEDITOR.template('<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : " ") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' :
                        " ") + '<div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'), h = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(f.output({
                    content: d,
                    id: a.id,
                    langDir: a.lang.dir,
                    langCode: a.langCode,
                    name: a.name,
                    style: "display:none;z-index:" + (c.baseFloatZIndex - 1),
                    topId: a.ui.spaceId("top"),
                    voiceLabel: a.title
                }))), j = CKEDITOR.tools.eventsBuffer(500, i), k = CKEDITOR.tools.eventsBuffer(100, i);
                h.unselectable();
                h.on("mousedown", function (a) {
                    a = a.data;
                    a.getTarget().hasAscendant("a",
                        1) || a.preventDefault()
                });
                a.on("focus", function (b) {
                    i(b);
                    a.on("change", j.input);
                    e.on("scroll", k.input);
                    e.on("resize", k.input)
                });
                a.on("blur", function () {
                    h.hide();
                    a.removeListener("change", j.input);
                    e.removeListener("scroll", k.input);
                    e.removeListener("resize", k.input)
                });
                a.on("destroy", function () {
                    e.removeListener("scroll", k.input);
                    e.removeListener("resize", k.input);
                    h.clearCustomData();
                    h.remove()
                });
                a.focusManager.hasFocus && h.show();
                a.focusManager.add(h, 1)
            }
        }

        var e = CKEDITOR.document.getWindow(), b = CKEDITOR.tools.cssLength;
        CKEDITOR.plugins.add("floatingspace", {
            init: function (b) {
                b.on("loaded", function () {
                    a(this)
                }, null, null, 20)
            }
        })
    }(),CKEDITOR.plugins.add("listblock", {
        requires: "panel", onLoad: function () {
            var a = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'), e = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
                b = CKEDITOR.addTemplate("panel-list-group", '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>'), g = /\'/g;
            CKEDITOR.ui.panel.prototype.addListBlock = function (a, b) {
                return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
            };
            CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.panel.block, $: function (a, b) {
                    var b = b || {}, e = b.attributes || (b.attributes = {});
                    (this.multiSelect = !!b.multiSelect) && (e["aria-multiselectable"] = true);
                    !e.role && (e.role = "listbox");
                    this.base.apply(this, arguments);
                    this.element.setAttribute("role", e.role);
                    e = this.keys;
                    e[40] = "next";
                    e[9] = "next";
                    e[38] = "prev";
                    e[CKEDITOR.SHIFT + 9] = "prev";
                    e[32] = CKEDITOR.env.ie ? "mouseup" : "click";
                    CKEDITOR.env.ie && (e[13] = "mouseup");
                    this._.pendingHtml = [];
                    this._.pendingList = [];
                    this._.items = {};
                    this._.groups = {}
                }, _: {
                    close: function () {
                        if (this._.started) {
                            var b = a.output({items: this._.pendingList.join("")});
                            this._.pendingList = [];
                            this._.pendingHtml.push(b);
                            delete this._.started
                        }
                    }, getClick: function () {
                        if (!this._.click)this._.click =
                            CKEDITOR.tools.addFunction(function (a) {
                                var b = this.toggle(a);
                                if (this.onClick)this.onClick(a, b)
                            }, this);
                        return this._.click
                    }
                }, proto: {
                    add: function (a, b, i) {
                        var f = CKEDITOR.tools.getNextId();
                        if (!this._.started) {
                            this._.started = 1;
                            this._.size = this._.size || 0
                        }
                        this._.items[a] = f;
                        var h;
                        h = CKEDITOR.tools.htmlEncodeAttr(a).replace(g, "\\'");
                        a = {
                            id: f,
                            val: h,
                            onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick",
                            clickFn: this._.getClick(),
                            title: CKEDITOR.tools.htmlEncodeAttr(i || a),
                            text: b || a
                        };
                        this._.pendingList.push(e.output(a))
                    },
                    startGroup: function (a) {
                        this._.close();
                        var d = CKEDITOR.tools.getNextId();
                        this._.groups[a] = d;
                        this._.pendingHtml.push(b.output({id: d, label: a}))
                    }, commit: function () {
                        this._.close();
                        this.element.appendHtml(this._.pendingHtml.join(""));
                        delete this._.size;
                        this._.pendingHtml = []
                    }, toggle: function (a) {
                        var b = this.isMarked(a);
                        b ? this.unmark(a) : this.mark(a);
                        return !b
                    }, hideGroup: function (a) {
                        var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
                        if (a) {
                            a.setStyle("display", "none");
                            b && b.getName() == "ul" &&
                            b.setStyle("display", "none")
                        }
                    }, hideItem: function (a) {
                        this.element.getDocument().getById(this._.items[a]).setStyle("display", "none")
                    }, showAll: function () {
                        var a = this._.items, b = this._.groups, e = this.element.getDocument(), f;
                        for (f in a)e.getById(a[f]).setStyle("display", "");
                        for (var g in b) {
                            a = e.getById(b[g]);
                            f = a.getNext();
                            a.setStyle("display", "");
                            f && f.getName() == "ul" && f.setStyle("display", "")
                        }
                    }, mark: function (a) {
                        this.multiSelect || this.unmarkAll();
                        var a = this._.items[a], b = this.element.getDocument().getById(a);
                        b.addClass("cke_selected");
                        this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", true);
                        this.onMark && this.onMark(b)
                    }, unmark: function (a) {
                        var b = this.element.getDocument(), a = this._.items[a], e = b.getById(a);
                        e.removeClass("cke_selected");
                        b.getById(a + "_option").removeAttribute("aria-selected");
                        this.onUnmark && this.onUnmark(e)
                    }, unmarkAll: function () {
                        var a = this._.items, b = this.element.getDocument(), e;
                        for (e in a) {
                            var f = a[e];
                            b.getById(f).removeClass("cke_selected");
                            b.getById(f + "_option").removeAttribute("aria-selected")
                        }
                        this.onUnmark &&
                        this.onUnmark()
                    }, isMarked: function (a) {
                        return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
                    }, focus: function (a) {
                        this._.focusIndex = -1;
                        var b = this.element.getElementsByTag("a"), e, f = -1;
                        if (a)for (e = this.element.getDocument().getById(this._.items[a]).getFirst(); a = b.getItem(++f);) {
                            if (a.equals(e)) {
                                this._.focusIndex = f;
                                break
                            }
                        } else this.element.focus();
                        e && setTimeout(function () {
                            e.focus()
                        }, 0)
                    }
                }
            })
        }
    }),function () {
        var a = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' +
            (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (a = a + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (a = a + ' onblur="this.style.cssText = this.style.cssText;"');
        var a = a + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
            (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'), a = a + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>', e = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"), b = CKEDITOR.addTemplate("button", a);
        CKEDITOR.plugins.add("button",
            {
                beforeInit: function (a) {
                    a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
                }
            });
        CKEDITOR.UI_BUTTON = "button";
        CKEDITOR.ui.button = function (a) {
            CKEDITOR.tools.extend(this, a, {
                title: a.label,
                click: a.click || function (b) {
                    b.execCommand(a.command)
                }
            });
            this._ = {}
        };
        CKEDITOR.ui.button.handler = {
            create: function (a) {
                return new CKEDITOR.ui.button(a)
            }
        };
        CKEDITOR.ui.button.prototype = {
            render: function (a, c) {
                function d() {
                    var b = a.mode;
                    if (b) {
                        b = this.modes[b] ? l[b] !== void 0 ? l[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                        b = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b;
                        this.setState(b);
                        this.refresh && this.refresh()
                    }
                }

                var i = CKEDITOR.env, f = this._.id = CKEDITOR.tools.getNextId(), h = "", j = this.command, k;
                this._.editor = a;
                var n = {
                    id: f, button: this, editor: a, focus: function () {
                        CKEDITOR.document.getById(f).focus()
                    }, execute: function () {
                        this.button.click(a)
                    }, attach: function (a) {
                        this.button.attach(a)
                    }
                }, o = CKEDITOR.tools.addFunction(function (a) {
                    if (n.onkey) {
                        a = new CKEDITOR.dom.event(a);
                        return n.onkey(n, a.getKeystroke()) !== false
                    }
                }), p =
                    CKEDITOR.tools.addFunction(function (a) {
                        var b;
                        n.onfocus && (b = n.onfocus(n, new CKEDITOR.dom.event(a)) !== false);
                        return b
                    }), m = 0;
                n.clickFn = k = CKEDITOR.tools.addFunction(function () {
                    if (m) {
                        a.unlockSelection(1);
                        m = 0
                    }
                    n.execute();
                    i.iOS && a.focus()
                });
                if (this.modes) {
                    var l = {};
                    a.on("beforeModeUnload", function () {
                        if (a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED)l[a.mode] = this._.state
                    }, this);
                    a.on("activeFilterChange", d, this);
                    a.on("mode", d, this);
                    !this.readOnly && a.on("readOnly", d, this)
                } else if (j)if (j = a.getCommand(j)) {
                    j.on("state",
                        function () {
                            this.setState(j.state)
                        }, this);
                    h = h + (j.state == CKEDITOR.TRISTATE_ON ? "on" : j.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off")
                }
                if (this.directional)a.on("contentDirChanged", function (b) {
                    var c = CKEDITOR.document.getById(this._.id), d = c.getFirst(), b = b.data;
                    b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
                    d.setAttribute("style", CKEDITOR.skin.getIconStyle(s, b == "rtl", this.icon, this.iconOffset))
                }, this);
                j || (h = h + "off");
                var q = this.name || this.command, s = q;
                if (this.icon && !/\./.test(this.icon)) {
                    s = this.icon;
                    this.icon = null
                }
                h = {
                    id: f,
                    name: q,
                    iconName: s,
                    label: this.label,
                    cls: this.className || "",
                    state: h,
                    ariaDisabled: h == "disabled" ? "true" : "false",
                    title: this.title,
                    titleJs: i.gecko && !i.hc ? "" : (this.title || "").replace("'", ""),
                    hasArrow: this.hasArrow ? "true" : "false",
                    keydownFn: o,
                    focusFn: p,
                    clickFn: k,
                    style: CKEDITOR.skin.getIconStyle(s, a.lang.dir == "rtl", this.icon, this.iconOffset),
                    arrowHtml: this.hasArrow ? e.output() : ""
                };
                b.output(h, c);
                if (this.onRender)this.onRender();
                return n
            }, setState: function (a) {
                if (this._.state ==
                    a)return false;
                this._.state = a;
                var b = CKEDITOR.document.getById(this._.id);
                if (b) {
                    b.setState(a, "cke_button");
                    a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", true) : b.removeAttribute("aria-disabled");
                    if (this.hasArrow) {
                        a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label;
                        CKEDITOR.document.getById(this._.id + "_label").setText(a)
                    } else a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", true) : b.removeAttribute("aria-pressed");
                    return true
                }
                return false
            },
            getState: function () {
                return this._.state
            }, toFeature: function (a) {
                if (this._.feature)return this._.feature;
                var b = this;
                !this.allowedContent && (!this.requiredContent && this.command) && (b = a.getCommand(this.command) || b);
                return this._.feature = b
            }
        };
        CKEDITOR.ui.prototype.addButton = function (a, b) {
            this.add(a, CKEDITOR.UI_BUTTON, b)
        }
    }(),CKEDITOR.plugins.add("richcombo", {
        requires: "floatpanel,listblock,button",
        beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
        }
    }),function () {
        var a =
            '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (a = a + ' onkeypress="return false;"');
        CKEDITOR.env.gecko && (a = a + ' onblur="this.style.cssText = this.style.cssText;"');
        var a = a + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"),
            e = CKEDITOR.addTemplate("combo", a);
        CKEDITOR.UI_RICHCOMBO = "richcombo";
        CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
            $: function (a) {
                CKEDITOR.tools.extend(this, a, {
                    canGroup: false,
                    title: a.label,
                    modes: {wysiwyg: 1},
                    editorFocus: 1
                });
                a = this.panel || {};
                delete this.panel;
                this.id = CKEDITOR.tools.getNextNumber();
                this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
                a.className = "cke_combopanel";
                a.block = {
                    multiSelect: a.multiSelect,
                    attributes: a.attributes
                };
                a.toolbarRelated = true;
                this._ = {
                    panelDefinition: a,
                    items: {}
                }
            }, proto: {
                renderHtml: function (a) {
                    var e = [];
                    this.render(a, e);
                    return e.join("")
                }, render: function (a, g) {
                    function c() {
                        if (this.getState() != CKEDITOR.TRISTATE_ON) {
                            var c = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                            if (a.readOnly && !this.readOnly)c = CKEDITOR.TRISTATE_DISABLED;
                            this.setState(c);
                            this.setValue("");
                            c != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh()
                        }
                    }

                    var d = CKEDITOR.env, i = "cke_" + this.id, f = CKEDITOR.tools.addFunction(function (c) {
                            if (o) {
                                a.unlockSelection(1);
                                o = 0
                            }
                            j.execute(c)
                        },
                        this), h = this, j = {
                        id: i,
                        combo: this,
                        focus: function () {
                            CKEDITOR.document.getById(i).getChild(1).focus()
                        },
                        execute: function (c) {
                            var d = h._;
                            if (d.state != CKEDITOR.TRISTATE_DISABLED) {
                                h.createPanel(a);
                                if (d.on)d.panel.hide(); else {
                                    h.commit();
                                    var f = h.getValue();
                                    f ? d.list.mark(f) : d.list.unmarkAll();
                                    d.panel.showBlock(h.id, new CKEDITOR.dom.element(c), 4)
                                }
                            }
                        },
                        clickFn: f
                    };
                    a.on("activeFilterChange", c, this);
                    a.on("mode", c, this);
                    a.on("selectionChange", c, this);
                    !this.readOnly && a.on("readOnly", c, this);
                    var k = CKEDITOR.tools.addFunction(function (c,
                                                                 d) {
                        var c = new CKEDITOR.dom.event(c), e = c.getKeystroke();
                        if (e == 40)a.once("panelShow", function (a) {
                            a.data._.panel._.currentBlock.onKeyDown(40)
                        });
                        switch (e) {
                            case 13:
                            case 32:
                            case 40:
                                CKEDITOR.tools.callFunction(f, d);
                                break;
                            default:
                                j.onkey(j, e)
                        }
                        c.preventDefault()
                    }), n = CKEDITOR.tools.addFunction(function () {
                        j.onfocus && j.onfocus()
                    }), o = 0;
                    j.keyDownFn = k;
                    d = {
                        id: i,
                        name: this.name || this.command,
                        label: this.label,
                        title: this.title,
                        cls: this.className || "",
                        titleJs: d.gecko && !d.hc ? "" : (this.title || "").replace("'", ""),
                        keydownFn: k,
                        focusFn: n,
                        clickFn: f
                    };
                    e.output(d, g);
                    if (this.onRender)this.onRender();
                    return j
                }, createPanel: function (a) {
                    if (!this._.panel) {
                        var e = this._.panelDefinition, c = this._.panelDefinition.block, d = e.parent || CKEDITOR.document.getBody(), i = "cke_combopanel__" + this.name, f = new CKEDITOR.ui.floatPanel(a, d, e), h = f.addListBlock(this.id, c), j = this;
                        f.onShow = function () {
                            this.element.addClass(i);
                            j.setState(CKEDITOR.TRISTATE_ON);
                            j._.on = 1;
                            j.editorFocus && !a.focusManager.hasFocus && a.focus();
                            if (j.onOpen)j.onOpen();
                            a.once("panelShow",
                                function () {
                                    h.focus(!h.multiSelect && j.getValue())
                                })
                        };
                        f.onHide = function (c) {
                            this.element.removeClass(i);
                            j.setState(j.modes && j.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                            j._.on = 0;
                            if (!c && j.onClose)j.onClose()
                        };
                        f.onEscape = function () {
                            f.hide(1)
                        };
                        h.onClick = function (a, b) {
                            j.onClick && j.onClick.call(j, a, b);
                            f.hide()
                        };
                        this._.panel = f;
                        this._.list = h;
                        f.getBlock(this.id).onHide = function () {
                            j._.on = 0;
                            j.setState(CKEDITOR.TRISTATE_OFF)
                        };
                        this.init && this.init()
                    }
                }, setValue: function (a, e) {
                    this._.value = a;
                    var c =
                        this.document.getById("cke_" + this.id + "_text");
                    if (c) {
                        if (!a && !e) {
                            e = this.label;
                            c.addClass("cke_combo_inlinelabel")
                        } else c.removeClass("cke_combo_inlinelabel");
                        c.setText(typeof e != "undefined" ? e : a)
                    }
                }, getValue: function () {
                    return this._.value || ""
                }, unmarkAll: function () {
                    this._.list.unmarkAll()
                }, mark: function (a) {
                    this._.list.mark(a)
                }, hideItem: function (a) {
                    this._.list.hideItem(a)
                }, hideGroup: function (a) {
                    this._.list.hideGroup(a)
                }, showAll: function () {
                    this._.list.showAll()
                }, add: function (a, e, c) {
                    this._.items[a] = c || a;
                    this._.list.add(a, e, c)
                }, startGroup: function (a) {
                    this._.list.startGroup(a)
                }, commit: function () {
                    if (!this._.committed) {
                        this._.list.commit();
                        this._.committed = 1;
                        CKEDITOR.ui.fire("ready", this)
                    }
                    this._.committed = 1
                }, setState: function (a) {
                    if (this._.state != a) {
                        var e = this.document.getById("cke_" + this.id);
                        e.setState(a, "cke_combo");
                        a == CKEDITOR.TRISTATE_DISABLED ? e.setAttribute("aria-disabled", true) : e.removeAttribute("aria-disabled");
                        this._.state = a
                    }
                }, getState: function () {
                    return this._.state
                }, enable: function () {
                    this._.state ==
                    CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
                }, disable: function () {
                    if (this._.state != CKEDITOR.TRISTATE_DISABLED) {
                        this._.lastState = this._.state;
                        this.setState(CKEDITOR.TRISTATE_DISABLED)
                    }
                }
            }, statics: {
                handler: {
                    create: function (a) {
                        return new CKEDITOR.ui.richCombo(a)
                    }
                }
            }
        });
        CKEDITOR.ui.prototype.addRichCombo = function (a, e) {
            this.add(a, CKEDITOR.UI_RICHCOMBO, e)
        }
    }(),CKEDITOR.plugins.add("format", {
        requires: "richcombo", init: function (a) {
            if (!a.blockless) {
                for (var e = a.config, b = a.lang.format, g = e.format_tags.split(";"),
                         c = {}, d = 0, i = [], f = 0; f < g.length; f++) {
                    var h = g[f], j = new CKEDITOR.style(e["format_" + h]);
                    if (!a.filter.customConfig || a.filter.check(j)) {
                        d++;
                        c[h] = j;
                        c[h]._.enterMode = a.config.enterMode;
                        i.push(j)
                    }
                }
                d !== 0 && a.ui.addRichCombo("Format", {
                    label: b.label,
                    title: b.panelTitle,
                    toolbar: "styles,20",
                    allowedContent: i,
                    panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(e.contentsCss),
                        multiSelect: false,
                        attributes: {"aria-label": b.panelTitle}
                    },
                    init: function () {
                        this.startGroup(b.panelTitle);
                        for (var a in c) {
                            var d = b["tag_" + a];
                            this.add(a,
                                c[a].buildPreview(d), d)
                        }
                    },
                    onClick: function (b) {
                        a.focus();
                        a.fire("saveSnapshot");
                        var b = c[b], d = a.elementPath();
                        a[b.checkActive(d, a) ? "removeStyle" : "applyStyle"](b);
                        setTimeout(function () {
                            a.fire("saveSnapshot")
                        }, 0)
                    },
                    onRender: function () {
                        a.on("selectionChange", function (b) {
                            var d = this.getValue(), b = b.data.path;
                            this.refresh();
                            for (var f in c)if (c[f].checkActive(b, a)) {
                                f != d && this.setValue(f, a.lang.format["tag_" + f]);
                                return
                            }
                            this.setValue("")
                        }, this)
                    },
                    onOpen: function () {
                        this.showAll();
                        for (var b in c)a.activeFilter.check(c[b]) ||
                        this.hideItem(b)
                    },
                    refresh: function () {
                        var b = a.elementPath();
                        if (b) {
                            if (b.isContextFor("p"))for (var d in c)if (a.activeFilter.check(c[d]))return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    }
                })
            }
        }
    }),CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div",CKEDITOR.config.format_p = {element: "p"},CKEDITOR.config.format_div = {element: "div"},CKEDITOR.config.format_pre = {element: "pre"},CKEDITOR.config.format_address = {element: "address"},CKEDITOR.config.format_h1 = {element: "h1"},CKEDITOR.config.format_h2 = {element: "h2"},
    CKEDITOR.config.format_h3 = {element: "h3"},CKEDITOR.config.format_h4 = {element: "h4"},CKEDITOR.config.format_h5 = {element: "h5"},CKEDITOR.config.format_h6 = {element: "h6"},function () {
        var a = {
            canUndo: false, exec: function (a) {
                var b = a.document.createElement("hr");
                a.insertElement(b)
            }, allowedContent: "hr", requiredContent: "hr"
        };
        CKEDITOR.plugins.add("horizontalrule", {
            init: function (e) {
                if (!e.blockless) {
                    e.addCommand("horizontalrule", a);
                    e.ui.addButton && e.ui.addButton("HorizontalRule", {
                        label: e.lang.horizontalrule.toolbar,
                        command: "horizontalrule", toolbar: "insert,40"
                    })
                }
            }
        })
    }(),CKEDITOR.plugins.add("htmlwriter", {
        init: function (a) {
            var e = new CKEDITOR.htmlWriter;
            e.forceSimpleAmpersand = a.config.forceSimpleAmpersand;
            e.indentationChars = a.config.dataIndentationChars || "\t";
            a.dataProcessor.writer = e
        }
    }),CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
        base: CKEDITOR.htmlParser.basicWriter, $: function () {
            this.base();
            this.indentationChars = "\t";
            this.selfClosingEnd = " />";
            this.lineBreakChars = "\n";
            this.sortAttributes = 1;
            this._.indent = 0;
            this._.indentation =
                "";
            this._.inPre = 0;
            this._.rules = {};
            var a = CKEDITOR.dtd, e;
            for (e in CKEDITOR.tools.extend({}, a.$nonBodyContent, a.$block, a.$listItem, a.$tableContent))this.setRules(e, {
                indent: !a[e]["#"],
                breakBeforeOpen: 1,
                breakBeforeClose: !a[e]["#"],
                breakAfterClose: 1,
                needsSpace: e in a.$block && !(e in {li: 1, dt: 1, dd: 1})
            });
            this.setRules("br", {breakAfterOpen: 1});
            this.setRules("title", {indent: 0, breakAfterOpen: 0});
            this.setRules("style", {indent: 0, breakBeforeClose: 1});
            this.setRules("pre", {breakAfterOpen: 1, indent: 0})
        }, proto: {
            openTag: function (a) {
                var e =
                    this._.rules[a];
                this._.afterCloser && (e && e.needsSpace && this._.needsSpace) && this._.output.push("\n");
                if (this._.indent)this.indentation(); else if (e && e.breakBeforeOpen) {
                    this.lineBreak();
                    this.indentation()
                }
                this._.output.push("<", a);
                this._.afterCloser = 0
            }, openTagClose: function (a, e) {
                var b = this._.rules[a];
                if (e) {
                    this._.output.push(this.selfClosingEnd);
                    if (b && b.breakAfterClose)this._.needsSpace = b.needsSpace
                } else {
                    this._.output.push(">");
                    if (b && b.indent)this._.indentation = this._.indentation + this.indentationChars
                }
                b &&
                b.breakAfterOpen && this.lineBreak();
                a == "pre" && (this._.inPre = 1)
            }, attribute: function (a, e) {
                if (typeof e == "string") {
                    this.forceSimpleAmpersand && (e = e.replace(/&amp;/g, "&"));
                    e = CKEDITOR.tools.htmlEncodeAttr(e)
                }
                this._.output.push(" ", a, '="', e, '"')
            }, closeTag: function (a) {
                var e = this._.rules[a];
                if (e && e.indent)this._.indentation = this._.indentation.substr(this.indentationChars.length);
                if (this._.indent)this.indentation(); else if (e && e.breakBeforeClose) {
                    this.lineBreak();
                    this.indentation()
                }
                this._.output.push("</", a, ">");
                a == "pre" && (this._.inPre = 0);
                if (e && e.breakAfterClose) {
                    this.lineBreak();
                    this._.needsSpace = e.needsSpace
                }
                this._.afterCloser = 1
            }, text: function (a) {
                if (this._.indent) {
                    this.indentation();
                    !this._.inPre && (a = CKEDITOR.tools.ltrim(a))
                }
                this._.output.push(a)
            }, comment: function (a) {
                this._.indent && this.indentation();
                this._.output.push("<\!--", a, "--\>")
            }, lineBreak: function () {
                !this._.inPre && this._.output.length > 0 && this._.output.push(this.lineBreakChars);
                this._.indent = 1
            }, indentation: function () {
                !this._.inPre && this._.indentation &&
                this._.output.push(this._.indentation);
                this._.indent = 0
            }, reset: function () {
                this._.output = [];
                this._.indent = 0;
                this._.indentation = "";
                this._.afterCloser = 0;
                this._.inPre = 0
            }, setRules: function (a, e) {
                var b = this._.rules[a];
                b ? CKEDITOR.tools.extend(b, e, true) : this._.rules[a] = e
            }
        }
    }),function () {
        function a(a, e) {
            e || (e = a.getSelection().getSelectedElement());
            if (e && e.is("img") && !e.data("cke-realelement") && !e.isReadOnly())return e
        }

        function e(a) {
            var e = a.getStyle("float");
            if (e == "inherit" || e == "none")e = 0;
            e || (e = a.getAttribute("align"));
            return e
        }

        CKEDITOR.plugins.add("image", {
            requires: "dialog", init: function (b) {
                if (!b.plugins.image2) {
                    CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
                    var e = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
                    CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (e = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
                    b.addCommand("image", new CKEDITOR.dialogCommand("image", {
                        allowedContent: e,
                        requiredContent: "img[alt,src]",
                        contentTransformations: [["img{width}: sizeToStyle",
                            "img[width]: sizeToAttribute"], ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]]
                    }));
                    b.ui.addButton && b.ui.addButton("Image", {
                        label: b.lang.common.image,
                        command: "image",
                        toolbar: "insert,10"
                    });
                    b.on("doubleclick", function (a) {
                        var b = a.data.element;
                        if (b.is("img") && !b.data("cke-realelement") && !b.isReadOnly())a.data.dialog = "image"
                    });
                    b.addMenuItems && b.addMenuItems({
                        image: {
                            label: b.lang.image.menu,
                            command: "image",
                            group: "image"
                        }
                    });
                    b.contextMenu && b.contextMenu.addListener(function (c) {
                        if (a(b, c))return {image: CKEDITOR.TRISTATE_OFF}
                    })
                }
            },
            afterInit: function (b) {
                function g(c) {
                    var d = b.getCommand("justify" + c);
                    if (d) {
                        if (c == "left" || c == "right")d.on("exec", function (d) {
                            var f = a(b), g;
                            if (f) {
                                g = e(f);
                                if (g == c) {
                                    f.removeStyle("float");
                                    c == e(f) && f.removeAttribute("align")
                                } else f.setStyle("float", c);
                                d.cancel()
                            }
                        });
                        d.on("refresh", function (d) {
                            var f = a(b);
                            if (f) {
                                f = e(f);
                                this.setState(f == c ? CKEDITOR.TRISTATE_ON : c == "right" || c == "left" ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                                d.cancel()
                            }
                        })
                    }
                }

                if (!b.plugins.image2) {
                    g("left");
                    g("right");
                    g("center");
                    g("block")
                }
            }
        })
    }(),
    CKEDITOR.config.image_removeLinkByEmptyURL = !0,function () {
        function a(a, b) {
            var c = g.exec(a), e = g.exec(b);
            if (c) {
                if (!c[2] && e[2] == "px")return e[1];
                if (c[2] == "px" && !e[2])return e[1] + "px"
            }
            return b
        }

        var e = CKEDITOR.htmlParser.cssStyle, b = CKEDITOR.tools.cssLength, g = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i, c = {
            elements: {
                $: function (b) {
                    var c = b.attributes;
                    if ((c = (c = (c = c && c["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(c))) && c.children[0]) && b.attributes["data-cke-resizable"]) {
                        var f =
                            (new e(b)).rules, b = c.attributes, g = f.width, f = f.height;
                        g && (b.width = a(b.width, g));
                        f && (b.height = a(b.height, f))
                    }
                    return c
                }
            }
        };
        CKEDITOR.plugins.add("fakeobjects", {
            init: function (a) {
                a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
            }, afterInit: function (a) {
                (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(c, {applyToAll: true})
            }
        });
        CKEDITOR.editor.prototype.createFakeElement = function (a, c, f, g) {
            var j = this.lang.fakeobjects, j = j[f] || j.unknown, c = {
                "class": c,
                "data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
                "data-cke-real-node-type": a.type,
                alt: j,
                title: j,
                align: a.getAttribute("align") || ""
            };
            if (!CKEDITOR.env.hc)c.src = CKEDITOR.tools.transparentImageData;
            f && (c["data-cke-real-element-type"] = f);
            if (g) {
                c["data-cke-resizable"] = g;
                f = new e;
                g = a.getAttribute("width");
                a = a.getAttribute("height");
                g && (f.rules.width = b(g));
                a && (f.rules.height = b(a));
                f.populate(c)
            }
            return this.document.createElement("img", {attributes: c})
        };
        CKEDITOR.editor.prototype.createFakeParserElement = function (a, c, f, g) {
            var j = this.lang.fakeobjects, j = j[f] ||
                j.unknown, k;
            k = new CKEDITOR.htmlParser.basicWriter;
            a.writeHtml(k);
            k = k.getHtml();
            c = {
                "class": c,
                "data-cke-realelement": encodeURIComponent(k),
                "data-cke-real-node-type": a.type,
                alt: j,
                title: j,
                align: a.attributes.align || ""
            };
            if (!CKEDITOR.env.hc)c.src = CKEDITOR.tools.transparentImageData;
            f && (c["data-cke-real-element-type"] = f);
            if (g) {
                c["data-cke-resizable"] = g;
                g = a.attributes;
                a = new e;
                f = g.width;
                g = g.height;
                f !== void 0 && (a.rules.width = b(f));
                g !== void 0 && (a.rules.height = b(g));
                a.populate(c)
            }
            return new CKEDITOR.htmlParser.element("img",
                c)
        };
        CKEDITOR.editor.prototype.restoreRealElement = function (b) {
            if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT)return null;
            var c = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(b.data("cke-realelement")), this.document);
            if (b.data("cke-resizable")) {
                var f = b.getStyle("width"), b = b.getStyle("height");
                f && c.setAttribute("width", a(c.getAttribute("width"), f));
                b && c.setAttribute("height", a(c.getAttribute("height"), b))
            }
            return c
        }
    }(),"use strict",function () {
        function a(a) {
            return a.replace(/'/g, "\\$&")
        }

        function e(a) {
            for (var b, c = a.length, d = [], f = 0; f < c; f++) {
                b = a.charCodeAt(f);
                d.push(b)
            }
            return "String.fromCharCode(" + d.join(",") + ")"
        }

        function b(b, c) {
            var d = b.plugins.link, f = d.compiledProtectionFunction.params, e, g;
            g = [d.compiledProtectionFunction.name, "("];
            for (var h = 0; h < f.length; h++) {
                d = f[h].toLowerCase();
                e = c[d];
                h > 0 && g.push(",");
                g.push("'", e ? a(encodeURIComponent(c[d])) : "", "'")
            }
            g.push(")");
            return g.join("")
        }

        function g(a) {
            var a = a.config.emailProtection || "", b;
            if (a && a != "encode") {
                b = {};
                a.replace(/^([^(]+)\(([^)]+)\)$/,
                    function (a, c, d) {
                        b.name = c;
                        b.params = [];
                        d.replace(/[^,\s]+/g, function (a) {
                            b.params.push(a)
                        })
                    })
            }
            return b
        }

        CKEDITOR.plugins.add("link", {
            requires: "dialog,fakeobjects", onLoad: function () {
                function a(b) {
                    return c.replace(/%1/g, b == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
                }

                var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;", c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" +
                    b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
                CKEDITOR.addCss(a("ltr") + a("rtl"))
            }, init: function (a) {
                var b = "a[!href]";
                CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
                CKEDITOR.dialog.isTabEnabled(a, "link", "target") && (b = b.replace("]", ",target,onclick]"));
                a.addCommand("link", new CKEDITOR.dialogCommand("link", {
                    allowedContent: b,
                    requiredContent: "a[href]"
                }));
                a.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
                    allowedContent: "a[!name,id]",
                    requiredContent: "a[name]"
                }));
                a.addCommand("unlink", new CKEDITOR.unlinkCommand);
                a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
                a.setKeystroke(CKEDITOR.CTRL + 76, "link");
                if (a.ui.addButton) {
                    a.ui.addButton("Link", {
                        label: a.lang.link.toolbar,
                        command: "link",
                        toolbar: "links,10"
                    });
                    a.ui.addButton("Unlink", {
                        label: a.lang.link.unlink,
                        command: "unlink",
                        toolbar: "links,20"
                    });
                    a.ui.addButton("Anchor", {
                        label: a.lang.link.anchor.toolbar,
                        command: "anchor", toolbar: "links,30"
                    })
                }
                CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
                CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
                a.on("doubleclick", function (b) {
                    var c = CKEDITOR.plugins.link.getSelectedLink(a) || b.data.element;
                    if (!c.isReadOnly())if (c.is("a")) {
                        b.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
                        b.data.link = c
                    } else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c))b.data.dialog = "anchor"
                }, null, null, 0);
                a.on("doubleclick",
                    function (b) {
                        b.data.dialog in {
                            link: 1,
                            anchor: 1
                        } && b.data.link && a.getSelection().selectElement(b.data.link)
                    }, null, null, 20);
                a.addMenuItems && a.addMenuItems({
                    anchor: {
                        label: a.lang.link.anchor.menu,
                        command: "anchor",
                        group: "anchor",
                        order: 1
                    },
                    removeAnchor: {
                        label: a.lang.link.anchor.remove,
                        command: "removeAnchor",
                        group: "anchor",
                        order: 5
                    },
                    link: {
                        label: a.lang.link.menu,
                        command: "link",
                        group: "link",
                        order: 1
                    },
                    unlink: {
                        label: a.lang.link.unlink,
                        command: "unlink",
                        group: "link",
                        order: 5
                    }
                });
                a.contextMenu && a.contextMenu.addListener(function (b) {
                    if (!b ||
                        b.isReadOnly())return null;
                    b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
                    if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a)))return null;
                    var c = {};
                    b.getAttribute("href") && b.getChildCount() && (c = {
                        link: CKEDITOR.TRISTATE_OFF,
                        unlink: CKEDITOR.TRISTATE_OFF
                    });
                    if (b && b.hasAttribute("name"))c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
                    return c
                });
                this.compiledProtectionFunction = g(a)
            }, afterInit: function (a) {
                a.dataProcessor.dataFilter.addRules({
                    elements: {
                        a: function (b) {
                            return !b.attributes.name ? null : !b.children.length ?
                                a.createFakeParserElement(b, "cke_anchor", "anchor") : null
                        }
                    }
                });
                var b = a._.elementsPath && a._.elementsPath.filters;
                b && b.push(function (b, c) {
                    if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) || b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount())))return "anchor"
                })
            }
        });
        var c = /^javascript:/, d = /^mailto:([^?]+)(?:\?(.+))?$/, i = /subject=([^;?:@&=$,\/]*)/, f = /body=([^;?:@&=$,\/]*)/, h = /^#(.*)$/, j = /^((?:http|https|ftp|news):\/\/)?(.*)$/, k = /^(_(?:self|top|parent|blank))$/, n = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
            o = /^javascript:([^(]+)\(([^)]+)\)$/, p = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/, m = /(?:^|,)([^=]+)=(\d+|yes|no)/gi, l = {
                id: "advId",
                dir: "advLangDir",
                accessKey: "advAccessKey",
                name: "advName",
                lang: "advLangCode",
                tabindex: "advTabIndex",
                title: "advTitle",
                type: "advContentType",
                "class": "advCSSClasses",
                charset: "advCharset",
                style: "advStyles",
                rel: "advRel"
            };
        CKEDITOR.plugins.link = {
            getSelectedLink: function (a) {
                var b = a.getSelection(), c = b.getSelectedElement();
                if (c && c.is("a"))return c;
                if (b = b.getRanges()[0]) {
                    b.shrink(CKEDITOR.SHRINK_TEXT);
                    return a.elementPath(b.getCommonAncestor()).contains("a", 1)
                }
                return null
            }, getEditorAnchors: function (a) {
                for (var b = a.editable(), c = b.isInline() && !a.plugins.divarea ? a.document : b, b = c.getElementsByTag("a"), c = c.getElementsByTag("img"), d = [], f = 0, e; e = b.getItem(f++);)if (e.data("cke-saved-name") || e.hasAttribute("name"))d.push({
                    name: e.data("cke-saved-name") || e.getAttribute("name"),
                    id: e.getAttribute("id")
                });
                for (f = 0; e = c.getItem(f++);)(e =
                    this.tryRestoreFakeAnchor(a, e)) && d.push({
                    name: e.getAttribute("name"),
                    id: e.getAttribute("id")
                });
                return d
            }, fakeAnchor: true, tryRestoreFakeAnchor: function (a, b) {
                if (b && b.data("cke-real-element-type") && b.data("cke-real-element-type") == "anchor") {
                    var c = a.restoreRealElement(b);
                    if (c.data("cke-saved-name"))return c
                }
            }, parseLinkAttributes: function (a, b) {
                var e = b && (b.data("cke-saved-href") || b.getAttribute("href")) || "", g = a.plugins.link.compiledProtectionFunction, w = a.config.emailProtection, x, v = {};
                e.match(c) && (w == "encode" ?
                    e = e.replace(n, function (a, b, c) {
                        return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"))
                    }) : w && e.replace(o, function (a, b, c) {
                    if (b == g.name) {
                        v.type = "email";
                        for (var a = v.email = {}, b = /(^')|('$)/g, c = c.match(/[^,\s]+/g), d = c.length, f, e, h = 0; h < d; h++) {
                            f = decodeURIComponent;
                            e = c[h].replace(b, "").replace(/\\'/g, "'");
                            e = f(e);
                            f = g.params[h].toLowerCase();
                            a[f] = e
                        }
                        a.address = [a.name, a.domain].join("@")
                    }
                }));
                if (!v.type)if (w = e.match(h)) {
                    v.type = "anchor";
                    v.anchor = {};
                    v.anchor.name = v.anchor.id = w[1]
                } else if (w =
                        e.match(d)) {
                    x = e.match(i);
                    e = e.match(f);
                    v.type = "email";
                    var r = v.email = {};
                    r.address = w[1];
                    x && (r.subject = decodeURIComponent(x[1]));
                    e && (r.body = decodeURIComponent(e[1]))
                } else if (e && (x = e.match(j))) {
                    v.type = "url";
                    v.url = {};
                    v.url.protocol = x[1];
                    v.url.url = x[2]
                }
                if (b) {
                    if (e = b.getAttribute("target"))v.target = {
                        type: e.match(k) ? e : "frame",
                        name: e
                    }; else if (e = (e = b.data("cke-pa-onclick") || b.getAttribute("onclick")) && e.match(p))for (v.target = {
                        type: "popup",
                        name: e[1]
                    }; w = m.exec(e[2]);)(w[2] == "yes" || w[2] == "1") && !(w[1] in {
                        height: 1,
                        width: 1, top: 1, left: 1
                    }) ? v.target[w[1]] = true : isFinite(w[2]) && (v.target[w[1]] = w[2]);
                    var e = {}, y;
                    for (y in l)(w = b.getAttribute(y)) && (e[l[y]] = w);
                    if (y = b.data("cke-saved-name") || e.advName)e.advName = y;
                    if (!CKEDITOR.tools.isEmpty(e))v.advanced = e
                }
                return v
            }, getLinkAttributes: function (c, d) {
                var f = c.config.emailProtection || "", g = {};
                switch (d.type) {
                    case "url":
                        var f = d.url && d.url.protocol !== void 0 ? d.url.protocol : "http://", h = d.url && CKEDITOR.tools.trim(d.url.url) || "";
                        g["data-cke-saved-href"] = h.indexOf("/") === 0 ? h : f + h;
                        break;
                    case "anchor":
                        f = d.anchor && d.anchor.id;
                        g["data-cke-saved-href"] = "#" + (d.anchor && d.anchor.name || f || "");
                        break;
                    case "email":
                        var i = d.email, h = i.address;
                        switch (f) {
                            case "":
                            case "encode":
                                var j = encodeURIComponent(i.subject || ""), k = encodeURIComponent(i.body || ""), i = [];
                                j && i.push("subject=" + j);
                                k && i.push("body=" + k);
                                i = i.length ? "?" + i.join("&") : "";
                                if (f == "encode") {
                                    f = ["javascript:void(location.href='mailto:'+", e(h)];
                                    i && f.push("+'", a(i), "'");
                                    f.push(")")
                                } else f = ["mailto:", h, i];
                                break;
                            default:
                                f = h.split("@", 2);
                                i.name = f[0];
                                i.domain = f[1];
                                f = ["javascript:", b(c, i)]
                        }
                        g["data-cke-saved-href"] = f.join("")
                }
                if (d.target)if (d.target.type == "popup") {
                    for (var f = ["window.open(this.href, '", d.target.name || "", "', '"], m = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"], h = m.length, j = function (a) {
                        d.target[a] && m.push(a + "=" + d.target[a])
                    }, i = 0; i < h; i++)m[i] = m[i] + (d.target[m[i]] ? "=yes" : "=no");
                    j("width");
                    j("left");
                    j("height");
                    j("top");
                    f.push(m.join(","), "'); return false;");
                    g["data-cke-pa-onclick"] = f.join("")
                } else if (d.target.type !=
                    "notSet" && d.target.name)g.target = d.target.name;
                if (d.advanced) {
                    for (var p in l)(f = d.advanced[l[p]]) && (g[p] = f);
                    if (g.name)g["data-cke-saved-name"] = g.name
                }
                if (g["data-cke-saved-href"])g.href = g["data-cke-saved-href"];
                p = {
                    target: 1,
                    onclick: 1,
                    "data-cke-pa-onclick": 1,
                    "data-cke-saved-name": 1
                };
                d.advanced && CKEDITOR.tools.extend(p, l);
                for (var n in g)delete p[n];
                return {set: g, removed: CKEDITOR.tools.objectKeys(p)}
            }
        };
        CKEDITOR.unlinkCommand = function () {
        };
        CKEDITOR.unlinkCommand.prototype = {
            exec: function (a) {
                var b = new CKEDITOR.style({
                    element: "a",
                    type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1
                });
                a.removeStyle(b)
            }, refresh: function (a, b) {
                var c = b.lastElement && b.lastElement.getAscendant("a", true);
                c && c.getName() == "a" && c.getAttribute("href") && c.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
            }, contextSensitive: 1, startDisabled: 1, requiredContent: "a[href]"
        };
        CKEDITOR.removeAnchorCommand = function () {
        };
        CKEDITOR.removeAnchorCommand.prototype = {
            exec: function (a) {
                var b = a.getSelection(), c = b.createBookmarks(), d;
                if (b &&
                    (d = b.getSelectedElement()) && (!d.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, d) : d.is("a")))d.remove(1); else if (d = CKEDITOR.plugins.link.getSelectedLink(a))if (d.hasAttribute("href")) {
                    d.removeAttributes({name: 1, "data-cke-saved-name": 1});
                    d.removeClass("cke_anchor")
                } else d.remove(1);
                b.selectBookmarks(c)
            }, requiredContent: "a[name]"
        };
        CKEDITOR.tools.extend(CKEDITOR.config, {
            linkShowAdvancedTab: true,
            linkShowTargetTab: true
        })
    }(),"use strict",function () {
        function a(a, b, c) {
            return k(b) && k(c) && c.equals(b.getNext(function (a) {
                    return !(Y(a) ||
                    Z(a) || n(a))
                }))
        }

        function e(a) {
            this.upper = a[0];
            this.lower = a[1];
            this.set.apply(this, a.slice(2))
        }

        function b(a) {
            var b = a.element;
            if (b && k(b))if ((b = b.getAscendant(a.triggers, true)) && a.editable.contains(b)) {
                var c = d(b);
                if (c.getAttribute("contenteditable") == "true")return b;
                if (c.is(a.triggers))return c
            }
            return null
        }

        function g(a, b, c) {
            u(a, b);
            u(a, c);
            a = b.size.bottom;
            c = c.size.top;
            return a && c ? 0 | (a + c) / 2 : a || c
        }

        function c(a, b, c) {
            return b = b[c ? "getPrevious" : "getNext"](function (b) {
                return b && b.type == CKEDITOR.NODE_TEXT && !Y(b) ||
                    k(b) && !n(b) && !j(a, b)
            })
        }

        function d(a, b) {
            if (a.data("cke-editable"))return null;
            for (b || (a = a.getParent()); a;) {
                if (a.data("cke-editable"))break;
                if (a.hasAttribute("contenteditable"))return a;
                a = a.getParent()
            }
            return null
        }

        function i(a) {
            var b = a.doc, c = z('<span contenteditable="false" style="' + P + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', b), d = CKEDITOR.getUrl(this.path + "images/" + (B.hidpi ? "hidpi/" : "") + "icon" + (a.rtl ? "-rtl" : "") + ".png");
            r(c, {
                attach: function () {
                    this.wrap.getParent() || this.wrap.appendTo(a.editable,
                        true);
                    return this
                },
                lineChildren: [r(z('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', b), {
                    base: P + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + d + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (B.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (B.hidpi ? "background-size: 9px 10px;" : ""),
                    looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius",
                        "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]
                }), r(z(W, b), {
                    base: V + "left:0px;border-left-color:" + a.boxColor + ";",
                    looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]
                }), r(z(W, b), {
                    base: V + "right:0px;border-right-color:" + a.boxColor + ";",
                    looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]
                })],
                detach: function () {
                    this.wrap.getParent() &&
                    this.wrap.remove();
                    return this
                },
                mouseNear: function () {
                    u(a, this);
                    var b = a.holdDistance, c = this.size;
                    return c && a.mouse.y > c.top - b && a.mouse.y < c.bottom + b && a.mouse.x > c.left - b && a.mouse.x < c.right + b ? true : false
                },
                place: function () {
                    var b = a.view, c = a.editable, d = a.trigger, f = d.upper, e = d.lower, g = f || e, h = g.getParent(), i = {};
                    this.trigger = d;
                    f && u(a, f, true);
                    e && u(a, e, true);
                    u(a, h, true);
                    a.inInlineMode && w(a, true);
                    if (h.equals(c)) {
                        i.left = b.scroll.x;
                        i.right = -b.scroll.x;
                        i.width = ""
                    } else {
                        i.left = g.size.left - g.size.margin.left + b.scroll.x -
                            (a.inInlineMode ? b.editable.left + b.editable.border.left : 0);
                        i.width = g.size.outerWidth + g.size.margin.left + g.size.margin.right + b.scroll.x;
                        i.right = ""
                    }
                    if (f && e)i.top = f.size.margin.bottom === e.size.margin.top ? 0 | f.size.bottom + f.size.margin.bottom / 2 : f.size.margin.bottom < e.size.margin.top ? f.size.bottom + f.size.margin.bottom : f.size.bottom + f.size.margin.bottom - e.size.margin.top; else if (f) {
                        if (!e)i.top = f.size.bottom + f.size.margin.bottom
                    } else i.top = e.size.top - e.size.margin.top;
                    if (d.is(L) || i.top > b.scroll.y - 15 && i.top <
                        b.scroll.y + 5) {
                        i.top = a.inInlineMode ? 0 : b.scroll.y;
                        this.look(L)
                    } else if (d.is(H) || i.top > b.pane.bottom - 5 && i.top < b.pane.bottom + 15) {
                        i.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1;
                        this.look(H)
                    } else {
                        if (a.inInlineMode)i.top = i.top - (b.editable.top + b.editable.border.top);
                        this.look(Q)
                    }
                    if (a.inInlineMode) {
                        i.top--;
                        i.top = i.top + b.editable.scroll.top;
                        i.left = i.left + b.editable.scroll.left
                    }
                    for (var j in i)i[j] = CKEDITOR.tools.cssLength(i[j]);
                    this.setStyles(i)
                },
                look: function (a) {
                    if (this.oldLook !=
                        a) {
                        for (var b = this.lineChildren.length, c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
                        this.oldLook = a
                    }
                },
                wrap: new y("span", a.doc)
            });
            for (b = c.lineChildren.length; b--;)c.lineChildren[b].appendTo(c);
            c.look(Q);
            c.appendTo(c.wrap);
            c.unselectable();
            c.lineChildren[0].on("mouseup", function (b) {
                c.detach();
                f(a, function (b) {
                    var c = a.line.trigger;
                    b[c.is(J) ? "insertBefore" : "insertAfter"](c.is(J) ? c.lower : c.upper)
                }, true);
                a.editor.focus();
                !B.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                b.data.preventDefault(true)
            });
            c.on("mousedown", function (a) {
                a.data.preventDefault(true)
            });
            a.line = c
        }

        function f(a, b, c) {
            var f = new CKEDITOR.dom.range(a.doc), e = a.editor, g;
            if (B.ie && a.enterMode == CKEDITOR.ENTER_BR)g = a.doc.createText(O); else {
                g = (g = d(a.element, true)) && g.data("cke-enter-mode") || a.enterMode;
                g = new y(D[g], a.doc);
                g.is("br") || a.doc.createText(O).appendTo(g)
            }
            c && e.fire("saveSnapshot");
            b(g);
            f.moveToPosition(g, CKEDITOR.POSITION_AFTER_START);
            e.getSelection().selectRanges([f]);
            a.hotNode = g;
            c && e.fire("saveSnapshot")
        }

        function h(a, e) {
            return {
                canUndo: true, modes: {wysiwyg: 1}, exec: function () {
                    function g(b) {
                        var c = B.ie && B.version < 9 ? " " : O, d = a.hotNode && a.hotNode.getText() == c && a.element.equals(a.hotNode) && a.lastCmdDirection === !!e;
                        f(a, function (c) {
                            d && a.hotNode && a.hotNode.remove();
                            c[e ? "insertAfter" : "insertBefore"](b);
                            c.setAttributes({
                                "data-cke-magicline-hot": 1,
                                "data-cke-magicline-dir": !!e
                            });
                            a.lastCmdDirection = !!e
                        });
                        !B.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                        a.line.detach()
                    }

                    return function (f) {
                        var f = f.getSelection().getStartElement(),
                            h, f = f.getAscendant(N, 1);
                        if (!m(a, f) && f && !f.equals(a.editable) && !f.contains(a.editable)) {
                            if ((h = d(f)) && h.getAttribute("contenteditable") == "false")f = h;
                            a.element = f;
                            h = c(a, f, !e);
                            var i;
                            if (k(h) && h.is(a.triggers) && h.is(R) && (!c(a, h, !e) || (i = c(a, h, !e)) && k(i) && i.is(a.triggers)))g(h); else {
                                i = b(a, f);
                                if (k(i))if (c(a, i, !e))(f = c(a, i, !e)) && (k(f) && f.is(a.triggers)) && g(i); else g(i)
                            }
                        }
                    }
                }()
            }
        }

        function j(a, b) {
            if (!b || !(b.type == CKEDITOR.NODE_ELEMENT && b.$))return false;
            var c = a.line;
            return c.wrap.equals(b) || c.wrap.contains(b)
        }

        function k(a) {
            return a &&
                a.type == CKEDITOR.NODE_ELEMENT && a.$
        }

        function n(a) {
            if (!k(a))return false;
            var b;
            if (!(b = o(a)))if (k(a)) {
                b = {left: 1, right: 1, center: 1};
                b = !(!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")])
            } else b = false;
            return b
        }

        function o(a) {
            return !!{absolute: 1, fixed: 1}[a.getComputedStyle("position")]
        }

        function p(a, b) {
            return k(b) ? b.is(a.triggers) : null
        }

        function m(a, b) {
            if (!b)return false;
            for (var c = b.getParents(1), d = c.length; d--;)for (var f = a.tabuList.length; f--;)if (c[d].hasAttribute(a.tabuList[f]))return true;
            return false
        }

        function l(a, b, c) {
            b = b[c ? "getLast" : "getFirst"](function (b) {
                return a.isRelevant(b) && !b.is(K)
            });
            if (!b)return false;
            u(a, b);
            return c ? b.size.top > a.mouse.y : b.size.bottom < a.mouse.y
        }

        function q(a) {
            var b = a.editable, c = a.mouse, d = a.view, f = a.triggerOffset;
            w(a);
            var g = c.y > (a.inInlineMode ? d.editable.top + d.editable.height / 2 : Math.min(d.editable.height, d.pane.height) / 2), b = b[g ? "getLast" : "getFirst"](function (a) {
                return !(Y(a) || Z(a))
            });
            if (!b)return null;
            j(a, b) && (b = a.line.wrap[g ? "getPrevious" : "getNext"](function (a) {
                return !(Y(a) ||
                Z(a))
            }));
            if (!k(b) || n(b) || !p(a, b))return null;
            u(a, b);
            if (!g && b.size.top >= 0 && c.y > 0 && c.y < b.size.top + f) {
                a = a.inInlineMode || d.scroll.y === 0 ? L : Q;
                return new e([null, b, J, E, a])
            }
            if (g && b.size.bottom <= d.pane.height && c.y > b.size.bottom - f && c.y < d.pane.height) {
                a = a.inInlineMode || b.size.bottom > d.pane.height - f && b.size.bottom < d.pane.height ? H : Q;
                return new e([b, null, C, E, a])
            }
            return null
        }

        function s(a) {
            var d = a.mouse, f = a.view, g = a.triggerOffset, h = b(a);
            if (!h)return null;
            u(a, h);
            var g = Math.min(g, 0 | h.size.outerHeight / 2), i = [], j, m;
            if (d.y >
                h.size.top - 1 && d.y < h.size.top + g)m = false; else if (d.y > h.size.bottom - g && d.y < h.size.bottom + 1)m = true; else return null;
            if (n(h) || l(a, h, m) || h.getParent().is(M))return null;
            var q = c(a, h, !m);
            if (q) {
                if (q && q.type == CKEDITOR.NODE_TEXT)return null;
                if (k(q)) {
                    if (n(q) || !p(a, q) || q.getParent().is(M))return null;
                    i = [q, h][m ? "reverse" : "concat"]().concat([F, E])
                }
            } else {
                if (h.equals(a.editable[m ? "getLast" : "getFirst"](a.isRelevant))) {
                    w(a);
                    m && d.y > h.size.bottom - g && d.y < f.pane.height && h.size.bottom > f.pane.height - g && h.size.bottom < f.pane.height ?
                        j = H : d.y > 0 && d.y < h.size.top + g && (j = L)
                } else j = Q;
                i = [null, h][m ? "reverse" : "concat"]().concat([m ? C : J, E, j, h.equals(a.editable[m ? "getLast" : "getFirst"](a.isRelevant)) ? m ? H : L : Q])
            }
            return 0 in i ? new e(i) : null
        }

        function t(a, b, c, d) {
            for (var f = function () {
                var c = B.ie ? b.$.currentStyle : a.win.$.getComputedStyle(b.$, "");
                return B.ie ? function (a) {
                    return c[CKEDITOR.tools.cssStyleToDomStyle(a)]
                } : function (a) {
                    return c.getPropertyValue(a)
                }
            }(), e = b.getDocumentPosition(), g = {}, h = {}, i = {}, j = {}, k = X.length; k--;) {
                g[X[k]] = parseInt(f("border-" +
                        X[k] + "-width"), 10) || 0;
                i[X[k]] = parseInt(f("padding-" + X[k]), 10) || 0;
                h[X[k]] = parseInt(f("margin-" + X[k]), 10) || 0
            }
            (!c || d) && x(a, d);
            j.top = e.y - (c ? 0 : a.view.scroll.y);
            j.left = e.x - (c ? 0 : a.view.scroll.x);
            j.outerWidth = b.$.offsetWidth;
            j.outerHeight = b.$.offsetHeight;
            j.height = j.outerHeight - (i.top + i.bottom + g.top + g.bottom);
            j.width = j.outerWidth - (i.left + i.right + g.left + g.right);
            j.bottom = j.top + j.outerHeight;
            j.right = j.left + j.outerWidth;
            if (a.inInlineMode)j.scroll = {
                top: b.$.scrollTop,
                left: b.$.scrollLeft
            };
            return r({
                border: g, padding: i,
                margin: h, ignoreScroll: c
            }, j, true)
        }

        function u(a, b, c) {
            if (!k(b))return b.size = null;
            if (b.size) {
                if (b.size.ignoreScroll == c && b.size.date > new Date - T)return null
            } else b.size = {};
            return r(b.size, t(a, b, c), {date: +new Date}, true)
        }

        function w(a, b) {
            a.view.editable = t(a, a.editable, b, true)
        }

        function x(a, b) {
            if (!a.view)a.view = {};
            var c = a.view;
            if (b || !(c && c.date > new Date - T)) {
                var d = a.win, c = d.getScrollPosition(), d = d.getViewPaneSize();
                r(a.view, {
                    scroll: {
                        x: c.x,
                        y: c.y,
                        width: a.doc.$.documentElement.scrollWidth - d.width,
                        height: a.doc.$.documentElement.scrollHeight -
                        d.height
                    },
                    pane: {
                        width: d.width,
                        height: d.height,
                        bottom: d.height + c.y
                    },
                    date: +new Date
                }, true)
            }
        }

        function v(a, b, c, d) {
            for (var f = d, g = d, h = 0, i = false, j = false, k = a.view.pane.height, m = a.mouse; m.y + h < k && m.y - h > 0;) {
                i || (i = b(f, d));
                j || (j = b(g, d));
                !i && m.y - h > 0 && (f = c(a, {x: m.x, y: m.y - h}));
                !j && m.y + h < k && (g = c(a, {x: m.x, y: m.y + h}));
                if (i && j)break;
                h = h + 2
            }
            return new e([f, g, null, null])
        }

        CKEDITOR.plugins.add("magicline", {
            init: function (a) {
                var d = a.config, g = d.magicline_triggerOffset || 30, l = {
                    editor: a,
                    enterMode: d.enterMode,
                    triggerOffset: g,
                    holdDistance: 0 |
                    g * (d.magicline_holdDistance || 0.5),
                    boxColor: d.magicline_color || "#ff0000",
                    rtl: d.contentsLangDirection == "rtl",
                    tabuList: ["data-cke-hidden-sel"].concat(d.magicline_tabuList || []),
                    triggers: d.magicline_everywhere ? N : {
                        table: 1,
                        hr: 1,
                        div: 1,
                        ul: 1,
                        ol: 1,
                        dl: 1,
                        form: 1,
                        blockquote: 1
                    }
                }, p, u, v;
                l.isRelevant = function (a) {
                    return k(a) && !j(l, a) && !n(a)
                };
                a.on("contentDom", function () {
                    var g = a.editable(), k = a.document, n = a.window;
                    r(l, {
                        editable: g,
                        inInlineMode: g.isInline(),
                        doc: k,
                        win: n,
                        hotNode: null
                    }, true);
                    l.boundary = l.inInlineMode ? l.editable :
                        l.doc.getDocumentElement();
                    if (!g.is(G.$inline)) {
                        l.inInlineMode && !o(g) && g.setStyles({
                            position: "relative",
                            top: null,
                            left: null
                        });
                        i.call(this, l);
                        x(l);
                        g.attachListener(a, "beforeUndoImage", function () {
                            l.line.detach()
                        });
                        g.attachListener(a, "beforeGetData", function () {
                            if (l.line.wrap.getParent()) {
                                l.line.detach();
                                a.once("getData", function () {
                                    l.line.attach()
                                }, null, null, 1E3)
                            }
                        }, null, null, 0);
                        g.attachListener(l.inInlineMode ? k : k.getWindow().getFrame(), "mouseout", function (b) {
                            if (a.mode == "wysiwyg")if (l.inInlineMode) {
                                var c =
                                    b.data.$.clientX, b = b.data.$.clientY;
                                x(l);
                                w(l, true);
                                var d = l.view.editable, f = l.view.scroll;
                                if (!(c > d.left - f.x && c < d.right - f.x) || !(b > d.top - f.y && b < d.bottom - f.y)) {
                                    clearTimeout(v);
                                    v = null;
                                    l.line.detach()
                                }
                            } else {
                                clearTimeout(v);
                                v = null;
                                l.line.detach()
                            }
                        });
                        g.attachListener(g, "keyup", function () {
                            l.hiddenMode = 0
                        });
                        g.attachListener(g, "keydown", function (b) {
                            if (a.mode == "wysiwyg")switch (b.data.getKeystroke()) {
                                case 2228240:
                                case 16:
                                    l.hiddenMode = 1;
                                    l.line.detach()
                            }
                        });
                        g.attachListener(l.inInlineMode ? g : k, "mousemove", function (b) {
                            u =
                                true;
                            if (!(a.mode != "wysiwyg" || a.readOnly || v)) {
                                var c = {
                                    x: b.data.$.clientX,
                                    y: b.data.$.clientY
                                };
                                v = setTimeout(function () {
                                    l.mouse = c;
                                    v = l.trigger = null;
                                    x(l);
                                    if (u && !l.hiddenMode && a.focusManager.hasFocus && !l.line.mouseNear() && (l.element = S(l, true))) {
                                        if ((l.trigger = q(l) || s(l) || ba(l)) && !m(l, l.trigger.upper || l.trigger.lower))l.line.attach().place(); else {
                                            l.trigger = null;
                                            l.line.detach()
                                        }
                                        u = false
                                    }
                                }, 30)
                            }
                        });
                        g.attachListener(n, "scroll", function () {
                            if (a.mode == "wysiwyg") {
                                l.line.detach();
                                if (B.webkit) {
                                    l.hiddenMode = 1;
                                    clearTimeout(p);
                                    p = setTimeout(function () {
                                        if (!l.mouseDown)l.hiddenMode = 0
                                    }, 50)
                                }
                            }
                        });
                        g.attachListener(A ? k : n, "mousedown", function () {
                            if (a.mode == "wysiwyg") {
                                l.line.detach();
                                l.hiddenMode = 1;
                                l.mouseDown = 1
                            }
                        });
                        g.attachListener(A ? k : n, "mouseup", function () {
                            l.hiddenMode = 0;
                            l.mouseDown = 0
                        });
                        a.addCommand("accessPreviousSpace", h(l));
                        a.addCommand("accessNextSpace", h(l, true));
                        a.setKeystroke([[d.magicline_keystrokePrevious, "accessPreviousSpace"], [d.magicline_keystrokeNext, "accessNextSpace"]]);
                        a.on("loadSnapshot", function () {
                            var b, c, d, f;
                            for (f in{
                                p: 1,
                                br: 1, div: 1
                            }) {
                                b = a.document.getElementsByTag(f);
                                for (d = b.count(); d--;)if ((c = b.getItem(d)).data("cke-magicline-hot")) {
                                    l.hotNode = c;
                                    l.lastCmdDirection = c.data("cke-magicline-dir") === "true" ? true : false;
                                    return
                                }
                            }
                        });
                        this.backdoor = {
                            accessFocusSpace: f,
                            boxTrigger: e,
                            isLine: j,
                            getAscendantTrigger: b,
                            getNonEmptyNeighbour: c,
                            getSize: t,
                            that: l,
                            triggerEdge: s,
                            triggerEditable: q,
                            triggerExpand: ba
                        }
                    }
                }, this)
            }
        });
        var r = CKEDITOR.tools.extend, y = CKEDITOR.dom.element, z = y.createFromHtml, B = CKEDITOR.env, A = CKEDITOR.env.ie && CKEDITOR.env.version <
            9, G = CKEDITOR.dtd, D = {}, J = 128, C = 64, F = 32, E = 16, I = 8, L = 4, H = 2, Q = 1, O = " ", M = G.$listItem, K = G.$tableContent, R = r({}, G.$nonEditable, G.$empty), N = G.$block, T = 100, P = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;", V = P + "border-color:transparent;display:block;border-style:solid;", W = "<span>" + O + "</span>";
        D[CKEDITOR.ENTER_BR] = "br";
        D[CKEDITOR.ENTER_P] = "p";
        D[CKEDITOR.ENTER_DIV] = "div";
        e.prototype = {
            set: function (a, b, c) {
                this.properties = a + b +
                    (c || Q);
                return this
            }, is: function (a) {
                return (this.properties & a) == a
            }
        };
        var S = function () {
                function a(b, c) {
                    var d = b.$.elementFromPoint(c.x, c.y);
                    return d && d.nodeType ? new CKEDITOR.dom.element(d) : null
                }

                return function (b, c, d) {
                    if (!b.mouse)return null;
                    var f = b.doc, e = b.line.wrap, d = d || b.mouse, g = a(f, d);
                    if (c && j(b, g)) {
                        e.hide();
                        g = a(f, d);
                        e.show()
                    }
                    return !g || !(g.type == CKEDITOR.NODE_ELEMENT && g.$) || B.ie && B.version < 9 && !b.boundary.equals(g) && !b.boundary.contains(g) ? null : g
                }
            }(), Y = CKEDITOR.dom.walker.whitespaces(), Z = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
            ba = function () {
                function b(d) {
                    var f = d.element, e, h, i;
                    if (!k(f) || f.contains(d.editable) || f.isReadOnly())return null;
                    i = v(d, function (a, b) {
                        return !b.equals(a)
                    }, function (a, b) {
                        return S(a, true, b)
                    }, f);
                    e = i.upper;
                    h = i.lower;
                    if (a(d, e, h))return i.set(F, I);
                    if (e && f.contains(e))for (; !e.getParent().equals(f);)e = e.getParent(); else e = f.getFirst(function (a) {
                        return c(d, a)
                    });
                    if (h && f.contains(h))for (; !h.getParent().equals(f);)h = h.getParent(); else h = f.getLast(function (a) {
                        return c(d, a)
                    });
                    if (!e || !h)return null;
                    u(d, e);
                    u(d, h);
                    if (!(d.mouse.y >
                        e.size.top && d.mouse.y < h.size.bottom))return null;
                    for (var f = Number.MAX_VALUE, j, m, l, p; h && !h.equals(e);) {
                        if (!(m = e.getNext(d.isRelevant)))break;
                        j = Math.abs(g(d, e, m) - d.mouse.y);
                        if (j < f) {
                            f = j;
                            l = e;
                            p = m
                        }
                        e = m;
                        u(d, e)
                    }
                    if (!l || !p || !(d.mouse.y > l.size.top && d.mouse.y < p.size.bottom))return null;
                    i.upper = l;
                    i.lower = p;
                    return i.set(F, I)
                }

                function c(a, b) {
                    return !(b && b.type == CKEDITOR.NODE_TEXT || Z(b) || n(b) || j(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
                }

                return function (c) {
                    var d = b(c), f;
                    if (f = d) {
                        f = d.upper;
                        var e = d.lower;
                        f =
                            !f || !e || n(e) || n(f) || e.equals(f) || f.equals(e) || e.contains(f) || f.contains(e) ? false : p(c, f) && p(c, e) && a(c, f, e) ? true : false
                    }
                    return f ? d : null
                }
            }(), X = ["top", "left", "right", "bottom"]
    }(),CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51,CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52,function () {
        function a(a) {
            if (!a || a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form")return [];
            for (var b = [], c = ["style", "className"], e = 0; e < c.length; e++) {
                var g = a.$.elements.namedItem(c[e]);
                if (g) {
                    g = new CKEDITOR.dom.element(g);
                    b.push([g, g.nextSibling]);
                    g.remove()
                }
            }
            return b
        }

        function e(a, b) {
            if (a && !(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)for (var c = b.length - 1; c >= 0; c--) {
                var e = b[c][0], g = b[c][1];
                g ? e.insertBefore(g) : e.appendTo(a)
            }
        }

        function b(b, c) {
            var f = a(b), g = {}, j = b.$;
            if (!c) {
                g["class"] = j.className || "";
                j.className = ""
            }
            g.inline = j.style.cssText || "";
            if (!c)j.style.cssText = "position: static; overflow: visible";
            e(f);
            return g
        }

        function g(b, c) {
            var f = a(b), g = b.$;
            if ("class" in c)g.className =
                c["class"];
            if ("inline" in c)g.style.cssText = c.inline;
            e(f)
        }

        function c(a) {
            if (!a.editable().isInline()) {
                var b = CKEDITOR.instances, c;
                for (c in b) {
                    var e = b[c];
                    if (e.mode == "wysiwyg" && !e.readOnly) {
                        e = e.document.getBody();
                        e.setAttribute("contentEditable", false);
                        e.setAttribute("contentEditable", true)
                    }
                }
                if (a.editable().hasFocus) {
                    a.toolbox.focus();
                    a.focus()
                }
            }
        }

        CKEDITOR.plugins.add("maximize", {
            init: function (a) {
                function e() {
                    var b = j.getViewPaneSize();
                    a.resize(b.width, b.height, null, true)
                }

                if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var f =
                        a.lang, h = CKEDITOR.document, j = h.getWindow(), k, n, o, p = CKEDITOR.TRISTATE_OFF;
                    a.addCommand("maximize", {
                        modes: {
                            wysiwyg: !CKEDITOR.env.iOS,
                            source: !CKEDITOR.env.iOS
                        }, readOnly: 1, editorFocus: false, exec: function () {
                            var m = a.container.getFirst(function (a) {
                                return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
                            }), l = a.ui.space("contents");
                            if (a.mode == "wysiwyg") {
                                var q = a.getSelection();
                                k = q && q.getRanges();
                                n = j.getScrollPosition()
                            } else {
                                var s = a.editable().$;
                                k = !CKEDITOR.env.ie && [s.selectionStart, s.selectionEnd];
                                n = [s.scrollLeft,
                                    s.scrollTop]
                            }
                            if (this.state == CKEDITOR.TRISTATE_OFF) {
                                j.on("resize", e);
                                o = j.getScrollPosition();
                                for (q = a.container; q = q.getParent();) {
                                    q.setCustomData("maximize_saved_styles", b(q));
                                    q.setStyle("z-index", a.config.baseFloatZIndex - 5)
                                }
                                l.setCustomData("maximize_saved_styles", b(l, true));
                                m.setCustomData("maximize_saved_styles", b(m, true));
                                l = {
                                    overflow: CKEDITOR.env.webkit ? "" : "hidden",
                                    width: 0,
                                    height: 0
                                };
                                h.getDocumentElement().setStyles(l);
                                !CKEDITOR.env.gecko && h.getDocumentElement().setStyle("position", "fixed");
                                (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && h.getBody().setStyles(l);
                                CKEDITOR.env.ie ? setTimeout(function () {
                                    j.$.scrollTo(0, 0)
                                }, 0) : j.$.scrollTo(0, 0);
                                m.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                                m.$.offsetLeft;
                                m.setStyles({
                                    "z-index": a.config.baseFloatZIndex - 5,
                                    left: "0px",
                                    top: "0px"
                                });
                                m.addClass("cke_maximized");
                                e();
                                l = m.getDocumentPosition();
                                m.setStyles({
                                    left: -1 * l.x + "px",
                                    top: -1 * l.y + "px"
                                });
                                CKEDITOR.env.gecko && c(a)
                            } else if (this.state == CKEDITOR.TRISTATE_ON) {
                                j.removeListener("resize", e);
                                l = [l,
                                    m];
                                for (q = 0; q < l.length; q++) {
                                    g(l[q], l[q].getCustomData("maximize_saved_styles"));
                                    l[q].removeCustomData("maximize_saved_styles")
                                }
                                for (q = a.container; q = q.getParent();) {
                                    g(q, q.getCustomData("maximize_saved_styles"));
                                    q.removeCustomData("maximize_saved_styles")
                                }
                                CKEDITOR.env.ie ? setTimeout(function () {
                                    j.$.scrollTo(o.x, o.y)
                                }, 0) : j.$.scrollTo(o.x, o.y);
                                m.removeClass("cke_maximized");
                                if (CKEDITOR.env.webkit) {
                                    m.setStyle("display", "inline");
                                    setTimeout(function () {
                                        m.setStyle("display", "block")
                                    }, 0)
                                }
                                a.fire("resize")
                            }
                            this.toggleState();
                            if (q = this.uiItems[0]) {
                                l = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize;
                                q = CKEDITOR.document.getById(q._.id);
                                q.getChild(1).setHtml(l);
                                q.setAttribute("title", l);
                                q.setAttribute("href", 'javascript:void("' + l + '");')
                            }
                            if (a.mode == "wysiwyg")if (k) {
                                CKEDITOR.env.gecko && c(a);
                                a.getSelection().selectRanges(k);
                                (s = a.getSelection().getStartElement()) && s.scrollIntoView(true)
                            } else j.$.scrollTo(n.x, n.y); else {
                                if (k) {
                                    s.selectionStart = k[0];
                                    s.selectionEnd = k[1]
                                }
                                s.scrollLeft = n[0];
                                s.scrollTop = n[1]
                            }
                            k =
                                n = null;
                            p = this.state;
                            a.fire("maximize", this.state)
                        }, canUndo: false
                    });
                    a.ui.addButton && a.ui.addButton("Maximize", {
                        label: f.maximize.maximize,
                        command: "maximize",
                        toolbar: "tools,10"
                    });
                    a.on("mode", function () {
                        var b = a.getCommand("maximize");
                        b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : p)
                    }, null, null, 100)
                }
            }
        })
    }(),function () {
        function a(a, e, c) {
            var d = CKEDITOR.cleanWord;
            if (d)c(); else {
                a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || e + "filter/default.js");
                CKEDITOR.scriptLoader.load(a,
                    c, null, true)
            }
            return !d
        }

        function e(a) {
            a.data.type = "html"
        }

        CKEDITOR.plugins.add("pastefromword", {
            requires: "clipboard", init: function (b) {
                var g = 0, c = this.path;
                b.addCommand("pastefromword", {
                    canUndo: false,
                    async: true,
                    exec: function (a) {
                        var b = this;
                        g = 1;
                        a.once("beforePaste", e);
                        a.getClipboardData({title: a.lang.pastefromword.title}, function (c) {
                            c && a.fire("paste", {
                                type: "html",
                                dataValue: c.dataValue
                            });
                            a.fire("afterCommandExec", {
                                name: "pastefromword",
                                command: b,
                                returnValue: !!c
                            })
                        })
                    }
                });
                b.ui.addButton && b.ui.addButton("PasteFromWord",
                    {
                        label: b.lang.pastefromword.toolbar,
                        command: "pastefromword",
                        toolbar: "clipboard,50"
                    });
                b.on("pasteState", function (a) {
                    b.getCommand("pastefromword").setState(a.data)
                });
                b.on("paste", function (d) {
                    var e = d.data, f = e.dataValue;
                    if (f && (g || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(f))) {
                        var h = a(b, c, function () {
                            if (h)b.fire("paste", e); else if (!b.config.pasteFromWordPromptCleanup || g || confirm(b.lang.pastefromword.confirmCleanup))e.dataValue = CKEDITOR.cleanWord(f, b);
                            g = 0
                        });
                        h && d.cancel()
                    }
                }, null, null, 3)
            }
        })
    }(),
    function () {
        var a = {
            canUndo: false, async: true, exec: function (e) {
                e.getClipboardData({title: e.lang.pastetext.title}, function (b) {
                    b && e.fire("paste", {
                        type: "text",
                        dataValue: b.dataValue
                    });
                    e.fire("afterCommandExec", {
                        name: "pastetext",
                        command: a,
                        returnValue: !!b
                    })
                })
            }
        };
        CKEDITOR.plugins.add("pastetext", {
            requires: "clipboard", init: function (e) {
                e.addCommand("pastetext", a);
                e.ui.addButton && e.ui.addButton("PasteText", {
                    label: e.lang.pastetext.button,
                    command: "pastetext",
                    toolbar: "clipboard,40"
                });
                if (e.config.forcePasteAsPlainText)e.on("beforePaste",
                    function (a) {
                        if (a.data.type != "html")a.data.type = "text"
                    });
                e.on("pasteState", function (a) {
                    e.getCommand("pastetext").setState(a.data)
                })
            }
        })
    }(),CKEDITOR.plugins.add("removeformat", {
        init: function (a) {
            a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
            a.ui.addButton && a.ui.addButton("RemoveFormat", {
                label: a.lang.removeformat.toolbar,
                command: "removeFormat",
                toolbar: "cleanup,10"
            })
        }
    }),CKEDITOR.plugins.removeformat = {
        commands: {
            removeformat: {
                exec: function (a) {
                    for (var e = a._.removeFormatRegex ||
                        (a._.removeFormatRegex = RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), b = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), g = CKEDITOR.plugins.removeformat.filter, c = a.getSelection().getRanges(), d = c.createIterator(), i = function (a) {
                        return a.type == CKEDITOR.NODE_ELEMENT
                    }, f; f = d.getNextRange();) {
                        f.collapsed || f.enlarge(CKEDITOR.ENLARGE_ELEMENT);
                        var h = f.createBookmark(), j = h.startNode, k = h.endNode, n = function (b) {
                            for (var c = a.elementPath(b), d = c.elements,
                                     f = 1, h; h = d[f]; f++) {
                                if (h.equals(c.block) || h.equals(c.blockLimit))break;
                                e.test(h.getName()) && g(a, h) && b.breakParent(h)
                            }
                        };
                        n(j);
                        if (k) {
                            n(k);
                            for (j = j.getNextSourceNode(true, CKEDITOR.NODE_ELEMENT); j;) {
                                if (j.equals(k))break;
                                if (j.isReadOnly()) {
                                    if (j.getPosition(k) & CKEDITOR.POSITION_CONTAINS)break;
                                    j = j.getNext(i)
                                } else {
                                    n = j.getNextSourceNode(false, CKEDITOR.NODE_ELEMENT);
                                    if (!(j.getName() == "img" && j.data("cke-realelement")) && g(a, j))if (e.test(j.getName()))j.remove(1); else {
                                        j.removeAttributes(b);
                                        a.fire("removeFormatCleanup",
                                            j)
                                    }
                                    j = n
                                }
                            }
                        }
                        f.moveToBookmark(h)
                    }
                    a.forceNextSelectionCheck();
                    a.getSelection().selectRanges(c)
                }
            }
        }, filter: function (a, e) {
            for (var b = a._.removeFormatFilters || [], g = 0; g < b.length; g++)if (b[g](e) === false)return false;
            return true
        }
    },CKEDITOR.editor.prototype.addRemoveFormatFilter = function (a) {
        if (!this._.removeFormatFilters)this._.removeFormatFilters = [];
        this._.removeFormatFilters.push(a)
    },CKEDITOR.config.removeFormatTags = "b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var",
    CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign",CKEDITOR.plugins.add("resize", {
        init: function (a) {
            var e, b, g, c;

            function d(d) {
                var h = e, i = b, k = h + (d.data.$.screenX - g) * (j == "rtl" ? -1 : 1), d = i + (d.data.$.screenY - c);
                n && (h = Math.max(f.resize_minWidth, Math.min(k, f.resize_maxWidth)));
                o && (i = Math.max(f.resize_minHeight, Math.min(d, f.resize_maxHeight)));
                a.resize(n ? h : null, i)
            }

            function i() {
                CKEDITOR.document.removeListener("mousemove", d);
                CKEDITOR.document.removeListener("mouseup", i);
                if (a.document) {
                    a.document.removeListener("mousemove", d);
                    a.document.removeListener("mouseup", i)
                }
            }

            var f = a.config, h = a.ui.spaceId("resizer"), j = a.element ? a.element.getDirection(1) : "ltr";
            !f.resize_dir && (f.resize_dir = "vertical");
            f.resize_maxWidth === void 0 && (f.resize_maxWidth = 3E3);
            f.resize_maxHeight === void 0 && (f.resize_maxHeight = 3E3);
            f.resize_minWidth === void 0 && (f.resize_minWidth = 750);
            f.resize_minHeight === void 0 && (f.resize_minHeight = 250);
            if (f.resize_enabled !== false) {
                var k = null, n = (f.resize_dir == "both" || f.resize_dir ==
                    "horizontal") && f.resize_minWidth != f.resize_maxWidth, o = (f.resize_dir == "both" || f.resize_dir == "vertical") && f.resize_minHeight != f.resize_maxHeight, p = CKEDITOR.tools.addFunction(function (h) {
                    k || (k = a.getResizable());
                    e = k.$.offsetWidth || 0;
                    b = k.$.offsetHeight || 0;
                    g = h.screenX;
                    c = h.screenY;
                    f.resize_minWidth > e && (f.resize_minWidth = e);
                    f.resize_minHeight > b && (f.resize_minHeight = b);
                    CKEDITOR.document.on("mousemove", d);
                    CKEDITOR.document.on("mouseup", i);
                    if (a.document) {
                        a.document.on("mousemove", d);
                        a.document.on("mouseup",
                            i)
                    }
                    h.preventDefault && h.preventDefault()
                });
                a.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(p)
                });
                a.on("uiSpace", function (b) {
                    if (b.data.space == "bottom") {
                        var c = "";
                        n && !o && (c = " cke_resizer_horizontal");
                        !n && o && (c = " cke_resizer_vertical");
                        var d = '<span id="' + h + '" class="cke_resizer' + c + " cke_resizer_" + j + '" title="' + CKEDITOR.tools.htmlEncode(a.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + p + ', event)">' + (j == "ltr" ? "◢" : "◣") + "</span>";
                        j == "ltr" && c == "ltr" ? b.data.html = b.data.html + d : b.data.html =
                            d + b.data.html
                    }
                }, a, null, 100);
                a.on("maximize", function (b) {
                    a.ui.space("resizer")[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
                })
            }
        }
    }),CKEDITOR.plugins.add("menubutton", {
        requires: "button,menu", onLoad: function () {
            var a = function (a) {
                var b = this._, g = b.menu;
                if (b.state !== CKEDITOR.TRISTATE_DISABLED)if (b.on && g)g.hide(); else {
                    b.previousState = b.state;
                    if (!g) {
                        g = b.menu = new CKEDITOR.menu(a, {
                            panel: {
                                className: "cke_menu_panel",
                                attributes: {"aria-label": a.lang.common.options}
                            }
                        });
                        g.onHide = CKEDITOR.tools.bind(function () {
                            var c =
                                this.command ? a.getCommand(this.command).modes : this.modes;
                            this.setState(!c || c[a.mode] ? b.previousState : CKEDITOR.TRISTATE_DISABLED);
                            b.on = 0
                        }, this);
                        this.onMenu && g.addListener(this.onMenu)
                    }
                    this.setState(CKEDITOR.TRISTATE_ON);
                    b.on = 1;
                    setTimeout(function () {
                        g.show(CKEDITOR.document.getById(b.id), 4)
                    }, 0)
                }
            };
            CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.button,
                $: function (e) {
                    delete e.panel;
                    this.base(e);
                    this.hasArrow = true;
                    this.click = a
                },
                statics: {
                    handler: {
                        create: function (a) {
                            return new CKEDITOR.ui.menuButton(a)
                        }
                    }
                }
            })
        },
        beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
        }
    }),CKEDITOR.UI_MENUBUTTON = "menubutton","use strict",CKEDITOR.plugins.add("scayt", {
        requires: "menubutton,dialog",
        tabToOpen: null,
        dialogName: "scaytDialog",
        init: function (a) {
            var e = this, b = CKEDITOR.plugins.scayt;
            this.bindEvents(a);
            this.parseConfig(a);
            this.addRule(a);
            CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + "dialogs/options.js"));
            this.addMenuItems(a);
            var g = a.lang.scayt, c = CKEDITOR.env;
            a.ui.add("Scayt",
                CKEDITOR.UI_MENUBUTTON, {
                    label: g.text_title,
                    title: a.plugins.wsc ? a.lang.wsc.title : g.text_title,
                    modes: {wysiwyg: !(c.ie && (c.version < 8 || c.quirks))},
                    toolbar: "spellchecker,20",
                    refresh: function () {
                        var c = a.ui.instances.Scayt.getState();
                        a.scayt && (c = b.state[a.name] ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                        a.fire("scaytButtonState", c)
                    },
                    onRender: function () {
                        var b = this;
                        a.on("scaytButtonState", function (a) {
                            typeof a.data !== void 0 && b.setState(a.data)
                        })
                    },
                    onMenu: function () {
                        var c = a.scayt;
                        a.getMenuItem("scaytToggle").label =
                            a.lang.scayt[c && b.state[a.name] ? "btn_disable" : "btn_enable"];
                        c = {
                            scaytToggle: CKEDITOR.TRISTATE_OFF,
                            scaytOptions: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytLangs: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytDict: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytAbout: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            WSC: a.plugins.wsc ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                        };
                        a.config.scayt_uiTabs[0] || delete c.scaytOptions;
                        a.config.scayt_uiTabs[1] || delete c.scaytLangs;
                        a.config.scayt_uiTabs[2] || delete c.scaytDict;
                        return c
                    }
                });
            if (a.contextMenu && a.addMenuItems) {
                a.contextMenu.addListener(function () {
                    var b = a.scayt, c;
                    if (b) {
                        var f = b.getSelectionNode();
                        if (f = f ? f.getAttribute(b.getNodeAttribute()) : f) {
                            c = e.menuGenerator(a, f, e);
                            b.showBanner("." + a.contextMenu._.definition.panel.className.split(" ").join(" ."))
                        }
                    }
                    return c
                });
                a.contextMenu._.onHide = CKEDITOR.tools.override(a.contextMenu._.onHide, function (b) {
                    return function () {
                        var c = a.scayt;
                        c && c.hideBanner();
                        return b.apply(this)
                    }
                })
            }
        },
        addMenuItems: function (a) {
            var e = this, b = CKEDITOR.plugins.scayt;
            a.addMenuGroup("scaytButton");
            var g = a.config.scayt_contextMenuItemsOrder.split("|");
            if (g && g.length)for (var c = 0; c < g.length; c++)a.addMenuGroup("scayt_" + g[c], c - 10);
            a.addCommand("scaytToggle", {
                exec: function (a) {
                    var c = a.scayt;
                    b.state[a.name] = !b.state[a.name];
                    b.state[a.name] === true ? c || b.createScayt(a) : c && b.destroy(a)
                }
            });
            a.addCommand("scaytAbout", {
                exec: function (a) {
                    a.scayt.tabToOpen = "about";
                    a.lockSelection();
                    a.openDialog(e.dialogName)
                }
            });
            a.addCommand("scaytOptions",
                {
                    exec: function (a) {
                        a.scayt.tabToOpen = "options";
                        a.lockSelection();
                        a.openDialog(e.dialogName)
                    }
                });
            a.addCommand("scaytLangs", {
                exec: function (a) {
                    a.scayt.tabToOpen = "langs";
                    a.lockSelection();
                    a.openDialog(e.dialogName)
                }
            });
            a.addCommand("scaytDict", {
                exec: function (a) {
                    a.scayt.tabToOpen = "dictionaries";
                    a.lockSelection();
                    a.openDialog(e.dialogName)
                }
            });
            g = {
                scaytToggle: {
                    label: a.lang.scayt.btn_enable,
                    group: "scaytButton",
                    command: "scaytToggle"
                },
                scaytAbout: {
                    label: a.lang.scayt.btn_about,
                    group: "scaytButton",
                    command: "scaytAbout"
                },
                scaytOptions: {
                    label: a.lang.scayt.btn_options,
                    group: "scaytButton",
                    command: "scaytOptions"
                },
                scaytLangs: {
                    label: a.lang.scayt.btn_langs,
                    group: "scaytButton",
                    command: "scaytLangs"
                },
                scaytDict: {
                    label: a.lang.scayt.btn_dictionaries,
                    group: "scaytButton",
                    command: "scaytDict"
                }
            };
            if (a.plugins.wsc)g.WSC = {
                label: a.lang.wsc.toolbar,
                group: "scaytButton",
                onClick: function () {
                    var b = CKEDITOR.plugins.scayt, c = a.scayt, f = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
                    if (f = f.replace(/\s/g,
                            "")) {
                        c && (b.state[a.name] && c.setMarkupPaused) && c.setMarkupPaused(true);
                        a.lockSelection();
                        a.execCommand("checkspell")
                    } else alert("Nothing to check!")
                }
            };
            a.addMenuItems(g)
        },
        bindEvents: function (a) {
            function e() {
                var b = a.scayt;
                if (b) {
                    b.removeMarkupInSelectionNode();
                    b.fire("startSpellCheck")
                }
            }

            var b = CKEDITOR.plugins.scayt, g = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE, c = function () {
                b.destroy(a)
            }, d = function () {
                b.state[a.name] && (!a.readOnly && !a.scayt) && b.createScayt(a)
            }, i = function () {
                var b = a.editable();
                b.attachListener(b,
                    "focus", function () {
                        CKEDITOR.plugins.scayt && !a.scayt && setTimeout(d, 0);
                        var b = CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state[a.name] && a.scayt, c, f;
                        if ((g || b) && a._.savedSelection)for (var b = a._.savedSelection.getSelectedElement(), b = !b && a._.savedSelection.getRanges(), e = 0; e < b.length; e++) {
                            f = b[e];
                            if (typeof f.startContainer.$.nodeValue === "string") {
                                c = f.startContainer.getText().length;
                                (c < f.startOffset || c < f.endOffset) && a.unlockSelection(false)
                            }
                        }
                    }, this, null, -10)
            }, f = function () {
                if (g) {
                    a.on("blur", c);
                    a.on("focus",
                        d);
                    a.focusManager.hasFocus && d()
                } else d();
                i()
            };
            a.on("contentDom", f);
            a.on("beforeCommandExec", function (c) {
                var d;
                if (c.data.name in b.options.disablingCommandExec && a.mode == "wysiwyg") {
                    if (d = a.scayt) {
                        b.destroy(a);
                        a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)
                    }
                } else if (c.data.name === "bold" || c.data.name === "italic" || c.data.name === "underline" || c.data.name === "strike" || c.data.name === "subscript" || c.data.name === "superscript" || c.data.name === "enter")if (d = a.scayt) {
                    d.removeMarkupInSelectionNode();
                    setTimeout(function () {
                            d.fire("startSpellCheck")
                        },
                        0)
                }
            });
            a.on("beforeSetMode", function (c) {
                if (c.data == "source") {
                    if (c = a.scayt) {
                        b.destroy(a);
                        a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)
                    }
                    a.document && a.document.getBody().removeAttribute("_jquid")
                }
            });
            a.on("afterCommandExec", function (b) {
                var c;
                if (a.mode == "wysiwyg" && (b.data.name == "undo" || b.data.name == "redo"))(c = a.scayt) && setTimeout(function () {
                    c.fire("startSpellCheck")
                }, 250)
            });
            a.on("readOnly", function (c) {
                var d;
                if (c) {
                    d = a.scayt;
                    if (c.editor.readOnly === true)d && d.fire("removeMarkupInDocument", {}); else if (d)d.fire("startSpellCheck");
                    else if (c.editor.mode == "wysiwyg" && b.state[c.editor.name] === true) {
                        b.createScayt(a);
                        c.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON)
                    }
                }
            });
            a.on("beforeDestroy", c);
            a.on("setData", function () {
                c();
                (a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || a.plugins.divarea) && f()
            }, this, null, 50);
            a.on("insertElement", function () {
                CKEDITOR.env.ie ? setTimeout(function () {
                    e()
                }, 50) : e()
            }, this, null, 50);
            a.on("insertHtml", function () {
                e()
            }, this, null, 50);
            a.on("insertText", function () {
                e()
            }, this, null, 50);
            a.on("scaytDialogShown", function (b) {
                b.data.selectPage(a.scayt.tabToOpen)
            });
            a.on("paste", function () {
                var b = a.scayt;
                b && b.removeMarkupInSelectionNode()
            }, null, null, 0)
        },
        parseConfig: function (a) {
            var e = CKEDITOR.plugins.scayt;
            e.replaceOldOptionsNames(a.config);
            if (typeof a.config.scayt_autoStartup !== "boolean")a.config.scayt_autoStartup = false;
            e.state[a.name] = a.config.scayt_autoStartup;
            if (!a.config.scayt_contextCommands)a.config.scayt_contextCommands = "ignore|ignoreall|add";
            if (!a.config.scayt_contextMenuItemsOrder)a.config.scayt_contextMenuItemsOrder = "suggest|moresuggest|control";
            if (!a.config.scayt_sLang)a.config.scayt_sLang =
                "en_US";
            if (a.config.scayt_maxSuggestions === void 0 || typeof a.config.scayt_maxSuggestions != "number" || a.config.scayt_maxSuggestions < 0)a.config.scayt_maxSuggestions = 5;
            if (a.config.scayt_minWordLength === void 0 || typeof a.config.scayt_minWordLength != "number" || a.config.scayt_minWordLength < 1)a.config.scayt_minWordLength = 4;
            if (a.config.scayt_customDictionaryIds === void 0 || typeof a.config.scayt_customDictionaryIds !== "string")a.config.scayt_customDictionaryIds = "";
            if (a.config.scayt_userDictionaryName === void 0 || typeof a.config.scayt_userDictionaryName !==
                "string")a.config.scayt_userDictionaryName = null;
            if (typeof a.config.scayt_uiTabs === "string" && a.config.scayt_uiTabs.split(",").length === 3) {
                var b = [], g = [];
                a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(",");
                CKEDITOR.tools.search(a.config.scayt_uiTabs, function (a) {
                    if (Number(a) === 1 || Number(a) === 0) {
                        g.push(true);
                        b.push(Number(a))
                    } else g.push(false)
                });
                a.config.scayt_uiTabs = CKEDITOR.tools.search(g, false) === null ? b : [1, 1, 1]
            } else a.config.scayt_uiTabs = [1, 1, 1];
            if (typeof a.config.scayt_serviceProtocol != "string")a.config.scayt_serviceProtocol =
                null;
            if (typeof a.config.scayt_serviceHost != "string")a.config.scayt_serviceHost = null;
            if (typeof a.config.scayt_servicePort != "string")a.config.scayt_servicePort = null;
            if (typeof a.config.scayt_servicePath != "string")a.config.scayt_servicePath = null;
            if (!a.config.scayt_moreSuggestions)a.config.scayt_moreSuggestions = "on";
            if (typeof a.config.scayt_customerId !== "string")a.config.scayt_customerId = "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2";
            if (typeof a.config.scayt_srcUrl !== "string") {
                e =
                    document.location.protocol;
                e = e.search(/https?:/) != -1 ? e : "http:";
                a.config.scayt_srcUrl = e + "//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js"
            }
            if (typeof CKEDITOR.config.scayt_handleCheckDirty !== "boolean")CKEDITOR.config.scayt_handleCheckDirty = true;
            if (typeof CKEDITOR.config.scayt_handleUndoRedo !== "boolean")CKEDITOR.config.scayt_handleUndoRedo = true;
            if (a.config.scayt_disableOptionsStorage) {
                var e = CKEDITOR.tools.isArray(a.config.scayt_disableOptionsStorage) ? a.config.scayt_disableOptionsStorage :
                    typeof a.config.scayt_disableOptionsStorage === "string" ? [a.config.scayt_disableOptionsStorage] : void 0, c = ["all", "options", "lang", "ignore-all-caps-words", "ignore-domain-names", "ignore-words-with-mixed-cases", "ignore-words-with-numbers"], d = ["lang", "ignore-all-caps-words", "ignore-domain-names", "ignore-words-with-mixed-cases", "ignore-words-with-numbers"], i = CKEDITOR.tools.search, f = CKEDITOR.tools.indexOf;
                a.config.scayt_disableOptionsStorage = function (a) {
                    for (var b = [], e = 0; e < a.length; e++) {
                        var g = a[e], o = !!i(a,
                            "options");
                        if (!i(c, g) || o && i(d, function (a) {
                                if (a === "lang")return false
                            }))return;
                        i(d, g) && d.splice(f(d, g), 1);
                        if (g === "all" || o && i(a, "lang"))return [];
                        g === "options" && (d = ["lang"])
                    }
                    return b = b.concat(d)
                }(e)
            }
        },
        addRule: function (a) {
            var e = a.dataProcessor, b = e && e.htmlFilter, g = a._.elementsPath && a._.elementsPath.filters, e = e && e.dataFilter, c = a.addRemoveFormatFilter, d = function (b) {
                var c = CKEDITOR.plugins.scayt;
                if (a.scayt && b.hasAttribute(c.options.data_attribute_name))return false
            }, i = function (b) {
                var c = CKEDITOR.plugins.scayt,
                    d = true;
                a.scayt && b.hasAttribute(c.options.data_attribute_name) && (d = false);
                return d
            };
            g && g.push(d);
            e && e.addRules({
                elements: {
                    span: function (b) {
                        var c = CKEDITOR.plugins.scayt;
                        if (c && c.state[a.name] && b.classes && CKEDITOR.tools.search(b.classes, c.options.misspelled_word_class))if (b.classes && b.parent.type === CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                            delete b.attributes.style;
                            delete b.name
                        } else delete b.classes[CKEDITOR.tools.indexOf(b.classes, c.options.misspelled_word_class)];
                        return b
                    }
                }
            });
            b && b.addRules({
                elements: {
                    span: function (b) {
                        var c =
                            CKEDITOR.plugins.scayt;
                        if (c && c.state[a.name] && b.hasClass(c.options.misspelled_word_class) && b.attributes[c.options.data_attribute_name]) {
                            b.removeClass(c.options.misspelled_word_class);
                            delete b.attributes[c.options.data_attribute_name];
                            delete b.name
                        }
                        return b
                    }
                }
            });
            c && c.call(a, i)
        },
        scaytMenuDefinition: function (a) {
            var e = this, a = a.scayt;
            return {
                scayt_ignore: {
                    label: a.getLocal("btn_ignore"),
                    group: "scayt_control",
                    order: 1,
                    exec: function (a) {
                        a.scayt.ignoreWord()
                    }
                },
                scayt_ignoreall: {
                    label: a.getLocal("btn_ignoreAll"),
                    group: "scayt_control", order: 2, exec: function (a) {
                        a.scayt.ignoreAllWords()
                    }
                },
                scayt_add: {
                    label: a.getLocal("btn_addWord"),
                    group: "scayt_control",
                    order: 3,
                    exec: function (a) {
                        var e = a.scayt;
                        setTimeout(function () {
                            e.addWordToUserDictionary()
                        }, 10)
                    }
                },
                option: {
                    label: a.getLocal("btn_options"),
                    group: "scayt_control",
                    order: 4,
                    exec: function (a) {
                        a.scayt.tabToOpen = "options";
                        a.lockSelection();
                        a.openDialog(e.dialogName)
                    },
                    verification: function (a) {
                        return a.config.scayt_uiTabs[0] == 1 ? true : false
                    }
                },
                language: {
                    label: a.getLocal("btn_langs"),
                    group: "scayt_control", order: 5, exec: function (a) {
                        a.scayt.tabToOpen = "langs";
                        a.lockSelection();
                        a.openDialog(e.dialogName)
                    }, verification: function (a) {
                        return a.config.scayt_uiTabs[1] == 1 ? true : false
                    }
                },
                dictionary: {
                    label: a.getLocal("btn_dictionaries"),
                    group: "scayt_control",
                    order: 6,
                    exec: function (a) {
                        a.scayt.tabToOpen = "dictionaries";
                        a.lockSelection();
                        a.openDialog(e.dialogName)
                    },
                    verification: function (a) {
                        return a.config.scayt_uiTabs[2] == 1 ? true : false
                    }
                },
                about: {
                    label: a.getLocal("btn_about"),
                    group: "scayt_control",
                    order: 7,
                    exec: function (a) {
                        a.scayt.tabToOpen = "about";
                        a.lockSelection();
                        a.openDialog(e.dialogName)
                    }
                }
            }
        },
        buildSuggestionMenuItems: function (a, e) {
            var b = {}, g = {}, c = a.scayt;
            if (e.length > 0 && e[0] !== "no_any_suggestions")for (var d = 0; d < e.length; d++) {
                var i = "scayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[d].replace(" ", "_");
                a.addCommand(i, this.createCommand(CKEDITOR.plugins.scayt.suggestions[d]));
                if (d < a.config.scayt_maxSuggestions) {
                    a.addMenuItem(i, {
                        label: e[d],
                        command: i,
                        group: "scayt_suggest",
                        order: d + 1
                    });
                    b[i] = CKEDITOR.TRISTATE_OFF
                } else {
                    a.addMenuItem(i,
                        {
                            label: e[d],
                            command: i,
                            group: "scayt_moresuggest",
                            order: d + 1
                        });
                    g[i] = CKEDITOR.TRISTATE_OFF;
                    if (a.config.scayt_moreSuggestions === "on") {
                        a.addMenuItem("scayt_moresuggest", {
                            label: c.getLocal("btn_moreSuggestions"),
                            group: "scayt_moresuggest",
                            order: 10,
                            getItems: function () {
                                return g
                            }
                        });
                        b.scayt_moresuggest = CKEDITOR.TRISTATE_OFF
                    }
                }
            } else {
                b.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED;
                a.addCommand("no_scayt_suggest", {
                    exec: function () {
                    }
                });
                a.addMenuItem("no_scayt_suggest", {
                    label: c.getLocal("btn_noSuggestions") || "no_scayt_suggest",
                    command: "no_scayt_suggest",
                    group: "scayt_suggest",
                    order: 0
                })
            }
            return b
        },
        menuGenerator: function (a, e) {
            var b = a.scayt, g = this.scaytMenuDefinition(a), c = {}, d = a.config.scayt_contextCommands.split("|");
            b.fire("getSuggestionsList", {lang: b.getLang(), word: e});
            c = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions);
            if (a.config.scayt_contextCommands == "off")return c;
            for (var i in g)if (!(CKEDITOR.tools.indexOf(d, i.replace("scayt_", "")) == -1 && a.config.scayt_contextCommands != "all")) {
                c[i] = CKEDITOR.TRISTATE_OFF;
                typeof g[i].verification === "function" && !g[i].verification(a) && delete c[i];
                a.addCommand(i, {exec: g[i].exec});
                a.addMenuItem(i, {
                    label: a.lang.scayt[g[i].label] || g[i].label,
                    command: i,
                    group: g[i].group,
                    order: g[i].order
                })
            }
            return c
        },
        createCommand: function (a) {
            return {
                exec: function (e) {
                    e.scayt.replaceSelectionNode({word: a})
                }
            }
        }
    }),CKEDITOR.plugins.scayt = {
        state: {},
        suggestions: [],
        loadingHelper: {loadOrder: []},
        isLoading: !1,
        options: {
            disablingCommandExec: {source: !0, newpage: !0, templates: !0},
            data_attribute_name: "data-scayt-word",
            misspelled_word_class: "scayt-misspell-word"
        },
        backCompatibilityMap: {
            scayt_service_protocol: "scayt_serviceProtocol",
            scayt_service_host: "scayt_serviceHost",
            scayt_service_port: "scayt_servicePort",
            scayt_service_path: "scayt_servicePath",
            scayt_customerid: "scayt_customerId"
        },
        replaceOldOptionsNames: function (a) {
            for (var e in a)if (e in this.backCompatibilityMap) {
                a[this.backCompatibilityMap[e]] = a[e];
                delete a[e]
            }
        },
        createScayt: function (a) {
            var e = this;
            this.loadScaytLibrary(a, function (a) {
                var g = {
                    lang: a.config.scayt_sLang,
                    container: a.editable().$.nodeName == "BODY" ? a.document.getWindow().$.frameElement : a.editable().$,
                    customDictionary: a.config.scayt_customDictionaryIds,
                    userDictionaryName: a.config.scayt_userDictionaryName,
                    localization: a.langCode,
                    customer_id: a.config.scayt_customerId,
                    debug: a.config.scayt_debug,
                    data_attribute_name: e.options.data_attribute_name,
                    misspelled_word_class: e.options.misspelled_word_class,
                    "options-to-restore": a.config.scayt_disableOptionsStorage,
                    focused: a.editable().hasFocus,
                    ignoreElementsRegex: a.config.scayt_elementsToIgnore,
                    minWordLength: a.config.scayt_minWordLength
                };
                if (a.config.scayt_serviceProtocol)g.service_protocol = a.config.scayt_serviceProtocol;
                if (a.config.scayt_serviceHost)g.service_host = a.config.scayt_serviceHost;
                if (a.config.scayt_servicePort)g.service_port = a.config.scayt_servicePort;
                if (a.config.scayt_servicePath)g.service_path = a.config.scayt_servicePath;
                g = new SCAYT.CKSCAYT(g, function () {
                }, function () {
                });
                g.subscribe("suggestionListSend", function (a) {
                    for (var b = {}, e = [], f = 0; f < a.suggestionList.length; f++)if (!b["word_" +
                        a.suggestionList[f]]) {
                        b["word_" + a.suggestionList[f]] = a.suggestionList[f];
                        e.push(a.suggestionList[f])
                    }
                    CKEDITOR.plugins.scayt.suggestions = e
                });
                g.subscribe("selectionIsChanged", function () {
                    a.getSelection().isLocked && a.lockSelection()
                });
                a.scayt = g;
                a.fire("scaytButtonState", a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON)
            })
        },
        destroy: function (a) {
            a.scayt && a.scayt.destroy();
            delete a.scayt;
            a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF)
        },
        loadScaytLibrary: function (a, e) {
            var b = this, g;
            if (typeof window.SCAYT ===
                "undefined" || typeof window.SCAYT.CKSCAYT !== "function") {
                if (!this.loadingHelper[a.name]) {
                    this.loadingHelper[a.name] = e;
                    this.loadingHelper.loadOrder.push(a.name);
                    g = new Date;
                    g = g.getTime();
                    g = a.config.scayt_srcUrl + "?" + g;
                    CKEDITOR.scriptLoader.load(g, function () {
                        var a;
                        CKEDITOR.fireOnce("scaytReady");
                        for (var d = 0; d < b.loadingHelper.loadOrder.length; d++) {
                            a = b.loadingHelper.loadOrder[d];
                            if (typeof b.loadingHelper[a] === "function")b.loadingHelper[a](CKEDITOR.instances[a]);
                            delete b.loadingHelper[a]
                        }
                        b.loadingHelper.loadOrder =
                            []
                    })
                }
            } else if (window.SCAYT && typeof window.SCAYT.CKSCAYT === "function") {
                CKEDITOR.fireOnce("scaytReady");
                a.scayt || typeof e === "function" && e(a)
            }
        }
    },CKEDITOR.on("dialogDefinition", function (a) {
        if (a.data.name === "scaytDialog")a.data.definition.dialog.on("cancel", function () {
            return false
        }, this, null, -1)
    }),CKEDITOR.on("scaytReady", function () {
        if (CKEDITOR.config.scayt_handleCheckDirty === true) {
            var a = CKEDITOR.editor.prototype;
            a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function (a) {
                return function () {
                    var e = null,
                        c = this.scayt;
                    if (!CKEDITOR.plugins.scayt || !CKEDITOR.plugins.scayt.state[this.name] || !this.scayt)e = a.call(this); else if (e = this.status == "ready")var d = c.removeMarkupFromString(this.getSnapshot()), c = c.removeMarkupFromString(this._.previousValue), e = e && c !== d;
                    return e
                }
            });
            a.resetDirty = CKEDITOR.tools.override(a.resetDirty, function (a) {
                return function () {
                    var e = this.scayt;
                    !CKEDITOR.plugins.scayt || !CKEDITOR.plugins.scayt.state[this.name] || !this.scayt ? a.call(this) : this._.previousValue = e.removeMarkupFromString(this.getSnapshot())
                }
            })
        }
        if (CKEDITOR.config.scayt_handleUndoRedo ===
            true) {
            var a = CKEDITOR.plugins.undo.Image.prototype, e = typeof a.equalsContent == "function" ? "equalsContent" : "equals";
            a[e] = CKEDITOR.tools.override(a[e], function (a) {
                return function (e) {
                    var c = e.editor.scayt, d = this.contents, i = e.contents, f = null;
                    if (CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state[e.editor.name] && e.editor.scayt) {
                        this.contents = c.removeMarkupFromString(d) || "";
                        e.contents = c.removeMarkupFromString(i) || ""
                    }
                    f = a.apply(this, arguments);
                    this.contents = d;
                    e.contents = i;
                    return f
                }
            })
        }
    }),function () {
        var a = {
            preserveState: true,
            editorFocus: false, readOnly: 1, exec: function (a) {
                this.toggleState();
                this.refresh(a)
            }, refresh: function (a) {
                if (a.document) {
                    var b = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
                    a.editable()[b]("cke_show_borders")
                }
            }
        };
        CKEDITOR.plugins.add("showborders", {
            modes: {wysiwyg: 1}, onLoad: function () {
                var a;
                a = (CKEDITOR.env.ie6Compat ? [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : [".%1 table.%2,", ".%1 table.%2 > tr > td, .%1 table.%2 > tr > th,", ".%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,",
                    ".%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,", ".%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th", "{", "border : #d3d3d3 1px dotted", "}"]).join("").replace(/%2/g, "cke_show_border").replace(/%1/g, "cke_show_borders ");
                CKEDITOR.addCss(a)
            }, init: function (e) {
                var b = e.addCommand("showborders", a);
                b.canUndo = false;
                e.config.startupShowBorders !== false && b.setState(CKEDITOR.TRISTATE_ON);
                e.on("mode", function () {
                    b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(e)
                }, null, null, 100);
                e.on("contentDom",
                    function () {
                        b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(e)
                    });
                e.on("removeFormatCleanup", function (a) {
                    a = a.data;
                    e.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && (a.is("table") && (!a.hasAttribute("border") || parseInt(a.getAttribute("border"), 10) <= 0)) && a.addClass("cke_show_border")
                })
            }, afterInit: function (a) {
                var b = a.dataProcessor, a = b && b.dataFilter, b = b && b.htmlFilter;
                a && a.addRules({
                    elements: {
                        table: function (a) {
                            var a = a.attributes, b = a["class"], d = parseInt(a.border, 10);
                            if ((!d || d <= 0) && (!b || b.indexOf("cke_show_border") == -1))a["class"] = (b || "") + " cke_show_border"
                        }
                    }
                });
                b && b.addRules({
                    elements: {
                        table: function (a) {
                            var a = a.attributes, b = a["class"];
                            b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/, ""))
                        }
                    }
                })
            }
        });
        CKEDITOR.on("dialogDefinition", function (a) {
            var b = a.data.name;
            if (b == "table" || b == "tableProperties") {
                a = a.data.definition;
                b = a.getContents("info").get("txtBorder");
                b.commit = CKEDITOR.tools.override(b.commit, function (a) {
                    return function (b, d) {
                        a.apply(this, arguments);
                        var e = parseInt(this.getValue(),
                            10);
                        d[!e || e <= 0 ? "addClass" : "removeClass"]("cke_show_border")
                    }
                });
                if (a = (a = a.getContents("advanced")) && a.get("advCSSClasses")) {
                    a.setup = CKEDITOR.tools.override(a.setup, function (a) {
                        return function () {
                            a.apply(this, arguments);
                            this.setValue(this.getValue().replace(/cke_show_border/, ""))
                        }
                    });
                    a.commit = CKEDITOR.tools.override(a.commit, function (a) {
                        return function (b, d) {
                            a.apply(this, arguments);
                            parseInt(d.getAttribute("border"), 10) || d.addClass("cke_show_border")
                        }
                    })
                }
            }
        })
    }(),function () {
        CKEDITOR.plugins.add("sourcearea",
            {
                init: function (e) {
                    function b() {
                        var a = c && this.equals(CKEDITOR.document.getActive());
                        this.hide();
                        this.setStyle("height", this.getParent().$.clientHeight + "px");
                        this.setStyle("width", this.getParent().$.clientWidth + "px");
                        this.show();
                        a && this.focus()
                    }

                    if (e.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                        var g = CKEDITOR.plugins.sourcearea;
                        e.addMode("source", function (c) {
                            var g = e.ui.space("contents").getDocument().createElement("textarea");
                            g.setStyles(CKEDITOR.tools.extend({
                                width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
                                height: "100%",
                                resize: "none",
                                outline: "none",
                                "text-align": "left"
                            }, CKEDITOR.tools.cssVendorPrefix("tab-size", e.config.sourceAreaTabSize || 4)));
                            g.setAttribute("dir", "ltr");
                            g.addClass("cke_source cke_reset cke_enable_context_menu");
                            e.ui.space("contents").append(g);
                            g = e.editable(new a(e, g));
                            g.setData(e.getData(1));
                            if (CKEDITOR.env.ie) {
                                g.attachListener(e, "resize", b, g);
                                g.attachListener(CKEDITOR.document.getWindow(), "resize", b, g);
                                CKEDITOR.tools.setTimeout(b, 0, g)
                            }
                            e.fire("ariaWidget", this);
                            c()
                        });
                        e.addCommand("source",
                            g.commands.source);
                        e.ui.addButton && e.ui.addButton("Source", {
                            label: e.lang.sourcearea.toolbar,
                            command: "source",
                            toolbar: "mode,10"
                        });
                        e.on("mode", function () {
                            e.getCommand("source").setState(e.mode == "source" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                        });
                        var c = CKEDITOR.env.ie && CKEDITOR.env.version == 9
                    }
                }
            });
        var a = CKEDITOR.tools.createClass({
            base: CKEDITOR.editable, proto: {
                setData: function (a) {
                    this.setValue(a);
                    this.status = "ready";
                    this.editor.fire("dataReady")
                }, getData: function () {
                    return this.getValue()
                }, insertHtml: function () {
                },
                insertElement: function () {
                }, insertText: function () {
                }, setReadOnly: function (a) {
                    this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly")
                }, detach: function () {
                    a.baseProto.detach.call(this);
                    this.clearCustomData();
                    this.remove()
                }
            }
        })
    }(),CKEDITOR.plugins.sourcearea = {
        commands: {
            source: {
                modes: {
                    wysiwyg: 1,
                    source: 1
                }, editorFocus: !1, readOnly: 1, exec: function (a) {
                    a.mode == "wysiwyg" && a.fire("saveSnapshot");
                    a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
                    a.setMode(a.mode == "source" ? "wysiwyg" : "source")
                }, canUndo: !1
            }
        }
    },
    CKEDITOR.plugins.add("specialchar", {
        availableLangs: {
            af: 1,
            ar: 1,
            bg: 1,
            ca: 1,
            cs: 1,
            cy: 1,
            da: 1,
            de: 1,
            el: 1,
            en: 1,
            "en-gb": 1,
            eo: 1,
            es: 1,
            et: 1,
            fa: 1,
            fi: 1,
            fr: 1,
            "fr-ca": 1,
            gl: 1,
            he: 1,
            hr: 1,
            hu: 1,
            id: 1,
            it: 1,
            ja: 1,
            km: 1,
            ku: 1,
            lt: 1,
            lv: 1,
            nb: 1,
            nl: 1,
            no: 1,
            pl: 1,
            pt: 1,
            "pt-br": 1,
            ru: 1,
            si: 1,
            sk: 1,
            sl: 1,
            sq: 1,
            sv: 1,
            th: 1,
            tr: 1,
            tt: 1,
            ug: 1,
            uk: 1,
            vi: 1,
            zh: 1,
            "zh-cn": 1
        }, requires: "dialog", init: function (a) {
            var e = this;
            CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
            a.addCommand("specialchar", {
                exec: function () {
                    var b = a.langCode, b = e.availableLangs[b] ?
                        b : e.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
                    CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e.path + "dialogs/lang/" + b + ".js"), function () {
                        CKEDITOR.tools.extend(a.lang.specialchar, e.langEntries[b]);
                        a.openDialog("specialchar")
                    })
                }, modes: {wysiwyg: 1}, canUndo: false
            });
            a.ui.addButton && a.ui.addButton("SpecialChar", {
                label: a.lang.specialchar.toolbar,
                command: "specialchar",
                toolbar: "insert,50"
            })
        }
    }),CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" "),
    function () {
        CKEDITOR.plugins.add("stylescombo", {
            requires: "richcombo", init: function (a) {
                var e = a.config, b = a.lang.stylescombo, g = {}, c = [], d = [];
                a.on("stylesSet", function (b) {
                    if (b = b.data.styles) {
                        for (var f, h, j, k = 0, n = b.length; k < n; k++) {
                            f = b[k];
                            if (!(a.blockless && f.element in CKEDITOR.dtd.$block)) {
                                h = f.name;
                                f = new CKEDITOR.style(f);
                                if (!a.filter.customConfig || a.filter.check(f)) {
                                    f._name = h;
                                    f._.enterMode = e.enterMode;
                                    f._.type = j = f.assignedTo || f.type;
                                    f._.weight = k + (j == CKEDITOR.STYLE_OBJECT ? 1 : j == CKEDITOR.STYLE_BLOCK ? 2 : 3) * 1E3;
                                    g[h] = f;
                                    c.push(f);
                                    d.push(f)
                                }
                            }
                        }
                        c.sort(function (a, b) {
                            return a._.weight - b._.weight
                        })
                    }
                });
                a.ui.addRichCombo("Styles", {
                    label: b.label,
                    title: b.panelTitle,
                    toolbar: "styles,10",
                    allowedContent: d,
                    panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(e.contentsCss),
                        multiSelect: true,
                        attributes: {"aria-label": b.panelTitle}
                    },
                    init: function () {
                        var a, d, e, g, k, n;
                        k = 0;
                        for (n = c.length; k < n; k++) {
                            a = c[k];
                            d = a._name;
                            g = a._.type;
                            if (g != e) {
                                this.startGroup(b["panelTitle" + g]);
                                e = g
                            }
                            this.add(d, a.type == CKEDITOR.STYLE_OBJECT ? d : a.buildPreview(),
                                d)
                        }
                        this.commit()
                    },
                    onClick: function (b) {
                        a.focus();
                        a.fire("saveSnapshot");
                        var b = g[b], c = a.elementPath();
                        a[b.checkActive(c, a) ? "removeStyle" : "applyStyle"](b);
                        a.fire("saveSnapshot")
                    },
                    onRender: function () {
                        a.on("selectionChange", function (b) {
                            for (var c = this.getValue(), b = b.data.path.elements, d = 0, e = b.length, k; d < e; d++) {
                                k = b[d];
                                for (var n in g)if (g[n].checkElementRemovable(k, true, a)) {
                                    n != c && this.setValue(n);
                                    return
                                }
                            }
                            this.setValue("")
                        }, this)
                    },
                    onOpen: function () {
                        var c = a.getSelection().getSelectedElement(), c = a.elementPath(c),
                            d = [0, 0, 0, 0];
                        this.showAll();
                        this.unmarkAll();
                        for (var e in g) {
                            var j = g[e], k = j._.type;
                            j.checkApplicable(c, a, a.activeFilter) ? d[k]++ : this.hideItem(e);
                            j.checkActive(c, a) && this.mark(e)
                        }
                        d[CKEDITOR.STYLE_BLOCK] || this.hideGroup(b["panelTitle" + CKEDITOR.STYLE_BLOCK]);
                        d[CKEDITOR.STYLE_INLINE] || this.hideGroup(b["panelTitle" + CKEDITOR.STYLE_INLINE]);
                        d[CKEDITOR.STYLE_OBJECT] || this.hideGroup(b["panelTitle" + CKEDITOR.STYLE_OBJECT])
                    },
                    refresh: function () {
                        var b = a.elementPath();
                        if (b) {
                            for (var c in g)if (g[c].checkApplicable(b,
                                    a, a.activeFilter))return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    },
                    reset: function () {
                        g = {};
                        c = []
                    }
                })
            }
        })
    }(),function () {
        function a(a) {
            return {
                editorFocus: false,
                canUndo: false,
                modes: {wysiwyg: 1},
                exec: function (b) {
                    if (b.editable().hasFocus) {
                        var e = b.getSelection(), f;
                        if (f = (new CKEDITOR.dom.elementPath(e.getCommonAncestor(), e.root)).contains({
                                td: 1,
                                th: 1
                            }, 1)) {
                            var e = b.createRange(), g = CKEDITOR.tools.tryThese(function () {
                                var b = f.getParent().$.cells[f.$.cellIndex + (a ? -1 : 1)];
                                b.parentNode.parentNode;
                                return b
                            }, function () {
                                var b =
                                    f.getParent(), b = b.getAscendant("table").$.rows[b.$.rowIndex + (a ? -1 : 1)];
                                return b.cells[a ? b.cells.length - 1 : 0]
                            });
                            if (!g && !a) {
                                for (var j = f.getAscendant("table").$, g = f.getParent().$.cells, j = new CKEDITOR.dom.element(j.insertRow(-1), b.document), k = 0, n = g.length; k < n; k++)j.append((new CKEDITOR.dom.element(g[k], b.document)).clone(false, false)).appendBogus();
                                e.moveToElementEditStart(j)
                            } else if (g) {
                                g = new CKEDITOR.dom.element(g);
                                e.moveToElementEditStart(g);
                                (!e.checkStartOfBlock() || !e.checkEndOfBlock()) && e.selectNodeContents(g)
                            } else return true;
                            e.select(true);
                            return true
                        }
                    }
                    return false
                }
            }
        }

        var e = {
            editorFocus: false,
            modes: {wysiwyg: 1, source: 1}
        }, b = {
            exec: function (a) {
                a.container.focusNext(true, a.tabIndex)
            }
        }, g = {
            exec: function (a) {
                a.container.focusPrevious(true, a.tabIndex)
            }
        };
        CKEDITOR.plugins.add("tab", {
            init: function (c) {
                for (var d = c.config.enableTabKeyTools !== false, i = c.config.tabSpaces || 0, f = ""; i--;)f = f + " ";
                if (f)c.on("key", function (a) {
                    if (a.data.keyCode == 9) {
                        c.insertText(f);
                        a.cancel()
                    }
                });
                if (d)c.on("key", function (a) {
                    (a.data.keyCode == 9 && c.execCommand("selectNextCell") ||
                    a.data.keyCode == CKEDITOR.SHIFT + 9 && c.execCommand("selectPreviousCell")) && a.cancel()
                });
                c.addCommand("blur", CKEDITOR.tools.extend(b, e));
                c.addCommand("blurBack", CKEDITOR.tools.extend(g, e));
                c.addCommand("selectNextCell", a());
                c.addCommand("selectPreviousCell", a(true))
            }
        })
    }(),CKEDITOR.dom.element.prototype.focusNext = function (a, e) {
        var b = e === void 0 ? this.getTabIndex() : e, g, c, d, i, f, h;
        if (b <= 0)for (f = this.getNextSourceNode(a, CKEDITOR.NODE_ELEMENT); f;) {
            if (f.isVisible() && f.getTabIndex() === 0) {
                d = f;
                break
            }
            f = f.getNextSourceNode(false,
                CKEDITOR.NODE_ELEMENT)
        } else for (f = this.getDocument().getBody().getFirst(); f = f.getNextSourceNode(false, CKEDITOR.NODE_ELEMENT);) {
            if (!g)if (!c && f.equals(this)) {
                c = true;
                if (a) {
                    if (!(f = f.getNextSourceNode(true, CKEDITOR.NODE_ELEMENT)))break;
                    g = 1
                }
            } else c && !this.contains(f) && (g = 1);
            if (f.isVisible() && !((h = f.getTabIndex()) < 0)) {
                if (g && h == b) {
                    d = f;
                    break
                }
                if (h > b && (!d || !i || h < i)) {
                    d = f;
                    i = h
                } else if (!d && h === 0) {
                    d = f;
                    i = h
                }
            }
        }
        d && d.focus()
    },CKEDITOR.dom.element.prototype.focusPrevious = function (a, e) {
        for (var b = e === void 0 ? this.getTabIndex() :
            e, g, c, d, i = 0, f, h = this.getDocument().getBody().getLast(); h = h.getPreviousSourceNode(false, CKEDITOR.NODE_ELEMENT);) {
            if (!g)if (!c && h.equals(this)) {
                c = true;
                if (a) {
                    if (!(h = h.getPreviousSourceNode(true, CKEDITOR.NODE_ELEMENT)))break;
                    g = 1
                }
            } else c && !this.contains(h) && (g = 1);
            if (h.isVisible() && !((f = h.getTabIndex()) < 0))if (b <= 0) {
                if (g && f === 0) {
                    d = h;
                    break
                }
                if (f > i) {
                    d = h;
                    i = f
                }
            } else {
                if (g && f == b) {
                    d = h;
                    break
                }
                if (f < b && (!d || f > i)) {
                    d = h;
                    i = f
                }
            }
        }
        d && d.focus()
    },CKEDITOR.plugins.add("table", {
        requires: "dialog", init: function (a) {
            function e(a) {
                return CKEDITOR.tools.extend(a ||
                    {}, {
                    contextSensitive: 1, refresh: function (a, b) {
                        this.setState(b.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                    }
                })
            }

            if (!a.blockless) {
                var b = a.lang.table;
                a.addCommand("table", new CKEDITOR.dialogCommand("table", {
                    context: "table",
                    allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ? "table" + a.plugins.dialogadvtab.allowedContent() : ""),
                    requiredContent: "table",
                    contentTransformations: [["table{width}: sizeToStyle",
                        "table[width]: sizeToAttribute"]]
                }));
                a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", e()));
                a.addCommand("tableDelete", e({
                    exec: function (a) {
                        var b = a.elementPath().contains("table", 1);
                        if (b) {
                            var d = b.getParent(), e = a.editable();
                            d.getChildCount() == 1 && (!d.is("td", "th") && !d.equals(e)) && (b = d);
                            a = a.createRange();
                            a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
                            b.remove();
                            a.select()
                        }
                    }
                }));
                a.ui.addButton && a.ui.addButton("Table", {
                    label: b.toolbar,
                    command: "table",
                    toolbar: "insert,30"
                });
                CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
                CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
                a.addMenuItems && a.addMenuItems({
                    table: {
                        label: b.menu,
                        command: "tableProperties",
                        group: "table",
                        order: 5
                    },
                    tabledelete: {
                        label: b.deleteTable,
                        command: "tableDelete",
                        group: "table",
                        order: 1
                    }
                });
                a.on("doubleclick", function (a) {
                    if (a.data.element.is("table"))a.data.dialog = "tableProperties"
                });
                a.contextMenu && a.contextMenu.addListener(function () {
                    return {
                        tabledelete: CKEDITOR.TRISTATE_OFF,
                        table: CKEDITOR.TRISTATE_OFF
                    }
                })
            }
        }
    }),
    function () {
        function a(a) {
            function b(a) {
                if (!(c.length > 0) && a.type == CKEDITOR.NODE_ELEMENT && o.test(a.getName()) && !a.getCustomData("selected_cell")) {
                    CKEDITOR.dom.element.setMarker(d, a, "selected_cell", true);
                    c.push(a)
                }
            }

            for (var a = a.getRanges(), c = [], d = {}, f = 0; f < a.length; f++) {
                var e = a[f];
                if (e.collapsed) {
                    e = e.getCommonAncestor();
                    (e = e.getAscendant("td", true) || e.getAscendant("th", true)) && c.push(e)
                } else {
                    var e = new CKEDITOR.dom.walker(e), g;
                    for (e.guard = b; g = e.next();)if (g.type != CKEDITOR.NODE_ELEMENT || !g.is(CKEDITOR.dtd.table))if ((g =
                            g.getAscendant("td", true) || g.getAscendant("th", true)) && !g.getCustomData("selected_cell")) {
                        CKEDITOR.dom.element.setMarker(d, g, "selected_cell", true);
                        c.push(g)
                    }
                }
            }
            CKEDITOR.dom.element.clearAllMarkers(d);
            return c
        }

        function e(b, c) {
            for (var d = a(b), f = d[0], e = f.getAscendant("table"), f = f.getDocument(), g = d[0].getParent(), h = g.$.rowIndex, d = d[d.length - 1], i = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = new CKEDITOR.dom.element(e.$.rows[i]), h = c ? h : i, g = c ? g : d, d = CKEDITOR.tools.buildTableMap(e), e = d[h], h = c ? d[h - 1] : d[h + 1], d = d[0].length,
                     f = f.createElement("tr"), i = 0; e[i] && i < d; i++) {
                var j;
                if (e[i].rowSpan > 1 && h && e[i] == h[i]) {
                    j = e[i];
                    j.rowSpan = j.rowSpan + 1
                } else {
                    j = (new CKEDITOR.dom.element(e[i])).clone();
                    j.removeAttribute("rowSpan");
                    j.appendBogus();
                    f.append(j);
                    j = j.$
                }
                i = i + (j.colSpan - 1)
            }
            c ? f.insertBefore(g) : f.insertAfter(g)
        }

        function b(c) {
            if (c instanceof CKEDITOR.dom.selection) {
                for (var d = a(c), f = d[0].getAscendant("table"), e = CKEDITOR.tools.buildTableMap(f), c = d[0].getParent().$.rowIndex, d = d[d.length - 1], g = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [],
                         h = c; h <= g; h++) {
                    for (var i = e[h], j = new CKEDITOR.dom.element(f.$.rows[h]), k = 0; k < i.length; k++) {
                        var n = new CKEDITOR.dom.element(i[k]), o = n.getParent().$.rowIndex;
                        if (n.$.rowSpan == 1)n.remove(); else {
                            n.$.rowSpan = n.$.rowSpan - 1;
                            if (o == h) {
                                o = e[h + 1];
                                o[k - 1] ? n.insertAfter(new CKEDITOR.dom.element(o[k - 1])) : (new CKEDITOR.dom.element(f.$.rows[h + 1])).append(n, 1)
                            }
                        }
                        k = k + (n.$.colSpan - 1)
                    }
                    d.push(j)
                }
                e = f.$.rows;
                f = new CKEDITOR.dom.element(e[g + 1] || (c > 0 ? e[c - 1] : null) || f.$.parentNode);
                for (h = d.length; h >= 0; h--)b(d[h]);
                return f
            }
            if (c instanceof
                CKEDITOR.dom.element) {
                f = c.getAscendant("table");
                f.$.rows.length == 1 ? f.remove() : c.remove()
            }
            return null
        }

        function g(a, b) {
            for (var c = b ? Infinity : 0, d = 0; d < a.length; d++) {
                var f;
                f = a[d];
                for (var e = b, g = f.getParent().$.cells, h = 0, i = 0; i < g.length; i++) {
                    var j = g[i], h = h + (e ? 1 : j.colSpan);
                    if (j == f.$)break
                }
                f = h - 1;
                if (b ? f < c : f > c)c = f
            }
            return c
        }

        function c(b, c) {
            for (var d = a(b), f = d[0].getAscendant("table"), e = g(d, 1), d = g(d), e = c ? e : d, h = CKEDITOR.tools.buildTableMap(f), f = [], d = [], i = h.length, j = 0; j < i; j++) {
                f.push(h[j][e]);
                d.push(c ? h[j][e - 1] : h[j][e +
                1])
            }
            for (j = 0; j < i; j++)if (f[j]) {
                if (f[j].colSpan > 1 && d[j] == f[j]) {
                    e = f[j];
                    e.colSpan = e.colSpan + 1
                } else {
                    e = (new CKEDITOR.dom.element(f[j])).clone();
                    e.removeAttribute("colSpan");
                    e.appendBogus();
                    e[c ? "insertBefore" : "insertAfter"].call(e, new CKEDITOR.dom.element(f[j]));
                    e = e.$
                }
                j = j + (e.rowSpan - 1)
            }
        }

        function d(a, b) {
            var c = a.getStartElement();
            if (c = c.getAscendant("td", 1) || c.getAscendant("th", 1)) {
                var d = c.clone();
                d.appendBogus();
                b ? d.insertBefore(c) : d.insertAfter(c)
            }
        }

        function i(b) {
            if (b instanceof CKEDITOR.dom.selection) {
                var b =
                    a(b), c = b[0] && b[0].getAscendant("table"), d;
                a:{
                    var e = 0;
                    d = b.length - 1;
                    for (var g = {}, h, j; h = b[e++];)CKEDITOR.dom.element.setMarker(g, h, "delete_cell", true);
                    for (e = 0; h = b[e++];)if ((j = h.getPrevious()) && !j.getCustomData("delete_cell") || (j = h.getNext()) && !j.getCustomData("delete_cell")) {
                        CKEDITOR.dom.element.clearAllMarkers(g);
                        d = j;
                        break a
                    }
                    CKEDITOR.dom.element.clearAllMarkers(g);
                    j = b[0].getParent();
                    if (j = j.getPrevious())d = j.getLast(); else {
                        j = b[d].getParent();
                        d = (j = j.getNext()) ? j.getChild(0) : null
                    }
                }
                for (j = b.length - 1; j >=
                0; j--)i(b[j]);
                d ? f(d, true) : c && c.remove()
            } else if (b instanceof CKEDITOR.dom.element) {
                c = b.getParent();
                c.getChildCount() == 1 ? c.remove() : b.remove()
            }
        }

        function f(a, b) {
            var c = a.getDocument(), d = CKEDITOR.document;
            if (CKEDITOR.env.ie && CKEDITOR.env.version == 10) {
                d.focus();
                c.focus()
            }
            c = new CKEDITOR.dom.range(c);
            if (!c["moveToElementEdit" + (b ? "End" : "Start")](a)) {
                c.selectNodeContents(a);
                c.collapse(b ? false : true)
            }
            c.select(true)
        }

        function h(a, b, c) {
            a = a[b];
            if (typeof c == "undefined")return a;
            for (b = 0; a && b < a.length; b++) {
                if (c.is &&
                    a[b] == c.$)return b;
                if (b == c)return new CKEDITOR.dom.element(a[b])
            }
            return c.is ? -1 : null
        }

        function j(b, c, d) {
            var f = a(b), e;
            if ((c ? f.length != 1 : f.length < 2) || (e = b.getCommonAncestor()) && e.type == CKEDITOR.NODE_ELEMENT && e.is("table"))return false;
            var g, b = f[0];
            e = b.getAscendant("table");
            var i = CKEDITOR.tools.buildTableMap(e), j = i.length, k = i[0].length, n = b.getParent().$.rowIndex, o = h(i, n, b);
            if (c) {
                var y;
                try {
                    var z = parseInt(b.getAttribute("rowspan"), 10) || 1;
                    g = parseInt(b.getAttribute("colspan"), 10) || 1;
                    y = i[c == "up" ? n - z : c == "down" ?
                    n + z : n][c == "left" ? o - g : c == "right" ? o + g : o]
                } catch (B) {
                    return false
                }
                if (!y || b.$ == y)return false;
                f[c == "up" || c == "left" ? "unshift" : "push"](new CKEDITOR.dom.element(y))
            }
            for (var c = b.getDocument(), A = n, z = y = 0, G = !d && new CKEDITOR.dom.documentFragment(c), D = 0, c = 0; c < f.length; c++) {
                g = f[c];
                var J = g.getParent(), C = g.getFirst(), F = g.$.colSpan, E = g.$.rowSpan, J = J.$.rowIndex, I = h(i, J, g), D = D + F * E, z = Math.max(z, I - o + F);
                y = Math.max(y, J - n + E);
                if (!d) {
                    F = g;
                    (E = F.getBogus()) && E.remove();
                    F.trim();
                    if (g.getChildren().count()) {
                        if (J != A && C && (!C.isBlockBoundary || !C.isBlockBoundary({br: 1})))(A = G.getLast(CKEDITOR.dom.walker.whitespaces(true))) && (!A.is || !A.is("br")) && G.append("br");
                        g.moveChildren(G)
                    }
                    c ? g.remove() : g.setHtml("")
                }
                A = J
            }
            if (d)return y * z == D;
            G.moveChildren(b);
            b.appendBogus();
            z >= k ? b.removeAttribute("rowSpan") : b.$.rowSpan = y;
            y >= j ? b.removeAttribute("colSpan") : b.$.colSpan = z;
            d = new CKEDITOR.dom.nodeList(e.$.rows);
            f = d.count();
            for (c = f - 1; c >= 0; c--) {
                e = d.getItem(c);
                if (!e.$.cells.length) {
                    e.remove();
                    f++
                }
            }
            return b
        }

        function k(b, c) {
            var d = a(b);
            if (d.length > 1)return false;
            if (c)return true;
            var d = d[0], f = d.getParent(), e = f.getAscendant("table"), g = CKEDITOR.tools.buildTableMap(e), i = f.$.rowIndex, j = h(g, i, d), k = d.$.rowSpan, n;
            if (k > 1) {
                n = Math.ceil(k / 2);
                for (var k = Math.floor(k / 2), f = i + n, e = new CKEDITOR.dom.element(e.$.rows[f]), g = h(g, f), o, f = d.clone(), i = 0; i < g.length; i++) {
                    o = g[i];
                    if (o.parentNode == e.$ && i > j) {
                        f.insertBefore(new CKEDITOR.dom.element(o));
                        break
                    } else o = null
                }
                o || e.append(f)
            } else {
                k = n = 1;
                e = f.clone();
                e.insertAfter(f);
                e.append(f = d.clone());
                o = h(g, i);
                for (j = 0; j < o.length; j++)o[j].rowSpan++
            }
            f.appendBogus();
            d.$.rowSpan = n;
            f.$.rowSpan = k;
            n == 1 && d.removeAttribute("rowSpan");
            k == 1 && f.removeAttribute("rowSpan");
            return f
        }

        function n(b, c) {
            var d = a(b);
            if (d.length > 1)return false;
            if (c)return true;
            var d = d[0], f = d.getParent(), e = f.getAscendant("table"), e = CKEDITOR.tools.buildTableMap(e), g = h(e, f.$.rowIndex, d), i = d.$.colSpan;
            if (i > 1) {
                f = Math.ceil(i / 2);
                i = Math.floor(i / 2)
            } else {
                for (var i = f = 1, j = [], k = 0; k < e.length; k++) {
                    var n = e[k];
                    j.push(n[g]);
                    n[g].rowSpan > 1 && (k = k + (n[g].rowSpan - 1))
                }
                for (e = 0; e < j.length; e++)j[e].colSpan++
            }
            e = d.clone();
            e.insertAfter(d);
            e.appendBogus();
            d.$.colSpan = f;
            e.$.colSpan = i;
            f == 1 && d.removeAttribute("colSpan");
            i == 1 && e.removeAttribute("colSpan");
            return e
        }

        var o = /^(?:td|th)$/;
        CKEDITOR.plugins.tabletools = {
            requires: "table,dialog,contextmenu", init: function (g) {
                function h(a) {
                    return CKEDITOR.tools.extend(a || {}, {
                        contextSensitive: 1,
                        refresh: function (a, b) {
                            this.setState(b.contains({
                                td: 1,
                                th: 1
                            }, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                        }
                    })
                }

                function l(a, b) {
                    var c = g.addCommand(a, b);
                    g.addFeature(c)
                }

                var o = g.lang.table;
                l("cellProperties", new CKEDITOR.dialogCommand("cellProperties", h({
                    allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
                    requiredContent: "table"
                })));
                CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
                l("rowDelete", h({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        f(b(a))
                    }
                }));
                l("rowInsertBefore", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        e(a, true)
                    }
                }));
                l("rowInsertAfter", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        e(a)
                    }
                }));
                l("columnDelete", h({
                    requiredContent: "table", exec: function (b) {
                        for (var b = b.getSelection(), b = a(b), c = b[0], d = b[b.length - 1], b = c.getAscendant("table"), e = CKEDITOR.tools.buildTableMap(b), g, h, i = [], j = 0, k = e.length; j < k; j++)for (var m = 0, l = e[j].length; m < l; m++) {
                            e[j][m] == c.$ && (g = m);
                            e[j][m] == d.$ && (h = m)
                        }
                        for (j = g; j <= h; j++)for (m = 0; m < e.length; m++) {
                            d = e[m];
                            c = new CKEDITOR.dom.element(b.$.rows[m]);
                            d = new CKEDITOR.dom.element(d[j]);
                            if (d.$) {
                                d.$.colSpan == 1 ? d.remove() : d.$.colSpan = d.$.colSpan -
                                    1;
                                m = m + (d.$.rowSpan - 1);
                                c.$.cells.length || i.push(c)
                            }
                        }
                        h = b.$.rows[0] && b.$.rows[0].cells;
                        g = new CKEDITOR.dom.element(h[g] || (g ? h[g - 1] : b.$.parentNode));
                        i.length == k && b.remove();
                        g && f(g, true)
                    }
                }));
                l("columnInsertBefore", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        c(a, true)
                    }
                }));
                l("columnInsertAfter", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        c(a)
                    }
                }));
                l("cellDelete", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        i(a)
                    }
                }));
                l("cellMerge", h({
                    allowedContent: "td[colspan,rowspan]",
                    requiredContent: "td[colspan,rowspan]", exec: function (a) {
                        f(j(a.getSelection()), true)
                    }
                }));
                l("cellMergeRight", h({
                    allowedContent: "td[colspan]",
                    requiredContent: "td[colspan]",
                    exec: function (a) {
                        f(j(a.getSelection(), "right"), true)
                    }
                }));
                l("cellMergeDown", h({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function (a) {
                        f(j(a.getSelection(), "down"), true)
                    }
                }));
                l("cellVerticalSplit", h({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function (a) {
                        f(k(a.getSelection()))
                    }
                }));
                l("cellHorizontalSplit",
                    h({
                        allowedContent: "td[colspan]",
                        requiredContent: "td[colspan]",
                        exec: function (a) {
                            f(n(a.getSelection()))
                        }
                    }));
                l("cellInsertBefore", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        d(a, true)
                    }
                }));
                l("cellInsertAfter", h({
                    requiredContent: "table",
                    exec: function (a) {
                        a = a.getSelection();
                        d(a)
                    }
                }));
                g.addMenuItems && g.addMenuItems({
                    tablecell: {
                        label: o.cell.menu,
                        group: "tablecell",
                        order: 1,
                        getItems: function () {
                            var b = g.getSelection(), c = a(b);
                            return {
                                tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecell_delete: CKEDITOR.TRISTATE_OFF,
                                tablecell_merge: j(b, null, true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_right: j(b, "right", true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_down: j(b, "down", true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_vertical: k(b, true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_horizontal: n(b, true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_properties: c.length > 0 ? CKEDITOR.TRISTATE_OFF :
                                    CKEDITOR.TRISTATE_DISABLED
                            }
                        }
                    },
                    tablecell_insertBefore: {
                        label: o.cell.insertBefore,
                        group: "tablecell",
                        command: "cellInsertBefore",
                        order: 5
                    },
                    tablecell_insertAfter: {
                        label: o.cell.insertAfter,
                        group: "tablecell",
                        command: "cellInsertAfter",
                        order: 10
                    },
                    tablecell_delete: {
                        label: o.cell.deleteCell,
                        group: "tablecell",
                        command: "cellDelete",
                        order: 15
                    },
                    tablecell_merge: {
                        label: o.cell.merge,
                        group: "tablecell",
                        command: "cellMerge",
                        order: 16
                    },
                    tablecell_merge_right: {
                        label: o.cell.mergeRight,
                        group: "tablecell",
                        command: "cellMergeRight",
                        order: 17
                    },
                    tablecell_merge_down: {
                        label: o.cell.mergeDown,
                        group: "tablecell",
                        command: "cellMergeDown",
                        order: 18
                    },
                    tablecell_split_horizontal: {
                        label: o.cell.splitHorizontal,
                        group: "tablecell",
                        command: "cellHorizontalSplit",
                        order: 19
                    },
                    tablecell_split_vertical: {
                        label: o.cell.splitVertical,
                        group: "tablecell",
                        command: "cellVerticalSplit",
                        order: 20
                    },
                    tablecell_properties: {
                        label: o.cell.title,
                        group: "tablecellproperties",
                        command: "cellProperties",
                        order: 21
                    },
                    tablerow: {
                        label: o.row.menu,
                        group: "tablerow",
                        order: 1,
                        getItems: function () {
                            return {
                                tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablerow_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablerow_insertBefore: {
                        label: o.row.insertBefore,
                        group: "tablerow",
                        command: "rowInsertBefore",
                        order: 5
                    },
                    tablerow_insertAfter: {
                        label: o.row.insertAfter,
                        group: "tablerow",
                        command: "rowInsertAfter",
                        order: 10
                    },
                    tablerow_delete: {
                        label: o.row.deleteRow,
                        group: "tablerow",
                        command: "rowDelete",
                        order: 15
                    },
                    tablecolumn: {
                        label: o.column.menu,
                        group: "tablecolumn",
                        order: 1,
                        getItems: function () {
                            return {
                                tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablecolumn_insertBefore: {
                        label: o.column.insertBefore,
                        group: "tablecolumn",
                        command: "columnInsertBefore",
                        order: 5
                    },
                    tablecolumn_insertAfter: {
                        label: o.column.insertAfter,
                        group: "tablecolumn",
                        command: "columnInsertAfter",
                        order: 10
                    },
                    tablecolumn_delete: {
                        label: o.column.deleteColumn,
                        group: "tablecolumn",
                        command: "columnDelete",
                        order: 15
                    }
                });
                g.contextMenu && g.contextMenu.addListener(function (a, b, c) {
                    return (a = c.contains({td: 1, th: 1},
                        1)) && !a.isReadOnly() ? {
                        tablecell: CKEDITOR.TRISTATE_OFF,
                        tablerow: CKEDITOR.TRISTATE_OFF,
                        tablecolumn: CKEDITOR.TRISTATE_OFF
                    } : null
                })
            }, getSelectedCells: a
        };
        CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    }(),CKEDITOR.tools.buildTableMap = function (a) {
        for (var a = a.$.rows, e = -1, b = [], g = 0; g < a.length; g++) {
            e++;
            !b[e] && (b[e] = []);
            for (var c = -1, d = 0; d < a[g].cells.length; d++) {
                var i = a[g].cells[d];
                for (c++; b[e][c];)c++;
                for (var f = isNaN(i.colSpan) ? 1 : i.colSpan, i = isNaN(i.rowSpan) ? 1 : i.rowSpan, h = 0; h < i; h++) {
                    b[e + h] || (b[e +
                    h] = []);
                    for (var j = 0; j < f; j++)b[e + h][c + j] = a[g].cells[d]
                }
                c = c + (f - 1)
            }
        }
        return b
    },function () {
        function a(a) {
            function b() {
                for (var d = g(), h = CKEDITOR.tools.clone(a.config.toolbarGroups) || e(a), j = 0; j < h.length; j++) {
                    var k = h[j];
                    if (k != "/") {
                        typeof k == "string" && (k = h[j] = {name: k});
                        var l, q = k.groups;
                        if (q)for (var s = 0; s < q.length; s++) {
                            l = q[s];
                            (l = d[l]) && f(k, l)
                        }
                        (l = d[k.name]) && f(k, l)
                    }
                }
                return h
            }

            function g() {
                var b = {}, d, f, e;
                for (d in a.ui.items) {
                    f = a.ui.items[d];
                    e = f.toolbar || "others";
                    e = e.split(",");
                    f = e[0];
                    e = parseInt(e[1] || -1, 10);
                    b[f] ||
                    (b[f] = []);
                    b[f].push({name: d, order: e})
                }
                for (f in b)b[f] = b[f].sort(function (a, b) {
                    return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1
                });
                return b
            }

            function f(b, d) {
                if (d.length) {
                    b.items ? b.items.push(a.ui.create("-")) : b.items = [];
                    for (var f; f = d.shift();) {
                        f = typeof f == "string" ? f : f.name;
                        if (!j || CKEDITOR.tools.indexOf(j, f) == -1)(f = a.ui.create(f)) && a.addFeature(f) && b.items.push(f)
                    }
                }
            }

            function h(a) {
                var b = [], c, d, e;
                for (c = 0; c < a.length; ++c) {
                    d = a[c];
                    e = {};
                    if (d == "/")b.push(d); else if (CKEDITOR.tools.isArray(d)) {
                        f(e,
                            CKEDITOR.tools.clone(d));
                        b.push(e)
                    } else if (d.items) {
                        f(e, CKEDITOR.tools.clone(d.items));
                        e.name = d.name;
                        b.push(e)
                    }
                }
                return b
            }

            var j = a.config.removeButtons, j = j && j.split(","), k = a.config.toolbar;
            typeof k == "string" && (k = a.config["toolbar_" + k]);
            return a.toolbar = k ? h(k) : b()
        }

        function e(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [{
                    name: "document",
                    groups: ["mode", "document", "doctools"]
                }, {
                    name: "clipboard",
                    groups: ["clipboard", "undo"]
                }, {
                    name: "editing",
                    groups: ["find", "selection", "spellchecker"]
                }, {name: "forms"}, "/",
                    {
                        name: "basicstyles",
                        groups: ["basicstyles", "cleanup"]
                    }, {
                        name: "paragraph",
                        groups: ["list", "indent", "blocks", "align", "bidi"]
                    }, {name: "links"}, {name: "insert"}, "/", {name: "styles"}, {name: "colors"}, {name: "tools"}, {name: "others"}, {name: "about"}])
        }

        var b = function () {
            this.toolbars = [];
            this.focusCommandExecuted = false
        };
        b.prototype.focus = function () {
            for (var a = 0, b; b = this.toolbars[a++];)for (var e = 0, f; f = b.items[e++];)if (f.focus) {
                f.focus();
                return
            }
        };
        var g = {
            modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (a) {
                if (a.toolbox) {
                    a.toolbox.focusCommandExecuted =
                        true;
                    CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function () {
                        a.toolbox.focus()
                    }, 100) : a.toolbox.focus()
                }
            }
        };
        CKEDITOR.plugins.add("toolbar", {
            requires: "button", init: function (c) {
                var d, e = function (a, b) {
                    var g, k = c.lang.dir == "rtl", n = c.config.toolbarGroupCycling, o = k ? 37 : 39, k = k ? 39 : 37, n = n === void 0 || n;
                    switch (b) {
                        case 9:
                        case CKEDITOR.SHIFT + 9:
                            for (; !g || !g.items.length;) {
                                g = b == 9 ? (g ? g.next : a.toolbar.next) || c.toolbox.toolbars[0] : (g ? g.previous : a.toolbar.previous) || c.toolbox.toolbars[c.toolbox.toolbars.length - 1];
                                if (g.items.length)for (a =
                                                            g.items[d ? g.items.length - 1 : 0]; a && !a.focus;)(a = d ? a.previous : a.next) || (g = 0)
                            }
                            a && a.focus();
                            return false;
                        case o:
                            g = a;
                            do {
                                g = g.next;
                                !g && n && (g = a.toolbar.items[0])
                            } while (g && !g.focus);
                            g ? g.focus() : e(a, 9);
                            return false;
                        case 40:
                            if (a.button && a.button.hasArrow) {
                                c.once("panelShow", function (a) {
                                    a.data._.panel._.currentBlock.onKeyDown(40)
                                });
                                a.execute()
                            } else e(a, b == 40 ? o : k);
                            return false;
                        case k:
                        case 38:
                            g = a;
                            do {
                                g = g.previous;
                                !g && n && (g = a.toolbar.items[a.toolbar.items.length - 1])
                            } while (g && !g.focus);
                            if (g)g.focus(); else {
                                d = 1;
                                e(a,
                                    CKEDITOR.SHIFT + 9);
                                d = 0
                            }
                            return false;
                        case 27:
                            c.focus();
                            return false;
                        case 13:
                        case 32:
                            a.execute();
                            return false
                    }
                    return true
                };
                c.on("uiSpace", function (d) {
                    if (d.data.space == c.config.toolbarLocation) {
                        d.removeListener();
                        c.toolbox = new b;
                        var g = CKEDITOR.tools.getNextId(), j = ['<span id="', g, '" class="cke_voice_label">', c.lang.toolbar.toolbars, "</span>", '<span id="' + c.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', g, '" onmousedown="return false;">'], g = c.config.toolbarStartupExpanded !==
                            false, k, n;
                        c.config.toolbarCanCollapse && c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && j.push('<span class="cke_toolbox_main"' + (g ? ">" : ' style="display:none">'));
                        for (var o = c.toolbox.toolbars, p = a(c), m = 0; m < p.length; m++) {
                            var l, q = 0, s, t = p[m], u;
                            if (t) {
                                if (k) {
                                    j.push("</span>");
                                    n = k = 0
                                }
                                if (t === "/")j.push('<span class="cke_toolbar_break"></span>'); else {
                                    u = t.items || t;
                                    for (var w = 0; w < u.length; w++) {
                                        var x = u[w], v;
                                        if (x)if (x.type == CKEDITOR.UI_SEPARATOR)n = k && x; else {
                                            v = x.canGroup !== false;
                                            if (!q) {
                                                l = CKEDITOR.tools.getNextId();
                                                q = {
                                                    id: l,
                                                    items: []
                                                };
                                                s = t.name && (c.lang.toolbar.toolbarGroups[t.name] || t.name);
                                                j.push('<span id="', l, '" class="cke_toolbar"', s ? ' aria-labelledby="' + l + '_label"' : "", ' role="toolbar">');
                                                s && j.push('<span id="', l, '_label" class="cke_voice_label">', s, "</span>");
                                                j.push('<span class="cke_toolbar_start"></span>');
                                                var r = o.push(q) - 1;
                                                if (r > 0) {
                                                    q.previous = o[r - 1];
                                                    q.previous.next = q
                                                }
                                            }
                                            if (v) {
                                                if (!k) {
                                                    j.push('<span class="cke_toolgroup" role="presentation">');
                                                    k = 1
                                                }
                                            } else if (k) {
                                                j.push("</span>");
                                                k = 0
                                            }
                                            l = function (a) {
                                                a = a.render(c, j);
                                                r = q.items.push(a) -
                                                    1;
                                                if (r > 0) {
                                                    a.previous = q.items[r - 1];
                                                    a.previous.next = a
                                                }
                                                a.toolbar = q;
                                                a.onkey = e;
                                                a.onfocus = function () {
                                                    c.toolbox.focusCommandExecuted || c.focus()
                                                }
                                            };
                                            if (n) {
                                                l(n);
                                                n = 0
                                            }
                                            l(x)
                                        }
                                    }
                                    if (k) {
                                        j.push("</span>");
                                        n = k = 0
                                    }
                                    q && j.push('<span class="cke_toolbar_end"></span></span>')
                                }
                            }
                        }
                        c.config.toolbarCanCollapse && j.push("</span>");
                        if (c.config.toolbarCanCollapse && c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                            var y = CKEDITOR.tools.addFunction(function () {
                                c.execCommand("toolbarCollapse")
                            });
                            c.on("destroy", function () {
                                CKEDITOR.tools.removeFunction(y)
                            });
                            c.addCommand("toolbarCollapse", {
                                readOnly: 1, exec: function (a) {
                                    var b = a.ui.space("toolbar_collapser"), c = b.getPrevious(), d = a.ui.space("contents"), f = c.getParent(), e = parseInt(d.$.style.height, 10), g = f.$.offsetHeight, h = b.hasClass("cke_toolbox_collapser_min");
                                    if (h) {
                                        c.show();
                                        b.removeClass("cke_toolbox_collapser_min");
                                        b.setAttribute("title", a.lang.toolbar.toolbarCollapse)
                                    } else {
                                        c.hide();
                                        b.addClass("cke_toolbox_collapser_min");
                                        b.setAttribute("title", a.lang.toolbar.toolbarExpand)
                                    }
                                    b.getFirst().setText(h ? "▲" : "◀");
                                    d.setStyle("height", e - (f.$.offsetHeight - g) + "px");
                                    a.fire("resize")
                                }, modes: {wysiwyg: 1, source: 1}
                            });
                            c.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                            j.push('<a title="' + (g ? c.lang.toolbar.toolbarCollapse : c.lang.toolbar.toolbarExpand) + '" id="' + c.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                            g || j.push(" cke_toolbox_collapser_min");
                            j.push('" onclick="CKEDITOR.tools.callFunction(' + y + ')">', '<span class="cke_arrow">&#9650;</span>',
                                "</a>")
                        }
                        j.push("</span>");
                        d.data.html = d.data.html + j.join("")
                    }
                });
                c.on("destroy", function () {
                    if (this.toolbox) {
                        var a, b = 0, c, d, e;
                        for (a = this.toolbox.toolbars; b < a.length; b++) {
                            d = a[b].items;
                            for (c = 0; c < d.length; c++) {
                                e = d[c];
                                e.clickFn && CKEDITOR.tools.removeFunction(e.clickFn);
                                e.keyDownFn && CKEDITOR.tools.removeFunction(e.keyDownFn)
                            }
                        }
                    }
                });
                c.on("uiReady", function () {
                    var a = c.ui.space("toolbox");
                    a && c.focusManager.add(a, 1)
                });
                c.addCommand("toolbarFocus", g);
                c.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
                c.ui.add("-", CKEDITOR.UI_SEPARATOR,
                    {});
                c.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
                    create: function () {
                        return {
                            render: function (a, b) {
                                b.push('<span class="cke_toolbar_separator" role="separator"></span>');
                                return {}
                            }
                        }
                    }
                })
            }
        });
        CKEDITOR.ui.prototype.addToolbarGroup = function (a, b, g) {
            var f = e(this.editor), h = b === 0, j = {name: a};
            if (g) {
                if (g = CKEDITOR.tools.search(f, function (a) {
                        return a.name == g
                    })) {
                    !g.groups && (g.groups = []);
                    if (b) {
                        b = CKEDITOR.tools.indexOf(g.groups, b);
                        if (b >= 0) {
                            g.groups.splice(b + 1, 0, a);
                            return
                        }
                    }
                    h ? g.groups.splice(0, 0, a) : g.groups.push(a);
                    return
                }
                b = null
            }
            b &&
            (b = CKEDITOR.tools.indexOf(f, function (a) {
                return a.name == b
            }));
            h ? f.splice(0, 0, a) : typeof b == "number" ? f.splice(b + 1, 0, j) : f.push(a)
        }
    }(),CKEDITOR.UI_SEPARATOR = "separator",CKEDITOR.config.toolbarLocation = "top","use strict",function () {
        var a = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90], e = {
            8: 1,
            46: 1
        };
        CKEDITOR.plugins.add("undo", {
            init: function (c) {
                function e(a) {
                    i.enabled && a.data.command.canUndo !== false && i.save()
                }

                function g() {
                    i.enabled = c.readOnly ? false : c.mode == "wysiwyg";
                    i.onChange()
                }

                var i =
                    c.undoManager = new b(c), n = i.editingHandler = new d(i), o = c.addCommand("undo", {
                    exec: function () {
                        if (i.undo()) {
                            c.selectionChange();
                            this.fire("afterUndo")
                        }
                    }, startDisabled: true, canUndo: false
                }), p = c.addCommand("redo", {
                    exec: function () {
                        if (i.redo()) {
                            c.selectionChange();
                            this.fire("afterRedo")
                        }
                    }, startDisabled: true, canUndo: false
                });
                c.setKeystroke([[a[0], "undo"], [a[1], "redo"], [a[2], "redo"]]);
                i.onChange = function () {
                    o.setState(i.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    p.setState(i.redoable() ? CKEDITOR.TRISTATE_OFF :
                        CKEDITOR.TRISTATE_DISABLED)
                };
                c.on("beforeCommandExec", e);
                c.on("afterCommandExec", e);
                c.on("saveSnapshot", function (a) {
                    i.save(a.data && a.data.contentOnly)
                });
                c.on("contentDom", n.attachListeners, n);
                c.on("instanceReady", function () {
                    c.fire("saveSnapshot")
                });
                c.on("beforeModeUnload", function () {
                    c.mode == "wysiwyg" && i.save(true)
                });
                c.on("mode", g);
                c.on("readOnly", g);
                if (c.ui.addButton) {
                    c.ui.addButton("Undo", {
                        label: c.lang.undo.undo,
                        command: "undo",
                        toolbar: "undo,10"
                    });
                    c.ui.addButton("Redo", {
                        label: c.lang.undo.redo, command: "redo",
                        toolbar: "undo,20"
                    })
                }
                c.resetUndo = function () {
                    i.reset();
                    c.fire("saveSnapshot")
                };
                c.on("updateSnapshot", function () {
                    i.currentImage && i.update()
                });
                c.on("lockSnapshot", function (a) {
                    a = a.data;
                    i.lock(a && a.dontUpdate, a && a.forceUpdate)
                });
                c.on("unlockSnapshot", i.unlock, i)
            }
        });
        CKEDITOR.plugins.undo = {};
        var b = CKEDITOR.plugins.undo.UndoManager = function (a) {
            this.strokesRecorded = [0, 0];
            this.locked = null;
            this.previousKeyGroup = -1;
            this.limit = a.config.undoStackSize || 20;
            this.strokesLimit = 25;
            this.editor = a;
            this.reset()
        };
        b.prototype =
        {
            type: function (a, c) {
                var d = b.getKeyGroup(a), e = this.strokesRecorded[d] + 1, c = c || e >= this.strokesLimit;
                if (!this.typing) {
                    this.hasUndo = this.typing = true;
                    this.hasRedo = false;
                    this.onChange()
                }
                if (c) {
                    e = 0;
                    this.editor.fire("saveSnapshot")
                } else this.editor.fire("change");
                this.strokesRecorded[d] = e;
                this.previousKeyGroup = d
            }, keyGroupChanged: function (a) {
            return b.getKeyGroup(a) != this.previousKeyGroup
        }, reset: function () {
            this.snapshots = [];
            this.index = -1;
            this.currentImage = null;
            this.hasRedo = this.hasUndo = false;
            this.locked = null;
            this.resetType()
        }, resetType: function () {
            this.strokesRecorded = [0, 0];
            this.typing = false;
            this.previousKeyGroup = -1
        }, refreshState: function () {
            this.hasUndo = !!this.getNextImage(true);
            this.hasRedo = !!this.getNextImage(false);
            this.resetType();
            this.onChange()
        }, save: function (a, b, c) {
            var d = this.editor;
            if (this.locked || d.status != "ready" || d.mode != "wysiwyg")return false;
            var e = d.editable();
            if (!e || e.status != "ready")return false;
            e = this.snapshots;
            b || (b = new g(d));
            if (b.contents === false)return false;
            if (this.currentImage)if (b.equalsContent(this.currentImage)) {
                if (a ||
                    b.equalsSelection(this.currentImage))return false
            } else c !== false && d.fire("change");
            e.splice(this.index + 1, e.length - this.index - 1);
            e.length == this.limit && e.shift();
            this.index = e.push(b) - 1;
            this.currentImage = b;
            c !== false && this.refreshState();
            return true
        }, restoreImage: function (a) {
            var b = this.editor, c;
            if (a.bookmarks) {
                b.focus();
                c = b.getSelection()
            }
            this.locked = {level: 999};
            this.editor.loadSnapshot(a.contents);
            if (a.bookmarks)c.selectBookmarks(a.bookmarks); else if (CKEDITOR.env.ie) {
                c = this.editor.document.getBody().$.createTextRange();
                c.collapse(true);
                c.select()
            }
            this.locked = null;
            this.index = a.index;
            this.currentImage = this.snapshots[this.index];
            this.update();
            this.refreshState();
            b.fire("change")
        }, getNextImage: function (a) {
            var b = this.snapshots, c = this.currentImage, d;
            if (c)if (a)for (d = this.index - 1; d >= 0; d--) {
                a = b[d];
                if (!c.equalsContent(a)) {
                    a.index = d;
                    return a
                }
            } else for (d = this.index + 1; d < b.length; d++) {
                a = b[d];
                if (!c.equalsContent(a)) {
                    a.index = d;
                    return a
                }
            }
            return null
        }, redoable: function () {
            return this.enabled && this.hasRedo
        }, undoable: function () {
            return this.enabled &&
                this.hasUndo
        }, undo: function () {
            if (this.undoable()) {
                this.save(true);
                var a = this.getNextImage(true);
                if (a)return this.restoreImage(a), true
            }
            return false
        }, redo: function () {
            if (this.redoable()) {
                this.save(true);
                if (this.redoable()) {
                    var a = this.getNextImage(false);
                    if (a)return this.restoreImage(a), true
                }
            }
            return false
        }, update: function (a) {
            if (!this.locked) {
                a || (a = new g(this.editor));
                for (var b = this.index, c = this.snapshots; b > 0 && this.currentImage.equalsContent(c[b - 1]);)b = b - 1;
                c.splice(b, this.index - b + 1, a);
                this.index = b;
                this.currentImage =
                    a
            }
        }, updateSelection: function (a) {
            if (!this.snapshots.length)return false;
            var b = this.snapshots, c = b[b.length - 1];
            if (c.equalsContent(a) && !c.equalsSelection(a)) {
                this.currentImage = b[b.length - 1] = a;
                return true
            }
            return false
        }, lock: function (a, b) {
            if (this.locked)this.locked.level++; else if (a)this.locked = {level: 1}; else {
                var c = null;
                if (b)c = true; else {
                    var d = new g(this.editor, true);
                    this.currentImage && this.currentImage.equalsContent(d) && (c = d)
                }
                this.locked = {update: c, level: 1}
            }
        }, unlock: function () {
            if (this.locked && !--this.locked.level) {
                var a =
                    this.locked.update;
                this.locked = null;
                if (a === true)this.update(); else if (a) {
                    var b = new g(this.editor, true);
                    a.equalsContent(b) || this.update()
                }
            }
        }
        };
        b.navigationKeyCodes = {
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            36: 1,
            35: 1,
            33: 1,
            34: 1
        };
        b.keyGroups = {PRINTABLE: 0, FUNCTIONAL: 1};
        b.isNavigationKey = function (a) {
            return !!b.navigationKeyCodes[a]
        };
        b.getKeyGroup = function (a) {
            var c = b.keyGroups;
            return e[a] ? c.FUNCTIONAL : c.PRINTABLE
        };
        b.getOppositeKeyGroup = function (a) {
            var c = b.keyGroups;
            return a == c.FUNCTIONAL ? c.PRINTABLE : c.FUNCTIONAL
        };
        b.ieFunctionalKeysBug =
            function (a) {
                return CKEDITOR.env.ie && b.getKeyGroup(a) == b.keyGroups.FUNCTIONAL
            };
        var g = CKEDITOR.plugins.undo.Image = function (a, b) {
            this.editor = a;
            a.fire("beforeUndoImage");
            var c = a.getSnapshot();
            CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
            this.contents = c;
            if (!b)this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(true);
            a.fire("afterUndoImage")
        }, c = /\b(?:href|src|name)="[^"]*?"/gi;
        g.prototype = {
            equalsContent: function (a) {
                var b = this.contents, a = a.contents;
                if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat ||
                    CKEDITOR.env.quirks)) {
                    b = b.replace(c, "");
                    a = a.replace(c, "")
                }
                return b != a ? false : true
            }, equalsSelection: function (a) {
                var b = this.bookmarks, a = a.bookmarks;
                if (b || a) {
                    if (!b || !a || b.length != a.length)return false;
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c], e = a[c];
                        if (d.startOffset != e.startOffset || d.endOffset != e.endOffset || !CKEDITOR.tools.arrayCompare(d.start, e.start) || !CKEDITOR.tools.arrayCompare(d.end, e.end))return false
                    }
                }
                return true
            }
        };
        var d = CKEDITOR.plugins.undo.NativeEditingHandler = function (a) {
            this.undoManager = a;
            this.ignoreInputEvent =
                false;
            this.keyEventsStack = new i;
            this.lastKeydownImage = null
        };
        d.prototype = {
            onKeydown: function (c) {
                var d = c.data.getKey();
                if (d !== 229)if (CKEDITOR.tools.indexOf(a, c.data.getKeystroke()) > -1)c.data.preventDefault(); else {
                    this.keyEventsStack.cleanUp(c);
                    c = this.undoManager;
                    this.keyEventsStack.getLast(d) || this.keyEventsStack.push(d);
                    this.lastKeydownImage = new g(c.editor);
                    if (b.isNavigationKey(d) || this.undoManager.keyGroupChanged(d))if (c.strokesRecorded[0] || c.strokesRecorded[1]) {
                        c.save(false, this.lastKeydownImage,
                            false);
                        c.resetType()
                    }
                }
            }, onInput: function () {
                if (this.ignoreInputEvent)this.ignoreInputEvent = false; else {
                    var a = this.keyEventsStack.getLast();
                    a || (a = this.keyEventsStack.push(0));
                    this.keyEventsStack.increment(a.keyCode);
                    if (this.keyEventsStack.getTotalInputs() >= this.undoManager.strokesLimit) {
                        this.undoManager.type(a.keyCode, true);
                        this.keyEventsStack.resetInputs()
                    }
                }
            }, onKeyup: function (a) {
                var c = this.undoManager, a = a.data.getKey(), d = this.keyEventsStack.getTotalInputs();
                this.keyEventsStack.remove(a);
                if (!b.ieFunctionalKeysBug(a) || !this.lastKeydownImage || !this.lastKeydownImage.equalsContent(new g(c.editor, true)))if (d > 0)c.type(a); else if (b.isNavigationKey(a))this.onNavigationKey(true)
            }, onNavigationKey: function (a) {
                var b = this.undoManager;
                (a || !b.save(true, null, false)) && b.updateSelection(new g(b.editor));
                b.resetType()
            }, ignoreInputEventListener: function () {
                this.ignoreInputEvent = true
            }, attachListeners: function () {
                var a = this.undoManager.editor, c = a.editable(), d = this;
                c.attachListener(c, "keydown", function (a) {
                        d.onKeydown(a);
                        if (b.ieFunctionalKeysBug(a.data.getKey()))d.onInput()
                    },
                    null, null, 999);
                c.attachListener(c, CKEDITOR.env.ie ? "keypress" : "input", d.onInput, d, null, 999);
                c.attachListener(c, "keyup", d.onKeyup, d, null, 999);
                c.attachListener(c, "paste", d.ignoreInputEventListener, d, null, 999);
                c.attachListener(c, "drop", d.ignoreInputEventListener, d, null, 999);
                c.attachListener(c.isInline() ? c : a.document.getDocumentElement(), "click", function () {
                    d.onNavigationKey()
                }, null, null, 999);
                c.attachListener(this.undoManager.editor, "blur", function () {
                    d.keyEventsStack.remove(9)
                }, null, null, 999)
            }
        };
        var i = CKEDITOR.plugins.undo.KeyEventsStack =
            function () {
                this.stack = []
            };
        i.prototype = {
            push: function (a) {
                return this.stack[this.stack.push({keyCode: a, inputs: 0}) - 1]
            }, getLastIndex: function (a) {
                if (typeof a != "number")return this.stack.length - 1;
                for (var b = this.stack.length; b--;)if (this.stack[b].keyCode == a)return b;
                return -1
            }, getLast: function (a) {
                a = this.getLastIndex(a);
                return a != -1 ? this.stack[a] : null
            }, increment: function (a) {
                this.getLast(a).inputs++
            }, remove: function (a) {
                a = this.getLastIndex(a);
                a != -1 && this.stack.splice(a, 1)
            }, resetInputs: function (a) {
                if (typeof a ==
                    "number")this.getLast(a).inputs = 0; else for (a = this.stack.length; a--;)this.stack[a].inputs = 0
            }, getTotalInputs: function () {
                for (var a = this.stack.length, b = 0; a--;)b = b + this.stack[a].inputs;
                return b
            }, cleanUp: function (a) {
                a = a.data.$;
                !a.ctrlKey && !a.metaKey && this.remove(17);
                a.shiftKey || this.remove(16);
                a.altKey || this.remove(18)
            }
        }
    }(),CKEDITOR.plugins.add("wsc", {
        requires: "dialog", parseApi: function (a) {
            a.config.wsc_onFinish = typeof a.config.wsc_onFinish === "function" ? a.config.wsc_onFinish : function () {
            };
            a.config.wsc_onClose =
                typeof a.config.wsc_onClose === "function" ? a.config.wsc_onClose : function () {
                }
        }, parseConfig: function (a) {
            a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
            a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds || CKEDITOR.config.wsc_customDictionaryIds || "";
            a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "";
            a.config.wsc_customLoaderScript =
                a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript;
            CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
            CKEDITOR.config.wsc_version = "v4.3.0-master-aa00a1e";
            CKEDITOR.config.wsc_removeGlobalVariable = true
        }, init: function (a) {
            var e = CKEDITOR.env;
            this.parseConfig(a);
            this.parseApi(a);
            a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = {
                wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname && !(e.ie && (e.version <
                8 || e.quirks))
            };
            typeof a.plugins.scayt == "undefined" && a.ui.addButton && a.ui.addButton("SpellChecker", {
                label: a.lang.wsc.toolbar,
                click: function (a) {
                    var e = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
                    (e = e.replace(/\s/g, "")) ? a.execCommand("checkspell") : alert("Nothing to check!")
                },
                toolbar: "spellchecker,10"
            });
            CKEDITOR.dialog.add("checkspell", this.path + (CKEDITOR.env.ie && CKEDITOR.env.version <= 7 ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
        }
    }),
    function () {
        function a(a) {
            var b = this.editor, g = a.document, f = g.body, h = g.getElementById("cke_actscrpt");
            h && h.parentNode.removeChild(h);
            (h = g.getElementById("cke_shimscrpt")) && h.parentNode.removeChild(h);
            (h = g.getElementById("cke_basetagscrpt")) && h.parentNode.removeChild(h);
            f.contentEditable = true;
            if (CKEDITOR.env.ie) {
                f.hideFocus = true;
                f.disabled = true;
                f.removeAttribute("disabled")
            }
            delete this._.isLoadingData;
            this.$ = f;
            g = new CKEDITOR.dom.document(g);
            this.setup();
            this.fixInitialSelection();
            if (CKEDITOR.env.ie) {
                g.getDocumentElement().addClass(g.$.compatMode);
                b.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(g, "selectionchange", function () {
                    var a = g.getBody(), c = b.getSelection(), e = c && c.getRanges()[0];
                    e && (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function () {
                        e = b.getSelection().getRanges()[0];
                        if (!e.startContainer.equals("body")) {
                            a.getFirst().remove(1);
                            e.moveToElementEditEnd(a);
                            e.select()
                        }
                    }, 0)
                })
            }
            if (CKEDITOR.env.webkit || CKEDITOR.env.ie && CKEDITOR.env.version > 10)g.getDocumentElement().on("mousedown", function (a) {
                a.data.getTarget().is("html") &&
                setTimeout(function () {
                    b.editable().focus()
                })
            });
            e(b);
            try {
                b.document.$.execCommand("2D-position", false, true)
            } catch (j) {
            }
            (CKEDITOR.env.gecko || CKEDITOR.env.ie && b.document.$.compatMode == "CSS1Compat") && this.attachListener(this, "keydown", function (a) {
                var c = a.data.getKeystroke();
                if (c == 33 || c == 34)if (CKEDITOR.env.ie)setTimeout(function () {
                    b.getSelection().scrollIntoView()
                }, 0); else if (b.window.$.innerHeight > this.$.offsetHeight) {
                    var e = b.createRange();
                    e[c == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                    e.select();
                    a.data.preventDefault()
                }
            });
            CKEDITOR.env.ie && this.attachListener(g, "blur", function () {
                try {
                    g.$.selection.empty()
                } catch (a) {
                }
            });
            CKEDITOR.env.iOS && this.attachListener(g, "touchend", function () {
                a.focus()
            });
            f = b.document.getElementsByTag("title").getItem(0);
            f.data("cke-title", f.getText());
            if (CKEDITOR.env.ie)b.document.$.title = this._.docTitle;
            CKEDITOR.tools.setTimeout(function () {
                if (this.status == "unloaded")this.status = "ready";
                b.fire("contentDom");
                if (this._.isPendingFocus) {
                    b.focus();
                    this._.isPendingFocus =
                        false
                }
                setTimeout(function () {
                    b.fire("dataReady")
                }, 0);
                CKEDITOR.env.ie && setTimeout(function () {
                    if (b.document) {
                        var a = b.document.$.body;
                        a.runtimeStyle.marginBottom = "0px";
                        a.runtimeStyle.marginBottom = ""
                    }
                }, 1E3)
            }, 0, this)
        }

        function e(a) {
            function b() {
                var d;
                a.editable().attachListener(a, "selectionChange", function () {
                    var b = a.getSelection().getSelectedElement();
                    if (b) {
                        if (d) {
                            d.detachEvent("onresizestart", e);
                            d = null
                        }
                        b.$.attachEvent("onresizestart", e);
                        d = b.$
                    }
                })
            }

            function e(a) {
                a.returnValue = false
            }

            if (CKEDITOR.env.gecko)try {
                var f =
                    a.document.$;
                f.execCommand("enableObjectResizing", false, !a.config.disableObjectResizing);
                f.execCommand("enableInlineTableEditing", false, !a.config.disableNativeTableHandles)
            } catch (g) {
            } else CKEDITOR.env.ie && (CKEDITOR.env.version < 11 && a.config.disableObjectResizing) && b(a)
        }

        function b() {
            var a = [];
            if (CKEDITOR.document.$.documentMode >= 8) {
                a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var b = [], e;
                for (e in CKEDITOR.dtd.$removeEmpty)b.push("html.CSS1Compat " + e + "[contenteditable=false]");
                a.push(b.join(",") + "{display:inline-block}")
            } else if (CKEDITOR.env.gecko) {
                a.push("html{height:100% !important}");
                a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}")
            }
            a.push("html{cursor:text;*cursor:auto}");
            a.push("img,input,textarea{cursor:default}");
            return a.join("\n")
        }

        CKEDITOR.plugins.add("wysiwygarea", {
            init: function (a) {
                a.config.fullPage && a.addFeature({
                    allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
                    requiredContent: "body"
                });
                a.addMode("wysiwyg",
                    function (b) {
                        function e(f) {
                            f && f.removeListener();
                            a.editable(new g(a, h.$.contentWindow.document.body));
                            a.setData(a.getData(1), b)
                        }

                        var f = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();", f = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(f) + "}())" : "", h = CKEDITOR.dom.element.createFromHtml('<iframe src="' + f + '" frameBorder="0"></iframe>');
                        h.setStyles({width: "100%", height: "100%"});
                        h.addClass("cke_wysiwyg_frame cke_reset");
                        var j = a.ui.space("contents");
                        j.append(h);
                        if (f = CKEDITOR.env.ie || CKEDITOR.env.gecko)h.on("load", e);
                        var k = a.title, n = a.fire("ariaEditorHelpLabel", {}).label;
                        if (k) {
                            CKEDITOR.env.ie && n && (k = k + (", " + n));
                            h.setAttribute("title", k)
                        }
                        if (n) {
                            var k = CKEDITOR.tools.getNextId(), o = CKEDITOR.dom.element.createFromHtml('<span id="' + k + '" class="cke_voice_label">' + n + "</span>");
                            j.append(o, 1);
                            h.setAttribute("aria-describedby", k)
                        }
                        a.on("beforeModeUnload", function (a) {
                            a.removeListener();
                            o && o.remove()
                        });
                        h.setAttributes({
                            tabIndex: a.tabIndex,
                            allowTransparency: "true"
                        });
                        !f && e();
                        if (CKEDITOR.env.webkit) {
                            f = function () {
                                j.setStyle("width", "100%");
                                h.hide();
                                h.setSize("width", j.getSize("width"));
                                j.removeStyle("width");
                                h.show()
                            };
                            h.setCustomData("onResize", f);
                            CKEDITOR.document.getWindow().on("resize", f)
                        }
                        a.fire("ariaWidget", h)
                    })
            }
        });
        CKEDITOR.editor.prototype.addContentsCss = function (a) {
            var b = this.config, e = b.contentsCss;
            if (!CKEDITOR.tools.isArray(e))b.contentsCss = e ? [e] : [];
            b.contentsCss.push(a)
        };
        var g = CKEDITOR.tools.createClass({
            $: function () {
                this.base.apply(this,
                    arguments);
                this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (b) {
                    CKEDITOR.tools.setTimeout(a, 0, this, b)
                }, this);
                this._.docTitle = this.getWindow().getFrame().getAttribute("title")
            }, base: CKEDITOR.editable, proto: {
                setData: function (a, d) {
                    var e = this.editor;
                    if (d) {
                        this.setHtml(a);
                        this.fixInitialSelection();
                        e.fire("dataReady")
                    } else {
                        this._.isLoadingData = true;
                        e._.dataStore = {id: 1};
                        var f = e.config, g = f.fullPage, j = f.docType, k = CKEDITOR.tools.buildStyleHtml(b()).replace(/<style>/, '<style data-cke-temp="1">');
                        g || (k = k + CKEDITOR.tools.buildStyleHtml(e.config.contentsCss));
                        var n = f.baseHref ? '<base href="' + f.baseHref + '" data-cke-temp="1" />' : "";
                        g && (a = a.replace(/<!DOCTYPE[^>]*>/i, function (a) {
                            e.docType = j = a;
                            return ""
                        }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                            e.xmlDeclaration = a;
                            return ""
                        }));
                        a = e.dataProcessor.toHtml(a);
                        if (g) {
                            /<body[\s|>]/.test(a) || (a = "<body>" + a);
                            /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>");
                            /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/,
                                "$&<head><title></title></head>");
                            n && (a = a.replace(/<head[^>]*?>/, "$&" + n));
                            a = a.replace(/<\/head\s*>/, k + "$&");
                            a = j + a
                        } else a = f.docType + '<html dir="' + f.contentsLangDirection + '" lang="' + (f.contentsLanguage || e.langCode) + '"><head><title>' + this._.docTitle + "</title>" + n + k + "</head><body" + (f.bodyId ? ' id="' + f.bodyId + '"' : "") + (f.bodyClass ? ' class="' + f.bodyClass + '"' : "") + ">" + a + "</body></html>";
                        if (CKEDITOR.env.gecko) {
                            a = a.replace(/<body/, '<body contenteditable="true" ');
                            CKEDITOR.env.version < 2E4 && (a = a.replace(/<body[^>]*>/,
                                "$&<\!-- cke-content-start --\>"))
                        }
                        f = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
                        CKEDITOR.env.ie && CKEDITOR.env.version < 9 && (f = f + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)<\/script>');
                        n && (CKEDITOR.env.ie && CKEDITOR.env.version < 10) && (f = f + '<script id="cke_basetagscrpt">var baseTag = document.querySelector( "base" );baseTag.href = baseTag.href;<\/script>');
                        a = a.replace(/(?=\s*<\/(:?head)>)/, f);
                        this.clearCustomData();
                        this.clearListeners();
                        e.fire("contentDomUnload");
                        var o = this.getDocument();
                        try {
                            o.write(a)
                        } catch (p) {
                            setTimeout(function () {
                                o.write(a)
                            }, 0)
                        }
                    }
                }, getData: function (a) {
                    if (a)return this.getHtml();
                    var a = this.editor, b = a.config, e = b.fullPage, f = e && a.docType, g = e && a.xmlDeclaration, j = this.getDocument(),
                        e = e ? j.getDocumentElement().getOuterHtml() : j.getBody().getHtml();
                    CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (e = e.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
                    e = a.dataProcessor.toDataFormat(e);
                    g && (e = g + "\n" + e);
                    f && (e = f + "\n" + e);
                    return e
                }, focus: function () {
                    this._.isLoadingData ? this._.isPendingFocus = true : g.baseProto.focus.call(this)
                }, detach: function () {
                    var a = this.editor, b = a.document, a = a.window.getFrame();
                    g.baseProto.detach.call(this);
                    this.clearCustomData();
                    b.getDocumentElement().clearCustomData();
                    a.clearCustomData();
                    CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
                    (b = a.removeCustomData("onResize")) && b.removeListener();
                    a.remove()
                }
            }
        })
    }(),CKEDITOR.config.disableObjectResizing = !1,CKEDITOR.config.disableNativeTableHandles = !0,CKEDITOR.config.disableNativeSpellChecker = !0,CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css"),CKEDITOR.config.plugins = "dialogui,dialog,a11yhelp,about,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,elementspath,indent,indentlist,list,enterkey,entities,popup,filebrowser,floatingspace,listblock,button,richcombo,format,horizontalrule,htmlwriter,image,fakeobjects,link,magicline,maximize,pastefromword,pastetext,removeformat,resize,menubutton,scayt,showborders,sourcearea,specialchar,stylescombo,tab,table,tabletools,toolbar,undo,wsc,wysiwygarea",
    CKEDITOR.config.skin = "moono",function () {
        var a = function (a, b) {
            for (var g = CKEDITOR.getUrl("plugins/" + b), a = a.split(","), c = 0; c < a.length; c++)CKEDITOR.skin.icons[a[c]] = {
                path: g,
                offset: -a[++c],
                bgsize: a[++c]
            }
        };
        CKEDITOR.env.hidpi ? a("about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,bidiltr,168,,bidirtl,192,,blockquote,216,,copy-rtl,240,,copy,264,,cut-rtl,288,,cut,312,,paste-rtl,336,,paste,360,,codesnippet,384,,bgcolor,408,,textcolor,432,,creatediv,456,,docprops-rtl,480,,docprops,504,,find-rtl,528,,find,552,,replace,576,,flash,600,,button,624,,checkbox,648,,form,672,,hiddenfield,696,,imagebutton,720,,radio,744,,select-rtl,768,,select,792,,textarea-rtl,816,,textarea,840,,textfield-rtl,864,,textfield,888,,horizontalrule,912,,iframe,936,,image,960,,indent-rtl,984,,indent,1008,,outdent-rtl,1032,,outdent,1056,,justifyblock,1080,,justifycenter,1104,,justifyleft,1128,,justifyright,1152,,language,1176,,anchor-rtl,1200,,anchor,1224,,link,1248,,unlink,1272,,bulletedlist-rtl,1296,,bulletedlist,1320,,numberedlist-rtl,1344,,numberedlist,1368,,mathjax,1392,,maximize,1416,,newpage-rtl,1440,,newpage,1464,,pagebreak-rtl,1488,,pagebreak,1512,,pastefromword-rtl,1536,,pastefromword,1560,,pastetext-rtl,1584,,pastetext,1608,,placeholder,1632,,preview-rtl,1656,,preview,1680,,print,1704,,removeformat,1728,,save,1752,,scayt,1776,,selectall,1800,,showblocks-rtl,1824,,showblocks,1848,,smiley,1872,,source-rtl,1896,,source,1920,,sourcedialog-rtl,1944,,sourcedialog,1968,,specialchar,1992,,table,2016,,templates-rtl,2040,,templates,2064,,uicolor,2088,,redo-rtl,2112,,redo,2136,,undo-rtl,2160,,undo,2184,,simplebox,4416,auto,spellchecker,2232,",
            "icons_hidpi.png") : a("about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,bidiltr,168,auto,bidirtl,192,auto,blockquote,216,auto,copy-rtl,240,auto,copy,264,auto,cut-rtl,288,auto,cut,312,auto,paste-rtl,336,auto,paste,360,auto,codesnippet,384,auto,bgcolor,408,auto,textcolor,432,auto,creatediv,456,auto,docprops-rtl,480,auto,docprops,504,auto,find-rtl,528,auto,find,552,auto,replace,576,auto,flash,600,auto,button,624,auto,checkbox,648,auto,form,672,auto,hiddenfield,696,auto,imagebutton,720,auto,radio,744,auto,select-rtl,768,auto,select,792,auto,textarea-rtl,816,auto,textarea,840,auto,textfield-rtl,864,auto,textfield,888,auto,horizontalrule,912,auto,iframe,936,auto,image,960,auto,indent-rtl,984,auto,indent,1008,auto,outdent-rtl,1032,auto,outdent,1056,auto,justifyblock,1080,auto,justifycenter,1104,auto,justifyleft,1128,auto,justifyright,1152,auto,language,1176,auto,anchor-rtl,1200,auto,anchor,1224,auto,link,1248,auto,unlink,1272,auto,bulletedlist-rtl,1296,auto,bulletedlist,1320,auto,numberedlist-rtl,1344,auto,numberedlist,1368,auto,mathjax,1392,auto,maximize,1416,auto,newpage-rtl,1440,auto,newpage,1464,auto,pagebreak-rtl,1488,auto,pagebreak,1512,auto,pastefromword-rtl,1536,auto,pastefromword,1560,auto,pastetext-rtl,1584,auto,pastetext,1608,auto,placeholder,1632,auto,preview-rtl,1656,auto,preview,1680,auto,print,1704,auto,removeformat,1728,auto,save,1752,auto,scayt,1776,auto,selectall,1800,auto,showblocks-rtl,1824,auto,showblocks,1848,auto,smiley,1872,auto,source-rtl,1896,auto,source,1920,auto,sourcedialog-rtl,1944,auto,sourcedialog,1968,auto,specialchar,1992,auto,table,2016,auto,templates-rtl,2040,auto,templates,2064,auto,uicolor,2088,auto,redo-rtl,2112,auto,redo,2136,auto,undo-rtl,2160,auto,undo,2184,auto,simplebox,2208,auto,spellchecker,2232,auto",
            "icons.png")
    }()
})();

﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    function t(a) {
        return CKEDITOR.env.ie ? a.$.clientWidth : parseInt(a.getComputedStyle("width"), 10)
    }

    function n(a, h) {
        var b = a.getComputedStyle("border-" + h + "-width"), j = {
            thin: "0px",
            medium: "1px",
            thick: "2px"
        };
        0 > b.indexOf("px") && (b = b in j && "none" != a.getComputedStyle("border-style") ? j[b] : 0);
        return parseInt(b, 10)
    }

    function w(a) {
        var h = [], b = -1, j = "rtl" == a.getComputedStyle("direction"), c;
        c = a.$.rows;
        for (var p = 0, g, d, e, i = 0, o = c.length; i < o; i++)e = c[i], g = e.cells.length, g > p && (p = g, d = e);
        c = d;
        p = new CKEDITOR.dom.element(a.$.tBodies[0]);
        g = p.getDocumentPosition();
        d = 0;
        for (e = c.cells.length; d < e; d++) {
            var i = new CKEDITOR.dom.element(c.cells[d]), o = c.cells[d + 1] && new CKEDITOR.dom.element(c.cells[d + 1]), b = b + (i.$.colSpan || 1), k, f, l = i.getDocumentPosition().x;
            j ? f = l + n(i, "left") : k = l + i.$.offsetWidth - n(i, "right");
            o ? (l = o.getDocumentPosition().x, j ? k = l + o.$.offsetWidth - n(o, "right") : f = l + n(o, "left")) : (l = a.getDocumentPosition().x, j ? k = l : f = l + a.$.offsetWidth);
            i = Math.max(f - k, 3);
            h.push({
                table: a,
                index: b,
                x: k,
                y: g.y,
                width: i,
                height: p.$.offsetHeight,
                rtl: j
            })
        }
        return h
    }

    function u(a) {
        (a.data || a).preventDefault()
    }

    function A(a) {
        function h() {
            i = 0;
            e.setOpacity(0);
            k && b();
            var v = g.table;
            setTimeout(function () {
                v.removeCustomData("_cke_table_pillars")
            }, 0);
            d.removeListener("dragstart", u)
        }

        function b() {
            for (var v = g.rtl, a = v ? l.length : x.length, c = 0; c < a; c++) {
                var b = x[c], d = l[c], e = g.table;
                CKEDITOR.tools.setTimeout(function (a, c, b, d, g, j) {
                    a && a.setStyle("width", f(Math.max(c + j, 1)));
                    b && b.setStyle("width", f(Math.max(d - j, 1)));
                    g && e.setStyle("width", f(g + j * (v ? -1 : 1)))
                }, 0, this, [b, b && t(b), d, d && t(d),
                    (!b || !d) && t(e) + n(e, "left") + n(e, "right"), k])
            }
        }

        function j(a) {
            u(a);
            for (var a = g.index, b = CKEDITOR.tools.buildTableMap(g.table), j = [], h = [], f = Number.MAX_VALUE, n = f, s = g.rtl, r = 0, w = b.length; r < w; r++) {
                var m = b[r], q = m[a + (s ? 1 : 0)], m = m[a + (s ? 0 : 1)], q = q && new CKEDITOR.dom.element(q), m = m && new CKEDITOR.dom.element(m);
                if (!q || !m || !q.equals(m))q && (f = Math.min(f, t(q))), m && (n = Math.min(n, t(m))), j.push(q), h.push(m)
            }
            x = j;
            l = h;
            y = g.x - f;
            z = g.x + n;
            e.setOpacity(0.5);
            o = parseInt(e.getStyle("left"), 10);
            k = 0;
            i = 1;
            e.on("mousemove", p);
            d.on("dragstart",
                u);
            d.on("mouseup", c, this)
        }

        function c(a) {
            a.removeListener();
            h()
        }

        function p(a) {
            r(a.data.getPageOffset().x)
        }

        var g, d, e, i, o, k, x, l, y, z;
        d = a.document;
        e = CKEDITOR.dom.element.createFromHtml('<div data-cke-temp=1 contenteditable=false unselectable=on style="position:absolute;cursor:col-resize;filter:alpha(opacity=0);opacity:0;padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"></div>', d);
        a.on("destroy", function () {
            e.remove()
        });
        s || d.getDocumentElement().append(e);
        this.attachTo = function (a) {
            i ||
            (s && (d.getBody().append(e), k = 0), g = a, e.setStyles({
                width: f(a.width),
                height: f(a.height),
                left: f(a.x),
                top: f(a.y)
            }), s && e.setOpacity(0.25), e.on("mousedown", j, this), d.getBody().setStyle("cursor", "col-resize"), e.show())
        };
        var r = this.move = function (a) {
            if (!g)return 0;
            if (!i && (a < g.x || a > g.x + g.width))return g = null, i = k = 0, d.removeListener("mouseup", c), e.removeListener("mousedown", j), e.removeListener("mousemove", p), d.getBody().setStyle("cursor", "auto"), s ? e.remove() : e.hide(), 0;
            a -= Math.round(e.$.offsetWidth / 2);
            if (i) {
                if (a ==
                    y || a == z)return 1;
                a = Math.max(a, y);
                a = Math.min(a, z);
                k = a - o
            }
            e.setStyle("left", f(a));
            return 1
        }
    }

    function r(a) {
        var h = a.data.getTarget();
        if ("mouseout" == a.name) {
            if (!h.is("table"))return;
            for (var b = new CKEDITOR.dom.element(a.data.$.relatedTarget || a.data.$.toElement); b && b.$ && !b.equals(h) && !b.is("body");)b = b.getParent();
            if (!b || b.equals(h))return
        }
        h.getAscendant("table", 1).removeCustomData("_cke_table_pillars");
        a.removeListener()
    }

    var f = CKEDITOR.tools.cssLength, s = CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks);
    CKEDITOR.plugins.add("tableresize", {
        requires: "tabletools", init: function (a) {
            a.on("contentDom", function () {
                var h, b = a.editable();
                b.attachListener(b.isInline() ? b : a.document, "mousemove", function (b) {
                    var b = b.data, c = b.getTarget();
                    if (c.type == CKEDITOR.NODE_ELEMENT) {
                        var f = b.getPageOffset().x;
                        if (h && h.move(f))u(b); else if (c.is("table") || c.getAscendant("tbody", 1))if (c = c.getAscendant("table", 1), a.editable().contains(c)) {
                            if (!(b = c.getCustomData("_cke_table_pillars")))c.setCustomData("_cke_table_pillars", b = w(c)), c.on("mouseout",
                                r), c.on("mousedown", r);
                            a:{
                                for (var c = 0, g = b.length; c < g; c++) {
                                    var d = b[c];
                                    if (f >= d.x && f <= d.x + d.width) {
                                        f = d;
                                        break a
                                    }
                                }
                                f = null
                            }
                            f && (!h && (h = new A(a)), h.attachTo(f))
                        }
                    }
                })
            })
        }
    })
})();

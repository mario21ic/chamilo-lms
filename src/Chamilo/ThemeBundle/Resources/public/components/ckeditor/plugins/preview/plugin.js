﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    var h, i = {
        modes: {wysiwyg: 1, source: 1},
        canUndo: !1,
        readOnly: 1,
        exec: function (a) {
            var g, b = a.config, f = b.baseHref ? '<base href="' + b.baseHref + '"/>' : "";
            if (b.fullPage)g = a.getData().replace(/<head>/, "$&" + f).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + a.lang.preview.preview); else {
                var b = "<body ", d = a.document && a.document.getBody();
                d && (d.getAttribute("id") && (b += 'id="' + d.getAttribute("id") + '" '), d.getAttribute("class") && (b += 'class="' + d.getAttribute("class") + '" '));
                g = a.config.docType + '<html dir="' + a.config.contentsLangDirection +
                    '"><head>' + f + "<title>" + a.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(a.config.contentsCss) + "</head>" + (b + ">") + a.getData() + "</body></html>"
            }
            f = 640;
            b = 420;
            d = 80;
            try {
                var c = window.screen, f = Math.round(0.8 * c.width), b = Math.round(0.7 * c.height), d = Math.round(0.1 * c.width)
            } catch (i) {
            }
            if (!1 === a.fire("contentPreview", a = {dataValue: g}))return !1;
            var c = "", e;
            CKEDITOR.env.ie && (window._cke_htmlToLoad = a.dataValue, e = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g,
                    "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )", c = "");
            CKEDITOR.env.gecko && (window._cke_htmlToLoad = a.dataValue, c = CKEDITOR.getUrl(h + "preview.html"));
            c = window.open(c, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + f + ",height=" + b + ",left=" + d);
            CKEDITOR.env.ie && c && (c.location = e);
            !CKEDITOR.env.ie && !CKEDITOR.env.gecko && (e = c.document, e.open(), e.write(a.dataValue),
                e.close());
            return !0
        }
    };
    CKEDITOR.plugins.add("preview", {
        lang: "af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",
        icons: "preview,preview-rtl",
        hidpi: !0,
        init: function (a) {
            a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && (h = this.path, a.addCommand("preview", i), a.ui.addButton && a.ui.addButton("Preview", {
                label: a.lang.preview.preview, command: "preview",
                toolbar: "document,40"
            }))
        }
    })
})();

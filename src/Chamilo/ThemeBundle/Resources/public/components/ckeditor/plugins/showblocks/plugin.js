﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
    var i = {
        readOnly: 1,
        preserveState: !0,
        editorFocus: !1,
        exec: function (a) {
            this.toggleState();
            this.refresh(a)
        },
        refresh: function (a) {
            if (a.document) {
                var c = this.state == CKEDITOR.TRISTATE_ON && (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE || a.focusManager.hasFocus) ? "attachClass" : "removeClass";
                a.editable()[c]("cke_show_blocks")
            }
        }
    };
    CKEDITOR.plugins.add("showblocks", {
        lang: "af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",
        icons: "showblocks,showblocks-rtl", hidpi: !0, onLoad: function () {
            var a = "p div pre address blockquote h1 h2 h3 h4 h5 h6".split(" "), c, b, e, f, i = CKEDITOR.getUrl(this.path), j = !(CKEDITOR.env.ie && 9 > CKEDITOR.env.version), g = j ? ":not([contenteditable=false]):not(.cke_show_blocks_off)" : "", d, h;
            for (c = b = e = f = ""; d = a.pop();)h = a.length ? "," : "", c += ".cke_show_blocks " + d + g + h, e += ".cke_show_blocks.cke_contents_ltr " + d + g + h, f += ".cke_show_blocks.cke_contents_rtl " + d + g + h, b += ".cke_show_blocks " + d + g + "{background-image:url(" + CKEDITOR.getUrl(i +
                    "images/block_" + d + ".png") + ")}";
            CKEDITOR.addCss((c + "{background-repeat:no-repeat;border:1px dotted gray;padding-top:8px}").concat(b, e + "{background-position:top left;padding-left:8px}", f + "{background-position:top right;padding-right:8px}"));
            j || CKEDITOR.addCss(".cke_show_blocks [contenteditable=false],.cke_show_blocks .cke_show_blocks_off{border:none;padding-top:0;background-image:none}.cke_show_blocks.cke_contents_rtl [contenteditable=false],.cke_show_blocks.cke_contents_rtl .cke_show_blocks_off{padding-right:0}.cke_show_blocks.cke_contents_ltr [contenteditable=false],.cke_show_blocks.cke_contents_ltr .cke_show_blocks_off{padding-left:0}")
        },
        init: function (a) {
            function c() {
                b.refresh(a)
            }

            if (!a.blockless) {
                var b = a.addCommand("showblocks", i);
                b.canUndo = !1;
                a.config.startupOutlineBlocks && b.setState(CKEDITOR.TRISTATE_ON);
                a.ui.addButton && a.ui.addButton("ShowBlocks", {
                    label: a.lang.showblocks.toolbar,
                    command: "showblocks",
                    toolbar: "tools,20"
                });
                a.on("mode", function () {
                    b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(a)
                });
                a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (a.on("focus", c), a.on("blur", c));
                a.on("contentDom", function () {
                    b.state != CKEDITOR.TRISTATE_DISABLED &&
b.refresh(a)})}}})})();

/**
 * SWFMacMouseWheel v2.1: Mac Mouse Wheel functionality in flash - http://blog.pixelbreaker.com/
 *
 * SWFMacMouseWheel is (c) 2007 Gabriel Bucknall and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Dependencies: 
 * - SWFObject v2.0 rc2 <http://code.google.com/p/swfobject/>
 * - Prototype 1.6+
 * Copyright (c) 2007 Geoff Stearns, Michael Williams, and Bobby van der Sluis
 * Copyright (c) 2010 Alan Pinstein.
 *  - added functionality to only propagate mousewheel events when the mouse is over a registered flash object. Only propagates to the swf under the mouse.
 * This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 * @todo Should be able to easily factor out the swfobject dependency
 * @todo Maybe factor out Prototype dependency; shouldn't be too hard to unroll.
 */
var swfmacmousewheel = function () {
    if (!swfobject) return null;
    var u = navigator.userAgent.toLowerCase();
    var p = navigator.platform.toLowerCase();
    var d = p ? (/mac/.test(p)) : /mac/.test(u);
    if (!d) return null;
    var k = [];
    var r = function (event) {
        var o = 0;
        if (event.wheelDelta) {
            o = event.wheelDelta / 120;
            if (window.opera) o = -o;
        } else if (event.detail) {
            o = -event.detail;
        }
        // hit-test xy in one of our flash objs
        var scrollOverId = event.findElement().identify();
        var scrollTargetSwf = $A(k).find(function(id) { return scrollOverId === id; });
        if (scrollTargetSwf)
        {
            event.stop();
        }
        return {
            scrollDelta: o,
                  swfId: scrollTargetSwf
        };
    };
    var l = function (event) {
        var o = r(event);
        if (o.swfId)
        {
            var swf = swfobject.getObjectById(o.swfId);
            if (typeof(swf.externalMouseEvent) === 'function')
            {
                swf.externalMouseEvent(o.scrollDelta);
            }
        }
    };
    if (window.addEventListener) window.addEventListener('DOMMouseScroll', l, false);
    window.onmousewheel = document.onmousewheel = l;
    return {
        registerObject: function (m) {
            k[k.length] = m;
        }
    };
}();

/**
Copyright (c) 2012, Kartena AB
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (factory) {
    // Packaging/modules magic dance
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
    'use strict';

    L.Control.Pan = L.Control.extend({
        options: {
            position: 'topleft',
            panOffset: 200
        },

        onAdd: function (map) {
            var className = 'leaflet-control-pan',
                container = L.DomUtil.create('div', className),
                off = this.options.panOffset;

            this._panButton('Up'   , className + '-up'
                , container, map, new L.Point(    0 , -off));
            this._panButton('Left' , className + '-left'
                , container, map, new L.Point( -off ,  0));
            this._panButton('Right', className + '-right'
                , container, map, new L.Point(  off ,  0));
            this._panButton('Down' , className + '-down'
                , container, map, new L.Point(    0 ,  off));

            return container;
        },

        _panButton: function (title, className, container, map, offset, text) {
            var wrapper = L.DomUtil.create('div', className + '-wrap', container);
            var link = L.DomUtil.create('a', className, wrapper);
            link.href = '#';
            link.title = title;
            L.DomEvent
                .on(link, 'click', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', function(){ map.panBy(offset, {animate: false}); }, map)
                .on(link, 'dblclick', L.DomEvent.stopPropagation);

            return link;
        }
    });

    L.Map.mergeOptions({
        panControl: true
    });

    L.Map.addInitHook(function () {
        if (this.options.panControl) {
            this.panControl = new L.Control.Pan();
            this.addControl(this.panControl);
        }
    });

    L.control.pan = function (options) {
        return new L.Control.Pan(options);
    };
}));

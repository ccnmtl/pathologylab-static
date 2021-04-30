/* eslint-disable */

$(document).ready(function() {
    var map = L.map('map', {
        center: [0,0],
        zoom: 2,
        zoomControl: false,
        panControl: false,
        maxBounds: [[-90, -200], [90, 200]]
    });

    L.control.pan().addTo(map);
    L.control.zoomslider().addTo(map);

    var slideId = $('#map').data('slide-id');
    var zoomMax = $('#map').data('zoom');
    var slide_url_format = 'https://ctl-webslides-static-prod.s3.amazonaws.com/slide' + slideId + '/{z}/{y}/{x}.jpg';

    var attribution = '&copy; Columbia University Department of Pathology and Cell Biology';

    L.tileLayer(slide_url_format, {
        minZoom: 1,
        maxZoom: zoomMax,
        attribution: attribution
    }).addTo(map);

    L.Control.textbox = L.Control.extend({
		onAdd: function(map) {

		var text = L.DomUtil.create('div');
		text.id = "info_text";
		text.innerHTML = "Fit to Screen"
		return text;
		},

		onRemove: function(map) {
			// Nothing to do here
		}
	});
	L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
	L.control.textbox({ position: 'topleft' }).addTo(map);

    var smallLayer = L.tileLayer(slide_url_format, {
        minZoom: 1,
        maxZoom: zoomMax
    })
    new L.Control.MiniMap(smallLayer, {
        toggleDisplay: true,
        height: 200,
        width: 200,
        mapOptions: {
            panControl: false,
            maxBounds: [[-90, -200], [90, 200]]
        }}).addTo(map)

    //Magnification badge changes on zoomend. Magnification is determined by
    //Math.round(total magnificaton / zoomMax level = 1 zoom level)
    map.on('zoomend', function () {
        var zoomLevel = map.getZoom();
        var mag = $("#info_text")[0];

        //If slides have a max magnification of 100x
        if (slideId === 'Heme_Path_04' || slideId === 'Heme_Path_05' || slideId === 'Heme_Path_07') {
            if (zoomMax === 8) {
                var zoomLevel8 = {
                    1: 'Magnification: 12x',
                    2: 'Magnification: 25x',
                    3: 'Magnification: 40x',
                    4: 'Magnification: 50x',
                    5: 'Magnification: 60x',
                    6: 'Magnification: 75x',
                    7: 'Magnification: 85x',
                    8: 'Magnification: 100x'
                };
                return mag.innerHTML = zoomLevel8[zoomLevel];
            }
            else if (zoomMax === 9) {
                var zoomLevel9 = {
                    1: 'Magnification: 5x',
                    2: 'Magnification: 10x',
                    3: 'Magnification: 20x',
                    4: 'Magnification: 35x',
                    5: 'Magnification: 45x',
                    6: 'Magnification: 60x',
                    7: 'Magnification: 75x',
                    8: 'Magnification: 90x',
                    9: 'Magnification: 100x'
                };
                return mag.innerHTML = zoomLevel9[zoomLevel];
            }
        } else {
            if (zoomMax === 8) {
                var zoomLevel8 = {
                    1: 'Magnification: 5x',
                    2: 'Magnification: 10x',
                    3: 'Magnification: 15x',
                    4: 'Magnification: 20x',
                    5: 'Magnification: 25x',
                    6: 'Magnification: 30x',
                    7: 'Magnification: 35x',
                    8: 'Magnification: 40x'
                };
                return mag.innerHTML = zoomLevel8[zoomLevel];
            }
            else if (zoomMax === 9) {
                var zoomLevel9 = {
                    1: 'Magnification: 4x',
                    2: 'Magnification: 9x',
                    3: 'Magnification: 14x',
                    4: 'Magnification: 18x',
                    5: 'Magnification: 23x',
                    6: 'Magnification: 27x',
                    7: 'Magnification: 32x',
                    8: 'Magnification: 36x',
                    9: 'Magnification: 40x'
                };
                return mag.innerHTML = zoomLevel9[zoomLevel];
            }
            else if (zoomMax === 10) {
                var zoomLevel10 = {
                    1: 'Magnification: 4x',
                    2: 'Magnification: 8x',
                    3: 'Magnification: 12x',
                    4: 'Magnification: 16x',
                    5: 'Magnification: 20x',
                    6: 'Magnification: 24x',
                    7: 'Magnification: 28x',
                    8: 'Magnification: 32x',
                    9: 'Magnification: 36x',
                    10: 'Magnification: 40x'
                };
                return mag.innerHTML = zoomLevel10[zoomLevel];
            }
        }
    })
});

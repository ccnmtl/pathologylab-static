/* eslint-disable */

$(document).ready(function() {
    var map = L.map('map', {
        center: [0,0],
        zoom: 2
    });

    var slideId = $('#map').data('slide-id');
    var zoomMax = $('#map').data('zoom');
    var slide_url_format = 'https://cuimc-it-path-test.s3.amazonaws.com/slide' + slideId + '/{z}/{y}/{x}.jpg';

    //Sets bounds for dragging.
    var southWest = L.latLng(-90, -200)
    var northEast = L.latLng(90, 200);
    var bounds = L.latLngBounds(southWest, northEast);

    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });

    var attribution = '&copy; Example attribution'

    L.tileLayer(slide_url_format, {
        minZoom: 2,
        maxZoom: zoomMax,
        attribution: attribution
    }).addTo(map);

    var smallLayer = L.tileLayer(slide_url_format, {
        minZoom: 1,
        maxZoom: zoomMax
    })

    new L.Control.MiniMap(smallLayer, {
        toggleDisplay: true,
        height: 200,
        width: 200}).addTo(map)

});

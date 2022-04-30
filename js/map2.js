'use strict';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4,
    center: [-96, 39]
});

const grades = [100, 500, 1000],
colors = ['rgb(253,243,234)', 'rgb(250,126,90)', 'rgb(189,3,16)'],
radii = [1, 5, 10];

map.on('load', () => {

map.addSource('covid19counts', {
    type: 'geojson',
    data: 'assets/covid19counts.geojson'
});

map.addLayer({
        'id': 'count-point',
        'type': 'circle',
        'source': 'covid19counts',
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{
                        zoom: 5,
                        value: grades[0]
                    }, radii[0]],
                    [{
                        zoom: 5,
                        value: grades[1]
                    }, radii[1]],
                    [{
                        zoom: 5,
                        value: grades[2]
                    }, radii[2]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    },
);

map.on('click', 'count-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<${event.features[0].properties.county}strong>County:</strong> ${event.features[0].properties.cases} cases`)
        .addTo(map);
});

});

const legend = document.getElementById('legend');

var labels = ['<strong>Cases</strong>'], vbreak;

for (var i = 0; i < grades.length; i++) {
    const vbreak = grades[i];
    let dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
    }
    legend.innerHTML = labels.join('');
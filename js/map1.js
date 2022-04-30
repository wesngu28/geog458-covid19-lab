'use strict';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4,
    center: [-96, 39]
});

const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '250-499',
    '500-999',
    '1000 and more'
];

const colors = [
    'rgb(253,243,234)',
    'rgb(252,216,200)',
    'rgb(248,172,138)',
    'rgb(250,126,90)',
    'rgb(247,84,51)',
    'rgb(250,83,51)',
    'rgb(231,37,25)',
    'rgb(146,0,13)',
];

map.on('load', () => {

    map.addSource('covid19rates', {
        type: 'geojson',
        data: 'assets/covid19rates.geojson'
    });

    map.addLayer({
        'id': 'rates-point',
        'type': 'fill',
        'source': 'covid19rates',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                'rgb(253,243,234)',
                10, 'rgb(252,216,200)',
                20, 'rgb(248,172,138)',
                50, 'rgb(250,126,90)',
                100, 'rgb(247,84,51)',
                250, 'rgb(250,83,51)',
                500, 'rgb(231,37,25)',
                1000, 'rgb(146,0,13)'
            ],
            'fill-outline-color': 'white',
            'fill-opacity': 0.6
        }
    });
})

map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['rates-point']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.county} County</h3>
         <p>Of the <strong><em>${state[0].properties.pop18}</strong> people,</em> there have been <strong><em>${state[0].properties.cases}</strong> cases.</p>` :
        `<p>Hover over a state!</p>`;
});

const legend = document.getElementById('legend');

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});
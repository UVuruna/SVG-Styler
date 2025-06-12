<?php
$sliders = [
    'brightness' => [
        'value' => 100,
        'unit' => '%',
        'maxValue' => 200,
        'infinite' => true,
        'radius' => 360,
        'curves' => 'Trio',
        'offsets' => [
            'rgb(255, 0, 0)',
            'rgb(255, 0, 128)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 128, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 128)',
            'rgb(0, 255, 0)',
            'rgb(128, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)'
        ]
    ],
    'contrast' => [
        'value' => 100,
        'unit' => '%',
        'maxValue' => 200,
        'infinite' => true,
        'radius' => 360,
        'curves' => 'Trio',
        'offsets' => [
            'rgb(255, 0, 0)',
            'rgb(255, 0, 128)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 128, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 128)',
            'rgb(0, 255, 0)',
            'rgb(128, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)'
        ]
    ],
    'saturate' => [
        'value' => 100,
        'unit' => '%',
        'maxValue' => 200,
        'infinite' => true,
        'radius' => 360,
        'curves' => 'Trio',
        'offsets' => [
            'rgb(255, 0, 0)',
            'rgb(255, 0, 128)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 128, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 128)',
            'rgb(0, 255, 0)',
            'rgb(128, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)'
        ]
    ],
    'hue-rotate' => [
        'value' => 0,
        'unit' => '°',
        'maxValue' => 360,
        'infinite' => false,
        'radius' => 360,
        'curves' => 'Quattro',
        'offsets' => [
            'rgb(0, 255, 255)',
            'rgb(0, 255, 128)',
            'rgb(0, 255, 0)',
            'rgb(128, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 128)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 128, 255)'   
        ]
    ],
    'invert' => [
        'value' => 0,
        'unit' => '%',
        'maxValue' => 100,
        'infinite' => false,
        'radius' => 270,
        'curves' => 'Quattro',
        'offsets' => [
            'rgb(0, 0, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)', 
            'rgb(255, 255, 0)',
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)'
        ]
    ],
    'sepia' => [
        'value' => 0,
        'unit' => '%',
        'maxValue' => 100,
        'infinite' => false,
        'radius' => 270,
        'curves' => 'Quattro',
        'offsets' => [
            'rgb(0, 0, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)', 
            'rgb(255, 255, 0)',
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)'
        ]
    ],
    'grayscale' => [
        'value' => 0,
        'unit' => '%',
        'maxValue' => 100,
        'infinite' => false,
        'radius' => 270,
        'curves' => 'Quattro',
        'offsets' => [
            'rgb(0, 0, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)', 
            'rgb(255, 255, 0)',
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)'
        ]
    ]
];

$curves = [
    "Trio" => [
        "x1" => 87.4,
        "y1" => 28.4,
        "x2" => 12.6,
        "y2" => 71.6,
        "circleCount" => 3
    ],
    "Quattro" => [
        "x1" => 70,
        "y1" => 30,
        "x2" => 30,
        "y2" => 70,
        "circleCount" => 4
    ]
];
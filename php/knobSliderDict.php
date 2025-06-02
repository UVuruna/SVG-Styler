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
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(0, 0, 255)'
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
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(0, 0, 255)'
        ]
    ],
    'saturation' => [
        'value' => 100,
        'unit' => '%',
        'maxValue' => 200,
        'infinite' => true,
        'radius' => 360,
        'curves' => 'Trio',
        'offsets' => [
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(0, 0, 255)'
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
            'rgb(0, 255, 0)',
            'rgb(128, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 0, 128)',
            'rgb(255, 0, 255)',
            'rgb(128, 0, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 128, 255)',
            'rgb(0, 255, 255)',
            'rgb(0, 255, 128)'
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
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(93, 0, 255)',
            'rgb(255, 0, 195)',
            'rgb(0, 0, 255)'
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
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(93, 0, 255)',
            'rgb(255, 0, 195)',
            'rgb(0, 0, 255)'
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
            'rgb(0, 255, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 255, 0)', 
            'rgb(255, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(93, 0, 255)',
            'rgb(255, 0, 195)',
            'rgb(0, 0, 255)'
        ]
    ]
];

$curves = [
    "Trio" => [
        "x1" => 28.3,
        "y1" => 87.5,
        "x2" => 71.7,
        "y2" => 12.5,
        "circleCount" => 3
    ],
    "Quattro" => [
        "x1" => 67.7,
        "y1" => 32.3,
        "x2" => 32.3,
        "y2" => 67.7,
        "circleCount" => 4
    ]
];
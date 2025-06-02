<?php include_once 'php/knobSliderDict.php'; ?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Colorize SVG</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/knobSlider.css" />
</head>

<body>
    <main>
        <?php include 'html/loadSVG.html'; ?>
        <?php include 'html/knobSlider.php'; ?>
    </main>
    <script type="module" src="./js/page/loadSVG.js"></script>
    <script type="module">
        import { SliderInitializer } from './js/slider/initKnobSlider.js';

        const sliders = <?= json_encode(
            array_map(function($s) {
                return [
                    'value' => $s['value'],
                    'maxValue' => $s['maxValue'],
                    'radius' => $s['radius'],
                    'infinite' => $s['infinite']
                ];
            }, $sliders)
        ) ?>;
        SliderInitializer.init(sliders);
        console.log(`Total init Time ${window.totalTime} ms`);
    </script>
</body>

</html>
<?php
    include_once 'php/knobSliderDict.php';
    include_once 'php/knobSliderDiv.php';
?>

<div id="slider-container">
    <?php
    foreach ($sliders as $name => $slider) {
        createSliderDiv(
            $name,
            $slider['value'],
            $slider['unit'],
            $curves[$slider['curves']],
            $slider['offsets']
        );
    }
    ?>
</div>
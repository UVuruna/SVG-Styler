<?php
function createSliderDiv($name, $value, $unit, $curves, $offsets): void {
    
    $circle = '';
    $gradient = '';
    extract($curves);

    $colorCount = count($offsets);
    $stopCount = intdiv($colorCount, $circleCount);
    
    for ($i = 0; $i < $circleCount; $i++) {
        $circle .= "<circle id='circle-{$i}' cx='150' cy='150' r='130' style='stroke: url(#gradient-{$name}-{$i})'></circle>\n";
        $gradient .= "<linearGradient id='gradient-{$name}-{$i}' x1='{$x1}%' y1='{$y1}%' x2='{$x2}%' y2='{$y2}%'>\n";
        $stops = '';
        for ($j = 0; $j < $stopCount+1; $j++) {
            $index = ($i*$stopCount + $j) % $colorCount;
            $color = $offsets[$index];
            $stopOffset = round($j * (100 / $stopCount), 1);
            $stops .= "<stop offset='{$stopOffset}%' style='stop-color: {$color}'/>\n";
        }
        $gradient .= "{$stops}</linearGradient>";
    }

    echo <<<HTML
        <div id={$name} class="slider">
            <div class="slider-wrapper">
                <div class="progress-bar">
                    <svg viewBox="0 0 300 300">
                        <circle cx="150" cy="150" r="130"></circle>
                        {$circle}
                        <defs>
                            {$gradient}
                        </defs>
                    </svg>
                </div>
                <div class="knob">
                    <div class="rotator">
                        <span class="value">{$value}</span>
                        <span class="unit">{$unit}</span>
                        <input type="hidden" class="exact-value" id="{$name}-value" value="{$value}"/>
                    </div>
                    <div class="pointer-frame">
                        <svg class="pointer" viewBox="0 0 100 84">
                            <polygon points="50 84 0 0 100 0 50 84"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="filter-type">{$name}</div>
        </div> 
    HTML;
}

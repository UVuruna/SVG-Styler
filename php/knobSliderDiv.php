<?php
function createSliderDiv($name, $value, $unit, $coords, $offsets): void {
    [$x1, $y1, $x2, $y2] = $coords;
    $stops = '';
    foreach ($offsets as $offset => $color) {
        $stops .= "<stop offset='{$offset}' style='stop-color: {$color}'/>\n";
    }

    echo <<<HTML
        <div id={$name} class="slider">
            <div class="knob">
                <div class="rotator">
                    <div class="value-unit">
                        <span class="value">{$value}</span>
                        <span class="unit">{$unit}</span>
                    </div>
                    <div class="filter-type">{$name}</div>
                </div>
                <div class="pointer-frame">
                    <svg class="pointer" viewBox="0 0 100 84">
                        <polygon points="50 0 0 84 100 84 50 0"/>
                    </svg>
                </div>
            </div>
            <div class="progress-bar">
                <svg viewBox="0 0 300 300">
                    <circle cx="150" cy="150" r="130"></circle>
                    <circle cx="150" cy="150" r="130" class="circle" style="stroke: url(#gradient-{$name})"></circle>
                    <defs>
                        <lineargradient id="gradient-{$name}" x1="{$x1}%" y1="{$y1}%" x2="{$x2}%" y2="{$y2}%">
                            {$stops}
                        </lineargradient>
                    </defs>
                </svg>
            </div>
            <input type="hidden" class="exact-value" id="{$name}-value" value="{$value}"/>
        </div> 
    HTML;
}

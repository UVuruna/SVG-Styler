#!/bin/sh

# Funkcija za pravljenje izlaznog foldera sa istom strukturom kao ulazni
make_output_dir() {
  out_dir="$1"
  in_file="$2"
  rel_path="${in_file#./}"
  out_path="$out_dir/$(dirname "$rel_path")"
  mkdir -p "$out_path"
  echo "$out_path/$(basename "$rel_path")"
}

# Minifikuj JS fajlove
find ./js -type f -name "*.js" | while read file; do
  out_file=$(make_output_dir "./mini" "$file")
  ./node_modules/.bin/terser "$file" -o "$out_file" --compress --mangle
  echo "Minifikovan JS: $file -> $out_file"
done

# Minifikuj CSS fajlove
find ./css -type f -name "*.css" | while read file; do
  out_file=$(make_output_dir "./mini" "$file")
  ./node_modules/.bin/cleancss -o "$out_file" "$file"
  echo "Minifikovan CSS: $file -> $out_file"
done

# Minifikuj HTML fajlove
find ./html -type f -name "*.html" | while read file; do
  out_file=$(make_output_dir "./mini" "$file")
  ./node_modules/.bin/html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --minify-css true --minify-js true "$file" -o "$out_file"
  echo "Minifikovan HTML: $file -> $out_file"
done

# Minifikuj SVG fajlove
find ./other/svg -type f -name "*.svg" | while read file; do
  out_file=$(make_output_dir "./mini" "$file")
  ./node_modules/.bin/svgo "$file" -o "$out_file"
  echo "Minifikovan SVG: $file -> $out_file"
done

# Minifikuj JSON fajlove pomoću Python skripte
find ./other/json -type f -name "*.json" | while read file; do
  out_file=$(make_output_dir "./mini" "$file")
  python support/minify_json.py "$file" "$out_file"
  echo "Minifikovan JSON: $file -> $out_file"
done

read -p "Pritisni Enter za izlaz..."

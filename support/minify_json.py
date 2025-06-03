#!/usr/bin/env python3
import sys, json

def minify_json(in_path, out_path):
    with open(in_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: minify_json.py input.json output.json")
        sys.exit(1)
    minify_json(sys.argv[1], sys.argv[2])

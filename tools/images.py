#!/usr/bin/env python3
"""
Generate AVIF and WebP siblings for every JPEG under public/.

This exists because of a real outage: <picture> selects a <source> by MIME
type and does NOT fall back if that file 404s. Poster.jsx derives sibling
paths from the .jpg name, so a single missing .avif renders a permanently
broken image in every AVIF-capable browser. Generating for *every* jpg, rather
than by hand per directory, is what makes that impossible.

Run after adding or re-encoding any image:  python3 tools/images.py
"""
import pathlib
import subprocess
import sys

PUBLIC = pathlib.Path(__file__).resolve().parent.parent / 'public'


def convert(src, dst, args):
    return subprocess.run(['magick', str(src), *args, str(dst)],
                          capture_output=True, text=True).returncode == 0


def main():
    jpgs = sorted(PUBLIC.rglob('*.jpg'))
    if not jpgs:
        sys.exit('no jpgs under public/')

    made = missing = 0
    jpg_total = avif_total = webp_total = 0

    for src in jpgs:
        avif = src.with_suffix('.avif')
        webp = src.with_suffix('.webp')
        for dst, args in ((avif, ['-quality', '55', '-define', 'heic:speed=4']),
                          (webp, ['-quality', '72', '-define', 'webp:method=5'])):
            if not dst.exists():
                if convert(src, dst, args):
                    made += 1
                else:
                    missing += 1
                    print(f'  FAILED {dst.relative_to(PUBLIC)}')
        jpg_total += src.stat().st_size
        if avif.exists():
            avif_total += avif.stat().st_size
        if webp.exists():
            webp_total += webp.stat().st_size

    print(f'{len(jpgs)} jpgs · generated {made} · failed {missing}')
    print(f'  jpg  {jpg_total/1e6:.2f}M')
    print(f'  webp {webp_total/1e6:.2f}M')
    print(f'  avif {avif_total/1e6:.2f}M  ({(1-avif_total/jpg_total)*100:.0f}% smaller)')

    # Every jpg must have both siblings, or <picture> breaks in production.
    broken = [p for p in jpgs if not p.with_suffix('.avif').exists()
              or not p.with_suffix('.webp').exists()]
    if broken:
        print('\nINCOMPLETE — these would render as broken images:')
        for p in broken:
            print('  ', p.relative_to(PUBLIC))
        sys.exit(1)
    print('\nevery jpg has both siblings')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Re-encode the café's reels for the web.

The first pass through this footage downscaled every vertical clip
720x1280 -> 540x960 and cut bitrate to roughly a third, which is why they
looked soft. One clip was even upscaled 1080x720 -> 1280x854 while losing
two thirds of its bitrate. Nothing here is ever scaled: Instagram already
serves at most 1280 on the long edge, so the source resolution IS the target
and any scaling is pure loss.

Quality is tiered by how prominently a clip is used. The hero plays full-bleed
behind the headline and is the only clip that loads eagerly, so it gets the
most bits; the reel wall only plays on hover at a quarter of the viewport.

Usage:  python3 tools/transcode.py [--src DIR] [--check]
"""
import argparse
import json
import pathlib
import subprocess
import sys

# id -> CRF. Lower is crisper. Anything unlisted falls back to WALL.
HERO = 18   # full-bleed behind the headline, loads eagerly
FEATURE = 20  # menu cards and the Base Buddy / Visit panels
WALL = 22   # reel wall, plays on hover, quarter-viewport

TIERS = {
    '3943234346642411994': HERO,     # hero — espresso over ice
    '3778687486978177826': FEATURE,  # Orange Espresso — menu card
    '3634453733045770963': FEATURE,  # Base Bellam — menu card
    '3821482581582856577': FEATURE,  # Base Matcha
    '3756868518030758801': FEATURE,  # Base Buddy panel
    '3624892154889377045': FEATURE,  # Visit background
}

ROOT = pathlib.Path(__file__).resolve().parent.parent
MEDIA = ROOT / 'public' / 'media'
POSTERS = ROOT / 'public' / 'posters'


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
             '-show_entries', 'stream=width,height',
             '-show_entries', 'format=duration,bit_rate',
             '-of', 'json', str(path)])
    if r.returncode:
        return None
    d = json.loads(r.stdout)
    s = d['streams'][0]
    return {
        'w': s['width'], 'h': s['height'],
        'dur': float(d['format'].get('duration', 0)),
        'kbps': int(d['format'].get('bit_rate', 0)) // 1000,
    }


def encode(src, dst, crf):
    """Native resolution, no scaling, audio stripped, faststart for streaming."""
    r = run([
        'ffmpeg', '-y', '-loglevel', 'error', '-i', str(src),
        '-an',
        '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1',
        '-preset', 'slow', '-crf', str(crf),
        '-pix_fmt', 'yuv420p',
        # keyframe every ~2s so scrubbing and looping stay responsive
        '-g', '60', '-keyint_min', '30', '-sc_threshold', '40',
        '-movflags', '+faststart',
        str(dst),
    ])
    return r.returncode == 0, r.stderr


def brightest_frame(src, dst, samples=9):
    """
    A fixed-timestamp poster renders as an empty black rectangle for the
    darker reels, which reads as a hole in the grid. Sample across the clip
    and keep the brightest frame.
    """
    info = probe(src)
    if not info or info['dur'] <= 0:
        return False
    tmp = dst.parent / f'.cand_{dst.stem}.jpg'
    best_lum, best = -1.0, None
    for i in range(samples):
        t = info['dur'] * (0.08 + 0.84 * i / max(1, samples - 1))
        if run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t:.2f}',
                '-i', str(src), '-frames:v', '1', '-q:v', '2', str(tmp)]).returncode:
            continue
        lum = run(['magick', str(tmp), '-colorspace', 'Gray',
                   '-format', '%[fx:mean]', 'info:']).stdout.strip()
        try:
            lum = float(lum)
        except ValueError:
            continue
        if lum > best_lum:
            best_lum, best = lum, tmp.read_bytes()
    tmp.unlink(missing_ok=True)
    if best is None:
        return False
    dst.write_bytes(best)
    # re-encode the chosen frame at high quality, stripped of metadata
    run(['magick', str(dst), '-quality', '86', '-strip',
         '-interlace', 'Plane', str(dst)])
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default=None,
                    help='directory of original downloads (defaults to public/media itself)')
    ap.add_argument('--check', action='store_true', help='report only, encode nothing')
    args = ap.parse_args()

    src_dir = pathlib.Path(args.src) if args.src else MEDIA
    if not src_dir.is_dir():
        sys.exit(f'source directory not found: {src_dir}')

    wanted = sorted(p.stem for p in MEDIA.glob('*.mp4'))
    if not wanted:
        sys.exit('no clips in public/media')

    print(f'{"clip":<24}{"res":<12}{"crf":<5}{"before":>10}{"after":>10}  delta')
    total_before = total_after = 0

    for stem in wanted:
        src = src_dir / f'{stem}.mp4'
        cur = MEDIA / f'{stem}.mp4'
        if not src.exists():
            print(f'{stem:<24}{"— no source —":<12}')
            continue
        crf = TIERS.get(stem, WALL)
        info = probe(src)
        before = cur.stat().st_size if cur.exists() else 0
        total_before += before

        if args.check:
            print(f'{stem:<24}{info["w"]}x{info["h"]:<7}{crf:<5}{before/1e6:>9.2f}M')
            continue

        tmp = MEDIA / f'.{stem}.tmp.mp4'
        ok, err = encode(src, tmp, crf)
        if not ok:
            tmp.unlink(missing_ok=True)
            print(f'{stem:<24}FAILED: {err.strip()[:60]}')
            continue
        tmp.replace(cur)
        after = cur.stat().st_size
        total_after += after
        brightest_frame(cur, POSTERS / f'{stem}.jpg')
        pct = (after - before) / before * 100 if before else 0
        print(f'{stem:<24}{info["w"]}x{info["h"]:<7}{crf:<5}'
              f'{before/1e6:>9.2f}M{after/1e6:>9.2f}M  {pct:+.0f}%')

    if not args.check:
        print(f'\ntotal {total_before/1e6:.1f}M -> {total_after/1e6:.1f}M')


if __name__ == '__main__':
    main()

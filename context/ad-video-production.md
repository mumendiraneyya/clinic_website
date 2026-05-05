# Ad Video Production

How we turn a single source interview into the multi-aspect, silence-trimmed video creatives that feed Meta ad campaigns. This is the **upstream** of [meta-ads-management.md](meta-ads-management.md) — the videos this document produces are the same files referenced in that doc's "Creative setup pattern" section (uploaded via `/act_.../advideos`, then attached to creatives via `asset_feed_spec`).

## Why two aspect ratios per concept

Meta serves ads across placements with very different aspect ratios. We deliver one video per ratio per concept:

- **1:1 (1080×1080)** — Facebook feed/marketplace, Instagram stream/explore. Square crops well from a 16:9 talking-head shot.
- **9:16 (1080×1920)** — Facebook story/reels, Instagram story/reels. Tall vertical; the speaker fills the frame.

The campaign API attaches both videos to one creative and lets `asset_customization_rules` route each ratio to its matching placements. See [meta-ads-management.md](meta-ads-management.md) §"Creative setup pattern" for the exact `asset_feed_spec` shape.

## Tooling

- **ffmpeg** (`brew install ffmpeg`) — trimming, concatenation, cropping, scaling, encoding
- **auto-editor** (`brew install auto-editor`, currently v30.x) — silence detection and removal. Far less fiddly than ffmpeg's `silenceremove` filter, which struggles with breath/music and demands hand-tuning per source

## Source assumptions

- Single 1920×1080 interview file with stereo audio
- Speaker is roughly centered (so a static center-crop frames them correctly in both 1:1 and 9:16)
- For interviews where the speaker drifts off-center, a static crop will lose them — use Resolve/Premiere auto-reframe instead

## Pipeline (per video version)

```
source.mp4
   │
   ├── (1) trim/concat desired ranges       → vN_trim.mp4   (1920×1080)
   │
   ├── (2) auto-editor silence removal      → vN_edit.mp4   (1920×1080, shorter)
   │
   ├── (3a) center-crop 1:1                 → vN_1x1.mp4    (1080×1080)
   └── (3b) center-crop 9:16, scale up      → vN_9x16.mp4   (1080×1920)
```

**Order matters: edit before cropping.** Auto-editor decides cuts from the audio waveform alone, so cropping first wastes one full encode per ratio. One auto-edit, two crops.

### 1. Trim/concat ranges

For a single contiguous range, use `-ss/-to`:

```bash
ffmpeg -y -ss 0 -to 47 -i source.mp4 \
  -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k v3_trim.mp4
```

For multiple ranges concatenated, use `filter_complex` (re-encodes — required for clean splice):

```bash
ffmpeg -y -i source.mp4 -filter_complex "\
[0:v]trim=0:16,setpts=PTS-STARTPTS[v1];\
[0:a]atrim=0:16,asetpts=PTS-STARTPTS[a1];\
[0:v]trim=47:65,setpts=PTS-STARTPTS[v2];\
[0:a]atrim=47:65,asetpts=PTS-STARTPTS[a2];\
[v1][a1][v2][a2]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k v1_trim.mp4
```

Always re-encode at this step. Stream-copy splices produce sync drift at the cut.

### 2. Silence removal with auto-editor

```bash
auto-editor v1_trim.mp4 \
  -e "audio:threshold=0.04" \
  -m 0.2sec \
  -o v1_edit.mp4 \
  --no-open
```

Flag meanings (auto-editor 30.x syntax — note the `-e "audio:threshold=..."` form, NOT the deprecated `--silent-threshold` flag):

| Flag | Value | Effect |
|---|---|---|
| `-e "audio:threshold=N"` | 0.04 default | Below N is "silent". Higher = more aggressive cuts |
| `-m, --margin` | `0.2sec` | Pad each kept segment by this much. Lower = tighter cuts but choppy speech |
| `--no-open` | — | Don't auto-launch the result |

**Threshold tuning.** Start at `0.04` (natural cadence). Push higher only if duration is too long:

| Threshold | Behavior |
|---|---|
| `0.04` | Removes obvious silence, breaths intact, sounds natural |
| `0.08–0.12` | Cuts breaths, mild over-trimming |
| `0.18+` | Cuts into quiet words; "choppy" territory |
| `0.25+` | Cuts mid-speech; only useful if you're going to speed up the result anyway |

**The 30s reality.** Interviews with continuous speech don't compress to 30s by silence-cuts alone. Empirically, an 89s segment of dense speech floors around 55s at threshold 0.25 and barely budges further. If a hard 30s cap is required, the realistic options are:

1. Pick a denser sub-window of the source (best quality)
2. Speed up active speech with `-w:1 speed,1.5` (pitch-preserved; tolerable up to ~1.3×, rough beyond)
3. Accept the natural floor and let the platform crop (Reels allows up to 90s, Feed up to 60s)

Path 1 is almost always the right answer for ad creatives — pick the punchline, don't compress everything.

### 3. Center-crop to both aspect ratios

From 1920×1080:

**1:1 (1080×1080)** — native, no scaling:
```bash
ffmpeg -y -i v1_edit.mp4 \
  -vf "crop=1080:1080:420:0" \
  -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 192k v1_1x1.mp4
```

**9:16 (1080×1920)** — crop 608×1080, scale 1.78× to 1080×1920:
```bash
ffmpeg -y -i v1_edit.mp4 \
  -vf "crop=608:1080:656:0,scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 192k v1_9x16.mp4
```

**Crop math** (1920×1080 source):
- 1:1 → keep 1080 high, take 1080 wide centered: `crop=1080:1080:(1920-1080)/2:0` → `crop=1080:1080:420:0`
- 9:16 → keep 1080 high, take 1920×9/16=607.5 wide → round up to 608 (must be even): `crop=608:1080:(1920-608)/2:0` → `crop=608:1080:656:0`. Then scale to 1080×1920 for the canonical Reels/Stories resolution.

**Encoding settings** (don't change without reason):
- `-crf 18` — visually lossless on talking-head footage, ~10–30MB per 30s
- `-pix_fmt yuv420p` — required for broad mobile/social compatibility
- `-movflags +faststart` — moves the moov atom to the start; Meta and CDNs need this for streaming uploads
- `-c:a aac -b:a 192k` — Meta accepts AAC up to 256k; 192k is the sweet spot

## Why not stream-copy?

Every step here re-encodes. A pure stream-copy chain (ffmpeg `-c copy`, no filter, no crop) would be faster, but:

- Concat across two source ranges → splice artifacts and audio drift
- Crop and scale are filters → require re-encoding by definition
- Auto-editor re-encodes regardless

Since the source is already lossy h264, two re-encodes at CRF 18 don't introduce visible quality loss on this kind of footage.

## Output naming convention

```
v{N}_trim.mp4   intermediate, trim/concat output
v{N}_edit.mp4   intermediate, post-silence-cut, full-frame
v{N}_1x1.mp4    deliverable for FB feed / IG stream
v{N}_9x16.mp4   deliverable for FB reels / IG story / IG reels
```

Where `{N}` is the version number (1, 2, 3, …) within a campaign concept. The intermediates are useful for re-cropping later if framing needs to change — keep them until the campaign is locked.

## Worked example — Campaign 1 source files

Campaign 1 (`120245104755200304`) uses three videos cut from a single ~99s YouTube interview (`YTDown_YouTube_Media_TzVZ7UiMEB4_001_1080p.mp4` at the time of production).

| Version | Source ranges | Final duration | Files |
|---|---|---|---|
| V1 | 0:00–0:16 + 0:47–1:05 | 33.1s | `v1_1x1.mp4`, `v1_9x16.mp4` |
| V2 | 0:00–0:16 + 1:05–1:29 | 38.1s | `v2_1x1.mp4`, `v2_9x16.mp4` |
| V3 | 0:00–0:47 | 45.0s | `v3_1x1.mp4`, `v3_9x16.mp4` |

All produced with threshold `0.04`, margin `0.2s`, x264 CRF 18, center-crop. The 33–45s range came out of the natural silence-cut floor for this material — we did not force a 30s cap.

Per-version Meta ad IDs are recorded in [meta-ads-management.md](meta-ads-management.md) §"Campaign 1".

## Handoff to upload

Once `vN_1x1.mp4` and `vN_9x16.mp4` for each version exist, hand off to [meta-ads-management.md](meta-ads-management.md) §"Creative setup pattern" — that section covers `/advideos` upload, polling for `video_status: ready`, and attaching the videos to creatives via `asset_feed_spec`.

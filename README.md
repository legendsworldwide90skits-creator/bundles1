# Legends Worldwide — Bundles

Stock catalog for bundles.

## Wholesale page (since 2026-10-28)
- Live page: `index.html` (both stocks; `?stock=ca` opens Central America). `ca/` and `v2/` redirect to it.
- Stock sources: `v1/sa.html` (South America) and `v1/ca.html` (Central America) — the old pages, kept only as data source.
- To update: edit the v1 files, then run `python3 v2/tools/build.py` (removed pieces: `EXCLUDE` in build.py).

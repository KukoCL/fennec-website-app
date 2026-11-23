# Local reference basemap

`landPaths.json` is a deterministic equirectangular projection of Natural Earth's
1:110m land polygons. Longitude + 180 is x; 90 - latitude is y. Coordinates are
rounded to three decimals, without adding geographic features.

Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
Retrieved: 2026-11-17.
Source SHA-256: `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`.
License: public domain. https://www.naturalearthdata.com/about/terms-of-use/

The asset is bundled locally. Runtime rendering sends no locations, bounding boxes,
map tile requests, or reverse-geocoding requests to external map providers.
This is a small-scale orientation map, not a street map or navigation aid.

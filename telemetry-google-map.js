/* Isolated provider document. Never load this SDK in the authenticated SPA's JavaScript realm. */
(() => {
  'use strict';
  if (window.parent === window || window.origin !== 'null') return;
  let parentOrigin;
  try { parentOrigin = new URL(window.location.href).origin; } catch { return; }
  if (!/^https?:\/\//.test(parentOrigin)) return;
  const protocol = 'fennec-google-map-v1';
  const send = (type, extra = {}) => window.parent.postMessage({ protocol, type, ...extra }, parentOrigin);
  let initialized = false;
  let map;
  let points = [];
  let selected = 0;
  let overlays = [];
  let failed = false;
  let readyTimer;
  const fail = () => {
    failed = true;
    clearTimeout(readyTimer);
    send('error');
  };
  const validIndex = (index) => Number.isInteger(index) && index >= 0 && index < points.length;
  const updateSelection = () => overlays.forEach((overlay) => overlay.update());
  const fit = () => {
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 50);
  };
  const load = (config) => {
    points = config.points.map((point) => ({ lat: point.lat, lng: point.lng }));
    selected = config.selected;
    const english = config.language === 'en';
    window.gm_authFailure = fail;
    readyTimer = setTimeout(fail, 20000);
    window.fennecMapReady = () => {
      if (failed) return;
      try {
        map = new google.maps.Map(document.getElementById('map'), {
          center: points[0], zoom: 3, maxZoom: 18,
          renderingType: google.maps.RenderingType.RASTER,
          mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
          gestureHandling: 'cooperative', clickableIcons: false,
        });
        // Numbered groups preserve exact coordinates. A click cycles co-located observations;
        // the SPA selector always provides access to every observation, including near-overlaps.
        class ObservationOverlay extends google.maps.OverlayView {
          constructor(indices) { super(); this.indices = indices; this.button = null; }
          onAdd() {
            this.button = document.createElement('button');
            this.button.type = 'button';
            this.button.className = 'observation-pin';
            this.button.addEventListener('click', () => {
              const previous = this.indices.indexOf(selected);
              selected = this.indices[(previous + 1) % this.indices.length];
              updateSelection();
              send('select', { index: selected });
            });
            google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.button);
            this.getPanes().overlayMouseTarget.appendChild(this.button);
            this.update();
          }
          update() {
            if (!this.button) return;
            const active = this.indices.includes(selected);
            const index = active ? selected : this.indices[0];
            this.button.textContent = `${index + 1}${this.indices.length > 1 ? ` ×${this.indices.length}` : ''}`;
            this.button.setAttribute('aria-pressed', String(active));
            const label = english ? 'Observation' : 'Observación';
            const overlap = english ? 'at this position. Click to cycle.' : 'en esta posición. Haz clic para alternar.';
            this.button.setAttribute('aria-label', `${label} ${index + 1}. ${this.indices.length} ${overlap}`);
            this.button.title = this.button.getAttribute('aria-label');
          }
          draw() {
            if (!this.button) return;
            const pixel = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(points[this.indices[0]]));
            if (!pixel) return;
            this.button.style.left = `${pixel.x}px`;
            this.button.style.top = `${pixel.y}px`;
          }
          onRemove() { this.button?.remove(); this.button = null; }
        }
        const grouped = new Map();
        points.forEach((point, index) => {
          const key = `${point.lat},${point.lng}`;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(index);
        });
        overlays = [...grouped.values()].map((indices) => {
          const overlay = new ObservationOverlay(indices);
          overlay.setMap(map);
          return overlay;
        });
        google.maps.event.addListenerOnce(map, 'idle', () => {
          if (failed) return;
          clearTimeout(readyTimer);
          send('loaded');
        });
        fit();
      } catch { fail(); }
    };
    const url = new URL('https://maps.googleapis.com/maps/api/js');
    url.search = new URLSearchParams({ key: config.key, loading: 'async', callback: 'fennecMapReady',
      v: 'quarterly', language: config.language, auth_referrer_policy: 'origin' });
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.src = url.href;
    script.onerror = fail;
    document.head.appendChild(script);
  };
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== parentOrigin) return;
    const data = event.data;
    if (!data || data.protocol !== protocol) return;
    if (data.type === 'init' && !initialized) {
      if (typeof data.key !== 'string' || !data.key.trim() || data.key.length > 200
        || !['en', 'es'].includes(data.language) || !Array.isArray(data.points)
        || !data.points.length || data.points.length > 180
        || !data.points.every((point) => point && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90
          && Number.isFinite(point.lng) && Math.abs(point.lng) <= 180)
        || !Number.isInteger(data.selected) || data.selected < 0 || data.selected >= data.points.length) return;
      initialized = true;
      load(data);
    } else if (data.type === 'select' && validIndex(data.index)) {
      selected = data.index;
      updateSelection();
      // Keep keyboard focus in the parent selector; update() raises the selected marker visually.
    } else if (data.type === 'fit') fit();
    else if (data.type === 'world' && map) { map.setCenter({ lat: 0, lng: 0 }); map.setZoom(2); }
  });
  send('ready');
})();

/* Full-page animated dot-matrix wave background for Nothing Do.
   Chalk dots with sparse red accents; respects prefers-reduced-motion. */
(function () {
  var CHALK = [237, 235, 230];
  var RED = [215, 25, 33];
  var FRAME_INTERVAL_MS = 33;

  function fract(v) { return v - Math.floor(v); }

  function hash21(x, y) {
    return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
  }

  function waveField(uvX, uvY, time, cellX, cellY) {
    var p1 = hash21(cellX, cellY) * Math.PI * 2;
    var p2 = hash21(cellX + 19, cellY + 43) * Math.PI * 2;
    var t = time + p1 * 0.42;
    return (
      Math.sin(uvX * 13 + p1 * 0.6 - t * 1.1) * 0.32 +
      Math.sin(uvY * 10 + p2 * 0.45 - t * 0.8) * 0.26 +
      Math.sin((uvX * 1.2 + uvY * 0.9) * 11 + p1 * 0.35 - t * 1.7) * 0.28 +
      Math.sin(uvX * 21 + uvY * 16 + p2 - t * 2.2) * 0.15 +
      Math.sin((uvX + uvY) * 9 + p1 - t * 0.95) * 0.12
    );
  }

  function spacingForWidth(w) {
    return w < 480 ? 22 : w < 768 ? 20 : w < 1200 ? 18 : 16;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    if (prefersReducedMotion()) {
      document.body.classList.add('dot-wave-static');
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.className = 'dot-wave-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var startTime = performance.now();
    var lastDraw = 0;
    var spacing = 18;
    var w = 0;
    var h = 0;
    var documentVisible = !document.hidden;

    function resize() {
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      spacing = spacingForWidth(w);
    }

    function draw(time) {
      var elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);
      var cols = Math.ceil(w / spacing);
      var rows = Math.ceil(h / spacing);

      for (var row = 0; row < rows; row += 1) {
        for (var col = 0; col < cols; col += 1) {
          var cx = (col + 0.5) * spacing;
          var cy = (row + 0.5) * spacing;
          var wave = waveField(cx / w, cy / h, elapsed, col, row);
          var grain = hash21(col, row);
          var sizeScale = grain < 0.22 ? 0.5 : grain < 0.48 ? 0.75 : 1;
          var peak = Math.max(wave, 0);
          var alpha = Math.min(0.4, (0.05 + wave * 0.12 + peak * 0.1) * (0.75 + sizeScale * 0.25));
          if (alpha < 0.025) continue;
          var radius = spacing * (0.16 + peak * 0.1) * sizeScale;
          var isRed = grain > 0.965 && peak > 0.35;
          var rgb = isRed ? RED : CHALK;
          ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (isRed ? Math.min(0.8, alpha * 2.4) : alpha) + ')';
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function tick(time) {
      window.requestAnimationFrame(tick);
      if (!documentVisible) return;
      if (time - lastDraw < FRAME_INTERVAL_MS) return;
      lastDraw = time;
      draw(time);
    }

    document.addEventListener('visibilitychange', function () {
      documentVisible = !document.hidden;
    });
    window.addEventListener('resize', function () {
      resize();
      draw(performance.now());
    });

    resize();
    draw(performance.now());
    window.requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

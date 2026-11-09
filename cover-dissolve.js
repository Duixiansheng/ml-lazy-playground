(() => {
  const duration = 600;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const parameter = "from-cover";

  function createLayer() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return null;

    const cellSize = Math.max(4, Math.ceil(Math.max(innerWidth, innerHeight) / 440));
    const width = Math.ceil(innerWidth / cellSize);
    const height = Math.ceil(innerHeight / cellSize);
    canvas.width = width;
    canvas.height = height;
    const pixels = context.createImageData(width, height);
    const thresholds = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        let hash = Math.imul(i + 1, 0x45d9f3b);
        hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
        const grain = ((hash ^ (hash >>> 16)) >>> 0) / 0x100000000;
        thresholds[i] = 0.38 * (x / width) + 0.13 * (y / height) + 0.49 * grain;
        pixels.data[i * 4] = 246;
        pixels.data[i * 4 + 1] = 244;
        pixels.data[i * 4 + 2] = 238;
      }
    }

    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.coverDissolve = "";
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "100",
      imageRendering: "pixelated",
      pointerEvents: "none",
    });

    function paint(coverage) {
      for (let i = 0; i < thresholds.length; i++) {
        pixels.data[i * 4 + 3] = thresholds[i] < coverage ? 255 : 0;
      }
      context.putImageData(pixels, 0, 0);
    }

    function animate(entering) {
      return new Promise((resolve) => {
        const start = performance.now();
        function frame(now) {
          const progress = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (now - start) / duration));
          const eased = progress * progress * (3 - 2 * progress);
          paint(entering ? 1 - eased : eased);
          if (progress < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    }

    return { canvas, paint, animate };
  }

  window.coverDissolve = async (href) => {
    if (reducedMotion.matches) {
      location.assign(href);
      return;
    }

    const layer = createLayer();
    if (!layer) {
      location.assign(href);
      return;
    }

    document.body.append(layer.canvas);
    await layer.animate(false);
    const destination = new URL(href);
    destination.searchParams.set(parameter, "1");
    location.assign(destination.href);
  };

  const url = new URL(location.href);
  if (url.searchParams.get(parameter) !== "1") return;
  url.searchParams.delete(parameter);
  history.replaceState(history.state, "", url.href);
  if (reducedMotion.matches) return;

  const layer = createLayer();
  if (!layer) return;
  layer.paint(1);
  document.body.append(layer.canvas);
  document.addEventListener("DOMContentLoaded", async () => {
    await layer.animate(true);
    layer.canvas.remove();
  }, { once: true });
})();

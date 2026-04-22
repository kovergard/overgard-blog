document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Setup ---------- */

  const overlay = document.createElement("div");
  overlay.className = "hugo-lightbox-overlay";
  document.body.appendChild(overlay);

  const overlayImage = document.createElement("img");
  overlay.appendChild(overlayImage);

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.1;

  /* ---------- Helpers ---------- */

  function updateTransform() {
    overlayImage.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function imageExceedsViewport() {
    const rect = overlayImage.getBoundingClientRect();
    return (
      rect.width > window.innerWidth ||
      rect.height > window.innerHeight
    );
  }

  function clampPan() {
    const rect = overlayImage.getBoundingClientRect();

    const maxX = Math.max(0, (rect.width - window.innerWidth) / 2);
    const maxY = Math.max(0, (rect.height - window.innerHeight) / 2);

    translateX = Math.min(maxX, Math.max(-maxX, translateX));
    translateY = Math.min(maxY, Math.max(-maxY, translateY));
  }

  function closeLightbox() {
    overlay.classList.remove("active");
    overlayImage.src = "";
    resetTransform();
  }

  /* ---------- Events ---------- */

  /* Open lightbox */
  document.querySelectorAll("a.lightbox").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      overlayImage.src = link.getAttribute("href");
      overlay.classList.add("active");
      resetTransform();

      overlayImage.onload = () => {
        clampPan();
        updateTransform();
      };
    });
  });

  /* Close on background click */
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeLightbox();
  });

  /* Close on ESC */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeLightbox();
    }
  });

  /* Zoom */
  overlay.addEventListener("wheel", e => {
    if (!overlay.classList.contains("active")) return;

    e.preventDefault();

    const delta = e.deltaY < 0 ? 1 + ZOOM_STEP : 1 - ZOOM_STEP;
    scale *= delta;
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

    clampPan();
    updateTransform();
  }, { passive: false });

  /* Start pan */
  overlayImage.addEventListener("mousedown", e => {
    if (!imageExceedsViewport()) return;

    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    overlayImage.classList.add("dragging");
    e.preventDefault();
  });

  /* Pan move */
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    clampPan();
    updateTransform();
  });

  /* End pan */
  document.addEventListener("mouseup", () => {
    isDragging = false;
    overlayImage.classList.remove("dragging");
  });

  /* Double-click reset */
  overlayImage.addEventListener("dblclick", e => {
    e.preventDefault();
    resetTransform();
  });

});
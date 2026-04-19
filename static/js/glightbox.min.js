
document.addEventListener("DOMContentLoaded", function () {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "hugo-lightbox-overlay";
  document.body.appendChild(overlay);

  // Image inside overlay
  const overlayImage = document.createElement("img");
  overlay.appendChild(overlayImage);

  // Close function
  function closeLightbox() {
    overlay.classList.remove("active");
    overlayImage.src = "";
  }

  // Close on click
  overlay.addEventListener("click", closeLightbox);

  // Close on ESC key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      closeLightbox();
    }
  });

  // Attach click handlers to lightbox links
  document.querySelectorAll("a.lightbox").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      overlayImage.src = link.getAttribute("href");
      overlay.classList.add("active");
    });
  });
});

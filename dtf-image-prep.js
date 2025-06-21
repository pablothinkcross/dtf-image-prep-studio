document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("imageInput");
  const mainCanvas = document.getElementById("mainCanvas");
  const ctx = mainCanvas.getContext("2d");
  const placeholderText = document.getElementById("placeholderText");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const contrastSlider = document.getElementById("contrastSlider");
  const saturationSlider = document.getElementById("saturationSlider");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const dpiSelect = document.getElementById("dpiSelect");
  const originalSize = document.getElementById("originalSize");
  const dtfSize = document.getElementById("dtfSize");
  const previewImage = document.getElementById("previewImage");
  const previewModal = document.getElementById("previewModal");
  const closeModal = document.getElementById("closeModal");
  const downloadBtn = document.getElementById("downloadBtn");
  let img = new Image();
  let originalWidthPx, originalHeightPx;

  function updateCanvas() {
    const widthCm = parseFloat(widthInput.value) || 20;
    const heightCm = parseFloat(heightInput.value) || 20;
    const dpi = parseInt(dpiSelect.value) || 300;
    const widthPx = Math.round((widthCm / 2.54) * dpi);
    const heightPx = Math.round((heightCm / 2.54) * dpi);

    mainCanvas.width = widthPx;
    mainCanvas.height = heightPx;

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.filter = `brightness(${parseInt(brightnessSlider.value) + 100}%) contrast(${contrastSlider.value}%) saturate(${saturationSlider.value}%)`;
    if (img.src) {
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
    }
    ctx.filter = "none";

    originalSize.textContent = img.src ? `${(originalWidthPx / 300 * 2.54).toFixed(1)} cm × ${(originalHeightPx / 300 * 2.54).toFixed(1)} cm` : "-";
    dtfSize.textContent = `${widthCm} cm × ${heightCm} cm @ ${dpi} DPI → ${widthPx} × ${heightPx} px`;
  }

  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      img.onload = function () {
        originalWidthPx = img.width;
        originalHeightPx = img.height;
        placeholderText.classList.add("hidden");
        mainCanvas.classList.remove("hidden");
        updateCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  [brightnessSlider, contrastSlider, saturationSlider, widthInput, heightInput, dpiSelect].forEach(el => {
    el.addEventListener("input", updateCanvas);
  });

  document.getElementById("previewBtn").addEventListener("click", function () {
    previewImage.src = mainCanvas.toDataURL("image/png");
    previewModal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", function () {
    previewModal.classList.add("hidden");
  });

  downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "imagen_dtf.png";
    link.href = mainCanvas.toDataURL();
    link.click();
  });
});
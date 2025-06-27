function toggleMenu() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('active');
}

// פונקציה כללית שגוללת כל קרוסלה לפי מזהה
function scrollCarouselById(id, direction) {
  const track = document.getElementById(id);
  if (!track) {
    console.error("לא נמצא אלמנט עם id:", id);
    return;
  }
  const scrollAmount = track.offsetWidth * 0.6;
  track.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}
// פתיחת תמונה ב-Lightbox
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel-item img").forEach(function (img) {
    img.addEventListener("click", function () {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = 99999;
      overlay.style.cursor = "zoom-out";

      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.style.maxWidth = "90%";
      fullImg.style.maxHeight = "90%";
      fullImg.style.borderRadius = "12px";
      fullImg.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", function () {
        document.body.removeChild(overlay);
      });
    });
  });
});

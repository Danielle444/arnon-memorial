function toggleMenu() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('active');
}
function scrollCarousel(direction) {
  var track = document.getElementById('carouselTrack');
  var scrollAmount = track.offsetWidth * 0.6; // גולש 60% מהרוחב
  track.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

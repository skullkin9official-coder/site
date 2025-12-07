const sliderContainer = document.querySelector('.slider-container');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let index = 0;
let autoPlayInterval;

// Maak dots aan
slides.forEach((_, i) => {
    const dot = document.createElement("div");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dots div');

// Update slides, dots en achtergrond
function updateUI() {
    slider.style.transform = `translateX(-${index * 100}%)`;

    // Achtergrond van container aanpassen
    const bg = slides[index].style.getPropertyValue('--bg');
    sliderContainer.style.backgroundImage = bg;

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
}


// Volgende / vorige
function next() {
    index = (index + 1) % slides.length;
    updateUI();
}

function prev() {
    index = (index - 1 + slides.length) % slides.length;
    updateUI();
}

function goToSlide(i) {
    index = i;
    updateUI();
}

// Pijlen
document.querySelector('.right').addEventListener('click', next);
document.querySelector('.left').addEventListener('click', prev);

// Auto slide + pauze bij hover
function startAuto() {
    autoPlayInterval = setInterval(next, 4000);
}

function stopAuto() {
    clearInterval(autoPlayInterval);
}

sliderContainer.addEventListener("mouseenter", stopAuto);
sliderContainer.addEventListener("mouseleave", startAuto);

startAuto();

// Touch swipe support
let startX = 0;

slider.addEventListener("touchstart", e => startX = e.touches[0].clientX);
slider.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX < startX - 50) next();
    if (endX > startX + 50) prev();
});

// Init
updateUI();

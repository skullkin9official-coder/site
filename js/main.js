let index = 0;
const duration = 5000;
let animating = false;

const slides = () => document.querySelectorAll('.slide');
const progress = () => document.querySelector('.progress');

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("next")) next();
  if (e.target.classList.contains("prev")) prev();
});

function showSlide(i) {
  if (animating) return;
  animating = true;

  const all = slides();

  all.forEach(s => {
    s.style.transform = "scale(0.92)";
    s.style.opacity = "0";
  });

  const active = all[i];
  active.style.opacity = "1";
  active.style.transform = "scale(1)";
  active.classList.add("active");

  setTimeout(() => animating = false, 600);

  // reset progress animation
  progress().style.width = '0';
  setTimeout(() => progress().style.width = '100%', 50);
}

function next() {
  index = (index + 1) % slides().length;
  showSlide(index);
  resetAuto();
}

function prev() {
  index = (index - 1 + slides().length) % slides().length;
  showSlide(index);
  resetAuto();
}

let auto = setInterval(next, duration);

function resetAuto() {
  clearInterval(auto);
  auto = setInterval(next, duration);
}

setTimeout(() => showSlide(index), 50);

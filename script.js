const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
const bookingForm = document.querySelector("[data-booking-form]");
const revealItems = document.querySelectorAll(".reveal");
const aboutCarousel = document.querySelector("[data-about-carousel]");

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  }
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = bookingForm.querySelector(".form-status");
  status.textContent = "Thank you. Your request is ready to be connected to the booking system.";
  bookingForm.reset();
});

if (aboutCarousel) {
  const slides = [
    { src: "2.jpg", alt: "Soft nude nail design", position: "center 48%" },
    { src: "3.jpg", alt: "Glossy manicure design", position: "center 42%" },
    { src: "4.jpg", alt: "Detailed nail art design", position: "center 46%" },
    { src: "5.jpg", alt: "Elegant nail finish", position: "center 50%" },
    { src: "6.jpg", alt: "Neutral pedicure style", position: "center 58%" },
    { src: "7.jpg", alt: "Soft pedicure nail style", position: "center 58%" },
  ];
  const mainImage = aboutCarousel.querySelector("[data-carousel-main]");
  const thumbs = [...aboutCarousel.querySelectorAll("[data-carousel-thumb]")];
  const prevButton = aboutCarousel.querySelector("[data-carousel-prev]");
  const nextButton = aboutCarousel.querySelector("[data-carousel-next]");
  let currentIndex = 0;
  let autoTimer;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    mainImage.src = slides[currentIndex].src;
    mainImage.alt = slides[currentIndex].alt;
    mainImage.style.objectPosition = slides[currentIndex].position;
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("active", thumbIndex === currentIndex);
      thumb.querySelector("img").style.objectPosition = slides[thumbIndex].position;
    });
  };

  const startAutoPlay = () => {
    window.clearInterval(autoTimer);
    autoTimer = window.setInterval(() => showSlide(currentIndex + 1), 3200);
  };

  prevButton?.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    startAutoPlay();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    startAutoPlay();
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      showSlide(Number(thumb.dataset.carouselThumb));
      startAutoPlay();
    });
  });

  showSlide(0);
  startAutoPlay();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

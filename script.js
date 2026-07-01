const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
const bookingForm = document.querySelector("[data-booking-form]");
const bookingLinks = document.querySelectorAll("[data-booking-link]");
const bookingModal = document.querySelector("[data-booking-modal]");
const bookingGmailLink = document.querySelector("[data-booking-gmail]");
const bookingCloseButtons = document.querySelectorAll("[data-booking-close]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const revealItems = document.querySelectorAll(".reveal");
const aboutCarousel = document.querySelector("[data-about-carousel]");
const bookingEmail = "Uyenle.westlife@gmail.com";
const gmailComposeUrl = "https://mail.google.com/mail/";
let lastFocusedElement;

const createGmailUrl = (body = "") => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: bookingEmail,
    su: "Booking request for E & J Nails",
  });

  if (body) {
    params.set("body", body);
  }

  return `${gmailComposeUrl}?${params.toString()}`;
};

const openBookingModal = (gmailUrl = createGmailUrl()) => {
  if (!bookingModal || !bookingGmailLink) {
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    return;
  }

  lastFocusedElement = document.activeElement;
  bookingGmailLink.href = gmailUrl;
  bookingModal.hidden = false;
  document.body.classList.add("modal-open");
  if (copyStatus) {
    copyStatus.textContent = "";
  }
  bookingGmailLink.focus();
};

const closeBookingModal = () => {
  if (!bookingModal) return;

  bookingModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
};

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

bookingLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openBookingModal(link.href);
  });
});

bookingCloseButtons.forEach((button) => {
  button.addEventListener("click", closeBookingModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !bookingModal?.hidden) {
    closeBookingModal();
  }
});

copyEmailButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(bookingEmail);
    if (copyStatus) {
      copyStatus.textContent = "Email copied.";
    }
  } catch {
    if (copyStatus) {
      copyStatus.textContent = bookingEmail;
    }
  }
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = bookingForm.querySelector(".form-status");
  const formData = new FormData(bookingForm);
  const body = [
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Service: ${formData.get("service")}`,
    `Preferred date: ${formData.get("date")}`,
    `Message: ${formData.get("message") || ""}`,
  ].join("\n");

  openBookingModal(createGmailUrl(body));
  status.textContent = "Tap Open Gmail in the popup to send your booking request.";
  bookingForm.reset();
});

if (aboutCarousel) {
  const slides = [
    { src: "4.jpg", alt: "Detailed nail art design", position: "center 46%" },
    { src: "8.jpg", alt: "Glossy manicure design", position: "center 42%" },
    { src: "9.jpg", alt: "Elegant nail finish", position: "center 50%" },
    { src: "10.jpg", alt: "Neutral pedicure style", position: "center 58%" },
    { src: "11.jpg", alt: "Soft pedicure nail style", position: "center 58%" },
    { src: "21.jpg", alt: "Fresh nail design", position: "center 50%" },
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

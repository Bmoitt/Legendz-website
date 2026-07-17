// ============================
// Shared Footer
// ============================
const footerEl = document.getElementById('site-footer');
if (footerEl) {
  footerEl.innerHTML = `
    <div class="footer-content">
      <div>
        <img src="assets/legendz-logo.png" alt="Legendz logo" class="footer-logo" />
        <p>Caribbean flavors with a Southern twist — on wheels.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="contact.html">Hours &amp; Location</a></li>
          <li><a href="catering.html">Book Catering</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+16789274631">(678) 927-4631</a></li>
          <li><a href="mailto:legendzgrille@gmail.com">legendzgrille@gmail.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; ${new Date().getFullYear()} Legendz. All rights reserved.
    </div>
  `;
}

// ============================
// Mobile Nav Toggle
// ============================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('show'));
  });
}

// ============================
// Catering Form Validation + Submission
// ============================
const cateringForm = document.getElementById('catering-form');

if (cateringForm) {
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('submitBtn');

  const phonePattern = /^[\d\s()+.-]{7,}$/;

  const validators = {
    name: (v) => v.trim().length > 0,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => phonePattern.test(v.trim()),
    event_date: (v) => v.trim().length > 0,
    event_type: (v) => v.trim().length > 0,
    guest_count: (v) => Number(v) > 0,
    location: (v) => v.trim().length > 0,
  };

  const showFieldError = (field, isValid) => {
    const wrapper = field.closest('.field');
    if (!wrapper) return;
    const errorEl = wrapper.querySelector('.field-error');
    field.classList.toggle('invalid', !isValid);
    if (errorEl) errorEl.classList.toggle('show', !isValid);
  };

  const validateForm = () => {
    let allValid = true;
    Object.keys(validators).forEach((name) => {
      const field = cateringForm.elements.namedItem(name);
      if (!field) return;
      const isValid = validators[name](field.value);
      showFieldError(field, isValid);
      if (!isValid) allValid = false;
    });
    return allValid;
  };

  Object.keys(validators).forEach((name) => {
    const field = cateringForm.elements.namedItem(name);
    if (!field) return;
    field.addEventListener('blur', () => showFieldError(field, validators[name](field.value)));
  });

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.className = `show ${type}`;
  };

  cateringForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus('Please fix the highlighted fields before submitting.', 'error');
      return;
    }

    const endpoint = cateringForm.dataset.endpoint;
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      setStatus('Form is not connected yet — set up your Formspree endpoint in catering.html.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(cateringForm),
      });

      if (response.ok) {
        setStatus("Thanks! Your catering request has been sent — we'll be in touch soon.", 'success');
        cateringForm.reset();
      } else {
        setStatus('Something went wrong sending your request. Please try again or call us directly.', 'error');
      }
    } catch (err) {
      setStatus('Network error — please check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Catering Request';
    }
  });
}

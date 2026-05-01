// Inline script for index.html
(function() {
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // e.g. 'xpzgkwvb'
  const PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=com.mfbharat';
  const APPSTORE_LINK = 'https://apps.apple.com/app/mf-bharat';

  const overlay = document.getElementById('leadModal');
  const closeBtn = document.getElementById('leadModalClose');
  const submitBtn = document.getElementById('leadSubmit');
  const formWrap = document.getElementById('leadFormWrap');
  const successWrap = document.getElementById('leadSuccess');
  const errorEl = document.getElementById('leadError');
  const openWABtn = document.getElementById('leadOpenWA');

  let waLink = '';

  // Open modal — attach to ALL CTA buttons
  function openModal() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('leadName').focus();
  }

  // Close modal
  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Reset form
    setTimeout(() => {
      formWrap.style.display = 'block';
      successWrap.style.display = 'none';
      errorEl.textContent = '';
      document.getElementById('leadName').value = '';
      document.getElementById('leadEmail').value = '';
      document.getElementById('leadPhone').value = '';
    }, 300);
  }

  // Attach click to ALL existing download/CTA buttons
  // This replaces href="#download" with modal trigger
  document.querySelectorAll(
    'a[href="#download"], .btn-download, .download-btn, .cta-download, [data-download]'
  ).forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  // Close on X button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submission
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('leadName').value.trim();
      const email = document.getElementById('leadEmail').value.trim();
      const phone = document.getElementById('leadPhone').value.trim().replace(/\s/g, '');
      errorEl.textContent = '';

      // Validate
      if (!name) { errorEl.textContent = 'Please enter your name.'; return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.'; return;
      }
      if (!phone || !/^\d{10}$/.test(phone)) {
        errorEl.textContent = 'Please enter a valid 10-digit WhatsApp number.'; return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Submit to Formspree
      try {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone: `+91${phone}`, source: window.location.pathname })
        });
      } catch (err) {
        // Even if Formspree fails, proceed to WhatsApp — don't block the user
        console.warn('Formspree error:', err);
      }

      // Build WhatsApp deep link
      const msg = encodeURIComponent(
        `Hi ${name}! 👋\n\nHere's your MF Bharat download link:\n\n📱 Android (Play Store):\n${PLAYSTORE_LINK}\n\n🍎 iPhone (App Store):\n${APPSTORE_LINK}\n\nStart SIP from ₹100. SEBI Registered. 🇮🇳`
      );
      waLink = `https://wa.me/91${phone}?text=${msg}`;

      // Pre-fill handoff — KYC page reads these on load
      sessionStorage.setItem('kyc_prefill_phone', phone);
      sessionStorage.setItem('kyc_prefill_email', email);

      // Show success
      formWrap.style.display = 'none';
      successWrap.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send me the link on WhatsApp →';

      // Auto-open WhatsApp on mobile
      if (window.innerWidth < 768) {
        setTimeout(() => { window.open(waLink, '_blank'); }, 600);
      }
    });
  }

  // Manual "Open WhatsApp" button on success screen
  if (openWABtn) {
    openWABtn.addEventListener('click', () => {
      window.open(waLink, '_blank');
    });
  }
})();
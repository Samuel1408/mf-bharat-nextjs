// Shared script for all Learn article pages
(function() {
  const PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=com.mfbharat';
  const APPSTORE_LINK = 'https://apps.apple.com/app/mf-bharat';
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

  const overlay = document.getElementById('leadModal');
  const closeBtn = document.getElementById('leadModalClose');
  const submitBtn = document.getElementById('leadSubmit');
  const formWrap = document.getElementById('leadFormWrap');
  const successWrap = document.getElementById('leadSuccess');
  const errorEl = document.getElementById('leadError');
  const openWABtn = document.getElementById('leadOpenWA');
  let waLink = '';

  function openModal() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const nameInput = document.getElementById('leadName');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (formWrap) formWrap.style.display = 'block';
      if (successWrap) successWrap.style.display = 'none';
      if (errorEl) errorEl.textContent = '';
      ['leadName','leadEmail','leadPhone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 300);
  }

  document.querySelectorAll('.download-trigger, a[href="#download"], [data-download]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = (document.getElementById('leadName') || {}).value?.trim() || '';
      const email = (document.getElementById('leadEmail') || {}).value?.trim() || '';
      const phone = ((document.getElementById('leadPhone') || {}).value || '').trim().replace(/\s/g, '');
      if (errorEl) errorEl.textContent = '';
      if (!name) { if (errorEl) errorEl.textContent = 'Please enter your name.'; return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (errorEl) errorEl.textContent = 'Please enter a valid email.'; return; }
      if (!phone || !/^\d{10}$/.test(phone)) { if (errorEl) errorEl.textContent = 'Please enter a valid 10-digit number.'; return; }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      try {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone: `+91${phone}`, source: window.location.pathname })
        });
      } catch(err) { console.warn('Formspree error:', err); }
      const msg = encodeURIComponent(`Hi ${name}! 👋\n\nHere's your MF Bharat download link:\n\n📱 Android: ${PLAYSTORE_LINK}\n\n🍎 iPhone: ${APPSTORE_LINK}\n\nStart SIP from ₹100. SEBI Registered. 🇮🇳`);
      waLink = `https://wa.me/91${phone}?text=${msg}`;
      if (formWrap) formWrap.style.display = 'none';
      if (successWrap) successWrap.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send me the link on WhatsApp →';
      if (window.innerWidth < 768) setTimeout(() => window.open(waLink, '_blank'), 600);
    });
  }

  if (openWABtn) openWABtn.addEventListener('click', () => window.open(waLink, '_blank'));

  // Tools bottom sheet
  const toolsBtn = document.getElementById('toolsNavBtn');
  const backdrop = document.getElementById('toolsBackdrop');
  const sheet = document.getElementById('toolsSheet');
  function openSheet() { if(sheet) sheet.classList.add('open'); if(backdrop) backdrop.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeSheet() { if(sheet) sheet.classList.remove('open'); if(backdrop) backdrop.classList.remove('open'); document.body.style.overflow=''; }
  if (toolsBtn) toolsBtn.addEventListener('click', openSheet);
  if (backdrop) backdrop.addEventListener('click', closeSheet);
})();

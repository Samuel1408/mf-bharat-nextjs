// Inline script for scheme-sbi-small-cap.html
(function() {
  // -- Per-period chart data ----------------------------------
  const periodData = {
    '1M': {
      labels: ['26 Feb 2024','3 Mar 2024','8 Mar 2024','13 Mar 2024','18 Mar 2024','23 Mar 2024','24 Mar 2024'],
      data:   [160.10, 161.45, 162.80, 161.90, 163.50, 164.80, 165.42],
      change: '+3.32%', date: '26 Feb → 24 Mar 2024 → 1 Month', isPos: true
    },
    '6M': {
      labels: ['Oct 2023','Nov 2023','Dec 2023','Jan 2024','Feb 2024','Mar 2024'],
      data:   [145.20, 148.60, 152.30, 156.80, 161.40, 165.42],
      change: '+13.9%', date: 'Oct 2023 – Mar 2024 – 6 Months', isPos: true
    },
    '1Y': {
      labels: ['Mar 2023','May 2023','Jul 2023','Sep 2023','Nov 2023','Jan 2024','Mar 2024'],
      data:   [120.00, 128.00, 135.00, 132.00, 145.00, 158.00, 165.42],
      change: '+37.9%', date: 'Mar 2023 – Mar 2024 – 1 Year', isPos: true
    },
    '3Y': {
      labels: ['Mar 2021','Sep 2021','Mar 2022','Sep 2022','Mar 2023','Sep 2023','Mar 2024'],
      data:   [85.00, 98.00, 105.00, 118.00, 136.00, 152.00, 165.42],
      change: '+94.6%', date: 'Mar 2021 – Mar 2024 – 3 Years', isPos: true
    },
    '5Y': {
      labels: ['Mar 2019','Mar 2020','Mar 2021','Mar 2022','Mar 2023','Mar 2024'],
      data:   [55.00, 62.00, 85.00, 105.00, 136.00, 165.42],
      change: '+200.8%', date: 'Mar 2019 – Mar 2024 – 5 Years', isPos: true
    }
  };

  // -- Theme-aware axis colours -------------------------------
  function getAxisColors() {
    const theme = localStorage.getItem('mfb-theme') || document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = theme !== 'light';
    return {
      tick: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.55)',
      grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.10)'
    };
  }

  function initChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    function makeGradient() {
      const g = ctx.createLinearGradient(0, 0, 0, 260);
      g.addColorStop(0, 'rgba(56,189,248,0.35)');
      g.addColorStop(1, 'rgba(56,189,248,0)');
      return g;
    }

    // -- NAV display elements -----------------------------------
    const navPriceEl  = document.getElementById('navPrice');
    const navChangeEl = document.getElementById('navChange');
    const navDateEl   = document.getElementById('navDate');

    let activePeriod = '1Y';

    function setNAV(price, change, date, isPos) {
      navPriceEl.textContent  = price;
      navChangeEl.textContent = change;
      navChangeEl.className   = 'nav-change ' + (isPos ? 'pos' : 'neg');
      navDateEl.textContent   = date;
    }

    // -- Hover plugin — updates NAV card on cursor move ---------
    const navHoverPlugin = {
      id: 'navHover',
      afterEvent(chart, args) {
        if (args.event.type !== 'mousemove' && args.event.type !== 'mouseout') return;
        if (args.event.type === 'mouseout') {
          const p = periodData[activePeriod];
          setNAV('₹' + p.data[p.data.length - 1].toFixed(2), p.change, p.date, p.isPos);
          return;
        }
        const pts = chart.getElementsAtEventForMode(args.event.native, 'index', { intersect: false }, true);
        if (!pts.length) return;
        const idx   = pts[0].index;
        const val   = chart.data.datasets[0].data[idx];
        const first = chart.data.datasets[0].data[0];
        const pct   = ((val - first) / first * 100);
        const isPos = pct >= 0;
        setNAV(
          '₹' + val.toFixed(2),
          (isPos ? '+' : '') + pct.toFixed(2) + '%',
          chart.data.labels[idx],
          isPos
        );
      }
    };

    // -- Initial chart ------------------------------------------
    const c = getAxisColors();
    const chart = new Chart(ctx, {
      type: 'line',
      plugins: [navHoverPlugin],
      data: {
        labels: periodData['1Y'].labels,
        datasets: [{
          label: 'NAV',
          data: periodData['1Y'].data,
          borderColor: '#38bdf8',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          backgroundColor: makeGradient(),
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#38bdf8',
          pointHoverBorderWidth: 2.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: c.tick, font: { size: 10, family: 'Plus Jakarta Sans' }, maxRotation: 0 } },
          y: { grid: { color: c.grid }, border: { display: false }, ticks: { color: c.tick, font: { size: 10, family: 'Plus Jakarta Sans' } } }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });

    function applyAxisColors() {
      const col = getAxisColors();
      chart.options.scales.x.ticks.color = col.tick;
      chart.options.scales.y.ticks.color = col.tick;
      chart.options.scales.y.grid.color  = col.grid;
    }

    // -- Period tab switch — exposed globally for onclick="updateChart(...)" in HTML
    window.updateChart = function(period, e) {
      document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      activePeriod = period;
      const p = periodData[period];
      chart.data.labels = p.labels;
      chart.data.datasets[0].data = p.data;
      chart.data.datasets[0].backgroundColor = makeGradient();
      applyAxisColors();
      chart.update('active');
      setNAV('₹' + p.data[p.data.length - 1].toFixed(2), p.change, p.date, p.isPos);
    };

    // -- Re-render axis colours on theme toggle -----------------
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(() => { applyAxisColors(); chart.update(); }, 60);
      });
    }
  }

  // -- Load Chart.js dynamically if not already present -------
  if (typeof Chart !== 'undefined') {
    initChart();
  } else {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.onload = initChart;
    document.head.appendChild(s);
  }
})();

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
        // Even if Formspree fails, proceed to WhatsApp
        console.warn('Formspree error:', err);
      }

      // Build WhatsApp deep link
      const msg = encodeURIComponent(
        `Hi ${name}! 👋\n\nHere's your MF Bharat download link:\n\n📱 Android (Play Store):\n${PLAYSTORE_LINK}\n\n🍎 iPhone (App Store):\n${APPSTORE_LINK}\n\nStart SIP from ₹100. SEBI Registered. 🇮🇳`
      );
      waLink = `https://wa.me/91${phone}?text=${msg}`;

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

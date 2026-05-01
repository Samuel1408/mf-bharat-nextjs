// Cinematic Bento Grid JavaScript — Refined
"use strict";

function mfbInit() {

  // ── Cleanup from previous run (prevents duplicate elements on navigation) ──
  var _oldTicker = document.querySelector('.market-ticker');
  if (_oldTicker) _oldTicker.remove();
  var _oldToast = document.querySelector('.toast-container');
  if (_oldToast) _oldToast.remove();
  // Remove old scroll observer state
  if (window._mfbRevealObs) { window._mfbRevealObs.disconnect(); }
  if (window._mfbCountObs)  { window._mfbCountObs.disconnect(); }
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  // Initialize theme
  const savedTheme = localStorage.getItem("mfb-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  applyLogoTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", nextTheme);
      localStorage.setItem("mfb-theme", nextTheme);
      applyLogoTheme(nextTheme);
    });
  }

  function applyLogoTheme(theme) {
    const logos = document.querySelectorAll('.nav-logo img, .footer-brand .nav-logo img');
    logos.forEach(logo => {
      logo.src = theme === 'dark' ? '/MF Bharat Logo.svg' : '/MF Bharat.png';
    });
  }

  // Custom Cursor — desktop only
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);
  }

  // Magnetic Buttons
  document.querySelectorAll(".mag-btn").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) - rect.width / 2;
      const y = (e.clientY - rect.top) - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Spotlight Hover Tracking
  document.querySelectorAll(".bento-hover").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // Scroll Reveals — animations on desktop (≥901px); content always visible on mobile.
  if (window.innerWidth >= 901) {
    html.classList.add('anim-ready');
  }
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -5% 0px" });
  // Observe all .reveal-up; immediately mark any already in the viewport
  document.querySelectorAll(".reveal-up").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom >= 0) {
      el.classList.add("revealed");
    } else {
      revealObs.observe(el);
    }
  });

  // SIP Bar Animation Trigger
  const sipVisual = document.querySelector(".sip-visual");
  if (sipVisual) {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        sipVisual.classList.add("revealed");
        obs.unobserve(sipVisual);
      }
    }, { threshold: 0.5 }).observe(sipVisual);
  }

  // Count Up Stats
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN').format(Math.round(val));
  const formatLakhsCr = (val, sfx) => val % 1 === 0 ? val + sfx : val.toFixed(1) + sfx;

  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1500;
        const t0 = performance.now();
        
        requestAnimationFrame(function update(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          const current = target * eased;
          
          if(suffix.includes("L") || suffix.includes("Cr")) {
             el.innerText = formatLakhsCr(current, suffix);
          } else {
             el.innerText = formatCurrency(current) + suffix;
          }
          if (p < 1) requestAnimationFrame(update);
          else el.innerText = formatLakhsCr(target, suffix);
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".data-counter").forEach(el => countObs.observe(el));

  // Parallax Float Assets
  const parallaxElements = document.querySelectorAll(".parallax");
  document.addEventListener("mousemove", (e) => {
    if(window.innerWidth < 768) return;
    const x = (e.clientX - window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2);
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed"));
      el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  // Nav Blur & Sticky Footer Dock
  const nav = document.querySelector(".nav");
  const bottomDock = document.querySelector(".bottom-dock");
  const hero = document.getElementById("hero");

  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.style.background = html.getAttribute("data-theme") === "light" ? "rgba(250,250,251,0.5)" : "rgba(0,0,0,0.5)";
        nav.style.borderBottom = "1px solid " + (html.getAttribute("data-theme") === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)");
      } else {
        nav.style.background = "transparent";
        nav.style.borderBottom = "1px solid transparent";
      }
    });
  }

  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && bottomDock) bottomDock.classList.add("visible");
      else if (bottomDock) bottomDock.classList.remove("visible");
    }, { threshold: 0.1 }).observe(hero);
  }

  // --- Calculator Logic ---
  // ========== SIP CALCULATOR ==========
  const rngInv = document.getElementById("rngInv");
  if (rngInv) {
    const calcTabs = document.querySelectorAll(".calc-tab");
    // Read active tab from HTML so each calculator page initializes correctly
    const activeTab = document.querySelector(".calc-tab.active");
    let calcType = activeTab ? (activeTab.getAttribute("data-type") || "sip") : "sip";
    let sipFreq = "monthly"; // tracks daily | monthly | yearly for SIP tab
    const rngRet = document.getElementById("rngRet");
    const rngYrs = document.getElementById("rngYrs");
    const rngExtra = document.getElementById("rngExtra");
    const extraSliderGroup = document.getElementById("extraSliderGroup");
    const lblExtra = document.getElementById("lblExtra");
    
    // CHANGE 13: typed number inputs (replace old span displays)
    const numInv   = document.getElementById("numInv");
    const numRet   = document.getElementById("numRet");
    const numYrs   = document.getElementById("numYrs");
    const numExtra = document.getElementById("numExtra");
    
    const outInvested = document.getElementById("outInvested");
    const outReturns = document.getElementById("outReturns");
    const outTotal = document.getElementById("outTotal");
    let currentTotalWealth = 0;

    function countUpValue(el, start, end, dur = 400) {
      const t0 = performance.now();
      requestAnimationFrame(function animate(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const current = start + (end - start) * ease;
        el.innerText = "₹" + formatCurrency(current);
        if (p < 1) requestAnimationFrame(animate);
      });
    }

    function calculate() {
      const p = parseFloat(rngInv.value);
      const rAnn = parseFloat(rngRet.value);
      const y = parseFloat(rngYrs.value);
      const extra = parseFloat(rngExtra.value);
      let invested = 0, total = 0;

      if (calcType === "sip") {
        let i, n;
        if (sipFreq === "daily") {
          i = rAnn / 365 / 100;
          n = y * 365;
        } else if (sipFreq === "yearly") {
          i = rAnn / 100;
          n = y;
        } else { // monthly (default)
          i = rAnn / 12 / 100;
          n = y * 12;
        }
        invested = p * n;
        total = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      } else if (calcType === "lumpsum") {
        invested = p;
        const i = rAnn / 100;
        total = p * Math.pow(1 + i, y);
      } else if (calcType === "stepup") {
        // Step-up SIP logic: SIP increases by 'extra' % every year
        let currentSIP = p;
        const i = rAnn / 12 / 100;
        total = 0;
        invested = 0;
        for (let year = 1; year <= y; year++) {
          for (let month = 1; month <= 12; month++) {
            invested += currentSIP;
            total = (total + currentSIP) * (1 + i);
          }
          currentSIP = currentSIP * (1 + extra / 100);
        }
      } else if (calcType === "swp") {
        // SWP Logic: p = initial investment, extra = monthly withdrawal
        invested = p;
        const i = rAnn / 12 / 100;
        total = p;
        let totalWithdrawn = 0;
        const months = y * 12;
        for (let m = 1; m <= months; m++) {
          total = total * (1 + i);
          const withdrawal = Math.min(total, extra);
          total -= withdrawal;
          totalWithdrawn += withdrawal;
        }
        // For SWP, we show "Total Withdrawal" instead of "Invested" if we want, 
        // but let's keep it consistent: outInvested = Initial, outReturns = Final Balance - Initial + Withdrawals?
        // Actually, it's clearer if: outInvested = Initial, outReturns = Total Withdrawn, outTotal = Final Balance
        if (outInvested && outInvested.previousElementSibling) outInvested.previousElementSibling.innerText = "Initial Investment";
        if (outReturns && outReturns.previousElementSibling) outReturns.previousElementSibling.innerText = "Total Withdrawal";
        if (outTotal && outTotal.previousElementSibling) outTotal.previousElementSibling.innerText = "Final Balance";
        if (outTotal) countUpValue(outTotal, currentTotalWealth, total, 400);
        currentTotalWealth = total;
        if (outInvested) outInvested.innerText = "₹" + formatCurrency(invested);
        if (outReturns) outReturns.innerText = "₹" + formatCurrency(totalWithdrawn);
        return;
      }

      // Reset labels for SIP/Lumpsum/Stepup
      if (outInvested && outInvested.previousElementSibling) outInvested.previousElementSibling.innerText = "Total Invested";
      if (outReturns && outReturns.previousElementSibling) outReturns.previousElementSibling.innerText = "Est. Returns";
      if (outTotal && outTotal.previousElementSibling) outTotal.previousElementSibling.innerText = "Total Wealth";

      const returns = total - invested;
      if (outTotal) countUpValue(outTotal, currentTotalWealth, total, 400);
      currentTotalWealth = total;
      if (outInvested) outInvested.innerText = "₹" + formatCurrency(invested);
      if (outReturns) outReturns.innerText = "₹" + formatCurrency(returns);
    }

    // CHANGE 13: sync sliders → typed inputs
    function updateLabels() {
      if (numInv)   numInv.value   = rngInv.value;
      if (numRet)   numRet.value   = rngRet.value;
      if (numYrs)   numYrs.value   = rngYrs.value;
      if (numExtra) numExtra.value = rngExtra.value;
      calculate();
    }

    // CHANGE 13: sync typed input → slider (clamp to slider min/max)
    function syncInput(input, slider) {
      if (!input || !slider) return;
      const clampAndApply = () => {
        let v = parseFloat(input.value);
        if (isNaN(v)) return;
        const mn = parseFloat(slider.min), mx = parseFloat(slider.max);
        v = Math.max(mn, Math.min(mx, v));
        slider.value = v;
        input.value  = v;
        calculate();
      };
      input.addEventListener('input', clampAndApply);
      input.addEventListener('blur',  clampAndApply);
    }

    // Helper: propagate slider min/max/step to number input element
    function applySliderBounds(slider, input) {
      if (!input) return;
      input.min = slider.min; input.max = slider.max; input.step = slider.step;
    }

    syncInput(numInv,   rngInv);
    syncInput(numRet,   rngRet);
    syncInput(numYrs,   rngYrs);
    syncInput(numExtra, rngExtra);

    // Frequency toggle for SIP tab
    const freqToggle = document.getElementById("freqToggle");
    const freqPills  = document.querySelectorAll(".freq-pill");
    function setFreqToggleVisible(visible) {
      if (freqToggle) freqToggle.style.display = visible ? "flex" : "none";
    }
    freqPills.forEach(btn => {
      btn.addEventListener("click", () => {
        freqPills.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        sipFreq = btn.dataset.freq;
        calculate();
      });
    });

    // Bind sliders → updateLabels (keeps inputs in sync when slider drags)
    [rngInv, rngRet, rngYrs, rngExtra].forEach(el => el && el.addEventListener("input", updateLabels));

    // Bind Tabs
    calcTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        calcTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        calcType = tab.getAttribute("data-type");
        
        // Dynamic UI adjustment
        setFreqToggleVisible(calcType === "sip");
        if(calcType === "lumpsum") {
           extraSliderGroup.style.display = "none";
           rngInv.min = 5000; rngInv.max = 5000000; rngInv.step = 5000;
           if(rngInv.value < 50000) rngInv.value = 100000;
           applySliderBounds(rngInv, numInv);
        } else if (calcType === "sip") {
           extraSliderGroup.style.display = "none";
           rngInv.min = 100; rngInv.max = 100000; rngInv.step = 100;
           if(rngInv.value > 100000) rngInv.value = 1000;
           applySliderBounds(rngInv, numInv);
        } else if (calcType === "stepup") {
           extraSliderGroup.style.display = "block";
           lblExtra.innerText = "Annual Step-up (%)";
           rngExtra.min = 1; rngExtra.max = 50; rngExtra.step = 1; rngExtra.value = 10;
           rngInv.min = 100; rngInv.max = 100000; rngInv.step = 100;
           if(rngInv.value > 100000) rngInv.value = 1000;
           applySliderBounds(rngInv, numInv);
           applySliderBounds(rngExtra, numExtra);
        } else if (calcType === "swp") {
           extraSliderGroup.style.display = "block";
           lblExtra.innerText = "Monthly Withdrawal (₹)";
           rngInv.min = 50000; rngInv.max = 10000000; rngInv.step = 10000;
           if(rngInv.value < 100000) rngInv.value = 500000;
           rngExtra.min = 500; rngExtra.max = 100000; rngExtra.step = 500; rngExtra.value = 5000;
           applySliderBounds(rngInv, numInv);
           applySliderBounds(rngExtra, numExtra);
        }
        updateLabels();
      });
    });

    // Apply correct initial UI state based on active tab
    setFreqToggleVisible(calcType === "sip");
    if (calcType === "lumpsum") {
      if (extraSliderGroup) extraSliderGroup.style.display = "none";
      rngInv.min = 5000; rngInv.max = 5000000; rngInv.step = 5000;
      if (parseFloat(rngInv.value) < 50000) rngInv.value = 100000;
      applySliderBounds(rngInv, numInv);
    } else if (calcType === "stepup") {
      if (extraSliderGroup) extraSliderGroup.style.display = "block";
      if (lblExtra) lblExtra.innerText = "Annual Step-up (%)";
      if (rngExtra) { rngExtra.min = 1; rngExtra.max = 50; rngExtra.step = 1; rngExtra.value = 10; applySliderBounds(rngExtra, numExtra); }
    } else if (calcType === "swp") {
      if (extraSliderGroup) extraSliderGroup.style.display = "block";
      if (lblExtra) lblExtra.innerText = "Monthly Withdrawal (₹)";
      rngInv.min = 50000; rngInv.max = 10000000; rngInv.step = 10000;
      if (parseFloat(rngInv.value) < 100000) rngInv.value = 500000;
      if (rngExtra) { rngExtra.min = 500; rngExtra.max = 100000; rngExtra.step = 500; rngExtra.value = 5000; applySliderBounds(rngExtra, numExtra); }
      applySliderBounds(rngInv, numInv);
    }
    // Initial Calc
    updateLabels();
  }

  // ========== EXPLORE PAGE FILTER & SEARCH ==========
  const fundSearch = document.getElementById('fundSearch');
  const filterChips = document.querySelectorAll('.filter-chip');
  // Use a more resilient selector that ignores DOM whitespace/comments
  const fundCards = document.querySelectorAll('.bento-section .bento-card'); 

  if (fundSearch && filterChips.length > 0 && fundCards.length > 0) {
    let activeFilter = 'all';

    const filterFunds = () => {
      // Split the search query into independent keywords to simultaneously match "Fund Name" and "AMC Name" disjointedly
      const queryWords = fundSearch.value.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
      
      fundCards.forEach(card => {
        // Collect all text from inside the card (which naturally includes the Fund Title, Description, and Returns)
        const text = card.textContent.toLowerCase();
        
        let matchesSearch = true;
        if (queryWords.length > 0) {
          // EVERY word typed in the exact query must exist SOMEWHERE within the card's text payload
          matchesSearch = queryWords.every(word => text.includes(word));
        }
        
        // For NFOs, this will match status badges like "NOW OPEN", "UPCOMING", etc.
        const matchesChip = activeFilter === 'all' || text.includes(activeFilter);

        if(matchesSearch && matchesChip) {
          // Setting display to empty string perfectly resolves to the native CSS architecture (display: flex)
          card.style.display = '';
          card.style.animation = 'none';
          card.offsetHeight; // Force invisible DOM reflow
          card.style.animation = null; 
        } else {
          // Inline hide overriding the CSS sheet
          card.style.display = 'none';
        }
      });
    };

    // Bind multiple events to guarantee firing across all desktop/mobile keyboards and autocomplete injections
    ['input', 'keyup', 'change', 'paste', 'search'].forEach(evt => {
      fundSearch.addEventListener(evt, () => {
        filterFunds();
        // Give visual feedback by auto-scrolling to the grid just like the tags do
        const gridSection = document.querySelector('.bento-section');
        if (gridSection && window.scrollY < gridSection.offsetTop - 200 && fundSearch.value.trim().length > 0) {
           window.scrollTo({ top: gridSection.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter').toLowerCase();
        filterFunds(); // Trigger recalculation
        
        // Auto-Scroll Logic so the user seamlessly sees the funds below
        const gridSection = document.querySelector('.bento-section');
        if (gridSection && window.scrollY < gridSection.offsetTop - 200) {
           window.scrollTo({ top: gridSection.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });
  }

  // ========== COMPARE FUNDS LOGIC ==========
  const compareChecks = document.querySelectorAll('.compare-check');
  const compareTray = document.getElementById('compareTray');
  const compareCount = document.getElementById('compareCount');
  const selectedFundsList = document.getElementById('selectedFundsList');
  const clearCompare = document.getElementById('clearCompare');
  const compareNowBtn = document.getElementById('compareNowBtn');
  const compareModal = document.getElementById('compareModal');
  const comparisonGrid = document.getElementById('comparisonGrid');
  const closeCompareModal = document.getElementById('closeCompareModal');

  let selectedFunds = [];

  // Mock Data for Comparison
  const fundData = {
    'ppfc':        { name: 'Parag Parikh Flexi Cap',      amc: 'PPFAS',         category: 'Flexi Cap',        exp: '0.70%', ret1y: '28.4%', ret3y: '21.4%', ret5y: '19.8%', risk: 'Very High', exit: '1% if < 365d',  aum: '49k Cr'  },
    'sbism':       { name: 'SBI Small Cap Fund',           amc: 'SBI',           category: 'Small Cap',        exp: '0.68%', ret1y: '32.1%', ret3y: '26.8%', ret5y: '24.2%', risk: 'Very High', exit: '1% if < 1y',    aum: '21k Cr'  },
    'hdfcix':      { name: 'HDFC Index Fund',              amc: 'HDFC',          category: 'Index',            exp: '0.20%', ret1y: '18.5%', ret3y: '16.1%', ret5y: '15.4%', risk: 'High',      exit: '0.25% if < 3d', aum: '12k Cr'  },
    'nipsmcap':    { name: 'Nippon India Small Cap',       amc: 'Nippon India',  category: 'Small Cap',        exp: '0.74%', ret1y: '35.6%', ret3y: '28.4%', ret5y: '26.1%', risk: 'Very High', exit: '1% if < 1y',    aum: '42k Cr'  },
    'iciciptech':  { name: 'ICICI Pru Tech Fund',          amc: 'ICICI Pru',     category: 'Sectoral/IT',      exp: '1.12%', ret1y: '41.2%', ret3y: '22.8%', ret5y: '27.4%', risk: 'Very High', exit: '1% if < 15d',   aum: '11k Cr'  },
    'qntact':      { name: 'Quant Active Fund',            amc: 'Quant',         category: 'Multi Cap',        exp: '0.58%', ret1y: '44.8%', ret3y: '31.5%', ret5y: '32.6%', risk: 'Very High', exit: '1% if < 1y',    aum: '5.8k Cr' },
    'motmid':      { name: 'Motilal Oswal Midcap',         amc: 'Motilal Oswal', category: 'Mid Cap',          exp: '0.66%', ret1y: '52.3%', ret3y: '29.7%', ret5y: '24.8%', risk: 'Very High', exit: '1% if < 1y',    aum: '14k Cr'  },
    'tatdig':      { name: 'Tata Digital India',           amc: 'Tata',          category: 'Sectoral/IT',      exp: '0.35%', ret1y: '38.9%', ret3y: '19.5%', ret5y: '25.3%', risk: 'Very High', exit: 'Nil',           aum: '8.5k Cr' },
    'utinifty':    { name: 'UTI Nifty 50 Index',           amc: 'UTI',           category: 'Index',            exp: '0.20%', ret1y: '17.8%', ret3y: '15.4%', ret5y: '14.9%', risk: 'High',      exit: '0.25% if < 3d', aum: '16k Cr'  },
    'axissmcap':   { name: 'Axis Small Cap',               amc: 'Axis',          category: 'Small Cap',        exp: '0.54%', ret1y: '29.4%', ret3y: '22.1%', ret5y: '22.7%', risk: 'Very High', exit: '1% if < 1y',    aum: '19k Cr'  },
    'kotemrg':     { name: 'Kotak Emerging Equity',        amc: 'Kotak',         category: 'Mid Cap',          exp: '0.45%', ret1y: '38.5%', ret3y: '24.6%', ret5y: '21.9%', risk: 'Very High', exit: '1% if < 1y',    aum: '37k Cr'  },
    'canaroblue':  { name: 'Canara Robeco Bluechip',       amc: 'Canara Robeco', category: 'Large Cap',        exp: '0.44%', ret1y: '22.6%', ret3y: '17.8%', ret5y: '18.4%', risk: 'High',      exit: '1% if < 1y',    aum: '12k Cr'  },
    'hdfcflexi':   { name: 'HDFC Flexi Cap',               amc: 'HDFC',          category: 'Flexi Cap',        exp: '0.75%', ret1y: '31.4%', ret3y: '23.9%', ret5y: '20.6%', risk: 'Very High', exit: '1% if < 1y',    aum: '45k Cr'  },
    'sbifocus':    { name: 'SBI Focused Equity',           amc: 'SBI',           category: 'Focused',          exp: '0.84%', ret1y: '26.7%', ret3y: '18.3%', ret5y: '17.6%', risk: 'Very High', exit: '1% if < 1y',    aum: '26k Cr'  },
    'dspmid':      { name: 'DSP Midcap Fund',              amc: 'DSP',           category: 'Mid Cap',          exp: '0.73%', ret1y: '34.8%', ret3y: '21.7%', ret5y: '20.4%', risk: 'Very High', exit: '1% if < 1y',    aum: '17k Cr'  },
    'miraetax':    { name: 'Mirae Asset Tax Saver',        amc: 'Mirae Asset',   category: 'ELSS',             exp: '0.50%', ret1y: '23.5%', ret3y: '16.9%', ret5y: '17.2%', risk: 'Very High', exit: '3y lock-in',    aum: '22k Cr'  },
    'edelbal':     { name: 'Edelweiss Balanced Advantage', amc: 'Edelweiss',     category: 'Balanced Adv.',    exp: '0.42%', ret1y: '16.2%', ret3y: '13.4%', ret5y: '14.1%', risk: 'Moderate',  exit: '1% if < 1y',    aum: '8.8k Cr' },
    'invescogrow': { name: 'Invesco India Growth',         amc: 'Invesco',       category: 'Large & Mid Cap',  exp: '0.61%', ret1y: '30.1%', ret3y: '20.5%', ret5y: '18.9%', risk: 'Very High', exit: '1% if < 1y',    aum: '5.2k Cr' },
    'bandhval':    { name: 'Bandhan Sterling Value',       amc: 'Bandhan',       category: 'Value',            exp: '0.68%', ret1y: '42.7%', ret3y: '27.3%', ret5y: '23.5%', risk: 'Very High', exit: '1% if < 1y',    aum: '7.1k Cr' },
    'mahinmulti':  { name: 'Mahindra Manulife Multi Cap',  amc: 'Mahindra MF',   category: 'Multi Cap',        exp: '0.55%', ret1y: '36.4%', ret3y: '24.8%', ret5y: '21.7%', risk: 'Very High', exit: '1% if < 1y',    aum: '3.9k Cr' },
  };

  const updateTray = () => {
    if (!compareTray || !compareCount || !selectedFundsList) return;
    if (selectedFunds.length > 0) {
      compareTray.classList.add('visible');
      compareCount.innerText = `${selectedFunds.length}/3`;
      selectedFundsList.innerHTML = selectedFunds.map(f => `
        <div class="selected-fund-item">
          <span>${f.name}</span>
          <span class="remove-fund" data-id="${f.id}">×</span>
        </div>
      `).join('');
      
      // Bind remove buttons
      document.querySelectorAll('.remove-fund').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          selectedFunds = selectedFunds.filter(f => f.id !== id);
          const checkbox = document.querySelector(`.compare-check[data-id="${id}"]`);
          if (checkbox) {
            checkbox.checked = false;
            const toggle = checkbox.closest('.cmp-toggle');
            if (toggle) toggle.classList.remove('checked');
          }
          updateTray();
        });
      });
    } else {
      compareTray.classList.remove('visible');
    }
  };

  compareChecks.forEach(check => {
    check.addEventListener('change', () => {
      const fundId = check.getAttribute('data-id');
      const fundName = check.getAttribute('data-name');
      const fundImg = check.getAttribute('data-img');
      const toggle = check.closest('.cmp-toggle');

      if (check.checked) {
        if (selectedFunds.length >= 3) {
          alert("You can compare maximum 3 funds.");
          check.checked = false;
          return;
        }
        selectedFunds.push({ id: fundId, name: fundName, img: fundImg });
        if (toggle) toggle.classList.add('checked');
      } else {
        selectedFunds = selectedFunds.filter(f => f.id !== fundId);
        if (toggle) toggle.classList.remove('checked');
      }
      updateTray();
    });
  });

  clearCompare && clearCompare.addEventListener('click', () => {
    selectedFunds = [];
    compareChecks.forEach(c => {
      c.checked = false;
      const toggle = c.closest('.cmp-toggle');
      if (toggle) toggle.classList.remove('checked');
    });
    updateTray();
  });

  const renderComparison = () => {
    if (selectedFunds.length < 2) {
      alert("Select at least 2 funds to compare.");
      return;
    }

    const metrics = [
      { key: 'category', label: 'Category' },
      { key: 'risk', label: 'Risk Profile' },
      { key: 'ret1y', label: '1Y Return' },
      { key: 'ret3y', label: '3Y Return' },
      { key: 'ret5y', label: '5Y Return' },
      { key: 'exp', label: 'Expense Ratio' },
      { key: 'exit', label: 'Exit Load' },
      { key: 'aum', label: 'AUM (Fund Size)' }
    ];

    let html = `<table class="comparison-table"><thead><tr><th>Metrics</th>`;
    selectedFunds.forEach(f => {
      html += `
        <th>
          <div class="fund-header-cell">
            <img src="${f.img}" alt="${f.name}">
            <span>${f.name}</span>
          </div>
        </th>`;
    });
    html += `</tr></thead><tbody>`;

    metrics.forEach(m => {
      html += `<tr><th>${m.label}</th>`;
      selectedFunds.forEach(f => {
        const val = fundData[f.id] ? fundData[f.id][m.key] : 'N/A';
        html += `<td>${val}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    if (comparisonGrid) comparisonGrid.innerHTML = html;
    if (compareModal) { compareModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };

  compareNowBtn && compareNowBtn.addEventListener('click', renderComparison);

  const closeModal = () => {
    if (compareModal) compareModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeCompareModal && closeCompareModal.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ============================================================
  //  INTERACTIONS v2
  // ============================================================

  // 1. SCROLL PROGRESS BAR
  const scrollBar = document.createElement('div');
  scrollBar.id = 'scrollProgress';
  document.body.prepend(scrollBar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scrollBar.style.width = (Math.min(pct, 1) * 100) + '%';
  }, { passive: true });

  // 2. 3D CARD TILT — removed per user preference

  // 3. BUTTON RIPPLE
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // 4. SOCIAL PROOF TOASTS
  const toastData = [
    { name: 'Rahul',  city: 'Delhi',     action: 'started SIP of ₹500',   fund: 'Parag Parikh Flexi Cap' },
    { name: 'Priya',  city: 'Mumbai',    action: 'invested ₹2,000',        fund: 'SBI Small Cap Fund' },
    { name: 'Arjun',  city: 'Bangalore', action: 'started SIP of ₹1,000', fund: 'HDFC Index Fund' },
    { name: 'Neha',   city: 'Pune',      action: 'invested ₹5,000',        fund: 'Mirae Asset Tax Saver' },
    { name: 'Suresh', city: 'Chennai',   action: 'started SIP of ₹300',   fund: 'Axis Bluechip Fund' },
    { name: 'Kavita', city: 'Hyderabad', action: 'invested ₹1,500',        fund: 'Nippon India Small Cap' },
    { name: 'Amit',   city: 'Jaipur',    action: 'started SIP of ₹750',   fund: 'ICICI Pru Value Discovery' },
    { name: 'Deepa',  city: 'Kolkata',   action: 'invested ₹3,000',        fund: 'Kotak Flexi Cap' },
    { name: 'Vikram', city: 'Ahmedabad', action: 'started SIP of ₹2,000', fund: 'Quant Small Cap Fund' },
    { name: 'Ananya', city: 'Lucknow',   action: 'invested ₹1,000',        fund: 'DSP Midcap Fund' },
  ];

  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  let toastIdx = Math.floor(Math.random() * toastData.length);

  // CHANGE 3: only show toasts while hero section is in viewport
  let heroInView = !!hero; // true if hero exists (homepage)
  if (hero) {
    new IntersectionObserver(([entry]) => {
      heroInView = entry.isIntersecting;
    }, { threshold: 0.1 }).observe(hero);
  }

  function showToast() {
    if (!heroInView) return; // CHANGE 3: hero-only
    // CHANGE 3: only one toast at a time — clear previous
    toastContainer.innerHTML = '';

    const msg = toastData[toastIdx % toastData.length];
    toastIdx++;
    const toast = document.createElement('div');
    toast.className = 'social-toast';
    toast.innerHTML = `
      <div class="toast-avatar">${msg.name[0]}</div>
      <div class="toast-body">
        <div class="toast-name">${msg.name} · ${msg.city}</div>
        <div class="toast-action">${msg.action} in <strong>${msg.fund}</strong></div>
      </div>
      <div class="toast-time">just now</div>
    `;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('visible'));
    });
    // CHANGE 3: auto-dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 4000);
  }

  // CHANGE 3: 3 second initial delay (was 4s), then every 11s
  if (hero) {
    setTimeout(() => {
      showToast();
      setInterval(showToast, 11000);
    }, 3000);
  }


  // 6. LIVE MARKET TICKER (hero page only)
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const tickerData = [
      { label: 'NIFTY 50',  value: 22419.95, change: +0.34 },
      { label: 'SENSEX',    value: 73667.96, change: +0.28 },
      { label: 'NIFTY MF',  value: 8214.40,  change: +1.12 },
    ];

    const tickerEl = document.createElement('div');
    tickerEl.className = 'market-ticker reveal-up';
    tickerEl.style.setProperty('--delay', '0.35s');

    function renderTicker() {
      tickerEl.innerHTML = tickerData.map(item => {
        const isPos = item.change >= 0;
        return `
          <div class="ticker-item">
            <span class="ticker-dot"></span>
            <span class="ticker-label">${item.label}</span>
            <span class="ticker-val">${item.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="ticker-change ${isPos ? 'pos' : 'neg'}">${isPos ? '▲' : '▼'} ${Math.abs(item.change).toFixed(2)}%</span>
          </div>
        `;
      }).join('');
    }
    renderTicker();

    // Insert before floating-assets (or append if not found)
    const floatingAssets = heroContent.querySelector('.floating-assets');
    if (floatingAssets) {
      heroContent.insertBefore(tickerEl, floatingAssets);
    } else {
      heroContent.appendChild(tickerEl);
    }

    // Observe reveal
    revealObs.observe(tickerEl);

    // Simulate live ticks every 3.5s
    setInterval(() => {
      tickerData.forEach(item => {
        const nudge = (Math.random() - 0.48) * 0.04; // slight upward bias
        item.value = Math.max(100, item.value * (1 + nudge / 100));
        item.change = parseFloat((item.change + (Math.random() - 0.5) * 0.06).toFixed(2));
      });
      renderTicker();
    }, 3500);
  }

  // CHANGE 9: FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });

  // ── Tools Bottom Sheet ─────────────────────────────────────────
  const toolsBtn      = document.getElementById('toolsNavBtn');
  const toolsSheet    = document.getElementById('toolsSheet');
  const toolsBackdrop = document.getElementById('toolsBackdrop');
  if (toolsBtn && toolsSheet) {
    function openToolsSheet() {
      toolsSheet.classList.add('open');
      toolsBackdrop.classList.add('open');
      toolsBtn.classList.add('active');
    }
    function closeToolsSheet() {
      toolsSheet.classList.remove('open');
      toolsBackdrop.classList.remove('open');
      toolsBtn.classList.remove('active');
    }
    toolsBtn.addEventListener('click', () =>
      toolsSheet.classList.contains('open') ? closeToolsSheet() : openToolsSheet()
    );
    toolsBackdrop.addEventListener('click', closeToolsSheet);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeToolsSheet(); });
  }

  // ── Steps Slider ───────────────────────────────────────────────
  (function initStepsSlider() {
    const slides   = document.querySelectorAll('.step-slide');
    const screens  = document.querySelectorAll('.phone-screen');
    const dots     = document.querySelectorAll('.steps-dot');
    const tabs     = document.querySelectorAll('.step-tab');
    const prevBtn  = document.getElementById('stepPrev');
    const nextBtn  = document.getElementById('stepNext');
    const autoLabel = document.getElementById('stepsAutoplayLabel');
    const autoText  = document.getElementById('stepsAutoplayText');
    if (!slides.length) return;

    let current = 0;
    let isPlaying = true;
    let timer = null;
    const DELAY = 4000;

    function goTo(idx) {
      slides[current].classList.remove('active');
      screens[current].classList.remove('active');
      dots[current].classList.remove('active');
      if (tabs[current]) tabs[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      screens[current].classList.add('active');
      dots[current].classList.add('active');
      if (tabs[current]) tabs[current].classList.add('active');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), DELAY);
      isPlaying = true;
      if (autoLabel && autoText) { autoText.textContent = 'Auto-playing'; const ic = autoLabel.querySelector('.steps-autoplay-icon'); if(ic) ic.textContent = '⏸'; }
    }

    function stopAuto() {
      clearInterval(timer);
      isPlaying = false;
      if (autoLabel && autoText) { autoText.textContent = 'Paused'; const ic = autoLabel.querySelector('.steps-autoplay-icon'); if(ic) ic.textContent = '▶'; }
    }

    startAuto();

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); });

    dots.forEach(dot => dot.addEventListener('click', () => {
      stopAuto(); goTo(+dot.dataset.dot);
    }));

    tabs.forEach(tab => tab.addEventListener('click', () => {
      stopAuto(); goTo(+tab.dataset.dot);
    }));

    if (autoLabel) autoLabel.addEventListener('click', () => isPlaying ? stopAuto() : startAuto());
  })();


}

// ── Next.js compatibility ────────────────────────────────────────
// Expose mfbInit globally so ClientInit.tsx can call it on each page mount.
// Do NOT auto-call here — ClientInit handles the timing.
if (typeof window !== 'undefined') {
  window.mfbInit = mfbInit;
}

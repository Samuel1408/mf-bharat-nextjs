// Inline script for kyc.html
(function(){
  // Clean up any previous instance (re-mount) to prevent duplicate listeners
  if (typeof window._kycTeardown === 'function') { window._kycTeardown(); }

  /* ══════════════════════════════════════
     STATE — now 8 steps (old step 3 removed)
  ══════════════════════════════════════ */
  var KYC = {step:1,phone:'',email:'',name:'',pan:'',dobD:'',dobM:'',dobY:'',income:'',isResident:false,hasConsent:false,bankLinked:false,photoDataUrl:null};

  // Maps display step → sidebar group (7 sidebar items for 8 steps)
  // Step 1→1, 2→2, 3→3, 4→3, 5→4, 6→5, 7→6, 8→7
  var SMAP    = {1:1, 2:2, 3:3, 4:3, 5:4, 6:5, 7:6, 8:7};
  var SLABELS = ['Contact Details','OTP Verify','Identity & PAN','PAN Verify','Bank Account','Nominee','Face & Done'];
  var SSUBS   = ['Phone & email','6-digit OTP','Aadhaar KYC','NSDL check','Auto-debit setup','SEBI required','Selfie + complete'];
  var SMOB    = ['Contact','OTP','KYC','Verify','Bank','Nominee','Face'];
  var STITLES = ['','Enter your details','Confirm your identity','PAN & personal info','Verifying your details','Link your bank','Add a nominee','Face verification','KYC Complete!'];
  // Named stage labels for topbar sub text
  var SSTAGE  = ['','Contact','OTP','KYC Info','Verification','Bank','Nominee','Face Check','Done'];
  var SICONS  = [
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
  ];

  var vTimers = [];
  var camStream = null;
  var otpTimers = {phone:null, email:null};

  /* ══════════════════════════════════════
     URL ROUTING — step + theme params
  ══════════════════════════════════════ */
  var STEP_TITLES = [
    '',
    'Step 1: Contact Details — MF Bharat KYC',
    'Step 2: OTP Verification — MF Bharat KYC',
    'Step 3: PAN & Identity — MF Bharat KYC',
    'Step 4: Verifying Details — MF Bharat KYC',
    'Step 5: Link Bank Account — MF Bharat KYC',
    'Step 6: Add Nominee — MF Bharat KYC',
    'Step 7: Face Verification — MF Bharat KYC',
    'KYC Complete — MF Bharat'
  ];
  var STEP_DESCS = [
    '',
    'Start your MF Bharat KYC — enter your phone and email. Takes 60 seconds. 100% paperless, SEBI registered.',
    'Verify your phone and email with a 6-digit OTP to confirm your identity on MF Bharat.',
    'Enter your PAN number and personal details for KYC verification on MF Bharat. Paperless, instant.',
    'MF Bharat is verifying your PAN and Aadhaar details with NSDL & UIDAI.',
    'Link your bank account for SIP auto-debit and redemptions on MF Bharat.',
    'Add a nominee as required by SEBI guidelines for your MF Bharat investment account.',
    'Complete face verification with a selfie to finish your MF Bharat KYC.',
    'Your MF Bharat KYC is complete. Download the app and start investing from ₹100/month.'
  ];

  function updateUrl(step, replace){
    try {
      var params = new URLSearchParams(window.location.search);
      params.set('step', step);
      var theme = document.documentElement.getAttribute('data-theme') || 'light';
      params.set('theme', theme);
      var newUrl = window.location.pathname + '?' + params.toString();
      if(replace){ history.replaceState({step:step}, '', newUrl); }
      else        { history.pushState({step:step}, '', newUrl);   }
      document.title = STEP_TITLES[step] || 'Complete KYC — MF Bharat';
      var md = document.querySelector('meta[name="description"]');
      if(md && STEP_DESCS[step]) md.setAttribute('content', STEP_DESCS[step]);
    } catch(e){}
  }

  /* ══════════════════════════════════════
     SESSION PERSISTENCE
  ══════════════════════════════════════ */
  var SESSION_KEY = 'kyc_session_v1';

  function saveSession(){
    try {
      var data = {
        step: KYC.step,
        phone: KYC.phone,
        email: KYC.email,
        name: KYC.name,
        pan: KYC.pan,
        dobD: KYC.dobD,
        dobM: KYC.dobM,
        dobY: KYC.dobY,
        income: KYC.income
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch(e){}
  }

  function loadSession(){
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if(!raw) return null;
      return JSON.parse(raw);
    } catch(e){ return null; }
  }

  function clearSession(){
    try { sessionStorage.removeItem(SESSION_KEY); } catch(e){}
  }

  function restoreSession(data){
    KYC.phone = data.phone || '';
    KYC.email = data.email || '';
    KYC.name  = data.name  || '';
    KYC.pan   = data.pan   || '';
    KYC.dobD  = data.dobD  || '';
    KYC.dobM  = data.dobM  || '';
    KYC.dobY  = data.dobY  || '';
    KYC.income = data.income || '';

    var ph = document.getElementById('kycPhone');
    var em = document.getElementById('kycEmail');
    var nm = document.getElementById('kycName');
    var pn = document.getElementById('kycPan');
    var dd = document.getElementById('kycDobD');
    var dm = document.getElementById('kycDobM');
    var dy = document.getElementById('kycDobY');
    var ic = document.getElementById('kycIncome');
    if(ph) ph.value = KYC.phone;
    if(em) em.value = KYC.email;
    if(nm) nm.value = KYC.name;
    if(pn) pn.value = KYC.pan;
    if(dd) dd.value = KYC.dobD;
    if(dm) dm.value = KYC.dobM;
    if(dy) dy.value = KYC.dobY;
    if(ic) ic.value = KYC.income;

    var step = Math.min(data.step || 1, 8);
    showStep(step, false);
    // Restart OTP resend timers when restoring to step 2 so buttons are active
    if(step === 2){
      startResendTimer('kycResendPhone', 'phone');
      startResendTimer('kycResendEmail', 'email');
    }

    var banner = document.getElementById('kycSessionBanner');
    if(banner) banner.style.display = 'flex';
  }

  /* ══════════════════════════════════════
     PRE-FILL FROM HOMEPAGE SESSION
  ══════════════════════════════════════ */
  function checkPrefill(){
    try {
      var ph = sessionStorage.getItem('kyc_prefill_phone');
      var em = sessionStorage.getItem('kyc_prefill_email');
      if(ph){
        KYC.phone = ph.replace(/\D/g,'').slice(0,10);
        var phEl = document.getElementById('kycPhone');
        if(phEl) phEl.value = KYC.phone;
      }
      if(em){
        KYC.email = em;
        var emEl = document.getElementById('kycEmail');
        if(emEl) emEl.value = KYC.email;
      }
      if(ph || em) validateStep1();
    } catch(e){}
  }

  /* ══════════════════════════════════════
     OTP RESEND TIMERS
  ══════════════════════════════════════ */
  function startResendTimer(btnId, key){
    var btn = document.getElementById(btnId);
    if(!btn) return;
    if(otpTimers[key]) clearInterval(otpTimers[key]);
    var secs = 30;
    btn.disabled = true;
    btn.textContent = 'Resend in ' + secs + 's';
    otpTimers[key] = setInterval(function(){
      secs--;
      if(secs <= 0){
        clearInterval(otpTimers[key]);
        btn.disabled = false;
        btn.textContent = 'Resend code';
      } else {
        btn.textContent = 'Resend in ' + secs + 's';
      }
    }, 1000);
  }

  /* ══════════════════════════════════════
     BUILD MOBILE STEPPER
  ══════════════════════════════════════ */
  function buildMobStepper(){
    var w = document.getElementById('kycMobStepperInner');
    if(!w) return;
    var h = '';
    for(var i=0;i<7;i++){
      var n = i+1;
      h += '<div class="kyc-mob-step-col">';
      h += '<div class="kyc-mob-dot" id="kyMD'+n+'">'+n+'</div>';
      h += '<span class="kyc-mob-label" id="kyML'+n+'">'+SMOB[i]+'</span>';
      h += '</div>';
      if(i<6) h += '<div class="kyc-mob-line" id="kyMLN'+n+'"></div>';
    }
    w.innerHTML = h;
  }

  function updateMobStepper(cs){
    var as = SMAP[cs]||1;
    for(var i=1;i<=7;i++){
      var dot  = document.getElementById('kyMD'+i);
      var lbl  = document.getElementById('kyML'+i);
      var line = document.getElementById('kyMLN'+i);
      if(!dot) continue;
      var done   = cs===8 ? true : i<as;
      var active = cs!==8 && i===as;
      dot.className = 'kyc-mob-dot'+(done?' ms-done':active?' ms-active':'');
      dot.textContent = done ? '✓' : i;
      if(lbl) lbl.className = 'kyc-mob-label'+(active?' ms-active-label':done?' ms-done-label':'');
      if(line) line.className = 'kyc-mob-line'+(done?' ml-done':'');
    }
    var activeDot = document.getElementById('kyMD'+as);
    if(activeDot) activeDot.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }

  /* ══════════════════════════════════════
     BUILD SIDEBAR
  ══════════════════════════════════════ */
  function buildSidebar(){
    var w = document.getElementById('kycSidebar');
    if(!w) return;
    var h = '';
    for(var i=0;i<7;i++){
      var n = i+1;
      h += '<div class="kyc-sb-item ss-future" id="kySB'+n+'">';
      h += '<div class="kyc-sb-icon">'+SICONS[i]+'</div>';
      h += '<div class="kyc-sb-text"><span class="kyc-sb-name">'+SLABELS[i]+'</span><span class="kyc-sb-sub">'+SSUBS[i]+'</span></div>';
      h += '<div class="kyc-sb-badge">'+n+'</div>';
      h += '</div>';
    }
    w.innerHTML = h;
  }

  /* ── Update sidebar + topbar ── */
  function updateSidebar(cs){
    var as = SMAP[cs] || 1;
    for(var i=1;i<=7;i++){
      var el = document.getElementById('kySB'+i);
      if(!el) continue;
      var done   = (cs===8) ? true : i < as;
      var active = (cs!==8) && i===as;
      el.className = 'kyc-sb-item '+(done?'ss-done':active?'ss-active':'ss-future');
      el.querySelector('.kyc-sb-badge').textContent = done ? '✓' : i;
    }
    updateMobStepper(cs);
    // topbar
    var pct = Math.round(cs/8*100);
    var tt = document.getElementById('kycTopTitle');
    var ts = document.getElementById('kycTopSub');
    var tf = document.getElementById('kycTopFill');
    var tp = document.getElementById('kycTopPct');
    var mp = document.getElementById('kycMobPct');
    if(tt) tt.textContent = STITLES[cs] || '';
    if(ts) ts.textContent = cs===8 ? 'Done 🎉' : (SSTAGE[cs] || '') + ' — Step '+cs+' of 8';
    if(tf) tf.style.width = pct+'%';
    if(tp) tp.textContent = pct+'%';
    if(mp) mp.textContent = pct+'%';
  }

  /* ══════════════════════════════════════
     SHOW STEP
  ══════════════════════════════════════ */
  function showStep(n, pushHistory){
    if(pushHistory === undefined) pushHistory = true;
    n = Math.max(1, Math.min(8, n));
    KYC.step = n;
    document.querySelectorAll('.kyc-step').forEach(function(el){ el.classList.remove('active'); });
    var t = document.querySelector('[data-step="'+n+'"]');
    if(t) t.classList.add('active');
    var card = document.getElementById('kycCard');
    if(card){ card.style.animation='none'; void card.offsetWidth; card.style.animation='kycSlideUp 0.28s ease both'; }
    updateSidebar(n);
    if(n===4) runVerify();
    if(n===7){ resetCam(); startCam(); }
    if(n!==7) stopCam();
    if(n===8){
      var fn = KYC.name.split(' ')[0] || 'Investor';
      var st = document.getElementById('kycSuccessTitle');
      if(st) st.textContent = "You're all set, "+fn+"!";
      var wp = document.getElementById('kycWaPhone');
      if(wp && !wp.value) wp.value = KYC.phone;
      clearSession(); // done — clear persisted state
    }
    updateUrl(n, !pushHistory);
    var pill = document.querySelector('.kyc-float-pill');
    if(pill) pill.style.display = n===8 ? 'none' : '';
    var content = document.querySelector('.kyc-content');
    if(content) content.scrollTo({top:0,behavior:'smooth'});
    else window.scrollTo({top:0,behavior:'smooth'});
  }

  /* ══════════════════════════════════════
     OTP INPUT LOGIC
  ══════════════════════════════════════ */
  function initOtp(sel){
    var inputs = document.querySelectorAll(sel);
    inputs.forEach(function(inp,i){
      inp.addEventListener('input',function(e){
        var v = e.target.value.replace(/\D/g,'').slice(-1);
        inp.value = v;
        if(v){ inp.classList.add('filled'); if(i<inputs.length-1) inputs[i+1].focus(); }
        else inp.classList.remove('filled');
      });
      inp.addEventListener('keydown',function(e){
        if(e.key==='Backspace' && !inp.value && i>0){ inputs[i-1].value=''; inputs[i-1].classList.remove('filled'); inputs[i-1].focus(); }
      });
    });
  }

  /* ══════════════════════════════════════
     VERIFY ANIMATION
  ══════════════════════════════════════ */
  function runVerify(){
    vTimers.forEach(clearTimeout); vTimers=[];
    ['kycVI1','kycVI2','kycVI3','kycVI4'].forEach(function(id){ var el=document.getElementById(id); if(el) el.classList.remove('item-visible'); });
    var sp=document.getElementById('kycSpinner'),ch=document.getElementById('kycBigCheck'),ti=document.getElementById('kycVerifyTitle'),su=document.getElementById('kycVerifySub'),ct=document.getElementById('kycVerifyCta');
    if(sp) sp.style.display='block'; if(ch) ch.style.display='none';
    if(ti) ti.textContent='Fetching your details…'; if(su) su.textContent='Connecting to NSDL & UIDAI…'; if(ct) ct.style.display='none';
    vTimers.push(setTimeout(function(){ vi('kycVI1'); if(ti) ti.textContent='Verifying identity…'; },1200));
    vTimers.push(setTimeout(function(){ vi('kycVI2'); vi('kycVI3'); if(ti) ti.textContent='Almost done…'; if(su) su.textContent='Cross-checking bank account…'; },2800));
    vTimers.push(setTimeout(function(){
      vi('kycVI4'); if(sp) sp.style.display='none';
      if(ch){ ch.style.display='flex'; ch.style.animation='none'; void ch.offsetWidth; ch.style.animation='kycPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both'; }
      if(ti) ti.textContent='All details verified!'; if(su) su.textContent='PAN, Aadhaar & Bank confirmed.'; if(ct) ct.style.display='block';
    },4600));
  }
  function vi(id){ var el=document.getElementById(id); if(el) el.classList.add('item-visible'); }

  /* ══════════════════════════════════════
     CAMERA
  ══════════════════════════════════════ */
  function resetCam(){
    KYC.photoDataUrl=null;
    var map={kycSnapshot:function(e){e.style.display='none';e.src='';},kycVideo:function(e){e.style.display='none';},kycCamStub:function(e){e.style.display='block';},kycOvalOverlay:function(e){e.style.display='flex';},kycPhotoBadge:function(e){e.style.display='none';},kycBeforeCapture:function(e){e.style.display='block';},kycAfterCapture:function(e){e.style.display='none';},kycTipsGrid:function(e){e.style.display='grid';},kycCamWrap:function(e){e.classList.remove('has-photo');},kycCamError:function(e){e.style.display='none';}};
    Object.keys(map).forEach(function(id){ var el=document.getElementById(id); if(el) map[id](el); });
    var t=document.getElementById('step8Title'),b=document.getElementById('step8Body'),cb=document.getElementById('kycCaptureBtn');
    if(t) t.textContent='Capture your face';
    if(b) b.textContent='Position your face in the oval. Good lighting, look straight at the camera.';
    if(cb){ cb.style.opacity='0.4'; cb.disabled=true; }
  }
  function startCam(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ showCamErr(); return; }
    navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:1280},audio:false})
      .then(function(stream){
        camStream=stream;
        window._kycCamStream=stream;
        var v=document.getElementById('kycVideo'),s=document.getElementById('kycCamStub'),cb=document.getElementById('kycCaptureBtn');
        if(v){v.srcObject=stream;v.style.display='block';}
        if(s) s.style.display='none';
        if(cb){cb.style.opacity='1';cb.disabled=false;}
      })
      .catch(showCamErr);
  }
  function stopCam(){ if(camStream){ camStream.getTracks().forEach(function(t){t.stop();}); camStream=null; window._kycCamStream=null; } var v=document.getElementById('kycVideo'); if(v){v.srcObject=null;v.style.display='none';} }
  function showCamErr(){
    // Hide stub, show short error text inside the cam-wrap
    var e=document.getElementById('kycCamError'),s=document.getElementById('kycCamStub');
    if(s) s.style.display='none';
    if(e) e.style.display='block';
    // Show the full fallback panel below the cam-wrap
    var fb=document.getElementById('kycCamFallback');
    if(fb) fb.classList.add('visible');
    // Update the phone label
    var pl=document.getElementById('kycCamWaPhoneLabel');
    if(pl) pl.textContent = KYC.phone ? '+91 '+KYC.phone : 'your registered number';
  }
  function capturePhoto(){
    var v=document.getElementById('kycVideo'),c=document.getElementById('kycCanvas'),sn=document.getElementById('kycSnapshot');
    if(!v||!c||!sn) return;
    c.width=v.videoWidth||640; c.height=v.videoHeight||480; c.getContext('2d').drawImage(v,0,0);
    KYC.photoDataUrl=c.toDataURL('image/jpeg',0.88); sn.src=KYC.photoDataUrl; sn.style.display='block'; v.style.display='none'; stopCam();
    var ov=document.getElementById('kycOvalOverlay'),pb=document.getElementById('kycPhotoBadge'),bc=document.getElementById('kycBeforeCapture'),ac=document.getElementById('kycAfterCapture'),tg=document.getElementById('kycTipsGrid'),cw=document.getElementById('kycCamWrap'),t=document.getElementById('step8Title'),b=document.getElementById('step8Body');
    if(ov) ov.style.display='none'; if(pb) pb.style.display='flex'; if(cw) cw.classList.add('has-photo'); if(bc) bc.style.display='none'; if(ac) ac.style.display='block'; if(tg) tg.style.display='none'; if(t) t.textContent='Face captured!'; if(b) b.textContent='Selfie saved. Click Submit to complete your KYC.';
  }

  /* ══════════════════════════════════════
     WHATSAPP LINK
  ══════════════════════════════════════ */
  function buildWaLink(){
    var wp=document.getElementById('kycWaPhone'); var phone=(wp&&wp.value)||KYC.phone; var fn=KYC.name.split(' ')[0]||'Investor';
    var msg=encodeURIComponent('Hi '+fn+'! 🎉 Your MF Bharat KYC is complete!\n\nDownload the app:\n\n📱 Android:\nhttps://play.google.com/store/apps/details?id=com.mfbharat\n\n🍎 iPhone:\nhttps://apps.apple.com/app/mfbharat\n\nStart SIP from ₹100. SEBI Registered 🇮🇳');
    return 'https://wa.me/91'+phone.replace(/\D/g,'')+('?text='+msg);
  }

  /* ══════════════════════════════════════
     VALIDATION
  ══════════════════════════════════════ */
  var PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  function isPanValid(){ return PAN_RE.test(KYC.pan); }

  function setFieldError(fieldId, errorId, hasError){
    var f = document.getElementById(fieldId);
    var e = document.getElementById(errorId);
    if(f){
      var inp = f.tagName === 'INPUT' || f.tagName === 'SELECT' ? f : f.querySelector('input,select');
      if(inp){ if(hasError) inp.classList.add('kyc-input-error'); else inp.classList.remove('kyc-input-error'); }
    }
    if(e){ if(hasError) e.classList.add('visible'); else e.classList.remove('visible'); }
  }

  function showFormError(id, show){
    var el = document.getElementById(id);
    if(el){ if(show) el.classList.add('visible'); else el.classList.remove('visible'); }
  }

  function validateStep1(){ var ok=KYC.phone.length===10&&KYC.email.includes('@')&&KYC.email.includes('.'); var btn=document.getElementById('kycStep1Cta'); if(btn){btn.style.opacity=ok?'1':'0.4';btn.disabled=!ok;} }
  function validateStep3(){
    var panOk = isPanValid();
    var ok = KYC.name && panOk && KYC.dobD && KYC.dobM && KYC.dobY.length===4 && KYC.income && KYC.hasConsent;
    var btn = document.getElementById('kycStep3PanCta');
    if(btn){btn.style.opacity=ok?'1':'0.4';btn.disabled=!ok;}
    // Show PAN inline error only if PAN has been touched (length > 0) and is invalid
    if(KYC.pan.length > 0 && !panOk){
      setFieldError('kycPanField','kycPanError',true);
    } else {
      setFieldError('kycPanField','kycPanError',false);
    }
  }
  function on(id,ev,fn){ var el=document.getElementById(id); if(el) el.addEventListener(ev,fn); }

  /* ── Camera WhatsApp resume link ── */
  function buildCamWaLink(){
    var phone = KYC.phone || '';
    var pageUrl = window.location.href.split('?')[0];
    var msg = encodeURIComponent('Hi! Here is your link to complete face verification for MF Bharat KYC: ' + pageUrl);
    return 'https://wa.me/91' + phone.replace(/\D/g,'') + '?text=' + msg;
  }

  /* ══════════════════════════════════════
     THEME
  ══════════════════════════════════════ */
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kycTheme', theme);
    try {
      var p = new URLSearchParams(window.location.search);
      p.set('theme', theme);
      if(KYC.step) p.set('step', KYC.step);
      history.replaceState(history.state, '', window.location.pathname + '?' + p.toString());
    } catch(e){}
    var isDark = theme==='dark';
    var icon  = document.getElementById('kycSbThemeIcon');
    var label = document.getElementById('kycSbThemeLabel');
    var mob   = document.getElementById('kycThemeMob');
    if(icon)  icon.textContent  = isDark ? '☀️' : '🌙';
    if(label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    if(mob)   mob.textContent   = isDark ? '☀️' : '🌙';
  }
  function toggleTheme(){ applyTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark'); }

  /* ── Init theme — URL param > localStorage > system pref ── */
  (function(){
    var urlTheme = new URLSearchParams(window.location.search).get('theme');
    var saved    = localStorage.getItem('kycTheme');
    var pref     = (window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    var t = (urlTheme==='light'||urlTheme==='dark') ? urlTheme : (saved || pref);
    applyTheme(t);
  })();

  /* ── Mobile: show pct instead of progress bar ── */
  (function(){
    function checkMob(){
      var mob = window.innerWidth <= 768;
      var bar = document.getElementById('kycTopFill');
      var pct = document.getElementById('kycTopPct');
      var mp  = document.getElementById('kycMobPct');
      if(bar) bar.parentElement.parentElement.style.display = mob ? 'none' : 'flex';
      if(pct) pct.style.display = mob ? 'none' : '';
      if(mp)  mp.style.display  = mob ? 'inline' : 'none';
    }
    checkMob();
    if (window._kycResizeHandler) { window.removeEventListener('resize', window._kycResizeHandler); }
    window._kycResizeHandler = checkMob;
    window.addEventListener('resize', window._kycResizeHandler);
  })();

  /* ══════════════════════════════════════
     EXIT WARNING HELPERS
  ══════════════════════════════════════ */
  function tryExit(){
    // No warning on step 1 — no meaningful data entered yet
    if(KYC.step <= 1){
      if(typeof window._kycNavigate==='function') window._kycNavigate('/');
      else window.location.href = '/';
      return;
    }
    var overlay = document.getElementById('kycExitDialog');
    if(overlay) overlay.classList.add('visible');
  }

  /* ══════════════════════════════════════
     DOM READY
  ══════════════════════════════════════ */
  (function() {
    buildSidebar();
    buildMobStepper();

    // ── URL-param routing ──────────────────────────────────
    var urlParams  = new URLSearchParams(window.location.search);
    var urlStep    = parseInt(urlParams.get('step')) || 0;
    var sessionData = loadSession();

    if(urlStep >= 1 && urlStep <= 8){
      // Deep-link: jump straight to the requested step
      if(sessionData && sessionData.step >= urlStep){
        restoreSession(sessionData);   // restores fields, calls showStep(…,false)
        showStep(urlStep, false);       // honour the URL step specifically
      } else {
        showStep(urlStep, false);
      }
      if(urlStep === 1) checkPrefill();
    } else if(sessionData && sessionData.step > 1){
      restoreSession(sessionData);
    } else {
      showStep(1, false);
      checkPrefill();
    }

    // ── Browser back / forward ─────────────────────────────
    if (window._kycPopHandler) { window.removeEventListener('popstate', window._kycPopHandler); }
    window._kycPopHandler = function(e){
      var s = (e.state && e.state.step) ? e.state.step : 1;
      s = Math.max(1, Math.min(8, s));
      KYC.step = s;
      document.querySelectorAll('.kyc-step').forEach(function(el){ el.classList.remove('active'); });
      var t = document.querySelector('[data-step="'+s+'"]');
      if(t) t.classList.add('active');
      updateSidebar(s);
      if(s===4) runVerify();
      if(s===7){ resetCam(); startCam(); }
      if(s!==7) stopCam();
      document.title = STEP_TITLES[s] || 'Complete KYC — MF Bharat';
      var md = document.querySelector('meta[name="description"]');
      if(md && STEP_DESCS[s]) md.setAttribute('content', STEP_DESCS[s]);
      var content = document.querySelector('.kyc-content');
      if(content) content.scrollTo({top:0,behavior:'smooth'});
    };
    window.addEventListener('popstate', window._kycPopHandler);

    initOtp('.kyc-p-otp');
    initOtp('.kyc-e-otp');

    // Intercept logo links for client-side Next.js navigation
    document.querySelectorAll('.kyc-sb-logo a, .kyc-topbar-logo').forEach(function(el){
      el.addEventListener('click', function(e){
        if(typeof window._kycNavigate === 'function'){
          e.preventDefault();
          window._kycNavigate('/');
        }
      });
    });

    on('kycThemeToggle', 'click', toggleTheme);
    on('kycThemeMob',    'click', toggleTheme);

    /* ── Exit dialog ── */
    on('kycSbExit',    'click', tryExit);
    on('kycMobExit',   'click', tryExit);
    on('kycExitCancel','click', function(){
      var overlay = document.getElementById('kycExitDialog');
      if(overlay) overlay.classList.remove('visible');
    });
    on('kycExitConfirm','click', function(){
      clearSession();
      if(typeof window._kycNavigate==='function') window._kycNavigate('/');
      else window.location.href = '/';
    });
    // Close dialog on overlay click
    var overlay = document.getElementById('kycExitDialog');
    if(overlay) overlay.addEventListener('click', function(e){
      if(e.target === overlay) overlay.classList.remove('visible');
    });

    /* ── Session banner ── */
    on('kycStartFresh','click',function(){
      clearSession();
      var banner = document.getElementById('kycSessionBanner');
      if(banner) banner.style.display = 'none';
      // Reset all fields
      KYC = {step:1,phone:'',email:'',name:'',pan:'',dobD:'',dobM:'',dobY:'',income:'',isResident:false,hasConsent:false,bankLinked:false,photoDataUrl:null};
      ['kycPhone','kycEmail','kycName','kycPan','kycDobD','kycDobM','kycDobY'].forEach(function(id){
        var el = document.getElementById(id); if(el) el.value = '';
      });
      var ic = document.getElementById('kycIncome'); if(ic) ic.value = '';
      var res = document.getElementById('kycResident'); if(res) res.checked = false;
      var con = document.getElementById('kycConsent'); if(con) con.checked = false;
      checkPrefill();
      showStep(1);
      validateStep1();
    });

    /* ── Step 1 ── */
    on('kycPhone','input',function(e){
      KYC.phone=e.target.value.replace(/\D/g,'').slice(0,10); e.target.value=KYC.phone;
      var m=document.getElementById('kycPhoneMask'); if(m&&KYC.phone.length>=5) m.textContent='Sent to +91 '+KYC.phone.slice(0,2)+'·····'+KYC.phone.slice(-3);
      validateStep1();
    });
    on('kycEmail','input',function(e){
      KYC.email=e.target.value;
      var parts=KYC.email.split('@'); var m=document.getElementById('kycEmailMask'); if(m&&parts[1]) m.textContent='Sent to '+parts[0].slice(0,2)+'·····@'+parts[1];
      validateStep1();
    });
    on('kycStep1Cta','click',function(){
      if(!this.disabled){
        saveSession();
        showStep(2);
        // Start both resend timers when OTP is sent
        startResendTimer('kycResendPhone','phone');
        startResendTimer('kycResendEmail','email');
      }
    });

    /* ── Step 2 — OTP resend ── */
    on('kycResendPhone','click',function(){
      if(!this.disabled) startResendTimer('kycResendPhone','phone');
    });
    on('kycResendEmail','click',function(){
      if(!this.disabled) startResendTimer('kycResendEmail','email');
    });
    on('kycStep2Cta','click',function(){
      // Validate both OTPs are fully filled (6 digits each)
      var pOtps = document.querySelectorAll('.kyc-p-otp');
      var eOtps = document.querySelectorAll('.kyc-e-otp');
      var pFilled = Array.from(pOtps).every(function(i){ return i.value.trim() !== ''; });
      var eFilled = Array.from(eOtps).every(function(i){ return i.value.trim() !== ''; });
      var errEl = document.getElementById('kycOtpError');
      if(!pFilled || !eFilled){
        if(errEl) errEl.classList.add('visible');
        // Highlight the empty inputs
        pOtps.forEach(function(i){ if(!i.value.trim()) i.classList.add('kyc-input-error'); });
        eOtps.forEach(function(i){ if(!i.value.trim()) i.classList.add('kyc-input-error'); });
        return;
      }
      if(errEl) errEl.classList.remove('visible');
      saveSession();
      showStep(3);
    });
    on('kycStep2Back','click',function(){ showStep(1); });

    /* ── Step 3 (PAN form) ── */
    on('kycName','input',function(e){ KYC.name=e.target.value; saveSession(); validateStep3(); });
    on('kycPan','input',function(e){ KYC.pan=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10); e.target.value=KYC.pan; saveSession(); validateStep3(); });
    on('kycDobD','input',function(e){ KYC.dobD=e.target.value.replace(/\D/g,'').slice(0,2); e.target.value=KYC.dobD; saveSession(); validateStep3(); });
    on('kycDobM','input',function(e){ KYC.dobM=e.target.value.replace(/\D/g,'').slice(0,2); e.target.value=KYC.dobM; saveSession(); validateStep3(); });
    on('kycDobY','input',function(e){ KYC.dobY=e.target.value.replace(/\D/g,'').slice(0,4); e.target.value=KYC.dobY; saveSession(); validateStep3(); });
    on('kycIncome','change',function(e){ KYC.income=e.target.value; saveSession(); validateStep3(); });
    on('kycResident','change',function(e){ KYC.isResident=e.target.checked; });
    on('kycConsent','change',function(e){ KYC.hasConsent=e.target.checked; validateStep3(); });
    on('kycStep3PanCta','click',function(){
      if(this.disabled) return;
      // Double-check PAN format before running the verification animation
      if(!isPanValid()){
        setFieldError('kycPanField','kycPanError',true);
        showFormError('kycPanFormError',true);
        return;
      }
      // Check required fields and highlight empty ones
      var required = [
        {id:'kycName',  errTxt:'Name is required'},
        {id:'kycDobD',  errTxt:'Day is required'},
        {id:'kycDobM',  errTxt:'Month is required'},
        {id:'kycDobY',  errTxt:'Year is required'}
      ];
      var anyEmpty = false;
      required.forEach(function(r){
        var el = document.getElementById(r.id);
        if(el && !el.value.trim()){ el.classList.add('kyc-input-error'); anyEmpty = true; }
        else if(el) el.classList.remove('kyc-input-error');
      });
      if(anyEmpty){ showFormError('kycPanFormError',true); return; }
      showFormError('kycPanFormError',false);
      saveSession();
      showStep(4);
    });
    on('kycStep3PanBack','click',function(){ showStep(2); });

    /* ── Step 4 (Verify) ── */
    on('kycVerifyCta','click',function(){ saveSession(); showStep(5); });

    /* ── Step 5 (Bank) ── */
    on('kycBankLinkBtn','click',function(){
      KYC.bankLinked=true; this.style.display='none';
      showFormError('kycBankError',false);
      var bt=document.getElementById('kycBankTick'),bc=document.getElementById('kycBankConfirmBar'),bcard=document.getElementById('kycBankCard'),bcont=document.getElementById('kycBankContinueBtn');
      if(bt) bt.style.display='block'; if(bc) bc.style.display='block'; if(bcard) bcard.classList.add('success'); if(bcont) bcont.style.display='block';
    });
    on('kycBankContinueBtn','click',function(){
      if(!KYC.bankLinked){ showFormError('kycBankError',true); return; }
      showFormError('kycBankError',false);
      saveSession(); showStep(6);
    });
    on('kycStep5Back','click',function(){ showStep(4); });

    // Manual bank toggle
    on('kycManualBankToggle','click',function(){
      var form = document.getElementById('kycManualBankForm');
      var bankCard = document.getElementById('kycBankCard');
      var bankLinkBtn = document.getElementById('kycBankLinkBtn');
      if(form){
        var visible = form.classList.toggle('visible');
        this.textContent = visible ? '← Back to auto-detected bank' : 'This isn\'t my bank — enter manually';
        if(bankCard) bankCard.style.display = visible ? 'none' : '';
        if(bankLinkBtn) bankLinkBtn.style.display = visible ? 'none' : '';
      }
    });
    on('kycManualBankSubmit','click',function(){
      var accNo = document.getElementById('kycManualAccNo');
      var ifsc  = document.getElementById('kycManualIfsc');
      if(!accNo || !accNo.value.trim() || !ifsc || ifsc.value.trim().length < 11){
        alert('Please enter a valid account number and 11-character IFSC code.');
        return;
      }
      KYC.bankLinked = true;
      var bcont = document.getElementById('kycBankContinueBtn');
      if(bcont){ bcont.style.display='block'; }
      this.textContent = '✓ Bank details saved';
      this.disabled = true;
      this.style.opacity = '0.6';
      // Hide the manual form toggle message
      var toggle = document.getElementById('kycManualBankToggle');
      if(toggle) toggle.style.display = 'none';
    });

    /* ── Step 6 (Nominee) ── */
    on('kycStep6NomCta','click',function(){ saveSession(); showStep(7); });
    on('kycStep6Back','click',function(){ showStep(5); });

    // Opt-out flow
    on('kycStep6OptOut','click',function(){
      var confirm = document.getElementById('kycOptoutConfirm');
      if(confirm) confirm.classList.toggle('visible');
    });
    on('kycOptoutCheck','change',function(){
      var btn = document.getElementById('kycOptoutProceed');
      if(btn){ btn.disabled = !this.checked; btn.style.opacity = this.checked ? '1' : '0.4'; }
    });
    on('kycOptoutProceed','click',function(){
      if(!this.disabled){ saveSession(); showStep(7); }
    });

    /* ── Step 7 (Face) ── */
    on('kycCaptureBtn','click',capturePhoto);
    on('kycRetakeBtn','click',function(){ resetCam(); startCam(); });
    on('kycSubmitKyc','click',function(){ showStep(8); });
    on('kycStep7Back','click',function(){ showStep(6); });

    // Camera fallback: WhatsApp link
    on('kycCamWaBtn','click',function(){
      window.open(buildCamWaLink(),'_blank');
      this.textContent='✓ Link sent — check WhatsApp';
      this.disabled=true; this.style.opacity='0.6';
    });
    // Camera fallback: skip face & go to success
    on('kycSkipFaceBtn','click',function(){ saveSession(); showStep(8); });
    // Desktop alt links
    on('kycCamAltWa','click',function(){
      window.open(buildCamWaLink(),'_blank');
      this.textContent='✓ Link sent';
    });
    on('kycCamAltSkip','click',function(){ saveSession(); showStep(8); });

    /* ── Step 8 (Success) ── */
    on('kycWaCta','click',function(){ window.open(buildWaLink(),'_blank'); this.textContent='✓ Sent! Check WhatsApp'; this.disabled=true; this.style.opacity='0.6'; });

    // Expose teardown so React cleanup (ClientPage.tsx) can remove all listeners
    window._kycTeardown = function() {
      if (window._kycPopHandler) { window.removeEventListener('popstate', window._kycPopHandler); delete window._kycPopHandler; }
      if (window._kycResizeHandler) { window.removeEventListener('resize', window._kycResizeHandler); delete window._kycResizeHandler; }
      if (otpTimers.phone) { clearInterval(otpTimers.phone); otpTimers.phone = null; }
      if (otpTimers.email) { clearInterval(otpTimers.email); otpTimers.email = null; }
      vTimers.forEach(clearTimeout); vTimers = [];
      stopCam();
      delete window._kycTeardown;
    };

    /* ── Validate step 3 on load (in case restored) ── */
    validateStep3();
    validateStep1();
  })();
})();
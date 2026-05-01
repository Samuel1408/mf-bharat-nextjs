function initAudioPlayer() {
  const playBtn = document.getElementById('awPlayBtn');
  const stopBtn = document.getElementById('awStopBtn');
  const playIcon = document.getElementById('awPlayIcon');
  const pauseIcon = document.getElementById('awPauseIcon');
  const statusText = document.getElementById('awStatusText');
  const viz = document.getElementById('awViz');
  const langSelect = document.getElementById('awLangSelect');
  
  if (!playBtn || !window.speechSynthesis) return;

  let synth = window.speechSynthesis;
  let utterance = null;
  let isPlaying = false;
  let isPaused = false;

  // Language Map for Voice selection
  const voiceMap = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'mr': 'mr-IN'
  };

  function updateStatus() {
    if (isPlaying && !isPaused) {
      statusText.innerText = 'Playing...';
      viz.classList.add('playing');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else if (isPaused) {
      statusText.innerText = 'Paused';
      viz.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    } else {
      statusText.innerText = 'Ready';
      viz.classList.remove('playing');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  function getArticleText() {
    const article = document.querySelector('.art-body');
    if (!article) return '';
    
    // Create a clone to remove unwanted elements (like scripts, styles, embedded interactive widgets)
    const clone = article.cloneNode(true);
    const unwanted = clone.querySelectorAll('.art-thumb-hero, .art-callout, .aw-lang, .goog-te-combo, script, style, .art-cta, .art-stat-row');
    unwanted.forEach(el => el.remove());
    
    return clone.innerText || clone.textContent;
  }

  function startPlayback() {
    synth.cancel(); // Stop anything currently playing
    
    const text = getArticleText();
    if (!text.trim()) return;

    utterance = new SpeechSynthesisUtterance(text);
    
    // Determine the current language based on the dropdown
    const selectedVal = langSelect.value.split('|')[1]; // 'en', 'hi', 'mr'
    utterance.lang = selectedVal === 'hi' ? 'hi-IN' : (selectedVal === 'mr' ? 'mr-IN' : 'en-IN');
    
    // Try to pick a specific voice if available
    const voices = synth.getVoices();
    let specificVoice = voices.find(v => v.lang.startsWith(selectedVal));
    if (!specificVoice) {
      // Fallback matching by name
      const searchStr = selectedVal === 'hi' ? 'hindi' : (selectedVal === 'mr' ? 'marathi' : 'english');
      specificVoice = voices.find(v => v.name.toLowerCase().includes(searchStr));
    }
    
    if (specificVoice) {
      utterance.voice = specificVoice;
    }

    utterance.rate = 0.95; // Slightly slower for better comprehension
    utterance.pitch = 1;

    utterance.onstart = () => {
      isPlaying = true;
      isPaused = false;
      updateStatus();
    };

    utterance.onend = () => {
      isPlaying = false;
      isPaused = false;
      updateStatus();
    };

    utterance.onpause = () => {
      isPaused = true;
      updateStatus();
    };

    utterance.onresume = () => {
      isPaused = false;
      updateStatus();
    };

    synth.speak(utterance);
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      if (isPaused) {
        synth.resume();
      } else {
        synth.pause();
      }
    } else {
      startPlayback();
    }
  });

  stopBtn.addEventListener('click', () => {
    synth.cancel();
    isPlaying = false;
    isPaused = false;
    updateStatus();
  });

  // Handle Google Translate Integration
  langSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    
    // Stop audio on language switch
    if (isPlaying) {
      synth.cancel();
      isPlaying = false;
      isPaused = false;
      updateStatus();
    }
    
    // Trigger Google Translate
    const targetLang = value.split('|')[1];
    const selectElem = document.querySelector('.goog-te-combo');
    
    if (selectElem) {
      selectElem.value = targetLang;
      // Google translate needs a bubbling event to detect the change
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // If widget not ready, fallback to URL hash method and reload
      window.location.hash = `#googtrans(en|${targetLang})`;
      window.location.reload();
    }
  });

  // Ensure voices are loaded (Chrome sometimes needs this)
  speechSynthesis.onvoiceschanged = () => {
    synth.getVoices();
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAudioPlayer);
} else {
  // Add a slight delay to ensure React has fully rendered the dangerouslySetInnerHTML content
  setTimeout(initAudioPlayer, 100);
}

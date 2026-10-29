/* ==========================================================================
   PREMIUM CINEMATIC DIGITAL WEDDING INVITATION - LOGIC & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element References
  const posterImg = document.getElementById('doorPoster');
  const video = document.getElementById('doorVideo');
  const videoSource = document.getElementById('videoSource');
  const staticCanvas = document.getElementById('staticFrameCanvas');
  const canvasCtx = staticCanvas.getContext('2d');
  
  const tapOverlay = document.getElementById('tapOverlay');
  const invitationOverlay = document.getElementById('invitationOverlay');
  
  // Audio Elements & Controls
  const bgAudio = document.getElementById('bgAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIconOn = document.getElementById('audioIconOn');
  const audioIconOff = document.getElementById('audioIconOff');
  const replayBtn = document.getElementById('replayBtn');
  
  // Map Modal
  const mapModal = document.getElementById('mapModal');
  const openMapBtn = document.getElementById('openMapBtn');
  const closeMapModal = document.getElementById('closeMapModal');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  // Application State
  let currentDoorId = '1';
  let isAudioMuted = false;
  let isPlaying = false;
  let hasOpened = false;
  let audioCtx = null;

  // --- Audio Context Helper ---
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // --- 3D Depth Floating Sky Lanterns Engine ---
  function initFloatingLanterns() {
    const container = document.getElementById('lanternsContainer');
    if (!container) return;

    container.innerHTML = '';
    const lanternCount = 22;
    const depthTiers = ['depth-far', 'depth-far', 'depth-mid', 'depth-mid', 'depth-near'];

    for (let i = 0; i < lanternCount; i++) {
      const lantern = document.createElement('div');
      const depthClass = depthTiers[Math.floor(Math.random() * depthTiers.length)];
      lantern.className = `lantern-item ${depthClass}`;

      const leftPos = (Math.random() * 92 + 4).toFixed(1);
      const duration = (Math.random() * 14 + 14).toFixed(1);
      const delay = (Math.random() * 20).toFixed(1);
      const swayX = (Math.random() * 24 + 10).toFixed(0);
      const rotDeg = (Math.random() * 6 - 3).toFixed(1);

      lantern.style.left = `${leftPos}%`;
      lantern.style.animationDuration = `${duration}s`;
      lantern.style.animationDelay = `${delay}s`;
      lantern.style.setProperty('--sway-x', `${swayX}px`);
      lantern.style.setProperty('--rot-deg', `${rotDeg}deg`);

      lantern.innerHTML = `
        <div class="lantern-paper">
          <div class="lantern-core-flame"></div>
        </div>
        <div class="lantern-tassel"></div>
      `;

      container.appendChild(lantern);
    }
  }

  // Initialize floating sky lanterns
  initFloatingLanterns();

  // --- Capture Final Video Frame onto Canvas for 100% Static Hold ---
  function freezeFinalFrame() {
    if (video.videoWidth && video.videoHeight) {
      staticCanvas.width = video.videoWidth;
      staticCanvas.height = video.videoHeight;
      canvasCtx.drawImage(video, 0, 0, staticCanvas.width, staticCanvas.height);
      
      staticCanvas.classList.add('active');
      video.pause();
    }
  }

  // --- Helper: Reveal Invitation Content ---
  function revealInvitationContent() {
    freezeFinalFrame();
    hasOpened = true;
    isPlaying = false;

    // Reveal invitation text overlay smoothly over static final door frame
    invitationOverlay.classList.remove('hidden');
    void invitationOverlay.offsetWidth;
    invitationOverlay.classList.add('revealed');

    // Trigger celebration confetti
    triggerCelebrationConfetti();

    // Initialize HTML5 Scratch Canvas once overlay is visible
    setTimeout(() => {
      initScratchCanvas();
    }, 150);
  }

  // --- HTML5 Scratch Card Engine ---
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const quickRevealBtn = document.getElementById('quickRevealBtn');
  let scratchCtx = null;
  let isScratching = false;
  let hasScratchedCleared = false;
  let dragCount = 0;

  function initScratchCanvas() {
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d');
    
    const container = document.getElementById('scratchContainer');
    if (!container) return;
    
    scratchCanvas.width = container.offsetWidth || 320;
    scratchCanvas.height = container.offsetHeight || 120;
    
    // Render Metallic Gold Foil Gradient
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#E5C158');
    grad.addColorStop(0.35, '#FFF4D0');
    grad.addColorStop(0.7, '#D4A338');
    grad.addColorStop(1, '#A67C1E');
    
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    // Subtle luxury speckles pattern on foil
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 90; i++) {
      const rx = Math.random() * scratchCanvas.width;
      const ry = Math.random() * scratchCanvas.height;
      const r = Math.random() * 1.5;
      scratchCtx.beginPath();
      scratchCtx.arc(rx, ry, r, 0, Math.PI * 2);
      scratchCtx.fill();
    }
    
    // Scratch foil decorative border
    scratchCtx.strokeStyle = 'rgba(255, 244, 208, 0.4)';
    scratchCtx.lineWidth = 2;
    scratchCtx.strokeRect(6, 6, scratchCanvas.width - 12, scratchCanvas.height - 12);
  }

  function getScratchPosition(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratchErase(x, y) {
    if (!scratchCtx || hasScratchedCleared) return;
    
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2, false);
    scratchCtx.fill();

    dragCount++;
    if (dragCount % 12 === 0) {
      checkScratchPercentage();
    }
  }

  function checkScratchPercentage() {
    if (hasScratchedCleared || !scratchCtx) return;
    
    try {
      const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      const pixels = imgData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 8th pixel for instant performance
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const ratio = transparentPixels / (totalPixels / 8);
      if (ratio > 0.45) {
        clearFullFoil();
      }
    } catch (e) {
      // Fallback
    }
  }

  function clearFullFoil() {
    if (hasScratchedCleared) return;
    hasScratchedCleared = true;
    
    scratchCanvas.style.transition = 'opacity 0.6s ease';
    scratchCanvas.style.opacity = '0';
    
    if (scratchHint) {
      scratchHint.style.transition = 'opacity 0.4s ease';
      scratchHint.style.opacity = '0';
    }

    if (quickRevealBtn) {
      quickRevealBtn.style.display = 'none';
    }

    setTimeout(() => {
      scratchCanvas.remove();
      if (scratchHint) scratchHint.remove();
    }, 600);
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const pos = getScratchPosition(e);
      scratchErase(pos.x, pos.y);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const pos = getScratchPosition(e);
      scratchErase(pos.x, pos.y);
    });

    window.addEventListener('mouseup', () => {
      isScratching = false;
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const pos = getScratchPosition(e);
      scratchErase(pos.x, pos.y);
    }, { passive: true });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      const pos = getScratchPosition(e);
      scratchErase(pos.x, pos.y);
    }, { passive: true });

    scratchCanvas.addEventListener('touchend', () => {
      isScratching = false;
    });
  }

  if (quickRevealBtn) {
    quickRevealBtn.addEventListener('click', clearFullFoil);
  }

  // --- Confetti Particles Engine ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function triggerCelebrationConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    
    confettiCanvas.width = confettiCanvas.offsetWidth || 400;
    confettiCanvas.height = confettiCanvas.offsetHeight || 700;
    
    confettiParticles = [];
    const colors = ['#FFF6D5', '#E5C158', '#D4A338', '#FFF', '#F0D080'];
    const particleCount = 75;

    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -10 - Math.random() * 80,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2.5 + 1.2,
        speedX: Math.random() * 1.5 - 0.75,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 4 - 2,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    confettiParticles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) * 0.8 + p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < confettiCanvas.height) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confettiCtx.restore();
      }
    });
    
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Live Countdown Timer Engine ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  
  // Saturday, 21st November 2026, 5:00 PM IST (GMT+05:30)
  const targetWeddingDate = new Date('November 21, 2026 17:00:00 GMT+0530').getTime();

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;
    
    if (distance < 0) {
      cdDays.innerText = '00';
      cdHours.innerText = '00';
      cdMins.innerText = '00';
      cdSecs.innerText = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    cdDays.innerText = days < 10 ? '0' + days : days;
    cdHours.innerText = hours < 10 ? '0' + hours : hours;
    cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
    cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 3D Card Parallax & Tilt Engine ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- Door Opening Handler ---
  function openDoorInvitation() {
    if (isPlaying || hasOpened) return;
    
    isPlaying = true;
    initAudioContext();

    // Trigger Background Music (Made In Heaven Theme)
    if (bgAudio) {
      bgAudio.currentTime = 0;
      bgAudio.play().catch(err => {
        console.log('Direct audio autoplay restricted, falling back to YouTube audio:', err);
        playYouTubeBackgroundMusic('e62hwL_muaA', true);
      });
    } else {
      playYouTubeBackgroundMusic('e62hwL_muaA', true);
    }

    // 1. Hide tap callout overlay
    tapOverlay.classList.add('fade-out');
    
    // 2. Hide poster image & clear static canvas
    posterImg.classList.add('fade-out');
    staticCanvas.classList.remove('active');
    
    // 3. Reset video playback to 0 and play continuous single-motion video
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Video playing smoothly to the end
      }).catch(error => {
        console.warn('Video auto-playback policy intervention, bypassing to static freeze frame:', error);
        revealInvitationContent();
      });
    }
  }

  // Bind video completion listener
  video.addEventListener('ended', () => {
    revealInvitationContent();
  });

  // Safe timeupdate trigger to freeze at exact end
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.08) {
      if (!hasOpened) {
        revealInvitationContent();
      }
    }
  });

  // --- Reset & Replay Handler ---
  function resetDoorState() {
    hasOpened = false;
    isPlaying = false;
    
    // Hide text overlay
    invitationOverlay.classList.remove('revealed');
    setTimeout(() => {
      invitationOverlay.classList.add('hidden');
    }, 400);

    // Reset visual layers back to initial poster
    staticCanvas.classList.remove('active');
    posterImg.classList.remove('fade-out');
    posterImg.classList.add('active');
    tapOverlay.classList.remove('fade-out');

    // Reset video
    video.pause();
    video.currentTime = 0;

    // Restart Audio
    if (bgAudio) {
      bgAudio.currentTime = 0;
      if (!isAudioMuted) {
        bgAudio.play().catch(() => {});
      }
    }
  }

  // Event Listener for Tap Overlay
  if (tapOverlay) {
    tapOverlay.addEventListener('click', openDoorInvitation);
  }
  if (replayBtn) {
    replayBtn.addEventListener('click', resetDoorState);
  }

  // --- YouTube Background Music Player Engine (Fallback) ---
  let currentYoutubeVideoId = '';
  let ytPlayerIframe = null;

  function extractYouTubeId(url) {
    if (!url) return '';
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    return '';
  }

  function playYouTubeBackgroundMusic(url, autoPlay = true) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;
    currentYoutubeVideoId = videoId;
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    const mute = isAudioMuted ? 1 : 0;
    const playParam = autoPlay ? 1 : 0;
    container.innerHTML = `<iframe id="ytIframe" width="200" height="200" 
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${playParam}&loop=1&playlist=${videoId}&controls=0&mute=${mute}" 
      frameborder="0" allow="autoplay"></iframe>`;

    ytPlayerIframe = document.getElementById('ytIframe');
  }

  function toggleYouTubeAudioMute(isMuted) {
    if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;
    const command = isMuted ? 'mute' : 'unMute';
    try {
      ytPlayerIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    } catch (e) {
      console.warn('YouTube audio command postMessage exception:', e);
    }
  }

  // --- Audio Mute Toggle ---
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      video.muted = isAudioMuted;
      
      if (bgAudio) {
        if (isAudioMuted) {
          bgAudio.pause();
        } else {
          bgAudio.play().catch(() => {});
        }
      }

      toggleYouTubeAudioMute(isAudioMuted);

      if (isAudioMuted) {
        audioIconOn.classList.add('hidden');
        audioIconOff.classList.remove('hidden');
      } else {
        audioIconOn.classList.remove('hidden');
        audioIconOff.classList.add('hidden');
        initAudioContext();
      }
    });
  }

  // --- Map Modal Controls ---
  if (openMapBtn && mapModal) {
    openMapBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mapModal.classList.remove('hidden');
    });
  }
  if (closeMapModal && mapModal) {
    closeMapModal.addEventListener('click', () => mapModal.classList.add('hidden'));
  }

  // Close modals when clicking backdrop
  if (mapModal) {
    mapModal.addEventListener('click', (e) => {
      if (e.target === mapModal) {
        mapModal.classList.add('hidden');
      }
    });
  }

  // --- Add to Google Calendar ---
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent(`Wedding of Kanupriya & Shubham #KaShFoundLuv`);
      const details = encodeURIComponent(`Dear Friends and Family, With full hearts, we invite you to share in the joy of our wedding day. Come for the vows, stay for the laughter, and help us create memories to cherish forever.\n\nVenue: Ayatti By Caparo Group\nMaps: https://maps.app.goo.gl/PN91PauMW3FaKZwRA?g_st=ic`);
      const loc = encodeURIComponent(`Ayatti By Caparo Group, Lakhnawali, Knowledge Park V, Greater Noida, Uttar Pradesh`);

      // 21st November 2026, 5:00 PM IST (11:30 UTC)
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=20261121T113000Z/20261121T190000Z`;

      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================================================
  // HIGH-PERFORMANCE IDLE PREFETCH ENGINE & SERVICE WORKER
  // ==========================================================================
  
  // Register Service Worker for 0ms Repeat-Visit Loading
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('Service Worker registration skipped:', err);
      });
    });
  }
});

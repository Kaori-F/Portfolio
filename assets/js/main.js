// Main JavaScript for Crystal Shard Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio controls
    initAudio();
    
    // Initialize transition effects
    initTransition();
    
    // Initialize parallax effects
    initParallax();
});

// Audio Controls
function initAudio() {
    const audioToggle = document.getElementById('audio-toggle');
    const bgMusic = document.getElementById('background-music');
    
    // Set initial volume
    bgMusic.volume = 0.3;
    
    // Check if audio was previously playing (from localStorage)
    const audioState = localStorage.getItem('crystalShard_audioPlaying');
    
    // Update audio icon based on state
    updateAudioIcon(audioToggle, audioState === 'true');
    
    // If audio was playing, resume it (but only after user interaction)
    if (audioState === 'true') {
        // We need user interaction first
        const resumeAudio = () => {
            bgMusic.play()
                .then(() => {
                    audioToggle.classList.add('playing');
                })
                .catch(error => {
                    console.error('Audio playback failed:', error);
                });
            // Remove the event listener after first interaction
            document.removeEventListener('click', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio, { once: true });
    }
    
    // Toggle audio on/off
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering document click
        
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    audioToggle.classList.add('playing');
                    localStorage.setItem('crystalShard_audioPlaying', 'true');
                    updateAudioIcon(audioToggle, true);
                })
                .catch(error => {
                    console.error('Audio playback failed:', error);
                });
        } else {
            bgMusic.pause();
            audioToggle.classList.remove('playing');
            localStorage.setItem('crystalShard_audioPlaying', 'false');
            updateAudioIcon(audioToggle, false);
        }
    });
}

// Update audio icon based on state
function updateAudioIcon(audioToggle, isPlaying) {
    const audioIcon = audioToggle.querySelector('.audio-icon');
    
    if (isPlaying) {
        audioIcon.innerHTML = '♪';
        audioToggle.setAttribute('aria-label', 'Mute audio');
        audioToggle.classList.add('playing');
    } else {
        audioIcon.innerHTML = '♪';
        audioToggle.setAttribute('aria-label', 'Play audio');
        audioToggle.classList.remove('playing');
    }
}

// Transition Animation
function initTransition() {
    const enterLink = document.getElementById('enter-void');
    
    enterLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.classList.add('transition-overlay');
        document.body.appendChild(overlay);
        
        // Create glass shatter effect
        createShatterEffect(overlay);
        
        // Play sound effect
        const shatterSound = new Audio('assets/audio/glass-shatter.mp3');
        shatterSound.play();
        
        // Flash key visual
        const keyVisual = document.createElement('img');
        keyVisual.src = 'assets/images/key-visual.png';
        keyVisual.classList.add('key-visual');
        document.body.appendChild(keyVisual);
        
        // Animation sequence
        gsap.timeline()
            .to(overlay, { opacity: 1, duration: 0.3 })
            .to(keyVisual, { opacity: 1, duration: 0.1 })
            .to(keyVisual, { opacity: 0, duration: 0.4, delay: 0.5 })
            .call(() => {
                // Navigate to works page
                window.location.href = 'works.html';
            });
    });
}

// Create glass shatter effect
function createShatterEffect(container) {
    // Number of shards
    const shardCount = 20;
    
    // Create shards
    for (let i = 0; i < shardCount; i++) {
        const shard = document.createElement('div');
        shard.classList.add('glass-shard');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = 10 + Math.random() * 40;
        
        // Random rotation
        const rotation = Math.random() * 360;
        
        // Style the shard
        shard.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, 255, 255, 0.2);
            transform: rotate(${rotation}deg);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        `;
        
        container.appendChild(shard);
        
        // Animate the shard
        gsap.to(shard, {
            x: (Math.random() - 0.5) * window.innerWidth * 0.5,
            y: (Math.random() - 0.5) * window.innerHeight * 0.5,
            opacity: 0,
            scale: Math.random() * 2 + 1,
            duration: 1 + Math.random(),
            ease: 'power2.out'
        });
    }
}

// Parallax Effect
function initParallax() {
    const scene = document.querySelector('.scene');
    const stars = document.querySelector('.stars');
    const crystalShards = document.querySelector('.crystal-shards');
    
    // Create stars
    createStars(stars, 200);
    
    // Create crystal shards
    createCrystalShards(crystalShards, 15);
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Move stars slightly
        stars.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
        
        // Move crystal shards more noticeably
        crystalShards.style.transform = `translate(${-x * 40}px, ${-y * 40}px)`;
    });
}

// Create stars in the background
function createStars(container, count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 2;
        
        // Random opacity
        const opacity = 0.3 + Math.random() * 0.7;
        
        // Style the star
        star.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${opacity});
        `;
        
        container.appendChild(star);
        
        // Subtle twinkling animation
        gsap.to(star, {
            opacity: opacity * 0.5,
            duration: 1 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Create crystal shards in the background
function createCrystalShards(container, count) {
    for (let i = 0; i < count; i++) {
        const shard = document.createElement('div');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = 20 + Math.random() * 60;
        
        // Random rotation
        const rotation = Math.random() * 360;
        
        // Random opacity
        const opacity = 0.05 + Math.random() * 0.1;
        
        // Style the shard
        shard.style.cssText = `
            position: absolute;
            top: ${y}%;
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, rgba(255,255,255,${opacity}), rgba(100,200,255,${opacity}));
            transform: rotate(${rotation}deg);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            z-index: ${Math.floor(Math.random() * 5)};
        `;
        
        container.appendChild(shard);
        
        // Subtle floating animation
        gsap.to(shard, {
            y: `+=${Math.random() * 20 - 10}`,
            rotation: rotation + (Math.random() * 10 - 5),
            duration: 5 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

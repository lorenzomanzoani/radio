document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const audioPlayer = document.querySelector('.audio-player');
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el evento se propague
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        
        // Mostrar u ocultar el reproductor al abrir/cerrar el menú
        if (mainNav.classList.contains('active')) {
            audioPlayer.classList.remove('visible'); // Ocultar el reproductor
        } else {
            audioPlayer.classList.add('visible'); // Mostrar el reproductor
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            audioPlayer.classList.add('visible'); // Mostrar el reproductor
        }
    });

    // Evitar que el menú se cierre al hacer clic dentro
    mainNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Control de visibilidad al hacer scroll
    let lastScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        lastScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll(scrollPos) {
        const footer = document.querySelector('.main-footer');
        const footerRect = footer.getBoundingClientRect();
        const playerHeight = audioPlayer.offsetHeight;

        // Si el footer está visible en la pantalla (cerca del borde inferior)
        if (footerRect.top < window.innerHeight - playerHeight) {
            audioPlayer.classList.remove('visible'); // Ocultar el reproductor
        } else {
            audioPlayer.classList.add('visible'); // Mostrar el reproductor
        }
    }

    // Inicializar
    handleScroll(window.scrollY);
});
document.addEventListener('DOMContentLoaded', function() {
    // Channels Carousel        
    // Carousel Navigation
    const carousels = document.querySelectorAll('.channels-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.channels-track');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const channelCards = carousel.querySelectorAll('.channel-card');
        const cardWidth = channelCards[0].offsetWidth + 30; // width + gap
        
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    });

    // Audio Player
    const audioPlayer = document.querySelector('.audio-player');
    const audioElement = document.getElementById('audioElement');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
    const playButtons = document.querySelectorAll('.play-btn');
    const likeBtn = document.querySelector('.like-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeDisplay = document.querySelector('.current-time');
    const durationDisplay = document.querySelector('.duration');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeBtn = document.querySelector('.volume-btn');
    
    let isPlaying = false;
    let currentTrack = null;
    
    // Initialize player
    function initPlayer() {
        audioElement.volume = volumeSlider.value;
        updateVolumeIcon();
        
        // Simulate track duration
        durationDisplay.textContent = '3:45';
    }
    
    // Play/pause function
    function togglePlay() {
        if (isPlaying) {
            audioElement.pause();
            mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            document.querySelectorAll('.play-btn i').forEach(btn => {
                if (btn.classList.contains('fa-pause')) {
                    btn.classList.replace('fa-pause', 'fa-play');
                }
            });
        } else {
            audioElement.play();
            mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (currentTrack) {
                currentTrack.querySelector('.play-btn i').classList.replace('fa-play', 'fa-pause');
            }
            audioPlayer.classList.add('visible');
        }
        isPlaying = !isPlaying;
    }
    
    // Update progress bar
    function updateProgress() {
        const duration = 225; // 3:45 in seconds
        const currentTime = (progressFill.offsetWidth / progressBar.offsetWidth) * duration;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
    
    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Update volume icon based on volume level
    function updateVolumeIcon() {
        const volume = audioElement.volume;
        if (volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    // Event listeners
    mainPlayBtn.addEventListener('click', togglePlay);
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // If clicking on a channel card's play button
            if (this.closest('.channel-card')) {
                const card = this.closest('.channel-card');
                
                // Update current track info
                const img = card.querySelector('img').src;
                const title = card.querySelector('h3').textContent;
                const artist = card.querySelector('p').textContent;
                
                document.querySelector('.track-image img').src = img;
                document.querySelector('.track-title').textContent = title;
                document.querySelector('.track-artist').textContent = artist;
                
                currentTrack = card;
            }
            
            // If already playing this track, toggle play/pause
            if (currentTrack && this.closest('.channel-card') === currentTrack && isPlaying) {
                togglePlay();
            } else {
                // Otherwise, play the track
                if (!isPlaying) togglePlay();
            }
        });
    });
    
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('liked');
        this.innerHTML = this.classList.contains('liked') ? 
            '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });
    
    // Progress bar interaction
    progressBar.addEventListener('click', (e) => {
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const percentage = (clickPosition / progressBarWidth) * 100;
        progressFill.style.width = `${percentage}%`;
        updateProgress();
    });
    
    // Volume controls
    volumeSlider.addEventListener('input', () => {
        audioElement.volume = volumeSlider.value;
        updateVolumeIcon();
    });
    
    volumeBtn.addEventListener('click', () => {
        if (audioElement.volume > 0) {
            audioElement.volume = 0;
            volumeSlider.value = 0;
        } else {
            audioElement.volume = 0.7;
            volumeSlider.value = 0.7;
        }
        updateVolumeIcon();
    });
    
    // Initialize player
    initPlayer();
    
    // Simulate progress for demo purposes
    setInterval(() => {
        if (isPlaying) {
            const currentWidth = parseFloat(progressFill.style.width) || 0;
            const newWidth = (currentWidth + 0.2) % 100;
            progressFill.style.width = `${newWidth}%`;
            updateProgress();
        }
    }, 1000);
    
    // Show player when a track is selected
    if (currentTrack) {
        audioPlayer.classList.add('visible');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const audioPlayer = document.getElementById('audioPlayer');
    const footer = document.querySelector('.main-footer');
    const audioElement = document.getElementById('audioElement');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
    
    // Variables para control del player
    let isPlaying = false;
    
    // Mostrar player después de carga
    setTimeout(() => {
        audioPlayer.classList.add('visible');
    }, 2000);
    
    // Control de reproducción
    mainPlayBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioElement.pause();
            mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioElement.play();
            mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    
    // Control de visibilidad al hacer scroll
    let lastScrollPosition = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        lastScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll(scrollPos) {
        const footerRect = footer.getBoundingClientRect();
        const playerHeight = audioPlayer.offsetHeight;
        
        // Si el footer está visible en la pantalla (cerca del borde inferior)
        if (footerRect.top < window.innerHeight - playerHeight) {
            audioPlayer.classList.remove('visible');
        } else {
            // Solo mostrar si el scroll es hacia arriba o si estamos lejos del footer
            audioPlayer.classList.add('visible');
        }
    }
    
    // Inicializar
    handleScroll(window.scrollY);
});
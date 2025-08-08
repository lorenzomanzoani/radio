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
        e.stopPropagation();
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        
        if (mainNav.classList.contains('active')) {
            audioPlayer.classList.remove('visible');
        } else {
            audioPlayer.classList.add('visible');
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            audioPlayer.classList.add('visible');
        }
    });

    mainNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Control de visibilidad del player al hacer scroll
    let lastScrollPosition = window.scrollY;
    let isScrollingDown = false;
    let playerVisible = true;

    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.scrollY;
        isScrollingDown = currentScrollPosition > lastScrollPosition;
        lastScrollPosition = currentScrollPosition;
        
        const footer = document.querySelector('.main-footer');
        const footerRect = footer.getBoundingClientRect();
        const playerHeight = audioPlayer.offsetHeight;

        // Si estamos cerca del footer, ocultar el player
        if (footerRect.top < window.innerHeight - playerHeight) {
            audioPlayer.classList.remove('visible');
            playerVisible = false;
        } 
        // Si no estamos cerca del footer
        else {
            // Si el scroll es hacia arriba, mostrar el player
            if (!isScrollingDown && !playerVisible) {
                audioPlayer.classList.add('visible');
                playerVisible = true;
            }
            // Si el scroll es hacia abajo, ocultar el player
            else if (isScrollingDown && playerVisible) {
                audioPlayer.classList.remove('visible');
                playerVisible = false;
            }
        }
    });

    // Channels Carousel        
    const carousels = document.querySelectorAll('.channels-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.channels-track');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const channelCards = carousel.querySelectorAll('.channel-card');
        const cardWidth = channelCards[0].offsetWidth + 30;
        
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    });

    // Audio Player
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
    
    function initPlayer() {
        audioElement.volume = volumeSlider.value;
        updateVolumeIcon();
        durationDisplay.textContent = '3:45';
    }
    
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
            playerVisible = true;
        }
        isPlaying = !isPlaying;
    }
    
    function updateProgress() {
        const duration = 225;
        const currentTime = (progressFill.offsetWidth / progressBar.offsetWidth) * duration;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
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
    
    mainPlayBtn.addEventListener('click', togglePlay);
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.closest('.channel-card')) {
                const card = this.closest('.channel-card');
                const img = card.querySelector('img').src;
                const title = card.querySelector('h3').textContent;
                const artist = card.querySelector('p').textContent;
                
                document.querySelector('.track-image img').src = img;
                document.querySelector('.track-title').textContent = title;
                document.querySelector('.track-artist').textContent = artist;
                
                currentTrack = card;
            }
            
            if (currentTrack && this.closest('.channel-card') === currentTrack && isPlaying) {
                togglePlay();
            } else {
                if (!isPlaying) togglePlay();
            }
        });
    });
    
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('liked');
        this.innerHTML = this.classList.contains('liked') ? 
            '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });
    
    progressBar.addEventListener('click', (e) => {
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const percentage = (clickPosition / progressBarWidth) * 100;
        progressFill.style.width = `${percentage}%`;
        updateProgress();
    });
    
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
    
    initPlayer();
    
    setInterval(() => {
        if (isPlaying) {
            const currentWidth = parseFloat(progressFill.style.width) || 0;
            const newWidth = (currentWidth + 0.2) % 100;
            progressFill.style.width = `${newWidth}%`;
            updateProgress();
        }
    }, 1000);
});
document.addEventListener('DOMContentLoaded', function() {
            const audioSynth = document.getElementById('audio-synth');
            const player = document.getElementById('player');
            const playerImage = document.getElementById('player-image');
            const playerTitle = document.getElementById('player-title');
            const playerChannel = document.getElementById('player-channel');
            const playerMainBtn = document.getElementById('player-main-btn');
            
            let currentPlayingCard = null;
            let isPlaying = false;
            
            // Función para reproducir canal
            function playChannel(card) {
                // Detener reproducción actual
                if (currentPlayingCard) {
                    const currentBtn = currentPlayingCard.querySelector('.play-btn i');
                    currentBtn.classList.remove('fa-pause');
                    currentBtn.classList.add('fa-play');
                }
                
                // Actualizar estado
                currentPlayingCard = card;
                isPlaying = true;
                
                // Actualizar botón de la tarjeta
                const playBtn = card.querySelector('.play-btn i');
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
                
                // Actualizar player
                playerImage.src = card.querySelector('.show-image').src;
                playerTitle.textContent = card.dataset.title;
                playerChannel.textContent = card.dataset.description;
                
                // Actualizar botón del player
                playerMainBtn.innerHTML = '<i class="fas fa-pause"></i>';
                
                // Reproducir audio sintetizado
                audioSynth.play();
            }
            
            // Función para pausar canal
            function pauseChannel() {
                if (!currentPlayingCard) return;
                
                isPlaying = false;
                
                // Actualizar botón de la tarjeta
                const playBtn = currentPlayingCard.querySelector('.play-btn i');
                playBtn.classList.remove('fa-pause');
                playBtn.classList.add('fa-play');
                
                // Actualizar botón del player
                playerMainBtn.innerHTML = '<i class="fas fa-play"></i>';
                
                // Pausar audio
                audioSynth.pause();
            }
            
            // Event listeners para los botones de play
            document.querySelectorAll('.play-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const card = this.closest('.show-card');
                    
                    if (currentPlayingCard === card && isPlaying) {
                        pauseChannel();
                    } else {
                        playChannel(card);
                    }
                });
            });
            
            // Event listener para el botón principal del player
            playerMainBtn.addEventListener('click', function() {
                if (isPlaying) {
                    pauseChannel();
                } else if (currentPlayingCard) {
                    playChannel(currentPlayingCard);
                }
            });
            
            // Control de volumen
            const volumeSlider = document.getElementById('volume-slider');
            const volumeIcon = document.getElementById('volume-icon');
            
            // Configurar volumen inicial
            audioSynth.volume = 0.7;
            
            // Control de volumen
            volumeSlider.addEventListener('input', function() {
                audioSynth.volume = this.value;
                
                // Cambiar icono según el volumen
                if (this.value == 0) {
                    volumeIcon.className = 'fas fa-volume-mute volume-icon';
                } else if (this.value < 0.5) {
                    volumeIcon.className = 'fas fa-volume-down volume-icon';
                } else {
                    volumeIcon.className = 'fas fa-volume-up volume-icon';
                }
            });
            
            // Click en el icono para silenciar/reactivar
            volumeIcon.addEventListener('click', function() {
                if (audioSynth.volume > 0) {
                    audioSynth.volume = 0;
                    volumeSlider.value = 0;
                    volumeIcon.className = 'fas fa-volume-mute volume-icon';
                } else {
                    audioSynth.volume = 0.7;
                    volumeSlider.value = 0.7;
                    volumeIcon.className = 'fas fa-volume-up volume-icon';
                }
            });
            
            // Navegación del carrusel mejorada
            document.querySelectorAll('.carousel-nav.left').forEach(nav => {
                nav.addEventListener('click', function() {
                    const container = this.nextElementSibling;
                    const scrollAmount = window.innerWidth <= 768 ? 150 : 220;
                    container.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                });
                
                // Soporte para touch
                nav.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    const container = this.nextElementSibling;
                    const scrollAmount = window.innerWidth <= 768 ? 150 : 220;
                    container.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                });
            });

            document.querySelectorAll('.carousel-nav.right').forEach(nav => {
                nav.addEventListener('click', function() {
                    const container = this.previousElementSibling;
                    const scrollAmount = window.innerWidth <= 768 ? 150 : 220;
                    container.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
                
                // Soporte para touch
                nav.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    const container = this.previousElementSibling;
                    const scrollAmount = window.innerWidth <= 768 ? 150 : 220;
                    container.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
            });
            
            // Control de la pantalla de carga
            const loadingScreen = document.getElementById('loadingScreen');
            
            // Simular tiempo de carga
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                
                // Eliminar completamente después de la animación
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000); // 2 segundos de pantalla de carga
            
            // Mostrar pantalla de carga al recargar
            window.addEventListener('beforeunload', function() {
                loadingScreen.style.display = 'flex';
                loadingScreen.classList.remove('hidden');
            });
        });
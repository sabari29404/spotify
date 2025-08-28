console.log("Welcome to Spotify");

        // Initialize variables
        let songIndex = 0;
        let audioElement = new Audio();
        let masterPlay = document.getElementById('masterPlay');
        let myProgressBar = document.getElementById('myProgressBar');
        let gif = document.getElementById('gif');
        let masterSongName = document.getElementById('masterSongName');
        let songs = [];
        let isPlaying = false;

        // Function to discover songs in the songs folder
        async function discoverSongs() {
            const songFiles = [
                '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3',
                '6.mp3', '7.mp3', '8.mp3', '9.mp3', '10.mp3'
            ];
            
            const defaultSongs = [
                "Warriyo - Mortals [NCS Release]",
                "Cielo - Huma-Huma", 
                "DEAF KEV - Invincible [NCS Release]",
                "Different Heaven & EH!DE - My Heart [NCS Release]",
                "Janji-Heroes-Tonight-feat-Johnning-NCS-Release",
                "Rabba - Salam-e-Ishq",
                "Sakhiyaan - Salam-e-Ishq", 
                "Bhula Dena - Salam-e-Ishq",
                "Tumhari Kasam - Salam-e-Ishq",
                "Na Jaana - Salam-e-Ishq"
            ];

            const validSongs = [];
            
            for (let i = 0; i < songFiles.length; i++) {
                const filePath = `songs/${songFiles[i]}`;
                try {
                    // Test if the audio file exists and is valid
                    const audio = new Audio(filePath);
                    await new Promise((resolve, reject) => {
                        audio.addEventListener('canplaythrough', resolve, { once: true });
                        audio.addEventListener('error', reject, { once: true });
                        audio.preload = 'metadata';
                        audio.load();
                    });
                    
                    validSongs.push({
                        songName: defaultSongs[i] || `Song ${i + 1}`,
                        filePath: filePath,
                        coverPath: `covers/${i + 1}.jpg`
                    });
                } catch (error) {
                    console.log(`Song ${songFiles[i]} not found or invalid`);
                }
            }
            
            return validSongs;
        }

        // Function to create song list UI
        function createSongList(songArray) {
            const container = document.getElementById('songContainer');
            container.innerHTML = '';
            
            songArray.forEach((song, index) => {
                const songItem = document.createElement('div');
                songItem.className = 'songItem';
                songItem.innerHTML = `
                    <img src="${song.coverPath}" alt="Album Cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIiByeD0iMjAiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0idHJhbnNmb3JtOiB0cmFuc2xhdGUoMTBweCwgMTBweCkiPgo8cGF0aCBkPSJNOSAxMlY2TDE1IDl2NkwxMiAxNVY5TDYgMTJWNkwxMiA5VjNMNiA2VjEySDE1VjZMMTIgOVYxNVoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cjwvc3ZnPg=='">
                    <span class="songName">${song.songName}</span>
                    <span class="songlistplay">
                        <span class="timestamp">
                            <i id="${index}" class="songItemPlay play-icon">▶️</i>
                        </span>
                    </span>
                `;
                container.appendChild(songItem);
            });
            
            // Add event listeners to play buttons
            document.querySelectorAll('.songItemPlay').forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedIndex = parseInt(e.target.id);
                    
                    if (songIndex === clickedIndex && isPlaying) {
                        pauseSong();
                    } else {
                        playSong(clickedIndex);
                    }
                });
            });
        }

        // Function to play a song
        function playSong(index) {
            if (songs.length === 0) return;
            
            songIndex = index;
            const song = songs[songIndex];
            
            // Update UI
            updatePlayButtons();
            document.getElementById(songIndex.toString()).textContent = '⏸️';
            
            // Set audio source and play
            audioElement.src = song.filePath;
            masterSongName.textContent = song.songName;
            audioElement.currentTime = 0;
            
            audioElement.play().then(() => {
                isPlaying = true;
                masterPlay.textContent = '⏸️';
                gif.style.opacity = 1;
            }).catch(error => {
                console.error('Error playing audio:', error);
                alert(`Cannot play ${song.songName}. File may be missing or corrupted.`);
                resetUI();
            });
        }

        // Function to pause song
        function pauseSong() {
            audioElement.pause();
            isPlaying = false;
            masterPlay.textContent = '▶️';
            gif.style.opacity = 0;
            updatePlayButtons();
        }

        // Function to update play buttons
        function updatePlayButtons() {
            document.querySelectorAll('.songItemPlay').forEach((button, index) => {
                button.textContent = '▶️';
            });
        }

        // Function to reset UI
        function resetUI() {
            isPlaying = false;
            masterPlay.textContent = '▶️';
            gif.style.opacity = 0;
            updatePlayButtons();
        }

        // Master play button event
        masterPlay.addEventListener('click', () => {
            if (songs.length === 0) return;
            
            if (isPlaying) {
                pauseSong();
            } else {
                if (audioElement.src) {
                    audioElement.play().then(() => {
                        isPlaying = true;
                        masterPlay.textContent = '⏸️';
                        gif.style.opacity = 1;
                        document.getElementById(songIndex.toString()).textContent = '⏸️';
                    }).catch(error => {
                        console.error('Error playing audio:', error);
                    });
                } else {
                    playSong(0);
                }
            }
        });

        // Progress bar event
        audioElement.addEventListener('timeupdate', () => {
            if (audioElement.duration) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                myProgressBar.value = progress;
            }
        });

        myProgressBar.addEventListener('input', () => {
            if (audioElement.duration) {
                audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
            }
        });

        // Next button
        document.getElementById('next').addEventListener('click', () => {
            if (songs.length === 0) return;
            
            songIndex = (songIndex + 1) % songs.length;
            playSong(songIndex);
        });

        // Previous button
        document.getElementById('previous').addEventListener('click', () => {
            if (songs.length === 0) return;
            
            songIndex = songIndex === 0 ? songs.length - 1 : songIndex - 1;
            playSong(songIndex);
        });

        // Auto play next song
        audioElement.addEventListener('ended', () => {
            songIndex = (songIndex + 1) % songs.length;
            playSong(songIndex);
        });

        // Initialize the app
        async function initializeApp() {
            try {
                document.getElementById('loading').textContent = 'Scanning for music files...';
                songs = await discoverSongs();
                
                if (songs.length > 0) {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('songContainer').style.display = 'block';
                    createSongList(songs);
                    console.log(`Found ${songs.length} songs:`, songs.map(s => s.songName));
                } else {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('errorMsg').style.display = 'block';
                    console.log('No valid audio files found in songs folder');
                }
            } catch (error) {
                console.error('Error initializing app:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('errorMsg').style.display = 'block';
            }
        }

        // Start the app
        initializeApp();
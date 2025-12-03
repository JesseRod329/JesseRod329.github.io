const mood = document.getElementById('mood');
const duration = document.getElementById('duration');
const genre = document.getElementById('genre');
const matchBtn = document.getElementById('matchBtn');
const recommendations = document.getElementById('recommendations');

const musicLibrary = {
    energetic: ['Upbeat Electronic', 'Power Rock', 'High Energy Pop'],
    calm: ['Ambient Soundscape', 'Soft Piano', 'Gentle Acoustic'],
    dramatic: ['Epic Orchestral', 'Cinematic Strings', 'Tense Build-up'],
    upbeat: ['Happy Pop', 'Cheerful Acoustic', 'Light Electronic'],
    melancholic: ['Sad Piano', 'Emotional Strings', 'Mellow Acoustic']
};

function findMusic() {
    const selectedMood = mood.value;
    const selectedGenre = genre.value;
    const videoDuration = parseInt(duration.value);
    
    const tracks = musicLibrary[selectedMood] || musicLibrary.energetic;
    
    recommendations.innerHTML = tracks.map((track, i) => {
        const trackDuration = videoDuration + (i * 5);
        return `
            <div class="track-item">
                <div class="track-info">
                    <div class="track-name">${track}</div>
                    <div class="track-details">
                        Genre: ${selectedGenre} • Duration: ${trackDuration}s • Mood: ${selectedMood}
                    </div>
                </div>
                <button class="select-btn">Select</button>
            </div>
        `;
    }).join('');
}

matchBtn.addEventListener('click', findMusic);


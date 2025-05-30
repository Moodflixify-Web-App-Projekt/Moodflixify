const moodConfig = {
    Happy: {
        tmdbMovieGenres: '35,10402', // Comedy, Musical
        tmdbSeriesGenres: '35,10751', // Comedy, Family
        spotifyQuery: 'happy upbeat pop',
    },
    Sad: {
        tmdbMovieGenres: '18', // Drama
        tmdbSeriesGenres: '18', // Drama
        spotifyQuery: 'sad acoustic slow',
    },
    Angry: {
        tmdbMovieGenres: '28,53', // Action, Thriller
        tmdbSeriesGenres: '80,9648', // Crime, Mystery
        spotifyQuery: 'angry rock intense',
    },
    Relaxed: {
        tmdbMovieGenres: '99,10751', // Documentary, Family
        tmdbSeriesGenres: '10762,10766', // Kids, Soap
        spotifyQuery: 'chill ambient relaxing',
    },
    Stressed: {
        tmdbMovieGenres: '12,14', // Adventure, Fantasy
        tmdbSeriesGenres: '10759,10765', // Action & Adventure, Sci-Fi & Fantasy
        spotifyQuery: 'motivational upbeat energetic',
    },
};

module.exports = moodConfig;
function MovieCard({ item, type }) {
    // Base URL for TMDB images
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
    // Choose a smaller size, e.g., 'w342', 'w185', 'w92'
    const IMAGE_SIZE = 'w200';

    // Construct the image URL based on type
    const imageUrl = (type === 'movie' || type === 'series') && item.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZE}${item.poster_path}`
        : (type === 'song' && item.album_image_url)
            ? item.album_image_url
            : null;

    return (
        <div className="movie-card">
            <div className="movie-card-image-wrapper">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>No Image Available</span>
                )}
            </div>
            <h3 className="text-lg font-bold">{item.title || item.name}</h3>
            {type === 'song' && item.artists && item.artists.length > 0 && (
                <p className="text-sm text-gray-300">Artist: {item.artists.join(', ')}</p>
            )}
            {(type === 'movie' || type === 'series') && item.director && ( // UPDATED: Display director for both movies and series
                <p className="text-sm text-gray-300">Director: {item.director}</p>
            )}
            <p>Mood: {item.mood}</p>
        </div>
    );
}

export default MovieCard;
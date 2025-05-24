function MovieCard({ item, type }) {
    // Base URL for TMDB images
    const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
    // Choose a smaller size, e.g., 'w342', 'w185', 'w92'
    const IMAGE_SIZE = 'w200';

    // Construct the image URL based on type
    const imageUrl = (type === 'movie' || type === 'series') && item.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZE}${item.poster_path}`
        : (type === 'song' && item.album && item.album.images && item.album.images.length > 0)
            ? item.album.images[0].url || (item.album.images[1] ? item.album.images[1].url : null)
            : null;

    return (
        <div className="movie-card">
            <div className="h-48 bg-gray-700 mb-2 flex items-center justify-center text-gray-400 text-lg overflow-hidden">
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
            {type === 'song' && <p className="text-sm text-gray-300">Artist: {item.artist}</p>}
            <p>Mood: {item.mood}</p>
        </div>
    );
}

export default MovieCard;
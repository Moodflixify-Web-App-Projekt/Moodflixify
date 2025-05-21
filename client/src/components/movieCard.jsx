function MovieCard({ item, type }) {
    return (
        <div className="movie-card">
            <div className="h-48 bg-gray-700 mb-2 flex items-center justify-center text-gray-400 text-lg">
            </div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            {type === 'song' && <p className="text-sm text-gray-300">Artist: {item.artist}</p>}
            <p className="text-sm text-gray-400">Mood: {item.mood}</p>
        </div>
    );
}

export default MovieCard;
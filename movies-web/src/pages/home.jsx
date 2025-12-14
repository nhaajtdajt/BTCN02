import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Body() {
    // Placeholder data - sẽ thay bằng API sau
    const featuredMovie = {
        title: "Sherlock Jr.",
        poster: "https://picsum.photos/300/450?random=1"
    };

    const mostPopularMovies = [
        { id: 1, poster: "https://picsum.photos/280/400?random=2" },
        { id: 2, poster: "https://picsum.photos/280/400?random=3" },
        { id: 3, poster: "https://picsum.photos/280/400?random=4" }
    ];

    const topRatingMovies = [
        { id: 4, poster: "https://picsum.photos/280/400?random=5" },
        { id: 5, poster: "https://picsum.photos/280/400?random=6" },
        { id: 6, poster: "https://picsum.photos/280/400?random=7" }
    ];

    return (
        <main className="w-[1200px] bg-white p-6 mt-1 min-h-[670px]">
            {/* Featured Movie Banner */}
            <section className="mb-8">
                <div className="relative flex justify-center items-center">
                    <button className="absolute left-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronLeft size={32} />
                    </button>

                    <div className="flex justify-center items-center h-[400px]">
                        <img
                            src={featuredMovie.poster}
                            alt={featuredMovie.title}
                            className="h-full object-cover rounded shadow-xl"
                        />
                    </div>

                    <button className="absolute right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronRight size={32} />
                    </button>
                </div>
            </section>

            {/* Most Popular Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Most Popular</h2>
                <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex justify-center gap-4 px-12">
                        {mostPopularMovies.map(movie => (
                            <div key={movie.id} className="flex-shrink-0">
                                <img
                                    src={movie.poster}
                                    alt={`Movie ${movie.id}`}
                                    className="w-[280px] h-[180px] object-cover rounded shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            {/* Top Rating Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Top Rating</h2>
                <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex justify-center gap-4 px-12">
                        {topRatingMovies.map(movie => (
                            <div key={movie.id} className="flex-shrink-0">
                                <img
                                    src={movie.poster}
                                    alt={`Movie ${movie.id}`}
                                    className="w-[280px] h-[180px] object-cover rounded shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>
        </main>
    )
}
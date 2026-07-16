import { articles } from '../data/articles';

export function Blog() {
  return (
    <div className="bg-[#F8F6F4] min-h-screen">
      {/* Featured Article */}
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <img 
          src="/assets/generated/blog-hero.png" 
          alt="The Power of Niacinamide" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-24">
          <div className="max-w-2xl text-white">
            <span className="bg-white text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-6">
              Featured — Ingredients
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif mb-6 leading-tight">
              The Power of Niacinamide:<br/>Fading Dark Spots and Beyond
            </h1>
            <p className="text-sm tracking-wider font-serif italic text-gray-300">
              By Dr. Sarah Jenkins | July 1, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Latest Editorials */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex justify-between items-center border-b border-border pb-6 mb-12">
          <h2 className="text-2xl font-serif">Latest Editorials</h2>
          <span className="text-xs text-muted font-serif italic">Lumenora Beauty</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-16">
          {articles.map((article, index) => (
            <div key={article.id} className={`flex flex-col group ${index === 0 ? 'col-span-1 md:col-span-2' : ''}`}>
              <div className="overflow-hidden bg-gray-100 mb-6 aspect-video">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                {article.category}
              </p>
              <h3 className={`font-serif ${index === 0 ? 'text-3xl' : 'text-2xl'} mb-4 group-hover:underline`}>
                {article.title}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                BY {article.author} • {article.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


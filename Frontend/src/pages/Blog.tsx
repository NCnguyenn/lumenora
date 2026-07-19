import { articles } from '../data/articles';

export function Blog() {
  return (
    <div className="bg-[#F8F6F4] min-h-screen font-sans text-[#1A1A1A] pb-0">
      {/* Sub Navigation */}
      <div className="border-b border-[#E5E0D8] bg-[#F8F6F4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 h-12 flex items-center gap-8 md:gap-12 overflow-x-auto hide-scrollbar">
          {['LATEST', 'INGREDIENTS', 'ROUTINES', 'SKIN HEALTH', 'SUNCARE', 'BODY'].map(item => (
            <a key={item} href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] whitespace-nowrap hover:text-[#4A5240] transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-[50vh] md:h-[70vh]">
          <img 
            src="/assets/generated/blog-hero.png" 
            alt="The Power of Niacinamide" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 bg-[#3A1E14] text-[#F8F6F4] px-10 md:px-16 lg:px-24 py-16 md:py-0 flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-8 opacity-80">
            THE LUMENORA JOURNAL
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight max-w-lg">
            The Quiet Science<br/>of a Stronger<br/>Skin Barrier
          </h1>
          <p className="text-[15px] font-medium leading-relaxed mb-10 max-w-md opacity-90">
            Explore the biology behind resilient skin, the everyday habits that help, and the rituals that support lasting strength.
          </p>
          <div>
            <button className="border border-[#F8F6F4]/30 hover:bg-[#F8F6F4] hover:text-[#3A1E14] px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors">
              READ THE STORY
            </button>
          </div>
        </div>
      </section>

      {/* Latest Stories */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-28">
        <div className="flex justify-between items-center border-b border-[#E5E0D8] pb-4 mb-12">
          <h2 className="text-xl md:text-2xl font-serif text-[#1A1A1A]">LATEST STORIES</h2>
          <a href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-70 flex items-center gap-2">
            VIEW ALL STORIES <span>→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Article */}
          <div className="flex flex-col group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-200">
              <img src="/assets/generated/blog-editorial-1.png" alt="Snail Mucin" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif mb-4 leading-tight group-hover:text-[#4A5240] transition-colors">
              Why Snail Mucin is the Skincare<br/>Ingredient You Can't Ignore
            </h3>
            <p className="text-[14px] text-gray-600 mb-6 max-w-md leading-relaxed">
              The remarkable ingredient packed with peptides, glycoproteins, and hydrating compounds.
            </p>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">READ MORE →</span>
          </div>

          {/* Grid of 4 Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square overflow-hidden mb-4 bg-[#EAE6DF] flex items-center justify-center p-4">
                <img src="/assets/generated/product-cleanser.png" alt="Double Cleansing" className="h-[90%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-[17px] font-serif mb-3 leading-snug group-hover:text-[#4A5240]">The Ultimate Guide<br/>to Double Cleansing</h4>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-auto">READ MORE →</span>
            </div>
            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square overflow-hidden mb-4 bg-[#EAE6DF] flex items-center justify-center p-4">
                <img src="/assets/generated/product-serum.png" alt="Skin Barrier" className="h-[90%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-[17px] font-serif mb-3 leading-snug group-hover:text-[#4A5240]">How to Repair a<br/>Damaged Skin Barrier</h4>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-auto">READ MORE →</span>
            </div>
            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square overflow-hidden mb-4 bg-gray-200">
                <img src="/assets/generated/blog-editorial-4.png" alt="Deep Hydration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-[17px] font-serif mb-3 leading-snug group-hover:text-[#4A5240]">Building a Deep<br/>Hydration Routine for<br/>Dry Skin</h4>
              <p className="text-[13px] text-gray-600 mb-4 line-clamp-2">Layering ingredients that attract, hold, and seal in lasting moisture.</p>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-auto">READ MORE →</span>
            </div>
            <div className="flex flex-col group cursor-pointer">
              <div className="aspect-square overflow-hidden mb-4 bg-[#EAE6DF] flex items-center justify-center p-4">
                <img src="/assets/generated/product-moisturizer.png" alt="Luna Cream" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Index */}
      <section className="bg-[#4A5240] text-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex justify-between items-center border-b border-[#5A634E] pb-4 mb-10">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase">INGREDIENT INDEX</h2>
            <a href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-70 flex items-center gap-2">
              EXPLORE ALL INGREDIENTS <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { name: 'MUGWORT', img: '/assets/generated/blog-editorial-3.png' },
              { name: 'SNAIL MUCIN', img: '/assets/generated/blog-editorial-1.png' },
              { name: 'VOLCANIC CLAY', img: '/assets/generated/home-composition-mask.jpg' },
              { name: 'BIRCH', img: '/assets/generated/blog-editorial-5.png' }
            ].map(item => (
              <div key={item.name} className="flex flex-col group cursor-pointer">
                <div className="aspect-square overflow-hidden mb-4 bg-[#3A4032]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" />
                </div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routine Desk */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-28">
        <div className="flex justify-between items-center border-b border-[#E5E0D8] pb-4 mb-12">
          <h2 className="text-xl md:text-2xl font-serif text-[#1A1A1A]">ROUTINE DESK</h2>
          <a href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-70 flex items-center gap-2">
            BUILD YOUR ROUTINE <span>→</span>
          </a>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-1/2 aspect-[4/3] lg:aspect-auto relative bg-[#EAE6DF]">
            <img src="/assets/generated/home-daily-edit.jpg" alt="Routine Products" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          
          <div className="lg:w-1/2 flex flex-col md:flex-row gap-12 md:gap-16">
            {/* Morning */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex items-center gap-3 text-[#4A5240] border-b border-[#E5E0D8] pb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">MORNING</h3>
              </div>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Cleanse', desc: 'Gentle start to remove impurities.' },
                  { step: 2, title: 'Treat', desc: 'Target and support skin goals.' },
                  { step: 3, title: 'Moisturize', desc: 'Hydrate and nourish deeply.' },
                  { step: 4, title: 'Protect', desc: 'Shield with broad-spectrum SPF.' }
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full border border-[#D8D3CC] flex items-center justify-center text-[10px] font-serif shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <h4 className="text-[13px] text-[#1A1A1A] font-medium mb-1">{item.title}</h4>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Evening */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex items-center gap-3 text-[#4A5240] border-b border-[#E5E0D8] pb-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">EVENING</h3>
              </div>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Cleanse', desc: 'Melt away the day thoroughly.' },
                  { step: 2, title: 'Treat', desc: 'Repair and restore overnight.' },
                  { step: 3, title: 'Moisturize', desc: 'Replenish and strengthen.' },
                  { step: 4, title: 'Rest', desc: 'Support skin\'s natural renewal.' }
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full border border-[#D8D3CC] flex items-center justify-center text-[10px] font-serif shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <h4 className="text-[13px] text-[#1A1A1A] font-medium mb-1">{item.title}</h4>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Most Read & Editor's Shelf */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-24 border-t border-[#E5E0D8]">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-1/3">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-8 border-b border-[#E5E0D8] pb-4">MOST READ</h2>
            <div className="flex flex-col gap-6">
              {[
                { num: '01', title: 'Why Snail Mucin is the Skincare Ingredient You Can\'t Ignore' },
                { num: '02', title: 'The Ultimate Guide to Double Cleansing' },
                { num: '03', title: 'How to Repair a Damaged Skin Barrier' },
                { num: '04', title: 'Building a Deep Hydration Routine for Dry Skin' },
                { num: '05', title: 'Understanding Ceramides: The Barrier\'s Best Friend' }
              ].map(item => (
                <a key={item.num} href="#" className="flex gap-4 group">
                  <span className="text-[15px] font-serif text-gray-400 group-hover:text-[#4A5240] transition-colors">{item.num}</span>
                  <p className="text-[13px] font-serif leading-snug group-hover:underline text-[#1A1A1A]">{item.title}</p>
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center border-b border-[#E5E0D8] pb-4 mb-8">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">THE EDITOR'S SHELF</h2>
              <a href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase hover:opacity-70 flex items-center gap-2">
                SHOP ALL <span>→</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col group cursor-pointer">
                <div className="aspect-square bg-[#EAE6DF] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#3A1E14]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/assets/generated/product-serum.png" alt="Serum" className="h-[90%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-[12px] font-medium leading-snug mb-1">LUNA Advanced Snail Mucin 96% Power Repairing Essence Serum</h4>
                <p className="text-[12px] font-bold mt-1">$18.50</p>
              </div>
              <div className="flex flex-col group cursor-pointer">
                <div className="aspect-square bg-[#EAE6DF] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#3A1E14]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/assets/generated/product-moisturizer.png" alt="Cream" className="w-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-[12px] font-medium leading-snug mb-1">LUNA Peptide Rich Cream Firming & Elasticity Support</h4>
                <p className="text-[12px] font-bold mt-1">$110.00</p>
              </div>
              <div className="flex flex-col group cursor-pointer">
                <div className="aspect-square bg-[#EAE6DF] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#3A1E14]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/assets/generated/product-sunscreen.png" alt="Perfume" className="h-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-[12px] font-medium leading-snug mb-1">NOCTIS Eau de Parfum Warm, Woody & Sensual</h4>
                <p className="text-[12px] font-bold mt-1">$120.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#2D2A26] text-white py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A67B5B] mb-2">NOTES FROM THE BEAUTY DESK</p>
            <h3 className="text-2xl md:text-3xl font-serif">Thoughtful rituals. Relevant insights.<br/>Delivered to your inbox.</h3>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border border-[#4A4843] px-6 py-4 text-[13px] text-white outline-none focus:border-white w-full sm:w-64 transition-colors"
            />
            <button className="bg-white text-[#2D2A26] px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors shrink-0">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

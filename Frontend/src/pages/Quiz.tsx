import { useState, useEffect } from 'react';

const QUESTIONS = [
  {
    id: 1,
    title: 'How does your skin usually feel by midday?',
    type: 'cards',
    options: [
      { id: 'BALANCED', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
      { id: 'DRY OR TIGHT', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
      { id: 'OILY', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
      { id: 'COMBINATION', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg> }
    ]
  },
  {
    id: 2,
    title: 'What would you like to focus on?',
    type: 'image-grid',
    options: [
      { id: 'DEHYDRATION', img: '/assets/generated/blog-editorial-2.png' },
      { id: 'SENSITIVITY', img: '/assets/generated/home-composition-mask.jpg' },
      { id: 'DULLNESS', img: '/assets/generated/blog-editorial-5.png' },
      { id: 'TEXTURE', img: '/assets/generated/home-contents-body.jpg' },
      { id: 'BREAKOUTS', img: '/assets/generated/home-ritual-cleanse.jpg' },
      { id: 'FINE LINES', img: '/assets/generated/home-journal-primary.jpg' }
    ]
  },
  {
    id: 3,
    title: 'How would you describe your environment?',
    type: 'cards',
    options: [
      { id: 'CITY / POLLUTION', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M13 3l8 4v14M9 9v2M9 13v2M9 17v2M15 11v2M15 15v2M15 19v2"/></svg> },
      { id: 'SUN & HEAT', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
      { id: 'COLD & DRY', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M22 12H2M19 7l-5 5-5-5M19 17l-5-5-5 5"/></svg> },
      { id: 'INDOORS', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg> }
    ]
  }
];

export function Quiz() {
  const [step, setStep] = useState(0); // 0 = landing, 1-3 = questions, 4 = result, 5 = analyzing
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStart = () => {
    setStep(1);
    setAnswers({});
  };

  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleContinue = () => {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Simulate analysis
      setStep(5); // Analyzing state
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(4); // Result state
      }, 2000);
    }
  };

  const currentQuestion = step > 0 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  // Determine products based on answers
  const getRitual = () => {
    const skinFeel = answers[1] || 'BALANCED';
    const focus = answers[2] || 'HYDRATION';
    
    // Base products
    const ritual = [
      {
        step: '01', name: 'Cleanse',
        title: skinFeel === 'OILY' ? 'Deep Purifying Gel' : 'Gentle Milk Cleanser',
        desc: 'Remove impurities without disrupting your skin barrier.',
        price: '$38.00', img: '/assets/generated/product-cleanser.png'
      },
      {
        step: '02', name: 'Treat',
        title: focus === 'BREAKOUTS' || focus === 'TEXTURE' ? 'Clarifying BHA Liquid' : 'Advanced Repairing Essence',
        desc: 'Target concerns and support skin balance.',
        price: '$64.00', img: focus === 'DEHYDRATION' || focus === 'DULLNESS' ? '/assets/generated/product-toner.png' : '/assets/generated/product-serum.png'
      },
      {
        step: '03', name: 'Moisturize',
        title: skinFeel === 'DRY OR TIGHT' ? 'Intense Rich Cream' : 'Lightweight Water Gel',
        desc: 'Hydrate and nourish deeply for a healthy glow.',
        price: '$58.00', img: '/assets/generated/product-moisturizer.png'
      },
      {
        step: '04', name: 'Protect',
        title: 'Daily Shield Broad-Spectrum SPF 50',
        desc: 'Shield and nourish every day with broad-spectrum SPF.',
        price: '$48.00', img: '/assets/generated/product-sunscreen.png'
      }
    ];
    return ritual;
  };

  const renderLanding = () => (
    <>
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pt-12 md:pt-20 pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-24 fade-in">
        <div className="flex-1">
          <p className="text-[10px] font-bold tracking-widest text-[#4A5240] uppercase mb-6">Personalized For You</p>
          <h1 className="text-6xl md:text-7xl font-serif mb-6 text-[#1A1A1A] leading-[1.1]">Discover Your<br/>Signature Routine</h1>
          <p className="text-[15px] text-gray-700 mb-10 max-w-sm leading-relaxed font-medium">
            A guided quiz to match your skin with rituals and ingredients that truly support you.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button onClick={handleStart} className="bg-[#4A5240] text-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#3A4032] transition-colors">
              Begin Analysis
            </button>
            <a href="#how-it-works" className="text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:opacity-70 transition-opacity">
              See How It Works <span>→</span>
            </a>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="w-full aspect-[4/5] bg-gray-200">
             <img src="/assets/generated/hero-1.png" alt="Quiz Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 border-t border-[#E5E0D8]">
        <div className="mb-16 flex items-center gap-6">
           <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] whitespace-nowrap">How It Works</span>
           <div className="h-[1px] bg-[#E5E0D8] flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col">
            <span className="text-4xl font-serif text-[#1A1A1A] mb-4">01</span>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A]">Tell us about your skin</h3>
            <p className="text-[14px] text-gray-600 mb-8 max-w-xs leading-relaxed">Answer a few simple questions about your skin, lifestyle, and concerns.</p>
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden mt-auto">
              <img src="/assets/generated/home-contents-skin.jpg" alt="Step 1" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-serif text-[#1A1A1A] mb-4">02</span>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A]">We map your priorities</h3>
            <p className="text-[14px] text-gray-600 mb-8 max-w-xs leading-relaxed">Our algorithm analyzes your responses to identify what your skin needs most.</p>
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden mt-auto">
              <img src="/assets/generated/home-ritual-treat.jpg" alt="Step 2" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-serif text-[#1A1A1A] mb-4">03</span>
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A]">Receive your ritual</h3>
            <p className="text-[14px] text-gray-600 mb-8 max-w-xs leading-relaxed">Get your personalized four-step routine with products selected just for you.</p>
            <div className="aspect-[4/3] bg-[#EAE6DF] flex items-center justify-center p-8 mt-auto">
              <img src="/assets/generated/product-moisturizer.png" alt="Step 3" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-[#2D2A26] text-white flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col justify-center px-12 lg:px-32 py-24 lg:py-32">
           <h2 className="text-[40px] md:text-[48px] font-serif mb-12 max-w-[380px] leading-[1.1]">Your ritual begins with understanding.</h2>
           <div>
              <button onClick={handleStart} className="border border-[#4A4843] bg-transparent hover:bg-white hover:border-white hover:text-[#2D2A26] text-white px-10 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase transition-colors">
                Start The Quiz
              </button>
           </div>
        </div>
        <div className="md:w-1/2 aspect-square md:aspect-auto">
           <img src="/assets/generated/home-daily-edit.jpg" alt="Ritual" className="w-full h-full object-cover" />
        </div>
      </section>
    </>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    const hasAnswered = !!answers[currentQuestion.id];

    return (
      <div className="min-h-[80vh] flex flex-col fade-in">
        <section className={`flex-1 ${currentQuestion.type === 'image-grid' ? 'bg-white' : 'bg-[#F8F6F4]'} pt-20 pb-24 px-6 md:px-12 lg:px-24 flex flex-col`}>
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="mb-16 flex items-center gap-6">
               <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 whitespace-nowrap">Question 0{currentQuestion.id} of 0{QUESTIONS.length}</span>
               <div className="h-[1px] bg-[#E5E0D8] w-24 md:w-64"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-[#1A1A1A] max-w-2xl mx-auto">{currentQuestion.title}</h2>
            
            {currentQuestion.type === 'cards' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-5xl mx-auto">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`flex flex-col items-center justify-center p-8 md:p-12 transition-all border ${
                      answers[currentQuestion.id] === opt.id 
                      ? 'bg-[#4A5240] text-white border-[#4A5240] scale-105 shadow-lg' 
                      : 'bg-transparent text-[#1A1A1A] border-[#E5E0D8] hover:border-[#4A5240]'
                    }`}
                  >
                    <div className={`mb-6 ${answers[currentQuestion.id] === opt.id ? 'text-white' : 'text-[#1A1A1A]'}`}>{opt.icon}</div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-center leading-relaxed">{opt.id}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'image-grid' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#E5E0D8] border border-[#E5E0D8] max-w-6xl mx-auto mb-16">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`relative h-64 md:h-80 group overflow-hidden bg-white ${answers[currentQuestion.id] === opt.id ? 'ring-inset ring-[6px] ring-[#4A5240] z-10' : ''}`}
                  >
                    <img src={opt.img} alt={opt.id} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${answers[currentQuestion.id] === opt.id ? 'grayscale-0 opacity-100' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`} />
                    <div className={`absolute inset-0 transition-colors duration-500 ${answers[currentQuestion.id] === opt.id ? 'bg-[#3A1E14]/10' : 'bg-[#3A1E14]/30 group-hover:bg-[#3A1E14]/10'}`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <svg className={`w-10 h-10 mb-4 transition-opacity ${answers[currentQuestion.id] === opt.id ? 'text-white opacity-100' : 'text-white opacity-80'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>
                      <span className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">{opt.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleContinue}
                disabled={!hasAnswered}
                className={`px-12 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                  hasAnswered 
                    ? 'bg-[#4A5240] text-white hover:bg-[#3A4032] cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion.id === QUESTIONS.length ? 'Show My Ritual' : 'Continue'}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderAnalyzing = () => (
    <div className="min-h-screen bg-[#F8F6F4] flex flex-col items-center justify-center px-6 fade-in">
      <div className="w-16 h-16 border-4 border-[#E5E0D8] border-t-[#4A5240] rounded-full animate-spin mb-8"></div>
      <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">Mapping Your Priorities</h2>
      <p className="text-[14px] text-gray-600">Our algorithm is selecting the best ingredients for your skin...</p>
    </div>
  );

  const renderResult = () => {
    const ritual = getRitual();
    
    return (
      <div className="fade-in">
        {/* Result Ritual */}
        <section className="bg-[#EAE6DF] pt-32 pb-24 px-6 md:px-12 lg:px-24 border-b border-[#D8D3CC]">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-12">
            <div className="lg:w-1/3 flex flex-col justify-center">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A]">Your Four-Step Ritual</h3>
              <p className="text-[28px] font-serif text-[#1A1A1A] mb-8 max-w-sm leading-tight">A personalized routine designed for your unique skin.</p>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-4 flex flex-wrap gap-2">
                {Object.values(answers).map((ans, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span>{ans}</span>
                    {idx < Object.keys(answers).length - 1 && <span className="opacity-40">•</span>}
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-gray-700 max-w-sm leading-relaxed mb-8">
                Based on your answers, here's your ritual to rebalance, hydrate, and strengthen.
              </p>
            </div>
            
            <div className="lg:w-2/3 flex overflow-x-auto snap-x snap-mandatory pb-8 lg:pb-0 gap-8 hide-scrollbar">
              {ritual.map((product) => (
                <div key={product.step} className="min-w-[280px] lg:min-w-0 lg:w-1/4 flex flex-col snap-start group cursor-pointer relative">
                   <div className="aspect-[3/4] mb-6 flex items-center justify-center relative">
                      <div className="absolute bottom-0 w-full h-[60%] bg-[#DFD9CE] rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <img src={product.img} alt={product.name} className="h-[90%] mt-auto relative z-10 object-contain mix-blend-multiply group-hover:-translate-y-2 transition-transform duration-500" />
                   </div>
                   <span className="text-[11px] font-serif text-gray-500 mb-2">{product.step}</span>
                   <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-1">{product.name}</h4>
                   <p className="text-[13px] font-medium text-[#1A1A1A] mb-3">{product.title}</p>
                   <p className="text-[13px] text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">{product.desc}</p>
                   <div className="flex items-center justify-between text-[13px] font-medium text-[#1A1A1A]">
                     <span>{product.price}</span>
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-[#F8F6F4] py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 md:gap-24 justify-between items-start">
            <div className="md:w-1/3">
               <h2 className="text-[32px] md:text-[40px] leading-tight font-serif text-[#1A1A1A] mb-6">Guided. Personal.<br/>Purposeful.</h2>
               <p className="text-[15px] text-gray-700 max-w-[280px] leading-relaxed">Our quiz isn't a diagnosis—just a smarter way to understand your skin and find what works.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-2">
              <div className="flex flex-col gap-4">
                 <svg className="w-8 h-8 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                 <div>
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-3 mt-2">5 Questions</h4>
                    <p className="text-[14px] text-gray-600 leading-relaxed">Answer in minutes for real results.</p>
                 </div>
              </div>
              <div className="flex flex-col gap-4">
                 <svg className="w-8 h-8 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 <div>
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-3 mt-2">Under 2 Minutes</h4>
                    <p className="text-[14px] text-gray-600 leading-relaxed">Fast, simple, and effortless.</p>
                 </div>
              </div>
              <div className="flex flex-col gap-4">
                 <svg className="w-8 h-8 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 <div>
                    <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-3 mt-2">Personalized Routine</h4>
                    <p className="text-[14px] text-gray-600 leading-relaxed">Curated for your skin, not someone else's.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-[#2D2A26] text-white flex flex-col md:flex-row">
          <div className="md:w-1/2 flex flex-col justify-center px-12 lg:px-32 py-24 lg:py-32">
             <h2 className="text-[40px] md:text-[48px] font-serif mb-12 max-w-[380px] leading-[1.1]">Want to explore other options?</h2>
             <div>
                <button onClick={handleStart} className="border border-[#4A4843] bg-transparent hover:bg-white hover:border-white hover:text-[#2D2A26] text-white px-10 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase transition-colors">
                  Retake The Quiz
                </button>
             </div>
          </div>
          <div className="md:w-1/2 aspect-square md:aspect-auto">
             <img src="/assets/generated/home-daily-edit.jpg" alt="Ritual" className="w-full h-full object-cover" />
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="bg-[#F8F6F4] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#4A5240] selection:text-white pb-0">
      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      {step === 0 && renderLanding()}
      {step > 0 && step <= QUESTIONS.length && renderQuestion()}
      {step === 5 && renderAnalyzing()}
      {step === 4 && renderResult()}
    </div>
  );
}

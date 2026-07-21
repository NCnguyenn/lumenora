import { useState, useMemo } from 'react';
import { products } from '../data/products';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/types';
import { QuizProductCard } from '../components/product/QuizProductCard';

/* ─── Quiz icons (line-art style matching mockup) ─── */
const icons = {
  balanced: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6c0 0-4 8-4 14a4 4 0 0 0 8 0c0-6-4-14-4-14z" />
      <circle cx="24" cy="34" r="8" />
      <path d="M20 34h8" />
      <path d="M24 30v8" />
    </svg>
  ),
  dryOrTight: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 10v2M24 36v2M10 24h2M36 24h2M14.1 14.1l1.4 1.4M32.5 32.5l1.4 1.4M14.1 33.9l1.4-1.4M32.5 15.5l1.4-1.4" />
      <path d="M20 18h8v12h-8z" strokeDasharray="2 2" />
      <circle cx="24" cy="24" r="16" />
      <path d="M16 20c2-3 6-3 8 0s6 3 8 0" />
      <path d="M16 28c2-3 6-3 8 0s6 3 8 0" />
      <path d="M18 24c1-2 4-2 6 0s5 2 6 0" />
    </svg>
  ),
  oily: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6l8 12a12 12 0 1 1-16 0z" />
      <circle cx="20" cy="30" r="2" />
      <circle cx="28" cy="28" r="1.5" />
      <circle cx="24" cy="34" r="1" />
    </svg>
  ),
  combination: (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 8v32" />
      <path d="M14 18c2-2 5-2 6 0" />
      <path d="M14 24c2-2 5-2 6 0" />
      <circle cx="32" cy="18" r="1.5" />
      <circle cx="30" cy="24" r="1" />
      <circle cx="34" cy="22" r="1" />
    </svg>
  ),
  dehydration: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4l10 16a14 14 0 1 1-20 0z" />
      <path d="M20 28l4-4 4 4" />
    </svg>
  ),
  sensitivity: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 8c-8 6-16 12-16 22a16 16 0 0 0 32 0c0-10-8-16-16-22z" />
      <path d="M18 28l3-3 3 3 3-3 3 3" />
    </svg>
  ),
  dullness: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4l3 8 8 1-6 5 2 8-7-5-7 5 2-8-6-5 8-1z" />
      <circle cx="24" cy="32" r="10" strokeDasharray="3 3" />
    </svg>
  ),
  texture: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="32" height="32" rx="4" />
      <path d="M12 16h24M12 24h24M12 32h24" strokeDasharray="4 3" />
      <circle cx="24" cy="24" r="14" strokeDasharray="2 4" />
    </svg>
  ),
  breakouts: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="10" />
      <circle cx="24" cy="24" r="4" />
    </svg>
  ),
  fineLines: (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 14c8 0 12 4 16 4s8-4 16-4" />
      <path d="M8 24c8 0 12 4 16 4s8-4 16-4" />
      <path d="M8 34c8 0 12 4 16 4s8-4 16-4" />
    </svg>
  )
};

/* ─── Data mapping for recommendation ─── */
const CONCERN_MAP: Record<string, string[]> = {
  'DEHYDRATION': ['Hydration', 'Barrier support', 'Barrier'],
  'SENSITIVITY': ['Redness', 'Comfort', 'Soothing'],
  'DULLNESS': ['Dullness', 'Radiance', 'Brightening', 'Glow'],
  'TEXTURE': ['Texture', 'Pore refinement', 'Smoothing', 'Exfoliation'],
  'BREAKOUTS': ['Cleanse', 'Congestion', 'Breakouts', 'Blemish control', 'Clarifying'],
  'FINE_LINES': ['Anti-aging', 'Fine lines', 'Firmness', 'Wrinkle prevention'],
};

const SKIN_TYPE_MAP: Record<string, string[]> = {
  'BALANCED': ['Normal', 'Combination'],
  'DRY_OR_TIGHT': ['Dry', 'Very dry', 'Dehydrated'],
  'OILY': ['Oily'],
  'COMBINATION': ['Combination', 'Normal'],
};

/* ─── Smart product recommendation engine ─── */
function getRecommendedRitual(skinType: string, concerns: string[]): {
  products: Product[];
  skinProfile: string[];
} {
  const targetSkinTypes = SKIN_TYPE_MAP[skinType] || ['Normal'];
  const targetConcerns = concerns.flatMap(c => CONCERN_MAP[c] || []);

  const skinProducts = products.filter(p => p.category === 'skin' || p.category === 'sun');

  const scored = skinProducts.map(p => {
    let score = 0;
    const skinTypeMatch = p.skinTypes.filter(s => targetSkinTypes.includes(s)).length;
    score += skinTypeMatch * 15;
    const concernMatch = p.concerns.filter(c =>
      targetConcerns.some(tc => c.toLowerCase().includes(tc.toLowerCase()) || tc.toLowerCase().includes(c.toLowerCase()))
    ).length;
    score += concernMatch * 20;
    if (p.tag === 'best-seller') score += 5;
    score += p.rating.value * 2;
    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const routineSteps = ['Cleanse', 'Treat', 'Moisturize', 'Protect'];
  const ritual: Product[] = [];

  for (const step of routineSteps) {
    const candidates = scored.filter(
      s => s.product.routineStep === step && !ritual.some(r => r.id === s.product.id)
    );
    if (candidates.length > 0) {
      ritual.push(candidates[0].product);
    }
  }

  if (ritual.length < 4) {
    const toneProduct = scored.find(
      s => s.product.routineStep === 'Tone' && !ritual.some(r => r.id === s.product.id)
    );
    if (toneProduct) {
      const insertIndex = ritual.findIndex(r => r.routineStep === 'Treat' || r.routineStep === 'Moisturize');
      if (insertIndex >= 0) {
        ritual.splice(insertIndex, 0, toneProduct.product);
      } else {
        ritual.push(toneProduct.product);
      }
    }
  }

  const finalRitual = ritual.slice(0, 4);
  const skinProfile: string[] = [];
  const skinLabel = skinType === 'DRY_OR_TIGHT' ? 'Dry' : skinType === 'BALANCED' ? 'Normal' : skinType.charAt(0) + skinType.slice(1).toLowerCase();
  skinProfile.push(skinLabel);
  concerns.forEach(c => {
    const label = c.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    skinProfile.push(label);
  });

  return { products: finalRitual, skinProfile };
}

export function Quiz() {
  const [skinType, setSkinType] = useState<string>('BALANCED');
  const [concerns, setConcerns] = useState<string[]>(['DEHYDRATION', 'SENSITIVITY']);
  const navigate = useNavigate();
  const addToCart = useAppStore(s => s.addToCart);

  const handleToggleConcern = (id: string) => {
    setConcerns(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  const ritual = useMemo(() => getRecommendedRitual(skinType, concerns), [skinType, concerns]);

  const handleAddAllToCart = () => {
    if (!ritual) return;
    ritual.products.forEach(p => {
      addToCart(p.id, p.defaultVariantId, 1);
    });
    navigate('/cart');
  };

  const scrollToNext = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#F8F6F4] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#4A5240] selection:text-white">

      {/* 1. HERO SECTION */}
      <section className="max-w-[1440px] mx-auto pt-16 md:pt-24 pb-16 flex flex-col md:flex-row items-center">
        <div className="flex-1 px-6 md:px-12 lg:px-24">
          <p className="text-[10px] font-bold tracking-widest text-[#4A5240] uppercase mb-6">Personalized For You</p>
          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-serif mb-8 text-[#1A1A1A] leading-[1.05]">Discover Your<br/>Signature Routine</h1>
          <p className="text-[15px] text-gray-700 mb-10 max-w-sm leading-relaxed font-medium">
            A guided quiz to match your skin with rituals and ingredients that truly support you.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={() => scrollToNext('question-01')}
              className="bg-[#4A5240] text-white px-10 py-[18px] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#3A4032] transition-colors"
            >
              Begin Analysis
            </button>
            <button
              onClick={() => scrollToNext('how-it-works')}
              className="text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              See How It Works <span>→</span>
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative mt-12 md:mt-0">
          <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden">
            <img src="/assets/generated/quiz_hero_mockup_1784463417112.jpg" alt="Quiz Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 2. QUESTION 01: SKIN TYPE */}
      <section id="question-01" className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 border-t border-[#E5E0D8]">
        <div className="flex items-center gap-6 mb-12">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] whitespace-nowrap">Question 01 of 05</span>
          <div className="w-[120px] h-[3px] bg-[#E5E0D8] relative">
            <div className="absolute left-0 top-0 h-full bg-[#4A5240] w-1/5"></div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-[#1A1A1A]">How does your skin usually feel by midday?</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {[
            { id: 'BALANCED', label: 'Balanced', icon: icons.balanced },
            { id: 'DRY_OR_TIGHT', label: 'Dry or Tight', icon: icons.dryOrTight },
            { id: 'OILY', label: 'Oily', icon: icons.oily },
            { id: 'COMBINATION', label: 'Combination', icon: icons.combination },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSkinType(opt.id)}
              className={`flex flex-col items-center justify-center p-8 md:p-10 border transition-all duration-300 ${
                skinType === opt.id
                  ? 'bg-[#4A5240] text-white border-[#4A5240] shadow-lg'
                  : 'bg-transparent text-[#1A1A1A] border-[#E5E0D8] hover:border-[#4A5240]'
              }`}
            >
              <div className={`mb-5 transition-colors ${skinType === opt.id ? 'text-white' : 'text-[#1A1A1A]'}`}>
                {opt.icon}
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-center">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => scrollToNext('how-it-works')}
            className="bg-[#4A5240] text-white px-12 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#3A4032] transition-colors"
          >
            Continue
          </button>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-20 border-t border-[#E5E0D8]">
        <div className="mb-16 flex items-center gap-6">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] whitespace-nowrap">How It Works</span>
          <div className="h-[1px] bg-[#E5E0D8] flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Tell Us About Your Skin',
              desc: 'Answer a few simple questions about your skin, lifestyle, and concerns.',
              img: '/assets/generated/quiz_how_1_skin_1784463429601.jpg',
            },
            {
              num: '02',
              title: 'We Map Your Priorities',
              desc: 'Our algorithm analyzes your responses to identify what your skin needs most.',
              img: '/assets/generated/quiz_how_2_dropper_1784463439991.jpg',
            },
            {
              num: '03',
              title: 'Receive Your Ritual',
              desc: 'Get your personalized four-step routine with products selected just for you.',
              img: '/assets/generated/quiz_how_3_cream_1784463450738.jpg',
            },
          ].map(item => (
            <div key={item.num} className="flex flex-row md:flex-col gap-6 group items-stretch">
              <div className="flex flex-col min-w-[140px] md:min-w-0 md:mb-4">
                <span className="text-3xl md:text-[32px] font-serif text-[#1A1A1A] mb-3">{item.num}</span>
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-[#1A1A1A]">{item.title}</h3>
                <p className="text-[13px] text-gray-600 max-w-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex-1 w-full">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 aspect-[4/5] md:aspect-[4/3]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUESTION 02: FOCUS CONCERNS */}
      <section className="bg-[#EFECE8] py-20 border-y border-[#E5E0D8]">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl md:text-[32px] font-serif text-center mb-16 text-[#1A1A1A]">What would you like to focus on?</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px] bg-white border-y border-white">
            {[
              { id: 'DEHYDRATION', label: 'Dehydration', icon: icons.dehydration, img: '/assets/generated/quiz_texture_dehydration_1784467710980.jpg' },
              { id: 'SENSITIVITY', label: 'Sensitivity', icon: icons.sensitivity, img: '/assets/generated/quiz_texture_sensitivity_1784467721781.jpg' },
              { id: 'DULLNESS', label: 'Dullness', icon: icons.dullness, img: '/assets/generated/quiz_texture_dullness_1784467730429.jpg' },
              { id: 'TEXTURE', label: 'Texture', icon: icons.texture, img: '/assets/generated/quiz_texture_texture_1784467738923.jpg' },
              { id: 'BREAKOUTS', label: 'Breakouts', icon: icons.breakouts, img: '/assets/generated/quiz_texture_breakouts_1784467767529.jpg' },
              { id: 'FINE_LINES', label: 'Fine Lines', icon: icons.fineLines, img: '/assets/generated/quiz_texture_finelines_1784467749494.jpg' },
            ].map(opt => {
              const isSelected = concerns.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleToggleConcern(opt.id)}
                  className="relative flex flex-col items-center justify-center aspect-[16/9] overflow-hidden group"
                >
                  <img src={opt.img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isSelected ? 'scale-105' : 'scale-100'}`} />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isSelected ? 'bg-[#5C4532]/20' : 'bg-[#5C4532]/40 group-hover:bg-[#5C4532]/30'}`}></div>
                  <div className="relative z-10 flex flex-col items-center justify-center text-white p-6">
                    <div className={`mb-4 transition-transform duration-300 ${isSelected ? 'scale-110 text-white' : 'text-white/80'}`}>
                      {opt.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-center">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. YOUR FOUR-STEP RITUAL */}
      <section className="bg-[#EAE6DF] py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-12">
          <div className="lg:w-1/3 flex flex-col justify-center">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 text-[#1A1A1A]">Your Four-Step Ritual</h3>
            <p className="text-[26px] font-serif text-[#1A1A1A] mb-8 max-w-sm leading-tight">A personalized routine designed for your unique skin.</p>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-4 flex flex-wrap gap-x-2 gap-y-1 items-center">
              {ritual.skinProfile.map((label, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span>{label}</span>
                  {idx < ritual.skinProfile.length - 1 && <span className="opacity-40">•</span>}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-gray-700 max-w-sm leading-relaxed mb-8">
              Based on your answers, here's your ritual to rebalance, hydrate, and strengthen.
            </p>
            <button
              onClick={handleAddAllToCart}
              className="bg-[#1A1A1A] text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors self-start border border-[#1A1A1A]"
            >
              Add All to Cart
            </button>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {ritual.products.map((product, idx) => (
              <QuizProductCard
                key={product.id}
                product={product}
                stepNumber={idx + 1}
                stepName={['Cleanse', 'Treat', 'Moisturize', 'Protect'][idx] || product.routineStep}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. GUIDED. PERSONAL. PURPOSEFUL. */}
      <section className="bg-[#F8F6F4] py-24 px-6 md:px-12 lg:px-24 border-b border-[#E5E0D8]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-stretch">
          <div className="md:w-1/3">
            <img src="/assets/generated/quiz_guided_model_1784463471184.jpg" alt="Guided" className="w-full h-full object-cover aspect-[4/3] md:aspect-[3/4]" />
          </div>
          <div className="md:w-2/3 flex flex-col justify-center">
            <h2 className="text-[32px] md:text-[40px] leading-[1.1] font-serif text-[#1A1A1A] mb-6">Guided. Personal. Purposeful.</h2>
            <p className="text-[14px] text-gray-700 max-w-[400px] leading-relaxed mb-12">Our quiz isn't a diagnosis—just a smarter way to understand your skin and find what works.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="flex flex-col gap-4">
                <svg className="w-7 h-7 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-2">5 Questions</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed max-w-[200px]">Answer in minutes for real results.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <svg className="w-7 h-7 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-2">Under 2 Minutes</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed max-w-[200px]">Fast, simple, and effortless.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <svg className="w-7 h-7 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <div>
                  <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-2">Personalized Routine</h4>
                  <p className="text-[12px] text-gray-600 leading-relaxed max-w-[200px]">Curated for your skin, not someone else's.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA FOOTER */}
      <section className="bg-[#2D2A26] flex flex-col md:flex-row items-stretch">
        <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 lg:py-32 order-2 md:order-1">
          <h2 className="text-[36px] md:text-[44px] lg:text-[52px] font-serif text-white mb-10 max-w-[400px] leading-[1.1]">Your ritual begins with understanding.</h2>
          <div>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border border-[#4A4843] bg-transparent hover:bg-white hover:border-white hover:text-[#2D2A26] text-white px-10 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
            >
              Start The Quiz
            </button>
          </div>
        </div>
        <div className="md:w-1/2 order-1 md:order-2">
          <img src="/assets/generated/quiz_footer_still_life_1784463481472.jpg" alt="Ritual elements" className="w-full h-full object-cover min-h-[400px]" />
        </div>
      </section>
    </div>
  );
}

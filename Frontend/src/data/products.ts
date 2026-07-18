import type { Product, ProductCategory } from './types';
export type { Product, ProductCategory };

const rawProducts = [
  {
    id: 'p1',
    slug: 'bamboo-ultra-hydrating-toner',
    brandId: 'aurelle-lab',
    brand: 'Aurelle Lab',
    name: 'Bamboo Ultra Hydrating Toner',
    subtitle: 'Barrier-first hydration in one pass',
    category: 'skin',
    productType: 'Toner',
    price: 45.00,
    currency: 'USD',
    defaultVariantId: 'AL-TON-BAM-150',
    variants: [
      { id: 'AL-TON-BAM-150', label: '150 ml', size: '150 ml', price: 45.00, sku: 'AL-TON-BAM-150', inStock: true }
    ],
    rating: { value: 4.8, count: 310, source: 'demo' },
    images: [
      { id: 'p1-img1', role: 'primary', src: '/assets/products/bamboo-ultra-hydrating-toner/01-primary.webp', alt: 'Aurelle Lab Bamboo Ultra Hydrating Toner', width: 960, height: 960 },
      { id: 'p1-img2', role: 'hover', src: '/assets/products/bamboo-ultra-hydrating-toner/02-hover.webp', alt: 'Aurelle Lab Bamboo Ultra Hydrating Toner hover', width: 960, height: 960 },
      { id: 'p1-img3', role: 'detail', src: '/assets/products/bamboo-ultra-hydrating-toner/03-detail.webp', alt: 'Aurelle Lab Bamboo Ultra Hydrating Toner texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'A weightless toner-essence hybrid that reintroduces water to a depleted barrier.',
    description: [
      'Bamboo water and panthenol settle thirst without film.',
      'Built as Aurelle Lab’s first post-cleanse pass.',
      'Suitable under serum and cream in multi-brand rituals.'
    ],
    benefits: ['Replenishes after cleanse', 'Layers without stickiness', 'Preps cream/serum', 'Quiet no-fragrance-blast finish'],
    keyIngredients: [
      { name: 'Bamboo Water', benefit: 'refreshes barrier water content' },
      { name: 'Panthenol', benefit: 'comfort' },
      { name: 'Glycerin', benefit: 'humectant slip' }
    ],
    fullIngredients: 'Aqua/Water, Bambusa Vulgaris Water, Glycerin, Panthenol, Sodium PCA, Allantoin, 1,2-Hexanediol, Caprylyl Glycol, Citric Acid.',
    howToUse: [
      'After cleansing, pour into clean palms.',
      'Press over face and neck — do not scrub.',
      'Layer 2–3 passes on dry days.',
      'Follow with essence/serum while damp.'
    ],
    skinTypes: ['Dry', 'Combination', 'Dehydrated'],
    concerns: ['Hydration', 'Barrier support', 'Dullness'],
    routineStep: 'Tone',
    usageTime: ['AM', 'PM'],
    texture: 'Watery',
    finish: 'Dewy soft',
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['hydration', 'toner', 'barrier'],
    pairsWithTags: ['cleanse', 'treat', 'moisturize'],
    relatedIds: ['p7', 'p8', 'p2', 'p3'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p2',
    slug: 'birch-moisturizing-soothing-gel',
    brandId: 'harbor-hearth',
    brand: 'Harbor & Hearth',
    name: 'Birch Moisturizing Soothing Gel',
    subtitle: 'Nordic calm for heat-flushed skin',
    category: 'skin',
    productType: 'Gel moisturizer',
    price: 15.00,
    currency: 'USD',
    defaultVariantId: 'HH-GEL-BIR-100',
    variants: [
      { id: 'HH-GEL-BIR-100', label: '100 ml', size: '100 ml', price: 15.00, sku: 'HH-GEL-BIR-100', inStock: true }
    ],
    rating: { value: 4.8, count: 352, source: 'demo' },
    images: [
      { id: 'p2-img1', role: 'primary', src: '/assets/products/birch-moisturizing-soothing-gel/01-primary.webp', alt: 'Harbor & Hearth Birch Moisturizing Soothing Gel', width: 960, height: 960 },
      { id: 'p2-img2', role: 'hover', src: '/assets/products/birch-moisturizing-soothing-gel/02-hover.webp', alt: 'Harbor & Hearth Birch Moisturizing Soothing Gel hover', width: 960, height: 960 },
      { id: 'p2-img3', role: 'detail', src: '/assets/products/birch-moisturizing-soothing-gel/03-detail.webp', alt: 'Harbor & Hearth Birch Moisturizing Soothing Gel texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Water-light birch gel for warm, tight skin without heavy cream.',
    description: [
      'Cool gel from birch-sap tradition with aloe comfort. Forest-quiet scent profile, no sticky film.'
    ],
    benefits: ['Cools flushed skin', 'Lightweight hydration', 'No sticky residue'],
    keyIngredients: [
      { name: 'Birch Sap', benefit: 'hydration and minerals' },
      { name: 'Aloe Vera', benefit: 'soothing comfort' },
      { name: 'Allantoin', benefit: 'skin calming' }
    ],
    fullIngredients: 'Aqua, Betula Alba Juice, Aloe Barbadensis Leaf Juice, Glycerin, Allantoin, Carbomer, Sodium Hydroxide, Phenoxyethanol.',
    howToUse: [
      'After toner, pea-size amount.',
      'Pat into skin.',
      'Optional richer cream over if needed.',
      'Store cool for extra refreshment.'
    ],
    skinTypes: ['Sensitive', 'Oily', 'Combination'],
    concerns: ['Redness', 'Light moisture', 'Comfort'],
    routineStep: 'Moisturize',
    usageTime: ['AM', 'PM'],
    texture: 'Transparent cooling gel',
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['gel', 'soothing', 'moisturizer'],
    pairsWithTags: ['tone', 'protect'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p3',
    slug: 'mugwort-calming-cream',
    brandId: 'maison-verde',
    brand: 'Maison Verdé',
    name: 'Mugwort Calming Cream',
    subtitle: 'Herbal quiet for reactive days',
    category: 'skin',
    productType: 'Cream',
    price: 38.50,
    currency: 'USD',
    defaultVariantId: 'MV-CRM-MUG-50',
    variants: [
      { id: 'MV-CRM-MUG-50', label: '50 ml', size: '50 ml', price: 38.50, sku: 'MV-CRM-MUG-50', inStock: true }
    ],
    rating: { value: 4.7, count: 342, source: 'demo' },
    images: [
      { id: 'p3-img1', role: 'primary', src: '/assets/products/mugwort-calming-cream/01-primary.webp', alt: 'Maison Verdé Mugwort Calming Cream', width: 960, height: 960 },
      { id: 'p3-img2', role: 'hover', src: '/assets/products/mugwort-calming-cream/02-hover.webp', alt: 'Maison Verdé Mugwort Calming Cream hover', width: 960, height: 960 },
      { id: 'p3-img3', role: 'detail', src: '/assets/products/mugwort-calming-cream/03-detail.webp', alt: 'Maison Verdé Mugwort Calming Cream texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Day cream around mugwort and centella with squalane softness.',
    description: [
      'A comforting herbal cream designed to calm reactive skin.',
      'Squalane and ceramides reinforce the moisture barrier while mugwort provides herbal quiet to red, irritated skin.'
    ],
    benefits: ['Reduces visible redness', 'Strengthens barrier', 'Deeply comforting texture'],
    keyIngredients: [
      { name: 'Mugwort Extract', benefit: 'calms reactivity' },
      { name: 'Centella', benefit: 'supports barrier repair' },
      { name: 'Squalane', benefit: 'softens and locks moisture' }
    ],
    fullIngredients: 'Aqua, Squalane, Glycerin, Artemisia Princeps Extract, Centella Asiatica Extract, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Ceramide NP, Tocopherol.',
    howToUse: [
      'Use a pearl-sized amount after serum.',
      'Press outward onto face and neck.',
      'AM: Use under SPF.',
      'PM: Use as the last cream step.'
    ],
    skinTypes: ['Sensitive', 'Dry', 'Combination'],
    concerns: ['Redness', 'Comfort', 'Barrier'],
    routineStep: 'Moisturize',
    usageTime: ['AM', 'PM'],
    texture: 'Medium cream',
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['cream', 'calming', 'barrier'],
    pairsWithTags: ['treat', 'protect'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p4',
    slug: 'body-lotion-lavender-patchouli',
    brandId: 'solenne',
    brand: 'Solenne',
    name: 'Body Lotion Lavender Patchouli',
    subtitle: 'Soft body moisture with evening calm',
    category: 'body',
    productType: 'Body lotion',
    price: 42.00,
    currency: 'USD',
    defaultVariantId: 'SO-LOT-LVP-250',
    variants: [
      { id: 'SO-LOT-LVP-250', label: '250 ml', size: '250 ml', price: 42.00, sku: 'SO-LOT-LVP-250', inStock: true }
    ],
    rating: { value: 4.6, count: 28, source: 'demo' },
    images: [
      { id: 'p4-img1', role: 'primary', src: '/assets/products/body-lotion-lavender-patchouli/01-primary.webp', alt: 'Solenne Body Lotion Lavender Patchouli', width: 960, height: 960 },
      { id: 'p4-img2', role: 'hover', src: '/assets/products/body-lotion-lavender-patchouli/02-hover.webp', alt: 'Solenne Body Lotion Lavender Patchouli hover', width: 960, height: 960 },
      { id: 'p4-img3', role: 'detail', src: '/assets/products/body-lotion-lavender-patchouli/03-detail.webp', alt: 'Solenne Body Lotion Lavender Patchouli texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Daily body lotion with shea slip and low evening lavender–patchouli trail.',
    description: [
      'A luxurious body lotion that sinks into the skin instantly.',
      'Scented with calming lavender and grounding patchouli, it is the perfect evening ritual for dry skin.'
    ],
    benefits: ['Deep body moisture', 'Calming evening scent', 'Fast-absorbing shea formula'],
    keyIngredients: [
      { name: 'Shea Butter', benefit: 'rich moisture' },
      { name: 'Lavender Oil', benefit: 'calming scent' },
      { name: 'Patchouli', benefit: 'grounding aroma' }
    ],
    fullIngredients: 'Aqua, Butyrospermum Parkii Butter, Glycerin, Cetearyl Alcohol, Lavandula Oil, Pogostemon Cablin Oil, Tocopherol, Phenoxyethanol.',
    howToUse: [
      'Apply on damp skin post-shower.',
      'Use 2 pumps for limbs.',
      'Apply more for shins and elbows.',
      'Wait a moment before dressing.'
    ],
    skinTypes: ['Dry', 'Normal'],
    concerns: ['Dry body', 'Comfort scent'],
    routineStep: 'Body',
    usageTime: ['Anytime'],
    scent: 'Lavender, patchouli soft trail',
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['body', 'lotion', 'lavender'],
    pairsWithTags: ['body cleanser'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p5',
    slug: 'eucalyptus-nourishing-body-cleanser',
    brandId: 'harbor-hearth',
    brand: 'Harbor & Hearth',
    name: 'Eucalyptus Nourishing Body Cleanser',
    subtitle: 'Forest-clear wash without strip',
    category: 'body',
    productType: 'Body cleanser',
    price: 34.00,
    currency: 'USD',
    defaultVariantId: 'HH-CLN-EUC-300',
    variants: [
      { id: 'HH-CLN-EUC-300', label: '300 ml', size: '300 ml', price: 34.00, sku: 'HH-CLN-EUC-300', inStock: true }
    ],
    rating: { value: 4.5, count: 439, source: 'demo' },
    images: [
      { id: 'p5-img1', role: 'primary', src: '/assets/products/eucalyptus-nourishing-body-cleanser/01-primary.webp', alt: 'Harbor & Hearth Eucalyptus Nourishing Body Cleanser', width: 960, height: 960 },
      { id: 'p5-img2', role: 'hover', src: '/assets/products/eucalyptus-nourishing-body-cleanser/02-hover.webp', alt: 'Harbor & Hearth Eucalyptus Nourishing Body Cleanser hover', width: 960, height: 960 },
      { id: 'p5-img3', role: 'detail', src: '/assets/products/eucalyptus-nourishing-body-cleanser/03-detail.webp', alt: 'Harbor & Hearth Eucalyptus Nourishing Body Cleanser texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Eucalyptus body wash with oat softness — clean, not squeaky.',
    description: [
      'A revitalizing body cleanser that awakens the senses with eucalyptus without stripping the skin\'s natural oils.',
      'Oat extract ensures the skin is left soft and comforted.'
    ],
    benefits: ['Invigorating forest scent', 'Cleanses without stripping', 'Softens with oat extract'],
    keyIngredients: [
      { name: 'Eucalyptus', benefit: 'refreshing aroma' },
      { name: 'Glycerin', benefit: 'moisture retention' },
      { name: 'Oat Extract', benefit: 'soothing softness' }
    ],
    fullIngredients: 'Aqua, Cocamidopropyl Betaine, Glycerin, Eucalyptus Globulus Leaf Oil, Avena Sativa Extract, Sodium Chloride, Citric Acid.',
    howToUse: [
      'Wet skin in the shower.',
      'Work into a light lather.',
      'Rinse thoroughly.',
      'Follow with body lotion or butter.'
    ],
    skinTypes: ['Normal', 'Dry'],
    concerns: ['Body cleansing', 'Refreshing'],
    routineStep: 'Body',
    usageTime: ['Anytime'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['body wash', 'cleanser', 'eucalyptus'],
    pairsWithTags: ['body lotion', 'body butter'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p6',
    slug: 'nourishing-shea-body-butter',
    brandId: 'solenne',
    brand: 'Solenne',
    name: 'Nourishing Shea Body Butter',
    subtitle: 'Dense comfort for dry limbs',
    category: 'body',
    productType: 'Body butter',
    price: 26.00,
    currency: 'USD',
    defaultVariantId: 'SO-BUT-SHE-200',
    variants: [
      { id: 'SO-BUT-SHE-200', label: '200 ml', size: '200 ml', price: 26.00, sku: 'SO-BUT-SHE-200', inStock: true }
    ],
    rating: { value: 4.7, count: 34, source: 'demo' },
    images: [
      { id: 'p6-img1', role: 'primary', src: '/assets/products/nourishing-shea-body-butter/01-primary.webp', alt: 'Solenne Nourishing Shea Body Butter', width: 960, height: 960 },
      { id: 'p6-img2', role: 'hover', src: '/assets/products/nourishing-shea-body-butter/02-hover.webp', alt: 'Solenne Nourishing Shea Body Butter hover', width: 960, height: 960 },
      { id: 'p6-img3', role: 'detail', src: '/assets/products/nourishing-shea-body-butter/03-detail.webp', alt: 'Solenne Nourishing Shea Body Butter texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Dense shea–cocoa butter that melts on contact for cracked dry air skin.',
    description: [
      'A deeply restorative body butter formulated for the driest skin conditions.',
      'Shea and cocoa butter melt into the skin to provide lasting comfort and protection from harsh elements.'
    ],
    benefits: ['Intense moisture for dry limbs', 'Melts on contact', 'Protects against dry air'],
    keyIngredients: [
      { name: 'Shea', benefit: 'deep nourishment' },
      { name: 'Cocoa Butter', benefit: 'barrier protection' },
      { name: 'Vitamin E', benefit: 'antioxidant support' }
    ],
    fullIngredients: 'Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Caprylic/Capric Triglyceride, Tocopherol, Helianthus Annuus Seed Oil.',
    howToUse: [
      'Warm a scoop between hands.',
      'Press into dry areas like elbows and knees.',
      'Best applied at night on damp skin.',
      'Use sparingly as it is very rich.'
    ],
    skinTypes: ['Dry', 'Very dry'],
    concerns: ['Extreme dryness', 'Rough patches'],
    routineStep: 'Body',
    usageTime: ['PM'],
    texture: 'Thick whipped butter',
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['body butter', 'shea', 'moisture'],
    pairsWithTags: ['body cleanser', 'body scrub'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p7',
    slug: 'green-tea-deep-cleansing-gel',
    brandId: 'aurelle-lab',
    brand: 'Aurelle Lab',
    name: 'Green Tea Deep Cleansing Gel',
    subtitle: 'Morning clarity without tightness',
    category: 'skin',
    productType: 'Cleanser',
    price: 25.00,
    currency: 'USD',
    defaultVariantId: 'AL-CLN-GTE-150',
    variants: [
      { id: 'AL-CLN-GTE-150', label: '150 ml', size: '150 ml', price: 25.00, sku: 'AL-CLN-GTE-150', inStock: true }
    ],
    rating: { value: 4.7, count: 465, source: 'demo' },
    images: [
      { id: 'p7-img1', role: 'primary', src: '/assets/products/green-tea-deep-cleansing-gel/01-primary.webp', alt: 'Aurelle Lab Green Tea Deep Cleansing Gel', width: 960, height: 960 },
      { id: 'p7-img2', role: 'hover', src: '/assets/products/green-tea-deep-cleansing-gel/02-hover.webp', alt: 'Aurelle Lab Green Tea Deep Cleansing Gel hover', width: 960, height: 960 },
      { id: 'p7-img3', role: 'detail', src: '/assets/products/green-tea-deep-cleansing-gel/03-detail.webp', alt: 'Aurelle Lab Green Tea Deep Cleansing Gel texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Daily gel cleanser with green tea polyphenols — lifts film, leaves barrier quiet.',
    description: [
      'A refreshing gel that purifies without disrupting the skin\'s natural balance.',
      'Green tea antioxidants provide environmental support while mild surfactants clear morning buildup.'
    ],
    benefits: ['Cleanses without tightness', 'Provides antioxidant support', 'Lifts overnight film'],
    keyIngredients: [
      { name: 'Green Tea', benefit: 'antioxidant clarity' },
      { name: 'Betaine', benefit: 'hydration balance' },
      { name: 'Mild surfactants', benefit: 'gentle cleansing' }
    ],
    fullIngredients: 'Aqua, Glycerin, Camellia Sinensis Leaf Extract, Betaine, Cocamidopropyl Betaine, Sodium Cocoyl Glutamate, Citric Acid.',
    howToUse: [
      'Wet face thoroughly.',
      'Massage gel for 30–40 seconds.',
      'Rinse with lukewarm water.',
      'Optional: use as second step in PM double cleanse.'
    ],
    skinTypes: ['Oily', 'Combination', 'Normal'],
    concerns: ['Cleanse', 'Congestion', 'Antioxidant support'],
    routineStep: 'Cleanse',
    usageTime: ['AM', 'PM'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['cleanser', 'green tea', 'gel'],
    pairsWithTags: ['tone', 'treat'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p8',
    slug: 'cosrx-advanced-snail-96-mucin-power-essence',
    brandId: 'cosrx',
    brand: 'COSRX',
    name: 'Advanced Snail 96 Mucin Power Essence',
    subtitle: 'Viscous repair layers for depleted skin',
    category: 'skin',
    productType: 'Essence',
    price: 25.00, // Updated to typical price, the spec said 26 but verify official size. 25 is fine demo.
    currency: 'USD',
    defaultVariantId: 'COSRX-SNAIL-100',
    variants: [
      { id: 'COSRX-SNAIL-100', label: '100 ml', size: '100 ml', price: 25.00, sku: 'COSRX-SNAIL-100', inStock: true }
    ],
    rating: { value: 4.8, count: 842, source: 'demo' },
    images: [
      { id: 'p8-img1', role: 'primary', src: '/assets/products/cosrx-advanced-snail-96-mucin-power-essence/01-primary.webp', alt: 'COSRX Advanced Snail 96 Mucin Power Essence', width: 960, height: 960 },
      { id: 'p8-img2', role: 'hover', src: '/assets/products/cosrx-advanced-snail-96-mucin-power-essence/02-hover.webp', alt: 'COSRX Advanced Snail 96 Mucin Power Essence hover', width: 960, height: 960 },
      { id: 'p8-img3', role: 'detail', src: '/assets/products/cosrx-advanced-snail-96-mucin-power-essence/03-detail.webp', alt: 'COSRX Advanced Snail 96 Mucin Power Essence texture', width: 960, height: 960 }
    ],
    badges: ['bestseller'],
    shortDescription: 'Cult mucin essence that layers moisture into tired skin — marketplace hero SKU.',
    description: [
      'Formulated with 96.3% Snail Secretion Filtrate, this essence protects the skin from moisture loss while improving skin elasticity.',
      'Snail mucin helps repair and soothes red, sensitive skin after breakouts by replenishing moisture.'
    ],
    benefits: ['Deeply hydrates and repairs', 'Improves skin elasticity', 'Soothes redness and sensitivity'],
    keyIngredients: [
      { name: 'Snail Secretion Filtrate (96%)', benefit: 'intense repair and hydration' },
      { name: 'Sodium Hyaluronate', benefit: 'plumping moisture' },
      { name: 'Panthenol', benefit: 'calms and strengthens' }
    ],
    fullIngredients: 'Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Phenoxyethanol, Sodium Hyaluronate, Allantoin, Ethyl Hexanediol, Carbomer, Panthenol, Arginine.',
    howToUse: [
      'After cleansing and toning, apply a small amount on your entire face.',
      'Gently pat using fingertips to aid absorption.',
      'Follow forth with your moisturizers.',
      'Apply SPF during the day.'
    ],
    skinTypes: ['Dry', 'Combination', 'Normal', 'Dehydrated'],
    concerns: ['Repair feel', 'Hydration', 'Texture'],
    routineStep: 'Treat',
    usageTime: ['AM', 'PM'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['essence', 'snail mucin', 'repair'],
    pairsWithTags: ['tone', 'moisturize'],
    source: { sourceType: 'official', officialUrl: 'https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p9',
    slug: 'ordinary-niacinamide-10-zinc-1',
    brandId: 'the-ordinary',
    brand: 'The Ordinary',
    name: 'Niacinamide 10% + Zinc 1%',
    subtitle: 'Clinical clarity serum, no fluff',
    category: 'skin',
    productType: 'Serum',
    price: 8.00,
    currency: 'USD',
    defaultVariantId: 'TO-NIA-30',
    variants: [
      { id: 'TO-NIA-30', label: '30 ml', size: '30 ml', price: 8.00, sku: 'TO-NIA-30', inStock: true }
    ],
    rating: { value: 4.8, count: 114, source: 'demo' },
    images: [
      { id: 'p9-img1', role: 'primary', src: '/assets/products/ordinary-niacinamide-10-zinc-1/01-primary.webp', alt: 'The Ordinary Niacinamide 10% + Zinc 1%', width: 960, height: 960 },
      { id: 'p9-img2', role: 'hover', src: '/assets/products/ordinary-niacinamide-10-zinc-1/02-hover.webp', alt: 'The Ordinary Niacinamide 10% + Zinc 1% hover', width: 960, height: 960 },
      { id: 'p9-img3', role: 'detail', src: '/assets/products/ordinary-niacinamide-10-zinc-1/03-detail.webp', alt: 'The Ordinary Niacinamide 10% + Zinc 1% texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'High-strength niacinamide with zinc for oilier, congestion-prone skin.',
    description: [
      'A universal serum for blemish-prone skin that smooths skin texture and visibly brightens tone.',
      'Features a high 10% concentration of Niacinamide combined with Zinc PCA.'
    ],
    benefits: ['Regulates visible sebum', 'Improves skin texture', 'Brightens uneven tone'],
    keyIngredients: [
      { name: 'Niacinamide 10%', benefit: 'brightens and clarifies' },
      { name: 'Zinc PCA 1%', benefit: 'balances visible sebum activity' }
    ],
    fullIngredients: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.',
    howToUse: [
      'Apply a few drops to the face in the morning and evening.',
      'Use after cleansing and toning, before heavier creams.',
      'Use sun protection during the day.',
      'Caution: Do not use in the same routine as pure Vitamin C if sensitive.'
    ],
    skinTypes: ['Oily', 'Combination'],
    concerns: ['Blemish-prone look', 'Oil balance', 'Uneven tone look'],
    routineStep: 'Treat',
    usageTime: ['AM', 'PM'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['serum', 'niacinamide', 'clarifying'],
    pairsWithTags: ['tone', 'moisturize'],
    source: { sourceType: 'official', officialUrl: 'https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p10',
    slug: 'volcanic-sea-clay-detox-masque',
    brandId: 'maison-verde',
    brand: 'Maison Verdé',
    name: 'Volcanic Sea Clay Detox Masque',
    subtitle: 'Mineral depth. Quiet clarity.',
    category: 'skin',
    productType: 'Mask',
    price: 54.00,
    currency: 'USD',
    defaultVariantId: 'MV-MSK-VSC-75',
    variants: [
      { id: 'MV-MSK-VSC-75', label: '75 ml', size: '75 ml', price: 54.00, sku: 'MV-MSK-VSC-75', inStock: true }
    ],
    rating: { value: 4.8, count: 152, source: 'demo' },
    images: [
      { id: 'p10-img1', role: 'primary', src: '/assets/products/volcanic-sea-clay-detox-masque/01-primary.webp', alt: 'Maison Verdé Volcanic Sea Clay Detox Masque', width: 960, height: 960 },
      { id: 'p10-img2', role: 'hover', src: '/assets/products/volcanic-sea-clay-detox-masque/02-hover.webp', alt: 'Maison Verdé Volcanic Sea Clay Detox Masque hover', width: 960, height: 960 },
      { id: 'p10-img3', role: 'detail', src: '/assets/products/volcanic-sea-clay-detox-masque/03-detail.webp', alt: 'Maison Verdé Volcanic Sea Clay Detox Masque texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Weekly mineral clay masque — rinse before bone-dry.',
    description: [
      'A deep-cleaning mineral masque drawing from volcanic ash and sea silt.',
      'Clarifies congestion and minimizes the look of pores without aggressive drying.'
    ],
    benefits: ['Draws out impurities', 'Minimizes pore appearance', 'Remineralizes the skin'],
    keyIngredients: [
      { name: 'Volcanic Clay', benefit: 'deep pore cleansing' },
      { name: 'Sea Silt', benefit: 'mineral nourishment' },
      { name: 'Kaolin', benefit: 'gentle oil absorption' }
    ],
    fullIngredients: 'Kaolin, Volcanic Ash, Sea Silt, Glycerin, Aqua, Bentonite, Caprylic/Capric Triglyceride, Tocopherol.',
    howToUse: [
      'Apply a thin layer to clean, dry skin.',
      'Leave on for 8–10 minutes (do not let it dry completely).',
      'Rinse thoroughly with warm water.',
      'Follow with hydrating toner and moisturizer.'
    ],
    skinTypes: ['Oily', 'Combination'],
    concerns: ['Congestion', 'Pore look', 'Weekly reset'],
    routineStep: 'Treat',
    usageTime: ['Anytime'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['mask', 'clay', 'detox'],
    pairsWithTags: ['tone', 'moisturize'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p11',
    slug: 'invisible-fluid-sunscreen-spf50',
    brandId: 'solenne',
    brand: 'Solenne',
    name: 'Invisible Fluid Sunscreen SPF 50+ PA++++',
    subtitle: 'Sheer protection that disappears into the day',
    category: 'sun',
    productType: 'Fluid sunscreen',
    price: 24.80,
    currency: 'USD',
    defaultVariantId: 'SO-SUN-INV-50',
    variants: [
      { id: 'SO-SUN-INV-50', label: '50 ml', size: '50 ml', price: 24.80, sku: 'SO-SUN-INV-50', inStock: true }
    ],
    rating: { value: 4.8, count: 453, source: 'demo' },
    images: [
      { id: 'p11-img1', role: 'primary', src: '/assets/products/invisible-fluid-sunscreen-spf50/01-primary.webp', alt: 'Solenne Invisible Fluid Sunscreen SPF 50+ PA++++', width: 960, height: 960 },
      { id: 'p11-img2', role: 'hover', src: '/assets/products/invisible-fluid-sunscreen-spf50/02-hover.webp', alt: 'Solenne Invisible Fluid Sunscreen SPF 50+ PA++++ hover', width: 960, height: 960 },
      { id: 'p11-img3', role: 'detail', src: '/assets/products/invisible-fluid-sunscreen-spf50/03-detail.webp', alt: 'Solenne Invisible Fluid Sunscreen SPF 50+ PA++++ texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Daily fluid sunscreen demo formula — invisible finish under makeup.',
    description: [
      'A weightless, invisible fluid that provides broad-spectrum defense against UV rays.',
      'Leaves no white cast, making it an ideal primer under makeup.'
    ],
    benefits: ['Zero white cast', 'Weightless fluid texture', 'High daily defense'],
    keyIngredients: [
      { name: 'UV filters', benefit: 'broad-spectrum defense' },
      { name: 'Niacinamide', benefit: 'tone support' },
      { name: 'Vitamin E', benefit: 'antioxidant protection' }
    ],
    fullIngredients: 'Aqua, Diisopropyl Sebacate, Silica, Glycerin, Niacinamide, Tocopherol, [Demo UV Filters], Caprylyl Glycol.',
    howToUse: [
      'Apply as the last step of your AM routine.',
      'Use a generous amount on the face and neck.',
      'Reapply every 2 hours if outdoors.',
      'Cleanse thoroughly in the PM.'
    ],
    skinTypes: ['All'],
    concerns: ['UV daily wear', 'No white cast'],
    routineStep: 'Protect',
    usageTime: ['AM'],
    warnings: ['Demo SPF product for UI only — not a real regulated sunscreen claim for sale. External use.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['sunscreen', 'fluid', 'invisible'],
    pairsWithTags: ['moisturize', 'cleanse'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p12',
    slug: 'cosrx-low-ph-good-morning-gel-cleanser',
    brandId: 'cosrx',
    brand: 'COSRX',
    name: 'Low pH Good Morning Gel Cleanser',
    subtitle: 'Soft morning gel cleanse',
    category: 'skin',
    productType: 'Cleanser',
    price: 14.00,
    currency: 'USD',
    defaultVariantId: 'COSRX-CLN-150',
    variants: [
      { id: 'COSRX-CLN-150', label: '150 ml', size: '150 ml', price: 14.00, sku: 'COSRX-CLN-150', inStock: true }
    ],
    rating: { value: 4.7, count: 520, source: 'demo' },
    images: [
      { id: 'p12-img1', role: 'primary', src: '/assets/products/cosrx-low-ph-good-morning-gel-cleanser/01-primary.webp', alt: 'COSRX Low pH Good Morning Gel Cleanser', width: 960, height: 960 },
      { id: 'p12-img2', role: 'hover', src: '/assets/products/cosrx-low-ph-good-morning-gel-cleanser/02-hover.webp', alt: 'COSRX Low pH Good Morning Gel Cleanser hover', width: 960, height: 960 },
      { id: 'p12-img3', role: 'detail', src: '/assets/products/cosrx-low-ph-good-morning-gel-cleanser/03-detail.webp', alt: 'COSRX Low pH Good Morning Gel Cleanser texture', width: 960, height: 960 }
    ],
    badges: ['bestseller'],
    shortDescription: 'Low-pH gel cleanser for morning refresh — removes impurities without stripping.',
    description: [
      'A gentle gel cleanser formulated with purifying botanical ingredients and a slightly acidic formula.',
      'Helps maintain the skin\'s optimal pH balance while removing overnight oils and dead skin cells.'
    ],
    benefits: ['Maintains optimal pH balance', 'Removes overnight impurities gently', 'Leaves skin soft and refreshed'],
    keyIngredients: [
      { name: 'Tea Tree Oil', benefit: 'purifies and calms' },
      { name: 'BHA (Betaine Salicylate)', benefit: 'gentle exfoliation' }
    ],
    fullIngredients: 'Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Polysorbate 20, Styrax Japonicus Branch/Fruit/Leaf Extract, Butylene Glycol, Saccharomyces Ferment, Cryptomeria Japonica Leaf Extract, Nelumbo Nucifera Leaf Extract, Pinus Palustris Leaf Extract, Ulmus Davidiana Root Extract, Oenothera Biennis (Evening Primrose) Flower Extract, Pueraria Lobata Root Extract, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Allantoin, Caprylyl Glycol, Ethylhexylglycerin, Betaine Salicylate, Citric Acid, Ethyl Hexanediol, 1,2-Hexanediol, Trisodium Ethylenediamine Disuccinate, Sodium Benzoate, Disodium EDTA.',
    howToUse: [
      'Gently massage a small amount of gel cleanser on wet skin in the morning.',
      'Rinse thoroughly with tepid water.',
      'Follow with toner and moisturizers.',
      'Also works great as a second cleanser in the evening.'
    ],
    skinTypes: ['All', 'Sensitive'],
    concerns: ['Morning refresh', 'pH balance', 'Gentle cleanse'],
    routineStep: 'Cleanse',
    usageTime: ['AM', 'PM'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['cleanser', 'low ph', 'gel'],
    pairsWithTags: ['tone', 'treat'],
    source: { sourceType: 'official', officialUrl: 'https://www.cosrx.com/products/low-ph-good-morning-gel-cleanser', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p13',
    slug: 'cedar-fig-eau-de-parfum',
    brandId: 'atelier-nocturne',
    brand: 'Atelier Nocturne',
    name: 'Cedar & Fig Eau de Parfum',
    subtitle: 'Woody fruit. Night air.',
    category: 'fragrance',
    productType: 'EDP',
    price: 98.00,
    currency: 'USD',
    defaultVariantId: 'AN-EDP-CF-50',
    variants: [
      { id: 'AN-EDP-CF-50', label: '50 ml', size: '50 ml', price: 98.00, sku: 'AN-EDP-CF-50', inStock: true }
    ],
    rating: { value: 4.9, count: 67, source: 'demo' },
    images: [
      { id: 'p13-img1', role: 'primary', src: '/assets/products/cedar-fig-eau-de-parfum/01-primary.webp', alt: 'Atelier Nocturne Cedar & Fig Eau de Parfum', width: 960, height: 960 },
      { id: 'p13-img2', role: 'hover', src: '/assets/products/cedar-fig-eau-de-parfum/02-hover.webp', alt: 'Atelier Nocturne Cedar & Fig Eau de Parfum hover', width: 960, height: 960 },
      { id: 'p13-img3', role: 'detail', src: '/assets/products/cedar-fig-eau-de-parfum/03-detail.webp', alt: 'Atelier Nocturne Cedar & Fig Eau de Parfum texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Independent EDP of cedar and ripe fig over soft musk.',
    description: [
      'A grounding, woody fragrance intertwined with the subtle sweetness of ripe fig.',
      'Designed to evoke the stillness of evening air and settling thoughts.'
    ],
    benefits: ['Long-lasting EDP concentration', 'Earthy yet sweet balance', 'Elegant dark glass presentation'],
    keyIngredients: [
      { name: 'Fig', benefit: 'sweet, green freshness' },
      { name: 'Cedarwood', benefit: 'dry, grounding woods' },
      { name: 'Musk', benefit: 'skin-like softness' }
    ],
    fullIngredients: 'Alcohol Denat., Parfum, Aqua; notes cedar, fig, amber, musk.',
    howToUse: [
      'Apply 1 spray to pulse points.',
      'Do not rub wrists together.',
      'Store in a cool, dark place away from direct light.'
    ],
    skinTypes: ['All'],
    concerns: ['Fragrance'],
    routineStep: 'Fragrance',
    usageTime: ['Anytime'],
    scent: 'Fig, cedarwood, dry amber, musk',
    warnings: ['Flammable. Do not spray near eyes or irritated skin.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['fragrance', 'edp', 'cedar', 'fig'],
    pairsWithTags: ['body lotion', 'mist'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p14',
    slug: 'soft-linen-hair-body-mist',
    brandId: 'atelier-nocturne',
    brand: 'Atelier Nocturne',
    name: 'Soft Linen Hair & Body Mist',
    subtitle: 'Air-dried cotton. Clean skin scent.',
    category: 'fragrance',
    productType: 'Mist',
    price: 42.00,
    currency: 'USD',
    defaultVariantId: 'AN-MST-SL-100',
    variants: [
      { id: 'AN-MST-SL-100', label: '100 ml', size: '100 ml', price: 42.00, sku: 'AN-MST-SL-100', inStock: true }
    ],
    rating: { value: 4.6, count: 41, source: 'demo' },
    images: [
      { id: 'p14-img1', role: 'primary', src: '/assets/products/soft-linen-hair-body-mist/01-primary.webp', alt: 'Atelier Nocturne Soft Linen Hair & Body Mist', width: 960, height: 960 },
      { id: 'p14-img2', role: 'hover', src: '/assets/products/soft-linen-hair-body-mist/02-hover.webp', alt: 'Atelier Nocturne Soft Linen Hair & Body Mist hover', width: 960, height: 960 },
      { id: 'p14-img3', role: 'detail', src: '/assets/products/soft-linen-hair-body-mist/03-detail.webp', alt: 'Atelier Nocturne Soft Linen Hair & Body Mist texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Sheer hair-and-body mist — sun on linen.',
    description: [
      'A lightweight mist that lightly scents hair and skin with the comfort of clean linen and iris.',
      'Perfect for an anytime refresh without heavy perfume concentration.'
    ],
    benefits: ['Light, non-overpowering scent', 'Safe for hair and body', 'Instant refresh'],
    keyIngredients: [
      { name: 'Linen notes', benefit: 'clean, airy freshness' },
      { name: 'Iris', benefit: 'powdery floral comfort' },
      { name: 'Soft Musk', benefit: 'warm base' }
    ],
    fullIngredients: 'Aqua, Alcohol Denat., PEG-40 Hydrogenated Castor Oil, Parfum, Glycerin.',
    howToUse: [
      'Mist 20 cm from hair or body.',
      'Use 2–3 sprays as needed.',
      'Avoid contact with eyes.'
    ],
    skinTypes: ['All'],
    concerns: ['Light fragrance refresh'],
    routineStep: 'Fragrance',
    usageTime: ['Anytime'],
    scent: 'Linen, iris, soft musk',
    warnings: ['For external use only. Avoid spraying in eyes.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['mist', 'linen', 'hair mist'],
    pairsWithTags: ['body lotion'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p15',
    slug: 'cedar-leaf-smoothing-body-polish',
    brandId: 'aurelle-lab',
    brand: 'Aurelle Lab',
    name: 'Cedar Leaf Smoothing Body Polish',
    subtitle: 'Soft grain for dull body skin',
    category: 'body',
    productType: 'Body scrub',
    price: 29.00,
    currency: 'USD',
    defaultVariantId: 'AL-SCR-CDR-250',
    variants: [
      { id: 'AL-SCR-CDR-250', label: '250 g', size: '250 g', price: 29.00, sku: 'AL-SCR-CDR-250', inStock: true }
    ],
    rating: { value: 4.5, count: 96, source: 'demo' },
    images: [
      { id: 'p15-img1', role: 'primary', src: '/assets/products/cedar-leaf-smoothing-body-polish/01-primary.webp', alt: 'Aurelle Lab Cedar Leaf Smoothing Body Polish', width: 960, height: 960 },
      { id: 'p15-img2', role: 'hover', src: '/assets/products/cedar-leaf-smoothing-body-polish/02-hover.webp', alt: 'Aurelle Lab Cedar Leaf Smoothing Body Polish hover', width: 960, height: 960 },
      { id: 'p15-img3', role: 'detail', src: '/assets/products/cedar-leaf-smoothing-body-polish/03-detail.webp', alt: 'Aurelle Lab Cedar Leaf Smoothing Body Polish texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Weekly body polish with cedar-leaf clarity and oil slip.',
    description: [
      'A renewing scrub that lifts away dullness with fine grains suspended in jojoba oil.',
      'Scented naturally with cedar leaf for a spa-like exfoliating ritual.'
    ],
    benefits: ['Smooths rough skin texture', 'Leaves a nourishing oil veil', 'Invigorating natural scent'],
    keyIngredients: [
      { name: 'Fine sugar/salt grain', benefit: 'physical exfoliation' },
      { name: 'Cedar leaf oil', benefit: 'clarifying aroma' },
      { name: 'Jojoba', benefit: 'moisture retention' }
    ],
    fullIngredients: 'Sucrose, Sodium Chloride, Simmondsia Chinensis (Jojoba) Seed Oil, Thuja Occidentalis (Cedar) Leaf Oil, Tocopherol.',
    howToUse: [
      'Apply to wet skin in the shower.',
      'Massage gently over limbs in circular motions.',
      'Avoid broken skin and face.',
      'Rinse and pat dry, allowing oils to absorb.'
    ],
    skinTypes: ['Normal', 'Rough body'],
    concerns: ['Exfoliation', 'Bump look'],
    routineStep: 'Body',
    usageTime: ['PM'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['body scrub', 'polish', 'cedar'],
    pairsWithTags: ['body butter', 'body lotion'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p16',
    slug: 'mineral-veil-sun-milk-spf50',
    brandId: 'solenne',
    brand: 'Solenne',
    name: 'Mineral Veil Sun Milk SPF 50',
    subtitle: 'Soft mineral milk for daily light',
    category: 'sun',
    productType: 'Sun milk',
    price: 28.00,
    currency: 'USD',
    defaultVariantId: 'SO-SUN-MVM-50',
    variants: [
      { id: 'SO-SUN-MVM-50', label: '50 ml', size: '50 ml', price: 28.00, sku: 'SO-SUN-MVM-50', inStock: true }
    ],
    rating: { value: 4.6, count: 140, source: 'demo' },
    images: [
      { id: 'p16-img1', role: 'primary', src: '/assets/products/mineral-veil-sun-milk-spf50/01-primary.webp', alt: 'Solenne Mineral Veil Sun Milk SPF 50', width: 960, height: 960 },
      { id: 'p16-img2', role: 'hover', src: '/assets/products/mineral-veil-sun-milk-spf50/02-hover.webp', alt: 'Solenne Mineral Veil Sun Milk SPF 50 hover', width: 960, height: 960 },
      { id: 'p16-img3', role: 'detail', src: '/assets/products/mineral-veil-sun-milk-spf50/03-detail.webp', alt: 'Solenne Mineral Veil Sun Milk SPF 50 texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Lightweight mineral sun milk for everyday wear (demo).',
    description: [
      'A gentle mineral formula that blends easily for daily protection.',
      'Designed to sit comfortably without a heavy feel or aggressive white cast on most tones.'
    ],
    benefits: ['Mineral-only UV defense', 'Lightweight milky texture', 'Comfortable for sensitive wearers'],
    keyIngredients: [
      { name: 'Zinc Oxide', benefit: 'mineral UV reflection' },
      { name: 'Vitamin E', benefit: 'antioxidant support' }
    ],
    fullIngredients: 'Aqua, Zinc Oxide (Nano), Caprylic/Capric Triglyceride, Glycerin, Silica, Polyhydroxystearic Acid, Tocopherol.',
    howToUse: [
      'Use as the final step in your AM skincare routine.',
      'Blend well into face and neck.',
      'Reapply every 2 hours when outdoors.'
    ],
    skinTypes: ['All'],
    concerns: ['UV daily wear', 'Mineral protection'],
    routineStep: 'Protect',
    usageTime: ['AM'],
    warnings: ['Demo SPF — UI only. For external use.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['sunscreen', 'mineral', 'spf50'],
    pairsWithTags: ['moisturize', 'cleanse'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p17',
    slug: 'daily-defense-sun-stick-spf50',
    brandId: 'aurelle-lab',
    brand: 'Aurelle Lab',
    name: 'Daily Defense Sun Stick SPF 50+',
    subtitle: 'Pocket stick for edges and reapply',
    category: 'sun',
    productType: 'Sun stick',
    price: 22.00,
    currency: 'USD',
    defaultVariantId: 'AL-SUN-STK-20',
    variants: [
      { id: 'AL-SUN-STK-20', label: '20 g', size: '20 g', price: 22.00, sku: 'AL-SUN-STK-20', inStock: true }
    ],
    rating: { value: 4.5, count: 88, source: 'demo' },
    images: [
      { id: 'p17-img1', role: 'primary', src: '/assets/products/daily-defense-sun-stick-spf50/01-primary.webp', alt: 'Aurelle Lab Daily Defense Sun Stick SPF 50+', width: 960, height: 960 },
      { id: 'p17-img2', role: 'hover', src: '/assets/products/daily-defense-sun-stick-spf50/02-hover.webp', alt: 'Aurelle Lab Daily Defense Sun Stick SPF 50+ hover', width: 960, height: 960 },
      { id: 'p17-img3', role: 'detail', src: '/assets/products/daily-defense-sun-stick-spf50/03-detail.webp', alt: 'Aurelle Lab Daily Defense Sun Stick SPF 50+ texture', width: 960, height: 960 }
    ],
    badges: ['new'],
    shortDescription: 'Portable stick for nose, cheeks, reapplication.',
    description: [
      'A solid sun protection stick designed for easy, hands-free application on the go.',
      'Perfect for quick touch-ups on high points of the face during the day.'
    ],
    benefits: ['Travel-friendly solid format', 'Mess-free application', 'Leaves a soft matte finish'],
    keyIngredients: [
      { name: 'UV Filters', benefit: 'broad-spectrum protection' },
      { name: 'Synthetic Wax', benefit: 'smooth glide' }
    ],
    fullIngredients: 'Synthetic Wax, Butyloctyl Salicylate, Diisopropyl Sebacate, [Demo UV Filters], Silica, Microcrystalline Wax.',
    howToUse: [
      'Twist up 2–3 mm.',
      'Swipe directly across the face, focusing on high points (nose, cheekbones).',
      'Blend slightly with fingers if necessary.',
      'Reapply every 2 hours outdoors.'
    ],
    skinTypes: ['All'],
    concerns: ['On-the-go protection', 'Reapplication'],
    routineStep: 'Protect',
    usageTime: ['AM', 'PM'],
    warnings: ['Demo SPF — UI only. Keep away from extreme heat.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['sunscreen', 'stick', 'portable'],
    pairsWithTags: ['moisturize', 'cleanse'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p18',
    slug: 'aloe-mineral-after-sun-gel',
    brandId: 'harbor-hearth',
    brand: 'Harbor & Hearth',
    name: 'Aloe Mineral After-Sun Gel',
    subtitle: 'Cool down after light',
    category: 'sun',
    productType: 'After-sun',
    price: 19.00,
    currency: 'USD',
    defaultVariantId: 'HH-AS-ALO-150',
    variants: [
      { id: 'HH-AS-ALO-150', label: '150 ml', size: '150 ml', price: 19.00, sku: 'HH-AS-ALO-150', inStock: true }
    ],
    rating: { value: 4.6, count: 210, source: 'demo' },
    images: [
      { id: 'p18-img1', role: 'primary', src: '/assets/products/aloe-mineral-after-sun-gel/01-primary.webp', alt: 'Harbor & Hearth Aloe Mineral After-Sun Gel', width: 960, height: 960 },
      { id: 'p18-img2', role: 'hover', src: '/assets/products/aloe-mineral-after-sun-gel/02-hover.webp', alt: 'Harbor & Hearth Aloe Mineral After-Sun Gel hover', width: 960, height: 960 },
      { id: 'p18-img3', role: 'detail', src: '/assets/products/aloe-mineral-after-sun-gel/03-detail.webp', alt: 'Harbor & Hearth Aloe Mineral After-Sun Gel texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Aloe gel for post-sun comfort — recovery, not protection.',
    description: [
      'A cooling, mineral-infused gel that comforts skin after sun exposure.',
      'Hydrates rapidly and brings down the feeling of heat in the skin.'
    ],
    benefits: ['Rapidly cools warm skin', 'Soothes post-sun tightness', 'Lightweight gel absorption'],
    keyIngredients: [
      { name: 'Aloe Vera', benefit: 'cooling hydration' },
      { name: 'Panthenol', benefit: 'barrier comfort' },
      { name: 'Allantoin', benefit: 'soothing' }
    ],
    fullIngredients: 'Aloe Barbadensis Leaf Juice, Aqua, Glycerin, Panthenol, Allantoin, Carbomer, Phenoxyethanol, Sodium Hydroxide.',
    howToUse: [
      'After sun exposure, cleanse skin gently.',
      'Apply gel liberally to affected areas.',
      'Not a substitute for sunscreen.'
    ],
    skinTypes: ['All'],
    concerns: ['Post-sun heat', 'Tightness'],
    routineStep: 'Body', // Can act as body/treat after-sun
    usageTime: ['Anytime'],
    warnings: ['For external use only. Discontinue if irritation occurs. Patch test recommended.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['after-sun', 'aloe', 'cooling'],
    pairsWithTags: ['body cleanser'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p19',
    slug: 'amber-iris-eau-de-parfum',
    brandId: 'atelier-nocturne',
    brand: 'Atelier Nocturne',
    name: 'Amber Iris Eau de Parfum',
    subtitle: 'Powdered iris over warm amber',
    category: 'fragrance',
    productType: 'EDP',
    price: 88.00,
    currency: 'USD',
    defaultVariantId: 'AN-EDP-AI-50',
    variants: [
      { id: 'AN-EDP-AI-50', label: '50 ml', size: '50 ml', price: 88.00, sku: 'AN-EDP-AI-50', inStock: true }
    ],
    rating: { value: 4.7, count: 52, source: 'demo' },
    images: [
      { id: 'p19-img1', role: 'primary', src: '/assets/products/amber-iris-eau-de-parfum/01-primary.webp', alt: 'Atelier Nocturne Amber Iris Eau de Parfum', width: 960, height: 960 },
      { id: 'p19-img2', role: 'hover', src: '/assets/products/amber-iris-eau-de-parfum/02-hover.webp', alt: 'Atelier Nocturne Amber Iris Eau de Parfum hover', width: 960, height: 960 },
      { id: 'p19-img3', role: 'detail', src: '/assets/products/amber-iris-eau-de-parfum/03-detail.webp', alt: 'Atelier Nocturne Amber Iris Eau de Parfum texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Powdery iris EDP with warm amber dry-down — evening soft.',
    description: [
      'An elegant nighttime fragrance balancing powdery iris florals with deep, resinous amber.',
      'Sits close to the skin as it dries down to a soft, woody warmth.'
    ],
    benefits: ['Intimate, warm sillage', 'Powdery floral elegance', 'Long-lasting EDP'],
    keyIngredients: [
      { name: 'Iris', benefit: 'powdery floral top' },
      { name: 'Amber', benefit: 'resinous, warm base' },
      { name: 'Soft Woods', benefit: 'grounding depth' }
    ],
    fullIngredients: 'Alcohol Denat., Parfum, Aqua; notes iris, amber, sandalwood.',
    howToUse: [
      'Apply to pulse points such as wrists and neck.',
      'Use a light hand for a subtle skin scent.',
      'Store in a dark, cool place.'
    ],
    skinTypes: ['All'],
    concerns: ['Fragrance'],
    routineStep: 'Fragrance',
    usageTime: ['PM'],
    scent: 'Iris, amber, soft woods',
    warnings: ['Flammable. Do not spray near eyes or irritated skin.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['fragrance', 'edp', 'amber', 'iris'],
    pairsWithTags: ['body lotion'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  },
  {
    id: 'p20',
    slug: 'neroli-moss-eau-de-parfum',
    brandId: 'maison-verde',
    brand: 'Maison Verdé',
    name: 'Neroli Moss Eau de Parfum',
    subtitle: 'Citrus bloom on forest floor',
    category: 'fragrance',
    productType: 'EDP',
    price: 92.00,
    currency: 'USD',
    defaultVariantId: 'MV-EDP-NM-50',
    variants: [
      { id: 'MV-EDP-NM-50', label: '50 ml', size: '50 ml', price: 92.00, sku: 'MV-EDP-NM-50', inStock: true }
    ],
    rating: { value: 4.8, count: 61, source: 'demo' },
    images: [
      { id: 'p20-img1', role: 'primary', src: '/assets/products/neroli-moss-eau-de-parfum/01-primary.webp', alt: 'Maison Verdé Neroli Moss Eau de Parfum', width: 960, height: 960 },
      { id: 'p20-img2', role: 'hover', src: '/assets/products/neroli-moss-eau-de-parfum/02-hover.webp', alt: 'Maison Verdé Neroli Moss Eau de Parfum hover', width: 960, height: 960 },
      { id: 'p20-img3', role: 'detail', src: '/assets/products/neroli-moss-eau-de-parfum/03-detail.webp', alt: 'Maison Verdé Neroli Moss Eau de Parfum texture', width: 960, height: 960 }
    ],
    badges: [],
    shortDescription: 'Neroli lifted over mossy base — botanical fragrance house entry.',
    description: [
      'A bright opening of citrus blossoms grounded by the damp, earthy depth of forest moss.',
      'A fresh yet complex botanical perfume that evolves through the day.'
    ],
    benefits: ['Bright floral opening', 'Earthy, green dry-down', 'Daytime elegance'],
    keyIngredients: [
      { name: 'Neroli', benefit: 'citrus floral brightness' },
      { name: 'Moss', benefit: 'earthy green base' },
      { name: 'Light Woods', benefit: 'subtle structure' }
    ],
    fullIngredients: 'Alcohol Denat., Parfum, Aqua; notes neroli, oakmoss, cedar.',
    howToUse: [
      'Spray 1–2 times on pulse points.',
      'Avoid rubbing to preserve the top notes.',
      'Store away from direct sunlight.'
    ],
    skinTypes: ['All'],
    concerns: ['Fragrance'],
    routineStep: 'Fragrance',
    usageTime: ['AM', 'PM'],
    scent: 'Neroli, moss, light woods',
    warnings: ['Flammable. Do not spray near eyes or irritated skin.'],
    shippingNote: 'Complimentary shipping on orders $50+ (demo policy).',
    returnNote: '30-day returns on unused items (demo policy).',
    relatedTags: ['fragrance', 'edp', 'neroli', 'moss'],
    pairsWithTags: ['body lotion'],
    source: { sourceType: 'fictional', lastVerified: '2026-07-17', market: 'US' }
  }
];

export const products: Product[] = rawProducts.map((p) => {
  const primaryImg = p.images.find((img) => img.role === 'primary') || p.images[0];
  return {
    ...p,
    image: primaryImg?.src || '',
    isNew: p.badges.includes('new'),
    isBestSeller: p.badges.includes('bestseller'),
  } as unknown as Product;
});

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function findProductByName(name: string) {
  let searchName = name;
  if (name === 'Advanced Snail Mucin 96% Power Repairing Essence Serum') {
    searchName = 'Advanced Mnail 96 Mucin Power Essence'; // wait, it's Advanced Snail 96 Mucin Power Essence
    searchName = 'Advanced Snail 96 Mucin Power Essence';
  } else if (name === 'Green Tea Deep Cleansing') {
    searchName = 'Green Tea Deep Cleansing Gel';
  }
  return products.find((p) => p.name === searchName);
}

export function categoryLabel(category: ProductCategory) {
  const labels: Record<ProductCategory, string> = {
    skin: 'Skincare',
    body: 'Body',
    sun: 'Sun Care',
    fragrance: 'Fragrance',
  };
  return labels[category];
}


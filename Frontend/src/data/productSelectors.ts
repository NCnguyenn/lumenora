import type { Product, ProductCategory } from './types';
import { products } from './products';
import { brands } from './brands';

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBrandById(id: string) {
  return brands[id];
}

// Temporary for migration
export function findProductByName(name: string): Product | undefined {
  return products.find((p) => p.name === name);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId);
}

export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return products;

  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.brand.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.productType.toLowerCase().includes(normalizedQuery) ||
      p.benefits.some(b => b.toLowerCase().includes(normalizedQuery)) ||
      p.concerns.some(c => c.toLowerCase().includes(normalizedQuery)) ||
      p.keyIngredients.some(i => i.name.toLowerCase().includes(normalizedQuery))
    );
  });
}

interface FilterParams {
  category?: ProductCategory;
  brand?: string;
  maxPrice?: number;
  q?: string;
  sort?: string;
}

export function filterProducts(params: FilterParams): Product[] {
  let result = [...products];

  if (params.category) {
    result = result.filter((p) => p.category === params.category);
  }
  if (params.brand) {
    result = result.filter((p) => p.brandId === params.brand);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= params.maxPrice!);
  }
  if (params.q) {
    result = searchProducts(params.q);
  }

  if (params.sort) {
    result = sortProducts(result, params.sort);
  }

  return result;
}

export function sortProducts(productsToSort: Product[], sort: string): Product[] {
  const result = [...productsToSort];
  switch (sort) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
      break;
    case 'rating':
      result.sort((a, b) => b.rating.value - a.rating.value || b.rating.count - a.rating.count || a.name.localeCompare(b.name));
      break;
    case 'new':
      result.sort((a, b) => {
        const aNew = a.badges.includes('new') ? 1 : 0;
        const bNew = b.badges.includes('new') ? 1 : 0;
        return bNew - aNew || a.name.localeCompare(b.name);
      });
      break;
    case 'bestsellers':
      result.sort((a, b) => {
        const aBest = a.badges.includes('bestseller') ? 1 : 0;
        const bBest = b.badges.includes('bestseller') ? 1 : 0;
        return bBest - aBest || a.name.localeCompare(b.name);
      });
      break;
    default:
      break;
  }
  return result;
}

function uniqueById(items: Product[]): Product[] {
  const seen = new Set<string>();
  const unique: Product[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

function resolveHardcodedIds(
  ids: string[] | undefined,
  selfId: string,
  excludeIds: Set<string> = new Set(),
): Product[] {
  if (!ids?.length) return [];
  return uniqueById(
    ids
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined && p.id !== selfId && !excludeIds.has(p.id)),
  );
}

/** True for daily SPF protectors — not after-sun recovery gels. */
function isSunscreenLike(product: Product): boolean {
  const type = product.productType.toLowerCase();
  if (type.includes('after-sun') || type.includes('after sun')) return false;
  return (
    type.includes('sunscreen') ||
    type.includes('sun milk') ||
    type.includes('sun stick') ||
    type.includes('spf') ||
    (product.category === 'sun' && product.routineStep === 'Protect')
  );
}

export function getSimilarProducts(
  product: Product,
  limit: number = 4,
  excludeIds: string[] = [],
): Product[] {
  const blocked = new Set(excludeIds);

  const scored = products
    .filter((p) => p.id !== product.id && !blocked.has(p.id))
    .map((p) => {
      let score = 0;
      if (p.productType === product.productType) score += 40;
      if (p.category === product.category) score += 25;

      const concernOverlap = p.concerns.filter((c) => product.concerns.includes(c)).length;
      score += concernOverlap * 10;

      const skinTypeOverlap = p.skinTypes.filter((s) => product.skinTypes.includes(s)).length;
      score += skinTypeOverlap * 6;

      const pTags = [
        ...p.relatedTags,
        ...p.keyIngredients.map((i) => i.name.toLowerCase()),
      ];
      const productTags = [
        ...product.relatedTags,
        ...product.keyIngredients.map((i) => i.name.toLowerCase()),
      ];
      const tagOverlap = pTags.filter((t) => productTags.includes(t)).length;
      score += tagOverlap * 5;

      if (product.price > 0 && Math.abs(p.price - product.price) / product.price <= 0.25) {
        score += 8;
      }

      if (p.brandId === product.brandId) score += 4;
      if (p.badges.includes('bestseller')) score += 2;

      return { p, score };
    });

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      b.p.rating.value - a.p.rating.value ||
      a.p.name.localeCompare(b.p.name),
  );

  const scoredResults = scored.map((s) => s.p);
  const hardcoded = resolveHardcodedIds(product.relatedIds, product.id, blocked);
  let results = uniqueById([...hardcoded, ...scoredResults]).slice(0, limit);

  // Fallback: same category → featured/bestsellers when scorer is thin
  if (results.length < limit) {
    const fallback = sortProducts(
      products.filter(
        (p) =>
          p.id !== product.id &&
          !blocked.has(p.id) &&
          p.category === product.category &&
          !results.some((r) => r.id === p.id),
      ),
      'bestsellers',
    );
    results = uniqueById([...results, ...fallback]).slice(0, limit);
  }

  return results;
}

const routineOrder = [
  'Cleanse',
  'Tone',
  'Treat',
  'Moisturize',
  'Protect',
  'Body',
  'Fragrance',
] as const;

function normalizeTag(value: string): string {
  return value.toLowerCase().trim();
}

function scoreRoutineCandidate(product: Product, candidate: Product): number {
  let score = 0;

  const stepIndex = routineOrder.indexOf(
    product.routineStep as (typeof routineOrder)[number],
  );
  const candidateStepIndex = routineOrder.indexOf(
    candidate.routineStep as (typeof routineOrder)[number],
  );

  if (stepIndex >= 0 && candidateStepIndex >= 0) {
    const distance = Math.abs(stepIndex - candidateStepIndex);
    if (distance === 1) score += 30;
    else if (distance === 2) score += 12;
  }

  const pairs = product.pairsWithTags.map(normalizeTag);
  const candidateTokens = [
    ...candidate.relatedTags,
    candidate.productType,
    candidate.routineStep,
    candidate.category,
  ].map(normalizeTag);

  for (const tag of pairs) {
    if (candidateTokens.some((token) => token.includes(tag) || tag.includes(token))) {
      score += 18;
    }
  }

  // Body cleanser ↔ lotion/butter/scrub complementarity
  if (product.category === 'body' && candidate.category === 'body') {
    const a = product.productType.toLowerCase();
    const b = candidate.productType.toLowerCase();
    const aWash = a.includes('cleanser') || a.includes('scrub') || a.includes('polish');
    const bMoist =
      b.includes('lotion') || b.includes('butter') || b.includes('body');
    const bWash = b.includes('cleanser') || b.includes('scrub') || b.includes('polish');
    const aMoist =
      a.includes('lotion') || a.includes('butter');
    if ((aWash && bMoist) || (aMoist && bWash)) score += 20;
  }

  // Fragrance: prefer mist with EDP (or reverse), not two near-identical EDPs only
  if (product.category === 'fragrance' && candidate.category === 'fragrance') {
    const aMist = product.productType.toLowerCase().includes('mist');
    const bMist = candidate.productType.toLowerCase().includes('mist');
    if (aMist !== bMist) score += 16;
    else score += 6;
  }

  // Prefer adjacent skin steps over same step
  if (product.category === 'skin' && candidate.category === 'skin') {
    if (candidate.routineStep !== product.routineStep) score += 10;
  }

  // Sun: prefer moisturize/cleanse pairings over stacking SPF
  if (isSunscreenLike(product)) {
    if (candidate.routineStep === 'Moisturize' || candidate.routineStep === 'Cleanse') {
      score += 22;
    }
    if (isSunscreenLike(candidate)) score -= 25;
  }

  if (candidate.badges.includes('bestseller')) score += 2;
  score += candidate.rating.value;

  return score;
}

export function getRoutinePairings(
  product: Product,
  limit: number = 4,
  excludeIds: string[] = [],
): Product[] {
  const blocked = new Set(excludeIds);
  const hardcoded = resolveHardcodedIds(product.pairsWithIds, product.id, blocked);
  let results = [...hardcoded];

  if (results.length >= limit) {
    return uniqueById(results).slice(0, limit);
  }

  const taken = new Set(results.map((r) => r.id));
  taken.add(product.id);
  for (const id of blocked) taken.add(id);

  const candidates = products
    .filter((p) => !taken.has(p.id))
    .map((p) => ({ p, score: scoreRoutineCandidate(product, p) }))
    .filter(({ score, p }) => {
      // Keep only meaningful ritual partners
      if (score < 8) return false;
      // Soft gate: avoid second near-identical SPF when current is SPF
      if (isSunscreenLike(product) && isSunscreenLike(p) && score < 20) return false;
      return true;
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.p.rating.value - a.p.rating.value ||
        a.p.name.localeCompare(b.p.name),
    );

  for (const { p } of candidates) {
    if (results.length >= limit) break;
    // Prefer not stacking two SPF products in the ritual rail
    if (
      isSunscreenLike(product) &&
      isSunscreenLike(p) &&
      results.some((r) => isSunscreenLike(r))
    ) {
      continue;
    }
    results.push(p);
  }

  // Last resort: adjacent routine steps within category
  if (results.length < limit) {
    const stepIndex = routineOrder.indexOf(
      product.routineStep as (typeof routineOrder)[number],
    );
    const targetSteps = new Set<string>();
    if (stepIndex >= 0) {
      if (stepIndex < routineOrder.length - 1) targetSteps.add(routineOrder[stepIndex + 1]);
      if (stepIndex > 0) targetSteps.add(routineOrder[stepIndex - 1]);
    }
    if (product.category === 'body') targetSteps.add('Body');
    if (product.category === 'fragrance') targetSteps.add('Fragrance');
    if (product.category === 'sun') {
      targetSteps.add('Moisturize');
      targetSteps.add('Cleanse');
      targetSteps.add('Protect');
    }

    const fallback = products.filter(
      (p) =>
        !taken.has(p.id) &&
        !results.some((r) => r.id === p.id) &&
        targetSteps.has(p.routineStep) &&
        (p.category === product.category ||
          (product.category === 'sun' &&
            (p.category === 'skin' || p.category === 'body' || p.category === 'sun'))),
    );

    results = uniqueById([...results, ...fallback]).slice(0, limit);
  }

  return uniqueById(results).slice(0, limit);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function categoryLabel(category: ProductCategory): string {
  const labels: Record<ProductCategory, string> = {
    skin: 'Skincare',
    body: 'Body',
    sun: 'Sun Care',
    fragrance: 'Fragrance',
  };
  return labels[category] || category;
}

export function getPrimaryImage(product: Product) {
  return product.images.find(img => img.role === 'primary') || product.images[0];
}

export function getHoverImage(product: Product) {
  return product.images.find(img => img.role === 'hover') || product.images[1] || getPrimaryImage(product);
}

export function validateCatalog() {
  const errors: string[] = [];
  
  if (products.length !== 20) {
    errors.push(`Expected 20 products, found ${products.length}`);
  }

  const ids = new Set();
  const slugs = new Set();
  const skus = new Set();

  products.forEach(p => {
    if (ids.has(p.id)) errors.push(`Duplicate ID: ${p.id}`);
    ids.add(p.id);

    if (slugs.has(p.slug)) errors.push(`Duplicate slug: ${p.slug}`);
    slugs.add(p.slug);

    if (p.images.length < 3) {
      errors.push(`Product ${p.id} has ${p.images.length} images, expected >= 3`);
    } else {
      const roles = p.images.map(i => i.role);
      if (!roles.includes('primary') || !roles.includes('hover') || !roles.includes('detail')) {
        errors.push(`Product ${p.id} missing required image roles`);
      }
    }

    const defaultVariant = p.variants.find(v => v.id === p.defaultVariantId);
    if (!defaultVariant) {
      errors.push(`Product ${p.id} defaultVariantId ${p.defaultVariantId} not found`);
    } else if (defaultVariant.price !== p.price) {
      errors.push(`Product ${p.id} price ${p.price} does not match default variant price ${defaultVariant.price}`);
    }

    p.variants.forEach(v => {
      if (skus.has(v.sku)) errors.push(`Duplicate SKU: ${v.sku} in product ${p.id}`);
      skus.add(v.sku);
    });

    if (p.source.sourceType === 'official' && !p.source.officialUrl) {
      errors.push(`Product ${p.id} is official but missing officialUrl`);
    }
  });

  if (errors.length > 0) {
    console.error('Catalog Validation Errors:', errors);
  } else {
    console.log('Catalog is valid!');
  }
  
  return errors;
}

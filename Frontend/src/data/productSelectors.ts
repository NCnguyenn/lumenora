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

export function getSimilarProducts(product: Product, limit: number = 4): Product[] {
  const scored = products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.productType === product.productType) score += 40;
      if (p.category === product.category) score += 25;
      
      const concernOverlap = p.concerns.filter(c => product.concerns.includes(c)).length;
      score += concernOverlap * 10;
      
      const skinTypeOverlap = p.skinTypes.filter(s => product.skinTypes.includes(s)).length;
      score += skinTypeOverlap * 6;
      
      const pTags = [...p.relatedTags, ...p.keyIngredients.map(i => i.name.toLowerCase())];
      const productTags = [...product.relatedTags, ...product.keyIngredients.map(i => i.name.toLowerCase())];
      const tagOverlap = pTags.filter(t => productTags.includes(t)).length;
      score += tagOverlap * 5;
      
      if (Math.abs(p.price - product.price) / product.price <= 0.25) score += 8;
      
      if (p.brandId === product.brandId) score += 4;
      if (p.badges.includes('bestseller')) score += 2;
      
      return { p, score };
    });

  scored.sort((a, b) => b.score - a.score || b.p.rating.value - a.p.rating.value || a.p.name.localeCompare(b.p.name));
  
  let results = scored.slice(0, limit).map((s) => s.p);
  
  if (product.relatedIds && product.relatedIds.length > 0) {
    const hardcoded = product.relatedIds.map(id => getProductById(id)).filter(Boolean) as Product[];
    results = [...hardcoded, ...results].slice(0, limit);
    results = Array.from(new Set(results));
  }

  return results;
}

const routineOrder = ['Cleanse', 'Tone', 'Treat', 'Moisturize', 'Protect', 'Body', 'Fragrance'];

export function getRoutinePairings(product: Product, limit: number = 4): Product[] {
  let results: Product[] = [];
  
  if (product.pairsWithIds && product.pairsWithIds.length > 0) {
    const hardcoded = product.pairsWithIds.map(id => getProductById(id)).filter(Boolean) as Product[];
    results = [...hardcoded];
  }

  if (results.length < limit) {
    const stepIndex = routineOrder.indexOf(product.routineStep);
    let targetSteps: string[] = [];
    
    if (product.category === 'skin') {
       if (stepIndex >= 0 && stepIndex < 4) targetSteps.push(routineOrder[stepIndex + 1]);
       if (stepIndex > 0 && stepIndex <= 4) targetSteps.push(routineOrder[stepIndex - 1]);
    } else if (product.category === 'body') {
       targetSteps = product.productType.toLowerCase().includes('cleanser') || product.productType.toLowerCase().includes('scrub') 
         ? ['Body'] 
         : ['Body']; 
    } else if (product.category === 'fragrance') {
       targetSteps = ['Fragrance'];
    }

    const matched = products.filter(p => 
      p.id !== product.id && 
      !results.find(r => r.id === p.id) &&
      targetSteps.includes(p.routineStep) &&
      p.category === product.category
    );
    
    results = [...results, ...matched].slice(0, limit);
  }

  return results;
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

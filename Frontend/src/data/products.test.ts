import { describe, it, expect } from 'vitest';
import { products } from './products';
import { brandList } from './brands';
import { validateCatalog, getProductById, getProductBySlug, getProductsByCategory, searchProducts, getSimilarProducts, getRoutinePairings } from './productSelectors';

describe('Catalog Validation', () => {
  it('should have exactly 20 products', () => {
    expect(products.length).toBe(20);
  });

  it('should pass full validation logic without errors', () => {
    const errors = validateCatalog();
    expect(errors).toHaveLength(0);
  });

  it('should have 8 skin, 4 body, 4 sun, 4 fragrance products', () => {
    expect(products.filter(p => p.category === 'skin').length).toBe(8);
    expect(products.filter(p => p.category === 'body').length).toBe(4);
    expect(products.filter(p => p.category === 'sun').length).toBe(4);
    expect(products.filter(p => p.category === 'fragrance').length).toBe(4);
  });

  it('should have unique IDs and Slugs', () => {
    const ids = new Set(products.map(p => p.id));
    const slugs = new Set(products.map(p => p.slug));
    expect(ids.size).toBe(20);
    expect(slugs.size).toBe(20);
  });

  it('should have properly resolved COSRX products', () => {
    const p8 = getProductById('p8');
    const p12 = getProductById('p12');
    
    expect(p8).toBeDefined();
    expect(p12).toBeDefined();
    
    expect(p8?.productType).toBe('Essence');
    expect(p12?.productType).toBe('Cleanser');
    expect(p8?.brandId).toBe('cosrx');
    expect(p12?.brandId).toBe('cosrx');
  });

  it('all official products should have officialUrl', () => {
    const officialProducts = products.filter(p => p.source.sourceType === 'official');
    officialProducts.forEach(p => {
      expect(p.source.officialUrl).toBeDefined();
      expect(p.source.lastVerified).toBeDefined();
    });
  });

  it('all fictional brands should be defined', () => {
    const fictionalBrands = brandList.filter(b => b.sourceType === 'fictional');
    expect(fictionalBrands.length).toBe(5); // Aurelle Lab, Harbor & Hearth, Maison Verdé, Solenne, Atelier Nocturne
  });
});

describe('Product Selectors', () => {
  it('getProductBySlug should return correct product', () => {
    const p = getProductBySlug('bamboo-ultra-hydrating-toner');
    expect(p).toBeDefined();
    expect(p?.id).toBe('p1');
  });

  it('getProductsByCategory should return correct products', () => {
    const fragrances = getProductsByCategory('fragrance');
    expect(fragrances.length).toBe(4);
    expect(fragrances.every(p => p.category === 'fragrance')).toBe(true);
  });

  it('searchProducts should find products by name', () => {
    const results = searchProducts('snail');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(p => p.name.toLowerCase().includes('snail') || p.description.some(d => d.toLowerCase().includes('snail')))).toBe(true);
  });

  it('getSimilarProducts should return 4 items not including self', () => {
    const p1 = getProductById('p1');
    expect(p1).toBeDefined();
    if (p1) {
      const similar = getSimilarProducts(p1, 4);
      expect(similar.length).toBe(4);
      expect(similar.find(p => p.id === p1.id)).toBeUndefined();
      // relatedIds for p1 seed the list when present
      if (p1.relatedIds?.length) {
        expect(similar[0].id).toBe(p1.relatedIds[0]);
      }
    }
  });

  it('getSimilarProducts respects excludeIds', () => {
    const p1 = getProductById('p1');
    expect(p1).toBeDefined();
    if (!p1) return;
    const firstPass = getSimilarProducts(p1, 4);
    const blocked = firstPass.map((p) => p.id);
    const second = getSimilarProducts(p1, 4, blocked);
    for (const item of second) {
      expect(blocked).not.toContain(item.id);
      expect(item.id).not.toBe(p1.id);
    }
  });

  it('getRoutinePairings should return related steps', () => {
    const p1 = getProductById('p1'); // Toner
    expect(p1).toBeDefined();
    if (p1) {
      const routine = getRoutinePairings(p1, 4);
      // P1 is Toner — should pair with Cleanse / Treat / other ritual partners
      expect(routine.length).toBeGreaterThan(0);
      expect(routine.find(p => p.id === p1.id)).toBeUndefined();
    }
  });

  it('getRoutinePairings excludes ids already used on the similar rail', () => {
    const p1 = getProductById('p1');
    expect(p1).toBeDefined();
    if (!p1) return;
    const similar = getSimilarProducts(p1, 4);
    const routine = getRoutinePairings(p1, 4, similar.map((p) => p.id));
    for (const item of routine) {
      expect(similar.map((s) => s.id)).not.toContain(item.id);
      expect(item.id).not.toBe(p1.id);
    }
  });

  it('getRoutinePairings prefers not stacking SPF with another SPF for sun products', () => {
    const spf = getProductById('p11');
    expect(spf).toBeDefined();
    if (!spf) return;
    const routine = getRoutinePairings(spf, 4);
    const isSpfProtector = (p: { productType: string; category: string; routineStep: string }) => {
      const type = p.productType.toLowerCase();
      if (type.includes('after-sun') || type.includes('after sun')) return false;
      return (
        type.includes('sunscreen') ||
        type.includes('sun milk') ||
        type.includes('sun stick') ||
        type.includes('spf') ||
        (p.category === 'sun' && p.routineStep === 'Protect')
      );
    };
    const sunscreenCount = routine.filter(isSpfProtector).length;
    expect(sunscreenCount).toBeLessThanOrEqual(1);
  });
});

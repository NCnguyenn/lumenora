import type { Brand } from './types';

export const brands: Record<string, Brand> = {
  'aurelle-lab': {
    id: 'aurelle-lab',
    name: 'Aurelle Lab',
    slug: 'aurelle-lab',
    sourceType: 'fictional',
    shortStory: 'Clinical-botanical skincare formulated with precision and calm.',
    fullStory: 'Aurelle Lab bridges the gap between clinical efficacy and botanical gentleness. Our formulations focus on barrier health and profound hydration without overwhelming the skin.',
  },
  'harbor-hearth': {
    id: 'harbor-hearth',
    name: 'Harbor & Hearth',
    slug: 'harbor-hearth',
    sourceType: 'fictional',
    shortStory: 'Nordic apothecary traditions brought to daily body care.',
    fullStory: 'Drawing from Nordic landscapes, Harbor & Hearth uses birch, eucalyptus, and aloe to soothe and restore. Our products are designed for quiet rituals and cool comfort.',
  },
  'maison-verde': {
    id: 'maison-verde',
    name: 'Maison Verdé',
    slug: 'maison-verde',
    sourceType: 'fictional',
    shortStory: 'French botanical elegance in every jar.',
    fullStory: 'Maison Verdé crafts rich, herbal formulas using mugwort, clay, and neroli. Encased in ceramic and olive glass, our line invites you to slow down and reconnect with nature.',
  },
  'solenne': {
    id: 'solenne',
    name: 'Solenne',
    slug: 'solenne',
    sourceType: 'fictional',
    shortStory: 'Mediterranean warmth and daily protection.',
    fullStory: 'Solenne captures the feeling of late afternoon sun. We specialize in rich body butters and comfortable daily sun protection with soft, sheer finishes.',
  },
  'atelier-nocturne': {
    id: 'atelier-nocturne',
    name: 'Atelier Nocturne',
    slug: 'atelier-nocturne',
    sourceType: 'fictional',
    shortStory: 'Evocative evening fragrances for quiet moments.',
    fullStory: 'Atelier Nocturne builds scents around the stillness of the night. From cedar to soft linen, our perfumes and mists linger softly without overwhelming the room.',
  },
  'cosrx': {
    id: 'cosrx',
    name: 'COSRX',
    slug: 'cosrx',
    sourceType: 'official',
    shortStory: 'Effective, accessible skincare focusing on functional ingredients.',
    officialUrl: 'https://www.cosrx.com',
  },
  'the-ordinary': {
    id: 'the-ordinary',
    name: 'The Ordinary',
    slug: 'the-ordinary',
    sourceType: 'official',
    shortStory: 'Clinical formulations with integrity and transparency.',
    officialUrl: 'https://theordinary.com',
  },
};

export const brandList = Object.values(brands);

import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import type { Product } from '../../data/products';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useAppStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 z-10">
            NEW
          </span>
        )}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#8B4513] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 z-10">
            BEST SELLER
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-primary z-10 transition-colors"
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-primary")} />
        </button>
        <Link to={`/shop`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{product.brand}</p>
        <Link to={`/shop`} className="text-sm font-serif leading-tight hover:underline line-clamp-2">
          {product.name}
        </Link>
        <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}


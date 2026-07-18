import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  formatPrice,
  getPrimaryImage,
  getProductById,
} from '../data/productSelectors';
import { useAppStore } from '../store/useAppStore';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useAppStore();

  const lines = cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const variant =
        product.variants.find((entry) => entry.id === item.variantId) ??
        product.variants.find((entry) => entry.id === product.defaultVariantId) ??
        product.variants[0];
      if (!variant) return null;
      const image = getPrimaryImage(product);
      return {
        key: `${item.productId}:${item.variantId}`,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        product,
        variant,
        unitPrice: variant.price,
        lineTotal: variant.price * item.quantity,
        imageSrc: image?.src ?? product.image,
        imageAlt: image?.alt ?? product.name,
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const subtotal = lines.reduce((acc, line) => acc + line.lineTotal, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-[70vh] bg-ivory px-5 py-16 text-charcoal sm:px-6 md:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-editorial">
        <h1 className="mb-12 font-serif text-3xl md:text-4xl">
          Shopping Cart{' '}
          <span className="text-2xl italic text-charcoal/55">({lines.length})</span>
        </h1>

        {lines.length === 0 ? (
          <div className="py-24 text-center">
            <p className="mb-6 font-serif text-lg text-charcoal/60">
              Your cart is currently empty.
            </p>
            <Link to="/shop">
              <Button>CONTINUE SHOPPING</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
            <div className="w-full lg:w-2/3">
              <div className="hidden grid-cols-12 gap-4 border-b border-charcoal/15 pb-4 text-[10px] font-medium uppercase tracking-folio text-charcoal/55 md:grid">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="flex flex-col gap-6 pt-6">
                {lines.map((line) => (
                  <div
                    key={line.key}
                    className="flex flex-col items-center gap-4 border-b border-charcoal/15 pb-6 md:grid md:grid-cols-12"
                  >
                    <div className="col-span-6 flex w-full gap-6">
                      <Link
                        to={`/products/${line.product.slug}`}
                        className="h-28 w-24 shrink-0 overflow-hidden bg-parchment"
                      >
                        <img
                          src={line.imageSrc}
                          alt={line.imageAlt}
                          className="h-full w-full object-cover"
                          width={96}
                          height={112}
                        />
                      </Link>
                      <div className="flex flex-col justify-center">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-folio text-brass">
                          {line.product.brand}
                        </p>
                        <Link
                          to={`/products/${line.product.slug}`}
                          className="mb-1 font-serif text-sm leading-tight text-charcoal transition-colors hover:text-oxblood"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mb-2 text-[11px] text-charcoal/55">
                          {line.variant.size || line.variant.label}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(line.productId, line.variantId)
                          }
                          className="mt-auto flex w-fit items-center gap-1 text-[10px] font-medium uppercase tracking-folio text-oxblood transition-opacity hover:opacity-70"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 hidden text-center text-sm font-medium tabular-nums md:block">
                      {formatPrice(line.unitPrice)}
                    </div>

                    <div className="col-span-2 mt-4 flex w-full justify-center md:mt-0 md:w-auto">
                      <div className="flex w-28 items-center border border-charcoal/20 bg-ivory">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              line.productId,
                              line.variantId,
                              line.quantity - 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:text-charcoal"
                          aria-label={`Decrease quantity of ${line.product.name}`}
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-xs font-medium tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              line.productId,
                              line.variantId,
                              line.quantity + 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-charcoal/60 transition-colors hover:text-charcoal"
                          aria-label={`Increase quantity of ${line.product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 mt-2 w-full text-center text-sm font-medium tabular-nums md:mt-0 md:text-right">
                      {formatPrice(line.lineTotal)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/shop"
                  className="inline-flex w-fit items-center gap-2 text-[10px] font-medium uppercase tracking-folio text-charcoal transition-colors hover:text-oxblood"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="border border-charcoal/15 bg-parchment/40 p-8">
                <h2 className="mb-6 text-[10px] font-medium uppercase tracking-folio text-charcoal">
                  Order Summary
                </h2>

                <div className="mb-6 flex flex-col gap-4 border-b border-charcoal/15 pb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Shipping (Standard)</span>
                    <span className="font-medium tabular-nums">
                      {formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Estimated Tax (8%)</span>
                    <span className="font-medium tabular-nums">
                      {formatPrice(tax)}
                    </span>
                  </div>
                </div>

                <div className="mb-6 border-b border-charcoal/15 pb-6">
                  <label className="mb-3 block text-[10px] font-medium uppercase tracking-folio text-charcoal/55">
                    Discount Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="w-full border border-r-0 border-charcoal/20 bg-ivory px-3 py-2 text-sm outline-none focus:border-charcoal"
                    />
                    <button
                      type="button"
                      className="border border-charcoal/20 px-4 py-2 text-[10px] font-medium uppercase tracking-folio transition-colors hover:bg-charcoal hover:text-ivory"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-folio">
                    Final Total
                  </span>
                  <span className="font-serif text-2xl tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button className="w-full">PROCEED TO CHECKOUT</Button>
                <p className="mt-3 text-center text-[11px] text-charcoal/50">
                  Demo checkout — no payment is processed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

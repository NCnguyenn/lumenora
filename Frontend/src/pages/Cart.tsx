import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Trash2, ArrowLeft } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useAppStore();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-[#F8F6F4] min-h-[70vh] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-serif mb-12">Shopping Cart <span className="text-muted italic text-2xl">({cart.length})</span></h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted mb-6 font-serif text-lg">Your cart is currently empty.</p>
            <Link to="/shop">
              <Button>CONTINUE SHOPPING</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="flex flex-col gap-6 pt-6">
                {cart.map(item => (
                  <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center pb-6 border-b border-border">
                    <div className="col-span-6 flex gap-6 w-full">
                      <div className="w-24 h-30 bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{item.brand}</p>
                        <Link to="/shop" className="text-sm font-serif leading-tight hover:underline mb-2">{item.name}</Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] font-bold uppercase tracking-widest text-red-700 flex items-center gap-1 hover:opacity-70 transition-opacity w-fit mt-auto"
                        >
                          <Trash2 className="w-3 h-3" /> REMOVE
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm font-medium text-center hidden md:block">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="col-span-2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                      <div className="flex items-center border border-border bg-white w-24">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary">-</button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary">+</button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm font-bold text-right w-full md:w-auto text-center md:text-right mt-2 md:mt-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest hover:text-muted flex items-center gap-2 transition-colors w-fit">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 border border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6">ORDER SUMMARY</h3>
                
                <div className="flex flex-col gap-4 text-sm mb-6 border-b border-border pb-6">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping (Standard)</span>
                    <span className="font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Estimated Tax (8%)</span>
                    <span className="font-bold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6 border-b border-border pb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-3">DISCOUNT CODE</label>
                  <div className="flex">
                    <input type="text" placeholder="Promo code" className="border border-border border-r-0 px-3 py-2 text-sm w-full outline-none focus:border-primary" />
                    <button className="border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">APPLY</button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest">FINAL TOTAL</span>
                  <span className="text-2xl font-serif">${total.toFixed(2)}</span>
                </div>

                <Button className="w-full">PROCEED TO CHECKOUT</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


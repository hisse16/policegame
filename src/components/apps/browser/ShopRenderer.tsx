import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { PRODUCTS } from '../../../services/fictionalWebData';
import { browserDb } from '../../../services/browserDatabase';
import { ProductItem } from '../../../types/browser';

interface ShopRendererProps {
  path: string;
  onNavigate: (url: string) => void;
}

export const ShopRenderer: React.FC<ShopRendererProps> = ({ path, onNavigate }) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    if (path.startsWith('/product/')) {
      return path.replace('/product/', '');
    }
    return null;
  });

  const [cart, setCart] = useState<Array<{ product: ProductItem; quantity: number }>>([...browserDb.cart]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId);

  const handleAddToCart = (product: ProductItem) => {
    browserDb.addToCart(product);
    setCart([...browserDb.cart]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    browserDb.removeFromCart(id);
    setCart([...browserDb.cart]);
  };

  const handleDownloadSpecs = (product: ProductItem) => {
    const filename = `${product.id}_specs_sheet.txt`;
    const content = `NOVAMART PRODUCT SPECIFICATION SHEET
====================================
Item: ${product.name}
Model ID: ${product.id}
Price: $${product.price}

TECHNICAL SPECIFICATIONS:
${Object.entries(product.specs).map(([k, v]) => `• ${k}: ${v}`).join('\n')}

DESCRIPTION:
${product.description}

Verified by NovaMart Quality Assurance.`;

    browserDb.startDownload(
      filename,
      `http://novamart.local/downloads/${filename}`,
      1024 * 3,
      'text/plain',
      content
    );
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    // Add confirmation email
    browserDb.sendEmail(
      'investigator@metro.gov',
      `NovaMart Order Confirmation #NM-${Math.floor(10000 + Math.random() * 90000)}`,
      `Thank you for your purchase!\nYour order has been processed and is preparing for dispatch.\n\nTotal: $${cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0)}`
    );
    setTimeout(() => {
      browserDb.cart = [];
      setCart([]);
      setIsCartOpen(false);
      setCheckoutSuccess(false);
    }, 2000);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Product Details View
  if (activeProduct) {
    return (
      <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none">
        <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-3 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProductId(null)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to NovaMart</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-bold text-emerald-400">NovaMart Electronics</span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
          >
            <Icon name="ShoppingCart" className="w-4 h-4" />
            <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
        </header>

        <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Visual Showcase */}
          <div className="md:col-span-6 space-y-4">
            <div className={`aspect-square rounded-2xl ${activeProduct.color} border border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-xl`}>
              <Icon
                name={
                  activeProduct.category === 'Laptops'
                    ? 'Laptop'
                    : activeProduct.category === 'Audio'
                    ? 'Headphones'
                    : activeProduct.category === 'Keyboards'
                    ? 'Keyboard'
                    : 'Package'
                }
                className="w-24 h-24 text-slate-300"
              />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Official Hardware Demonstration
              </span>
            </div>

            <button
              onClick={() => handleDownloadSpecs(activeProduct)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="Download" className="w-4 h-4 text-emerald-400" />
              <span>Download Technical Specification Sheet (.txt)</span>
            </button>
          </div>

          {/* Product Info & Specs */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                {activeProduct.category}
              </span>
              <h1 className="text-2xl font-bold text-slate-100">{activeProduct.name}</h1>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-amber-400 font-bold">★ {activeProduct.rating}</span>
                <span className="text-slate-500">({activeProduct.reviewCount} verified reviews)</span>
                <span className="text-emerald-400 font-medium">• In Stock</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-100">${activeProduct.price}</span>
              {activeProduct.originalPrice && (
                <span className="text-base text-slate-500 line-through">
                  ${activeProduct.originalPrice}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeProduct.description}
            </p>

            {/* Specs Table */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-200">Hardware Specifications</h3>
              <div className="space-y-1.5 text-xs">
                {Object.entries(activeProduct.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-slate-200 font-mono text-[11px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(activeProduct)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="ShoppingCart" className="w-4 h-4" />
              <span>Add to Cart • ${activeProduct.price}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Store Catalog
  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 overflow-y-auto font-sans select-none relative">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Icon name="ShoppingBag" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">NovaMart Online</h1>
            <p className="text-[10px] text-slate-400">Electronics, Hardware & Gadgets</p>
          </div>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Icon name="ShoppingCart" className="w-4 h-4" />
          <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </header>

      {/* Hero Banner */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Featured Release
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              Northstar HorizonBook 15 Pro Workstation
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              14-core high-efficiency processor with native Linux kernel support. Now in stock with free metropolitan delivery.
            </p>
          </div>
          <button
            onClick={() => setSelectedProductId('laptop-apex-15')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
          >
            View Product
          </button>
        </div>
      </div>

      {/* Catalog Grid */}
      <main className="max-w-5xl mx-auto p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Catalog Offerings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div
                onClick={() => setSelectedProductId(prod.id)}
                className="cursor-pointer space-y-3"
              >
                <div className={`aspect-video rounded-lg ${prod.color} flex items-center justify-center text-slate-300`}>
                  <Icon
                    name={
                      prod.category === 'Laptops'
                        ? 'Laptop'
                        : prod.category === 'Audio'
                        ? 'Headphones'
                        : prod.category === 'Keyboards'
                        ? 'Keyboard'
                        : 'Package'
                    }
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-200 hover:text-emerald-400 transition-colors line-clamp-2">
                    {prod.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="font-bold text-slate-100">${prod.price}</span>
                    <span className="text-amber-400">★ {prod.rating}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(prod)}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon name="Plus" className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Icon name="ShoppingCart" className="w-4 h-4 text-emerald-400" />
                  <span>Your NovaMart Cart</span>
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded hover:bg-slate-800 text-slate-400">
                  <Icon name="X" className="w-4 h-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">Cart is empty</p>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[400px]">
                  {cart.map((item) => (
                    <div key={item.product.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-200">{item.product.name}</p>
                        <p className="text-slate-400 mt-0.5">
                          {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="text-rose-400 hover:text-rose-300 self-center p-1"
                      >
                        <Icon name="Trash2" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-100">${subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Standard Shipping:</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutSuccess}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {checkoutSuccess ? (
                    <>
                      <Icon name="Check" className="w-4 h-4" />
                      <span>Order Confirmed!</span>
                    </>
                  ) : (
                    <span>Checkout Now (${subtotal})</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React from 'react';
import { Plus, Flame, Check } from 'lucide-react';
import { POSProductItem, POSCartItem } from '../../types';

interface POSProductGridProps {
  products: POSProductItem[];
  cartItems: POSCartItem[];
  onAddToCart: (product: POSProductItem) => void;
}

export const POSProductGrid: React.FC<POSProductGridProps> = ({
  products,
  cartItems,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center">
        <p className="text-white text-lg font-medium">No items found</p>
        <p className="text-slate-400 text-sm mt-1">Try selecting another category or adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 w-full">
      {products.map((product) => {
        const cartItem = cartItems.find((ci) => ci.product.id === product.id);
        const qty = cartItem ? cartItem.quantity : 0;
        const formattedQty = qty < 10 ? `0${qty}` : `${qty}`;

        return (
          <div
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="group relative bg-black rounded-xl border border-white/10 hover:border-amber-500/80 hover:bg-zinc-950 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Image Container with Badges */}
            <div className="p-3 pb-0">
              <div className="w-full h-32 bg-neutral-900 rounded-[10px] overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Hot Tag Badge (Figma: top right) */}
                {product.isHot && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-stone-700/90 rounded-sm flex items-center gap-1 shadow-sm backdrop-blur-sm">
                    <Flame className="w-2.5 h-2.5 text-yellow-500" />
                    <span className="text-yellow-500 text-[9px] sm:text-[10px] font-medium font-['Inter'] leading-none">
                      Hot
                    </span>
                  </div>
                )}

                {/* Quantity in Cart Badge (Figma: e.g. 01, 02) */}
                {qty > 0 && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-700/95 rounded-sm flex items-center justify-center shadow-md ring-1 ring-yellow-500/50 backdrop-blur-sm">
                    <span className="text-yellow-500 text-[9px] sm:text-[10px] font-bold font-['Inter'] leading-none">
                      {formattedQty}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Meta: Title & Subcategory */}
            <div className="px-3 pt-2.5 pb-1 flex flex-col">
              <h3 className="text-white text-base sm:text-lg font-semibold font-['Inter'] leading-5 line-clamp-1 group-hover:text-yellow-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-400 text-xs font-normal font-['Inter'] leading-4">
                {product.subcategory}
              </p>
            </div>

            {/* Bottom Footer: Price & Add Action */}
            <div className="px-3 py-2 border-t border-neutral-700/80 mt-2 flex items-center justify-between bg-black/20">
              <span className="text-white text-base font-medium font-['Inter'] leading-4">
                ${product.price.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                  qty > 0
                    ? 'bg-yellow-500 text-white shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-yellow-500 hover:text-white'
                }`}
                title="Add to order"
              >
                {qty > 0 ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  POSCategory,
  POSProductItem,
  POSCartItem,
  POSPaymentMethod,
} from '../types';
import { initialPOSProducts, initialPOSCart } from '../data';
import {
  POSCategoryBar,
  POSProductGrid,
  POSCartPanel,
  ProcessPaymentModal,
  PaymentCompleteModal,
} from './components';

export const POSView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<POSCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<POSCartItem[]>(initialPOSCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<POSPaymentMethod>('Card');

  // Modals state
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<{
    method: POSPaymentMethod;
    amount: number;
  }>({
    method: 'Card',
    amount: 0,
  });

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return initialPOSProducts.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' ||
        product.category.toLowerCase() === activeCategory.toLowerCase() ||
        product.subcategory.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: POSProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to order`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Cleared order cart');
  };

  // Payment totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.10; // 10% tax for checkout modal
  const total = subtotal + tax;

  const handleOpenProcessPayment = () => {
    if (cartItems.length === 0) {
      toast.error('Please add items to cart first');
    } else {
      setIsProcessModalOpen(true);
    }
  };

  const handleConfirmPayment = (method: POSPaymentMethod, amount: number) => {
    setCompletedPayment({ method, amount });
    setIsProcessModalOpen(false);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteDone = () => {
    setIsCompleteModalOpen(false);
    setCartItems([]);
    toast.success('Order processed and sent to kitchen display!');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header Section (Matching Figma: Title, Subtitle & Search) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            Point of Sale
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Create and manage orders at the counter
          </p>
        </div>

        {/* Quick Menu Item Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full h-9 pl-9 pr-3 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 text-white placeholder-zinc-500 text-base focus:outline-yellow-500 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs Filter Bar */}
      <POSCategoryBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Body: Product Grid & Sticky Cart Panel */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
        {/* Left: Product Grid */}
        <div className="flex-1 w-full min-w-0">
          <POSProductGrid
            products={filteredProducts}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right: Cart Summary Panel */}
        <div className="w-full xl:w-80 xl:sticky xl:top-24">
          <POSCartPanel
            cartItems={cartItems}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onProcessPayment={handleOpenProcessPayment}
          />
        </div>
      </div>

      {/* Process Payment Modal */}
      <ProcessPaymentModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        subtotal={subtotal}
        tax={tax}
        total={total}
        initialMethod={selectedPaymentMethod}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Payment Complete Modal */}
      <PaymentCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        method={completedPayment.method}
        amount={completedPayment.amount}
        onDone={handleCompleteDone}
      />
    </div>
  );
};

export const ManagerPOSView = POSView;
export default POSView;

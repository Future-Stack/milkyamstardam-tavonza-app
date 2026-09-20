"use client";

import React, { useState } from "react";
import { FlowStep, MenuItem, CartItem, AddOnOption } from "@/src/types/customer";

import ScanStep from "@/src/components/customer/ScanStep";
import WelcomeStep from "@/src/components/customer/WelcomeStep";
import MenuStep from "@/src/components/customer/MenuStep";
import ItemDetailStep from "@/src/components/customer/ItemDetailStep";
import CartStep from "@/src/components/customer/CartStep";
import OrderPlacedStep from "@/src/components/customer/OrderPlacedStep";
import TrackOrderStep from "@/src/components/customer/TrackOrderStep";
import PaymentStep from "@/src/components/customer/PaymentStep";
import PaymentConfirmationStep from "@/src/components/customer/PaymentConfirmationStep";
import FeedbackStep from "@/src/components/customer/FeedbackStep";
import FeedbackSuccessStep from "@/src/components/customer/FeedbackSuccessStep";
import SofiaAiChatStep from "@/src/components/customer/SofiaAiChatStep";

export default function CustomerScannerMenu() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("scan");
  const [previousStep, setPreviousStep] = useState<FlowStep>("menu");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Step 1 -> Step 2 transition after scanning QR
  const handleScanComplete = () => {
    setCurrentStep("welcome");
  };

  // Step 2 -> Step 3 transition after clicking View Menu
  const handleWelcomeContinue = () => {
    setCurrentStep("menu");
  };

  // Step 3 -> Step 4 transition after selecting an item
  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentStep("detail");
  };

  // Open Sofia AI Chat Page from Menu or Detail
  const handleOpenAiChat = () => {
    setPreviousStep(currentStep);
    setCurrentStep("aiChat");
  };

  // Step 4 -> Step 5: Add item from Detail view to Cart
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedAddOns: AddOnOption[],
    instructions: string
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        item,
        quantity,
        selectedAddOns,
        specialInstructions: instructions
      }
    ]);
    setCurrentStep("cart");
  };

  // Update quantity in cart
  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  // Remove item from cart
  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 5 -> Step 6: Place Order -> Order Placed Successfully
  const handlePlaceOrder = () => {
    setCurrentStep("orderPlaced");
  };

  // Step 6 -> Step 7: Order Placed -> Track Order
  const handleTrackOrder = () => {
    setCurrentStep("trackOrder");
  };

  // Step 7 -> Step 8: Track Order -> Complete Payment
  const handleCompletePayment = () => {
    setCurrentStep("payment");
  };

  // Step 8 -> Step 9: Pay -> Confirmation / Receipt
  const handlePay = () => {
    setCurrentStep("confirmation");
  };

  // Step 9 -> Step 10: Confirmation -> Feedback
  const handleGoToFeedback = () => {
    setCurrentStep("feedback");
  };

  // Step 10 -> Step 11: Feedback submitted -> Feedback Success
  const handleFeedbackSubmit = () => {
    setCurrentStep("feedbackSuccess");
  };

  // Reset entire flow back to Step 1 (Scan)
  const handleResetFlow = () => {
    setCartItems([]);
    setSelectedItem(null);
    setCurrentStep("scan");
  };

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const subtotalCartAmount = cartItems.reduce((sum, cartItem) => {
    const addOnsCost = cartItem.selectedAddOns.reduce((a, b) => a + b.price, 0);
    return sum + (cartItem.item.price + addOnsCost) * cartItem.quantity;
  }, 0);

  return (
    <div className="relative min-h-screen bg-black text-white flex justify-center items-center font-sans overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Mobile Container Frame */}
      <div className="relative w-full max-w-[430px] min-h-screen sm:min-h-[880px] sm:my-6 bg-zinc-950 sm:rounded-[40px] shadow-2xl overflow-hidden border border-zinc-800/80 flex flex-col">
        {/* Step 1: Scan QR Screen */}
        {currentStep === "scan" && (
          <ScanStep onScanComplete={handleScanComplete} />
        )}

        {/* Step 2: Welcome Table Scanned Screen */}
        {currentStep === "welcome" && (
          <WelcomeStep
            onContinue={handleWelcomeContinue}
            tableNumber="Table 08"
          />
        )}

        {/* Step 3: Our Menu Screen */}
        {currentStep === "menu" && (
          <MenuStep
            onSelectItem={handleSelectItem}
            onOpenCart={() => setCurrentStep("cart")}
            onOpenAskAi={handleOpenAiChat}
            cartCount={totalCartCount}
          />
        )}

        {/* Step 4: Item Detail Screen */}
        {currentStep === "detail" && selectedItem && (
          <ItemDetailStep
            item={selectedItem}
            onBack={() => setCurrentStep("menu")}
            onAddToCart={handleAddToCart}
            onOpenAskAi={handleOpenAiChat}
          />
        )}

        {/* Step 5: Your Cart Screen */}
        {currentStep === "cart" && (
          <CartStep
            cartItems={cartItems}
            onBack={() => setCurrentStep("menu")}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {/* Step 6: Order Placed Successfully Screen */}
        {currentStep === "orderPlaced" && (
          <OrderPlacedStep
            onTrackOrder={handleTrackOrder}
            orderId="LT-2847"
            tableNumber="Table 08"
          />
        )}

        {/* Step 7: Track Your Order Screen */}
        {currentStep === "trackOrder" && (
          <TrackOrderStep
            onBack={() => setCurrentStep("orderPlaced")}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {/* Step 8: Complete Payment Screen */}
        {currentStep === "payment" && (
          <PaymentStep
            onBack={() => setCurrentStep("trackOrder")}
            onPay={handlePay}
            subtotalAmount={subtotalCartAmount > 0 ? subtotalCartAmount : 18.19}
          />
        )}

        {/* Step 9: Payment Confirmation / Receipt Screen */}
        {currentStep === "confirmation" && (
          <PaymentConfirmationStep
            onBackToHome={handleResetFlow}
            onGoToFeedback={handleGoToFeedback}
            transactionId="#ID-22465476578390-3789"
            totalPaid={subtotalCartAmount > 0 ? subtotalCartAmount * 1.13 : 50.97}
          />
        )}

        {/* Step 10: Feedback / Review Screen */}
        {currentStep === "feedback" && (
          <FeedbackStep
            onBack={() => setCurrentStep("confirmation")}
            onSubmit={handleFeedbackSubmit}
            onSkip={handleResetFlow}
          />
        )}

        {/* Step 11: Feedback Success Screen */}
        {currentStep === "feedbackSuccess" && (
          <FeedbackSuccessStep onBackToHome={handleResetFlow} />
        )}

        {/* Step 12: Sofia AI Dining Assistant Chat Page */}
        {currentStep === "aiChat" && (
          <SofiaAiChatStep onBack={() => setCurrentStep(previousStep)} />
        )}
      </div>
    </div>
  );
}

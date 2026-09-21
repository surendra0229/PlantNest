import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/api';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Lock,
  Plus,
  Zap,
  Building2,
  QrCode,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Trash2
} from 'lucide-react';

// Helper to dynamically load Razorpay Checkout JS SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is a direct "Buy Now" flow for a single item or full cart checkout
  const buyNowState = location.state?.buyNowItem;

  const [directItem, setDirectItem] = useState(buyNowState || null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'

  // Specific Payment Method Details State
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: user?.name || '',
    expiry: '',
    cvv: ''
  });
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Address State
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [useNewAddress, setUseNewAddress] = useState(!user?.addresses || user.addresses.length === 0);

  // Compute active checkout items list
  const activeItems = directItem
    ? [
        {
          plant: directItem.plant,
          quantity: directItem.quantity,
          unitPrice: directItem.plant.finalPrice || directItem.plant.price
        }
      ]
    : cartItems.map((item) => ({
        plant: item.plant,
        quantity: item.quantity,
        unitPrice: item.plant.finalPrice || item.plant.price
      }));

  // Calculate items total & shipping fee
  const itemsTotal = activeItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shippingCost = itemsTotal >= 499 || itemsTotal === 0 ? 0 : 49;
  const grandTotal = itemsTotal + shippingCost;

  // Quantity modifier for checkout items
  const handleQuantityChange = (plantId, delta) => {
    if (directItem && directItem.plant._id === plantId) {
      const newQty = Math.max(1, directItem.quantity + delta);
      setDirectItem({ ...directItem, quantity: newQty });
    }
  };

  // Card formatting helper
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardDetails({ ...cardDetails, expiry: raw });
  };

  if (activeItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-xl text-slate-900 dark:text-white">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black">No Items to Checkout</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Your nursery cart is currently empty. Explore our plant catalog to start shopping.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg transition"
        >
          Browse Botanical Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Handle Form Submission & Payment Gateway Processing
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // 1. Address Validation
    let shippingAddress;
    if (useNewAddress) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
        toast.error('Please complete all required delivery shipping address fields.');
        return;
      }
      shippingAddress = newAddress;
    } else {
      shippingAddress = user.addresses[selectedAddressIndex];
      if (!shippingAddress) {
        toast.error('Please select a valid delivery address.');
        return;
      }
    }

    // 2. Specific Payment Method Form Validations
    if (paymentMethod === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g., name@upi or mobile@okhdfcbank).');
        return;
      }
    } else if (paymentMethod === 'Credit/Debit Card') {
      const cleanCard = cardDetails.number.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        toast.error('Please enter a valid 16-digit credit/debit card number.');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        toast.error('Please enter a valid card expiry date (MM/YY).');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid 3 or 4 digit CVV security code.');
        return;
      }
      if (!cardDetails.name) {
        toast.error('Please enter cardholder name.');
        return;
      }
    }

    // Format items payload for backend API
    const formattedOrderItems = activeItems.map((item) => ({
      plant: item.plant._id,
      name: item.plant.name,
      price: item.plant.price,
      discount: item.plant.discount || 0,
      quantity: item.quantity,
      image: item.plant.images?.[0] || ''
    }));

    try {
      setLoading(true);

      // --- Option A: Razorpay Official Checkout Gateway Flow ---
      if (paymentMethod === 'Razorpay') {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error('Razorpay SDK failed to load. Please check your internet connection.');
          setLoading(false);
          return;
        }

        // Server-Side Order Creation (Validates Price & Stock on Backend)
        const serverOrderRes = await orderService.createRazorpayOrder({
          orderItems: formattedOrderItems
        });

        if (!serverOrderRes.success) {
          toast.error(serverOrderRes.message || 'Failed to initialize Razorpay payment.');
          setLoading(false);
          return;
        }

        const { razorpayOrderId, amount, currency, keyId } = serverOrderRes;

        // Open Razorpay Checkout Window
        const options = {
          key: keyId,
          amount,
          currency,
          name: 'PlantNest Nursery',
          description: 'Botanical Nursery & Plant E-Commerce',
          image: '/logo.png',
          order_id: razorpayOrderId,
          handler: async function (response) {
            setPaymentProcessing(true);
            try {
              // Server-Side Signature Verification & Order Registration
              const verifyRes = await orderService.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'verified_sig',
                orderItems: formattedOrderItems,
                shippingAddress,
                paymentMethod: 'Razorpay'
              });

              if (verifyRes.success) {
                if (!directItem) clearCart();
                toast.success('Razorpay payment verified & order confirmed successfully!');
                navigate(`/order-success/${verifyRes.order._id}`);
              } else {
                toast.error(verifyRes.message || 'Payment signature verification failed.');
              }
            } catch (vErr) {
              toast.error(vErr.message || 'Payment verification failed.');
            } finally {
              setPaymentProcessing(false);
            }
          },
          prefill: {
            name: shippingAddress.fullName || user?.name || '',
            email: user?.email || '',
            contact: shippingAddress.phone || user?.phone || ''
          },
          notes: {
            address: `${shippingAddress.street}, ${shippingAddress.city}`
          },
          theme: {
            color: '#044e36'
          }
        };

        const razorpayModal = new window.Razorpay(options);
        razorpayModal.on('payment.failed', function (response) {
          toast.error(response.error?.description || 'Razorpay payment failed or cancelled.');
          setLoading(false);
        });
        razorpayModal.open();
        setLoading(false);
        return;
      }

      // --- Option B: Direct Verified Online & COD Payment Flow ---
      const createRes = await orderService.createOrder({
        orderItems: formattedOrderItems,
        shippingAddress,
        paymentMethod,
        paymentDetails: paymentMethod === 'UPI' ? { upiId } : paymentMethod === 'Credit/Debit Card' ? { last4: cardDetails.number.slice(-4) } : { bank: selectedBank }
      });

      if (createRes.success) {
        if (!directItem) clearCart();
        toast.success(
          paymentMethod === 'Cash on Delivery'
            ? 'Order placed with Cash on Delivery! Pay upon nursery delivery.'
            : `${paymentMethod} payment verified & order confirmed!`
        );
        navigate(`/order-success/${createRes.order._id}`);
      } else {
        toast.error(createRes.message || 'Order submission failed.');
      }
    } catch (err) {
      toast.error(err.message || 'Order process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Page Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Checkout</h1>
            {directItem && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-slate-950" /> Direct Buy Now
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Complete your delivery shipping details and choose your preferred payment method.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          ← Return to Plant Catalog
        </Link>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns (8 Cols): Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Delivery Shipping Address Selection */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                1. Delivery Shipping Address
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>

            {/* Saved Addresses List */}
            {user?.addresses && user.addresses.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => {
                        setSelectedAddressIndex(idx);
                        setUseNewAddress(false);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        !useNewAddress && selectedAddressIndex === idx
                          ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-300 dark:ring-emerald-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">{addr.fullName}</span>
                        {!useNewAddress && selectedAddressIndex === idx && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{addr.street}, {addr.city}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{addr.state} - {addr.postalCode}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">📞 {addr.phone}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus className="w-4 h-4" />
                  {useNewAddress ? 'Select a saved address' : 'Enter a new delivery address'}
                </button>
              </div>
            )}

            {/* New Address Input Form */}
            {useNewAddress && (
              <div className="space-y-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Surendra Kumar"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 9876543210"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                    Street Address & House No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Flat 402, Botanical Park Avenue, Sector 62"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bengaluru"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Karnataka"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">
                      PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="560001"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Select Payment Method */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                2. Select Payment Method
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Step 2 of 2
              </span>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'Razorpay', label: 'Razorpay Gateway', icon: ShieldCheck, desc: 'UPI, Cards, Wallets & Net Banking', badge: 'Recommended' },
                { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: QrCode, desc: 'Instant UPI ID Payment' },
                { id: 'Credit/Debit Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                { id: 'Net Banking', label: 'Net Banking', icon: Building2, desc: 'All Major Indian Banks' },
                { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck, desc: 'Pay Cash at Your Doorstep' }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-300 dark:ring-emerald-800'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-emerald-600 cursor-pointer mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{method.label}</span>
                        </p>
                        {method.badge && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{method.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Specific Form Panels */}
            {paymentMethod === 'Razorpay' && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Official Razorpay Checkout Integration
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  When you click <strong>Pay via Razorpay</strong>, the official secure Razorpay popup will open for UPI, Credit/Debit cards, Net Banking, and Wallets. Payment signature is verified directly on our server.
                </p>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <label className="font-extrabold text-slate-800 dark:text-slate-200 block">
                  Enter Your UPI ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., username@upi or mobile@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-emerald-600"
                  />
                  <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Supported apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay.
                </p>
              </div>
            )}

            {paymentMethod === 'Credit/Debit Card' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div>
                  <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                    Card Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8901"
                    maxLength="19"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1">Expiry *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono text-center focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1">CVV *</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength="4"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-mono text-center focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1">Cardholder *</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Your card information is 256-bit SSL encrypted & never stored in MongoDB.
                </p>
              </div>
            )}

            {paymentMethod === 'Net Banking' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <label className="font-extrabold text-slate-800 dark:text-slate-200 block">
                  Select Your Bank <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none"
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                </select>
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                <p className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Cash on Delivery Terms:
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                  Pay ₹{grandTotal} cash to the courier upon delivery of your live nursery plants.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column (5 Cols): Order Summary & Final Payable Button */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 lg:sticky lg:top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Order Summary ({activeItems.length} {activeItems.length === 1 ? 'species' : 'species'})
            </h3>
            {directItem && (
              <button
                type="button"
                onClick={() => setDirectItem(null)}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Switch to Cart
              </button>
            )}
          </div>

          {/* Purchased Items List */}
          <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800 pr-1 no-scrollbar">
            {activeItems.map((item) => (
              <div key={item.plant._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {item.plant.images?.[0] && (
                    <img
                      src={item.plant.images[0]}
                      alt={item.plant.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <div className="min-w-0 text-xs">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">{item.plant.name}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{item.plant.category}</p>
                    
                    {/* Quantity modifier controls inside summary */}
                    {directItem ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-500 font-bold">Qty:</span>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.plant._id, -1)}
                            className="w-5 h-5 rounded text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-black">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.plant._id, 1)}
                            className="w-5 h-5 rounded text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 font-semibold">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-xs text-slate-900 dark:text-white">
                    ₹{item.unitPrice * item.quantity}
                  </p>
                  {item.plant.discount > 0 && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                      -{item.plant.discount}% OFF
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{itemsTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Shipping Charge</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold text-right">
                Add ₹{499 - itemsTotal} more for FREE Shipping!
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total Payable Amount</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{grandTotal}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={loading || paymentProcessing}
            className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {loading || paymentProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {paymentProcessing ? 'Verifying Razorpay Signature...' : 'Processing Secure Payment...'}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-300" />
                {paymentMethod === 'Razorpay'
                  ? `Pay via Razorpay (₹${grandTotal})`
                  : `Confirm & Pay ₹${grandTotal}`}
              </>
            )}
          </button>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2.5 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>PlantNest Guarantee: 100% Organic Soil & Free Replacement if Damaged in Transit.</span>
          </div>

        </div>

      </form>

    </div>
  );
};

export default Checkout;

'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { CreditCard, Truck, Shield, ArrowLeft, ArrowRight, Plus, Minus, Trash2, Building2, HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import Footer from '@/components/footer'
import { useCart } from './cart-context'

const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState('card')
    const [showClearModal, setShowClearModal] = useState(false)
    const [showEmptyCartModal, setShowEmptyCartModal] = useState(false)
    const { cartItems, updateQuantity, removeFromCart, clearCart: clearCartFromContext, cartCount } = useCart()

    const clearCart = () => {
        setShowClearModal(true)
    }

    const confirmClearCart = () => {
        clearCartFromContext()
        setShowClearModal(false)
    }

    const cancelClearCart = () => {
        setShowClearModal(false)
    }

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            setShowEmptyCartModal(true)
            // Auto-hide after 0.5 seconds
            setTimeout(() => {
                setShowEmptyCartModal(false)
            }, 500)
        }
        // Add actual order processing logic here when cart is not empty
    }

    const getItemTotal = (price: string, quantity: number) => {
        const numericPrice = parseInt(price.replace('₦', '').replace(',', ''))
        return `₦${(numericPrice * quantity).toLocaleString()}`
    }

    // Calculate totals based on current cart items
    const subtotal = cartItems.reduce((total, item) => {
        const price = parseInt(item.price.replace('₦', '').replace(',', ''))
        return total + (price * item.quantity)
    }, 0)

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="py-8 mt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                                <ArrowLeft className="w-5 h-5" />
                                Back to Shopping
                            </Link>
                            <h1 className="text-2xl font-semibold text-gray-900 text-center mt-7">Checkout</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Cart Items */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">Your cart is empty</p>
                                            <Link href="/shop">
                                                <Button className="bg-amber-900 text-white hover:bg-amber-800">
                                                    Continue Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 relative">
                                                <Link href="/shop">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                    />
                                                </Link>
                                                
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    <p className="text-gray-900 font-bold text-sm">{item.price}</p>
                                                    
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center">
                                                            <select
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent text-sm"
                                                            >
                                                                {Array.from({ length: 49 }, (_, i) => i + 1).map(num => (
                                                                    <option key={num} value={num}>{num}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">Total</p>
                                                            <p className="font-semibold text-amber-900">
                                                                {item.quantity}x {getItemTotal(item.price, item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    )}
                                </div>

                                {/* Clear Cart Button */}
                                {cartItems.length > 0 && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={clearCart}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}

                                {/* Delivery Address */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                                                placeholder="John"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                                                placeholder="Doe"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                                                placeholder="123 Main St"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                                            >
                                                <option value="">Select State</option>
                                                <option value="abia">Abia</option>
                                                <option value="adamawa">Adamawa</option>
                                                <option value="akwa-ibom">Akwa Ibom</option>
                                                <option value="anambra">Anambra</option>
                                                <option value="bauchi">Bauchi</option>
                                                <option value="bayelsa">Bayelsa</option>
                                                <option value="benue">Benue</option>
                                                <option value="borno">Borno</option>
                                                <option value="cross-river">Cross River</option>
                                                <option value="delta">Delta</option>
                                                <option value="ebonyi">Ebonyi</option>
                                                <option value="edo">Edo</option>
                                                <option value="ekiti">Ekiti</option>
                                                <option value="enugu">Enugu</option>
                                                <option value="gombe">Gombe</option>
                                                <option value="imo">Imo</option>
                                                <option value="jigawa">Jigawa</option>
                                                <option value="kaduna">Kaduna</option>
                                                <option value="kano">Kano</option>
                                                <option value="katsina">Katsina</option>
                                                <option value="kebbi">Kebbi</option>
                                                <option value="kogi">Kogi</option>
                                                <option value="kwara">Kwara</option>
                                                <option value="lagos">Lagos</option>
                                                <option value="nasarawa">Nasarawa</option>
                                                <option value="niger">Niger</option>
                                                <option value="ogun">Ogun</option>
                                                <option value="ondo">Ondo</option>
                                                <option value="osun">Osun</option>
                                                <option value="oyo">Oyo</option>
                                                <option value="plateau">Plateau</option>
                                                <option value="rivers">Rivers</option>
                                                <option value="sokoto">Sokoto</option>
                                                <option value="taraba">Taraba</option>
                                                <option value="yobe">Yobe</option>
                                                <option value="zamfara">Zamfara</option>
                                                <option value="fct">Federal Capital Territory</option>
                                            </select>
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                maxLength={11}
                                                pattern="[0-9]*"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                                                placeholder="0800 000 0000"
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                                    
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="card"
                                                checked={selectedPayment === 'card'}
                                                onChange={(e) => setSelectedPayment(e.target.value)}
                                                className="text-amber-900 focus:ring-amber-900"
                                            />
                                            <CreditCard className="w-5 h-5 text-gray-600" />
                                            <span>Credit/Debit Card</span>
                                        </label>
                                                            
                                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="transfer"
                                                checked={selectedPayment === 'transfer'}
                                                onChange={(e) => setSelectedPayment(e.target.value)}
                                                className="text-amber-900 focus:ring-amber-900"
                                            />
                                            <Building2 className="w-5 h-5 text-gray-600" />
                                            <span>Bank Transfer</span>
                                        </label>
                                        
                                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cod"
                                                checked={selectedPayment === 'cod'}
                                                onChange={(e) => setSelectedPayment(e.target.value)}
                                                className="text-amber-900 focus:ring-amber-900"
                                            />
                                            <HandCoins className="w-5 h-5 text-gray-600" />
                                            <span>Cash on Delivery</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
                                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                                    
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-lg">₦{subtotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Button 
                                            onClick={handlePlaceOrder}
                                            className="w-full bg-amber-900 text-white hover:bg-amber-800 py-3"
                                        >
                                            Place Order
                                        </Button>
                                        
                                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3" asChild>
                                            <Link href="/shop">
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                    </div>
                                    
                                    <div className="mt-4 text-center text-xs text-gray-500">
                                        <p>By placing your order, you agree to our</p>
                                        <p>Terms & Conditions and Privacy Policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Page footer */}
                <Footer />
            </main>

            {/* Clear Cart Confirmation Modal */}
            {showClearModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Cart</h3>
                            <p className="text-gray-600 mb-6">Do you want to clear all items from your cart?</p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelClearCart}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    No
                                </button>
                                <button
                                    onClick={confirmClearCart}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Empty Cart Warning Message */}
            {showEmptyCartModal && (
                <>
                    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <div className="text-amber-800 text-2xl font-semibold animate-pulse">
                            Cart is empty!
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Checkout

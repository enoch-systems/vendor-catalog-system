'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import Footer from '@/components/footer'
import { useCart } from './cart-context'
import { useUI } from '@/contexts/ui-context'

const accessoriesProducts = [
    {
        id: 1,
        name: 'Wig Stand',
        price: '₦8,500',
        originalPrice: '₦12,000',
        rating: 4.5,
        reviews: 45,
        image: '/accessory1.jpeg',
        badge: 'Essential'
    },
    {
        id: 2,
        name: 'Wig Cap',
        price: '₦3,500',
        originalPrice: '₦5,000',
        rating: 4.3,
        reviews: 67,
        image: '/accessory2.jpeg',
        badge: 'Must Have'
    },
    {
        id: 3,
        name: 'Wig Brush',
        price: '₦4,200',
        originalPrice: '₦6,000',
        rating: 4.6,
        reviews: 89,
        image: '/accessory3.jpeg',
        badge: 'Popular'
    },
    {
        id: 4,
        name: 'Wig Grip Band',
        price: '₦2,800',
        originalPrice: '₦4,000',
        rating: 4.4,
        reviews: 34,
        image: '/accessory4.jpeg',
        badge: 'New'
    },
    {
        id: 5,
        name: 'Wig Storage Bag',
        price: '₦5,500',
        originalPrice: '₦8,000',
        rating: 4.7,
        reviews: 56,
        image: '/accessory5.jpeg',
        badge: 'Premium'
    },
    {
        id: 6,
        name: 'Wig Tape',
        price: '₦1,800',
        originalPrice: '₦2,500',
        rating: 4.2,
        reviews: 78,
        image: '/accessory6.jpeg',
        badge: 'Sale'
    },
    {
        id: 7,
        name: 'Wig Glue',
        price: '₦3,200',
        originalPrice: '₦4,500',
        rating: 4.5,
        reviews: 92,
        image: '/accessory7.jpeg',
        badge: 'Professional'
    },
    {
        id: 8,
        name: 'Wig Conditioner',
        price: '₦6,800',
        originalPrice: '₦9,000',
        rating: 4.8,
        reviews: 123,
        image: '/accessory8.jpeg',
        badge: 'Luxury'
    },
    {
        id: 9,
        name: 'Wig Shampoo',
        price: '₦5,200',
        originalPrice: '₦7,000',
        rating: 4.6,
        reviews: 104,
        image: '/accessory9.jpeg',
        badge: 'Organic'
    },
    {
        id: 10,
        name: 'Wig Heat Protectant',
        price: '₦4,800',
        originalPrice: '₦6,500',
        rating: 4.4,
        reviews: 61,
        image: '/accessory10.jpeg',
        badge: 'Styling'
    },
    {
        id: 11,
        name: 'Wig Detangler Spray',
        price: '₦3,800',
        originalPrice: '₦5,200',
        rating: 4.3,
        reviews: 48,
        image: '/accessory11.jpeg',
        badge: 'Care'
    }
]

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`size-2 ${
                        star <= Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                    }`}
                />
            ))}
            <span className="text-xs text-gray-600 ml-1">({rating})</span>
        </div>
    )
}

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
                delay: 0.6,
            },
        },
    },
}

const Accessories = () => {
    const { addToCart } = useCart()
    const { profileDropdownOpen } = useUI()
    const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const searchWrapperRef = useRef<HTMLDivElement>(null)
    const [resultsStyle, setResultsStyle] = useState<{top: number; left: number; width: number} | null>(null)

    // compute dropdown position whenever query changes or resize occurs
    useEffect(() => {
        if (!searchWrapperRef.current) return
        const rect = searchWrapperRef.current.getBoundingClientRect()
        setResultsStyle({
            top: rect.bottom + window.scrollY,
            left: rect.left + rect.width / 2 + window.scrollX,
            width: rect.width,
        })
    }, [searchQuery])

    // reposition on window resize as well
    useEffect(() => {
        const handler = () => {
            if (!searchWrapperRef.current) return
            const rect = searchWrapperRef.current.getBoundingClientRect()
            setResultsStyle({
                top: rect.bottom + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX,
                width: rect.width,
            })
        }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const handleAddToCart = (product: typeof accessoriesProducts[0]) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            badge: product.badge
        })
        
        // Show success feedback
        setAddedToCart(prev => new Set([...prev, product.id]))
        
        // Remove feedback after 1 second
        setTimeout(() => {
            setAddedToCart(prev => {
                const newSet = new Set(prev)
                newSet.delete(product.id)
                return newSet
            })
        }, 1000)
    }

    const filteredProducts = accessoriesProducts.filter(product => 
        product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
    const displayedProducts = searchQuery ? filteredProducts : accessoriesProducts

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="py-8 mt-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="text-left mb-8">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-700 mb-2">
                                    Accessories
                                </h2>
                            </div>
                        </AnimatedGroup>

                        {/* Search Bar */}
                        <AnimatedGroup variants={transitionVariants} className="relative z-2">
                            <div ref={searchWrapperRef} className="relative text-center mb-6">
                                {!profileDropdownOpen && (
                                    <div className="hover:bg-background bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-2 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300">
                                        <input
                                            type="text"
                                            placeholder="Search accessories...."
                                            className="text-foreground text-sm bg-transparent outline-none w-64 placeholder:text-muted-foreground"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <span className="block h-4 w-0.5 border-l bg-white"></span>
                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                                            <Search className="m-auto size-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AnimatedGroup>
                        
                        {/* portal-style fixed results so they sit above everything */}
                        {searchQuery && filteredProducts.length > 0 && resultsStyle && (
                            <>
                                {/* backdrop blur layer */}
                                <div
                                    className="fixed inset-0 bg-white/25 backdrop-blur-sm z-[9998]"
                                    onClick={() => setSearchQuery('')}
                                />

                                <div
                                    className="fixed bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-[9999]"
                                    style={{
                                        top: resultsStyle.top + 8,
                                        left: resultsStyle.left,
                                        transform: 'translateX(-50%)',
                                        width: resultsStyle.width
                                    }}
                                >
                                    {filteredProducts.slice(0, 10).map(product => (
                                        <div key={product.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3" />
                                            <div>
                                                <p className="text-sm font-semibold">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Products Grid */}
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {displayedProducts.map((product) => (
                                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300"
                                            />
                                            
                                            {/* Badge */}
                                            {product.id <= 4 && (
                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Product Info */}
                                        <div className="p-3 sm:p-4">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 sm:gap-2 mb-2">
                                                <StarRating rating={product.rating} />
                                                <span className="text-xs text-gray-500">
                                                    ({product.reviews})
                                                </span>
                                            </div>
                                            
                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-base sm:text-lg font-bold text-gray-900">
                                                    {product.price}
                                                </span>
                                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                    {product.originalPrice}
                                                </span>
                                            </div>
                                            
                                            {/* Add to Cart Button */}
                                            <Button 
                                                className={`w-full text-xs sm:text-sm py-1.5 sm:py-2 transition-colors ${
                                                    addedToCart.has(product.id)
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                                                }`}
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                {addedToCart.has(product.id) ? 'Added!' : 'Add to Cart'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>

                {/* Page footer */}
                <Footer />
            </main>
        </>
    )
}

export default Accessories

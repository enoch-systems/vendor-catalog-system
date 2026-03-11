'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { useCart } from './cart-context'
import { Product, getAllProducts } from '@/lib/products'

interface FeaturedProps {
    /** optional products passed from server so the client UI can render immediately */
    initialProducts?: Product[]
}

const Featured = ({ initialProducts = [] }: FeaturedProps) => {
    const { addToCart } = useCart()
    const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
    // initialize state from props to avoid loading lag
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialProducts)
    const [isLoading, setIsLoading] = useState(initialProducts.length === 0)

    // fetch on client only if we weren't provided products already
    React.useEffect(() => {
        if (initialProducts.length > 0) {
            // server already supplied data, sort by badge and use immediately
            const sortedProducts = sortProductsByBadge(initialProducts)
            setFeaturedProducts(sortedProducts)
            setIsLoading(false)
            localStorage.setItem('featuredProducts', JSON.stringify(sortedProducts))
            return
        }

        // Check localStorage cache
        const cached = localStorage.getItem('featuredProducts')
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                setFeaturedProducts(parsed)
                setIsLoading(false)
            } catch (err) {
                console.error('Error parsing cached products:', err)
            }
        }
    
        const loadProducts = async () => {
            try {
                const products = await getAllProducts()
                console.log('featured load', products)
                // Sort by badge status, then pick first 4 for featured
                const sortedProducts = sortProductsByBadge(products).slice(0, 4)
                setFeaturedProducts(sortedProducts)
                localStorage.setItem('featuredProducts', JSON.stringify(sortedProducts))
            } catch (err) {
                console.error('Failed to load featured products:', err)
                setFeaturedProducts([])
            } finally {
                setIsLoading(false)
            }
        }
        loadProducts()
    }, [initialProducts])

    // Listen for product updates from admin page
    React.useEffect(() => {
        const handleStorageChange = () => {
            const loadProducts = async () => {
                try {
                    const products = await getAllProducts()
                    const sortedProducts = sortProductsByBadge(products).slice(0, 4)
                    setFeaturedProducts(sortedProducts)
                    localStorage.setItem('featuredProducts', JSON.stringify(sortedProducts))
                } catch (err) {
                    console.error('Failed to reload featured products:', err)
                }
            }
            loadProducts()
        }

        const handleProductsChanged = () => {
            const loadProducts = async () => {
                try {
                    const products = await getAllProducts()
                    const sortedProducts = sortProductsByBadge(products).slice(0, 4)
                    setFeaturedProducts(sortedProducts)
                    localStorage.setItem('featuredProducts', JSON.stringify(sortedProducts))
                } catch (err) {
                    console.error('Failed to reload featured products:', err)
                }
            }
            loadProducts()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('productsChanged', handleProductsChanged)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('productsChanged', handleProductsChanged)
        }
    }, [])

    // Sort products to keep badged items at the top
    const sortProductsByBadge = (products: Product[]) => {
        const withBadge = products.filter(p => p.badge)
        const withoutBadge = products.filter(p => !p.badge)
        return [...withBadge, ...withoutBadge]
    }

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: (product.name || 'Unknown').toUpperCase(),
            price: product.price || '0',
            originalPrice: product.originalPrice || '',
            image: product.image || '/placeholder.png',
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

    const StarRating = ({ rating = 0 }: { rating?: number }) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-3 ${
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
                x: -50,
            },
            visible: {
                opacity: 1,
                filter: 'blur(0px)',
                x: 0,
                transition: {
                    type: 'spring' as const,
                    bounce: 0.3,
                    duration: 1.5,
                    delay: 0,
                },
            },
        },
    }

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <AnimatedGroup variants={transitionVariants}>
                    <div className="text-left mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-700 mb-2 ">
                            Featured Products
                        </h2>
                    </div>
                </AnimatedGroup>

                {/* Products Grid - 2 cols on mobile, 3 on tablet, 4 on desktop */}
                {isLoading ? (
                    // skeleton loading while products fetch
                    <AnimatedGroup variants={transitionVariants}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-100 animate-pulse h-64 rounded-lg"
                                />
                            ))}
                        </div>
                    </AnimatedGroup>
                ) : featuredProducts.length === 0 ? (
                    // professional empty state when no products exist
                    <AnimatedGroup variants={transitionVariants}>
                        <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-4">
                            <div className="text-center">
                                <div className="mb-6">
                                    <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Featured Products</h3>
                                <p className="text-gray-500 text-sm sm:text-base mb-4 max-w-sm mx-auto">
                                    Featured products are coming soon. Check back later to discover our curated selection!
                                </p>
                            </div>
                        </div>
                    </AnimatedGroup>
                ) : (
                    <AnimatedGroup variants={transitionVariants}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                            {featuredProducts.map((product) => (
                                <Link key={product.id} href={`/shop/${product.id}`} className="block">
                                <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                    {/* Product Image */}
                                    <div className="relative overflow-hidden rounded-t-lg h-48 sm:h-56">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={300}
                                                height={300}
                                                className={`w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300 ${
                                                    !product.inStock ? 'brightness-50' : ''
                                                }`}
                                                priority
                                            />
                                        ) : (
                                            <Image
                                                src="/placeholder.png"
                                                alt="no image"
                                                width={300}
                                                height={300}
                                                className="w-full h-48 sm:h-56 object-cover"
                                            />
                                        )}
                                        
                                        {/* Badge */}
                                        {product.badge && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                {product.badge}
                                            </span>
                                        )}
                                        
                                        {/* Sold Out Badge */}
                                        {!product.inStock && (
                                            <div className="absolute top-1 right-2">
                                                <img src="/soldout.png" alt="Sold Out" className="h-20 w-26 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="p-3 sm:p-4">
                                        {/* In Stock Indicator */}
                                        {product.inStock ? (
                                            <div className="flex items-center justify-end gap-1 mb-1 sm:mb-2">
                                                <Circle stroke="none" className="fill-green-500 size-2.5 sm:size-3" />
                                                <span className="text-xs text-green-600">In Stock</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-1 mb-1 sm:mb-2">
                                                <Circle stroke="none" className="fill-gray-500 size-2.5 sm:size-3" />
                                                <span className="text-xs text-gray-600">Sold Out</span>
                                            </div>
                                        )}
                                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                                            {product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase()}
                                        </h3>
                                        
                                        {/* Rating */}
                                        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                            <StarRating rating={product.rating} />
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                            <span className="text-sm sm:text-base font-bold text-gray-900">
                                                {product.price}
                                            </span>
                                            <span className="text-xs text-gray-500 line-through">
                                                {product.originalPrice}
                                            </span>
                                        </div>
                                        
                                        {/* Add to Cart Button */}
                                        {product.inStock ? (
                                            <Button 
                                                className={`w-full text-xs py-1.5 sm:text-sm sm:py-2 transition-colors ${
                                                    addedToCart.has(product.id)
                                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                                        : 'bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-300'
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleAddToCart(product)
                                                }}
                                            >
                                                {addedToCart.has(product.id) ? 'Added!' : 'Add to Cart'}
                                            </Button>
                                        ) : (
                                            <Button disabled className="w-full text-xs py-1.5 sm:text-sm sm:py-2 bg-gray-300 text-gray-500">
                                                SOLD OUT
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    </AnimatedGroup>
                )}
                
                {/* View All Button - only render once products exist */}
                {featuredProducts.length > 0 && (
                    <AnimatedGroup variants={transitionVariants}>
                        <div className="text-center mt-12">
                            <Link href="/shop">
                                <Button variant="outline" className="border-gray-40 text-gray-90 hover:bg-gray-500 hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base cursor-pointer">
                                    View All Products
                                </Button>
                            </Link>
                        </div>
                    </AnimatedGroup>
                )}
            </div>
        </section>
    )
}

export { Featured }

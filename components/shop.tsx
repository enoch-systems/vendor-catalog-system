'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star, ArrowLeft, ArrowRight, Search, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import Footer from '@/components/footer'
import { useCart } from './cart-context'
import { useUI } from '@/contexts/ui-context'
import { Product, getAllProducts } from '@/lib/products'

const StarRating = ({ rating = 0 }: { rating?: number }) => {
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

const Shop = () => {
    const { addToCart } = useCart()
    const { profileDropdownOpen, mobileMenuOpen } = useUI()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSort, setSelectedSort] = useState('Default')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')

    // reference and positioning for the dropdown so we can render it
    // fixed on the page and above all other elements
    const searchWrapperRef = useRef<HTMLDivElement>(null)
    const [resultsStyle, setResultsStyle] = useState<{top: number; left: number; width: number} | null>(null)

    // Load products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const productData = await getAllProducts()
                setProducts(productData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load products')
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    // Listen for product updates from admin page
    useEffect(() => {
        const handleStorageChange = () => {
            const loadProducts = async () => {
                try {
                    const productData = await getAllProducts()
                    setProducts(productData)
                } catch (err) {
                    console.error('Failed to reload products:', err)
                }
            }
            loadProducts()
        }

        const handleProductsChanged = () => {
            const loadProducts = async () => {
                try {
                    const productData = await getAllProducts()
                    setProducts(productData)
                } catch (err) {
                    console.error('Failed to reload products:', err)
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

    // update stored settings on mount
    useEffect(() => {
        const savedSort = localStorage.getItem('selectedSort')
        if (savedSort) setSelectedSort(savedSort)
        const savedCat = localStorage.getItem('selectedCategory')
        if (savedCat) setSelectedCategory(savedCat)
    }, [])
    
    useEffect(() => {
        localStorage.setItem('selectedSort', selectedSort)
    }, [selectedSort])
    
    useEffect(() => {
        localStorage.setItem('selectedCategory', selectedCategory)
    }, [selectedCategory])

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

    const productsPerPage = 10
    const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low']
    const categories = ['All', 'Lace', 'Human Hair', 'Curly', 'Straight', 'Colored']

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    
    // Sort products to keep badged items at the top
    const sortProductsByBadge = (products: Product[]) => {
        const withBadge = products.filter(p => p.badge)
        const withoutBadge = products.filter(p => !p.badge)
        return [...withBadge, ...withoutBadge]
    }
    
    const sortedProducts = sortProductsByBadge(products)
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const filteredProducts = sortedProducts.filter(product => product.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
    const displayedProducts = searchQuery ? filteredProducts : currentProducts
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
    
    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
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

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: number[] = []
        const maxVisiblePages = 4
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i)
                }
            } else if (currentPage >= totalPages - 1) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                for (let i = currentPage - 1; i <= currentPage + 2; i++) {
                    pages.push(i)
                }
            }
        }
        return pages
    }

    if (loading) {
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
                                        Shop 
                                    </h2>
                                </div>
                            </AnimatedGroup>

                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading products...</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </main>
            </>
        )
    }

    if (error) {
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
                                        Shop 
                                    </h2>
                                </div>
                            </AnimatedGroup>

                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-red-500 mb-4">Error loading products</div>
                                    <p className="text-gray-600 mb-4">{error}</p>
                                    <Button 
                                        onClick={() => window.location.reload()}
                                        className="bg-amber-900 text-white hover:bg-amber-800"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer />
                </main>
            </>
        )
    }

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
                                    Shop 
                                </h2>
                            </div>
                        </AnimatedGroup>

                        {/* Search Bar */}
                        <AnimatedGroup variants={transitionVariants} className="relative z-1">
                            <div ref={searchWrapperRef} className="relative text-center mb-6">
                                {!profileDropdownOpen && !mobileMenuOpen && (
                                    <div className="hover:bg-background bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-2 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300">
                                        <input
                                            type="text"
                                            placeholder="Search products...."
                                            className="text-foreground text-sm bg-transparent outline-none w-64 placeholder:text-muted-foreground"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ fontSize: '16px' }}
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
                                                <p className="text-sm font-semibold">{product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase()}</p>
                                                <p className="text-xs text-gray-500">{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Filters */}
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                                {/* Categories */}
                                <div className="lg:hidden">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 whitespace-nowrap">By Type:</span>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent text-gray-500"
                                        >
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Desktop Categories */}
                                <div className="hidden lg:flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors${
                                                selectedCategory === category
                                                    ? 'bg-amber-700 text-yellow-600'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort Options */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 whitespace-nowrap">By Price:</span>
                                    <select
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent text-gray-500"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </AnimatedGroup>

                        {/* Top Pagination */}
                        {!searchQuery && (
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="flex justify-center items-center mt-4 mb-7 gap-3">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex gap-3">
                                    {getPageNumbers().map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-full
                                             ${
                                                pageNumber === currentPage
                                                    ? 'text-amber-900 bg-amber-50 hover:bg-amber-100'
                                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-100 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </AnimatedGroup>
                        )}

                        {/* Products Grid - Same as featured: 2 cols on mobile, 3 on tablet, 4 on desktop */}
                        {displayedProducts.length === 0 ? (
                            <AnimatedGroup variants={transitionVariants}>
                                <div className="flex flex-col items-center justify-center min-h-[400px] py-16 px-4">
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Products Available</h3>
                                        <p className="text-gray-500 text-sm sm:text-base mb-4 max-w-sm mx-auto">
                                            {searchQuery 
                                                ? `No products found matching "${searchQuery}". Try adjusting your search terms.` 
                                                : 'We\'re currently updating our collection. Check back soon for amazing new products!'}
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="inline-block px-6 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium text-sm"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </AnimatedGroup>
                        ) : (
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                                {displayedProducts.map((product) => (
                                    <Link key={product.id} href={`/shop/${product.id}`} className="block">
                                        <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden rounded-t-lg h-48 sm:h-56">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={`w-full h-48 sm:h-56 object-cover transition-transform duration-300 ${
                                                        !product.inStock ? 'brightness-50' : ''
                                                    }`}
                                                />
                                            ) : (
                                                <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-gray-200">
                                                    <span className="text-gray-400 text-sm">No image</span>
                                                </div>
                                            )}
                                            
                                            {/* Badge */}
                                            {product.badge && (
                                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    {product.badge}
                                                </span>
                                            )}
                                            
                                            {/* Sold Out Badge */}
                                            {!product.inStock && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <div className="bg-white px-3 py-1 rounded-full">
                                                        <span className="text-red-500 font-semibold text-sm">SOLD OUT</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Product Info */}
                                        <div className="p-3 sm:p-4">
                                            {/* In Stock Indicator */}
                                            {product.inStock ? (
                                                <div className="flex items-center justify-end gap-1 mb-1 sm:mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-xs text-green-600">In Stock</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1 mb-1 sm:mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                    <span className="text-xs text-red-600">Out of Stock</span>
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

                        {/* Pagination */}
                        {!searchQuery && (
                        <AnimatedGroup variants={transitionVariants}>
                            <div className="flex justify-center items-center mt-8 gap-3">
                                <button 
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-50/70 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex gap-3">
                                    {getPageNumbers().map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                                                pageNumber === currentPage
                                                    ? 'text-amber-900 bg-amber-50 hover:bg-amber-100'
                                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-50/70 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </AnimatedGroup>
                        )}
                    </div>
                </section>

                {/* Page footer */}
                <Footer />
            </main>
        </>
    )
}

export default Shop

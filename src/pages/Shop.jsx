"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Search, Star, Plus, Grid, List, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const ProductCard = ({ product, onView, onInquiry }) => {
  const [imgSrc, setImgSrc] = useState(`https://snmtc.in/parts/public/${product.image}`)
  
  const handleImageError = () => {
    setImgSrc('/placeholder-product.jpg')
  }

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onView(product)}
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm ml-1">{product.rating} ({product.reviews})</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onInquiry(product)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Inquire
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 12,
    totalItems: 0
  })

  const fetchProducts = async (page = 1) => {
    setLoading(true)
    try {
      let url
      let isPaginated = true

      // Case 1: Both searchTerm + categoryId
      if (categoryId && searchTerm.trim() !== "") {
        url = `https://snmtc.in/parts/api/product/productserachlist?search=${searchTerm}&category_id=${categoryId}&page=${page}&per_page=${pagination.perPage}`
      }
      // Case 2: Only categoryId
      else if (categoryId) {
        url = `https://snmtc.in/parts/api/product/productserachlist?category_id=${categoryId}&page=${page}&per_page=${pagination.perPage}`
      }
      // Case 3: Only searchTerm
      else if (searchTerm.trim() !== "") {
        url = `https://snmtc.in/parts/api/product/productserachlist?search=${searchTerm}&page=${page}&per_page=${pagination.perPage}`
      }
      // Case 4: All Products
      else {
        url = `https://snmtc.in/parts/api/product/list?page=${page}&per_page=${pagination.perPage}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()

      if (data.statusCode === 200 || data.status === true) {
        const productsData = data.data || []

        setProducts(productsData.map(item => ({
          id: item.id,
          name: item.productname || item.name,
          image: item.image,
          rating: Math.floor(Math.random() * 2) + 3,
          reviews: Math.floor(Math.random() * 200),
          inStock: Math.random() > 0.2,
          description: item.description || "High quality product with premium features"
        })))

        setPagination({
          currentPage: data.current_page || page,
          totalPages: data.total_pages || Math.ceil((data.total || productsData.length) / pagination.perPage) || 1,
          perPage: data.per_page || pagination.perPage,
          totalItems: data.total || productsData.length
        })

        // Set current category name if applicable
        if (categoryId) {
          const catRes = await fetch(`https://snmtc.in/parts/api/category/list`)
          if (catRes.ok) {
            const catData = await catRes.json()
            if (catData.statusCode === 200) {
              const category = catData.data.find(c => c.id == categoryId)
              setCurrentCategory(category?.category || null)
            }
          }
        } else {
          setCurrentCategory(null)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [categoryId])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "" || !categoryId) {
        fetchProducts(1)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleInquiryClick = (product) => {
    navigate(`/inquiry/${product.id}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    navigate("/shop")
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-32 pb-20 bg-gradient-to-r from-indigo-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentCategory ? `${currentCategory} Products` : "Our Products"}
          </h1>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-32 pb-20 bg-gradient-to-r from-indigo-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {currentCategory ? `${currentCategory} Products` : "Our Products"}
          </h1>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(pagination.currentPage)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-32 pb-20 bg-gradient-to-r from-indigo-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {currentCategory ? `${currentCategory} Products` : "All Products"}
          </h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-0 bg-white/10 text-white placeholder-indigo-200 focus:ring-2 focus:ring-white"
              />
              {(categoryId || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {products.length > 0 ? (
            <>
              <div className={`grid ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={setSelectedProduct}
                    onInquiry={handleInquiryClick}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => fetchProducts(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = pagination.currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchProducts(pageNum)}
                          className={`w-10 h-10 rounded-full ${pagination.currentPage === pageNum ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => fetchProducts(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">
                No products found{currentCategory ? ` in ${currentCategory}` : ''}.
                {searchTerm && ` No matches for "${searchTerm}".`}
              </p>
              {(categoryId || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-6">
              <div>
                <img
                  src={`https://snmtc.in/parts/public/${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="w-full h-auto object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg'
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <p className="mb-6">{selectedProduct.description}</p>
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    handleInquiryClick(selectedProduct)
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
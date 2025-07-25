"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Search, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

export default function AdminProducts() {
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        totalItems: 0
    })
    const [successMessage, setSuccessMessage] = useState("")
    const timeoutRef = useRef(null)

    const API_BASE_URL = "https://snmtc.in/parts/api/product"
    const CATEGORY_API_URL = "https://snmtc.in/parts/api/category/list"

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API_URL)
            const data = await response.json()
            if (data.statusCode === 200) {
                setCategories(data.data)
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    // Debounced search effect
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        if (searchTerm && searchTerm.length >= 3) {
            timeoutRef.current = setTimeout(() => {
                fetchProducts(searchTerm, 1)
            }, 500)
        } else if (searchTerm === "") {
            fetchProducts("", 1)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [searchTerm])

    // Fetch products from API with pagination
    const fetchProducts = async (search = "", page = 1) => {
        setIsLoading(true)
        try {
            let url
            if (search) {
                url = `${API_BASE_URL}/productserachlist?search=${search}&page=${page}`
            } else {
                url = `${API_BASE_URL}/list?page=${page}`
            }

            const response = await fetch(url)
            const data = await response.json()

            if (data.statusCode === 200) {
                setProducts(data.data || [])
                setPagination({
                    currentPage: data.current_page || 1,
                    totalPages: data.total_pages || 1,
                    perPage: 10,
                    totalItems: data.current_count || 0
                })
            }
        } catch (error) {
            console.error("Error fetching products:", error)
            alert("Failed to fetch products")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setForm({ ...form, image: file })
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    // Reset form and modal state
    const resetForm = () => {
        setForm({ productname: "", description: "", image: null, category_id: "" })
        setPreviewImage(null)
        setEditingId(null)
        setShowModal(false)
    }

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()
        formData.append("productname", form.productname)
        formData.append("description", form.description)
        formData.append("category_id", form.category_id)
        if (form.image) {
            formData.append("image", form.image)
        }

        try {
            let response
            if (editingId) {
                // Update existing product
                response = await fetch(`${API_BASE_URL}/update/${editingId}`, {
                    method: "POST",
                    body: formData
                })
            } else {
                // Create new product
                response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    body: formData
                })
            }

            const result = await response.json()
            if (result.statusCode === 200 || result.statusCode === 201) {
                setSuccessMessage(editingId ? "Product updated successfully!" : "Product added successfully!")
                await fetchProducts(searchTerm, pagination.currentPage)
                resetForm()

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("")
                }, 3000)
            } else {
                alert(result.message || "Operation failed")
            }

        } catch (error) {
            console.error("Error:", error)
            alert("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    // Delete a product
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/destroy/${id}`, {
                method: "DELETE"
            })

            const result = await response.json()
            if (result.statusCode === 200) {
                // If we're on the last page and this was the only item, go to previous page
                if (products.length === 1 && pagination.currentPage > 1) {
                    fetchProducts(searchTerm, pagination.currentPage - 1)
                } else {
                    fetchProducts(searchTerm, pagination.currentPage)
                }
                setSuccessMessage("Product deleted successfully!")
                setTimeout(() => {
                    setSuccessMessage("")
                }, 3000)
            } else {
                alert(result.message || "Deletion failed")
            }
        } catch (error) {
            console.error("Error deleting product:", error)
            alert("Failed to delete product")
        } finally {
            setIsLoading(false)
        }
    }

    // Setup form for editing
    const handleEdit = (product) => {
        setForm({
            productname: product.productname,
            description: product.description,
            image: null,
            category_id: product.category_id || ""
        })

        setPreviewImage(product.image)
        setEditingId(product.id)
        setShowModal(true)
    }

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProducts(searchTerm, newPage)
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    const [form, setForm] = useState({
        productname: "",
        description: "",
        image: null,
        category_id: ""
    })

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 px-4 py-3 rounded bg-green-100 text-green-800 font-medium border border-green-300">
                    {successMessage}
                </div>
            )}

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products (min 3 characters)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={`https://snmtc.in/parts/public/${product.image}`}
                                                    alt={product.productname}
                                                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"

                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.productname}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {categories.find(c => c.id === product.category_id)?.category || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                                {product.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {products.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No products found</p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="mt-2 text-blue-600 hover:text-blue-800"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                      
                        {/* Pagination Controls */}
                        {/* {pagination.totalPages > 1 && (
                            <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-200">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                                        <span className="font-medium">{pagination.totalPages}</span> | Showing{' '}
                                        <span className="font-medium">{products.length}</span> items
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                 
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Previous Page"
                                    >
                                        ‹
                                    </button>

                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 border rounded ${pagination.currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Next Page"
                                    >
                                        ›
                                    </button>
                                  
                                </div>
                            </div>
                        )} */}
                    </>
                )}


                
            </div>
  {pagination.totalPages > 1 && (
                            // <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">


                            <div className="flex justify-between items-center gap-1 mt-5">


                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    title="Previous Page"
                                >
                                    <ChevronLeft className="h-4 w-4" />Previous
                                </button>

                                <div className="flex items-center space-x-1">
                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 border rounded-md text-sm font-medium ${pagination.currentPage === page
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    title="Next Page"
                                >
                                    <ChevronRight className="h-4 w-4" />Next
                                </button>


                            </div>
                            // </div>
                        )}
            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            title="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Product" : "Add Product"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={form.productname}
                                    onChange={(e) => setForm({ ...form, productname: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    placeholder="Enter product description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingId ? "Product Image (Leave unchanged to keep current)" : "Product Image *"}
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                                >
                                    {previewImage ? (
                                        <>
                                            <img
                                                src={editingId ? `https://snmtc.in/parts/public/${previewImage}` : previewImage}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found"
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white font-medium">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Plus className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Click to upload image
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!editingId && !previewImage}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {editingId ? "Update Product" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
"use client"
import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, Wrench } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://snmtc.in/parts/api/category/list")
        const data = await response.json()
        if (data.statusCode === 200) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Shop",
      href: "/shop",
      icon: <ShoppingCart className="h-4 inline mr-1" />,
      subItems: loading ? [] : categories.map(category => ({
        name: category.category,
        href: `/shop/${category.id}` // Changed to include category ID in URL
      }))
    },
    { name: "Services", href: "/services", icon: <Wrench className="h-4 w-4 inline mr-1" /> },
  ]

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2065/2065067.png"
                  alt="AutoParts Logo"
                  className="h-12 w-auto object-contain"
                />
                <span className="text-2xl font-bold text-gray-900 hidden sm:inline">
                  <span className="text-red-600">Auto</span>Parts
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${
                      location.pathname === item.href
                        ? "text-red-600 font-semibold"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                  >
                    {item.icon && item.icon}
                    {item.name}
                    {item.subItems && item.subItems.length > 0 && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/cart" className="p-2 text-gray-700 hover:text-red-600 transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-red-600 focus:outline-none p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${
                      location.pathname === item.href
                        ? "text-white bg-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && item.icon}
                    {item.name}
                  </Link>

                  {item.subItems && item.subItems.length > 0 && (
                    <div className="pl-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

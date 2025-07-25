"use client"
import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, Wrench } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    fetchCategories()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
        href: `/shop/${category.id}`
      }))
    },
    { name: "Services", href: "/services", icon: <Wrench className="h-4 w-4 inline mr-1" /> },
  ]

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg py-0" 
          : "bg-white py-2"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 group"
              >
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-1.5 rounded-lg group-hover:rotate-[15deg] transition-transform duration-300">
                  <img
                    src="src/components/img.png"
                    alt="AutoParts Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-gray-900  sm:inline">
                  <span className="text-red-600">Metro</span>Traders
                 {/* <img src="src/components/img.jpeg" alt="" style={{ width: "100%", height:"30px" }} /> */}

                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group py-2">
                  <Link
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium flex items-center rounded-lg transition-all duration-300 ${
                      location.pathname === item.href
                        ? "text-white bg-gradient-to-r from-red-600 to-red-800 shadow-lg"
                        : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    {item.icon && item.icon}
                    {item.name}
                    {item.subItems && item.subItems.length > 0 && (
                      <svg 
                        className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="absolute left-0 mt-1 w-48 bg-white shadow-xl rounded-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 origin-top">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:pl-5"
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
              {/* <Link 
                to="/cart" 
                className="p-2 text-gray-700 hover:text-red-600 transition-colors relative group"
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  3
                </span>
              </Link> */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-red-600 focus:outline-none p-2"
              >
                {isOpen ? (
                  <X className="h-7 w-7 transform rotate-180 transition-transform duration-500" />
                ) : (
                  <Menu className="h-7 w-7 transform rotate-0 transition-transform duration-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white border-t shadow-inner px-2 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name} className="border-b border-gray-100 last:border-0">
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-4 text-base font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === item.href
                      ? "text-white bg-gradient-to-r from-red-600 to-red-800 shadow-lg"
                      : "text-gray-700 hover:bg-red-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>

                {item.subItems && item.subItems.length > 0 && (
                  <div className="pl-6 py-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 rounded-lg hover:text-red-600 transition-all duration-200 hover:pl-5"
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
      </nav>
      {/* Spacer to prevent content jumping */}
      <div className="h-20"></div>
    </>
  )
}
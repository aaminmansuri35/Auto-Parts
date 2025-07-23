"use client"

import React, { useState, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Settings,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navigation = [
    // { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Home",
      icon: Package,
      type: "dropdown",
      children: [
        { name: "Slider", href: "admin/home" },
        { name: "About", href: "home/about" },
        { name: "Footer", href: "footerAdmin" },
       
      ]
    },
    { name: "Products", href: "home/products", icon: Package },
    { name: "category", href: "category", icon: Package },
    { name: "Services", href: "home/services", icon: Settings },
 
  ]

  const toggleSidebar = () => {
    if (isDesktop) {
      setCollapsed(!collapsed)
    } else {
      setSidebarOpen(!sidebarOpen)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform
          ${isDesktop
            ? collapsed
              ? "w-20"
              : "w-64"
            : sidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full"
          }
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center px-0" : "justify-between px-6"
            } h-16 border-b border-gray-200`}
          >
            {!collapsed && (
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AP</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isDesktop ? (
                collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon

              if (item.type === "dropdown") {
                const isAnyActive = item.children.some(child => location.pathname === child.href)

                return (
                  <div key={item.name} className="mb-1">
                    <button
                      onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                      className={`flex items-center w-full ${
                        collapsed ? "justify-center px-0 py-4" : "px-3 py-3"
                      } text-sm font-medium rounded-lg transition-all duration-200 ${
                        isAnyActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5`} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          {homeDropdownOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </button>

                    {!collapsed && homeDropdownOpen && (
                      <div className="ml-5 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`block text-sm px-2 py-1 rounded-md ${
                                isChildActive
                                  ? "text-blue-600 bg-blue-100 font-medium"
                                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => !isDesktop && setSidebarOpen(false)}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${
                    collapsed ? "justify-center px-0 py-4" : "px-3 py-3"
                  } text-sm font-medium rounded-lg mb-1 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => !isDesktop && setSidebarOpen(false)}
                >
                  <Icon
                    className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 ${
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {!collapsed && item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer / Sign Out */}
          <div className={`p-4 border-t border-gray-200 ${collapsed ? "text-center" : ""}`}>
            <button
              className={`flex items-center w-full ${collapsed ? "justify-center" : ""} px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200 group`}
              onClick={()=>{
                localStorage.clear();
                navigate("/login")
              }}
            >
              <LogOut
                className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 text-gray-400 group-hover:text-gray-600`}
              />
              {!collapsed && "Sign Out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 mr-4 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {
                  navigation.find(item =>
                    item.href === location.pathname ||
                    (item.type === "dropdown" &&
                      item.children.some(child => child.href === location.pathname))
                  )?.name || "Dashboard"
                }
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm text-gray-500">Welcome back, Admin</span>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

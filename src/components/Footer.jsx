import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"
import React, { useState, useEffect } from 'react'
import axios from "axios"

export default function Footer() {
  const [footer, setFooter] = useState(null)
  const [services, setServices] = useState([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get("https://snmtc.in/parts/api/get/footer/list")
        if (res.data?.data?.length > 0) {
          setFooter(res.data.data[0])
        }
      } catch (error) {
        console.error("Failed to load footer data", error)
      }
    }

    const fetchServices = async () => {
      try {
        const res = await axios.get("https://snmtc.in/parts/api/service/showtitle")
        setServices(res.data?.data || [])
      } catch (error) {
        console.error("Failed to load services", error)
      }
    }

    fetchFooter()
    fetchServices()
    setShow(true) // Trigger animation after data loads
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - Animation 1 */}
          <div className={`transform transition-all duration-700 ease-out ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">  <img
                    src="src/components/img.png"
                    alt="AutoParts Logo"
                    className="h-10 w-auto object-contain"
                  /></span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
               Metro Traders
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {footer?.companydescription || "Your trusted partner for quality automobile and machine spare parts."}
            </p>
            <div className="flex space-x-5">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-all duration-300 hover:-translate-y-1">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-all duration-300 hover:-translate-y-1">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1">
                <Linkedin className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links - Animation 2 */}
          <div className={`transform transition-all duration-700 ease-out delay-100 ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b-2 border-blue-500 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li className="hover:ml-2 transition-all duration-300">
                <Link to="/" className="text-gray-300 hover:text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Home
                </Link>
              </li>
              <li className="hover:ml-2 transition-all duration-300">
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  About Us
                </Link>
              </li>
              <li className="hover:ml-2 transition-all duration-300">
                <Link to="/services" className="text-gray-300 hover:text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Services
                </Link>
              </li>
              <li className="hover:ml-2 transition-all duration-300">
                <Link to="/shop" className="text-gray-300 hover:text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Services - Animation 3 */}
          <div className={`transform transition-all duration-700 ease-out delay-200 ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b-2 border-green-500 inline-block">Our Services</h3>
            <ul className="space-y-3">
              {services.length > 0 ? (
                services.slice(0, 5).map(service => (
                  <li key={service.id} className="group">
                    <Link
                      to={`/serviceDetail/${service.id}`}
                      className="text-gray-300 hover:text-white transition-colors flex items-center"
                    >
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3 transform group-hover:rotate-45 transition-transform"></span>
                      <span className="group-hover:text-green-400 transition-colors">
                        {service.title}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                [...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-center animate-pulse">
                    <div className="w-3 h-3 bg-gray-700 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contact Info - Animation 4 */}
          <div className={`transform transition-all duration-700 ease-out delay-300 ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b-2 border-yellow-500 inline-block">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/10 rounded-full mt-1">
                  <MapPin className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="text-gray-300 ml-3 hover:text-yellow-400 transition-colors">
                  {footer?.address || "123 Auto Street, Parts City, PC 12345"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <a href={`tel:${footer?.phone || '+1234567890'}`} className="text-gray-300 ml-3 hover:text-blue-400 transition-colors">
                  {footer?.phone || "+1 (234) 567-890"}
                </a>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <Mail className="h-5 w-5 text-red-500" />
                </div>
                <a href={`mailto:${footer?.email || 'contact@autoparts.com'}`} className="text-gray-300 ml-3 hover:text-red-400 transition-colors">
                  {footer?.email || "contact@autoparts.com"}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Section - Animation 5 */}
        <div className={`border-t border-gray-800 mt-12 pt-8 text-center transform transition-all duration-700 ease-out delay-500 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <p className="text-gray-400">
            © {new Date().getFullYear()} Developed by{" "}
            <a
              href="https://snmtc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              SNM TechCraft Innovation
            </a>
          </p>
          <div className="mt-2 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
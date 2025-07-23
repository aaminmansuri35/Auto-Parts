import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"
import React, { useState, useEffect } from 'react'
import axios from "axios"

export default function Footer() {
  const [footer, setFooter] = useState(null)
  const [services, setServices] = useState([])

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
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AP</span>
              </div>
              <span className="ml-2 text-xl font-bold">AutoParts</span>
            </div>
            <p className="text-gray-300 mb-4">
              {footer?.companydescription || "Your trusted partner for quality automobile and machine spare parts."}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-white">Shop</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Dynamic Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.length > 0 ? (
                services.map(service => (
                  <li key={service.id}>
                    <span className="text-gray-300">{service.title}</span>
                  </li>
                ))
              ) : (
                <li><span className="text-gray-500 italic">Loading services...</span></li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-300">{footer?.address || "Loading address..."}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-300">{footer?.phone || "Loading phone..."}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-300">{footer?.email || "Loading email..."}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} AutoParts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

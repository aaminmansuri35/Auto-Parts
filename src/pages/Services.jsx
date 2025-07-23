"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Wrench, Settings, Zap, Shield, Car, Cog, Gauge, PenTool as Tool, 
  Clock, Award, Check, DollarSign 
} from "lucide-react"

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const benefits = [
    {
      icon: Clock,
      title: "Quick Service",
      description: "Most services completed in under 2 hours"
    },
    {
      icon: Award,
      title: "Certified Experts",
      description: "ASE certified technicians with 10+ years experience"
    },
    {
      icon: Check,
      title: "Quality Guarantee",
      description: "12-month warranty on all services"
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description: "No hidden fees or surprise charges"
    }
  ]

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://snmtc.in/parts/api/service/list")
        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }
        const data = await response.json()
        if (data.statusCode === 200) {
          const transformedServices = data.data.map((service, index) => ({
            id: service.id,
            icon: [Wrench, Settings, Zap, Shield, Car, Cog, Gauge, Tool][index % 8],
            title: service.title,
            description: service.description,
            features: [
              "Professional service",
              "Quality guarantee",
              "Expert technicians",
              "Fast turnaround"
            ],

            featured: index < 2,
            image: service.filename
          }))
          setServices(transformedServices)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md mx-4">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Services</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-blue-400 to-blue-500 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
          style={{
            backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_1280.jpg')",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Expert Auto Services
          </h1>
          <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
            Premium automotive care with certified technicians and cutting-edge technology
          </p>
        </div>
      </section>

     

      {/* All Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Auto Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your vehicle maintenance and repair needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="p-6">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mt-6">
                 
                    <button 
                      onClick={() => navigate(`/serviceDetail/${service.id}`)}
                      className="text-blue-600 hover:text-white hover:bg-blue-600 px-4 py-2 rounded-lg border border-blue-600 transition-colors duration-300"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      

    
    </div>
  )
}
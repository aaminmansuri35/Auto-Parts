"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Phone, Mail, MapPin, Send } from "lucide-react"

export default function Inquiry() {
  const { id } = useParams() // Get product ID from URL
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [footer, setFooter] = useState(null)

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

    fetchFooter()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      title: formData.subject,
      description: formData.message,
      user_name: formData.name,
      phone: formData.phone,
      prod_id: id, // use the ID from URL
    }

    try {
      const res = await axios.post("https://snmtc.in/parts/api/inquiry/sendmail", payload)

      if (res.status === 200 || res.data?.statusCode === 200) {
        alert("Thank you! Your message was sent successfully.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err)
      alert("There was an error sending your inquiry.")
    }
  }

  return (
    <div>
      {/* Hero Section */}
  

        <section className="relative py-12 md:py-20 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 z-0 transform scale-110 transition-transform duration-[20s] ease-linear"
          style={{
            backgroundImage: "url('https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_1280.jpg')",
            animation: "parallax 20s ease-in-out infinite alternate",
          }}
        />
        {/* Add floating particles */}
        <div className="absolute inset-0 z-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl font-bold text-white mb-6">Inquiry </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Get in touch with our team for any questions or service inquiries
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">{footer?.phone || "Loading..."}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">{footer?.email || "Loading..."}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">{footer?.address || "Loading..."}</p>
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="(555) 123-4567"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="">Select a subject</option>
                    <option value="Looking for Car Engine">Looking for Car Engine</option>
                    <option value="Service Request">Service Request</option>
                    <option value="Parts Inquiry">Parts Inquiry</option>
                    <option value="Warranty Claim">Warranty Claim</option>
                    <option value="Other">Other</option>
                  </select>
                </div> */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d470029.4907297672!2d72.25008569347868!3d23.01990207203543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1752843699836!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">{footer?.address || "Loading address..."}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

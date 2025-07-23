"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Wrench } from "lucide-react"
import React from 'react'
export default function AdminServices() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Engine Repair & Maintenance",
      description: "Complete engine diagnostics, repair, and maintenance services",
      price: "Starting at $89",
      icon: "Wrench",
      status: "Active",
    },
    {
      id: 2,
      title: "Brake Service",
      description: "Professional brake inspection, repair, and replacement services",
      price: "Starting at $129",
      icon: "Settings",
      status: "Active",
    },
    {
      id: 3,
      title: "Electrical Systems",
      description: "Expert electrical system diagnosis and repair",
      price: "Starting at $79",
      icon: "Zap",
      status: "Active",
    },
    {
      id: 4,
      title: "Computer Diagnostics",
      description: "Advanced computer diagnostics to identify issues",
      price: "Starting at $99",
      icon: "Shield",
      status: "Inactive",
    },
  ])

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    icon: "Wrench",
  })

  const handleAddService = (e) => {
    e.preventDefault()
    const service = {
      id: services.length + 1,
      ...newService,
      status: "Active",
    }
    setServices([...services, service])
    setNewService({ title: "", description: "", price: "", icon: "Wrench" })
    setShowAddModal(false)
  }

  const handleDeleteService = (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((service) => service.id !== id))
    }
  }

  const toggleServiceStatus = (id) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, status: service.status === "Active" ? "Inactive" : "Active" } : service,
      ),
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  service.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {service.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <p className="text-blue-600 font-semibold mb-4">{service.price}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleServiceStatus(service.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                  service.status === "Active"
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {service.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Service</h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Starting at $99"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={newService.icon}
                    onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Wrench">Wrench</option>
                    <option value="Settings">Settings</option>
                    <option value="Zap">Zap</option>
                    <option value="Shield">Shield</option>
                    <option value="Car">Car</option>
                    <option value="Cog">Cog</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

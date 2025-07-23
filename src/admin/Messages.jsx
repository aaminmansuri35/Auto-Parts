"use client"

import { useState } from "react"
import { Mail, MailOpen, Trash2, Reply, Search } from "lucide-react"
import React from 'react'
export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      subject: "Service Inquiry",
      message: "I need to schedule a brake service for my 2018 Honda Civic. When is your earliest availability?",
      date: "2024-01-15",
      time: "10:30 AM",
      status: "unread",
      priority: "normal",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 234-5678",
      subject: "Parts Question",
      message: "Do you have brake pads in stock for a 2020 Toyota Camry? I need them urgently.",
      date: "2024-01-15",
      time: "09:15 AM",
      status: "read",
      priority: "high",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@example.com",
      phone: "(555) 345-6789",
      subject: "Warranty Claim",
      message:
        "I purchased spark plugs last month and one of them is defective. How do I proceed with a warranty claim?",
      date: "2024-01-14",
      time: "03:45 PM",
      status: "replied",
      priority: "normal",
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa@example.com",
      phone: "(555) 456-7890",
      subject: "General Inquiry",
      message: "What are your business hours and do you offer mobile repair services?",
      date: "2024-01-14",
      time: "11:20 AM",
      status: "unread",
      priority: "low",
    },
  ])

  const handleMessageClick = (message) => {
    setSelectedMessage(message)
    if (message.status === "unread") {
      setMessages(messages.map((msg) => (msg.id === message.id ? { ...msg, status: "read" } : msg)))
    }
  }

  const handleDeleteMessage = (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter((msg) => msg.id !== id))
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
    }
  }

  const handleReply = (message) => {
    // In a real app, this would open an email client or modal
    alert(`Reply to ${message.email}`)
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || message.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-gray-100 text-gray-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "normal":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Manage customer inquiries and communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedMessage?.id === message.id ? "bg-blue-50 border-r-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.status === "unread" ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-900">{message.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{message.subject}</p>
                  <p className="text-sm text-gray-600 truncate">{message.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}
                    >
                      {message.status}
                    </span>
                    <span className="text-xs text-gray-500">{message.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors duration-200"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">From:</span>
                    <span className="ml-2 text-gray-900">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{selectedMessage.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedMessage.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedMessage.date} at {selectedMessage.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Message Selected</h3>
              <p className="text-gray-600">Select a message from the list to view its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {messages.filter((m) => m.status === "unread").length}
          </div>
          <div className="text-gray-600">Unread Messages</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {messages.filter((m) => m.status === "replied").length}
          </div>
          <div className="text-gray-600">Replied</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {messages.filter((m) => m.priority === "high").length}
          </div>
          <div className="text-gray-600">High Priority</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-gray-600 mb-2">{messages.length}</div>
          <div className="text-gray-600">Total Messages</div>
        </div>
      </div>
    </div>
  )
}

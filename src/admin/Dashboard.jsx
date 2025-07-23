import { Package, Users, MessageSquare, Settings, Plus, FileText, UserPlus, BarChart2 } from "lucide-react"
import { Link } from "react-router-dom";
import React from "react"

export default function AdminDashboard() {
  const stats = [
    {
      name: "Total Products",
      value: "248",
      change: "+12%",
      changeType: "increase",
      icon: Package,
      link: "/admin/products"
    },
    {
      name: "Team Members",
      value: "25",
      change: "+2",
      changeType: "increase",
      icon: Users,
      link: "/admin/team"
    },
    {
      name: "Messages",
      value: "47",
      change: "+8",
      changeType: "increase",
      icon: MessageSquare,
      link: "/admin/messages"
    },
    {
      name: "Services",
      value: "12",
      change: "0",
      changeType: "neutral",
      icon: Settings,
      link: "/admin/services"
    },
  ]

  const recentOrders = [
    { id: "#001", customer: "John Smith", product: "Brake Pads", amount: "$89.99", status: "Completed" },
    { id: "#002", customer: "Sarah Johnson", product: "Oil Filter", amount: "$24.99", status: "Processing" },
    { id: "#003", customer: "Mike Davis", product: "Spark Plugs", amount: "$45.99", status: "Shipped" },
    { id: "#004", customer: "Lisa Chen", product: "Air Filter", amount: "$19.99", status: "Pending" },
  ]

  const recentMessages = [
    { id: 1, name: "Robert Wilson", subject: "Service Inquiry", time: "2 hours ago", read: false },
    { id: 2, name: "Amanda Brown", subject: "Parts Question", time: "4 hours ago", read: true },
    { id: 3, name: "David Lee", subject: "Warranty Claim", time: "6 hours ago", read: true },
    { id: 4, name: "Emily Davis", subject: "General Inquiry", time: "8 hours ago", read: false },
  ]

  const quickActions = [
    {
      title: "Add New Product",
      icon: Plus,
      link: "/admin/products/new",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Add Team Member",
      icon: UserPlus,
      link: "/admin/team/new",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Create Service",
      icon: Settings,
      link: "/admin/services/new",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "View Reports",
      icon: BarChart2,
      link: "/admin/reports",
      color: "bg-orange-600 hover:bg-orange-700"
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            to={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : stat.changeType === "decrease"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-2 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <Link
                  key={message.id}
                  to={`/admin/messages/${message.id}`}
                  className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-2 rounded ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div>
                    <p className={`font-medium ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                      {message.name}
                      {!message.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"></span>}
                    </p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{message.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`${action.color} text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2`}
            >
              <action.icon className="h-5 w-5" />
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
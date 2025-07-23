import { Linkedin, Twitter, Mail } from "lucide-react"
import React from 'react'
export default function Team() {
  const teamMembers = [
    {
      name: "John Smith",
      role: "Master Technician",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "ASE Master Certified technician specializing in engine diagnostics and repair.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "john@autoparts.com",
      },
    },
    {
      name: "Sarah Johnson",
      role: "Service Manager",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=300&h=300&fit=crop&crop=face",
      bio: "Experienced service manager ensuring quality and customer satisfaction.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@autoparts.com",
      },
    },
    {
      name: "Mike Davis",
      role: "Brake Specialist",
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Certified brake specialist with expertise in all brake system repairs.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mike@autoparts.com",
      },
    },
    {
      name: "Lisa Chen",
      role: "Electrical Technician",
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in automotive electrical systems and computer diagnostics.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "lisa@autoparts.com",
      },
    },
    {
      name: "Robert Wilson",
      role: "Parts Manager",
      experience: "14 years",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      bio: "Manages inventory and ensures availability of quality automotive parts.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "robert@autoparts.com",
      },
    },
    {
      name: "Amanda Brown",
      role: "Customer Service",
      experience: "6 years",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
      bio: "Dedicated to providing exceptional customer service and support.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "amanda@autoparts.com",
      },
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Meet Our Team</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our experienced professionals are dedicated to providing you with the best automotive service
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
                    <div className="flex space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={member.social.linkedin}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Linkedin className="h-5 w-5 text-blue-600" />
                      </a>
                      <a
                        href={member.social.twitter}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Twitter className="h-5 w-5 text-blue-600" />
                      </a>
                      <a
                        href={`mailto:${member.social.email}`}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Mail className="h-5 w-5 text-blue-600" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-3">{member.experience} experience</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team by Numbers</h2>
            <p className="text-lg text-gray-600">The expertise and experience that drives our success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Years Combined Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-lg p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Join Our Team</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented professionals to join our growing team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                View Open Positions
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                Submit Resume
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

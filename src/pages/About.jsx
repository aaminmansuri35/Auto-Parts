"use client"

import { Users, Award, Clock, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import React from "react"
import { motion } from "framer-motion";

export default function About() {
  const [aboutData, setAboutData] = useState(null)
  const [statsData, setStatsData] = useState([])
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    fetch("https://snmtc.in/parts/api/journey/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200 && Array.isArray(data.data)) {
          setTimeline(data.data)
        }
      })
      .catch((err) => console.error("Journey API Error:", err))
  }, [])

  // Fetch about data from API
  useEffect(() => {
    fetch("https://snmtc.in/parts/api/about/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          const about = data.data[0]
          setAboutData(about)

          // Dynamically build stats array from API values
          // setStatsData([
          //   {
          //     icon: Users,
          //     label: "Happy Customers",
          //     value: about.customer ? `${about.customer.toLocaleString()}+` : "10,000+",
          //   },
          //   {
          //     icon: Award,
          //     label: "Years Experience",
          //     value: about.experience ? `${about.experience}+` : "20+",
          //   },
          //   {
          //     icon: Clock,
          //     label: "Projects Completed",
          //     value: about.projects ? `${about.projects.toLocaleString()}+` : "50,000+",
          //   },

          // ])
        }
      })
      .catch((err) => console.error("About API Error:", err))
  }, [])

  return (
    <div className="overflow-x-hidden">
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">About AutoParts</h1>
          <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in automotive excellence for over two decades
          </p>
        </div>
      </section>

      {/* ✅ Stats Section - From API, CSS Unchanged */}
      {/* <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-blue-50 p-4 rounded-lg shadow-sm flex flex-col items-center text-center"
              >
                <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-5 w-5 md:h-8 md:w-8 text-blue-600" />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}


      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl transform rotate-3 z-0"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform -rotate-1 z-10">
                  {aboutData && (
                    <img
                      src={`https://snmtc.in/parts/public/${aboutData.filename}`}
                      alt="About Us"
                      className="w-full h-auto object-cover h-[400px!important]"
                    />
                  )}
                </div>
                {/* {aboutData && (
                  <div className="absolute -bottom-6 z-10 -right-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-xl shadow-lg transform rotate-3">
                    <div className="text-3xl font-bold">{aboutData.experience}+</div>
                    <div className="text-sm font-medium">Years Experience</div>
                  </div>
                )} */}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="max-w-lg">
                <span className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  About Company
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {aboutData?.title || "Quality Auto Parts & Professional Service"}
                </h2>

                <div className="prose prose-lg text-gray-600 mb-8">
                  {aboutData?.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8">
                  {/* <div className="bg-white  p-5 rounded-xl shadow-md border border-gray-100 ">
                    <div className="flex items-center">
                      <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {aboutData?.customer ? `${aboutData.customer.toLocaleString()}+` : "10,000+"}
                        </div>
                        <div className="text-gray-600">Happy Customers</div>
                      </div>
                    </div>
                  </div> */}

                  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center">
                      <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          {aboutData?.parts ? `${aboutData.parts.toLocaleString()}+` : "500+"}
                        </div>
                        <div className="text-gray-600">Parts Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Our Journey</h2>
            <p className="text-base md:text-lg text-gray-600">Key milestones in our company's growth</p>
          </div>

          <div className="relative pl-8 md:pl-0">
            {/* Vertical line - mobile left aligned, desktop centered */}
            <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-blue-200 md:transform md:-translate-x-1/2"></div>

        {timeline.map((item, index) => (
  <motion.div
    key={index}
    className="relative mb-10 md:mb-12 group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-xl transform -translate-x-1/2 md:-translate-x-1/2 group-hover:scale-125 transition-transform duration-300"></div>

    <div className="md:flex md:items-center">
      <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:order-last"}`}>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group-hover:border-blue-200">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm px-3 py-1 rounded-full mb-3">
            {item.year}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      </div>
      <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? "" : "order-first"}`}></div>
    </div>
  </motion.div>
))}

          </div>
        </div>
      </section>

      {/* Mobile Footer CTA */}
      <section className="py-10 bg-blue-600 md:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Quality Auto Parts Since 2004</h3>
          <p className="text-blue-100 mb-4">Experience the AutoParts difference today</p>
          <button className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-50 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
      {/* Add your remaining sections here (About details, Story, Timeline, etc.) */}
    </div>
  )
}

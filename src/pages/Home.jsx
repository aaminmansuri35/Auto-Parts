"use client"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  Settings,
  Zap,
  Shield,
  Star,
  ShoppingCart,
  Menu,
  X,
  Search,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown
} from "lucide-react"

import { motion } from "framer-motion"




const slideVariants = {
  initial: { opacity: 0, scale: 1 },
  animate: { opacity: 1, scale: 1.05, transition: { duration: 1.2 } },
  exit: { opacity: 0, scale: 1 },
}

export default function Home() {
  const navigate = useNavigate();
  const [viewingProduct, setViewingProduct] = useState(false);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState({
    slides: true,
    about: true,
    services: true,
    products: true
  });

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch slider data
        const slidesRes = await fetch("https://snmtc.in/parts/public/api/home/list");
        const slidesData = await slidesRes.json();
        setSlides(slidesData.data.map(item => ({
          image: `https://snmtc.in/parts/public/${item.filename}`,
          title: item.title,
          subtitle: item.description,
        })));
        setIsLoading(prev => ({ ...prev, slides: false }));

        // Fetch about data
        const aboutRes = await fetch("https://snmtc.in/parts/api/about/list");
        const aboutData = await aboutRes.json();
        if (aboutData.data?.length > 0) setAboutData(aboutData.data[0]);
        setIsLoading(prev => ({ ...prev, about: false }));

        // Fetch services data
        const servicesRes = await fetch("https://snmtc.in/parts/api/service/list");
        const servicesData = await servicesRes.json();
        if (servicesData.data?.length > 0) {
          setServices(servicesData.data.map(service => ({
            id: service.id,
            image: `https://snmtc.in/parts/public/${service.filename}`,
            title: service.title,
            description: service.description,
          })));
        }
        setIsLoading(prev => ({ ...prev, services: false }));

        // Fetch products data
        const productsRes = await fetch("https://snmtc.in/parts/api/product/list");
        const productsData = await productsRes.json();
        if (productsData.data?.length > 0) {
          setProducts(productsData.data.map(product => ({
            id: product.id,
            image: `https://snmtc.in/parts/public/${product.image}`,
            name: product.productname,
            description: product.description,
            rating: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1))
          })));
        }
        setIsLoading(prev => ({ ...prev, products: false }));
      } catch (err) {
        console.error("API Error:", err);
        Object.keys(isLoading).forEach(key => {
          setIsLoading(prev => ({ ...prev, [key]: false }));
        });
      }
    };

    fetchData();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, slides.length]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/serviceDetail/${serviceId}`);
  };

  const handleInquiryClick = (product) => {
    navigate(`/Inquiry/${product.id}`);
  };

  return (
    <div className="font-['Roboto']">



      <section className="relative overflow-hidden text-white h-[50vh] md:h-screen">
        {isLoading.slides ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading slides...</div>
          </div>
        ) : (
          <motion.div
            className="relative h-full flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          >
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                variants={slideVariants}
                initial="initial"
                animate={index === currentSlide ? "animate" : "initial"}
                exit="exit"
                className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out"
              >
                {/* Background Image */}
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: index === currentSlide ? 1.1 : 1 }}
                  transition={{ duration: 2 }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* Text Content */}
                <div
                  className={`absolute inset-0 z-20 flex items-center px-4 max-w-7xl mx-auto ${index === 0
                    ? "justify-start text-left"
                    : index === 1
                      ? "justify-center text-center"
                      : "justify-end text-right"
                    }`}
                >
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>




      {/* ================= About Section ================= */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-20 left-0 w-52 h-52 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 sm:right-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {isLoading.about ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading about section...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Image Section */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl transform rotate-3 z-0"></div>
                  <div className="relative rounded-2xl overflow-hidden transform -rotate-1 z-10">
                    {aboutData && (
                      <img
                        src={`https://snmtc.in/parts/public/${aboutData.filename}`}
                        alt="About Us"
                        loading="lazy"
                        className="w-full object-cover h-[300px] md:h-[400px] transition-transform duration-1000 hover:scale-105"
                      />
                    )}
                  </div>
                  {/* {aboutData && (
                    
                    <div className="absolute -bottom-6 z-10 -right-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-xl shadow-lg transform rotate-3">
                      <div className="text-2xl sm:text-3xl font-bold">{aboutData.experience}+</div>
                      <div className="text-sm font-medium">Years Experience</div>
                      
                    </div>
                  )} */}
                </div>
              </div>

              {/* Text Section */}
              <div className="order-1 lg:order-2">
                <div className="max-w-lg mx-auto lg:mx-0">
                  <span className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold text-center lg:text-left">
                    About Company
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                    {aboutData?.title || "Quality Auto Parts & Professional Service"}
                  </h2>

                  <div className="prose prose-sm sm:prose-lg text-gray-600 mb-8">
                    {aboutData?.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8">
                    {/* Customers */}
                    {/* <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {aboutData?.customer ? `${aboutData.customer.toLocaleString()}+` : "10,000+"}
                          </div>
                          <div className="text-gray-600 text-sm">Happy Customers</div>
                        </div>
                      </div>
                    </div> */}

                    {/* Parts */}
                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {aboutData?.parts ? `${aboutData.parts.toLocaleString()}+` : "500+"}
                          </div>
                          <div className="text-gray-600 text-sm">Parts Available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ================= Services Section ================= */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional <span className="text-blue-600">Automotive Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive automotive solutions to keep your vehicle running smoothly and efficiently
            </p>
          </div>

          {isLoading.services ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-8 h-64 animate-pulse">
                  <div className="bg-gray-200 h-12 w-12 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-3"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-5/6 rounded mt-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 z-0"></div>

                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="h-16 w-16 object-cover rounded-full border-2 border-white shadow transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6 flex-grow">
                      {service.description}
                    </p>

                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className="text-blue-600 font-medium inline-flex items-center group-hover:text-blue-800 transition-colors duration-300"
                    >
                      Learn more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Need professional assistance?</h3>
                <p className="text-blue-100 max-w-xl">
                  Our certified technicians are ready to help with any automotive needs
                </p>
              </div>
              <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap">
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Featured Products ================= */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Premium Parts
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Auto Parts</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium selection of auto parts at competitive prices
            </p>
          </div>

          {isLoading.products ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden h-96 animate-pulse">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-6">
                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-5/6 rounded mb-4"></div>
                    <div className="bg-gray-200 h-10 w-full rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <button
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                      onClick={() => setViewingProduct(product)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-700 text-sm truncate w-full text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <p className="text-gray-700 text-sm truncate w-full">
                        {product.description}
                      </p>

                      <button
                        className="w-full sm:w-auto z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                        onClick={() => handleInquiryClick(product)}
                      >
                        Inquiry
                      </button>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Need Parts Information?</h3>
                <p className="text-blue-100 max-w-xl">
                  Contact us for expert advice and detailed product specifications
                </p>
              </div>
              <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap">
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Product Modal ================= */}
      {viewingProduct && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingProduct(false)}
        >
          <div
            className="relative max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full p-2 z-10 transition"
              onClick={() => setViewingProduct(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Product Image */}
              <div className="p-6 lg:p-10 bg-gray-50 flex items-center justify-center">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-full h-auto max-h-[500px] object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 lg:p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewingProduct.name}</h2>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < viewingProduct.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 line-clamp-5 text-sm leading-relaxed mb-6">
                  {viewingProduct.description}
                </p>

                {/* Inquiry Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                    onClick={() => {
                      handleInquiryClick(viewingProduct);
                      setViewingProduct(false);
                    }}
                  >
                    Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
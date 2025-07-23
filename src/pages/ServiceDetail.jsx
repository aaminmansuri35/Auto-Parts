import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const fetchService = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://snmtc.in/parts/api/service/show/${id}`);
      if (!response.ok) throw new Error("Failed to fetch service details");

      const result = await response.json();
      if (!result?.data) throw new Error("Service not found");

      setService(result.data);
      setImageError(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleRetry = () => fetchService();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-3/4 bg-gray-200 rounded-lg mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
              <div className="h-12 w-40 bg-gray-300 rounded-lg mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center bg-white rounded-xl shadow-lg mt-10">
        <div className="bg-red-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 text-xl font-medium mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 duration-300 font-medium flex items-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center bg-white rounded-xl shadow-lg mt-10">
        <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Service Not Found</h3>
        <p className="text-gray-600">The requested service could not be found in our database.</p>
      </div>
    );
  }

  return (
  <>
  
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
        Premium Auto Services
          </h1>
          <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
 Professional automotive care with certified technicians and cutting-edge technology
          </p>
        </div>
      </section>
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Service Detail Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Image */}
          <div className="relative min-h-[400px]">
            {service.filename && !imageError ? (
              <img
                src={`https://snmtc.in/parts/public/${service.filename}`}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-600 mb-2">Image Not Available</h3>
                <p className="text-gray-500 max-w-xs">Visual representation for this service is currently unavailable</p>
              </div>
            )}
          </div>
          
          {/* Service Details */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col">
            <div className="flex-1">
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full mb-4">
                Premium Service
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
              
              <div className="prose prose-lg max-w-none text-gray-700 mb-8 whitespace-pre-line">
                {service.description}
              </div>
            </div>
            
            
          </div>
        </div>
      </div>

    
    </div></>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Package,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Notification() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [dateFilter, setDateFilter] = useState('today');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      let fromDate, toDate;
      
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        fromDate = today;
        toDate = today;
      } else if (dateFilter === 'custom') {
        fromDate = dateRange.from;
        toDate = dateRange.to;
      } else {
        // For other filters like 'week', 'month'
        const now = new Date();
        if (dateFilter === 'week') {
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          fromDate = weekStart.toISOString().split('T')[0];
          toDate = new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'month') {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          fromDate = monthStart.toISOString().split('T')[0];
          toDate = new Date().toISOString().split('T')[0];
        }
      }

      const res = await fetch(`https://snmtc.in/parts/api/inquiry/list?from=${fromDate}&to=${toDate}&page=${page}`);
      
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const result = await res.json();
      
      if (result.statusCode === 200) {
        setInquiries(Array.isArray(result.data) ? result.data : []);
        setPagination({
          current_page: result.current_page || 1,
          last_page: result.total_page || 1,
          total: result.current_count || 0
        });
        setError(null);
      } else {
        setInquiries([]);
        throw new Error(result.message || 'Invalid data received');
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch inquiries", err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await fetch(`https://snmtc.in/parts/api/inquiry/destroy/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.statusCode === 200) {
        if (Array.isArray(inquiries) && inquiries.length === 1 && pagination.current_page > 1) {
          fetchData(pagination.current_page - 1);
        } else {
          fetchData(pagination.current_page);
        }
      } else {
        throw new Error(result.message || 'Failed to delete inquiry');
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete inquiry", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = React.useMemo(() => {
    if (!Array.isArray(inquiries)) return [];
    if (!searchTerm) return inquiries;
    
    const searchLower = searchTerm.toLowerCase();
    return inquiries.filter(item =>
      (item.product_name?.toLowerCase().includes(searchLower)) ||
      (item.user_name?.toLowerCase().includes(searchLower)) ||
      (item.phone?.includes(searchTerm)) ||
      (item.email?.toLowerCase().includes(searchLower))
    );
  }, [inquiries, searchTerm]);

  const toggleExpand = useCallback((id) => {
    setExpanded(prev => prev === id ? null : id);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchData(page);
    }
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
  };

  const handleCustomDateChange = (e, type) => {
    setDateRange(prev => ({
      ...prev,
      [type]: e.target.value
    }));
    setDateFilter('custom');
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > pagination.last_page) {
      endPage = pagination.last_page;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <span className="mt-4 text-gray-600">Loading inquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">Failed to load inquiries. Please try again.</p>
          <button
            onClick={() => {
              setError(null);
              fetchData(1);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus that might cause navigation
            onMouseUp={(e) => {
              e.preventDefault();
              fetchData(1);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Inquiry Management</h2>
            <p className="text-gray-600 mt-1">View and manage customer inquiries</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm text-gray-500">
              Showing {filteredInquiries.length} of {pagination.total} inquiries (Page {pagination.current_page} of {pagination.last_page})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search inquiries"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleDateFilterChange('today')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${dateFilter === 'today' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Today
              </button>
              <button
                onClick={() => handleDateFilterChange('week')}
                className={`px-3 py-2 text-sm font-medium ${dateFilter === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                This Week
              </button>
              <button
                onClick={() => handleDateFilterChange('month')}
                className={`px-3 py-2 text-sm font-medium ${dateFilter === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                This Month
              </button>
              <button
                onClick={() => handleDateFilterChange('custom')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${dateFilter === 'custom' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleCustomDateChange(e, 'from')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleCustomDateChange(e, 'to')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm ? "No matching inquiries found" : "No inquiries available"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Try adjusting your search criteria" : "Check back later for new inquiries"}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                fetchData(1);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900 font-medium">{item.user_name || 'N/A'}</div>
                          <div className="text-gray-500 text-sm">{item.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{item.product_name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{item.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {new Date(item.created_at).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                            aria-label={expanded === item.id ? "Collapse details" : "Expand details"}
                          >
                            {expanded === item.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-600 hover:text-red-900 focus:outline-none disabled:opacity-50"
                            aria-label="Delete inquiry"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expanded === item.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                              <div className="col-span-2">
                                <p className="font-medium">Description:</p>
                                <div className="text-gray-900 whitespace-pre-wrap">
                                  {item.description || 'No description provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              <div className="hidden sm:flex items-center space-x-2">
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${pagination.current_page === page 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notification;
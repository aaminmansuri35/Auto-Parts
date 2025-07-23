"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { toast } from "react-hot-toast"

export default function HomeAbout() {
    return (
        <div className="space-y-8">
            <AboutSection />
            <JourneySection />
        </div>
    )
}

function AboutSection() {
    const [showModal, setShowModal] = useState(false)
    const [aboutData, setAboutData] = useState([])
    const [form, setForm] = useState({
        title: "",
        description: "",
        experience: "",
        customer: "",
        parts: "",
        image: null,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("https://snmtc.in/parts/public/api/about/list")
            setAboutData(res.data.data)
        } catch (error) {
            console.error("Error fetching about data:", error)
            toast.error("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setForm({ ...form, image: file })
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("title", form.title)
            formData.append("description", form.description)
            formData.append("experience", form.experience)
            formData.append("customer", form.customer)
            formData.append("parts", form.parts)
            if (form.image) {
                formData.append("image", form.image)
            }

            let res
            if (editingId) {
                res = await axios.post(`https://snmtc.in/parts/public/api/about/update/${editingId}`, formData)
                toast.success("Updated successfully")
            } else {
                res = await axios.post(`https://snmtc.in/parts/public/api/about/register`, formData)
                toast.success("Added successfully")
            }

            fetchData()
            resetForm()
        } catch (error) {
            toast.error("Failed to save data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setForm({
            title: item.title,
            description: item.description,
            experience: item.experience,
            customer: item.customer,
            parts: item.parts,
            image: null
        })
        setPreviewImage(`https://snmtc.in/parts/public/${item.filename}`)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return
        setIsLoading(true)
        try {
            await axios.delete(`https://snmtc.in/parts/public/api/about/destroy/${id}`)
            toast.success("Deleted successfully")
            fetchData()
        } catch {
            toast.error("Delete failed")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setForm({ title: "", description: "", experience: "", customer: "", parts: "", image: null })
        setPreviewImage(null)
        setEditingId(null)
        setShowModal(false)
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">About Section</h1>
                    <p className="text-gray-600">Manage About content</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add</span>
                </button>
            </div>

            {isLoading && !aboutData.length ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Experience</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Parts</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {aboutData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img src={`https://snmtc.in/parts/public/${item.filename}`} className="h-16 w-24 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 max-w-md truncate">
                                            {item.title.length > 20
                                                ? `${item.title.substring(0, 50)}...`
                                                : item.title}
                                        </td>
                                        <td className="px-6 py-4 max-w-md truncate">
                                            {item.description.length > 50
                                                ? `${item.description.substring(0, 50)}...`
                                                : item.description}
                                        </td>

                                        <td className="px-6 py-4">{item.experience}</td>
                                        <td className="px-6 py-4">{item.customer}</td>
                                        <td className="px-6 py-4">{item.parts}</td>
                                        <td className="px-6 py-4 ">
                                            <button onClick={() => handleEdit(item)} className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-100 p-1 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit About" : "Add About"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                rows={3}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Experience"
                                value={form.experience}
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Customer"
                                value={form.customer}
                                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Parts"
                                value={form.parts}
                                onChange={(e) => setForm({ ...form, parts: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <div>
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 overflow-hidden relative"
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Plus className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Click to upload image
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!editingId}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {editingId ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function JourneySection() {
    const [showModal, setShowModal] = useState(false)
    const [journeyData, setJourneyData] = useState([])
    const [form, setForm] = useState({
        year: "",
        title: "",
        description: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("http://192.168.1.20:8000/api/journey/list")
            setJourneyData(res.data.data)
        } catch (error) {
            console.error("Error fetching journey data:", error)
            toast.error("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let res
            if (editingId) {
                res = await axios.post(`http://192.168.1.20:8000/api/journey/update/${editingId}`, form)
                toast.success("Updated successfully")
            } else {
                res = await axios.post("http://192.168.1.20:8000/api/journey/register", form)
                toast.success("Added successfully")
            }

            fetchData()
            resetForm()
        } catch (error) {
            toast.error("Failed to save data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setForm({
            year: item.year,
            title: item.title,
            description: item.description
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return
        setIsLoading(true)
        try {
            await axios.delete(`http://192.168.1.20:8000/api/journey/destroy/${id}`)
            toast.success("Deleted successfully")
            fetchData()
        } catch {
            toast.error("Delete failed")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setForm({ year: "", title: "", description: "" })
        setEditingId(null)
        setShowModal(false)
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow mt-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Journey Section</h1>
                    <p className="text-gray-600">Manage company journey timeline</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Milestone</span>
                </button>
            </div>

            {isLoading && !journeyData.length ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Year</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {journeyData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{item.year}</td>
                                        <td className="px-6 py-4 max-w-md">{item.title}</td>
                                        <td className="px-6 py-4 max-w-lg">
                                            <div className="line-clamp-2">
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(item)} 
                                                    className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)} 
                                                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Milestone" : "Add Milestone"}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 2010"
                                    value={form.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Milestone title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Detailed description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center transition-colors"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {editingId ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
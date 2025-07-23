"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AdminHome() {
    const [showSliderModal, setShowSliderModal] = useState(false)
    const [sliderData, setSliderData] = useState([])
    const [newSlider, setNewSlider] = useState({
        title: "",
        description: "",
        image: null,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    useEffect(() => {
        fetchSliderData()
    }, [])

    const fetchSliderData = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("https://snmtc.in/parts/public/api/home/list")
            setSliderData(res.data.data)

        } catch (error) {
            console.error("Error fetching slider data:", error)
            toast.error("Failed to load slider data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewSlider({ ...newSlider, image: file })
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleAddSlider = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("title", newSlider.title)
            formData.append("description", newSlider.description)
            if (newSlider.image) {
                formData.append("image", newSlider.image)
            }

            let response
            if (editingId) {
                response = await axios.post(`https://snmtc.in/parts/public/api/home/update/${editingId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })

                toast.success("Slider updated successfully")
            } else {
                response = await axios.post("https://snmtc.in/parts/public/api/home/register", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                toast.success("Slider added successfully")
            }

            fetchSliderData()
            resetForm()
        } catch (error) {
            console.error("Error saving slider:", error)
            toast.error(error.response?.data?.message || "Failed to save slider")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setNewSlider({
            title: item.title,
            description: item.description,
            image: null
        })
        setPreviewImage(`https://snmtc.in/parts/public/${item.filename}`)
        setShowSliderModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slider?")) return;

        setIsLoading(true);
        try {
            await axios.delete(`https://snmtc.in/parts/public/api/home/destroy/${id}`);
            toast.success("Slider deleted successfully");
            fetchSliderData();
        } catch (error) {
            console.error("Error deleting slider:", error);
            toast.error("Failed to delete slider");
        } finally {
            setIsLoading(false);
        }
    }



    const resetForm = () => {
        setNewSlider({ title: "", description: "", image: null })
        setPreviewImage(null)
        setEditingId(null)
        setShowSliderModal(false)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Home Slider</h1>
                    <p className="text-gray-600">Manage slider items on the homepage</p>
                </div>
                <button
                    onClick={() => setShowSliderModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Slider</span>
                </button>
            </div>

            {/* Slider Table */}
            {isLoading && !sliderData.length ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sliderData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={`https://snmtc.in/parts/public/${item.filename}`}
                                                alt={item.title}
                                                className="h-16 w-24 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Add/Edit Slider Modal */}
            {showSliderModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Slider Item" : "Add Slider Item"}
                        </h2>

                        <form onSubmit={handleAddSlider} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="Slider title"
                                    value={newSlider.title}
                                    onChange={(e) => setNewSlider({ ...newSlider, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"

                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Slider description"
                                    value={newSlider.description}
                                    onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows={3}

                                />
                            </div>
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

                                <p className="mt-1 text-xs text-gray-500">
                                    Upload a high-quality image (JPEG, PNG). Max size: 2MB.
                                </p>
                            </div>


                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                                    disabled={isLoading}
                                >
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
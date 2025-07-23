"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { toast } from "react-hot-toast"

export default function HomeServices() {
    const [showModal, setShowModal] = useState(false)
    const [serviceData, setServiceData] = useState([])
    const [form, setForm] = useState({
        title: "",
        description: "",
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
            const res = await axios.get("https://snmtc.in/parts/api/service/list")
            setServiceData(res.data.data)
        } catch (error) {
            console.error("Error fetching service data:", error)
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
            if (form.image) {
                formData.append("image", form.image)
            }

            let res
            if (editingId) {
                res = await axios.post(`https://snmtc.in/parts/api/service/update/${editingId}`, formData)
                toast.success("Updated successfully")
            } else {
                res = await axios.post(`https://snmtc.in/parts/api/service/register`, formData)
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
            image: null
        })
        setPreviewImage(`https://snmtc.in/parts/public/${item.filename}`)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return
        setIsLoading(true)
        try {
            await axios.delete(`https://snmtc.in/parts/api/service/destroy/${id}`)
            toast.success("Deleted successfully")
            fetchData()
        } catch {
            toast.error("Delete failed")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setForm({ title: "", description: "", image: null })
        setPreviewImage(null)
        setEditingId(null)
        setShowModal(false)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services Section</h1>
                    <p className="text-gray-600">Manage Services content</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add</span>
                </button>
            </div>

            {isLoading && !serviceData.length ? (
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
                                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {serviceData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img src={`https://snmtc.in/parts/public/${item.filename}`} className="h-16 w-24 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 max-w-md truncate">
                                            {item.title.length > 20
                                                ? `${item.title.substring(0, 20)}...`
                                                : item.title}
                                        </td>
                                        <td className="px-6 py-4 max-w-md truncate">
                                            {item.description.length > 50
                                                ? `${item.description.substring(0, 50)}...`
                                                : item.description}
                                        </td>
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

                        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Service" : "Add Service"}</h2>
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
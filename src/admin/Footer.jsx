"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { toast } from "react-hot-toast"

export default function FooterAdmin() {
    const [showModal, setShowModal] = useState(false)
    const [footerData, setFooterData] = useState([])
    const [form, setForm] = useState({
        companydescription: "",
        address: "",
        phone: "",
        email: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("https://snmtc.in/parts/api/get/footer/list", { timeout: 10000 });
            setFooterData(res.data.data);
        } catch (error) {
            console.error("Error fetching footer data:", error);
            toast.error("Failed to load data. Server may be offline.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let res
            if (editingId) {
                res = await axios.post(`https://snmtc.in/parts/api/footer/update/${editingId}`, form)
                toast.success("Updated successfully")
            } else {
                res = await axios.post(`https://snmtc.in/parts/api/footer/register`, form)
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
            companydescription: item.companydescription,
            address: item.address,
            phone: item.phone,
            email: item.email
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return
        setIsLoading(true)
        try {
            await axios.delete(`https://snmtc.in/parts/api/footer/destroy/${id}`)
            toast.success("Deleted successfully")
            fetchData()
        } catch {
            toast.error("Delete failed")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setForm({
            companydescription: "",
            address: "",
            phone: "",
            email: ""
        })
        setEditingId(null)
        setShowModal(false)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Footer Section</h1>
                    <p className="text-gray-600">Manage Footer content</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add</span>
                </button>
            </div>

            {isLoading && !footerData.length ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs text-gray-500 uppercase">Description</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 uppercase">Address</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 uppercase">Phone</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 uppercase">Email</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {footerData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 max-w-md truncate">
                                            {item.companydescription.length > 30
                                                ? `${item.companydescription.substring(0, 30)}...`
                                                : item.companydescription}
                                        </td>
                                        <td className="px-5 py-4 max-w-md truncate">
                                            {item.address.length > 30
                                                ? `${item.address.substring(0, 30)}...`
                                                : item.address}
                                        </td>
                                        <td className="px-5 py-4">{item.phone}</td>
                                        <td className="px-5 py-4 max-w-md truncate">{item.email}</td>
                                        <td className="px-5 py-4 ">
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

                        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Footer" : "Add Footer"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <textarea
                                placeholder="Company Description"
                                value={form.companydescription}
                                onChange={(e) => setForm({ ...form, companydescription: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                rows={3}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />

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
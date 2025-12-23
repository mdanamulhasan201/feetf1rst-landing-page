"use client"
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import { Switch } from "../../ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Plus, X, Trash2, Save, Calendar } from "lucide-react"
import { toast } from "react-hot-toast"
import { createSoftwareManagement, updateSoftwareManagement } from "../../../apis/softwereManagement"

export default function SoftwareManagementFormModal({
    open,
    onOpenChange,
    editingData = null,
    onSuccess
}) {
    const [formData, setFormData] = useState({
        version: "",
        releaseDate: new Date().toISOString(),
        title: "",
        isNewest: false,
        description: [
            {
                title: "",
                desc: [""]
            }
        ]
    })
    const [isLoading, setIsLoading] = useState(false)

    // Load editing data when modal opens
    useEffect(() => {
        if (open && editingData) {
            // Editing mode - load existing data
            setFormData({
                version: editingData.version || "",
                releaseDate: editingData.releaseDate || new Date().toISOString(),
                title: editingData.title || "",
                isNewest: editingData.isNewest || false,
                description: editingData.description && editingData.description.length > 0
                    ? editingData.description
                    : [{ title: "", desc: [""] }]
            })
        } else if (open && !editingData) {
            // Create mode - set today's date automatically
            const today = new Date()
            const todayISOString = today.toISOString()

            setFormData({
                version: "",
                releaseDate: todayISOString,
                title: "",
                isNewest: false,
                description: [{ title: "", desc: [""] }]
            })
        }
    }, [open, editingData])

    // Handle basic field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle release date change (convert to ISO string)
    const handleDateChange = (value) => {
        const date = new Date(value)
        setFormData(prev => ({
            ...prev,
            releaseDate: date.toISOString()
        }))
    }

    // Add new description section
    const addDescriptionSection = () => {
        setFormData(prev => ({
            ...prev,
            description: [
                ...prev.description,
                {
                    title: "",
                    desc: [""]
                }
            ]
        }))
    }

    // Remove description section
    const removeDescriptionSection = (index) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.filter((_, i) => i !== index)
        }))
    }

    // Update description section title
    const updateDescriptionTitle = (sectionIndex, title) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.map((section, index) =>
                index === sectionIndex ? { ...section, title } : section
            )
        }))
    }

    // Add new desc item to a section
    const addDescItem = (sectionIndex) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.map((section, index) =>
                index === sectionIndex
                    ? { ...section, desc: [...section.desc, ""] }
                    : section
            )
        }))
    }

    // Remove desc item from a section
    const removeDescItem = (sectionIndex, descIndex) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.map((section, index) =>
                index === sectionIndex
                    ? { ...section, desc: section.desc.filter((_, i) => i !== descIndex) }
                    : section
            )
        }))
    }

    // Update desc item
    const updateDescItem = (sectionIndex, descIndex, value) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.map((section, index) =>
                index === sectionIndex
                    ? {
                        ...section,
                        desc: section.desc.map((item, i) => (i === descIndex ? value : item))
                    }
                    : section
            )
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        if (!formData.version || !formData.title || !formData.releaseDate) {
            toast.error("Please fill in all required fields")
            return
        }

        if (formData.description.length === 0) {
            toast.error("Please add at least one description section")
            return
        }

        // Filter out empty description sections and items
        const cleanedDescription = formData.description
            .map(section => ({
                ...section,
                desc: section.desc.filter(item => item.trim() !== "")
            }))
            .filter(section => section.title.trim() !== "" && section.desc.length > 0)

        if (cleanedDescription.length === 0) {
            toast.error("Please add at least one valid description section with items")
            return
        }

        const finalData = {
            version: formData.version,
            releaseDate: formData.releaseDate,
            title: formData.title,
            isNewest: formData.isNewest,
            description: cleanedDescription
        }

        setIsLoading(true)

        try {
            if (editingData && editingData.id) {
                // Update existing
                await updateSoftwareManagement(editingData.id, finalData)
                toast.success("Release notes updated successfully!")
            } else {
                // Create new
                await createSoftwareManagement(finalData)
                toast.success("Release notes created successfully!")
            }

            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            toast.error(error.message || "Failed to save release notes")
        } finally {
            setIsLoading(false)
        }
    }

    // Format date for input field
    const formatDateForInput = (isoString) => {
        const date = new Date(isoString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingData ? "Update Release Notes" : "Create Release Notes"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingData
                            ? "Update the details for this release version"
                            : "Fill in the details for the new release version"
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="version">
                                    Version <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="version"
                                    type="text"
                                    value={formData.version}
                                    onChange={(e) => handleChange("version", e.target.value)}
                                    placeholder="e.g., 1.3"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="releaseDate">
                                    Release Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="releaseDate"
                                        type="date"
                                        value={formatDateForInput(formData.releaseDate)}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        required
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="e.g., FEETF1RST SOFTWARE 1.3"
                                required
                            />
                        </div>

                        {/* Is Newest Toggle */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isNewest"
                                checked={formData.isNewest}
                                onCheckedChange={(checked) => handleChange("isNewest", checked)}
                            />
                            <Label htmlFor="isNewest" className="cursor-pointer">
                                Mark as Newest Version
                            </Label>
                        </div>

                        {/* Description Sections */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">
                                    Description Sections <span className="text-red-500">*</span>
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDescriptionSection}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Section
                                </Button>
                            </div>

                            {formData.description.map((section, sectionIndex) => (
                                <Card key={sectionIndex} className="border-2">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">
                                                Section {sectionIndex + 1}
                                            </CardTitle>
                                            {formData.description.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDescriptionSection(sectionIndex)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Section Title */}
                                        <div className="space-y-2">
                                            <Label htmlFor={`section-title-${sectionIndex}`}>
                                                Section Title <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={`section-title-${sectionIndex}`}
                                                type="text"
                                                value={section.title}
                                                onChange={(e) =>
                                                    updateDescriptionTitle(sectionIndex, e.target.value)
                                                }
                                                placeholder="e.g., Neue Funktionen, Verbesserungen, Bugfixes"
                                                required
                                            />
                                        </div>

                                        {/* Description Items */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label>Description Items</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addDescItem(sectionIndex)}
                                                    className="flex items-center gap-1 h-7"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add Item
                                                </Button>
                                            </div>

                                            {section.desc.map((item, descIndex) => (
                                                <div
                                                    key={descIndex}
                                                    className="flex items-start gap-2"
                                                >
                                                    <div className="flex-1">
                                                        <Textarea
                                                            value={item}
                                                            onChange={(e) =>
                                                                updateDescItem(
                                                                    sectionIndex,
                                                                    descIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter description item..."
                                                            className="min-h-[60px]"
                                                        />
                                                    </div>
                                                    {section.desc.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeDescItem(sectionIndex, descIndex)
                                                            }
                                                            className="text-red-500 hover:text-red-700 mt-1"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {isLoading
                                ? (editingData ? "Updating..." : "Creating...")
                                : (editingData ? "Update Release Notes" : "Create Release Notes")
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


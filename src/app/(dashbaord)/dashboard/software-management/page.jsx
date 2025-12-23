"use client"
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Plus, X, Trash2, Save } from "lucide-react"
import { toast } from "react-hot-toast"

export default function SoftwareManagement() {
  const [formData, setFormData] = useState({
    version: "1.3",
    releaseDate: "2024-03-15T00:00:00.000Z",
    title: "FEETF1RST SOFTWARE 1.3",
    description: [
      {
        title: "Neue Funktionen",
        desc: [
          "Neuer AI-gestützter Shoe Finder mit verbesserter Passform-Analyse",
          "Erweiterte 3D-Visualisierung für Einlagen"
        ]
      },
      {
        title: "Verbesserungen",
        desc: [
          "50% schnellere Ladezeiten bei großen Kundenkarteien",
          "Verbesserte Benutzeroberfläche für mobile Geräte"
        ]
      },
      {
        title: "Bugfixes",
        desc: [
          "Absturz beim Import großer CSV-Dateien behoben",
          "Falsche Berechnung bei speziellen Einlagen-Materialien korrigiert"
        ]
      }
    ]
  })

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
      ...formData,
      description: cleanedDescription
    }

    // Log the JSON (in production, send to API)
    console.log("Form Data JSON:", JSON.stringify(finalData, null, 2))
    toast.success("Release notes saved successfully!")
    
    // Here you would typically send to API
    // await saveReleaseNotes(finalData)
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Software Management
        </h1>
        <p className="text-gray-600 text-lg">
          Create and manage software release notes
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Release Notes Information</CardTitle>
            <CardDescription>
              Fill in the details for the new release version
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
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
                <Input
                  id="releaseDate"
                  type="date"
                  value={formatDateForInput(formData.releaseDate)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
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

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log("Form Data:", JSON.stringify(formData, null, 2))
                  toast.success("Form data logged to console")
                }}
              >
                Preview JSON
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Release Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* JSON Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Output Preview</CardTitle>
          <CardDescription>
            This is how your data will be structured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg border overflow-auto text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

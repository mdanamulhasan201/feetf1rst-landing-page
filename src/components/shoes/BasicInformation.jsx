"use client"
import React from 'react'
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { CardTitle, CardDescription } from "../ui/card"
import JoditEditor from "jodit-react"

const editorConfig = {
  readonly: false,
  height: 300,
  toolbar: true,
  spellcheck: false,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "center",
    "left",
    "right",
    "justify",
    "|",
    "link",
    "image",
    "|",
    "hr",
    "eraser",
    "|",
    "undo",
    "redo",
    "|",
    "fullsize",
  ],
};

export default function BasicInformation({ 
  formData, 
  setFormData,
  brandOptions,
  shoeTypeOptions,
  handleChange,
  handleSelectChange
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name *</Label>
          <Input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Select
            value={formData.brand}
            onValueChange={(value) => handleSelectChange('brand', value)}
          >
            <SelectTrigger className="w-full" id="brand">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brandOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 w-full">
          <Label htmlFor="typeOfShoes">Type of Shoes</Label>
          <Select
            value={formData.typeOfShoes}
            onValueChange={(value) => handleSelectChange('typeOfShoes', value)}
          >
            <SelectTrigger className="w-full" id="typeOfShoes">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {shoeTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* product description */}
      <div className="space-y-2">
        <Label htmlFor="productDesc">Product Description *</Label>
        <div className="border rounded-md">
          <JoditEditor
            value={formData.productDesc}
            config={editorConfig}
            onChange={newContent => {
              setFormData(prev => ({ ...prev, productDesc: newContent }));
            }}
          />
        </div>
      </div>
    </div>
  )
}

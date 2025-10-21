"use client"
import React from 'react'
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { X, Plus } from "lucide-react"
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

const availableSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47']

export default function ShoeSpecifications({ 
  formData, 
  setFormData
}) {
  // Handle size selection
  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const currentSizes = [...prev.size];
      const currentQuantities = { ...prev.sizeQuantities };

      if (currentSizes.includes(size)) {
        // Remove size and its quantity when deselected
        delete currentQuantities[size];
        return {
          ...prev,
          size: currentSizes.filter(s => s !== size),
          sizeQuantities: currentQuantities
        };
      } else {
        // Add size with initial quantity of 0
        return {
          ...prev,
          size: [...currentSizes, size],
          sizeQuantities: {
            ...currentQuantities,
            [size]: ""
          }
        };
      }
    });
  };

  const handleSizeQuantityChange = (size, quantity) => {
    const newQuantity = quantity === '' ? 0 : parseInt(quantity) || 0;
    setFormData(prev => ({
      ...prev,
      sizeQuantities: {
        ...prev.sizeQuantities,
        [size]: newQuantity
      }
    }));
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shoe Specifications</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Available Sizes & Quantities *</Label>
            <p className="text-sm text-gray-500 mt-1">Select sizes and specify quantities for each size</p>
          </div>
          <Badge variant="outline" className="font-normal">
            {formData.size.length} sizes selected
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {availableSizes.map(size => (
            <div
              key={size}
              className={`relative group transition-all duration-200 ${formData.size.includes(size)
                ? 'border-2 border-green-500 bg-green-50'
                : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                } rounded-lg p-3`}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => handleSizeToggle(size)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <div className={`
                      w-6 h-6 flex items-center justify-center rounded
                      ${formData.size.includes(size)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'}
                    `}>
                      {size}
                    </div>
                    <span className={`text-sm ${formData.size.includes(size) ? 'text-green-700' : 'text-gray-600'}`}>
                      EU
                    </span>
                  </div>

                  {formData.size.includes(size) && (
                    <button
                      onClick={() => handleSizeToggle(size)}
                      className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 
                               text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {formData.size.includes(size) && (
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      value={formData.sizeQuantities[size]}
                      onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                      className="h-8 text-sm pr-8 bg-white"
                      placeholder="Qty"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      pcs
                    </span>
                  </div>
                )}
              </div>

              {/* Hover effect for unselected sizes */}
              {!formData.size.includes(size) && (
                <div
                  className="absolute inset-0 bg-gray-50/80 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200 rounded-lg flex items-center 
                           justify-center cursor-pointer"
                  onClick={() => handleSizeToggle(size)}
                >
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicalData">Technical Data</Label>
        <div className="border rounded-md">
          <JoditEditor
            value={formData.technicalData}
            config={editorConfig}
            onChange={newContent => {
              setFormData(prev => ({ ...prev, technicalData: newContent }));
            }}
          />
        </div>
      </div>
    </div>
  )
}

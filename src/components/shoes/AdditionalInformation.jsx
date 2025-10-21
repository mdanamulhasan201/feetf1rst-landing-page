"use client"
import React from 'react'
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { X } from "lucide-react"
import Image from 'next/image'

const genderOptions = ['Male', 'Female', 'Unisex']

export default function AdditionalInformation({ 
  formData, 
  setFormData,
  characteristics
}) {
  // Handle select changes for gender and characteristics
  const handleSelectChange = (name, value) => {
    if (name === 'characteristics') {
      setFormData(prev => ({
        ...prev,
        characteristics: prev.characteristics.includes(value)
          ? prev.characteristics.filter(id => id !== value)
          : [...prev.characteristics, value]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* GENDER */}
        <div className="space-y-2 w-full">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange('gender', value)}
          >
            <SelectTrigger className="w-full" id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map(option => (
                <SelectItem key={option} value={option.toLowerCase()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CHARACTERISTICS */}
        <div className="space-y-2 w-full">
          <Label htmlFor="characteristics">Characteristics *</Label>
          <Select
            value=""
            onValueChange={(value) => handleSelectChange('characteristics', value)}
            multiple
          >
            <SelectTrigger className="w-full" id="characteristics">
              <SelectValue placeholder="Select characteristics">
                {formData.characteristics.length > 0
                  ? `${formData.characteristics.length} selected`
                  : "Select characteristics"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {characteristics.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id.toString()}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div>
                      <p>{item.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full">
                        <Image
                          src={item.image}
                          alt={item.text}
                          width={100}
                          height={100}
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      {formData.characteristics.includes(item.id.toString()) && (
                        <span className="font-semibold text-lg text-green-600">✓</span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.characteristics.map((charId) => {
              const char = characteristics.find(c => c.id.toString() === charId);
              return char ? (
                <Badge
                  key={charId}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  {char.text}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectChange('characteristics', charId);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

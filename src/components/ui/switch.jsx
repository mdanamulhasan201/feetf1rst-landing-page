"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const Switch = React.forwardRef(
  ({ className, checked, defaultChecked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = React.useState(!!defaultChecked)

    const isChecked = isControlled ? !!checked : internalChecked

    const handleClick = () => {
      if (disabled) return
      
      const newValue = !isChecked

      if (!isControlled) {
        setInternalChecked(newValue)
      }

      if (onCheckedChange) {
        onCheckedChange(newValue)
      }
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-4 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-blue-600" : "bg-gray-200",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform",
            isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }


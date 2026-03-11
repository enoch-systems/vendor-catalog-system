'use client'

import React, { useState, useEffect, useRef } from 'react'

const FloatingWhatsApp = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial position to bottom right
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - 64, // 48 + 16 padding
        y: window.innerHeight - 64,
      })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  const handleStart = (clientX: number, clientY: number) => {
    if (!ref.current) return
    setIsDragging(true)
    const rect = ref.current.getBoundingClientRect()
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(clientX - dragOffset.x, window.innerWidth - 48))
      const newY = Math.max(0, Math.min(clientY - dragOffset.y, window.innerHeight - 48))
      setPosition({
        x: newX,
        y: newY,
      })
    }
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    const handleTouchEnd = () => {
      handleEnd()
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragOffset])

  return (
    <a
      href="https://wa.me/2349162919586?text=Hi,%20I'm%20interested%20in%20your%20premium%20hair%20products%20from%20Hair%20Saas.%20Can%20you%20provide%20more%20details?"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 cursor-pointer select-none"
      style={{
        left: position.x,
        top: position.y,
        width: 48,
        height: 48,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full" />
    </a>
  )
}

export default FloatingWhatsApp

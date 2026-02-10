'use client'

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Eraser } from 'lucide-react'

export interface SignaturePadHandle {
    clear: () => void
    isEmpty: () => boolean
    toDataURL: () => string | null
}

interface SignaturePadProps {
    onChange?: (dataUrl: string | null) => void
    disabled?: boolean
}

const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(({ onChange, disabled = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasSignature, setHasSignature] = useState(false)

    useImperativeHandle(ref, () => ({
        clear: () => handleClear(),
        isEmpty: () => !hasSignature,
        toDataURL: () => {
            if (!hasSignature || !canvasRef.current) return null
            return canvasRef.current.toDataURL('image/png')
        }
    }))

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resizeCanvas = () => {
            const parent = canvas.parentElement
            if (parent) {
                canvas.width = parent.clientWidth
                canvas.height = 200 // Fixed height or dynamic
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.lineCap = 'round'
                    ctx.lineJoin = 'round'
                    ctx.strokeStyle = '#000'
                    ctx.lineWidth = 2
                }
            }
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        let clientX, clientY

        if ('touches' in event) {
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
        } else {
            clientX = (event as React.MouseEvent).clientX
            clientY = (event as React.MouseEvent).clientY
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return
        event.preventDefault() // Prevent scrolling on touch

        const { x, y } = getCoordinates(event)
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
            ctx.beginPath()
            ctx.moveTo(x, y)
            setIsDrawing(true)
        }
    }

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || disabled) return
        event.preventDefault() // Prevent scrolling on touch

        const { x, y } = getCoordinates(event)
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
            ctx.lineTo(x, y)
            ctx.stroke()
            if (!hasSignature) setHasSignature(true)
        }
    }

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false)
            const dataUrl = canvasRef.current?.toDataURL('image/png') || null
            if (onChange) onChange(dataUrl)
        }
    }

    const handleClear = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            setHasSignature(false)
            if (onChange) onChange(null)
        }
    }

    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white relative group">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`w-full touch-none cursor-crosshair ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                style={{ height: '200px' }}
            />

            {!hasSignature && !disabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
                    <span className="text-xl text-slate-400 font-handwriting">Firma aquí</span>
                </div>
            )}

            {hasSignature && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Borrar firma"
                >
                    <Eraser size={16} />
                </button>
            )}

            <div className="absolute bottom-2 left-2 text-xs text-slate-400 pointer-events-none select-none">
                Usa el ratón o el dedo para firmar dentro del recuadro
            </div>
        </div>
    )
})

SignaturePad.displayName = 'SignaturePad'

export default SignaturePad

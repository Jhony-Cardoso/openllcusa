"use client"
import Link from "next/link"
import { useState } from "react"

export default function SectionCalculadora() {
  const [hover, setHover] = useState(false)
  return (
    <section
      className="section-calculadora"
      style={{
        background: "linear-gradient(90deg, var(--color-primary), var(--color-teal-700) 80%)",
        color: "#fff",
        padding: "64px 0",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 16, color: "#fff" }}>
        Descubre cuánto podrías ahorrar con tu LLC en EE.UU.
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: 32, color: "rgba(255,255,255,0.92)" }}>
        Nuestra calculadora fiscal te ayudará a estimar tus beneficios
      </p>
      <Link
        href="/lead-form"
        className="calculadora-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: "#fff",
          color: "var(--color-primary)",
          fontWeight: 700,
          borderRadius: 28,
          padding: "18px 38px",
          fontSize: 20,
          boxShadow: hover
            ? "0 6px 24px 0 rgba(50,184,198,0.18)"
            : "0 3px 20px 0 rgba(50,184,198,0.10)",
          textDecoration: "none",
          transition: "box-shadow .25s, transform .19s cubic-bezier(.42,.29,.19,.96)",
          transform: hover ? "scale(1.04)" : "none"
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span role="img" aria-label="Calculadora">🧮</span>
        Abrir Calculadora Fiscal
      </Link>
    </section>
  )
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./lead-form.module.css";
import { analyticsEvents } from "@/lib/analytics";

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  situacion: string;
};

const opcionesSituacion = [
  "Busco ahorrar impuestos y cumplir 100%",
  "Solo facturo poco (freelance/eventual)",
  "Mi empresa ya tributa fuera de EE.UU.",
  "Trabajo remoto para clientes globales",
  "Otro caso"
];

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    situacion: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Tracking GA4: cuando se carga la página del lead-form
  useEffect(() => {
    analyticsEvents.leadFormViewed();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const avanzarAlStep2 = () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.situacion) {
      setError("Por favor, completa todos los campos requeridos");
      return;
    }
    setError(null);

    // ✅ Tracking GA4: cuando avanza al paso 2
    analyticsEvents.leadFormStep2();

    setStep(2);
  };

  const seguirQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) throw new Error("Error al procesar la solicitud");

        const data = await response.json();
        if (data.leadId) {
          localStorage.setItem("lead-id", data.leadId);
          localStorage.setItem("lead-name", form.nombre);

          // ✅ Tracking GA4: lead generado correctamente
          analyticsEvents.leadGenerated();
        }

        router.push("/quiz");
      } catch (err) {
        setError("Hubo un problema al guardar tus datos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.bgGradient}>
      <form className={styles.formulario} onSubmit={seguirQuiz} autoComplete="on">
        <div className={styles.stepper}>
          <div className={`${styles.step} ${step === 1 ? styles.active : ""}`}></div>
          <div className={`${styles.step} ${step === 2 ? styles.active : ""}`}></div>
        </div>
        
        {step === 1 ? (
          <section>
            <h2 className={styles.titulo}>Empecemos con lo básico</h2>
            
            <label className={styles.label}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInput}
              className={styles.input}
              placeholder="Juan Pérez"
              autoFocus
              required
            />
            
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              className={styles.input}
              placeholder="tu@email.com"
              required
            />
            
            <label className={styles.label}>Teléfono <span className={styles.optional}>(opcional)</span></label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleInput}
              className={styles.input}
              placeholder="+34 600 000 000"
              pattern="^\\+?[0-9\\s]*$"
              autoComplete="tel"
            />
            
            <label className={styles.label}>¿Cuál describe mejor tu situación?</label>
            <select
              name="situacion"
              value={form.situacion}
              onChange={handleInput}
              className={styles.input}
              required
            >
              <option value="">Selecciona una opción</option>
              {opcionesSituacion.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            {error && <div className={styles.error}>{error}</div>}
            
            <button 
              type="button"
              onClick={avanzarAlStep2}
              className={styles.btnPrimary}
            >
              Continuar al Quiz &rarr;
            </button>
            
            <p className={styles.avisoSmall}>
              <span role="img" aria-label="candado">🔒</span>{" "}
              Tus datos están protegidos y nunca serán compartidos
            </p>
          </section>
        ) : (
          <section>
            <h2 className={styles.titulo}>Descubre Tu Ahorro Fiscal Real</h2>
            <p className={styles.subtext}>
              Accede a nuestra calculadora exclusiva y descubre cuánto dinero puedes ahorrar optimizando tu situación fiscal.
            </p>
            <ul className={styles.beneficios}>
              <li>✔️ Análisis personalizado en menos de 2 minutos</li>
              <li>✔️ Comparación de escenarios fiscales</li>
              <li>✔️ Recomendaciones adaptadas a tu situación</li>
              <li>✔️ Herramienta 100% gratuita</li>
            </ul>
            <button
              className={styles.btnPrimary}
              type="submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Comenzar Ahora"}
            </button>
            <p className={styles.tiempo}>⏱️ Tiempo estimado: menos de 2 minutos</p>
          </section>
        )}
      </form>
    </div>
  );
}
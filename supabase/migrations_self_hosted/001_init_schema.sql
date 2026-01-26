-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id text NOT NULL PRIMARY KEY,
    email text,
    stripe_customer_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Estados USA
CREATE TABLE IF NOT EXISTS public.estados_usa (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo text NOT NULL,
    nombre text NOT NULL,
    filing_anual numeric NOT NULL,
    filing_inicial numeric,
    descripcion text,
    ventajas jsonb,
    popular boolean DEFAULT false,
    recomendado boolean DEFAULT false,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Servicios
CREATE TABLE IF NOT EXISTS public.servicios (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    nombre text NOT NULL,
    descripcion text,
    precio numeric NOT NULL,
    precio_recurrente numeric,
    frecuencia_recurrente text,
    categoria text,
    stripe_price_id text,
    stripe_price_id_recurrente text,
    requiere_llc boolean DEFAULT false,
    activo boolean DEFAULT true,
    tipo text DEFAULT 'paquete',
    flujo_onboarding jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Paquetes (Legacy/Duplicate? Included for completeness)
CREATE TABLE IF NOT EXISTS public.paquetes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    nombre text NOT NULL,
    nombre_corto text,
    precio numeric DEFAULT 0,
    precio_mensual numeric,
    descripcion text,
    descripcion_corta text,
    caracteristicas jsonb,
    destacado boolean DEFAULT false,
    orden integer DEFAULT 0,
    stripe_price_id text,
    stripe_price_id_mensual text,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 5. Pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_pedido text NOT NULL,
    user_id text NOT NULL,
    paquete_id uuid REFERENCES public.paquetes(id), -- References paquetes table for bundles
    servicio_id uuid REFERENCES public.servicios(id), -- References servicios table for individual services
    estado_usa_id uuid REFERENCES public.estados_usa(id),
    estado_pedido text DEFAULT 'borrador',
    paso_actual integer DEFAULT 1,
    nombre_empresa text,
    sector text,
    descripcion_negocio text,
    num_socios integer,
    ingresos_estimados text,
    email_empresa text,
    telefono_empresa text,
    direccion_empresa jsonb,
    notas_cliente text,
    preferencias jsonb,
    stripe_customer_id text,
    stripe_payment_intent_id text,
    stripe_session_id text,
    tipo_pago text,
    total_pagado numeric,
    fecha_pago timestamp with time zone,
    metadata jsonb,
    documentos_subidos text[],
    completado_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 6. Pedido Servicios (Relation M2M or specific items)
CREATE TABLE IF NOT EXISTS public.pedido_servicios (
    pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
    servicio_id uuid REFERENCES public.servicios(id),
    PRIMARY KEY (pedido_id, servicio_id)
);

-- 7. Suscripciones
CREATE TABLE IF NOT EXISTS public.suscripciones (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    servicio_id uuid REFERENCES public.servicios(id),
    estado text DEFAULT 'active',
    stripe_customer_id text,
    stripe_subscription_id text,
    stripe_price_id text,
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 8. Facturas
CREATE TABLE IF NOT EXISTS public.facturas (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    numero_factura text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    user_id text,
    monto numeric NOT NULL,
    moneda text DEFAULT 'USD',
    estado text DEFAULT 'pagada',
    url_pdf text,
    stripe_invoice_id text,
    items jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 9. Notificaciones
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text NOT NULL,
    pedido_id uuid REFERENCES public.pedidos(id),
    tipo text NOT NULL,
    titulo text NOT NULL,
    mensaje text NOT NULL,
    link text,
    leida boolean DEFAULT false,
    leida_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- 10. Actividad Pedidos
CREATE TABLE IF NOT EXISTS public.actividad_pedidos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id uuid REFERENCES public.pedidos(id) ON DELETE CASCADE,
    user_id text,
    tipo_evento text NOT NULL,
    descripcion text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 11. Documentos
CREATE TABLE IF NOT EXISTS public.documentos (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pedido_id uuid REFERENCES public.pedidos(id),
    user_id text NOT NULL,
    tipo text NOT NULL,
    nombre_archivo text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

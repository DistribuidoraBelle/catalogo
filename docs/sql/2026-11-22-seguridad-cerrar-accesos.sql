-- Distribuidora Belle — cierre de accesos públicos (auditoría 2026-11-22)
-- Pegar COMPLETO en Supabase → SQL Editor → Run. No borra datos: solo quita permisos que sobran.

-- 1) reservar_stock_web: función vieja, las apps ya no la llaman (solo la usa por dentro crear_pedido_web).
--    Estaba abierta a cualquiera sin login: se podía apartar stock de cualquier producto.
REVOKE ALL ON FUNCTION public.reservar_stock_web(bigint, integer, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reservar_stock_web(bigint, integer, text, text) TO service_role;

-- 2) belle_salud (monitoreo interno): sin protección, cualquiera podía leerla y escribirla.
ALTER TABLE public.belle_salud ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS staff_lee ON public.belle_salud;
CREATE POLICY staff_lee ON public.belle_salud FOR SELECT TO authenticated USING ((SELECT public.is_staff()));
REVOKE ALL ON public.belle_salud FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.belle_salud TO authenticated;

-- 3) el vigilante de salud lo corre el cron del servidor; no tiene por qué poder dispararlo cualquiera
REVOKE ALL ON FUNCTION public.belle_vigilar_salud() FROM PUBLIC, anon, authenticated;

-- 4) funciones de trigger: no se llaman a mano (los triggers disparan igual sin este permiso)
DO $do$
DECLARE f record;
BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
            WHERE n.nspname='public' AND p.prorettype='trigger'::regtype LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', f.sig);
  END LOOP;
END $do$;

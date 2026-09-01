-- =====================================================================
-- Permisos de lectura del catalogo publico
-- =====================================================================
-- Pegar tal cual en Supabase -> SQL Editor -> Run.
--
-- Por que hace falta: scriptBD.txt solo otorga permisos al rol
-- 'authenticated'. La app todavia no tiene modulo de login, asi que
-- pega contra Supabase como rol 'anon' y recibe
-- "permission denied for table categorias / rutas / ...".
-- La tabla Destinos ya estaba concedida a mano; el resto no.
--
-- Estas cinco tablas son catalogo publico de solo lectura: no guardan
-- datos de ningun usuario, asi que abrirlas a 'anon' es seguro.
-- Ninguna tiene RLS habilitado, por eso basta con el GRANT.
-- =====================================================================

GRANT SELECT ON public.categorias    TO anon, authenticated;
GRANT SELECT ON public.departamentos TO anon, authenticated;
GRANT SELECT ON public.destinos      TO anon, authenticated;
GRANT SELECT ON public.rutas         TO anon, authenticated;
GRANT SELECT ON public.ruta_destino  TO anon, authenticated;

-- Multimedia se usa en las fichas de destino cuando se conecte.
GRANT SELECT ON public.multimedia    TO anon, authenticated;

-- ---------------------------------------------------------------------
-- Comprobacion: deberia devolver 6 filas, todas con SELECT en anon.
-- ---------------------------------------------------------------------
SELECT table_name, privilege_type, grantee
FROM   information_schema.role_table_grants
WHERE  table_schema = 'public'
  AND  grantee = 'anon'
ORDER  BY table_name;

-- =====================================================================
-- NO se conceden aqui (a proposito):
--   usuarios, visitas, favoritos, calificaciones, usuario_mision,
--   evidencias, usuario_insignia
-- Esas tienen RLS y datos personales: se leen solo con sesion iniciada.
-- Por eso registrarVisita() en src/services/visitas.ts va a fallar en
-- silencio hasta que exista el modulo de login. Es lo esperado.
-- =====================================================================

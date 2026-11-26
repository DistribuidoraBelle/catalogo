-- ═══════════════════════════════════════════════════════════════════════
-- RESPALDO POR TANDAS (2026-11-26)
-- La función respaldo-diario se quedaba sin CPU a mitad de camino (18, 19, 25
-- y 26/11) y la fila quedaba colgada "en_curso". Ahora trabaja por tandas:
--   · respaldos_log.progreso  = por dónde va (tabla, fila, archivo)
--   · respaldos_log.turno     = cuántas tandas lleva (y candado: una sola a la vez)
--   · fn_respaldo_continuar   = la base vuelve a llamar a la función para seguir
--   · fn_respaldo_vigia (cron cada 5 min) = retoma el que se cortó
-- ═══════════════════════════════════════════════════════════════════════

alter table public.respaldos_log
  add column if not exists progreso jsonb,
  add column if not exists turno integer not null default 0,
  add column if not exists actualizado_at timestamptz not null default now();

create or replace function public.fn_respaldo_continuar(p_id bigint)
returns bigint
language plpgsql
security definer
set search_path to 'public', 'extensions', 'vault', 'pg_catalog'
as $$
declare
  v_secreto text;
  v_req bigint;
begin
  select decrypted_secret into v_secreto
  from vault.decrypted_secrets where name = 'belle_cron_secret';
  if v_secreto is null then
    raise exception 'falta el secreto belle_cron_secret en el Vault';
  end if;

  select net.http_post(
    url     := 'https://syylbuvjuekkanxynpps.supabase.co/functions/v1/respaldo-diario',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || v_secreto
    ),
    body    := jsonb_build_object('continuar', p_id),
    timeout_milliseconds := 180000
  ) into v_req;
  return v_req;
end;
$$;

revoke all on function public.fn_respaldo_continuar(bigint) from public, anon, authenticated;
grant execute on function public.fn_respaldo_continuar(bigint) to service_role;

-- Vigía: si un respaldo quedó "en_curso" y hace más de 4 minutos que no anota
-- avance, lo vuelve a empujar. Si ya pasaron 6 horas o 60 tandas, lo da por
-- fallido (y el chequeo diario avisa que no hay respaldo).
create or replace function public.fn_respaldo_vigia()
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'extensions', 'vault', 'pg_catalog'
as $$
declare
  r record;
  v_retomados int := 0;
  v_cerrados  int := 0;
begin
  for r in
    select id, turno, created_at, actualizado_at
    from respaldos_log
    where estado = 'en_curso'
    order by id
  loop
    if r.created_at < now() - interval '6 hours' or r.turno >= 60 then
      update respaldos_log
         set estado = 'error',
             error  = 'Se cortó a la mitad y no se pudo retomar',
             actualizado_at = now()
       where id = r.id and estado = 'en_curso';
      v_cerrados := v_cerrados + 1;
    elsif r.actualizado_at < now() - interval '4 minutes' then
      perform fn_respaldo_continuar(r.id);
      v_retomados := v_retomados + 1;
    end if;
  end loop;
  return jsonb_build_object('retomados', v_retomados, 'cerrados', v_cerrados);
end;
$$;

revoke all on function public.fn_respaldo_vigia() from public, anon, authenticated;
grant execute on function public.fn_respaldo_vigia() to service_role;

select cron.unschedule(jobid) from cron.job where jobname = 'belle-respaldo-vigia';
select cron.schedule('belle-respaldo-vigia', '*/5 * * * *', $$select public.fn_respaldo_vigia()$$);

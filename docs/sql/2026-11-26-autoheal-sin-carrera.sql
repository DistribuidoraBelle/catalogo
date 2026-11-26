-- ═══════════════════════════════════════════════════════════════════════
-- AUTOHEAL DE RESERVAS SIN CARRERA (2026-11-26)
--
-- Qué pasó el 24/11 16:45: David cobró ORD-917592 (cobro CC FIFO). Ese cobro
-- primero marca el pedido como "cobrado" y unos segundos después suelta las
-- reservas. Justo en el medio corrió el autoheal (cada 15 min, en punto): vio
-- el pedido ya cobrado con las reservas todavía puestas, las "corrigió"
-- bajándolas, y enseguida el cobro de David las bajó OTRA VEZ. Resultado:
-- reservas de otros pedidos soltadas de más; en la pasada siguiente el
-- autoheal las repuso sacando del disponible. Se perdieron del sistema 26
-- unidades (20 perfumeros de viaje + 6 perfumes).
--
-- Arreglo: el autoheal ya no corrige una diferencia la primera vez que la ve.
-- La anota (autoheal_vistos) y sólo la corrige si en la pasada siguiente
-- sigue EXACTAMENTE igual (misma reserva, mismo objetivo, 5+ minutos después).
-- Un cobro a medio hacer dura segundos: nunca llega a verse dos veces.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.autoheal_vistos (
  producto_id   bigint primary key,
  reserva_vista integer not null,
  objetivo      integer not null,
  visto_at      timestamptz not null default now()
);
alter table public.autoheal_vistos enable row level security;
revoke all on public.autoheal_vistos from anon, authenticated;

create or replace function public.belle_autoheal_reservas()
returns integer
language plpgsql
security definer
set search_path to 'priv', 'public'
as $function$
declare
  v_calc jsonb;
  v_changed integer;
begin
  -- 1) diferencias entre la reserva de cada producto y lo que piden los pedidos abiertos
  with activos as (
    select case when jsonb_typeof(items)='array' then items
                when jsonb_typeof(items)='string' then (items#>>'{}')::jsonb
                else '[]'::jsonb end as arr,
           case when items_cobrados is null then '[]'::jsonb
                when jsonb_typeof(items_cobrados)='array' then items_cobrados
                when jsonb_typeof(items_cobrados)='string' then (items_cobrados#>>'{}')::jsonb
                else '[]'::jsonb end as cob
    from pedidos_catalogo
    where estado in ('pendiente','reservado','cobrado_parcial')
  ),
  exp as (
    select it, (ord-1) as idx, cob
    from activos, jsonb_array_elements(arr) with ordinality as e(it, ord)
    where jsonb_typeof(arr)='array'
  ),
  noc as (select it from exp where not (cob @> to_jsonb(idx))),
  directos as (
    select (it->>'producto_id')::bigint pid, sum(coalesce((it->>'qty')::int,1)) q
    from noc
    where coalesce((it->>'isCombo')::boolean,false)=false
      and coalesce((it->>'isDecan')::boolean,false)=false
      and (it->>'producto_id') ~ '^[0-9]+$'
    group by 1
  ),
  combos_exp as (
    select ci.producto_id::bigint pid, sum(ci.cantidad * coalesce((it->>'qty')::int,1)) q
    from noc
    join combo_items ci
      on regexp_replace(ci.combo_id::text,'\D','','g') = regexp_replace(coalesce(it->>'combo_id', it->>'producto_id'),'\D','','g')
    where (coalesce((it->>'isCombo')::boolean,false)=true or (it->>'producto_id') ~* 'combo')
      and ci.es_decan = false
    group by 1
  ),
  target as (
    select pid, sum(q) q from (select * from directos union all select * from combos_exp) u group by pid
  )
  select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'r', p.reserva, 's', p.stock_actual, 't', coalesce(t.q,0))), '[]'::jsonb)
    into v_calc
  from productos p left join target t on t.pid = p.id
  where p.reserva <> coalesce(t.q,0);

  -- 2) corregir SÓLO las que ya se habían visto idénticas en una pasada anterior
  with firmes as (
    select c.id, c.r cur_r, c.s cur_s, c.t tgt
    from jsonb_to_recordset(v_calc) as c(id bigint, r integer, s integer, t integer)
    join autoheal_vistos v
      on v.producto_id = c.id and v.reserva_vista = c.r and v.objetivo = c.t
     and v.visto_at <= now() - interval '5 minutes'
  ),
  upd as (
    update productos p set
      reserva = case when c.tgt < c.cur_r then c.tgt
                     else c.cur_r + least(c.tgt - c.cur_r, c.cur_s) end,
      stock_actual = case when c.tgt < c.cur_r then c.cur_s
                          else c.cur_s - least(c.tgt - c.cur_r, c.cur_s) end
    from firmes c
    where p.id = c.id
      and p.reserva = c.cur_r and p.stock_actual = c.cur_s   -- si cambió recién, se deja para la próxima
    returning 1
  )
  select count(*) into v_changed from upd;

  -- 3) dejar anotado lo que se vio en ESTA pasada (lo que ya no está, se olvida)
  delete from autoheal_vistos v
   where not exists (
     select 1 from jsonb_to_recordset(v_calc) as c(id bigint, r integer, s integer, t integer)
     where c.id = v.producto_id and c.r = v.reserva_vista and c.t = v.objetivo
   );
  insert into autoheal_vistos (producto_id, reserva_vista, objetivo)
  select c.id, c.r, c.t
  from jsonb_to_recordset(v_calc) as c(id bigint, r integer, s integer, t integer)
  on conflict (producto_id) do nothing;

  return v_changed;
end;
$function$;

revoke all on function public.belle_autoheal_reservas() from public, anon, authenticated;

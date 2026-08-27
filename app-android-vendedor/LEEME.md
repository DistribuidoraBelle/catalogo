# Belle Vendedor — APK para el celular

App Android del **vendedor**. Abre **directo en el modo app** (la interfaz de celular):
nunca se ve la vista de escritorio.

## Qué la hace distinta de Belle Admin
| | Belle Admin | Belle Vendedor |
|---|---|---|
| Paquete | `com.distribuidorabelle.admin` | `com.distribuidorabelle.vendedor` |
| Abre | `belle.html` (panel) | `ventas.html?app=1` (**modo app directo**) |
| Links que captura | todo `distribuidorabelle.com` | solo `/ventas.html` |

Las dos se pueden tener instaladas a la vez: son apps distintas y no se pisan.

## Cómo armar el APK
En GitHub → pestaña **Actions** → **"Armar APK - Belle Vendedor"** → botón **Run workflow**.
A los ~4 minutos queda para bajar abajo de todo, en **Artifacts → BelleVendedor-apk**.

## Notificaciones
Funcionan igual que en el admin:
1. Instalar el APK y abrirlo.
2. Aceptar el cartel de Android que pide permiso de notificaciones (lo pide `LauncherActivity`).
3. Dentro de la app, tocar **"Activar notificaciones"** en la pantalla principal.

Si el celular es Android 13+ y no aparece el cartel, revisar
Ajustes → Apps → Belle Vendedor → Notificaciones.

## Firma
Usa **la misma llave** que Belle Admin (secreto `ANDROID_KEYSTORE_B64`), por eso
`/.well-known/assetlinks.json` lleva las dos apps con la misma huella. Eso es lo
que evita que Android muestre la barra con la dirección arriba.

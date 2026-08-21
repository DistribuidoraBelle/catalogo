# App de Belle Admin (APK)

Esta carpeta arma la aplicación de Android del panel de administración.

## Qué es por dentro

Es una **Trusted Web Activity**: abre `https://distribuidorabelle.com/belle.html`
a pantalla completa usando el motor de Chrome que ya está en el teléfono, pero
**sin nada del navegador a la vista** — ni barra de direcciones, ni pestañas, ni
menú. Tiene su propio ícono y su propio nombre.

La gran ventaja de este camino: todo lo que hoy funciona en el navegador sigue
funcionando igual, sin reprogramar nada. Las notificaciones, subir el PDF o la
foto de las listas del Ayudante de Compras, bajar reportes, la cámara.

## Cómo se arma el APK

No hace falta instalar nada en la computadora. Se compila solo en GitHub:

1. Entrar al repositorio en GitHub → pestaña **Actions**.
2. Elegir **Armar APK - Belle Admin** → botón **Run workflow**.
3. Esperar unos 4 minutos.
4. Abajo de todo, en **Artifacts**, descargar `BelleAdmin-apk`.

Adentro está `BelleAdmin.apk`. Se pasa al teléfono (WhatsApp, cable, Drive) y se
instala. La primera vez Android va a pedir permiso para "instalar apps de esta
fuente" — es normal en apps que no vienen de Play Store.

## La llave de firma

El APK va firmado con una llave propia. **Esa llave no está en este repositorio
porque es público**: vive en `C:\Belle\app-firma\belle-admin.p12` y en GitHub
como el secreto `ANDROID_KEYSTORE_B64`.

Hay que guardarla. Si se pierde, las versiones nuevas de la app ya no se pueden
instalar encima de la vieja: Android las toma como dos apps distintas y hay que
desinstalar a mano en cada teléfono.

La huella de esa llave está publicada en `/.well-known/assetlinks.json` del
sitio. Es lo que le confirma a Android que la app y el sitio son de los mismos
dueños; **si eso no coincide, aparece la barra con la dirección arriba de todo**.

## Si algún día cambia algo

- **Otra dirección de arranque**: `app/src/main/res/values/strings.xml`, en
  `launch_url`.
- **Otro nombre de la app**: mismo archivo, en `app_name`.
- **Otros colores**: `app/src/main/res/values/colors.xml` (hoy están los del
  tema Aurora del panel).
- **Otro ícono**: reemplazar los `ic_launcher.png` de las carpetas `mipmap-*`.
- **Versión nueva**: subir `versionCode` y `versionName` en `app/build.gradle`.
  Si no se sube el `versionCode`, Android no deja instalar encima.

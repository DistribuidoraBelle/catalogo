package com.distribuidorabelle.vendedor;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

/**
 * Pantalla de arranque de Belle Admin.
 *
 * Existe por una sola razón: en Android 13 (API 33) y superiores, una app no
 * puede mostrar NINGUNA notificación hasta que el usuario le da permiso, y ese
 * permiso hay que PEDIRLO expresamente. La LauncherActivity que trae
 * androidbrowserhelper no lo pide (verificado en su código fuente), y declarar
 * el permiso en el AndroidManifest tampoco alcanza: solo lo habilita, no lo
 * solicita.
 *
 * Sin esto pasaba lo siguiente: el panel decía "notificaciones activadas"
 * —porque el permiso del NAVEGADOR sí estaba dado, que es otra cosa— y Android
 * descartaba en silencio todo lo que mandaba el sitio.
 *
 * Se usan las APIs del propio Android (disponibles desde API 23, y minSdk es
 * 23) para no sumar dependencias.
 */
public class LauncherActivity
        extends com.google.androidbrowserhelper.trusted.LauncherActivity {

    private static final int RC_NOTIFICACIONES = 4711;

    /**
     * Si hay que pedir el permiso, NO abrimos el sitio todavía: primero se
     * responde el cartel del sistema y después llamamos a launchTwa().
     * Si el permiso ya está dado (o el teléfono es anterior a Android 13),
     * arranca de una como siempre.
     */
    @Override
    protected boolean shouldLaunchImmediately() {
        return !hayQuePedirNotificaciones();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (hayQuePedirNotificaciones()) {
            requestPermissions(
                    new String[]{ Manifest.permission.POST_NOTIFICATIONS },
                    RC_NOTIFICACIONES);
        }
    }

    private boolean hayQuePedirNotificaciones() {
        // Antes de Android 13 no existe este permiso: las notificaciones van solas.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return false;
        return checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED;
    }

    /**
     * Haya dicho que sí o que no, la app tiene que abrir igual: si dijo que no,
     * el panel funciona, lo único que no va a recibir son los avisos.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String[] permissions,
                                           int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == RC_NOTIFICACIONES) {
            launchTwa();
        }
    }
}

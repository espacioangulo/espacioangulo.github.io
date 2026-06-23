# Espacio Ángulo — web estática

Web preparada para GitHub Pages.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta al repositorio.
2. En GitHub: `Settings > Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main` y carpeta `/root`.
5. Guarda y espera a que GitHub publique la URL.

## Configurar formulario y pago

Edita:

```js
assets/js/config.js
```

Ahí están:

```js
formEndpoint: "..."
stripePaymentLink: "..."
sessionPrice: "60 €"
agendaPath: "data/agenda.json"
```

La web comprueba si una fecha/hora está ocupada leyendo `data/agenda.json`.

## Agenda pública

Edita o genera desde el admin local:

```txt
data/agenda.json
```

Formato:

```json
{
  "ocupados": [
    "2026-06-25T16:00",
    "2026-06-27T12:00"
  ],
  "etiquetas": [
    "traer el bucle",
    "ordenar una decisión"
  ]
}
```

No guardes nombres, emails ni notas en `agenda.json`, porque es público.

## Etiquetas

La barra de etiquetas:

- se puede scrollear manualmente;
- se mueve sola lentamente;
- mezcla el orden de etiquetas en cada carga;
- lee las etiquetas desde `data/agenda.json`.

En el admin local puedes escribirlas así:

```txt
traer el bucle..ordenar una decisión..afinar la sensibilidad
```

Los dos puntos horizontales `..` separan etiquetas.

## Admin local privado

Dentro de:

```txt
LOCAL_ADMIN_NO_SUBIR/
```

hay una herramienta local para Windows:

- `abrir_admin.bat`: abre el programa en Python.
- `crear_exe.bat`: genera `EspacioAnguloAdmin.exe` con PyInstaller.
- `espacio_angulo_admin.py`: programa principal.

El admin guarda datos privados en:

```txt
LOCAL_ADMIN_NO_SUBIR/espacio_angulo_local.db
```

Ese archivo es local. No se sube a GitHub.

El admin permite:

- crear fichas privadas de personas;
- guardar email, datos importantes y resumen por sesión;
- ver agenda privada diaria con nombres;
- bloquear/liberar horas públicas en `data/agenda.json`;
- editar etiquetas públicas;
- subir solo `data/agenda.json` al repositorio usando token de GitHub.

## Legal

Los textos legales están integrados en ventanas modales de `index.html` y también en páginas HTML separadas. Son orientativos. Revísalos con gestor o asesor antes de cobrar de forma habitual.

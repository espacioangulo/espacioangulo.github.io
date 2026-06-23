# Espacio Ángulo — web estática

Web preparada para GitHub Pages.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta al repositorio.
2. En GitHub: `Settings > Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main` y carpeta `/root`.
5. Guarda y espera a que GitHub publique la URL.

## Configurar formulario

1. Crea cuenta en Formspree.
2. Crea un formulario nuevo.
3. Copia el endpoint tipo `https://formspree.io/f/abcdwxyz`.
4. Pégalo en:

```js
assets/js/config.js
formEndpoint: "https://formspree.io/f/abcdwxyz"
```

Formspree recibe los datos del formulario y los envía al email configurado en tu cuenta.

## Configurar pago

1. Crea cuenta en Stripe.
2. Crea un producto: `Encuentro online · Espacio Ángulo`.
3. Precio: `60 €`.
4. Crea un `Payment Link`.
5. Copia el enlace y pégalo en:

```js
assets/js/config.js
stripePaymentLink: "https://buy.stripe.com/..."
```

La web añade automáticamente un código de solicitud al enlace de Stripe usando `client_reference_id`, para cruzar el pago con el formulario.

## Agenda pública

Edita:

```txt
data/agenda.json
```

Ejemplo:

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

## Legal

Los textos legales están integrados como ventanas modales en `index.html`. Revísalos con gestor cuando vayas a cobrar de forma habitual.

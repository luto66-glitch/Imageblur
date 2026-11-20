# Studio AI - Generador de Imágenes PWA

Progressive Web App (PWA) minimalista diseñada para conectarse a un endpoint o backend de generación de imágenes con IA (ComfyUI, Automatic1111, o API personalizada).

## Estructura del proyecto

- `index.html`: Interfaz principal y formulario de generación.
- `style.css`: Estilos responsivos en modo oscuro.
- `app.js`: Lógica de registro del Service Worker, instalación PWA y consumo del endpoint.
- `manifest.json`: Configuración de instalación como aplicación nativa.
- `sw.js`: Service Worker para caché de archivos estáticos.
- `icons/`: Íconos PNG (`192x192` y `512x512`) requeridos por los navegadores.

## Despliegue en GitHub Pages

1. Sube todos los archivos a la raíz de tu repositorio en GitHub.
2. Ve a **Settings > Pages**.
3. En **Source**, selecciona `Deploy from a branch` y elige la rama `main` (carpeta `/ (root)`).
4. GitHub publicará la PWA automáticamente bajo HTTPS.

## Formato esperado del Backend

El frontend envía una petición `POST` con JSON:

```json
{
  "prompt": "descripción de la imagen",
  "negative_prompt": "elementos a evitar",
  "width": 1024,
  "height": 1024,
  "steps": 25
}
```

Y espera una respuesta JSON con `image_base64` o `image_url`:

```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

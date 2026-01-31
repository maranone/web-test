# Web del Gimnasio — Manual de uso

Esta es la web de tu gimnasio. Todo el contenido se modifica editando archivos simples en la carpeta `contenido/`. **No necesitas saber programación.**

---

## Estructura de la carpeta `contenido/`

| Archivo | Qué controla |
|---------|-------------|
| `config.txt` | Nombre, colores, teléfono, email, redes sociales, mapa |
| `sobre-nosotros.txt` | Sección "Quiénes Somos" |
| `ubicacion.txt` | Sección "Dónde Estamos" |
| `contacto.txt` | Sección "Contacto" |
| `tarifas.csv` | Tabla de precios |
| `fotos/` | Carpeta de imágenes de la galería |

---

## Cómo editar un archivo de texto

1. Entra en tu repositorio en GitHub
2. Navega a la carpeta `contenido/`
3. Haz clic en el archivo que quieres editar (por ejemplo `sobre-nosotros.txt`)
4. Haz clic en el icono del lápiz (editar) arriba a la derecha
5. Modifica el texto
6. Haz clic en **"Commit changes"** (botón verde)
7. Los cambios se verán en la web en unos segundos

### Formato de los archivos `.txt`

- La **primera línea** es el título de la sección
- Las demás líneas son el contenido
- Deja una **línea en blanco** para separar párrafos

Ejemplo:
```
Quiénes Somos

Somos un gimnasio familiar fundado en 2010...

Contamos con las mejores instalaciones...
```

---

## Cómo editar las tarifas

El archivo `tarifas.csv` tiene este formato:

```
concepto;descripcion;precio
Cuota mensual;Acceso ilimitado;35,00 €/mes
```

- Las columnas se separan con **punto y coma** (`;`)
- La primera línea son los nombres de las columnas (no borrar)
- Cada línea siguiente es una tarifa
- Se pueden usar comas en los precios (35,00 €)

---

## Cómo cambiar colores, nombre y datos de contacto

Edita el archivo `contenido/config.txt`. Cada línea tiene el formato `clave = valor`:

| Clave | Para qué sirve | Ejemplo |
|-------|----------------|---------|
| `nombre_negocio` | Nombre que aparece en la cabecera y pestaña | `Gimnasio Fuerza Total` |
| `subtitulo` | Texto debajo del nombre | `Tu espacio para entrenar` |
| `color_principal` | Color de títulos y acentos | `#1B5E20` |
| `color_secundario` | Color de precios y detalles | `#FF6F00` |
| `color_fondo` | Color de fondo de la página | `#FAFAFA` |
| `color_texto` | Color del texto general | `#333333` |
| `color_cabecera` | Color de la barra de navegación y cabecera | `#0D3B0E` |
| `color_pie` | Color del pie de página | `#0D3B0E` |
| `telefono` | Teléfono de contacto | `+34 600 123 456` |
| `email` | Email de contacto | `info@tugimnasio.com` |
| `facebook` | Enlace a tu página de Facebook | `https://facebook.com/tugimnasio` |
| `instagram` | Enlace a tu perfil de Instagram | `https://instagram.com/tugimnasio` |
| `mapa_url` | URL del mapa de Google Maps | (ver instrucciones abajo) |

Las líneas que empiezan con `#` son comentarios y se ignoran.

---

## Cómo obtener la URL de Google Maps

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca la dirección de tu gimnasio
3. Haz clic en **"Compartir"**
4. Selecciona la pestaña **"Incorporar mapa"**
5. Copia el código HTML que aparece
6. Del código copiado, busca la parte que dice `src="..."` y copia **solo la URL** (lo que hay entre las comillas)
7. Pega esa URL como valor de `mapa_url` en `config.txt`

---

## Cómo subir fotos a la galería

1. Ve a la carpeta `contenido/fotos/` en tu repositorio
2. Haz clic en **"Add file" → "Upload files"**
3. Arrastra las fotos o haz clic para seleccionarlas
4. Haz clic en **"Commit changes"**
5. GitHub generará automáticamente el listado de fotos (espera 1-2 minutos)

**Formatos admitidos:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### Cómo quitar una foto

1. Ve a `contenido/fotos/`
2. Haz clic en la foto que quieres eliminar
3. Haz clic en el icono de la papelera (borrar)
4. Confirma con **"Commit changes"**

---

## Preguntas frecuentes

### ¿Cuánto tardan en verse los cambios?
Los cambios en textos y tarifas se ven inmediatamente al recargar la página. Los cambios en fotos tardan 1-2 minutos porque GitHub necesita actualizar el listado.

### ¿Puedo romper la web?
Es muy difícil. Los archivos de contenido son texto plano. Si algo sale mal, la sección afectada mostrará "Contenido no disponible" y el resto seguirá funcionando.

### ¿Cómo elijo colores?
Puedes usar una web como [HTML Color Picker](https://www.w3schools.com/colors/colors_picker.asp) para elegir colores. Copia el código que empieza con `#` (por ejemplo `#1B5E20`).

### ¿Qué archivos NO debo tocar?
- `index.html`
- `css/estilos.css`
- `js/app.js`
- `.github/workflows/generar-fotos.yml`
- `contenido/fotos/manifest.json` (se genera automáticamente)

Solo edita los archivos dentro de `contenido/` (excepto `manifest.json`).

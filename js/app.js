/* ═══════════════════════════════════════════
   APP.JS — Lógica de carga y renderizado
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    var config = {};
    var fotosList = [];
    var fotoActual = 0;

    // ───── Utilidades ─────

    function parsearConfig(texto) {
        var resultado = {};
        texto.split('\n').forEach(function (linea) {
            linea = linea.trim();
            if (!linea || linea.charAt(0) === '#') return;
            var idx = linea.indexOf('=');
            if (idx === -1) return;
            var clave = linea.substring(0, idx).trim();
            var valor = linea.substring(idx + 1).trim();
            resultado[clave] = valor;
        });
        return resultado;
    }

    function parsearTxt(texto) {
        var lineas = texto.split('\n');
        var titulo = lineas[0].trim();
        var parrafos = [];
        var buffer = [];

        for (var i = 1; i < lineas.length; i++) {
            var linea = lineas[i].trim();
            if (linea === '') {
                if (buffer.length > 0) {
                    parrafos.push(buffer.join(' '));
                    buffer = [];
                }
            } else {
                buffer.push(linea);
            }
        }
        if (buffer.length > 0) {
            parrafos.push(buffer.join(' '));
        }
        return { titulo: titulo, parrafos: parrafos };
    }

    function parsearCSV(texto) {
        var lineas = texto.trim().split('\n');
        if (lineas.length < 2) return { cabecera: [], filas: [] };
        var cabecera = lineas[0].split(';').map(function (c) { return c.trim(); });
        var filas = [];
        for (var i = 1; i < lineas.length; i++) {
            var l = lineas[i].trim();
            if (!l) continue;
            filas.push(l.split(';').map(function (c) { return c.trim(); }));
        }
        return { cabecera: cabecera, filas: filas };
    }

    function escaparHTML(texto) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(texto));
        return div.innerHTML;
    }

    function cargarArchivo(ruta) {
        return fetch(ruta).then(function (r) {
            if (!r.ok) throw new Error('No se pudo cargar: ' + ruta);
            return r.text();
        });
    }

    function cargarJSON(ruta) {
        return fetch(ruta).then(function (r) {
            if (!r.ok) throw new Error('No se pudo cargar: ' + ruta);
            return r.json();
        });
    }

    // ───── Aplicar configuración ─────

    function aplicarConfig(cfg) {
        config = cfg;
        var root = document.documentElement;

        if (cfg.color_principal) root.style.setProperty('--color-principal', cfg.color_principal);
        if (cfg.color_secundario) root.style.setProperty('--color-secundario', cfg.color_secundario);
        if (cfg.color_fondo) root.style.setProperty('--color-fondo', cfg.color_fondo);
        if (cfg.color_texto) root.style.setProperty('--color-texto', cfg.color_texto);
        if (cfg.color_cabecera) root.style.setProperty('--color-cabecera', cfg.color_cabecera);
        if (cfg.color_pie) root.style.setProperty('--color-pie', cfg.color_pie);

        var nombre = cfg.nombre_negocio || 'Gimnasio';
        document.title = nombre;
        document.getElementById('hero-titulo').textContent = nombre;
        document.getElementById('nav-logo').textContent = nombre;
        document.getElementById('hero-subtitulo').textContent = cfg.subtitulo || '';
        document.getElementById('pie-texto').innerHTML =
            '&copy; ' + new Date().getFullYear() + ' ' + escaparHTML(nombre) + '. Todos los derechos reservados.';

        if (cfg.efecto_fondo === 'gradiente') {
            document.querySelector('.hero').classList.add('gradiente-animado');
        }

        // Redes sociales en el pie
        var redes = document.getElementById('pie-redes');
        redes.innerHTML = '';
        if (cfg.facebook) {
            redes.innerHTML += '<a href="' + escaparHTML(cfg.facebook) + '" target="_blank" rel="noopener">Facebook</a>';
        }
        if (cfg.instagram) {
            redes.innerHTML += '<a href="' + escaparHTML(cfg.instagram) + '" target="_blank" rel="noopener">Instagram</a>';
        }

        // Mapa
        if (cfg.mapa_url) {
            document.getElementById('mapa-iframe').src = cfg.mapa_url;
        }
    }

    // ───── Renderizar secciones ─────

    function renderizarTxt(idTitulo, idContenido, datos) {
        document.getElementById(idTitulo).textContent = datos.titulo;
        var html = datos.parrafos.map(function (p) {
            return '<p>' + escaparHTML(p) + '</p>';
        }).join('');
        document.getElementById(idContenido).innerHTML = html || '<p></p>';
    }

    function renderizarTarifas(datos) {
        var contenedor = document.getElementById('tarifas-contenido');
        if (datos.filas.length === 0) {
            contenedor.innerHTML = '<p class="error-contenido">No hay tarifas disponibles.</p>';
            return;
        }

        // Tabla para escritorio
        var tabla = '<table class="tarifas-tabla"><thead><tr>';
        datos.cabecera.forEach(function (c) {
            tabla += '<th>' + escaparHTML(c) + '</th>';
        });
        tabla += '</tr></thead><tbody>';
        datos.filas.forEach(function (fila) {
            tabla += '<tr>';
            fila.forEach(function (celda, idx) {
                var clase = idx === fila.length - 1 ? ' class="precio"' : '';
                tabla += '<td' + clase + '>' + escaparHTML(celda) + '</td>';
            });
            tabla += '</tr>';
        });
        tabla += '</tbody></table>';

        // Cards para móvil
        var cards = '<div class="tarifas-cards">';
        datos.filas.forEach(function (fila) {
            cards += '<div class="tarifa-card">';
            cards += '<h3>' + escaparHTML(fila[0] || '') + '</h3>';
            if (fila[1]) cards += '<p>' + escaparHTML(fila[1]) + '</p>';
            if (fila[2]) cards += '<div class="precio">' + escaparHTML(fila[2]) + '</div>';
            cards += '</div>';
        });
        cards += '</div>';

        contenedor.innerHTML = tabla + cards;
    }

    function renderizarGaleria(fotos) {
        var grid = document.getElementById('galeria-grid');
        if (!fotos || fotos.length === 0) {
            return;
        }

        fotosList = fotos;
        var html = '';
        fotos.forEach(function (foto, idx) {
            var src = 'contenido/fotos/' + foto;
            html += '<img src="' + src + '" alt="Foto del gimnasio" loading="lazy" data-idx="' + idx + '">';
        });
        grid.innerHTML = html;

        // Click en fotos para abrir lightbox
        grid.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('click', function () {
                abrirLightbox(parseInt(this.getAttribute('data-idx'), 10));
            });
        });
    }

    function renderizarContacto() {
        var datos = document.getElementById('contacto-datos');
        var html = '';

        if (config.telefono) {
            html += '<div class="contacto-dato">';
            html += '<span class="icono">&#128222;</span>';
            html += '<div class="info"><a href="tel:' + escaparHTML(config.telefono) + '">' + escaparHTML(config.telefono) + '</a></div>';
            html += '</div>';
        }
        if (config.email) {
            html += '<div class="contacto-dato">';
            html += '<span class="icono">&#9993;</span>';
            html += '<div class="info"><a href="mailto:' + escaparHTML(config.email) + '">' + escaparHTML(config.email) + '</a></div>';
            html += '</div>';
        }
        if (config.facebook) {
            html += '<div class="contacto-dato">';
            html += '<span class="icono">&#127760;</span>';
            html += '<div class="info"><a href="' + escaparHTML(config.facebook) + '" target="_blank" rel="noopener">Facebook</a></div>';
            html += '</div>';
        }
        if (config.instagram) {
            html += '<div class="contacto-dato">';
            html += '<span class="icono">&#128247;</span>';
            html += '<div class="info"><a href="' + escaparHTML(config.instagram) + '" target="_blank" rel="noopener">Instagram</a></div>';
            html += '</div>';
        }

        datos.innerHTML = html;
    }

    // ───── Lightbox ─────

    function abrirLightbox(idx) {
        fotoActual = idx;
        var lightbox = document.getElementById('lightbox');
        document.getElementById('lightbox-img').src = 'contenido/fotos/' + fotosList[idx];
        lightbox.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarLightbox() {
        document.getElementById('lightbox').classList.remove('activo');
        document.body.style.overflow = '';
    }

    function lightboxAnterior() {
        if (fotosList.length === 0) return;
        fotoActual = (fotoActual - 1 + fotosList.length) % fotosList.length;
        document.getElementById('lightbox-img').src = 'contenido/fotos/' + fotosList[fotoActual];
    }

    function lightboxSiguiente() {
        if (fotosList.length === 0) return;
        fotoActual = (fotoActual + 1) % fotosList.length;
        document.getElementById('lightbox-img').src = 'contenido/fotos/' + fotosList[fotoActual];
    }

    function inicializarLightbox() {
        document.getElementById('lightbox-cerrar').addEventListener('click', cerrarLightbox);
        document.getElementById('lightbox-anterior').addEventListener('click', lightboxAnterior);
        document.getElementById('lightbox-siguiente').addEventListener('click', lightboxSiguiente);

        document.getElementById('lightbox').addEventListener('click', function (e) {
            if (e.target === this) cerrarLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!document.getElementById('lightbox').classList.contains('activo')) return;
            if (e.key === 'Escape') cerrarLightbox();
            if (e.key === 'ArrowLeft') lightboxAnterior();
            if (e.key === 'ArrowRight') lightboxSiguiente();
        });

        // Swipe táctil
        var lightboxEl = document.getElementById('lightbox');
        var touchStartX = 0;
        lightboxEl.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        lightboxEl.addEventListener('touchend', function (e) {
            var diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) lightboxAnterior();
                else lightboxSiguiente();
            }
        }, { passive: true });
    }

    // ───── Menú móvil ─────

    function inicializarMenu() {
        var btn = document.getElementById('btn-menu');
        var enlaces = document.getElementById('nav-enlaces');

        btn.addEventListener('click', function () {
            btn.classList.toggle('activo');
            enlaces.classList.toggle('activo');
        });

        // Cerrar al hacer click en un enlace
        enlaces.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                btn.classList.remove('activo');
                enlaces.classList.remove('activo');
            });
        });
    }

    // ───── Error handler ─────

    function mostrarError(idContenido, mensaje) {
        var el = document.getElementById(idContenido);
        if (el) {
            el.innerHTML = '<p class="error-contenido">' + escaparHTML(mensaje || 'Contenido no disponible') + '</p>';
        }
    }

    // ───── Inicio ─────

    function init() {
        inicializarMenu();
        inicializarLightbox();

        // Cargar config primero, luego el resto en paralelo
        cargarArchivo('contenido/config.txt')
            .then(function (texto) {
                aplicarConfig(parsearConfig(texto));
            })
            .catch(function () {
                console.warn('No se pudo cargar config.txt, usando valores por defecto.');
            })
            .then(function () {
                // Cargar contenidos en paralelo
                var promesas = [
                    cargarArchivo('contenido/sobre-nosotros.txt')
                        .then(function (t) { renderizarTxt('sobre-nosotros-titulo', 'sobre-nosotros-contenido', parsearTxt(t)); })
                        .catch(function () { mostrarError('sobre-nosotros-contenido', 'Contenido no disponible'); }),

                    cargarArchivo('contenido/ubicacion.txt')
                        .then(function (t) { renderizarTxt('ubicacion-titulo', 'ubicacion-contenido', parsearTxt(t)); })
                        .catch(function () { mostrarError('ubicacion-contenido', 'Contenido no disponible'); }),

                    cargarArchivo('contenido/contacto.txt')
                        .then(function (t) {
                            renderizarTxt('contacto-titulo', 'contacto-contenido', parsearTxt(t));
                            renderizarContacto();
                        })
                        .catch(function () { mostrarError('contacto-contenido', 'Contenido no disponible'); }),

                    cargarArchivo('contenido/tarifas.csv')
                        .then(function (t) { renderizarTarifas(parsearCSV(t)); })
                        .catch(function () { mostrarError('tarifas-contenido', 'Tarifas no disponibles'); }),

                    cargarJSON('contenido/fotos/manifest.json')
                        .then(function (fotos) { renderizarGaleria(fotos); })
                        .catch(function () { /* Galería vacía, no hacer nada */ })
                ];

                return Promise.all(promesas);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

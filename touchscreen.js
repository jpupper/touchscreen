// touch.js - Script para controlar el comportamiento táctil y de zoom
// Autor: Cascade
// Fecha: 2025-06-29

/**
 * Este script:
 * 1. Previene gestos multitáctiles (como pellizcar para hacer zoom)
 * 2. Agrega dinámicamente una meta etiqueta para deshabilitar el escalado del usuario
 * 3. Aplica estilos CSS para manipular el comportamiento táctil
 * 4. Permite activar/desactivar estas restricciones mediante un parámetro en la URL
 * 5. Muestra un botón de pantalla completa en la esquina superior derecha
 * 6. Previene menús desplegables y selección de texto en dispositivos táctiles
 * 7. Propaga automáticamente el parámetro touch=true a otros enlaces HTML
 */

;(() => {
    // Función para verificar si debemos aplicar las restricciones táctiles
    function shouldApplyTouchRestrictions() {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get("touch") === "true" || urlParams.get("touchversion") === "true"
    }
  
    // Función para agregar touch=true a una URL
    function addTouchParam(url) {
      try {
        // Si es una URL relativa, crear URL completa
        const fullUrl = new URL(url, window.location.origin)
  
        // Verificar si ya tiene el parámetro touch
        if (!fullUrl.searchParams.has("touch")) {
          fullUrl.searchParams.set("touch", "true")
        }
  
        // Si la URL original era relativa, devolver solo la parte relativa
        if (!url.startsWith("http") && !url.startsWith("//")) {
          return fullUrl.pathname + fullUrl.search + fullUrl.hash
        }
  
        return fullUrl.toString()
      } catch (e) {
        // Si hay error parseando la URL, intentar agregar manualmente
        const separator = url.includes("?") ? "&" : "?"
        if (!url.includes("touch=true")) {
          return url + separator + "touch=true"
        }
        return url
      }
    }
  
    // Función para verificar si una URL apunta a un archivo HTML
    function isHtmlLink(url) {
      try {
        const urlObj = new URL(url, window.location.origin)
        const pathname = urlObj.pathname.toLowerCase()
  
        // Verificar si es un archivo HTML o una ruta sin extensión (asumimos HTML)
        return (
          pathname.endsWith(".html") ||
          pathname.endsWith(".htm") ||
          (!pathname.includes(".") && pathname !== "/") ||
          pathname === "/" ||
          pathname.endsWith("/")
        )
      } catch (e) {
        return false
      }
    }
  
    // Función para interceptar clicks en enlaces
    function interceptLinks() {
      document.addEventListener(
        "click",
        (e) => {
          const link = e.target.closest("a")
  
          if (link && link.href) {
            // Verificar si es un enlace HTML
            if (isHtmlLink(link.href)) {
              // Verificar que no sea un enlace externo a menos que sea del mismo dominio
              try {
                const linkUrl = new URL(link.href)
                const currentUrl = new URL(window.location.href)
  
                // Solo modificar enlaces del mismo dominio o enlaces relativos
                if (linkUrl.hostname === currentUrl.hostname || !link.href.startsWith("http")) {
                  const newHref = addTouchParam(link.href)
                  link.href = newHref
                }
              } catch (e) {
                // Para enlaces relativos que no se pueden parsear como URL completa
                const newHref = addTouchParam(link.href)
                link.href = newHref
              }
            }
          }
        },
        true,
      ) // Usar capture para interceptar antes que otros handlers
  
      // También interceptar formularios
      document.addEventListener(
        "submit",
        (e) => {
          const form = e.target
  
          if (form && form.action) {
            // Verificar si el action apunta a HTML
            if (isHtmlLink(form.action)) {
              try {
                const actionUrl = new URL(form.action, window.location.origin)
                const currentUrl = new URL(window.location.href)
  
                // Solo modificar actions del mismo dominio
                if (actionUrl.hostname === currentUrl.hostname) {
                  const newAction = addTouchParam(form.action)
                  form.action = newAction
                }
              } catch (e) {
                // Para actions relativos
                const newAction = addTouchParam(form.action)
                form.action = newAction
              }
            }
          }
        },
        true,
      )
    }
  
    // Solo aplicamos las restricciones si la URL tiene el parámetro touch=true
    if (shouldApplyTouchRestrictions()) {
      // Interceptar enlaces para propagar touch=true
      interceptLinks()
  
      // Crear el botón de pantalla completa
      const fullscreenBtn = document.createElement("button")
      fullscreenBtn.id = "fullscreenBtn"
      fullscreenBtn.textContent = "Pantalla Completa"
      fullscreenBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        color: #333;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        white-space: nowrap;
      `
  
      // Agregar efectos hover/active
      fullscreenBtn.addEventListener("mouseenter", () => {
        fullscreenBtn.style.background = "rgba(255, 255, 255, 1)"
        fullscreenBtn.style.transform = "scale(1.05)"
      })
  
      fullscreenBtn.addEventListener("mouseleave", () => {
        fullscreenBtn.style.background = "rgba(255, 255, 255, 0.95)"
        fullscreenBtn.style.transform = "scale(1)"
      })
  
      fullscreenBtn.addEventListener("mousedown", () => {
        fullscreenBtn.style.transform = "scale(0.95)"
      })
  
      fullscreenBtn.addEventListener("mouseup", () => {
        fullscreenBtn.style.transform = "scale(1.05)"
      })
  
      // Función para manejar el cambio de estado de pantalla completa
      function handleFullscreenChange() {
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          fullscreenBtn.style.display = "none"
        } else {
          fullscreenBtn.style.display = "block"
        }
      }
  
      // Agregar evento click al botón
      fullscreenBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
  
        if (
          !document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.mozFullScreenElement &&
          !document.msFullscreenElement
        ) {
          const element = document.documentElement
  
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen()
          }
        }
      })
  
      // Escuchar cambios en el estado de pantalla completa (múltiples eventos para compatibilidad)
      document.addEventListener("fullscreenchange", handleFullscreenChange)
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.addEventListener("mozfullscreenchange", handleFullscreenChange)
      document.addEventListener("MSFullscreenChange", handleFullscreenChange)
  
      // Agregar el botón al body cuando el DOM esté listo
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.appendChild(fullscreenBtn)
        })
      } else {
        document.body.appendChild(fullscreenBtn)
      }
  
      // 1. Prevenir todos los gestos táctiles no deseados y menús desplegables
      document.addEventListener(
        "touchstart",
        (e) => {
          // Prevenir gestos multitáctiles
          if (e.touches.length > 1) {
            e.preventDefault()
            e.stopPropagation()
          }
  
          // Prevenir menús desplegables en elementos específicos
          const target = e.target
          if (target.tagName === "SELECT" || target.closest("select")) {
            e.preventDefault()
            e.stopPropagation()
          }
        },
        { passive: false, capture: true },
      )
  
      document.addEventListener(
        "touchmove",
        (e) => {
          // Solo prevenir si hay múltiples toques (gestos de zoom/pellizco)
          if (e.touches.length > 1) {
            e.preventDefault()
            e.stopPropagation()
          }
          // Permitir scroll normal con un solo dedo
        },
        { passive: false, capture: true },
      )
  
      document.addEventListener(
        "touchend",
        (e) => {
          // Prevenir acciones al finalizar el toque
          if (e.changedTouches.length > 1) {
            e.preventDefault()
            e.stopPropagation()
          }
        },
        { passive: false, capture: true },
      )
  
      // Prevenir gestos de zoom específicos
      document.addEventListener(
        "gesturestart",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false },
      )
  
      document.addEventListener(
        "gesturechange",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false },
      )
  
      document.addEventListener(
        "gestureend",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false },
      )
  
      // 2. Agregar meta etiqueta para deshabilitar el escalado del usuario
      const metaViewport = document.createElement("meta")
      metaViewport.name = "viewport"
      metaViewport.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no"
  
      const existingMeta = document.querySelector('meta[name="viewport"]')
      if (existingMeta) {
        existingMeta.parentNode.replaceChild(metaViewport, existingMeta)
      } else {
        document.head.appendChild(metaViewport)
      }
  
      // 3. Aplicar estilos CSS para prevenir selección de texto y otros comportamientos
      const touchStyles = document.createElement("style")
      touchStyles.textContent = `
    * {
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      -khtml-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-tap-highlight-color: transparent !important;
      -webkit-appearance: none !important;
    }
    
    html {
      touch-action: pan-y !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    
    body {
      overscroll-behavior-x: none !important;
      -webkit-overflow-scrolling: touch !important;
    }
    
    /* Prevenir menús desplegables específicos */
    select, option {
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      pointer-events: none !important;
    }
    
    /* Prevenir selección en inputs */
    input, textarea {
      -webkit-user-select: none !important;
      user-select: none !important;
    }
    
    /* Asegurar que el botón de pantalla completa sea visible */
    #fullscreenBtn {
      pointer-events: auto !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }
  `
      document.head.appendChild(touchStyles)
  
      // 4. Prevenir menú contextual y otros eventos
      document.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false, capture: true },
      )
  
      // Prevenir selección con doble toque
      document.addEventListener(
        "selectstart",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false, capture: true },
      )
  
      // Prevenir arrastrar elementos
      document.addEventListener(
        "dragstart",
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        { passive: false, capture: true },
      )
  
      // Prevenir eventos de teclado que puedan activar menús
      document.addEventListener(
        "keydown",
        (e) => {
          // Prevenir F11 (pantalla completa), Ctrl+Shift+I (herramientas dev), etc.
          if (
            e.key === "F11" ||
            (e.ctrlKey && e.shiftKey && e.key === "I") ||
            (e.ctrlKey && e.key === "+") ||
            (e.ctrlKey && e.key === "-") ||
            (e.ctrlKey && e.key === "0")
          ) {
            e.preventDefault()
            e.stopPropagation()
          }
        },
        { passive: false, capture: true },
      )
  
      console.log("Touch restrictions applied for touch=true - Auto-propagation enabled")
    } else {
      console.log("Touch restrictions disabled. Add ?touch=true to URL to enable restrictions.")
    }
  })()
  
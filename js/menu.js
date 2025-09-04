/**
 * @fileoverview Archivo para ejecutar el menú y todo lo que este requiera
 * @author Aritz Hurtado Dominguez
 * @license MIT 
 */

$("#creditos")
  .on("click", () => {
    mensaje("Creditos", "Esta aplicación web fue realizada por <b>Aritz Hurtado Dominguez</b> con fines académicos<br><br>Atribución a recursos usados:<br><br>Bota: <a target=\"_blank\" href=\"https://www.flaticon.es/iconos-gratis/botas\" title=\"botas iconos\">Botas iconos creados por shmai - Flaticon</a><br><br>Bandera: <a target=\"_blank\"  href=\"https://www.flaticon.es/iconos-gratis/terminar\" title=\"terminar iconos\">Terminar iconos creados por DinosoftLabs - Flaticon</a><br><br>Piolet: <a target=\"_blank\" href=\"https://mipiolet.es/\" title=\"piolets\">Piolets - Blog de Alpinismo y su material</a>")
  })

/**
 * Booleano para definir si el menú está iniciado
 * @type {boolean} 
 */
let menuIniciado = false

$("#regresar")
  .on("click", () => {
    if (!menuIniciado) final()
  })

/**
 * La función principal que sirve para iniciar el menú
 */
function iniciarMenu() {
  $("#regresar")
    .css("display", "none")

  menuIniciado = true
  const $titulo = $("<h1>")
    .attr("id", "titulo")
    .text("JUEGO IMPOSIBLE DE PLATAFORMAS")
  $("#menu").append($titulo)

  const $niveles = $("<div>")
    .attr("id", "niveles")
  $("#menu").append($niveles)

  const $h1 = $("<h1>")
    .text("NIVELES")
  $niveles.append($h1)

  const grid = $("<div>")
    .attr("class", "grid")
  $niveles.append(grid)

  Object.keys(nivelesDefault).forEach(i => {
    const $button = $("<button>")
      .text(i)
      .on("click", () => {
        datosPartida.nivel = i
        finalMenu()
        iniciarPartida()
      })
    grid.append($button)
  })

  const $opciones = $("<div>")
    .attr("id", "opciones")
  $("#menu").append($opciones)

  const $modoDev = $("<button>")
    .attr("id", "devmode")
    .text("Developer Mode")
    .on("click", () => {
      if ($("#devmode").hasClass("activado")) {
        $("#devmode").removeClass("activado")
        devMode = false
      } else {
        $("#devmode").addClass("activado")
        devMode = true
      }
    })
  if (devMode) $modoDev.addClass("activado")
  $opciones.append($modoDev)

  const $crearNivel = $("<button>")
    .attr("id", "crearNivel")
    .text("Crear Nivel")
    .addClass("activado")
    .on("click", () => {
      finalMenu()
      crearNivel()
    })
  $opciones.append($crearNivel)

  const $cargarNivel = $("<button>")
    .attr("id", "cargarNivel")
    .text("Cargar Nivel")
    .addClass("activado")
    .on("click", () => {
      peticion("Ingresa la ID del nivel", false, respuesta => {
        datosPartida.nivel = respuesta
        if (datosPartida.nivel) {
          finalMenu()
          iniciarPartida()
        } else if (datosPartida.nivel == "") {
          mensaje("ID de Nivel inválida")
          datosPartida.nivel = undefined
        }
      })
    })
  $opciones.append($cargarNivel)
}

/**
 * Función que se ejecuta cuando se sale del menú
 */
function finalMenu() {
  $("#regresar")
    .css("display", "block")

  menuIniciado = false
}

// Se inicia el menú
iniciarMenu()
/**
 * @fileoverview Archivo para ejecutar la creación de niveles
 * @author Aritz Hurtado Dominguez
 * @license MIT 
 */

let nivel = {}

let idContainer

/**
 * Esta función genera la ID del nivel que se está creando
 * @returns {string} La ID del nivel que se está creando
 */
function generarID() {
  let id = ""
  id += `${limiteAbajo}`
  Object.entries(nivel).forEach(([, value]) => {
    id += `;${value.tipo},${value.datos.join(",")}`
  })
  return id
}

/**
 * Esta función crea un campo de entrada para un formulario
 * @param {JQuery<HTMLElement>} $opcionesElemento El contenedor del formulario donde se añadirá este campo de entrada
 * @param {string} label El texto que tendrá la label que acompañe el campo de entrada
 * @param {string} id La id y name del campo de entrada, el for del label
 * @param {"text" | "number" | "checkbox" | "select"} type Define el tipo del input o si en caso contrario es un select
 * @param {string | number | boolean | Array.<{value: string, name: string}>} value Define el valor que tendrá el input por defecto o las opciones del select
 */
function crearEntrada($opcionesElemento, label, id, type, value) {
  // Se crea un div para contener el input o select
  const $valor = $("<div>")
  $opcionesElemento.append($valor)

  // Se crea el label para el input o select
  const $label = $("<label>")
    .text(label)
    .attr({
      for: id
    })
  if (type != "checkbox") $valor.append($label)

  // Si el tipo es "select", se crea un elemento select con las opciones proporcionadas
  if (type == "select") {
    const $select = $("<select>")
      .attr({
        id: id,
        name: id,
        required: "required"
      })
    $valor.append($select)

    // Se agregan las opciones al select
    $.each(value, (_, item) => {
      $select.append($("<option>", {
        value: item.value,
        text: item.name
      }));
    })

  } else { // Si no es un select, se crea un input del tipo correspondiente
    const $input = $("<input>")
      .attr({
        type: type,
        id: id,
        name: id,
        value: value,
        required: "required"
      })
    $valor.append($input)

    // Si es un checkbox, se ajusta su estado y se agrega un botón para cambiarlo
    if (type == "checkbox") {
      $input.attr("checked", value)

      const $span = $("<span>")
        .text(value ? `${label}: Activado` : `${label}: Desactivado`)

      $label
        .text("")
        .on("click", event => {
          event.preventDefault()
          if ($input.prop("checked")) {
            $input.attr("checked", false)
            $span.text(`${label}: Desactivado`)
          } else {
            $input.attr("checked", true)
            $span.text(`${label}: Activado`)
          }
        })

      $valor.append($label)
      $label.append($span)
    }
  }
}

let numeroElementos = 0

/**
 * Esta función genera un menú desde donde el usuario puede añadir elementos al nivel y editarlos a su gusto
 * @param {"objeto" | "dañino" | "especial" | "trigger" | "movil" | "movil_dañino"} tipo De qué tipo es el elemento
 * @param {number} x La X donde se encuentra el jugador
 * @param {number} y La Y donde se encuentra el jugador
 */
function crearElemento(tipo, x, y) {
  // Se elimina el menú actual se existe y se le quita la clase seleccionado a cualquier objeto que la tenga
  $(`#menuElemento`).remove()
  $(`.seleccionado`).removeClass("seleccionado")

  // Se crea un formulario para el menú
  const $menuElemento = $("<form>")
    .attr("id", "menuElemento")
  $("#pantalla").append($menuElemento)

  // Se crea un span que indica el tipo de elemento que se está creando
  const $span = $("<span>")
    .text(`Crear elemento ${tipo[0].toUpperCase()}${tipo.slice(1)}`)
  $menuElemento.append($span)

  // Se crea un div para contener las opciones del elemento
  const $opcionesElemento = $("<div>")
    .attr("id", "opcionesElemento")
  $menuElemento.append($opcionesElemento)

  // Dependiendo del tipo de elemento, se crean diferentes campos de entrada
  if (["objeto", "dañino", "trigger", "movil", "movil_dañino"].includes(tipo)) {
    crearEntrada($opcionesElemento, "Posición X", "posicion_x", "number", x)
    crearEntrada($opcionesElemento, "Posición Y", "posicion_y", "number", y)
    crearEntrada($opcionesElemento, "Tamaño X", "tamaño_x", "number", 25)
    crearEntrada($opcionesElemento, "Tamaño Y", "tamaño_y", "number", 25)

    if (tipo == "trigger") {
      crearEntrada($opcionesElemento, "Visible", "visible", "checkbox", false)
    } else if (["movil", "movil_dañino"].includes(tipo)) {
      crearEntrada($opcionesElemento, "Tiempo Movimiento Ida (ms)", "tiempo_ida", "number", 1000)
      crearEntrada($opcionesElemento, "Tiempo Movimiento Vuelta (ms)", "tiempo_vuelta", "number", 1000)
      crearEntrada($opcionesElemento, "Espera Movimiento Ida (ms)", "wait_ida", "number", 1000)
      crearEntrada($opcionesElemento, "Espera Movimiento Vuelta (ms)", "wait_vuelta", "number", 1000)
      crearEntrada($opcionesElemento, "Delay Primer Movimiento (ms)", "delay", "number", 0)
      crearEntrada($opcionesElemento, "Movimiento X", "movimiento_x", "number", 0)
      crearEntrada($opcionesElemento, "Movimiento Y", "movimiento_y", "number", 0)
      crearEntrada($opcionesElemento, "ID del Trigger", "trigger", "text", "")
    }
  } else if (tipo == "especial") {
    crearEntrada($opcionesElemento, "Posición X", "posicion_x", "number", x)
    crearEntrada($opcionesElemento, "Posición Y", "posicion_y", "number", y)
    crearEntrada($opcionesElemento, "ID", "id", "select", [
      { value: "bota", name: "Bota" },
      { value: "piolet", name: "Piolet" },
      { value: "piolet-rojo", name: "Piolet Rojo" },
      { value: "bandera", name: "Checkpoint" },
      { value: "bandera_final", name: "Final" }
    ])
  }

  // Se crea un div para contener las acciones
  const $accionesElemento = $("<div>")
    .attr("id", "accionesElemento")
  $menuElemento.append($accionesElemento)

  // Se crea un botón para crear el elemento
  const $crear = $("<button>")
    .text("Crear")
    .attr("type", "submit")
    .css("left", "150px")
    .on("click", event => {
      event.preventDefault()

      // Se genera un ID único para el elemento
      let id = `${tipo}_${numeroElementos}`

      let elemento, datos
      // Dependiendo del tipo de elemento, se obtienen los datos del formulario y se crea el objeto correspondiente
      if (["objeto", "dañino", "trigger"].includes(tipo)) {
        const posicionX = parseInt($("#posicion_x").val()) ?? 0
        const posicionY = parseInt($("#posicion_y").val()) ?? 0
        const tamañoX = parseInt($("#tamaño_x").val()) ?? 25
        const tamañoY = parseInt($("#tamaño_y").val()) ?? 25

        if (tipo == "trigger") {
          const visible = `${$("#visible").prop("checked") ?? false}`
          datos = [posicionX, posicionY, tamañoX, tamañoY, visible, id]

          elemento = new Trigger({ x: posicionX, y: posicionY }, { x: tamañoX, y: tamañoY }, visible, id)
        } else {
          datos = [posicionX, posicionY, tamañoX, tamañoY]

          elemento = new { "objeto": Objeto, "dañino": Dañino }[tipo]({ x: posicionX, y: posicionY }, { x: tamañoX, y: tamañoY }, id)

        }
      } else if (["movil", "movil_dañino"].includes(tipo)) {
        const posicionX = parseInt($("#posicion_x").val()) ?? 0
        const posicionY = parseInt($("#posicion_y").val()) ?? 0
        const tamañoX = parseInt($("#tamaño_x").val()) ?? 25
        const tamañoY = parseInt($("#tamaño_y").val()) ?? 25
        const tiempoIda = parseInt($("#tiempo_ida").val()) ?? 1000
        const tiempoVuelta = parseInt($("#tiempo_vuelta").val()) ?? 1000
        const waitIda = parseInt($("#wait_ida").val()) ?? 1000
        const waitVuelta = parseInt($("#wait_vuelta").val()) ?? 1000
        const delay = parseInt($("#delay").val()) ?? 0
        const movimientoX = parseInt($("#movimiento_x").val()) ?? 0
        const movimientoY = parseInt($("#movimiento_y").val()) ?? 0
        const trigger = $("#trigger").val().trim() ?? ""

        datos = [posicionX, posicionY, tamañoX, tamañoY, tiempoIda, tiempoVuelta, waitIda, waitVuelta, delay, movimientoX, movimientoY, trigger]

        elemento = new { "movil": Movil, "movil_dañino": Movil_Dañino }[tipo]({ x: posicionX, y: posicionY }, { x: tamañoX, y: tamañoY }, [tiempoIda, tiempoVuelta], [waitIda, waitVuelta], delay, { x: movimientoX, y: movimientoY }, trigger, id, true)
      } else if (tipo == "especial") {
        const posicionX = parseInt($("#posicion_x").val()) || 0
        const posicionY = parseInt($("#posicion_y").val()) || 0
        id = `${$("#id").val()}_${numeroElementos}`

        datos = [posicionX, posicionY, id]

        elemento = new Especial({ x: posicionX, y: posicionY }, id)
      }

      numeroElementos++

      // Se añade el elemento al nivel
      nivel[id] = {
        "tipo": {
          "objeto": "0",
          "dañino": "1",
          "especial": "2",
          "trigger": "3",
          "movil": "4",
          "movil_dañino": "5"
        }[tipo],
        "datos": datos,
        "objeto": elemento
      }

      // Si es un trigger se le pone color para que no sea invisible
      if (tipo == "trigger") {
        $(`#${id}`)
          .text(id)
          .css({ "background-color": "#f003" })
      }

      // Y se pone el estilo cursor: pointerr
      $(`#${id}`)
        .css({ "cursor": "pointer" })

      // Se añade un evento de click al elemento para permitir su edición
      $(`#${id}`)
        .on("click", function () {
          editarElemento(tipo, this.id)
        })

      // Se elimina el menú
      $(`#menuElemento`).remove()

      // Se actualiza el ID del nivel
      idContainer.text(generarID())
    })
  $accionesElemento.append($crear)

  // Se crea un botón para cancelar la creación del elemento
  const $cancelar = $("<button>")
    .text("Cancelar")
    .attr("type", "reset")
    .css("left", "250px")
    .on("click", event => {
      event.preventDefault()
      $(`#menuElemento`).remove()
    })
  $accionesElemento.append($cancelar)
}

/**
 * Esta función genera un menú desde donde el usuario puede editar o borrar un elemento que ya está en el nivel
 * @param {"objeto" | "dañino" | "especial" | "trigger" | "movil" | "movil_dañino"} tipo De qué tipo es el elemento
 * @param {string} id La ID del item a modificar
 */
function editarElemento(tipo, id) {
  // Se elimina el menú actual se existe y se le quita la clase seleccionado a cualquier objeto que la tenga
  $(`#menuElemento`).remove()
  $(`.seleccionado`).removeClass("seleccionado")

  // Se selecciona el objeto correspondiente al ID y se le añade la clase seleccionado
  const objeto = $(`#${id}`)
  objeto.addClass("seleccionado")

  // Se obtienen los datos del elemento del nivel
  const datosElemento = nivel[id]

  // Se crea un formulario para el menú
  const $menuElemento = $("<form>")
    .attr("id", "menuElemento")
  $("#pantalla").append($menuElemento)

  // Se crea un span que indica el ID y tipo del elemento que se está editando
  const $span = $("<span>")
    .text(`Editar elemento ${id} (${tipo[0].toUpperCase()}${tipo.slice(1)})`)
  $menuElemento.append($span)

  // Se crea un div para contener las opciones de edición del elemento
  const $opcionesElemento = $("<div>")
    .attr("id", "opcionesElemento")
  $menuElemento.append($opcionesElemento)

  // Dependiendo del tipo de elemento, se crean diferentes campos de entrada para editar los datos
  if (["objeto", "dañino", "trigger", "movil", "movil_dañino"].includes(tipo)) {
    crearEntrada($opcionesElemento, "Posición X", "posicion_x", "number", datosElemento.datos[0])
    crearEntrada($opcionesElemento, "Posición Y", "posicion_y", "number", datosElemento.datos[1])
    crearEntrada($opcionesElemento, "Tamaño X", "tamaño_x", "number", datosElemento.datos[2])
    crearEntrada($opcionesElemento, "Tamaño Y", "tamaño_y", "number", datosElemento.datos[3])

    if (tipo == "trigger") {
      crearEntrada($opcionesElemento, "Visible", "visible", "checkbox", datosElemento.datos[4] == "true")
    } else if (["movil", "movil_dañino"].includes(tipo)) {
      crearEntrada($opcionesElemento, "Tiempo Movimiento Ida (ms)", "tiempo_ida", "number", datosElemento.datos[4])
      crearEntrada($opcionesElemento, "Tiempo Movimiento Vuelta (ms)", "tiempo_vuelta", "number", datosElemento.datos[5])
      crearEntrada($opcionesElemento, "Espera Movimiento Ida (ms)", "wait_ida", "number", datosElemento.datos[6])
      crearEntrada($opcionesElemento, "Espera Movimiento Vuelta (ms)", "wait_vuelta", "number", datosElemento.datos[7])
      crearEntrada($opcionesElemento, "Delay Primer Movimiento (ms)", "delay", "number", datosElemento.datos[8])
      crearEntrada($opcionesElemento, "Movimiento X", "movimiento_x", "number", datosElemento.datos[9])
      crearEntrada($opcionesElemento, "Movimiento Y", "movimiento_y", "number", datosElemento.datos[10])
      crearEntrada($opcionesElemento, "ID del Trigger", "trigger", "text", datosElemento.datos[11])
    }

  } else if (tipo == "especial") {
    crearEntrada($opcionesElemento, "Posición X", "posicion_x", "number", datosElemento.datos[0])
    crearEntrada($opcionesElemento, "Posición Y", "posicion_y", "number", datosElemento.datos[1])
  }

  // Se crea un div para contener las acciones
  const $accionesElemento = $("<div>")
    .attr("id", "accionesElemento")
  $menuElemento.append($accionesElemento)

  // Se crea un botón para realizar los cambios
  const $editar = $("<button>")
    .text("Editar")
    .attr("type", "submit")
    .css("left", "150px")
    .on("click", event => {
      event.preventDefault()
      // Se quita la clase seleccionado del objeto
      objeto.removeClass("seleccionado")

      // Dependiendo del tipo de elemento, se actualizan los datos del elemento y del nivel
      if (["objeto", "dañino", "trigger"].includes(tipo)) {
        const posicionX = parseInt($("#posicion_x").val()) ?? 0
        const posicionY = parseInt($("#posicion_y").val()) ?? 0
        const tamañoX = parseInt($("#tamaño_x").val()) ?? 25
        const tamañoY = parseInt($("#tamaño_y").val()) ?? 25

        // Se actualizan los valores del objeto y los datos del elemento en el nivel
        datosElemento.objeto.posicionX -= datosElemento.datos[0] - posicionX
        datosElemento.objeto.posicionY -= datosElemento.datos[1] - posicionY
        datosElemento.objeto.establecerPosicion({ x: posicionX, y: posicionY })
        datosElemento.objeto.tamañoX = tamañoX
        datosElemento.objeto.tamañoY = tamañoY
        datosElemento.datos = [posicionX, posicionY, tamañoX, tamañoY]

        // Si es un trigger, se actualiza también la visibilidad
        if (tipo == "trigger") {
          const visible = `${$("#visible").prop("checked") ?? false}`
          datosElemento.datos.push(visible)
          datosElemento.datos.push(id)
        }
      } else if (["movil", "movil_dañino"].includes(tipo)) {
        const posicionX = parseInt($("#posicion_x").val()) ?? 0
        const posicionY = parseInt($("#posicion_y").val()) ?? 0
        const tamañoX = parseInt($("#tamaño_x").val()) ?? 25
        const tamañoY = parseInt($("#tamaño_y").val()) ?? 25
        const tiempoIda = parseInt($("#tiempo_ida").val()) ?? 1000
        const tiempoVuelta = parseInt($("#tiempo_vuelta").val()) ?? 1000
        const waitIda = parseInt($("#wait_ida").val()) ?? 1000
        const waitVuelta = parseInt($("#wait_vuelta").val()) ?? 1000
        const delay = parseInt($("#delay").val()) ?? 0
        const movimientoX = parseInt($("#movimiento_x").val()) ?? 0
        const movimientoY = parseInt($("#movimiento_y").val()) ?? 0
        const trigger = $("#trigger").val().trim() ?? ""

        // Se actualizan los valores del objeto y los datos del elemento en el nivel
        datosElemento.objeto.posicionX -= datosElemento.datos[0] - posicionX
        datosElemento.objeto.posicionY -= datosElemento.datos[1] - posicionY
        datosElemento.objeto.establecerPosicion({ x: posicionX, y: posicionY })
        datosElemento.objeto.tamañoMovilX = tamañoX
        datosElemento.objeto.tamañoMovilY = tamañoY
        datosElemento.objeto.tiempo = [tiempoIda, tiempoVuelta]
        datosElemento.objeto.wait = [waitIda, waitVuelta]
        datosElemento.objeto.delay = delay
        datosElemento.objeto.movimientoX = movimientoX
        datosElemento.objeto.movimientoY = movimientoY
        datosElemento.objeto.trigger = trigger
        datosElemento.datos = [posicionX, posicionY, tamañoX, tamañoY, tiempoIda, tiempoVuelta, waitIda, waitVuelta, delay, movimientoX, movimientoY, trigger]

      } else if (tipo == "especial") {
        const posicionX = parseInt($("#posicion_x").val()) || 0
        const posicionY = parseInt($("#posicion_y").val()) || 0

        // Se actualizan los valores del objeto y los datos del elemento en el nivel
        datosElemento.objeto.posicionX -= datosElemento.datos[0] - posicionX
        datosElemento.objeto.posicionY -= datosElemento.datos[1] - posicionY
        datosElemento.objeto.establecerPosicion({ x: posicionX, y: posicionY })
        datosElemento.datos = [posicionX, posicionY, id]
      }

      // Se elimina el menú de edición
      $(`#menuElemento`).remove()
      // Se actualiza el ID del nivel
      idContainer.text(generarID())
    })
  $accionesElemento.append($editar)

  // Se crea un botón para eliminar el elemento
  const $eliminar = $("<button>")
    .text("Eliminar")
    .attr("type", "reset")
    .css("left", "350px")
    .on("click", event => {
      event.preventDefault()
      // Se elimina el objeto del array de objetos y también del nivel
      objetos.splice(objetos.findIndex(o => o.id == datosElemento.objeto.id), 1)
      delete nivel[id]
      // Se elimina el objeto del HTML
      objeto.remove()
      // Se elimina el menú
      $(`#menuElemento`).remove()
      // Se actualiza el ID del contenedor del juego
      idContainer.text(generarID())
    })
  $accionesElemento.append($eliminar)

  // Se crea un botón para cancelar la edición del elemento
  const $cancelar = $("<button>")
    .text("Cancelar")
    .attr("type", "reset")
    .css("left", "250px")
    .on("click", event => {
      event.preventDefault()
      // Se remueve la clase seleccionado del objeto y se elimina el menú de edición del elemento
      objeto.removeClass("seleccionado")
      $(`#menuElemento`).remove()
    })
  $accionesElemento.append($cancelar)
}

/**
 * La función principal que sirve para ejecutar todo el tema de crear niveles
 */
function crearNivel() {
  // Se crea el objeto nivel vacío
  nivel = {}

  // Se activa el modo desarrollador por si le da a probar nivel
  devMode = true

  // Se ajusta la posición inicial de la partida si no está ya definida
  if (!datosPartida.x) datosPartida.x = 0
  if (!datosPartida.y) datosPartida.y = 0

  // Se obtiene la altura y el ancho de la ventana del navegador
  height = innerHeight
  width = innerWidth

  // Se vacían los contenidos de los elementos menu, pantalla, y partida
  $("#menu").html("")
  $("#pantalla").html("")
  $("#partida").html("")

  // Se crea un Set para almacenar las teclas presionadas
  const teclas = new Set()

  document.addEventListener("keydown", event => {
    teclas.add(event.key.toLowerCase())
    if (event.key == "Enter") $("*:focus").on("blur",)
  })

  document.addEventListener("keyup", event => {
    teclas.delete(event.key.toLowerCase())
  })

  // Se crea el jugador
  jugador = new Jugador("jugador", { x: 0, y: 0 }, { x: 25, y: 25 })

  // Se pone al jugador transparente para que se vea qué hay detrás y se pueda diferenciar del modo juego
  $("#jugador").css("background-color", "#0099")

  // Se crea el array de objetos vacío y se genera el nivel si hay una ID puesta
  objetos = []
  if (datosPartida.nivel) generarNivel("creador", nivel, editarElemento)

  // Se establece el color de fondo de los elementos con la clase trigger para que no sean invisibles
  $(".trigger").css({ "background-color": "#f003" })

  // Se crea un objeto Trigger para representar dónde aparece el jugador
  const $ckeckpoint = new Trigger({ x: datosPartida.x, y: datosPartida.y }, { x: 25, y: 25 }, false, "checkpoint")
  $("#partida").append($ckeckpoint)

  // Se crea un div para mostrar la ID del nivel
  const $id_nivel = $("<div>")
    .attr("id", "id_nivel")
  $("#pantalla").append($id_nivel)

  const $textarea_header = $("<div>")
  $id_nivel.append($textarea_header)

  const $textarea_span = $("<span>")
    .text("ID del Nivel")
  $textarea_header.append($textarea_span)

  // Se crea un botón para copiar la ID del nivel al portapapeles
  const $textarea_button = $("<button>")
    .text("Copiar")
    .on("click", function () {
      navigator.clipboard.writeText(generarID())
        .then(() => {
          // Si se copia exitosamente, se cambia el color de fondo a verde temporalmente
          $(this).css("transition", "background-color 0.2s ease")
          $(this).css("background-color", "#0f0")
          setTimeout(() => {
            $(this).css("transition", "background-color 1s ease")
            $(this).css("background-color", "#fff")
          }, 200)
        })
        .catch(err => {
          // Si hay un error al copiar, se cambia el color de fondo a rojo temporalmente y se muestra un mensaje de error
          $(this).css("transition", "background-color 0.2s ease")
          $(this).css("background-color", "#f00")
          setTimeout(() => {
            $(this).css("transition", "background-color 1s ease")
            $(this).css("background-color", "#fff")
            mensaje("No se pudo copiar al portapapeles", err)
          }, 200)
        });
    })
  $textarea_header.append($textarea_button)

  // Se crea un área de texto para mostrar la ID del nivel
  const $textarea_id = $("<textarea>")
    .text(generarID())
    .attr({
      "readonly": "readonly",
      "tabindex": "-1"
    })
  $id_nivel.append($textarea_id)
  idContainer = $textarea_id

  // Se crea un div para mostrar las coordenadas del jugador
  const $coordenadas = $("<div>")
    .attr("id", "coordenadas")
    .addClass("datos")
    .css("top", "5px")
    .html(`
      <span>Posición</span>
      <div>
        <span>X:</span>
        <input id="coordenadaX" autocomplete="off">
      </div>
      <div>
        <span>Y:</span>
        <input id="coordenadaY" autocomplete="off">
      </div>`)
  $("#pantalla").append($coordenadas)

  // Se añade un blur para que cambie las coordenadas del jugador cuando las defina
  $("#coordenadas input").on("blur", (event) => {
    if (event.target.id == "coordenadaX") {
      jugador.moverX(parseInt(event.target.value) - jugador.coordenadaX)
    } else {
      jugador.moverY(parseInt(event.target.value) - jugador.coordenadaY)
      $Yminima.css("top", height / 2 - 12.5 + limiteAbajo - jugador.coordenadaY)
    }
  })

  // Se crea un div para mostrar las opciones para crear elementos
  const $crearElemento = $("<div>")
    .attr("id", "crearElemento")
    .addClass("datos")
    .css("top", "95px")
    .html(`
      <span>Crear Elemento</span>
    `)
  $("#pantalla").append($crearElemento)

  // Se crean botones para crear los diferentes tipos de elementos
  const $crearObjeto = $("<button>")
    .text("Objeto")
    .on("click", () => {
      crearElemento("objeto", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearObjeto)

  const $crearDañino = $("<button>")
    .text("Dañino")
    .on("click", () => {
      crearElemento("dañino", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearDañino)

  const $crearEspecial = $("<button>")
    .text("Especial")
    .on("click", () => {
      crearElemento("especial", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearEspecial)

  const $crearTrigger = $("<button>")
    .text("Trigger")
    .on("click", () => {
      crearElemento("trigger", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearTrigger)

  const $crearMovil = $("<button>")
    .text("Movil")
    .on("click", () => {
      crearElemento("movil", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearMovil)

  const $crearMovilDañino = $("<button>")
    .text("Movil Dañino")
    .on("click", () => {
      crearElemento("movil_dañino", jugador.coordenadaX, jugador.coordenadaY)
    })
  $crearElemento.append($crearMovilDañino)

  // Se crea un div para mostrar las opciones para probar el nivel
  const $probarNivel = $("<div>")
    .attr("id", "probarNivel")
    .addClass("datos")
    .css("top", "290px")
    .html(`
      <span>Probar Nivel</span>
    `)
  $("#pantalla").append($probarNivel)

  // Se crean botones para probar el nivel desde diferentes puntos
  const $jugarDesdeInicio = $("<button>")
    .text("Desde Inicio")
    .on("click", () => {
      // Se inicia la partida como juego
      const id = generarID()
      final(true)
      datosPartida.nivel = id
      iniciarPartida()
    })
  $probarNivel.append($jugarDesdeInicio)

  const $jugarDesdePosicion = $("<button>")
    .text("Desde Posicion")
    .on("click", () => {
      // Se obtienen las coordenadas actuales del jugador y se inicia la partida como juego desde esa posición
      const x = jugador.coordenadaX
      const y = jugador.coordenadaY
      const id = generarID()
      final(true)
      datosPartida.x = x
      datosPartida.y = y
      datosPartida.nivel = id
      iniciarPartida()
    })
  $probarNivel.append($jugarDesdePosicion)

  // Se crea un div para controlar la posición mínima en el eje Y
  const $Yminima = $("<div>")
    .attr({
      "id": "Yminima",
      "min": "50",
      "max": "2000"
    })
    .css("top", height / 2 - 12.5 + limiteAbajo)
  $("#pantalla").append($Yminima)

  // Se añade un span para mostrar la función de este control
  const $YminimaSpan = $("<span>")
    .text("Y mínima")
  $Yminima.append($YminimaSpan)

  // Se añade un input para ajustar la posición mínima en el eje Y
  const $YminimaInput = $("<input>")
    .attr({
      type: "number",
      value: limiteAbajo
    })
    .on("blur", function () {
      const valor = parseInt($(this).val())
      // Se verifica que el valor esté dentro del rango permitido
      if (valor >= 50 && valor <= 2000) {
        limiteAbajo = parseInt($(this).val())
        idContainer.text(generarID())
        $Yminima.css("top", height / 2 - 12.5 + limiteAbajo - jugador.coordenadaY)
      } else {
        $(this).val(limiteAbajo)
      }
      $("html, body").animate({ scrollTop: 0 }, "slow");
    })
  $Yminima.append($YminimaInput)

  let coordenadasAnt

  // Se inicia un intervalo para actualizar las coordenadas del jugador
  iniciarInterval = () => {
    frame = 1
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      const coordenadas = jugador.coordenadas
      // Se actualizan las coordenadas del jugador en los inputs correspondientes si han cambiado
      if (!coordenadasAnt || (coordenadasAnt.x).toFixed(1) != (coordenadas.x).toFixed(1) || (coordenadasAnt.y).toFixed(1) != (coordenadas.y).toFixed(1)) {
        coordenadasAnt = coordenadas
        $("#coordenadaX").val((coordenadas.x).toFixed(1))
        $("#coordenadaY").val((coordenadas.y).toFixed(1))
      }

      // Se detecta si el jugador se mueve y si es el caso, produce que se mueva
      const inputIzquierda = teclas.has("a") || teclas.has("ArrowLeft")
      const inputDerecha = teclas.has("d") || teclas.has("ArrowRight")
      const inputArriba = teclas.has("w") || teclas.has("ArrowUp") || teclas.has(" ")

      const inputAbajo = teclas.has("s") || teclas.has("ArrowDown")

      if (inputIzquierda) {
        jugador.moverX(-12.5)
      }
      if (inputDerecha) {
        jugador.moverX(12.5)
      }
      if (inputArriba) {
        jugador.moverY(-12.5)
        $Yminima.css("top", height / 2 - 12.5 + limiteAbajo - jugador.coordenadaY)
      }
      if (inputAbajo) {
        jugador.moverY(12.5)
        $Yminima.css("top", height / 2 - 12.5 + limiteAbajo - jugador.coordenadaY)
      }
    }, 30)
  }

  iniciarInterval()
}
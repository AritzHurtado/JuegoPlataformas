/**
 * @fileoverview Archivo para ejecutar el juego de niveles
 * @author Aritz Hurtado Dominguez
 * @license MIT
 */

/**
 * La función principal que sirve para iniciar el juego
 */
function iniciarPartida() {
  frame = 0

  // Se ajusta la posición inicial de la partida si no está ya definida
  if (!datosPartida.x) datosPartida.x = 0
  if (!datosPartida.y) datosPartida.y = 0

  // Se sube un poco al jugador para que no atraviese el suelo si está pegado a este
  datosPartida.y -= 1

  // Si el piolet-rojo está activado, se activa también el normal
  if (datosPartida["piolet-rojo"]) datosPartida.piolet = true

  // Se obtiene la altura y el ancho de la ventana del navegador
  height = innerHeight
  width = innerWidth

  // Se vacían los contenidos de los elementos menu, pantalla, y partida
  $("#menu").html("")
  $("#pantalla").html(`
    <div id="habilidades">
    </div>
  `)
  $("#partida").html("")

  // Se muestran las habilidades obtenidas
  if (datosPartida.bota) mostrarHabilidad("bota")
  if (datosPartida["piolet-rojo"]) {
    mostrarHabilidad("piolet-rojo")
  } else {
    if (datosPartida.piolet) mostrarHabilidad("piolet")
  }

  // Se crea un Set para almacenar las teclas presionadas
  const teclas = new Set()
  
  document.addEventListener("keydown", event => {
    teclas.add(event.key.toLowerCase())
  })

  document.addEventListener("keyup", event => {
    teclas.delete(event.key.toLowerCase())
  })

  // Se crea el jugador
  jugador = new Jugador("jugador", { x: 0, y: 0 }, { x: 25, y: 25 })

  // Se crea un array vacío de objetos
  objetos = []

  // Se carga el nivel del juego
  const nivelCargado = nivelesDefault[datosPartida.nivel] ? nivelesDefault[datosPartida.nivel]() : generarNivel("juego")

  if (nivelCargado) {
    if (devMode) {
      // Si se está en modo desarrollador, se muestran algunas opciones adicionales

      // Se le da color a los triggers para que no sean invisibles
      $(".trigger").css({ "background-color": "#f003" })

      // Se añaden campos para mostrar y editar tus coordenadas
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

      $("#coordenadas input").on("blur", (event) => {
        if (event.target.id == "coordenadaX") {
          jugador.moverX(parseInt(event.target.value) - jugador.coordenadaX)
        } else {
          jugador.moverY(parseInt(event.target.value) - jugador.coordenadaY)
        }
      })

      // Se añaden campos para mostrar y editar tu velocidad
      const $velocidad = $("<div>")
        .attr("id", "velocidad")
        .addClass("datos")
        .css("top", "85px")
        .html(`
      <span>Velocidad</span>
      <div>
        <span>X:</span>
        <input id="velocidadX" autocomplete="off">
      </div>
      <div>
        <span>Y:</span>
        <input id="velocidadY" autocomplete="off">
      </div>`)
      $("#pantalla").append($velocidad)

      $("#velocidad input").on("blur", (event) => {
        if (event.target.id == "velocidadX") {
          jugador.velocidadX = Math.floor(event.target.value)
        } else {
          jugador.velocidadY = Math.floor(event.target.value)
        }
      })

      // Se añade un campo para añadirte habilidades
      const $añadirHabilidad = $("<div>")
        .attr("id", "añadirHabilidad")
        .addClass("datos")
        .html(`
        <span>Añadir Habilidad</span>
      `)
        .css("top", "185px")
      $("#pantalla").append($añadirHabilidad)

      Object.keys(habilidades).forEach(id => {
        const $habilidad = $("<img>")
          .attr("src", `img/${id}.png`)
          .on("click", () => {
            if (!datosPartida[id]) {
              if (id == "piolet-rojo") {
                if (datosPartida.piolet) {
                  $('#piolet').parent().remove()
                } else {
                  datosPartida.piolet = true
                }
              }
              datosPartida[id] = true
              mostrarHabilidad(id)
            }
          })
        $añadirHabilidad.append($habilidad)
      })

      // Se añade un trigger de checkpoint en la posición actual del jugador para que se vea dónde está
      const $checkpoint = new Trigger({ x: datosPartida.x, y: datosPartida.y }, { x: 25, y: 25 }, false, "checkpoint")
      $("#partida").append($checkpoint)

      checkpoint = $checkpoint

      // Se añaden opciones para crear checkpoints
      const $ckeckpoints = $("<div>")
        .attr("id", "checkpoints")
        .html(`
        <span>Checkpoints</span>
      `)
        .addClass("datos")
        .css("top", "405px")
      $("#pantalla").append($ckeckpoints)

      const $checkpointActual = $("<button>")
        .text("Posición Actual")
        .on("click", () => {
          $checkpoint.establecerPosicion({
            x: jugador.coordenadaX,
            y: jugador.coordenadaY
          })
          datosPartida.x = jugador.coordenadaX
          datosPartida.y = jugador.coordenadaY
        })
      $ckeckpoints.append($checkpointActual)

      const $ckeckpointInicio = $("<button>")
        .text("Inicio")
        .on("click", () => {
          $checkpoint.establecerPosicion({
            x: 0,
            y: 0
          })
          datosPartida.x = 0
          datosPartida.y = 0
        })
      $ckeckpoints.append($ckeckpointInicio)

      // Si el nivel cargado no es uno default, se añade la opción de editar el nivel
      if (nivelCargado != "default") {
        const $editarNivel = $("<div>")
          .attr("id", "editar")
          .html(`
            <span>Editar Nivel</span>
          `)
          .addClass("datos")
          .css("top", "505px")
        $("#pantalla").append($editarNivel)

        const $editarButton = $("<button>")
          .text("Editar")
          .on("click", () => {
            const idNivel = datosPartida.nivel
            final(true)
            datosPartida.nivel = idNivel
            crearNivel()
          })
        $editarNivel.append($editarButton)
      }
    }

    // Variables para controlar el estado del salto, y las coordenadas y velocidad del frame anterior
    let saltoQuitado = true, coordenadasAnt, velocidadAnt

    // Función para iniciar el intervalo del juego
    iniciarInterval = () => {
      // Se limpia el intervalo anterior si existe
      if (interval) clearInterval(interval)
      // Se crea un nuevo intervalo
      interval = setInterval(() => {
        // Se incrementa el contador de frames
        frame++
        // Si se está en modo desarrollador, se actualizan las coordenadas y la velocidad del jugador en la pantalla
        if (devMode) {
          const coordenadas = jugador.coordenadas
          // Si las coordenadas anteriores son diferentes a las actuales, se actualizan y muestran en la pantalla
          if (!coordenadasAnt || (coordenadasAnt.x).toFixed(1) != (coordenadas.x).toFixed(1) || (coordenadasAnt.y).toFixed(1) != (coordenadas.y).toFixed(1)) {
            coordenadasAnt = coordenadas
            $("#coordenadaX").val((coordenadas.x).toFixed(1))
            $("#coordenadaY").val((coordenadas.y).toFixed(1))
          }

          const velocidad = jugador.velocidad
          // Si la velocidad anterior es diferente a la actual, se actualiza y muestra en la pantalla
          if (!velocidadAnt || (velocidadAnt.x).toFixed(1) != (velocidad.x).toFixed(1) || (velocidadAnt.y).toFixed(1) != (velocidad.y).toFixed(1)) {
            velocidadAnt = velocidad
            $("#velocidadX").val((velocidad.x).toFixed(1))
            $("#velocidadY").val((velocidad.y).toFixed(1))
          }

        }

        // Se detecta si el jugador se mueve
        const inputIzquierda = teclas.has("a") || teclas.has("arrowleft")
        const inputDerecha = teclas.has("d") || teclas.has("arrowright")
        const inputSalto = teclas.has("w") || teclas.has("arrowup") || teclas.has(" ")

        // Si no alcanzó su velocidad máxima en la dirección de la flecha que está pulsando sin tener en cuenta la velocidad externa, entonces el se modifica la velocidad X del jugador
        if (inputIzquierda) {
          if (jugador.velocidadX - jugador.velocidadExternaX > -8) jugador.velocidadX -= 2
        }
        if (inputDerecha) {
          if (jugador.velocidadX - jugador.velocidadExternaX < 8) jugador.velocidadX += 2
        }

        // Se gestiona el salto del jugador. SaltoQuitado es para evitar que no se pare de saltar manteniendo la tecla pulsada
        if (saltoQuitado) {
          // Si se presiona la tecla de salto y el jugador puede saltar, se ejecuta el salto
          if (inputSalto && jugador.salto) {
            jugador.velocidadY = -16
            saltoQuitado = false
            jugador.salto = false
          } else if (inputSalto && datosPartida.bota && jugador.saltos < 2) {
            // Si se presiona la tecla de salto y se tiene la habilidad de la bota, se realiza un salto adicional
            animarHabilidad("bota")
            jugador.velocidadY = -14
            saltoQuitado = false
            jugador.saltos++
          }
        } else if (!inputSalto) {
          saltoQuitado = true
        }

        // Se ejecuta el tick() de los objetos
        objetos.forEach(objeto => {
          objeto.tick()
        })

        // Se mueve al jugador según su velocidad actual
        jugador.mover({
          x: jugador.velocidadX,
          y: jugador.velocidadY
        })

        // Se ejecuta el tick() del jugador
        const jugadorVivo = jugador.tick()

        if (jugadorVivo) {
          // Si el tick() devuelve true (es decir, si no tocó ningún elemento dañino) y el jugador alcanza el límite inferior de la pantalla, lo lleva al último checkpoint como si hubiera tocado algo rojo
          if (jugador.coordenadaY > limiteAbajo) {
            clearInterval(interval)
            iniciarPartida()
          }
        }
      }, 30)
    }

    iniciarInterval()
  }
}
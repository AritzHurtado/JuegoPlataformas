/**
 * @fileoverview Archivo para definir la mayoría de valores, clases y funciones que luego se usarán para todo el JavaScript de la aplicación web en este archivo o al menos otros dos archivos
 * @author Aritz Hurtado Dominguez
 * @license MIT 
 */

// Los datos sobre las habilidades existentes
const habilidades = {
  bota: {
    "Nombre": "Bota",
    "Descripcion": "Otorga un doble salto",
    "Obtencion": "A partir de ahora tendrás un doble salto, lo cual te da mayor manejo y te permite llegar a alturas más altas"
  },
  piolet: {
    "Nombre": "Piolet",
    "Descripcion": "Permite escalar paredes",
    "Obtencion": "A partir de ahora podrás escalar paredes, saltando mientras estás apoyado en ellas"
  },
  "piolet-rojo": {
    "Nombre": "Piolet Rojo",
    "Descripcion": "Permite escalar paredes. No permite saltar desde el suelo",
    "Obtencion": "A partir de ahora podrás escalar paredes, saltando mientras estás apoyado en ellas<br><br>¡Pero ten cuidado! Ya no podrás saltar desde el suelo"
  }
}

// Variables importantes que se modificarán durante todo el JS
let

  /**
   * Aloja el interval cuando está defindido
   * @type {NodeJS.Timeout | undefined}
   */
  interval,

  /**
   * Aloja una función que retoma el interval cuando está definido
   * @type {function | undefined}
   */
  iniciarInterval,

  /**
   * Los datos de la partida
   * @type {{
   * x: number | undefined
   * y: number | undefined
   * nivel: string | undefined
   * bota: boolean | undefined
   * piolet: boolean | undefined
   * "piolet-rojo": boolean | undefined
   * }}
   */
  datosPartida = {},

  /**
   * Los frames del juego
   */
  frame = 0,

  /**
   * Aloja al jugador cuando está definido
   * @type {Jugador | undefined}
   */
  jugador,

  /**
   * Aloja los objetos cuando está definido
   * @type {(Objeto|Trigger|Especial|Dañino|Movil|Movil_Dañino)[] | undefined}
   */
  objetos,

  /**
   * Aloja el alto de la pantalla cuando se inicia el juego o la creación o el creador
   * @type {number | undefined}
   */
  height,

  /**
   * Aloja el ancho de la pantalla cuando se inicia el juego o la creación o el creador
   * @type {number | undefined}
   */
  width,

  /**
   * Y del límite inferior que cuando el jugador supera es regresado a su último checkpoint
   */
  limiteAbajo = 600,

  /**
   * Si el devmode está activado, iniciando las herramientras de desarrollador al jugar si lo está
   * @type {boolean}
   */
  devMode = false,

  /**
   * El trigger que muestra el checkpoint cuando se inicia el juego con el devmode activado
   * @type {Trigger | undefined}
   */
  checkpoint

/**
* @abstract
* @class
* Clase básica de elemento para extenderse en cada tipo elemento
*/
class Elemento {
  _id;
  _width;
  _height;
  _posicionInicialX;
  _posicionInicialY;

  /**
   * Crea un elemento
   * @param {string | boolean} id Si ID está definido, crea el objeto con esta ID. Si no está definido, el elemento no se llegará a crear
   * @param {{x: number, y: number} | undefined} posicion Si ID está definido creará el elemento en esta posición
   * @param {{x: number, y: number} | undefined} tamaño Si ID está definido creará el elemento con este tamaño
  */
  constructor(id, posicion, tamaño, esJugador) {
    if (id !== false) {
      this._id = id
      this.posicion = posicion
      this.tamaño = tamaño
      this.posicionInicialX = posicion.x
      this.posicionInicialY = posicion.y

      const div = $("<div>")
      div.addClass("bloque")
      div.attr("id", id)
      if (esJugador) {
        div.css({
          width: tamaño.x,
          height: tamaño.y
        })
      } else {
        div.css({
          left: posicion.x + width / 2 - 12.5 - jugador.coordenadaX,
          top: posicion.y + height / 2 - 12.5 - jugador.coordenadaY,
          width: tamaño.x,
          height: tamaño.y
        })
      }
      $("#partida").append(div)
    }
  }

  /**
   * Obten la ID del elemento
   * @return {string} La ID del elemento 
   */
  get id() {
    return this._id
  }

  /**
   * Obten la posición del elemento
   * @return {{x: number, y: number}} La posición del elemento 
   */
  get posicion() {
    const offset = $(`#${this.id}`).offset()
    return { x: offset.left, y: offset.top }
  }

  /**
   * Establece la posición del elemento
   * @param {{x: number, y: number}} posicion La posición del elemento 
   */
  set posicion(posicion) {
    $(`#${this.id}`).css({
      left: posicion.x,
      top: posicion.y
    })
  }

  /**
   * Obten la posición X del elemento
   * @return {number} La posición X del elemento 
   */
  get posicionX() {
    return $(`#${this.id}`).offset().left
  }

  /**
   * Establece la posición X del elemento
   * @param {number} posicionX La posición X del elemento 
   */
  set posicionX(posicionX) {
    $(`#${this.id}`).css({
      left: posicionX,
    })
  }

  /**
   * Obten la posición Y del elemento
   * @return {number} La posición Y del elemento 
   */
  get posicionY() {
    return $(`#${this.id}`).offset().top
  }

  /**
   * Establece la posición Y del elemento
   * @param {number} posicionY La posición Y del elemento 
   */
  set posicionY(posicionY) {
    $(`#${this.id}`).css({
      top: posicionY
    })
  }

  /**
   * Obten el tamaño del elemento
   * @return {{x: number, y: number}} El tamaño del elemento 
   */
  get tamaño() {
    const elemento = $(`#${this.id}`)
    return { x: elemento.width(), y: elemento.height() }
  }

  /**
   * Establece el tamaño del elemento
   * @param {{x: number, y: number}} tamaño El tamaño del elemento 
   */
  set tamaño(tamaño) {
    $(`#${this.id}`).css({
      width: tamaño.x,
      height: tamaño.y
    })
  }

  /**
   * Obten el tamaño X del elemento
   * @return {number} el tamaño X del elemento 
   */
  get tamañoX() {
    return $(`#${this.id}`).width()
  }

  /**
   * Establece el tamaño X del elemento
   * @param {number} tamañoX el tamaño X del elemento 
   */
  set tamañoX(tamañoX) {
    $(`#${this.id}`).css({
      width: tamañoX,
    })
  }

  /**
   * Obten el tamaño Y del elemento
   * @return {number} el tamaño Y del elemento 
   */
  get tamañoY() {
    return $(`#${this.id}`).height()
  }

  /**
   * Establece el tamaño Y del elemento
   * @param {number} tamañoY el tamaño Y del elemento 
   */
  set tamañoY(tamañoY) {
    $(`#${this.id}`).css({
      height: tamañoY
    })
  }

  /**
   * Obtén la X que supone la izquierda del elemento
   * @returns {number} La X que supone la izquierda del elemento 
   */
  get Xizquierda() {
    return this.posicionX
  }

  /**
   * Obtén la X que supone la derecha del elemento
   * @returns {number} La X que supone la derecha del elemento 
   */
  get Xderecha() {
    return this.posicionX + this.tamañoX
  }

  /**
   * Obtén la Y que supone la parte más alta del elemento
   * @returns {number} La Y que supone la parte más alta del elemento 
   */
  get Ysuperior() {
    return this.posicionY
  }

  /**
   * Obtén la Y que supone la parte más baja del elemento
   * @returns {number} La Y que supone la parte más baja del elemento 
   */
  get Yinferior() {
    return this.posicionY + this.tamañoY
  }

  /**
   * Obtiene la posición X inicial del elemento
   * @returns {number} La posición X inicial del elemento
   */
  get posicionInicialX() {
    return this._posicionInicialX
  }

  /**
   * Establece la posición X inicial del elemento
   * @arg {number} posicionInicialX La posición X inicial del elemento
   */
  set posicionInicialX(posicionInicialX) {
    this._posicionInicialX = posicionInicialX
  }

  /**
   * Obtiene la posición Y inicial del elemento
   * @returns {number} La posición Y inicial del elemento
   */
  get posicionInicialY() {
    return this._posicionInicialY
  }

  /**
   * Establece la posición Y inicial del elemento
   * @arg {number} posicionInicialY La posición Y inicial del elemento
   */
  set posicionInicialY(posicionInicialY) {
    this._posicionInicialY = posicionInicialY
  }


  /**
   * Crea una nueva posición para el objeto, estableciendola como la inicial
   * @param {{x: number, y: number}} posicion La nueva posición del objeto
   */
  establecerPosicion(posicion) {
    this.posicionX = posicion.x
    this.posicionY = posicion.y
    this.posicionInicialX = posicion.x
    this.posicionInicialY = posicion.y

    $(`#${this.id}`).css({
      left: posicion.x + width / 2 - 12.5 - jugador.coordenadaX,
      top: posicion.y + height / 2 - 12.5 - jugador.coordenadaY,
    })
  }

  /**
   * Función que elimina el elemento
   */
  eliminar() {
    $(`#${this.id}`).remove()
  }
}

/**
 * El elemento que controla el jugador
 * @class
 * @extends Elemento
 */
class Jugador extends Elemento {
  _coordenadaY;
  _coordenadaX;
  _velocidadY = 0;
  _velocidadX = 0;
  _velocidadExternaX = 0;
  _contacto = 0;
  _salto = false;
  _saltos = 0;
  _pared = false;
  _triggers = [];

  /**
   * Crea el jugador
   * @param {string} id La ID del jugador
   * @param {{x: number, y: number}} posicion La posición inicial del jugador
   * @param {{x: number, y: number}} tamaño El tamaño del jugador
   */
  constructor(id, posicion, tamaño) {
    super(id, posicion, tamaño, true)
    this.posicion = {
      x: width / 2 - 12.5,
      y: height / 2 - 12.5
    }
    this._coordenadaX = datosPartida.x
    this._coordenadaY = datosPartida.y
    $(`#${id}`).addClass("jugador")
  }

  /**
   * Obtiene las coordenadas del jugador
   * @returns {{x: number, y: number}} Las coordenadas del jugador
   */
  get coordenadas() {
    return { x: this._coordenadaX, y: this._coordenadaY }
  }

  /**
   * Obtiene la coordenada X del jugador
   * @returns {number} La coordenada X del jugador
   */
  get coordenadaX() {
    return this._coordenadaX
  }

  /**
   * Obtiene la coordenada Y del jugador
   * @returns {number} La coordenada Y del jugador
   */
  get coordenadaY() {
    return this._coordenadaY
  }

  /**
   * Modifica las coordenadas del jugador y mueve todos los elementos que no son el jugador, logrando que parezca que se mueve el jugador cuando en realidad se mueve todo lo demás
   * @param {{x: number, y: number}} coordenadas Las coordenadas que se sumarán con las anteriores
   */
  mover(coordenadas) {
    this._coordenadaX += coordenadas.x
    this._coordenadaY += coordenadas.y

    objetos.forEach(objeto => {
      objeto.posicionX = objeto.posicionInicialX - (objeto.Xmovida ?? 0) - this.coordenadaX + width / 2 - 12.5
      objeto.posicionY = objeto.posicionInicialY - (objeto.Ymovida ?? 0) - this.coordenadaY + height / 2 - 12.5
    })
  }

  /**
   * Modifica la coordenada X del jugador y mueve todos los elementos que no son el jugador, logrando que parezca que se mueve el jugador cuando en realidad se mueve todo lo demás
   * @param {{x: number, y: number}} coordenadas La coordenada X que se sumará con la anterior
   */
  moverX(coordenadaX) {
    this._coordenadaX += coordenadaX

    objetos.forEach(objeto => {
      objeto.posicionX = objeto.posicionInicialX - (objeto.Xmovida ?? 0) - this.coordenadaX + width / 2 - 12.5
    })
  }

  /**
   * Modifica la coordenada Y del jugador y mueve todos los elementos que no son el jugador, logrando que parezca que se mueve el jugador cuando en realidad se mueve todo lo demás
   * @param {{x: number, y: number}} coordenadas La coordenada Y que se sumará con la anterior
   */
  moverY(coordenadaY) {
    this._coordenadaY += coordenadaY
    objetos.forEach(objeto => {
      objeto.posicionY = objeto.posicionInicialY - (objeto.Ymovida ?? 0) - this.coordenadaY + height / 2 - 12.5
    })
  }

  /**
   * Obtiene la velocidad actual del jugador
   * @returns {{x: number, y: number}} La velocidad actual del jugador
   */
  get velocidad() {
    return { x: this._velocidadX, y: this._velocidadY }
  }

  /**
   * Establece la velocidad del jugador
   * @param {{x: number, y: number}} velocidad La velocidad del jugador
   */
  set velocidad(velocidad) {
    this._velocidadX = velocidad.x
    this._velocidadY = velocidad.y
  }

  /**
   * Obtiene la velocidad X del jugador
   * @returns {number} La velocidad X del jugador
   */
  get velocidadX() {
    return this._velocidadX
  }

  /**
   * Establece la velocidad X del jugador
   * @param {number} velocidadX La velocidad X del jugador
   */
  set velocidadX(velocidadX) {
    this._velocidadX = velocidadX
  }

  /**
   * Obtiene la velocidad Y del jugador
   * @returns {number} La velocidad Y del jugador
   */
  get velocidadY() {
    return this._velocidadY
  }

  /**
   * Establece la velocidad Y del jugador
   * @param {number} velocidadY La velocidad Y del jugador
   */
  set velocidadY(velocidadY) {
    this._velocidadY = velocidadY
  }

  /**
   * Obtiene la velocidad X del jugador adquirida por elementos externos como objetos móxviles
   * @returns {number} La velocidad X del jugador
   */
  get velocidadExternaX() {
    return this._velocidadExternaX
  }

  /**
   * Establece la velocidad X del jugador adquirida por elementos externos como objetos móxviles
   * @param {number} velocidadExternaX La velocidad X del jugador
   */
  set velocidadExternaX(velocidadExternaX) {
    this._velocidadExternaX = velocidadExternaX
  }

  /**
   * Obten si el jugador está saltando
   * @returns {boolean} True si el jugador está saltando
   */
  get salto() {
    return this._salto
  }

  /**
   * Establece si el jugador está saltando
   * @arg {boolean} salto True si el jugador está saltando
   */
  set salto(salto) {
    this._salto = salto
  }

  /**
   * Obten el número de saltos del jugador desde la última vez que hizo contacto con algún objeto
   * @returns {number} Número de saltos del jugador desde la última vez que hizo contacto con algún objeto
   */
  get saltos() {
    return this._saltos
  }

  /**
   * Establece el número de saltos del jugador desde la última vez que hizo contacto con algún objeto
   * @param {number} saltos Número de saltos del jugador desde la última vez que hizo contacto con algún objeto
   */
  set saltos(saltos) {
    this._saltos = saltos
  }

  /**
   * Obten si el jugador está en contacto con una pared
   * @returns {boolean} True si el jugador está en contacto con una pared
   */
  get pared() {
    return this._pared
  }

  /**
   * Establece si el jugador está en contacto con una pared
   * @arg {boolean} pared True si el jugador está en contacto con una pared
   */
  set pared(pared) {
    this._pared = pared
  }

  /**
   * Obtiene los frames restantes para que el jugador pueda saltar luego de haber hecho contacto con una superficio
   * @returns {number} Los frames restantes para que el jugador pueda saltar luego de haber hecho contacto con una superficio
   */
  get contacto() {
    return this._contacto
  }

  /**
   * Establece los frames restantes para que el jugador pueda saltar luego de haber hecho contacto con una superficio
   * @arg {number} contacto Los frames restantes para que el jugador pueda saltar luego de haber hecho contacto con una superficio
   */
  set contacto(contacto) {
    this._contacto = contacto
  }

  /**
   * Obtiene un array con la ID de los triggers que el jugador está colisionando
   * @returns {string[]} Array con la ID de los triggers que el jugador está colisionando
   */
  get triggers() {
    return this._triggers
  }

  /**
   * Establece un array con la ID de los triggers que el jugador está colisionando
   * @arg {string[]} triggers Array con la ID de los triggers que el jugador está colisionando
   */
  set triggers(triggers) {
    this._triggers = triggers
  }

  /**
   * Función que sirve para comprobar si el jugador está en contacto con cierto elemento
   * @param {Objeto | Trigger | Especial | Dañino | Movil | Movil_Dañino} objeto El elemento a comprobar si tiene una colisión con el jugador
   * @param {Function} bonus Función que sirve para comprobar si se tiene que aplicar algún bonus por culpa de que el objeto se esté moviendo. Esto permite que se registre la colisión incluso si el objeto es tan rápido que en un solo fotograma atraviesa el jugador
   * @returns {boolean} Devuelve true si el objeto está en contacto con el jugador y false si no
   */
  comprobarColision(objeto, bonus) {
    if (objeto.dañino) {
      if (this.Yinferior - 5 < objeto.Ysuperior) return false
      if (this.Xderecha - 5 < objeto.Xizquierda) return false
      if (this.Xizquierda + 5 > objeto.Xderecha) return false
      if (this.Ysuperior + 5 > objeto.Yinferior) return false
    } else {
      if (this.Yinferior + bonus("abajo") < objeto.Ysuperior) return false //Arriba del bloque
      if (this.Xderecha + bonus("derecha") < objeto.Xizquierda) return false // Izquierda del bloque
      if (this.Xizquierda + bonus("izquierda") > objeto.Xderecha) return false // Derecha del bloque
      if (this.Ysuperior + bonus("arriba") > objeto.Yinferior) return false // Abajo del bloque
    }
    return true
  }

  /**
   * Función que se ejecuta cada fotograma en respecto al jugador
   * @returns {true | undefined} Si el jugador no tocó un objeto dañino se devuelve true
   */
  tick() {
    // Aumenta la velocidad hacia abajo para que haga efecto de gravedad
    this.velocidadY++

    // Se limita la velocidad hacia abajo a 50, porque si no atraviesa objetos
    if (this.velocidadY > 50) this.velocidadY = 50

    // Map para almacenar las colisiones detectadas
    const colisiones = new Map()

    // Se crea el array de triggers
    this.triggers = []

    // Variable para evitar que el juego se siga ejecutando luego de que el jugador haya tocado algo rojo
    let nuevoJuego = false

    // Se recorren los objetos del juego
    objetos.map((objeto, n) => {
      // Si el jugador ha tocado algo rojo, no sigue
      if (!nuevoJuego) {
        // Objeto JSON para almacenar las variaciones que se aplicarán a la posición del jugador si tocó algún objeto
        const variaciones = {
          "abajo": this.Ysuperior - objeto.Yinferior,
          "arriba": this.Yinferior - objeto.Ysuperior,
          "izquierda": this.Xderecha - objeto.Xizquierda,
          "derecha": this.Xizquierda - objeto.Xderecha
        }

        // Función que sirve para comprobar si se tiene que aplicar algún bonus por culpa de que el objeto se esté moviendo. Esto permite que se registre la colisión incluso si el objeto es tan rápido que en un solo fotograma atraviesa el jugador
        let bonus = () => 0
        if (objeto.moviendose) {
          let tiempo
          if (typeof objeto.tiempo == "number") {
            tiempo = objeto.tiempo
          } else {
            tiempo = objeto.tiempo[[1, 0][Number(objeto.sentido == 1)]]
          }

          bonus = movimiento => {
            if (movimiento == "arriba") { // Plataforma se mueve hacia arriba
              if (objeto.movimientoY * objeto.sentido < 0) return objeto.movimientoY * objeto.sentido / tiempo
            } else if (movimiento == "abajo") { // Plataforma se mueve hacia abajo
              if (objeto.movimientoY * objeto.sentido > 0) return objeto.movimientoY * objeto.sentido / tiempo
            } else if (movimiento == "izquierda") { // Plataforma se mueve hacia izquierda
              if (objeto.movimientoX * objeto.sentido < 0) return objeto.movimientoX * objeto.sentido / tiempo
            } else if (movimiento == "derecha") { // Plataforma se mueve hacia derecha
              if (objeto.movimientoX * objeto.sentido > 0) return objeto.movimientoX * objeto.sentido / tiempo
            }
            return 0
          }
        }

        // Se comprueba la colisión del jugador con el objeto actual
        const colision = this.comprobarColision(objeto, bonus)

        // Si hay colisión con el objeto
        if (colision) {
          // Si el objeto es un trigger, se añade a la lista de triggers
          if (objeto.trigger) {
            this.triggers.push(objeto.id)
          } else if (objeto.dañino) {
            // Si el objeto es dañino, se manda el jugador al último checkpoint
            nuevoJuego = true
            clearInterval(interval)
            iniciarPartida()
          } else if (objeto.especial) {
            // Si el objeto es una bandera final, se finaliza el juego
            if (objeto.id.startsWith("bandera_final")) {
              nuevoJuego = true
              final()
            } else {
              // Si el objeto no es una bandera final, pero es especial, significa que actúa de checkpoint se actualizan las coordenadas del jugador y se elimina el objeto tocado

              datosPartida.x = objeto.posicionInicialX + 12.5
              datosPartida.y = objeto.posicionInicialY + 25

              if (checkpoint) {
                checkpoint.establecerPosicion({
                  x: datosPartida.x,
                  y: datosPartida.y
                })
              }

              datosPartida.checkpoint = objeto.id

              objeto.eliminar()
              objetos.splice(n, 1)

              const id = objeto.id.split("_")[0]

              // Si el objeto es una habilidad, se muestra y se activa
              if (Object.keys(habilidades).includes(id)) {
                if (!datosPartida[id]) {
                  datosPartida[id] = true
                  if (id == "piolet-rojo") {
                    if (datosPartida.piolet) {
                      $('#piolet').parent().remove()
                    } else {
                      datosPartida.piolet = true
                    }
                  }

                  mensajeHabilidad(id)
                  mostrarHabilidad(id)
                }
              }
            }
          } else {
            // Si el objeto no es trigger, especial ni dañino significa que es uno normal

            // Se determina la dirección de la colisión
            let lugar
            if (objeto.posicionAnterior.Ysuperior + 0.1 >= this.Yinferior) {
              lugar = "arriba"
            } else if (objeto.posicionAnterior.Yinferior < this.Ysuperior) {
              lugar = "abajo"
            } else if (objeto.posicionAnterior.Xizquierda > this.Xderecha) {
              lugar = "izquierda"
            } else if (objeto.posicionAnterior.Xderecha < this.Xizquierda) {
              lugar = "derecha"
            }

            // Si ya existe una colisión en ese lugar, se almacena la de mayor variación, si no, simplemente la almacena
            if (colisiones.has(lugar)) {
              if (variaciones[lugar] > colisiones.get(lugar)[0][lugar]) colisiones.set(lugar, [variaciones, objeto])
            } else {
              colisiones.set(lugar, [variaciones, objeto])
            }
          }
        }
      }
    })

    // Si el jugador ha tocado algo rojo, no sigue
    if (!nuevoJuego) {
      // Se baja un frame del contacto, que son los frames restantes para que el jugador pueda saltar luego de haber hecho contacto con una superficio
      if (this.contacto) this.contacto--

      // Si hay colisiones en la parte superior del objeto tocado o en ambos lados a la vez
      if (colisiones.has("arriba") || (colisiones.has("izquierda") && colisiones.has("derecha"))) {
        // Se reduce la velocidad X del jugador
        this.velocidadX *= 0.8
        this.velocidadExternaX *= 0.8

        // Si se tiene la habilidad de piolet rojo, se reinicia el contador de saltos
        if (datosPartida["piolet-rojo"]) {
          this.saltos = 0
        } else {
          // Si no se tiene la habilidad de piolet rojo significa que puede saltar y se define el contacto como 4 frames
          this.contacto = 4
        }
        // Se detiene la velocidad Y del jugador 
        this.velocidadY = 0

        // Se ajusta la posición del jugador según la colisión
        const colision = colisiones.get("arriba")
        this.moverY(-colision?.[0].arriba ?? -colisiones.get("derecha")[0].arriba)

        // Si la plataforma con la que colisiona se mueve, se ajusta la velocidad del jugador para que tome su velocidad
        if (colision?.[1].moviendose) {
          let tiempo
          if (typeof colision[1].tiempo == "number") {
            tiempo = colision[1].tiempo
          } else {
            tiempo = colision[1].tiempo[[1, 0][Number(colision[1].sentido == 1)]]
          }
          this.velocidadX += colision[1].movimientoX * colision[1].sentido / tiempo * 0.2
          this.velocidadY += this.velocidadY + colision[1].movimientoY * colision[1].sentido / tiempo

          this.velocidadExternaX += colision[1].movimientoX * colision[1].sentido / tiempo * 0.2
        }
      } else {
        // Si no hay colisiones en la parte superior ni en los lados se reduce la velocidad X del jugador en menor grado que cuando sí
        this.velocidadX *= 0.9
        this.velocidadExternaX *= 0.9
      }

      // Variable para indicar si el jugador tocó una pared
      this.pared = false

      // Si hay colisión a la izquierda del objeto y no a la derecha
      if (colisiones.has("izquierda") && !colisiones.has("derecha")) {

        // Si tenía velocidad hacia la derecha, se detiene
        if (this.velocidadX > 0) this.velocidadX = 0

        // Si se tiene la habilidad de piolet, se inicia la animación y se reinicia el contador de contacto
        if (datosPartida.piolet) {
          if (!this.contacto) animarHabilidad("piolet")
          this.contacto = 4
        }
        this.pared = true

        // Se ajusta la posición del jugador a la izquierda del objeto
        const colision = colisiones.get("izquierda")
        this.moverX(-colision[0].izquierda - 0.1)

        // Si la plataforma con la que colisiona se mueve hacia la izquierda, se ajusta la velocidad del jugador para que tome su velocidad
        if (colision[1].moviendose && (colision[1].movimientoX * colision[1].sentido) < 0) {
          let tiempo
          if (typeof colision[1].tiempo == "number") {
            tiempo = colision[1].tiempo
          } else {
            tiempo = colision[1].tiempo[[1, 0][Number(colision[1].sentido == 1)]]
          }
          this.velocidadX += colision[1].movimientoX * colision[1].sentido / tiempo
          this.velocidadExternaX += colision[1].movimientoX * colision[1].sentido / tiempo
        }

      }

      // Si hay colisión a la derecha del objeto y no a la izquierda
      if (colisiones.has("derecha") && !colisiones.has("izquierda")) {

        // Si tenía velocidad hacia la izquierda, se detiene
        if (this.velocidadX < 0) this.velocidadX = 0

        // Si se tiene la habilidad de piolet, se inicia la animación y se reinicia el contador de contacto
        if (datosPartida.piolet) {
          if (!this.contacto) animarHabilidad("piolet")
          this.contacto = 4
        }

        // Se ajusta la posición del jugador a la derecha del objeto
        const colision = colisiones.get("derecha")
        this.pared = true
        this.moverX(-colision[0].derecha + 0.1)

        // Si la plataforma con la que colisiona se mueve hacia la derecha, se ajusta la velocidad del jugador para que tome su velocidad
        if (colision?.[1].moviendose && (colision[1].movimientoX * colision[1].sentido) > 0) {
          let tiempo
          if (typeof colision[1].tiempo == "number") {
            tiempo = colision[1].tiempo
          } else {
            tiempo = colision[1].tiempo[[1, 0][Number(colision[1].sentido == 1)]]
          }
          this.velocidadX += colision[1].movimientoX * colision[1].sentido / tiempo
          this.velocidadExternaX += colision[1].movimientoX * colision[1].sentido / tiempo
        }
      }

      // Si hay colisión abajo dek ivheti
      if (colisiones.has("abajo")) {
        // Si la velocidad Y del jugador es hacia arriba, se detiene
        if (jugador.velocidadY < 0) jugador.velocidadY = 0

        // Se ajusta la posición del jugador abajo del objeto
        const colision = colisiones.get("abajo")
        this.moverY(-colision[0].abajo + 1)

        // Si la plataforma con la que colisiona se mueve hacia abajo, se ajusta la velocidad del jugador para que tome su velocidad
        if (colision?.[1].moviendose && (colision[1].movimientoY * colision[1].sentido) > 0) {
          let tiempo
          if (typeof colision[1].tiempo == "number") {
            tiempo = colision[1].tiempo
          } else {
            tiempo = colision[1].tiempo[[1, 0][Number(colision[1].sentido == 1)]]
          }
          this.velocidadY += colision[1].movimientoY * colision[1].sentido / tiempo
        }
      }

      // Si hay contacto con una plataforma, se reinicia el contador de saltos y se permite el salto
      if (this.contacto) {
        this.saltos = 0
        this.salto = true
      } else {
        // Si no hay contacto con una plataforma y el número de saltos es 0, se pone como 1 y se deja de permitir el salto
        if (this.saltos < 1) this.saltos = 1
        this.salto = false
      }

      return true
    }
  }
}

/**
 * Un simple objeto colisionable por el jugador
 * @class
 * @extends Elemento
 */
class Objeto extends Elemento {
  _posicionAnterior;

  /**
   * Crea un objeto
   * @param {{x: number, y: number} | false} posicion La posición del objeto. Si es false, da igual todo lo demás, no se craeará el objeto
   * @param {{x: number, y: number} | undefined} tamaño El tamaño del objeto. Está definido si posicion no es false
   * @param {string | undefined} id La ID del objeto. Si no está definida, se generará una para este objeto
   */
  constructor(posicion, tamaño, id) {
    if (posicion !== false) {
      if (!id) id = `elemento_${objetos.length}`
      super(id, posicion, tamaño)
      $(`#${id}`).addClass("objeto")
      objetos.push(this)
    } else {
      super(false)
    }
  }

  /**
   * Obtiene la posición del objeto en el frame anterior
   * @returns {{Xizquierda: number, Xderecha: number, Ysuperior: number, Yinferior: number}} La posición del objeto en el frame anterior
   */
  get posicionAnterior() {
    return this._posicionAnterior
  }

  /**
   * Establece la posición del objeto en el frame anterior
   * @arg {{Xizquierda: number, Xderecha: number, Ysuperior: number, Yinferior: number}} posicionAnterior La posición del objeto en el frame anterior
   */
  set posicionAnterior(posicionAnterior) {
    this._posicionAnterior = posicionAnterior
  }

  /**
   * Función que se ejecuta cada fotograma en respecto al objeto
   */
  tick() {
    this.posicionAnterior = {
      Xizquierda: this.Xizquierda,
      Xderecha: this.Xderecha,
      Ysuperior: this.Ysuperior,
      Yinferior: this.Yinferior
    }
  }
}

/**
 * Un objeto normalmente invisible que sirve para detectar si el jugador lo está tocando y ejecutar diferentes cosas según si esto es cierto
 * @class
 * @extends Objeto
 */
class Trigger extends Objeto {
  _trigger = true;

  /**
   * Crea un trigger
   * @param {{x: number, y: number}} posicion La posición del trigger
   * @param {{x: number, y: number}} tamaño El tamaño del trigger
   * @param {boolean} visible Si este trigger es visible por el jugador sin el devmode
   * @param {string | undefined} id La ID del trigger. Si no está definida, se generará una para este trigger
   */
  constructor(posicion, tamaño, visible, id) {
    super(posicion, tamaño, id)
    const elemento = $(`#${this.id}`)
    elemento.addClass("trigger")
    if (visible) elemento.css("background-color", "#f003")
  }

  /**
   * Obtiene si el objeto es un trigger
   * @returns {boolean} True si el objeto es un trigger
   */
  get trigger() {
    return this._trigger
  }
}

/**
 * Un objeto que puede representar habilidades, checkpoints o el final y que se consume al contacto
 * @class
 * @extends Objeto
 */
class Especial extends Objeto {
  _especial = true;

  /**
   * Crea un especial
   * @param {{x: number, y: number}} posicion La posición del especial
   * @param {string | undefined} id La ID del especial. Si no está definida, se generará una para este especial
   */
  constructor(posicion, id) {
    if (id != datosPartida.checkpoint) {
      super(posicion, { x: 50, y: 50 }, id)
      const especial = $(`#${this.id}`)
      especial.addClass("especial")
      const img = $("<img>")
      img.attr("src", `./img/${id.split("_")[0]}.png`)
      especial.append(img)
    } else {
      super(false)
    }
  }

  /**
   * Obtiene si el objeto es un especial
   * @returns {boolean} True si el objeto es un especial
   */
  get especial() {
    return this._especial
  }
}

/**
 * Un objeto que provoca al jugador ir a su último checkpoint al contacto
 * @class
 * @extends Objeto
 */
class Dañino extends Objeto {
  _dañino = true;

  /**
   * Crea un dañino
   * @param {{x: number, y: number}} posicion La posición del dañino
   * @param {{x: number, y: number}} tamaño El tamaño del dañino
   * @param {string | undefined} id La ID del dañino. Si no está definida, se generará una para este dañino
   */
  constructor(posicion, tamaño, id) {
    super(posicion, tamaño, id)
    $(`#${this.id}`).addClass("dañino")
  }

  /**
   * Obtiene si el objeto es dañino
   * @returns {boolean} True si el objeto es dañino
   */
  get dañino() {
    return this._dañino
  }
}

/**
 * Comprueba si un objeto movil debe ser renderizado
 * @param {{Ysuperior: number, Xizquierda: number, Xderecha: number, Yinferior: number}} renderizar Objeto estilo JSON que contiene la información necesaria para comprobar el renderizado
 * @returns {boolean} Devolverá true si se debe renderizar y false si no
 */
const comprobarRenderizado = renderizar => {
  if (jugador.Yinferior < renderizar.Ysuperior) return false
  if (jugador.Xderecha < renderizar.Xizquierda) return false
  if (jugador.Xizquierda > renderizar.Xderecha) return false
  if (jugador.Ysuperior > renderizar.Yinferior) return false
  return true
}

/**
 * Un objeto que se mueve de forma periódica
 * @class
 * @extends Objeto
 */
class Movil extends Objeto {
  _movil = true;
  _tiempo;
  _wait;
  _delay;
  _sentido = 1;
  _frame = 0;
  _iniciado = false;
  _triggerId;
  _moviendose = false;
  _movimientoX;
  _movimientoY;
  _Xmovida = 0;
  _Ymovida = 0;

  /**
   * Aloja, si se está en creación, el div que muestra dónde se moverá el objeto
   * @type {NodeJS.Timeout | undefined}
   */
  $final;

  /**
   * Crea un movil
   * @param {{x: number, y: number}} posicion La posición del movil
   * @param {{x: number, y: number}} tamaño El tamaño del movil
   * @param {number | [number, number]} tiempo El tiempo de movimiento hasta llegar al lugar donde moverse
   * @param {number | [number, number]} wait El tiempo de espera para empezar a moverse luego de cada ciclo
   * @param {number} delay El tiempo a esperar antes de hacer el primer ciclo
   * @param {{x: number, y: number}} movimiento El movimiento en coordenadas
   * @param {string | false} triggerId La ID del trigger que el jugador debe estar tocando para que el objeto se mueva. Se mueve siempre si es falsy
   * @param {string | undefined} id La ID del movil. Si no está definida, se generará una para este movil
   * @param {boolean | undefined} creador True si está en el creador para así mostrar el lugar al que se moverá
   */
  constructor(posicion, tamaño, tiempo, wait, delay, movimiento, triggerId, id, creador) {
    super(posicion, tamaño, id)
    $(`#${this.id}`).addClass("movil")
    this.tiempo = typeof tiempo == "number" ? tiempo / 30 : [tiempo[0] / 30, tiempo[1] / 30]
    this.wait = typeof wait == "number" ? wait / 30 : [wait[0] / 30, wait[1] / 30]
    this.delay = delay / 30 + 0.1
    this._movimientoX = movimiento.x
    this._movimientoY = movimiento.y
    this.triggerId = triggerId || false

    if (creador) {
      this.$final = $("<div>")
        .css({
          transform: `translate(${movimiento.x}px, ${movimiento.y}px)`,
          width: tamaño.x,
          height: tamaño.y
        })
      $(`#${this.id}`).append(this.$final)
    }
  }

  /**
   * Obtiene si el objeto es movil
   * @returns {boolean} True si el objeto es movil
   */
  get movil() {
    return this._movil
  }

  /**
   * Obtiene el tiempo de movimiento hasta llegar al lugar donde moverse
   * @returns {number | [number, number]} El tiempo de movimiento hasta llegar al lugar donde moverse
   */
  get tiempo() {
    return this._tiempo
  }

  /**
   * Establece el tiempo de movimiento hasta llegar al lugar donde moverse
   * @arg {number | [number, number]} tiempo El tiempo de movimiento hasta llegar al lugar donde moverse
   */
  set tiempo(tiempo) {
    this._tiempo = tiempo
  }

  /**
   * Obtiene el tiempo de espera para empezar a moverse luego de cada ciclo
   * @returns {number | [number, number]} El tiempo de espera para empezar a moverse luego de cada ciclo
   */
  get wait() {
    return this._wait
  }

  /**
   * Establece el tiempo de espera para empezar a moverse luego de cada ciclo
   * @arg {number | [number, number]} tiempo El tiempo de espera para empezar a moverse luego de cada ciclo
   */
  set wait(wait) {
    this._wait = wait
  }

  /**
   * Obtiene el tiempo a esperar antes de hacer el primer ciclo
   * @returns {number} El tiempo a esperar antes de hacer el primer ciclo
   */
  get delay() {
    return this._delay
  }

  /**
   * Establece el tiempo a esperar antes de hacer el primer ciclo
   * @arg {number} tiempo El tiempo a esperar antes de hacer el primer ciclo
   */
  set delay(delay) {
    this._delay = delay
  }

  /**
   * Obtiene el sentido hacia donde se mueve el objeto
   * @returns {-1 | 1} Sentido hacia donde se mueve el objeto
   */
  get sentido() {
    return this._sentido
  }

  /**
   * Establece el sentido hacia donde se mueve el objeto
   * @arg {-1 | 1} sentido Sentido hacia donde se mueve el objeto
   */
  set sentido(sentido) {
    this._sentido = sentido
  }

  /**
   * Obtiene el numero de frames del ciclo de movimiento actual
   * @returns {number} El numero de frames del ciclo de movimiento actual
   */
  get frame() {
    return this._frame
  }

  /**
   * Establece el numero de frames del ciclo de movimiento actual
   * @arg {number} frame El numero de frames del ciclo de movimiento actual
   */
  set frame(frame) {
    this._frame = frame
  }

  /**
   * Obtiene si el delay inicial ya terminó
   * @returns {boolean} Devuelve true si el delay inicial ya terminó
   */
  get iniciado() {
    return this._iniciado
  }

  /**
   * Establece si el delay inicial ya terminó
   * @arg {number} iniciado True si el delay inicial ya terminó
   */
  set iniciado(iniciado) {
    this._iniciado = iniciado
  }

  /**
   * Obtiene la ID del trigger que el jugador debe estar tocando para que el objeto se mueva
   * @returns  {string | false} La ID del trigger que el jugador debe estar tocando para que el objeto se mueva
   */
  get triggerId() {
    return this._triggerId
  }

  /**
   * Establece la ID del trigger que el jugador debe estar tocando para que el objeto se mueva
   * @arg {string | false} triggerId La ID del trigger que el jugador debe estar tocando para que el objeto se mueva
   */
  set triggerId(triggerId) {
    this._triggerId = triggerId
  }

  /**
   * Obtiene si el objeto se está moviendo en estos momentos
   * @returns {boolean} Devuelve true si el objeto se está moviendo en estos momentos
   */
  get moviendose() {
    return this._moviendose
  }

  /**
   * Establece si el objeto se está moviendo en estos momentos
   * @arg {boolean} moviendose True si el objeto se está moviendo en estos momentos
   */
  set moviendose(moviendose) {
    this._moviendose = moviendose
  }

  /**
   * Obtiene el movimiento X que hace el objeto cada ciclo
   * @returns {number} El movimiento X que hace el objeto cada ciclo
   */
  get movimientoX() {
    return this._movimientoX
  }

  /**
   * Establece el movimiento X que hace el objeto cada ciclo
   * @arg {number} movimientoX El movimiento X que hace el objeto cada ciclo
   */
  set movimientoX(movimientoX) {
    this._movimientoX = movimientoX

    this.$final?.css("transform", `translate(${this.movimientoX}px, ${this.movimientoY}px)`)
  }

  /**
  * Obtiene el movimiento Y que hace el objeto cada ciclo
  * @returns {number} El movimiento Y que hace el objeto cada ciclo
  */
  get movimientoY() {
    return this._movimientoY
  }

  /**
   * Establece el movimiento Y que hace el objeto cada ciclo
   * @arg {number} movimientoY El movimiento Y que hace el objeto cada ciclo
   */
  set movimientoY(movimientoY) {
    this._movimientoY = movimientoY

    this.$final?.css("transform", `translate(${this.movimientoX}px, ${this.movimientoY}px)`)
  }

  /**
 * Obtiene el estado de movimiento en X actual
 * @returns {number} El estado de movimiento en X actual
 */
  get Xmovida() {
    return this._Xmovida
  }

  /**
  * Obtiene el estado de movimiento en Y actual
  * @returns {number} El estado de movimiento en Y actual
  */
  get Ymovida() {
    return this._Ymovida
  }

  /**
  * Establece el estado de movimiento en X actual
  * @arg {number} Xmovida El estado de movimiento en X actual
  */
  set Xmovida(Xmovida) {
    this._Xmovida = Xmovida
  }

  /**
  * Establece el movimiento Y que hace el objeto cada ciclo
  * @arg {number} Ymovida El movimiento Y que hace el objeto cada ciclo
  */
  set Ymovida(Ymovida) {
    this._Ymovida = Ymovida
  }

  /**
  * Modificación del tamaño X del movil, en lugar de tamañoX
  * @arg {number} tamañoX El tamaño X del movil
  */
  set tamañoMovilX(tamañoX) {
    this.tamañoX = tamañoX
    this.$final.css({
      width: this.tamañoX,
      height: this.tamañoY
    })
  }

  /**
  * Modificación del tamaño Y del movil, en lugar de tamañoY
  * @arg {number} tamañoY El tamaño Y del movil
  */
  set tamañoMovilY(tamañoY) {
    this.tamañoY = tamañoY
    this.$final.css({
      width: this.tamañoX,
      height: this.tamañoY
    })
  }

  /**
   * Función que se ejecuta cada fotograma en respecto al objeto
   */
  tick() {
    // Se establece que el objeto no está en movimiento
    this.moviendose = false

    // Antes que nada se ejecuta el tick() de la clase Objeto de la cual es heredada
    super.tick()

    // Si el objeto no tiene triggerId o si el jugador está en contacto con el trigger
    if (!this.triggerId || jugador.triggers.includes(this.triggerId)) {
      // Se incrementa el contador de fotogramas de esta iteración de movimiento
      this.frame++

      // Si el objeto no ha sido iniciado y ha pasado el delay se inicia
      if (!this.iniciado) {
        if (this.frame >= this.delay) {
          this.iniciado = true
          this.frame = 0
        }
      } else {
        // Si el objeto ha sido iniciado

        // Se determina el sentido del movimiento y se obtienen los tiempos
        let sentido = Number(this.sentido == 1)

        let tiempo = this.tiempo
        let wait = this.wait

        // Si tiempo y wait no son números, se obtienen según el sentido del movimiento
        if (typeof tiempo != "number") tiempo = tiempo[[1, 0][sentido]]
        if (typeof wait != "number") wait = wait[sentido]

        // Si el objeto aún se está moviendo
        if (tiempo >= this.frame) {
          // Se establece que el objeto está en movimiento
          this.moviendose = true

          let porcentaje = this.frame / tiempo

          // Por si acaso el movimiento no es exacto, se establece el porcentaje a 1 si es el último movimiento del ciclo
          if (tiempo < this.frame + 1) porcentaje = 1

          // Se calcula la posición donde debe estar el objeto según el porcentaje de movimiento a Xmovida y Ymovida, valores que luego afectan en cómo se posicionan los elementos
          this.Xmovida = -this._movimientoX * (sentido == 1 ? porcentaje : 1 - porcentaje)
          this.Ymovida = -this._movimientoY * (sentido == 1 ? porcentaje : 1 - porcentaje)
        } else if (tiempo + wait < this.frame) {
          // Si ya ha terminado el wait y no está en movimiento, se reinicia el contador de fotogramas y se alterna el sentido del movimiento
          this.frame = 0
          this.sentido = [1, -1][sentido]
        }

        // Si no ha pasado ninguna de las anteriores significa que el objeto está en wait luego de moverse

      }
    }
  }
}

/**
 * Un objeto movil que provoca al jugador ir a su último checkpoint al contacto
 * @class
 * @extends Movil
 */
class Movil_Dañino extends Movil {
  _dañino = true;
  constructor(posicion, tamaño, tiempo, wait, delay, movimiento, triggerId, id, creador) {
    super(posicion, tamaño, tiempo, wait, delay, movimiento, triggerId, id, creador)
    $(`#${this.id}`).addClass("dañino")
  }

  /**
   * Obtiene si el objeto es un especial
   * @returns {boolean} True si el objeto es un especial
   */
  get dañino() {
    return this._dañino
  }
}

/**
 * Muestra un mensaje. Detendrá el interval si hay uno
 * @param {string | false | undefined} titulo El titulo del mensaje
 * @param {string | false | undefined} descripcion La descripción del mensaje
 * @param {boolean | undefined} peticion Será true si el mensaje está siendo ejecutado como petición
 * @returns {{$form: JQuery<HTMLElement>, $cerrar: JQuery<HTMLElement>} | undefined} Si es una petición, devolverá esto valores en vez de añadirlos al HTML
 */
function mensaje(titulo, descripcion, peticion) {
  if (interval) clearInterval(interval)

  const $form = $("<form>")
    .addClass("mensaje")
  $("#pantalla").append($form)

  if (titulo) {
    const h1 = $("<h1>")
      .text(titulo)
    $form.append(h1)
  }

  if (descripcion) {
    const $span = $("<span>")
      .html(descripcion)
    $form.append($span)
  }

  const $cerrar = $("<button>")
    .addClass("cerrar")
    .on("click", function (event) {
      event.preventDefault()
      eliminarMensaje(this)
    })

  const $spamButton = $("<span>")
    .html("🗙")
  $cerrar.append($spamButton)

  if (peticion) {
    return {
      $form,
      $cerrar
    }
  } else {
    $form.append($cerrar)
    $cerrar.trigger("focus")
  }
}

/**
 * Ejecuta una petición. Lo hace mediante mostrar un mensaje con algunos elementos adicionales
 * @param {string | false | undefined} titulo El titulo del mensaje
 * @param {string | false | undefined} descripcion La descripción del mensaje
 * @param {function | undefined} continuacion Si está definido se ejecutará la función luego de que el jugador termine de escribir el input
 */
function peticion(titulo, descripcion, continuacion) {
  const datosMensaje = mensaje(titulo, descripcion, true)
  const $form = datosMensaje.$form
  const $input = $("<input>")
    .attr("required", "required")
  $form.append($input)
  const $aceptar = $("<button>")
    .addClass("aceptar")
    .attr("type", "submit")
    .text("Aceptar")
    .on("click", function (event) {
      event.preventDefault()
      eliminarMensaje(this)
      if (continuacion) continuacion($input.val())
    })
  $form.append($aceptar)

  $form.append(datosMensaje.$cerrar)

  $input.trigger("focus")
}

/**
 * Función para el botón de borrar un mensaje. Además de borrar el mensaje retomará el interval si hay uno
 * @param {JQuery<HTMLElement>} $elemento El botón que ejecuta la eliminación
 */
function eliminarMensaje($elemento) {
  $elemento.parentElement.remove()
  if (iniciarInterval) iniciarInterval()
}

/**
 * Muestra un mensaje al obtener una habilidad
 * @param {string} id La ID de la habilidad obtenida
 */
function mensajeHabilidad(id) {
  mensaje(`¡Has adqurido '${habilidades[id].Nombre}'!`, habilidades[id].Obtencion)
}

/**
 * Añade la habilidad al HTML entre otras cosas al momento de obtenerla
 * @param {string} id La ID de la habilidad obtenida
 */
function mostrarHabilidad(id) {
  const $habilidad = $("<div>")
    .addClass("habilidad")
    .css("cursor", "pointer")
    .on("click", function () {
      if (devMode) {
        $(this).remove()
        if (id == "bota") datosPartida.bota = false
        if (id == "piolet") datosPartida.piolet = false
        if (id == "piolet-rojo") {
          datosPartida["piolet-rojo"] = false
          if (!$('#piolet')[0]) datosPartida.piolet = false
        }
      }
    })
  $("#habilidades").append($habilidad)
  const $img = $("<img>")
    .attr("id", id)
    .attr("src", `./img/${id}.png`)
  $habilidad.append($img)

  const $mensaje = $("<div>")
    .addClass("mensaje")
  $habilidad.append($mensaje)

  const $h1 = $("<h1>")
    .text(habilidades[id].Nombre)
  $mensaje.append($h1)

  const $span = $("<span>")
    .text(habilidades[id].Descripcion)
  $mensaje.append($span)
}

/**
 * Anima una habilidad cuando es usada
 * @param {string} id La ID de la habilidad usada
 */
function animarHabilidad(id) {
  if (id == "piolet" && datosPartida["piolet-rojo"]) id = "piolet-rojo"
  const $img = $(`#${id}`)
  $img.animate({ scale: 1.1 }, 50, () => {
    $img.animate({ scale: 1.2, rotate: "10deg" }, 50, () => {
      $img.animate({ scale: 1.3, rotate: "-10deg" }, 50, () => {
        $img.animate({ scale: 1.2, rotate: "0deg" }, 50, () => {
          $img.animate({ scale: 1 }, 50)
        })
      })
    })
  })

  const $imgClone = $img.clone()
    .css({
      width: "50px",
      height: "50px",
      opacity: 0.5,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -150%)"
    })
    .animate({ opacity: 0, transform: "translate(-25%, -150%)" }, 200, () => {
      $imgClone.remove()
    })
  $("#pantalla").append($imgClone)
}

/**
 * El final del juego o de la creación, ejecutando de nuevo el menú
 * @param {boolean | undefined} noIniciarMenu Si es true, no iniciará el menú al ejecutarla
 */
function final(noIniciarMenu) {
  $("#menu").html("")
  $("#pantalla").html("")
  $("#partida").html("")

  clearInterval(interval)

  if (!noIniciarMenu) iniciarMenu()

  interval = undefined
  iniciarInterval = undefined
  datosPartida = {}
  frame = 0
  jugador = undefined
  objetos = undefined
  height = undefined
  width = undefined
  limiteAbajo = 600

  checkpoint = undefined
}

/**
 * Función para generar un nivel desde su ID
 * @param {"juego" | "creador"} tipoNivel Define cómo se debe ejecutar este generar nivel
 * @param {Object | undefined} nivel Si es de tipo "creador", el objeto donde se deben almacenar todos los elementos
 * @param {function | undefined} nivel Si es de tipo "creador", la función donde se edita el elmento creado
 * @returns {boolean} Devolverá true si se generó con éxito o false si no
 */
function generarNivel(tipoNivel, nivel, editarElemento) {
  try {
    const datosNivel = datosPartida.nivel.split(";")
    if (!datosNivel.length) throw Error("Esta ID no tiene elementos")
    limiteAbajo = parseInt(datosNivel.splice(0, 1)[0])
    if (typeof limiteAbajo != "number" || isNaN(limiteAbajo)) throw Error("Esta ID tiene una Y mínima inválida")


    datosNivel.forEach((objeto, n) => {
      const datosObjeto = objeto.split(",")
      const tipo = {
        "0": "objeto",
        "1": "dañino",
        "2": "especial",
        "3": "trigger",
        "4": "movil",
        "5": "movil_dañino"
      }[datosObjeto[0]]

      let objetoClass, id = `${tipo}_${n}`
      if (datosObjeto[0] == "0") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const tamañoX = parseInt(datosObjeto[3])
        const tamañoY = parseInt(datosObjeto[4])

        if (isNaN(posicionX)) throw Error(`El elemento objeto ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento objeto ${n} tiene una posicionY inválida`)
        if (isNaN(tamañoX)) throw Error(`El elemento objeto ${n} tiene un tamañoX inválido`)
        if (isNaN(tamañoY)) throw Error(`El elemento objeto ${n} tiene un tamañoY inválido`)

        objetoClass = new Objeto(
          { x: posicionX, y: posicionY },
          { x: tamañoX, y: tamañoY },
          id
        )
      } else if (datosObjeto[0] == "1") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const tamañoX = parseInt(datosObjeto[3])
        const tamañoY = parseInt(datosObjeto[4])

        if (isNaN(posicionX)) throw Error(`El elemento dañino ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento dañino ${n} tiene una posicionY inválida`)
        if (isNaN(tamañoX)) throw Error(`El elemento dañino ${n} tiene un tamañoX inválido`)
        if (isNaN(tamañoY)) throw Error(`El elemento dañino ${n} tiene un tamañoY inválido`)

        objetoClass = new Dañino(
          { x: posicionX, y: posicionY },
          { x: tamañoX, y: tamañoY },
          id
        )
      } else if (datosObjeto[0] == "2") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const idObjeto = datosObjeto[3]

        if (isNaN(posicionX)) throw Error(`El elemento especial ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento especial ${n} tiene una posicionY inválida`)
        if (!idObjeto) throw Error(`El elemento especial ${n} no tiene una ID`)

        objetoClass = new Especial(
          { x: posicionX, y: posicionY },
          idObjeto
        )
        id = idObjeto
      } else if (datosObjeto[0] == "3") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const tamañoX = parseInt(datosObjeto[3])
        const tamañoY = parseInt(datosObjeto[4])
        const idObjeto = datosObjeto[6]

        if (isNaN(posicionX)) throw Error(`El elemento trigger ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento trigger ${n} tiene una posicionY inválida`)
        if (isNaN(tamañoX)) throw Error(`El elemento trigger ${n} tiene un tamañoX inválido`)
        if (isNaN(tamañoY)) throw Error(`El elemento trigger ${n} tiene un tamañoY inválido`)
        if (!idObjeto) throw Error(`El elemento trigger ${n} no tiene una ID`)

        const visible = datosObjeto[5] == "true"

        objetoClass = new Trigger(
          { x: posicionX, y: posicionY },
          { x: tamañoX, y: tamañoY },
          visible,
          idObjeto
        )
        id = idObjeto
        if (tipoNivel == "creador") $(`#${id}`).text(id)
      } else if (datosObjeto[0] == "4") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const tamañoX = parseInt(datosObjeto[3])
        const tamañoY = parseInt(datosObjeto[4])

        const tiempoVuelta = parseInt(datosObjeto[5])
        const tiempoIda = parseInt(datosObjeto[6])
        const waitVuelta = parseInt(datosObjeto[7])
        const waitIda = parseInt(datosObjeto[8])
        const delay = parseInt(datosObjeto[9])
        const movimientoX = parseInt(datosObjeto[10])
        const movimientoY = parseInt(datosObjeto[11])

        if (isNaN(posicionX)) throw Error(`El elemento movil ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento movil ${n} tiene una posicionY inválida`)
        if (isNaN(tamañoX)) throw Error(`El elemento movil ${n} tiene un tamañoX inválido`)
        if (isNaN(tamañoY)) throw Error(`El elemento movil ${n} tiene un tamañoY inválido`)

        if (isNaN(tiempoVuelta)) throw Error(`El elemento movil ${n} tiene un tiempo de vuelta inválido`)
        if (isNaN(tiempoIda)) throw Error(`El elemento movil ${n} tiene un tiempo de ida inválido`)
        if (isNaN(waitVuelta)) throw Error(`El elemento movil ${n} tiene una espera de vuelta inválida`)
        if (isNaN(waitIda)) throw Error(`El elemento movil ${n} tiene una espera de ida inválida`)
        if (isNaN(delay)) throw Error(`El elemento movil ${n} tiene un delay inválido`)

        if (isNaN(movimientoX)) throw Error(`El elemento movil ${n} tiene un movimientoX inválido`)
        if (isNaN(movimientoY)) throw Error(`El elemento movil ${n} tiene un movimientoY inválido`)

        const triggerId = datosObjeto[12] ?? ""

        objetoClass = new Movil(
          { x: posicionX, y: posicionY },
          { x: tamañoX, y: tamañoY },
          [tiempoVuelta, tiempoIda],
          [waitVuelta, waitIda],
          delay,
          { x: movimientoX, y: movimientoY },
          triggerId,
          id,
          tipoNivel == "creador"
        )
      } else if (datosObjeto[0] == "5") {
        const posicionX = parseInt(datosObjeto[1])
        const posicionY = parseInt(datosObjeto[2])
        const tamañoX = parseInt(datosObjeto[3])
        const tamañoY = parseInt(datosObjeto[4])

        const tiempoVuelta = parseInt(datosObjeto[5])
        const tiempoIda = parseInt(datosObjeto[6])
        const waitVuelta = parseInt(datosObjeto[7])
        const waitIda = parseInt(datosObjeto[8])
        const delay = parseInt(datosObjeto[9])
        const movimientoX = parseInt(datosObjeto[10])
        const movimientoY = parseInt(datosObjeto[11])

        if (isNaN(posicionX)) throw Error(`El elemento movil_dañino ${n} tiene una posiciónX inválida`)
        if (isNaN(posicionY)) throw Error(`El elemento movil_dañino ${n} tiene una posicionY inválida`)
        if (isNaN(tamañoX)) throw Error(`El elemento movil_dañino ${n} tiene un tamañoX inválido`)
        if (isNaN(tamañoY)) throw Error(`El elemento movil_dañino ${n} tiene un tamañoY inválido`)

        if (isNaN(tiempoVuelta)) throw Error(`El elemento movil_dañino ${n} tiene un tiempo de vuelta inválido`)
        if (isNaN(tiempoIda)) throw Error(`El elemento movil_dañino ${n} tiene un tiempo de ida inválido`)
        if (isNaN(waitVuelta)) throw Error(`El elemento movil_dañino ${n} tiene una espera de vuelta inválida`)
        if (isNaN(waitIda)) throw Error(`El elemento movil_dañino ${n} tiene una espera de ida inválida`)
        if (isNaN(delay)) throw Error(`El elemento movil_dañino ${n} tiene un delay inválido`)

        if (isNaN(movimientoX)) throw Error(`El elemento movil_dañino ${n} tiene un movimientoX inválido`)
        if (isNaN(movimientoY)) throw Error(`El elemento movil_dañino ${n} tiene un movimientoY inválido`)

        const triggerId = datosObjeto[12] ?? ""

        objetoClass = new Movil_Dañino(
          { x: posicionX, y: posicionY },
          { x: tamañoX, y: tamañoY },
          [tiempoVuelta, tiempoIda],
          [waitVuelta, waitIda],
          delay,
          { x: movimientoX, y: movimientoY },
          triggerId,
          id,
          tipoNivel == "creador"
        )
      } else {
        throw Error(`El elemento ${n} es inválido`)
      }

      if (tipoNivel == "creador") {
        nivel[id] = {
          "tipo": datosObjeto[0],
          "datos": datosObjeto.slice(1),
          "objeto": objetoClass
        }

        $(`#${id}`)
          .on("click", function () {
            editarElemento(tipo, this.id)
          })
      }
    })

    return true
  } catch (error) {
    mensaje("ID de Nivel inválida", error)
    return false
  }
}

// Aquí se definen las funciones de niveles default, los cuales no se rigen por una ID para evitar problemas entre versiones
const nivelesDefault = {
  "1": () => {

    // PLATAFORMA INICIAL
    new Objeto({ x: -75, y: 50 }, { x: 125, y: 25 })

    new Dañino({ x: -75, y: 25 }, { x: 25, y: 25 })


    // IZQUIERDA PLATAFORMA
    new Objeto({ x: 125, y: -50 }, { x: 25, y: 25 })

    new Objeto({ x: -75, y: -125 }, { x: 50, y: 25 })

    new Objeto({ x: -100, y: -250 }, { x: 25, y: 325 })

    new Objeto({ x: -125, y: -0 }, { x: 25, y: 25 })

    new Objeto({ x: -325, y: 50 }, { x: 100, y: 25 })


    // DERECHA PLATAFORMA
    new Objeto({ x: 150, y: 175 }, { x: 50, y: 25 })

    new Objeto({ x: 500, y: 0 }, { x: 75, y: 25 })

    new Dañino({ x: 550, y: -25 }, { x: 25, y: 25 })

    new Dañino({ x: 700, y: -325 }, { x: 25, y: 350 })

    new Objeto({ x: 850, y: 100 }, { x: 75, y: 25 })

    new Objeto({ x: 725, y: 0 }, { x: 50, y: 25 })

    new Objeto({ x: 725, y: -200 }, { x: 50, y: 25 })

    new Objeto({ x: 700, y: -350 }, { x: 25, y: 25 })

    new Objeto({ x: 1000, y: -500 }, { x: 100, y: 25 })

    new Objeto({ x: 500, y: -600 }, { x: 25, y: 100 })

    new Dañino({ x: 500, y: -625 }, { x: 25, y: 25 })



    // ARRIBA PLATAFORMA
    new Objeto({ x: 150, y: -500 }, { x: 25, y: 500 })

    new Objeto({ x: 175, y: -500 }, { x: 50, y: 25 })

    new Objeto({ x: 125, y: -2000 }, { x: 25, y: 1400 })

    new Objeto({ x: 275, y: -1400 }, { x: 25, y: 650 })


    new Dañino({ x: 125, y: -775 }, { x: 25, y: 50 })

    new Dañino({ x: 125, y: -1075 }, { x: 25, y: 50 })

    new Dañino({ x: 125, y: -1375 }, { x: 25, y: 50 })

    new Dañino({ x: 125, y: -1675 }, { x: 25, y: 50 })

    new Dañino({ x: 125, y: -2025 }, { x: 25, y: 25 })


    new Dañino({ x: 275, y: -925 }, { x: 25, y: 50 })

    new Dañino({ x: 275, y: -1225 }, { x: 25, y: 50 })

    new Dañino({ x: 275, y: -1425 }, { x: 25, y: 25 })


    new Objeto({ x: 300, y: -1650 }, { x: 50, y: 25 })

    new Objeto({ x: 500, y: -2000 }, { x: 100, y: 25 })

    new Objeto({ x: 900, y: -2400 }, { x: 25, y: 250 })

    new Objeto({ x: 925, y: -2400 }, { x: 100, y: 25 })

    new Dañino({ x: 400, y: -1300 }, { x: 500, y: 25 })


    // PARTE FINAL

    new Dañino({ x: 1400, y: -3000 }, { x: 25, y: 2100 })

    new Dañino({ x: 1000, y: -2375 }, { x: 25, y: 1475 })


    new Dañino({ x: 1200, y: -2200 }, { x: 100, y: 25 })

    new Dañino({ x: 1025, y: -2200 }, { x: 100, y: 25 })

    new Dañino({ x: 1100, y: -2000 }, { x: 100, y: 25 })

    new Dañino({ x: 1300, y: -1900 }, { x: 100, y: 25 })

    new Dañino({ x: 1200, y: -1900 }, { x: 25, y: 25 })

    new Dañino({ x: 1200, y: -1700 }, { x: 25, y: 200 })

    new Dañino({ x: 1300, y: -1600 }, { x: 25, y: 25 })

    new Dañino({ x: 1100, y: -1600 }, { x: 25, y: 25 })

    new Dañino({ x: 1025, y: -1200 }, { x: 150, y: 25 })

    new Dañino({ x: 1250, y: -1200 }, { x: 150, y: 25 })


    new Objeto({ x: 1025, y: -925 }, { x: 375, y: 25 })


    // OBJETOS ESPECIALES
    if (!datosPartida.bota) new Especial({ x: -300, y: 0 }, "bota_0")

    if (!datosPartida.piolet) new Especial({ x: 1025, y: -550 }, "piolet_0")

    // BANDERAS

    new Especial({ x: 950, y: -2450 }, "bandera_0")

    new Especial({ x: 1050, y: -975 }, "bandera_final")

    return "default"
  },
  "2": () => {

    // PARTE 1
    new Objeto({ x: -200, y: 50 }, { x: 475, y: 25 })

    if (!datosPartida.piolet) new Especial({ x: -150, y: 0 }, "piolet-rojo_0")

    new Objeto({ x: -200, y: -275 }, { x: 25, y: 275 })

    new Dañino({ x: -200, y: 0 }, { x: 25, y: 50 })

    new Dañino({ x: 300, y: -200 }, { x: 25, y: 200 })

    new Objeto({ x: 400, y: 50 }, { x: 25, y: 150 })

    new Objeto({ x: 425, y: 50 }, { x: 100, y: 25 })

    new Objeto({ x: 525, y: 25 }, { x: 25, y: 50 })

    new Objeto({ x: 400, y: -125 }, { x: 25, y: 100 })

    new Objeto({ x: 600, y: -225 }, { x: 25, y: 100 })

    new Objeto({ x: 350, y: -300 }, { x: 100, y: 25 })

    new Objeto({ x: 100, y: -100 }, { x: 100, y: 25 })
    new Objeto({ x: 75, y: -125 }, { x: 25, y: 50 })

    new Especial({ x: 125, y: -150 }, "bandera_0")

    // PARTE 2

    new Objeto({ x: 0, y: -300 }, { x: 200, y: 25 })

    new Objeto({ x: -300, y: -400 }, { x: 25, y: 100 })

    new Dañino({ x: -300, y: -500 }, { x: 25, y: 100 })

    new Dañino({ x: -300, y: -300 }, { x: 25, y: 100 })

    new Objeto({ x: -200, y: -500 }, { x: 25, y: 100 })

    new Objeto({ x: 50, y: -500 }, { x: 25, y: 100 })

    new Objeto({ x: 75, y: -500 }, { x: 100, y: 25 })
    new Objeto({ x: 175, y: -525 }, { x: 25, y: 50 })

    new Objeto({ x: 300, y: -650 }, { x: 25, y: 100 })
    new Dañino({ x: 300, y: -660 }, { x: 25, y: 10 })

    new Objeto({ x: 475, y: -550 }, { x: 100, y: 25 })

    new Especial({ x: 500, y: -600 }, "bota_0")

    // PARTE 3

    new Dañino({ x: -525, y: -425 }, { x: 175, y: 25 })
    new Objeto({ x: -525, y: -400 }, { x: 125, y: 25 })

    new Objeto({ x: -525, y: -300 }, { x: 150, y: 25 })
    new Dañino({ x: -375, y: -300 }, { x: 25, y: 25 })

    new Objeto({ x: -400, y: 0 }, { x: 150, y: 25 })

    new Dañino({ x: -250, y: -100 }, { x: 25, y: 25 })

    new Dañino({ x: -500, y: -60 }, { x: 25, y: 10 })
    new Dañino({ x: -475, y: -50 }, { x: 10, y: 75 })
    new Objeto({ x: -500, y: -50 }, { x: 25, y: 75 })

    new Dañino({ x: -800, y: -160 }, { x: 25, y: 10 })
    new Objeto({ x: -800, y: -150 }, { x: 25, y: 75 })

    new Especial({ x: -500, y: -350 }, "bandera_final")

    return "default"
  },
  "3": () => {

    // PARTE 1
    new Trigger({ x: -150, y: -250 }, { x: 1000, y: 400 }, false, "area_1_1")

    new Objeto({ x: -50, y: 50 }, { x: 800, y: 25 })
    new Objeto({ x: -50, y: -175 }, { x: 800, y: 25 })

    for (let i = 0; i < 20; i++) {
      new Movil_Dañino({ x: 150 + i * 25, y: -50 }, { x: 25, y: 100 }, 600, 400, i * 200, { x: 0, y: -100 }, "area_1_1")
    }

    new Trigger({ x: 700, y: -300 }, { x: 1200, y: 500 }, false, "area_1_2")

    new Movil({ x: 900, y: 50 }, { x: 100, y: 25 }, 2000, 1000, 1000, { x: 500, y: 0 }, "area_1_2")

    new Movil({ x: 1700, y: -50 }, { x: 100, y: 25 }, 2000, 1000, 1000, { x: -500, y: 0 }, "area_1_2")

    new Movil({ x: 900, y: -150 }, { x: 100, y: 25 }, 2000, 1000, 1000, { x: 500, y: 0 }, "area_1_2")

    new Objeto({ x: 1800, y: -50 }, { x: 100, y: 25 })

    new Especial({ x: 1825, y: -100 }, "bandera_0")

    // PARTE 2

    new Trigger({ x: 1800, y: -300 }, { x: 1000, y: 700 }, false, "area_2")

    new Objeto({ x: 2000, y: -150 }, { x: 25, y: 425 })
    new Objeto({ x: 2500, y: -150 }, { x: 25, y: 425 })

    new Dañino({ x: 2500, y: -350 }, { x: 25, y: 200 })

    new Objeto({ x: 2025, y: -150 }, { x: 400, y: 25 })
    new Objeto({ x: 2025, y: 50 }, { x: 400, y: 25 })
    new Objeto({ x: 2025, y: 250 }, { x: 400, y: 25 })

    new Objeto({ x: 2100, y: -50 }, { x: 400, y: 25 })
    new Objeto({ x: 2100, y: 150 }, { x: 400, y: 25 })

    new Movil_Dañino({ x: 2000, y: -125 }, { x: 25, y: 75 }, 2000, 500, 0, { x: 500, y: 0 }, "area_2")

    new Movil_Dañino({ x: 2500, y: -25 }, { x: 25, y: 75 }, 2000, 500, 0, { x: -500, y: 0 }, "area_2")

    new Movil_Dañino({ x: 2500, y: 125 }, { x: 25, y: 25 }, 900, 200, 0, { x: -500, y: 0 }, "area_2")

    new Movil_Dañino({ x: 2100, y: 275 }, { x: 25, y: 75 }, 300, [200, 0], 0, { x: 0, y: -100 }, "area_2")

    new Movil_Dañino({ x: 2225, y: 275 }, { x: 25, y: 75 }, [300, 600], [200, 0], 200, { x: 0, y: -100 }, "area_2")
    new Movil_Dañino({ x: 2250, y: 275 }, { x: 25, y: 75 }, [300, 600], [200, 0], 300, { x: 0, y: -100 }, "area_2")

    new Movil_Dañino({ x: 2375, y: 175 }, { x: 25, y: 75 }, 150, [1000, 200], 300, { x: 0, y: 100 }, "area_2")

    new Objeto({ x: 2400, y: 350 }, { x: 225, y: 25 })

    new Especial({ x: 2550, y: 300 }, "piolet_0")

    // PARTE 3

    new Trigger({ x: 2400, y: -1000 }, { x: 1000, y: 1400 }, false, "area_3")

    new Movil({ x: 2900, y: 0 }, { x: 100, y: 25 }, 1000, 1000, 0, { x: -200, y: 100 }, "area_3")

    new Movil({ x: 3025, y: -500 }, { x: 75, y: 25 }, 1000, 1000, 0, { x: 0, y: 200 }, "area_3")
    new Movil({ x: 3000, y: -500 }, { x: 25, y: 400 }, 1000, 1000, 0, { x: 0, y: 200 }, "area_3")

    new Movil({ x: 3200, y: -500 }, { x: 100, y: 25 }, [150, 2000], 2000, 1000, { x: -300, y: -150 }, "area_3")
    new Movil({ x: 3300, y: -550 }, { x: 25, y: 75 }, [150, 2000], 2000, 1000, { x: -300, y: -150 }, "area_3")

    new Especial({ x: 400, y: -400 }, "bandera_1")

    // PARTE 4

    new Trigger({ x: -1800, y: -600 }, { x: 1600, y: 300 }, false, "area_4")

    new Objeto({ x: 300, y: -350 }, { x: 25, y: 175 })

    new Dañino({ x: 300, y: -550 }, { x: 25, y: 200 })

    new Objeto({ x: 500, y: -500 }, { x: 25, y: 100 })

    new Objeto({ x: -1800, y: -300 }, { x: 1600, y: 25 })
    new Movil_Dañino({ x: -1800, y: -600 }, { x: 1600, y: 25 }, 2000, 1000, 1000, { x: 0, y: -500 }, "area_5")
    new Objeto({ x: -1800, y: -625 }, { x: 1600, y: 25 })

    new Movil({ x: -1600, y: -200 }, { x: 1200, y: 25 }, [150, 600], [600, 0], 1200, { x: 0, y: -150 }, "area_4")

    new Especial({ x: -1750, y: -350 }, "bota_0")

    new Especial({ x: 125, y: -750 }, "bandera_2")

    // PARTE 5

    new Trigger({ x: -1900, y: -1600 }, { x: 1800, y: 1000 }, false, "area_5")

    new Objeto({ x: -100, y: -500 }, { x: 100, y: 25 })

    new Objeto({ x: 100, y: -700 }, { x: 100, y: 25 })

    new Objeto({ x: -400, y: -800 }, { x: 100, y: 25 })

    new Objeto({ x: -700, y: -1000 }, { x: 100, y: 25 })

    new Objeto({ x: -500, y: -1200 }, { x: 100, y: 25 })

    new Objeto({ x: -1200, y: -1200 }, { x: 100, y: 25 })

    new Objeto({ x: -2250, y: -800 }, { x: 300, y: 25 })

    new Especial({ x: -2225, y: -850 }, "bandera_final")

    return "default"
  }
}
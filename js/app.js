/*-------------------------------------
  |  Código escrito por Ramiro Yaben  |
  |  ramiroyaben@gmail.com            |
  -------------------------------------

TODO: Ordenar la lista de palabras alfabéticamente.
      Ordenar la lista de registros por columna.
      Jugabilidad touch y sin escribir.*/

$(document).ready( function($){

    //Variables de elementos HTML seleccionados con JQuery.
    $temporizador = $('#temporizador');
    $descripcion = $('#jugadores')
    $borrarPalabra = $('#borrar-palabra');
    $agregarPalabra = $('#agregar-palabra');
    $palabra = $('#palabra');
    $listaPalabras = $('#lista-palabras');
    $conteoPuntos = $('#puntos-acumulados');
    $conteoPalabras = $('#palabras-anotadas');
    $borrarPartida = $('#borrar-partida');
    $contenedoresNavegacion = $(".navegacion-contenedor");
    $guardarRegistro = $('#guardar-registro');
    $pestanas = $('.pestana');
    $areaDeJuego = $('#area-juego');
    $registros = $('#registros');
    $grillaRegistros = $('#grilla-registros');
    $registrosGrilla = $('.grilla-registro');
    $titulosGrilla = $('.grilla-titulo');
    $palabrasRegistro = $('#registro-palabras');
    $ajustes = $('#ajustes');
    $sliderVolumen = $('#slider-volumen');
    $sliderAnotacion = $('#slider-anotacion');
    $duracionSegundos = $('#duracion-segundos');
    $ordenPalabras = $('#ordenamiento-palabras input');
    $tipoTablero = $('#tipo-tablero input');
    $tableroVirtual = $('#tablero-virtual');
    $cargaRegistro = $('#carga-registro');
    $vaciarRegistros = $('#vaciar-registros');
    $opcionesTablero = $('#lista-tableros');

    //Variables de tableros.
    var tableroBoggleEspanolKipos = [
        ['N', 'D', 'S', 'E', 'A', 'O'], ['A', 'O', 'U', 'E', 'A', 'I'],
        ['N', 'I', 'T', 'A', 'G', 'U'], ['V', 'O', 'N', 'J', 'S', 'L'],
        ['E', 'S', 'O', 'Ñ', 'A', 'D'], ['E', 'Qu', 'O', 'S', 'H', 'D'],
        ['C', 'E', 'N', 'O', 'L', 'S'], ['D', 'T', 'A', 'R', 'O', 'I'],
        ['C', 'N', 'I', 'R', 'T', 'F'], ['P', 'S', 'C', 'E', 'L', 'O'],
        ['E', 'H', 'I', 'X', 'U', 'R'], ['B', 'O', 'M', 'L', 'E', 'Z'],
        ['A', 'R', 'E', 'C', 'M', 'A'], ['S', 'A', 'C', 'E', 'N', 'O'],
        ['P', 'O', 'D', 'E', 'T', 'A'], ['B', 'R', 'A', 'E', 'L', 'A']     
    ];
    var tableroScrabbleBoggleElectronicoEspanolHasbro = [
        ['A', 'R', 'H', 'S', 'D', 'E'], ['F', 'U', 'A', 'A', 'R', 'B'],
        ['I', 'O', 'T', 'A', 'L', 'G'], ['U', 'O', 'E', 'E', 'O', 'Ch'],
        ['F', 'O', 'M', 'T', 'U', 'I'], ['O', 'O', 'D', 'B', 'L', 'G'],
        ['R', 'P', 'S', 'Z', 'T', 'L'], ['E', 'B', 'I', 'O', 'U', 'A'],
        ['C', 'A', 'R', 'E', 'M', 'E'], ['R', 'S', 'J', 'E', 'F', 'I'],
        ['N', 'S', 'X', 'J', 'A', 'H'], ['U', 'V', 'D', 'Q', 'B', 'Ch'],
        ['N', 'B', 'I', 'M', 'E', 'E'], ['B', 'A', 'A', 'N', 'I', 'T'],
        ['E', 'P', 'V', 'O', 'C', 'U'], ['S', 'C', 'A', 'A', 'P', 'T']     
    ];
    var tableroBoggleInternacionalHasbro = [
        ['E', 'T', 'U', 'K', 'N', 'O'], ['E', 'V', 'G', 'T', 'I', 'N'],
        ['D', 'E', 'C', 'A', 'M', 'P'], ['I', 'E', 'L', 'R', 'U', 'W'],
        ['E', 'H', 'I', 'F', 'S', 'E'], ['R', 'E', 'C', 'A', 'L', 'S'],
        ['E', 'N', 'T', 'D', 'O', 'S'], ['O', 'F', 'X', 'R', 'I', 'A'],
        ['N', 'A', 'V', 'E', 'D', 'Z'], ['E', 'I', 'O', 'A', 'T', 'A'],
        ['G', 'L', 'E', 'N', 'Y', 'U'], ['B', 'M', 'A', 'Q', 'J', 'O'],
        ['T', 'L', 'I', 'B', 'R', 'A'], ['S', 'P', 'U', 'L', 'T', 'E'],
        ['A', 'I', 'M', 'S', 'O', 'R'], ['E', 'N', 'H', 'R', 'I', 'S']
    ]

    //Clase para instanciar cada palabra.
    class Palabra {
        constructor(texto, puntaje, validez) {
            this.texto = texto;
            this.puntaje = puntaje;
            this.validez = validez;
        }
    }

    //Clase para instanciar registros, y poder guardarlos y cargarlos.
    class Registro {
        constructor(fecha, puntaje, palabras, palabrasAnotadas, IDtablero) {
            this.fecha = fecha;
            this.puntaje = puntaje;
            this.palabras = palabras;
            this.palabrasAnotadas = palabrasAnotadas;
            this.IDtablero = IDtablero;
        }
    }

    //Clase para controlar el normal desenvolvimiento de los otros objetos con métodos de control y verificación.
    class Handler {
        constructor() {
            this.partidaActiva = false;
        }

        //Borrar el contenido de lo que se está escribiendo en el input.
        borrarInput() {
            $palabra.val('');
            this.verificarLongitud();

            //Vuelve a poner el foco sobre el casillero de escritura de palabras.
            $palabra.focus();
        }

        //Cambia el efecto visual al tocar una pestaña de la navegación y activa el div correspondiente.
        togglearPestanas(that) {
            //Efectos visuales.
            $contenedoresNavegacion.css({'background-color': '#1b406b'});
            that.css('background-color', '#42A5F5');

            //Activación y desactivación de divs.
            $pestanas.hide();

            switch (that.index()) {
                case 0:
                $areaDeJuego.slideDown(300);
                break;
                case 1:
                $registros.slideDown(300);
                break;
                case 2:
                $ajustes.slideDown(300);
                break;
            }
        }

        //Activa el temporizador para la duración de la partida.
        conteoRegresivo() {
            //Ajusta los segundos y fija el estado de partida activa.
            $temporizador.text(configurador.tiempoJuego);
            this.partidaActiva = true;

            //Durante una partida activa, inhabilita los botones que no deberían usarse.
            $borrarPalabra.prop('disabled', false);
            $temporizador.prop('disabled', true);
            $guardarRegistro.prop('disabled', true);
            $borrarPartida.prop('disabled', true);

            //Personaliza la experiencia de juego.
            $descripcion.text('¡A jugar!');
            $palabra.focus();
            
            //Invierte esos botones, restablece el temporizador y anuncia el fin de la partida.
            if (configurador.tiempoJuego == 0) {
                $('audio')[0].play();
                swal('¡Tiempo!', 'Ya expiraron todos los segundos, la partida terminó.', 'info');
                configurador.tiempoJuego = $duracionSegundos.val();
                $temporizador.text(configurador.tiempoJuego);
                $temporizador.prop('disabled', true);
                $borrarPalabra.prop('disabled', true);
                $guardarRegistro.prop('disabled', false);
                $borrarPartida.prop('disabled', false);
                this.partidaActiva = false;
                $descripcion.text('Guardá o borrá ↓');
            } else {
                //Si hay tiempo restante, resta un segundo
                configurador.tiempoJuego -= 1;
                setTimeout("handler.conteoRegresivo()", 1000);
            }
        }

        //Analiza el input y solo habilita el agregado de la palabra si tiene los caracteres mínimos.
        verificarLongitud() {
            if ($palabra.val().length < 3 || this.partidaActiva === false) {
                $agregarPalabra.prop('disabled', true);
            } else {
                $agregarPalabra.prop('disabled', false);
            }   
        }

        //Revisa si la palabra ya está agregada, y si es así no lo hace.
        verificarRepeticion() {
            for (let index = 0; index < listaPalabras.arrayPalabras.length; index++) {
                if (listaPalabras.arrayPalabras[index].texto.toUpperCase() == $palabra.val().toUpperCase()) {
                    return true;
                };
            };
        }

        //Al pasar una palabra o variable por parámetro, verifica su puntaje de acuerdo a su longitud.
        verificarPuntaje(variableVerificable) {
            if (variableVerificable < 3) {
                return 0;
            } else if (variableVerificable === 3 || variableVerificable === 4) {
                return 1;
            } else if (variableVerificable === 5) {
                return 2;
            } else if (variableVerificable === 6) {
                return 3;
            } else if (variableVerificable === 7) {
                return 5;
            } else if (variableVerificable >= 8) {
                return 11;
            }
        }
        
        //Entra al LocalStorage y devuelve en un array todas las partidas registradas.
        recuperarRegistros() {
            let registrosRecuperados = [];

            if (localStorage.length > 0) {
                for (let index = 0; index < localStorage.length; index++) {
                    let partidaIndex = JSON.parse(localStorage.getItem('partida' + index));
                    
                    //Si el objeto del localStorage es un registro de partida, lo añade a la lista.
                    if (partidaIndex != null) {
                        registrosRecuperados.push(partidaIndex);

                        //Permite ver los registros de versiones anteriores que no tenían tablero guardado, agregándoles la información de tablero físico.
                        if (partidaIndex.hasOwnProperty('IDtablero') !== true) {
                            registrosRecuperados[registrosRecuperados.length - 1].IDtablero = "";
                        }
                    }
                }
            }

            return registrosRecuperados;
        }

        //Carga la cookie con los ajustes del usuario y los aplica. Si falla, porque no hay cookie, coloca valores por defecto.
        recuperarAjustes() {
            try {
                let traerCookie = JSON.parse(Cookies.get('ajustes'));
                
                configurador.tipoTablero = traerCookie.tipoTablero;
                configurador.ordenPalabras = traerCookie.ordenPalabras;
                configurador.volumenAlarma = traerCookie.volumenAlarma;
                configurador.volumenAnotacion = traerCookie.volumenAnotacion;
                configurador.tiempoJuego = traerCookie.tiempoJuego;
            } catch {
                configurador.tipoTablero = 'fisico';
                configurador.ordenPalabras = 'letra';
                configurador.volumenAlarma = 80;
                configurador.volumenAnotacion = 80;
                configurador.tiempoJuego = 180;
            } finally {
                if (configurador.ordenPalabras === 'letra') {
                    $('#orden-letra').prop('checked', true);
                } else if (configurador.ordenPalabras === 'ingreso') {
                    $('#orden-ingreso').prop('checked', true);
                }

                switch (configurador.tipoTablero) {
                    case 'fisico':
                        $opcionesTablero.val('fisico');
                        tablero.arrayDados = [];
                        break;
                    case 'hasbro-esp':
                        $opcionesTablero.val('hasbro-esp');
                        tablero.arrayDados = tableroScrabbleBoggleElectronicoEspanolHasbro;
                        break;
                    case 'kitos':
                        $opcionesTablero.val('kitos');
                        tablero.arrayDados = tableroBoggleEspanolKipos;
                        break;
                    case 'hasbro-int':
                        $opcionesTablero.val('hasbro-int');
                        tablero.arrayDados = tableroBoggleInternacionalHasbro;
                        break;
                }
                
                //Ajusta el volumen correspondientemente.
                $sliderVolumen.val(configurador.volumenAlarma);
                $sliderAnotacion.val(configurador.volumenAnotacion);
                configurador.cambiarVolumen($sliderVolumen);
                configurador.cambiarVolumen($sliderAnotacion);
                $('#valor-volumen').text("Alarma");
                $('#valor-anotacion').text("Anotación");

                //Actualiza los valores de tiempo de juego.
                $temporizador.text(configurador.tiempoJuego);
                $duracionSegundos.val(configurador.tiempoJuego);
            }
        }
    }

    //Clase que permite mantener un control de los ajustes y replicar sus efectos en la aplicación.
    class Configurador {
        constructor() {
            this.tipoTablero;
            this.ordenPalabras;
            this.volumenAlarma;
            this.volumenAnotacion;
            this.tiempoJuego;
        }

        //Cambia el tipo de tablero para determinar el uso del tablero integrado.
        cambiarTablero(that) {
            this.tipoTablero = that.val();

            switch (this.tipoTablero) {
                case 'fisico':
                    $opcionesTablero.val('fisico');
                    tablero.arrayDados = [];
                    break;
                case 'hasbro-esp':
                    $opcionesTablero.val('hasbro-esp');
                    tablero.arrayDados = tableroScrabbleBoggleElectronicoEspanolHasbro;
                    break;
                case 'kitos':
                    $opcionesTablero.val('kitos');
                    tablero.arrayDados = tableroBoggleEspanolKipos;
                    break;
                case 'hasbro-int':
                    $opcionesTablero.val('hasbro-int');
                    tablero.arrayDados = tableroBoggleInternacionalHasbro;
                    break;
            }
        }

        //Cambia el orden de las palabras ingresadas por el usuario y su visualización.
        cambiarOrden(that) {
            this.ordenPalabras = that.val();
        }

        //Cambia el volumen del elemento HTML de audio y visualiza su valor.
        cambiarVolumen(that) {
            if (that[0].id == 'slider-volumen') {
                this.volumenAlarma = that.val();
                $('#audio-alarma').prop('volume', (this.volumenAlarma / 100));
                $('#valor-volumen').text(this.volumenAlarma + "%");
            } else if (that[0].id == 'slider-anotacion') {
                this.volumenAnotacion = that.val();
                $('#audio-anotacion').prop('volume', (this.volumenAnotacion / 100));
                $('#audio-fallo').prop('volume', (this.volumenAnotacion / 100));
                $('#valor-anotacion').text(this.volumenAnotacion + "%");
            }
        }

        //Cambia la duración del temporizador y visualiza su valor.
        cambiarTiempo(that) {
            this.tiempoJuego = that.val();
            $temporizador.text(this.tiempoJuego);
        }

        //Guarda los ajustes en la cookie para no perderlos.
        guardarAjustes() {
            let llevarCookie = JSON.stringify({
                tipoTablero: this.tipoTablero,
                ordenPalabras: this.ordenPalabras, 
                volumenAlarma: this.volumenAlarma,
                volumenAnotacion: this.volumenAnotacion, 
                tiempoJuego: this.tiempoJuego
            });

            Cookies.set('ajustes', llevarCookie);
        }
    }

    //Clase para representar un tablero de juego para jugar en modo virtual, con dados.
    class Tablero {
        constructor() {
            this.arrayDados = [];
            this.IDtablero = "";
        }

        //Genera un tablero nuevo en el aspecto lógico y visual a través del azar matemático.
        mezclarTablero() {
            //Mezcla la posición de los dados en el tablero.
            for (let i = this.arrayDados.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [this.arrayDados[i], this.arrayDados[j]] = [this.arrayDados[j], this.arrayDados[i]];
                $(`#dado-${i}`).text(this.arrayDados[i]);
            }

            //Selecciona una letra para cada dado según las posibilidades de sus caras.
            for (let index = 0; index < this.arrayDados.length; index++) {
                $(`#dado-${index}`).text(this.arrayDados[index][Math.floor(Math.random() * 6)]);
            }
        }

        //Otorga un código de identificación único al tablero según sus letras.
        identificarTablero() {
            let IDtablero = "";

            for (let index = 0; index < 16; index++) {
                IDtablero += $(`#dado-${index}`).text();
            }

            this.IDtablero = IDtablero;
            return this.IDtablero;
        }

        //Llama a la mezcla del tablero y lo prepara visualmente para su disposición si el usuario tiene ese ajuste.
        prepararTablero() {
            if (configurador.tipoTablero === 'fisico') {
                $tableroVirtual.hide(100);
            } else {
                $tableroVirtual.hide();
                tablero.mezclarTablero();
                $tableroVirtual.slideDown(300); 
            }
        }
    }

    //Clase para obtener un objeto que regule la lista de registros y realice las acciones involucradas.
    class ListaRegistros {
        constructor(arrayRegistros) {
            this.arrayRegistros = arrayRegistros;
        }

        //Instancia un registro con los datos actuales y lo guarda en la lista de registros y LocalStorage.
        guardarRegistro() {
            if ($conteoPalabras.text() > 0) {
                let fecha = new Date();
                let nuevoRegistro = new Registro(
                    fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
                    $conteoPuntos.text(),
                    $conteoPalabras.text(),
                    listaPalabras.arrayPalabras,
                    tablero.identificarTablero()
                );

                //Agregar el registro al LocalStorage en frío y a listaRegistros activa.
                this.arrayRegistros.push(nuevoRegistro);
                localStorage.setItem("partida" + localStorage.length, JSON.stringify(nuevoRegistro));

                //Lo añade a la vista visual actual.
                this.visualizarLista();

                //Elimina la lista de palabras actual.
                listaPalabras.vaciarLista();

                //Habilita el temporizador.
                $temporizador.prop('disabled', false);
                $descripcion.text('Tocá el temporizador →');

                swal('Éxito','Se guardó tu partida y se añadió al registro.', 'success');
            } else {
                swal('Error','No se puede guardar una partida vacía.', 'error');
            }
        }

        //Crea un div en la pestaña de registros por cada registro en la lista y en LocalStorage.
        visualizarLista() {
            $grillaRegistros.empty();

            //Los divs llevan por id el numero de la partida que visualizan, así como un evento y con operadores numéricos para pintar correctamente sus celdas contiguas al hacer click.
            if (this.arrayRegistros != null) {
                for (let index = 0; index < this.arrayRegistros.length; index++) {
                    let cargaRegistro = $(
                        `<div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), 1, 2)">${this.arrayRegistros[index].fecha}</div>
                        <div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), 1, -1)">${this.arrayRegistros[index].puntaje}</div>
                        <div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), -1, -2)">${this.arrayRegistros[index].palabras}</div>`
                    );
    
                    cargaRegistro.appendTo($grillaRegistros);
                }
            }

            this.calcularEstadisticas();
        }

        //Aplica efecto al elegir un registro de la lista y posteriormente desglosa su información visualmente.
        visualizarPalabras(that, operador1, operador2) { 
            let numeroPartida = that.attr('class').replace("grilla-registro grilla-partida-", "");
            let celdaContigua1 = $('.grilla-registro').eq(that.index() + operador1);
            let celdaContigua2 = $('.grilla-registro').eq(that.index() + operador2);

            //Pinta el registro seleccionado.
            $('.grilla-registro').css('background-color', 'white');
            that.css('background-color', '#64B5F6');
            celdaContigua1.css('background-color', '#64B5F6');
            celdaContigua2.css('background-color', '#64B5F6');

            $palabrasRegistro.empty();
            $('#registro-tablero').empty();

            $('#registro-tablero').hide();
            $('#indicacion-tablero').show();

            //Añade los títulos de columnas.
            $palabrasRegistro.append($(`<div class="grilla-titulo">Palabra</div><div class="grilla-titulo">Puntos</div>`));

            //Agrega las palabras anotadas, tachadas o no, según su validez.
            this.arrayRegistros[numeroPartida].palabrasAnotadas.forEach( palabra => {
                if (palabra.validez) {
                    $palabrasRegistro.append($(`<div>${palabra.texto}</div>`));
                } else {
                    $palabrasRegistro.append($(`<div><strike>${palabra.texto}</strike></div>`));
                }
                $palabrasRegistro.append($(`<div>${palabra.puntaje}</div>`));
            });

            //Si se usó tablero virtual para esta partida, se carga del registro.
            if (this.arrayRegistros[numeroPartida].IDtablero != "") {
                let indexQu = this.arrayRegistros[numeroPartida].IDtablero.indexOf("Qu");
                let indexCh = this.arrayRegistros[numeroPartida].IDtablero.indexOf("Ch");
                let indexLimite = 0;

                if (indexQu === -1 && indexCh === -1) {
                    indexLimite = 16;
                } else if ((indexQu === -1 && indexCh !== -1) || (indexQu !== -1 && indexCh === -1)) {
                    indexLimite = 17;
                } else if (indexQu !== -1 && indexCh !== -1) {
                    indexLimite = 18;
                }

                //Los dados Qu y Ch son un caso especial que requieren particularidades en el cargado.
                for (let index = 0; index < indexLimite; index++) {
                    if (index === indexQu || index === indexCh) {
                        $('#registro-tablero').append($(`<div class="dado-registro">${this.arrayRegistros[numeroPartida].IDtablero.slice(index, index + 2)}</div>`));
                        index++;
                    } else {
                        $('#registro-tablero').append($(`<div class="dado-registro">${this.arrayRegistros[numeroPartida].IDtablero.slice(index, index + 1)}</div>`));
                    }
                }

                $('#indicacion-tablero').hide();
                $('#registro-tablero').show();
            }

            //Agrega un botón para poder borrar el registro del LocalStorage.
            $palabrasRegistro.append($(`<button class="borrar-registro" onclick="listaRegistros.borrarRegistro(${numeroPartida})">Borrar este registro</button>`));

            $cargaRegistro.hide();
            $cargaRegistro.slideDown(300);
        }

        ordenarRegistros(that) {
            let tituloID = that.attr('id');
            let listaOrdenada = [];
                
            listaOrdenada = this.arrayRegistros.sort( function(reg1, reg2) {
                if (tituloID === 'titulo-fecha') {
                    return new Date(reg1.fecha) - new Date(reg2.fecha);
                } else if (tituloID === 'titulo-puntaje') {
                    return reg1.puntaje - reg2.puntaje;
                } else if (tituloID === 'titulo-palabras') {
                    return reg1.palabras - reg2.palabras;
                }
            });

            this.listaRegistros = listaOrdenada;
            this.visualizarLista();
        }

        //Hace los conteos y promedios del historial de partidas.
        calcularEstadisticas() {
            let partidasTotales = this.arrayRegistros.length;
            let puntajesTotales = 0;
            let palabrasTotales = 0;

            for (let index = 0; index < this.arrayRegistros.length; index++) {
                puntajesTotales += parseInt(listaRegistros.arrayRegistros[index].puntaje);
                palabrasTotales += parseInt(listaRegistros.arrayRegistros[index].palabras);
            }

            $('#partidas-totales').html('Partidas totales: <strong>' + partidasTotales + '</strong>');
            $('#puntos-totales').html('Puntos totales: <strong>' + puntajesTotales + '</strong>');
            $('#palabras-totales').html('Palabras totales: <strong>' + palabrasTotales + '</strong>');
            $('#puntos-partida').html('Puntos/partida: <strong>' + (puntajesTotales / partidasTotales).toFixed(2) + '</strong>');
            $('#puntos-palabra').html('Puntos/palabra: <strong>' + (puntajesTotales / palabrasTotales).toFixed(2) + '</strong>');
            $('#palabras-partida').html('Palabras/partida: <strong>' + (palabrasTotales / partidasTotales).toFixed(2) + '</strong>');
        }

        //Borra el registro seleccionado del LocalStorage, la listaRegistro y el área visual, y "renombra" las partidas en LocalStorage para no dejar un index nulo.
        borrarRegistro(numeroPartida) {
            swal({
                title: '¿Estás seguro/a?', 
                text: 'Los datos de la partida son irrecuperables.', 
                icon: "warning",
                buttons: ['Cancelar','OK'],
                closeOnClickOutside: false
            })
            .then((eleccionUsuario) => {
                if (eleccionUsuario) {
                    localStorage.removeItem('partida' + numeroPartida);
                    this.arrayRegistros.splice(numeroPartida, 1);

                    for (let index = numeroPartida; index < localStorage.length; index++) {
                        let registroRenombre = localStorage.getItem('partida' + (index + 1));

                        localStorage.removeItem('partida' + (index + 1))
                        localStorage.setItem('partida' + index, registroRenombre);

                        this.arrayRegistros.splice((index + 1), 1);
                        this.arrayRegistros.splice(index, 0, registroRenombre);
                    }

                    $(`.grilla-partida-${numeroPartida}`).remove();
                    $cargaRegistro.hide(300);

                    this.calcularEstadisticas();
                }
            });
        }

        //Elimina todos los registros existentes del LocalStorage.
        vaciarRegistros() {
            swal({
                title: '¿Estás seguro/a?', 
                text: 'Se borrarán TODOS los registros de partidas que tengas, y esto no se puede deshacer.', 
                icon: "warning",
                buttons: ['Cancelar','OK'],
                closeOnClickOutside: false
            })
            .then((eleccionUsuario) => {
                if (eleccionUsuario) {
                    localStorage.clear();
                    listaRegistros.arrayRegistros.length = 0;
                    $grillaRegistros.empty();
                    $cargaRegistro.hide();
                }
            });
        }
    }

    //Clase para instanciar una lista de palabras y contener todos los métodos de modificación sobre palabras.
    class ListaPalabras {
        constructor() {
            this.arrayPalabras = [];
            this.arrayOrdenLetras = [];
        }

        //Elimina la lista activa de palabras tanto en el plano visual como lógico.
        vaciarLista() {
            this.arrayPalabras.length = 0;
            this.arrayOrdenLetras.length = 0;
            $(".palabra-agregada").remove();
            $(".orden-letra").remove();
            this.sumarPuntos();
            this.contarPalabras();
        }

        //Tras la aceptación del usuario, borra la lista de palabras en orden lógico y visual. Luego recuenta.
        borrarPartida() {
            swal({
                title: '¿Estás seguro/a?', 
                text: 'Los datos de la partida son irrecuperables si no los guardaste en el registro.', 
                icon: "warning",
                buttons: ['Cancelar','OK'],
                closeOnClickOutside: false
            })
            .then((eleccionUsuario) => {
                if (eleccionUsuario) {
                    //Borra la lista actual.
                    this.vaciarLista();

                    //Habilita el temporizador.
                    $temporizador.prop('disabled', false);
                    $descripcion.text('Tocá el temporizador →');
                }
            });      
        }

        //Agrega el contenido del input como palabra en el array lógico de palabras y en la lista visual.
        agregarPalabra() {
            let comprobarPalabra = handler.verificarRepeticion();

            //Si la palabra ya está en la lista, no la agrega y hace una demostración gráfica.
            if (comprobarPalabra) {
                $palabra.effect("shake", { direction: "left", times: 3, distance: 8 }, 500);
                $('audio')[2].play();
            } else {
                let valorPalabra = handler.verificarPuntaje($palabra.val().length);
                let letraInicial = $palabra.val().slice(0, 1);
                let cantidadPalabras = listaPalabras.arrayPalabras.length;
                let divAppend;

                let $nuevaPalabra = $(
                `<div class="palabra-agregada">
                    <div>
                        <input class="palabra-check" id="palabra${cantidadPalabras}" type="checkbox" onclick="listaPalabras.togglearValidez(${cantidadPalabras})" checked>
                        <label id="label${cantidadPalabras}" for="palabra${cantidadPalabras}">${$palabra.val().toLowerCase()}</label>
                    </div>
                    <div>
                        <p>Puntos:&nbsp</p>
                        <p id="puntaje${cantidadPalabras}" class="puntos">${valorPalabra}</p>
                    </div>
                </div>`
                );

                //Analiza si el usuario quiere agregar palabras por letra inicial o por orden de ingreso.
                if (configurador.ordenPalabras === 'letra') {
                    //Busca en el array de las letras iniciales si ya existe una palabra con esa letra inicial que haya sido agregada antes.
                    let comprobarLetra = this.arrayOrdenLetras.find( function(letraActual) {
                        return letraInicial == letraActual;
                    });
                
                    //Si no se escribió ninguna palabra con esa letra inicial, se crea el div visual y se agrega en el array lógico.
                    if (comprobarLetra != letraInicial) {
                        this.arrayOrdenLetras.push(letraInicial);

                        $listaPalabras.append($(
                            `<div id="orden-letra-${letraInicial}" class="orden-letra">
                                <p class="letra-inicial">${letraInicial.charAt(0).toUpperCase()}</p>
                                <hr class='separador-letra'>
                            </div>`
                        ));
                    }

                    divAppend = $(`#orden-letra-${letraInicial}`);

                } else if (configurador.ordenPalabras === 'ingreso') {
                    divAppend = $listaPalabras
                };
                
                //Añade la palabra a la lista visual y luego a la lista lógica.
                $nuevaPalabra.appendTo(divAppend).hide().slideDown(150, "linear");
                this.arrayPalabras.push(new Palabra($palabra.val().toLowerCase(), valorPalabra, true));

                //Sonido de agregado satisfactorio.
                $('audio')[1].play();

                //Actualiza los conteos.
                this.sumarPuntos();
                this.contarPalabras();
                handler.borrarInput();

                //Vuelve a poner el foco sobre el casillero de escritura de palabras.
                $palabra.focus();
            };
        }

        //Invierte la validez de una palabra y en consecuencia modifica el puntaje y el conteo totales.
        togglearValidez(index) {
            let puntajeCorrespondiente = handler.verificarPuntaje(this.arrayPalabras[index].texto.length);
            let $puntajeID = $(`#puntaje${index}`);
            let $labelPalabra = $(`#label${index}`);

            if (this.arrayPalabras[index].validez) {
                this.arrayPalabras[index].puntaje = 0;
                this.arrayPalabras[index].validez = false;
                $puntajeID.text('0');
                $labelPalabra.addClass('invalida');
            } else {
                this.arrayPalabras[index].puntaje = puntajeCorrespondiente;
                this.arrayPalabras[index].validez = true;
                $puntajeID.text(puntajeCorrespondiente);
                $labelPalabra.removeClass('invalida');
            }

            this.sumarPuntos();
            this.contarPalabras();
        }

        //Recorre el array de las instancias de palabras y suma el total de la propiedad del puntaje.
        sumarPuntos() {
            let conteoTotal = 0
            this.arrayPalabras.forEach(palabraActual => {
                if (palabraActual.validez === true) {
                    conteoTotal += palabraActual.puntaje
                };
            });
            $conteoPuntos.text(conteoTotal);
        }

        //Recorre el array de las instancias de palabras y cuenta todas las que sean válidas.
        contarPalabras() {
            let conteoTotal = 0
            this.arrayPalabras.forEach(palabraActual => {
                if (palabraActual.validez === true) {
                    conteoTotal++;
                };
            });
            $conteoPalabras.text(conteoTotal);
        }
    }

    //Pone en marcha la escucha de todos eventos que activan los métodos de los principales objetos.
    function escuchaDeEventos() {
        $temporizador.click( function() {
            tablero.prepararTablero();
            handler.conteoRegresivo();
        });
    
        $borrarPalabra.click( function() {
            handler.borrarInput();
        });
    
        $borrarPartida.click( function() {
            listaPalabras.borrarPartida();
        });
    
        $palabra.on('keyup', function(evento) {
            handler.verificarLongitud();
        });
    
        $(document).keyup( function(evento) {
            if (evento.key == 'Enter' && $palabra.val().length >= 3 && handler.partidaActiva === true) {
                listaPalabras.agregarPalabra();
                evento.preventDefault();
            }
        });
    
        $agregarPalabra.click( function() {
            listaPalabras.agregarPalabra();
        });
    
        $guardarRegistro.click( function() {
            listaRegistros.guardarRegistro();
        });
    
        $contenedoresNavegacion.click( function() {
            handler.togglearPestanas($(this));
        });

        $titulosGrilla.click( function() {
            listaRegistros.ordenarRegistros($(this));
        });
    
        $registrosGrilla.click( function() {
            listaRegistros.visualizarPalabras($(this));
        });
    
        $vaciarRegistros.click( function() {
            listaRegistros.vaciarRegistros();
        });

        //Los ajustes se guardan en cada cambio a fines de evitar pérdidas de datos por crasheos, apagado de dispositivo y casos similares. No es lo más óptimo pero es lo más seguro.
        $duracionSegundos.on('input', function() {
            configurador.cambiarTiempo($(this)); 
            configurador.guardarAjustes();
        })

        $sliderVolumen.on('input', function() {
            configurador.cambiarVolumen($(this));
            configurador.guardarAjustes();
        });
        $sliderVolumen.on('touchend click', function() {
            $('#valor-volumen').text("Alarma");
        });

        $sliderAnotacion.on('input', function() {
            configurador.cambiarVolumen($(this));
            configurador.guardarAjustes();
        });
        $sliderAnotacion.on('touchend click', function() {
            $('#valor-anotacion').text("Anotación");
        });

        $ordenPalabras.on('input', function() {
            configurador.cambiarOrden($(this));
            configurador.guardarAjustes();
        });

        $opcionesTablero.on('change', function() {
            configurador.cambiarTablero($(this));
            configurador.guardarAjustes();
        });
    }
    
    //Instanciamientos de objetos, preparación y acciones lógico-visuales de inicialización.
    function inicializar() {
        //Instancia el handler, las listas de palabras y registros, y el tablero para desenvolver todo lo demás.
        handler = new Handler();
        configurador = new Configurador();
        listaPalabras = new ListaPalabras();
        listaRegistros = new ListaRegistros(handler.recuperarRegistros());
        tablero = new Tablero();

        //Trae los ajustes de los cookies a la aplicación en el inicio.
        handler.recuperarAjustes();

        //El botón de anotar palabra empieza habilitado cuando el input esta vacío, esto lo impide.
        handler.borrarInput();

        //Carga los registros en el arranque.
        listaRegistros.visualizarLista();

        //Oculta las palabras de un registro específico en el arranque, ya que no hay ninguno seleccionado.
        $cargaRegistro.hide();
        $tableroVirtual.hide();

        //Inhabilita los botones que solo pueden funcionar con una partida activa o luego de ella.
        $borrarPalabra.prop('disabled', true);
        $guardarRegistro.prop('disabled', true);
        $borrarPartida.prop('disabled', true);
        
        //Marca la primera pestaña para que no se empiece con todas desmarcadas.
        $contenedoresNavegacion[0].click();
    }

    //Puesta en marcha.
    escuchaDeEventos();
    inicializar();
});
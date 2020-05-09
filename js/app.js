$(document).ready( function($){

    //Variables de elementos HTML seleccionados con JQuery.
    $temporizador = $('#temporizador');
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
    $palabrasRegistro = $('#registro-palabras');
    $ajustes = $('#ajustes');
    $sliderVolumen = $('#slider-volumen');
    $duracionSegundos = $('#duracion-segundos');
    $ordenPalabras = $('#ordenamiento-palabras input');

    //Variables de datos globales intermétodos.
    var tiempoRestante;
    var ordenamientoPalabras;

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
        constructor(fecha, puntaje, palabras, palabrasAnotadas) {
            this.fecha = fecha;
            this.puntaje = puntaje;
            this.palabras = palabras;
            this.palabrasAnotadas = palabrasAnotadas;
        }
    }

    class Cookie {
        constructor(ordenPalabras, volumenAlarma, tiempoJuego) {
            this.ordenPalabras = ordenPalabras;
            this.volumenAlarma = volumenAlarma;
            this.tiempoJuego = tiempoJuego;
        }
    }

    //Clase para controlar el normal desenvolvimiento de los otros objetos con métodos de control y verificación.
    class Handler {
        //Borrar el contenido de lo que se está escribiendo en el input.
        borrarInput() {
            $palabra.val('');
            $agregarPalabra.prop('disabled', true);
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

        //Activa el temporizador para la duración de la partida
        conteoRegresivo() {
            $temporizador.text(tiempoRestante);
                
            if (tiempoRestante == 0) {
                $('audio')[0].play();
                swal('¡Tiempo!', 'Ya expiraron todos los segundos, la partida terminó.', 'info');
                tiempoRestante = $duracionSegundos.val();
                $temporizador.text(tiempoRestante);
                $temporizador.prop('disabled', false);
                $guardarRegistro.prop('disabled', false);
                $borrarPartida.prop('disabled', false);
            } else {
                tiempoRestante -= 1;
                $temporizador.prop('disabled', true);
                $guardarRegistro.prop('disabled', true);
                $borrarPartida.prop('disabled', true);
                setTimeout("handler.conteoRegresivo()", 1000);
            }
        }

        //Analiza el input y solo habilita el agregado de la palabra si tiene los caracteres mínimos.
        verificarLongitud() {
            if ($palabra.val().length < 3) {
                $agregarPalabra.prop('disabled', true);
            } else {
                $agregarPalabra.prop('disabled', false);
            }   
        }

        //Revisa si la palabra ya está agregada, y si es así no lo hace.
        verificarRepeticion() {
            for (let index = 0; index < listaPalabras.arrayPalabras.length; index++) {
                if (listaPalabras.arrayPalabras[index].texto == $palabra.val()) {
                    return true;
                };
            };
        }

        //Impide el ingreso de caracteres que no sean letras del abecedario romano.
        verificarCaracter(evento) {
            var tecla = evento.keyCode;
            if ((tecla >= 65 && tecla <= 90) || tecla == 32) { return null };
        }

        //Al pasar una palabra o variable por parámetro, verifica su puntaje de acuerdo a su longitud.
        verificarPuntaje(variableVerificable) {
            if (variableVerificable < 3) {
                return 0
            } else if (variableVerificable === 3 || variableVerificable === 4) {
                return 1
            } else if (variableVerificable === 5) {
                return 2
            } else if (variableVerificable === 6) {
                return 3
            } else if (variableVerificable === 7) {
                return 5
            } else if (variableVerificable >= 8) {
                return 11
            }
        }
        
        //Entra al LocalStorage y devuelve en un array todas las partidas registradas.
        recuperarRegistros() {
            let registrosRecuperados = [];

            for (let index = 0; index < localStorage.length; index++) {
                registrosRecuperados.push(JSON.parse(localStorage.getItem('partida' + index)));
            };
            return registrosRecuperados;
        }

        //Carga la cookie con los ajustes del usuario y los aplica. Si falla, porque no hay cookie, la crea.
        recuperarAjustes() {
            let traerCookie = JSON.parse(Cookies.get('ajustes'));

            // this.ordenPalabras
            configurador.ordenPalabras = traerCookie.ordenPalabras;
            configurador.volumenAlarma = traerCookie.volumenAlarma;
            configurador.tiempoJuego = traerCookie.tiempoJuego;

            if (configurador.ordenPalabras === 'letra') {
                $('#orden-letra').prop('checked', true);
            } else if (configurador.ordenPalabras === 'ingreso') {
                $('#orden-ingreso').prop('checked', true);
            }

            $sliderVolumen.val(configurador.volumenAlarma);
            configurador.cambiarVolumen($sliderVolumen);
            tiempoRestante = configurador.tiempoJuego;
            $temporizador.text(configurador.tiempoJuego);
            $duracionSegundos.val(configurador.tiempoJuego);
        }
    }

    //Objeto que permite mantener un control de los ajustes y replicar sus efectos en la aplicación.
    class Configurador {
        constructor(ordenPalabras, volumenAlarma, tiempoJuego) {
            this.ordenPalabras = ordenPalabras;
            this.volumenAlarma = volumenAlarma;
            this.tiempoJuego = tiempoJuego;
        }

        //Cambia el orden de las palabras ingresadas por el usuario y su visualización.
        cambiarOrden(that) {
            this.ordenPalabras = that.val();
        }

        //Cambia el volumen del elemento HTML de audio y visualiza su valor.
        cambiarVolumen(that) {
            this.volumenAlarma = that.val();
            $('audio').prop('volume', (this.volumenAlarma / 100));
            $('#valor-volumen').text(this.volumenAlarma + '%');
        }

        //Cambia la duración del temporizador y visualiza su valor.
        cambiarTiempo(that) {
            this.tiempoJuego = that.val();
            tiempoRestante = this.tiempoJuego;
            $temporizador.text(this.tiempoJuego);
        }

        //Guarda los ajustes en la cookie para no perderlos.
        guardarAjustes() {
            let llevarCookie = JSON.stringify(new Cookie(
                this.ordenPalabras, this.volumenAlarma, this.tiempoJuego
            ));

            Cookies.set('ajustes', llevarCookie);
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
                    listaPalabras.arrayPalabras
                )

                this.arrayRegistros.push(nuevoRegistro);

                localStorage.setItem(
                "partida" + localStorage.length,
                JSON.stringify(nuevoRegistro)
                )

                this.visualizarLista();

                swal('Éxito','Se guardó tu partida y se añadió al registro.', 'success')
            } else {
                swal('Error','No se puede guardar una partida vacía.', 'error');
            }
        }

        //Crea un div en la pestaña de registros por cada registro en la lista y en LocalStorage.
        visualizarLista() {
            $grillaRegistros.empty();

            //Los divs llevan por id el numero de la partida que visualizan, así como un evento y con operadores numéricos para pintar correctamente sus celdas contiguas al hacer click.
            for (let index = 0; index < this.arrayRegistros.length; index++) {
                let cargaRegistro = $(
                    `<div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), 1, 2)">${this.arrayRegistros[index].fecha}</div>
                    <div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), 1, -1)">${this.arrayRegistros[index].puntaje}</div>
                    <div class="grilla-registro grilla-partida-${index}" onclick="listaRegistros.visualizarPalabras($(this), -1, -2)">${this.arrayRegistros[index].palabras}</div>`
                );

                cargaRegistro.appendTo($grillaRegistros);
            }
        }

        //Aplica efecto al elegir un registro de la lista y posteriormente desglosa su información visualmente.
        visualizarPalabras(that, operador1, operador2) {
            let numeroPartida = that.attr('class').slice(-1);
            let celdaContigua1 = $('.grilla-registro').eq(that.index() + operador1);
            let celdaContigua2 = $('.grilla-registro').eq(that.index() + operador2);

            $('.grilla-registro').css('background-color', 'white');
            that.css('background-color', '#64B5F6');
            celdaContigua1.css('background-color', '#64B5F6');
            celdaContigua2.css('background-color', '#64B5F6');

            $palabrasRegistro.empty();
            $palabrasRegistro.append($(`<div class="grilla-titulo">Palabra</div><div class="grilla-titulo">Puntos</div>`));

            listaRegistros.arrayRegistros[numeroPartida].palabrasAnotadas.forEach( palabra => {
                if (palabra.validez) {
                    $palabrasRegistro.append($(`<div>${palabra.texto}</div>`));
                } else {
                    $palabrasRegistro.append($(`<div><strike>${palabra.texto}</strike></div>`));
                }
                $palabrasRegistro.append($(`<div>${palabra.puntaje}</div>`));
            })

            $palabrasRegistro.append($(`<button class="borrar-registro" onclick="listaRegistros.borrarRegistro(${numeroPartida})">Borrar este registro</button>`));

            $palabrasRegistro.hide();
            $palabrasRegistro.slideDown(300);
        }

        //Borra el registro seleccionado del LocalStorage, la listaRegistro y el área visual, y "renombra" las partidas en LocalStorage para no dejar un index nulo.
        borrarRegistro(numeroPartida) {
            swal({
                title: '¿Estás seguro/a?', 
                text: 'Los datos de la partida son irrecuperables.', 
                icon: "warning",
                buttons: ['Cancelar','OK']
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
                    $palabrasRegistro.hide(300);
                }
            });
        }
    }

    //Clase para instanciar una lista de palabras y contener todos los métodos de modificación sobre palabras.
    class ListaPalabras {
        constructor(arrayPalabras, arrayOrdenLetras) {
            this.arrayPalabras = arrayPalabras;
            this.arrayOrdenLetras = arrayOrdenLetras;
        }

        //Tras la aceptación del usuario, borra la lista de palabras en orden lógico y visual. Luego recuenta.
        borrarPartida() {
            swal({
                title: '¿Estás seguro/a?', 
                text: 'Los datos de la partida son irrecuperables si no los guardaste en el registro.', 
                icon: "warning",
                buttons: ['Cancelar','OK']
            })
            .then((eleccionUsuario) => {
                if (eleccionUsuario) {
                    this.arrayPalabras.length = 0;
                    this.arrayOrdenLetras.length = 0;

                    $(".palabra-agregada").remove();
                    $(".orden-letra").remove();
                    this.sumarPuntos();
                    this.contarPalabras();
                }
            });      
        }

        //Agrega el contenido del input como palabra en el array lógico de palabras y en la lista visual.
        agregarPalabra() {
            let comprobarPalabra = handler.verificarRepeticion();

            //Si la palabra ya está en la lista, no la agrega y hace una demostración gráfica.
            if (comprobarPalabra) {
                $palabra.effect("shake", { direction: "left", times: 3, distance: 8 }, 500);
            } else {
                let valorPalabra = handler.verificarPuntaje($palabra.val().length);
                let letraInicial = $palabra.val().slice(0, 1);
                let cantidadPalabras = listaPalabras.arrayPalabras.length;
                let divAppend;

                let $nuevaPalabra = $(
                `<div class="palabra-agregada">
                    <div>
                        <input class="palabra-check" id="palabra${cantidadPalabras}" type="checkbox" onclick="listaPalabras.togglearValidez(${cantidadPalabras})" checked>
                        <label id="label${cantidadPalabras}" for="palabra${cantidadPalabras}">${$palabra.val()}</label>
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
                        $listaPalabras.append($(
                        `<div id="orden-letra-${letraInicial}" class="orden-letra">
                            <p class="letra-inicial">${letraInicial.charAt(0).toUpperCase()}</p>
                            <hr class='separador-letra'>
                        </div>`
                        ));
                        this.arrayOrdenLetras.push(letraInicial);
                    }

                    divAppend = $(`#orden-letra-${letraInicial}`);

                } else if (configurador.ordenPalabras === 'ingreso') {
                    divAppend = $listaPalabras
                };
                
                //Añade la palabra a la lista visual y luego a la lista lógica.
                $nuevaPalabra.appendTo(divAppend).hide().slideDown(150, "linear");
                this.arrayPalabras.push(new Palabra($palabra.val(), valorPalabra, true));

                //Actualiza los conteos.
                this.sumarPuntos();
                this.contarPalabras();
                handler.borrarInput();
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

    //Eventos:

    $temporizador.click( function() {
        handler.conteoRegresivo();
    })

    $borrarPalabra.click( function() {
        handler.borrarInput();
    });

    $borrarPartida.click( function() {
        listaPalabras.borrarPartida();
    });

    $palabra.on('keyup', function(evento) {
        handler.verificarCaracter(evento);
        handler.verificarLongitud();
    });

    $(document).keyup( function(evento) {
        if (evento.key == 'Enter' && $palabra.val().length >= 3) {
            listaPalabras.agregarPalabra();
            evento.preventDefault();
        }
    });

    $agregarPalabra.click( function() {
        listaPalabras.agregarPalabra();
    });

    $guardarRegistro.click( function() {
        listaRegistros.guardarRegistro();
    })

    $contenedoresNavegacion.click( function() {
        handler.togglearPestanas($(this));
    });

    $registrosGrilla.click( function() {
        listaRegistros.visualizarPalabras($(this));
    });

    $duracionSegundos.on('input', function() {
        configurador.cambiarTiempo($(this)); 
    })

    $sliderVolumen.on('input', function() {
        configurador.cambiarVolumen($(this));
    });

    $ordenPalabras.on('input', function() {
        configurador.cambiarOrden($(this));
    })
    
    //Instanciamientos y acciones en inicialización:

    //Instancia el handler, las listas de palabras y registros para desenvolver todo lo demás.
    handler = new Handler();
    configurador = new Configurador();
    listaPalabras = new ListaPalabras([], []);
    listaRegistros = new ListaRegistros(handler.recuperarRegistros());

    $(window).on('load', function() {handler.recuperarAjustes()});
    $(window).on('unload', function() {configurador.guardarAjustes()});

    //El botón de anotar palabra empieza habilitado cuando el input esta vacío, esto lo impide.
    handler.borrarInput();

    //Carga los registros en el arranque.
    listaRegistros.visualizarLista();

    //Oculta las palabras de un registro específico en el arranque, ya que no hay ninguno seleccionado.
    $palabrasRegistro.hide();
    
    //Marca la primera pestaña para que no se empiece con todas desmarcadas.
    $contenedoresNavegacion[0].click();

    });
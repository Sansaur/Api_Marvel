var listaTodosComics = new Array();
var listaTodosPersonajes = new Array();
var categoria = ".comics";
var paginaActual = 0;
var cambiandoPagina = false;
// Clave: 2e6e2343a738921e86db6c5e55fc1784
/*
 * Cargamos todo lo importante del documento
 */
$('document').ready(function () {
    generarLocalStorage();
    $('#paginado').pagination({
        items: 1500,
        itemsOnPage: 10,
        displayedPages: 3,
        cssStyle: 'light-theme',
        onPageClick: function (pageNumber, event) {
            $('#paginado').pagination('disable');
            $('#contenidosIzquierda').hide("fade", 500, function () {
                $('#contenidosIzquierda').empty();
                listaTodosComics = [];
                listaTodosPersonajes = [];
                paginaActual = parseInt(pageNumber) - 1;
                recibirComics();
                recibirPersonajes();
            });
        }
    });
    $('#cambiarCategoria').click(mostrarPersonajes);
    $('#Votar').click(function (event) {
        let str = '#' + event.target.id;
        let $nombre = $(str).parent().find('.nombre');
        let $telefono = $(str).parent().find('.telefono');
        let $email = $(str).parent().find('.email');
        let comic = $("#textResultadoComic").text();
        let personaje = $("#textResultadoPJ").text();
        montarVotacion(event, $nombre.val(), $telefono.val(), $email.val(), comic, personaje);
    });
    recibirComics();
    recibirPersonajes();
});
/*
 * Petición asíncrona que nos devuelve 10 comics de la API y los mete en un array
 * @returns {undefined}
 */
function recibirComics() {
    var marvelAPI = 'https://gateway.marvel.com:443/v1/public/comics?limit=10&offset=' + paginaActual * 10 + '&apikey=2e6e2343a738921e86db6c5e55fc1784';
    $('#loader').show();
    $.ajax({
        method: "GET",
        url: marvelAPI,
        complete: function () {
            $('#loader').hide();
        },
        success: function (response) {
            var results = response.data.results;
            var resultsLen = results.length;
            for (var i = 0; i < resultsLen; i++) {
                var imgPath;
                if (results[i].images.length > 0) {
                    imgPath = results[i].images[0].path + "." + results[i].images[0].extension;
                } else {
                    imgPath = results[i].thumbnail.path + "." + results[i].thumbnail.extension;
                }
                var titulo = results[i].title;
                var desc = results[i].description || "No tiene descripción";
                var nuevoObj = {
                    imagen: imgPath,
                    nombre: titulo,
                    desc: desc
                };
                listaTodosComics.push(nuevoObj);
            }
            actualizarListaComics();
            esconderTodo();
            mostrarCategoria();
            $('#contenidosIzquierda').show("fade", 500);
            cambiandoPagina = true;
        },
        error: function (code, algo, algo2) {
            console.log(code);
            console.log(algo);
            console.log(algo2);
            mostrarError("<div class=errorBox>¡No se ha podido recibir la lista de comics!</div>");
        }
    });
}
/*
 * Petición asíncrona que nos devuelve 10 personajes de la API y los mete en un array
 * @returns {undefined}
 */
function recibirPersonajes() {
    var marvelAPI = 'https://gateway.marvel.com/v1/public/characters?limit=10&offset=' + paginaActual * 10 + '&apikey=2e6e2343a738921e86db6c5e55fc1784';
    $.ajax({
        method: "GET",
        url: marvelAPI,
        complete: function () {
            $('#loader').hide();
        },
        success: function (response) {
            var results = response.data.results;
            var resultsLen = results.length;
            for (var i = 0; i < resultsLen; i++) {
                var imgPath = results[i].thumbnail.path + "." + results[i].thumbnail.extension;
                var titulo = results[i].name;
                var nuevoObj = {
                    imagen: imgPath,
                    nombre: titulo
                };
                listaTodosPersonajes.push(nuevoObj);
            }
            actualizarListaPJs();
            esconderTodo();
            mostrarCategoria();
            $('#paginado').pagination('enable');
        },
        error: function (code, algo, algo2) {
            console.log(code);
            console.log(algo);
            console.log(algo2);
            mostrarError("<div class=errorBox>¡No se ha podido recibir la lista de personajes!</div>");
        }
    });
}

/**
 * Creamos la lista de comics dentro de los contenidos de la izquierda en la página web.
 * @returns {undefined}
 */
function actualizarListaComics() {
    for (var i in listaTodosComics) {
        $('#contenidosIzquierda').append('<div class=\"seccionPaginada comics\" ><img width=150 height=180 src=' + listaTodosComics[i].imagen + ' /><h2>' + listaTodosComics[i].nombre + '</h2><p class=textoEsconder >' + listaTodosComics[i].desc + '</p><button id=botonVotarCM' + i + ' class=botonVotacion >¡Vota!</button></div>');
    }
    $('.botonVotacion').click(function (event) {
        votar(event);
    });
    /*
     * 
     * VIVAN LAS LIBRERÍAS
     * Esta es jquery.expander.min.js
     * 
     * Jquery Expander
     * 
     */
    $('.textoEsconder').expander({
        slicePoint: 80, // default is 100
        expandPrefix: '', // default is '... '
        expandText: ' >>> Leer más', // default is 'read more'
        collapseTimer: 0, // re-collapses after 5 seconds; default is 0, so no re-collapsing
        userCollapseText: ' <<< Colapsar'  // default is 'read less'
    });
}

/**
 * Creamos la lista de personajes dentro de los contenidos de la izquierda en la página web.
 * @returns {undefined}
 */
function actualizarListaPJs() {
    for (var i in listaTodosPersonajes) {
        $('#contenidosIzquierda').append('<div class=\"seccionPaginada personajes\" ><img width=120 height=120 src=' + listaTodosPersonajes[i].imagen + ' /><h2>' + listaTodosPersonajes[i].nombre + '</h2><button id=botonVotarPJ' + i + ' class=botonVotacion >¡Vota!</button></div></div>');
    }
    $('.personajes').hide();
    $('.botonVotacion').click(function (event) {
        votar(event);
    });
    esconderTodo();
    mostrarCategoria();
}
/**
 * Alternamos entre personajes y comics a mostrar dentro de los contenidos de la izquierda
 * @returns {undefined}
 */
function mostrarPersonajes() {
    esconderTodo();
    if (categoria === '.personajes') {
        categoria = ".comics";
        $('#cambiarCategoria').text('Personajes');
    } else {
        categoria = ".personajes";
        $('#cambiarCategoria').text('Comics');
    }
    mostrarCategoria();
}
/**
 * Escondemos todos los contenidos
 * @returns {undefined}
 */
function esconderTodo() {
    $('.comics').hide();
    $('.personajes').hide();
}
/**
 * Mostramos la categoría que tenemos guardada
 * @returns {undefined}
 */
function mostrarCategoria() {
    $(categoria).show();
}

/**
 * Si no se carga bien la petición ajax, se muestra este error
 * @param appender Es una string de texto HTML DOM
 * @returns {undefined}
 */
function mostrarError(appender) {
    $('#contenidosIzquierda').empty();
    $('#contenidosIzquierda').append(appender);
}
/**
 * Cuando se pulsa algún botón que ponga "¡Votar!" se pondrá en la parte de la derecha
 * los datos de lo que se ha votado.
 * @param {type} event
 * @returns {undefined}
 */
function votar(event) {
    console.log(event);
    let str = '#' + event.target.id;
    let $nombre = $(str).parent().find('h2');
    let $imagen = $(str).parent().find('img');
    if (str.includes('CM')) {
        $('#resultadoComic').attr('src', $imagen.attr('src'));
        $('#textResultadoComic').text($nombre.text());
    }
    if (str.includes('PJ')) {
        $('#resultadoPJ').attr('src', $imagen.attr('src'));
        $('#textResultadoPJ').text($nombre.text());
    }
}
/**
 * Si la página no tiene localSTorage al cargarse, se genera aquí
 * @returns {undefined}
 */
function generarLocalStorage() {
    var listaVotos = JSON.parse(localStorage.getItem('listaVotos'));
    if (!listaVotos) {
        localStorage.setItem('listaVotos', JSON.stringify([]));
    }
}
/**
 * Montamos el nuevo voto y lo añadimos al localstorage
 * @param {type} event
 * @param {type} nombre
 * @param {type} telefono
 * @param {type} email
 * @param {type} comic
 * @param {type} personaje
 * @param {type} IDComic
 * @param {type} IDPersonaje
 * @returns {undefined}
 */
function montarVotacion(event, nombre, telefono, email, comic, personaje, IDComic, IDPersonaje) {
    var nuevoVoto = {
        nombre: nombre,
        telefono: telefono,
        email: email,
        comic: comic,
        personaje: personaje
    };
    console.log(nuevoVoto);
    var listaVotos = JSON.parse(localStorage.getItem('listaVotos'));
    listaVotos.push(nuevoVoto);
    localStorage.setItem('listaVotos', JSON.stringify(listaVotos));
    location.replace("resultadoVotaciones.html");
}

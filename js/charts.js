/*
 * **********************************************************************
 * *********************** GOOGLE CHARTS ********************************
 * **********************************************************************
 */
/* global google */
/*
 * Selecciones:
 * 0 = Tarta
 * 1 = Barras
 * 2 = Donut
 * @type Number
 */
var seleccion = 0;
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages': ['corechart']});
/**
 * Importante, los gráficos se crean cuando google.charts haya cargado
 */
google.charts.setOnLoadCallback(function () {
    montarGraficoTarta1();
    montarGraficoTarta2();
    montarGraficoBarras1();
    montarGraficoBarras2();
    montarGraficoDonut1();
    montarGraficoDonut2();
    esconderTodasGraficas();
    mostrarGrafica(seleccion);
    $('#graficoTarta').click(function (e) {
        seleccion = 0;
        esconderTodasGraficas();
        mostrarGrafica(seleccion);
    });
    $('#graficoHorizontales').click(function (e) {
        seleccion = 1;
        esconderTodasGraficas();
        mostrarGrafica(seleccion);
    });
    $('#graficoDonut').click(function (e) {
        seleccion = 2;
        esconderTodasGraficas();
        mostrarGrafica(seleccion);
    });
});

var arrayVotos = JSON.parse(localStorage.getItem('listaVotos'));

var arrayComics = [];
var arrayPersonajes = [];

var assocPersonajes = {};
var assocComics = {};

/*
 * 
 * 1 = Personajes
 * 2 = Comics
 * @type type
 * 
 */
$('document').ready(function () {
    rellenarArrays();
    asociarPersonajesVotos();
    asociarComicsVotos();
    //montarGraficoTarta1();
});
/*
 * Creamos los arrays a partir de los datos en localstorage
 * @returns {undefined}
 */
function rellenarArrays() {
    for (var i in arrayVotos) {
        var voto = arrayVotos[i];
        if (voto.comic && voto.comic !== "Ninguno") {
            arrayComics.push(voto.comic);
        }
        if (voto.personaje && voto.personaje !== "Ninguno") {
            arrayPersonajes.push(voto.personaje);
        }
    }
}
/*
 * Creamos  un objeto
 * Este objeto tiene nombre de personaje y la cantidad de votos que tiene
 * @returns {unresolved}
 */
function contarVotosPersonaje() {
    let mi = {};
    arrayPersonajes.forEach(function (x) {
        mi[x] = (mi[x] || 0) + 1;
    });
    //console.log(mi);
    return mi;
}
/*
 * Creamos  un objeto
 * Este objeto tiene nombre de comic y la cantidad de votos que tiene
 * @returns {unresolved}
 */
function contarVotosComics() {
    let mi = {};
    arrayComics.forEach(function (x) {
        mi[x] = (mi[x] || 0) + 1;
    });
    //console.log(mi);
    return mi;
}
/*
 * Creamos la asociación entre personajes y votos, un array asociativo de objetos
 * con nombre y cantidad de votos
 * @returns {undefined}
 */
function asociarPersonajesVotos() {
    let contador = 0;
    let cuentaVotos = contarVotosPersonaje();
    arrayPersonajes.forEach(function (x) {
        //console.log("Votos para "+ arrayPersonajes[contador] + "" + cuentaVotos[arrayPersonajes[contador]]);
        assocPersonajes[x] = {nombre: "", cantidad: 0};
        assocPersonajes[x].nombre = arrayPersonajes[contador];
        assocPersonajes[x].cantidad = cuentaVotos[arrayPersonajes[contador]];
        contador++;
    });
    //console.log(assocPersonajes);
}
/*
 * Creamos la asociación entre comics y votos, un array asociativo de objetos
 * con nombre y cantidad de votos
 * @returns {undefined}
 */
function asociarComicsVotos() {
    let contador = 0;
    let cuentaVotos = contarVotosComics();
    arrayComics.forEach(function (x) {
        //console.log("Votos para "+ arrayComics[contador] + "" + cuentaVotos[arrayComics[contador]]);
        assocComics[x] = {nombre: "", cantidad: 0};
        assocComics[x].nombre = arrayComics[contador];
        assocComics[x].cantidad = cuentaVotos[arrayComics[contador]];
        contador++;
    });
    //console.log(assocComics);
}
/*
 * Creamos el gráfico de tarta de personajes
 * @returns {undefined}
 */
function montarGraficoTarta1() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocPersonajes) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocPersonajes[i].nombre;
        arrayVotosEnvio[contador][1] = assocPersonajes[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Personaje');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en PieChart
    var chart = new google.visualization.PieChart(document.getElementById('google_charts_tarta1'));
    chart.draw(data, options);
}
/*
 * Creamos el gráfico de tarta de comics
 * @returns {undefined}
 */
function montarGraficoTarta2() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocComics) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocComics[i].nombre;
        arrayVotosEnvio[contador][1] = assocComics[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Comic');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en PieChart
    var chart = new google.visualization.PieChart(document.getElementById('google_charts_tarta2'));
    chart.draw(data, options);
}
/*
 * Creamos el gráfico de barras de personajes
 * @returns {undefined}
 */
function montarGraficoBarras1() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocPersonajes) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocPersonajes[i].nombre;
        arrayVotosEnvio[contador][1] = assocPersonajes[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Personaje');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en BarChart
    var chart = new google.visualization.BarChart(document.getElementById('google_charts_barras1'));
    chart.draw(data, options);
}
/*
 * Creamos el gráfico de barras de comics
 * @returns {undefined}
 */
function montarGraficoBarras2() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocComics) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocComics[i].nombre;
        arrayVotosEnvio[contador][1] = assocComics[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Comic');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en BarChart
    var chart = new google.visualization.BarChart(document.getElementById('google_charts_barras2'));
    chart.draw(data, options);
}

/*
 * Creamos el gráfico de barras de personajes
 * @returns {undefined}
 */
function montarGraficoDonut1() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocPersonajes) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocPersonajes[i].nombre;
        arrayVotosEnvio[contador][1] = assocPersonajes[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Personaje');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400,
        pieHole: 0.4
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en PieChart y en pieHole en las opciones
    var chart = new google.visualization.PieChart(document.getElementById('google_charts_donut1'));
    chart.draw(data, options);
}

/*
 * Creamos el gráfico de barras de comics
 * @returns {undefined}
 */
function montarGraficoDonut2() {
    var arrayVotosEnvio = [];
    var contador = 0;
    for (var i in assocComics) {
        arrayVotosEnvio[contador] = [];
        arrayVotosEnvio[contador][0] = assocComics[i].nombre;
        arrayVotosEnvio[contador][1] = assocComics[i].cantidad;
        contador++;
    }
    // CREACIÓN DE LA GRÁFICA DE GOOGLE CHARTS
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Comic');
    data.addColumn('number', 'Votos');
    data.addRows(arrayVotosEnvio);
    // Set chart options
    var options = {
        'title': 'Porcentual de votos',
        'width': 600,
        'height': 400,
        pieHole: 0.4
    };
    // Instantiate and draw our chart, passing in some options.
    // Fijarse en PieChart y en pieHole en las opciones
    var chart = new google.visualization.PieChart(document.getElementById('google_charts_donut2'));
    chart.draw(data, options);
}
function esconderTodasGraficas() {
    $('.Gchart').hide();
}

/*
 * Cuando se pulsa un botón se entra en esta función, se esconden todas las gráficas y se muestra la que nos interesa
 * @returns {undefined}
 */
function mostrarGrafica(num) {
    esconderTodasGraficas();
    switch (num) {
        case 0:
            $('#google_charts_tarta1, #google_charts_tarta2').show();
            break;
        case 1:
            $('#google_charts_barras1, #google_charts_barras2').show();
            break;
        case 2:
            $('#google_charts_donut1, #google_charts_donut2').show();
            break;
    }
    console.log(num);
}

let rutas = [];

//LocalStorage
const storageKey = 'rutas_seguras_kids';

//API
const ApiKey = '2365507e00d54a3ca28170127262505';
const ciudadPorDeficto = 'Bucaramanga';

// Formularios
const formularioRuta = document.getElementById('formRuta');
const formularioEstudiante = document.getElementById('formEstudiante');

// Inputs del formulario de rutas
const inputNombreRuta = document.getElementById('nombreRuta');
const inputConductor = document.getElementById('conductor');
const inputHoraSalida = document.getElementById('horaSalida');

// Inputs del formulario de estudiantes
const inputNombreEstudiante = document.getElementById('nombreEstudiante');
const selectRuta = document.getElementById('selectRuta');

// Contenedores para errores de estudiantes
const contenedorNombreEstudiante = document.getElementById('nombreEstudiante').parentElement;
const contenedorSelectRuta = document.getElementById('selectRuta').parentElement;

// Contenedores para rutas
const contenedorRutas = document.getElementById('contenedorRutas');
const contenedorInputRuta = document.getElementById('contenedor-input-ruta');
const contenedorInputConductor = document.getElementById('contenedor-input-conductor');
const contendedorHoraSalida = document.getElementById('contenedor-hora-salida');

// Botones
const btnCancelar = document.getElementById('cancelarBtn');

// Elementos de estadisticas
const spanTotalRutas = document.getElementById('totalRutas');
const spanTotalEstudiantes = document.getElementById('totalEstudiantes');
const spanPromedioRuta = document.getElementById('promedioRuta');

// Elementos del modal
const modal = document.getElementById('modalEditarRuta');
const modalClose = document.querySelector('.modal-close');
const modalCancelarBtn = document.getElementById('modalCancelarBtn');
const modalGuardarBtn = document.getElementById('modalGuardarBtn');

//Filtro
const selectFiltro = document.getElementById('RutasFiltro');

let idRutaEditando = null;
let modoEdicion = false;

function generarId() {
    return Date.now();
}

//guardar Datos 
function guardarRutasEnLocalStorage() {
    try {
        const rutasParaGuardar = rutas.map(ruta => ({
            id: ruta.id,
            nombreRuta: ruta.nombreRuta,
            conductor: ruta.conductor,
            hora: ruta.hora,
            estudiantes: ruta.estudiantes || [] // Por si esta vacio
        }));

        localStorage.setItem(storageKey, JSON.stringify(rutasParaGuardar));//Establecemos los valores del local storege
        console.log('Rutas guardadas:', rutasParaGuardar.length); //Para depurar
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

//Cargar desde el localStorage
function cargarRutasDesdeLocalStorage() {
    try {
        const rutasGuardadas = localStorage.getItem(storageKey);// Extraemos los datos del local storage

        if (rutasGuardadas) { //Si rutas guardadas exite
            const rutasParseadas = JSON.parse(rutasGuardadas);

            if (Array.isArray(rutasParseadas)) {// Verificamos que sea tipo array
                rutas = rutasParseadas;
                console.log('Rutas cargadas:', rutas.length);
                return true;
            }
        }

        console.log('No hay rutas guardadas');
        return false;
    } catch (error) {
        console.warn('Error al cargar:', error);
        return false;
    }
}

// Funcion de error rutas
function mostrarError(valor, contenderoValor, mensaje = "Este campo es obligatorio") {
    valor.classList.add("error-input")

    const alerta = document.createElement('div')
    alerta.textContent = mensaje;
    alerta.className = "toast-alerta"

    contenderoValor.appendChild(alerta)

    alerta.classList.add('mostrar');

    setTimeout(() => {
        alerta.classList.remove('mostrar');
        alerta.remove();
    }, 3000);
}

// Funcion de error Estudiantes
function mostrarErrorEstudiantes(select, contenderoValor, mensaje = "Debe seleccionar una opcion") {
    select.classList.add("error-input")

    const alerta = document.createElement('div')
    alerta.textContent = mensaje;
    alerta.className = "toast-alerta"

    contenderoValor.appendChild(alerta)

    alerta.classList.add('mostrar');

    setTimeout(() => {
        alerta.classList.remove('mostrar');
        alerta.remove();
    }, 3000);
}

function limpiarErrores() {
    // Limpiar errores de rutas
    const errores = document.querySelectorAll('#formRuta .toast-alerta');
    errores.forEach(error => error.remove());
    const inputsConError = document.querySelectorAll('#formRuta .error-input');
    inputsConError.forEach(input => input.classList.remove('error-input'));


    // Limpiar errores de estudiantes
    const erroresEstudiante = document.querySelectorAll('#formEstudiante .toast-alerta');
    erroresEstudiante.forEach(error => error.remove());
    const inputsEstudianteError = document.querySelectorAll('#formEstudiante .error-input');
    inputsEstudianteError.forEach(input => input.classList.remove('error-input'));
}

function validacionesRutas() {
    let validado = true;
    limpiarErrores();

    if (inputNombreRuta.value.trim() === "") {
        mostrarError(inputNombreRuta, contenedorInputRuta, "El nombre de la ruta es obligatorio");
        validado = false;
    }

    if (inputConductor.value.trim() === "") {
        mostrarError(inputConductor, contenedorInputConductor, "El nombre del conductor es obligatorio");
        validado = false;
    }

    if (inputHoraSalida.value.trim() === "") {
        mostrarError(inputHoraSalida, contendedorHoraSalida, "La hora de salida es obligatoria");
        validado = false;
    }

    return validado;
}

function validacionesEstudiante() {
    let validado = true;
    limpiarErrores();

    if (inputNombreEstudiante.value.trim() === "") {
        mostrarError(inputNombreEstudiante, contenedorNombreEstudiante, "El nombre del estudiante es obligatorio");
        validado = false;
    }

    if (selectRuta.value === "" || selectRuta.value === null) {
        mostrarErrorEstudiantes(selectRuta, contenedorSelectRuta, "Debe seleccionar una ruta");
        validado = false;
    }

    return validado;
}

//Limpiar formularios
function clear(tipoformulario) {

    if (tipoformulario === formularioRuta) {
        const todosLosInputs = document.querySelectorAll('#formRuta input'); //Obtenenemos todos los inputs 
        todosLosInputs.forEach(input => { // Limpiamos todo lo que no se este editando

            input.value = '';
            input.classList.remove("error-input") // Quitamos los erroes de las etiquetas visuales

        })

        modoEdicion = false;
        idRutaEditando = null;
        if (btnCancelar) btnCancelar.style.display = 'none';// Quitamos boton cancelar si existe
        console.log("formulario de rutas limpiado")
    }

    if (tipoformulario === formularioEstudiante) { //Obtenenemos todos los inputs
        inputNombreEstudiante.value = '';
        selectRuta.value = '';
        inputNombreEstudiante.classList.remove("error-input");
        selectRuta.classList.remove("error-input");


        const erroresEstudiante = document.querySelectorAll('#formEstudiante .toast-alerta');
        erroresEstudiante.forEach(error => error.remove());

        console.log("formulario de estudiantes limpiado")
    }
}

// Evento para agregar rutas
formularioRuta.addEventListener('submit', function (event) {
    event.preventDefault(); //Usamos para que no se recargue autometicamente

    if (validacionesRutas() === true) {
        if (modoEdicion) { // Clasificamos por si esta en modo editar
            actualizarRuta();
        } else {
            agregarRuta();
        }
        clear(formularioRuta);
    } else {
        console.log("No se pudo crear ruta");
    }
});

// Evento para agregar estudiante
formularioEstudiante.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validacionesEstudiante() === true) {
        agregarEstudiante();
        clear(formularioEstudiante);
    } else {
        console.log("No se pudo agregar estudiante");
    }
});

// Boton cancelar edicion
if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
        clear(formularioRuta);
    });
}

function agregarRuta() {
    const nuevoId = generarId();

    const datosRuta = {
        id: nuevoId,
        nombreRuta: inputNombreRuta.value,
        conductor: inputConductor.value,
        hora: inputHoraSalida.value,
        estudiantes: []
    };

    rutas.push(datosRuta);
    guardarRutasEnLocalStorage();
    actualizarSelectRutas();
    filtrarRutas();
    renderRutas(rutas);
    actualizarEstadisticas();
}

function actualizarRuta() {

    //Extraemos los valores
    const nuevoNombre = inputNombreRuta.value;
    const nuevoConductor = inputConductor.value;
    const nuevaHora = inputHoraSalida.value;

    rutas = rutas.map(ruta => {// Usamos el map para crear un array transformando cada elemento
        if (ruta.id === idRutaEditando) { //Lo usamos para recorrer el valor

            return { // Retornamos los nuevos valores
                ...ruta,// Copia todas las propiedades de la ruta original
                nombreRuta: nuevoNombre,
                conductor: nuevoConductor, //Sobrescribelos vlores
                hora: nuevaHora
            };
        }
        return ruta; // si no entra en la ruta, retornamos la ruta original
    });

    guardarRutasEnLocalStorage();
    actualizarSelectRutas();
    renderRutas(rutas);
    actualizarEstadisticas();
}

function filtrarRutas() {
    if (!selectFiltro) return;// Verificamos que exista por si las dudas

    selectFiltro.innerHTML = '<option value="">Seleccione una ruta</option>';//Agregar una opcion por defecto

    rutas.forEach(ruta => { // Recorre el array y ejecuta codigo por cada ruta

        const option = document.createElement('option'); //Creamos un elemento HTML para agregar las rutas 

        option.value = ruta.nombreRuta; // Le agregamos un value a la opcion
        option.textContent = `${ruta.nombreRuta} - ${ruta.conductor}`;// creamos los 
        selectFiltro.appendChild(option); //Agregamos la opcion
    });
}


function agregarEstudiante() {

    //Extraemos los valores
    const nombreEstudiante = inputNombreEstudiante.value.trim();
    const rutaId = parseInt(selectRuta.value);

    const rutaIndex = rutas.findIndex(r => r.id === rutaId); // Recorremos el array y retornamos la posicion donde coincida (si no se encuentra retorna -1)

    if (rutaIndex !== -1) { // Validamos que encontro la ruta la ruta 
        const nuevoEstudiante = { // creamos y guardamos un nuevo estuidante
            id: generarId(),
            nombre: nombreEstudiante
        };

        if (!rutas[rutaIndex].estudiantes) { // Verificamos si ya existe un array de estudiantes y Crea un array vacio si no existe
            rutas[rutaIndex].estudiantes = [];
        }

        rutas[rutaIndex].estudiantes.push(nuevoEstudiante); // Agregamos estudiantes en la lista

        guardarRutasEnLocalStorage();
        renderRutas(rutas);
        actualizarEstadisticas();

        console.log("Estudiante agregado correctamente");

    } else {
        // Error si no se encuentra la ruta
        mostrarErrorEstudiantes(selectRuta, contenedorSelectRuta, "No se encontró la ruta seleccionada");
    }
}

//Atualizar el select en el apartado de estudiantes
function actualizarSelectRutas() {
    if (!selectRuta) return;// Verificamos que exista por si las dudas

    selectRuta.innerHTML = '<option value="">Seleccione una ruta</option>';//Agregar una opcion por defecto

    rutas.forEach(ruta => { // Recorre el array y ejecuta codigo por cada ruta

        const option = document.createElement('option'); //Creamos un elemento HTML para agregar las rutas 

        option.value = ruta.id; // Le agregamos un value a la opcion
        option.textContent = `${ruta.nombreRuta} - ${ruta.conductor}`;// creamos los 
        selectRuta.appendChild(option); //Agregamos la opcion
    });
}

function actualizarEstadisticas() {//Llamaremos Esta funcion cada que el usuario realice cambion en las rutas o estudiantes

    if (spanTotalRutas) spanTotalRutas.textContent = rutas.length;// Leemos la cantidad de rutas que existen

    let totalEstudiantes = 0;
    rutas.forEach(ruta => {
        totalEstudiantes += ruta.estudiantes ? ruta.estudiantes.length : 0;// recorre cada ruta y le regresa la cantidad de estudiantes y si no tiene retorna 0
    });

    if (spanTotalEstudiantes) spanTotalEstudiantes.textContent = totalEstudiantes;

    const promedio = rutas.length > 0 ? (totalEstudiantes / rutas.length).toFixed(1) : 0; // Calculamos y redondeamos con el toFixed(1) a 1 decimal
    if (spanPromedioRuta) spanPromedioRuta.textContent = promedio;
}

function renderRutas(dato_ruta) { //Les pasamos las listas actualizadas para mostrarlas

    if (!contenedorRutas) { // Verificamos que exista
        console.error("Contenedor de rutas no encontrado");
        return;
    }

    if (dato_ruta.length === 0) {// Verificamos que no este vacio
        contenedorRutas.innerHTML = '<div class="mensaje-vacio">No hay rutas.</div>';
        return;
    }

    contenedorRutas.innerHTML = "";// Vaciamos el contenedor 
    if (selectFiltro.value === "todos") {
        dato_ruta.forEach((element) => { // recorremos la lista con element = "Es la ruta actual" y index = "la posicion numerica"
            const tarjeta = document.createElement("div-tarjeta");

            //Le agregamos atributos
            tarjeta.setAttribute("nombreRuta", element.nombreRuta);
            tarjeta.setAttribute("conductor", element.conductor);
            tarjeta.setAttribute("hora", element.hora);
            tarjeta.setAttribute("data-id", element.id);


            //
            if (element.estudiantes && element.estudiantes.length > 0) { // si existe estudiantes y no esta vacio
                tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes)); //Agregamos estudiantes de la lista
            }

            tarjeta.addEventListener("editar-tarjeta", (e) => {// El oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                abrirModalEdicion(e.detail);//La "e" es quien recibel los parametros del evento como un json
            });

            tarjeta.addEventListener("eliminar-tarjeta", (e) => {//Tambien es el oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                rutas = rutas.filter(r => r.id != e.detail.id); // cargamos todas las rutas menos la que tiene 
                guardarRutasEnLocalStorage();
                actualizarSelectRutas();
                filtrarRutas();
                renderRutas(rutas);
                actualizarEstadisticas();
            });

            tarjeta.addEventListener("estudiante-removido", (e) => {
                const rutaId = parseInt(e.detail.rutaId);// pasamos a entero
                const rutaIndex = rutas.findIndex(r => r.id === rutaId);// retorna la posicion donde se encuentra el estudiante

                if (rutaIndex !== -1) {
                    rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                    guardarRutasEnLocalStorage();
                    actualizarEstadisticas();
                }
            });

            contenedorRutas.appendChild(tarjeta);
        });
    }

    if (selectFiltro.value === "Ruta norte") {
        dato_ruta.filter(r => r.nombreRuta.includes("norte")).forEach((element) => { // recorremos la lista con element = "Es la ruta actual" y index = "la posicion numerica"
            const tarjeta = document.createElement("div-tarjeta");

            //Le agregamos atributos
            tarjeta.setAttribute("nombreRuta", element.nombreRuta);
            tarjeta.setAttribute("conductor", element.conductor);
            tarjeta.setAttribute("hora", element.hora);
            tarjeta.setAttribute("data-id", element.id);


            //
            if (element.estudiantes && element.estudiantes.length > 0) { // si existe estudiantes y no esta vacio
                tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes)); //Agregamos estudiantes de la lista
            }

            tarjeta.addEventListener("editar-tarjeta", (e) => {// El oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                abrirModalEdicion(e.detail);//La "e" es quien recibel los parametros del evento como un json
            });

            tarjeta.addEventListener("eliminar-tarjeta", (e) => {//Tambien es el oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                rutas = rutas.filter(r => r.id != e.detail.id); // cargamos todas las rutas menos la que tiene 
                guardarRutasEnLocalStorage();
                actualizarSelectRutas();
                filtrarRutas();
                renderRutas(rutas);
                actualizarEstadisticas();
            });

            tarjeta.addEventListener("estudiante-removido", (e) => {
                const rutaId = parseInt(e.detail.rutaId);// pasamos a entero
                const rutaIndex = rutas.findIndex(r => r.id === rutaId);// retorna la posicion donde se encuentra el estudiante

                if (rutaIndex !== -1) {
                    rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                    guardarRutasEnLocalStorage();
                    actualizarEstadisticas();
                }
            });

            contenedorRutas.appendChild(tarjeta);
        });

    }

    if(selectFiltro.value === "Ruta sur") {
        dato_ruta.filter(r => r.nombreRuta.includes("sur")).forEach((element) => { // recorremos la lista con element = "Es la ruta actual" y index = "la posicion numerica"
            const tarjeta = document.createElement("div-tarjeta");

            //Le agregamos atributos
            tarjeta.setAttribute("nombreRuta", element.nombreRuta);
            tarjeta.setAttribute("conductor", element.conductor);
            tarjeta.setAttribute("hora", element.hora);
            tarjeta.setAttribute("data-id", element.id);


            //
            if (element.estudiantes && element.estudiantes.length > 0) { // si existe estudiantes y no esta vacio
                tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes)); //Agregamos estudiantes de la lista
            }

            tarjeta.addEventListener("editar-tarjeta", (e) => {// El oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                abrirModalEdicion(e.detail);//La "e" es quien recibel los parametros del evento como un json
            });

            tarjeta.addEventListener("eliminar-tarjeta", (e) => {//Tambien es el oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                rutas = rutas.filter(r => r.id != e.detail.id); // cargamos todas las rutas menos la que tiene 
                guardarRutasEnLocalStorage();
                actualizarSelectRutas();
                filtrarRutas();
                renderRutas(rutas);
                actualizarEstadisticas();
            });

            tarjeta.addEventListener("estudiante-removido", (e) => {
                const rutaId = parseInt(e.detail.rutaId);// pasamos a entero
                const rutaIndex = rutas.findIndex(r => r.id === rutaId);// retorna la posicion donde se encuentra el estudiante

                if (rutaIndex !== -1) {
                    rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                    guardarRutasEnLocalStorage();
                    actualizarEstadisticas();
                }
            });

            contenedorRutas.appendChild(tarjeta);
        });
    }

    if (selectFiltro.value === "Ruta centro") {
        dato_ruta.filter(r => r.nombreRuta.includes("centro")).forEach((element) => { // recorremos la lista con element = "Es la ruta actual" y index = "la posicion numerica"
            const tarjeta = document.createElement("div-tarjeta");

            //Le agregamos atributos
            tarjeta.setAttribute("nombreRuta", element.nombreRuta);
            tarjeta.setAttribute("conductor", element.conductor);
            tarjeta.setAttribute("hora", element.hora);
            tarjeta.setAttribute("data-id", element.id);


            //
            if (element.estudiantes && element.estudiantes.length > 0) { // si existe estudiantes y no esta vacio
                tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes)); //Agregamos estudiantes de la lista
            }

            tarjeta.addEventListener("editar-tarjeta", (e) => {// El oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                abrirModalEdicion(e.detail);//La "e" es quien recibel los parametros del evento como un json
            });

            tarjeta.addEventListener("eliminar-tarjeta", (e) => {//Tambien es el oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                rutas = rutas.filter(r => r.id != e.detail.id); // cargamos todas las rutas menos la que tiene 
                guardarRutasEnLocalStorage();
                actualizarSelectRutas();
                filtrarRutas();
                renderRutas(rutas);
                actualizarEstadisticas();
            });

            tarjeta.addEventListener("estudiante-removido", (e) => {
                const rutaId = parseInt(e.detail.rutaId);// pasamos a entero
                const rutaIndex = rutas.findIndex(r => r.id === rutaId);// retorna la posicion donde se encuentra el estudiante

                if (rutaIndex !== -1) {
                    rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                    guardarRutasEnLocalStorage();
                    actualizarEstadisticas();
                }
            });

            contenedorRutas.appendChild(tarjeta);
        });

    } else{
         dato_ruta.forEach((element) => { // recorremos la lista con element = "Es la ruta actual" y index = "la posicion numerica"
            const tarjeta = document.createElement("div-tarjeta");

            //Le agregamos atributos
            tarjeta.setAttribute("nombreRuta", element.nombreRuta);
            tarjeta.setAttribute("conductor", element.conductor);
            tarjeta.setAttribute("hora", element.hora);
            tarjeta.setAttribute("data-id", element.id);


            //
            if (element.estudiantes && element.estudiantes.length > 0) { // si existe estudiantes y no esta vacio
                tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes)); //Agregamos estudiantes de la lista
            }

            tarjeta.addEventListener("editar-tarjeta", (e) => {// El oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                abrirModalEdicion(e.detail);//La "e" es quien recibel los parametros del evento como un json
            });

            tarjeta.addEventListener("eliminar-tarjeta", (e) => {//Tambien es el oyente que recibe todos los datos pasados en el setup De los eventos de las tarjetas
                rutas = rutas.filter(r => r.id != e.detail.id); // cargamos todas las rutas menos la que tiene 
                guardarRutasEnLocalStorage();
                actualizarSelectRutas();
                filtrarRutas();
                renderRutas(rutas);
                actualizarEstadisticas();
            });

            tarjeta.addEventListener("estudiante-removido", (e) => {
                const rutaId = parseInt(e.detail.rutaId);// pasamos a entero
                const rutaIndex = rutas.findIndex(r => r.id === rutaId);// retorna la posicion donde se encuentra el estudiante

                if (rutaIndex !== -1) {
                    rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                    guardarRutasEnLocalStorage();
                    actualizarEstadisticas();
                }
            });

            contenedorRutas.appendChild(tarjeta);
        });
    }

}
function abrirModalEdicion(datosRuta) { // Este es un objeto que proviene del shadow DOM

    if (!datosRuta || !datosRuta.id) {// Validamos q existan y que tengan id
        console.error("No se recibieron datos validos para editar");
        return;
    }

    //Mostramos en el modal
    document.getElementById('modalEditandoId').value = datosRuta.id;
    document.getElementById('modalNombreRuta').value = datosRuta.nombreRuta;
    document.getElementById('modalConductor').value = datosRuta.conductor;
    document.getElementById('modalHoraSalida').value = datosRuta.hora;

    idRutaEditando = datosRuta.id;//Actualizamos la variable global

    modal.style.display = 'flex';// Mostramos el modal
}

function cerrarModal() { // Limpuamos el modal para cuando se vuelva a abrir no tenga problemas

    modal.style.display = 'none';

    document.getElementById('modalNombreRuta').value = '';
    document.getElementById('modalConductor').value = '';
    document.getElementById('modalHoraSalida').value = '';
    document.getElementById('modalEditandoId').value = '';
    idRutaEditando = null;
}

function guardarCambiosRuta() {//

    //Leemos los valores que pasa en el modal+
    const nuevoNombre = document.getElementById('modalNombreRuta').value.trim();
    const nuevoConductor = document.getElementById('modalConductor').value.trim();
    const nuevaHora = document.getElementById('modalHoraSalida').value;

    //Validamos
    if (!nuevoNombre) {
        alert('El nombre de la ruta es obligatorio');
        return;
    }

    if (!nuevoConductor) {
        alert('El nombre del conductor es obligatorio');
        return;
    }

    if (!nuevaHora) {
        alert('La hora de salida es obligatoria');
        return;
    }

    const rutaOriginal = rutas.find(r => r.id === idRutaEditando);// retorna el primer valor con el que coincida la busqueda

    if (!rutaOriginal) {// Si no se encuentra mostramos el error y salimos de la funcion
        console.warn("No se encontro la ruta con ID:", idRutaEditando);
        alert('Error: No se encontró la ruta a editar');
        return;
    }

    rutas = rutas.map(ruta => {// Guardamos los cambios de la ruta
        if (ruta.id === idRutaEditando) {
            return {
                ...ruta,
                nombreRuta: nuevoNombre,
                conductor: nuevoConductor,
                hora: nuevaHora
            };
        }
        return ruta;
    });

    guardarRutasEnLocalStorage();
    actualizarSelectRutas();
    renderRutas(rutas);
    actualizarEstadisticas();
    cerrarModal();
}

//Agregamos funcionalidad a los botones
if (modalClose) modalClose.addEventListener('click', cerrarModal);
if (modalCancelarBtn) modalCancelarBtn.addEventListener('click', cerrarModal);
if (modalGuardarBtn) modalGuardarBtn.addEventListener('click', guardarCambiosRuta);



// Template del Web Component
const template = document.createElement("template");
template.innerHTML = `
<style>
    .tarjeta-ruta {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 15px;
        transition: transform 0.2s;
    }
    .tarjeta-ruta:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .cabecera {
        background: #2c3e50;
        color: white;
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cabecera h3 {
        margin: 0;
        font-size: 1.1rem;
    }
    .botones {
        display: flex;
        gap: 8px;
    }
    .botones button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .botones button:hover {
        background: rgba(255,255,255,0.4);
    }
    .contenido {
        padding: 15px;
    }
    .info {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .info p {
        margin: 5px 0;
        color: #555;
    }
    .info span {
        font-weight: 600;
        color: #2c3e50;
    }
    .lista {
        margin-top: 10px;
    }
    .lista h4 {
        margin: 0 0 10px 0;
        color: #2c3e50;
    }
    .estudiantes {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .estudiante {
        background: #ecf0f1;
        padding: 4px 10px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
    }
    .borrar-estudiante {
        background: none;
        border: none;
        color: #e74c3c;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
    }
    .borrar-estudiante:hover {
        color: #c0392b;
    }
    .sin-estudiantes {
        color: #999;
        font-style: italic;
        font-size: 13px;
    }
    @media (max-width: 768px) {
        .cabecera {
            flex-direction: column;
            text-align: center;
            gap: 8px;
        }
    }
</style>

<div class="tarjeta-ruta">
    <div class="cabecera">
        <h3 class="nombre-ruta">Nombre</h3>
        <div class="botones">
            <button class="editar-btn">Editar</button>
            <button class="eliminar-btn">Eliminar</button>
        </div>
    </div>
    <div class="contenido">
        <div class="info">
            <p>Conductor: <span class="conductor-texto"></span></p>
            <p>Hora: <span class="hora-texto"></span></p>
        </div>
        <div class="lista">
            <h4>Estudiantes asignados:</h4>
            <div class="estudiantes"></div>
        </div>
    </div>
</div>
`;

class tarjeta extends HTMLElement {
    constructor() {

        super();//llamamos al constructor padre
        this.attachShadow({ mode: "open" }); // creamos el shadow DOM para encapsulamiento
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.estudiantes = []; // array donde se almacenan los estudiantes

        //Elementos del sadow DOM
        this.nombreElement = this.shadowRoot.querySelector('.nombre-ruta');
        this.conductorElement = this.shadowRoot.querySelector('.conductor-texto');
        this.horaElement = this.shadowRoot.querySelector('.hora-texto');
        this.estudiantesContainer = this.shadowRoot.querySelector('.estudiantes');
        this.editarBtn = this.shadowRoot.querySelector('.editar-btn');
        this.eliminarBtn = this.shadowRoot.querySelector('.eliminar-btn');
    }

    connectedCallback() {

        //leer los atributos 
        const nombreRuta = this.getAttribute("nombreRuta");
        const conductor = this.getAttribute("conductor");
        const hora = this.getAttribute("hora");

        //Asignamos los atributos
        this.nombreElement.textContent = nombreRuta
        this.conductorElement.textContent = conductor
        this.horaElement.textContent = hora

        //Cargmaos los estudiantes si existen
        const estudiantesAttr = this.getAttribute("estudiantes");
        if (estudiantesAttr) {
            try {
                this.estudiantes = JSON.parse(estudiantesAttr);// convertimos de Json a objeto
                this.actualizarListaEstudiantes();//Mostramos la lista de estudiantes
            } catch (e) {
                console.log("Error al cargar estudiantes:", e);
                this.estudiantes = [];
            }
        }

        this.setupEventListeners();
    }

    actualizarListaEstudiantes() {

        if (!this.estudiantesContainer) return;

        this.estudiantesContainer.innerHTML = "";// Limpiamos el contenedor

        if (this.estudiantes.length === 0) { // si no hay estudiantes
            this.estudiantesContainer.innerHTML = '<div class="sin-estudiantes">No hay estudiantes asignados</div>';
            return;
        }

        this.estudiantes.forEach(estudiante => {// recorremos cada estudiante y creamos su elemento de forma visual

            const estudianteDiv = document.createElement('div');
            estudianteDiv.className = 'estudiante';
            estudianteDiv.innerHTML = `
                ${estudiante.nombre}
                <button class="borrar-estudiante" data-id="${estudiante.id}">X</button>
            `;

            const borrarBtn = estudianteDiv.querySelector('.borrar-estudiante');
            borrarBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // evita que el evento no se propague
                this.removerEstudiante(estudiante.id);
            });

            this.estudiantesContainer.appendChild(estudianteDiv);
        });
    }

    removerEstudiante(id) {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id); // Filtramos eliminando el estudiante
        this.actualizarListaEstudiantes();//Actualizamos visualmente

        this.dispatchEvent(new CustomEvent("estudiante-removido", { // disparamos un evento personalizado
            detail: {
                rutaId: this.getAttribute("data-id"), // ID de la ruta
                estudiantes: this.estudiantes // Lista actualizada
            },
            bubbles: true, // Permite que el evento suba por el DOM
            composed: true // Permite que salga del Shadow DOM
        }));
    }

    setupEventListeners() {// Configuramos los eventos que tiene en las  rutas

        this.editarBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("editar-tarjeta", {// Disparador que manda una señal al aire que luego lo captara un Listerner que obtendra los datos enviados

                detail: {//Datos que recibira el Listerner
                    id: parseInt(this.getAttribute("data-id")),// ID de la ruta
                    nombreRuta: this.nombreElement.textContent,
                    conductor: this.conductorElement.textContent,
                    hora: this.horaElement.textContent,
                    estudiantes: this.estudiantes
                },
                bubbles: true,
                composed: true
            }));
        });

        this.eliminarBtn.addEventListener("click", () => {
            const confirmar = confirm(`Eliminar la ruta "${this.nombreElement.textContent}"?`); // Confirmacion para eliminar
            if (confirmar) {
                this.dispatchEvent(new CustomEvent("eliminar-tarjeta", {
                    detail: {
                        id: parseInt(this.getAttribute("data-id")),
                        nombre: this.nombreElement.textContent
                    },
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }
}

customElements.define("div-tarjeta", tarjeta);// Finalmente regitramos

// API DEL CLIMA 
async function cargarClima() {
    const contenedorClima = document.getElementById('clima');

    if (!contenedorClima) {// Por si x o y motivo no esta el contenedor
        console.error('Contenedor de clima no encontrado');
        return;
    }

    try {

        contenedorClima.innerHTML = '<span class="clima-cargando"> Cargando clima...</span>';//Para darle dinamismo (Mientras hace la consulta)


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(// Permite acceder a la ubicacion del dispositivo
                async (position) => {
                    // Si el usuario permite ubicación, usar coordenadas
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    await obtenerClimaPorCoordenadas(lat, lon);
                },
                async () => {
                    // Por si el dispositivo no permite la ubicacion
                    await obtenerClimaPorCiudad(ciudadPorDeficto);
                }
            );
        } else {
            //Puede que el navegador pueda cargar la ubicacion
            await obtenerClimaPorCiudad(ciudadPorDeficto);
        }

    } catch (error) {
        //Por si falla
        console.warn('Error al cargar el clima:', error);
        contenedorClima.innerHTML = '<span class="clima-cargando"> Error al cargar el clima</span>'
    }
}

async function obtenerClimaPorCiudad(ciudad) {//Alternativa por si no funciona el de coordenadas
    const contenedorClima = document.getElementById('clima');


    try {
        const respuesta = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${ciudad}&lang=es`//Hacemos una peticion con ciudad
        );

        if (!respuesta.ok) {// Un error si no responde para depurar
            throw new Error(`Error ${respuesta.status}: No se pudo obtener el clima`);// Si esto se cumple con el throw lo mandamos directamente al catch
        }

        const datos = await respuesta.json();
        actualizarInterfazClima(datos);

    } catch (error) {
        console.warn('Error obteniendo clima por ciudad:', error);
        contenedorClima.innerHTML = '<span class="clima-cargando"> Error al cargar el clima</span>'//Modificamos el contenedor del clima para depurar
    }
}

async function obtenerClimaPorCoordenadas(lat, lon) {

    const contenedorClima = document.getElementById('clima');


    try {
        const respuesta = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${lat},${lon}&lang=es`//Hacemos una peticion con coordenadas
        );

        if (!respuesta.ok) {// Un error si no responde para depurar
            throw new Error(`Error ${respuesta.status}: No se pudo obtener el clima`);
        }

        const datos = await respuesta.json();//Pasamos la peticion a una variable con formato Json
        actualizarInterfazClima(datos);// Si esto se cumple con el throw lo mandamos directamente al catch

    } catch (error) {
        console.error('Error obteniendo clima por coordenadas:', error);
        await obtenerClimaPorCiudad(ciudadPorDeficto);
    }
}

function actualizarInterfazClima(datos) {

    const contenedorClima = document.getElementById('clima');


    // Extraemos los datos del clima por medio del Json
    const temperatura = Math.round(datos.current.temp_c);
    const sensacionTermica = Math.round(datos.current.feelslike_c);
    const descripcion = datos.current.condition.text;
    const humedad = datos.current.humidity;
    const viento = Math.round(datos.current.wind_kph);
    const ciudad = datos.location.name;
    const pais = datos.location.country;
    const iconoUrl = `https:${datos.current.condition.icon}`;
    const horaLocal = datos.location.localtime;
    const esDeNoche = datos.current.is_day === 0;

    //Creamos lo que se va a poner en el HTML
    contenedorClima.innerHTML = `
        <div class="clima-contenedor">
            <div class="clima-principal">
                <img src="${iconoUrl}" alt="${descripcion}" class="clima-icono">
                <div class="clima-temperatura">
                    <span class="temp-valor">${temperatura}</span>
                    <span class="temp-unidad">°C</span>
                </div>
            </div>
            <div class="clima-detalles">
                <div class="clima-ciudad">${ciudad}, ${pais}</div>
                <div class="clima-descripcion">${descripcion}</div>
                <div class="clima-extra">
                    <span class="clima-humedad">💧 ${humedad}%</span>
                    <span class="clima-viento">🌬️ ${viento} km/h</span>
                    <span class="clima-sensacion">🌡️ Sensación: ${sensacionTermica}°C</span>
                </div>
            </div>
        </div>
    `;


    if (esDeNoche) {
        contenedorClima.classList.add('clima-nocturno');
    } else {
        contenedorClima.classList.remove('clima-nocturno');
    }

    console.log(`Clima actualizado: ${ciudad} - ${temperatura}°C - ${descripcion}`);
}


document.addEventListener('DOMContentLoaded', () => {
    // Delay para darele dinamismo a la pagina
    setTimeout(() => {
        cargarClima();
    }, 2000);

    // Atualizamos el clima
    setInterval(() => {
        cargarClima();
        console.log('Actualizando clima automáticamente...');
    }, 900000);
});

//Renderizar todo apenas se ejecute la pagina
cargarRutasDesdeLocalStorage();
actualizarSelectRutas();
renderRutas(rutas);
actualizarEstadisticas();
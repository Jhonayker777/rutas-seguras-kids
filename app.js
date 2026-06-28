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

// Elementos del filtro
const inputFiltro = document.getElementById('RutasFiltroInput');
const btnLimpiarFiltro = document.getElementById('limpiarFiltro');
const resultadosFiltro = document.getElementById('resultadosFiltro');

let idRutaEditando = null;
let modoEdicion = false;
let textoFiltro = '';
let rutasFiltradas = [];

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
            estudiantes: ruta.estudiantes || []
        }));

        localStorage.setItem(storageKey, JSON.stringify(rutasParaGuardar));
        console.log('Rutas guardadas:', rutasParaGuardar.length);
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

//Cargar desde el localStorage
function cargarRutasDesdeLocalStorage() {
    try {
        const rutasGuardadas = localStorage.getItem(storageKey);

        if (rutasGuardadas) {
            const rutasParseadas = JSON.parse(rutasGuardadas);

            if (Array.isArray(rutasParseadas)) {
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
        const todosLosInputs = document.querySelectorAll('#formRuta input');
        todosLosInputs.forEach(input => {

            input.value = '';
            input.classList.remove("error-input")

        })

        modoEdicion = false;
        idRutaEditando = null;
        if (btnCancelar) btnCancelar.style.display = 'none';
        console.log("formulario de rutas limpiado")
    }

    if (tipoformulario === formularioEstudiante) {
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
    event.preventDefault();

    if (validacionesRutas() === true) {
        if (modoEdicion) {
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
    // Re-aplicar filtro después de agregar
    if (inputFiltro) {
        filtrarRutas();
    } else {
        renderRutas(rutas);
    }
    actualizarEstadisticas();
}

function actualizarRuta() {

    //Extraemos los valores
    const nuevoNombre = inputNombreRuta.value;
    const nuevoConductor = inputConductor.value;
    const nuevaHora = inputHoraSalida.value;

    rutas = rutas.map(ruta => {
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
    // Re-aplicar filtro después de editar
    if (inputFiltro) {
        filtrarRutas();
    } else {
        renderRutas(rutas);
    }
    actualizarEstadisticas();
}

// ========== FILTRO DE RUTAS ==========
function filtrarRutas() {
    if (!inputFiltro) return;
    
    textoFiltro = inputFiltro.value.toLowerCase().trim();
    
    if (textoFiltro === '') {
        // Si no hay texto, mostrar todas
        rutasFiltradas = [...rutas];
        if (btnLimpiarFiltro) btnLimpiarFiltro.style.display = 'none';
    } else {
        // Filtrar por nombre, conductor o estudiante
        rutasFiltradas = rutas.filter(ruta => {
            // Buscar en nombre de la ruta
            if (ruta.nombreRuta.toLowerCase().includes(textoFiltro)) return true;
            
            // Buscar en nombre del conductor
            if (ruta.conductor.toLowerCase().includes(textoFiltro)) return true;
            
            // Buscar en nombres de estudiantes
            if (ruta.estudiantes && ruta.estudiantes.length > 0) {
                for (let estudiante of ruta.estudiantes) {
                    if (estudiante.nombre.toLowerCase().includes(textoFiltro)) {
                        return true;
                    }
                }
            }
            
            return false;
        });
        
        if (btnLimpiarFiltro) btnLimpiarFiltro.style.display = 'flex';
    }
    
    // Actualizar contador de resultados
    if (resultadosFiltro) {
        resultadosFiltro.textContent = `Mostrando ${rutasFiltradas.length} de ${rutas.length} rutas`;
    }
    
    // Renderizar las rutas filtradas
    renderRutasFiltradas();
}

// Renderizar solo las rutas filtradas
function renderRutasFiltradas() {
    if (!contenedorRutas) return;
    
    if (rutasFiltradas.length === 0) {
        if (textoFiltro) {
            contenedorRutas.innerHTML = `
                <div class="sin-resultados">
                    <span class="icono">🔍</span>
                    <div class="mensaje">No se encontraron rutas para "<strong>${textoFiltro}</strong>"</div>
                    <div class="submensaje">Intenta con otra palabra o limpia la búsqueda</div>
                </div>
            `;
        } else {
            contenedorRutas.innerHTML = '<div class="mensaje-vacio">No hay rutas.</div>';
        }
        return;
    }
    
    contenedorRutas.innerHTML = "";
    
    rutasFiltradas.forEach((element) => {
        const tarjeta = document.createElement("div-tarjeta");
        
        tarjeta.setAttribute("nombreRuta", element.nombreRuta);
        tarjeta.setAttribute("conductor", element.conductor);
        tarjeta.setAttribute("hora", element.hora);
        tarjeta.setAttribute("data-id", element.id);
        
        if (element.estudiantes && element.estudiantes.length > 0) {
            tarjeta.setAttribute("estudiantes", JSON.stringify(element.estudiantes));
        }
        
        tarjeta.addEventListener("editar-tarjeta", (e) => {
            abrirModalEdicion(e.detail);
        });
        
        tarjeta.addEventListener("eliminar-tarjeta", (e) => {
            rutas = rutas.filter(r => r.id != e.detail.id);
            guardarRutasEnLocalStorage();
            actualizarSelectRutas();
            // Re-aplicar filtro después de eliminar
            if (inputFiltro) {
                filtrarRutas();
            } else {
                renderRutas(rutas);
            }
            actualizarEstadisticas();
        });
        
        tarjeta.addEventListener("estudiante-removido", (e) => {
            const rutaId = parseInt(e.detail.rutaId);
            const rutaIndex = rutas.findIndex(r => r.id === rutaId);
            if (rutaIndex !== -1) {
                rutas[rutaIndex].estudiantes = e.detail.estudiantes;
                guardarRutasEnLocalStorage();
                actualizarEstadisticas();
                // Re-aplicar filtro después de eliminar estudiante
                if (inputFiltro) {
                    filtrarRutas();
                } else {
                    renderRutas(rutas);
                }
            }
        });
        
        contenedorRutas.appendChild(tarjeta);
    });
}

// Configurar eventos del filtro
function configurarFiltro() {
    if (!inputFiltro) return;
    
    // Filtrar en tiempo real mientras escribe
    inputFiltro.addEventListener('input', filtrarRutas);
    
    // Limpiar filtro con el botón
    if (btnLimpiarFiltro) {
        btnLimpiarFiltro.addEventListener('click', () => {
            inputFiltro.value = '';
            filtrarRutas();
            inputFiltro.focus();
        });
    }
    
    // Limpiar con tecla Escape
    inputFiltro.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            inputFiltro.value = '';
            filtrarRutas();
            inputFiltro.blur();
        }
    });
}

function agregarEstudiante() {

    //Extraemos los valores
    const nombreEstudiante = inputNombreEstudiante.value.trim();
    const rutaId = parseInt(selectRuta.value);

    const rutaIndex = rutas.findIndex(r => r.id === rutaId);

    if (rutaIndex !== -1) {
        const nuevoEstudiante = {
            id: generarId(),
            nombre: nombreEstudiante
        };

        if (!rutas[rutaIndex].estudiantes) {
            rutas[rutaIndex].estudiantes = [];
        }

        rutas[rutaIndex].estudiantes.push(nuevoEstudiante);

        guardarRutasEnLocalStorage();
        // Re-aplicar filtro después de agregar estudiante
        if (inputFiltro) {
            filtrarRutas();
        } else {
            renderRutas(rutas);
        }
        actualizarEstadisticas();

        console.log("Estudiante agregado correctamente");

    } else {
        // Error si no se encuentra la ruta
        mostrarErrorEstudiantes(selectRuta, contenedorSelectRuta, "No se encontró la ruta seleccionada");
    }
}

//Actualizar el select en el apartado de estudiantes
function actualizarSelectRutas() {
    if (!selectRuta) return;

    selectRuta.innerHTML = '<option value="">Seleccione una ruta</option>';

    rutas.forEach(ruta => {

        const option = document.createElement('option');

        option.value = ruta.id;
        option.textContent = `${ruta.nombreRuta} - ${ruta.conductor}`;
        selectRuta.appendChild(option);
    });
}

function actualizarEstadisticas() {

    if (spanTotalRutas) spanTotalRutas.textContent = rutas.length;

    let totalEstudiantes = 0;
    rutas.forEach(ruta => {
        totalEstudiantes += ruta.estudiantes ? ruta.estudiantes.length : 0;
    });

    if (spanTotalEstudiantes) spanTotalEstudiantes.textContent = totalEstudiantes;

    const promedio = rutas.length > 0 ? (totalEstudiantes / rutas.length).toFixed(1) : 0;
    if (spanPromedioRuta) spanPromedioRuta.textContent = promedio;
}

function renderRutas(dato_ruta) {

    // Actualizar el array global si se pasó uno nuevo
    if (dato_ruta) {
        rutas = dato_ruta;
    }
    
    // Resetear filtro
    if (inputFiltro) {
        inputFiltro.value = '';
        if (btnLimpiarFiltro) btnLimpiarFiltro.style.display = 'none';
        if (resultadosFiltro) {
            resultadosFiltro.textContent = `Mostrando ${rutas.length} de ${rutas.length} rutas`;
        }
    }
    
    // Mostrar todas las rutas
    rutasFiltradas = [...rutas];
    renderRutasFiltradas();
}

function abrirModalEdicion(datosRuta) {

    if (!datosRuta || !datosRuta.id) {
        console.error("No se recibieron datos validos para editar");
        return;
    }

    document.getElementById('modalEditandoId').value = datosRuta.id;
    document.getElementById('modalNombreRuta').value = datosRuta.nombreRuta;
    document.getElementById('modalConductor').value = datosRuta.conductor;
    document.getElementById('modalHoraSalida').value = datosRuta.hora;

    idRutaEditando = datosRuta.id;

    modal.style.display = 'flex';
}

function cerrarModal() {

    modal.style.display = 'none';

    document.getElementById('modalNombreRuta').value = '';
    document.getElementById('modalConductor').value = '';
    document.getElementById('modalHoraSalida').value = '';
    document.getElementById('modalEditandoId').value = '';
    idRutaEditando = null;
}

function guardarCambiosRuta() {

    const nuevoNombre = document.getElementById('modalNombreRuta').value.trim();
    const nuevoConductor = document.getElementById('modalConductor').value.trim();
    const nuevaHora = document.getElementById('modalHoraSalida').value;

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

    const rutaOriginal = rutas.find(r => r.id === idRutaEditando);

    if (!rutaOriginal) {
        console.warn("No se encontro la ruta con ID:", idRutaEditando);
        alert('Error: No se encontró la ruta a editar');
        return;
    }

    rutas = rutas.map(ruta => {
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
    // Re-aplicar filtro después de guardar cambios
    if (inputFiltro) {
        filtrarRutas();
    } else {
        renderRutas(rutas);
    }
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

        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.estudiantes = [];

        this.nombreElement = this.shadowRoot.querySelector('.nombre-ruta');
        this.conductorElement = this.shadowRoot.querySelector('.conductor-texto');
        this.horaElement = this.shadowRoot.querySelector('.hora-texto');
        this.estudiantesContainer = this.shadowRoot.querySelector('.estudiantes');
        this.editarBtn = this.shadowRoot.querySelector('.editar-btn');
        this.eliminarBtn = this.shadowRoot.querySelector('.eliminar-btn');
    }

    connectedCallback() {

        const nombreRuta = this.getAttribute("nombreRuta");
        const conductor = this.getAttribute("conductor");
        const hora = this.getAttribute("hora");

        this.nombreElement.textContent = nombreRuta
        this.conductorElement.textContent = conductor
        this.horaElement.textContent = hora

        const estudiantesAttr = this.getAttribute("estudiantes");
        if (estudiantesAttr) {
            try {
                this.estudiantes = JSON.parse(estudiantesAttr);
                this.actualizarListaEstudiantes();
            } catch (e) {
                console.log("Error al cargar estudiantes:", e);
                this.estudiantes = [];
            }
        }

        this.setupEventListeners();
    }

    actualizarListaEstudiantes() {

        if (!this.estudiantesContainer) return;

        this.estudiantesContainer.innerHTML = "";

        if (this.estudiantes.length === 0) {
            this.estudiantesContainer.innerHTML = '<div class="sin-estudiantes">No hay estudiantes asignados</div>';
            return;
        }

        this.estudiantes.forEach(estudiante => {

            const estudianteDiv = document.createElement('div');
            estudianteDiv.className = 'estudiante';
            estudianteDiv.innerHTML = `
                ${estudiante.nombre}
                <button class="borrar-estudiante" data-id="${estudiante.id}">X</button>
            `;

            const borrarBtn = estudianteDiv.querySelector('.borrar-estudiante');
            borrarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removerEstudiante(estudiante.id);
            });

            this.estudiantesContainer.appendChild(estudianteDiv);
        });
    }

    removerEstudiante(id) {
        this.estudiantes = this.estudiantes.filter(e => e.id !== id);
        this.actualizarListaEstudiantes();

        this.dispatchEvent(new CustomEvent("estudiante-removido", {
            detail: {
                rutaId: this.getAttribute("data-id"),
                estudiantes: this.estudiantes
            },
            bubbles: true,
            composed: true
        }));
    }

    setupEventListeners() {

        this.editarBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("editar-tarjeta", {

                detail: {
                    id: parseInt(this.getAttribute("data-id")),
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
            const confirmar = confirm(`Eliminar la ruta "${this.nombreElement.textContent}"?`);
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

customElements.define("div-tarjeta", tarjeta);

// API DEL CLIMA 
async function cargarClima() {
    const contenedorClima = document.getElementById('clima');

    if (!contenedorClima) {
        console.error('Contenedor de clima no encontrado');
        return;
    }

    try {

        contenedorClima.innerHTML = '<span class="clima-cargando"> Cargando clima...</span>';


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    await obtenerClimaPorCoordenadas(lat, lon);
                },
                async () => {
                    await obtenerClimaPorCiudad(ciudadPorDeficto);
                }
            );
        } else {
            await obtenerClimaPorCiudad(ciudadPorDeficto);
        }

    } catch (error) {
        console.warn('Error al cargar el clima:', error);
        contenedorClima.innerHTML = '<span class="clima-cargando"> Error al cargar el clima</span>'
    }
}

async function obtenerClimaPorCiudad(ciudad) {
    const contenedorClima = document.getElementById('clima');


    try {
        const respuesta = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${ciudad}&lang=es`
        );

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: No se pudo obtener el clima`);
        }

        const datos = await respuesta.json();
        actualizarInterfazClima(datos);

    } catch (error) {
        console.warn('Error obteniendo clima por ciudad:', error);
        contenedorClima.innerHTML = '<span class="clima-cargando"> Error al cargar el clima</span>'
    }
}

async function obtenerClimaPorCoordenadas(lat, lon) {

    const contenedorClima = document.getElementById('clima');


    try {
        const respuesta = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${ApiKey}&q=${lat},${lon}&lang=es`
        );

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: No se pudo obtener el clima`);
        }

        const datos = await respuesta.json();
        actualizarInterfazClima(datos);

    } catch (error) {
        console.error('Error obteniendo clima por coordenadas:', error);
        await obtenerClimaPorCiudad(ciudadPorDeficto);
    }
}

function actualizarInterfazClima(datos) {

    const contenedorClima = document.getElementById('clima');

    const temperatura = Math.round(datos.current.temp_c);
    const sensacionTermica = Math.round(datos.current.feelslike_c);
    const descripcion = datos.current.condition.text;
    const humedad = datos.current.humidity;
    const viento = Math.round(datos.current.wind_kph);
    const ciudad = datos.location.name;
    const pais = datos.location.country;
    const iconoUrl = `https:${datos.current.condition.icon}`;
    const esDeNoche = datos.current.is_day === 0;

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
    setTimeout(() => {
        cargarClima();
    }, 2000);

    setInterval(() => {
        cargarClima();
        console.log('Actualizando clima automáticamente...');
    }, 900000);
});

// ========== INICIALIZACIÓN ==========
cargarRutasDesdeLocalStorage();
actualizarSelectRutas();
configurarFiltro(); // Inicializar el filtro
renderRutas(rutas);
actualizarEstadisticas();
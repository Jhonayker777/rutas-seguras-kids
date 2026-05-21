let rutas = [];

let modoEdicion = false;
let idEditando = null;


// Formularios
const formularioRuta = document.getElementById('formRuta');
const formularioEstudiante = document.getElementById('formEstudiante');

// Inputs del formulario de rutas
const inputNombreRuta = document.getElementById('nombreRuta');
const inputConductor = document.getElementById('conductor');
const inputHoraSalida = document.getElementById('horaSalida');
const inputIdEditando = document.getElementById('editandoId');

// Inputs del formulario de estudiantes
const inputNombreEstudiante = document.getElementById('nombreEstudiante');
const selectRuta = document.getElementById('selectRuta');

// Contenedores
const contenedorRutas = document.getElementById('contenedorRutas');
const contenedorInputRuta = document.getElementById('contenedor-input-ruta');
const contenedorInputConductor = document.getElementById('contenedor-input-conductor');
const contendedorHoraSalida = document.getElementById('contenedor-hora-salida');

// Botones
const btnCancelar = document.getElementById('cancelarBtn');

// Elementos de estadísticas
const spanTotalRutas = document.getElementById('totalRutas');
const spanTotalEstudiantes = document.getElementById('totalEstudiantes');
const spanPromedioRuta = document.getElementById('promedioRuta');



function generarId() {
    return Date.now()
}

function mostrarError(valor, contenderoValor) {
    valor.classList.add("error-input")

    const alerta = document.createElement('div')
    alerta.textContent = "⚠️ Este campo es obligatorio";
    alerta.id = "toast-nombreRuta"
    alerta.className ="toast-alerta"

    contenderoValor.appendChild(alerta)

    alerta.classList.add('mostrar');

    setTimeout(() => {
        alerta.classList.remove('mostrar');
        
    }, 3000);

}

function validacionesRutas() {
    if (inputNombreRuta.value.trim() === "") {
        mostrarError(inputNombreRuta, contenedorInputRuta);
        return false
    }

    if (inputConductor.value.trim() === "") {
        mostrarError(inputConductor, contenedorInputConductor);
        return false
    }

    if (inputHoraSalida.value.trim() === "") {
        mostrarError(inputHoraSalida, contendedorHoraSalida);
        return false
    }

    return true
}

function clear(tipoformulario) {
    if ( tipoformulario === formularioRuta) {
        const todosLosInputs = document.querySelectorAll('#formRuta input');
        todosLosInputs.forEach(input => {
            input.value = '';
            input.classList.remove("error-input")

        })
        console.log("formulario de rutas limpiado")
    }

    if (tipoformulario === formularioEstudiante) {
        const todosLosInputs = document.querySelectorAll('#formEstudiante input');
        todosLosInputs.forEach(input => {
            input.value = '';
            input.classList.remove("error-input")
        })
        console.log("Formulario de estudiantes limpiado")
    }

}

formularioRuta.addEventListener('submit', function(event) {
    const validado =validacionesRutas()
        
    if(validado === true){
        event.preventDefault();// PREVENIR el envío automático del formulario
        
        agregarRuta()
        clear(formularioRuta)
        console.log('Ruta creada');
    } else {
        console.log("No se pudo crear ruta")
    }
});

function agregarRuta(){
    

    const datosRuta ={
        id: generarId(),
        conducor: inputConductor.value,
        hora: inputHoraSalida.value
    }
    if (idEditando) {
        rutas = rutas.map(u => 
            u.id === idEditando ? datosRuta : u
        )
    } else {
        rutas.push(datosRuta)
    }

}

function renderRutas(dato_ruta){
    contenedorRutas.innerHTML= "";
    
    dato_ruta.forEach(element =>{
        contenedorRutas.innerHTML += `
        
        <div-tarjeta
        NombreRuta= "${element.nombreRuta}"
        conductor= "${element.conducor}"
        Hora= "${element.hora}"
        
        ></div-tarjeta>
        `
    })


}

const template = document.createElement("template");

template.innerHTML = `
<style>
            /* Estilos que SOLO afectan a esta tarjeta */
            .tarjeta-ruta {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 15px;
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
                    <button class="editar-btn">✏️ Editar</button>
                    <button class="eliminar-btn">🗑️ Eliminar</button>
                </div>
            </div>

            <div class="contenido">
                <div class="info">
                    <p>🚍 Conductor: <span class="conductor-texto"></span></p>
                    <p>⏰ Hora: <span class="hora-texto"></span></p>
                </div>
                <div class="lista">
                    <h4>📚 Estudiantes asignados:</h4>
                    <div class="estudiantes"></div>
                </div>
            </div>
        </div>
`

class tarjeta extends HTMLElement {
    
    constructor() {
        super(); // inicializamos todo el compponente
        this.attachShadow({ mode: "open" })//activamos el shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true)); // permite clonar el molde 
    }

    connectedCallback() {
        const nombre = this.getAttribute("nombre");
        const conductor = this.getAttribute("conductor");
        const hora = this.getAttribute("hora");

        this.shadowRoot.querySelector("h3").textContent = nombre;
        this.shadowRoot.querySelector("p").textContent = conductor;
        this.shadowRoot.querySelector("p").textContent = hora;
        this.shadowRoot.querySelector("button").textContent = boton;
    
    this.shadowRoot.querySelector("button")
    .addEventListener("click", ()=>{
        alert("Seleccionaste: "+titulo);
    })
    }   
}

customElements.define("div-tarjeta", tarjeta)
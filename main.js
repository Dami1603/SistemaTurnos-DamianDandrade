const Turno = function(nombre, dni, email, especialista, fecha, hora){
    this.nombre = nombre,
    this.dni = dni,
    this.email = email,
    this.especialista = especialista,
    this.fecha = fecha,
    this.hora = hora
}

let turno1= new Turno("Damian",45283450,"damia@gmail.com","Dermatologo","2024-09-01","10:30")
let turno2= new Turno("Pedro",42345654,"pedro@hotmail","Cardiologo","2024-10-12","12:30")
let turno3 = new Turno("Maria",30423123,"maria@gmail.com","Cardiologo","2024-12-22", "14:30")

let lista = [turno1,turno2,turno3]

///se carga en el localstorage los turnos predefinidos
if(localStorage.getItem("turnos")){
    lista = JSON.parse(localStorage.getItem("turnos"))
}else{
    lista = lista
}

///esta funcion, se encarga de obtener la lista desde el localstorage, para mostrar en una tabla
function actualizarlista() {
    ///se trae y se parsea, informacion del localStorage "turnos" en un nuevo  array
    let turnosGuardados = JSON.parse(localStorage.getItem("turnos")) || [];  /// se traen los turnos desde el localStorage

    console.table(turnosGuardados);
    /// se busca, si ya esta creado el div en el documento y sino se crea
    let contenedor = document.getElementById("turnos-container"); 
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "turnos-container";
        document.body.appendChild(contenedor);
    }

    /// Limpia el contenido anterior antes de agregar la tabla
    contenedor.innerHTML = "";
    ///en caso de estar vacia, se muestra un mensaje en el index
    if (turnosGuardados.length === 0) {
        contenedor.innerHTML = `<h2 class="display-5 fw-bold text-body-emphasis text-center">Todavia no hay turnos agendados :/</h2>
        <p class="mb-4 text-center">Puedes agendar turnos con el boton, para empezar a llenar el calendario!</p>`;
        return;
    }
    ///si se encuentra informacion , mediante un map, traemos los datos a un nuevo array
        let tablaHTML = ` <div class="col-lg-6 mx-auto my-5">
                <img class="d-block mx-auto" src="./assets/turnos.png" alt="" width="144" height="auto">
        <h2 class="display-5 fw-bold text-body-emphasis text-center">Turnos Agendados</h2>
        <p class="mb-4 text-center">Aca se encuentran todos los turnos, ya agendados, siempre que sumes mas, se actualizara la lista</p>
        <div class="table-responsive">     
        <table class="table table-bordered w-100 text-center">
                <thead class= table-danger table-responsive>
                    <tr>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Especialista</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    ${turnosGuardados
                        .map(
                            (turno) =>
                                `<tr>
                                    <td>${turno.nombre}</td>
                                    <td>${turno.dni}</td>
                                    <td>${turno.email}</td>
                                    <td>${turno.especialista}</td>
                                    <td>${turno.fecha}</td>
                                    <td>${turno.hora}</td>
                                </tr>`
                        )
                        .join("")}
                </tbody>
            </table>
        </div>
    </div>`;

        contenedor.innerHTML = tablaHTML;
}

///esta funcion, consumir una api , que obtiene 3 personas "random" y obtener sus datos para mostrarlos
function cargarapidoctores() {
    let url = "https://randomuser.me/api/?results=3&gender=male&nat=ES"; /// pasamos el url con los parametros, apropiados para que traiga 3 personas, hombres y de nacionalidad española en este caso
    let doctoresContainer = document.getElementById("doctores-container");
    ///se busca ver si ya no esta creado, para evitar que se repita
    if (!doctoresContainer) {
        doctoresContainer = document.createElement("div");
        doctoresContainer.id = "doctores-container";
        /// en este caso, agrego clases para que mediante boostrap, tome forma de un contenedor
        doctoresContainer.classList.add("container", "text-center");
        doctoresContainer.innerHTML = `
            <img class="d-block mx-auto" src="./assets/doctores.png" alt="Icono doctores" width="144">
            <h3 class="display-5 fw-bold  text-center">Nuestros doctores</h3>
            <p class="mb-4 text-center">Aca te mostramos algunos de nuestros profesionales!</p>
            <div class="row justify-content-center" id="doctores-row"></div>
        `;
        document.body.appendChild(doctoresContainer);
    }
    /// creo esta variable, para poder tomar el div en forma row y mostrarlos como columnas
    let doctoresRow = document.getElementById("doctores-row");

    fetch(url)
        .then(res => res.json()) //pasamos la respuesta de la api a json
        .then(data => {
            /// creamos una variable para guardar los datos 
            const doctores = data.results;

            doctores.forEach(doctor => {
                const doctorElement = document.createElement("div");
                doctorElement.classList.add("col-auto", "text-center", "m-3");
                doctorElement.innerHTML = `
                    <img src="${doctor.picture.large}" alt="" class="rounded-circle border" style="width: 150px; height: 150px;">
                    <h5 class="mt-2 fs-4">Dr. ${doctor.name.first} ${doctor.name.last}</h5>
                `;
                /// en vez de pasarlos por doctoresContainer, pasamos a doctoresRow quien si esta dentro del container, asi tomamos el div en row
                doctoresRow.appendChild(doctorElement);
            });
        })
        .catch(error => console.log("Error al obtener datos:", error));
}

///esta funcion se encarga, de obtener los datos de la funcion eliminar, filtrar y actualizar la lista
function eliminarTurno(dni, fecha, hora, especialista) {
    ///mediante los parametros , filtramos la lista, tomando en cuenta que todas las condiciones se cumplan, la excluimos y la actualizamos
    Swal.fire({
        title: "¿Eliminar este turno?",
        text: `DNI: ${dni} | Fecha: ${fecha} | Hora: ${hora} | Especialista: ${especialista}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            lista = lista.filter(turno => !(turno.dni === dni && turno.fecha === fecha && turno.hora === hora && turno.especialista === especialista));
            localStorage.setItem("turnos", JSON.stringify(lista));
            Swal.fire("Eliminado", "El turno ha sido eliminado.", "success");
        }
        actualizarlista()
    });
}

///esta funcion se encarga, mediante el dni ingresado, filtrar la lista, para mostrar los turnos del dni
function eliminarTurnoPorDNI(){
    Swal.fire({
        title: 'Eliminar un Turno',
        text: `Ingresa el DNI del paciente, para eliminar su turno`,
        html: `<label>DNI:</label><input id="inputDNIEliminar" class="swal2-input" type="number" autofocus>`,
        showCancelButton: true,
        confirmButtonText: "Buscar",
        cancelButtonText: "Cancelar",
    }).then((result)=>{
        if(result.isConfirmed){
            let dnieliminar = document.getElementById("inputDNIEliminar").value.trim();
            let resultado = lista.filter((turno)=> turno.dni == dnieliminar)
            /// dentro del  html, agregamos en la tabla, un boton que ejecute la funcion eliminarTurno y se lleve los parametros de la fila seleccionada
            if(resultado.length >0){
                Swal.fire({
                    title: `Estos son los turnos disponibles`,
                    icon: 'warning',
                    width: 'auto',
                    html: `<table class="table table-bordered w-auto text-center"> 
                        <thead> 
                            <tr> 
                                <th>Nombre</th> <th>DNI</th> <th>Email</th> <th>Especialista</th> <th>Fecha</th> <th>Hora</th> <th>Acción</th>
                            </tr> 
                        </thead>  
                        <tbody> 
                            ${resultado.map(turno => `
                                <tr>
                                    <td>${turno.nombre}</td>
                                    <td>${turno.dni}</td>
                                    <td>${turno.email}</td>
                                    <td>${turno.especialista}</td>
                                    <td>${turno.fecha}</td>
                                    <td>${turno.hora}</td>
                                    <td><button class="btn btn-danger" onclick="eliminarTurno('${turno.dni}', '${turno.fecha}', '${turno.hora}', '${turno.especialista}')">Eliminar</button></td>
                                </tr>`).join('')}
                        </tbody> 
                    </table>`,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    showConfirmButton: true
                })
            }else{
                Swal.fire({
                    title: `Error`,
                    text: `No se encontraron turnos asociados con el DNI: ${dnieliminar}`
                })
            }
        }
    })
}

///esta funcion se encarga, mediante el especialista elegido, filtrar la lista con solo los objeto con el mismo especialista
function filtrarporEspecialista(){
    /// mismo resultado que eliminarTurnoPorDNI, buscamos en la lista, filtrando por el especialista seleccionado, no actualizamos en este caso para evitar reducirla
    Swal.fire({
        title: 'Buscar Turnos por Especialista',
        icon: 'info',
        text: 'Elije el tipo de especialista',
        html: `
        <label for="especialistafiltro" style="margin-top: 10px;">Especialista:</label>
        <select id="inputEspecialistaFiltro" class="swal2-select">
            <option value="Dermatologo">Dermatologo</option>
            <option value="Cardiologo">Cardiologo</option>
            <option value="Traumatologo">Traumatologo</option>
            <option value="Neurologo">Neurologo</option>
        </select>        
        `,
        confirmButtonText: "Buscar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then((result)=>{
        if(result.isConfirmed){
            let especialistafiltro = document.getElementById("inputEspecialistaFiltro").value.trim();
            let resultado = lista.filter((turno)=> turno.especialista.includes(especialistafiltro))
            if(resultado.length >0){
                Swal.fire({
                    width: 'auto',
                    title: `Estos son los turnos del ${especialistafiltro}`,
                    html: `<table class="table table-bordered w-100 text-center "> <thead> <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Hora</th>
            </tr> </thead>`+
                    resultado.map( (turno)=> `<tbody> <tr><td>${turno.nombre}</td> <td>${turno.dni}</td> <td>${turno.email}</td> <td>${turno.fecha}</td> <td>${turno.hora}</td> </tbody>`) ,
                })
                console.table(resultado)
            }else{
                Swal.fire({
                    title: `El especialista ${especialistafiltro} no tiene turnos`,
                    icon: 'error',
                })
            }
        }
    })
}

///esta funcion se encarga, de agregar en la lista, un nuevo turno
function agendarTurno(){
    /// esta variable, toma el dia de hoy y los 10 primeros, para traer el formato, YYYY-MM-DD , año , mes y dia, ya que para la hora la seleccionamos
    /// la creacion de esta variable, es para evitar que se elijan fechas anteriores al dia de hoy, mediante min, quien establece la fecha minima
    let hoy = new Date().toISOString().slice(0,10);
    Swal.fire({
        /// en  el html, se forma un container y se separa cada label y input, en un div con clase row, para poder formarlizar y permitir mejor visualizacion del ingreso
        title: 'Agendar Turno',
        icon: 'info',
        html: `<div class="container ">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="inputNombre" class="form-label">Nombre:</label>
                    <input id="inputNombre" class="form-control" type="text" autofocus>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="inputDNI" class="form-label">DNI:</label>
                    <input id="inputDNI" class="form-control" type="number">
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="inputEmail" class="form-label">Email:</label>
                    <input id="inputEmail" class="form-control" type="email">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="inputEspecialista" class="form-label">Especialista:</label>
                    <select id="inputEspecialista" class="form-select">
                        <option value="Dermatologo">Dermatólogo</option>
                        <option value="Cardiologo">Cardiólogo</option>
                        <option value="Traumatologo">Traumatólogo</option>
                        <option value="Neurologo">Neurólogo</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="inputFecha" class="form-label">Fecha:</label>
                    <input id="inputFecha" class="form-control" type="date" min="${hoy}">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="inputHora" class="form-label">Hora:</label>
                    <select id="inputHora" class="form-select">
                        <option value="10:30">10:30</option>
                        <option value="12:30">12:30</option>
                        <option value="14:30">14:30</option>
                        <option value="16:30">16:30</option>
                    </select>
                </div>
            </div>
        </div>`,
        confirmButtonText: "Agendar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then((result)=>{
        /// tomamos todos los datos del html, para poder formar el turno
        if(result.isConfirmed){
            let nombre = document.getElementById("inputNombre").value.trim();
            let dni = document.getElementById("inputDNI").value.trim();
            let email = document.getElementById("inputEmail").value.trim();
            let especialista = document.getElementById("inputEspecialista").value.trim();
            let fecha = document.getElementById("inputFecha").value.trim();
            let hora = document.getElementById("inputHora").value.trim();

            if(isNaN(dni) || nombre ==="" || email === ""){
                Swal.fire({
                    icon:'error',
                    title:'Error',
                    text:'por favor ingresa nuevamente'
                }
                );return
            }

            if(dni.length !== 8){
                Swal.fire({
                    icon:'error',
                    title:'Error',
                    text:'por favor ingresa un documento valido'
                }
                );return
            }

            if(!email.includes("@")){
                Swal.fire({
                    icon:'error',
                    title:'Error',
                    text:'por favor ingresa un email valido'
                }
                );return
            }


            let turno = new Turno(nombre,dni,email,especialista,fecha,hora)
            /// buscamos evitar que se repita, dos veces el mismo turno, con el mismo especialista, la misma hora y fecha
            /// asi igualmente un paciente puede tener 2 turnos con diferentes especialistas
            if(lista.some((elemento)=> 
                elemento.dni === turno.dni &&
                elemento.fecha === turno.fecha &&
                elemento.hora === turno.hora &&
                elemento.especialista === turno.especialista)){
                const turnoexiste = lista.find((elemento)=> elemento.dni === turno.dni)
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: `${turnoexiste.nombre}, DNI: ${turnoexiste.dni}, ya tiene un turno registrado con el ${turnoexiste.especialista}`
                }); return
            }
            /// evitamos que tenga turno con el mismo especialista el mismo dia y fecha, que otro paciente
            if (lista.some(elemento => 
                elemento.fecha === turno.fecha &&
                elemento.hora === turno.hora &&
                elemento.especialista === turno.especialista)) {
            
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Ya existe un turno para el ${turno.especialista} el ${turno.fecha} a las ${turno.hora}. Por favor, seleccione otro horario.`,
                });
                return;
            }
            
            /// se suman los datos a la lista
            lista.push(turno)
            /// se guarda en el localStorage
            localStorage.setItem("turnos",JSON.stringify(lista))

            Swal.fire({
                icon:"success",
                title:"El Turno fue agendado!",
                text: `${turno.nombre}, DNI: ${turno.dni}, Email: ${turno.email}, agendo turno con el
                ${turno.especialista}, Fecha: ${turno.fecha} , Hora: ${turno.hora}`,
                timer: 2500
            })
            console.table(lista)
            actualizarlista()
        }
    })
}

///esta funcion se encarga, de al ejecutar el contenido del dom, se cargen directamente las funciones de lista y api
document.addEventListener("DOMContentLoaded", function() {
    actualizarlista();  // Llama a la función para mostrar los turnos cuando la página se carga
    cargarapidoctores();
});




/// eventos botones

let agregar = document.getElementById("botonagregar")
agregar.addEventListener("click",agendarTurno)

let filtrar = document.getElementById("botonfiltrar")
filtrar.addEventListener("click",filtrarporEspecialista)

let eliminar = document.getElementById("botoneliminar")
eliminar.addEventListener("click",eliminarTurnoPorDNI)



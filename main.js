const Turno = function(nombre, dni, email, especialista){
    this.nombre = nombre,
    this.dni = dni,
    this.email = email,
    this.especialista = especialista
}

let turno1= new Turno("Damian",45283450,"damia@gmail.com","Dermatologo")
let turno2= new Turno("Pedro",42345654,"pedro@hotmail","Cardiologo")
let turno3 = new Turno("Maria",30423123,"maria@gmail.com","Cardiologo")

let lista = [turno1,turno2,turno3]

///se carga en el localstorage los turnos predefinidos
if(localStorage.getItem("turnos")){
    lista = JSON.parse(localStorage.getItem("turnos"))
}else{
    lista = lista
}


///esta funcion se encarga, mediante el dni ingresado, filtrar la lista para no incluir el objeto con el mismo numero
function eliminarTurnoPorDNI(){
    Swal.fire({
        title: 'Eliminar un Turno',
        text: `Ingresa el DNI del paciente, para eliminar su turno`,
        html: `<label>DNI:</label><input id="inputDNIEliminar" class="swal2-input" type="number" autofocus>`

    }).then((result)=>{
        if(result.isConfirmed){
            let dnieliminar = document.getElementById("inputDNIEliminar").value.trim();
            let resultado = lista.filter((turno)=> turno.dni == dnieliminar)
            if(resultado.length >0){
                Swal.fire({
                    title: `Estas seguro de deseas eliminar este turno?`,
                    icon: 'warning',
                    width: "30%",
                    html: `<table class="table table-bordered w-auto text-center"> <thead> <tr> <th>Nombre</th> <th>DNI</th> <th>Email</th> <th>Especialista</th> </tr> </thead>  `+
                    resultado.map( (turno)=> `<tbody> <tr><td>${turno.nombre}</td> <td>${turno.dni}</td> <td>${turno.email}</td> <td>${turno.especialista}</td> </tbody> `) ,
                    confirmButtonText: "Eliminar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                }).then((eliminar)=>{
                    if(eliminar.isConfirmed){
                        let turnoeliminado = lista.find((turno)=> turno.dni == dnieliminar)
                        lista = lista.filter((turno) => turno.dni != dnieliminar)
                        localStorage.setItem("turnos",JSON.stringify(lista))
                        Swal.fire({
                            title: `Turno eliminado`,
                            icon: 'success',
                            text: `El turno de ${turnoeliminado.nombre}, DNI ${turnoeliminado.dni} con el ${turnoeliminado.especialista}, fue eliminado`,
                            timer: 2500
                        })
                        console.table(lista)
                    }
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
                    title: `Estos son los turnos del ${especialistafiltro}`,
                    html: `<table class="table table-bordered w-100 text-center"> <thead> <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
            </tr> </thead>`+
                    resultado.map( (turno)=> `<tbody> <tr><td>${turno.nombre}</td> <td>${turno.dni}</td> <td>${turno.email}</td> </tbody>`) ,
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
    Swal.fire({
        title: 'Agendar Turno',
        icon: 'info',
        html: `<div class="container">
        <label>Nombre:</label><input id="inputNombre" class="swal2-input" type="text" autofocus>
        
        <label>DNI:</label><input id="inputDNI" class="swal2-input" type="number" autofocus>
        
        <label>Email:</label><input id="inputEmail" class="swal2-input" type="email" autofocus>
        
        <label for="especialista" style="margin-top: 10px;">Especialista:</label>
        <select id="inputEspecialista" class="swal2-select">
            <option value="Dermatologo">Dermatologo</option>
            <option value="Cardiologo">Cardiologo</option>
            <option value="Traumatologo">Traumatologo</option>
            <option value="Neurologo">Neurologo</option>
        </select>        
        </div>`,
        confirmButtonText: "Agendar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }).then((result)=>{
        if(result.isConfirmed){
            let nombre = document.getElementById("inputNombre").value.trim();
            let dni = document.getElementById("inputDNI").value.trim();
            let email = document.getElementById("inputEmail").value.trim();
            let especialista = document.getElementById("inputEspecialista").value.trim();
            
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


            let turno = new Turno(nombre,dni,email,especialista)

            if(lista.some((elemento)=> elemento.dni === turno.dni)){
                const turnoexiste = lista.find((elemento)=> elemento.dni === turno.dni)
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: `${turnoexiste.nombre}, DNI: ${turnoexiste.dni}, ya tiene un turno registrado con el ${turnoexiste.especialista}`
                }); return
            }
            lista.push(turno)

            localStorage.setItem("turnos",JSON.stringify(lista))

            Swal.fire({
                icon:"success",
                title:"El Turno fue agendado!",
                text: `${turno.nombre}, DNI: ${turno.dni}, Email: ${turno.email}, agendo turno con el
                ${turno.especialista},`,
                timer: 2500
            })
            console.table(lista)
        }
    })
}

///esta funcion se encarga de traer la lista y mostrarla por pantalla
function mostrarTurnos() {
    Swal.fire({
        icon: "info",
        width: "80%",
        title: "Lista de Turnos",
        html: `<table class="table table-bordered w-100 text-center">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Especialista</th>
            </tr>
        </thead>
        <tbody>
            ${lista
                .map(
                    (turno) =>
                        `<tr>
                            <td>${turno.nombre}</td>
                            <td>${turno.dni}</td>
                            <td>${turno.email}</td>
                            <td>${turno.especialista}</td>
                        </tr>`
                )}
        </tbody>
    </table>
`})
console.table(lista)
}


/// eventos botones

let agregar = document.getElementById("botonagregar")
agregar.addEventListener("click",agendarTurno)

let filtrar = document.getElementById("botonfiltrar")
filtrar.addEventListener("click",filtrarporEspecialista)

let eliminar = document.getElementById("botoneliminar")
eliminar.addEventListener("click",eliminarTurnoPorDNI)

let mostrar = document.getElementById("botonmostrar")
mostrar.addEventListener("click",mostrarTurnos)
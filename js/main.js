// Funcion constructora
class Cliente {
    constructor(nombre, modelo, kilometros, mail, precio) {
        this.nombre = nombre;
        this.modelo = modelo;
        this.kilometros = kilometros;
        this.mail = mail;
        this.precio = precio;
    }
    calcDescuento() {
        if (this.precio >= 48000) {
            this.subtotal = this.precio * 0.9;
        } else {
            this.subtotal = this.precio;
        }
    }
    calcFinal() {
        this.total = this.subtotal * 1.21
    }
}

// Funcion de elección de sucursal
window.onload = function() {
    document.getElementById("formUsuario").addEventListener("submit", adminSucursal);
}

function adminSucursal(e) {
    e.preventDefault();
    sucursal = document.getElementById("user").value;
    if (sucursal == "001" || sucursal == "002") {
        let clientesEnTaller = document.getElementById("clientesEnTaller");
        const clientes = JSON.parse(localStorage.getItem(sucursal));
        if (clientes == null) {
            clientesEnTaller.innerHTML = "<h2>Sucursal sin vehículos ingresados por sistema</h2>"
        } else {
            listaClientes(clientes);
        }
        detalleCliente();
    } else {
        Swal.fire({
            icon: 'Error',
            title: 'Sucursal inexistente',
            text: 'Ingrese el número correcto',
            background: '#a12525',
            width: 260,
            color: 'white',
        })
    }
}

// Listado de clientes
function listaClientes(clientes) {
    let clientesEnTaller = document.getElementById("clientesEnTaller");
    clientesEnTaller.innerHTML = "";

    clientes.forEach(cliente => {
        let li = document.createElement("li");
        li.innerHTML = `✔ Cliente: "${cliente.nombre}" // Vehículo: ${cliente.modelo} // Service de ${cliente.kilometros} Kms. // ${cliente.mail} // precio $${cliente.precio}`;
        // let li = document.createElement("tabla");
        // li.innerHTML = `
        // <table id="test">
        //     <tbody>
        //         <tr><td>Foo</td></tr>
        //     </tbody>
        //     <tfoot>
        //         <tr><td>footer information</td></tr>
        //     </tfoot>
        // </table>`;

        const botonFacturar = document.createElement("button");
        const botonEliminar = document.createElement("button");
        botonFacturar.innerText = "🛒 Facturar ";
        botonEliminar.innerText = "❌ Eliminar ";
        botonFacturar.addEventListener("click", () => { facturarCliente(cliente) });
        botonEliminar.addEventListener("click", () => { eliminarCliente(cliente) });
        li.appendChild(botonFacturar);
        li.appendChild(botonEliminar);
        clientesEnTaller.appendChild(li);
    });
}

// Detalle de clientes
function detalleCliente() {
    const opciones = document.getElementById("opciones");
    opciones.innerHTML =
        `<h4>Sistema de registro de clientes para la sucursal "${sucursal}"</h4>
    <form id="form">
      <input type="text" id="nombre" name="nombre" placeholder="Nombre del cliente" required>
      <input type="text" id="modelo" name="modelo"placeholder="Marca y modelo" required>
      <input type="number" id="kilometros" name="kilometros" weight="250px" min="1" max="100000" placeholder="Kilometros" required>
      <input type="text" id="mail" name="mail" placeholder="E-mail" required>
      <button type="submit" id="button" class="button btn-success" value="ingresar"> ✔ & Enviar mail </button>
    </form>`;
    const btn = document.getElementById('button');
    document.getElementById('form')
        .addEventListener('submit', function(e) {
            e.preventDefault();
            btn.value = 'Enviando mail...';
            const serviceID = 'default_service';
            const templateID = 'template_plud839';
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    btn.value = 'ingresar';
                    setTimeout(() => {
                        Swal.fire({
                            text: 'Mail enviado al cliente confirmando su ingreso',
                            width: 160,
                            color: 'grey',
                        }, 3000);
                    })
                }, (err) => {
                    btn.value = 'ingresar';
                    alert(JSON.stringify(err));
                });
        });

    document.getElementById("form").addEventListener("submit", ingresarCliente);
}


//Función para Servicio según el kilometraje  
function tipoService(e) {
    do {
        kilometraje = (e)
        switch (true) {
            case kilometraje >= 1 && kilometraje <= 15000:
                console.log("Corresponde un control general del vehículo x de $27500");
                sessionStorage.setItem('costo', 27500);
                break;
            case kilometraje <= 70000:
                console.log("Corresponde un control general y cambio de filtros de combustible, aceite y polen x $48600");
                sessionStorage.setItem('costo', 48600);
                break;
            default:
                console.log("Control total y cambio de correa de distribucion y Poli-V x $85100");
                sessionStorage.setItem('costo', 85100);
                break;
        }
    } while (false)
}


//Ingreso al taller
let capacidad = 0;

function ingresarCliente(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const modelo = document.getElementById("modelo").value;
    const kilometros = document.getElementById("kilometros").value;
    const mail = document.getElementById("mail").value;
    tipoService(kilometros);
    let costo = sessionStorage.getItem('costo').split(",");
    const precio = costo;
    console.log(precio);
    const cliente = new Cliente(nombre, modelo, kilometros, mail, precio);
    const clientesEnLocalStorage = JSON.parse(localStorage.getItem(sucursal));
    capacidad++;
    if (clientesEnLocalStorage == null) {
        localStorage.setItem(sucursal, JSON.stringify([cliente]));
        listaClientes([cliente]);
    } else {
        clientesEnLocalStorage.push(cliente);
        localStorage.setItem(sucursal, JSON.stringify(clientesEnLocalStorage));
        listaClientes(clientesEnLocalStorage);
    }
    console.log(`Esta sucursal de Transporter-007 tiene ${capacidad} vehículos en proceso`);
    e.target.reset();
    Swal.fire({
        position: 'center',
        width: 350,
        background: '#ffffffda',
        icon: 'success',
        color: '#229452',
        title: 'Vehiculo ingresado correctamente',
        showConfirmButton: false,
        timer: 1200
    })
}

// Eliminar cliente
function eliminarCliente(cliente) {
    Swal.fire({
        width: 250,
        title: 'Estas seguro?',
        text: "El cliente se eliminara definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const clientesEnLocalStorage = JSON.parse(localStorage.getItem(sucursal));
            const nuevoArray = clientesEnLocalStorage.filter(item => item.nombre != cliente.nombre);
            localStorage.setItem(sucursal, JSON.stringify(nuevoArray));
            listaClientes(nuevoArray);
            capacidad -= 1;
            Swal.fire({
                text: 'Cliente correctaente eliminado',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
}

// Facturación
function facturarCliente(cliente) {
    Swal.fire({
        width: 550,
        title: 'Facturación',
        html: `
            <form>
            Cliente: ${cliente.nombre}<br>
            Subtotal: $${cliente.precio}.-<br>
            </form>
                <div>   
                    <label for="civil">Tipo de pago: </label>
                        <input id="efvo"type="checkbox" value="efvo">Efectivo -
                        <input id="tarjeta" type="checkbox" value="tarjeta">Tarjeta -
                        <input id="otros" type="checkbox" value="otros">Otro
            </div>
            <input type="text" class="form-control" placeholder="cuotas">
            <input type="text" class="form-control" placeholder="Observaciones">
            `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Facturar',
        cancelButtonText: 'Cancelar',

    }).then((result) => {
        if (result.isConfirmed) {
            const clientesEnLocalStorage = JSON.parse(localStorage.getItem(sucursal));
            const nuevoArray = clientesEnLocalStorage.filter(item => item.nombre != cliente.nombre);
            localStorage.setItem(sucursal, JSON.stringify(nuevoArray));
            listaClientes(nuevoArray);
            capacidad -= 1;
            Swal.fire({
                text: 'Cliente facturado correctamente.',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })

}
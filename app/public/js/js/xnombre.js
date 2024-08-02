const baseURL = 'http://localhost:3009';

const obtenerTokenre = () => {
    // Hacer una solicitud HTTP al servidor para obtener el token
    const token = localStorage.getItem("token");
    if (!token) {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        window.location.href = `${baseURL}/login`;
        return; // Detener la ejecución del código
    }
    return token;
};


let datosUsuario = null;


// Función para obtener el token del servidor
const obtenerToken = async () => {
    try {
        // Hacer una solicitud HTTP al servidor para obtener el token
        const token = obtenerTokenre();
        const respuesta = await fetch(`${baseURL}/usuario_aut`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include' // Incluir cookies en la solicitud
        });

        // Verificar si la respuesta fue exitosa (código de estado 200)
        if (respuesta.ok) {
            datosUsuario = await respuesta.json();
            //console.log(datosUsuario)
            // Mostrar los datos en un formulario
            mostrarDatosEnFormulario(datosUsuario);
        } else {
            console.error('Error al obtener el token:', respuesta.statusText);
        }
    } catch (error) {
        console.error('Error al obtener el token:', error.message);
    }
};

// Función para mostrar los datos en un formulario HTML
const mostrarDatosEnFormulario = (datosUsuario) => {

    const userNavTop = document.getElementById('usernavtop');
    const userNav = document.getElementById('usernav');
    const perfi = document.getElementById('perfi');

    // Obtener los datos del usuario
    let { nombres, apellidos, perfil } = datosUsuario;

    // Convertir la primera letra de cada palabra a mayúscula y el resto a minúscula
    nombres = nombres.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    apellidos = apellidos.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    perfill = perfil.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());


    // Obtener el primer nombre y el primer apellido
    const primerNombre = nombres.split(' ')[0];
    const primerApellido = apellidos.split(' ')[0];


    // Establecer el valor del span con el nombre del usuario
    userNavTop.textContent = `${primerNombre} ${primerApellido}`;

    // Establecer el valor del h6 con el nombre del usuario
    userNav.textContent = `${primerNombre} ${primerApellido}`;

    perfi.textContent = `${perfill}`;
};
// Llamar a la función para obtener el token
obtenerToken();


//*********************************poner en mayuscula**********************************/
function mayus(e) {
    e.value = e.value.toUpperCase();
  }
  //*********************************poner en mayuscula**********************************/
  

document.getElementById("formbuscar").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombres = document.getElementById("nombres").value;
    const apellidopa = document.getElementById("apellidopa").value;
    const apellidoma = document.getElementById("apellidoma").value;

    // Validar campos
    if (!nombres && !apellidopa && !apellidoma) {
        showWarningToast('Por favor, complete uno de los campos requeridos');
        return;
    }

    try {
        // Mostrar el spinner y ajustar la opacidad
        spinner.classList.add("show");
        spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

        // Hacer una solicitud HTTP al servidor para obtener el token
        const token = obtenerTokenre();

        // Enviar los datos al servidor para realizar la búsqueda
        const response = await fetch(`${baseURL}/xnombre`, {
            method: "POST", // Usa POST si estás enviando datos
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nombres,
                apellidopa,
                apellidoma
            })
        });

        // Ocultar el spinner después de recibir la respuesta
        spinner.classList.remove("show");

        if (response.ok) {
            const data = await response.json();
            // Manejar la respuesta exitosa (por ejemplo, actualizar la tabla)
            // Mostrar los datos en un formulario
            mostrarDatosEnFormulari(data);
        } else {
            const errorData = await response.json();
            console.error("Error al enviar la solicitud:", error);
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            Toast.fire({
                icon: "error",
                title: `No se encuentra en registro`,
            });
            limpiarTabla();

        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        Toast.fire({
            icon: "error",
            title: `No se encuentra el registro`,
        });
    }

    /* if (datosUsuario) {
        const userDistrito = datosUsuario.distrito;
        if (userDistrito !== 700) {
            try {
                // Mostrar el spinner y ajustar la opacidad
                spinner.classList.add("show");
                spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

                // Hacer una solicitud HTTP al servidor para obtener el token
                const token = obtenerTokenre();

                // Enviar los datos al servidor para realizar la búsqueda
                const response = await fetch(`${baseURL}/servicioitem`, {
                    method: "POST", // Usa POST si estás enviando datos
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        servicio,
                        item,
                        gestion
                    })
                });

                // Ocultar el spinner después de recibir la respuesta
                spinner.classList.remove("show");

                if (response.ok) {
                    const data = await response.json();
                    // Manejar la respuesta exitosa (por ejemplo, actualizar la tabla)
                    // Mostrar los datos en un formulario
                    mostrarDatosEnFormulari(data);
                } else {
                    const errorData = await response.json();
                    console.error("Error al enviar la solicitud:", error);
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "bottom-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });

                    Toast.fire({
                        icon: "error",
                        title: `No se encuentra registro con el servicio: ${servicio} e item: ${item} en la gestion ${gestion}`,
                    });
                    limpiarTabla();

                }
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
                const Toast = Swal.mixin({
                    toast: true,
                    position: "bottom-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                Toast.fire({
                    icon: "error",
                    title: `No se encuentra registro con el servicio: ${servicio} e item: ${item} en la gestion ${gestion}`,
                });
            }
        } else {
            distrito = userDistrito;
            try {
                // Mostrar el spinner y ajustar la opacidad
                spinner.classList.add("show");
                spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

                // Hacer una solicitud HTTP al servidor para obtener el token
                const token = obtenerTokenre();

                // Enviar los datos al servidor para realizar la búsqueda
                const response = await fetch(`${baseURL}/servicioitem`, {
                    method: "POST", // Usa POST si estás enviando datos
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        servicio,
                        item,
                        gestion,
                        distrito
                    })
                });

                // Ocultar el spinner después de recibir la respuesta
                spinner.classList.remove("show");

                if (response.ok) {
                    const data = await response.json();
                    // Manejar la respuesta exitosa (por ejemplo, actualizar la tabla)
                    // Mostrar los datos en un formulario
                    mostrarDatosEnFormulari(data);
                } else {
                    const errorData = await response.json();
                    console.error("Error al enviar la solicitud:", error);
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "bottom-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });

                    Toast.fire({
                        icon: "error",
                        title: `No se encuentra registro con el servicio: ${servicio} e item: ${item} en la gestion ${gestion}`,
                    });
                    limpiarTabla();

                }
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
                const Toast = Swal.mixin({
                    toast: true,
                    position: "bottom-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                Toast.fire({
                    icon: "error",
                    title: `No se encuentra registro con el servicio: ${servicio} e item: ${item} en la gestion ${gestion}`,
                });
            }
        };
    } */
});


const mostrarDatosEnFormulari = (data) => {
    limpiarTabla(); // Llamar a limpiarTabla antes de agregar nuevos datos

    // Obtener referencia al cuerpo de la tabla
    const tbody = document.getElementById('medida');
    tbody.innerHTML = ''; // Limpiar el contenido anterior de la tabla

    // Iterar sobre los datos recibidos y crear filas dinámicamente
    data.data.forEach((row) => {
        const tr = document.createElement('tr');
        tr.id = 'cursor';
        tr.innerHTML = `
            <td>${row.carnet}</td>
            <td>${row.MAESTRO_A}</td>
          `;
        // Agregar el evento de doble clic a la fila
        tr.addEventListener('dblclick', async () => {
            try {
                // Mostrar el spinner y ajustar la opacidad
                spinner.classList.add("show");
                spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí
                
                // Hacer una solicitud HTTP al servidor para obtener el token
                const token = obtenerTokenre();

                // Enviar los datos al servidor para realizar la búsqueda
                const response = await fetch(`${baseURL}/mostrarporcarnet`, {
                    method: "POST", // Usa POST si estás enviando datos
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        carnet: row.carnet
                    })
                });

                // Ocultar el spinner después de recibir la respuesta
                spinner.classList.remove("show");

                if (response.ok) {
                    const data = await response.json();
                    // Redirigir a la nueva página con los datos de la fila y los resultados
                    const url = `/mostrarcarnet?data=${encodeURIComponent(JSON.stringify(data))}`;
                    window.open(url, '_blank');
                } else {
                    console.error("Error al enviar la solicitud:", response.statusText);
                    showWarningToast('No se encontraron datos');
                }
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
                showWarningToast('No se encontraron datos');
            }
        });

        tbody.appendChild(tr);
    });

    // Reinicializar DataTables
    $('#myTable').DataTable({
        language: {
            decimal: "",
            emptyTable: "No hay información",
            info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            infoEmpty: "Mostrando 0 to 0 of 0 Entradas",
            infoFiltered: "(Filtrado de _MAX_ total entradas)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ Entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "Sin resultados encontrados",
            paginate: {
                first: "Primero",
                last: "Ultimo",
                next: ">",
                previous: "<"
            }
        },
        lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, "Todos"]
        ],
        pageLength: 25,
        responsive: true,
        autoWidth: true,
        order: [],
        searching: true // Habilitar el buscador global
    });
};

// Función para mostrar un toast de advertencia
const showWarningToast = (message) => {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    Toast.fire({
        icon: "warning",
        title: message,
    });
};


const limpiarTabla = () => {
    const tbody = document.getElementById('medida');
    tbody.innerHTML = ''; // Limpiar el contenido del cuerpo de la tabla

    if ($.fn.DataTable.isDataTable('#myTable')) {
        $('#myTable').DataTable().clear().destroy(); // Limpiar y destruir DataTables
    }
};
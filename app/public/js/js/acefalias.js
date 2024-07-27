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



const getAlldistrito = async () => {
    try {
        // Hacer una solicitud HTTP al servidor para obtener el token
        const token = obtenerTokenre();
        const response = await fetch(`${baseURL}/distrito`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const result = await response.json();
        //console.log(result.data)
        if (result.error) {
            console.error("Error:", result.message);
            return [];
        } else {
            return result.data;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }
};

const populateSelect = (selectElement, options, valueFieldName, textFieldName) => {
    selectElement.innerHTML = '<option value="">Seleccione una opción</option>';
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option[valueFieldName];
        optionElement.textContent = option[textFieldName];
        selectElement.appendChild(optionElement);
    });
};

const initializeSelect2 = () => {
    $('#distrito').select2({ width: 'resolve' });
    $('#gestion').select2({ width: 'resolve' });
    $('#mes').select2({ width: 'resolve' });
};

const adjustSelect2Width = () => {
    $('#distrito').select2('destroy').select2({ width: '100%' });
    $('#gestion').select2('destroy').select2({ width: '100%' });
    $('#mes').select2('destroy').select2({ width: '100%' });
};

const populateGestionSelect = () => {
    const gestionSelect = document.getElementById("gestion");
    const currentYear = new Date().getFullYear();
    const startYear = 1998;

    gestionSelect.innerHTML = ''; // Limpiar el select antes de llenarlo

    for (let year = startYear; year <= currentYear; year++) {
        const optionElement = document.createElement("option");
        optionElement.value = year;
        optionElement.textContent = year;
        gestionSelect.appendChild(optionElement);
    }

    // Inicializa Select2 después de haber poblado las opciones
    $('#gestion').select2({ width: 'resolve' });

    // Ajustar Select2 al cambiar el tamaño de la ventana
    window.addEventListener('resize', adjustSelect2Width);
};

const populateMesSelect = () => {
    const mesSelect = document.getElementById("mes");
    const meses = [
        { value: 1, text: 'Enero' },
        { value: 2, text: 'Febrero' },
        { value: 3, text: 'Marzo' },
        { value: 4, text: 'Abril' },
        { value: 5, text: 'Mayo' },
        { value: 6, text: 'Junio' },
        { value: 7, text: 'Julio' },
        { value: 8, text: 'Agosto' },
        { value: 9, text: 'Septiembre' },
        { value: 10, text: 'Octubre' },
        { value: 11, text: 'Noviembre' },
        { value: 12, text: 'Diciembre' }
    ];

    mesSelect.innerHTML = ''; // Limpiar el select antes de llenarlo

    meses.forEach(mes => {
        const optionElement = document.createElement("option");
        optionElement.value = mes.value;
        optionElement.textContent = mes.text;
        mesSelect.appendChild(optionElement);
    });

    // Inicializa Select2 después de haber poblado las opciones
    $('#mes').select2({ width: 'resolve' });

    // Ajustar Select2 al cambiar el tamaño de la ventana
    window.addEventListener('resize', adjustSelect2Width);
};

const populateFormSelects = async () => {
    const distritoSelect = document.getElementById("distrito");

    try {
        const distrito = await getAlldistrito();

        populateSelect(distritoSelect, distrito, "cod_dis", "distrito_descripcion");

        // Seleccionar automáticamente el distrito si datosUsuario está disponible y cod_dis no es 700
        if (datosUsuario) {
            const userDistrito = datosUsuario.distrito;
            if (userDistrito !== 700) {
                distritoSelect.value = userDistrito;
                distritoSelect.disabled = true; // Bloquear el select si distrito no es 700
            }
        }

        // Inicializa Select2 después de haber poblado las opciones
        $('#distrito').select2({ width: 'resolve' });

        // Ajustar Select2 al cambiar el tamaño de la ventana
        window.addEventListener('resize', adjustSelect2Width);
    } catch (error) {
        console.error("Error al poblar los select:", error);
    }

    // Poblar los selects de gestión y mes
    populateGestionSelect();
    populateMesSelect();
};

// Llama a esta función para poblar los select cuando la página se carga
document.addEventListener('DOMContentLoaded', populateFormSelects);



document.getElementById("formbuscar").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const distrito = document.getElementById("distrito").value;
    const gestion = document.getElementById("gestion").value;
    const mes = document.getElementById("mes").value;

    // Validar campos
    if (!distrito || !gestion || !mes) {
        showWarningToast('Por favor, complete todos los campos requeridos');
        return;
    }


    try {
        // Mostrar el spinner y ajustar la opacidad
        spinner.classList.add("show");
        spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

        // Hacer una solicitud HTTP al servidor para obtener el token
        const token = obtenerTokenre();

        // Enviar los datos al servidor para realizar la búsqueda
        const response = await fetch(`${baseURL}/acefalias`, {
            method: "POST", // Usa POST si estás enviando datos
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                distrito,
                gestion,
                mes

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
                title: `No se encontraron acefalias`,
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
            title: `No se encontraron acefalias`,
        });
    }
});



const mostrarDatosEnFormulari = (data) => {
    limpiarTabla(); // Llamar a limpiarTabla antes de agregar nuevos datos

    // Obtener referencia al cuerpo de la tabla
    const tbody = document.getElementById('medida');

    // Iterar sobre los datos recibidos y crear filas dinámicamente
    data.data.forEach((row) => {
        const tr = document.createElement('tr');
        tr.id = 'cursor';
        tr.innerHTML = `
        <td>${row.MES}</td>
        <td>${row.DISTRITO_EDUCATIVO}</td>
        <td>${row.UNIDAD_EDUCATIVA}</td>
        <td>${row.ESTADO_PLANILLA}</td>
        <td>${row.CARGO}</td>
        <td>${row.SERVICIO_ITEM}</td>
        <td>${row.HORAS}</td>
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
                const response = await fetch(`${baseURL}/mostraracefalias`, {
                    method: "POST", // Usa POST si estás enviando datos
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        item: row.ITEM,
                        servicio: row.SERVICIO,
                        gestion: row.GESTION
                    })
                });

                // Ocultar el spinner después de recibir la respuesta
                spinner.classList.remove("show");

                if (response.ok) {
                    const data = await response.json();
                    // Redirigir a la nueva página con los datos de la fila y los resultados
                    const url = `/mostraracefalias?data=${encodeURIComponent(JSON.stringify(data))}`;
                    window.open(url, '_blank');
                } else {
                    console.error("Error al enviar la solicitud:", response.statusText);
                    showWarningToast('No se encontraron acefalias');
                }
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
                showWarningToast('No se encontraron acefalias');
            }
        });

        tbody.appendChild(tr);
    });

    // Inicializar DataTables
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
        pageLength: 5,
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


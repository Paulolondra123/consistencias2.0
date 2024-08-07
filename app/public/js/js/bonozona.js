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
let coddis = null;

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
  $('#subsistema').select2({ width: 'resolve' });
};

const adjustSelect2Width = () => {
  $('#distrito').select2('destroy').select2({ width: '100%' });
  $('#gestion').select2('destroy').select2({ width: '100%' });
  $('#mes').select2('destroy').select2({ width: '100%' });
  $('#subsistema').select2('destroy').select2({ width: '100%' });
};

const populateSubsistemaSelect = () => {
  const subsistemaSelect = document.getElementById("subsistema");
  const subsistema = [
    { value: '1,2,3', text: 'REGULAR' },
    { value: '4,8', text: 'SUPERIOR' },
    { value: '5', text: 'ALTERNATIVA' },
    { value: '6', text: 'ESPECIAL' },
    { value: '7', text: 'PERMANENTE' }
  ];

  subsistemaSelect.innerHTML = ''; // Limpiar el select antes de llenarlo

  subsistema.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    subsistemaSelect.appendChild(optionElement);
  });

  // Inicializa Select2 después de haber poblado las opciones
  $('#subsistema').select2({ width: 'resolve' });

  // Ajustar Select2 al cambiar el tamaño de la ventana
  window.addEventListener('resize', adjustSelect2Width);
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
  populateSubsistemaSelect();
};

// Llama a esta función para poblar los select cuando la página se carga
document.addEventListener('DOMContentLoaded', populateFormSelects);


let datosTabla = [];


document.getElementById("formbuscar").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  coddis = null;
  // Obtener los valores del formulario
  const distrito = document.getElementById("distrito").value;
  const gestion = document.getElementById("gestion").value;
  const mes = document.getElementById("mes").value;
  const subsistema = document.getElementById("subsistema").value;

  // Validar campos
  if (!distrito || !gestion || !mes || !subsistema) {
    showWarningToast('Por favor, complete todos los campos requeridos');
    return;
  }

  // Realizar la búsqueda
  await realizarBusqueda({ distrito, gestion, mes,subsistema });
});

document.getElementById("buscarmaestros").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  // Obtener los valores del formulario
  const distrito = document.getElementById("distrito").value;
  const gestion = document.getElementById("gestion").value;
  const mes = document.getElementById("mes").value;
  const subsistema = document.getElementById("subsistema").value;
  coddis = document.getElementById("coddis").value;

  // Validar campos
  if (!distrito || !gestion || !mes || !coddis || !subsistema) {
    showWarningToast('Por favor, complete todos los campos requeridos');
    return;
  }

  // Realizar la búsqueda
  await realizarBusqueda({ distrito, gestion, mes, coddis, subsistema });
});

let busquedaExitosa = false;

const realizarBusqueda = async (params) => {
  try {
    // Mostrar el spinner y ajustar la opacidad
    spinner.classList.add("show");
    spinner.style.opacity = "0.5"; // Ajusta la opacidad aquí

    // Hacer una solicitud HTTP al servidor para obtener el token
    const token = obtenerTokenre();

    // Enviar los datos al servidor para realizar la búsqueda
    const response = await fetch(`${baseURL}/bonozona`, {
      method: "POST", // Usa POST si estás enviando datos
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params)
    });

    // Ocultar el spinner después de recibir la respuesta
    spinner.classList.remove("show");

    if (response.ok) {
      const data = await response.json();
      datosTabla = data.data; // Almacena los datos de la tabla
      mostrarDatosdelaUE(data, params.coddis);
      // Mostrar el botón de imprimir
      document.getElementById("imprimir").style.display = "block";
      document.getElementById("imprimirxls").style.display = "block";
      busquedaExitosa = true;
      verificarEstadoBoton();
    } else {
      const errorData = await response.json();
      console.error("Error al enviar la solicitud:", errorData);
      showErrorToast('U.E. no encontrada');

      limpiarTabla();

      // Ocultar el botón de imprimir en caso de error
      document.getElementById("imprimir").style.display = "none";
      document.getElementById("imprimirxls").style.display = "none";
      busquedaExitosa = false; // Actualizar el estado de búsqueda fallida
      verificarEstadoBoton();
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    showErrorToast('Error al hacer la consulta');
    // Ocultar el botón de imprimir en caso de error
    document.getElementById("imprimir").style.display = "none";
    document.getElementById("imprimirxls").style.display = "none";
    busquedaExitosa = false; // Actualizar el estado de búsqueda fallida
    verificarEstadoBoton();
  }
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

// Función para mostrar un toast de error
const showErrorToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "error",
    title: message,
  });
};



// Función para mostrar los datos en la tabla HTML
const mostrarDatosdelaUE = (data, coddis) => {

  // Destruir DataTable existente si ya está inicializada
  if ($.fn.DataTable.isDataTable('#myTable')) {
    $('#myTable').DataTable().destroy();
  }
  // Obtener referencia a la tabla
  const table = document.getElementById('myTable');
  table.innerHTML = ''; // Limpiar el contenido anterior de la tabla

  // Crear el encabezado de la tabla
  const thead = document.createElement('thead');
  thead.innerHTML = `
      <tr class="text-white" style="background: #002060;"       >
        ${coddis ? `
          <th>RDA</th>
          <th>MAESTRO_A</th>
          <th>CARGO</th>
          <th>SERVICIO_ITEM</th>
        ` : `
          <th>DISTRITO</th>
          <th>UNIDAD EDUCATIVA</th>
          <th>ACCIONES</th>
        `}
      </tr>
    `;
  table.appendChild(thead);

  // Obtener referencia al cuerpo de la tabla
  const tbody = document.createElement('tbody');
  tbody.id = 'medida';
  table.appendChild(tbody);

  // Iterar sobre los datos recibidos y crear filas dinámicamente
  data.data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = coddis ? `
        <td>${row.RDA}</td>
        <td>${row.MAESTRO_A}</td>
        <td>${row.CARGO}</td>
        <td>${row.SERVICIO_ITEM}</td>
      ` : `
        <td>${row.DISTRITO}</td>
        <td>${row.UNIDAD_EDUCATIVA}</td>
        <td class="d-flex col-md-12 gap-1">
          <button type="submit" onclick="descargarmaesbonopdf(${row.CODIGO_SIE},'${row.UNIDAD_EDUCATIVA}')" class="btn btn-outline-primary col-md-6"
          ><i class="fas fa-file-pdf"></i></button>
          <button type="submit" onclick="descargarmaesbonoxls(${row.CODIGO_SIE},'${row.UNIDAD_EDUCATIVA}')" class="btn btn-outline-success col-md-6"
          ><i class="fas fa-file-excel"></i></button>
        </td>
      `;
    tbody.appendChild(tr);
  });
  // Inicializar DataTables
  $(document).ready(function () {
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
      searching: true // Deshabilitar el buscador global
    });
  });
};


document.getElementById('imprimir').addEventListener('click', async function (event) {
  event.preventDefault();

  const sub = document.getElementById('subsistema');

  // Obtener el índice del elemento seleccionado
  const selectedIndex = sub.selectedIndex;

  // Obtener el texto del elemento seleccionado
  const subsistema = sub.options[selectedIndex].text;

  // Hacer una solicitud HTTP al servidor para obtener el token
  const token = obtenerTokenre();

  // Obtener todos los datos de la tabla (sin importar la paginación)
  const table = $('#myTable').DataTable();
  const datosTabla = table.data().toArray();

  if (!coddis) {
    try {
      const response = await fetch(`${baseURL}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ datosTabla, subsistema }) // Enviar datos de la tabla
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reporte.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al generar el PDF');
    }
  } else {
    try {
      const response = await fetch(`${baseURL}/pdfmaestros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ datosTabla }) // Enviar datos de la tabla
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reporte.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al generar el PDF');
    }
  }

});



document.getElementById('imprimirxls').addEventListener('click', async function (event) {
  event.preventDefault();

  // Hacer una solicitud HTTP al servidor para obtener el token
  const token = obtenerTokenre();

  // Obtener todos los datos de la tabla (sin importar la paginación)
  const table = $('#myTable').DataTable();
  const datosTabla = table.rows({ search: 'applied' }).data().toArray();

  if (!coddis) {
    try {
      const response = await fetch(`${baseURL}/xls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ datosTabla }) // Enviar datos de la tabla
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reporte.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al generar el Excel');
    }
  } else {
    try {
      const response = await fetch(`${baseURL}/xlsmaestros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ datosTabla }) // Enviar datos de la tabla
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reporte.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al generar el Excel');
    }
  }

});


const limpiarTabla = () => {
  const table = document.getElementById('myTable');
  table.innerHTML = '';
  if ($.fn.DataTable.isDataTable('#myTable')) {
    $('#myTable').DataTable().clear().destroy();
  }
};


async function descargarmaesbonopdf(codigosie,sieue) {
  event.preventDefault();
  
  // Obtener los valores del formulario
  const gestion = document.getElementById("gestion").value;
  const mes = document.getElementById("mes").value;
  coddis = codigosie;

  // Hacer una solicitud HTTP al servidor para obtener el token
  const token = obtenerTokenre();

  try {
    const response = await fetch(`${baseURL}/desmaesbonopdf`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gestion,
        mes,
        coddis,
        sieue
      })
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    coddis = null;

    // Convertir la respuesta en un Blob
    const blob = await response.blob();

    // Crear un enlace temporal y disparar la descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Recibo.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error:', error.message);
    alert('Error al generar el PDF');
  }
}


async function descargarmaesbonoxls(codigosie,sieu) {
  event.preventDefault();
  console.log(sieu)

  // Obtener los valores del formulario
  const gestion = document.getElementById("gestion").value;
  const mes = document.getElementById("mes").value;
  coddis = codigosie;
  // Hacer una solicitud HTTP al servidor para obtener el token
  const token = obtenerTokenre();

  try {
    const response = await fetch(`${baseURL}/desmaesbonoxls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gestion,
        mes,
        coddis,
        sieu
      })
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    coddis = null;

    // Convertir la respuesta en un Blob
    const blob = await response.blob();

    // Crear un enlace temporal y disparar la descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'reportes.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error:', error.message);
    alert('Error al generar el Excel');
  }
}





// Función para verificar el estado del botón
const verificarEstadoBoton = () => {
  const buscarButton = document.getElementById("btn-buscar");
  const inputField = document.getElementById("coddis");
  
  if (inputField.value.trim() !== "" && busquedaExitosa) {
    buscarButton.disabled = false;
  } else {
    buscarButton.disabled = true;
  }
};

document.getElementById("coddis").addEventListener("input", function() {
  verificarEstadoBoton(); // Verificar el estado del botón cuando el usuario escribe en el campo
});
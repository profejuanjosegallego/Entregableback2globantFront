// ==================== NAVEGACION SIDEBAR ====================

const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
const secciones = {
    usuarios: document.getElementById("seccionUsuarios"),
    espacios: document.getElementById("seccionEspacios"),
    reservas: document.getElementById("seccionReservas")
};
const titulos = {
    usuarios: "Usuarios",
    espacios: "Espacios",
    reservas: "Reservas"
};

navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const seccion = link.dataset.section;
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        Object.values(secciones).forEach((s) => s.classList.remove("active"));
        secciones[seccion].classList.add("active");
        document.getElementById("tituloSeccion").textContent = titulos[seccion];
        document.getElementById("sidebar").classList.remove("show");
    });
});

// ==================== USUARIOS ====================

const formUsuario = document.getElementById("formUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");
let editandoUsuarioId = null;

formUsuario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        nombres: document.getElementById("nombres").value,
        correo: document.getElementById("correo").value,
        contraseña: document.getElementById("contraseña").value,
        rol: document.getElementById("rol").value
    };
    try {
        if (editandoUsuarioId) {
            await modificarUsuario(editandoUsuarioId, datos);
            mostrarAlerta("Usuario modificado correctamente", "success");
            cancelarEdicionUsuario();
        } else {
            await guardarUsuario(datos);
            mostrarAlerta("Usuario registrado correctamente", "success");
        }
        formUsuario.reset();
        await cargarUsuarios();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
});

async function cargarUsuarios() {
    try {
        const usuarios = await listarUsuarios();
        document.getElementById("contUsuarios").textContent = usuarios.length;
        document.getElementById("badgeUsuarios").textContent = usuarios.length + " registros";
        if (usuarios.length === 0) {
            tablaUsuarios.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="bi bi-inbox"></i><p>No hay usuarios registrados</p></div></td></tr>`;
            return;
        }
        tablaUsuarios.innerHTML = "";
        usuarios.forEach((u) => {
            const badgeClass = u.rol === "admin" ? "bg-danger bg-opacity-10 text-danger" : "bg-primary bg-opacity-10 text-primary";
            tablaUsuarios.innerHTML += `
                <tr>
                    <td><code>${u.id.substring(0,8)}...</code></td>
                    <td><strong>${u.nombres}</strong></td>
                    <td>${u.correo}</td>
                    <td><span class="badge badge-rol ${badgeClass}">${u.rol}</span></td>
                    <td>
                        <button class="btn-action btn-action-edit me-1" onclick="editarUsuario('${u.id}','${u.nombres}','${u.correo}','${u.contraseña}','${u.rol}')" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn-action btn-action-delete" onclick="borrarUsuario('${u.id}')" title="Eliminar">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

function editarUsuario(id, nombres, correo, contraseña, rol) {
    editandoUsuarioId = id;
    document.getElementById("nombres").value = nombres;
    document.getElementById("correo").value = correo;
    document.getElementById("contraseña").value = contraseña;
    document.getElementById("rol").value = rol;
    document.getElementById("btnUsuarioSubmit").innerHTML = '<i class="bi bi-check-lg me-1"></i> Modificar';
    btnCancelarUsuario.classList.remove("d-none");
}

function cancelarEdicionUsuario() {
    editandoUsuarioId = null;
    formUsuario.reset();
    document.getElementById("btnUsuarioSubmit").innerHTML = '<i class="bi bi-plus-lg me-1"></i> Registrar';
    btnCancelarUsuario.classList.add("d-none");
}

btnCancelarUsuario.addEventListener("click", cancelarEdicionUsuario);

async function borrarUsuario(id) {
    if (!confirm("Seguro que deseas eliminar este usuario?")) return;
    try {
        await eliminarUsuario(id);
        mostrarAlerta("Usuario eliminado correctamente", "success");
        await cargarUsuarios();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// ==================== ESPACIOS ====================

const formEspacio = document.getElementById("formEspacio");
const tablaEspacios = document.getElementById("tablaEspacios");
const btnCancelarEspacio = document.getElementById("btnCancelarEspacio");
let editandoEspacioId = null;

formEspacio.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById("nombreEspacio").value,
        descripcion: document.getElementById("descripcion").value,
        foto: document.getElementById("foto").value,
        aforo: parseInt(document.getElementById("aforo").value)
    };
    try {
        if (editandoEspacioId) {
            await modificarEspacio(editandoEspacioId, datos);
            mostrarAlerta("Espacio modificado correctamente", "success");
            cancelarEdicionEspacio();
        } else {
            await guardarEspacio(datos);
            mostrarAlerta("Espacio registrado correctamente", "success");
        }
        formEspacio.reset();
        await cargarEspacios();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
});

async function cargarEspacios() {
    try {
        const espacios = await listarEspacios();
        document.getElementById("contEspacios").textContent = espacios.length;
        document.getElementById("badgeEspacios").textContent = espacios.length + " registros";
        if (espacios.length === 0) {
            tablaEspacios.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="bi bi-inbox"></i><p>No hay espacios registrados</p></div></td></tr>`;
            return;
        }
        tablaEspacios.innerHTML = "";
        espacios.forEach((e) => {
            const fotoHtml = e.foto
                ? `<img src="${e.foto}" alt="foto" style="width:50px;height:36px;object-fit:cover;border-radius:6px;">`
                : `<span class="text-muted">Sin foto</span>`;
            tablaEspacios.innerHTML += `
                <tr>
                    <td><code>${e.id.substring(0,8)}...</code></td>
                    <td><strong>${e.nombre}</strong></td>
                    <td>${e.descripcion}</td>
                    <td>${fotoHtml}</td>
                    <td><span class="badge bg-success bg-opacity-10 text-success">${e.aforo} pers.</span></td>
                    <td>
                        <button class="btn-action btn-action-edit me-1" onclick="editarEspacio('${e.id}','${e.nombre}','${e.descripcion}','${e.foto}','${e.aforo}')" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn-action btn-action-delete" onclick="borrarEspacio('${e.id}')" title="Eliminar">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

function editarEspacio(id, nombre, descripcion, foto, aforo) {
    editandoEspacioId = id;
    document.getElementById("nombreEspacio").value = nombre;
    document.getElementById("descripcion").value = descripcion;
    document.getElementById("foto").value = foto;
    document.getElementById("aforo").value = aforo;
    document.getElementById("btnEspacioSubmit").innerHTML = '<i class="bi bi-check-lg me-1"></i> Modificar';
    btnCancelarEspacio.classList.remove("d-none");
}

function cancelarEdicionEspacio() {
    editandoEspacioId = null;
    formEspacio.reset();
    document.getElementById("btnEspacioSubmit").innerHTML = '<i class="bi bi-plus-lg me-1"></i> Registrar';
    btnCancelarEspacio.classList.add("d-none");
}

btnCancelarEspacio.addEventListener("click", cancelarEdicionEspacio);

async function borrarEspacio(id) {
    if (!confirm("Seguro que deseas eliminar este espacio?")) return;
    try {
        await eliminarEspacio(id);
        mostrarAlerta("Espacio eliminado correctamente", "success");
        await cargarEspacios();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// ==================== RESERVAS ====================

const formReserva = document.getElementById("formReserva");
const tablaReservas = document.getElementById("tablaReservas");
const btnCancelarReserva = document.getElementById("btnCancelarReserva");
let editandoReservaId = null;

formReserva.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        fecha: document.getElementById("fecha").value,
        tiempo: document.getElementById("tiempo").value
    };
    try {
        if (editandoReservaId) {
            await modificarReserva(editandoReservaId, datos);
            mostrarAlerta("Reserva modificada correctamente", "success");
            cancelarEdicionReserva();
        } else {
            await guardarReserva(datos);
            mostrarAlerta("Reserva creada correctamente", "success");
        }
        formReserva.reset();
        await cargarReservas();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
});

async function cargarReservas() {
    try {
        const reservas = await listarReservas();
        document.getElementById("contReservas").textContent = reservas.length;
        document.getElementById("badgeReservas").textContent = reservas.length + " registros";
        if (reservas.length === 0) {
            tablaReservas.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="bi bi-inbox"></i><p>No hay reservas creadas</p></div></td></tr>`;
            return;
        }
        tablaReservas.innerHTML = "";
        reservas.forEach((r) => {
            tablaReservas.innerHTML += `
                <tr>
                    <td><code>${r.id.substring(0,8)}...</code></td>
                    <td><i class="bi bi-calendar3 me-1 text-muted"></i>${r.fecha}</td>
                    <td><i class="bi bi-clock me-1 text-muted"></i>${r.tiempo}</td>
                    <td>
                        <button class="btn-action btn-action-edit me-1" onclick="editarReserva('${r.id}','${r.fecha}','${r.tiempo}')" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn-action btn-action-delete" onclick="borrarReserva('${r.id}')" title="Eliminar">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

function editarReserva(id, fecha, tiempo) {
    editandoReservaId = id;
    document.getElementById("fecha").value = fecha;
    document.getElementById("tiempo").value = tiempo;
    document.getElementById("btnReservaSubmit").innerHTML = '<i class="bi bi-check-lg me-1"></i> Modificar';
    btnCancelarReserva.classList.remove("d-none");
}

function cancelarEdicionReserva() {
    editandoReservaId = null;
    formReserva.reset();
    document.getElementById("btnReservaSubmit").innerHTML = '<i class="bi bi-plus-lg me-1"></i> Crear';
    btnCancelarReserva.classList.add("d-none");
}

btnCancelarReserva.addEventListener("click", cancelarEdicionReserva);

async function borrarReserva(id) {
    if (!confirm("Seguro que deseas eliminar esta reserva?")) return;
    try {
        await eliminarReserva(id);
        mostrarAlerta("Reserva eliminada correctamente", "success");
        await cargarReservas();
    } catch (error) {
        mostrarAlerta(error.message, "danger");
    }
}

// ==================== UTILIDADES ====================

function mostrarAlerta(mensaje, tipo) {
    const contenedor = document.getElementById("alertas");
    const icono = tipo === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill";
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} d-flex align-items-center alert-dismissible fade show" role="alert">
            <i class="bi ${icono} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    setTimeout(() => { contenedor.innerHTML = ""; }, 4000);
}

// ==================== CARGA INICIAL ====================

document.addEventListener("DOMContentLoaded", () => {
    const hoy = new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    document.getElementById("fechaHoy").textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
    cargarUsuarios();
    cargarEspacios();
    cargarReservas();
});

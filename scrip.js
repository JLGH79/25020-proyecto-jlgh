document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".productos-container");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");
  const btnVaciar = document.getElementById("vaciar-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  fetch("productos.json")
    .then(res => res.json())
    .then(data => {
      mostrarProductos(data);
    });
    
  function mostrarProductos(productos) {
    contenedor.innerHTML = "";
    productos.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.dataset.id = prod.id;
      div.dataset.nombre = prod.nombre;
      div.dataset.precio = prod.precio;

      div.innerHTML = `
        <img class="alinear" src="${prod.imagen}" alt="${prod.nombre}" />
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio.toLocaleString()} Pesos</p>
        <button class="btn-agregar">Agregar al carrito</button>
      `;
      contenedor.appendChild(div);
    });
    agregarEventos();
  }

  function agregarEventos() {
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", e => {
        const productoDiv = e.target.closest(".producto");
        const id = productoDiv.dataset.id;
        const nombre = productoDiv.dataset.nombre;
        const precio = Number(productoDiv.dataset.precio);
        agregarProducto(id, nombre, precio);
      });
    });
  }

  function agregarProducto(id, nombre, precio) {
    const existe = carrito.find(p => p.id === id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    renderizarCarrito();
  }

  function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    renderizarCarrito();
  }

  function cambiarCantidad(id, cambio) {
    const prod = carrito.find(p => p.id === id);
    if (prod) {
      prod.cantidad += cambio;
      if (prod.cantidad <= 0) eliminarProducto(id);
      else {
        guardarCarrito();
        renderizarCarrito();
      }
    }
  }

  function renderizarCarrito() {
    document.getElementById("carrito-contador").textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    listaCarrito.innerHTML = "";
    let total = 0;
    

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nombre} - $${item.precio.toLocaleString()} x 
        <span class="cantidad">${item.cantidad}</span>
        <button class="btn-restar" data-id="${item.id}">-</button>
        <button class="btn-sumar" data-id="${item.id}">+</button>
        <button class="btn-eliminar" data-id="${item.id}">x</button>
      `;
      listaCarrito.appendChild(li);
      total += item.precio * item.cantidad;
    });

    totalCarrito.textContent = `Total: $${total.toLocaleString()}`;

    listaCarrito.querySelectorAll(".btn-sumar").forEach(btn => {
      btn.addEventListener("click", e => cambiarCantidad(e.target.dataset.id, 1));
    });
    listaCarrito.querySelectorAll(".btn-restar").forEach(btn => {
      btn.addEventListener("click", e => cambiarCantidad(e.target.dataset.id, -1));
    });
    listaCarrito.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", e => eliminarProducto(e.target.dataset.id));
    });
  }

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
  });

  renderizarCarrito();

  // Validación del formulario de contacto
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      const nombre = form.name.value.trim();
      const email = form.email.value.trim();
      const mensaje = form.message.value.trim();
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

      if (!nombre || !email || !mensaje || !emailRegex.test(email)) {
        e.preventDefault();
        alert("Por favor completa todos los campos correctamente.");
      }
    });
  }
});
// Mostrar/Ocultar carrito lateral
const btnToggleCarrito = document.getElementById("toggle-carrito");
const carritoLateral = document.querySelector(".carrito-lateral");

btnToggleCarrito.addEventListener("click", () => {
  carritoLateral.classList.toggle("activo");
}); 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const mensajeExito = form?.querySelector(".mensaje-exito");

  if (form) {
    form.addEventListener("submit", function (e) {
      const nombre = form.name.value.trim();
      const email = form.email.value.trim();
      const mensaje = form.message.value.trim();
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

      if (!nombre || !email || !mensaje || !emailRegex.test(email)) {
        e.preventDefault();
        alert("Por favor completa todos los campos correctamente.");
        return;
      }

      // Mostrar mensaje de éxito después de enviar
      e.preventDefault(); 

      form.reset();
      mensajeExito.style.display = "block";
      setTimeout(() => {
        mensajeExito.style.display = "none";
      }, 4000);
    });
  }
});

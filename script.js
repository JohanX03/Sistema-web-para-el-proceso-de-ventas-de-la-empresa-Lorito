// --- MENÚ, BÚSQUEDA Y SCROLL ---
let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

// --- CONFIGURACIÓN ---
const numeroWhatsApp = "51913370483"; 
let carrito = [];

// --- FUNCIÓN PARA AGREGAR AL CARRITO ---
document.querySelectorAll(".menu .box .btn").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    const box = e.target.closest(".box");
    const nombre = box.querySelector("h3").innerText;
    const precioTexto = box.querySelector(".price").innerText;
    const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ""));
    const imagen = box.querySelector("img").getAttribute("src"); // 🔹 NUEVA LÍNEA
    agregarAlCarrito(nombre, precio, imagen);
  });
});

function agregarAlCarrito(nombre, precio, imagen) {
  const existente = carrito.find((p) => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1, imagen }); // 🔹 Guarda la imagen
  }
  mostrarCarrito();
}

// --- MOSTRAR CARRITO ---
function mostrarCarrito() {
  const contenedor = document.querySelector(".cart-items-container");

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p style="color:black; text-align:center; padding:2rem;">Tu carrito está vacío 🛒</p>`;
    return;
  }

  const itemsHTML = carrito
    .map(
      (p, i) => `
      <div class="cart-items">
        <span class="fas fa-times" onclick="eliminarProducto(${i})"></span>
        <img src="${p.imagen}" alt="${p.nombre}"> <!-- 🔹 Muestra imagen real -->
        <div class="content">
          <h3>${p.nombre}</h3>
          <div class="price">S/. ${(p.precio * p.cantidad).toFixed(2)} (${p.cantidad})</div>
        </div>
      </div>`
    )
    .join("");

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const botonWhatsApp = `
    <div style="text-align:center; padding:1rem; border-top:1px solid #ccc;">
      <p style="color:black; font-size:1.6rem;">Total: <strong>S/. ${total.toFixed(2)}</strong></p>
      <a href="#" class="btn" onclick="enviarPedidoWhatsApp()">Pagar</a>
    </div>
  `;

  contenedor.innerHTML = itemsHTML + botonWhatsApp;
}

// --- ELIMINAR PRODUCTO ---
function eliminarProducto(index) {
  carrito.splice(index, 1);
  mostrarCarrito();
}

// --- ENVIAR PEDIDO A WHATSAPP ---
function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🛒");
    return;
  }

  // Obtener número de pedido secuencial
  let numeroPedido = localStorage.getItem("numeroPedido");
  if (!numeroPedido) {
    numeroPedido = 1;
  } else {
    numeroPedido = parseInt(numeroPedido) + 1;
  }
  localStorage.setItem("numeroPedido", numeroPedido);

  let mensaje = "⭐ *Nuevo Pedido Realizado*\n\n";
  mensaje += "📦 *Productos:*\n";

  let total = 0;
  carrito.forEach((p) => {
    const subtotal = p.precio * p.cantidad;
    mensaje += `• ${p.nombre} x${p.cantidad} = S/ ${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });

  mensaje += `\n💰 *Total:* S/ ${total.toFixed(2)}\n`;
  mensaje += `🧾 *Número de pedido:* ${numeroPedido}\n\n`;
  mensaje += "💬 Gracias por su compra.";

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}


// RUTA PHP
fetch('ruta.php')
  .then(res => res.json())
  .then(datos => {
    const contenedor = document.getElementById('lista-productos');
    if (datos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos registrados.</p>';
      return;
    }

    contenedor.innerHTML = datos.map(p => `
      <div class="producto">
        <h3>${p.producto_nombre}</h3>
        <p><strong>Código:</strong> ${p.producto_codigo}</p>
        <p><strong>Precio:</strong> S/ ${p.producto_precio_venta}</p>
        <p><strong>Stock:</strong> ${p.producto_stock_total}</p>
        <p><strong>Marca:</strong> ${p.producto_marca}</p>
      </div>
    `).join('');
  })
  .catch(err => {
    console.error('Error al conectar con la ruta:', err);
    document.getElementById('lista-productos').innerHTML = '<p>Error al cargar los productos.</p>';
  });

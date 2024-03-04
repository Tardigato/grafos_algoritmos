document.addEventListener("DOMContentLoaded", function() {
    // Espera a que el DOM esté completamente cargado

    // Obtén referencias a los botones y elementos necesarios
    var dibujarGrafoBtn = document.querySelector(".custom-btn:nth-child(1)");
    var masAlgoritmosBtn = document.querySelector(".custom-btn:nth-child(2)");
    var contactosBtn = document.querySelector(".contactosBtn");
    var modalContactos = document.getElementById("modalContactos");
    var cerrarModalBtn = document.getElementById("cerrarModalBtn");
    var contactosContainer = document.getElementById("contactosContainer");
    var regresarBtn = document.getElementById("regresarBtn");

    // Agrega eventos de clic a los botones
    dibujarGrafoBtn.addEventListener("click", function() {
        // Acciones a realizar cuando se hace clic en "Dibujar Grafo"
        console.log("Botón 'Dibujar Grafo' clicado");
        // Puedes agregar aquí la lógica específica que deseas ejecutar
    });

    masAlgoritmosBtn.addEventListener("click", function() {
        // Acciones a realizar cuando se hace clic en "Más algoritmos próximamente"
        console.log("Botón 'Más algoritmos próximamente' clicado");
        // Puedes agregar aquí la lógica específica que deseas ejecutar
    });

    contactosBtn.addEventListener("click", function() {
        // Acciones a realizar cuando se hace clic en "Contactos"
        console.log("Botón 'Contactos' clicado");

        // Muestra el modal de contactos
        modalContactos.style.display = "block";

        // Muestra el contenedor de contactos
        contactosContainer.style.display = "flex";

        // Muestra el botón de regresar
        regresarBtn.style.display = "block";
    });

    cerrarModalBtn.addEventListener("click", function() {
        // Acciones a realizar cuando se hace clic en el botón de cerrar el modal
        console.log("Botón 'Cerrar Modal' clicado");
    
        // Oculta el modal de contactos
        modalContactos.style.display = "none";
    
        // Oculta el contenedor de contactos
        contactosContainer.style.display = "none";
    
        // Oculta el botón de regresar
        regresarBtn.style.display = "none";
    });

    regresarBtn.addEventListener("click", function() {
        // Acciones a realizar cuando se hace clic en el botón de regresar
        console.log("Botón 'Regresar' clicado");
    
        // Oculta el contenedor de contactos
        contactosContainer.style.display = "none";
    
        // Oculta el botón de regresar
        regresarBtn.style.display = "none";
    });
});

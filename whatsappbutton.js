document.getElementById('contactoWhatsApp').addEventListener('click', function() {
    var mensaje = encodeURIComponent("Hola, estoy interesado en comprar una instrumental.");
    var urlWhatsApp = "https://wa.me/2281045675?text=" + mensaje;
    window.open(urlWhatsApp, '_blank');
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario para usar AJAX o similar si es necesario
    var formStatus = document.getElementById('formStatus');
    formStatus.style.display = 'block';
    formStatus.textContent = 'Enviando...';
    formStatus.scrollIntoView({behavior: 'smooth'});

    // Aquí deberías agregar tu lógica de envío del formulario, por ejemplo, usando AJAX

    // Simula el envío del formulario y la carga de la respuesta
    setTimeout(function() {
        formStatus.textContent = 'Mensaje enviado exitosamente';
        document.getElementById('contactForm').reset(); // Resetea el formulario
        localStorage.clear(); // Limpia el almacenamiento local ya que el formulario se envió con éxito

        // Oculta el mensaje después de unos segundos y desplaza hacia arriba
        setTimeout(function() {
            formStatus.style.display = 'none';
            window.scrollTo({top: 0, behavior: 'smooth'});
        }, 5000);
    }, 2000); // Simula un retraso de 2 segundos para el envío del formulario
});

// Guarda los datos del formulario en el almacenamiento local cuando el usuario escribe
document.getElementById('contactForm').addEventListener('input', function() {
    var nombre = document.querySelector('input[name="nombre"]').value;
    var email = document.querySelector('input[name="_replyto"]').value;
    var mensaje = document.querySelector('textarea[name="mensaje"]').value;

    localStorage.setItem('nombre', nombre);
    localStorage.setItem('email', email);
    localStorage.setItem('mensaje', mensaje);
});

// Rellena el formulario con los datos guardados al cargar la página
window.addEventListener('load', function() {
    var nombre = localStorage.getItem('nombre');
    var email = localStorage.getItem('email');
    var mensaje = localStorage.getItem('mensaje');

    if (nombre) document.querySelector('input[name="nombre"]').value = nombre;
    if (email) document.querySelector('input[name="_replyto"]').value = email;
    if (mensaje) document.querySelector('textarea[name="mensaje"]').value = mensaje;
});

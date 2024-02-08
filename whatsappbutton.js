document.getElementById('contactoWhatsApp').addEventListener('click', function() {
    var mensaje = encodeURIComponent("Hola, estoy interesado en comprar una instrumental.");
    var urlWhatsApp = "https://wa.me/2281045675?text=" + mensaje; // Reemplaza "1234567890" con tu número de teléfono.
    window.open(urlWhatsApp, '_blank');
});

document.getElementById('contactForm').addEventListener('submit', function() {
    // Muestra un mensaje de carga
    var formStatus = document.getElementById('formStatus');
    formStatus.style.display = 'block';
    formStatus.textContent = 'Enviando...';
    formStatus.scrollIntoView({behavior: 'smooth'}); // Asegura que el mensaje sea visible
});

document.getElementById('hidden_iframe').addEventListener('load', function() {
    // Muestra un mensaje de éxito
    var formStatus = document.getElementById('formStatus');
    formStatus.textContent = 'Mensaje enviado exitosamente';
    formStatus.scrollIntoView({behavior: 'smooth'}); // Asegura que el mensaje sea visible
    
    // Resetea el formulario
    document.getElementById('contactForm').reset();
    
    // Opcionalmente, oculta el mensaje después de unos segundos y desplaza de nuevo hacia arriba
    setTimeout(function() {
        formStatus.style.display = 'none';
        window.scrollTo({top: 0, behavior: 'smooth'}); // Desplaza hacia arriba suavemente
    }, 5000);
});

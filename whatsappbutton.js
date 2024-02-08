document.getElementById('contactoWhatsApp').addEventListener('click', function() {
    var mensaje = encodeURIComponent("Hola, estoy interesado en comprar una instrumental.");
    var urlWhatsApp = "https://wa.me/2281045675?text=" + mensaje; // Reemplaza "1234567890" con tu número de teléfono.
    window.open(urlWhatsApp, '_blank');
});

document.getElementById('contactForm').addEventListener('submit', function() {
    // Muestra un mensaje de carga
    document.getElementById('formStatus').style.display = 'block';
    document.getElementById('formStatus').textContent = 'Enviando...';
});

document.getElementById('hidden_iframe').addEventListener('load', function() {
    // Muestra un mensaje de éxito
    document.getElementById('formStatus').textContent = 'Mensaje enviado exitosamente';
    // Resetea el formulario
    document.getElementById('contactForm').reset();
    // Opcionalmente, oculta el mensaje después de unos segundos
    setTimeout(function() {
        document.getElementById('formStatus').style.display = 'none';
    }, 5000);
});

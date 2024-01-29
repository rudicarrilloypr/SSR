document.getElementById('contactoWhatsApp').addEventListener('click', function() {
    var mensaje = encodeURIComponent("Hola, estoy interesado en comprar una instrumental.");
    var urlWhatsApp = "https://wa.me/2281045675?text=" + mensaje; // Reemplaza "1234567890" con tu número de teléfono.
    window.open(urlWhatsApp, '_blank');
});

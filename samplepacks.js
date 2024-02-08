document.addEventListener("DOMContentLoaded", function() {
    // Aquí puedes mantener o agregar otros efectos que desees conservar.
    // Por ejemplo, el efecto intermitente para h3, si lo hubiera.

    const h3 = document.querySelector('h3');
    if (h3) {
        h3.style.opacity = '0'; // Establece la opacidad inicial a 0.
        setInterval(() => {
            h3.style.opacity = h3.style.opacity === '0' ? '1' : '0';
        }, 1000); // Ajusta el intervalo según la rapidez con la que quieras que parpadee.
    }

    // Cualquier otro efecto que quieras mantener o agregar puede ir aquí.
});

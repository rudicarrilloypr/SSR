function typeWriter(element, text, i, interval) {
    if (i === 0) element.innerHTML = ''; // Limpia el texto inicial solo antes de empezar a escribir

    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(function() {
            typeWriter(element, text, i, interval);
        }, interval);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const h3 = document.querySelector('h3');
    if (h3) {
        const h3Text = h3.innerText; // Guarda el texto inicial
        typeWriter(h3, h3Text, 0, 100);
    }

    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        const pText = p.innerText; // Guarda el texto inicial
        setTimeout(() => {
            typeWriter(p, pText, 0, 50);
        }, (h3.innerText.length * 100) + 500 * index); // Espera a que el h3 termine
    });
});

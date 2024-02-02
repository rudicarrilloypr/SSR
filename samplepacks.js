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
    // Efecto de escritura para h1
    const h1 = document.querySelector('h1');
    if (h1) {
        const h1Text = h1.innerText; // Guarda el texto inicial
        typeWriter(h1, h1Text, 0, 100);
    }

    // Efecto de escritura para p
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        const pText = p.innerText; // Guarda el texto inicial
        setTimeout(() => {
            typeWriter(p, pText, 0, 50);
        }, h1.innerText.length * 100 + 500 * index); // Espera a que el h1 termine
    });
});

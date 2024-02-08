document.addEventListener('DOMContentLoaded', function() {
    var footerHTML = `<footer>
    <p>Copyright &copy; 2024 Sociedad Secreta del Ritmo</p>
    <div class="redes-sociales">
        <a href="https://www.youtube.com/channel/UCH-oZf0oAvgDS5_hDFAyh4A" target="_blank"><img src="./assets/logos/youtube.PNG" alt="YouTube"></a>
        <a href="https://soundcloud.com/sociedadsecretadelritmo" target="_blank"><img src="./assets/logos/soundcloud.PNG" alt="Soundcloud"></a>
        <a href="https://www.instagram.com/____s.s.r/" target="_blank"><img src="./assets/logos/instagram.PNG" alt="Instagram"></a>
        <a href="https://sociedadsecretadelritmo.bandcamp.com/" target="_blank"><img src="./assets/logos/bandcamp.PNG" alt="Bandcamp"></a>
        <a href="#" target="_blank"><img src="./assets/logos/discord.PNG" alt="Discord"></a>
    </div>
</footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});

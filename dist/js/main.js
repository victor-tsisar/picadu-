let menu = document.querySelector('.sidebar');
let menuToggle = document.querySelector('#menu-toggle');

menuToggle.addEventListener('click', function (event){
    event.preventDefault();  // отмена обычного клика по ссылке (стандартного поведения)
    menu.classList.toggle('visible');
});

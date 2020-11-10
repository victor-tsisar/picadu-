'use strict;'
// Скрипт с урока верстки
let menu = document.querySelector('.sidebar');
let menuToggle = document.querySelector('#menu-toggle');

menuToggle.addEventListener('click', function (event){
    event.preventDefault();  // отмена обычного клика по ссылке (стандартного поведения)
    menu.classList.toggle('visible');
});

// JS-функционал (онлайн-интенсив)
const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login__form');
const emailInput = document.querySelector('.login__email');
const passwordInput = document.querySelector('.login__password');
const loginForget = document.querySelector('.login__forget');
const loginSignIn = document.querySelector('.login__signin');
const loginSignUp = document.querySelector('.login__signup');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user__name');

// Пользователи (база)
const listUsers = [
    {
        id: '01',
        email: 'victrun@gmail.com',
        password: '12345',
        displayName: 'victor'
    },
    {
        id: '02',
        email: 'kate@mail.com',
        password: '112233',
        displayName: 'kate123'
    }
];

// Форма авторизации

const setUsers = {
    user: null,
    // Авторизация нового пользователя
    logIn(email, password, handler) {
        const user = this.getUser(email);
        if(user && user.password === password) {
            this.authorizedUser(user)
            handler();
        } else {
            alert('Пользователь с такими даными не найден')
        }

        console.log(email, password);
    },
    logOut() {
        console.log('выход');
    },
    // Регистрация нового пользователя
    signUp(email, password, handler) {
        // Момент регистрации
        if(!this.getUser(email)) {
            const user = {
                email, password, displayName: email.match(/[-.\w]+[^@]/)[0]
            }
            // Момент добавления в базу/список
            listUsers.push(user);
            // Момент авторизации
            this.authorizedUser(user)
            // Момент скрития блока авторизации / отображения личного кабинета
            handler();
        } else {
            alert('Пользователь с такими даными уже зарегистрирован!')
        }
    },
    // Проверка e-mail пользователя в базе listUsers
    getUser(email) {
        return listUsers.find((item) => item.email === email)
    },
    // Запись введеных даных при авторизации пользователя
    authorizedUser(user) {
        this.user = user;
    }
};

// Активация личного кабинета после удачной авторизации/регистрации
const toggleAuthDom = () => {
    const user = setUsers.user;
    console.log('user: ', user);

    if (user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
    }
};

// Отправка формы - Вход в систему
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);  // 1 вариант записи переменных и значений
});

// Регистрация в системе
loginSignUp.addEventListener('click', (event) => {
    event.preventDefault();

    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    setUsers.signUp(emailValue, passwordValue, toggleAuthDom);  // 2 вариант записи переменных и значений через const    
});

toggleAuthDom ();  // первый запуск скроет блок личного кабинета пользователя
'use strict;'
// Скрипт с урока верстки
let menu = document.querySelector('.sidebar');
let menuToggle = document.querySelector('#menu-toggle');

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

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit__container');
const editUsername = document.querySelector('.edit__username');
const editPhotoURL = document.querySelector('.edit__photo');
const userAvatarElem = document.querySelector('.user__avatar');

const postsWrapper = document.querySelector('.posts');

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
        email: 'kate@mail.ru',
        password: '112233',
        displayName: 'kate123'
    }
];

// Форма авторизации/регистрации

const setUsers = {
    user: null,
    // Авторизация нового пользователя
    logIn(email, password, handler) {
        // Валидация е-mail
        if (!regExpValidEmail.test(email)) {
            alert('E-mail не валиден');
            return;
        }

        const user = this.getUser(email);
        if(user && user.password === password) {
            this.authorizedUser(user)
            handler();
        } else {
            alert('Пользователь с такими даными не найден')
        }

        console.log(email, password);
    },
    logOut(handler) {
        this.user = null;
        handler();
    },
    // Регистрация нового пользователя
    signUp(email, password, handler) {
        if (!regExpValidEmail.test(email)) {
            alert('E-mail не валиден')
            return;
        }
        
        // Проверка введены ли даные пользователем
        if (!email.trim() || !password.trim()) {
            alert('Введите даные!');
            return;
        }
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
    // Прийом логина пользователя и аватара
    editUser(userName, userPhoto = '', handler) {
        if (userName) {
            this.user.displayName = userName;
        }
        if (userPhoto) {
            this.user.photo = userPhoto;
        }
        handler();
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
        userAvatarElem.src = user.photo || userAvatarElem.src;  // Добавление аватара или оставить по умолчанию
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
    }
};

// Добавление постов на страницу
const setPosts = {
    allPosts: [
        {
            title: 'ШПАРГАЛКА ДЛЯ МОЛНИЕНОСНОСТНОЙ ВЕРСТКИ',
            text: 'Сокращение при помощи плагина EMMET, позволяет значительно увеличить скорость верстки за счет комбинации команд и аббревиатур.Так же можно дополнительно делать свои аббревиатуры. <p> EMMET прост в установке интегрируется в такие редакторы как PHPStorm, Sublime Text, Adobe Dreamviewer, Notepad++, WebStorm, Aptana, Coda, TextMate, Eclipse, CodeMirror, Brackets, Emacs, HippoEDIT, HTML - Kit и други, полный их перечень найдете на сайте EMMET.</p>',
            tags: ['свежее', 'горячее', 'мое', 'случайность'],
            author: 'victrun@gmail.com',
            date: '11.10.2020, 10:54:00',
            like: 45,
            comments: 20,
        },
        {
            title: 'Преимущества Sass',
            text: 'Полная совместимость с CSS <br> Sass полностью совместим со всеми версиями CSS.Мы уделяем серьезное внимание совместимости, поэтому вы можете легко использовать любые доступные библиотеки CSS. <p> Богатая функциональность <br> Sass может похвастаться большим количеством возможностей, чем любой другой язык расширения CSS. Команда Sass Core бесконечно работает не только для поддержания этих возможностей, но и для того, чтобы быть впереди. Sass находится в активной разработке более 8 лет. </p> <p> Фреймворки <br> Есть бесконечное количество фреймворков, построенных на Sass. Compass, Bourbon и Susy - это только несколько примеров из всего количества.</p>', 
            tags: ['свежее', 'горячее', 'мое', 'случайность'],
            author: 'kate@mail.ru',
            date: '10.11.2020, 20:05:00',
            like: 68,
            comments: 17,
        },
        {
            title: 'Опановуємо основи алгоритмів',
            text: 'Коли на співбесідах запитую, як можна підвищити продуктивність роботи вебсервісу, основними відповідями є вертикальне та  горизонтальне масштабування, використання різних типів кешів, створення індексів у базі даних і написання оптимальніших запитів у базу даних.Звичайно, відповідь є правильною, але неповною.Мало хто згадує, що поліпшити роботу програми можна написанням оптимальніших алгоритмів або використанням структур даних, які краще розв’яжуть певну задачу. <p> Оскільки зараз процесорний час порівняно дешевий і оперативна пам’ять також, від програмістів не вимагають писати супероптимальні програми.Бо порівняно з процесорним часом і оперативною пам’яттю час програміста дуже дорогий. Написання оптимізованих програм може тривати справді довго. <em><a href="https://dou.ua/lenta/articles/why-understanding-algorithms-is-important/?from=comment-digest_post&utm_source=transactional&utm_medium=email&utm_campaign=digest-comments"> Детальніше...</a></em ></p>',
            tags: ['свежее', 'горячее', 'мое', 'случайность'],
            author: 'victrun@gmail.com',
            date: '01.10.2020, 07:54:00',
            like: 109,
            comments: 44,
        },
    ]

};

// Пости на странице
const showAllPosts = () => {
    let postHTML = '';

    setPosts.allPosts.forEach(post => {

        //  Деструктуризация аргумента post, можно писть прямо вместо него
        const { title, text, tags, author, date, like, comments } = post;

        postHTML += `
            <section class="post">
                <div class="post__body">
                    <h2 class="post__title title">${title}</h2>
                    <p class="post__text text">${text}</p>
                    <div class="tags">
                        <a class="tag" href="#">#${tags[0]}</a>
                        <a class="tag" href="#">#${tags[1]}</a>
                        <a class="tag" href="#">#${tags[2]}</a>
                        <a class="tag" href="#">#${tags[3]}</a>
                    </div>
                </div>
                <div class="post__footer">
                    <div class="post__btns">
                        <button class="likes post__btn">
                            <svg class="icon icon-like" width="19" height="20">
                                <use xlink:href="images/icons.svg#like"></use>
                            </svg>
                            <span class="likes__counter">${like}</span>
                        </button>
                        <button class="comments post__btn">
                            <svg class="icon icon-comment" width="21" height="21">
                                <use xlink:href="images/icons.svg#comment"></use>
                            </svg>
                            <span class="comments__counter">${comments}</span>
                        </button>
                        <button class="save post__btn">
                            <svg class="icon icon-save" width="19" height="19">
                                <use xlink:href="images/icons.svg#save"></use>
                            </svg>
                        </button>
                        <button class="share post__btn">
                            <svg class="icon icon-share" width="17" height="19">
                                <use xlink:href="images/icons.svg#share"></use>
                            </svg>
                        </button>
                    </div>
                    <div class="post__author">
                        <div class="author__about">
                            <a href="#" class="author__username">${author}</a>
                            <span class="post__time">${date}</span>
                        </div>
                        <a href="#" class="author__link">
                            <img class="author__avatar" src="images/avatar.png" alt="avatar">
                        </a>
                    </div>
                </div>
            </section>
        `;
    });

    postsWrapper.innerHTML = postHTML
}

const init = () => {
    // Отправка формы - Вход в систему
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);  // 1 вариант записи переменных и значений
        loginForm.reset();  // очистка формы
    });

    // Регистрация в системе
    loginSignUp.addEventListener('click', (event) => {
        event.preventDefault();

        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;
        setUsers.signUp(emailValue, passwordValue, toggleAuthDom);  // 2 вариант записи переменных и значений через const 
        loginForm.reset();
    });

    // Выход по клику кнопки
    exitElem.addEventListener('click', event => {
        event.preventDefault();
        setUsers.logOut(toggleAuthDom);
    });

    // Активация окна редактирования для даных пользователя (фото, логин)
    editElem.addEventListener('click', event => {
        event.preventDefault();
        editContainer.classList.toggle('visible');
        editUsername.value = setUsers.user.displayName;
    });

    // Получение нового логина и аватара пользователя с блока редактировать
    editContainer.addEventListener('submit', event => {
        event.preventDefault();
        setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
        editContainer.classList.remove('visible');
    });

    menuToggle.addEventListener('click', function (event) {
        event.preventDefault();  // отмена обычного клика по ссылке (стандартного поведения)
        menu.classList.toggle('visible');
    });


    showAllPosts();
    toggleAuthDom();  // первый запуск скроет блок личного кабинета пользователя
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

'use strict;'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC96aC1pToGjSoRZOUySNmDGILMWrS76To",
    authDomain: "picadu-f9041.firebaseapp.com",
    databaseURL: "https://picadu-f9041.firebaseio.com",
    projectId: "picadu-f9041",
    storageBucket: "picadu-f9041.appspot.com",
    messagingSenderId: "747110056656",
    appId: "1:747110056656:web:eb85870bc538357dab94d5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);

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

const buttonNewPost = document.querySelector('.button__new-post');
const addPostElem = document.querySelector('.add__post');

const DEFAULT_PHOTO = userAvatarElem.src;

// Пользователи (база)
// const listUsers = [
//     {
//         id: '01',
//         email: 'victrun@gmail.com',
//         password: '123456',
//         displayName: 'victor',
//         photo: 'https://i.pinimg.com/474x/b7/ac/72/b7ac72adb88d04be0eef89b39bba7d61.jpg'
//     },
//     {
//         id: '02',
//         email: 'kate@mail.ru',
//         password: '112233',
//         displayName: 'kate',
//         photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTShHa5ocpKUoavy9CUwwBycXIVhyiB1RkmcQ&usqp=CAU'
//     }
// ];

// Форма авторизации/регистрации
const setUsers = {
    user: null,
    // Слушатель от firebase
    initUser(handler) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user;
            } else {
                this.user = null;
            }
            if (handler) handler();
        });
    },

    // Авторизация нового пользователя
    logIn(email, password, handler) {
        // Валидация е-mail
        if (!regExpValidEmail.test(email)) {
            alert('E-mail не валиден');
            return;
        }

        // Авторизация
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((err) => {
                const errCode = err.code;
                const errMessage = err.message;
                if (errCode === 'auth/wrong-password') {
                    console.log(errMessage);
                    alert('Неверный пароль!');
                } else if (errCode === 'auth/user-not-found') {
                    console.log(errMessage);
                    alert('Пользователь не найден!');
                } else {
                    alert(errMessage)
                }
                console.log(err);
            });
    },

    logOut() {
        // Выход с системы
        firebase.auth().signOut();
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
        // Регистрация
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then((data) => {
                this.editUser(email.substring(0, email.indexOf('@')), null, handler);
            })
            .catch((err) => {
                const errCode = err.code;
                const errMessage = err.message;
                if (errCode === 'auth/weak-password') {
                    console.log(errMessage);
                    alert('Слабый пароль!');
                } else if (errCode === 'auth/email-already-in-use') {
                    console.log(errMessage);
                    alert('E-mail уже используеться!');
                } else {
                    alert(errMessage)
                }
            });
    },

    // Прийом логина пользователя и аватара
    editUser(displayName, photoURL, handler) {

        // Получение текущего пользователя для окна редактирования
        const user = firebase.auth().currentUser;

        if (displayName) {
            if (photoURL) {
                user.updateProfile({
                    displayName,
                    photoURL
                }).then(handler)
            } else {
                user.updateProfile({
                    displayName
                }).then(handler) 
            } 
        }
    },

    // Когда пользователь забыл пароль
    sendForget(email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('Письмо отправлено!')
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Проверка e-mail пользователя в базе listUsers
    // getUser(email) {
    //     return listUsers.find((item) => item.email === email)
    // },
    // Запись введеных даных при авторизации пользователя
    // authorizedUser(user) {
    //     this.user = user;
    // }
};

// Активация личного кабинета после удачной авторизации/регистрации
const toggleAuthDom = () => {
    const user = setUsers.user;
    console.log('user: ', user);

    if (user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
        userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;  // Добавление аватара или оставить по умолчанию
        buttonNewPost.classList.add('visible');  //Отображение кнопки публикации поста        
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
        buttonNewPost.classList.remove('visible');
        addPostElem.classList.remove('visible');
        postsWrapper.classList.add('visible');
    }
};

// Добавление постов на страницу
const setPosts = {
    allPosts: [
        // {
        //     title: 'ШПАРГАЛКА ДЛЯ МОЛНИЕНОСНОСТНОЙ ВЕРСТКИ',
        //     text: 'Сокращение при помощи плагина EMMET, позволяет значительно увеличить скорость верстки за счет комбинации команд и аббревиатур.Так же можно дополнительно делать свои аббревиатуры. <p> EMMET прост в установке интегрируется в такие редакторы как PHPStorm, Sublime Text, Adobe Dreamviewer, Notepad++, WebStorm, Aptana, Coda, TextMate, Eclipse, CodeMirror, Brackets, Emacs, HippoEDIT, HTML - Kit и други, полный их перечень найдете на сайте EMMET.</p>',
        //     tags: ['EMMET', 'верстка', 'сокращение'],
        //     author: { displayName: 'man', photo: 'https://i.pinimg.com/474x/b7/ac/72/b7ac72adb88d04be0eef89b39bba7d61.jpg' },
        //     date: '11.10.2020, 10:54:00',
        //     like: 45,
        //     comments: 20,
        // }   
    ],

    addPost(title, text, tags, handler) {
        // Атрибути нового поста: название, текст, теги и т.д. Пост добавляеться в начало списка
        const user = firebase.auth.currentUser;

        this.allPosts.unshift({
            id: `postID${(+new Date()).toString(16)}`,  // генерация уникального іd... -${user.uid}
            title,
            text,
            tags: tags.split(',').map(item => item.trim()),
            author: {
                displayName: setUsers.user.displayName,
                photo: setUsers.user.photoURL,
            },
            date: new Date().toLocaleString(),
            like: 0,
            comments: 0,
        });

        // Добавление постов в базу и их отображение
        firebase.database().ref('post').set(this.allPosts)
            .then(() => this.getPosts(handler))
    },

    getPosts(handler) {
        firebase.database().ref('post').on('value', snapshot => {
            this.allPosts = snapshot.val() || [];
            handler();
        })
    }
};

// Показ окна нового поста / скритие блока постов
const showAddPost = () => {
    addPostElem.classList.add('visible');
    postsWrapper.classList.remove('visible');
}

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
                        ${tags.map(tag => `<a class="tag" href="#${tag}">#${tag}</a>`)}
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
                            <a href="#" class="author__username">${author.displayName}</a>
                            <span class="post__time">${date}</span>
                        </div>
                        <a href="#" class="author__link">
                            <img class="author__avatar" src=${author.photo || "images/avatar.png"} alt="avatar">
                        </a>
                    </div>
                </div>
            </section>
        `;
    });

    postsWrapper.innerHTML = postHTML;

    // Показ постов после добавление нового
    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');
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
        setUsers.logOut();
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

    // Добавление нового поста в общий блок
    buttonNewPost.addEventListener('click', event => {
        event.preventDefault();
        showAddPost();
    });

    addPostElem.addEventListener('submit', event => {
        event.preventDefault();
        const { title, text, tags } = addPostElem.elements;

        if (title.value.length < 6) {
            alert('Малая длина заголовка');
            return;
        }
        if (text.value.length < 50) {
            alert('Мало символов для публикации поста');
            return;
        }

        setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
        addPostElem.classList.remove('visible');
        addPostElem.reset();
    });

    // События при забыл пароль
    loginForget.addEventListener('click', event => {
        event.preventDefault();
        setUsers.sendForget(emailInput.value);
        emailInput.value = '';
    });

    setUsers.initUser(toggleAuthDom);
    setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});

//  Возможные доработки:
// - модальное окно создания новых постов,
// - реализация кнопок добавления видео/аудио
// - подключение коментариев и лайков
// - вывод коментария в боковую панель

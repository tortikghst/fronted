import './style.css'

class AuthManager {
    async register(email: string, password: string, name: string): Promise<boolean> {
        if (!email || !password || !name) {
            alert("Все поля обязательны!");
            return false;
        }
        if (password.length < 6) {
            alert("Пароль должен быть минимум 6 символов!");
            return false;
        }
        try {
            const response = await fetch('http://91.107.123.64:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            const data = await response.json();
            if (response.ok) {
                alert('✅ Регистрация успешна! Теперь войдите.');
                window.location.hash = 'login';
                return true;
            } else if (response.status === 400) {
                alert('❌ Неверные данные.');
                return false;
            } else if (response.status === 409) {
                alert('❌ Email уже существует.');
                return false;
            } else {
                alert(`❌ ${data.message || 'Ошибка'}`);
                return false;
            }
        } catch {
            alert('❌ Не удалось подключиться к серверу.');
            return false;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        if (!email || !password) {
            alert("Email и пароль обязательны!");
            return false;
        }
        try {
            const response = await fetch('http://91.107.123.64:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                alert('✅ Вход выполнен! Добро пожаловать.');
                window.location.hash = 'dashboard';
                return true;
            } else if (response.status === 401) {
                alert('❌ Неверный email или пароль.');
                return false;
            } else {
                alert(`❌ ${data.message || 'Ошибка'}`);
                return false;
            }
        } catch {
            alert('❌ Не удалось подключиться к серверу.');
            return false;
        }
    }
}

const auth = new AuthManager();

function navigateTo(page: string) {
    window.location.hash = page;
}

// Исправлено: гарантируем наличие элемента #app
function getAppElement(): HTMLDivElement {
    let app = document.querySelector<HTMLDivElement>('#app');
    if (!app) {
        app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);
    }
    return app;
}

function renderPage() {
    const hash = window.location.hash.slice(1) || 'home';
    const app = getAppElement(); // Исправлено: используем безопасное получение

    if (hash === 'login') {
        app.innerHTML = `
        <div class='registr'> 
            <div class="register">
                <h2> Вход</h2>
                <form id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email" required />
                    <input type="password" id="loginPassword" placeholder="Пароль" required />
                    <button type="submit">Войти</button>
                </form>
                <div>
                    <button id="goToRegisterBtn">Зарегистрироваться</button>
                    <button id="goToHomeBtn">На главную</button>
                </div>
                <div id="loading" style="display: none;">Загрузка...</div>
            </div>
        </div>
        `;

        const form = document.querySelector('#loginForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (document.querySelector('#loginEmail') as HTMLInputElement).value;
            const password = (document.querySelector('#loginPassword') as HTMLInputElement).value;
            const loading = document.querySelector('#loading') as HTMLDivElement;
            loading.style.display = 'block';
            await auth.login(email, password);
            loading.style.display = 'none';
        });

        const goToRegisterBtn = document.querySelector('#goToRegisterBtn');
        goToRegisterBtn?.addEventListener('click', () => navigateTo('register'));

        const goToHomeBtn = document.querySelector('#goToHomeBtn');
        goToHomeBtn?.addEventListener('click', () => navigateTo('home'));
    }
    else if (hash === 'register') {
        app.innerHTML = `
        <div class='registr'>    
            <div class="register">
                <form id="registerForm">
                    <h2 class='h_reg'>Регистрация</h2>
                    <input class='btn-reg' type="text" id="regName" placeholder=" Имя" required />
                    <input class='btn-reg' type="email" id="regEmail" placeholder=" Email" required />
                    <input class='btn-reg' type="password" id="regPassword" placeholder=" Пароль" required />
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <div>
                    <button id="goToLoginBtn">Войти</button>
                    <button id="goToHomeBtn">На главную</button>
                </div>
                <div id="loading" style="display: none;">Загрузка...</div>
            </div>
        </div>
        `;

        const form = document.querySelector('#registerForm');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = (document.querySelector('#regName') as HTMLInputElement).value;
            const email = (document.querySelector('#regEmail') as HTMLInputElement).value;
            const password = (document.querySelector('#regPassword') as HTMLInputElement).value;
            const loading = document.querySelector('#loading') as HTMLDivElement;
            loading.style.display = 'block';
            await auth.register(email, password, name);
            loading.style.display = 'none';
        });

        const goToLoginBtn = document.querySelector('#goToLoginBtn');
        goToLoginBtn?.addEventListener('click', () => navigateTo('login'));

        const goToHomeBtn = document.querySelector('#goToHomeBtn');
        goToHomeBtn?.addEventListener('click', () => navigateTo('home'));
    }
    else { // home
        app.innerHTML = `
            <div class="page">
                <header class='div-header'>
                    <div class="nav-buttons">
                        <header class='header-main'>
                            <button id="goToLoginBtn" class='header-btn'>Вход</button>
                            <button id="goToRegisterBtn" class='header-btnt'>Регистрация</button>
                        </header>
                    </div>
                    <h1 class='main_h'>GhostEvent</h1>
                    <h2 class='main_hj'>Аренда оборудования для мероприятий!</h2>
                </header>
            </div>
        `;

        const goToLoginBtn = document.querySelector('#goToLoginBtn');
        goToLoginBtn?.addEventListener('click', () => navigateTo('login'));

        const goToRegisterBtn = document.querySelector('#goToRegisterBtn');
        goToRegisterBtn?.addEventListener('click', () => navigateTo('register'));
    }
}

window.addEventListener('hashchange', renderPage);
renderPage();
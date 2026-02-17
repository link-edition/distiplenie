// ============================================
// DISCIPLINE - Firebase Authentication
// ============================================

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvTDFI6CkoCX5z4ud3RmKAJuRJH8GykoA",
    authDomain: "discipline-app-faf38.firebaseapp.com",
    projectId: "discipline-app-faf38",
    storageBucket: "discipline-app-faf38.firebasestorage.app",
    messagingSenderId: "195529532966",
    appId: "1:195529532966:web:37d4b730c092e4c81368e7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show message (error or success)
function showMessage(type, text) {
    const msgEl = document.getElementById('authMessage');
    if (!msgEl) return;

    msgEl.className = `auth-message show ${type}`;
    const iconEl = msgEl.querySelector('.message-icon');
    const textEl = msgEl.querySelector('.message-text');

    iconEl.textContent = type === 'error' ? '⚠️' : '✅';
    textEl.textContent = text;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        msgEl.classList.remove('show');
    }, 5000);
}

// Set button loading state
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    if (loading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// Toggle password visibility
function setupPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.form-input-wrapper');
            const input = wrapper.querySelector('input');

            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>`;
            } else {
                input.type = 'password';
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>`;
            }
        });
    });
}

// Password strength checker
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');

    if (!passwordInput || !strengthText) return;

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let strength = 0;

        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Normalize to 0-4
        strength = Math.min(strength, 4);

        // Reset all bars
        strengthBars.forEach(bar => {
            bar.className = 'strength-bar';
        });

        // Set bar colors
        const levels = ['', 'weak', 'weak', 'medium', 'strong'];
        const texts = ['', 'Juda kuchsiz', 'Kuchsiz', "O'rtacha", 'Kuchli'];

        for (let i = 0; i < strength; i++) {
            strengthBars[i].classList.add(levels[strength]);
        }

        strengthText.textContent = password.length > 0 ? texts[strength] : '';
        strengthText.className = `strength-text ${levels[strength]}`;
    });
}

// Get Firebase error message in Uzbek
function getErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'Bu email allaqachon ro\'yxatdan o\'tgan.',
        'auth/invalid-email': 'Noto\'g\'ri email manzil.',
        'auth/operation-not-allowed': 'Bu usul yoqilmagan.',
        'auth/weak-password': 'Parol juda kuchsiz. Kamida 6 ta belgi kiriting.',
        'auth/user-disabled': 'Bu hisob bloklangan.',
        'auth/user-not-found': 'Bu email bilan hisob topilmadi.',
        'auth/wrong-password': 'Noto\'g\'ri parol.',
        'auth/too-many-requests': 'Juda ko\'p urinish. Biroz kutib turing.',
        'auth/popup-closed-by-user': 'Kirish oynasi yopildi.',
        'auth/popup-blocked': 'Qalqib chiquvchi oyna bloklandi. Iltimos, ruxsat bering.',
        'auth/network-request-failed': 'Internet aloqasi yo\'q.',
        'auth/invalid-credential': 'Email yoki parol noto\'g\'ri.',
    };

    return messages[errorCode] || 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.';
}

// ============================================
// REGISTRATION
// ============================================

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms');

        // Validation
        if (!firstName || !lastName) {
            showMessage('error', 'Ism va familiyangizni kiriting.');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('error', 'Parollar mos kelmaydi.');
            return;
        }

        if (password.length < 6) {
            showMessage('error', 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.');
            return;
        }

        if (agreeTerms && !agreeTerms.checked) {
            showMessage('error', 'Foydalanish shartlariga rozilik bildiring.');
            return;
        }

        setLoading('registerBtn', true);

        try {
            // Create user
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);

            // Update profile with display name
            await userCredential.user.updateProfile({
                displayName: `${firstName} ${lastName}`
            });

            showMessage('success', 'Hisob muvaffaqiyatli yaratildi! Dashboard ga yo\'naltirilmoqda...');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            showMessage('error', getErrorMessage(error.code));
        } finally {
            setLoading('registerBtn', false);
        }
    });
}

// ============================================
// LOGIN
// ============================================

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showMessage('error', 'Email va parolni kiriting.');
            return;
        }

        setLoading('loginBtn', true);

        try {
            // Set persistence based on "remember me"
            const rememberMe = document.getElementById('rememberMe');
            const persistence = rememberMe && rememberMe.checked
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION;

            await auth.setPersistence(persistence);
            await auth.signInWithEmailAndPassword(email, password);

            showMessage('success', 'Muvaffaqiyatli kirildi! Dashboard ga yo\'naltirilmoqda...');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            showMessage('error', getErrorMessage(error.code));
        } finally {
            setLoading('loginBtn', false);
        }
    });
}

// ============================================
// GOOGLE SIGN-IN
// ============================================

function setupGoogleLogin() {
    const googleBtns = document.querySelectorAll('#googleLoginBtn');

    googleBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({
                    prompt: 'select_account'
                });

                const result = await auth.signInWithPopup(provider);

                showMessage('success', `Xush kelibsiz, ${result.user.displayName}!`);

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } catch (error) {
                console.error('Google login error:', error);
                if (error.code !== 'auth/popup-closed-by-user') {
                    showMessage('error', getErrorMessage(error.code));
                }
            }
        });
    });
}

// ============================================
// GITHUB SIGN-IN
// ============================================

function setupGithubLogin() {
    const githubBtns = document.querySelectorAll('#githubLoginBtn');

    githubBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const provider = new firebase.auth.GithubAuthProvider();
                const result = await auth.signInWithPopup(provider);

                showMessage('success', `Xush kelibsiz, ${result.user.displayName || result.user.email}!`);

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } catch (error) {
                console.error('GitHub login error:', error);
                if (error.code !== 'auth/popup-closed-by-user') {
                    showMessage('error', getErrorMessage(error.code));
                }
            }
        });
    });
}

// ============================================
// AUTH STATE MANAGEMENT
// ============================================

// Check if user is logged in (for protected pages)
function checkAuth(redirectToLogin = true) {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else if (redirectToLogin) {
                window.location.href = 'login.html';
            } else {
                resolve(null);
            }
        });
    });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Setup password toggle
    setupPasswordToggle();

    // Setup password strength (register page only)
    setupPasswordStrength();

    // Setup forms
    setupRegisterForm();
    setupLoginForm();

    // Setup social logins
    setupGoogleLogin();
    setupGithubLogin();

    // If on login/register page and already logged in, redirect to dashboard
    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('register');
    if (isAuthPage) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                window.location.href = 'dashboard.html';
            }
        });
    }
});

const themeSwitch = document.getElementById('theme-switch');
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const themeStorageKey = 'theme';

const applyTheme = (theme) => {
    document.body.classList.toggle('darkmode', theme === 'dark');
    document.body.classList.toggle('lightmode', theme === 'light');
};

const getStoredTheme = () => {
    return localStorage.getItem(themeStorageKey);
};

const getPreferredTheme = () => {
    return getStoredTheme() || (userPrefersDark.matches ? 'dark' : 'light');
};

applyTheme(getPreferredTheme());

userPrefersDark.addEventListener('change', () => {
    if (!getStoredTheme()) {
        applyTheme(getPreferredTheme());
    }
});

themeSwitch.addEventListener('click', () => {
    var nextTheme = document.body.classList.contains('darkmode') ? 'light' : 'dark';

    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
});

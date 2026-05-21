let darkmode = localStorage.getItem('darkmode');
const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const themeSwitch = document.getElementById('theme-switch');

const enableDarkMode = () => {
    document.body.classList.replace('lightmode', 'darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkMode = () => {
    document.body.classList.replace('darkmode', 'lightmode');
    localStorage.setItem('darkmode', null);
}

if (!userPrefersDark){
    console.log("User prefers light mode");
    disableDarkMode();
}

if (darkmode === "active") {
    console.log("Dark mode is active");
    enableDarkMode();
}

themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    console.log("Toggling dark mode. Current state: " + darkmode);
    darkmode !== "active" ? enableDarkMode() : disableDarkMode();
});


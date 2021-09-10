const navslide = () => {
    const burger = document.querySelector(".burger-menu");
    const nav = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-item");

    
    burger.addEventListener("click", () => {
        // toggle nav
        nav.classList.toggle('nav-active');

        // animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            }else{
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });

        // burger animation
        burger.classList.toggle('toggle');
    });



}
navslide();

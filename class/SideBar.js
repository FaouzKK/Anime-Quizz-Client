export class SideBar {

    constructor() {

        const sidebar = document.querySelector("#navbtn > i");

        sidebar.addEventListener('click', evt => {
            
            evt.stopPropagation();
            const i = evt.currentTarget;
            console.log(i);
            const side = document.querySelector("#navbtn>.sidebar-option");
            if (i.classList.contains('bi-list')) {

                side.classList.add("sidebar-option-active");
                i.className = "bi bi-x-lg text-light";

            } else {

                side.classList.remove("sidebar-option-active");
                i.className = "bi bi-list";

            }
        })
    }
}
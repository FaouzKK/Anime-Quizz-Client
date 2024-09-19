import { SideBar } from "../class/SideBar"
import { verifUserIsRegistered } from "../function";
import '../css/style.css'
import '../css/profile.css';

document.addEventListener('DOMContentLoaded', async evt => {

    new SideBar();

    await verifUserIsRegistered();

    document.querySelector("#edit-name-btn")
        .addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();

            document.querySelector('#edit-name-option')
                .classList.toggle('hide');
        })
})
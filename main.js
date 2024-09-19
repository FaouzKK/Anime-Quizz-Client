import { SideBar } from "./class/SideBar";
import { showDialogInformation, verifUserIsRegistered } from "./function";
import "./css/style.css";
import { fetchUrl } from "./config";

document.addEventListener('DOMContentLoaded', async evt => {

    new SideBar();

    await verifUserIsRegistered() ;

    const data = await fetch(fetchUrl + "/allquizz");

    if (data.status == 200) {

        const jsonQuizz = await data.json();

        //console.log(jsonQuizz) ;
        Object.keys(jsonQuizz).forEach(quizz => {

            //console.log(jsonQuizz[quizz]);

            const qz = jsonQuizz[quizz];

            const div = document.createElement('div');

            div.className = 'quizzitem';

            div.innerHTML = `<div class="quizzimagediv">
            <img src="${qz.img}" alt="image de quizz">
          </div>
          <div class="quizzdescdiv my-3">
            <ul>
              <li><span class="fw-bold">${qz.animeName}</span></li>
              <li>Difficulte : <span class="fw-bold">${qz.gameDifficulty}</span></li>
            </ul>
            <div class="d-flex justify-content-evenly align-items-center">
              <a href="/startquizz.html?id=${quizz}" class="btn btn-primary">Jouer</a>
              <a href="#" class="btn btn-secondary" id="share-${quizz}"><i class="bi bi-share-fill"></i></a>
            </div>
          </div>`

            const quizzcard = document.querySelector('#quizzcard');

            quizzcard.append(div);

            const share = document.querySelector(`#share-${quizz}`);

            share.addEventListener('click', evt => {

                evt.preventDefault();
                evt.stopPropagation();

                //console.log(evt.currentTarget) ;
                navigator.clipboard.writeText(window.location.href + `/startquizz.html?id=${quizz}`) ;

                showDialogInformation('Le lien du quizz a ete copier dans votre presse-papier') ;
            })
        })
    } else {

        console.log('not working');
    }
})
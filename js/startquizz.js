import { fetchUrl, quizzlenght } from '../config';
import '../css/startquizz.css';
import { showDialogInformation, verifUserIsRegistered } from '../function';

let curentUrl = window.location;

const url = new URL(curentUrl);
//console.log(url) ;
let params = new URLSearchParams(url.searchParams);

//console.log(params) ;

const quizzId = params.get('id');

document.addEventListener('DOMContentLoaded', async evt => {

    await verifUserIsRegistered();


    const content = document.querySelector('.content')

    if (quizzId) {
        // console.log(quizzId);
        const result = await fetch(fetchUrl + '/getquizz?id=' + quizzId)
            .catch((error) => {
                console.error(error);
                document.title = `Erreur du serveur`;
                content.innerHTML = `<div class="d-flex justify-content-center align-items-center mb-3"><img src="tired_luffy.png" alt="luffy" height="150"></div>
                <div class="text-center h1 fw-bold">OUPS... Erreur du serveur , veillez me signaler si sa persiste ?</div>
                <div class="mt-5 text-center"><a href="/index.html" class="btn btn-primary">Revenir a la page d'acceuil</a></div>`
            })
        if (result.status == 200) {

            const jsonData = await result.json();

            //console.log(jsonData);
            document.title = `Jouez au quizz ${jsonData.animeName}`;

            content.innerHTML = ` <div class="d-flex justify-content-center align-items-center"><div id="quizzimagediv" class="d-flex justify-content-center align-items-center quizzimagediv"><img src="${jsonData.img}" alt="image de ${jsonData.animeName}"></div></div>
             <ul>
                <li class='text-center'><span class="fw-bold  h2">${jsonData.animeName}</span></li>
                <li><span class="fw-bold">Difficulte : </span>${jsonData.gameDifficulty}</li>
                <li><span class="fw-bold">Regle</span> : <br>
                  <p>
                      Vous aurez une serie de 20 questions avec 10 secondes de comptes a rebours par questions. Votre score final dependra de vos bonnes reponses et du temps mis pour repondre a chacune de celle-ci
                  </p></li>
              </ul>
            <div class='text-center'><a href="#" class="btn btn-success fw-bold" id="startbtn">START</a></div>`

            document.querySelector('#startbtn')
                .addEventListener('click', evt => {

                    evt.stopPropagation();
                    evt.preventDefault();
                    //console.log(jsonData.qr)
                    startQuizz(jsonData.qr, 0);
                })

        } else {

            document.title = `Erreur du serveur`;
            content.innerHTML = `<div class="d-flex justify-content-center align-items-center mb-3"><img src="tired_luffy.png" alt="luffy" height="150"></div>
                <div class="text-center h1 fw-bold">OUPS... Erreur du serveur , veillez me signaler si sa persiste ?</div>
                <div class="mt-5 text-center"><a href="/index.html" class="btn btn-primary">Revenir a la page d'acceuil</a></div>`
        }

    } else {

        // console.log('Aucun quizz trouver')
        document.title = `Erreur de page`;
        content.innerHTML = `<div class="d-flex justify-content-center align-items-center mb-3"><img src="tired_luffy.png" alt="luffy" height="150"></div>
                <div class="text-center h1 fw-bold">OUPS... Vous etes perdu(e) ?</div>
                <div class="mt-5 text-center"><a href="/index.html" class="btn btn-primary">Revenir a la page d'acceuil</a></div>`
    }
})


const usersReponse = [];

/**
 * @param {Object[]} qr
 * @param {number} index  
 */
function startQuizz(qr, index) {
    if (index + 1 > quizzlenght) { return startCheick(usersReponse, qr) };
    let question = qr[index];

    const content = document.querySelector('.content');

    content.innerHTML = `<div class="d-flex justify-content-center align-items-center my-3"><span id="countdown-${index}" class="fw-bold h1 text-success">10</span></div>
            <span class="fw-bold h2">Q${index + 1} :</span>
            <div class="text-center" ><span class="fw-bold h2">${question.question}</span></div>
             <form action="" class="form m-5">
                  <div class="form-group d-flex justify-content-center align-items-center">
                       <textarea name="response" id="response" placeholder="La reponse ici" class="form-textarea"></textarea>
                  </div>
                  <div class="text-center my-3">
                        <button class="btn btn-primary" type="submit" id="confirm">Envoyez</button>
                  </div>
             </form>`;


    const interv = setInterval(() => {

        let count = document.querySelector(`#countdown-${index}`);

        if (!count) return console.log('non trouver');

        let chiffre = parseInt(count.innerText);
        if (chiffre != 0) {
            if (chiffre === 5) { count.className = `fw-bold h1 text-danger` }
            count.innerText = chiffre - 1
        } else {
            clearInterval(interv);
            usersReponse[index] == "aucune reponse"
            console.log('fin du compte a rebours')
            content.innerHTML = `<span class="fw-bold text-primary mx-5">NEXT...</span>`
            new Promise((resolve, reject) => {

                setTimeout(() => {

                    resolve();
                }, 2000)
            })
                .then(() => {

                    startQuizz(qr, index + 1);
                })
        }
    }, 1000)

    document.querySelector('#confirm')
        .addEventListener('click', evt => {

            evt.stopPropagation();
            evt.preventDefault();
            clearInterval(interv);
            const response = document.querySelector('#response');

            usersReponse[index] = response.value;
            //console.log(usersReponse);
            content.innerHTML = `<span class="fw-bold text-primary mx-5">next...</span>`
            new Promise((resolve, reject) => {

                setTimeout(() => {

                    resolve();
                }, 2000)
            })
                .then(() => {

                    startQuizz(qr, index + 1);
                })

        });


}
/**
 * 
 * @param {string[]} reponse 
 * @param {Object[]} question 
 */

function startCheick(reponse, question) {
    // debugger
    const content = document.querySelector('.content');

    content.innerHTML = `<div class="text-center my-4"><span class="text-primary fw-bold h1"> Analyse de vos reponse</span></div>`
    let scorefinal = 0;
    reponse.forEach((element, index) => {

        const qr = question[index];
        let state = false;
        for (let i = 0; i < qr.reponse.length; i++) {

            if (element.toLocaleLowerCase().includes(qr.reponse[i])) {

                state = true;
                break;
            }


        }
        if (state) {

            content.innerHTML += `<div class="my-2">
                   <div class="fw-bold">Q${index + 1}: ${qr.question}</div>
                   <div><span class="fw-bold">Votre reponse :</span><span class="text-success">${element}</span> <i class="bi bi-check2 text-success fw-bold"></i></div>
              </div>`
            scorefinal += (1 / quizzlenght) * 100;
        } else {

            content.innerHTML += `<div class="my-2">
                   <div class="fw-bold">Q${index + 1} : ${qr.question}</div>
                   <div><span class="fw-bold">Votre reponse :</span> <span class="text-danger">${element}</span> <i class="bi bi-x-lg text-danger fw-bold"></i></div>
              </div>`
        }

    });

    content.innerHTML += `<div class="text-center my-4"><span class="text-primary fw-bold"> Vous avez Totaliser un score de ${scorefinal}%</span></div>
    <div id ="endGame" class="my-3 d-flex justify-content-evenly align-items-center gap-5"><a href="/startquizz.html?id=${quizzId}" class="btn btn-danger disabled">Reessayer</a>
            <a href="/index.html" class="btn btn-success disabled">Page d'acceuil</a></div>
            </div>`
    let username = localStorage.getItem('userId');
    fetch(fetchUrl + `/savedata?id=${username}&score=${scorefinal}&qid=${quizzId}`)
        .then((result) => {

            if (result.status == 200) {

                result.json()
                    .then((data) => {
                        if (data.issave) {

                            showDialogInformation('votre score a ete sauvegader avec succes');
                            const btns = document.querySelectorAll("#endGame a")
                            Array.from(btns).forEach(btn => {

                                    btn.classList.remove('disabled') ;
                            })
                        }
                    })
            }
        });
}
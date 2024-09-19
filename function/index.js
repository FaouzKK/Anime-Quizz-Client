import { fetchUrl } from "../config";

/**
 * 
 * @param {string} text 
 */
export function showDialogInformation(text) {

    const dialog = document.createElement('dialog');

    dialog.innerHTML = `<div class="d-flex align-items-center flex-column gap-4 m-3">
        <div><img src="./joy.png" alt="small_luffy" height="100"></div>
        <div class="text-center fw-bold">${text}</div>
        <div><a href="#" class="btn btn-primary" id="closeDialogBtn">D'accord</a></div>
    </div>` ;

    document.body.appendChild(dialog);

    dialog.showModal();

    document.querySelector('#closeDialogBtn').addEventListener('click', evt => {

        evt.stopPropagation();
        evt.preventDefault();

        dialog.close();
        dialog.remove();
    })

};


export async function verifUserIsRegistered() {

    const user = localStorage.getItem("userId");

    if (user) {

        const result = await fetch(fetchUrl + "/login?username=" + user);

        if (result.status == 200) {

            let userData = await result.json();

            if (userData.isregistered) return console.log('userIsRegistered');

        }

    } else {

        createNewUser() ;
    }
}



async function createNewUser() {

    const dialog = document.createElement('dialog');

    dialog.innerHTML = `<div class="d-flex  flex-column gap-4 m-3">
            <!-- <div><img src="./joy.png" alt="small_luffy" height="100"></div> -->
            <div class="text-center fw-bold">Vous etes nouveau! <br> Nous allons proceder a une sauvegarde d'identite
            </div>
            <form method="dialog" id="formDialog" class="form">
                <div class="form-group">
                    <label for="userid" class="form-label">Identifiant</label>
                    <input type="text" class="form-control" name="userid" id="userid">
                    <span class="form-text" id="showinfo">Votre identifiant est comme un mots de passe il servira de
                        vous identifier ou vous devrez l'entrez pour vous reconnectez si besoin ; gardez-le
                        soignesement</span>
                </div>
                <div class="form-group">
                    <label for="username" class="form-label">Votre nom d'utilisateur</label>
                    <input type="text" class="form-control" id="username" name="username" required>
                </div>
                <div class="my-3">
                    <button class="btn btn-primary disabled" type="submit" id="modalSubmit">S'inscrire</button>
                </div>
            </form>
        </div>`

    dialog.id = "registeredDialog" ;
    dialog.className = "col-md-6" ;

    document.body.appendChild(dialog) ;

    dialog.showModal() ;

    dialog.addEventListener('cancel',evt => {

        evt.preventDefault() ;
    })

    const input = document.querySelector("#userid");
    input.addEventListener('input', evt => {

        let value = input.value;

        const sendInfo = document.querySelector("#showinfo");
        const subbtn = document.querySelector("#modalSubmit");

        if (value.length < 6) {

            sendInfo.classList.add('text-danger');
            sendInfo.innerText = `Votre identifiant dois au moins faire 6 caracteres`
            if (!subbtn.classList.contains('disabled')) {

                subbtn.classList.add('disabled');
            }

        } else {

            sendInfo.classList.remove('text-danger');
            sendInfo.classList.add('text-success');
            sendInfo.innerText = `celui-ci est pas mal`

            subbtn.classList.remove('disabled');
            //sendInfo.disabled = false ;
        }
    })

    const form = document.querySelector("#formDialog")

    form.addEventListener('submit', async evt => {

        evt.preventDefault();
       const subbtn = document.querySelector("#modalSubmit");
        subbtn.classList.add('disabled');

        let span = document.querySelector('#dialogWarningBtn');

        if (!span) {
            const div = document.createElement('div');
            span = document.createElement('span');
            // Assigner les propriétés au span

            span.id = 'dialogWarningBtn';
            div.className = 'm-2 text-center';
            // Ajouter le span au div
            div.appendChild(span);

            // Ajouter le div au formulaire (assurez-vous que `form` est correctement sélectionné)
            form.prepend(div);
        }


        span.innerText = 'Création du compte en cours... Veuillez patienter';
        span.className = 'text-success';

        const formdata = new FormData(form);

        const result = await fetch(`${fetchUrl}/register?username=${formdata.get('userid')}&name=${formdata.get('username')}`);

        if (result.status == 200) {

            const data = await result.json();
            console.log(data);
            if (data.registered) {

                localStorage.setItem("userId", formdata.get("userid"));

                document.querySelector('#registeredDialog').close();
            } else {

                span.className = 'text-danger';
                span.innerText = data.message;
            }
        }

    })
}
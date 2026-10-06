// ==========================================
// FRANCE-DEUTSCHLAND GROUP
// MEMBRES
// ==========================================


// ==========================================
// CONFIGURATION
// ==========================================

const API_URL =
    "https://lichess.org/api/team/viraat-leader-chess-team-for-gm/users";


const UPDATE_INTERVAL = 30000;


// ==========================================
// RECHERCHE
// ==========================================

function setupMemberSearch() {

    const searchInput =
        document.getElementById("member-search");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    ".member-card"
                );


            cards.forEach(card => {

                const nameElement =
                    card.querySelector(
                        ".member-name"
                    );


                if (!nameElement) {
                    return;
                }


                const username =
                    nameElement
                        .textContent
                        .toLowerCase();


                if (
                    username.includes(search)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

}


// ==========================================
// CHARGER LES MEMBRES
// ==========================================

async function loadMembers() {

    const container =
        document.getElementById("members");


    const count =
        document.getElementById("member-count");


    const lastUpdate =
        document.getElementById("last-update");


    try {


        // ==================================
        // DEMANDE À LICHESS
        // ==================================

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        // ==================================
        // VÉRIFICATION
        // ==================================

        if (!response.ok) {

            throw new Error(
                "Erreur HTTP Lichess : " +
                response.status
            );

        }


        // ==================================
        // RÉCUPÉRATION DU JSONL
        // ==================================

        const text =
            await response.text();


        const members =
            text
                .split("\n")
                .filter(
                    line =>
                        line.trim() !== ""
                )
                .map(
                    line =>
                        JSON.parse(line)
                );


        // ==================================
        // AUCUN MEMBRE
        // ==================================

        if (members.length === 0) {

            count.textContent = "0";


            container.innerHTML = `

                <p>
                    Aucun membre trouvé.
                    /
                    Keine Mitglieder gefunden.
                </p>

            `;


            return;

        }


        // ==================================
        // NOMBRE DE MEMBRES
        // ==================================

        count.textContent =
            members.length;


        // ==================================
        // CRÉATION DU FRAGMENT
        // ==================================

        const fragment =
            document.createDocumentFragment();


        // ==================================
        // CRÉATION DES CARTES
        // ==================================

        members.forEach(
            member => {


                // ==========================
                // NOM D'UTILISATEUR
                // ==========================

                const username =
                    member.username ||
                    member.id ||
                    member.name;


                if (!username) {
                    return;
                }


                // ==========================
                // CARTE
                // ==========================

                const card =
                    document.createElement("a");


                card.className =
                    "member-card";


                // ==========================
                // LIEN LICHESS
                // ==========================

                card.href =
                    "https://lichess.org/@/" +
                    encodeURIComponent(
                        username
                    );


                card.target = "_blank";


                card.rel =
                    "noopener noreferrer";


                // ==========================
                // AVATAR
                // ==========================

                const avatar =
                    document.createElement("img");


                avatar.src =
                    "https://lichess1.org/" +
                    "user/" +
                    encodeURIComponent(
                        username
                    ) +
                    "/avatar";


                avatar.alt =
                    "Avatar de " +
                    username +
                    " / Avatar von " +
                    username;


                avatar.className =
                    "member-avatar";


                // ==========================
                // AVATAR PAR DÉFAUT
                // ==========================

                avatar.onerror =
                    function () {

                        this.onerror = null;


                        this.src =
                            "https://lichess1.org/" +
                            "assets/logo/" +
                            "lichess-favicon-512.png";

                    };


                // ==========================
                // NOM
                // ==========================

                const name =
                    document.createElement("span");


                name.className =
                    "member-name";


                name.textContent =
                    username;


                // ==========================
                // AJOUT À LA CARTE
                // ==========================

                card.appendChild(
                    avatar
                );


                card.appendChild(
                    name
                );


                fragment.appendChild(
                    card
                );

            }
        );


        // ==================================
        // AFFICHAGE
        // ==================================

        container.innerHTML = "";


        container.appendChild(
            fragment
        );


        // ==================================
        // DERNIÈRE MISE À JOUR
        // ==================================

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "fr-FR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        lastUpdate.textContent =
            "Dernière mise à jour : " +
            time +
            " / Letzte Aktualisierung: " +
            time;


        // ==================================
        // CONSOLE
        // ==================================

        console.log(
            "Membres FDG mis à jour :",
            members.length
        );


    } catch (error) {


        // ==================================
        // ERREUR
        // ==================================

        console.error(
            "Impossible de charger les membres :",
            error
        );


        count.textContent =
            "—";


        container.innerHTML = `

            <p>

                Impossible de mettre à jour
                les membres.
                /
                Mitglieder konnten nicht
                aktualisiert werden.

                <br><br>

                Veuillez réessayer plus tard.
                /
                Bitte später erneut versuchen.

            </p>

        `;


        lastUpdate.textContent =
            "Échec de la mise à jour / " +
            "Aktualisierung fehlgeschlagen";

    }

}


// ==========================================
// DÉMARRAGE
// ==========================================

loadMembers();

setupMemberSearch();


// ==========================================
// MISE À JOUR AUTOMATIQUE
// ==========================================

setInterval(
    loadMembers,
    UPDATE_INTERVAL
);

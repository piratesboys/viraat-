// ==========================================
// VIRAAT LEADER CHESS TEAM FOR GM
// MEMBERS
// ==========================================


// ==========================================
// CONFIGURATION
// ==========================================

const API_URL =
    "https://lichess.org/api/team/viraat-leader-chess-team-for-gm/users";


const UPDATE_INTERVAL = 30000;


// ==========================================
// MEMBER SEARCH
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
// LOAD MEMBERS
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
        // REQUEST TO LICHESS
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
        // CHECK RESPONSE
        // ==================================

        if (!response.ok) {

            throw new Error(
                "Lichess API error: " +
                response.status
            );

        }


        // ==================================
        // GET JSONL DATA
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
        // NO MEMBERS
        // ==================================

        if (members.length === 0) {

            count.textContent = "0";


            container.innerHTML = `

                <p>
                    No members found.
                </p>

            `;


            return;

        }


        // ==================================
        // MEMBER COUNT
        // ==================================

        count.textContent =
            members.length;


        // ==================================
        // CREATE FRAGMENT
        // ==================================

        const fragment =
            document.createDocumentFragment();


        // ==================================
        // CREATE MEMBER CARDS
        // ==================================

        members.forEach(
            member => {


                // ==========================
                // USERNAME
                // ==========================

                const username =
                    member.username ||
                    member.id ||
                    member.name;


                if (!username) {
                    return;
                }


                // ==========================
                // CARD
                // ==========================

                const card =
                    document.createElement("a");


                card.className =
                    "member-card";


                // ==========================
                // LICHESS PROFILE LINK
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
                    "Avatar of " +
                    username;


                avatar.className =
                    "member-avatar";


                // ==========================
                // DEFAULT AVATAR
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
                // USERNAME
                // ==========================

                const name =
                    document.createElement("span");


                name.className =
                    "member-name";


                name.textContent =
                    username;


                // ==========================
                // ADD ELEMENTS TO CARD
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
        // DISPLAY MEMBERS
        // ==================================

        container.innerHTML = "";


        container.appendChild(
            fragment
        );


        // ==================================
        // LAST UPDATE
        // ==================================

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        lastUpdate.textContent =
            "Last updated: " +
            time;


        // ==================================
        // CONSOLE
        // ==================================

        console.log(
            "Viraat Chess Team members updated:",
            members.length
        );


    } catch (error) {


        // ==================================
        // ERROR
        // ==================================

        console.error(
            "Unable to load team members:",
            error
        );


        count.textContent =
            "—";


        container.innerHTML = `

            <p>

                Unable to load team members.

                <br><br>

                Please try again later.

            </p>

        `;


        lastUpdate.textContent =
            "Update failed";

    }

}


// ==========================================
// START
// ==========================================

loadMembers();

setupMemberSearch();


// ==========================================
// AUTOMATIC UPDATE
// ==========================================

setInterval(
    loadMembers,
    UPDATE_INTERVAL
);

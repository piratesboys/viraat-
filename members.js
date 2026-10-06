// ==========================================
// VIRAAT LEADER CHESS TEAM FOR GM
// MEMBERS
// ==========================================


// ==========================================
// CONFIGURATION
// ==========================================

const TEAM_ID =
    "viraat-leader-chess-team-for-gm";

const API_URL =
    `https://lichess.org/api/team/${TEAM_ID}/users`;


// ==========================================
// SEARCH
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

                const name =
                    card.querySelector(
                        ".member-name"
                    );

                if (!name) {
                    return;
                }

                const username =
                    name.textContent
                        .toLowerCase();

                if (username.includes(search)) {

                    card.style.display = "flex";

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


    if (!container || !count || !lastUpdate) {

        console.error(
            "HTML elements missing."
        );

        return;
    }


    try {

        container.innerHTML = `
            <p class="loading">
                Loading team members...
            </p>
        `;


        console.log(
            "Requesting:",
            API_URL
        );


        // ==================================
        // REQUEST
        // ==================================

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/x-ndjson"
                    },
                    cache: "no-store"
                }
            );


        console.log(
            "HTTP status:",
            response.status
        );


        // ==================================
        // CHECK RESPONSE
        // ==================================

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // ==================================
        // READ RESPONSE
        // ==================================

        const text =
            await response.text();


        console.log(
            "Lichess response:",
            text
        );


        if (!text.trim()) {

            throw new Error(
                "Lichess returned an empty response."
            );

        }


        // ==================================
        // PARSE MEMBERS
        // ==================================

        const members =
            text
                .trim()
                .split(/\r?\n/)
                .filter(
                    line =>
                        line.trim() !== ""
                )
                .map(
                    line =>
                        JSON.parse(line)
                );


        console.log(
            "Members received:",
            members
        );


        // ==================================
        // COUNT
        // ==================================

        count.textContent =
            members.length;


        // ==================================
        // CREATE CARDS
        // ==================================

        const fragment =
            document.createDocumentFragment();


        members.forEach(member => {

            const username =
                member.username ||
                member.id ||
                member.name;


            if (!username) {
                return;
            }


            const card =
                document.createElement("a");


            card.className =
                "member-card";


            card.href =
                `https://lichess.org/@/${encodeURIComponent(username)}`;


            card.target =
                "_blank";


            card.rel =
                "noopener noreferrer";


            // ==============================
            // AVATAR
            // ==============================

            const avatar =
                document.createElement("img");


            avatar.className =
                "member-avatar";


            avatar.src =
                `https://lichess1.org/user/${encodeURIComponent(username)}/avatar`;


            avatar.alt =
                `Avatar of ${username}`;


            avatar.loading =
                "lazy";


            avatar.onerror =
                function () {

                    this.onerror = null;

                    this.src =
                        "https://lichess1.org/assets/logo/lichess-favicon-512.png";

                };


            // ==============================
            // NAME
            // ==============================

            const name =
                document.createElement("span");


            name.className =
                "member-name";


            name.textContent =
                username;


            // ==============================
            // CARD
            // ==============================

            card.appendChild(
                avatar
            );

            card.appendChild(
                name
            );

            fragment.appendChild(
                card
            );

        });


        container.innerHTML = "";

        container.appendChild(
            fragment
        );


        // ==================================
        // LAST UPDATE
        // ==================================

        const time =
            new Date().toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        lastUpdate.textContent =
            `Last updated: ${time}`;


    }

    catch (error) {

        console.error(
            "MEMBERS ERROR:",
            error
        );


        count.textContent =
            "ERROR";


        container.innerHTML = `

            <p id="error">

                Unable to load team members.

                <br><br>

                <strong>
                    Error:
                </strong>

                ${error.message}

            </p>

        `;


        lastUpdate.textContent =
            "Update failed.";

    }

}


// ==========================================
// START
// ==========================================

setupMemberSearch();

loadMembers();

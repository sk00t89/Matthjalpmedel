const takInput = document.getElementById("takmått");
const vVInput = document.getElementById("vänster-vägg");
const hVInput = document.getElementById("höger-vägg");
const bInput = document.getElementById("botten");
const outputList = document.getElementById("måttLista");
const generateBtn = document.getElementById("generera-btn");
const clearBtn = document.getElementById("rensa-btn");
const removeItem = document.getElementById("remove-btn");
const checkbox = document.getElementsByClassName("kapad-checkbox");
const select = document.getElementById("select-menu");
const glasTyp10 = document.getElementById("10/12-glas");
const glasTyp16 = document.getElementById("16-glas");
const glasTyp20 = document.getElementById("20-glas");
const glasTypIso = document.getElementById("40-glas");
const optionIso = document.getElementById("iso-glas");
const optionList = document.getElementById("select-menu")

let takprofil = 40;
let väggprofil = 40;
let mätData = JSON.parse(localStorage.getItem("data")) || [];
let kapMått = [...mätData];

glasTypIso.addEventListener("change", e => {
    if (e.target.checked) {
        optionList.value = optionIso.value;
        console.log("iso glas ibockat");
        console.log("takprofil:", takprofil, "väggprofil:", väggprofil);
    }
})



let wakeLock;

async function keepScreenOn() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake lock aktivt");
    } catch (err) {
        console.error("Wake lock misslyckades:", err);
    }
}

// Kör funktionen när sidan laddas
document.addEventListener("DOMContentLoaded", keepScreenOn);

// Återaktivera Wake Lock om sidan blir synlig igen (t.ex. om användaren byter flik)
document.addEventListener("visibilitychange", async () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
        await keepScreenOn();
    }
});



const getCheckboxValue = () => {
    let checkboxValue = [];
    document.querySelectorAll(".checkbox-glas").forEach(checkbox => {
        if (checkbox.checked) {
            checkboxValue.push(checkbox.value);
        }
    });
    return checkboxValue.toString();
};




const updatemåttLista = () => {
    const lista = document.getElementById("måttLista");

    // Hämta tidigare markerade checkboxar
    const checkedStates = {};
    document.querySelectorAll(".checkbox").forEach(checkbox => {
        checkedStates[checkbox.id] = checkbox.checked;
    });

    lista.innerHTML = ""; // Rensa listan innan uppdatering

    kapMått.forEach((obj, index) => {
        const li = document.createElement("li");
        li.setAttribute("data-index", obj.id);

        li.innerHTML = `
            <div class="left-section">
                <input type="checkbox" class="checkbox" id="checkBox-${obj.id}">
                <p class="index">${index + 1}</p>
            </div>

            <div class="mått-container">
                ${obj.tak ? `<p class="tak">Tak: <span class="mått">${obj.tak}</span></p>` : ""}
                ${obj.vVägg ? `<p class="vVägg">Vänster: <span class="mått">${obj.vVägg}</span></p>` : ""}
                ${obj.hVägg ? `<p class="hVägg">Höger: <span class="mått">${obj.hVägg}</span></p>` : ""}
                ${obj.botten ? `<p class="botten">Botten: <span class="mått">${obj.botten}</span></p>` : ""}
            </div>

            <div class="right-section">
                <button class="remove-btn">Ta bort</button>
                <div class="glas-val-container">
                    <p class="glas-val">Profil: <strong>${obj.glastyp || "Ej valt"}</strong></p>
                </div>
            </div>
        `;

        // Lägg till eventlyssnare för borttagningsknapp
        li.querySelector(".remove-btn").addEventListener("click", () => deleteLi(li));

        lista.appendChild(li);

        // Återställ checkbox-status baserat på ID istället för index
        const checkbox = li.querySelector(".checkbox");
        checkbox.checked = checkedStates[`checkBox-${obj.id}`] || false;
        if (checkbox.checked) li.classList.add("kapad");

        // Lägg till eventlistener för checkbox
        checkbox.addEventListener("change", () => {
            li.classList.toggle("kapad", checkbox.checked);
        });
    });
};

// Ladda data från localStorage vid sidstart
kapMått = JSON.parse(localStorage.getItem("data")) || [];

// Uppdatera listan
updatemåttLista();



select.addEventListener("change", () => {
    switch (select.value) {
        case "30":
            takprofil = 30;
            väggprofil = 30;
            console.log("30 är vald")
            console.log("takprofil:", takprofil, "väggprofil:", väggprofil);
            break;
        case "45":
            takprofil = 45;
            väggprofil = 30;
            console.log("45 är vald")
            console.log("takprofil:", takprofil, "väggprofil:", väggprofil);
            break;
        case "40-iso":
            takprofil = 40;
            väggprofil = 30;
            console.log("takprofil:", takprofil, "väggprofil:", väggprofil);
            break;
        default:
            takprofil = 40;
            väggprofil = 40;
            console.log("default 40")
    }
});

const clearInputs = () => {
    takInput.value = "";
    vVInput.value = "";
    hVInput.value = "";
    bInput.value = "";
    glasTyp10.checked = false;
    glasTyp16.checked = false;
    glasTyp20.checked = false;
};


const deleteLi = (button) => {
    const li = button.closest("li"); // Hitta närmaste <li>
    const id = li.getAttribute("data-index"); // Hämta id från data-attributet

    // Hitta indexet på objektet som ska tas bort
    const indexToRemove = kapMått.findIndex(obj => obj.id.toString() === id.toString());

    if (indexToRemove !== -1) {
        kapMått.splice(indexToRemove, 1); // Tar bort objektet från den globala arrayen
    }

    localStorage.setItem("data", JSON.stringify(kapMått));

    // Ta bort endast den valda <li>-elementet från DOM
    li.remove();

    updatemåttLista();
};




const generateMeasure = (t, v, h, b) => {
    if (![t, v, h, b].some(val => val > 100)) {
        alert("Du har angivit felaktiga mått.");
        return;
    }

    const öppningsNummer = kapMått.length + 1;
    const kapMåttObject = {
        öppning: öppningsNummer,
        tak: t,
        botten: b,
        glastyp: getCheckboxValue() || "Ej valt", // Anropa funktionen här
        id: `${öppningsNummer}-${Date.now().toString()}`
    };

    if (v && t) kapMåttObject.vVägg = v - takprofil;
    if (h && t) kapMåttObject.hVägg = h - takprofil;
    if (b && t && !v && !h) kapMåttObject.botten = b;
    if (b && v) kapMåttObject.botten = b - väggprofil;
    if (b && h) kapMåttObject.botten = b - väggprofil;
    if (b && h && v) kapMåttObject.botten = b - väggprofil * 2;
    if (h) kapMåttObject.hVägg = h - takprofil;
    if (v) kapMåttObject.vVägg = v - takprofil;

    kapMått.push(kapMåttObject);
    localStorage.setItem("data", JSON.stringify(kapMått));

    updatemåttLista();
    clearInputs();
};





generateBtn.addEventListener("click", () => {
    generateMeasure(parseInt(takInput.value), parseInt(vVInput.value), parseInt(hVInput.value), parseInt(bInput.value));

})
clearBtn.addEventListener("click", () => {

    if(window.confirm("Ta bort alla mått?")) {
        clearInputs();
        kapMått = []; // Skapa en ny tom array istället för att ändra längden
        localStorage.removeItem("data");
        updatemåttLista(); // Uppdatera listan så att den blir tom
    } else return;


});


let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Förhindra den automatiska prompten
    e.preventDefault();
    deferredPrompt = e;

    // Gör installationsknappen synlig
    const installButton = document.getElementById('installBtn');
    installButton.style.display = 'block';

    // Lägg till eventlistener på knappen
    installButton.addEventListener('click', () => {
        // Visa installationsprompten när knappen klickas
        deferredPrompt.prompt();

        // Vänta på användarens val
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Användaren installerade appen');
            } else {
                console.log('Användaren avböjde installationen');
            }
            deferredPrompt = null;
        });
    });
});

// Dölj knappen om appen redan är installerad
if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('installBtn').style.display = 'none';
}


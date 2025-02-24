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


const getCheckboxValue = () => {
    let checkboxValue = [];
    document.querySelectorAll(".checkbox-glas").forEach(checkbox => {
        if (checkbox.checked) {
            checkboxValue.push(checkbox.value);
        }
    });
    return checkboxValue.toString();
};





let takprofil = 40;
let väggprofil = 40;
const mätData = JSON.parse(localStorage.getItem("data")) || [];
let kapMått = [...mätData];

const updatemåttLista = () => {
    const lista = document.getElementById("måttLista");


    kapMått.forEach((obj, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="left-section">
                <input type="checkbox" class="checkbox" id="checkBox-${index}">
                <p class="index">${index + 1}</p>
            </div>

            <div class="mått-container">
                ${obj.tak ? `<p class="tak">Tak: <span class="mått">${obj.tak}</span></p>` : ""}
                ${obj.vVägg ? `<p class="vVägg">Vänster: <span class="mått">${obj.vVägg}</span></p>` : ""}
                ${obj.hVägg ? `<p class="hVägg">Höger: <span class="mått">${obj.hVägg}</span></p>` : ""}
                ${obj.botten ? `<p class="botten">Botten: <span class="mått">${obj.botten}</span></p>` : ""}
            </div>

            <div class="right-section">
                <button class="remove-btn" data-index="${index}">Ta bort</button>
                <div class="glas-val-container">
                    <p class="glas-val">${getCheckboxValue()}</p>
                </div>
            </div>
        `;
        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", () => {
            li.classList.toggle("kapad", checkbox.checked);
        });

        lista.appendChild(li);
    });
};

updatemåttLista();


select.addEventListener("change", () => {
    switch (select.value) {
        case "30":
            takprofil = 30;
            väggprofil = 30;
            console.log("30 är vald")
            break;
        case "45":
            takprofil = 45;
            väggprofil = 30;
            console.log("45 är vald")
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


const generateMeasure = (t, v, h, b) => {
    if (![t, v, h, b].some(val => val > 100)) {
        alert("Du har angivit felaktiga mått.");
        return;
    }

    const öppningsNummer = kapMått.length + 1;
    const kapMåttObject = { öppning: öppningsNummer, tak: t, botten: b };

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
    takInput.value = "";
    vVInput.value = "";
    hVInput.value = "";
    bInput.value = "";
    kapMått.length = 0;
    localStorage.removeItem("data");
    kapMått = [];
    updatemåttLista();
});

outputList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const index = Array.from(outputList.children).indexOf(e.target.closest("li"));
        kapMått.splice(index, 1);
        localStorage.setItem("data", JSON.stringify(kapMått));
        updatemåttLista();
    }

})

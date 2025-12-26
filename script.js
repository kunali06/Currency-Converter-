const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".convert-btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap");
const darkBtn = document.querySelector(".dark-toggle");

/* Populate dropdowns */
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.value = currCode;
        option.innerText = currCode;

        if (select.name === "from" && currCode === "USD") option.selected = true;
        if (select.name === "to" && currCode === "INR") option.selected = true;

        select.append(option);
    }

    select.addEventListener("change", (e) => updateFlag(e.target));
}

/* Update flag */
function updateFlag(element) {
    let code = element.value;
    let country = countryList[code];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${country}/flat/64.png`;
}

/* Fetch exchange rate */
async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amountVal = amount.value || 1;

    try {
        const res = await fetch(`${BASE_URL}/${fromCurr.value}`);
        const data = await res.json();

        let rate = data.rates[toCurr.value];
        let result = (amountVal * rate).toFixed(2);

        msg.innerText = `${amountVal} ${fromCurr.value} = ${result} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Error fetching data";
    }
}

/* Convert */
btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});

/* Swap */
swapBtn.addEventListener("click", () => {
    [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
});

/* Dark Mode */
darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* On load */
window.addEventListener("load", updateExchangeRate);

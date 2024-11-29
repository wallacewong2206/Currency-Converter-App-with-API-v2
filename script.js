const apiKey = "cur_live_oYXFuLUTihSJlMDTrwEkAerSJNkbIHrkYfny8ERN";
const apiURL = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;
const convertSound = new Audio('sounds/convert-sound.mp3');
const resetSound = new Audio('sounds/reset-sound.mp3');
const errorSound = new Audio('sounds/error-sound.mp3');

// Populate dropdowns with available currencies
async function populateCurrencies() {
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    if (data && data.data) {
      Object.keys(data.data).forEach((currencyCode) => {
        const optionFrom = document.createElement("option");
        optionFrom.value = currencyCode;
        optionFrom.textContent = currencyCode;

        const optionTo = document.createElement("option");
        optionTo.value = currencyCode;
        optionTo.textContent = currencyCode;

        fromCurrency.appendChild(optionFrom);
        toCurrency.appendChild(optionTo);
      });
    }
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
}

// Convert currency function
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;
  const resultDiv = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    playErrorSound();
    resultDiv.textContent = "Please enter a valid amount.";
    return;
  }

  if (fromCurrency === "#" || toCurrency === "#") {
    playErrorSound();
    resultDiv.textContent = "Please select valid currencies.";
    return;
  }

  try {
    const response = await fetch(`${apiURL}&currencies=${fromCurrency},${toCurrency}`);
    const data = await response.json();

    if (data && data.data) {
      const fromRate = data.data[fromCurrency].value;
      const toRate = data.data[toCurrency].value;
      const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);

      playConvertSound();
      resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } else {
      playErrorSound();
      resultDiv.textContent = "Error fetching exchange rates. Please try again.";
    }
  } catch (error) {
    console.error("Error:", error);
    playErrorSound();
    resultDiv.textContent = "Failed to fetch currency data.";
  }
}

// Reset form function
function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("fromCurrency").value = "#";
  document.getElementById("toCurrency").value = "#";
  document.getElementById("result").textContent = "";
  playResetSound();
}

// Sound effect functions
function playConvertSound() {
  convertSound.play();
}

function playResetSound() {
  resetSound.play();
}

function playErrorSound() {
  errorSound.play();
}

// Populate dropdowns when the page loads
window.onload = populateCurrencies;

// parameters used to get prices:
//      ids=name_of_the_coin
//      vs_currencies=name_of_the_base_currency
//      precision=number_of_decimal_places

const apiAddress = "https://api.coingecko.com/api/v3/simple/price?";
let crypto;
let fiat;
let rate;
let conversionType = true;

document.addEventListener("DOMContentLoaded", function() {

    const cryptoList = document.getElementById("cryptoList");
    const fiatList = document.getElementById("fiatList");

    cryptoList.onchange = function() {
        crypto = this.value;
    }

    fiatList.onchange = function() {
        fiat = this.value;
    }

    document.getElementById("swap").onclick = function() {
        const conversionInfo = document.getElementById("conversion-info");
        const convertFromElement = document.getElementById("convert-from");
        const convertToElement = document.getElementById("convert-to");
        document.getElementById("amount").value = 0;

        if (conversionType) {
            // convert from fiat to crypto
            conversionType = false;
            conversionInfo.innerHTML = "Fiat to Crypto";
            convertFromElement.appendChild(fiatList);
            convertToElement.appendChild(cryptoList);

        } else {
            // convert from crypto to fiat
            conversionType = true;
            conversionInfo.innerHTML = "Crypto to Fiat";
            convertFromElement.appendChild(cryptoList);
            convertToElement.appendChild(fiatList);
        }
    }

    document.getElementById("convert").onclick = async function() {
        crypto = cryptoList.value;
        fiat = fiatList.value;

        // grab tickers from crypto 
        const selectedCrypto = cryptoList.options[cryptoList.selectedIndex];
        const cryptoTicker = selectedCrypto.dataset.ticker;

        // grab ticker from fiat
        const selectedFiat = fiatList.options[fiatList.selectedIndex];
        const fiatTicker = selectedFiat.dataset.ticker;

        const response = await fetch(`${apiAddress}ids=${crypto}&vs_currencies=${fiat}&precision=3`);
        const data = await response.json();    
        rate = data[crypto][fiat];
    
        const amount = document.getElementById("amount").value;
        let conversion;

        if (conversionType) {
            conversion = amount * rate;
            document.querySelector("#display h3").innerHTML = `${amount} ${cryptoTicker} = ${conversion.toLocaleString(undefined)} ${fiatTicker}`;
            document.querySelector("h4").hidden = true;

        } else {
            conversion = amount * (1 / rate);
            document.querySelector("#display h3").innerHTML = `${amount} ${fiatTicker} = ${conversion.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5})} ${cryptoTicker}`;
            document.querySelector("h4").hidden = true;
        }
    }
});
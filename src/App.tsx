import React, { useState } from "react";
import "./App.css";

function App() {
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [bitcoinUsdPrice, setBitcoinUsdPrice] = useState(null);
  const [bitcoinEurPrice, setBitcoinEurPrice] = useState(null);

  const fetchAddressData = async () => {
    const addressResponse = await fetch(
      `https://blockstream.info/api/address/${address}`
    );
    const addressJson = await addressResponse.json();
    const bitcoinUsdPriceResponse = await fetch(
      `https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT`
    );
    const bitcoinUsdPriceJson = await bitcoinUsdPriceResponse.json();

    const bitcoinEurPriceResponse = await fetch(
      `https://api.binance.com/api/v3/avgPrice?symbol=BTCEUR`
    );
    const bitcoinEurPriceJson = await bitcoinEurPriceResponse.json();

    setAddressData(addressJson);
    setBitcoinUsdPrice(bitcoinUsdPriceJson.price);
    setBitcoinEurPrice(bitcoinEurPriceJson.price);
  };

  const fetchTransactionData = async () => {
    const transactionResponse = await fetch(
      `https://blockstream.info/api/tx/${address}`
    );
    const transactionJson = await transactionResponse.json();
    setTransactionData(transactionJson);
  };

  return (
    <div className="App">
      <h1>Bitcoin Explorer App</h1>
      <input
        type="text"
        placeholder="Enter Bitcoin Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={fetchAddressData}>Fetch Address Info</button>
      <button onClick={fetchTransactionData}>Fetch Transaction Info</button>

      {addressData && bitcoinUsdPrice && bitcoinEurPrice && (
        <div>
          <h2>Address Info</h2>
          <pre>
            {JSON.stringify(
              addressData.chain_stats.funded_txo_sum / 100000000,
              null,
              2
            )}{" "}
            BTC
          </pre>
          <pre>
            {JSON.stringify(
              (addressData.chain_stats.funded_txo_sum / 100000000) *
                bitcoinUsdPrice,
              null,
              2
            )}{" "}
            USD
          </pre>
          <pre>
            {JSON.stringify(
              (addressData.chain_stats.funded_txo_sum / 100000000) *
                bitcoinEurPrice,
              null,
              2
            )}{" "}
            EUR
          </pre>
        </div>
      )}

      {transactionData && (
        <div>
          <h2>Transaction Info</h2>
          <pre>
            {JSON.stringify(
              transactionData?.vin[0].prevout.value / 100000000,
              null,
              2
            )}{" "}
            BTC
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;

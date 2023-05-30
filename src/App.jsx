import { useState } from "react"
import './css/style.css'

function App() {

  const [coins, setCoins] = useState([]);
  const [invertConversion, setInvertConversion] = useState(false);
  const [feedback, setFeedback] = useState('Preencha os campos e clique em converter.');
  const coin = document.querySelector('#coins-value')
  const coinType = document.querySelector('#coins-options')
  const brl = document.querySelector('#brl-value')

  let getCoins = async () => {
    let BTC = await fetch(`https://www.mercadobitcoin.net/api/BTC/ticker/`).then(res=>res.json())
    let ETH = await fetch(`https://www.mercadobitcoin.net/api/ETH/ticker/`).then(res=>res.json())
    let DOGE = await fetch(`https://www.mercadobitcoin.net/api/DOGE/ticker/`).then(res=>res.json())
    let USDT = await fetch(`https://www.mercadobitcoin.net/api/USDT/ticker/`).then(res=>res.json())
    let ADA = await fetch(`https://www.mercadobitcoin.net/api/ADA/ticker/`).then(res=>res.json())

    //setCoins([BTC.ticker.last, ETH.ticker.last, DOGE.ticker.last, USDT.ticker.last, ADA.ticker.last])
    setCoins([
      parseFloat(BTC.ticker.last).toFixed(2),
      parseFloat(ETH.ticker.last).toFixed(2), 
      parseFloat(DOGE.ticker.last).toFixed(2), 
      parseFloat(USDT.ticker.last).toFixed(2), 
      parseFloat(ADA.ticker.last).toFixed(2),  
    ])
  }

  getCoins()

  const convert = () => {
    if(invertConversion === false){
      let result = (coins[coinType.value]*coin.value).toFixed(2)
      brl.value = result
      setFeedback(`${coin.value} ${coinType[coinType.value].textContent} equivale a R$ ${result}`)
    } else {
      let result = (brl.value/coins[coinType.value]).toFixed(5)
      coin.value = result
      setFeedback(`R$ ${brl.value} equivale a ${result} ${coinType[coinType.value].textContent}`)
    }
  }

  const invert = () => {
    if(invertConversion === false){
      setInvertConversion(true)
      document.querySelector('.row').style.setProperty("flex-direction", "row-reverse")
    } else {
      setInvertConversion(false)
      document.querySelector('.row').style.setProperty("flex-direction", "row")
    }
  }

  return (
    <>
      <main>

        <h1>Cripto Converter</h1>
        <p>Converta o valor das principais criptomoedas em reais</p>


        <hr className="hr-expand"/>

        <div className="row">

          <div>
            <input type="number" id="coins-value" placeholder="Criptomoeda"></input>
            <select name="coin" id="coins-options">
                <option value="0" className="BTC">Bitcoin</option>
                <option value="1" className="ETH">Ethereum</option>
                <option value="2" className="DOGE">Dogecoin</option>
                <option value="3" className="USDT">Tether</option>
                <option value="4" className="ADA">Cardano</option>
            </select>
          </div>
          
          <div className="invert-div">
            <button onClick={invert} id="invert-btn"><span className="material-icons-outlined">currency_exchange</span></button>
          </div>

          <div>
            <input type="number" id="brl-value" placeholder="R$"></input>
            <label>BRL</label>
          </div>

        </div>

        <button onClick={convert} id="convert-btn">Converter</button>

        <p>{feedback}</p>

      </main>
    </>
  )
}

export default App

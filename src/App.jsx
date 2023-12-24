import { useState } from "react"
import './css/style.css'

export default function App() {

  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [howManyCoins, setHowManyCoins] = useState('')
  const [howManyBRL, setHowManyBRL] = useState('')
  const [invertedConversion, setInvertedConversion] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [feedback, setFeedback] = useState('Preencha os campos e clique em converter.')

  const getCoinValue = async () => {
    try {
      if(error){setError(false)}
      const coinValue = await fetch(`https://www.mercadobitcoin.net/api/${selectedCoin}/ticker/`).then(res=>res.json())
      return coinValue.ticker.last
    } catch (error) {
      setError(true)
      setErrorMessage(`Erro ao consultar valor de criptomoeda: ${error}`)
    }
  }

  const convert = async () => {
    const selectedCoinValue = await getCoinValue()
    let result, resultInfo

    if(!invertedConversion){
      result = (howManyCoins*selectedCoinValue)
      resultInfo = `${howManyCoins} ${selectedCoin} equivale a ${result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      setHowManyBRL(result.toFixed(2))
    } else {
      result = (howManyBRL/selectedCoinValue)
      resultInfo = `${(selectedCoinValue*result).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} equivale a ${result.toFixed(5)} ${selectedCoin}`
      setHowManyCoins(result.toFixed(5))
    }

    setFeedback(error ? errorMessage : resultInfo)
  }

  const invertInputsPosition = () => {
    const reverse = !invertedConversion ? "-reverse" : ""
    const collumOrRow = window.innerWidth < 701 ? "column" : "row"
    document.querySelector('.row').style.setProperty("flex-direction", `${collumOrRow}${reverse}`)
  }

  const invertConversion = () => {
    if(invertedConversion === false){
      setInvertedConversion(true)
    } else {
      setInvertedConversion(false)
    }
    invertInputsPosition()
  }

  return (
    <main>

      <h1>Crypto Converter</h1>
      <p>Converta o valor das principais criptomoedas em reais</p>
      <hr className="hr-expand"/>

      <div className="row">

        <div>
          <input type="number" placeholder="Criptomoeda" value={howManyCoins} onChange={(e) => {setHowManyCoins(e.target.value)}} />
          <select name="coin" value={selectedCoin} onChange={(e) => {setSelectedCoin(e.target.value)}}>
              <option value="BTC" className="BTC">Bitcoin</option>
              <option value="ETH" className="ETH">Ethereum</option>
              <option value="DOGE" className="DOGE">Dogecoin</option>
              <option value="USDT" className="USDT">Tether</option>
              <option value="ADA" className="ADA">Cardano</option>
          </select>
        </div>

        <div className="invert-div">
          <button onClick={invertConversion} id="invert-btn"><span className="material-icons-outlined">currency_exchange</span></button>
        </div>

        <div>
          <input type="number" id="brl-value" placeholder="R$" value={howManyBRL} onChange={(e) => {setHowManyBRL(e.target.value)}} />
          <label>BRL</label>
        </div>

      </div>

      <button onClick={convert} id="convert-btn">Converter</button>
      <p>{feedback}</p>

    </main>
  )
}

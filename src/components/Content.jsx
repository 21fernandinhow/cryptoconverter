import { useState } from "react"

export default function Content() {

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

  const invertConversion = () => {
    if(!invertedConversion){
      setInvertedConversion(true)
    } else {
      setInvertedConversion(false)
    }
  }

  return (
    <main className="has-text-centered">

      <h1 className="title">Crypto Converter</h1>
      <p>Converta o valor das principais criptomoedas em reais</p>
      <hr className="hr-expand has-background-primary"/>

      <div 
        className={`columns is-centered is-multiline mt-2 
          ${invertedConversion ? `is-flex is-flex-direction-${window.innerWidth < 701 ? "column" : "row"}-reverse` : ""}`
        }
      >

        <div className="column has-text-left is-two-fifths">
          
          <input 
            className="input" 
            type="number" 
            placeholder="Criptomoeda" 
            value={howManyCoins} 
            onChange={(e) => {setHowManyCoins(e.target.value)}} 
          />
          
          <div className="select is-small mt-2">
            <select name="coin" value={selectedCoin} onChange={(e) => {setSelectedCoin(e.target.value)}}>
                <option value="BTC" className="BTC">Bitcoin</option>
                <option value="ETH" className="ETH">Ethereum</option>
                <option value="DOGE" className="DOGE">Dogecoin</option>
                <option value="USDT" className="USDT">Tether</option>
                <option value="ADA" className="ADA">Cardano</option>
            </select>
          </div>

        </div>

        <div className="invert-div column is-one-fifth">
          <button onClick={invertConversion} id="invert-btn">
            <span className="material-icons-outlined">currency_exchange</span>
          </button>
        </div>

        <div className="column has-text-left is-two-fifths">
          <input 
            className="input mb-3" 
            type="number" id="brl-value" 
            placeholder="R$" 
            value={howManyBRL} 
            onChange={(e) => {setHowManyBRL(e.target.value)}} 
          />
          <label>BRL</label>
        </div>

      </div>

      <button className="button mb-3" onClick={convert} id="convert-btn">Converter</button>
      <p>{feedback}</p>

    </main>
  )
}

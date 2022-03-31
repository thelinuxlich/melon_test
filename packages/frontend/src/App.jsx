import styles from './App.module.css'
import { createSignal } from 'solid-js'

const [getValue, setValue] = createSignal(0)

const url = new URL('http://localhost:4000/graphql')
url.searchParams.append(
  'query',
  `
    subscription Currency {
      currency 
    }
  `
)

const eventsource = new EventSource(url.toString())

/** @type {(event: {data: string}) => void} onmessage */
eventsource.onmessage = function (event) {
  /** @type {{data: {currency: number}}} */
  const response = JSON.parse(event.data)
  setValue(response.data.currency)
}

const addCurrency = () => {
  fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation AddCurrency($value: Int!) {
          addCurrency(value: $value)
        }
      `,
      variables: {
        value: 10,
      },
    }),
  }).catch(e => console.log(e))
}

const getCurrency = () => {
  fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Currency {
          currency
        }
      `,
    }),
  })
    .then(res => res.json())
    .then(
      /**
       * @param {{data: {currency: number}}} result
       * @returns {number}
       */
      result => setValue(result.data.currency)
    )
    .catch(e => console.log(e))
}

/**
 * @returns {JSXElement}
 */
function App() {
  getCurrency()
  return (
    <div class={styles.App}>
      <header>Profiteer</header>
      <div>
        <p>Current currency: {getValue()}</p>
        <button onClick={addCurrency}>Add Currency</button>
      </div>
    </div>
  )
}

export default App

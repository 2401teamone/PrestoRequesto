import { useState } from 'react'

import { CodeBlock } from 'react-code-blocks'

export default function BinInterface({ url, handleTestEvent }) {
  const [current, setCurrent] = useState("curl")

  const copies = {
    curl: `curl -d '{ "name": "Han Solo" }' -H 'Content-Type: application/json' ${url}`,

    javascript: `const headers = new Headers()
headers.append("Content-Type", "application/json")

const body = { "name": "Han Solo" }

const options = {
  method: "POST",
  headers,
  mode: "cors",
  body: JSON.stringify(body),
}

fetch("${url}", options)`,

    node: `const https = require("https")

const data = JSON.stringify({ "name": "Han Solo" })

const options = {
  hostname: "prestorequesto.com",
  port: 3000,
  path: "${url.slice(21)}",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
}

const req = https.request(options)
req.write(data)
req.end()`
  }

  return (
    <div className="bin-interface">
      <div className="bin-interface-top">
        <h2 className="header">Interface</h2>
        <div className="bin-interface-buttons">
          <button className="bin-interface-button generate-test-event-button" onClick={ handleTestEvent }><i className="fa-light fa-webhook"></i> Test</button>
          <button className="bin-interface-button copy" onClick={() => window.navigator.clipboard.writeText(copies[current])}>
            <i className="fa-light fa-copy"></i> Copy
          </button>
        </div>
      </div>
      <div className="options">
        <div onClick={() => setCurrent("curl")} className="option">cURL</div>
        <div onClick={() => setCurrent("javascript")} className="option">Javascript</div>
        <div onClick={() => setCurrent("node")} className="option">Node</div>
      </div>
      <div>
        {
          <CodeBlock
            text={copies[current]}
            language={current === "node" ? "javascript" : current}
            wrapLines
          />
        }
      </div>
    </div>
  )
}
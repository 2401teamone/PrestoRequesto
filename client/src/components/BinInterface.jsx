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
  hostname: "localhost.com",
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
      <h2>Interface</h2>
      <button onClick={handleTestEvent}>Generate Test Event</button>
      <div className="options">
        <button className="copy" onClick={() => window.navigator.clipboard.writeText(copies[current])}>
          <i className="fa-light fa-copy"></i>
        </button>
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
export default function BinInterface({ url }) {
  return (
    <div>
      <div className="nav-bar">
        <div>cURL</div>
        <div>Javascript</div>
        <div>Node</div>
      </div>
      <div>

        <pre>
          <code>
            curl -d &#123; &#125;
            -H {'"Content-Type: application/json"'} {' '}
            {url}
          </code>
        </pre>
      </div>
    </div>
  )
}
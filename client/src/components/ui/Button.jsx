export default function Button({ text, handleClick }) {
  return (
    <button className="initiate-bin-button" onClick={handleClick}>
      {text}
    </button>
  )
}
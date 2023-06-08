import { useRouteError, useNavigate } from "react-router-dom"
import "./error-page.css"

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)
  const navigate = useNavigate();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button
          type="button"
          className="back-btn"
          onClick={() => {
            navigate(-1)
          }}
        >Go Back</button>
    </div>
  )
}
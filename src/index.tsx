import ReactDOM from "react-dom/client"
import { RouterContextStateManager } from "./components/contexts/router/RouterContext"
import "./style.css"

const rootElement = document.getElementById("react-root")
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)

root.render(<RouterContextStateManager />)

import React from "react"
import ReactDOM from "react-dom/client"
import { RouterContextStateManager } from "./components/contexts/router/RouterContext"
import "./style.css"

const root = ReactDOM.createRoot(document.getElementById("react-root"))

root.render(<RouterContextStateManager />)

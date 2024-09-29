const React = require("react")
const ReactDOM = require("react-dom/client")
const { RouterContextStateManager } = require("./components/contexts/router/RouterContext")
const createRoot = ReactDOM.createRoot
var CortexHome = require("./pages/CortexHome").default

require("./style.css")

const root = createRoot(document.getElementById("react-root"))

root.render(
  <RouterContextStateManager>
    <CortexHome />
  </RouterContextStateManager>
)

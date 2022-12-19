const React = require('react');
const ReactDOM = require('react-dom/client');
const createRoot = ReactDOM.createRoot;
var CortexHome = require('./components/CortexHome').default;

require("./style.css")


const root = createRoot(document.getElementById("react-root"));

root.render(<CortexHome />)

console.log(<CortexHome />)

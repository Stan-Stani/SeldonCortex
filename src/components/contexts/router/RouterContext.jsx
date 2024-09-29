import { createContext, useState } from "react"
import CortexHome from "../../../pages/CortexHome"
import CortexHomeOld from "../../../pages/CortexHomeOld"

const pagesDictionary = {
  "": CortexHome,
  old: CortexHomeOld
}

const RouterContext = createContext({
  push: () => {
    throw new Error(
      "This call must have the RouterContext.Provider somewhere above it in the component tree!"
    )
  },
})

const routerPush = (route, callback) => {
  window.location.href = `${(route[0] === "/" && window.origin) || ""}${route}`
  console.log(route, "routehello")
  callback(route)
}

export function RouterContextStateManager({ children }) {
  const [routeString, setRouteString] = useState(
    window.location.pathname.substring(1)
  )
  console.log({ routeString })
  const routerContextValue = {
    /** Start target with `'/'` for path to be considered relative to current origin. */
    push: (routeString) => routerPush(routeString, (rs) => setRouteString(rs)),
  }

  if (typeof pagesDictionary[routeString] !== "function") {
    routerPush("/", () => setRouteString("/"))
  }

  return (
    <RouterContext.Provider value={routerContextValue}>
      {pagesDictionary[routeString]()}
    </RouterContext.Provider>
  )
}

export default RouterContext

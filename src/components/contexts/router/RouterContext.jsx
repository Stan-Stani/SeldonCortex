import { createContext, useState } from "react"
import CortexHome from "../../../pages/CortexHome"
import CortexHomeOld from "../../../pages/CortexHomeOld"

const pagesDictionary = {
  "": CortexHome,
  about: CortexHomeOld,
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
  callback(route)
}

export function RouterContextStateManager({ children }) {
  const [routeString, setRouteString] = useState(
    window.location.pathname.substring(1)
  )
  const routerContextValue = {
    /** Start target with `'/'` for path to be considered relative to current origin. */
    push: (routeString) =>
      routerPush(routeString, (rs) => setRouteString(rs.substring(1))),
  }

  if (typeof pagesDictionary[routeString] !== "function") {
    routerPush("/", () => setRouteString(""))
  }


  const CurrentRouteComponent = pagesDictionary[routeString]
  return (
    <RouterContext.Provider value={routerContextValue}>
      <CurrentRouteComponent />
    </RouterContext.Provider>
  )
}

export default RouterContext

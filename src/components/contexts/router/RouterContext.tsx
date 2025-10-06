import { createContext, useState, ReactNode } from "react"
import CortexHome from "../../../pages/CortexHome"
import CortexHomeOld from "../../../pages/CortexHomeOld"
import Sinoglyphs from "../../../pages/Sinoglyphs";

const pagesDictionary: Record<string, React.ComponentType> = {
  "": CortexHome,
  about: CortexHomeOld,
  sinoglyphs: Sinoglyphs
}

interface RouterContextType {
  push: (route: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  push: () => {
    throw new Error(
      "This call must have the RouterContext.Provider somewhere above it in the component tree!"
    )
  },
})

const routerPush = (route: string, callback: (route: string) => void) => {
  window.location.href = `${(route[0] === "/" && window.origin) || ""}${route}`
  callback(route)
}

interface RouterContextStateManagerProps {
  children?: ReactNode;
}

export function RouterContextStateManager({ }: RouterContextStateManagerProps) {
  const [routeString, setRouteString] = useState(
    window.location.pathname.substring(1)
  )
  const routerContextValue = {
    /** Start target with `'/'` for path to be considered relative to current origin. */
    push: (routeString: string) =>
      routerPush(routeString, (rs: string) => setRouteString(rs.substring(1))),
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

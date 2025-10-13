import { useContext } from "react"
import RouterContext from "../../components/contexts/router/RouterContext"
import WorldMap from "../../components/sinoglyphsComponents/worldMap"

interface BlogPost {
  fileName: string
  tags: string[]
}

interface State {
  isBodyScrolledToTop: boolean
  blogPostHtml: { __html: string }
  blogArr: BlogPost[]
  currentBlogPostIndex: number
  portfolioPresentation: string
}

interface BlogNavProps {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}

/**
 *
 */
function Sinoglyphs() {
  // Dynamic import to prevent tailwind messing with root styles for main page of website
  import("../../tailwind.css")
  const router = useContext(RouterContext)

  return (
    <div
      id='sinoglyphs'
      className='h-min min-h-full text-arne16-white font-sarasa bg-arne16-nightblue'
    >
      <header className='bg-arne16-nightblue'>Sinoglyphs</header>

      <WorldMap />
    </div>
  )
}

// Exporting the component
export default Sinoglyphs

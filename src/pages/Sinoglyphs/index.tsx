import { useContext, useState } from "react"
import RouterContext from "../../components/contexts/router/RouterContext"
import SinoglyphMap from "../../components/sinoglyphComponents/map"

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
 * @todo notosans
 */
function Sinoglyphs() {
  // Dynamic import to prevent tailwind messing with root styles for main page of website
  import("../../tailwind.css")
  const router = useContext(RouterContext)
  const [state, setState] = useState<State>({
    isBodyScrolledToTop: true,
    blogPostHtml: {
      __html: "<p>Hmm... the blog's not loading for some reason... :(</p>",
    },
    blogArr: [],
    currentBlogPostIndex: 0,
    portfolioPresentation: "grid",
  })

  return (
    <div id='sinoglyphs' className='h-full text-arne16-white font-sarasa bg-arne16-void'>
      <header className='bg-arne16-slimegreen'>hello</header>

      <SinoglyphMap />
    </div>
  )
}

// Exporting the component
export default Sinoglyphs

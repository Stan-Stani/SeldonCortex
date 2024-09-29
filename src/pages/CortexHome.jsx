//TODO: Handle mobile My Work overlays
//If page is scrolled down already on page reload then don't run animation for header shrink

const imagesToPreload = [
  "./assets/home/eCommerce_ChinguV42G19.png",
  "./assets/home/ProjectDetails/Booktown/booktown-search-results.png",
  "./assets/home/ProjectDetails/Booktown/booktown-product-page.png",
  "./assets/home/ProjectDetails/Booktown/booktown-checkout.png",
  "./assets/home/ProjectDetails/Job Tracker/job-tracker-landing.png",
  "./assets/home/ProjectDetails/Job Tracker/job-tracker-login.png",
  "./assets/home/ProjectDetails/Job Tracker/job-tracker-table-view.png",
  "./assets/home/ProjectDetails/Heat Map/heat-map1.png",
  "./assets/home/ProjectDetails/Heat Map/heat-map2.png",
  "./assets/home/ProjectDetails/Heat Map/heat-map3.png",
  "./assets/home/ProjectDetails/Heat Map/heat-map4.png",
  "./assets/home/ProjectDetails/Choropleth/D3 Choropleth Big.png",
  "./assets/home/Kiwi Derp.png",
  "./assets/home/ProjectDetails/Kiwi Derp/kiwi-derp-difficulty.png",
  "./assets/home/ProjectDetails/Kiwi Derp/kiwi-derp-mainmenu.png",
  "./assets/home/ProjectDetails/Kiwi Derp/kiwi-derp-godmode.png",
  "./assets/home/React Pomodoro Clock Square.png",
  "./assets/home/React Calculator Square.png",
  "./assets/home/React Drum Machine Square.png",
  "./assets/home/React Markdown Previewer Square.png",
  "./assets/home/React Quote Generator Square.png",
]

const React = require("react")
const useState = React.useState
const useEffect = React.useEffect
const useRef = React.useRef

function CortexHome() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [state, setState] = useState({
    isBodyScrolledToTop: true,
    blogPostHtml: {
      __html: "<p>Hmm... the blog's not loading for some reason... :(</p>",
    },
    blogArr: [],
    currentBlogPostIndex: 0,
    portfolioPresentation: "grid",
  })

  useEffect(() => {
    // Initialize blog post reference object from .JSON
    fetch("/blog/blog.json").then((res) => {
      return res.json().then((blogArr) => {
        let fileName = blogArr[0].fileName
        let relativePath = "/blog/" + fileName

        fetch(relativePath)
          .then((res) => {
            return res.text()
          })
          .then((post) => {
            setState((oldState) => {
              let newState = Object.assign({}, oldState)
              newState.blogArr = blogArr
              let tagsString = blogArr[0].tags.join(" #")
              if (tagsString !== "") tagsString = "#" + tagsString
              newState.blogPostHtml = {
                __html: post + "<hr><p>" + tagsString + "</p>",
              }
              newState.currentBlogPostIndex = 0
              return newState
            })
          })
      })
    })

    // precache images for ProjectDetails component
    for (const image of imagesToPreload) {
      const imageElement = new Image()
      imageElement.src = image
    }
  }, [])

  return (
    <div id='root-contained'>
      <header>
        <h1 id='title' className='white-text'>
          Seldon Cortex
        </h1>
      </header>
      <div id='center-panels-container'>
        <section className='panel text-focus white-text'>
          <h2>Blog</h2> <BlogNav state={state} setState={setState} />
          <div id='blog-post' dangerouslySetInnerHTML={state.blogPostHtml} />
          <BlogNav state={state} setState={setState} />
        </section>
        <section className='panel text-focus white-text'>
          <h2>Contact Me</h2>
          <p>
            <a href='./email/email.html' target='_blank'>
              Email
            </a>
          </p>
        </section>
      </div>
      <footer className='white-text'>
        <strong>S. G. Stanislaus Copyright 2024</strong>
        <br />
      </footer>
    </div>
  )
}

function getBlogPost(event, state, setState, indexToGet) {
  fetch("/blog/" + state.blogArr[indexToGet].fileName).then((res) => {
    res.text().then((post) => {
      setState((oldState) => {
        let newState = Object.assign({}, oldState)
        let tagsString = oldState.blogArr[indexToGet].tags.join(" #")
        if (tagsString !== "") tagsString = "#" + tagsString

        newState.blogPostHtml = {
          __html: post + "<hr><p>" + tagsString + "</p>",
        }
        newState.currentBlogPostIndex = indexToGet

        return newState
      })
    })
  })
}

function BlogNav({ state, setState }) {
  return (
    <div class='blog-nav'>
      <p>
        {state.currentBlogPostIndex === 0 ? null : (
          <button
            id='see-next-blog-post'
            title='Next post'
            onClick={(event) => {
              getBlogPost(
                event,
                state,
                setState,
                state.currentBlogPostIndex - 1
              )
            }}
          >
            &lt;
          </button>
        )}

        {state.currentBlogPostIndex === state.blogArr.length - 1 ? null : (
          <button
            id='see-previous-blog-post'
            title='Previous post'
            onClick={(event) => {
              getBlogPost(
                event,
                state,
                setState,
                state.currentBlogPostIndex + 1
              )
            }}
          >
            &gt;
          </button>
        )}
      </p>
    </div>
  )
}

// Exporting the component
export default CortexHome

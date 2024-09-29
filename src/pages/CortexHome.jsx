//TODO: Handle mobile My Work overlays
//If page is scrolled down already on page reload then don't run animation for header shrink

import RouterContext from "../components/contexts/router/RouterContext"

const { useState, useEffect, useContext } = require("react")

function CortexHome() {
  const router = useContext(RouterContext)
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
    setTimeout(() => {
      // router.push("/lol")
      console.log("router push")
    }, 5000)
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
    <div className='blog-nav'>
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

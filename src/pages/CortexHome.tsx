import { useContext, useEffect, useState } from "react"
import Blog from "../components/blog/Blog"
import RouterContext from "../components/contexts/router/RouterContext"

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

function CortexHome() {
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
  }, [])

  return (
    <div id='root-contained'>
      <header>
        <h1 id='title' className='white-text'>
          Seldon Cortex
        </h1>
      </header>
      <div id='center-panels-container'>
        <Blog />
        <section className='panel text-focus white-text'>
          <h2>Contact Me</h2>
          <p>
            <a href='./email/email.html' target='_blank'>
              Email
            </a>
          </p>
        </section>
        <section className='panel text-focus white-text'>
          <p>
            <button onClick={() => router.push("/about")}>
              <h2>About The Author</h2>
            </button>
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

function getBlogPost(
  _event: React.MouseEvent,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  indexToGet: number
) {
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

function BlogNav({ state, setState }: BlogNavProps) {
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

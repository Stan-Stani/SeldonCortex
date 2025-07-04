import { useEffect, useRef, useState } from "react"
import {
  getPostWithTagsInHTML,
  readBlogPostURLParam,
  setBlogPostURLParam,
} from "./blogHelpers"
import BlogNav from "./nav/BlogNav"

export interface BlogPost {
  fileName: string
  tags: string[]
}

export interface BlogState {
  blogPostHtml: { __html: string }
  blogArr: BlogPost[]
  currentBlogPostIndex: number
}

export default function Blog() {
  const [blogState, setBlogState] = useState<BlogState>({
    blogPostHtml: { __html: "" },
    blogArr: [],
    currentBlogPostIndex: -1,
  })

  /** @effectName getBlogPostOnMount() */
  useEffect(() => {
    ;(async () => {
      const res = await fetch("/blog/blog.json")
      const blogArr = (await res.json()) as BlogPost[]

      let fileName = readBlogPostURLParam()

      fileName = fileName || blogArr[0].fileName
      let blogPostPath = "/blog/" + fileName
      const blogPostRes = await fetch(blogPostPath)
      const blogPost = await blogPostRes.text()
      setBlogState((oldState) => {
        let newState = Object.assign({}, oldState)
        newState.blogArr = blogArr

        newState.blogPostHtml = {
          __html: getPostWithTagsInHTML(blogPost, blogArr[0].tags),
        }

        newState.currentBlogPostIndex = blogArr.findIndex(
          (bp) => bp.fileName === fileName
        )

        setBlogPostURLParam(fileName)

        return newState
      })
    })()
  }, [])

  const blogPostIndex = blogState.currentBlogPostIndex
  useEffect(() => {
    // If statement here is just so eslint rule doesn't complain
    if (typeof blogPostIndex === "number") {
      blogSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [blogPostIndex])

  const blogSectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={blogSectionRef}
      className='panel text-focus white-text relative blog-section'
    >
      <div className='flex-shelf flex-wrap'>
        <h2>Blog</h2>
        <h3 className='text-align-end'>
          Originally Published:{" "}
          {blogState.blogArr
            .find((_bp, index) => index === blogState.currentBlogPostIndex)
            ?.fileName.slice(0, 10)}
        </h3>
      </div>
      <BlogNav blogStateTuple={[blogState, setBlogState]} />
      <div id='blog-post' dangerouslySetInnerHTML={blogState.blogPostHtml} />
      <BlogNav blogStateTuple={[blogState, setBlogState]} />
    </section>
  )
}

import { useEffect, useState } from "react"
import BlogNav from "./nav/BlogNav"
import {
  getPostWithTagsInHTML,
  readBlogPostURLParam,
  setBlogPostURLParam,
} from "./blogHelpers"

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
  const blogStateTuple = useState<BlogState>({
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
      blogStateTuple[1]((oldState) => {
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

  return (
    <section className='panel text-focus white-text relative'>
      <h2>Blog</h2> <BlogNav blogStateTuple={blogStateTuple} />
      <h3 className='absolute-top-right'>
        Originally Published:{" "}
        {blogStateTuple[0].blogArr
          .find(
            (_bp, index) => index === blogStateTuple[0].currentBlogPostIndex
          )
          ?.fileName.slice(0, 10)}
      </h3>
      <div
        id='blog-post'
        dangerouslySetInnerHTML={blogStateTuple[0].blogPostHtml}
      />
      <BlogNav blogStateTuple={blogStateTuple} />
    </section>
  )
}

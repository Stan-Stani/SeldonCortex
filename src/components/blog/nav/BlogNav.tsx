import { Dispatch, SetStateAction } from "react"
import { BlogState } from "../Blog"
import { getPostWithTagsInHTML } from "../blogHelpers"

async function getBlogPost(_event: React.MouseEvent, fileName: string) {
  const res = await fetch("/blog/" + fileName)
  return await res.text()
}

export default function BlogNav({
  blogStateTuple,
}: {
  blogStateTuple: [BlogState, Dispatch<SetStateAction<BlogState>>]
}) {
  const [blogState, setBlogState] = blogStateTuple

  return (
    <div className='blog-nav'>
      <p>
        {blogState.currentBlogPostIndex === 0 ? null : (
          <button
            id='see-next-blog-post'
            title='Next post'
            onClick={async (event) => {
              const blogPost = await getBlogPost(
                event,
                blogState.blogArr[blogState.currentBlogPostIndex - 1].fileName
              )
              setBlogState((oldState) => {
                const newIndex = oldState.currentBlogPostIndex - 1
                let newState = Object.assign({}, oldState)

                newState.blogPostHtml = {
                  __html: getPostWithTagsInHTML(
                    blogPost,
                    oldState.blogArr[newIndex].tags
                  ),
                }

                newState.currentBlogPostIndex = newIndex

                return newState
              })
            }}
          >
            &lt;
          </button>
        )}

        {blogState.currentBlogPostIndex ===
        blogState.blogArr.length - 1 ? null : (
          <button
            id='see-previous-blog-post'
            title='Previous post'
            onClick={async (event) => {
              const blogPost = await getBlogPost(
                event,
                blogState.blogArr[blogState.currentBlogPostIndex + 1].fileName
              )
              setBlogState((oldState) => {
                const newIndex = oldState.currentBlogPostIndex + 1
                let newState = Object.assign({}, oldState)

                newState.blogPostHtml = {
                  __html: getPostWithTagsInHTML(
                    blogPost,
                    oldState.blogArr[newIndex].tags
                  ),
                }
                newState.currentBlogPostIndex = newIndex

                return newState
              })
            }}
          >
            &gt;
          </button>
        )}
      </p>
    </div>
  )
}

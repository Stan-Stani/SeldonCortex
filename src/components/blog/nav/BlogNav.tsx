import { Dispatch, SetStateAction } from "react"
import { BlogState } from "../Blog"
import { getPostWithTagsInHTML, setBlogPostURLParam } from "../blogHelpers"

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
              const fileName =
                blogState.blogArr[blogState.currentBlogPostIndex - 1].fileName
              const postText = await getBlogPost(event, fileName)
              setBlogState((oldState) => {
                const newIndex = oldState.currentBlogPostIndex - 1
                let newState = Object.assign({}, oldState)

                newState.blogPostHtml = {
                  __html: getPostWithTagsInHTML(
                    postText,
                    oldState.blogArr[newIndex].tags
                  ),
                }

                newState.currentBlogPostIndex = newIndex

                setBlogPostURLParam(fileName)
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
              const fileName =
                blogState.blogArr[blogState.currentBlogPostIndex + 1].fileName
              const postText = await getBlogPost(event, fileName)
              setBlogState((oldState) => {
                const newIndex = oldState.currentBlogPostIndex + 1
                let newState = Object.assign({}, oldState)

                newState.blogPostHtml = {
                  __html: getPostWithTagsInHTML(
                    postText,
                    oldState.blogArr[newIndex].tags
                  ),
                }
                newState.currentBlogPostIndex = newIndex

                setBlogPostURLParam(fileName)
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

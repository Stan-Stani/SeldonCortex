export function getPostWithTagsInHTML(blogPostText: string, tags: string[]) {
  let tagsString = tags.join(" #")
  if (tagsString !== "") tagsString = "#" + tagsString

  return blogPostText + "<hr><p>" + tagsString + "</p>"
}

export function setBlogPostURLParam(fileName: string) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set("blog", fileName)
  window.history.replaceState({}, "", `?${searchParams.toString()}`)
}

export function readBlogPostURLParam() {
  return new URLSearchParams(window.location.search).get("blog")
}

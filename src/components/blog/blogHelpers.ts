export function getPostWithTagsInHTML(blogPostText: string, tags: string[]) {
  let tagsString = tags.join(" #")
  if (tagsString !== "") tagsString = "#" + tagsString

  return blogPostText + "<hr><p>" + tagsString + "</p>"
}

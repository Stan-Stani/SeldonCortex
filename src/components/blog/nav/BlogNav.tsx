function getBlogPost(
  _event: React.MouseEvent,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  indexToGet: number
) {
  fetch("/blog/" + state.blogArr[indexToGet].fileName).then((res) => {
    res.text().then((post) => {
      setState((oldState) => {
        let newState = Object.assign({}, oldState);
        let tagsString = oldState.blogArr[indexToGet].tags.join(" #");
        if (tagsString !== "") tagsString = "#" + tagsString;

        newState.blogPostHtml = {
          __html: post + "<hr><p>" + tagsString + "</p>",
        };
        newState.currentBlogPostIndex = indexToGet;

        return newState;
      });
    });
  });
}

function BlogNav({ state, setState }: BlogNavProps) {
  return (
    <div className="blog-nav">
      <p>
        {state.currentBlogPostIndex === 0 ? null : (
          <button
            id="see-next-blog-post"
            title="Next post"
            onClick={(event) => {
              getBlogPost(
                event,
                state,
                setState,
                state.currentBlogPostIndex - 1
              );
            }}
          >
            &lt;
          </button>
        )}

        {state.currentBlogPostIndex === state.blogArr.length - 1 ? null : (
          <button
            id="see-previous-blog-post"
            title="Previous post"
            onClick={(event) => {
              getBlogPost(
                event,
                state,
                setState,
                state.currentBlogPostIndex + 1
              );
            }}
          >
            &gt;
          </button>
        )}
      </p>
    </div>
  );
}

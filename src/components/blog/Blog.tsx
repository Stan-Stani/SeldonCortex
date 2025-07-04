export default function Blog() {
  return (
    <section className="panel text-focus white-text">
      <h2>Blog</h2> <BlogNav state={state} setState={setState} />
      <div id="blog-post" dangerouslySetInnerHTML={state.blogPostHtml} />
      <BlogNav state={state} setState={setState} />
    </section>
  );
}

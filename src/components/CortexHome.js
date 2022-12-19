//TODO: Handle mobile My Work overlays
//If page is scrolled down already on page reload then don't run animation for header shrink

const React = require('react');
const ReactDOM = require('react-dom');

const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;
const CSSTransition = require('react-transition-group').CSSTransition;




function CortexHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, setState] = useState({
    isBodyScrolledToTop: true,
    blogPostHtml: {__html: "<p>Hmm... the blog's not loading for some reason... :(</p>"},
    blogArr: [],
    currentBlogPostIndex: 0
  });

  
  useEffect(() => {
    
    document.addEventListener("scroll", (e) => {
        setIsScrolled(() => {
          if (window.scrollY === 0) {
            return false;
          } else {
            return true;
          }
        });
  
      
    })

    // Initialize blog post reference object from .JSON
    fetch('/blog/blog.json')
      .then(res => {
        return res.json()
      .then(blogArr => {
        let fileName = blogArr[0].fileName;
        let relativePath = '/blog/' + fileName;
        
        fetch(relativePath)
          .then(res => {
            return res.text()
          })
          .then(post => {
            setState((oldState => {
              let newState = Object.assign({}, oldState);
              newState.blogArr = blogArr;
              let tagsString = blogArr[0].tags.join(' #');
              if (tagsString !== '') tagsString = '#' + tagsString;
              newState.blogPostHtml = {__html: post + '<hr><p>' + tagsString + '</p>'};
              newState.currentBlogPostIndex = 0;
              return newState;



              

              
            }))

            
          })


      })
    })


  }, []);
  
  
  
  return (
    <div id="root-contained">
      <header>
        <CSSTransition in={isScrolled} appear={false} timeout={1000} classNames="shrink">
          <img id="logo" className="logo-initial" src="./assets/home/500px-Human_brain.jpg" />
        </CSSTransition>
      <h1 id="title" className='white-text'>Seldon Cortex</h1>
      </header>
      <div id="center-panels-container">
      <section className="panel">
        <h2 className='white-text'>My Work</h2>
        <div id="grid">
          <HoverDescAnchor href="https://biometricpsychography.github.io/free-code-camp-d3-js-heat-map/" target="_blank" src="./assets/home/D3 Heat-Map Square.png"> 
            <h3 style={{lineHeight: '.7em'}}>Heat-Map<br/><span className="hover-desc-overlay-subheading">built with D3</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/bGLgzga" target="_blank" src="./assets/home/Kiwi Derp.png"> 
            <h3 style={{lineHeight: '.7em'}}>Kiwi Derp <br/><span className="hover-desc-overlay-subheading">Flappy Bird clone built with Phaser</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNppPyq" target="_blank" src="./assets/home/React Pomodoro Clock Square.png">
            <h3 style={{lineHeight: '.7em'}}>Pomodoro Timer <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/qBpaBBa" target="_blank" src="./assets/home/React Calculator Square.png">
            <h3 style={{lineHeight: '.7em'}}>Calculator <br/><span className="hover-desc-overlay-subheading">built with React and Math.js</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/WNXzzRx" target="_blank" src="./assets/home/React Drum Machine Square.png">
            <h3 style={{lineHeight: '.7em'}}>Weird Sound Board <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/mdqBRrw" target="_blank" src="./assets/home/React Markdown Previewer Square.png">
            <h3 className="black-text" style={{lineHeight: '.7em'}}>Markdown Previewer <br/><span className="hover-desc-overlay-subheading">built with React and Marked</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNYWLvq" target="_blank" src="./assets/home/React Quote Generator Square.png">
            <h3 className="black-text">Random Quote Generator <br/><span className="hover-desc-overlay-subheading" style={{lineHeight: '.7em'}}>built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://github.com/biometricPsychography" target="_blank" src="./assets/home/My Github.png">
          </HoverDescAnchor>
        </div>
      </section>
      <section className="panel text-focus white-text">
        <h2>About Me</h2>
          <p id="about-me-first-para">
            <span>Stan </span>
            <span>스탠 </span>
            <span>スタン </span>
            <span id="finger-spelling-asl-word">
              <img className="finger-spelling-asl" src="/assets/home/S.png"/>
              <img className="finger-spelling-asl" src="/assets/home/T.png"/>
              <img className="finger-spelling-asl" src="/assets/home/A.png"/>
              <img className="finger-spelling-asl" src="/assets/home/N.png"/>
            </span>
          </p>
          <p>
            I'm an aspiring full stack developer. A long time fantasy reader, my dreams
            of magic left me bitter upon waking up to mundane reality. But
            I've realized magic is real. Magic is coding.
          </p>
      </section>
      <section className="panel text-focus white-text">
        <h2>Blog</h2>
        <div id="blog-post" dangerouslySetInnerHTML={state.blogPostHtml} />
        <div id="blog-nav">
          <p>
            {state.currentBlogPostIndex === 0 ?
              null : <button id="see-next-blog-post" title="Next post" onClick={(event) => 
              {getBlogPost(event, state, setState, state.currentBlogPostIndex - 1)}}>&lt;</button>}

            {state.currentBlogPostIndex === state.blogArr.length - 1 ? 
              null : <button id="see-previous-blog-post" title="Previous post" onClick={(event) => 
              {getBlogPost(event, state, setState, state.currentBlogPostIndex + 1)}}>&gt;</button>}
          </p>
        </div>
      </section>
      <section className="panel text-focus white-text">
        <h2>Contact Me</h2>
        <p>
          <a href='./email/email.html' target='_blank'>Email</a>
          
        </p>
      </section>
      </div>
      <footer className='white-text'>
        <strong>S. G. Stanislaus Copyright  2022</strong> 
        <br />
        <a href="https://en.wikipedia.org/wiki/File:Human_brain.jpg">Header image source</a>, licensed under Creative Commons Attribution-Share Alike 3.0 Unported 
      </footer>
    </div>
  )
}

function HoverDescAnchor(props) {

  return (
    <figure className="hover-desc-anchor">

    
    <figcaption><a href={props.href} target={props.target ? props.target : '_blank'}><div className="hover-desc-overlay"><span className="hover-desc-text white-text">{props.children}</span></div></a></figcaption>
     <img src={props.src} alt=""/>
    </figure>
  )
}

function getBlogPost(event, state, setState, indexToGet) {
  
  fetch('/blog/' + state.blogArr[indexToGet].fileName)
    .then(res => {
      res.text()
        .then(post => {
          setState(oldState => {
            let newState = Object.assign({}, oldState);
            let tagsString = oldState.blogArr[indexToGet].tags.join(' #')
            if (tagsString !== '') tagsString = '#' + tagsString;

            newState.blogPostHtml = {__html: post + '<hr><p>' + tagsString + '</p>'};
            newState.currentBlogPostIndex = indexToGet;
    
            return newState;
          })
        });
    })
  
}

// Exporting the component
export default CortexHome;
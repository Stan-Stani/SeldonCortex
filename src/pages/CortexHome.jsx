//TODO: Handle mobile My Work overlays
//If page is scrolled down already on page reload then don't run animation for header shrink
import ProjectDetails from '../components/CortexHome/ProjectDetails';
import { CSSTransition } from 'react-transition-group';
const React = require('react');
const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;

const projectDetailsDataObj = {
  'Booktown': {
    heading: <h2 id="booktown">Booktown</h2>,
    mainContent:
      <>
        <img src="./assets/home/eCommerce_ChinguV42G19.png" />
        <div>
          <ul>
            <li>Used React, Redux, Chakra-UI, OpenLibrary API, Firebase, and TypeScript to create an eCommerce SPA website in a team of 5</li>
            <li>Employed Scrum/Agile framework</li>
            <li>My main job was to connect the API to all the product and search pages, as well as integrating the product pages with the cart</li>
            <li>See the live app at: <a href="https://cheery-kataifi-feac13.netlify.app/" target="_blank">https://cheery-kataifi-feac13.netlify.app/</a></li>
          </ul>
        </div>
        <img src="./assets/home/ProjectDetails/Booktown/booktown-search-results.png" />
        <img src="./assets/home/ProjectDetails/Booktown/booktown-product-page.png" />
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Booktown/booktown-checkout.png" />
      </>

  },
  'Job Tracker': {
    heading: <h2 id="job-tracker">Job Tracker</h2>,
    mainContent:
      <>
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Job Tracker/job-tracker-landing.png" />
        <ul>
          <li>Used MERN, and Typescript to create a full stack job application tracker SPA website with a team of 2 other people</li>
          <li>I worked primarily on the front-end table view as well as refining the Mongoose schemas on the back-end</li>
          <li>See the live app at: <a href="https://job.seldoncortex.com/" target="_blank">https://job.seldoncortex.com/</a></li>
        </ul>
        <img src="./assets/home/ProjectDetails/Job Tracker/job-tracker-login.png" />
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Job Tracker/job-tracker-table-view.png" />
      </>
  },
  'Heat-Map': {
    heading: <h2 id="monthly-global-land-surface-temperature-heat-map">Monthly Global Land-Surface Temperature Heat-Map</h2>,
    mainContent:
      <>
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Heat Map/heat-map1.png" />
        <ul className='try-one-three-grid-columns'>
          <li>Used the D3.js library to visualize json data</li>
          <li>Implemented buttons to toggle between quantile and quantize scales
            as well as to change the color palette</li>
          <li>See the live app at: <a href="https://stan-stani.github.io/free-code-camp-d3-js-heat-map/" target="_blank">https://stan-stani.github.io/free-code-camp-d3-js-heat-map/</a></li>
        </ul>
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Heat Map/heat-map2.png" />
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Heat Map/heat-map3.png" />
        <img className='try-one-three-grid-columns' src="./assets/home/ProjectDetails/Heat Map/heat-map4.png" />
      </>
  },
  'Kiwi-Derp': {
    heading: <h2 id="kiwi-derp">Kiwi Derp</h2>,
    mainContent:
      <>
        <ul>
          <li>Used Phaser.js (JavaScript game framework) to create a Flappy Bird
            clone</li>
          <li>Implemented increasing difficulty and column colors as player progresses</li>
          <li>Saved score to browser LocalStorage API</li>
          <li>Added GodMode setting</li>
          <li>Hand crafted all assets</li>
        </ul>
      </>
  }
}

const projectGridOrderArr = ['Booktown', 'Job Tracker', 'Heat-Map', 'Kiwi-Derp',
  'The Goldfruit Clock', 'Calculator', 'Weird Sound Board', 'Markdown Previewer',
  'Random Quote Generator'];



function CortexHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, setState] = useState({
    isBodyScrolledToTop: true,
    blogPostHtml: { __html: "<p>Hmm... the blog's not loading for some reason... :(</p>" },
    blogArr: [],
    currentBlogPostIndex: 0,
    portfolioPresentation: 'grid'
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
                  newState.blogPostHtml = { __html: post + '<hr><p>' + tagsString + '</p>' };
                  newState.currentBlogPostIndex = 0;
                  return newState;






                }))


              })


          })
      })


  }, []);


  const slideLeftAnimationClassNames = {
    appear: 'slide-in-from-right',
    appearActive: 'slide-in-from-right-active',
    appearDone: 'slide-in-from-right-done',
    enter: 'slide-in-from-right',
    enterActive: 'slide-in-from-right-active',
    enterDone: 'slide-in-from-right-done',
    exitActive: 'slide-out-to-left-active',
    exitDone: 'slide-out-to-left-done'
  };

  const slideRightAnimationClassNames = {
    appear: 'slide-in-from-left',
    appearActive: 'slide-in-from-left-active',
    appearDone: 'slide-in-from-left-done',
    enter: 'slide-in-from-left',
    enterActive: 'slide-in-from-left-active',
    enterDone: 'slide-in-from-left-done',
    exitActive: 'slide-out-to-right-active',
    exitDone: 'slide-out-to-right-done'
  };



  let projectGridOrderObj = {};
  for (let i in projectGridOrderArr) {
    i = parseInt(i);
    projectGridOrderObj[projectGridOrderArr[i]] = i;

    if (projectGridOrderArr.length === i + 1) {
      projectGridOrderObj['**maxIndex**'] = i;
    }
  }


  return (
    <div id="root-contained">
      <header>
        <CSSTransition in={isScrolled} appear={false} timeout={1000} classNames="shrink">
          <img id="logo" className="logo-initial" src="./assets/home/500px-Human_brain.jpg" />
        </CSSTransition>
        <h1 id="title" className='white-text'>Seldon Cortex</h1>
      </header>
      <div id="center-panels-container">
        <CSSTransition in={state.portfolioPresentation === 'grid' ? true : false} appear={false} enter={true} timeout={1000} classNames={state.portfolioPresentation === 'grid' ? slideRightAnimationClassNames : slideLeftAnimationClassNames}>
          <section className="panel">
            <h2 className='white-text'>My Work</h2>
            <div id="grid">
              <HoverDescAnchor href="https://cheery-kataifi-feac13.netlify.app/" target="_blank" src="./assets/home/eCommerce_ChinguV42G19.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 className="black-text" style={{ lineHeight: '.7em' }}>Booktown<br /><span className="hover-desc-overlay-subheading">eCommerce SPA built with<br /> React, Redux, and Chakra-UI</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://job.seldoncortex.com" target="_blank" src="./assets/home/MERNT_ChinguV42G21.png" onClick={() => handlePortfolioItemClick('Job Tracker')}>
                <h3 className="black-text" style={{ lineHeight: '.7em' }}>Job Tracker<br /><span className="hover-desc-overlay-subheading">Full-Stack MERN App</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://stan-stani.github.io/free-code-camp-d3-js-heat-map/" target="_blank" src="./assets/home/D3 Heat-Map Square.png" onClick={() => handlePortfolioItemClick('Heat-Map')}>
                <h3 style={{ lineHeight: '.7em' }}>Heat-Map<br /><span className="hover-desc-overlay-subheading">built with D3</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/bGLgzga" target="_blank" src="./assets/home/Kiwi Derp.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 style={{ lineHeight: '.7em' }}>Kiwi Derp <br /><span className="hover-desc-overlay-subheading">Flappy Bird clone built with Phaser</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNppPyq" target="_blank" src="./assets/home/React Pomodoro Clock Square.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 style={{ lineHeight: '.7em' }}>Pomodoro Timer <br /><span className="hover-desc-overlay-subheading">built with React</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/qBpaBBa" target="_blank" src="./assets/home/React Calculator Square.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 style={{ lineHeight: '.7em' }}>Calculator <br /><span className="hover-desc-overlay-subheading">built with React and Math.js</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/WNXzzRx" target="_blank" src="./assets/home/React Drum Machine Square.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 style={{ lineHeight: '.7em' }}>Weird Sound Board <br /><span className="hover-desc-overlay-subheading">built with React</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/mdqBRrw" target="_blank" src="./assets/home/React Markdown Previewer Square.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 className="black-text" style={{ lineHeight: '.7em' }}>Markdown Previewer <br /><span className="hover-desc-overlay-subheading">built with React and Marked</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNYWLvq" target="_blank" src="./assets/home/React Quote Generator Square.png" onClick={() => handlePortfolioItemClick('Booktown')}>
                <h3 className="black-text">Random Quote Generator <br /><span className="hover-desc-overlay-subheading" style={{ lineHeight: '.7em' }}>built with React</span></h3>
              </HoverDescAnchor>
              <HoverDescAnchor href="https://github.com/Stan-Stani" target="_blank" src="./assets/home/My Github.png">
              </HoverDescAnchor>
            </div>
          </section>
        </CSSTransition>


        <ProjectDetails
          projectDetailsDataObj={projectDetailsDataObj}
          slideLeftAnimationClassNames={slideLeftAnimationClassNames}
          slideRightAnimationClassNames={slideRightAnimationClassNames}
          portfolioPresentation={state.portfolioPresentation}
          projectGridOrderArr={projectGridOrderArr}
          projectGridOrderObj={projectGridOrderObj}
          setState={setState}
        />

        <section className="panel text-focus white-text">
          <h2>About Me</h2>
          <p id="about-me-first-para">
            <span>Stan </span>
            <span>스탠 </span>
            <span>スタン </span>
            <span id="finger-spelling-asl-word">
              <img className="finger-spelling-asl" src="/assets/home/S.png" />
              <img className="finger-spelling-asl" src="/assets/home/T.png" />
              <img className="finger-spelling-asl" src="/assets/home/A.png" />
              <img className="finger-spelling-asl" src="/assets/home/N.png" />
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
                null : <button id="see-next-blog-post" title="Next post" onClick={(event) => { getBlogPost(event, state, setState, state.currentBlogPostIndex - 1) }}>&lt;</button>}

              {state.currentBlogPostIndex === state.blogArr.length - 1 ?
                null : <button id="see-previous-blog-post" title="Previous post" onClick={(event) => { getBlogPost(event, state, setState, state.currentBlogPostIndex + 1) }}>&gt;</button>}
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

  function handlePortfolioItemClick(itemName) {
    setState(oldState => {
      let newState = { ...oldState };
      newState.portfolioPresentation = itemName;
      return newState;
    });
  }

}


function HoverDescAnchor(props) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <figure className="hover-desc-anchor" onClick={() => props.onClick()}>


      {/* <figcaption><a href={props.href} target={props.target ? props.target : '_blank'}><div className="hover-desc-overlay"><span className="hover-desc-text white-text">{props.children}</span></div></a></figcaption> */}
      <figcaption><a ><div className="hover-desc-overlay"><span className="hover-desc-text white-text">{props.children}</span></div></a></figcaption>

      <div className='img-placeholder' style={isLoaded ? { display: 'none' } : {}}></div>
      <img style={isLoaded ? {} : { display: 'none' }} src={props.src} alt="" onLoad={() => setIsLoaded(true)} />
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

            newState.blogPostHtml = { __html: post + '<hr><p>' + tagsString + '</p>' };
            newState.currentBlogPostIndex = indexToGet;

            return newState;
          })
        });
    })

}

// Exporting the component
export default CortexHome;
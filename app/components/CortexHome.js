const React = require('react');
const ReactDOM = require('react-dom');

const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;
const CSSTransition = require('react-transition-group').CSSTransition;




function CortexHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [state, setState] = useState({
    isBodyScrolledToTop: true
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
  }, []);
  
  
  
  return (
    <div id="root-contained">
      <header>
        <CSSTransition in={isScrolled} appear={false} timeout={1000} classNames="shrink">
          <img id="logo" className="logo-initial" src="./assets/home/500px-Human_brain.jpg" />
        </CSSTransition>
      <h1 id="title">Seldon Cortex</h1>
      </header>
      <div id="center-panels-container">
      <section className="panel">
        <h2>My Work</h2>
        <div id="grid">
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/bGLgzga" target="_blank" src="./assets/home/Kiwi Derp.png"> 
            <h3 style={{lineHeight: '.7em'}}>Kiwi Derp <br/><span className="hover-desc-overlay-subheading">Flappy Bird clone built with Phaser</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNppPyq" target="_blank" src="./assets/home/React Pomodoro Clock Square.png">
          <h3 style={{lineHeight: '.7em'}}>Pomodoro Timer <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/qBpaBBa" target="_blank" src="./assets/home/React Calculator Square.png">
          <h3 style={{lineHeight: '.7em'}}>Calculator <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/WNXzzRx" target="_blank" src="./assets/home/React Drum Machine Square.png">
          <h3 style={{lineHeight: '.7em'}}>Weird Sound Board <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/mdqBRrw" target="_blank" src="./assets/home/React Markdown Previewer Square.png">
          <h3 className="black-text" style={{lineHeight: '.7em'}}>Markdown Previewer <br/><span className="hover-desc-overlay-subheading">built with React</span></h3>
          </HoverDescAnchor>
          <HoverDescAnchor href="https://codepen.io/stan-stan/full/rNYWLvq" target="_blank" src="./assets/home/React Quote Generator Square.png">
          <h3 className="black-text">Random Quote Generator <br/><span className="hover-desc-overlay-subheading" style={{lineHeight: '.7em'}}>built with React</span></h3>
          </HoverDescAnchor>
        </div>
      </section>
      </div>
      <footer>
        <strong>S. G. Stanislaus Copyright  2022</strong> 
        <br />
        <a href="https://en.wikipedia.org/wiki/File:Human_brain.jpg">Header image source</a>, licensed under Creative Commons Attribution-Share Alike 3.0 Unported 
      </footer>
    </div>
  )
}

function HoverDescAnchor(props) {

  console.log('boom');
  return (
    <div className="hover-desc-anchor">

<a href={props.href} target={props.target ? props.target : '_blank'}><div className="hover-desc-overlay"><span className="hover-desc-text white-text">{props.children}</span></div></a>
     <img src={props.src} />
    </div>
  )
}

// Exporting the component
export default CortexHome;
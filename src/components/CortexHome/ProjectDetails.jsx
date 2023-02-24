import { CSSTransition } from 'react-transition-group';
const React = require('react');
const useState = React.useState;



function ProjectDetails(props) {
  const [projectDetail, setProjectDetail] = useState(null);
  const [isProjectToProjectTransition, setIsProjectToProjectTransition] = useState(false);

  if (props.portfolioPresentation !== 'grid' && props.portfolioPresentation !== projectDetail) {
    setProjectDetail(props.portfolioPresentation)
  }

  let exitingProjectDetail = null;
  if (isProjectToProjectTransition) {
    if (props.projectGridOrderObj[projectDetail] !== 0) {
      exitingProjectDetail = props.projectGridOrderArr[props.projectGridOrderObj[projectDetail] - 1];
    } else {
      exitingProjectDetail = props.projectGridOrderArr[props.projectGridOrderObj['**maxIndex**']];
    }
  }
  console.log({isProjectToProjectTransition});
  console.log({exitingProjectDetail});
  console.log({enteringProjectDetail: projectDetail});
  return (
    (isProjectToProjectTransition)
      ? (
        <>
          <CSSTransition in={false} appear={false} enter={true} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              projectDetailsDataObj={props.projectDetailsDataObj}
              projectDetail={exitingProjectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setState={props.setState}
              projectGridOrderArr={props.projectGridOrderArr}
              projectGridOrderObj={props.projectGridOrderObj}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
          <CSSTransition in={props.portfolioPresentation === 'grid' ? false : true} appear={true} enter={false} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              projectDetailsDataObj={props.projectDetailsDataObj}
              projectDetail={projectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setState={props.setState}
              projectGridOrderArr={props.projectGridOrderArr}
              projectGridOrderObj={props.projectGridOrderObj}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
        </>
      )
      : (
        <>
          <CSSTransition in={props.portfolioPresentation === 'grid' ? false : true} appear={false} enter={true} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              projectDetailsDataObj={props.projectDetailsDataObj}
              projectDetail={projectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setState={props.setState}
              projectGridOrderArr={props.projectGridOrderArr}
              projectGridOrderObj={props.projectGridOrderObj}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
          <CSSTransition in={false} appear={true} enter={false} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              projectDetailsDataObj={props.projectDetailsDataObj}
              projectDetail={projectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setState={props.setState}
              projectGridOrderArr={props.projectGridOrderArr}
              projectGridOrderObj={props.projectGridOrderObj}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
        </>
      )
  )


}

function ProjectDetailsSubcomponent(props) {
  return (
    (props.projectDetail)
      ? (
        <section className='panel portfolio-presentation-detailed-hidden' id='portfolio-presentation-detailed'>
          <div className='white-text'>
            {props.projectDetailsDataObj[props.projectDetail].heading}
            <div className='write-up'>
              <div className='write-up-grid'>


                {props.projectDetailsDataObj[props.projectDetail].mainContent}



              </div>
              <div className='write-up-button-container'>
                <button onClick={() => props.setState(oldState => {
                  props.setIsProjectToProjectTransition(false);
                  let newState = { ...oldState };
                  newState.portfolioPresentation = "grid";
                  window.scrollTo(0, 0);
                  return newState;
                })}>
                  Back to projects
                </button>
                <button onClick={() => props.setState(oldState => {
                  let newState = { ...oldState };
                  let nextPresentation;
                  if (props.projectGridOrderObj[props.projectDetail] !== props.projectGridOrderObj['**maxIndex**']) {
                    nextPresentation = props.projectGridOrderArr[props.projectGridOrderObj[props.projectDetail] + 1];
                  } else {
                    nextPresentation = props.projectGridOrderArr[0];
                  }
                  props.setIsProjectToProjectTransition(true);
                  newState.portfolioPresentation = nextPresentation;
                  window.scrollTo(0, 0);
                  return newState;
                })}>
                  Next project
                </button>
              </div>
            </div>
          </div>
        </section>
      )
      : (
        null
      )
  )
}



// Exporting the component
export default ProjectDetails;
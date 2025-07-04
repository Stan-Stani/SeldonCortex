import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';

interface ProjectDetailsProps {
  portfolioPresentation: string;
  projectGridOrderObj: Record<string, number>;
  projectGridOrderArr: string[];
  slideRightAnimationClassNames: any;
  slideLeftAnimationClassNames: any;
  projectDetailsDataObj: Record<string, any>;
  setState: (callback: (oldState: any) => any) => void;
}

interface ProjectDetailsSubcomponentProps extends ProjectDetailsProps {
  projectDetail: string | null;
  setToggleIn: (value: boolean | ((prev: boolean) => boolean)) => void;
  setIsProjectToProjectTransition: (value: boolean) => void;
  setProjectDetail: (value: string | null) => void;
}

function ProjectDetails(props: ProjectDetailsProps) {
  const [projectDetail, setProjectDetail] = useState<string | null>(null);
  const [isProjectToProjectTransition, setIsProjectToProjectTransition] = useState(false);
  const [toggleIn, setToggleIn] = useState(false);

  if (props.portfolioPresentation !== 'grid' && props.portfolioPresentation !== projectDetail) {
    setProjectDetail(props.portfolioPresentation)
  }

  let exitingProjectDetail: string | null = null;
  if (isProjectToProjectTransition && projectDetail) {
    if (props.projectGridOrderObj[projectDetail] !== 0) {
      exitingProjectDetail = props.projectGridOrderArr[props.projectGridOrderObj[projectDetail] - 1];
    } else {
      exitingProjectDetail = props.projectGridOrderArr[props.projectGridOrderObj['**maxIndex**']];
    }
  }

  return (
    (isProjectToProjectTransition)
      ? (
        <>
          <CSSTransition in={!toggleIn} appear={false} enter={true} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              {...props}
              setToggleIn={setToggleIn}
              projectDetail={!toggleIn ? projectDetail : exitingProjectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
          <CSSTransition in={toggleIn} appear={true} enter={true} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              {...props}
              setToggleIn={setToggleIn}
              projectDetail={toggleIn ? projectDetail : exitingProjectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
        </>
      )
      : (
        <>
          <CSSTransition in={props.portfolioPresentation === 'grid' ? false : true} appear={false} enter={true} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              {...props}
              setToggleIn={setToggleIn}
              projectDetail={projectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
          <CSSTransition in={false} appear={true} enter={false} timeout={1000} classNames={props.portfolioPresentation === 'grid' ? props.slideRightAnimationClassNames : props.slideLeftAnimationClassNames}>
            <ProjectDetailsSubcomponent
              {...props}
              setToggleIn={setToggleIn}
              projectDetail={projectDetail}
              setIsProjectToProjectTransition={setIsProjectToProjectTransition}
              setProjectDetail={setProjectDetail}
            />
          </CSSTransition >
        </>
      )
  )


}

function ProjectDetailsSubcomponent(props: ProjectDetailsSubcomponentProps) {
  return (
    (props.projectDetail)
      ? (
        <section className='panel portfolio-presentation-detailed-hidden' id='portfolio-presentation-detailed'>
          <div className='white-text'>
            {props.projectDetailsDataObj[props.projectDetail].heading}
            <div className='project-details'>
              <div className='project-details-grid'>


                {props.projectDetailsDataObj[props.projectDetail].mainContent}



              </div>
              <div className='project-details-button-container'>
                <button onClick={() => props.setState((oldState: any) => {
                  props.setIsProjectToProjectTransition(false);
                  let newState = { ...oldState };
                  newState.portfolioPresentation = "grid";
                  props.setToggleIn(false);
                  window.scrollTo(0, 0);
                  return newState;
                })}>
                  Back to main menu
                </button>
                <button onClick={() => props.setState((oldState: any) => {
                  let newState = { ...oldState };
                  let nextPresentation;
                  if (props.projectDetail && props.projectGridOrderObj[props.projectDetail] !== props.projectGridOrderObj['**maxIndex**']) {
                    nextPresentation = props.projectGridOrderArr[props.projectGridOrderObj[props.projectDetail] + 1];
                  } else {
                    nextPresentation = props.projectGridOrderArr[0];
                  }
                  props.setIsProjectToProjectTransition(true);
                  props.setToggleIn((oldBool: boolean) => !oldBool);
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
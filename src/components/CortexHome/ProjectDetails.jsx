
//If page is scrolled down already on page reload then don't run animation for header shrink

const React = require('react');



function ProjectDetails(props) {

  let meat = "NULL";
  switch (props.portfolioPresentation) {
    case 'Booktown':
      meat = <div>
        <h2 id="booktown">Booktown</h2>
        <ul>
          <li>Used React, Redux, Chakra-UI, OpenLibrary API, Firebase, and TypeScript to create an eCommerce SPA website in a team of 5</li>
          <li>Employed Scrum/Agile framework</li>
          <li>My main job was to connect the API to all the product and search pages, as well as integrating the product pages with the cart</li>
          <li>See the live app at: <a href="https://cheery-kataifi-feac13.netlify.app/">https://cheery-kataifi-feac13.netlify.app/</a></li>
        </ul>
      </div>
      break;
  }


  return (
    <div className='write-up white-text'>
      {meat}
      <button onClick={() => props.onButtonClick()}>Back to projects</button>
    </div>
  )
}



// Exporting the component
export default ProjectDetails;
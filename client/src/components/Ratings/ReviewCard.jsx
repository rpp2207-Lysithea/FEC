import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import Modal from './modal.jsx';
import API from '../../API/Ratings.js';

let ReviewCard = (props) => {
  // May want to refactor this to happen before the data is returned to this component
  //   could have the date object inside data already have this work done.
  // Could even do this with the body - could send an already shortened portion of the body
  var date = new Date(props.data.date);
  date = format(date, 'MMM d, y');

  const [displayFullBody, setDisplay] = useState(false);
  const [modal, setModal] = useState(null);
  const [helpfulness, setHelpfulness] = useState(props.data.helpfulness);
  const [reviewed, setReviewed] = useState(false);
  const [reported, setReported] = useState(false);

  let shortBody, shortText;
  if (props.data.body.length > 250) {
    shortBody = props.data.body.slice(0, 250) + '...';
  } else {
    shortBody = props.data.body;
    shortText = true;
  }

  let renderBody = null;
  if (displayFullBody) {
    renderBody = props.data.body;
  } else {
    renderBody = shortBody;
  }

  let imageModal = (e) => {
    let componentInfo = (
      <img src={e.target.src}
        alt='Sorry, the image could not be loaded at this time, please try again later.'/>
    );
    setModal(<Modal src={e.target.src} onClick={onModalClick} componentData={componentInfo}/>);
  };

  let onModalClick = () => {
    setModal(null);
  };

  let onHelpfulClick = (e) => {
    API.helpfulReview(e.target.parentNode.id)
      .then(data => {
        if (data) {
          setHelpfulness(helpfulness + 1);
          setReviewed(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  let onReportClick = (e) => {
    API.reportReview(e.target.parentNode.id)
      .then(data => {
        if (data === true) {
          setReported(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className = 'userReview'>
      <div className='flex-box'>
        <div className='starHolder'>
          {props.generateStars(props.data.rating, 'userReview')}
        </div>
        <h6 className='username'>{`${props.data.reviewer_name}, ${date}`}</h6>
      </div>
      <h3 className='summary'>{props.data.summary}</h3>
      <p className='reviewBody'>{renderBody}</p>

      {(!displayFullBody && !shortText) &&
        <p className='show-more-review' onClick={() => setDisplay(!displayFullBody)}>Show more.</p>}

      {props.data.recommend &&
        <p>✓ I recommend this product</p>}

      {props.data.response !== '' &&
        <p className='companyResponse'>{props.data.response}</p>}

      <h6 id={props.data.review_id} className='reviews-helpfulness'>
        Helpful?
        {!reviewed ?
          <u onClick={onHelpfulClick} className='reviews-helpful'>Yes</u> :
          <u className='reviews-helpful'>Yes</u>
        }

        {`(${helpfulness})`} |

        {reported ?
          <u style={{color: 'red'}}>REPORTED</u> :
          <u className='reviews-report' onClick={onReportClick}>Report</u>
        }
      </h6>

      <div className='thumbnail-holder'>
        {props.data.photos.map((element, idx) => {
          return (
            <img key={`${props.data.reviewer_name} image - ${idx + 1}`}
              className='review-thumbnail'
              src={element.url}
              alt={`${props.data.reviewer_name} image - ${idx + 1}`}
              onClick={imageModal}
            />
          );
        })}
        {modal}
      </div>
    </div>
  );
};

export default ReviewCard;
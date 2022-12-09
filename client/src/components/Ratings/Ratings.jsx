import React, { useState, useEffect } from 'react';
import ratingsAPI from '../../API/Ratings.js';
import UserReviews from './ReviewCard.jsx';
import Metadata from './metadata/Metadata.jsx';

const Ratings = (props) => {
  // use 71697 for testing
  const holderReviewData = {
    "product": "2",
    "page": 0,
    "count": 5,
    "results": []
  };

  const product_id = props.objID;

  // Refering to the review list
  const [reviewData, setReviewData] = useState(holderReviewData);
  const [isLoadingreview, setIsLoadingreview] = useState(true);
  const [category, setCategory] = useState(null);
  const [reviewError, setReviewError] = useState('Loading reviews.');

  // Refering to metadata
  const [metadata, setMetadata] = useState({});
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [metaError, setMetaError] = useState('Loading metadata.');

  /**
   *
   * @param {*} id - product_id which can be found from the url
   * @param {*} sort - sort preferenced based on the front end input
   * @param {*} page - Speciries the page from which the results are returned
   * @param {*} count - Tells how many results per page
   */
  let getReviewList = (id, sort = 'relevant', rating = [], page = 1, count = 5) => {
    console.log('hi')
    return ratingsAPI.getReviewList(product_id, rating, sort, page, count)
      .then(data => {
        console.log('Success!', data);
        setReviewData(data);
        return data;
      })
      .catch(err => {
        console.log('Uh-oh! There was an error: ', err);
      });
  };

  useEffect(()=> {
    ratingsAPI.getAll(product_id)
      .then(data=> {
        if (data[0].results.length === 0) {
          throw new Error('No data found');
        }
        setMetadata(data[1]);
        setReviewData(data[0]);

        setIsLoadingMeta(false);
        setIsLoadingreview(false);

        setMetaError('');
        setReviewError('');
      })
      .catch(err => {
        console.log('There was an error:', err);
        let errMsg = 'Uh-oh! There was an error when trying to retrieve the data. Please try again later.';
        setMetaError(errMsg);
        setReviewError(errMsg);
      });
  }, []);

  let catChange = (e) => {
    setCategory(e.target.value);
    getReviewList(product_id, e.target.value, ratings);
  };

  let useRating = async (e) => {
    let holder;
    if (e.target.id === '') {
      return;
    }

    if (e.target.id === 'resetRatingsFilters') {
      setRatings([]);
      return await getReviewList(product_id, category);
    }
    // This will be taken out when I toggle the ratings
    if (ratings.includes(e.target.id)) {
      holder = JSON.parse(JSON.stringify(ratings));
      holder.splice(holder.indexOf(e.target.id), 1);
      setRatings(holder);
      return await getReviewList(product_id, category, holder);
    } else {
      setRatings([...ratings, e.target.id]);
      return await getReviewList(product_id, category, [...ratings, e.target.id]);
    }
  };

  return (
    <div className='ratings'>
      <div className='metaDataDisplay'>
        {!isLoadingMeta &&
        <Metadata generateStars={props.generateStars} meta={metadata} useRatings = {useRating}/>}
        {metaError &&
        <div>
          {props.generateStars(0)}
          <p className='errorMsg'>{metaError}</p>
        </div>
        }
      </div>
      <div className='user-review-wrapper'>
        <div className='reviewListHeading'>
          <label>{reviewData.results.length} reviews, sorted by </label>
          <select id='sortBy' onChange={catChange}>
            <option value='relevance'>relevance</option>
            <option value='newest'>newest</option>
            <option value='helpful'>most helpful</option>
          </select>
        </div>
        {!isLoadingreview &&
        <div className='userReviews'>
          {reviewData.results.map((elem, idx) => {
            return (
              <UserReviews generateStars = {props.generateStars} key={`reviews-${idx}`} data={elem}/>
            );
          })}
        </div>
        }
        {reviewError &&
        <p className='errorMsg'>{reviewError}</p>}

      </div>

    </div>

  );
};

export default Ratings;
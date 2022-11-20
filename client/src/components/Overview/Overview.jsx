import React, { useState, useEffect } from 'react';
import api from '../../API/Overview.js';

const Overview = (props) => {

  useEffect(() => {
    api.getAllProducts();
  }, [])

  return (
    <h1>Overview.jsx</h1>
  )
}

export default Overview;
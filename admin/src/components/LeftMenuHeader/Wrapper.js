import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import '../../styles/wrapper.css'

import Logo from '../../assets/images/user-story-logo.svg';

const Wrapper = (props) => ( <div className='wrapper project-name' style={{backgroundImage: `url(${Logo})`}}/> )


Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;

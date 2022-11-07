import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { LoadingBar } from 'strapi-helper-plugin';
import '../../styles/blogpost.css';

const BlogPost = ({ error, isFirst, isLoading, title, content, link }) => {
  if (isLoading) {
    return (
      <>
        <LoadingBar className='loading-bar-one' />
        <LoadingBar className='loading-bar-two' />
      </>
    );
  }

  if (error) {
    return null;
  }

  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={`https://blog.strapi.io/${link}`}
      className='link'
    >
      <h2>{title}</h2>
      <p className={isFirst ? 'blog-button-single' : 'blog-button-many'}>
        {content}
      </p>
    </a>
  );
};

BlogPost.defaultProps = {
  content: null,
  isFirst: false,
  link: null,
  title: null,
};

BlogPost.propTypes = {
  content: PropTypes.string,
  error: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  link: PropTypes.string,
  title: PropTypes.string,
};

export default memo(BlogPost);

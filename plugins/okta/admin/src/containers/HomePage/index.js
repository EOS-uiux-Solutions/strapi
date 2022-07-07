/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Label,InputText } from '@buffetjs/core';
import okta_logo from '../../assets/okta_logo.png';

const HomePage = () => {

  const [val, setValue] = React.useState('');

  return (
    <div>
      <h1><img src={okta_logo} width='20' /></h1>
      <br />

      <Label htmlFor="clientid" ><h3>Client ID</h3></Label> 

      <InputText
      name="clientid"
      onChange={({ target: { value } }) => {
      setValue(value);
      }}
      placeholder="Client ID"
      type="text"
      value={val}
      style={{ width: '50%' }}
      />
     
     <br />

     <Label htmlFor="clientsecret" ><h3>Client Secret</h3></Label> 

      <InputText
      name="clientsecret"
      onChange={({ target: { value } }) => {
        setValue(value);
      }}
      placeholder="Client Secret"
      type="text"
      value={val}
      style={{ width: '50%' }}
     />


    </div>
  );
};

export default memo(HomePage);

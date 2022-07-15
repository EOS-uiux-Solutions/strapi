/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { Label, InputText } from "@buffetjs/core";
import okta_logo from "../../assets/okta_logo.png";

const HomePage = () => {
  const [val, setValue] = React.useState("");

  return (
    <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
      <h1>
        <img src={okta_logo} width={100} />
      </h1>
      <br />

      <Label htmlFor="clientid">
        <h3>Client ID</h3>
      </Label>

      <InputText
        name="clientid"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={val}
      />

      <br />

      <Label htmlFor="clientsecret">
        <h3>Client Secret</h3>
      </Label>

      <InputText
        name="clientsecret"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={val}
      />

      <br />

      <Label htmlFor="domain">
        <h3>Okta Domain</h3>
      </Label>

      <InputText
        name="domain"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={val}
      />

      <br />

      <Label htmlFor="server_id">
        <h3>Authorization Server ID </h3>
      </Label>

      <InputText
        name="server_id"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={val}
      />

      <br />

      <Label htmlFor="redirect_url_frontend">
        <h3>The redirect URL to your front-end app </h3>
      </Label>

      <InputText
        name="redirect_url_frontend"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={val}
      />

      <br />

      <Label htmlFor="redirect_url">
        <h3>
          The redirect URL to add in your Okta application configurations{" "}
        </h3>
      </Label>

      <InputText
        name="redirect_url"
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        type="text"
        value={`${strapi.backendURL}/connect/okta/callback`}
        disabled
      />
      <br />
    </div>
  );
};

export default memo(HomePage);

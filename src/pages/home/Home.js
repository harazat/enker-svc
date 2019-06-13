import React from 'react';

import './home.css';
import tumoColorLogo from './tumo-color-logo.png';

import { Link } from "react-router-dom";

export default () => (
  <div className="full-background">
    <div className="caption">
      <img className="tumo-logo-caption" src={tumoColorLogo}  alt="tumo"/>
      <p className={"display-4 text-black font-weight-bold"}>
        Click <Link to="/login"><span className="text-info">here</span></Link> to start <span className="bg-light">connecting</span>
      </p>
    </div>
  </div>
);

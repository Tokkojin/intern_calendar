/*
 * This is a demo component the Eletrode app generator included
 * to show using Skeleton CSS lib (named base.css) and Redux
 * store for display HTML elements and managing states.
 *
 * To start your own app, please replace or remove these files:
 *
 * - this file (home.jsx)
 * - demo-buttons.jsx
 * - demo-pure-states.jsx
 * - demo-states.jsx
 * - reducers/index.jsx
 * - styles/*.css
 *
 */

import React from "react";
import "../styles/normalize.css";
import "../styles/raleway.css";
import skeleton from "../styles/skeleton.css";
import custom from "../styles/custom.css";
import electrodePng from "../images/electrode.png";
import DemoStates from "./demo-states";
import DemoPureStates from "./demo-pure-states";
import { DemoButtons } from "./demo-buttons";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './MyAwesomeReactComponent';
import DatePicker from './date-picker';
import SimpleList from './simple-list';
import SimpleCheckbox from './simple-checkbox';
import SimpleTable from './simple-table';
/**/

export default () =>
  <div className={custom.container}>
    {/**/}

    <section className={custom.header}>
      <h2 className={skeleton.title}>
        Hello from {" "}
        <a href="https://github.com/electrode-io">{"Electrode"} <img src={electrodePng} /></a>
      </h2>
    </section>
   
    <MuiThemeProvider>
      <div>
      <MyAwesomeReactComponent />
      <DatePicker />
      <SimpleList />
      <SimpleCheckbox />
      <SimpleTable />
      </div>
    </MuiThemeProvider>
 
  </div>;

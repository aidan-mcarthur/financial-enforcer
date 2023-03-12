import { DownloadPage } from '@src/pages/download';
import { HomePage } from '@src/pages/home';
import React from 'react';
import { Route } from 'react-router';
import { HashRouter, Switch } from 'react-router-dom';
import './app.scss';

const Application: React.FC = () => {
  return (
    <HashRouter hashType='noslash'>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/download' component={DownloadPage} />
      </Switch>
    </HashRouter>
  );
};

export default Application;

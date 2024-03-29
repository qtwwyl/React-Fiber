import React from 'react';

import Provider from '@store/provider';
import Header from '@components/Header';
import Aside from '@components/Aside';
import Footer from '@components/Footer';
import Loading from '@components/Loading';

import { Props } from 'src/types';

import './index.scss';

const Layout = (props: Props) => (
  <Provider>
    <Header />
    <main className="layout">
      <Aside />
      <div className="layout-main">{props.children}</div>
    </main>
    <Footer />
    <Loading />
  </Provider>
);

export default Layout;

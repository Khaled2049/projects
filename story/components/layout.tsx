import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface ILayoutProps {
  children?: JSX.Element | JSX.Element[];
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

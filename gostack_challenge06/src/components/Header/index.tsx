import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Container, LinkText } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => (
  <Container size={size}>
    <header>
      <img src={Logo} alt="GoFinances" />
      <nav>
        <Link
          to="/"
          style={
            useLocation().pathname === '/'
              ? { pointerEvents: 'none' }
              : undefined
          }
        >
          <LinkText selectedThis={useLocation().pathname === '/'}>
            Listagem
          </LinkText>
        </Link>
        <Link
          to="/import"
          style={
            useLocation().pathname === '/import'
              ? { pointerEvents: 'none' }
              : undefined
          }
        >
          <LinkText selectedThis={useLocation().pathname === '/import'}>
            Importar
          </LinkText>
        </Link>
      </nav>
    </header>
  </Container>
);

export default Header;

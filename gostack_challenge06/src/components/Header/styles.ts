import styled from 'styled-components';

interface LinkTextProps {
  selectedThis?: boolean;
}

interface ContainerProps {
  size?: 'small' | 'large';
}

export const LinkText = styled.p<LinkTextProps>`
  display: inline;
  border-bottom: 2px solid
    ${({ selectedThis }) => (selectedThis ? '#ff872c' : '#5636d3')};
  padding-bottom: 10px;
`;

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
`;

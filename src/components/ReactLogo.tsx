import React, { PureComponent } from 'react';
import styled from 'styled-components';

const StyledRoot = styled.figure`
  animation: rotate 5s linear infinite;
  height: 100%;
  margin: 0;
  padding: 0;
  transform-origin: center;

  & > svg {
    height: 100%;
    width: auto;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface Props {
  className: string;
}

class ReactLogo extends PureComponent<Partial<Props>> {
  render() {
    const { className } = this.props;

    return (
      <StyledRoot className={className} dangerouslySetInnerHTML={{ __html: require(`!raw-loader!@/assets/images/react-logo.svg`) }}/>
    );
  }
}

export default ReactLogo;

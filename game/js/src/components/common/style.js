import styled from 'styled-components';

export const Title = styled.span`
  text-align: ${(props) => props.number ?
    'right' :
    props.align ?
    props.align :
    'justify'};
  font-size: 0.9rem;
  color: ${(props) => props.light ?
    'var(--alt-text-color)' :
    'var(--default-text-color)'};
`;

export const Text = styled.p`
  text-align: ${(props) => props.number ?
    'right' :
    props.align ?
    props.align :
    'justify'};
  font-size: ${(props) => props.highlight ? '1.4rem': '0.9rem'};
  line-height: ${(props) => props.highlight ? '1.15': '1.75'};
  color: ${(props) => props.light ?
    'var(--alt-text-color)' :
    'var(--default-text-color)'};
  margin: ${(props) => props.highlight ?
    '0.1rem 0' :
    props.margin ?
    props.margin :
    'initial'};
`;

export const PanelWrapper = styled.div`
  box-shadow: 0.2rem 0.3rem var(--off-background-color);
  background-color: var(--alt-background-color);
  border-radius: 6px;
  padding: 1rem;
  margin: 0.5rem 0;
`;
export const BaseMessage = styled.div`
  box-sizing: border-box;
  margin 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
`;

export const MessageSuccess = styled(BaseMessage)`
  background: #4E937A;
  color: white;
`;

export const MessageError = styled(BaseMessage)`
  background: #B4656F;
  color: white;
`;

export const Button = styled.button`
  padding: ${(props) => props.icon ?
    '0.25rem 0.25rem' :
    '0.5rem 1rem'};
  margin: ${(props) => props.noMargin ?
    '0' :
    '0.5rem 0'};
  margin-right: 0.25rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  background: none;
  outline: ${(props) => props.success ?
    'none' :
    'initial'};
  color: ${(props) => props.disabled ?
    'var(--disabled-text-color)' :
    'var(--default-text-color)'};
  background-color: var(--alt-background-color);
  border: none;
  };
`;

export const PureButton = styled.button`

`;

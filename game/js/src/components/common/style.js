import styled from "styled-components"

export const Title = styled.span`
  text-align: ${props => props.number
    ? 'right'
    : props.align 
    ? props.align
    : 'justify'};
  font-size: 0.9rem;
`

export const LightTitle = styled(Title)`
  color: #787878;
`

export const Text = styled.p`
  text-align: ${props => props.number
    ? 'right'
    : props.align 
    ? props.align
    : 'justify'};
  font-size: 0.9rem;
  line-height: 1.75;
  color: #383838;
  margin: ${props => props.defaultMargin 
    ? '0.5rem 0' 
    : props.margin 
    ? props.margin 
    : 'initial'};
`

export const HighlightText = styled(Text)`
  margin: 0.1rem 0;
  font-size: 1.5rem;
  line-height: 1.15;
`

export const PanelWrapper = styled.div`
  box-shadow: 0.2rem 0.3rem #d3d3d3;
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 1rem;
  margin: 0.5rem 0;
`

export const BaseMessage = styled.div`
  box-sizing: border-box;
  margin 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
`

export const MessageSuccess = styled(BaseMessage)`
  background: #4E937A;
  color: white;
`

export const MessageError = styled(BaseMessage)`
  background: #B4656F;
  color: white;
`

export const Button = styled.button`
  padding: ${props => props.icon
    ? '0.25rem 0.25rem'
    : '0.5rem 1rem'};
  margin: ${props => props.noMargin 
    ? '0'
    : '0.5rem 0'};
  margin-right: 0.25rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  background: none;
  outline: ${props => props.success
    ? 'none'
    : 'initial'};
  color: ${props => props.disabled
    ? '#B8B8B8'
    : '#383838'};
  background-color: #e6e6e6;
  border: none;
  };
`

export const PureButton = styled.button`
  .pure-button {
    background-color: transparent;
  }

  .pure-button:hover,
  .pure-button:focus{
    background-image: none;
    background-color: #DCDCDC;
  }
`

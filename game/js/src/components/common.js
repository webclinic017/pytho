import React from "react"

export const PlusIcon = () => <svg height="1.5rem" width="1.5rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" className="plus-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path shapeRendering="crispEdges" fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>

export const MinusIcon = () => <svg height="1.5rem" width="1.5rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" className="minus-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path shapeRendering="crispEdges" fill="currentColor" d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>

export const Message = ({ 
  children,
  type
 }) => {
  const base = <div className="message">{children}</div>
  switch(type) {
    case "success":
      return React.cloneElement(
        base,
        { className: "message message-success" })
      break
    case "error":
      return React.cloneElement(
        base,
        { className: "message message-error" })
      break
    default:
      return base
  }
}

export const Button = ({ 
  hasMargin=true,
  onClickFunc, 
  children,
  type
 }) => {
    let baseClass = "button"
    baseClass+= hasMargin ? "" : " button-nomargin"
    baseClass+= type == "icon" ? " button-icon" : ""
    baseClass+= type == "success" ? " button-success": ""
    return <button className={baseClass} onClick={onClickFunc}>{children}</button>
}

export const RenderIf = ({ cond, children }) => {
  return cond ? <React.Fragment>{children}</React.Fragment> : null  
}

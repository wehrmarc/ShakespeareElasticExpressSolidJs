import { Component, JSXElement } from "solid-js";

interface Props {
  children?: JSXElement;
  class?: string;
}

const Card: Component<Props> = (props) => {
  return (
    <div
    class={`bg-white px-5 py-4 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto rounded-lg ${props.class}`}
  >
    {props.children}
  </div>
  )
}

export default Card;
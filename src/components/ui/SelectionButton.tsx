import * as React from "react"
import ReactDOM from "react-dom/client"

const { useState } = React;

function MyButton() {
  const [btnClass, setBtnClass] = useState(false);
  const [btnColor, setBtnColor] = useState("red");
  return (
    <div className="MyButton">
      <button
        onClick={() => {
          btnClass ? setBtnClass(false) : setBtnClass(true);
        }}
        className={btnClass ? "btnClass clicked" : "btnClass"}
      >
        button
      </button>
      <button
        onClick={() => {
          btnColor === "red" ? setBtnColor("green") : setBtnColor("red");
        }}
        style={{ backgroundColor: btnColor }}
      >
        button
      </button>
    </div>
  );
}
export default MyButton 
import { useState } from "react";

const useToggle = (initial = false) => {
  const [state, setState] = useState(initial);
  const toggle = () => setState((prev) => !prev);
  return [state, toggle];
};

export default useToggle;

import React, { useState } from "react";
import { Button } from 'semantic-ui-react';

const Sandbox = () => {
  const [count, setCount] = useState(0);

  return (
    <Button
      onClick={() => setCount(count + 1)}
    >{count}</Button>
  );
};

export default Sandbox;
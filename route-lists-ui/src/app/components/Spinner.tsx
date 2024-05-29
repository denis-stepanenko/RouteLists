import { useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    inverted?: boolean;
    content?: string;
}

export default function Spinner({inverted = true } : Props) {

  const loadingTimeout = setTimeout(() => {
    
    setStartToShow(true);
    clearTimeout(loadingTimeout);
  }, 700)

  const [startToShow, setStartToShow] = useState(false);

  return (
    <Dimmer active={startToShow} inverted={inverted}>
        <Loader size='huge'/>
    </Dimmer>
  )
}

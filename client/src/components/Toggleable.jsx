import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  return (
    <div className='flex flex-col items-center gap-4'>
      {!visible && props.iconTrigger && (
        <div onClick={toggleVisibility} className='cursor-pointer'>
          {props.iconTrigger}
        </div>
      )}
      {visible && (
        <div className='togglableContent flex flex-col items-center gap-4 w-full'>
          {props.children}
          <Button variant='contained' onClick={toggleVisibility}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
});

Toggleable.displayName = 'Toggleable';

Toggleable.propTypes = {
  buttonLabel: PropTypes.string,
  iconTrigger: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Toggleable;

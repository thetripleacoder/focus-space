import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const Toggleable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div className='flex items-center justify-center flex-col gap-4 m-4 '>
      <div style={hideWhenVisible} className=' flex flex-col gap-4'>
        <Button variant='contained' onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div
        style={showWhenVisible}
        className='togglableContent flex items-center justify-center flex-col'
      >
        {props.children}
        <Button variant='contained' onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </div>
  );
});
Toggleable.displayName = 'Toggleable';

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};

export default Toggleable;

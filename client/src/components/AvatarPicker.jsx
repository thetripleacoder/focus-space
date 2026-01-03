import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Avatar, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const styles = [
  'micah',
  'bottts',
  'pixel-art',
  'adventurer',
  'avataaars',
  'croodles',
];

const AvatarPicker = ({ onSelect, username }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (url) => {
    setSelected(url);
    onSelect(url); // Pass chosen avatar URL to parent
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))',
        gap: 2,
        justifyItems: 'center',
        maxWidth: 400,
      }}
    >
      {styles.map((style) => {
        const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(
          username || 'guest'
        )}`;
        return (
          <Box key={style} sx={{ position: 'relative' }}>
            <Avatar
              src={url}
              alt={style}
              sx={{
                width: 64,
                height: 64,
                border:
                  selected === url
                    ? '2px solid #1976d2'
                    : '2px solid transparent',
                cursor: 'pointer',
              }}
              onClick={() => handleSelect(url)}
            />
            {selected === url && (
              <IconButton
                size='small'
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  color: '#1976d2',
                  background: 'white',
                }}
              >
                <CheckCircleIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

AvatarPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default AvatarPicker;

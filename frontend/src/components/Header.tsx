import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ScienceIcon from '@mui/icons-material/Science';
import { userContext } from '../state/user/userContext';
import { useNavigate } from 'react-router-dom';
import { LoginAvatar } from './LoginAvatar';
import {
  corpora,
  media,
  metadata,
  references,
  sources,
  tags,
} from '../model/Resources';
import { Version } from './Version';
import { useImmer } from 'use-immer';
import ErrorBoundary from './common/error/ErrorBoundary';

const pages = [corpora, sources, tags, metadata, media, references];
const settings: JSX.Element[] = [<Version key={1} />];

export default function Header() {
  const navigate = useNavigate();
  const user = useContext(userContext);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ScienceIcon
            onClick={() => navigate('/')}
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 0.5 }}
          />
          <Typography
            onClick={() => navigate('/')}
            variant="h6"
            noWrap
            component="span"
            sx={{
              cursor: 'pointer',
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DEXTER
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user.userState.username &&
              pages.map(page => (
                <Button
                  key={page}
                  onClick={() => navigate('/' + page)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
          </Box>
          {user.userState.username ? (
            <UserMenu />
          ) : (
            <ErrorBoundary>
              <LoginAvatar />
            </ErrorBoundary>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function UserMenu() {
  const username = useContext(userContext).userState.username;

  const [anchorElUser, setAnchorElUser] = useImmer<HTMLElement>(null);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar>{username[0].toUpperCase()}</Avatar>
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem style={{ cursor: 'default', borderBottom: '1px solid #ccc' }}>
          <Typography textAlign="center">{username}</Typography>
        </MenuItem>
        {settings.map((setting, i) => (
          <MenuItem key={i} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

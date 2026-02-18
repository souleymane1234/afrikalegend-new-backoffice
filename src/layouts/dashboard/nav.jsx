import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';
import { useRouter, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {apiUrlAsset} from 'src/constants/apiUrl';
import { useAdminStore } from 'src/store/useAdminStore';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  // const pathname = usePathname();
  const { admin } = useAdminStore();
  console.log(`${apiUrlAsset.avatars}/${admin.logo}`);


  const upLg = useResponsive('up', 'lg');

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={`${apiUrlAsset.avatars}/${admin.logo}`} alt={`${apiUrlAsset.avatars}/${admin.logo}`} />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{admin.nom_complet}</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography> */}
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => {
        if(admin && item.protected && item.protected.includes(admin.role)) {
          return <NavItem key={item.title} item={item} />;
        } 
        return null;
          
        
      })}
      <Logout />
    </Stack>
  );

  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
        <Box
          component="img"
          src="/assets/illustrations/illustration_avatar.png"
          sx={{ width: 100, position: 'absolute', top: -50 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Un problème ?</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Contactez le support technique
          </Typography>
        </Box>

        <Button
          href="https://wa.me/+2250564250219"
          target="_blank"
          variant="contained"
          color="inherit"
        >
          BoozTech
        </Button>
      </Stack>
    </Box>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack alignItems='center' justifyContent='center' direction='row' sx={{width: '100%'}}>
        <img alt='Logo' src='/assets/logo.png' style={{ width: '30%', margin: 5}} />
      </Stack>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {renderUpgrade}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const { childrenPath = [] } = item;

  const active = childrenPath.includes(`/${pathname.split('/')[1]}`);

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

function Logout() {
  const router = useRouter();
  return (
    <ListItemButton
      component={RouterLink}
      onClick={() => {
        
        localStorage.clear();
        router.back();
      }}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        <Iconify icon="solar:logout-2-bold-duotone" />
      </Box>

      <Box component="span">Deconnexion</Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

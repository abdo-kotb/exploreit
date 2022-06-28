import * as React from 'react';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import SidebarLists from './SidebarLists';
import Scrollbars from 'react-custom-scrollbars';

const Sidebar = ({ width, drawerToggle, mobile, user }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    mobile && drawerToggle();
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobile}
        onClose={drawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        <SidebarLists drawerToggle={drawerToggle} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
        open
      >
        <Scrollbars autoHide>
          <SidebarLists />
        </Scrollbars>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

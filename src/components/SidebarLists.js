import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  ListSubheader,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Logo from './Logo';
import { categories } from '../utils/data';

function SidebarLists({ drawerToggle }) {
  return (
    <div>
      <Logo color={true} />
      <Divider />
      <List component="nav" disablePadding>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding onClick={drawerToggle && drawerToggle}>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </NavLink>
        <Divider />
        <ListSubheader
          component="div"
          sx={{
            fontSize: 18,
            fontWeight: 'bold',
            position: 'initial',
          }}
        >
          Discover Categories
        </ListSubheader>
        {categories.slice(0, categories.length - 1).map((category, index) => (
          <NavLink
            className={({ isActive }) => (isActive ? 'active-link' : '')}
            to={`/category/${category.name}`}
            key={category.name}
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <ListItem disablePadding onClick={drawerToggle && drawerToggle}>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar src={category.image} alt="category" />
                </ListItemIcon>
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );
}

export default SidebarLists;

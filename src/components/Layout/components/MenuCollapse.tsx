import React, { FC, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { makeStyles } from "@mui/styles";
import clsx from 'clsx'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import { LinkMenu } from 'typings'

import styles from 'assets/jss/components/adminLayoutStyles'
import { auth } from 'firebaseSetup';
import { useAuthState } from 'react-firebase-hooks/auth';
import  useAuth  from 'hooks/useAuth'

const useStyles = makeStyles(styles)

interface Props {
  menu: LinkMenu,
  isSidebar?: boolean;
}

const MenuCollapse: FC<Props> = (props) => {
  const { menu, isSidebar } = props
  // const [user] = useAuthState(auth)
  const { user, logout } = useAuth();

  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const [expanded, setExpanded] = useState(true)

  const logoutUser = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const user = localStorage.getItem("jwtToken");
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  return (
    <Box className={clsx(classes.collpaseMenu, { [classes.sidebarCollpase]: isSidebar, [classes.noTitle]: !menu.title })} mb={1}>
      {
        menu.title && (
          <Box display='flex' alignItems='center' className={clsx(classes.collpaseHeader, {[classes.sidebarCollpaseHeader]: isSidebar})}>
            <Typography variant='body1'>
              {menu.title}
            </Typography>
            {
              !isSidebar && (
                <IconButton size='small' onClick={() => setExpanded(!expanded)}>
                  <ExpandMoreIcon />
                </IconButton>
              )
            }
          </Box>
        )
      }

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <MenuList className={clsx(classes.menuList, {[classes.collpaseMenuList]: isSidebar})}>
          {
            menu.children.map((linkItem) => (
                linkItem.link == '/surf/browse' || linkItem.link == '/surf/projects'?
                <MenuItem
                  className={clsx({ [classes.activedMenu]: location.pathname === linkItem.link })}
                  key={`${menu.id}-${linkItem.title}`}
                  onClick={() => {
                    if (linkItem.target) {
                      window.open(linkItem.link, '_blank')
                    } else {
                      navigate(linkItem.link)
                    }                  
                  }}
                >
                  <ListItemText>{linkItem.title}</ListItemText>
                  <ListItemIcon>
                    {linkItem.icon}
                  </ListItemIcon>
                </MenuItem> :
                <MenuItem
                className={clsx({ [classes.activedMenu]: location.pathname === linkItem.link })}
                key={`${menu.id}-${linkItem.title}`}
                onClick={() => {
                  if (linkItem.target) {
                    window.open(linkItem.link, '_blank')
                  } else {
                    navigate(linkItem.link)
                  }                  
                }}
                disabled
              >
                <ListItemText>{linkItem.title}</ListItemText>
                <ListItemIcon>
                  {linkItem.icon}
                </ListItemIcon>
              </MenuItem>
            ))
          }
        </MenuList>
      </Collapse>
    </Box>
  )
}

export default MenuCollapse

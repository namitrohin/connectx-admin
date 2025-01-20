import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { Form } from 'react-bootstrap';
import { SideBarStyle } from '../assets/constants/style';
import { Link, useLocation } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { useState } from 'react';
import { MdArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';
import { RiSettings4Fill } from 'react-icons/ri';
import { FaCodeBranch, FaHandsHelping, FaUserCog, FaUsers, FaFile } from 'react-icons/fa';
import { connectxLogo } from '../utils/images';
import { FaCircleExclamation, FaPersonMilitaryRifle } from 'react-icons/fa6';

export default function SideMenu() {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const locations = useLocation();

  const handleClick = (menu) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <List
        sx={{ width: '100%' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            style={SideBarStyle.MenuHeader}
            component="div"
            id="nested-list-subheader"
          >
            <div className="logobox">
              <img src={connectxLogo} alt="connectX" />
              <Form.Control type="text" placeholder="Search..." />
            </div>
          </ListSubheader>
        }
      >
        <div className="menuwrapper">
          <ListItemButton
            component={Link}
            className={`${isActive('/home') ? 'active' : ''}`}
            to="/home"
            style={SideBarStyle.MenuItemButtonItem}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <HiHome />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Home"
            />
          </ListItemButton>
          {/* menus of side bar  */}
          <ListItemButton
            component={Link}
            className={`${isActive('/branch') ? 'active' : ''}`}
            to="/branch"
            style={SideBarStyle.MenuItemButtonItem}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaCodeBranch />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Branches"
            />
          </ListItemButton>
          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('users')}
            className={`${isActive('/users', locations) ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              {/* <IoLayers /> */}
              <FaUsers />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Users"
            />
            {openSubmenus.menus ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['users'] ||
              (isActive('/users', locations) &&
                !locations.pathname.startsWith('/users/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/users/admin') ? 'active' : ''}`}
                to="/users/admin"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Admin"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/users/branch-manager') ? 'active' : ''
                  }`}
                to="/users/branch-manager"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Branch Users"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/users/ops-manager') ? 'active' : ''}`}
                to="/users/ops-manager"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="OPS Manager"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/users/area-manager') ? 'active' : ''}`}
                to="/users/area-manager"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Area Manager"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/users/trainer') ? 'active' : ''}`}
                to="/users/trainer"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Trainer User"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/users/hr') ? 'active' : ''}`}
                to="/users/hr"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="HR"
                />
              </ListItemButton>

              {/* second menus  */}
            </List>
          </Collapse>
          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('guards')}
            className={`${isActive('/guards') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaPersonMilitaryRifle />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Guards"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['guards'] ||
              (isActive('/guards', locations) &&
                !locations.pathname.startsWith('/guards/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/guards/guard-designation') ? 'active' : ''
                  }`}
                to="/guards/guard-designation"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Guard-Designation"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/guards/guards') ? 'active' : ''}`}
                to="/guards/guards"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Guards"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/guards/attendance') ? 'active' : ''}`}
                to="/guards/attendance"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Attendance"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/guards/qr-connect') ? 'active' : ''}`}
                to="/guards/qr-connect"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="QR Connect"
                />
              </ListItemButton>
            </List>
          </Collapse>
          {/* third menu  */}

          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('grievance')}
            className={`${isActive('/grievances') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaCircleExclamation />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Grievance"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['grievance'] ||
              (isActive('/grievances', locations) &&
                !locations.pathname.startsWith('/grievances/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/grievances/grievance') ? 'active' : ''
                  }`}
                to="/grievances/grievance"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Grievance"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/grievances/issue-cat') ? 'active' : ''
                  }`}
                to="/grievances/issue-cat"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Grievance Issue Category"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/grievances/sub-issue-cat') ? 'active' : ''
                  }`}
                to="/grievances/sub-issue-cat"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Grievance Issue Sub Category"
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                className={`${isActive('/grievances/issue-detail') ? 'active' : ''
                  }`}
                to="/grievances/issue-detail"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Grievance Issue Detail"
                />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('sahyog')}
            className={`${isActive('/sahyogs') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaHandsHelping />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Sahyog"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>

          <Collapse
            in={
              openSubmenus['sahyog'] ||
              (isActive('/sahyogs', locations) &&
                !locations.pathname.startsWith('/sahyogs/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/sahyogs/reason') ? 'active' : ''}`}
                to="/sahyogs/reason"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Sahyog Reason"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/sahyogs/sahyog') ? 'active' : ''}`}
                to="/sahyogs/sahyog"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Sahyog"
                />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('customers')}
            className={`${isActive('/customers') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaUserCog />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Customers"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['customers'] ||
              (isActive('/customers', locations) &&
                !locations.pathname.startsWith('/customers/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/customers/customer-group') ? 'active' : ''
                  }`}
                to="/customers/customer-group"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Customer Group"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/customers/customer') ? 'active' : ''}`}
                to="/customers/customer"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Customer"
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                className={`${isActive('/customers/customer-checkpoints') ? 'active' : ''
                  }`}
                to="/customers/customer-checkpoints"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Customer Check Points"
                />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('incident')}
            className={`${isActive('/incidents') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <RiSettings4Fill />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Incident"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['incident'] ||
              (isActive('/incidents', locations) &&
                !locations.pathname.startsWith('/incidents/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/customers/customer-group') ? 'active' : ''
                  }`}
                to="/incidents/guard-incident"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Guard Incident"
                />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('reports')}
            className={`${isActive('/reports') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaFile />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Reports"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['reports'] ||
              (isActive('/reports', locations) &&
                !locations.pathname.startsWith('/reports/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/reports/qr-reports') ? 'active' : ''
                  }`}
                to="/reports/qr-reports"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="QR Scan Reports"
                />
              </ListItemButton>
            </List>
          </Collapse>


          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('training')}
            className={`${isActive('/training') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaFile />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Training"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['training'] ||
              (isActive('/training', locations) &&
                !locations.pathname.startsWith('/training/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/training/schedule') ? 'active' : ''
                  }`}
                to="/training/schedule"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Schedule"
                />
              </ListItemButton>
            </List>
          </Collapse>


          <ListItemButton
            style={SideBarStyle.MenuItemButtonItem}
            onClick={() => handleClick('masters')}
            className={`${isActive('/masters') ? 'active' : ''}`}
          >
            <ListItemIcon style={SideBarStyle.MenuItemButtonIcon}>
              <FaFile />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={SideBarStyle.MenuItemText}
              primary="Master"
            />
            {openSubmenus.settings ? (
              <MdArrowDropDown />
            ) : (
              <MdOutlineArrowDropUp />
            )}
          </ListItemButton>
          <Collapse
            in={
              openSubmenus['masters'] ||
              (isActive('/masters', locations) &&
                !locations.pathname.startsWith('/masters/'))
            }
            component="div"
            timeout="auto"
            unmountOnExit
            style={SideBarStyle.ActiveMenu}
          >
            <List component="div" style={SideBarStyle.SubmenuList}>
              <ListItemButton
                component={Link}
                className={`${isActive('/masters/training-category') ? 'active' : ''
                  }`}
                to="/masters/training-category"
                style={SideBarStyle.MenuItemButtonItem}
              >
                <ListItemText
                  primaryTypographyProps={SideBarStyle.MenuItemText}
                  primary="Training Category"
                />
              </ListItemButton>
            </List>
          </Collapse>
        </div>
      </List>
    </div>
  );
}

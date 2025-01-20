import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/header';
import SideMenu from './components/sideMenu';
import Admin from './pages/Users/Admin';
import BranchManager from './pages/Users/BranchManager';
import OPSManager from './pages/Users/OPSManager';
import AreaManager from './pages/Users/AreaManager';
import Trainer from './pages/Users/TrainerUser';
import HR from './pages/Users/HR';
import Branch from './pages/Branch';
import { ThemeProvider } from 'react-bootstrap';
import { createTheme } from '@mui/material';
import AddAdmin from './pages/Users/Forms/AddAdmin';
import AddAreaManager from './pages/Users/Forms/AddAreaManager';
import AddHR from './pages/Users/Forms/AddHR';
import AddTrainer from './pages/Users/Forms/AddTrainer';
import AddOPSManager from './pages/Users/Forms/AddOPSManager';
import AddBranchManager from './pages/Users/Forms/AddBranchManager';
import Login from './pages/Login/Login';
import AddBranch from './pages/AddBranch';
import AddCustomerGroup from './pages/Settings/Forms/AddCustomerGroup';
import Customer from './pages/Settings/Customer';
import AddCustomer from './pages/Settings/Forms/AddCustomer';
import Guard from './pages/Guard/Guard';
import AddGuard from './pages/Guard/Form/AddGuard';
import GuardDesignation from './pages/Guard/GuardDesignation';
import AddGuardDesignation from './pages/Guard/Form/AddGuardDesignation';
import CustomerCheckPoints from './pages/Settings/CustomerCheckPoints';
import CustomerGroup from './pages/Settings/CustomerGroup';
import { getAuthUser } from './components/CommonAuth';
import IssueCat from './pages/Settings/IssueCat';
import SubIssueCat from './pages/Settings/SubIssueCat';
import Grievance from './pages/Settings/Grievance';
import CheckPointPrint from './pages/Settings/CheckPointPrint';
import IssueDetail from './pages/Settings/IssueDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Sos from './pages/SOS/Sos';
import SahyogReason from './pages/Settings/SahyogReason';
import Sahyog from './pages/Settings/Sahyog';
import { useState } from 'react';
import GuardIncident from './pages/Incident/GuardIncident';
import MyAccount from './pages/MyAccount';
import { getToken } from 'firebase/messaging';
import { messing } from './components/FirebaseNotification';
import Notifications from './pages/Notifications';
import Attendance from './pages/Guard/Attendance';
import QRConnect from './pages/Guard/QRConnect';
import QRScanReports from './pages/Reports/QrScanReports';
import TrainingCategory from './pages/Training/TrainingCategory';
// import Schedule from './pages/Training/Schedule';
const theme = createTheme({
  typography: {
    fontSize: 15,
    fontFamily: ['Poppins'],
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 8,
        },
      },
    },
  },
});

const routes = createBrowserRouter([
  {
    path: '/',
    element: !getAuthUser() ? <Login /> : <Navigate to="/home" />,
  },
  {
    path: '/home',
    element: !getAuthUser() ? <Navigate to="/login" /> : <Home />,
  },
  {
    path: '/login',
    element: !getAuthUser() ? <Login /> : <Navigate to="/home" />,
  },
  {
    path: '/header',
    element: <Header />,
  },
  {
    path: '/side-menu',
    element: <SideMenu />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/branch',
    element: <Branch />,
  },
  {
    path: 'branch/add',
    element: <AddBranch />,
  },
  {
    path: 'my-account',
    element: <MyAccount />,
  },

  {
    path: '/notifications',
    element: <Notifications />,
  },

  {
    path: '/guards',
    element: null,
    children: [
      {
        path: 'guards',
        element: <Guard />,
      },
      {
        path: 'guards/add',
        element: <AddGuard />,
      },
      {
        path: 'guard-designation',
        element: <GuardDesignation />,
      },
      {
        path: 'guard-designation/add',
        element: <AddGuardDesignation />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'qr-connect',
        element: <QRConnect />,
      },
    ],
  },

  {
    path: '/customers',
    element: null,
    children: [
      {
        path: 'customer',
        element: <Customer />,
      },
      {
        path: 'customer-group',
        element: <CustomerGroup />,
      },
      {
        path: 'customer-group/add',
        element: <AddCustomerGroup />,
      },
      {
        path: 'customer/add',
        element: <AddCustomer />,
      },
      {
        path: 'customer-checkpoints',
        element: <CustomerCheckPoints />,
      },
      {
        path: 'checkpoint-print/:id',
        // path: 'checkpoint-print',
        element: <CheckPointPrint />,
      },
    ],
  },

  {
    path: '/grievances',
    element: null,
    children: [
      {
        path: 'issue-cat',
        element: <IssueCat />,
      },
      {
        path: 'sub-issue-cat',
        element: <SubIssueCat />,
      },
      {
        path: 'issue-detail',
        element: <IssueDetail />,
      },
      {
        path: 'grievance',
        element: <Grievance />,
      },
    ],
  },

  {
    path: '/sahyogs',
    element: null,
    children: [
      {
        path: 'reason',
        element: <SahyogReason />,
      },
      {
        path: 'sahyog',
        element: <Sahyog />,
      },
    ],
  },

  {
    path: '/users',
    element: null,
    children: [
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: 'branch-manager',
        element: <BranchManager />,
      },
      {
        path: 'ops-manager',
        element: <OPSManager />,
      },
      {
        path: 'area-manager',
        element: <AreaManager />,
      },
      {
        path: 'trainer',
        element: <Trainer />,
      },
      {
        path: 'hr',
        element: <HR />,
      },
      {
        path: 'admin/add',
        element: <AddAdmin />,
      },
      {
        path: 'area-manager/add',
        element: <AddAreaManager />,
      },
      {
        path: 'hr/add',
        element: <AddHR />,
      },
      {
        path: 'trainer/add',
        element: <AddTrainer />,
      },
      {
        path: 'ops-manager/add',
        element: <AddOPSManager />,
      },
      {
        path: 'branch-manager/add',
        element: <AddBranchManager />,
      },
    ],
  },

  {
    path: '/incidents',
    element: null,
    children: [
      {
        path: 'guard-incident',
        element: <GuardIncident />,
      },
    ],
  },
  {
    path: '/reports',
    element: null,
    children: [
      {
        path: 'qr-reports',
        element: <QRScanReports />,
      },
    ],
  },
  // {
  //   path: '/training',
  //   element: null,
  //   children: [
  //     {
  //       path: 'schedule',
  //       element: <Schedule />,
  //     },
  //   ],
  // },

  {
    path: '/masters',
    element: null,
    children: [
      {
        path: 'training-category',
        element: <TrainingCategory />,
      },
    ],
  },
]);
function App() {
  const requestPermission = async () => {
    const notify = await Notification.requestPermission();
    console.log(notify);
    if (notify === 'granted') {
      // const messaging = getMessaging();
      getToken(messing, {
        vapidKey:
          'BO2W0MjN1wI9CgU31ueBCp_d9-vTeywOQF8R0oWYWdl-8sIsHwVph45W9_o1gpMV6QIqYPDqzG3N5R1rxnXJUa4',
      })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log('current token', currentToken);
            // ...
          } else {
            // Show permission request UI
            console.log(
              'No registration token available. Request permission to generate one.'
            );
            // ...
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
    } else {
      console.log(notify === 'granted');
    }
  };
  // console.log(Notification.requestPermission());
  const [triggerSOS, setTriggerSOS] = useState(true);

  // useEffect(() => {
  //   setInterval(() => {
  //     setTriggerSOS((prev) => !prev);
  //   }, 100000);
  //   requestPermission();
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={routes} />
      {getAuthUser() && <Sos triggerSOS={triggerSOS} />}
    </ThemeProvider>
  );
}

export default App;

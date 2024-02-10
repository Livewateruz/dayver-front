import { lazy } from 'react';
import LoginBoxed from '../pages/Authentication/LoginBoxed';

// ?Index for Admin
const Index = lazy(() => import('../pages/Index'));

// ? Users
const PreviewUser = lazy(() => import('../pages/Users/PreviewUser'));
const Users = lazy(() => import('../pages/Users/Users'));
const AddUser = lazy(() => import('../pages/Users/AddUser'));


const About = lazy(() => import('../pages/About'));
const Error = lazy(() => import('../components/Error'));

const Constructor = lazy(() => import('../pages/Events'));
const ServerEvent = lazy(() => import('../pages/ServerEvent'));
const AddModem = lazy(() => import('../pages/Devices/AddModem'));
const Devices = lazy(() => import('../pages/Devices/Devices'));
const DevicesMap = lazy(() => import('../pages/Devices/DevicesMap'));
const AddDevice = lazy(() => import('../pages/Devices/AddDevice'));
const PreviewDevice = lazy(() => import('../pages/Devices/PreviewDevice'));
const Regions = lazy(() => import('../pages/Regions'));

//!  Operator pages
const IndexOperator = lazy(() => import('../pages/Operator/Index'));
const ConstructorOperator = lazy(() => import('../pages/Operator/Constructor'));
const UserDevices = lazy(() => import('../pages/Operator/Devices'));

const routes = [
    {
        path: '/',
        for: 'admin',
        layout :'' ,
        element: <Index />
    },

    {
        path: '/login',
        for: 'nouser',
        layout :'blank' ,
        element: <LoginBoxed />
    },

    {
        path: '/constructor',
        for: 'admin',
        layout :'' ,
        element: <Constructor />
    },
    {
        path: '/events',
        for: 'admin',
        layout :'' ,
        element: <ServerEvent />
    },
    {
        path: '/regions',
        for: 'admin',
        layout :'' ,
        element: <Regions />
    },
    {
        path: '/devices',
        for: 'admin',
        layout :'' ,
        element: <Devices />
    },
    {
        path: '/device/map',
        for: 'admin',
        layout :'' ,
        element: <DevicesMap />
    },
    {
        path: '/device/add',
        for: 'admin',
        layout :'' ,
        element: <AddDevice />
    },
    {
        path: '/devices/:id',
        for: 'admin',
        layout :'' ,
        element: <PreviewDevice />
    },
    {
        path: '/events/add-event',
        for: 'admin',
        layout :'' ,
        element: <AddModem />
    },
    // !Users pages
    {
        path: '/users',
        for: 'admin',
        layout :'' ,
        element: <Users />
    },
    {
        path: '/users/:id',
        for: 'admin',
        layout :'' ,
        element: <PreviewUser />
    },
    {
        path: '/user/add',
        for: 'admin',
        layout :'' ,
        element: <AddUser />
    },

    // ! Operator section pages
    {
        path: '/',
        for: 'operator',
        layout :'' ,
        element: <IndexOperator />
    },
    {
        path: '/constructor',
        for: 'operator',
        layout :'' ,
        element: <ConstructorOperator />
    },
    {
        path: '/devices',
        for: 'operator',
        layout :'' ,
        element: <UserDevices />
    },
    {
        path: '/about',
        for: 'admin',
        layout :'blank' ,
        element: <About />,
    },
    {
        path: '*',
        for: 'admin',
        layout :'blank' ,
        element: <Error />
    }
];

export { routes };

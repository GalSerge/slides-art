import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import '@assets/css/style.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '@pages/main-page';
import LoginPage from '@pages/login-page';
import ProfilePage from '@pages/profile-page';
import RoomPage from '@pages/room-page';
import ErrorPage from '@pages/error-page';
import UsersPage from '@pages/users-page';

import { RequireToken } from '@utils/auth';
import EditorPage from "@pages/editor-page";

import { WebSocketContextProvider } from '@contexts/WebSocketContext';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/room/:uuid' errorElement={<ErrorPage />} element={
                    <WebSocketContextProvider>
                        <RoomPage />
                    </WebSocketContextProvider>
                } />
                <Route path='/editor/:uuid' element={<EditorPage />} />
                <Route path='/profile' element={
                    <RequireToken>
                        <ProfilePage />
                    </RequireToken>
                } />
                <Route path='/users' element={
                    <RequireToken>
                        <UsersPage />
                    </RequireToken>
                } />
                <Route path='/error' element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
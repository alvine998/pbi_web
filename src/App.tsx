import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MediaPage from './pages/MediaPage';
import SocialMediaPage from './pages/SocialMediaPage';
import EventsPage from './pages/EventsPage';
import ForumPage from './pages/ForumPage';
import ForumDetailPage from './pages/ForumDetailPage';
import PollsPage from './pages/PollsPage';
import ChatPage from './pages/ChatPage';
import ActivityLogPage from './pages/ActivityLogPage';
import NewsPage from './pages/NewsPage';
import ProductFormPage from './pages/ProductFormPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import AspirationsPage from './pages/AspirationsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/add" element={<ProductFormPage />} />
      <Route path="/products/edit/:id" element={<ProductFormPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/social-media" element={<SocialMediaPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/:id" element={<ForumDetailPage />} />
      <Route path="/polls" element={<PollsPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/activity-log" element={<ActivityLogPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />
      <Route path="/aspirations" element={<AspirationsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

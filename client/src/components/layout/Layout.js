import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CreatePost from "../post/CreatePost";
import { usePosts } from "../../context/PostContext";

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCreatePost = (postData) => {
    createPost(postData);
    setIsCreateModalOpen(false);
  };

  return (
    <LayoutWrapper>
      <Header>
        <Nav>
          <Logo to="/">ThreeDee</Logo>
          <NavLinks>
            {user ? (
              <>
                <Link to="/">Home</Link>
                <Link to={`/profile/${user.id}`}>Profile</Link>
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Post
                </Button>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary">
                  Login
                </Button>
                <Button as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </NavLinks>
        </Nav>
      </Header>
      <MainContent>{children}</MainContent>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CreatePost onSubmit={handleCreatePost} />
      </Modal>
    </LayoutWrapper>
  );
}

export default Layout;

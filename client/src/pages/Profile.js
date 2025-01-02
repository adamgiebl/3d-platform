import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { mockImages } from "../utils/mockData";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import LoaderContainer from "../components/ui/LoaderContainer";
import ModelViewer from "../components/3d/ModelViewer";

const ProfileHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ModelCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModelTitle = styled.h3`
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ModelDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
  line-height: 1.4;
`;

const ModelContainer = styled.div`
  height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProfileActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { userPosts, userPostsCount, isLoadingUserPosts, fetchUserPosts } =
    usePosts();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const userId = id || user?.id;
    if (userId) {
      fetchUserPosts(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    console.table({
      action: isFollowing ? "Unfollowing" : "Following",
      userId: id,
      currentUser: user?.id,
    });
  };

  const isOwnProfile = id === user?.id;

  return (
    <Layout>
      <ProfileHeader>
        <Avatar src={user?.avatar || mockImages.users[0]} alt="Profile" />
        <ProfileInfo>
          <h1>{user?.username || "User"}</h1>
          <p>{user?.email}</p>
          <Stats>
            <span>Models: {userPostsCount}</span>
            <span>Followers: 120</span>
            <span>Following: 85</span>
          </Stats>
          {!isOwnProfile && user && (
            <ProfileActions>
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </ProfileActions>
          )}
        </ProfileInfo>
      </ProfileHeader>

      <h2>Gallery</h2>
      <Gallery>
        {isLoadingUserPosts ? (
          <ModelCard>
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          </ModelCard>
        ) : (
          userPosts.map((post) => (
            <ModelCard key={post.objectId}>
              <ModelContainer>
                <ModelViewer url={post.modelUrl} />
              </ModelContainer>
              <ModelTitle>{post.title}</ModelTitle>
              <ModelDescription>{post.description}</ModelDescription>
            </ModelCard>
          ))
        )}
      </Gallery>
    </Layout>
  );
}

export default Profile;

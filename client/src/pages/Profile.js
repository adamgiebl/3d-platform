import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { mockImages } from "../utils/mockData";
import { mockPosts } from "../context/data";
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

function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Simulate fetching user's posts
    const fetchedPosts = mockPosts.filter(
      (post) => post.author.id === (id || user?.id)
    );
    console.table(fetchedPosts, ["id", "title", "author.name"]);
    setUserPosts(fetchedPosts);
  }, [id, user?.id]);

  return (
    <Layout>
      <ProfileHeader>
        <Avatar src={user?.avatar || mockImages.users[0]} alt="Profile" />
        <ProfileInfo>
          <h1>{user?.name || "User"}</h1>
          <p>{user?.email}</p>
          <Stats>
            <span>Models: {userPosts.length}</span>
            <span>Followers: 120</span>
            <span>Following: 85</span>
          </Stats>
        </ProfileInfo>
      </ProfileHeader>

      <h2>Gallery</h2>
      <Gallery>
        {userPosts.map((post) => (
          <ModelCard key={post.id}>
            <ModelContainer>
              <ModelViewer url={post.modelUrl} />
            </ModelContainer>
            <ModelTitle>{post.title}</ModelTitle>
            <ModelDescription>{post.description}</ModelDescription>
          </ModelCard>
        ))}
      </Gallery>
    </Layout>
  );
}

export default Profile;

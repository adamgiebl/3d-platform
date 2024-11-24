import styled from "styled-components";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { mockImages } from "../utils/mockData";

const HomeLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const FeedWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
  height: fit-content;
  max-height: calc(100vh - ${({ theme }) => theme.spacing.xl} * 2);
  overflow-y: auto;
`;

const SidebarSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const CreatorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Creator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const CreatorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  object-fit: cover;
`;

const CreatorInfo = styled.div`
  flex: 1;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Category = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }
`;

const mockCreators = [
  {
    id: 1,
    name: "Jane Smith",
    avatar: mockImages.users[0],
    followers: "12.3k",
  },
  { id: 2, name: "John Doe", avatar: mockImages.users[1], followers: "9.1k" },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: mockImages.users[2],
    followers: "8.7k",
  },
];

const mockCategories = [
  "3D Characters",
  "Abstract Art",
  "Animations",
  "Architectural",
  "Game Assets",
];

function Home() {
  const { posts, toggleLike, addComment, createPost } = usePosts();
  const { user } = useAuth();

  return (
    <Layout>
      {user && <CreatePost onSubmit={createPost} />}

      <HomeLayout>
        <FeedWrapper>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={toggleLike}
              onComment={addComment}
            />
          ))}
        </FeedWrapper>

        <Sidebar>
          <SidebarSection>
            <SectionTitle>Creators</SectionTitle>
            <CreatorList>
              {mockCreators.map((creator) => (
                <Creator key={creator.id}>
                  <CreatorAvatar src={creator.avatar} alt={creator.name} />
                  <CreatorInfo>
                    <div>{creator.name}</div>
                    <small style={{ color: "var(--text-secondary)" }}>
                      {creator.followers} followers
                    </small>
                  </CreatorInfo>
                </Creator>
              ))}
            </CreatorList>
          </SidebarSection>

          <SidebarSection>
            <SectionTitle>Categories</SectionTitle>
            <CategoryList>
              {mockCategories.map((category) => (
                <Category key={category}>{category}</Category>
              ))}
            </CategoryList>
          </SidebarSection>
        </Sidebar>
      </HomeLayout>
    </Layout>
  );
}

export default Home;

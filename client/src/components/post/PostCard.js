import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import CommentSection from "./CommentSection";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
} from "@styled-icons/material";
import ModelViewer from "../3d/ModelViewer";

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
`;

const Content = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TagList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
`;

const ModelContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const Username = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
`;

function PostCard({ post, onLike, getLikes, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const dummyAuthor = {
    id: "1",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  post.author = post.author || dummyAuthor;
  post.tags = post.tags || ["3d", "art", "design"];

  return (
    <Card>
      <Header>
        <UserInfo>
          <Link to={`/profile/${post.author.id}`}>
            <Avatar src={post.author.avatar} alt={post.author.name} />
          </Link>
          <Link to={`/profile/${post.author.id}`}>
            <Username>{post.author.name}</Username>
          </Link>
        </UserInfo>
        <Title>{post.title}</Title>
      </Header>

      <Content>
        <p>{post.description}</p>
        <ModelContainer>
          <ModelViewer url={post.modelUrl} />
        </ModelContainer>
      </Content>

      <TagList>
        {post.tags.map((tag) => (
          <Tag key={tag}>#{tag}</Tag>
        ))}
      </TagList>

      <Actions>
        <ActionButton
          variant={post.liked ? "primary" : "secondary"}
          onClick={() => onLike(post.objectId)}
        >
          <StyledIcon>
            {post.liked ? <Favorite /> : <FavoriteBorder />}
          </StyledIcon>
          {post.likesCount || 0}
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => setShowComments(!showComments)}
        >
          <StyledIcon>
            <ChatBubbleOutline />
          </StyledIcon>
          {post.comments?.length || 0}
        </ActionButton>
      </Actions>

      {showComments && <CommentSection post={post} onComment={onComment} />}
    </Card>
  );
}

export default PostCard;

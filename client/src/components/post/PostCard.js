import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Loader from "../ui/Loader";
import LoaderContainer from "../ui/LoaderContainer";
import CommentSection from "./CommentSection";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
} from "@styled-icons/material";
import ModelViewer from "../3d/ModelViewer";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  display: block;
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

const Tag = styled(Link)`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
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
  height: 400px;
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const Username = styled.div`
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

function PostCard({ post, onLike, onComment, isLoading }) {
  const [showComments, setShowComments] = useState(false);
  const { user: currentUser } = useAuth();

  const defaultUser = {
    id: "unknown",
    username: "Anonymous User",
    email: "",
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  if (isLoading) {
    return (
      <Card>
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      </Card>
    );
  }

  const postUser = post.user || defaultUser;

  const tags = post.tags || ["3d", "art", "design"];

  return (
    <Card>
      <Header>
        <UserInfo>
          <Link to={`/profile/${postUser.id}`}>
            <Avatar
              src={postUser.avatar || defaultUser.avatar}
              alt={postUser.username}
            />
          </Link>
          <Link to={`/profile/${postUser.id}`}>
            <Username>{postUser.username}</Username>
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
        {tags.map((tag) => (
          <Tag key={tag} to={`/tag/${tag}`}>
            #{tag}
          </Tag>
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
          {post.likes || 0}
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

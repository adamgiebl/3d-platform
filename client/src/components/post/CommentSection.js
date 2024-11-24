import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Comment = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const CommentAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CommentInput = styled(Input)`
  flex: 1;
`;

function CommentSection({ post, onComment }) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onComment(post.id, {
      content: newComment,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
    });
    setNewComment("");
  };

  return (
    <Container>
      <CommentList>
        {post.comments.map((comment) => (
          <Comment key={comment.id}>
            <CommentAvatar
              src={comment.author.avatar}
              alt={comment.author.name}
            />
            <CommentContent>
              <strong>{comment.author.name}</strong>
              <p>{comment.content}</p>
            </CommentContent>
          </Comment>
        ))}
      </CommentList>

      {user && (
        <CommentForm onSubmit={handleSubmit}>
          <CommentInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button type="submit">Post</Button>
        </CommentForm>
      )}
    </Container>
  );
}

export default CommentSection;

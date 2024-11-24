import { useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../context/AuthContext";

const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TagInput = styled(Input)`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

function CreatePost({ onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    modelFile: null,
    previewImage: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.table({
      action: "Creating post",
      ...formData,
      modelFile: formData.modelFile?.name,
      previewImage: formData.previewImage?.name,
    });

    onSubmit({
      ...formData,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    });

    setFormData({
      title: "",
      description: "",
      tags: "",
      modelFile: null,
      previewImage: null,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>

      <FormGroup>
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Give your creation a name"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Tell us about your work"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Tags (comma-separated)</Label>
        <TagInput
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="e.g., sculpture, abstract, modern"
        />
      </FormGroup>

      <FormGroup>
        <Label>3D Model</Label>
        <Input
          type="file"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, modelFile: e.target.files[0] }))
          }
          accept=".glb,.gltf,.obj"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Preview Image</Label>
        <Input
          type="file"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              previewImage: e.target.files[0],
            }))
          }
          accept="image/*"
          required
        />
      </FormGroup>

      <Button type="submit">Create Post</Button>
    </Form>
  );
}

export default CreatePost;

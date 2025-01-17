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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

function CreatePost({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    modelUrl:
      "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
    tags: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      console.log("submitting formdata", formData);
      await onSubmit({
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });

      setFormData({
        title: "",
        description: "",
        modelUrl: "",
        tags: "",
      });
    } catch (error) {
      setError(error.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleModelUrlChange = (e) => {
    const url = e.target.value;
    if (url && !validateUrl(url)) {
      setError("Please enter a valid URL for the 3D model");
    } else {
      setError("");
    }
    setFormData((prev) => ({ ...prev, modelUrl: url }));
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
          placeholder="Title of your creation"
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
        <Input
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="e.g., sculpture, abstract, modern"
        />
      </FormGroup>

      <FormGroup>
        <Label>3D Model URL</Label>
        <Input
          type="url"
          value={formData.modelUrl}
          onChange={handleModelUrlChange}
          placeholder="Enter URL to your 3D model (GLB, GLTF, or OBJ format)"
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormGroup>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>
    </Form>
  );
}

export default CreatePost;

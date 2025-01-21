import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: 42px;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  margin: -${({ theme }) => theme.spacing.xs};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.error}10;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Suggestions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const SuggestionTag = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Autocomplete = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const AutocompleteItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const pulse = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

const SkeletonTag = styled.div`
  background: ${({ theme }) => theme.colors.border};
  width: 60px;
  height: 22px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const TagInput = ({
  existingTags = [],
  value = [],
  onChange,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim()) {
      const filtered = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(newValue.toLowerCase()) &&
          !value.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tag) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const topSuggestions = existingTags
    .filter((tag) => !value.includes(tag))
    .slice(0, 5);

  if (isLoading) {
    return (
      <Container>
        <RelativeContainer>
          <InputContainer>
            {value.map((tag) => (
              <Tag key={tag}>
                {tag}
                <RemoveTag onClick={() => removeTag(tag)}>×</RemoveTag>
              </Tag>
            ))}
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? "Add tags..." : ""}
            />
          </InputContainer>
        </RelativeContainer>
        <SkeletonContainer>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonTag key={i} />
          ))}
        </SkeletonContainer>
      </Container>
    );
  }

  return (
    <Container>
      <RelativeContainer>
        <InputContainer>
          {value.map((tag) => (
            <Tag key={tag}>
              {tag}
              <RemoveTag onClick={() => removeTag(tag)}>×</RemoveTag>
            </Tag>
          ))}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? "Add tags..." : ""}
          />
        </InputContainer>
        {suggestions.length > 0 && (
          <Autocomplete>
            {suggestions.map((tag) => (
              <AutocompleteItem key={tag} onClick={() => addTag(tag)}>
                {tag}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      </RelativeContainer>
      {topSuggestions.length > 0 && (
        <>
          <Suggestions>
            {topSuggestions.map((tag) => (
              <SuggestionTag key={tag} onClick={() => addTag(tag)}>
                {tag}
              </SuggestionTag>
            ))}
          </Suggestions>
        </>
      )}
    </Container>
  );
};

export default TagInput;

import styled, { css } from "styled-components";

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = "primary" }) =>
    variant === "primary" &&
    css`
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.text};

      &:hover {
        background: ${({ theme }) => theme.colors.secondary};
      }
    `}

  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};

      &:hover {
        background: ${({ theme }) => theme.colors.primary}20;
      }
    `}
`;

export default Button;

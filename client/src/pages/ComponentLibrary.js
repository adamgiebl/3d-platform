import React from "react";
import styled from "styled-components";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import LoaderContainer from "../components/ui/LoaderContainer";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 100px 40px;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section``;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const ComponentRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const ComponentCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  height: 100%;
`;

const Label = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const ComponentLibrary = () => {
  return (
    <PageContainer>
      <Title>Component Library</Title>

      <Grid>
        <Section>
          <SectionTitle>Buttons</SectionTitle>
          <ComponentCard>
            <Label>Primary Button</Label>
            <ComponentRow>
              <Button variant="primary">Primary Button</Button>
            </ComponentRow>

            <Label>Secondary Button</Label>
            <ComponentRow>
              <Button variant="secondary">Secondary Button</Button>
            </ComponentRow>
          </ComponentCard>
        </Section>

        <Section>
          <SectionTitle>Inputs</SectionTitle>
          <ComponentCard>
            <Label>Default Input</Label>
            <ComponentRow>
              <Input placeholder="Type something..." />
            </ComponentRow>
          </ComponentCard>
        </Section>

        <Section>
          <SectionTitle>Cards</SectionTitle>
          <ComponentCard>
            <h3>Example Card Content</h3>
            <p style={{ margin: "1rem 0" }}>
              This is an example of how content looks inside a card component.
            </p>
            <Button variant="primary">Action</Button>
          </ComponentCard>
        </Section>

        <Section>
          <SectionTitle>Loaders</SectionTitle>
          <ComponentCard>
            <Label>Default Loader</Label>
            <ComponentRow>
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            </ComponentRow>
          </ComponentCard>
        </Section>
      </Grid>
    </PageContainer>
  );
};

export default ComponentLibrary;

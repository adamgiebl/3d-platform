import React from "react";
import styled, { useTheme } from "styled-components";
import Card from "../components/ui/Card";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 30px;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const StyledCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColorBox = styled.div`
  background: ${({ color }) => color};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.background};
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);

  span {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    font-size: 0.875rem;
  }
`;

const SpacingGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SpacingBox = styled.div`
  background: ${({ theme }) => theme.colors.primary}20;
  height: ${({ size }) => size}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TypeScale = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TypeExample = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  .sample {
    color: ${({ theme }) => theme.colors.text};
  }

  .details {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const BorderRadiusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const RadiusBox = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  aspect-ratio: 1;
  border-radius: ${({ radius }) => radius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.background};
`;

const StyleGuide = () => {
  const theme = useTheme();

  return (
    <PageContainer>
      <Title>Style Guide</Title>

      <Grid>
        <Section>
          <SectionTitle>Colors</SectionTitle>
          <StyledCard>
            <ColorGrid>
              <ColorBox color={theme.colors.primary}>
                <span>Primary</span>
              </ColorBox>
              <ColorBox color={theme.colors.secondary}>
                <span>Secondary</span>
              </ColorBox>
              <ColorBox color={theme.colors.background}>
                <span>Background</span>
              </ColorBox>
              <ColorBox color={theme.colors.surface}>
                <span>Surface</span>
              </ColorBox>
              <ColorBox color={theme.colors.text}>
                <span>Text</span>
              </ColorBox>
              <ColorBox color={theme.colors.textSecondary}>
                <span>Text Secondary</span>
              </ColorBox>
              <ColorBox color={theme.colors.border}>
                <span>Border</span>
              </ColorBox>
            </ColorGrid>
          </StyledCard>
        </Section>

        <Section>
          <SectionTitle>Typography</SectionTitle>
          <StyledCard>
            <TypeScale>
              <TypeExample>
                <div
                  className="sample"
                  style={{ fontSize: "2.5rem", fontWeight: 700 }}
                >
                  Heading 1
                </div>
                <div className="details">2.5rem / 700 weight</div>
              </TypeExample>
              <TypeExample>
                <div
                  className="sample"
                  style={{ fontSize: "2rem", fontWeight: 600 }}
                >
                  Heading 2
                </div>
                <div className="details">2rem / 600 weight</div>
              </TypeExample>
              <TypeExample>
                <div
                  className="sample"
                  style={{ fontSize: "1.5rem", fontWeight: 600 }}
                >
                  Heading 3
                </div>
                <div className="details">1.5rem / 600 weight</div>
              </TypeExample>
              <TypeExample>
                <div className="sample" style={{ fontSize: "1rem" }}>
                  Body Text
                </div>
                <div className="details">1rem / 400 weight</div>
              </TypeExample>
              <TypeExample>
                <div className="sample" style={{ fontSize: "0.875rem" }}>
                  Small Text
                </div>
                <div className="details">0.875rem / 400 weight</div>
              </TypeExample>
            </TypeScale>
          </StyledCard>
        </Section>

        <Section>
          <SectionTitle>Spacing</SectionTitle>
          <StyledCard>
            <SpacingGrid>
              <SpacingBox size={4}>XS - 4px</SpacingBox>
              <SpacingBox size={8}>SM - 8px</SpacingBox>
              <SpacingBox size={16}>MD - 16px</SpacingBox>
              <SpacingBox size={24}>LG - 24px</SpacingBox>
              <SpacingBox size={32}>XL - 32px</SpacingBox>
            </SpacingGrid>
          </StyledCard>
        </Section>

        <Section>
          <SectionTitle>Border Radius</SectionTitle>
          <StyledCard>
            <BorderRadiusGrid>
              <RadiusBox radius={4}>4px</RadiusBox>
              <RadiusBox radius={8}>8px</RadiusBox>
              <RadiusBox radius={12}>12px</RadiusBox>
              <RadiusBox radius={16}>16px</RadiusBox>
            </BorderRadiusGrid>
          </StyledCard>
        </Section>
      </Grid>
    </PageContainer>
  );
};

export default StyleGuide;

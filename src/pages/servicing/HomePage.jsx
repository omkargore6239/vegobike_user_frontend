// src/pages/HomePage.jsx
import PageLayout from "../../components/servicing/layout/PageLayout";
import HeroSection from "../../components/servicing/sections/HeroSection";
import ServicesSection from "../../components/servicing/sections/ServicesSection";

const HomePage = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection />
    </PageLayout>
  );
};

export default HomePage;
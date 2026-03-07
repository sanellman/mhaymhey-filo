import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FactsSection from '../components/FactsSection';
import GallerySection from '../components/GallerySection';
import ToolsSection from '../components/ToolsSection';

export default function PreviewPage() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <FactsSection />
      <GallerySection />
      <ToolsSection />
    </Layout>
  );
}

import styled from 'styled-components';
import { FaGraduationCap, FaTasks, FaQuoteRight, FaRobot, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';


// Styled Components
const Header = styled.header`
  background: #fff;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;

  li a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
  }
`;

const CtaButton = styled.button`
  background-color: #0077cc;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Hero = styled.section`
  background: #f0f4f8;
  padding: 80px 20px;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: auto;

  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
`;

const MainCta = styled.button`
  background: #0077cc;
  color: white;
  padding: 12px 28px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Section = styled.section`
  padding: 80px 20px;
  background: #fff;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 50px;

  h2 {
    font-size: 2.5rem;
  }

  p {
    margin-top: 10px;
    color: #666;
  }
`;

const FeaturesGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
`;

const FeatureCard = styled.div`
  background: #f9f9f9;
  padding: 30px;
  width: 300px;
  border-radius: 8px;
  text-align: center;

  h3 {
    margin-top: 20px;
  }

  p {
    margin-top: 10px;
    color: #555;
  }
`;

const FoundersContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  padding-bottom: 2rem;
`;


const FounderCard = styled.div`
  min-width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;


const FounderImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid var(--accent);
  margin-bottom: 1.5rem;
`;

const StepsContainer = styled.div`
  max-width: 900px;
  margin: auto;
`;

const Step = styled.div`
  display: flex;
  margin-bottom: 40px;
  align-items: center;

  .step-number {
    background: #0077cc;
    color: white;
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .step-content {
    margin-left: 20px;
  }
`;

const FaqItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 20px 0;

  .faq-question {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    font-weight: bold;
  }

  .faq-answer {
    margin-top: 10px;
    color: #555;
  }
`;

const ContactContainer = styled.div`
  max-width: 600px;
  margin: auto;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  input, textarea {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  button {
    background: #0077cc;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  padding: 30px 20px;
  text-align: center;
`;


// Main Component
const LandingPage = () => {
  return (
    <>
      <Header>
        <Nav>
          <Logo>
            <FaGraduationCap />
            <span>ScholAuxil</span>
          </Logo>
          <NavLinks>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
            <li> <Link to="/Login">
              <CtaButton>Login</CtaButton>
            </Link></li>




          </NavLinks>
        </Nav>
      </Header>

      <Hero>
        <HeroContent>
          <h1>Revolutionizing Academic Research</h1>
          <p>ScholAuxil combines powerful tools with intelligent assistance to streamline your research workflow.</p>
          <Link to="/Signup">
            <MainCta>Get Started</MainCta>
          </Link>
        </HeroContent>
      </Hero>

      <Section id="features">
        <SectionTitle>
          <h2>Research Tools Designed for Scholars</h2>
          <p>Everything you need to organize and accelerate your academic work</p>
        </SectionTitle>

        <FeaturesGrid>
          <FeatureCard>
            <FaTasks size={40} />
            <h3>Smart To-Do List</h3>
            <p>Prioritize and track your research milestones with our intelligent task manager.</p>
          </FeatureCard>

          <FeatureCard>
            <FaQuoteRight size={40} />
            <h3>Citation Creator</h3>
            <p>Generate flawless citations in any style with support for various sources.</p>
          </FeatureCard>

          <FeatureCard>
            <FaRobot size={40} />
            <h3>Research Assistant</h3>
            <p>Refine research questions, suggest methodologies, and recommend literature.</p>
          </FeatureCard>
        </FeaturesGrid>
      </Section>


      <Section id="about" style={{ backgroundColor: "#f0f4f8" }}>
        <SectionTitle>
          <h2>Meet The Founders</h2>
          <p>The academic minds behind ScholAuxil</p>
        </SectionTitle>

        <FoundersContainer>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
          >
            {founders.map((founder, index) => (
              <SwiperSlide key={index}>
                <FounderCard>
                  <FounderImage className="founder-image" src={founder.image} alt={founder.name} />
                  <h3>{founder.name}</h3>
                  <p>{founder.title}</p>
                  <p>{founder.quote}</p>
                </FounderCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </FoundersContainer>
      </Section>


      <Section id="how-it-works">
        <SectionTitle>
          <h2>How ScholAuxil Works</h2>
          <p>Simple steps to transform your research process</p>
        </SectionTitle>

        <StepsContainer>
          {steps.map((step, index) => (
            <Step key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </Step>
          ))}
        </StepsContainer>
      </Section>

      <Section id="faq" style={{
        backgroundColor: "#f0f4f8"
      }}>
        <SectionTitle>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about ScholAuxil</p>
        </SectionTitle>

        <div>
          {faqItems.map((faq, index) => (
            <FaqItem key={index}>
              <div className="faq-question">
                <span>{faq.question}</span>
                <FaChevronDown />
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </FaqItem>
          ))}
        </div>
      </Section>

      <Section id="contact">
        <ContactContainer>
          <SectionTitle>
            <h2>Contact Our Team</h2>
            <p>Have questions or feedback? We're here to help</p>
          </SectionTitle>

          <ContactForm>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows={6} required />
            <button type="submit">Send Message</button>
          </ContactForm>
        </ContactContainer>
      </Section>

      <Footer>
        <p>© 2025 ScholAuxil. All rights reserved.</p>
      </Footer>
    </>
  );
};

// Mock Data
const founders = [
  {
    image: "https://randomuser.me/api/portraits/women/43.jpg",
    name: "Dr. Sarah Chen",
    title: "Computer Science Professor",
    quote: "After years of struggling with research tools, I knew we could build something better."
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Dr. Michael Rodriguez",
    title: "Research Methodology Expert",
    quote: "We wanted to build a platform that actively enhances research quality."
  },
  {
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Dr. Priya Patel",
    title: "Linguistics Researcher",
    quote: "Citation management shouldn't distract from actual research."
  },
  {
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Dr. James Wilson",
    title: "AI & Natural Language Processing",
    quote: "Our assistant leverages cutting-edge AI to provide helpful academic guidance."
  }
];

const steps = [
  { title: "Create Your Academic Profile", description: "Personalize ScholAuxil tools to your specific needs." },
  { title: "Organize Your Projects", description: "Break projects into manageable tasks with suggested timelines." },
  { title: "Utilize Research Tools", description: "Generate citations, get suggestions, and track your progress." },
  { title: "Export & Share", description: "Easily export your research notes, tasks, and references." }
];

const faqItems = [
  { question: "Is my research data secure with ScholAuxil?", answer: "Absolutely. We use enterprise-grade encryption for all data." },
  { question: "Can I import references from other citation managers?", answer: "Yes, we support importing from Zotero, Mendeley, and EndNote." },
  { question: "How does the AI research assistant differ from general chatbots?", answer: "Our assistant understands academic literature and methodologies." },
  { question: "Is there a mobile app available?", answer: "Yes, native apps are in development, but the web platform is fully responsive." }
];

export default LandingPage;

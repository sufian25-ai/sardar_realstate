import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Building2, Users, Award, Target, ArrowRight, MapPin, Phone, Mail,
  Star, CheckCircle2, Globe, Shield, Heart, TrendingUp, Clock, Sparkles,
  ChevronRight, Play, Zap, Home, ArrowUpRight
} from 'lucide-react';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// Counter Component
const Counter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 50;
      const stepValue = end / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const AboutUltra = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Stats Data
  const stats = [
    { icon: <Building2 />, value: 500, suffix: '+', label: 'Properties Sold', color: 'from-indigo-500 to-purple-500' },
    { icon: <Users />, value: 2000, suffix: '+', label: 'Happy Clients', color: 'from-amber-500 to-orange-500' },
    { icon: <Award />, value: 18, suffix: '', label: 'Years Experience', color: 'from-green-500 to-emerald-500' },
    { icon: <Star />, value: 98, suffix: '%', label: 'Client Satisfaction', color: 'from-pink-500 to-rose-500' },
  ];

  // Team Members
  const team = [
    {
      name: 'Sardar Ahmed',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Visionary leader with 18+ years in Bangladesh real estate market.'
    },
    {
      name: 'Fatima Rahman',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Expert in luxury properties and client relations.'
    },
    {
      name: 'Karim Hassan',
      role: 'Property Consultant',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Specialized in residential and commercial investments.'
    },
    {
      name: 'Nadia Islam',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Creative strategist driving our brand excellence.'
    },
  ];

  // Values
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Transparency',
      description: 'We believe in complete honesty in every transaction. No hidden fees, no surprises.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Client First',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Local Expertise',
      description: 'Deep knowledge of Dhaka neighborhoods helps us find your perfect property.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Leveraging technology to make property search and transactions seamless.'
    },
  ];

  // Timeline
  const timeline = [
    { year: '2007', title: 'Foundation', description: 'Sardar Real Estate was founded with a vision to transform property experience in Bangladesh.' },
    { year: '2012', title: 'Expansion', description: 'Expanded operations to cover all major areas of Dhaka including Gulshan, Banani, and Dhanmondi.' },
    { year: '2016', title: 'Digital Revolution', description: 'Launched our digital platform to make property search accessible to everyone.' },
    { year: '2020', title: 'Premium Services', description: 'Introduced exclusive luxury property services and premium client experiences.' },
    { year: '2025', title: 'New Era', description: 'Rebranding with cutting-edge technology and expanded team to serve you better.' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">SARDAR</h1>
                <p className="text-xs text-indigo-400">REAL ESTATE</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              <Link to="/properties" className="text-white/70 hover:text-white transition-colors">Properties</Link>
              <Link to="/about" className="text-indigo-400 font-medium">About</Link>
              <Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/contact" className="btn-primary py-2 px-5 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
        </motion.div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Trusted Since 2007
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Building Dreams,
              <br />
              <span className="text-gradient">Creating Futures</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10">
              Your trusted partner in finding the perfect property in Bangladesh. 
              Over 18 years of excellence in real estate.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/properties" className="btn-primary px-8 py-4 text-lg flex items-center gap-2 group">
                Explore Properties
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-outline px-8 py-4 text-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-indigo-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 md:p-8 text-center group hover:scale-105 transition-transform"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon, { className: 'w-7 h-7 text-white' })}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-20 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Our Office"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -right-8 md:bottom-8 md:right-8 glass p-6 rounded-2xl max-w-[280px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Top Rated</p>
                    <p className="text-white/50 text-sm">Agency 2024</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                Our Story
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Transforming <span className="text-gradient">Real Estate</span> Experience
              </h2>
              
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Founded in 2007, Sardar Real Estate has grown from a small family business to one of 
                Dhaka's most trusted property consultants. Our journey has been driven by a simple 
                belief: everyone deserves to find their perfect home.
              </p>
              
              <p className="text-white/60 leading-relaxed mb-8">
                Over the years, we've helped thousands of families find their dream properties, 
                assisted investors in making smart decisions, and built lasting relationships with 
                our clients. Our team of experienced professionals is dedicated to making your 
                property journey smooth and successful.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  'Licensed & Certified',
                  'Transparent Dealings',
                  '24/7 Support',
                  'Expert Team'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-amber-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What <span className="text-gradient-gold">Drives Us</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our core values shape every interaction and decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-8 group hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-20 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-green-400 text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Milestones & <span className="text-gradient">Achievements</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="card-premium p-6 inline-block">
                      <span className="text-3xl font-bold text-gradient">{item.year}</span>
                      <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM SECTION ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Meet the <span className="text-gradient">Experts</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              A dedicated team of professionals committed to your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card-premium overflow-hidden">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6 -mt-16 relative z-10">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-indigo-400 text-sm mb-3">{member.role}</p>
                    <p className="text-white/50 text-sm">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-premium p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-amber-400 text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Ready to Start?
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Let's Find Your <span className="text-gradient-gold">Dream Property</span>
              </h2>
              
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
                Whether you're buying, selling, or renting, our expert team is here to guide you 
                every step of the way. Get in touch today!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/properties" className="btn-primary px-8 py-4 text-lg flex items-center gap-2 group">
                  Browse Properties
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-gold px-8 py-4 text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <h1 className="font-bold text-lg">SARDAR</h1>
                  <p className="text-xs text-indigo-400">REAL ESTATE</p>
                </div>
              </Link>
              <p className="text-white/50 mb-6">
                Your trusted partner in Bangladesh real estate since 2007.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-indigo-400 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Properties', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link
                      to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                      className="text-white/50 hover:text-indigo-400 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-6">Services</h3>
              <ul className="space-y-3">
                {['Property Sales', 'Rentals', 'Consultancy', 'Investment'].map((service) => (
                  <li key={service}>
                    <span className="text-white/50 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-white/50">House 123, Road 12, Gulshan 2, Dhaka 1212</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <a href="tel:+8801730150390" className="text-white/50 hover:text-indigo-400">+880 1730-150390</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <a href="mailto:info@sardarrealestate.com" className="text-white/50 hover:text-indigo-400">info@sardarrealestate.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © 2025 Sardar Real Estate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUltra;

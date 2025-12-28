import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Users, Award, TrendingUp, Shield, CheckCircle, Target, Eye, Heart, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import AnimatedSection from '../components/AnimatedSection';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero animation
    gsap.from('.about-hero-content', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  const stats = [
    { icon: <Building2 />, number: '500+', label: 'Properties Sold', gradient: 'from-blue-600 to-cyan-600' },
    { icon: <Users />, number: '2000+', label: 'Happy Clients', gradient: 'from-purple-600 to-pink-600' },
    { icon: <Award />, number: '50+', label: 'Awards Won', gradient: 'from-orange-600 to-red-600' },
    { icon: <TrendingUp />, number: '15+', label: 'Years Experience', gradient: 'from-green-600 to-emerald-600' }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all our dealings.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to serve you better.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Excellence',
      description: 'We strive for excellence in every property and service we deliver.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Reliability',
      description: 'Count on us for consistent, dependable service every single time.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const team = [
    {
      name: 'Md. Sardar Ali',
      role: 'Founder & CEO',
      image: '/assets/team-1.jpg',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Fatima Rahman',
      role: 'Chief Operating Officer',
      image: '/assets/team-2.jpg',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Sales Director',
      image: '/assets/team-3.jpg',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      name: 'Nadia Karim',
      role: 'Marketing Head',
      image: '/assets/team-4.jpg',
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  const milestones = [
    { year: '2009', title: 'Company Founded', description: 'Started with a vision to revolutionize real estate' },
    { year: '2012', title: 'First 100 Properties', description: 'Reached milestone of 100 successful transactions' },
    { year: '2016', title: 'Regional Expansion', description: 'Expanded operations to 5 major cities' },
    { year: '2020', title: 'Digital Transformation', description: 'Launched online platform and virtual tours' },
    { year: '2024', title: 'Industry Leader', description: 'Recognized as top real estate company' }
  ];

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/assets/about-hero.jpg" 
            alt="About Us" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = '/assets/hero-1.jpg'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto h-full flex items-center px-6">
          <div className="max-w-3xl about-hero-content">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">ABOUT SARDAR ESTATE</span>
            </div>

            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Building Dreams,</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Creating Futures
              </span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              For over 15 years, we've been helping people find their perfect property and build their dream life.
            </p>

            <div className="flex gap-4">
              <Link 
                to="/properties" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                View Properties
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl font-bold text-white hover:bg-white/20 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection animation="fadeUp">
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className={`inline-flex w-20 h-20 mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`text-6xl font-black mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-bold text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Story */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">OUR STORY</span>
                </div>

                <h2 className="text-5xl font-black mb-6">
                  <span className="text-gray-900">A Journey of</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Excellence</span>
                </h2>

                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>
                    Founded in 2009, Sardar Estate began with a simple mission: to help people find their dream homes and make smart property investments.
                  </p>
                  <p>
                    What started as a small family business has grown into one of the most trusted names in real estate, serving thousands of happy clients across the country.
                  </p>
                  <p>
                    Our commitment to integrity, transparency, and customer satisfaction has been the cornerstone of our success. Every property we list is carefully verified, and every client receives personalized attention from our expert team.
                  </p>
                </div>

                <div className="mt-8 flex gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Verified Properties</div>
                      <div className="text-sm text-gray-600">100% Authenticated</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img src="/assets/about-1.jpg" alt="Office" className="w-full h-64 object-cover" onError={(e) => e.target.src = '/assets/hero-1.jpg'} />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img src="/assets/about-2.jpg" alt="Team" className="w-full h-48 object-cover" onError={(e) => e.target.src = '/assets/hero-2.jpg'} />
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img src="/assets/about-3.jpg" alt="Property" className="w-full h-48 object-cover" onError={(e) => e.target.src = '/assets/hero-3.jpg'} />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img src="/assets/about-4.jpg" alt="Success" className="w-full h-64 object-cover" onError={(e) => e.target.src = '/assets/hero-4.jpg'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Mission & Vision */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6">Our Mission</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  To provide exceptional real estate services that help our clients achieve their property goals through integrity, professionalism, and innovation. We strive to make property buying, selling, and investing a seamless and rewarding experience.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6">Our Vision</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  To be the most trusted and innovative real estate company, transforming the way people discover and invest in properties. We envision a future where finding your dream property is simple, transparent, and accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Values */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-black mb-6">
                <span className="text-gray-900">Our Core</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Values</span>
              </h2>
              <p className="text-gray-600 text-xl">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-black mb-6">
                <span className="text-gray-900">Our</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Journey</span>
              </h2>
              <p className="text-gray-600 text-xl">Milestones that shaped our success</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-8 mb-12 group">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                      {milestone.year}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div className="w-1 flex-1 bg-gradient-to-b from-blue-600 to-purple-600 mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group-hover:border-transparent">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 text-lg">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Team */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-black mb-6">
                <span className="text-gray-900">Meet Our</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Expert Team</span>
              </h2>
              <p className="text-gray-600 text-xl">Dedicated professionals committed to your success</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="group">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.target.src = '/assets/placeholder.jpg'}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6`}>
                      <div className="text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="text-sm font-semibold mb-2">Connect with me</div>
                        <div className="flex gap-3">
                          {['LinkedIn', 'Email'].map((social, i) => (
                            <button key={social} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
                              <span className="text-xs">{social[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-gray-600 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl font-black text-white mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Let our expert team help you discover the perfect property that matches your vision
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/properties" 
                className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse Properties
              </Link>
              <Link 
                to="/contact" 
                className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default AboutUs;

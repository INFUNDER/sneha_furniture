import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-heading mb-4">Visit Our Showroom</h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the premium quality and craftsmanship of our furniture in person. 
          Our showroom in Dehradun features our finest collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-heading mb-6 border-b pb-4">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-primary rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Showroom Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    7, Saharanpur Rd, Patel Nagar,<br />
                    Dehradun, Uttarakhand 248001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-primary rounded-full">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-600">+91 96343 12102</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-primary rounded-full">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-gray-600">contact@snehafurniture.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-primary rounded-full">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Operating Hours</h3>
                  <p className="text-gray-600">
                    Monday to Saturday: 10:30 AM – 8:00 PM<br />
                    <span className="text-red-500 font-medium">Sundays Closed</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-heading mb-6 border-b pb-4">Send us a Message</h2>
            <form className="space-y-4">
              {/* Honeypot field for spam protection */}
              <input type="text" name="b_address" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              
              <div>
                <input type="text" required placeholder="Your Name" className="w-full border-b border-black py-3 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" />
              </div>
              <div>
                <input type="email" required placeholder="Your Email" className="w-full border-b border-black py-3 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" />
              </div>
              <div>
                <textarea required placeholder="Your Message" rows={4} className="w-full border-b border-black py-3 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400 resize-none"></textarea>
              </div>
              <button type="submit" className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition mt-4">
                <span>Send Message</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Map / Image Placeholder */}
        <div className="bg-gray-100 rounded-sm overflow-hidden h-[500px] border border-gray-200 flex flex-col items-center justify-center relative">
           <Image 
             src="https://images.unsplash.com/photo-1540638349517-3abd5afc5847?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
             alt="Showroom Location" 
             fill
             className="object-cover absolute inset-0 opacity-50"
             unoptimized
           />
           <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-sm shadow-xl text-center max-w-sm">
             <MapPin size={48} className="mx-auto text-primary mb-4" />
             <h3 className="text-xl font-bold mb-2">Sneha Furniture</h3>
             <p className="text-gray-600 mb-4">Located in the heart of Dehradun, easily accessible from Saharanpur Road.</p>
             <a 
               href="https://maps.app.goo.gl/FFm6prxW6b9yJtcKA" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block bg-primary text-white px-6 py-2 rounded-sm hover:bg-primary/90 transition"
             >
               Open in Google Maps
             </a>
           </div>
        </div>
      </div>
    </div>
  );
}

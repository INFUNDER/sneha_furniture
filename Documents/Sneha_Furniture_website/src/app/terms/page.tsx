export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">1. Introduction</h2>
        <p>These terms and conditions outline the rules and regulations for the use of Sneha Furniture's Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use Sneha Furniture if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h2 className="text-2xl font-bold text-black mt-8">2. Products and Services</h2>
        <p>All products listed on the website are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">3. Payments</h2>
        <p>We use Razorpay as our secure payment gateway. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>

        <h2 className="text-2xl font-bold text-black mt-8">4. Liability</h2>
        <p>In no event shall Sneha Furniture, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Sneha Furniture, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

        <h2 className="text-2xl font-bold text-black mt-8">5. Governing Law</h2>
        <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
      </div>
    </div>
  );
}

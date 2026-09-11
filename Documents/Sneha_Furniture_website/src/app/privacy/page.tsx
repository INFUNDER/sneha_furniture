export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p><strong>Last updated:</strong> September 2026</p>
        
        <p>
          Welcome to Sneha Furniture. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          This policy is compliant with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
        </p>
        
        <h2 className="text-2xl font-bold text-black mt-8">1. Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
          <li><strong>Financial Data:</strong> includes payment status. We do NOT store your credit/debit card details on our servers. All payments are securely processed by Razorpay.</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8">2. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process and deliver your furniture orders, including managing payments, fees, and charges.</li>
          <li>To communicate with you regarding your order status, delivery schedules, and support queries.</li>
          <li>To improve our website, products, services, marketing, and customer relationships.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8">3. Third-Party Payment Gateway (Razorpay)</h2>
        <p>
          We use Razorpay for processing payments. We/Razorpay do not store your card data on our servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.
          For more insight, you may also want to read terms and conditions of Razorpay on <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://razorpay.com</a>.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8">4. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8">5. Cookies</h2>
        <p>
          Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can set your browser to refuse all or some browser cookies, but this may affect the functionality of our website.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8">6. Contact Us</h2>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
        <div className="bg-gray-50 p-6 rounded-lg mt-4">
          <p><strong>Sneha Furniture</strong></p>
          <p>7, Saharanpur Rd, Patel Nagar</p>
          <p>Dehradun, Uttarakhand 248001</p>
          <p>Email: orders@snehafurniture.in</p>
          <p>Phone: +91 96343 12102</p>
        </div>
      </div>
    </div>
  );
}

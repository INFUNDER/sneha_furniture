export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">1. Introduction</h2>
        <p>Welcome to Sneha Furniture. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">2. Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
          <li><strong>Financial Data:</strong> includes payment card details (processed securely via our payment gateway, Razorpay; we do not store full card details on our servers).</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8">3. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you (processing your orders).</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mt-8">4. Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.</p>

        <h2 className="text-2xl font-bold text-black mt-8">5. Contact Us</h2>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us at our official email address.</p>
      </div>
    </div>
  );
}

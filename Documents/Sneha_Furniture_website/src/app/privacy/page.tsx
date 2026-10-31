import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';
import GrievanceOfficer from '@/components/GrievanceOfficer';
import { BRAND_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${BRAND_NAME} collects, uses and protects your personal data.`,
};


export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" current="/privacy">
        <p><strong>Last updated:</strong> October 2026</p>

        <p>
          {BRAND_NAME} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what personal data we
          collect when you use this website, why we collect it, who we share it with and the rights you have. We process
          personal data in line with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information
          Technology Act, 2000.
        </p>

        <h2>1. Data We Collect</h2>
        <ul>
          <li><strong>Account data:</strong> your name, email address and a securely hashed password when you create an account.</li>
          <li><strong>Order data:</strong> delivery name, address, phone number, the products you order, amounts and payment status.</li>
          <li><strong>Messages:</strong> your name, email, optional phone number and message when you use our contact form.</li>
          <li><strong>Reviews and wishlist:</strong> reviews you write and products you save.</li>
          <li><strong>Usage data (only with your consent):</strong> pages visited and device information collected by Google Analytics.</li>
        </ul>
        <p>We do not collect or store your card, UPI or bank details. Online payments, when available, are handled entirely by Razorpay.</p>

        <h2>2. Why We Use Your Data</h2>
        <ul>
          <li>To create and manage your account and keep you signed in.</li>
          <li>To process, deliver and support your orders, including order confirmation emails.</li>
          <li>To reply to your enquiries.</li>
          <li>To meet legal obligations such as tax and accounting record keeping.</li>
          <li>With your consent, to understand how the website is used so we can improve it.</li>
        </ul>

        <h2>3. Who We Share It With</h2>
        <p>We do not sell your personal data. We share it only with service providers who process it on our behalf:</p>
        <ul>
          <li><strong>Supabase</strong> (database hosting) and <strong>Render</strong> (website hosting).</li>
          <li><strong>Resend</strong> (sending order and contact emails).</li>
          <li><strong>Cloudinary</strong> (hosting product images; no customer data).</li>
          <li><strong>Razorpay</strong> (online payments, when enabled).</li>
          <li><strong>Google Analytics</strong> (website statistics, only if you accept analytics cookies).</li>
          <li>Delivery partners, who receive your name, address and phone number to deliver your order.</li>
        </ul>
        <p>Some of these providers may store data outside India, with safeguards required under applicable law.</p>

        <h2>4. Cookies</h2>
        <p>
          We use one essential cookie to keep you signed in, and your browser&apos;s local storage to remember your cart and
          cookie choice. Google Analytics cookies are only set if you click &quot;Accept&quot; on the cookie banner. You
          can change your choice at any time using &quot;Cookie Settings&quot; in the website footer.
        </p>

        <h2>5. How Long We Keep It</h2>
        <ul>
          <li>Account data: until you delete your account.</li>
          <li>Order records: for as long as tax and accounting laws require (currently up to 8 years), even if you delete your account. In that case the order is kept without your name or email on the account.</li>
          <li>Contact messages: for as long as needed to answer your enquiry.</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>Under the DPDP Act you can:</p>
        <ul>
          <li>Ask for a summary of the personal data we hold about you.</li>
          <li>Ask us to correct or update inaccurate data.</li>
          <li>Delete your account yourself from your profile page, or ask us to erase your data (subject to the record keeping described above).</li>
          <li>Withdraw consent for analytics at any time using &quot;Cookie Settings&quot;.</li>
          <li>Raise a grievance with us, and if unresolved, with the Data Protection Board of India.</li>
        </ul>
        <p>To use any of these rights, contact the Grievance Officer below.</p>

        <h2>7. Data Security</h2>
        <p>
          Passwords are stored as one-way hashes, sessions use signed secure cookies, and access to customer data is
          limited to staff who need it to fulfil orders. If a data breach affects you, we will inform you and the
          authorities as required by law.
        </p>

        <h2>8. Grievance Officer and Contact</h2>
        <GrievanceOfficer className="card p-6 not-prose space-y-1" />
    </PolicyLayout>
  );
}

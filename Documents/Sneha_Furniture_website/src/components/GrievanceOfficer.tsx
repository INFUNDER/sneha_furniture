import { BRAND_NAME, ADDRESS, GRIEVANCE_OFFICER } from '@/lib/site';

// Details required by the Consumer Protection (E-Commerce) Rules, 2020.
export default function GrievanceOfficer({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      {GRIEVANCE_OFFICER.name && (
        <p className="font-medium">
          {GRIEVANCE_OFFICER.name}
          {GRIEVANCE_OFFICER.designation && `, ${GRIEVANCE_OFFICER.designation}`}
        </p>
      )}
      <p>{BRAND_NAME}</p>
      <p>
        Email: <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="underline">{GRIEVANCE_OFFICER.email}</a>
      </p>
      <p>Phone: {GRIEVANCE_OFFICER.phone}</p>
      <p>{ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.pincode}</p>
      <p>We acknowledge complaints within 48 hours and aim to resolve them within one month.</p>
    </div>
  );
}

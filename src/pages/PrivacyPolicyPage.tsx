import { Shield, Camera, Database, Lock, Users, FileText, Mail, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: FileText,
      content: 'This Privacy Policy explains how our application collects, uses, discloses, and otherwise processes personal information, and the rights and choices individuals have regarding their personal information.'
    },
    {
      id: 'data-collection',
      title: 'Data We Collect',
      icon: Database,
      subsections: [
        {
          subtitle: 'Registration Information',
          content: 'When you create an account, we collect information such as your full name, email address, phone number, residential address, and other details you provide during the registration process. This information is essential for creating and managing your account.'
        },
        {
          subtitle: 'Profile Information',
          content: 'You may voluntarily provide additional profile information including a profile photo, bio, interests, and preferences. Profile photos are uploaded directly by you and stored securely on our servers.'
        },
        {
          subtitle: 'Camera and Media Access',
          content: 'If you choose to use our camera feature to take a profile photo, we request permission to access your device\'s camera. The camera is only used when you explicitly initiate photo capture, and we do not store camera access data or continuously monitor camera activity.'
        },
        {
          subtitle: 'Activity Data',
          content: 'We automatically collect information about your interactions with our application, including pages visited, features used, actions taken, timestamps, and device information.'
        }
      ]
    },
    {
      id: 'camera-policy',
      title: 'Camera and Photo Permissions',
      icon: Camera,
      content: 'Our application requests access to your device\'s camera to enable you to capture and upload profile photos. This permission is:',
      bulletPoints: [
        'Only requested when you actively choose to take a new profile photo',
        'Never used to monitor or record activity without your explicit action',
        'Limited to photo capture functionality only',
        'Revocable through your device settings at any time',
        'Immediately terminated once you close the camera feature or exit the app'
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: Users,
      bulletPoints: [
        'To create, maintain, and manage your user account',
        'To authenticate your identity and provide secure access',
        'To enable you to use all features and services in the application',
        'To communicate with you about account updates, security alerts, and service changes',
        'To provide customer support and respond to inquiries',
        'To improve our application\'s functionality and user experience',
        'To detect and prevent fraudulent activities or unauthorized access',
        'To comply with legal obligations and enforce our terms of service'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: 'We implement comprehensive security measures to protect your personal information:',
      bulletPoints: [
        'All data is transmitted using industry-standard encryption (HTTPS/TLS)',
        'Passwords are hashed and stored securely, never in plain text',
        'Access to personal data is restricted to authorized personnel only',
        'Regular security audits and vulnerability assessments are conducted',
        'We maintain appropriate physical, technical, and administrative safeguards',
        'Data is stored on secure servers with restricted access'
      ]
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      icon: Users,
      content: 'We do not sell, rent, or trade your personal information. We may share your information only in these circumstances:',
      bulletPoints: [
        'With your explicit consent or at your request',
        'With service providers who assist us in operating our application (under strict confidentiality agreements)',
        'When required by law, court order, or government request',
        'To protect our legal rights, safety, and property',
        'In the event of a merger, acquisition, or sale of assets (you will be notified)'
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Database,
      content: 'We retain your personal information as long as your account is active or as necessary to provide our services. You may request deletion of your account and associated personal data at any time. Some data may be retained for legal compliance, fraud prevention, or account recovery purposes.'
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      bulletPoints: [
        'Access: You can access and review your personal information through your account settings',
        'Correction: You can update or correct your personal information at any time',
        'Deletion: You can request deletion of your account and associated data',
        'Portability: You can request a copy of your data in a portable format',
        'Opt-out: You can adjust notification and communication preferences in your settings',
        'Camera Permission: You can revoke camera permissions through your device settings',
        'Cookie Control: You can control cookies through your browser settings'
      ]
    },
    {
      id: 'third-party',
      title: 'Third-Party Links and Services',
      icon: AlertCircle,
      content: 'Our application may contain links to third-party websites and services. This Privacy Policy does not apply to third-party sites, and we are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any personal information.'
    },
    {
      id: 'children',
      title: 'Children\'s Privacy',
      icon: AlertCircle,
      content: 'Our application is not directed to children under the age of 13 (or the minimum age in your jurisdiction). We do not knowingly collect personal information from children. If we discover we have collected information from a child, we will take steps to delete such information promptly.'
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Privacy Policy',
      icon: FileText,
      content: 'We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes by posting the updated policy within the application and updating the "Last Updated" date. Your continued use of the application following such notification constitutes your acceptance of the updated policy.'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Mail,
      content: 'If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-1">Last Updated: May 2026</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our application.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                • {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-lg shadow-md p-8 scroll-mt-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                )}

                {section.subsections && (
                  <div className="space-y-4 mb-4">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx} className="border-l-4 border-blue-400 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{subsection.subtitle}</h3>
                        <p className="text-gray-700 leading-relaxed">{subsection.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.bulletPoints && (
                  <ul className="space-y-3">
                    {section.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-blue-600 font-bold mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.id === 'contact' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800 font-semibold">Email: privacy@example.com</p>
                    <p className="text-gray-800 font-semibold">Support Team: support@example.com</p>
                    <p className="text-gray-600 mt-2 text-sm">
                      We will respond to privacy requests within 30 days.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mt-8 border border-blue-200">
          <p className="text-gray-700 text-sm leading-relaxed">
            By using our application, you acknowledge that you have read and understood this Privacy Policy. 
            If you do not agree with our privacy practices, please do not use our application. Your continued 
            use of the application constitutes your acceptance of this Privacy Policy and any updates thereto.
          </p>
        </div>
      </div>
    </div>
  );
}

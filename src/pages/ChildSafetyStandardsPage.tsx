import { AlertTriangle, FileText, Flag, Lock, Mail, Shield, Users } from 'lucide-react';

export default function ChildSafetyStandardsPage() {
  const sections = [
    {
      id: 'commitment',
      title: 'Our Commitment',
      icon: Shield,
      content:
        'We are committed to maintaining a safe application environment and strictly prohibit any content, behavior, or activity involving child sexual abuse and exploitation (CSAE).',
    },
    {
      id: 'prohibited-content',
      title: 'Prohibited Content and Behavior',
      icon: AlertTriangle,
      content:
        'The following content and behavior are not allowed on our application:',
      bulletPoints: [
        'Any sexual content involving minors or individuals who appear to be minors',
        'Solicitation, grooming, coercion, or exploitation of children',
        'Requests to share, create, distribute, or access child sexual abuse material',
        'Content that sexualizes, endangers, or exploits children',
        'Attempts to contact minors for sexual or exploitative purposes',
        'Links, media, messages, or profiles that promote or facilitate CSAE',
      ],
    },
    {
      id: 'moderation',
      title: 'Detection, Review, and Enforcement',
      icon: Lock,
      content:
        'We take reports and signs of child safety violations seriously. When we identify potential CSAE content or behavior, we may take immediate action.',
      bulletPoints: [
        'Remove violating content from the application',
        'Suspend or permanently terminate accounts involved in violations',
        'Restrict access to features while an investigation is ongoing',
        'Preserve relevant information when required for safety, legal, or reporting purposes',
        'Cooperate with law enforcement or authorized child safety organizations when legally required',
      ],
    },
    {
      id: 'reporting',
      title: 'User Reporting',
      icon: Flag,
      content:
        'Users should report any suspected CSAE content, behavior, or account activity immediately. Reports are reviewed with priority and handled confidentially where possible.',
      bulletPoints: [
        'Include the account name, content link, screenshot, or other details that help us review the report',
        'Do not download, share, forward, or further distribute suspected CSAE material',
        'If a child is in immediate danger, contact local emergency services or law enforcement first',
      ],
    },
    {
      id: 'compliance',
      title: 'Legal Compliance',
      icon: FileText,
      content:
        'We comply with applicable child safety laws and platform requirements. Where required, confirmed or suspected CSAE may be reported to appropriate authorities or child protection organizations.',
    },
    {
      id: 'privacy',
      title: 'Privacy and Account Safety',
      icon: Users,
      content:
        'We limit access to sensitive user information and use security measures designed to protect users, including minors. We also encourage users and guardians to use privacy settings and report unsafe interactions.',
    },
    {
      id: 'contact',
      title: 'Contact for Child Safety Reports',
      icon: Mail,
      content:
        'For child safety concerns, CSAE reports, or related policy questions, please contact our safety team:',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Child Safety Standards</h1>
              <p className="text-gray-600 mt-1">Last Updated: May 2026</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            These standards explain our policy against child sexual abuse and exploitation (CSAE), how users can report concerns, and how we respond to violations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                - {section.title}
              </a>
            ))}
          </div>
        </div>

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

                <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>

                {section.bulletPoints && (
                  <ul className="space-y-3">
                    {section.bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-blue-600 font-bold mt-1">-</span>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.id === 'contact' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800 font-semibold">Email: safety@example.com</p>
                    <p className="text-gray-800 font-semibold">Support Team: support@example.com</p>
                    <p className="text-gray-600 mt-2 text-sm">
                      We prioritize child safety reports and review them as quickly as possible.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mt-8 border border-blue-200">
          <p className="text-gray-700 text-sm leading-relaxed">
            By using our application, you agree not to upload, share, request, promote, or engage in any content or behavior involving CSAE. Violations may result in account termination and reporting to the appropriate authorities.
          </p>
        </div>
      </div>
    </div>
  );
}

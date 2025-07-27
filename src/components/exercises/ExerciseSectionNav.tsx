'use client';

import { ExerciseSection } from '@/config/exerciseSections';

interface ExerciseSectionNavProps {
  sections: ExerciseSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function ExerciseSectionNav({ 
  sections, 
  activeSection, 
  onSectionChange 
}: ExerciseSectionNavProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
            ${activeSection === section.id 
              ? section.color + ' border-opacity-100 shadow-md' 
              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{section.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {section.title.replace(/^📝\s*/, '')}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {section.description}
          </p>
          <div className="text-xs text-gray-500">
            {section.exercises.length} exercise types
          </div>
        </div>
      ))}
    </div>
  );
}
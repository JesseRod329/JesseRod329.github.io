// Main PRD Creator Component
import React, { useState } from 'react';
import { FileText, Copy, Download, Loader2 } from 'lucide-react';
import { useGeminiAPI } from '../../hooks/useGeminiAPI';
import { useI18n } from '../../hooks/useI18n';
import { useClipboard } from '../../hooks/useClipboard';
import { renderMarkdown } from '../../utils/markdown';
import { createSampleExamples } from '../../utils/sampleExamples';
import { PRDFormData } from '../../types/prd';

/**
 * Main PRD Creator Component
 * Features glassmorphism UI, internationalization, and Gemini AI integration
 */
const PRDCreator: React.FC = () => {
  const [formData, setFormData] = useState<PRDFormData>({
    question1: '',
    question2: '',
    question3: ''
  });
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  // Custom hooks
  const { t, locale } = useI18n();
  const { generatePRD, loading, error, generatedContent } = useGeminiAPI();
  const { copyToClipboard, downloadAsMarkdown } = useClipboard();

  // Sample examples
  const sampleExamples = createSampleExamples(t);

  /**
   * Handle example click - cycle through sample examples
   */
  const handleExampleClick = (): void => {
    const nextIndex = (currentExampleIndex + 1) % sampleExamples.length;
    setCurrentExampleIndex(nextIndex);
    setFormData(sampleExamples[nextIndex].data);
  };

  /**
   * Handle input change with proper typing
   */
  const handleInputChange = (field: keyof PRDFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Generate PRD using Gemini API
   */
  const handleGeneratePRD = async (): Promise<void> => {
    const prompt = `Create a professional one-pager PRD based on these inputs:

1. Product/Feature: ${formData.question1}
2. Target Users & Problem: ${formData.question2}
3. Key Functionality & Success Metrics: ${formData.question3}

Please respond in ${locale} language.

Please format the PRD exactly following this template using proper markdown headers:

# One-pager: [NAME]

## 1. TL;DR
A short summary—what is this, who's it for, and why does it matter?

## 2. Goals
### Business Goals
* [List business goals]

### User Goals
* [List user goals]

### Non-Goals
* [List non-goals]

## 3. User stories
Personas and their jobs-to-be-done.

## 4. Functional requirements
Grouped features by priority.

## 5. User experience
* Bullet-pointed user journeys
* Edge cases and UI notes

## 6. Narrative
A day-in-the-life (Make it sing.)

## 7. Success metrics
* [List key metrics]

## 8. Milestones & sequencing
Lean roadmap, small team (keep it scrappy!), phases.

Make it professional yet approachable. Be specific and actionable. Use proper markdown formatting with # for main title, ## for main sections, and ### for subsections.`;

    await generatePRD(prompt);
  };

  /**
   * Handle copy to clipboard
   */
  const handleCopyToClipboard = async (): Promise<void> => {
    await copyToClipboard(generatedContent);
  };

  /**
   * Handle download as markdown
   */
  const handleDownloadPRD = (): void => {
    downloadAsMarkdown(generatedContent, 'prd.md');
  };

  /**
   * Check if form is valid for submission
   */
  const isFormValid = formData.question1.trim() && formData.question2.trim() && formData.question3.trim();

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex overflow-hidden relative">
      {/* Glassmorphism background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Input Section */}
      <div className="w-1/2 p-8 overflow-y-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pageTitle')}</h1>
          <p className="text-gray-700">{t('pageSubtitle')}</p>
        </div>


        {/* Input Form with glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{t('threeQuestions')}</h2>
              <button
                onClick={handleExampleClick}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-white/60 hover:bg-white/80 text-gray-700 rounded-full transition-all backdrop-blur-sm border border-white/40 hover:shadow-md"
              >
                <span>{sampleExamples[currentExampleIndex].icon}</span>
                <span>{t('tryExample')} {sampleExamples[currentExampleIndex].name}</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('question1Label')}
              </label>
              <textarea
                value={formData.question1}
                onChange={(e) => handleInputChange('question1', e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                rows={3}
                placeholder={t('question1Placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('question2Label')}
              </label>
              <textarea
                value={formData.question2}
                onChange={(e) => handleInputChange('question2', e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                rows={3}
                placeholder={t('question2Placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('question3Label')}
              </label>
              <textarea
                value={formData.question3}
                onChange={(e) => handleInputChange('question3', e.target.value)}
                className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                rows={3}
                placeholder={t('question3Placeholder')}
              />
            </div>

            <button
              onClick={handleGeneratePRD}
              disabled={loading || !isFormValid}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('generatingButton')}
                </>
              ) : (
                t('generateButton')
              )}
            </button>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Document Section with glassmorphism */}
      <div className="w-1/2 bg-white/90 backdrop-blur-lg border-l border-white/50 flex flex-col relative z-10">
        {/* Document Header - Fixed */}
        {generatedContent && (
          <div className="border-b border-white/50 p-4 flex items-center justify-end bg-white/90 backdrop-blur-sm">
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 rounded-md transition-colors backdrop-blur-sm"
                title={t('copyTooltip')}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownloadPRD}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50/80 rounded-md transition-colors backdrop-blur-sm"
                title={t('downloadTooltip')}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Document Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {generatedContent ? (
              <div 
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedContent) }}
              />
            ) : (
              <div className="text-gray-500 text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>{t('emptyStateText')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PRDCreator;

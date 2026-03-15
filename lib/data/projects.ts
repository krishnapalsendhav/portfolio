import { FiUsers, FiSmartphone, FiLayout, FiVideo, FiCpu, FiMessageCircle, FiPackage, FiUploadCloud, FiZap, FiShield } from 'react-icons/fi';

export interface ProjectData {
    id: string; // The slug for the dynamic route
    title: string;
    oneLiner: string;
    tags: string[];
    icon: React.ComponentType<{ className?: string }>;
    stats: string;
    highlights: string[];
    // Extended data for details view
    problemStatement?: string;
    solution?: string;
    techStack?: { name: string; category: string }[];
    metrics?: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[];
    links?: { label: string; url: string; icon: React.ElementType }[];
}

export const projects: ProjectData[] = [
    {
        id: 'student-learning-platform',
        title: 'Student Learning Platform',
        oneLiner: 'A large-scale Flutter app used by 50K+ students for learning, live classes, and AI-powered doubt resolution.',
        tags: ['Flutter', 'GetX', 'Firebase', 'WebSockets', 'AI'],
        icon: FiUsers,
        stats: '50K+ Users',
        highlights: [
            '50K+ active users across institutions',
            'Real-time chat, polls, and live classes',
            'Custom DRM for secure content delivery',
            'AI-powered doubt resolution portal',
        ],
        problemStatement: 'Educational institutions needed a unified platform for content delivery, live classes, and student engagement that could scale to tens of thousands of users while maintaining a premium experience.',
        solution: 'Built a comprehensive Flutter application with modular architecture, featuring real-time WebSocket integrations, custom DRM for content protection, and an AI-powered doubt resolution system that reduced teacher workload by 40%.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'GetX', category: 'State Management' },
            { name: 'Firebase', category: 'Backend' },
            { name: 'WebSockets', category: 'Real-time' },
            { name: 'Custom DRM', category: 'Security' },
            { name: 'OpenAI', category: 'AI' },
        ],
        metrics: [
            { label: 'Active Users', value: '50,000+', icon: FiUsers },
            { label: 'Uptime', value: '99.9%', icon: FiZap },
            { label: 'Content Protected', value: '100%', icon: FiShield },
            { label: 'AI Responses', value: '10K+/day', icon: FiCpu },
        ],
    },
    {
        id: 'live-classes-platform',
        title: 'Live Classes Platform',
        oneLiner: 'Real-time live class features with interactive components for enhanced student engagement.',
        tags: ['WebRTC', 'WebSockets', 'Real-time', 'Flutter'],
        icon: FiVideo,
        stats: 'Real-time',
        highlights: [
            'Low-latency video streaming',
            'Interactive polls and Q&A',
            'Real-time chat and file sharing',
            'Screen sharing capability',
        ],
        problemStatement: 'Students needed real-time interaction capabilities during live sessions including chat, polls, and Q&A without latency issues or dropped connections.',
        solution: 'Engineered a low-latency live class system using WebRTC for video streaming and WebSockets for interactive features, achieving sub-200ms response times for all user interactions.',
        techStack: [
            { name: 'WebRTC', category: 'Streaming' },
            { name: 'WebSockets', category: 'Real-time' },
            { name: 'Flutter', category: 'Frontend' },
            { name: 'Firebase RTDB', category: 'Database' },
        ],
        metrics: [
            { label: 'Latency', value: '<200ms', icon: FiZap },
            { label: 'Concurrent Users', value: '1000+', icon: FiUsers },
        ],
    },
    {
        id: 'content-upload-processing-pipeline',
        title: 'Content Upload & Processing Pipeline',
        oneLiner: 'End-to-end video processing pipeline for multi-quality encoding, encryption, and optimized content delivery.',
        tags: ['Video Pipeline', 'Encoding', 'Encryption', 'Cost Optimization'],
        icon: FiUploadCloud,
        stats: '35% Server Cost Reduction',
        highlights: [
            'Automated video transcoding into multiple quality variants',
            'Encrypted media processing for secure content delivery',
            'Optimized upload and storage workflow to reduce server load',
            'Designed, pitched, and implemented as a cost-optimization initiative',
        ],
        problemStatement: 'Video content processing was expensive and slow, with high server costs and inconsistent quality across different video sources.',
        solution: 'Designed and implemented an automated video transcoding pipeline that processes uploads into multiple quality variants with encryption, reducing server costs by 35% while improving content delivery speed.',
        techStack: [
            { name: 'FFmpeg', category: 'Processing' },
            { name: 'Cloud Functions', category: 'Serverless' },
            { name: 'Cloud Storage', category: 'Storage' },
            { name: 'Custom Encryption', category: 'Security' },
        ],
        metrics: [
            { label: 'Cost Reduction', value: '35%', icon: FiZap },
            { label: 'Processing Speed', value: '3x Faster', icon: FiCpu },
        ],
    },
    {
        id: 'classio-management-app',
        title: 'ClassIO Management App',
        oneLiner: 'A powerful management tool for educational institutes with AI-powered features for streamlined operations.',
        tags: ['Flutter', 'AI Assistant', 'REST API', 'Windows'],
        icon: FiSmartphone,
        stats: 'AI-Enhanced',
        highlights: [
            'AI-powered doubt portal for smart replies',
            'Automated reply suggestions for teachers',
            'Real-time analytics dashboard',
            'Multi-institute support',
        ],
        problemStatement: 'Teachers and administrators needed a powerful tool to manage content, respond to student queries, and track engagement without context switching between multiple platforms.',
        solution: 'Built a cross-platform management app with AI-powered smart replies, real-time analytics, and streamlined content management workflows that increased teacher response rates by 60%.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'REST API', category: 'Backend' },
            { name: 'OpenAI', category: 'AI' },
            { name: 'Windows', category: 'Platform' },
        ],
        metrics: [
            { label: 'Response Rate', value: '+60%', icon: FiZap },
            { label: 'AI Accuracy', value: '92%', icon: FiCpu },
        ],
    },
    {
        id: 'app-builder-feature',
        title: 'App Builder Feature',
        oneLiner: 'Innovative feature allowing institutes to customize app layouts directly from management interface.',
        tags: ['Flutter', 'Dynamic UI', 'JSON Config'],
        icon: FiLayout,
        stats: 'Platform Feature',
        highlights: [
            'Drag-and-drop layout customization',
            'Real-time preview of changes',
            'Theme and branding controls',
            'No-code app configuration',
        ],
        problemStatement: 'Different institutions wanted unique app layouts and branding but building custom apps for each was not scalable.',
        solution: 'Created a no-code app builder that allows institutes to customize layouts, themes, and features directly from the management interface with real-time preview capabilities.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'JSON Config', category: 'Architecture' },
            { name: 'Dynamic UI', category: 'Rendering' },
        ],
        metrics: [
            { label: 'Customization Time', value: '10 min', icon: FiZap },
            { label: 'Institutes Using', value: '15+', icon: FiUsers },
        ],
    },
    {
        id: 'video-to-quiz-ai-pipeline',
        title: 'Video to Quiz AI Pipeline',
        oneLiner: 'End-to-end AI pipeline that automatically generates quizzes from video content for student assessment.',
        tags: ['AI/ML', 'Pipeline', 'RAG', 'On-Device AI'],
        icon: FiCpu,
        stats: 'AI-Powered',
        highlights: [
            'Automated quiz generation from videos',
            'On-device AI for privacy',
            'Intelligent question extraction',
            'Multiple question formats',
        ],
        problemStatement: 'Creating quizzes from video content was time-consuming and required manual review of hours of content.',
        solution: 'Developed an end-to-end AI pipeline that automatically extracts key concepts from video content and generates contextually relevant quiz questions, reducing quiz creation time from hours to minutes.',
        techStack: [
            { name: 'Python', category: 'Backend' },
            { name: 'LangChain', category: 'AI Framework' },
            { name: 'RAG', category: 'AI Architecture' },
            { name: 'On-Device AI', category: 'Edge Computing' },
        ],
        metrics: [
            { label: 'Time Saved', value: '95%', icon: FiZap },
            { label: 'Question Accuracy', value: '88%', icon: FiCpu },
        ],
    },
    {
        id: 'ai-agentic-chatbot',
        title: 'AI Agentic Chatbot',
        oneLiner: 'AI-powered agentic chatbot capable of autonomous task execution and intelligent conversation handling.',
        tags: ['AI/ML', 'LLM', 'Agents', 'Tool Calling'],
        icon: FiMessageCircle,
        stats: 'In Progress',
        highlights: [
            'Autonomous task execution',
            'Context-aware conversations',
            'ClassIO ecosystem integration',
            'Multi-modal interactions',
        ],
        problemStatement: 'Users needed intelligent assistance that could understand context, execute tasks autonomously, and integrate seamlessly with the existing ecosystem.',
        solution: 'Building an agentic AI chatbot with tool-calling capabilities, context-aware conversations, and deep integration with the ClassIO platform for autonomous task execution.',
        techStack: [
            { name: 'LLM', category: 'AI' },
            { name: 'Tool Calling', category: 'Agents' },
            { name: 'Flutter', category: 'Frontend' },
            { name: 'WebSockets', category: 'Real-time' },
        ],
        metrics: [
            { label: 'Status', value: 'In Progress', icon: FiCpu },
        ],
    },
    {
        id: 'flutter-package-engineering',
        title: 'Flutter Package Engineering',
        oneLiner: 'Development and extension of Flutter packages for platform-level capabilities and system integrations.',
        tags: ['Flutter Packages', 'Platform Channels', 'Open Source', 'System Integration'],
        icon: FiPackage,
        stats: 'Multiple Packages',
        highlights: [
            'Developed and maintained Flutter packages published on pub.dev and GitHub',
            'Implemented platform-channel integrations for device and system-level access',
            'Extended and modified open-source libraries to meet production requirements',
            'Focused on stability, performance, and developer experience at package level',
        ],
        problemStatement: 'Production apps required platform-level capabilities not available in existing packages, and open-source solutions needed modifications for enterprise use.',
        solution: 'Developed and maintained Flutter packages for system-level access, modified open-source libraries for production requirements, and created reusable components with focus on performance and developer experience.',
        techStack: [
            { name: 'Flutter', category: 'Framework' },
            { name: 'Platform Channels', category: 'Native' },
            { name: 'Dart', category: 'Language' },
            { name: 'pub.dev', category: 'Distribution' },
        ],
        metrics: [
            { label: 'Packages', value: 'Multiple', icon: FiCpu },
        ],
    },
];

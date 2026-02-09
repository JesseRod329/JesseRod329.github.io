import React, { useState, useEffect } from 'react';
import { GitCommit, Github, ExternalLink, Activity } from 'lucide-react';

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: {
      message: string;
      sha: string;
    }[];
  };
  created_at: string;
}

const GithubPulse: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubActivity = async () => {
      try {
        const response = await fetch('https://api.github.com/users/JesseRod329/events/public');
        const data = await response.json();
        
        // Filter for PushEvents which contain commits
        const pushEvents = data
          .filter((event: any) => event.type === 'PushEvent')
          .slice(0, 5); // Take latest 5
          
        setEvents(pushEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        setLoading(false);
      }
    };

    fetchGithubActivity();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border-white/5 relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute top-0 right-0 p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-neon-green rounded-full animate-ping opacity-20" />
          <div className="w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_#0aff68]" />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <Github className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">GitHub Activity Pulse</h3>
          <p className="text-xs text-gray-400">Live development stream</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {events.length > 0 ? events.map((event) => (
            <div key={event.id} className="group relative pl-6 border-l border-white/10 hover:border-neon-blue transition-colors pb-4 last:pb-0">
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-white/20 group-hover:bg-neon-blue transition-colors" />
              
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-mono text-neon-blue">
                  {event.repo.name.replace('JesseRod329/', '')}
                </p>
                <span className="text-[10px] text-gray-500 font-mono">
                  {formatDate(event.created_at)}
                </span>
              </div>
              
              <div className="flex items-start gap-2">
                <GitCommit className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-300 line-clamp-1 italic">
                  {event.payload.commits?.[0]?.message || 'Pushed updates'}
                </p>
              </div>

              <a 
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-end pr-4 transition-opacity bg-gradient-to-l from-dark-800 to-transparent pointer-events-none"
              >
                <ExternalLink className="w-4 h-4 text-white pointer-events-auto" />
              </a>
            </div>
          )) : (
            <p className="text-sm text-gray-500 text-center py-4 italic">No recent push events found.</p>
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>SYNCED_WITH_CLOUD</span>
          </div>
          <span className="text-neon-green">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default GithubPulse;

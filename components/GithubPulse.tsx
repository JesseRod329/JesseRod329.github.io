import React, { useState, useEffect } from 'react';
import { GitCommit, Github, Activity } from 'lucide-react';

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: { commits?: { message: string; sha: string }[] };
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
        const pushEvents = data.filter((event: any) => event.type === 'PushEvent').slice(0, 5);
        setEvents(pushEvents);
      } catch (error) {
        console.error('Error fetching GitHub activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGithubActivity();
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="panel p-6 md:p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8 border-b border-bone/10 pb-5">
        <div className="p-2 bg-bone/5 rounded-sm">
          <Github className="w-5 h-5 text-bone" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-bone">Commit Pulse</h3>
          <p className="font-mono text-[11px] text-bone-mute mt-0.5">live development stream</p>
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-40" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-live" />
        </span>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse flex-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-bone/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-5 flex-1">
          {events.length > 0 ? (
            events.map(event => (
              <a
                key={event.id}
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block pl-5 border-l border-bone/15 hover:border-signal transition-colors"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-mono text-xs text-signal/90 truncate pr-3">
                    {event.repo.name.replace('JesseRod329/', '')}
                  </p>
                  <span className="font-mono text-[10px] text-bone-mute shrink-0">{formatDate(event.created_at)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <GitCommit className="w-3 h-3 text-bone-mute mt-1 shrink-0" />
                  <p className="text-sm text-bone-dim line-clamp-1 group-hover:text-bone transition-colors">
                    {event.payload.commits?.[0]?.message || 'Pushed updates'}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <p className="font-mono text-xs text-bone-mute text-center py-6">no recent push events</p>
          )}
        </div>
      )}

      <div className="mt-8 pt-5 border-t border-bone/10 flex items-center justify-between font-mono text-[10px] text-bone-mute uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <Activity className="w-3 h-3" /> synced_with_cloud
        </span>
        <span className="text-live">active</span>
      </div>
    </div>
  );
};

export default GithubPulse;

"use client"

import * as React from "react"
import { useVoiceSystemStore } from "./RealtimeVoice"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"

interface VoiceButtonProps {
  apiKey: string
  className?: string
}

export function VoiceButton({ apiKey, className }: VoiceButtonProps) {
  const { status, error, initialize, startListening, stopListening } = useVoiceSystemStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized && apiKey) {
      initialize(apiKey).then(() => {
        setIsInitialized(true);
      });
    }
  }, [apiKey, initialize, isInitialized]);

  const handleClick = React.useCallback(() => {
    if (status === 'inactive') {
      startListening();
    } else if (status === 'listening') {
      stopListening();
    }
  }, [status, startListening, stopListening]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
      case 'speaking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'listening':
        return <Mic className="h-4 w-4 text-red-500" />;
      default:
        return <MicOff className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      case 'listening':
        return 'Listening...';
      default:
        return 'Start Voice';
    }
  };

  if (error) {
    return (
      <Button variant="destructive" className={className} disabled>
        {error}
      </Button>
    );
  }

  return (
    <Button
      variant={status === 'listening' ? 'destructive' : 'secondary'}
      className={className}
      onClick={handleClick}
      disabled={!isInitialized || status === 'processing' || status === 'speaking'}
    >
      {getIcon()}
      <span className="ml-2">{getLabel()}</span>
    </Button>
  );
}

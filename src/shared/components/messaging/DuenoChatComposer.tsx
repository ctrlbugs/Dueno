import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { MessageAttachment } from "../../services/messageStore";

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

const QUICK_EMOJIS = [
  "😀",
  "😊",
  "👍",
  "🙏",
  "❤️",
  "🏠",
  "🔑",
  "✅",
  "📎",
  "😂",
  "🎉",
  "📍",
];

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

type DuenoChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (attachments?: MessageAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
};

const DuenoChatComposer = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Enter your message",
}: DuenoChatComposerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>(
    [],
  );
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  const canSend =
    !disabled && (value.trim().length > 0 || pendingAttachments.length > 0);

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(pendingAttachments.length ? pendingAttachments : undefined);
    setPendingAttachments([]);
    setShowEmoji(false);
    setError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        onSend(pendingAttachments.length ? pendingAttachments : undefined);
        setPendingAttachments([]);
        setShowEmoji(false);
      }
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError("Attachments must be 2 MB or smaller.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const type: MessageAttachment["type"] = file.type.startsWith("image/")
        ? "image"
        : "file";

      setPendingAttachments((current) => [
        ...current,
        {
          id: `att-${crypto.randomUUID()}`,
          type,
          name: file.name,
          dataUrl,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        },
      ]);
    } catch {
      setError("Could not attach file.");
    }
  };

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Voice notes are not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      voiceChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        stopRecordingTimer();
        setRecording(false);

        const blob = new Blob(voiceChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size === 0) return;
        if (blob.size > MAX_ATTACHMENT_BYTES) {
          setError("Voice note must be 2 MB or smaller.");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setPendingAttachments((current) => [
            ...current,
            {
              id: `att-${crypto.randomUUID()}`,
              type: "voice",
              name: `voice-${Date.now()}.webm`,
              dataUrl: String(reader.result),
              mimeType: blob.type,
              sizeBytes: blob.size,
              durationSeconds: recordingSeconds,
            },
          ]);
          setRecordingSeconds(0);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch {
      setError("Microphone access was denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="dueno-chat-composer">
      {pendingAttachments.length > 0 ? (
        <div className="dueno-chat-composer__attachments">
          {pendingAttachments.map((attachment) => (
            <span key={attachment.id} className="dueno-chat-composer__attachment">
              {attachment.type === "image" ? (
                <img src={attachment.dataUrl} alt={attachment.name} />
              ) : (
                <span className="dueno-chat-composer__attachment-label">
                  {attachment.type === "voice" ? "Voice note" : attachment.name}
                </span>
              )}
              <button
                type="button"
                className="dueno-chat-composer__attachment-remove"
                aria-label="Remove attachment"
                onClick={() => removeAttachment(attachment.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {error ? <p className="dueno-chat-composer__error">{error}</p> : null}

      {recording ? (
        <div className="dueno-chat-composer__recording">
          <span className="dueno-chat-composer__recording-dot" aria-hidden="true" />
          Recording {recordingSeconds}s
          <button type="button" className="btn btn-sm btn-danger ms-auto" onClick={stopRecording}>
            Stop
          </button>
        </div>
      ) : null}

      <form className="dueno-chat-composer__form" onSubmit={handleSubmit}>
        <div className="dueno-chat-composer__tools">
          <button
            type="button"
            className="dueno-chat-composer__tool"
            aria-label="Add emoji"
            onClick={() => setShowEmoji((open) => !open)}
            disabled={disabled}
          >
            <i className="material-icons-outlined">sentiment_satisfied_alt</i>
          </button>
          <button
            type="button"
            className="dueno-chat-composer__tool"
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <i className="material-icons-outlined">attach_file</i>
          </button>
          <button
            type="button"
            className="dueno-chat-composer__tool"
            aria-label="Record voice note"
            onClick={startRecording}
            disabled={disabled || recording}
          >
            <i className="material-icons-outlined">mic</i>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        {showEmoji ? (
          <div className="dueno-chat-composer__emoji-panel">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="dueno-chat-composer__emoji"
                onClick={() => onChange(`${value}${emoji}`)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}

        <div className="dueno-chat-composer__input-row">
          <input
            type="text"
            className="form-control dueno-chat-composer__input"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="btn btn-primary dueno-chat-composer__send"
            disabled={!canSend}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default DuenoChatComposer;

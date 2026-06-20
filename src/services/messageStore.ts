export type MessageParticipantRole = "buyer" | "agent" | "admin";

export type MessageAttachmentType = "image" | "file" | "voice";

export type MessageAttachment = {
  id: string;
  type: MessageAttachmentType;
  name: string;
  dataUrl: string;
  mimeType: string;
  sizeBytes?: number;
  durationSeconds?: number;
};

export type ConversationMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: MessageParticipantRole;
  body: string;
  attachments?: MessageAttachment[];
  createdAt: string;
};

export type Conversation = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  agentId: string;
  agentName: string;
  subject: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  unreadForAgent: boolean;
  unreadForAdmin: boolean;
  unreadForBuyer: boolean;
  archived?: boolean;
};

const STORAGE_KEY = "_DUENO_CONVERSATIONS";

const readConversations = (): Conversation[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
};

const writeConversations = (conversations: Conversation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  window.dispatchEvent(new CustomEvent("dueno-messages-updated"));
};

export const subscribeMessages = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("dueno-messages-updated", handler);
  return () => window.removeEventListener("dueno-messages-updated", handler);
};

export const getConversations = () => readConversations();

export const getConversationById = (id: string) =>
  readConversations().find((conversation) => conversation.id === id);

export const getConversationsForAgent = (agentId: string, includeArchived = false) =>
  readConversations().filter(
    (conversation) =>
      conversation.agentId === agentId &&
      (includeArchived || !conversation.archived),
  );

export const getConversationsForAdmin = (includeArchived = false) =>
  readConversations().filter(
    (conversation) => includeArchived || !conversation.archived,
  );

export const getConversationsForBuyer = (buyerId: string) =>
  readConversations().filter((conversation) => conversation.buyerId === buyerId);

export const getUnreadCountForAgent = (agentId: string) =>
  getConversationsForAgent(agentId).filter((c) => c.unreadForAgent).length;

export const getUnreadCountForAdmin = () =>
  getConversationsForAdmin().filter((c) => c.unreadForAdmin).length;

export const getUnreadCountForBuyer = (buyerId: string) =>
  getConversationsForBuyer(buyerId).filter((c) => c.unreadForBuyer).length;

export const getRecentConversationsForBuyer = (buyerId: string, limit = 5) =>
  getConversationsForBuyer(buyerId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);

export const getRecentConversationsForAgent = (agentId: string, limit = 5) =>
  getConversationsForAgent(agentId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);

export const getRecentConversationsForAdmin = (limit = 5) =>
  getConversationsForAdmin()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);

export const markAllConversationsReadForBuyer = (buyerId: string) => {
  const conversations = readConversations();
  let changed = false;
  conversations.forEach((conversation) => {
    if (conversation.buyerId === buyerId && conversation.unreadForBuyer) {
      conversation.unreadForBuyer = false;
      changed = true;
    }
  });
  if (changed) writeConversations(conversations);
};

export const markAllConversationsReadForAgent = (agentId: string) => {
  const conversations = readConversations();
  let changed = false;
  conversations.forEach((conversation) => {
    if (conversation.agentId === agentId && conversation.unreadForAgent) {
      conversation.unreadForAgent = false;
      changed = true;
    }
  });
  if (changed) writeConversations(conversations);
};

export const markAllConversationsReadForAdmin = () => {
  const conversations = readConversations();
  let changed = false;
  conversations.forEach((conversation) => {
    if (conversation.unreadForAdmin) {
      conversation.unreadForAdmin = false;
      changed = true;
    }
  });
  if (changed) writeConversations(conversations);
};

export const createEnquiry = (input: {
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  subject: string;
  message: string;
}) => {
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id: `conv-${crypto.randomUUID()}`,
    propertyId: input.propertyId,
    propertyTitle: input.propertyTitle,
    buyerId: input.buyerId,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    agentId: input.agentId,
    agentName: input.agentName,
    subject: input.subject,
    createdAt: now,
    updatedAt: now,
    unreadForAgent: true,
    unreadForAdmin: true,
    unreadForBuyer: false,
    archived: false,
    messages: [
      {
        id: `msg-${crypto.randomUUID()}`,
        senderId: input.buyerId,
        senderName: input.buyerName,
        senderRole: "buyer",
        body: input.message,
        createdAt: now,
      },
    ],
  };
  writeConversations([conversation, ...readConversations()]);
  return conversation;
};

export const replyToConversation = (input: {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: MessageParticipantRole;
  body: string;
  attachments?: MessageAttachment[];
}) => {
  const trimmedBody = input.body.trim();
  const attachments = input.attachments?.length ? input.attachments : undefined;
  if (!trimmedBody && !attachments) return undefined;

  const conversations = readConversations();
  const index = conversations.findIndex((c) => c.id === input.conversationId);
  if (index === -1) return undefined;

  const conversation = conversations[index];
  const message: ConversationMessage = {
    id: `msg-${crypto.randomUUID()}`,
    senderId: input.senderId,
    senderName: input.senderName,
    senderRole: input.senderRole,
    body: trimmedBody,
    attachments,
    createdAt: new Date().toISOString(),
  };

  conversation.messages.push(message);
  conversation.updatedAt = message.createdAt;
  conversation.archived = false;
  conversation.unreadForAgent = input.senderRole !== "agent";
  conversation.unreadForAdmin = input.senderRole !== "admin";
  conversation.unreadForBuyer = input.senderRole !== "buyer";

  conversations[index] = conversation;
  writeConversations(conversations);
  return conversation;
};

export const markConversationRead = (
  conversationId: string,
  role: MessageParticipantRole,
) => {
  const conversations = readConversations();
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index === -1) return;
  if (role === "agent") conversations[index].unreadForAgent = false;
  if (role === "admin") conversations[index].unreadForAdmin = false;
  if (role === "buyer") conversations[index].unreadForBuyer = false;
  writeConversations(conversations);
};

export const archiveConversation = (conversationId: string, archived = true) => {
  const conversations = readConversations();
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index === -1) return undefined;
  conversations[index].archived = archived;
  writeConversations(conversations);
  return conversations[index];
};

export const deleteConversation = (conversationId: string) => {
  const conversations = readConversations();
  const next = conversations.filter((c) => c.id !== conversationId);
  if (next.length === conversations.length) return false;
  writeConversations(next);
  return true;
};

export const reassignConversation = (
  conversationId: string,
  agentId: string,
  agentName: string,
) => {
  const conversations = readConversations();
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index === -1) return undefined;
  conversations[index].agentId = agentId;
  conversations[index].agentName = agentName;
  conversations[index].unreadForAgent = true;
  writeConversations(conversations);
  return conversations[index];
};

export const getConversationPreview = (conversation: Conversation) => {
  const latest = conversation.messages[conversation.messages.length - 1];
  if (!latest) return conversation.subject;
  if (latest.body.trim()) return latest.body.trim();
  const attachment = latest.attachments?.[0];
  if (!attachment) return conversation.subject;
  if (attachment.type === "voice") return "Voice message";
  if (attachment.type === "image") return "Photo attachment";
  return attachment.name;
};

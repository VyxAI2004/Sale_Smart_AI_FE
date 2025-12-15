import { useEffect, useRef, useState, useCallback } from 'react';
import { useAutoDiscovery } from '../hooks/use-auto-discovery';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AutoDiscoveryStreamProps {
  projectId: string;
  onComplete?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  data?: any;
}

/**
 * Typing effect hook - Production ready
 * Hiển thị text từng ký tự một như ChatGPT/Gemini
 */
function useTypingEffect(text: string, speed: number = 30, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textKeyRef = useRef(0);

  useEffect(() => {
    // Clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!enabled || !text) {
      setDisplayedText(text || '');
      setIsTyping(false);
      return;
    }

    // Tăng key để force reset khi text thay đổi
    textKeyRef.current++;
    const currentKey = textKeyRef.current;
    
    // Reset và bắt đầu typing
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    intervalRef.current = setInterval(() => {
      // Check nếu text đã thay đổi (key khác)
      if (currentKey !== textKeyRef.current) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}

/**
 * Chat Message Bubble Component
 * Hiển thị message với typing effect cho AI messages
 */
function ChatMessageBubble({ 
  message, 
  isActiveStreaming 
}: { 
  message: ChatMessage; 
  isActiveStreaming: boolean;
}) {
  // Chỉ typing effect cho AI messages đang được stream
  const shouldAnimate = isActiveStreaming && message.type === 'ai';
  
  const { displayedText, isTyping } = useTypingEffect(
    message.content,
    30, // 30ms/ký tự - tốc độ vừa phải
    shouldAnimate
  );

  const finalText = shouldAnimate && isTyping ? displayedText : message.content;
  const showCursor = shouldAnimate && isTyping;

  return (
    <div
      className={cn(
        'flex w-full',
        message.type === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 break-words shadow-sm',
          message.type === 'user'
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : message.type === 'system'
            ? 'bg-destructive/10 text-destructive rounded-bl-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {finalText}
          {showCursor && (
            <span className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </div>
        {message.data && message.type === 'ai' && (
          <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-80">
            {message.data.user_query && (
              <div>Từ khóa: {message.data.user_query}</div>
            )}
            {message.data.max_products && (
              <div>Số lượng: {message.data.max_products} sản phẩm</div>
            )}
            {message.data.criteria && (
              <div className="mt-1">
                <div>Tiêu chí:</div>
                <pre className="mt-1 text-xs opacity-70">
                  {JSON.stringify(message.data.criteria, null, 2)}
                </pre>
              </div>
            )}
            {message.data.total_crawled !== undefined && (
              <div>Đã crawl: {message.data.total_crawled} sản phẩm</div>
            )}
            {message.data.passed !== undefined && (
              <div>
                Kết quả lọc: {message.data.passed}/{message.data.total} sản phẩm
              </div>
            )}
            {message.data.analysis && (
              <div className="mt-2">
                <div className="font-medium mb-1">Phân tích:</div>
                <div className="opacity-80 whitespace-pre-wrap">
                  {message.data.analysis}
                </div>
              </div>
            )}
            {message.data.imported !== undefined && (
              <div>Đã lưu: {message.data.imported} sản phẩm</div>
            )}
            {message.data.product_ids && (
              <div className="mt-1">
                <div>Product IDs:</div>
                <div className="opacity-70 font-mono text-xs">
                  {message.data.product_ids.join(', ')}
                </div>
              </div>
            )}
            {message.data.passed_products && message.data.passed_products.length > 0 && (
              <div className="mt-3 pt-2 border-t border-current/20">
                <div className="font-medium mb-2 text-green-600 dark:text-green-400">
                  Sản phẩm đạt yêu cầu ({message.data.passed_products.length}):
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {message.data.passed_products.map((product: any, idx: number) => (
                    <div key={idx} className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-xs border border-green-200 dark:border-green-800">
                      <div className="font-medium truncate text-green-900 dark:text-green-100">{product.product_name}</div>
                      <div className="mt-1 text-muted-foreground">
                        Giá: {product.price?.toLocaleString('vi-VN')} VND | 
                        Rating: {product.rating ?? 'N/A'} | 
                        Reviews: {product.review_count ?? 'N/A'} | 
                        Platform: {product.platform}
                        {product.is_mall && <span className="ml-1 text-primary">[Mall]</span>}
                        {product.brand && <span className="ml-1">| Brand: {product.brand}</span>}
                      </div>
                      <div className="mt-1 text-green-700 dark:text-green-300 text-xs">
                        <span className="font-medium">Lý do được chọn:</span> {product.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {message.data.rejected_products && message.data.rejected_products.length > 0 && (
              <div className="mt-3 pt-2 border-t border-current/20">
                <div className="font-medium mb-2">Sản phẩm bị loại bỏ ({message.data.rejected_products.length}):</div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {message.data.rejected_products.map((product: any, idx: number) => (
                    <div key={idx} className="p-2 bg-background/50 rounded text-xs">
                      <div className="font-medium truncate">{product.product_name}</div>
                      <div className="mt-1 text-muted-foreground">
                        Giá: {product.price?.toLocaleString('vi-VN')} VND | 
                        Rating: {product.rating ?? 'N/A'} | 
                        Reviews: {product.review_count ?? 'N/A'} | 
                        Platform: {product.platform}
                      </div>
                      <div className="mt-1 text-destructive text-xs">
                        <span className="font-medium">Lý do:</span> {product.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {message.data.crawled_products_summary && message.data.crawled_products_summary.length > 0 && (
              <div className="mt-3 pt-2 border-t border-current/20">
                <div className="font-medium mb-2">Danh sách sản phẩm đã crawl ({message.data.crawled_products_summary.length}):</div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {message.data.crawled_products_summary.map((product: any, idx: number) => (
                    <div key={idx} className="p-2 bg-background/50 rounded text-xs">
                      <div className="font-medium truncate">{product.product_name}</div>
                      <div className="mt-1 text-muted-foreground">
                        Giá: {product.price?.toLocaleString('vi-VN')} VND | 
                        Rating: {product.rating ?? 'N/A'} | 
                        Reviews: {product.review_count ?? 'N/A'} | 
                        Sales: {product.sales_count?.toLocaleString('vi-VN') ?? 'N/A'} | 
                        Platform: {product.platform}
                        {product.is_mall && <span className="ml-1 text-primary">[Mall]</span>}
                        {product.brand && <span className="ml-1">| Brand: {product.brand}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Auto Discovery Stream Component
 * Chat interface với typing effect giống ChatGPT/Gemini
 */
export function AutoDiscoveryStream({
  projectId,
  onComplete,
}: AutoDiscoveryStreamProps) {
  const {
    stepStatus,
    aiThinking,
    progress,
    finalResult,
    error,
    isStreaming,
    startDiscovery,
    reset,
  } = useAutoDiscovery(projectId);

  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedEventIdsRef = useRef<Set<string>>(new Set());
  const activeMessageIdRef = useRef<string | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, aiThinking]);

  // Convert stream events to chat messages
  useEffect(() => {
    const newMessages: ChatMessage[] = [];

    // Process step events
    Object.entries(stepStatus).forEach(([stepId, status]) => {
      const stepProgress = progress[stepId];
      const messageId = `step-${stepId}`;

      if (status === 'active') {
        // Tạo message khi step bắt đầu
        if (!processedEventIdsRef.current.has(messageId)) {
          // Tạo message với nội dung mặc định hoặc từ stepProgress
          let content = stepProgress?.message || '';
          
          // Thêm message thông báo đặc biệt cho step crawl (step 4)
          if (stepId === '4' && !content) {
            content = 'Đang tìm kiếm sản phẩm phù hợp, đợi chút nhé...';
          }
          
          if (content) {
            newMessages.push({
              id: messageId,
              type: 'ai',
              content,
              timestamp: new Date(),
              data: stepProgress,
            });
            processedEventIdsRef.current.add(messageId);
            activeMessageIdRef.current = messageId;
          }
        } else if (stepProgress?.message) {
          // Update existing message với nội dung mới
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === messageId);
            if (index >= 0) {
              const updated = [...prev];
              if (stepProgress.message) {
                updated[index] = {
                  ...updated[index],
                  content: stepProgress.message,
                  timestamp: new Date(),
                  data: stepProgress,
                };
              }
              return updated;
            }
            return prev;
          });
        } else if (stepId === '4' && status === 'active') {
          // Đảm bảo step 4 luôn có message khi đang active
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === messageId);
            if (index < 0) {
              // Nếu chưa có message, tạo mới
              return [
                ...prev,
                {
                  id: messageId,
                  type: 'ai',
                  content: 'Đang tìm kiếm sản phẩm phù hợp, đợi chút nhé...',
                  timestamp: new Date(),
                  data: stepProgress,
                },
              ];
            }
            return prev;
          });
          activeMessageIdRef.current = messageId;
        }
      }

      if (status === 'complete' && stepProgress?.message) {
        // Update message khi step hoàn thành
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === messageId);
          if (index >= 0 && stepProgress.message) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              content: stepProgress.message,
              timestamp: new Date(),
              data: stepProgress,
            };
            return updated;
          }
          return prev;
        });
        activeMessageIdRef.current = null;
      }
    });

    // Process AI thinking - update active message hoặc tạo mới
    if (aiThinking) {
      const messageId = activeMessageIdRef.current || 'ai-thinking';
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === messageId);
        if (index >= 0) {
          // Update existing message
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            content: aiThinking,
            timestamp: new Date(),
          };
          return updated;
        } else {
          // Tạo message mới
          return [
            ...prev,
            {
              id: messageId,
              type: 'ai',
              content: aiThinking,
              timestamp: new Date(),
            },
          ];
        }
      });
      activeMessageIdRef.current = messageId;
    }

    // Process final result
    if (finalResult) {
      const messageId = 'final-result';
      if (!processedEventIdsRef.current.has(messageId)) {
        let content = finalResult.message;
        if (finalResult.products_found !== undefined) {
          content += `\n\nTìm thấy: ${finalResult.products_found} sản phẩm`;
          content += `\nĐã lọc: ${finalResult.products_filtered} sản phẩm`;
          content += `\nĐã lưu: ${finalResult.products_imported} sản phẩm`;
        }
        if (finalResult.ai_analysis) {
          content += `\n\nPhân tích của AI:\n${finalResult.ai_analysis}`;
        }

        newMessages.push({
          id: messageId,
          type: 'ai',
          content,
          timestamp: new Date(),
          data: finalResult,
        });
        processedEventIdsRef.current.add(messageId);
        activeMessageIdRef.current = messageId;
      }
    }

    // Process errors
    if (error) {
      const messageId = `error-${Date.now()}`;
      if (!processedEventIdsRef.current.has(messageId)) {
        newMessages.push({
          id: messageId,
          type: 'system',
          content: `Lỗi: ${error}`,
          timestamp: new Date(),
        });
        processedEventIdsRef.current.add(messageId);
      }
    }

    // Add new messages
    if (newMessages.length > 0) {
      setMessages((prev) => [...prev, ...newMessages]);
    }
  }, [stepStatus, progress, aiThinking, finalResult, error]);

  useEffect(() => {
    if (finalResult && onComplete) {
      onComplete();
    }
  }, [finalResult, onComplete]);

  const handleStart = useCallback(() => {
    if (!userQuery.trim()) return;

    // Reset state
    processedEventIdsRef.current.clear();
    activeMessageIdRef.current = null;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userQuery,
      timestamp: new Date(),
    };

    setMessages([userMessage]);
    startDiscovery({ user_input: userQuery });
  }, [userQuery, startDiscovery]);

  const handleReset = useCallback(() => {
    reset();
    setUserQuery('');
    setMessages([]);
    processedEventIdsRef.current.clear();
    activeMessageIdRef.current = null;
  }, [reset]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 && !isStreaming && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Nhập yêu cầu tìm kiếm sản phẩm</p>
              <p className="text-sm">
                Ví dụ: tìm kiếm cho tôi 2 sản phẩm mẫu dựa trên project của tôi,
                yêu cầu là có hơn 100 reviews và trên sàn lazada
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessageBubble
            key={message.id}
            message={message}
            isActiveStreaming={
              isStreaming && activeMessageIdRef.current === message.id
            }
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Textarea
            placeholder="Nhập yêu cầu tìm kiếm sản phẩm..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isStreaming}
            className="min-h-[60px] resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (userQuery.trim() && !isStreaming) {
                  handleStart();
                }
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleStart}
              disabled={isStreaming || !userQuery.trim()}
              size="lg"
              className="h-full"
            >
              {isStreaming ? 'Đang xử lý...' : 'Gửi'}
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={isStreaming}
              >
                Mới
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

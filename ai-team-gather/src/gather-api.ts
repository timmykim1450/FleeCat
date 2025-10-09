import axios from 'axios';

export interface GatherConfig {
  apiKey: string;
  spaceId: string;
}

export class GatherAPI {
  private apiKey: string;
  private spaceId: string;
  private baseURL = 'https://api.gather.town/api/v2'; // ✅ 이 엔드포인트 사용

  constructor(config: GatherConfig) {
    this.apiKey = config.apiKey;
    this.spaceId = config.spaceId;
  }

  // 채팅 메시지 전송
  async sendChatMessage(message: string, targetId?: string): Promise<void> {
    try {
      const endpoint = `${this.baseURL}/spaces/${this.spaceId}/chat`;
      
      await axios.post(
        endpoint,
        {
          message: message,
          ...(targetId && { targetId })
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apiKey': this.apiKey,
          },
        }
      );
      
      console.log('✅ Gather 메시지 전송 성공');
    } catch (error: any) {
      console.error('❌ Gather 메시지 전송 실패:', error.response?.data || error.message);
      throw error;
    }
  }

  // 전체 채팅에 메시지 전송
  async broadcastMessage(message: string): Promise<void> {
    return this.sendChatMessage(message);
  }

  // 긴 메시지를 여러 개로 나눠서 전송
  async sendLongMessage(message: string, maxLength: number = 500): Promise<void> {
    const chunks = this.splitMessage(message, maxLength);
    
    for (const chunk of chunks) {
      await this.sendChatMessage(chunk);
      // 메시지 사이 딜레이
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  // 메시지 분할
  private splitMessage(message: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    const lines = message.split('\n');

    for (const line of lines) {
      if (currentChunk.length + line.length + 1 > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        // 한 줄이 너무 긴 경우
        if (line.length > maxLength) {
          const words = line.split(' ');
          for (const word of words) {
            if (currentChunk.length + word.length + 1 > maxLength) {
              chunks.push(currentChunk.trim());
              currentChunk = word;
            } else {
              currentChunk += (currentChunk ? ' ' : '') + word;
            }
          }
        } else {
          currentChunk = line;
        }
      } else {
        currentChunk += (currentChunk ? '\n' : '') + line;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
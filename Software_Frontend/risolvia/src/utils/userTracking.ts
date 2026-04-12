import { v4 as uuidv4 } from 'uuid';

// Utility to manage persistent user ID and session ID
export class UserTracking {
  private static USER_ID_KEY = 'risolvia_user_id';
  private static SESSION_ID_KEY = 'risolvia_session_id';

  // Get or create persistent user ID (survives browser restarts)  
  static getUserId(): string {
    let userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
    return userId;
  }

  // Get or create session ID (expires when browser tab closes)
  static getSessionId(): string {
    let sessionId = sessionStorage.getItem(this.SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem(this.SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  // Get both IDs as an object
  static getTrackingIds() {
    return {
      user_id: this.getUserId(),
      session_id: this.getSessionId()
    };
  }
}
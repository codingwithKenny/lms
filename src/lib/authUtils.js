import { auth } from "@clerk/nextjs/server";

let cachedUser = null;

export async function getCurrentUser() {
  const { userId, sessionClaims } = await auth();
  if (!cachedUser) {
    cachedUser = {
      userId,
      role: sessionClaims?.metadata?.role || "guest", // Default to 'guest'
      sessionClaims,
    };
  }
  // return cachedUser;
  return {
    userId,
    role: sessionClaims?.metadata?.role || "guest", // Default to 'guest'
    sessionClaims,
  }
}

export async function getUserId() {
  const { userId } = await getCurrentUser();
  return userId;
}

export async function getUserRole() {
  const { role } = await getCurrentUser();
  return role;
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Auth Callback Route Handler
 * Exchanges the auth code from an email verification link for a valid session.
 * Supabase appends `?code=...` to the redirect URL after email confirmation.
 */
/** Validate that a redirect target is a safe relative path (no external redirects). */
function sanitizeRedirectPath(value: string | null): string {
  if (!value) return "/";
  // Must start with "/" and must not start with "//" (protocol-relative) or contain "://"
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = sanitizeRedirectPath(requestUrl.searchParams.get("next"));

  if (code) {
    let response = NextResponse.redirect(new URL(next, request.url));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // If code exchange fails or no code, redirect to login with an error hint
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", request.url)
  );
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
    'https://wrqwbzdwkuipaomufjjq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycXdiemR3a3VpcGFvbXVmampxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzQ0NDYsImV4cCI6MjA5NDExMDQ0Nn0.Q7C3pgSdx-K14hL4sSsLe7jzm0--TMXDGHxnIHGBG8A'
);

export async function sendOTP(email) {
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
    });
    if (error) {
        if (error.message.toLowerCase().includes('not allowed') ||
            error.message.toLowerCase().includes('user not found') ||
            error.message.toLowerCase().includes('signup')) {
            throw new Error("You don't have membership access. Please contact your administrator.");
        }
        throw new Error(error.message);
    }
}

export async function verifyOTP(email, code) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
    });
    if (error) return { success: false, error: error.message };
    saveSession(data.user.email);
    return { success: true };
}

export function saveSession(email) {
    localStorage.setItem('session_email', email);
}

export function getSession() {
    return localStorage.getItem('session_email');
}

export async function isLoggedIn() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        saveSession(data.session.user.email);
        return true;
    }
    return false;
}

export async function clearSession() {
    localStorage.removeItem('session_email');
    await supabase.auth.signOut();
}

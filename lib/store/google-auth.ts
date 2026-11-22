"use client";
import {supabase} from '@/lib/supabase/client';
import {supabaseUrl,supabasePublishableKey} from '@/lib/supabase/config';
import {GOOGLE_RETURN_KEY,safeStoreReturn} from './oauth-domain';
export async function signInWithGoogle(returnTo:string){
 const response=await fetch(`${supabaseUrl}/auth/v1/settings`,{cache:'no-store',headers:{apikey:supabasePublishableKey},signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('Sign-in is taking a moment. Please try again.');
 const settings=await response.json();if(!settings.external?.google)throw new Error('Google sign-in is not available right now. Please use email to continue.');
 sessionStorage.setItem(GOOGLE_RETURN_KEY,JSON.stringify({path:safeStoreReturn(returnTo),createdAt:Date.now()}));
 const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/store/account',queryParams:{prompt:'select_account'}}});
 if(error){sessionStorage.removeItem(GOOGLE_RETURN_KEY);throw error;}
}
